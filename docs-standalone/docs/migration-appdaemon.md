# Migration from AppDaemon Config

This page explains how to migrate panel configuration from the legacy AppDaemon `apps.yaml` format to the standalone rewrite `panels.yaml` format.

## File and structure changes

Old (AppDaemon):

- panel config lived under `apps.yaml`
- MQTT and Home Assistant base connection config was split across AppDaemon files (`appdaemon.yaml`, plugin config, and app config)

New (rewrite):

- panel config lives in one file: `panels.yaml` (usually `/config/panels.yaml`)
- connection values are read from this file and/or environment variables

## Minimal before/after example

Old AppDaemon (`apps.yaml`):

```yaml
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_panel/RESULT"
    panelSendTopic: "cmnd/tasmota_panel/CustomSend"
    model: eu
    locale: en_US
    timeFormat: "%H:%M"
```

New rewrite (`panels.yaml`):

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

## Key mapping

Legacy AppDaemon key or concept | Standalone rewrite | Notes
-- | -- | --
`module`, `class`, `config` wrapper | removed | Rewrite uses `nspanels.<panel_name>` directly.
`panelRecvTopic` | `panelRecvTopic` | Same meaning.
`panelSendTopic` | `panelSendTopic` | Same meaning.
`model` | `model` | Same meaning (`eu`, `us-p`, `us-l`).
`locale` | `locale` | Same meaning.
`timeFormat` | `timeFormat` | Same meaning.
`timezone` (legacy docs casing) | `timeZone` | Use exact camelCase `timeZone`.
`dateFormatBabel` / `dateFormat` | `dateFormat` | Rewrite expects `dateFormat`.
`cards` | `cards` | Same concept.
`hiddenCards` | `hiddenCards` | Same concept.
`screensaver` | `screensaver` | Same concept; some legacy theme options are not available.
`defaultCard` under screensaver usage | `defaultCard` (panel level) | Use as panel-level key in rewrite.
`temperatureUnit` (card-level legacy usage) | `temp_unit` (panel level) | Rewrite reads panel-level `temp_unit`.
`sleepBrightness` list schedule | not supported | Rewrite supports integer or entity id, not list-based schedules.
`screenBrightness` list schedule | not supported | Rewrite supports integer or entity id, not list-based schedules.
`sleepTracking` | `sleepTracking` | Same concept.
`sleepTrackingZones` | `sleepTrackingZones` | Same concept.
`sleepOverride` | `sleepOverride` | Same concept.
`updateMode` / OTA URL overrides (`displayURL-*`, `berryURL`) | not supported | Rewrite does not implement these legacy update keys.
`theme`, `dateAdditionalTemplate`, `timeAdditionalTemplate` | not supported | Not implemented in rewrite config.

## Connection config differences

In AppDaemon setups, MQTT and Home Assistant connectivity was mostly configured via AppDaemon plugin settings.

In the rewrite, connectivity is resolved directly by the runtime:

- Home Assistant:
  - `home_assistant_address`
  - `home_assistant_token`
- MQTT (for MQTT mode):
  - `mqtt_server`, `mqtt_port`, `mqtt_username`, `mqtt_password`
- Optional mode switch:
  - set `use_ha_api` to use Home Assistant event mode instead of MQTT receive mode

## Entity-level differences to watch

Some legacy entity config fields are not implemented in the rewrite parser/renderer:

- `state`, `state_not`, `state_template`
- direct `service.*` action entries with custom `data`
- `action_name`

Supported and commonly used fields in rewrite:

- `entity`, `name`, `icon`, `color`, `value`, `font`
- weather-related: `attribute`, `day`, `hour`, `unit`
- light detail helper: `effectList`
- navigation helper: `status` for `navigate.*` entities

## Migration checklist

1. Create `/config/panels.yaml` from the rewrite example.
2. Move each old app entry (`nspanel-1`, `nspanel-2`, ...) into `nspanels`.
3. Remove `module/class/config` wrappers.
4. Rename `timezone` to `timeZone`.
5. Ensure each panel has `dateFormat`, `timeFormat`, `screensaver`, and `cards`.
6. Replace unsupported scheduled brightness lists with integer/entity-based values.
7. Remove unsupported legacy-only keys listed above.
