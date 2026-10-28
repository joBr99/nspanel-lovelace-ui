# Cards

## Supported card types

- `cardEntities`
- `cardGrid`
- `cardQR`
- `cardPower`
- `cardMedia`
- `cardThermo`
- `cardAlarm`
- `cardUnlock`

## Common card keys

key | required | type | description
-- | -- | -- | --
`type` | yes | string | Card type.
`title` | no | string | Card title.
`key` | no | string | Navigation key used by `navigate.<key>`.

## `cardEntities` and `cardGrid`

```yaml
- type: cardEntities
  title: Main
  key: main
  entities:
    - entity: light.kitchen
    - entity: navigate.settings
      icon: mdi:cog
```

- `entities` is required.
- `cardGrid` auto-switches to `cardGrid2` if more than 6 entities are present.

## `cardQR`

```yaml
- type: cardQR
  title: Guest WiFi
  qrCode: "WIFI:S:myssid;T:WPA;P:mypassword;;"
  entities:
    - entity: iText.myssid
      name: SSID
      icon: mdi:wifi
```

Keys:

- `qrCode` optional (default value exists, but set it explicitly)
- supports optional `entity` / `entities`

## `cardPower`

```yaml
- type: cardPower
  title: Energy
  entities:
    - entity: sensor.house_power
    - entity: delete
    - entity: sensor.solar_power
```

Notes:

- `entities` is required.
- Set `speed` on each entity to control animation. It accepts numbers or Home Assistant templates, with or without the `ha:` prefix.
- Speeds are clamped to the TFT range of -120 to 120. Negative values reverse the flow; zero stops it. Invalid or unavailable values use zero. Fractional values are truncated toward zero.

```yaml
- type: cardPower
  title: Energy
  entities:
    - entity: sensor.house_power
    - entity: delete
    - entity: sensor.solar_power
      speed: '{{ states("sensor.solar_animation_speed") }}'
```

## `cardMedia`

```yaml
- type: cardMedia
  title: Living Room
  entity: media_player.living_room
  entities:
    - entity: light.ambient
    - entity: switch.tv_bias_light
```

Notes:

- Set `entity` to the main media entity; the editor requires it for media, thermostat, and alarm cards.
- Additional `entities` are rendered as action buttons on the bottom row.

## `cardThermo`

```yaml
- type: cardThermo
  title: Heating
  entity: climate.downstairs
  supported_modes: ["heat", "off"]
```

Keys:

- `entity` required
- `supported_modes` optional (filters shown HVAC mode buttons)

## `cardAlarm`

```yaml
- type: cardAlarm
  title: House Alarm
  entity: alarm_control_panel.house
  supported_modes: ["arm_home", "arm_away", "arm_night"]
```

Keys:

- `entity` required
- `supported_modes` optional

## `cardUnlock`

```yaml
- type: cardUnlock
  title: Admin
  pin: 1234
  destination: navigate.admin
```

Keys:

- `pin` required
- `destination` required

Typical target in `hiddenCards`:

```yaml
hiddenCards:
  - type: cardGrid
    key: admin
    title: Admin
    entities:
      - entity: switch.maintenance_mode
```

## Hidden-card navigation (4.8.5+)

Hidden cards retain their left-hand Back/Up button. Configure `navItem2` to add a right-hand button, for example a shortcut to a card with `key: home`:

```yaml
hiddenCards:
  - type: cardGrid
    title: Lights
    key: lights
    navItem2:
      entity: navigate.home
      icon: mdi:home
    entities:
      - entity: light.kitchen
```

Main cards continue to use automatic previous/next navigation.
