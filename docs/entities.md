# Entities

Entities are mainly used on cardEntities and cardGrid.

It is possible to overwrite and configure varrious things on Entities.

## Possible configuration values for entities key:

key | optional | type | default | description
-- | -- | -- | -- | --
`entity` | False | string | `None` | name of ha entity
`name` | True | string | `None` | Used to override names (supports home assistant templates)
`value` | True | string | `None` | Used to override the value (supports home assistant templates)
`icon` | True | string | `None` | Used to override icons
`color` | True | array | `None` | Overwrite color of entity `color: [255, 0, 0]`
`state` | True | string | `None` | Only displayed if Entity state is equal to this value
`state_not` | True | string | `None` | Only displayed if Entity state is unequal to this value
`status` | True | string | `None` | Only valid for navigate and service items, adds a entity to track state for the icon
`assumed_state` | True | string | `None` | Only for cover items, up, down and stop buttons are always shown
`action_name` | True | string | `None` | Only valid for script; Button label


## Override Icons or Names

To overwrite Icons or Names of entities you can configure an icon and/or name in your configuration, please see the following example.
Only the icons listed in the [Icon Cheatsheet](https://docs.nspanel.pky.eu/icon-cheatsheet.html) are useable.

```yaml
        entities:
          - entity: light.test_item
            name: NameOverride
            icon: mdi:lightbulb
```

It is also possible to configure different icon overwrites per state:

```yaml
            icon:
                "on": mdi:lightbulb
                "off": mdi:lightbulb
```

It is also possible to configure different color overwrites per state:

```yaml
            color:
                "on": [255,0,0]
                "off": [0,0,255]
```
Dynamic color overwrites using homeassistant templates:

```yaml
            color: '{{iif(states("binary_sensor.test")=="on", "[0,255,0]", "[255,165,0]")}}'
```

It is also possible to use text instead of icons with `text:X`

```yaml
            icon:
                "on": mdi:lightbulb
                "off": "text:"
```

Note: State Overrides are working with all state values, not only with "on" and "off".


To insert dynamic values from a homeassistant template, like a temperature you can also use `ha:` which will be rendered as homeassistant template.
There probably not much cases where this is needed, but here is an exmaple to show the current temperature on the status icon of the screensaver:

```yaml
      statusIcon2:
        entity: climate.wohnzimmer_boden
        icon: 'ha:{{ state_attr("climate.wohnzimmer_boden","current_temperature")}}'
```


## Hide item based on state

This sensor will only be shown on the card if it's state is equal to `off`

```yaml
      - entity: binary_sensor.sensor_bad_contact
        state: "off"
```

This sensor will only be shown on the card if it's state is not equal to `on`

```yaml
      - entity: binary_sensor.sensor_kueche_contact
        state_not: "on"
```

## Hide item based on HA Template

The template must evaluate to `true` for the entity to hide.

```yaml
      - entity: binary_sensor.sensor_kueche_contact
        state_template: '{{ state_attr("sun.sun","azimuth") < 200 }}'
```

## Calling service directly as button

The following example shows how to call services directly, this enables you to call services on entities not (yet) supported by the backend and also to pass data to services.

```yaml
    - entity: service.light.turn_on
      data:
        entity_id: light.schreibtischlampe
        color_name: "green"
```
