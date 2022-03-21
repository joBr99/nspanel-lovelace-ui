# NSPanel Lovelace UI

Checkout [README](https://github.com/joBr99/nspanel-lovelace-ui/blob/main/README.md) for detailed Instructions.

### App Configuration

```yaml
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
    updateMode: auto-notify 			# possible values are auto, auto-notify and manual
    timeoutScreensaver: 15 #in seconds
    #brightnessScreensaver: 10
    brightnessScreensaver:
      - time: "7:00:00"
        value: 10
      - time: "23:00:00"
        value: 0
    locale: "de_DE" # only used if babel python package is installed
    dateFormatBabel: "full" # only used if babel python package is installed
                            # formatting options on https://babel.pocoo.org/en/latest/dates.html?highlight=name%20of%20day#date-fields
    timeFormat: "%H:%M"
    dateFormat: "%A, %d. %B %Y" # ignored if babel python package is installed
    weatherEntity: weather.example
    pages:
      - type: cardEntities
        heading: Example Page 1
        items:
          - cover.example_cover
          - switch.example_switch
          - input_boolean.example_input_boolean
          - sensor.example_sensor
      - type: cardEntities
        heading: Example Page 2
        items:
          - button.example_button
          - input_button.example_input_button
          - light.light_example
          - delete # (read this as 'empty')
      - type: cardEntities
        heading: Example Page 3
        items:
          - scene.example_scene
          - delete
          - delete
          - delete
      - type: cardGrid
        heading: Example Page 4
        items:
          - light.light_example
          - button.example_button
          - cover.example_cover
          - scene.example_scene
          - switch.example_switch
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
