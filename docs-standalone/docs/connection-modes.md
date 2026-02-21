# Connection Modes

The rewrite supports two panel input/output modes.

## 1) MQTT mode (default)

Enabled when:

- `mqtt_server` is configured
- `use_ha_api` is not present

Behavior:

- Subscribes to every panel `panelRecvTopic`
- Expects JSON payload containing `CustomRecv`
- Publishes commands to `panelSendTopic`

Example receive payload:

```json
{"CustomRecv":"event,startup,54,eu"}
```

## 2) Home Assistant API mode (`use_ha_api`)

Enabled when key `use_ha_api` exists in config.

Behavior:

- Subscribes to HA event `esphome.nspanel.data`
- Routes events by `device_id` (must match configured `panelRecvTopic`)
- Sends panel commands by calling Home Assistant service:
  - `<panelSendTopic>_nspanelui_api_call`

Service payload shape:

```yaml
data: "...panel command..."
command: 2
```

## Common to both modes

- Home Assistant websocket connection is used for entity state cache and service calls.
- UI actions (button presses, sliders, mode selects) are translated to Home Assistant service calls.
