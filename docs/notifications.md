# Sending Notifications to the Panel

There are two notification types, that can be triggered by sending a command over mqtt to the panel here are examples for homeassistant scripts:

## Seperate Page

This is the notification used by the backend for updates, opening it requires to the following commands to the CustomSend Topic:
   
`pageType popupNotify`
   
`entityUpdateDetail~internalName~heading~headingColor~button1text~button1color~button2text~tB2Color~notificationText~textColor~sleepTimeout`

Alternative Layout with Icon:

`entityUpdateDetail~internalName~heading~headingColor~button1text~button1color~button2text~tB2Color~notificationText~textColor~sleepTimeout~fontIdText~icon~iconColor`

It is possible to exit from the page by sending `exitPopup`
  
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

## Color Picker
<input type="color" id="colorpicker" onchange="calcRGB565()" value="#000000">
Use this value in your Message (converted to RGB565 in Decimal) <p id="color-out"></p>
<script>
function calcRGB565() {
   let in = document.getElementById('colorpicker');
   let out = document.getElementById('color-out');
   out.innerHTML = in.value;
}
</script>
