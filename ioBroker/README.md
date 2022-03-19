# NSPanel ioBroker Integration

## Features

- Thermostat Card
- Entity Card (Temperature, Switches and sensors, the script tries to figure the unit of measurement automatically)
- Detail Card (only switch and normal dimmer)
- Live update (when value was changed in the backend and the page is currently open)
- Screensaver Page with Time, Date and Weather Information.

## Requirements
- ioBroker
  - MQTT Broker/Client
  - Javascript
  - devices (default)
  - all devices needs to be defined in the devices panel
  - supported device roles are light, dimmer, blind, thermostat

## Note
Currently the names are pulled from the objects data field common.name.de.
If you use a different language please search and replace the "common.name.de" with your language. 
You can find this in the device raw settings.

  
## Installation
- Import this script into the ioBroker javascript instance and choose Typescript.
- Make sure the version of the adapter is not to old.
- Find the config variable and update to your needs.
- The format strings are not used right now.
- Make sure your device is connected with the mqtt instance. I didn't get it working with the sonoff adapter, but I didn't tried it too long.
- Create a state with a mqtt client or create one per hand. The mqtt adapter will not create the state CustomSend
    - you only need to send a dummy message to cmnd/<yourPanel>/CustomSend 
    - then the state will be created 

## Update the screensaver string
The screensaver string which is send to the display looks something like this:
weatherUpdate,?23?11 °C?26?54%?Batterie?4?12 %?PV?23?123W
All fields are seperated by a question mark. In detail the fields are:
weatherUpdate,?Icon?Text?Icon (default humidity)?Text next to the last icon?Text for the left icon on the right side?Icon?Text under the icon?Text for the right icon on the left side?Icon?Text under the icon

See the icons currently usable in the following table:

[Icon Table](../HMI#icons-ids)

You can change the string and devices in the config object.

## Buttons
If you like you can add special pages for the buttons, but there is a problem currently which will open the last page again. But if you press the button again, the correct page will open.

First you need to add this rule to Tasmota:

```
Rule2 on Button1#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,button1"} endon on Button2#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,button2"} endon
Rule2
```

## The config element in the script which needs to be configured
```
var config: Config = {
    panelRecvTopic: "mqtt.0.tele.WzDisplay.RESULT",       // This is the object where the panel send the data to.
    panelSendTopic: "mqtt.0.cmnd.WzDisplay.CustomSend",   // This is the object where data is send to the panel.
    leftEntity: "alias.0.Batterie.ACTUAL",                // This is a state will be displayed on the left side.
    leftEntityIcon: 34,                                   // This is a icon which will be displayed on the left side.  
    leftEntityText: "Batterie",                           // The label for the left side.  
    leftEntityUnitText: "%",                              // The unit which will be appendon the left side.  
    rightEntity: "alias.0.Pv.ACTUAL",                     // The same but for the right side.
    rightEntityIcon: 32,
    rightEntityText: "PV",
    rightEntityUnitText: "W",                                                                                     
    timeoutScreensaver: 15,                               // Timeout for screensaver
    dimmode: 8,                                           // Display dim
    locale: "de_DE",                                      // not used right now
    timeFormat: "%H:%M",                                  // not used right now
    dateFormat: "%A, %d. %B %Y",                          // not used right now
    weatherEntity: "alias.0.Wetter",

    temperatureUnit: "°C",                                // Unit to append on temperature sensors
    pages: [
        {
            "type": "cardEntities",                       // card type (cardEntities, cardThermo)
            "heading": "Testseite",                       // heading
            "items": [                                    // items array (up to 4 on cardEntities, 1 for cardThermo)
                "alias.0.Rolladen_Eltern",                // device which must be configured in the device panel. Use only the folder for the device, not the set, get states ...
                "alias.0.Erker",
                "alias.0.Küche",
                "alias.0.Wand"

            ]
        },
        {
            "type": "cardEntities",
            "heading": "Strom",
            "items": [
                "alias.0.Netz",
                "alias.0.Hausverbrauch",
                "alias.0.Pv",
                "alias.0.Batterie"

            ]
        },
        {
            "type": "cardThermo",
            "heading": "Thermostat",
            "item": "alias.0.WzNsPanel"                   // Needs to be a thermostat in the device panel
        }
    ],
    button1Page: button1Page,                             // A cardEntities, cardThermo or nothing. This will be opened when pressing button1 
    button2Page: button2Page                              // you guess it 
};
```

If you want you can create dedicated objects, so you don't need to declare them again. Then you can use tehm in the pages array and button pages.

```
var button1Page: PageEntities =
{
    "type": "cardEntities",
    "heading": "Knopf1",
    "items": [
        "alias.0.Schlafen",
        "alias.0.Stern",
        "delete",
        "delete"
    ]
};
```

Pages array can look like this:

```
pages: [
        button1Page,
        {
            "type": "cardEntities",
            "heading": "Strom",
            "items": [
                "alias.0.Netz",
                "alias.0.Hausverbrauch",
                "alias.0.Pv",
                "alias.0.Batterie"

            ]
        }]
```