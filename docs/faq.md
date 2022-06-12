# FAQ - Frequently Asked Questions

## Waiting for content - This is taking longer than usual on the screen

Please check your MQTT Topics in your apps.yaml and your mqtt configuration on tasmota.

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
