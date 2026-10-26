"""Validated, lossless configuration editing and legacy YAML import."""
import copy
import hashlib
import json
import os
from pathlib import Path
import tempfile
import threading

import yaml
from libs.brightness import validate_brightness
from firmware import firmware_settings

CARD_TYPES = ["cardEntities", "cardGrid", "cardQR", "cardPower", "cardMedia",
              "cardThermo", "cardAlarm", "cardUnlock"]
MAX_BYTES = 1024 * 1024


class ConfigError(ValueError):
    """A configuration cannot safely be applied."""


class ConflictError(ConfigError):
    """The on-disk configuration changed since it was loaded."""


class UniqueLoader(yaml.SafeLoader):
    """Reject duplicate keys rather than silently losing configuration."""


def _mapping(loader, node, deep=False):
    loader.flatten_mapping(node)
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str):
            raise ConfigError("YAML mapping keys must be strings.")
        if key in result:
            raise ConfigError(f"Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _mapping)


def parse_yaml(text):
    if not isinstance(text, str) or len(text.encode()) > MAX_BYTES:
        raise ConfigError("Configuration must be YAML text smaller than 1 MiB.")
    try:
        data = yaml.load(text, Loader=UniqueLoader)
        # Bound expanded aliases before serialization, including recursive graphs.
        pending = [(data, 0)]
        count = 0
        while pending:
            value, depth = pending.pop()
            count += 1
            if depth > 50 or count > 50000:
                raise ConfigError("YAML is too deeply nested or contains too many aliases.")
            if isinstance(value, dict):
                pending.extend((item, depth + 1) for item in value.values())
            elif isinstance(value, list):
                pending.extend((item, depth + 1) for item in value)
        # Restrict YAML to JSON-compatible data, rejecting dates and non-finite numbers.
        if len(json.dumps(data, allow_nan=False).encode()) > MAX_BYTES:
            raise ConfigError("Expanded YAML exceeds 1 MiB.")
    except (yaml.YAMLError, ValueError, TypeError, RecursionError) as exc:
        raise ConfigError(f"Invalid YAML: {exc}") from exc
    if not isinstance(data, dict):
        raise ConfigError("Configuration must be a YAML mapping.")
    return data


def validate(config):
    if not isinstance(config, dict) or not isinstance(config.get("nspanels"), dict):
        raise ConfigError("Expected a mapping under nspanels.")
    if "use_ha_api" in config and type(config["use_ha_api"]) is not bool:
        raise ConfigError("use_ha_api must be true or false.")
    topics = set()
    for name, panel in config["nspanels"].items():
        if not isinstance(name, str) or not name.strip() or not isinstance(panel, dict):
            raise ConfigError("Each panel needs a name and an object configuration.")
        try:
            firmware_settings(panel)
        except ValueError as exc:
            raise ConfigError(f"{name}: {exc}") from exc
        for field in ("panelRecvTopic", "panelSendTopic"):
            if not isinstance(panel.get(field), str) or not panel[field].strip():
                raise ConfigError(f"{name}.{field} is required.")
        if panel["panelRecvTopic"] in topics:
            raise ConfigError(f"{name}: receive topic is already used by another panel.")
        topics.add(panel["panelRecvTopic"])
        for field in ("locale", "timeFormat", "dateFormat"):
            if not isinstance(panel.get(field, config.get(field) if field == "locale" else None), str):
                raise ConfigError(f"{name}.{field} must be text.")
        if panel.get("model", "eu") not in ("eu", "us-p", "us-l"):
            raise ConfigError(f"{name}.model must be eu, us-p or us-l.")
        if type(panel.get("sleepTimeout", 20)) is not int or panel.get("sleepTimeout", 20) < 0:
            raise ConfigError(f"{name}.sleepTimeout must be a non-negative integer.")
        for field in ("sleepBrightness", "screenBrightness"):
            value = panel.get(field, 20)
            try:
                validate_brightness(value)
            except ValueError as exc:
                raise ConfigError(f"{name}.{field}: {exc}") from exc
        if not isinstance(panel.get("screensaver"), dict):
            raise ConfigError(f"{name}.screensaver must be an object.")
        cards = []
        for field in ("cards", "hiddenCards"):
            items = panel.get(field, config.get(field, []) if field == "hiddenCards" else None)
            if not isinstance(items, list):
                raise ConfigError(f"{name}.{field} must be a list.")
            if field == "cards" and not items:
                raise ConfigError(f"{name}: add at least one card before saving.")
            for card in items:
                if not isinstance(card, dict) or card.get("type") not in CARD_TYPES:
                    raise ConfigError(f"{name}.{field}: unsupported or missing card type.")
                if card["type"] in ("cardMedia", "cardThermo", "cardAlarm") and not card.get("entity"):
                    raise ConfigError(f"{name}.{field}: {card['type']} requires an entity.")
            cards.extend(items)
        for card in cards + [panel["screensaver"]]:
            if "entity" in card and not isinstance(card["entity"], str):
                raise ConfigError(f"{name}: main entity must be a string.")
            if not isinstance(card.get("entities", []), list):
                raise ConfigError(f"{name}: entities must be a list.")
            for entity in card.get("entities", []):
                if not isinstance(entity, dict) or not isinstance(entity.get("entity"), str):
                    raise ConfigError(f"{name}: every entity requires an entity string.")
    return config


def import_yaml(text):
    source = parse_yaml(text)
    warnings = []
    if "nspanels" in source:
        result, kind = source, "add-on"
    else:
        panels = {}
        for name, app in source.items():
            if isinstance(app, dict) and (app.get("module") == "nspanel-lovelace-ui" or
                                         app.get("class") == "NsPanelLovelaceUIManager"):
                if not isinstance(app.get("config"), dict):
                    raise ConfigError(f"{name}.config must be a mapping.")
                panels[name] = copy.deepcopy(app["config"])
            else:
                warnings.append(f"Skipped unrelated AppDaemon entry: {name}")
        if not panels:
            raise ConfigError("Expected add-on nspanels or NSPanel AppDaemon module/class/config entries.")
        result, kind = {"nspanels": panels}, "AppDaemon"
        for name, panel in panels.items():
            for field in ("cards", "hiddenCards"):
                if field in panel and not isinstance(panel[field], list):
                    raise ConfigError(f"{name}.{field} must be a list.")
            for old, new in (("timezone", "timeZone"), ("dateFormatBabel", "dateFormat"),
                             ("featureExperimentalSliders", "featExperimentalSliders")):
                if old in panel:
                    panel[new] = panel.pop(old)
            if type(panel.get("featExperimentalSliders")) is bool:
                panel["featExperimentalSliders"] = int(panel["featExperimentalSliders"])
            if isinstance(panel.get("dateFormat"), str) and "%" in panel["dateFormat"]:
                warnings.append(f"{name}: strftime dateFormat replaced with Babel 'full'.")
                panel["dateFormat"] = "full"
            for key, default in {"locale": "en_US", "timeFormat": "%H:%M", "dateFormat": "full",
                                 "timeZone": "Europe/Berlin", "cards": [], "screensaver": {}}.items():
                panel.setdefault(key, default)
            screen = panel["screensaver"]
            if isinstance(screen, dict):
                if "defaultCard" in screen:
                    panel["defaultCard"] = screen.pop("defaultCard")
                if "entity" in screen and "entities" not in screen:
                    weather = screen.pop("entity")
                    skip = screen.get("forecastSkip", 0)
                    if type(skip) is not int or skip < 0:
                        raise ConfigError(f"{name}: forecastSkip must be a non-negative integer.")
                    screen["entities"] = [{"entity": weather}] + [
                        {"entity": weather, "day": day + skip} for day in range(1, 5)]
                    warnings.append(f"{name}: weather converted to explicit screensaver entities; review forecast layout.")
                if screen.get("alternativeLayout"):
                    screen["type"] = "screensaver2"
            units = set()
            for card in panel.get("cards", []) + panel.get("hiddenCards", []):
                if isinstance(card, dict) and "temperatureUnit" in card:
                    if card["temperatureUnit"] not in ("celsius", "fahrenheit"):
                        raise ConfigError(f"{name}: temperatureUnit must be celsius or fahrenheit.")
                    units.add(card["temperatureUnit"])
            if len(units) > 1:
                raise ConfigError(f"{name}: mixed card temperature units cannot map to one panel temp_unit.")
            if units:
                panel.setdefault("temp_unit", units.pop())
            warnings.append(f"{name}: connection settings come from the add-on or panels.yaml, not AppDaemon plugins.")

    def inspect(value, path):
        if isinstance(value, dict):
            for key, item in value.items():
                if key in {"berryURL", "dateAdditionalTemplate", "timeAdditionalTemplate",
                           "state", "state_not", "state_template", "action_name"}:
                    warnings.append(f"{path}.{key}: retained, but unsupported by the add-on runtime.")
                if key.startswith("weatherOverrideForecast") or key in {"weatherUnit", "forecastSkip"}:
                    warnings.append(f"{path}.{key}: retained; review explicit weather entities after migration.")
                if key == "entity" and isinstance(item, str) and item.startswith("service."):
                    warnings.append(f"{path}: legacy service actions require manual migration.")
                inspect(item, f"{path}.{key}")
        elif isinstance(value, list):
            for index, item in enumerate(value):
                inspect(item, f"{path}[{index}]")
    inspect(result, "config")
    # Return invalid previews as well, so users can fix unsupported legacy values before save.
    errors = []
    try:
        validate(result)
    except ConfigError as exc:
        errors.append(str(exc))
    return {"config": result, "format": kind, "warnings": warnings, "errors": errors}


class ConfigStore:
    def __init__(self, path):
        self.path = Path(path)
        self.lock = threading.Lock()

    def read(self):
        raw = self.path.read_bytes() if self.path.exists() else b"nspanels: {}\n"
        return {"yaml": raw.decode("utf-8"), "revision": hashlib.sha256(raw).hexdigest()}

    def save(self, text, revision):
        validate(parse_yaml(text))
        with self.lock:
            current = self.read()
            if revision != current["revision"]:
                raise ConflictError("Configuration changed on disk. Reload before saving.")
            self.path.parent.mkdir(parents=True, exist_ok=True)
            if self.path.exists():
                self._atomic_write(self.path.with_suffix(self.path.suffix + ".bak"), current["yaml"])
            self._atomic_write(self.path, text)
            return self.read()

    @staticmethod
    def _atomic_write(path, text):
        fd, temporary = tempfile.mkstemp(prefix=".nspanel-", dir=path.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                stream.write(text)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)
