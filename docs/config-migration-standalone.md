# Migration to Standalone Rewrite Config

This page compares the legacy AppDaemon `apps.yaml` config with the standalone rewrite `panels.yaml` config.

For the full rewrite docs, including full key descriptions, see:

- [Standalone documentation](https://docs.nspanel.pky.eu/standalone/)
- [Standalone migration page](https://docs.nspanel.pky.eu/standalone/migration-appdaemon/)

## High-level differences

Old AppDaemon version:

- panel config in `apps.yaml` with `module` / `class` / `config`
- connectivity partly configured in AppDaemon plugin config (`appdaemon.yaml`)

Standalone rewrite:

- one runtime config file: `/config/panels.yaml`
- panel definitions under `nspanels`
- Home Assistant and MQTT connection values resolved directly by the rewrite runtime

## Minimal before/after example

Old (`apps.yaml`):

```yaml
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_panel/RESULT"
    panelSendTopic: "cmnd/tasmota_panel/CustomSend"
    model: eu
```

New (`panels.yaml`):

```yaml
home_assistant_address: "http://supervisor"
home_assistant_token: "YOUR_TOKEN"

nspanels:
  panel-1:
    panelRecvTopic: "tele/tasmota_panel/RESULT"
    panelSendTopic: "cmnd/tasmota_panel/CustomSend"
    model: eu
    locale: en_US
    timeZone: "Europe/Berlin"
    timeFormat: "%H:%M"
    dateFormat: "full"
    screensaver:
      entities:
        - entity: weather.home
    cards:
      - type: cardEntities
        title: Main
        entities:
          - entity: light.kitchen
```

## Important key changes

Legacy key/concept | Rewrite key/concept | Notes
-- | -- | --
`module`, `class`, `config` wrapper | removed | Rewrite uses `nspanels.<panel_name>` directly.
`timezone` | `timeZone` | Casing changed.
`dateFormatBabel` | `dateFormat` | Use `dateFormat` in rewrite.
`temperatureUnit` (legacy card-level usage) | `temp_unit` (panel-level) | Rewrite reads `temp_unit` from panel settings.
brightness schedule lists | not supported | Rewrite supports integer or entity id for brightness values.
`updateMode` / OTA URL override keys | not supported | Legacy update behavior is not part of rewrite config.

If you are migrating now, use the standalone migration page for the complete mapping:

- [Complete mapping and checklist](https://docs.nspanel.pky.eu/standalone/migration-appdaemon/)
