## 4.8.7

- Suppress unchanged screensaver weather, theme, and status messages; force a full refresh on page entry, panel requests, and connection recovery.
- Keep sensor display precision during Home Assistant reconnects and ignore older registry responses that arrive late.

## 4.8.6

- Fix icon templates displaying an exclamation mark instead of text or embedded `<I>mdi:...</I>` icons, including screensaver status icons and empty results.

## 4.8.5

- Restore dynamic entity names, hidden-card `navItem2`, and numeric or templated `cardPower` animation speeds, including reverse flow.
- Accept safe RGB color strings from Home Assistant templates, with fallback for invalid colors.
- Serialize WebSocket request IDs and correlate responses before sending; restore template and ESPHome subscriptions after reconnects.
- Share template subscriptions and refresh displayed entities when template results change; keep QR templates dynamic across renders.
- Refresh weather forecasts in the background with shared caching, an eight-second forecast timeout, and last-good results after transient errors. Support forecast index zero.

- Omit units from sensor values displayed in the icon area of `cardGrid` and its automatic `cardGrid2` layout, restoring AppDaemon behavior.
- Keep grid sensor text shorter so units do not get clipped or crowd out the font-selection suffix sent to the TFT.
- Preserve Home Assistant display precision and units on entity cards and screensavers.

## 4.8.4

- Add authenticated standalone web editor access using WEB_STANDALONE, WEB_USERNAME, and WEB_PASSWORD.
- Require a password for standalone access while preserving Supervisor ingress as the default.
- Use LOGLEVEL and LOGTOFILE environment settings outside Supervisor.
- Document Docker Compose configuration and standalone editor authentication.

## 4.8.3

- Restore per-entity grid font selection: `small`, `medium`, `medium-icon`, and `large` now work on `cardGrid` and its automatic `cardGrid2` layout.
- Apply font selection to sensor values displayed in place of grid icons, allowing more compact humidity and other numeric readings.
- Preserve existing screensaver status-icon font handling and non-grid card rendering.

## 4.8.2

- Respect Home Assistant sensor display precision on cards and screensavers, with automatic refresh when precision settings change.
- Restore daily schedules for `sleepBrightness` and `screenBrightness`, using the panel time zone and handling overnight periods and backend restarts.
- Support importing AppDaemon daily brightness schedules, with validation of schedule times and values.
- Clamp entity-driven brightness to 0–100 for dynamic control through numeric sensors or Home Assistant helpers.
- Fix brightness `0` being ignored, including in sleep overrides.
- Update configuration and migration documentation for sensor precision and dynamic brightness.

## 4.8.1

- Restore TFT update prompts and automatic/manual update modes for MQTT and compatible ESPHome panels.
- Support model-specific firmware URLs and custom target versions.
- Prevent duplicate update requests and keep normal page updates from replacing the firmware prompt.

## 4.8.0

- Add an ingress configuration editor for panels, cards, entities, and screensavers.
- Preview/import add-on and AppDaemon YAML, with migration warnings and validation.
- Back up configuration before atomic saves and reject stale editor revisions.
- Keep the editor available independently of panel connections.
- Handle atomic config changes, fix global locale inheritance and use_ha_api false, and respect shutdown signals.

<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 4.7.91

- Keep the new runtime entity and screensaver features while reverting the add-on config mount change

## 4.7.90

- Add support for `status` entities in HAEntity state lookup and subscriptions
- Add support for `state` and `state_not` entity filters, including YAML `on`/`off` normalization
- Support dict-style `icon` and `color` for internal `navigate` and `iText` entities
- Preserve configured `icon`, `color`, and `name` when `navigate` entities use a `status` entity
- Add `screensaver.disable: true` to skip the screensaver on startup

## 4.7.0

- Initial test of addon
