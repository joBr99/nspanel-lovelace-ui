## Unreleased

- Respect Home Assistant sensor display precision before sending numeric values to cards and screensavers, and refresh precision when entity settings change.

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
