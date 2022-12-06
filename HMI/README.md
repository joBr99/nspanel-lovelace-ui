# NSPanel Lovelance UI

The HMI Project of this project is only used to display stuff, navigation ist mostly up to the backend. This allows to be way more flexible.

Messages to the Panel can be send through the Command `CustomSend`, which is implemented in the berry driver.
You can issue this command through MQTT by sending messages to the `cmnd/XXX/CustomSend` Topic.
Messages from the Panel are send to the `tele/XXX/RESULT` Topic, encoded in json `{"CustomRecv":"message_from_screen"}`

## Startup

On startup the panel will send `{"CustomRecv":"event,startup,39,eu"}` every few seconds.
```
event,   #Every message from the screen will start with `event`
startup, #Startup Event
39,      #Current HMI Project Version
eu       #Current HMI Project Model
```

You can answer this message in many different ways, but in general the goal is to navigate way from the startup page. In the following example we will navigate to the screensaver page.

Send the following messages to the CustomSend Topic. (You can also send them on tasmota console for testing)



### Some preperation before we are acually navigating away:

Send this every minute: `time~18:17`

Send this at least once at midnight: `date~Donnerstag, 25. August 2022`

Send theese message once after receiving the startup event (parameters will be explained later): 

`timeout~20`

`dimmode~10~100~6371`

### Navigate from the startup page to the screensaver, by sending this command to the CustomSend Topic.

`pageType~screensaver` 

After sending this command you should already see the time and date.
To also show weather data you have to send them with weatherUpdate, but we will skip this for now.

### Exit Screensaver

Touching the panel on the screensaver will result in this MQTT Message on the result topic:

`event,buttonPress2,screensaver,bExit,1`

You can answer this by sending theese commands to the CustomSend Topic.

`pageType~cardEntities`

`entityUpd~test~1|1~light~light.schreibtischlampe~X~17299~Schreibtischlampe~0~text~sensor.server_energy_power~Y~17299~Server ENERGY Power~155 W~shutter~cover.rolladenfenster_cover_1~Z~17299~Fenster Eingang~A|B|C|disable|enable|enable~switch~switch.bad~D~63142~Bad~1`


## Messages to Nextion Display

### General Commands, implemented on all pages

set brightness of screensaver and active-brightness:

`dimmode~0~100 - (screen off)`

`dimmode~100~100 - (screen on with full brightness)`

set current time:

`time~22:26`

set current date:

`date~Di 24. Februar`

set screensaver timeout (set time in sec~ max 65):

`timeout~15 - timeout after 15 seconds`

`timeout~0 - disable screensaver`

change the page type:

`pageType~pageStartup`

`pageType~cardEntities`

`pageType~cardThermo`

`pageType~cardMedia`

`pageType~popupLight~Schreibtischlampe~light.schreibtischlampe`

`pageType~popupNotify`

`pageType~screensaver`

### screensaver page

`weatherUpdate~tMainIcon~tMainText~tForecast1~tF1Icon~tForecast1Val~tForecast2~tF2Icon~tForecast2Val~tForecast3~tF3Icon~tForecast3Val~tForecast4~tF4Icon~tForecast4Val~optionalLayoutIcon~optionalLayoutText`

`color~background~time~timeAMPM~date~tMainIcon~tMainText~tForecast1~tForecast2~tForecast3~tForecast4~tF1Icon~tF2Icon~tF3Icon~tF4Icon~tForecast1Val~tForecast2Val~tForecast3Val~tForecast4Val~bar~tMRIcon~tMR`

`notify~heading~text`

### cardEntities Page

The following message can be used to update the content on the cardEntities Page

`entityUpd~heading~navigation~[~*type*~*internalNameEntity*~*iconId*~*iconColor*~*displayNameEntity*~*optionalValue*]x4`

`~light~light.entityName~1~17299~Light1~0`

`~shutter~cover.entityName~0~17299~Shutter2~iconUp|iconStop|iconDown`

`~delete~~~~~`

`~text~sensor.entityName~3~17299~Temperature~content`

`~button~button.entityName~3~17299~bt-name~bt-text`

`~switch~switch.entityName~4~17299~Switch1~0`

`~number~input_number.entityName~4~17299~Number123~value|min|max`

`~input_sel~input_select.entityName~3~17299~sel-name~sel-text`

### popupLight Page

`entityUpdateDetail~entityName~*ignored*~*iconColor*~*buttonState*~*sliderBrightnessPos*~*sliderColorTempPos*~*colorMode*~*color_translation*~*color_temp_translation*~*brightness_translation*`

`entityUpdateDetail~1~17299~1~100~78~enable`

`entityUpdateDetail~1~17299~1~100~disable`

### popupShutter Page

`entityUpdateDetail~entityName~*sliderPos*~2ndrow~textPosition~icon1~iconUp~iconStop~iconDown~iconUpStatus~iconStopStatus~iconDownStatus~textTilt~iconTiltLeft~iconTiltStop~iconTiltRight~iconTiltLeftStatus~iconTiltStopStatus~iconTiltLeftStatus~tiltPos`

`entityUpdateDetail~1~77`

### popupNotify Page

`entityUpdateDetail~*internalName*~*tHeading*~*tHeadingColor*~*b1*~*tB1Color*~*b2*~*tB2Color*~*tText*~*tTextColor*~*sleepTimeout*~*font*~*alt_icon*~*altIconColor*`

`exitPopup`

