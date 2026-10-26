# Entities

Entities are used in cards and screensaver lists.

## Entity keys

key | required | type | description
-- | -- | -- | --
`entity` | yes | string | Home Assistant entity id, or internal entity (`navigate.*`, `delete`, `iText.*`).
`name` | no | string | Display name override.
`icon` | no | string or map | Icon override (`mdi:*`), optionally per state.
`color` | no | `[r,g,b]` or map | Color override, optionally per state.
`value` | no | string | Value override.
`font` | no | string | Icon font variant (`small`, `medium`, `medium-icon`, `large`).
`status` | no | string | Extra status entity for `navigate.*` items.
`effectList` | no | list | Custom light effect list for detail popup.
`attribute` | no | string | Weather attribute to display.
`day` | no | int | Weather daily forecast index.
`hour` | no | int | Weather hourly forecast index.
`unit` | no | string | Value suffix.

## Supported Home Assistant domains

- `switch`
- `input_boolean`
- `automation`
- `lock`
- `input_text`
- `input_select`
- `select`
- `light`
- `fan`
- `button`
- `input_button`
- `scene`
- `script`
- `number`
- `input_number`
- `timer`
- `alarm_control_panel`
- `vacuum`
- `media_player`
- `sun`
- `person`
- `climate`
- `cover`
- `sensor`
- `binary_sensor`
- `weather`

## Internal entities

- `navigate.<key>`: Navigate to card with matching `key`.
- `navigate.UP`: Navigate back.
- `delete`: Placeholder/empty slot.
- `iText.<text>`: Static text entry.

## Template-based values

The backend supports Home Assistant template rendering for selected fields when prefixed with `ha:`:

- `icon: "ha:{{ ... }}"`
- `color: "ha:{{ ... }}"` (must evaluate to JSON RGB list)
- `value: "ha:{{ ... }}"`
- `qrCode: "ha:{{ ... }}"`

Example:

```yaml
- entity: light.kitchen
  icon:
    "on": mdi:lightbulb
    "off": mdi:lightbulb-outline
  color:
    "on": [255, 210, 90]
    "off": [80, 120, 170]
```

## Sensor display precision

Numeric sensor values respect Home Assistant's resolved display precision, including the sensor's configured precision and integration-suggested precision when provided by HA. For example, `7.75165151099879` with precision 2 is sent as `7.75`, and precision 0 produces `8`. This applies before units and grid value icons are generated.

Precision changes in Home Assistant refresh the display without restarting the add-on. Sensors without precision metadata retain their original value; nonnumeric states such as `unknown` and `unavailable` are not rounded. Explicit value templates continue to take precedence. This does not change the underlying HA state or add locale-specific decimal separators. The US portrait entity-card character limit still applies.

## Smaller sensor values on grids (4.8.3+)

Set `font` on each entity to adjust its grid icon/value font. For numeric sensor readings, use `medium` or `small`:

```yaml
- type: cardGrid
  title: Humidity
  entities:
    - entity: sensor.bedroom_humidity
      name: Bedroom
      font: medium
    - entity: sensor.living_room_humidity
      name: Living room
      font: small
```

The options are `small`, `medium`, `medium-icon` (an icon font), and `large`. Grid font selection also applies when `cardGrid` automatically switches to `cardGrid2` for more than six entities. It affects the large icon/value area, not the entity label. It does not change sensor precision or the screensaver's separate status-icon font handling.
