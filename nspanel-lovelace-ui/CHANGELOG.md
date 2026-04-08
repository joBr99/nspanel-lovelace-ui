<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 4.7.90

- Add support for `status` entities in HAEntity state lookup and subscriptions
- Add support for `state` and `state_not` entity filters, including YAML `on`/`off` normalization
- Support dict-style `icon` and `color` for internal `navigate` and `iText` entities
- Preserve configured `icon`, `color`, and `name` when `navigate` entities use a `status` entity
- Add `screensaver.disable: true` to skip the screensaver on startup

## 4.7.0

- Initial test of addon
