# NSPanel Lovelance UI
This is a custom UI for the NSPanel, with HomeAssistant Lovelance UI Design.
The general idea is that the Nextion Display cycles though a page counter and the esp32 tells the display what to do.
If you are changeing the page the nextion display will send and event to the esp32 and it has to answer with the messages, that will update the current page with it's desired components. This enables easy changes, without touching the HMI Project.


# Current State
It's currently possible to set the content of the pages through homeassistant/nodered. (Shutter and Lights supported) And the detail page for lights is working.

![image](https://user-images.githubusercontent.com/29555657/151848276-30254f2f-318b-445f-ba94-25ed44541522.png)

![image](https://user-images.githubusercontent.com/29555657/151848537-6da58d5b-20fa-4032-947e-942476cc1b58.png)


## Halfway done upcoming pages :)

![image](https://user-images.githubusercontent.com/29555657/149677888-3840fb50-26e5-43e9-86dc-203df1c65a26.png)


# Tasmota

Use autoexec.be from tasmota folder like you would use with the stock tft file.
You will need the java app from to flash the tft file, thanks a lot to @peepshow-21
 https://github.com/peepshow-21/ns-flash

Driver behaves similar to the stock implementation, messages are published over mqtt.

See nodered example flow for my implementation.
Pages on nspanel are generated from the array at the begin of the pages function in the flow:

![image](https://user-images.githubusercontent.com/29555657/151675593-dadd53cb-a38e-49bd-9f40-832fc8edd017.png)


# Custom Protocol
```
55 BB [payload length] [payload] [crc] [crc]
```

See Readme in HMI Folder