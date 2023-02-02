# Unlock Card (v4.0 and higher)

Can be used to navigate to create pin locked navigation to a hidden card.

![card-unlock](img/card-unlock.png)

```yaml
    cards:
      - type: cardUnlock
        pin: 1234
        title: Admin Page
        destination: navigate.adminpage
    hiddenCards:
      - type: cardGrid
        title: Admin Page
        key: adminpage
        entities:
          - entity: light.schreibtischlampe
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Type of the card
`title` | True | string | `None` | Title of the Page
`destination` | False | string | `None` | contains the navigation entity this card should navigate to on unlock
`pin` | False | string | 3830 | pin to unlock
`key` | True | string | `None` | Used by navigate items
