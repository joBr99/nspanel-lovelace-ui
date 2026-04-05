<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 4.7.88

- Fix crash when using dict-style `color` (e.g. `{on: [...], off: [...]}`) on `navigate` and `iText` entities — color is now resolved based on the `status` entity state, matching the existing `icon` behavior

## 4.7.87

- Add support for configurable status entity in HAEntity for data retrieval
- Improve icon handling for `navigate` and `iText` types in HAEntity
- Enhance `get_entities` to include `status` entities so panel updates on status entity state changes

## 4.7.0

- Initial test of addon

