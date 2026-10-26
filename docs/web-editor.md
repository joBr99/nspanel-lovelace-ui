# Web editor

The add-on drives existing NSPanel Lovelace UI displays using MQTT or the Home Assistant event API. It also provides a configuration editor through Home Assistant ingress.

## Open the editor

Start the add-on, then select **Open Web UI**. Enable **Show in sidebar** for quick access. Home Assistant provides authentication; the editor has no exposed host port and accepts only Supervisor ingress connections.

Select a panel to edit its connection topics, locale, clock formats, cards, entities, and screensaver. Use **Advanced options** for settings outside the forms. Advanced edits use JSON and must be applied to the draft using the button below the field. The **YAML editor** exposes the complete configuration, including global connection settings. Switching from forms to YAML regenerates YAML formatting and comments; values and additional fields are preserved.

**Save & apply** validates the draft, backs up the previous file to `/config/panels.yaml.bak`, atomically writes `/config/panels.yaml`, and reloads the panel backend. Other open editors must reload before saving over a newer revision. **Export YAML** downloads the current draft, including any connection credentials explicitly stored in it. Environment-provided credentials are never injected into the editor.

The editor stays available while the backend is waiting for Home Assistant or MQTT. Saving confirms the file was accepted, not that a physical panel is connected.

## Import an existing configuration

1. Select **Import YAML** and upload or paste either your existing add-on `panels.yaml` or AppDaemon `apps.yaml`.
2. Select **Preview import**. Review the detected panels, conversions, warnings, and validation errors.
3. **Add to draft** merges panels and preserves your current global connection settings. Duplicate panel names are rejected; rename them in the imported YAML first. **Replace draft** replaces the complete configuration, including connection settings.
4. Review the draft in the YAML editor and fix any reported errors. Select **Save & apply** when ready.

AppDaemon imports recognize `module: nspanel-lovelace-ui` and `class: NsPanelLovelaceUIManager`. Other apps are skipped. The importer maps `timezone`, `dateFormatBabel`, experimental sliders, screensaver default navigation, and card temperature units. A legacy weather screensaver becomes an explicit entity/forecast list. Missing locale/date/time settings receive defaults shown in the draft.

Migration is not a guarantee of identical display behavior. Brightness schedules and unsupported card types must be changed before saving. Legacy Berry driver update options, conditional entity visibility, and service actions are retained with warnings where recognized, but are not implemented by this backend. Review weather forecasts and navigation after migration. AppDaemon plugin connection settings are not imported; the add-on normally discovers MQTT and uses the Supervisor HA API.

YAML anchors are supported within bounded size/depth limits. Duplicate mapping keys, recursive aliases, and custom tags such as `!include` or `!secret` are rejected. Inline those values before importing; the editor does not read arbitrary files from uploaded YAML paths. Imports are limited to 1 MiB.


From version 4.8.1, the panel editor includes **TFT firmware updates** (`auto-notify`, `manual`, `auto`). Update confirmation appears on the physical panel. AppDaemon `updateMode` and model-specific TFT URL overrides are supported; Berry driver updates remain manual.
