# Troubleshooting the Home Assistant add-on

## Editor does not open

Check that the add-on is running and that its installed version includes the editor. Open it through **Open Web UI** or the sidebar. Direct access to internal port 8099 is rejected. Inspect the add-on log for editor startup errors. The editor runs separately and can remain available while the backend waits for Home Assistant or MQTT.

## Waiting for content

1. Check the **NSPanel Lovelace UI** add-on log and MQTT broker log for connection or authentication errors.
2. Verify the panel is connected to the same broker as the add-on.
3. Match `panelRecvTopic` and `panelSendTopic` to Tasmota's topic and Full Topic settings; see [MQTT configuration](getting-started.md).
4. Confirm the display firmware matches `model` and the Berry driver is installed.
5. Stop any old add-on or AppDaemon instance controlling the same topics.

For ESPHome event mode, check `use_ha_api: true`, the event device ID, and the expected service in [connection modes](connection-modes.md).

## Changes do not appear

Form and YAML edits are drafts until **Save & apply**. Advanced JSON fields have their own **Apply advanced options to draft** button. Inspect the log after saving: accepted YAML does not guarantee entity availability or panel connectivity.

The running add-on reads `/config/panels.yaml` inside its own container. This is not Home Assistant's `configuration.yaml` or AppDaemon's `apps.yaml`. A test-branch installation has separate configuration from the regular add-on. Check that you edited the installation actually driving your panel.

## Import or save errors

- Preview imports first. Unsupported card types and invalid brightness schedule entries must be corrected before saving.
- Inline `!include` and `!secret` references. Uploaded YAML cannot read local files.
- Provide unique receive topics, required date/locale fields, a screensaver object, and at least one card per panel.
- If the configuration changed on disk, export your draft before **Reload**, then reapply your edits to the latest revision.
- On a save failure, inspect the log and verify that the add-on can write its configuration directory.

## Wrong page after leaving the screensaver

Use `defaultCard: navigate.home` at panel level, with a matching card `key: home`. See [navigation](https://docs.nspanel.pky.eu/subpages/). The AppDaemon location under `screensaver` is not used by this backend.

## Restore a configuration

Each successful save backs up the previous file to `/config/panels.yaml.bak`. Export a known-good configuration before testing; this backup holds only the previous save. Restore by importing your exported YAML, or by copying the backup over `panels.yaml` in the add-on's configuration directory and restarting the add-on.

## Information to include in a GitHub issue

Include the add-on version, panel model, connection mode, relevant `panels.yaml` section, and add-on log after startup/save. Remove passwords and tokens, including those in YAML exports. For AppDaemon installations, use [legacy troubleshooting](https://docs.nspanel.pky.eu/legacy-troubleshooting/).
