# Configuration

To confiure your NSPanel to your needs, you need to edit the `apps.yaml` inside of your Appdaemon config folder and add card and entities you want to display on the screen.

If you've sucessfully set up mqtt, you should already have a configuration looking like this:

```yaml
---
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
```

You can continue from this point adding 


```yaml
---
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
    updateMode: "auto-notify"
    locale: "de_DE"
    screensaver:
      entity: weather.k3ll3r
    cards:
      - type: cardEntities
        entities:
          - entity: switch.example_item
            name: NameOverride
            icon: mdi:lightbulb
          - entity: light.example_item
          - entity: cover.example_item
          - entity: input_boolean.example_item
        title: Example Entities 1
```