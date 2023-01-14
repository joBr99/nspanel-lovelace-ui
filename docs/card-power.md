# Power Card (v3.9 and higher)

![card-power](img/card-power.png)

```yaml
    cards:
      - type: cardPower
        title: Power Test
        entities:
          - entity: sensor.today_energy
          - entity: delete
          - entity: sensor.today_energy
            speed: 3
          - entity: sensor.today_energy
            speed: -1
          - entity: sensor.today_energy
            speed: -2
          - entity: sensor.today_energy
            speed: -3
          - entity: sensor.today_energy
            speed: 1
          - entity: sensor.today_energy
            speed: 1
```

The first two entities are shown in the middle of the card, all other entities are used around it.

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Used by navigate items
`entities` | False | complex | `None` | contains entities of the card
`title` | True | string | `None` | Title of the Page 
`key` | True | string | `None` | Used by navigate items

List of supported entitiy types for this page:

- sensor

Some details about speed:

It is possible to calculate the speed though home assistant templates, this allows to link the speed to something within your homeassistant.

If you got a proper configuration for that, feel free to share it, would be a good addition to the documentation.

```
          - entity: sensor.today_energy
            speed: '{{ range(-3, 3) | random }}'
```

