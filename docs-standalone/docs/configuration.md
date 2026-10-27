# Configuration: panels.yaml

The runtime reads one YAML file (default: `./panels.yaml`, add-on mode: `/config/panels.yaml`).

Use the [web editor](https://docs.nspanel.pky.eu/web-editor/) to manage this file. For a complete starting configuration, see [your first panel](getting-started.md). Snippets in the card and screensaver references belong under `nspanels.<panel_name>`. Do not wrap them in AppDaemon `module`, `class`, or `config` keys.

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
`sleepBrightness` | optional | int, entity_id, or schedule | `10` | Screensaver brightness.
`screenBrightness` | optional | int, entity_id, or schedule | `100` | Active-screen brightness.
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
- Daily time/value schedules are supported for both sleep and active-screen brightness.

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

From add-on version 4.8.0, **Open Web UI** provides a visual panel/card/entity editor and a full YAML editor. Import existing add-on or AppDaemon YAML into a draft, review warnings, and save to apply. Saves create `panels.yaml.bak` and reload the backend; stale browser drafts cannot overwrite newer disk revisions. Home Assistant ingress is the default access mode. Standalone Docker installations can opt into direct access with `WEB_STANDALONE=true` and `WEB_PASSWORD`; see the [standalone guide](https://docs.nspanel.pky.eu/standalone-runtime/).

## TFT firmware updates (4.8.1+)

At panel startup, the backend checks the reported TFT version and model against its pinned firmware target (currently protocol version 53, release v4.7.3, matching the former AppDaemon target). It does not query the latest GitHub release. A backend release can advance this target separately from its add-on version.

Set **TFT firmware updates** in the visual editor, or add the following under your panel:

```yaml
updateMode: auto-notify
```

- `auto-notify` (default): show an Install/Dismiss dialog on the physical panel when an update is needed.
- `auto`: start an update automatically when the installed version is older. A model change still requires confirmation.
- `manual`: do not offer or start TFT updates.

Dismissing a prompt suppresses further prompts until the backend restarts. A newer TFT on the same model is not downgraded. The backend sends at most one flash request per panel per backend run; check device logs before restarting to retry a failed transfer. Keep power connected while flashing. A new startup message reports the resulting version; no startup after ten minutes is logged as an unconfirmed update, not success.

Tasmota installations need the Berry driver with `FlashNextion` support and a `panelSendTopic` ending in `/CustomSend`. Compatible ESPHome installations use the existing `nspanelui_api_call` service with command `255`; support depends on the installed ESPHome component. TFTs older than protocol version 16 require manual flashing. Berry driver updates remain manual.

Advanced YAML options retain the AppDaemon names `displayURL-EU`, `displayURL-US-P`, and `displayURL-US-L`. Only the URL for the selected model is used. Custom URLs must use HTTP and be reachable from the panel. Set `displayFirmwareVersion` to the protocol version embedded in a custom TFT (not its release string), for example:

```yaml
updateMode: auto-notify
displayURL-EU: http://homeassistant.local:8123/local/nspanel.tft
displayFirmwareVersion: 53
```

## Dynamic brightness

Set the following under your panel in the YAML editor (or **All panel options** using JSON):

```yaml
timeZone: Europe/Berlin
sleepBrightness:
  - time: "07:00"
    value: 35
  - time: "22:00"
    value: 0
```

This uses brightness 35 during the day and 0 overnight. Times are daily local wall-clock times in the panel's `timeZone`; quote them in YAML. HH:MM and HH:MM:SS are accepted. Entries may be unordered but must have unique times and integer values from 0 to 100. The last entry from the previous day applies before the first entry, including after a restart. The backend checks schedules every second and sends a brightness command only when the resolved settings change. The same schedule format is supported by `screenBrightness`. Sunrise/sunset expressions are not supported.

For illumination-driven control, set `sleepBrightness: input_number.nspanel_sleep` and use a Home Assistant automation to update that helper from your illuminance sensor. A numeric sensor entity can also be used directly if its state already represents a desired brightness percentage. Values are clamped to 0–100; raw lux is not automatically converted into a brightness curve. Entity changes update the panel without a restart.

`sleepTracking` still forces sleep brightness to zero when its configured state matches; an active `sleepOverride` takes precedence over that and the schedule. An override brightness of zero is supported.
