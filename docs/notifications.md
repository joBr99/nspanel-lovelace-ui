# Sending Notifications to the Panel

There are two notification types, that can be triggered by sending a command over mqtt to the panel here are examples for homeassistant scripts:

## Seperate Page

This is the notification used by the backend for updates, opening it requires to the following commands to the CustomSend Topic:
   
`pageType popupNotify`
   
`entityUpdateDetail~internalName~heading~headingColor~button1text~button1color~button2text~tB2Color~notificationText~textColor~sleepTimeout~fontIdText`

Alternative Layout with Icon:

`entityUpdateDetail~internalName~heading~headingColor~button1text~button1color~button2text~tB2Color~notificationText~textColor~sleepTimeout~fontIdText~icon~iconColor`


`fontIdText` is the font used by the notification text
Possible values are 0-5:
```
Font 0 - Default - Size 24 (No Icons, Support for various special chars from different langs)
Font 1 - Size 32 (Icons and limited chars)
Font 2 - Size 32 (No Icons, Support for various special chars from different langs)
Font 3 - Size 48 (Icons and limited chars)
Font 4 - Size 80 (Icons and limited chars)
Font 5 - Size 128 (ascii only)
```

You need to use the acual char for the icon instead of the icon name which is used in the configuration. You can get the char of the icon from the cheatsheet.

https://docs.nspanel.pky.eu/icon-cheatsheet.html




It is possible to exit from the page by sending `exitPopup`
  
If you want to add newlines to your message add this string for the newline `{{'\r\n'}}`

Send Message to the Panel combined with a buzzer sound:
   
```
nspanel_popup_notification:
  alias: Popup Notification
  sequence:
  - service: mqtt.publish
    data:
      topic: cmnd/tasmota_NsPanelTerrasse/Backlog
      payload: CustomSend pageType~popupNotify; CustomSend entityUpdateDetail~id~{{
        title }}~65535~~~~~{{ message }}~65535~{{ timeout }}; Buzzer 2,2,2
  mode: single
  icon: mdi:message-badge
```

Send Message to the Panel:
   
```
nspanel_popup_notification:
  alias: Popup Notification
  sequence:
  - service: mqtt.publish
    data:
      topic: cmnd/tasmota_NsPanelTerrasse/Backlog
      payload: CustomSend pageType~popupNotify; CustomSend entityUpdateDetail~id~{{
        title }}~65535~~~~~{{ message }}~65535~{{ timeout }}
  mode: single
  icon: mdi:message-badge
```


## Notification on screensaver

The screensaver can display Notifications by sending this command to the CustomSend topic: `notify~heading~text`
   

Send Message to the Screensaver combined with a buzzer sound:
   
```
nspanel_screensaver_notification:
  alias: Screensaver Notification
  sequence:
  - service: mqtt.publish
    data:
      topic: cmnd/tasmota_NsPanelTerrasse/Backlog
      payload: CustomSend notify~{{ heading }}~{{ message }}; Buzzer 2,2,2
  mode: single
  icon: mdi:message-badge
```

Send Message to the Screensaver:
   
```
nspanel_screensaver_notification:
  alias: Screensaver Notification
  sequence:
  - service: mqtt.publish
    data:
      topic: cmnd/tasmota_NsPanelTerrasse/Backlog
      payload: CustomSend notify~{{ heading }}~{{ message }}
  mode: single
  icon: mdi:message-badge
```

## Buzzer

See [Tasmota Buzzer](https://tasmota.github.io/docs/Buzzer/#buzzer-command) for commands.

It might be necessary to enable the buzzer with:
```
BuzzerPWM 1
```

## Color Picker
<input type="color" id="colorpicker" onchange="conv565()" value="#000000">

<p id="out">Decimal RGB565: 0</p>

<script>

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16)
  } : null;
}

function rgb_dec565(rgb) {
  return ((Math.floor(rgb.red / 255 * 31) << 11) | (Math.floor(rgb.green / 255 * 63) << 5) | (Math.floor(rgb.blue / 255 * 31)));
}

function conv565() {
  var x = document.getElementById("colorpicker").value;
  document.getElementById("out").innerHTML = "Decimal RGB565: " + rgb_dec565(hexToRgb(x));
}
</script>


