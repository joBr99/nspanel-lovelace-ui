# NSPanel Lovelace UI

NSPanel Lovelace UI brings Home Assistant entities, controls, and weather to the Nextion display inside a Sonoff NSPanel. EU and US models are supported, including US portrait and landscape layouts.

The **NSPanel Lovelace UI Home Assistant add-on** is the backend for new Home Assistant installations. It reads Home Assistant states, receives touch events, and sends display updates over MQTT or a compatible ESPHome event API. Configure panels through its web editor or `panels.yaml`; AppDaemon is not required.

![NSPanel](img/nspanel-rl.png)

## Get started

1. [Prepare your NSPanel](prepare_nspanel.md): install the device firmware, Berry driver, and matching display firmware.
2. [Install the Home Assistant add-on](prepare_ha.md).
3. [Connect MQTT and create your first panel](configure_mqtt.md).
4. [Use the web editor](web-editor.md) to add cards, entities, and a screensaver.

Already running AppDaemon or an older add-on configuration? [Import your YAML and migrate](config-migration-standalone.md).

## What you can configure

- Entity lists and grids, lights and covers, climate, media, alarm, QR, power, and unlock cards.
- Screensaver entities, weather forecasts, status icons, clock formats, and brightness.
- Multiple panels, hidden cards, and navigation between pages.
- Visual editing, full YAML editing, import previews, export, and backups on save.

![Display examples](img/screens.png)

See the [configuration reference](config-overview.md), [cards](cards.md), and [screensaver](config-screensaver.md). The web editor is available in add-on versions that include it (4.8.0 onward); unreleased changes require a [test-branch installation](testing.md).

## Requirements and other backends

For the add-on, use Home Assistant OS on `amd64` or `aarch64`, an NSPanel with compatible display firmware, and an MQTT broker for the Tasmota path. Home Assistant Container users can run the [standalone backend](standalone-runtime.md); direct editor access requires standalone mode and authentication.

Existing AppDaemon installations have a separate [legacy reference](legacy-prepare_ha.md). ioBroker users should follow [the ioBroker installation guide](iobroker-install.md).