### popupThermo Page

`entityUpdateDetail~{entity_id}~{icon_id}~{icon_color}~{heading}~{mode}~mode1~mode1?mode2?mode3~{heading}~{mode}~mode1~mode1?mode2?mode3~{heading}~{mode}~mode1~mode1?mode2?mode3~`

### popupInSel Page (input_select detail page)

`entityUpdateDetail2~*entity_id*~~*icon_color*~*input_sel*~*state*~*options*`

options are ? seperated

### cardThermo Page

`entityUpd~*heading*~*navigation*~*internalNameEntiy*~*currentTemp*~*destTemp*~*status*~*minTemp*~*maxTemp*~*stepTemp*[[~*iconId*~*activeColor*~*state*~*hvac_action*]]~tCurTempLbl~tStateLbl~tALbl~iconTemperature~dstTempTwoTempMode~btDetail`

`[[]]` are not part of the command~ this part repeats 8 times for the buttons

### cardMedia Page

onoffbtn has to be`disable` to disable the on off btn
tIconBtnEntityName is the entiy name used in the button event for pressing the upper left icon

`entityUpd~*heading*~*navigation*~*internalNameEntiy*~*title*~titlecolor~*author*~authorcolor~*volume*~*playpauseicon*~onoffbtn~iconShuffle~*type*~*internalNameEntity*~*iconId*~*iconColor*~~[~*type*~*internalNameEntity*~*iconId*~*iconColor*~*displayNameEntity*~*optionalValue*]x4`

### cardAlarm Page

`entityUpd~*internalNameEntity*~*navigation*~*arm1*~*arm1ActionName*~*arm2*~*arm2ActionName*~*arm3*~*arm3ActionName*~*arm4*~*arm4ActionName*~*icon*~*iconcolor*~*numpadStatus*~*flashing*`

### cardQR Page

`entityUpd~heading~navigation~textQR[~type~internalName~iconId~displayName~optionalValue]x2`

### cardPower Page

`entityUpd~heading~navigation~colorHome~iconHome~textHome[~iconColor~icon~speed~valueDown]x6`

`entityUpd~test~1|1~6666~A~hu~8888~B~1~t0u~9999~C~2~t1u~1111~D~3~t2u~33333~E~-1~t3u~3333~F~-2~t4u~4444~G~-3~t5u`

### cardChart Page
`entityUpd~heading~navigation~color~yAxisLabel~yAxisTick:[yAxisTick]*[~value[:xAxisLabel]?]*`  

`entityUpd~Chart Demo~1|1~6666~Gas [kWh]~20:40:60:80:100~10~7^2:00~7~6^4:00~6~7^6:00~0~7^8:00~5~1^10:00~1~10^12:00~5~6^14:00~8`


## Messages from Nextion Display

`event,buttonPress2,pageName,bNext`

`event,buttonPress2,pageName,bPrev`

`event,buttonPress2,pageName,bExit,number_of_taps`

`event,buttonPress2,pageName,sleepReached`


### startup page

`event,startup,version,model`

### screensaver page

`event,buttonPress2,screensaver,exit` - Touch Event on Screensaver

`event,screensaverOpen` - Screensaver has opened


### cardEntities Page

`event,*eventName*,*entityName*,*actionName*,*optionalValue*`

`event,buttonPress2,internalNameEntity,up`

`event,buttonPress2,internalNameEntity,down`

`event,buttonPress2,internalNameEntity,stop`

`event,buttonPress2,internalNameEntity,OnOff,1`

`event,buttonPress2,internalNameEntity,button`

### popupLight Page

`event,pageOpenDetail,popupLight,internalNameEntity`

`event,buttonPress2,internalNameEntity,OnOff,1`

`event,buttonPress2,internalNameEntity,brightnessSlider,50`

`event,buttonPress2,internalNameEntity,colorTempSlider,50`

`event,buttonPress2,internalNameEntity,colorWheel,x|y|wh`

### popupShutter Page

`event,pageOpenDetail,popupShutter,internalNameEntity`

`event,buttonPress2,internalNameEntity,positionSlider,50`

### popupNotify Page

`event,buttonPress2,*internalName*,notifyAction,yes`

`event,buttonPress2,*internalName*,notifyAction,no`

### cardThermo Page

`event,buttonPress2,*entityName*,tempUpd,*temperature*`

`event,buttonPress2,*entityName*,hvac_action,*hvac_action*`

### cardMedia Page

`event,buttonPress2,internalNameEntity,media-back`

`event,buttonPress2,internalNameEntity,media-pause`

`event,buttonPress2,internalNameEntity,media-next`

`event,buttonPress2,internalNameEntity,volumeSlider,75`

### cardAlarm Page

`event,buttonPress2,internalNameEntity,actionName,code`


# Design Guidelines for Nextion HMI Project

Background Color is 
- RGB565: 6371 [18e3] (HEX: #1C1C1C, RGB: 28,28,28)

Source for Icons is the Material Design Font, used by HASPone
https://github.com/HASwitchPlate/HASPone


# Custom Protocol
```
55 BB [payload length] [payload length] [payload] [crc] [crc]
```

Payload length contains the number of bytes of the payload.

CRC is "CRC-16 (MODBUS) Big Endian" calculated over the whole message

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.

## Example for valid Message
This message has to be generated for the Message "1337" (1337 is not a valid command~ this is just an example)
```
55 BB  04 00  31 33 33 37  5F 5B
```

