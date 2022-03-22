# NSPanel Lovelance UI

The general idea is that the Nextion Display cycles though a page counter and the esp32 tells the display what to do.
If you are changeing the page the nextion display will send and event to the esp32 and it has to answer with the messages, that will update the current page with it's desired components. This enables easy changes, without touching the HMI Project.

# Message Flow

HomeAssistant / NodeRed -- MQTT -- Tasmota -- Nextion Screen

See the following picture to get an Idea for the messages send and recived from the screen during cycling though pages.

![message_flow](../doc-pics/message-flow.png)


# Custom Protocol
```
55 BB [payload length] [payload length] [payload] [crc] [crc]
```

Payload length contains the number of bytes of the payload.

CRC is "CRC-16 (MODBUS) Big Endian" calculated over the whole message

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.

## Example for valid Message
This message has to be generated for the Message "1337" (1337 is not a valid command, this is just an example)
```
55 BB  04 00  31 33 33 37  5F 5B
```
## Messages to Nextion Display

The following message should be implemented on all pages

wake screen:

`wake`

set brightness of screensaver:

`dimmode,0 - (screen off)`

`dimmode,100 - (screen on with full brightness)`

set current time:

`time,22 : 26`

set current date:

`date,?Di 24. Februar`

set screensaver timeout (set time in sec, max 65):

`timeout,15 - timeout after 15 seconds`

`timeout,0 - disable screensaver`

change the page type:

`pageType,pageStartup`

`pageType,cardEntities`

`pageType,cardThermo`

`pageType,cardMedia`

`pageType,popupLight,Schreibtischlampe,light.schreibtischlampe`

`pageType,popupNotify`

### screensaver page

`weatherUpdate,? tMainIcon? tMainText? tMRIcon? tMR? tForecast1? tF1Icon? tForecast1Val? tForecast2? tF2Icon? tForecast2Val`

`weatherUpdate,?0?2,3 C?0?0 mm?Mi?0?9,3 C?Do?0?11,5 C`

`page,0`

### cardEntities Page

The following message can be used to update the content on the cardEntities Page

`entityUpdHeading,heading1337`

`entityUpd[,*type*,*internalNameEntity*,*iconId*,*iconColor*,*displayNameEntity*,*optionalValue*]x4`

`,light,light.entityName,1,17299,Light1,0`

`,shutter,cover.entityName,0,17299,Shutter2,`

`,delete,,,,,`

`,text,sensor.entityName,3,17299,Temperature,content`

`,button,button.entityName,3,17299,bt-name,bt-text`

`,switch,switch.entityName,4,17299,Switch1,0`

### popupLight Page

`entityUpdateDetail,*iconId*,*iconColor*,*buttonState*,*sliderBrightnessPos*,*sliderColorTempPos*,*colorMode*`

`entityUpdateDetail,1,17299,1,100,78,enable`

`entityUpdateDetail,1,17299,1,100,disable`

### popupShutter Page

`entityUpdateDetail,*ignored*,*sliderPos*`

`entityUpdateDetail,1,77`

### popupNotify Page

`entityUpdateDetail,*internalName*,*tHeading*,*tHeadingColor*,*b1*,*tB1Color*,*b2*,*tB2Color*,*tText*,*tTextColor*,*sleepTimeout*`

`popupExit`

### cardThermo Page

`entityUpd,*internalNameEntiy*,*heading*,*currentTemp*,*destTemp*,*status*,*minTemp*,*maxTemp*,*stepTemp*[[,*iconId*,*activeColor*,*state*,*hvac_action*]]`

`[[]]` are not part of the command, this part repeats 9 times for the buttons

### cardMedia Page

`entityUpd,|*internalNameEntiy*|*heading*|*icon*|*title*|*author*|*volume*|*playpauseicon*`

### cardAlarm Page

`entityUpd,*internalNameEntity*,*arm1*,*arm1ActionName*,*arm2*,*arm2ActionName*,*arm3*,*arm3ActionName*,*arm4*,*arm4ActionName*,*icon*,*numpadStatus*`


## Messages from Nextion Display

### startup page

`event,startup,version`

### screensaver page

`event,screensaverOpen`

### cardEntities Page

`event,*eventName*,*PageNumber*,*PageHeading*,*entityName*,*buttonId*,*actionName*,*optionalValue*`

`event,pageOpen,0`

`event,buttonPress,1,tHeading,internalNameEntity,1,up`

`event,buttonPress,1,tHeading,internalNameEntity,1,down`

`event,buttonPress,1,tHeading,internalNameEntity,1,stop`

`event,buttonPress,1,tHeading,internalNameEntity,1,OnOff,1`

`event,buttonPress,1,tHeading,internalNameEntity,1,button`

### popupLight Page

`event,pageOpenDetail,popupLight,internalNameEntity`

`event,buttonPress,D,nameEntity,internalNameEntity,1,OnOff,1`

`event,buttonPress,D,nameEntity,internalNameEntity,1,brightnessSlider,50`

`event,buttonPress,D,nameEntity,internalNameEntity,1,colorTempSlider,50`

`event,buttonPress,D,nameEntity,internalNameEntity,1,colorWheel,x|y`

### popupShutter Page

`event,pageOpenDetail,popupShutter,internalNameEntity`

`event,buttonPress2,internalNameEntity,positionSlider,50`

### popupNotify Page

`event,buttonPress2,*internalName*,notifyAction,yes`

`event,buttonPress2,*internalName*,notifyAction,no`

### cardThermo Page

`event,pageOpen,0`

`event,buttonPress2,*entityName*,tempUpd,*temperature*`

`event,buttonPress2,*entityName*,hvac_action,*hvac_action*`

### cardMedia Page

`event,buttonPress2,internalNameEntity,media-back`

`event,buttonPress2,internalNameEntity,media-pause`

`event,buttonPress2,internalNameEntity,media-next`

`event,buttonPress2,internalNameEntity,volumeSlider,75`

### cardAlarm Page

`event,buttonPress2,internalNameEntity,actionName,code`


# Icons IDs

Please see Icon's int the [icons.md file](icons.md)

# Design Guidelines for Nextion HMI Project

Background Color is 
- RGB565: 6371 [18e3] (HEX: #1C1C1C, RGB: 28,28,28)

Source for Icons is the Material Design Font, used by HASPone
https://github.com/HASwitchPlate/HASPone
