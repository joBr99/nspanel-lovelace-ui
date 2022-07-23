# Entities

Entities are mainly used on cardEntities, cardGrid and cardGrid.

It is possible to overwrite and configure varrious things on Entities.

## Possible configuration values for entities key:

key | optional | type | default | description
-- | -- | -- | -- | --
`entity` | False | string | `None` | name of ha entity
`name` | True | string | `None` | Used to override names
`icon` | True | string | `None` | Used to override icons
`color` | True | array | `None` | Overwrite color of entity `color: [255, 0, 0]`
`state` | True | string | `None` | Only displayed if Entity state is equal to this value
`state_not` | True | string | `None` | Only displayed if Entity state is unequal to this value
`status` | True | string | `None` | Only valid for navigate items, adds a entity to track state for the icon

## Override Icons or Names

To overwrite Icons or Names of entities you can configure an icon and/or name in your configuration, please see the following example.
Only the icons listed in the [Icon Cheatsheet](https://htmlpreview.github.io/?https://github.com/joBr99/nspanel-lovelace-ui/blob/main/HMI/icon-cheatsheet.html) are useable.

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

It is also possible to use text instead of icons with `text:X`

```yaml
            icon:
                "on": mdi:lightbulb
                "off": "text:"
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

