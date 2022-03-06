# NSPanel Lovelance UI

Checkout [README](https://github.com/joBr99/nspanel-lovelance-ui/blob/main/README.md) for detailed Instructions.

### App Configuration

```yaml
nspanel-1:
  module: nspanel-lovelance-ui
  class: NsPanelLovelanceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
    timeoutScreensaver: 15000
    #brightnessScreensaver: 10
    brightnessScreensaver:
      - time: "7:00:00"
        value: 10
      - time: "23:00:00"
        value: 0
    locale: "de_DE"
    timeFormat: "%H : %M"
    dateFormat: "%A, %d. %B %Y"
    pages:
      - type: cardEntities
        heading: Example Page 1
        items:
          - cover.example_cover
          - switch.example_switch
          - input_boolean.example_input_boolean
          - sensor.example_sensor
      - type: cardEntities
        heading: Example Page 1
        items:
          - button.example_button
          - cover.rolladenterasse_cover_1
          - light.schreibtischlampe
          - delete
      - type: cardThermo
        heading: Exmaple Thermostat
        item: climate.example_climate
      - type: cardMedia
        heading: Exampe Media
        item: media_player.spotify_user
```

key | optional | type | default | description
-- | -- | -- | -- | --
`module` | False | string | | The module name of the app.
`class` | False | string | | The name of the Class.
`config` | False | complex | | Config/Mapping between Homeassistant and your NsPanel