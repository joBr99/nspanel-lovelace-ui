<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 4.7.90

- Fix `name` on `navigate` entities being ignored when a `status` entity is set — explicitly configured names are now preserved
- Fix `state` and `state_not` filters not working — YAML parses bare `on`/`off` as booleans, which are now correctly normalized to HA state strings before comparison

## 4.7.89

- Fix dict-style `icon` and `color` on `navigate` entities being overwritten by the `status` entity's icon/color — explicitly configured dict values are now preserved
- Add support for `state` and `state_not` filters on entities — an entity configured with `state: on` is only rendered when its state matches; `state_not: "off"` hides it when the state matches. Non-matching entities are omitted entirely (no placeholder slot).
- Add `screensaver.disable: True` option — when set, the panel skips the screensaver on startup and directly shows the first (or default) card

## 4.7.88

- Fix crash when using dict-style `color` (e.g. `{on: [...], off: [...]}`) on `navigate` and `iText` entities — color is now resolved based on the `status` entity state, matching the existing `icon` behavior

## 4.7.87

- Add support for configurable status entity in HAEntity for data retrieval
- Improve icon handling for `navigate` and `iText` types in HAEntity
- Enhance `get_entities` to include `status` entities so panel updates on status entity state changes

## 4.7.0

- Initial test of addon

