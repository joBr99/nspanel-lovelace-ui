# Getting Started

## Home Assistant add-on mode

In add-on mode, the container startup script:

- reads MQTT credentials from Home Assistant service discovery
- sets `CONFIG_FILE=/config/panels.yaml`
- creates `/config/panels.yaml` from the bundled example if it does not exist

Relevant files:

- `nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager/run.sh`
- `nspanel-lovelace-ui/config.yaml`

## Minimal `panels.yaml`

Start with one panel:

```yaml
home_assistant_address: "http://supervisor"
home_assistant_token: "SUPERVISOR_TOKEN_OR_LONG_LIVED_TOKEN"

nspanels:
  kitchen:
    panelRecvTopic: "tele/tasmota_kitchen/RESULT"
    panelSendTopic: "cmnd/tasmota_kitchen/CustomSend"
    locale: "en_US"
    timeZone: "Europe/Berlin"
    timeFormat: "%H:%M"
    dateFormat: "full"
    screensaver:
      entities:
        - entity: weather.home
    cards:
      - type: cardEntities
        title: Main
        entities:
          - entity: light.kitchen
          - entity: switch.coffee_machine
```

## Important notes

- `cards` and `screensaver` are required per panel.
- `timeFormat`, `dateFormat`, and `locale` should be set per panel.
- `panelRecvTopic` / `panelSendTopic` are required.

## Running standalone (outside HA add-on)

If you run this container/process outside Supervisor:

- provide `home_assistant_address` and `home_assistant_token` in YAML
- provide MQTT values in YAML (`mqtt_server`, `mqtt_port`, `mqtt_username`, `mqtt_password`) or environment
- set `CONFIG_FILE` if the config is not `./panels.yaml`
