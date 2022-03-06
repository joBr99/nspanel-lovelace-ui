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

time,22 : 26

set current date:

date,?Di 24. Februar

set screensaver timeout (set time in ms limited from 50 to 65535:

timeout,15000

change the page type:

pageType,cardEntities

pageType,cardThermo

pageType,cardMedia

pageType,popupLight,Schreibtischlampe


### cardEntities Page

The following message can be used to update the content on the cardEntities Page

entityUpdHeading,heading1337

entityUpd,*id*,*type*,*internalNameEntity*,*iconId*,*displayNameEntity*,*optionalValue*

entityUpd,1,light,light.entityName,1,Light1,0

entityUpd,2,shutter,cover.entityName,0,Shutter2

entityUpd,3,delete

entityUpd,4,text,sensor.entityName,3,Temperature,content

entityUpd,4,button,button.entityName,3,bt-name,bt-text

entityUpd,1,switch,switch.entityName,4,Switch1,0

### popupLight Page

entityUpdateDetail,*buttonState*,*sliderBrightnessPos*,*sliderColorTempPos*

entityUpdateDetail,1,100,78

entityUpdateDetail,1,100,disable

### popupShutter Page

entityUpdateDetail,*ignored*,*sliderPos*

entityUpdateDetail,1,77

### cardThermo Page

entityUpd,*internalNameEntiy*,*heading*,*currentTemp*,*destTemp*,*status*,*minTemp*,*maxTemp*,*stepTemp*

### cardMedia Page

entityUpd,|*internalNameEntiy*|*heading*|*icon*|*title*|*author*|*volume*

## Messages from Nextion Display

### startup page

event,startup

### screensaver page

event,screensaverOpen

### cardEntities Page

event,*eventName*,*PageNumber*,*PageHeading*,*entityName*,*buttonId*,*actionName*,*optionalValue*

event,pageOpen,0

event,buttonPress,1,tHeading,internalNameEntity,1,up

event,buttonPress,1,tHeading,internalNameEntity,1,down

event,buttonPress,1,tHeading,internalNameEntity,1,stop

event,buttonPress,1,tHeading,internalNameEntity,1,OnOff,1

event,buttonPress,1,tHeading,internalNameEntity,1,button

### popupLight Page

event,pageOpenDetail,popupLight,internalNameEntity

event,buttonPress,D,nameEntity,internalNameEntity,1,OnOff,1

event,buttonPress,D,nameEntity,internalNameEntity,1,brightnessSlider,50

event,buttonPress,D,nameEntity,internalNameEntity,1,colorTempSlider,50

### popupShutter Page

event,pageOpenDetail,popupShutter,internalNameEntity

event,buttonPress,D,nameEntity,internalNameEntity,1,positionSlider,50

### cardThermo Page

event,pageOpen,0

event,tempUpd,*pageNumber*,*entityName*,*temperature*

### cardMedia Page

event,buttonPress,1,tHeading,internalNameEntity,1,media-back

event,buttonPress,1,tHeading,internalNameEntity,1,media-pause

event,buttonPress,1,tHeading,internalNameEntity,1,media-next

event,buttonPress,1,tHeading,internalNameEntity,1,volumeSlider,75

# Icons IDs

ID | Icon
-- | ----
0  | ![window-open](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/window-open.svg)
1  | ![lightbulb](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/lightbulb.svg)  
2  | ![thermometer](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/thermometer.svg)
3  | ![gesture-tap-button](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/gesture-tap-button.svg)
4  | ![flash](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/flash.svg)
5  | ![music](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/music.svg)
6  | ![check-circle-outline](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/check-circle-outline.svg)
7  | ![close-circle-outline](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/close-circle-outline.svg)


# Design Guidelines for Nextion HMI Project

Background Color is 
- RGB565: 6371 [18e3] (HEX: #1C1C1C, RGB: 28,28,28)

Source for Icons is the Material Design Font, used by HASPone
https://github.com/HASwitchPlate/HASPone

