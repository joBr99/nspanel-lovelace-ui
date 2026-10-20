#!/usr/bin/env python3
"""Validate common NSPanel Lovelace UI apps.yaml mistakes.

This checker is intentionally lightweight: it validates cross references inside the
AppDaemon apps.yaml file without connecting to Home Assistant or MQTT.
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

VALID_MODELS = {"eu", "us-l", "us-p"}


@dataclass(frozen=True)
class Finding:
    """A validation finding for a panel app."""

    severity: str
    message: str


def is_nspanel_app(app_name: str, app_config: Any) -> bool:
    """Return True when an AppDaemon app block looks like an NSPanel app."""
    if not isinstance(app_config, dict):
        return app_name.lower().startswith("nspanel")

    return (
        app_name.lower().startswith("nspanel")
        or app_config.get("module") == "nspanel-lovelace-ui"
        or app_config.get("class") == "NsPanelLovelaceUIManager"
    )


def check_apps_yaml(data: Any) -> list[Finding]:
    """Validate all NSPanel app blocks in parsed apps.yaml data."""
    if not isinstance(data, dict):
        return [Finding("error", "apps.yaml root should be a mapping of AppDaemon apps")]

    findings: list[Finding] = []
    for app_name, app_config in data.items():
        if not is_nspanel_app(str(app_name), app_config):
            continue
        findings.extend(check_panel_app(str(app_name), app_config))
    return findings


def check_panel_app(app_name: str, app_config: Any) -> list[Finding]:
    """Validate a single NSPanel AppDaemon app block."""
    if not isinstance(app_config, dict):
        return [Finding("error", f"{app_name}: app block should be a mapping")]

    findings = check_app_metadata(app_name, app_config)
    config = app_config.get("config")
    if not isinstance(config, dict):
        return [*findings, Finding("error", f"{app_name}: config block is required")]

    key_locations = collect_card_key_locations(config)
    findings.extend(check_required_config(app_name, config))
    findings.extend(check_duplicate_card_keys(app_name, key_locations))
    findings.extend(check_card_references(app_name, config, set(key_locations)))
    return findings


def check_app_metadata(app_name: str, app_config: dict[str, Any]) -> list[Finding]:
    """Validate AppDaemon metadata for an NSPanel app."""
    findings: list[Finding] = []
    if app_config.get("module") != "nspanel-lovelace-ui":
        findings.append(Finding("error", f"{app_name}: module should be 'nspanel-lovelace-ui'"))
    if app_config.get("class") != "NsPanelLovelaceUIManager":
        findings.append(Finding("error", f"{app_name}: class should be 'NsPanelLovelaceUIManager'"))
    return findings


def check_required_config(app_name: str, config: dict[str, Any]) -> list[Finding]:
    """Validate required config keys and simple enum values."""
    findings: list[Finding] = []
    for key in ("panelRecvTopic", "panelSendTopic"):
        if not config.get(key):
            findings.append(Finding("error", f"{app_name}: config.{key} is required"))

    model = config.get("model")
    if model is not None and model not in VALID_MODELS:
        models = ", ".join(sorted(VALID_MODELS))
        findings.append(Finding("error", f"{app_name}: config.model should be one of: {models}"))
    return findings


def collect_card_key_locations(config: dict[str, Any]) -> dict[str, list[str]]:
    """Return card key -> card locations for cards and hiddenCards."""
    key_locations: dict[str, list[str]] = {}
    for location, card in collect_cards(config):
        key = card.get("key")
        if isinstance(key, str) and key:
            key_locations.setdefault(key, []).append(location)
    return key_locations


def check_duplicate_card_keys(app_name: str, key_locations: dict[str, list[str]]) -> list[Finding]:
    """Report duplicate card keys."""
    return [
        Finding("error", f"{app_name}: duplicate card key '{key}'")
        for key, locations in key_locations.items()
        if len(locations) > 1
    ]


def check_card_references(app_name: str, config: dict[str, Any], card_keys: set[str]) -> list[Finding]:
    """Validate references that should point to card keys."""
    findings = [
        Finding("error", f"{app_name}: navigate.{target} has no matching card key")
        for target in sorted(collect_navigation_targets(config))
        if target not in card_keys
    ]

    default_card = get_default_card(config)
    if default_card and default_card not in card_keys:
        findings.append(
            Finding("error", f"{app_name}: screensaver.defaultCard '{default_card}' has no matching card key")
        )
    return findings


def collect_cards(config: dict[str, Any]) -> list[tuple[str, dict[str, Any]]]:
    """Return card mappings from cards and hiddenCards."""
    cards: list[tuple[str, dict[str, Any]]] = []
    for section in ("cards", "hiddenCards"):
        section_value = config.get(section, [])
        if not isinstance(section_value, list):
            continue
        for index, card in enumerate(section_value):
            if isinstance(card, dict):
                cards.append((f"{section}[{index}]", card))
    return cards


def collect_navigation_targets(value: Any) -> set[str]:
    """Find all navigate.<key> entity references inside nested config."""
    targets: set[str] = set()
    for item in walk_values(value):
        if isinstance(item, str) and item.startswith("navigate."):
            target = item.removeprefix("navigate.").strip()
            if target:
                targets.add(target)
    return targets


def walk_values(value: Any) -> Iterable[Any]:
    """Yield all scalar and nested values from dict/list structures."""
    if isinstance(value, dict):
        for nested in value.values():
            yield from walk_values(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from walk_values(nested)
    else:
        yield value


def get_default_card(config: dict[str, Any]) -> str | None:
    """Return screensaver.defaultCard when configured."""
    screensaver = config.get("screensaver")
    if not isinstance(screensaver, dict):
        return None
    default_card = screensaver.get("defaultCard")
    if isinstance(default_card, str) and default_card:
        return default_card
    return None


def load_yaml(path: Path) -> Any:
    """Load YAML data, requiring PyYAML only for CLI usage."""
    try:
        import yaml  # type: ignore[import-not-found]
    except ModuleNotFoundError as exc:  # pragma: no cover - depends on runtime environment
        raise SystemExit(
            "PyYAML is required to read apps.yaml. Install it with 'python3 -m pip install pyyaml' "
            "or run this checker inside an environment that already provides PyYAML."
        ) from exc

    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def format_findings(findings: list[Finding]) -> str:
    """Format findings for terminal output."""
    if not findings:
        return "OK: no NSPanel configuration issues found"
    return "\n".join(f"{finding.severity.upper()}: {finding.message}" for finding in findings)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate common NSPanel Lovelace UI apps.yaml mistakes.")
    parser.add_argument("apps_yaml", type=Path, help="Path to AppDaemon apps.yaml")
    args = parser.parse_args(argv)

    data = load_yaml(args.apps_yaml)
    findings = check_apps_yaml(data)
    print(format_findings(findings))
    return 1 if findings else 0


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
