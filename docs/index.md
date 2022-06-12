# Overview

If you like this project consider buying me a pizza 🍕 <a href="https://paypal.me/joBr99" target="_blank"><img src="https://img.shields.io/static/v1?logo=paypal&label=&message=donate&color=slategrey"></a>

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
![hacs validation](https://github.com/joBr99/nspanel-lovelace-ui/actions/workflows/hacs-validation.yaml/badge.svg)
[![Man Hours](https://img.shields.io/endpoint?url=https%3A%2F%2Fmh.jessemillar.com%2Fhours%3Frepo%3Dhttps%3A%2F%2Fgithub.com%2FjoBr99%2Fnspanel-lovelace-ui.git)](https://jessemillar.com/r/man-hours)

NsPanel Lovelace UI is a Firmware for the nextion screen inside of NSPanel in the Design of [HomeAssistant](https://www.home-assistant.io/)'s Lovelace UI Design.

**EU Model and US Model supported (in portrait and landscape orientation)**

Content of the screen is controlled by a AppDaemon Python Script installed on your HomeAssistant Instance.

Or an TypeScript on your ioBroker Instance in case you are an ioBroker User.

NsPanel needs to be flashed with Tasmota (or upcoming with ESPHome)

![nspanel-rl](img/nspanel-rl.png)

## Features

- Entities Page
- Grid Page
- Detail Pages for Lights (Brightness, Temperature and Color of the Light) and for Covers (Position)
- Thermostat Page 
- Media Player Card
- Alarm Control Card
- Screensaver Page with Time, Date and Weather Information
- Card with QrCode to display WiFi Information
- Localization (currently 40 languages)

- **Everything is dynamically configurable by a yaml config, no need to code or touch Nextion Editor**

It works with [Tasmota](https://tasmota.github.io/docs/) and MQTT. 
To control the panel and update it with content from HomeAssistant there is an [AppDaemon](https://github.com/AppDaemon/appdaemon) App.

See the following picture to get an idea of the look of this firmware for NSPanel.

![screens](img/screens.png)

Some (not all) screenshots from the US Portrait Version:

![screens-us-p](img/screens-us-p.png)

## Requirements

 - NSPanel
 - USB to Serial TTL Adapter
 - Running Instance of the Home Automation Platform of your Choise
   - Running [Home Assistant Instance](https://www.home-assistant.io/installation/)
     - with installed [MQTT Broker](https://www.home-assistant.io/docs/mqtt/broker)
   - Running [ioBroker Instance](https://www.iobroker.net/#en/documentation)
     - with installed MQTT Broker
