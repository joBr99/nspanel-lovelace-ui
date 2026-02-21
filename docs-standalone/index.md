# Overview

This documentation covers the standalone rewrite located in `nspanel-lovelace-ui/`.

It is a Python backend that:

- receives panel input (MQTT mode or Home Assistant API mode)
- reads Home Assistant state through the websocket API
- renders cards and screensaver pages
- sends panel commands back to the device

This docs set is intentionally separate from the AppDaemon docs in `docs/`.

## Rewrite location

- Add-on package: `nspanel-lovelace-ui/`
- Runtime code: `nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager/`
- Example panel config: `nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager/panels.yaml.example`

## What is supported

- `cardEntities`
- `cardGrid` (auto-switches to `cardGrid2` when needed)
- `cardQR`
- `cardPower`
- `cardMedia`
- `cardThermo`
- `cardAlarm`
- `cardUnlock`
- screensaver with status icons and weather forecast entities

## Runtime model

1. Load `panels.yaml`.
2. Resolve MQTT and Home Assistant connection settings.
3. Create one thread per panel.
4. Listen for events and state changes.
5. Re-render active pages and detail popups when relevant entities change.
