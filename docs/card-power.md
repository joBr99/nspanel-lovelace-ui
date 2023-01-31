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
            speed: 30
          - entity: sensor.today_energy
            speed: -10
          - entity: sensor.today_energy
            speed: -20
          - entity: sensor.today_energy
            speed: -30
          - entity: sensor.today_energy
            speed: 10
          - entity: sensor.today_energy
            speed: 10
```

The first two entities are shown in the middle of the card, all other entities are used around it. Any entity overrides (e.g. icon, color) in the first entity apply to the middle of the card.

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Type of the card
`entities` | False | complex | `None` | contains entities of the card
`title` | True | string | `None` | Title of the Page 
`key` | True | string | `None` | Used by navigate items

List of supported entitiy types for this page:

- sensor

N.B. Negative values will likely be truncated and not display gracefully. For this reason, when measuring energy you should use the same inputs as you use on the Home Assistant Energy Dashboard (i.e. separate grid import and grid export) and similarly when measuring power.

Some details about speed:

Speed expects an integer input between `-100` and `100`.

It is possible to calculate the speed through a Home Assistant template, this allows to calculate the speed in relation to other data in Home Assistant.

This template will calculate a speed setting based on the amount of power drawn on a device as a fraction of the total power usage.
```yaml
            speed: >-
              {% set entity_power = states('sensor.appliance_water_heater_power') |float | round(3)%}
              {% set total_power = states('sensor.ams_power_active') | float | round(3) %}
              {% set entity_usage = (entity_power / total_power * 100) | float %}
              {{ (entity_usage | round()) * -1 }}
```
It provides the number as a negative integer, making the dot move from the entity toward the middle of the card. If you want the dot to move away from the middle of the card, just skip inverting it at the end of the template like this:
```yaml
              {{ (entity_usage | round()) }}
```
