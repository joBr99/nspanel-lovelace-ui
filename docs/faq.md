# FAQ - Frequently Asked Questions

## Waiting for content - This is taking longer than usual on the screen

You have most likely an error in your MQTT configuration somewhere. To find the error follow theese steps:

1. Check your appdaemon log. (Settings > Add-ons > AppDaemon > Log)
You should see something like this:
`INFO MQTT: MQTT Plugin initialization complete`
If you are seeing Messages like this, your appdaemon mqtt config is wrong, check your appdaemon.yaml. 
`CRITICAL MQTT: Could not complete MQTT Plugin initialization, for Connection was refused due to Not Authorised`
The log of your mqtt broker might give you additional information.

2. Check MQTT Configuration of Tasmota. 
Your Tasmota device needs to connect sucessfully to your MQTT Broker, if you are in the waiting for content screen, the panel will send periodic messages to it's mqtt topic.

3. Make sure that you are using the same topic in apps.yaml and in your tasmota configuration. 
The example values are an working example. Please don't modify the Full Topic. [MQTT Config](https://docs.nspanel.pky.eu/configure_mqtt/)

4. If you are still in the waiting for content screen please share the following items:
    - a screenshot of your tasmota mqtt configration (please censor your mqtt password)
    - your appdaemon.yaml (please censor your mqtt password)
    - your apps.yaml
    - the appdaemon log, after restarting the container

## How to update

### Update AppDaemon Script

HACS will show you that there is an update avalible and ask you to update. It is important to restart the AppDaemon Container afterwards.

### Update Display Firmware

You should get an notification on the screen, asking you to update the firmware. In case you want to update manually you can use the following commands.

EU Version: `FlashNextion http://nspanel.pky.eu/lui-release.tft`

US Version Portrait: `FlashNextion http://nspanel.pky.eu/lui-us-p-release.tft`

US Version Landscape: `FlashNextion http://nspanel.pky.eu/lui-us-l-release.tft`

### Update Tasmota Berry Driver

You should get an notification on the screen, asking you to update the driver, if an update is needed.

You can update the berry driver directly from the Tasmota Console with the following command.

`UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be`


## How to upgrade from a release to the current development version

1. Update App in HACS to main

Click redownload in the menu of the app in HACS.

Select main version.

**!!! Wait for it to load, dropdown needs to be selectable again, otherwise it will download the latest release !!!**

![hacs-main](img/hacs-main.png)

**!!! Wait for it to load, dropdown needs to be selectable again, otherwise it will download the latest release !!!**

Click download.

2. Restart AppDaemon

3. Flash current Development Firmware in Tasmota Console. DO NOT USE THIS URL (only if you are on main/dev)

`FlashNextion http://nspanel.pky.eu/lui.tft`  DO NOT USE THIS URL (only if you are on main/dev)

Development happens in the EU version, so it is possible that the US Version isn't up to date with the current development version of the EU firmware, the lastet US versions are still downloadable with the following links:

`FlashNextion http://nspanel.pky.eu/lui-us-l.tft`  DO NOT USE THIS URL (only if you are on main/dev)

`FlashNextion http://nspanel.pky.eu/lui-us-p.tft`  DO NOT USE THIS URL (only if you are on main/dev)
