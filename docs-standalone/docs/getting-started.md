# Getting started

For Home Assistant OS, [install the add-on](https://docs.nspanel.pky.eu/prepare_ha/) and use **Open Web UI**. The add-on discovers MQTT settings and uses the Supervisor HA connection. Leave HA address/token fields absent for this automatic connection.

## Minimal panels.yaml

Replace topics and entity IDs with your own. Save this in the editor or the add-on's `/config/panels.yaml`:

```yaml
nspanels:
  kitchen:
    panelRecvTopic: tele/nspanel_kitchen/RESULT
    panelSendTopic: cmnd/nspanel_kitchen/CustomSend
    model: eu
    locale: en_US
    timeZone: Europe/Berlin
    timeFormat: "%H:%M"
    dateFormat: full
    screensaver:
      entities:
        - entity: weather.home
    cards:
      - type: cardEntities
        title: Kitchen
        key: home
        entities:
          - entity: light.kitchen
```

For Home Assistant Container or a standalone process, follow the [standalone operation guide](https://docs.nspanel.pky.eu/standalone-runtime/). Supply your own HA address/token and MQTT settings; enable authenticated standalone editor access as described in that guide.
