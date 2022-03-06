# NSPanel Lovelace UI

<a href="https://paypal.me/joBr99" target="_blank"><img src="https://img.shields.io/static/v1?logo=paypal&label=&message=donate&color=slategrey"></a>

This is a custom UI for the NSPanel, with HomeAssistant Lovelace UI Design.

![hacs validation](https://github.com/joBr99/nspanel-lovelace-ui/actions/workflows/hacs-validation.yaml/badge.svg)

NsPanel Lovelace UI is a Firmware for the nextion screen inside of NSPanel in the Design of [HomeAssistant](https://www.home-assistant.io/)'s Lovelace UI Design.

It works with [Tasmota](https://tasmota.github.io/docs/) over MQTT. 
To control the panel and update it with content from HomeAssistant there is an [AppDeamon](https://github.com/AppDaemon/appdaemon) App.

- [How It Works](#how-it-works)
- [Requirements](#requirements)

- [Installation - Home Automation Part](#installation-home-automation-part)
   - [Installing Home Assistant](#installing-home-assistant)
   - [Installing an MQTT Broker](#installing-an-mqtt-broker)
   - [Installing AppDaemon](#installing-appdaemon)
   - [Installing Studio Code Server (optional, recommended)](#installing-studio-code-server-optional-recommended)
   - [Installing HACS (optional, recommended)](#installing-hacs-optional-recommended)
   - [Installing AppDeamon Backend Application](#installing-appdeamon-backend-application)
      - [With HACS (recommended)](#with-hacs-recommended)
      - [Manually](#manually)
   - [Installing Tasmota to your NSPanel](#installing-tasmota-to-your-nspanel)

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

## Requirements

## Installation - Home Automation Part

### Installing Home Assistant

You can get to the [Home Assistant documentation for installation](https://www.home-assistant.io/installation/)
page in order to setup Home Assistant for your needs.

### Installing an MQTT Broker

You will require a working MQTT broker alongside your HomeAssistant
installation. HomeAssistant provides [documentation on how to install
and configure an MQTT broker](https://www.home-assistant.io/docs/mqtt/broker).

### Installing AppDaemon

The recommended backend application for this firmware is written in a python for [AppDeamon](https://github.com/AppDaemon/appdaemon). 
This means it requires a working and running version of AppDaemon.

The easiest way to install it is through HomeAssistant's Supervisor Add-on Store, it will be automaticly connected to your HomeAssistant Instance.

![hass-add-on-store](doc-pics/hass-add-on-store.png)

### Installing Studio Code Server (optional, recommended)

You will need a way a way to edit the `apps.yaml` config file in the appdeamon folder. 
Install Studio Code Server from ome Assistant's Supervisor Add-on Store to easily edit configuration Files on your HomeAssistant Instance.

### Installing HACS (optional, recommended)

HACS is the Home Assistant Community Store and allows for community integrations and
automations to be updated cleanly and easily from the Home Assistant web user interface.
It's simple to install the appdeamon app without HACS, but keeping up to date requires
manual steps that HACS will handle for you: you will be notified of updates, and they
can be installed by a click on a button.

If you want to use HACS, you will have to follow [their documentation on how to install HACS](https://hacs.xyz/docs/setup/download).

### Installing AppDeamon Backend Application 

#### With HACS (recommended)

To install Qolsys Gateway with HACS, you will need to make sure that you enabled
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
`apps/` directory of this repository (the `qolsysgw/` directory) into the `apps/`
directory of your AppDaemon installation.


## Installation - NSPanel Part

### Flash Tasmota to your NSPanel

### Configure Tasmota Template for NSPanel

### Setup your MQTT Server in Tasmota

### Upload Berry Driver to Tasmota

### Flash Firmware to Nextion Screen


## Configuration

### Configuring the MQTT integration in AppDaemon

### Configure your NSPanel in AppDaemon



















# Old Docs



The general idea is that the Nextion Display cycles though a page counter and the esp32 tells the display what to do.
If you are changeing the page the nextion display will send and event to the esp32 and it has to answer with the messages, that will update the current page with it's desired components. This enables easy changes, without touching the HMI Project.

# How to install

## 0. Flash Tasmota

Follow the inststructions to flash tasmota onto the esp32 of your nspanel, make sure to use 'tasmota32-nspanel.bin'.

Before uploading berry driver (nspanel.be/autoexec.be) continue with this guide.

https://templates.blakadder.com/sonoff_NSPanel.html

## 1. Install Nextion Tasmota Berry Driver

Create and edit new file named autoexec.be with a line load("nextion.be") and upload nextion.be from tasmota folder of this repo.

or

Upload "nextion.be" from tasmota folder of this repository and rename to "autoexec.be"

## 2. Flash tft File

Upload the tft file from HMI folder to a Webserver (for example www folder of Home Assistant) and execute the following command in Tasmota Console.
**Webserver needs to support HTTP Range Header Requests, python2/3 http server doesn't work**

`FlashNextion http://192.168.75.30:8123/local/nspanel.tft`

## 3. Setup your Backend

The Backend answers to commands from NsPanel and send's content to display on the screen.

## 3a. AppDeamon Backend (Recommended)

### Installation



### App Configuration

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


## 3b. Node Red Flow (Deprecated, but functional with limited Feature Set)

Import the example node-red flow from "node-red-example-flow.json" file and adjust to your needs.

# Screens from UI

The following screenshots are from the custom NSPanel UI that will be displayed on NSPanel.

![screen_cardEntities](doc-pics/screen_cardEntities.png)
![screen_popupLight](doc-pics/screen_popupLight.png)
![screen_popupShutter](doc-pics/screen_popupShutter.png)
![screen_cardThermo](doc-pics/screen_cardThermo.png)


# Message Flow

HomeAssistant / NodeRed -- MQTT -- Tasmota -- Nextion Screen

See the following picture to get an Idea for the messages send and recived from the screen during cycling though pages.

![message_flow](doc-pics/message-flow.png)


# Custom Protocol

See Readme in HMI Folder for more details on HMI Project / Custom Protocol
