# NSPanel Lovelance UI

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

The following message should be implemented on all pages

wake screen:

wake

set brightness of screensaver:

dimmode,0 - (screen off)
dimmode,100 - (screen on with full brightness)

set current time:

time, 22 : 26

set current date:

date, Di 24. Februar

change the page type:

pageType,cardEntities

pageType,cardThermo

pageType,popupLight,Schreibtischlampe

### cardEntities Page

The following message can be used to update the content on the cardEntities Page

entityUpdHeading,heading1337

entityUpd,*id*,*iconId*,*nameOfEntity*,*type*,*optionalValue*

entityUpd,1,1,Light1,light,0

entityUpd,2,0,Shutter2,shutter

entityUpd,3,0,dc,delete

entityUpd,4,3,Temperature,text,content

entityUpd,4,3,bt-name,button,bt-text

### popupLight Page

entityUpdateDetail,1,100,78

### cardThermo Page

entityUpd,*name*,*currentTemp*,*destTemp*,*status*,*minTemp*,*maxTemp*,*stepTemp*

## Messages from Nextion Display

### cardEntities Page

event,*eventName*,*PageNumber*,*PageHeading*,*entityName*,*buttonId*,*actionName*,*optionalValue*

event,pageOpen,0

event,buttonPress,1,tHeading,tEntityName,1,up

event,buttonPress,1,tHeading,tEntityName,1,down

event,buttonPress,1,tHeading,tEntityName,1,stop

event,buttonPress,1,tHeading,tEntityName,1,OnOff,1

event,buttonPress,1,tHeading,tEntityName,1,button

### popupLight Page

event,pageOpenDetail,popupLight,Schreibtischlampe

### cardThermo Page

event,pageOpen,0

event,tempUpd,*pageNumber*,*entityName*,*temperature*

# Design Guidelines for Nextion HMI Project

Background Color is 
- RGB565: 6371 [18e3] (HEX: #1C1C1C, RGB: 28,28,28)

Source for Icons is the Material Design Font, used by HASPone
https://github.com/HASwitchPlate/HASPone

