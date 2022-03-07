# NSPanel Lovelace UI

<a href="https://paypal.me/joBr99" target="_blank"><img src="https://img.shields.io/static/v1?logo=paypal&label=&message=donate&color=slategrey"></a>

![hacs validation](https://github.com/joBr99/nspanel-lovelace-ui/actions/workflows/hacs-validation.yaml/badge.svg)

NsPanel Lovelace UI is a Firmware for the nextion screen inside of NSPanel in the Design of [HomeAssistant](https://www.home-assistant.io/)'s Lovelace UI Design.

It works with [Tasmota](https://tasmota.github.io/docs/) and MQTT. 
To control the panel and update it with content from HomeAssistant there is an [AppDeamon](https://github.com/AppDaemon/appdaemon) App.

See the following picture to get an idea of the look of this firmware for NSPanel.

![screens](doc-pics/screens.png)

## TLDR
1. Install Tasmota to NSPanel
2. Install Berry Driver in Tasmota and setup MQTT
3. Flash Nextion Firmware
4. Install AppDeamon, setup MQTT and install Backend Application

For more detailed Instructions see the following Sections:

- [How It Works](#how-it-works)
- [Requirements](#requirements)

- [Installation - Home Automation Part](#installation---home-automation-part)
   - [Installing AppDaemon](#installing-appdaemon)
   - [Installing Studio Code Server (optional, recommended)](#installing-studio-code-server-optional-recommended)
   - [Installing HACS (optional, recommended)](#installing-hacs-optional-recommended)
   - [Installing AppDeamon Backend Application](#installing-appdeamon-backend-application)
      - [With HACS (recommended)](#with-hacs-recommended)
      - [Manually](#manually)
   - [Installing Tasmota to your NSPanel](#installing---tasmota-to-your-nspanel)

- [Installation - NSPanel Part](#installation-nspanel-part)
   - [Flash Tasmota to your NSPanel](#flash-tasmota-to-your-nspanel)
   - [Configure Tasmota Template for NSPanel](#configure-tasmota-template-for-nspanel)
   - [Setup your MQTT Server in Tasmota](#setup-your-mqtt-server-in-tasmota)
   - [Upload Berry Driver to Tasmota](#upload-berry-driver-to-tasmota)
   - [Flash Firmware to Nextion Screen](#flash-firmware-to-nextion-screen)

- [Configuration](#configuration)
   - [Configuring the MQTT integration in AppDaemon](#configuring-the-mqtt-integration-in-appdaemon)
   - [Configure your NSPanel in AppDaemon](#configure-your-nspanel-in-appdaemon)



## How It Works

The NSPanel has two components an esp32 which runs Tasmota in this project and the nextion display, which is controlled by the esp32 via serial.
This project contains a display firmware, which can be controlled over serial/mqtt. 
It's controlled by an AppDeamon Application, which crafts the required commands from your HomeAssistant Instance.

For more details on how the display firmware works see the [README File in the HMI Folder](HMI/README.md)

## Requirements

 - NSPanel
 - USB to Serial TTL Adapter
 - Running [Home Assistant Instance](https://www.home-assistant.io/installation/)
 - Installed [MQTT Broker](https://www.home-assistant.io/docs/mqtt/broker) alongside Homeassistant

## Installation - Home Automation Part

### Installing Home Assistant

### Installing AppDaemon

The recommended backend application for this firmware is written in a python for [AppDeamon](https://github.com/AppDaemon/appdaemon). 
This means it requires a working and running version of AppDaemon.

The easiest way to install it is through HomeAssistant's Supervisor Add-on Store, it will be automaticly connected to your HomeAssistant Instance.

![hass-add-on-store](doc-pics/hass-add-on-store.png)

### Installing Studio Code Server (optional, recommended)

You will need a way a way to edit the `apps.yaml` config file in the appdeamon folder. 
Install Studio Code Server from Home Assistant's Supervisor Add-on Store to easily edit configuration Files on your HomeAssistant Instance.

### Installing HACS (optional, recommended)

HACS is the Home Assistant Community Store and allows for community integrations and
automations to be updated cleanly and easily from the Home Assistant web user interface.
It's simple to install the appdeamon app without HACS, but keeping up to date requires
manual steps that HACS will handle for you: you will be notified of updates, and they
can be installed by a click on a button.

If you want to use HACS, you will have to follow [their documentation on how to install HACS](https://hacs.xyz/docs/setup/download).

### Installing AppDeamon Backend Application 

#### With HACS (recommended)

To install Lovelace UI Backend App with HACS, you will need to make sure that you enabled
AppDaemon automations in HACS, as these are not enabled by default:

1. Click on `Configuration` on the left menu bar in Home Assistant Web UI
2. Select `Devices & Services`
3. Select `Integrations`
4. Find `HACS` and click on `Configure`
5. In the window that opens, make sure that `Enable AppDaemon apps discovery & tracking`
   is checked, or check it and click `Submit`
6. If you just enabled this (or just installed HACS), you might have to wait a few minutes
   as all repositories are being fetched; you might hit a GitHub rate limit, which might
   then require you to wait a few hours for HACS to be fully configured. In this case,
   you won't be able to proceed to the next steps until HACS is ready.

The Backend Application for this project is not yet in the default applications available in HACS.
You will need to add Qolsys Gateway as a custom repository in HACS. In order
to do so:

1. Click on `HACS` on the left menu bar in Home Assistant Web UI
2. Click on `Automations` in the right panel
3. Click on the three dots in the top right corner
4. Select `Custom repositories`
5. In the form that appears, write `joBr99/nspanel-lovelace-ui` as repository,
   and select `AppDaemon` as category
6. Click on `ADD`
7. Qolsys Gateway is now available to be installed and managed with HACS

Now, to install Qolsys Gateway with HACS, follow these steps:

1. Click on `HACS` on the left menu bar in Home Assistant Web UI
2. Click on `Automations` in the right panel
3. Click on `Explore & download repositories` in the bottom right corner
4. Search for `nspanel-lovelace-ui`, and click on `NSPanel Lovelance UI` in the list that appears
5. In the bottom right corner of the panel that appears, click on
   `Download this repository with HACS`
6. A confirmation panel will appear, click on `Download`, and wait for HACS to
   proceed with the download
6. The Backend Application is now installed, and HACS will inform you when updates are available

#### Manually

Installing the Backend Application manually can be summarized by putting the content of the
`apps/` directory of this repository (the `nspanel-lovelance-ui/` directory) into the `apps/`
directory of your AppDaemon installation.


## Installation - NSPanel Part

This section describes how to free your nspanel from stock firmware and get it ready for Lovelace UI 🎉

### Flash Tasmota to your NSPanel

You need to connect to your nspanel via serial and flash the `tasmota32-nspanel.bin` to your NSPanel.
Make sure to come back to this guide, before uploading the nspanel.be/autoexec.be files.
For more deatils see the [NSPanel Page of the Tasmota Template Repository](https://templates.blakadder.com/sonoff_NSPanel.html).

### Configure Tasmota Template for NSPanel

Configure the NSPanel template for Tasmota. (Go to Configuration and Configure Other and paste the template there, make sure to tick the activate checkbox)

![tasmota-template-config](doc-pics/tasmota-template-config.png)

You can use the following template or copy the one on the [Tasmota Template Repo Site](https://templates.blakadder.com/sonoff_NSPanel.html).

`{"NAME":"NSPanel","GPIO":[0,0,0,0,3872,0,0,0,0,0,32,0,0,0,0,225,0,480,224,1,0,0,0,33,0,0,0,0,0,0,0,0,0,0,4736,0],"FLAG":0,"BASE":1,"CMND":"ADCParam 2,11200,10000,3950 | Sleep 0 | BuzzerPWM 1"}`

After a reboot of tasmota your screen will light up with the stock display firmware.

### Setup your MQTT Server in Tasmota

Configure your MQTT Server in Tasmota.
See Tasmota [MQTT Documentation](https://tasmota.github.io/docs/MQTT/) for more details.

### Upload Berry Driver to Tasmota

1. Download the [Berry Driver from this Repository](tasmota/autoexec.be).

2. Go to `Consoles` > `Manage File System` in Tasmota and upload the previously downloaded file.

3. Restart your NSPanel

### Flash Firmware to Nextion Screen

#### Use your own Webserver

Upload the [tft file from HMI folder](HMI/nspanel.tft) to a Webserver (for example www folder of Home Assistant) and execute the following command in Tasmota Console.
**Webserver needs to support HTTP Range Header Requests, python2/3 http server doesn't work**

`FlashNextion http://ip-address-of-your-homeassistant:8123/local/nspanel.tft`

## Configuration

### Configuring the MQTT integration in AppDaemon

For the app to work you need a working MQTT Configuration in AppDaemon. Please configure mqtt server, user and password in `appdaemon.yaml`

```yaml
.
.
.
  plugins:
    HASS:
      type: hass
    MQTT:
      type: mqtt
      namespace: mqtt
      client_id: "appdaemon"
      client_host: 192.168.75.30
      client_port: 1883
      client_user: "mqttuser"
      client_password: "mqttpassword"
      client_topics: NONE
.
.
.
```

### Configure your NSPanel in AppDaemon

Confiure your NSPanel as you like, you need to edit the `apps.yaml` inside of your appdeamon config folder.
You can have multiple nspanel sections.

```yaml
nspanel-1:
  module: nspanel-lovelance-ui
  class: NsPanelLovelanceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
    timeoutScreensaver: 15 #in seconds, values between 5 and 60 are allowed
    #brightnessScreensaver: 10
    brightnessScreensaver:
      - time: "7:00:00"
        value: 10
      - time: "23:00:00"
        value: 0
    locale: "de_DE"
    timeFormat: "%H : %M"
    dateFormat: "%A, %d. %B %Y"
    pages:
      - type: cardEntities
        heading: Example Page 1
        items:
          - cover.example_cover
          - switch.example_switch
          - input_boolean.example_input_boolean
          - sensor.example_sensor
      - type: cardEntities
        heading: Example Page 1
        items:
          - button.example_button
          - cover.rolladenterasse_cover_1
          - light.schreibtischlampe
          - delete
      - type: cardThermo
        heading: Exmaple Thermostat
        item: climate.example_climate
      - type: cardMedia
        heading: Exampe Media
        item: media_player.spotify_user
```

key | optional | type | default | description
-- | -- | -- | -- | --
`module` | False | string | | The module name of the app.
`class` | False | string | | The name of the Class.
`config` | False | complex | | Config/Mapping between Homeassistant and your NsPanel
