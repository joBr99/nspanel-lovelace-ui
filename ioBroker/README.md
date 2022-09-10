# NSPanel ioBroker Integration

## German Tutorials
https://github.com/joBr99/nspanel-lovelace-ui/wiki

## German Video Tutorial by haus-automatisierung.com
https://www.youtube.com/watch?v=ZPLJk2ZLo_8  - NSPanel mit Lovelace UI - so habe ich mir das vorgestellt!

## Features

- Thermostat Card
- Entity Card (Temperature, Switches and sensors, the script tries to figure the unit of measurement automatically)
- Grid Card
- Detail Card (only switch and normal dimmer)
- Live update (when value was changed in the backend and the page is currently open)
- Screensaver Page with Time, Date and Weather Information.

## Requirements

- [ioBroker](https://github.com/ioBroker/ioBroker)
  - [MQTT adapter](https://github.com/ioBroker/ioBroker.mqtt) in server mode or configured as client with Mosquitto (or another MQTT broker)
  - [JavaScript adapter](https://github.com/ioBroker/ioBroker.javascript)
  - [Devices adapter](https://github.com/ioBroker/ioBroker.devices)
  - [Accuweather adapter](https://github.com/iobroker-community-adapters/ioBroker.accuweather) for screensaver information
- all devices needs to be defined in the devices panel

## Note

Currently the names are pulled from the objects data field ``common.name.de``.
If you use a different language please search and replace the ``common.name.de`` with your language.
You can find this in the device raw settings.
  
## Installation

- Import this script into the ioBroker javascript instance and choose TypeScript. *Make sure the version of the adapter is not to old.*
- Find the config variable and update to your needs.
- Make sure your device is connected with the mqtt instance.
- Create the ``CustomSend`` state by
    - sending a dummy message to ``cmnd/<yourPanel>/CustomSend`` (the mqtt adapter will create the object automatically)
    - or create the object manually within ioBroker (expert mode required)
- Place the file ``icon_mapping.ts`` in a new script in the ``global`` folder (expert mode required)

## Hardware buttons

If you like you can add special pages for the buttons.

Add this rule to Tasmota:

```
Rule2 on Button1#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,button1"} endon on Button2#state do Publish tele/%topic%/RESULT {"CustomRecv":"event,button2"} endon
Rule2
```

## Colors

You can define colors this way and use them later in the PageItem element

```js
const BatteryFull: RGB = { red: 96, green: 176, blue: 62 }
const BatteryEmpty: RGB = { red: 179, green: 45, blue: 25 }
```

## The config element in the script which needs to be configured

```ts
var config: Config = {
    panelRecvTopic: 'mqtt.0.tele.WzDisplay.RESULT',     // Object to receive data from the panel
    panelSendTopic: 'mqtt.0.cmnd.WzDisplay.CustomSend', // Object to send data to the panel

    // Items which should be presented on the screensaver page
    firstScreensaverEntity: { ScreensaverEntity: 'alias.0.Wetter.HUMIDITY', ScreensaverEntityIcon: 'water-percent', ScreensaverEntityText: 'Luft', ScreensaverEntityUnitText: '%' },
    secondScreensaverEntity: { ScreensaverEntity: 'alias.0.Wetter.PRECIPITATION_CHANCE', ScreensaverEntityIcon: 'weather-pouring', ScreensaverEntityText: 'Regen', ScreensaverEntityUnitText: '%' },
    thirdScreensaverEntity: { ScreensaverEntity: 'alias.0.Batterie.ACTUAL', ScreensaverEntityIcon: 'battery-medium', ScreensaverEntityText: 'Batterie', ScreensaverEntityUnitText: '%' },
    fourthScreensaverEntity: { ScreensaverEntity: 'alias.0.Pv.ACTUAL', ScreensaverEntityIcon: 'solar-power', ScreensaverEntityText: 'PV', ScreensaverEntityUnitText: 'W' },
    screenSaverDoubleClick: false,                      // Double touch needed to leave screensaver
    timeoutScreensaver: 15,                             // Timeout for screensaver
    dimmode: 8,                                         // Display dim
    locale: 'de_DE',                                    // not used right now
    timeFormat: '%H:%M',                                // not used right now
    dateFormat: '%A, %d. %B %Y',                        // not used right now
    weatherEntity: 'alias.0.Wetter',
    defaultColor: Off,                                  // Default color of all elements
    defaultOnColor: RGB,                                // Default on state color for items
    defaultOffColor: RGB,                               // Default off state color for page
    temperatureUnit: '°C',                              // Unit to append on temperature sensors
    pages: [
        Wohnen,
        Strom,
        {
            type: 'cardThermo',
            heading: 'Thermostat',
            useColor: true,
            items: 
                [<PageItem>{ id: 'alias.0.WzNsPanel' }
            ]
        }
    ],
    button1Page: button1Page, // A cardEntities, cardThermo or nothing. This will be opened when pressing button1 
    button2Page: button2Page  // you guess it 
};
```

The pageItem element:

```ts
type PageItem = {
    id: string,                             // the element in ioBroker devices 
    icon: (string | undefined),             // the icon which should be displayed instead of the default detected. (not implemented)
    onColor: (RGB | undefined),             // the color the item will get when active
    offColor: (RGB | undefined),            // the color the item will get when inactive
    useColor: (boolean | undefined)         // override colors, only Grid pages has colors enabled per default
    interpolateColor: (boolean | undefined),// fade between color on and off, useColor on Page or PageItem must be enabled
    minValue: (number | undefined),         // the minimum value for the fade calculation, if smaller the minimum value will be used
    maxValue: (number | undefined),         // the maximum value for the fade calculation, if larger the maximum value will be used
    name: (string | undefined),             // the Name which should be displayed, default is the name of the object itself
    unit: (string | undefined)              // the unit which should be displayed, default is the unit of the object itself
}
```

If you want you can create dedicated objects, so you don't need to declare them again. Then you can use tehm in the pages array and button pages.

```ts
const button1Page: PageGrid =
{
    type: 'cardGrid',
    heading: 'Radio',
    useColor: true, // should colors be enabled on this page, can be overridden in PageItem
    items: [
        <PageItem>{ id: 'alias.0.Radio.NJoy' },
        <PageItem>{ id: 'alias.0.Radio.Delta_Radio' },
        <PageItem>{ id: 'alias.0.Radio.NDR2' },
    ]
};
```

Pages array can look like this, so you can add the pages as object or define them in the array itself. This is up to you.

```ts
pages: [
    button1Page,
    {
        type: 'cardEntities',
        heading: 'Strom',
        useColor: true, // should colors be enabled on this page, can be overridden in PageItem
        items: [
            <PageItem>{ id: 'alias.0.Netz', icon: 'flash', interpolateColor: true, offColor: BatteryFull, onColor: Red, minValue: -1000, maxValue: 1000 },
            <PageItem>{ id: 'alias.0.Hausverbrauch', icon: 'flash', interpolateColor: true, offColor: BatteryFull, onColor: Red, maxValue: 1000 },
            <PageItem>{ id: 'alias.0.Pv', name: 'Solar', icon: 'solar-power', interpolateColor: true, offColor: Off, onColor: BatteryFull, maxValue: 1000 },
            <PageItem>{ id: 'alias.0.Batterie', icon: 'battery-medium', interpolateColor: true, offColor: BatteryEmpty, onColor: BatteryFull }
        ]
    }
];
```
