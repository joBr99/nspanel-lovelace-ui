# Troubleshooting

## Config does not load

Symptoms:

- no panel output
- log shows YAML parse error or file missing

Checks:

1. Confirm `CONFIG_FILE` path.
2. Validate YAML syntax.
3. Ensure required per-panel keys exist: `panelRecvTopic`, `panelSendTopic`, `locale`, `timeFormat`, `dateFormat`, `screensaver`, `cards`.

## MQTT not connected

Symptoms:

- log repeats MQTT connection retry

Checks:

1. Verify `mqtt_server`, `mqtt_port`, `mqtt_username`, `mqtt_password`.
2. Verify panel publishes on the same topic as `panelRecvTopic`.
3. Verify payload includes `CustomRecv` JSON key.

## Home Assistant websocket not connected

Symptoms:

- log repeatedly waits for websocket/auth

Checks:

1. Verify `home_assistant_address` and `home_assistant_token`.
2. In add-on mode, verify Supervisor token access is available.
3. Confirm HA is reachable from container network.

## Card does not open or navigate

Checks:

1. For `navigate.<key>`, confirm target card has matching `key`.
2. For `cardUnlock`, confirm `destination` and `pin` are set.
3. Confirm card `type` is one of the implemented types.

## Brightness behaves unexpectedly

Checks:

1. If using entity-based brightness, verify entity state is numeric.
2. Avoid list-based brightness schedules in this rewrite (not supported).
3. Review interaction between `sleepTracking`, `sleepTrackingZones`, and `sleepOverride`.

## Useful logs to look for

- `Config file not found`
- `Error while parsing YAML file`
- `Connected to MQTT Server`
- `Home Assistant auth OK`
- `card type ... not implemented`
- `Not implemented: <button action>`
