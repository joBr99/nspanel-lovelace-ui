# Alarm Card

![card-alarm](img/card-alarm.png)

```yaml
    cards:
      - type: cardAlarm
        title: Alarm Test 1
        entity: alarm_control_panel.alarmo
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Used by navigate items
`title` | True | string | `None` | Title of the Page 
`entity` | False | string | `None` | contains the entity of the current card
`key` | True | string | `None` | Used by navigate items
`alarmControl` | True | complex | `None` | overwrites the action executed on pressing the left bottom icon, by default this button is used to show a list of open sensors on a failed attempt to arm.