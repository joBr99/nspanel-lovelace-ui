# Configuration: panels.yaml

The runtime reads one YAML file (default: `./panels.yaml`, add-on mode: `/config/panels.yaml`).

Use the [web editor](web-editor.md) to manage this file. For a complete starting configuration, see [your first panel](configure_mqtt.md). Snippets in the card and screensaver references belong under `nspanels.<panel_name>`. Do not wrap them in AppDaemon `module`, `class`, or `config` keys.

## Top-level keys

key | required | type | default | description
-- | -- | -- | -- | --
`nspanels` | yes | object | none | Map of panel definitions.
`home_assistant_address` | recommended | string | none | Home Assistant base URL. In add-on mode it is auto-filled as `http://supervisor` if missing.
`home_assistant_token` | recommended | string | none | Long-lived token or Supervisor token.
`mqtt_server` | required in MQTT mode | string | from env | MQTT host.
`mqtt_port` | required in MQTT mode | int | from env | MQTT port.
`mqtt_username` | required in MQTT mode | string | from env | MQTT username.
`mqtt_password` | required in MQTT mode | string | from env | MQTT password.
`use_ha_api` | optional | boolean | `false` | When true, MQTT input mode is disabled and HA event mode is used.
`timeZone` | optional | string | `Europe/Berlin` | Global fallback for panel `timeZone`.
`hiddenCards` | optional | list | `[]` | Global fallback for panel `hiddenCards`.

## Panel keys (`nspanels.<name>`)

key | required | type | default | description
-- | -- | -- | -- | --
`panelRecvTopic` | yes | string | none | Receive channel for panel events.
`panelSendTopic` | yes | string | none | Send channel for panel commands.
`locale` | yes | string | none | Locale used for translations and date formatting.
`timeZone` | recommended | string | from top-level `timeZone` | Time zone for clock.
`timeFormat` | yes | string | none | Python `strftime` format.
`dateFormat` | yes | string | none | Babel date format (example: `full`, `medium`).
`model` | optional | string | `eu` | Panel model (`eu`, `us-p`, `us-l`).
`temp_unit` | optional | string | `celsius` | Thermostat card unit (`celsius` or `fahrenheit`).
`sleepTimeout` | optional | int | `20` | Seconds before screensaver.
`sleepBrightness` | optional | int or entity_id | `10` | Screensaver brightness.
`screenBrightness` | optional | int or entity_id | `100` | Active-screen brightness.
`sleepTracking` | optional | entity_id | none | Forces sleep brightness to 0 when entity state matches `sleepTrackingZones`.
`sleepTrackingZones` | optional | list | `["not_home", "off"]` | States that trigger forced dimming.
`sleepOverride` | optional | object | none | Override sleep brightness when entity is `on`/`true`/`home`.
`defaultBackgroundColor` | optional | string | `ha-dark` | `ha-dark` or `black`.
`featExperimentalSliders` | optional | int | `0` | Forwarded in dimmode command.
`defaultCard` | optional | string | none | Default card when leaving screensaver (`navigate.<key>`).
`screensaver` | yes | object | none | Screensaver definition.
`cards` | yes | list | none | At least one supported top-level card is required when saving in the editor.
`hiddenCards` | optional | list | `[]` | Hidden cards addressable through `navigate.<key>`.

## Brightness behavior

- Integer values are used directly.
- Entity values read Home Assistant state and cast to number.
- List/schedule style brightness is not supported in this rewrite.

Example:

```yaml
sleepBrightness: input_number.nspanel_sleep
screenBrightness: input_number.nspanel_awake
sleepTracking: person.john
sleepTrackingZones: ["not_home", "off"]
sleepOverride:
  entity: light.bedroom
  brightness: 30
```

## Web editor (Home Assistant add-on)

From add-on version 4.7.92, **Open Web UI** provides a visual panel/card/entity editor and a full YAML editor. Import existing add-on or AppDaemon YAML into a draft, review warnings, and save to apply. Saves create `panels.yaml.bak` and reload the backend; stale browser drafts cannot overwrite newer disk revisions. The interface is available through authenticated Home Assistant ingress only.
