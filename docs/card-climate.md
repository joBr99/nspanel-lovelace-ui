# Climate/Thermo Card

![card-thermo](img/card-thermo.png)

```yaml
    cards:
      - type: cardThermo
        title: HeatPump
        entity: climate.heatpump
      - type: cardThermo
        title: HvaC
        entity: climate.hvac
      - type: cardThermo
        title: ecobee
        entity: climate.ecobee
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Type of the card
`entities` | False | complex | `None` | contains a list of entities of this card
`title` | True | string | `None` | Title of the Page 
`temperatureUnit` | True | string | `celsius` | set this to fahrenheit to change the temperatureUnit on the page
`key` | True | string | `None` | Used by navigate items in combination with the type (cardEntities_key)