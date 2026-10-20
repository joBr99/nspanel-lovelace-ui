# Install the Home Assistant add-on

The new backend runs as the **NSPanel Lovelace UI Addon**. It does not require AppDaemon, HACS, or a separate code editor.

## Install

1. In Home Assistant OS, open **Settings → Apps → Install app** (older versions: **Settings → Add-ons → Add-on Store**).
2. Open **⋮ → Repositories** and add:

    ```text
    https://github.com/joBr99/nspanel-lovelace-ui
    ```

3. Find **NSPanel Lovelace UI Addon** and select **Install**.
4. Ensure your MQTT broker is running. The add-on discovers the broker credentials supplied by Supervisor. For an external broker, see [connection settings](config-overview.md).
5. Start the add-on, then select **Open Web UI**. Enable **Show in sidebar** for quick access.

Home Assistant handles login to the editor through ingress; no host port needs to be opened. See Home Assistant's [repository installation instructions](https://www.home-assistant.io/common-tasks/os/#installing-a-third-party-app-repository) and [ingress documentation](https://developers.home-assistant.io/docs/apps/presentation/).

## Create your first panel

Continue with [MQTT and panel configuration](configure_mqtt.md). The first startup creates `/config/panels.yaml` from an example. Replace its placeholder panel and entity IDs with your own before saving.

Normally, leave `home_assistant_address` and `home_assistant_token` out of your YAML: the add-on uses the Supervisor connection automatically. Do not copy a placeholder token into a working add-on configuration.

The add-on's Configuration tab contains logging options (`loglevel`, `logtofile`). Panel layouts live in **Open Web UI**, not in that tab.

## Existing installations

Use [Import YAML](config-migration-standalone.md) to bring over `panels.yaml` or AppDaemon `apps.yaml`. Stop the old backend before applying the same panel topics in the new one.

If you use Home Assistant Container without Supervisor, see [standalone operation](standalone-runtime.md). Historical AppDaemon instructions remain in the [legacy section](legacy-prepare_ha.md).
