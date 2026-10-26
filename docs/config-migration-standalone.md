# Import YAML and migrate from AppDaemon

The web editor accepts the old add-on `panels.yaml` format and NSPanel entries from AppDaemon `apps.yaml`. An import creates a draft; it does not write to the running configuration until **Save & apply**.

## Migration steps

1. Export or copy your existing configuration before changing backends.
2. [Install the new add-on](prepare_ha.md) and open its web interface.
3. Choose **Import YAML**, upload/paste the file, and select **Preview import**.
4. Review the detected panels, skipped apps, migration warnings, and validation errors.
5. Choose **Add to draft** to merge panel definitions while preserving current global connection settings. Duplicate names are rejected. Use **Replace draft** to replace the entire draft, including connection settings.
6. Review the resulting YAML, replace example entities, and fix unsupported settings. Stop the old backend before applying the same MQTT topics.
7. Select **Save & apply** and verify the add-on log and physical display.

The initial add-on configuration contains an example panel. Remove it if you merge an import and do not intend to use it. A successful save creates `panels.yaml.bak` containing the previous configuration; keep your own exported copy for longer-term rollback.

## Recognized input

Existing add-on YAML uses `nspanels` at the top level and retains its configuration fields. AppDaemon input must contain entries with `module: nspanel-lovelace-ui` or `class: NsPanelLovelaceUIManager` and a `config` mapping. Other AppDaemon apps are skipped with warnings.

```yaml
# AppDaemon input
kitchen:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: tele/nspanel_kitchen/RESULT
    panelSendTopic: cmnd/nspanel_kitchen/CustomSend
    cards:
      - type: cardEntities
        title: Kitchen
        entities:
          - entity: light.kitchen
```

The importer moves each `config` into `nspanels.<name>` and supplies missing `locale: en_US`, `timeZone: Europe/Berlin`, `timeFormat: "%H:%M"`, `dateFormat: full`, and an empty screensaver. Review those defaults for your location. A missing card list must be populated before saving.

## Converted settings

| AppDaemon setting | New backend | Review |
| --- | --- | --- |
| `timezone` | `timeZone` | Time zone casing changes. |
| `dateFormatBabel` | `dateFormat` | Babel format; a strftime-only format is replaced with `full` and warned about. |
| `featureExperimentalSliders` | `featExperimentalSliders` | Boolean values become 0/1. |
| `screensaver.defaultCard` | Panel-level `defaultCard` | Ensure the result is `navigate.<key>` for an existing card. |
| Card `temperatureUnit` | Panel-level `temp_unit` | Mixed units on one panel cannot be converted automatically. |
| Legacy weather `screensaver.entity` | Explicit screensaver `entities` | Current weather plus four daily entries; review forecast indices and overrides. |
| `screensaver.alternativeLayout` | `screensaver.type: screensaver2` | Review layout on your display. |

## Settings needing manual review

Daily brightness schedules using `time`/`value` entries are supported, alongside static values and entity IDs. Use quoted HH:MM or HH:MM:SS times; sunrise/sunset expressions are not supported. Unknown card types cannot be saved. Legacy Berry driver update options, conditional entity fields (`state`, `state_not`, `state_template`), `action_name`, and `service.*` entries are retained and flagged where recognized, but are not implemented by this backend. Review weather overrides and unit fields against the [screensaver reference](config-screensaver.md).

Preserved fields are not a promise of feature parity. See the current [cards](cards.md), [entities](entities.md), and [navigation](subpages.md) references before migrating advanced setups. Legacy notification and physical-button examples are not migration instructions for this backend.

## Connections, includes, and secrets

AppDaemon MQTT/HASS plugin credentials are not imported from `appdaemon.yaml`. In normal add-on operation, Supervisor supplies the HA connection and discovered MQTT settings. For an external broker or standalone process, set the [connection fields](config-overview.md) explicitly.

Inline `!include` and `!secret` values before uploading: the importer never reads files referenced by custom YAML tags. Duplicate keys, recursive aliases, and oversized input are rejected. Imports are limited to 1 MiB. Exported YAML contains any credentials explicitly stored in the configuration.

From add-on 4.8.1, `updateMode` and model-specific `displayURL-*` settings are supported for TFT updates and preserved on import. Review imported `auto` mode: it authorizes flashing without a confirmation when the installed TFT is older. `berryURL` remains unsupported.
