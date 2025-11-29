# Flash Tasmota to Your NSPanel

You need to connect to your NSPanel via serial and flash Tasmota using [tasmota32-nspanel.bin](http://ota.tasmota.com/tasmota32/release/tasmota32-nspanel.bin).  
You can use the [Tasmota Web Installer](https://tasmota.github.io/install/) to do so.

Check out Blakadder's Template Repo for more information on flashing. **Do not** use the autoexec.be from that page.  
[NSPanel Page of the Tasmota Template Repository](https://templates.blakadder.com/sonoff_NSPanel.html)

If you prefer ESPHome over Tasmota, you can use this third-party ESPHome component, which replaces Tasmota and the Berry driver used in this project.  
[ESPHome Component](https://github.com/sairon/esphome-nspanel-lovelace-ui)

---

## Downgrade Tasmota

Downgrade your Tasmota to version **15.0.1** - in newer versions, flashing the display currently does not work.

https://ota.tasmota.com/tasmota32/release-15.0.1/tasmota32-nspanel.bin

---

## Configure Tasmota Template for NSPanel

Configure the NSPanel template for Tasmota. (Go to Configuration > Configure Other, paste the template there, and make sure to tick the Activate checkbox.)

![tasmota-template-config](img/tasmota-template-config.png)

You can use the following template or copy the one from the [Tasmota Template Repo Site](https://templates.blakadder.com/sonoff_NSPanel.html):

{"NAME":"NSPanel","GPIO":[0,0,0,0,3872,0,0,0,0,0,32,0,0,0,0,225,0,480,224,1,0,0,0,33,0,0,0,0,0,0,0,0,0,0,4736,0],"FLAG":0,"BASE":1,"CMND":"ADCParam 2,11200,10000,3950 | Sleep 0 | BuzzerPWM 1"}

After a reboot of Tasmota, your screen will light up with the stock display firmware.

---

## Upload Berry Driver to Tasmota

Go to Consoles > Console in Tasmota and execute the following command:

Backlog UrlFetch https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; SetOption151 0; Restart 1

This downloads the autoexec.be file from the repository and restarts Tasmota.

Note: This command also disables Matter to free up memory, as it's unlikely to be used by most Home Assistant users. (Matter can cause memory issues during flashing of the Nextion screen, but you can re-enable it later if needed.)

---

## Flash Firmware to Nextion Screen

Due to the limitations of Berry, it's not possible to download the TFT file directly from GitHub. A small server is available to download the file via HTTP.

Use one of the following commands in the Tasmota console (not the Berry console) to flash the latest release from this repository:

EU Version:  
FlashNextion http://nspanel.pky.eu/lui-release.tft

US Version Portrait:  
FlashNextion http://nspanel.pky.eu/lui-us-p-release.tft

US Version Landscape:  
FlashNextion http://nspanel.pky.eu/lui-us-l-release.tft

After sending the command, the screen should show a progress bar. The flashing process takes around 5 minutes.

Note for US users: You'll need to add the model config option to your apps.yaml later. More details can be found on the config overview page.

---

<details>
<summary>Alternatively, you can use your own web server or the one built into Home Assistant:</summary>
<br>
Upload the nspanel.tft from the latest release to a web server (for example, the www folder of Home Assistant) and execute the following command in the Tasmota Console.  
(Development version: [TFT file from HMI folder](HMI/nspanel.tft))

**The web server must be HTTP. HTTPS is not supported due to Berry language limitations in Tasmota.**

FlashNextion http://ip-address-of-your-homeassistant:8123/local/nspanel.tft
</details>
