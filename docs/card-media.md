# Media Card

![card-media](img/card-media.png)

```yaml
    cards:
      - type: cardMedia
        entity: media_player.spotify
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Used by navigate items
`title` | True | string | `None` | Title of the Page 
`entity` | False | string | `None` | contains the entity of the current card
`key` | True | string | `None` | Used by navigate items
`mediaControl` | True | complex | `None` | overwrites the action executed on pressing the left upper icon (red circle), icon is showing the current type of media and cannot be changed (configure it to a navigate entity; see subpages for more details navigate.cardGrid_key)
