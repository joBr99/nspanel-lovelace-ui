# Screensaver

`screensaver` is a required object in each panel config.

## Keys

key | required | type | default | description
-- | -- | -- | -- | --
`type` | no | string | `screensaver` | Layout type (`screensaver` / `screensaver2`).
`entities` | no | list | none | Screensaver entities.
`entity` | no | string | none | Single-entity shortcut.
`statusIcon1` | no | object | none | Left status icon near date.
`statusIcon2` | no | object | none | Right status icon near date.
`doubleTapToUnlock` | no | bool | `false` | Requires double tap when leaving screensaver.
`sleepTimeout` | no | int | panel `sleepTimeout` | Per-screensaver timeout override.

Use `entities` to display weather and other Home Assistant data. An empty screensaver object is accepted when no entity content is wanted.

## Screensaver entities

Screensaver entities use the same entity format as other cards.

For `weather.<entity>` you can also use:

- `attribute` (default `temperature`)
- `day` (daily forecast index)
- `hour` (hourly forecast index)
- `unit` (suffix, default `°C` for temperature-like attributes)

## Example

```yaml
screensaver:
  type: screensaver
  doubleTapToUnlock: true
  sleepTimeout: 30
  statusIcon1:
    entity: binary_sensor.front_door
    icon:
      "on": mdi:door-open
      "off": mdi:door-closed
    font: medium-icon
  statusIcon2:
    entity: sensor.outdoor_temperature
    icon: mdi:thermometer
  entities:
    - entity: weather.home
      attribute: temperature
    - entity: weather.home
      day: 1
      attribute: temperature
    - entity: weather.home
      day: 2
      attribute: temperature
    - entity: sensor.indoor_temperature
      icon: mdi:home-thermometer
```
