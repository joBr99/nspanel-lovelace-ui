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

The rewrite supports Home Assistant template rendering for selected fields when prefixed with `ha:`:

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
