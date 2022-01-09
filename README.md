# Note Current State
This is at a really early stage, I started on the implementation of the serial protocol.

# NsPanel Custom Widget UI

This is a replacement for the stock ui on nspanel, it can be controlled via custom serial command, like the stock one (but with different commands). This enables a user experiance, where it's possible to use nspanel with custom UI, but without messing around with Nextion Editor, because it's possible to configure widgets.

# Custom Protocol
```
55 BB [payload length] [payload] [crc] [crc]
```

Payload length contains the number of bytes of the payload.

CRC is "CRC-16 (MODBUS) Big Endian" calculated over the whole message

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.

## Example for valid Message
This message has to be generated for the Message "1337" (1337 is not a valid command, this is just an example)
```
55 BB  04  31 33 33 37  5F 5B
```
## Messages to Nextion Display

# Widget Page

| Payload | Example | Parameter 1 | Parameter 2 | Parameter 3 | Parameter 4 | Description |
|---|---|---|---|---|---|---|
| widget,*id*,*type*,*status*,*name* | widget,b0,shutter,1,name | *id* of widget Possible values: - b[0-7] | type of the action the widget should do Possible values: - shutter - opens shutter page  | enable or disable Possible values: - 0 - disbale/hide - 1 - enable/show | name of the widget, will be displayed below the widget | Modify Widgets on Page |
| widget,debug,dc,*status* | widget,debug,dc,1 | debug | don't care | enable or disable Possible values: - 0 - disbale/hide - 1 - enable/show | don't care | Enables/Disables text fields at the bottom of the widget page to see the parsed command's |
|  |  |  |  |  |  |  |

## Message from Nextion Display

| Payload | Example | Parameters | Description |
|---|---|---|---|
| `event widgetPage <page>` | `event widgetPage 0` | `<page>` is the number of the current page, there is currently only page 0 | Is fired, after switching to widgetPage, has to be answered with widget message |
|  |  |  |  |

# Design Guidelines for Nextion HMI Project

Background Color is 
- RGB565: 4226 (HEX: #101010, RGB: 16,16,16)

Source for Images:
https://materialdesignicons.com/

Settings for Advanced Export (Big Images):
- Background: #101010
- Opacity: 1
- Size: 72
- Padding: 12
