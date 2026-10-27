# Frequently asked questions

## Do I need AppDaemon or HACS?

No. Install the NSPanel Lovelace UI add-on through Home Assistant's app/add-on store and configure it through **Open Web UI**. AppDaemon is the older backend; its [legacy documentation](legacy-prepare_ha.md) remains available.

## Where is my configuration?

Panels are stored in `/config/panels.yaml` inside the add-on. The web editor is the simplest way to edit it. The add-on Configuration tab controls logging only.

## Can I reuse apps.yaml?

Yes. **Import YAML → Preview import** converts recognized NSPanel AppDaemon entries. Review warnings and fix unsupported settings before saving. See [migration](config-migration-standalone.md).

## How do I update?

Update the add-on through Home Assistant's app/add-on store. TFT updates follow the panel’s `updateMode`: the default offers an on-panel confirmation; `auto` flashes older versions automatically. Berry driver updates remain manual. For device firmware, use the manual steps in [Prepare NSPanel](prepare_nspanel.md). From version 4.8.1, AppDaemon `updateMode` and model-specific TFT URL overrides are supported. See the [firmware configuration](config-overview.md#tft-firmware-updates-481).

## How do I try unreleased changes?

Use the [test-branch guide](testing.md). A branch repository alone does not change the code in a prebuilt image: the branch must use a separate published image or omit `image` to build locally.

## Why does the panel still say Waiting for content?

Check broker connectivity, matching topics, backend logs, and competing backend instances. See [troubleshooting](troubleshooting.md).

## Does the editor work without Supervisor?

Yes. Set `WEB_STANDALONE=true` and `WEB_PASSWORD`, then publish port 8099; the browser prompts for credentials. The backend can run as a standalone Python process with an explicitly configured Home Assistant connection and MQTT broker; see [standalone operation](standalone-runtime.md).
