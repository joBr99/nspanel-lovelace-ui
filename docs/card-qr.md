# WiFi / QR Card

![card-qr](img/card-qr.png)

```yaml
    cards:
      - type: cardQR
        title: Guest Wifi
        qrCode: "WIFI:S:test_ssid;T:WPA;P:test_pw;;"
        entities:
          - entity: iText.test_ssid
            name: Name
            icon: mdi:wifi
          - entity: iText.test_pw
            name: Password
            icon: mdi:key
```

List of supported config keys of this card:

key | optional | type | default | description
-- | -- | -- | -- | --
`type` | False | string | `None` | Type of the card
`entities` | False | complex | `None` | contains entities of the card, only valid on cardEntities and cardGrid and cardQR
`title` | True | string | `None` | Title of the Page 
`key` | True | string | `None` | Used by navigate items
`qrCode` | False | string | `None` | Value of the qrCode

List of supported entitiy types for this page:

- switch
- input_boolean
- binary_sensor
- sensor
- button
- scenes
- script
- input_button
- input_select
- light
- input_text (read-only)
- lock
- automation

The qrCode value is evaluated as a homeassistant Template, so it is possible to get values from HomeAssistant within the qrCode.

`"WIFI:S:{{states('input_text.test_ssid')}};T:WPA;P:{{states('input_text.test_pw')}};;"`
