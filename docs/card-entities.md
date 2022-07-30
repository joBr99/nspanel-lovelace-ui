# Entities Page

![card-entities](img/card-entities.png)

```yaml
    cards:
      - type: cardEntities
        title: Test Entities Card
        entities:
          - entity: light.bed_light
          - entity: switch.decorative_lights
          - entity: cover.hall_window
          - entity: sensor.outside_temperature
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Type of the card
`entities` | False | complex | `None` | contains a list of entities of this card
`title` | True | string | `None` | Title of the Page 
`key` | True | string | `None` | Used by navigate items in combination with the type (cardEntities_key)

List of supported entitiy types for this page:

- cover
- switch
- input_boolean
- binary_sensor
- sensor
- button
- number
- input_number
- scenes
- script
- input_button
- light
- input_text (read-only)
- input_select
- lock
- fan
- automation
- iText
