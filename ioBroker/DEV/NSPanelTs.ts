/*-----------------------------------------------------------------------
TypeScript v4.4.0.4 zur Steuerung des SONOFF NSPanel mit dem ioBroker by @Armilar / @TT-Tom / @ticaki / @Britzelpuf / @Sternmiere / @ravenS0ne
- abgestimmt auf TFT 53 / v4.4.0 / BerryDriver 9 / Tasmota 14.2.0
@joBr99 Projekt: https://github.com/joBr99/nspanel-lovelace-ui/tree/main/ioBroker
NsPanelTs.ts (dieses TypeScript in ioBroker) Stable: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/NsPanelTs.ts
icon_mapping.ts: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/icon_mapping.ts (TypeScript muss in global liegen)
ioBroker-Unterstützung: https://forum.iobroker.net/topic/50888/sonoff-nspanel
@Kuckuckmann: WIKI zu diesem Projekt unter: https://github.com/joBr99/nspanel-lovelace-ui/wiki (siehe Sidebar)

***************************************************************************************************************
Achtung: Keine Beispiele mehr im Script. Die Beispiele sind jetzt unter nachfolgendem Link zu finden:
-  https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Page-%E2%80%90-Typen_How-2_Beispiele
***************************************************************************************************************

Icons unter: https://htmlpreview.github.io/?https://github.com/jobr99/Generate-HASP-Fonts/blob/master/cheatsheet.html

************************************************************************************************
Achtung Änderung des Sonoff ESP-Temperatursensors
!!! Bitte "SetOption146 1" in der Tasmota-Console ausführen !!!
************************************************************************************************
In bestimmten Situationen kommt es vor, dass sich das Panel mit FlashNextion
unter Tasmota > 12.2.0 nicht flashen lässt. Für den Fall ein Tasmota Downgrade 
durchführen und FlashNextion wiederholen.
************************************************************************************************
Ab Tasmota > 13.0.0 ist für ein Upgrade ggfs. eine Umpartitionierung erforderlich
https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Tasmota-FAQ#3-tasmota-update-probleme
*****************************************************************************************************************************
Ab Script Version 4.3.2.1 muss in der JavaScript Instanz die npm Module 'moment', 'moment-parseformat' und 'dayjs' eingetragen sein
https://github.com/joBr99/nspanel-lovelace-ui/wiki/iobroker---Basisinstallation#8--einstellungen-in-js-adapter-instanz
*****************************************************************************************************************************

ReleaseNotes:
    Bugfixes und Erweiterungen:
	See ChangeLog all Release Notes: https://github.com/joBr99/nspanel-lovelace-ui/wiki/Release-Notes
 
        - 08.11.2023 - v4.3.3    Upgrade TFT 53 / 4.3.3
        - 11.11.2023 - v4.3.3.1  Fix for Issues #1020 HandleHardwareButton buttonConfig.mode -> 'toggle' and 'set'
        - 12.11.2023 - v4.3.3.2  Add autoCreateALias to cardUnlock
        - 12.11.2023 - v4.3.3.2  Change NodeJS to at least v18.X.X
        - 13.11.2023 - v4.3.3.3  if setOption = false, do not create autoAlias (Functional/Servicemenu) and Datapoints
        - 15.11.2023 - v4.3.3.4  New Service Page -> ioBroker Info 
        - 16.11.2023 - v4.3.3.5  Add Multilingualism to Service Menu (39 languages)
     	- 17.11.2023 - v4.3.3.5  Add Multilingualism to cardUnlock, cardQR, popupFan, popupTimer (39 languages)
        - 18.11.2023 - v4.3.3.6  Add autoCreateALias to PageAlarm
        - 20.11.2023 - v4.3.3.6  Add actionStringArray to PageAlarm
        - 20.11.2023 - v4.3.3.6  Add Multilingualism to cardAlarm (39 languages)
        - 20.11.2023 - v4.3.3.7  Add Multilingualism to cardMedia (39 languages)
        - 20.11.2023 - v4.3.3.8  Add Method dayjs (Multilingualism)
        - 20.11.2023 - v4.3.3.9  Add ScreensaverEntityOnColor, ...OffColor, ...OnText, ...OffText
        - 23.11.2023 - v4.3.3.10 Code Optimization in Config Area
        - 24.11.2023 - v4.3.3.11 Add autoCreateALias to PageQR
        - 24.11.2023 - v4.3.3.12 Separation of page creation and page updates in cardPower
        - 24.11.2023 - v4.3.3.12 Add alwaysOnDisplay to cardPower - Leave display on if the alwaysOnDisplay parameter is "true"
        - 25.11.2023 - v4.3.3.13 Separation of page creation and page updates in cardMedia
        - 25.11.2023 - v4.3.3.13 Add alwaysOnDisplay to cardMedia - Leave display on if the alwaysOnDisplay parameter is "true"
        - 25.11.2023 - v4.3.3.13 Fix Sonos Repeat/Shuffle
        - 25.11.2023 - v4.3.3.14 Refactoring Sonos-Player (with Playlist, Tracklist, Favorites, Eqalizer (if no Favorites))
        - 29.11.2023 - v4.3.3.15 Fix cardMedia Volume-Slider / Add Init Release to Startup
        - 30.11.2023 - v4.3.3.16 Beautification of the Sonos player Strings / Add Duration & Elapsed
        - 01.12.2023 - v4.3.3.16 Fix Datapoints with Value null 
        - 02.12.2023 - v4.3.3.16 Request replaced by Axios
        - 04.12.2023 - v4.3.3.17 Add SEEK and CROSSFADE to Sonos cardMedia
        - 05.12.2023 - v4.3.3.18 Add (ELAPSED/DURATION) to v2Adapter alexa2
        - 06.12.2023 - v4.3.3.18 Replace missing Type console.log --> log(message, 'serverity')
        - 07.12.2023 - v4.3.3.19 Fix Trigger activeDimmodeBrightness if Dimmode = -1
        - 08.12.2023 - v4.3.3.20 add Role AlarmTime for Alarm Clock
        - 09.12.2023 - v4.3.3.21 Add createAutoAlias to popupTimer only for Time
        - 14.12.2023 - v4.3.3.22 Add UpdateMessage => disable the update messages
        - 14.12.2023 - v4.3.3.22 Fix name by static Navi Icon 
        - 17.12.2023 - v4.3.3.23 Optimization of the blind control (enable or disable Up/Stop/Down)
        - 18.12.2023 - v4.3.3.24 Hotfix Update Message / Add Icon Colors to Entity Button
        - 21.12.2023 - v4.3.3.25 Add switch of cardQR by hidePassword: true 
        - 26.12.2023 - v4.3.3.26 Fix Log output payload -> Json.stringify
        - 28.12.2023 - v4.3.3.27 Fix Payload (pageItem.id -> placeId) by Function CreateEntity
        - 28.12.2023 - v4.3.3.27 Fix Fallback PageItem.name by Function CreateEntity --> Many Bugs
        - 30.12.2023 - v4.3.3.28 Fix short ID's in v4.3.3.27
        - 30.12.2023 - v4.3.3.28 Fix window Icons in CreateEntity 
        - 30.12.2023 - v4.3.3.28 Add MQTT-Client Check
        - 02.01.2024 - v4.3.3.29 Add Tasmota Buzzer for NotifyPage
        - 02.02.2024 - v4.3.3.29 Fix ThermoPage -> UnSubScribsWatcher
        - 02.02.2024 - v4.3.3.30 Add stronger config type checks
        - 03.02.2024 - v4.3.3.31 Remove: autoCreateAlias from cardMedia
        - 03.02.2024 - v4.3.3.31 Remove: adapterPlayerInstance from every card except cardMedia
        - 03.02.2024 - v4.3.3.31 [dev]: optional with type - cardMedia has adapterPlayerInstance all other not 
        - 03.02.2024 - v4.3.3.31 [dev]: add PlayerType some more work to do
        - 03.02.2024 - v4.3.3.31 changed: adapterPlayerInstance instance 0-9 allowed. Always require a '.' at the end.        
        - 04.01.2024 - v4.3.3.32 Hotfix Spotify
        - 04.01.2024 - v4.3.3.32 [DEV] Add Types see commits
        - 04.01.2024 - v4.3.3.32 Add more details to types for: leftScreensaverEntity, indicatorScreensaverEntity, PageThermo, PageMedia 
        - 04.01.2024 - v4.3.3.32 Remove not uses propertys from PageItem
        - 05.01.2024 - v4.3.3.32 Add Body for BoseSoundtouch-Player
        - 05.01.2024 - v4.3.3.33 Add BoseSoundtouch Functions
        - 05.01.2024 - v4.3.3.33 Screensaver Fix max Number of indicatorScreensaverEntity 
        - 07.01.2024 - v4.3.3.33 Fix BoseSoundtouch Proto
        - 08.01.2024 - v4.3.3.34 Fix: Disabled Icon Status while bug in updating data points in ioBroker (reason unknown)
        - 08.01.2024 - v4.3.3.35 Add: relay.1/relay.2 show the confirmed status
        - 09.01.2024 - v4.3.3.36 Fix: change ScreensaverTimeout and activeBrightness
        - 09.01.2024 - v4.3.3.36 Fix: schedule SendTime
        - 09.01.2024 - v4.3.3.36 Fix: Function _schedule SummerTime/WinterTime
        - 15.01.2024 - v4.3.3.37 Change: Allow data points to be flushed for popUpNotify. Activate screensaver with one click.
        - 16.01.2024 - v4.3.3.38 Fix: joBr99#1098
        - 16.01.2024 - v4.3.3.38 Types: Number of PageItems defined & HandleScreensaverStatusIcons rewritten
        - 16.01.2024 - v4.3.3.38 Optimate: function SendTime()
        - 17.01.2024 - v4.3.3.38 Add: ScreensaverEntityIconSelect for MRIcons is like common.states for states.
        - 17.01.2024 - v4.3.3.38 Add: Changing the ScreensaverEntityValue value updates the screensaver.
        - 19.01.2024 - v4.3.3.38 Change: yAxisTicks parameter is not required in cardLChart PageItem
        - 20.01.2024 - v4.3.3.38 Add: click on indicatorIcon navigate to Page
        - 23.01.2024 - v4.3.3.39 Add: Optional setOn & setOff for HW button with mode 'set'
        - 28.01.2024 - v4.3.3.39 Fix: ack for read-only state
        - 03.02.2024 - v4.3.3.40 Fix: RGB maxValueColorTemp
        - 05.02.2024 - v4.3.3.40 Fix: SqueezeboxRPC-Media-Player and add some Functions
        - 06.02.2024 - v4.3.3.41 Fix: activeBrightness -> null
        - 06.02.2024 - v4.3.3.41 Fix: bHome -> corrected PageId
        - 07.02.2024 - v4.3.3.42 Minor Fixes
        - 09.02.2024 - v4.3.3.42 Change pageId with Alias in Communication with HMI
        - 09.02.2024 - v4.3.3.42 Spotify Media-Player: Dynamic loading of the speaker list, playlist, tracklist, fix repeat, add seek, add elapsed/duration
        - 10.02.2024 - v4.3.3.42 Spotify Minor Fixes; Add miValue / maxValue to Volume-Slider
        - 10.02.2024 - v4.3.3.43 Fix: cardGrid2 => 9 Entities for Layout 'us-p' issue #1167
	- 11.02.2024 - v4.3.3.43 Fix VolumeSlider
        - 05.05.2024 - v4.3.3.44 Fix MQTT-Port-check
        - 13.05.2024 - v4.4.0.0  TFT 54 / 4.4.0
        - 19.05.2024 - v4.4.0.1  TFT 53 / 4.4.0
        - 13.06.2024 - v4.4.0.2  Calculated energy consumption in relation to dimming mode and relay state (not the energy consumption of the outputs)
        - 13.06.2024 - v4.4.0.3  Check prefix '.tele.' in config.NSPanelReceiveTopic
        - 13.09.2024 - v4.4.0.4  New Feature: Hidden Carts

        Todo:
        - XX.12.2024 - v5.0.0    ioBroker Adapter
	
***************************************************************************************************************
* DE: Für die Erstellung der Aliase durch das Skript, muss in der JavaScript Instanz "setObject" gesetzt sein! *
* EN: In order for the script to create the aliases, “setObject” must be set in the JavaScript instance!       *
***************************************************************************************************************

Wenn Rule definiert, dann können die Hardware-Tasten ebenfalls für Seitensteuerung (dann nicht mehr als Relais) genutzt werden

Tasmota Konsole:
    Rule2 on Button1#state do Publish %topic%/tele/RESULT {"CustomRecv":"event,button1"} endon on Button2#state do Publish %topic%/tele/RESULT {"CustomRecv":"event,button2"} endon
    Rule2 1 (Rule aktivieren)
    Rule2 0 (Rule deaktivieren)

Mögliche Seiten-Ansichten:
    screensaver Page    - wird nach definiertem Zeitraum (config) mit Dimm-Modus aktiv (Uhrzeit, Datum, Aktuelle Temperatur mit Symbol)
                          (die 4 kleineren Icons können als Wetter-Vorschau + 4Tage (Symbol + Höchsttemperatur) oder zur Anzeige definierter Infos konfiguriert werden)
    cardEntities Page   - 4 vertikale angeordnete Steuerelemente - auch als Subpage
    cardGrid Page       - 6 horizontal angeordnete Steuerelemente in 2 Reihen a 3 Steuerelemente - auch als Subpage
    cardGrid2 Page      - 8 horizontal angeordnete Steuerelemente in 2 Reihen a 4 Steuerelemente bzw. beim US-Modell im Portrait-Modus
                          9 horizontal angeordnete Steuerelemente in 3 Reihen a 3 Steuerelemente - auch als Subpage    
    cardThermo Page     - Thermostat mit Solltemperatur, Isttemperatur, Mode - Weitere Eigenschaften können im Alias definiert werden
    cardMedia Page      - Mediaplayer - Ausnahme: Alias sollte mit Alias-Manager automatisch über Alexa-Verzeichnis Player angelegt werden
    cardAlarm Page      - Alarmseite mit Zustand und Tastenfeld
    cardPower Page      - Energiefluss
    cardChart Page      - Balken-Diagramme aus History, SQL oder InfluxDB
    cardLChart Page     - Linien-Diagramme aus History, SQL oder InfluxDB

    Vollständige Liste zur Einrichtung unter:
    https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-Card-Definitionen-(Seiten)

Popup-Pages:
    popupLight Page     - in Abhängigkeit zum gewählten Alias werden "Helligkeit", "Farbtemperatur" und "Farbauswahl" bereitgestellt
    popupShutter Page   - die Shutter-Position (Rollo, Jalousie, Markise, Leinwand, etc.) kann über einen Slider verändert werden.
    popupNotify Page    - Info - Seite mit Headline Text und Buttons - Intern für manuelle Updates / Extern zur Befüllung von Datenpunkten unter 0_userdata
    screensaver Notify  - Über zwei externe Datenpunkte in 0_userdata können "Headline" und "Text" an den Screensaver zur Info gesendet werden
    popupInSel Page     - Auswahlliste (InputSelect)

Mögliche Aliase: (Vorzugsweise mit ioBroker-Adapter "Geräte verwalten" konfigurieren, da SET, GET, ACTUAL, etc. verwendet werden)
    Info                - Werte aus Datenpunkt
    Schieberegler       - Slider numerische Werte (SET/ACTUAL)
    Lautstärke          - Volume (SET/ACTUAL) und MUTE
    Lautstärke-Gruppe   - analog Lautstärke
    Licht               - An/Aus (Schalter)
    Steckdose           - An/Aus (Schalter)
    Dimmer              - An/Aus, Brightness
    Farbtemperatur      - An/Aus, Farbtemperatur und Brightness
    HUE-Licht           - Zum Schalten von Color-Leuchtmitteln über HUE-Wert, Brightness, Farbtemperatur, An/Aus (HUE kann auch fehlen)
    RGB-Licht           - RGB-Leuchtmitteln/Stripes welche Rot/Grün/ und Blau separat benötigen (Tasmota, WifiLight, etc.) + Brightness, Farbtemperatur
    RGB-Licht-einzeln   - RGB-Leuchtmitteln/Stripes welche HEX-Farbwerte benötigen (Tasmota, WifiLight, etc.) + Brightness, Farbtemperatur
    Jalousien           - Up, Stop, Down, Position
    Fenster             - Sensor open
    Tür                 - Sensor open
    Tor                 - Sensor open
    Bewegung            - Sensor Presence
    Verschluss          - Türschloss SET/ACTUAL/OPEN
    Taste               - Für Szenen oder Radiosender, etc. --> Nur Funktionsaufruf - Kein Taster wie MonoButton - True/False
    Tastensensor        - Für Auswahlmenü (popupInSel)
    Thermostat          - Aktuelle Raumtemperatur, Setpoint, etc.
    Temperatur          - Temperatur aus Datenpunkt, analog Info
    Klimaanlage         - Buttons zur Steuerung der Klimaanlage im unteren Bereich
    Temperatur          - Anzeige von Temperatur - Datenpunkten, analog Info
    Feuchtigkeit        - Anzeige von Humidity - Datenpunkten, analog Info
    Medien              - Steuerung von Alexa, etc. - Über Alias-Manager im Verzeichnis Player automatisch anlegen (Geräte-Manager funktioniert nicht)
    Wettervorhersage    - Aktuelle Außen-Temperatur (Temp) und aktuelles AccuWeather-Icon (Icon) für Screensaver
    Warnung             - Abfall, etc. -- Info mit IconColor

    Timer (siehe Wiki)

    Vollständige Liste zur Einrichtung unter:
    https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-ALIAS-Definitionen

Interne Sonoff-Sensoren (über Tasmota):
    ESP-Temperatur      - wird in 0_userdata.0. abgelegt, kann als Alias importiert werden --> SetOption146 1
    Temperatur          - Raumtemperatur - wird in 0_userdata.0. abgelegt, kann als Alias importiert werden
                          (!!! Achtung: der interne Sonoff-Sensor liefert keine exakten Daten, da das NSPanel-Board und der ESP selbst Hitze produzieren !!!
                          ggf. Offset einplanen oder besser einen externen Sensor über Zigbee etc. verwenden)
    Timestamp           - wird in 0_userdata.0. Zeitpunkt der letzten Sensorübertragung

Tasmota-Status0 - (zyklische Ausführung)
    liefert relevanten Tasmota-Informationen und kann bei Bedarf in "function get_tasmota_status0()" erweitert werden. Daten werden in 0_userdata.0. abgelegt

Erforderliche Adapter:

    AccuWeather oder DasWetter: - Bei Nutzung der Wetterfunktionen (und zur Icon-Konvertierung) im Screensaver
    Alexa2:                     - Bei Nutzung der dynamischen SpeakerList in der cardMedia
    Geräte verwalten            - Für Erstellung der Aliase
    MQTT-Adapter                - Für Kommunikation zwischen Skript und Tasmota
    JavaScript-Adapter

Upgrades in Konsole:
    Tasmota BerryDriver     : Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1
    TFT EU STABLE Version   : FlashNextion http://nspanel.pky.eu/lovelace-ui/github/nspanel-v4.4.0.tft
---------------------------------------------------------------------------------------
*/


/******************************* Begin CONFIG Parameter *******************************/

// DE: liefert bei true detailliertere Meldundgen im Log.
// EN: if true, provides more detailed messages in the log.
let Debug: boolean = false;


/***** 1. Tasmota-Config *****/

    // DE: Anpassen an die Verzeichnisse der MQTT-Adapter-Instanz
    // EN: Adapt to the MQTT adapter instance directories
    const NSPanelReceiveTopic: string = 'mqtt.0.SmartHome.NSPanel_1.tele.RESULT';
    const NSPanelSendTopic: string = 'mqtt.0.SmartHome.NSPanel_1.cmnd.CustomSend';

    // DE: nur ändern, falls der User im Tasmota vor dem Kompilieren umbenannt wurde (Standard Tasmota: admin)
    // EN: only change if the user was renamed in Tasmota before compiling (default Tasmota: admin)
    const tasmota_web_admin_user: string = 'admin';
    
    // DE: setzten, falls "Web Admin Password" in Tasmota vergeben
    // EN set if "Web Admin Password" is assigned in Tasmota
    const tasmota_web_admin_password: string = '';

    // DE: Setzen der bevorzugten Tasmota32-Version (für Updates)
    // EN: Set preferred Tasmota32 version (for updates)
    const tasmotaOtaVersion: string = 'tasmota32-DE.bin';
        // DE: Es können ebenfalls andere Versionen verwendet werden wie zum Beispiel:
        // EN: Other versions can also be used, such as:
        // 'tasmota32-nspanel.bin' or 'tasmota32.bin' or 'tasmota32-DE.bin' or etc.


/***** 2. Directories in 0_userdata.0... *****/

    // DE: Anpassen an das jeweilige NSPanel
    // EN: Adapt to the respective NSPanel
    const NSPanel_Path = '0_userdata.0.NSPanel.1.';

    // DE: Pfad für gemeinsame Nutzung durch mehrere Panels (bei Nutzung der cardAlarm/cardUnlock)
    // EN: Path for sharing between multiple panels (when using cardAlarm/cardUnlock)
    const NSPanel_Alarm_Path = '0_userdata.0.NSPanel.';


/***** 3. Weather adapter Config *****/

    // DE: Mögliche Wetteradapter 'accuweather.0.' oder 'daswetter.0.'
    // EN: Possible weather adapters 'accuweather.0.' or 'the weather.0.'
    const weatherAdapterInstance: string = 'accuweather.0.';
    
    // DE: Mögliche Werte: 'Min', 'Max' oder 'MinMax' im Screensaver
    // EN: Possible values: 'Min', 'Max' or 'MinMax' in the screensaver
    const weatherScreensaverTempMinMax: string = 'MinMax';

    // DE: Dieser Alias wird automatisch für den gewählten Wetter erstellt und kann entsprechend angepasst werden
    // EN: This alias is automatically created for the selected weather and can be adjusted accordingly
    const weatherEntityPath: string = 'alias.0.Wetter';


/***** 4. Color constants for use in the PageItems *****/

    // DE: Bei Bedarf können weitere Farben definiert werden
    // EN: If necessary, additional colors can be defined
    const HMIOff:           RGB = { red:  68, green: 115, blue: 158 };     // Blue-Off - Original Entity Off
    const HMIOn:            RGB = { red:   3, green: 169, blue: 244 };     // Blue-On
    const HMIDark:          RGB = { red:  29, green:  29, blue:  29 };     // Original Background Color
    const Off:              RGB = { red: 253, green: 128, blue:   0 };     // Orange-Off - nicer color transitions
    const On:               RGB = { red: 253, green: 216, blue:  53 };
    const MSRed:            RGB = { red: 251, green: 105, blue:  98 };
    const MSYellow:         RGB = { red: 255, green: 235, blue: 156 };
    const MSGreen:          RGB = { red: 121, green: 222, blue: 121 };
    const Red:              RGB = { red: 255, green:   0, blue:   0 };
    const White:            RGB = { red: 255, green: 255, blue: 255 };
    const Yellow:           RGB = { red: 255, green: 255, blue:   0 };
    const Green:            RGB = { red:   0, green: 255, blue:   0 };
    const Blue:             RGB = { red:   0, green:   0, blue: 255 };
    const DarkBlue:         RGB = { red:   0, green:   0, blue: 136 };
    const Gray:             RGB = { red: 136, green: 136, blue: 136 };
    const Black:            RGB = { red:   0, green:   0, blue:   0 };
    const Cyan:             RGB = { red:   0, green: 255, blue: 255 };
    const Magenta:          RGB = { red: 255, green:   0, blue: 255 };
    const colorSpotify:     RGB = { red:  30, green: 215, blue:  96 };
    const colorAlexa:       RGB = { red:  49, green: 196, blue: 243 };
    const colorSonos:       RGB = { red: 216, green: 161, blue:  88 };
    const colorRadio:       RGB = { red: 255, green: 127, blue:   0 };
    const BatteryFull:      RGB = { red:  96, green: 176, blue:  62 };
    const BatteryEmpty:     RGB = { red: 179, green:  45, blue:  25 };

    //Menu Icon Colors
    const Menu:             RGB = { red: 150, green: 150, blue: 100 };
    const MenuLowInd:       RGB = { red: 255, green: 235, blue: 156 };
    const MenuHighInd:      RGB = { red: 251, green: 105, blue:  98 };

    //Dynamische Indikatoren (Abstufung grün nach gelb nach rot)
    const colorScale0:      RGB = { red:  99, green: 190, blue: 123 };
    const colorScale1:      RGB = { red: 129, green: 199, blue: 126 };
    const colorScale2:      RGB = { red: 161, green: 208, blue: 127 };
    const colorScale3:      RGB = { red: 129, green: 217, blue: 126 };
    const colorScale4:      RGB = { red: 222, green: 226, blue: 131 };
    const colorScale5:      RGB = { red: 254, green: 235, blue: 132 };
    const colorScale6:      RGB = { red: 255, green: 210, blue: 129 };
    const colorScale7:      RGB = { red: 251, green: 185, blue: 124 };
    const colorScale8:      RGB = { red: 251, green: 158, blue: 117 };
    const colorScale9:      RGB = { red: 248, green: 131, blue: 111 };
    const colorScale10:     RGB = { red: 248, green: 105, blue: 107 };

    //Screensaver Default Theme Colors
    const scbackground:     RGB = { red:   0, green:   0, blue:   0};
    const scbackgroundInd1: RGB = { red: 255, green:   0, blue:   0};
    const scbackgroundInd2: RGB = { red: 121, green: 222, blue: 121};
    const scbackgroundInd3: RGB = { red: 255, green: 255, blue:   0};
    const sctime:           RGB = { red: 255, green: 255, blue: 255};
    const sctimeAMPM:       RGB = { red: 255, green: 255, blue: 255};
    const scdate:           RGB = { red: 255, green: 255, blue: 255};
    const sctMainIcon:      RGB = { red: 255, green: 255, blue: 255};
    const sctMainText:      RGB = { red: 255, green: 255, blue: 255};
    const sctForecast1:     RGB = { red: 255, green: 255, blue: 255};
    const sctForecast2:     RGB = { red: 255, green: 255, blue: 255};
    const sctForecast3:     RGB = { red: 255, green: 255, blue: 255};
    const sctForecast4:     RGB = { red: 255, green: 255, blue: 255};
    const sctF1Icon:        RGB = { red: 255, green: 235, blue: 156};
    const sctF2Icon:        RGB = { red: 255, green: 235, blue: 156};
    const sctF3Icon:        RGB = { red: 255, green: 235, blue: 156};
    const sctF4Icon:        RGB = { red: 255, green: 235, blue: 156};
    const sctForecast1Val:  RGB = { red: 255, green: 255, blue: 255};
    const sctForecast2Val:  RGB = { red: 255, green: 255, blue: 255};
    const sctForecast3Val:  RGB = { red: 255, green: 255, blue: 255};
    const sctForecast4Val:  RGB = { red: 255, green: 255, blue: 255};
    const scbar:            RGB = { red: 255, green: 255, blue: 255};
    const sctMainIconAlt:   RGB = { red: 255, green: 255, blue: 255};
    const sctMainTextAlt:   RGB = { red: 255, green: 255, blue: 255};
    const sctTimeAdd:       RGB = { red: 255, green: 255, blue: 255};

    //Auto-Weather-Colors
    const swClearNight:     RGB = { red: 150, green: 150, blue: 100};
    const swCloudy:         RGB = { red:  75, green:  75, blue:  75};
    const swExceptional:    RGB = { red: 255, green:  50, blue:  50};
    const swFog:            RGB = { red: 150, green: 150, blue: 150};
    const swHail:           RGB = { red: 200, green: 200, blue: 200};
    const swLightning:      RGB = { red: 200, green: 200, blue:   0};
    const swLightningRainy: RGB = { red: 200, green: 200, blue: 150};
    const swPartlycloudy:   RGB = { red: 150, green: 150, blue: 150};
    const swPouring:        RGB = { red:  50, green:  50, blue: 255};
    const swRainy:          RGB = { red: 100, green: 100, blue: 255};
    const swSnowy:          RGB = { red: 150, green: 150, blue: 150};
    const swSnowyRainy:     RGB = { red: 150, green: 150, blue: 255};
    const swSunny:          RGB = { red: 255, green: 255, blue:   0};
    const swWindy:          RGB = { red: 150, green: 150, blue: 150};


/***** 5. Script - Parameters *****/
 
    // DE: Für diese Option muss der Haken in setObjects in deiner javascript.X. Instanz gesetzt sein.
    // EN: This option requires the check mark in setObjects in your javascript.X. instance must be set.
    const autoCreateAlias = true;

    // DE: Verzeichnis für Auto-Aliase (wird per Default aus dem NSPanel-Verzeichnis gebildet und muss nicht verändert werden)
    // EN: Directory for auto aliases (is created by default from the NSPanel directory and does not need to be changed)
    const AliasPath: string = 'alias.0.' + NSPanel_Path.substring(13, NSPanel_Path.length);

    // DE: Default-Farbe für Off-Zustände
    // EN: Default color for off states
    const defaultOffColorParam: any = Off;
    
    // DE: Default-Farbe für On-Zustände
    // EN: Default color for on states
    const defaultOnColorParam: any = On;

    const defaultColorParam: any = Off;
    
    // DE: Default-Hintergrundfarbe HMIDark oder Black
    // EN: Default background color HMIDark or Black
    const defaultBackgroundColorParam: any = HMIDark;

/******************************** End CONFIG Parameter ********************************/

//-- Anfang für eigene Seiten -- z.T. selbstdefinierte Aliase erforderlich ----------------
//-- Start for your own pages -- some self-defined aliases required ----------------
  
	//-- https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Page-%E2%80%90-Typen_How-2_Beispiele

//-- ENDE für eigene Seiten -- z.T. selbstdefinierte Aliase erforderlich -------------------------
//-- END for your own pages -- some self-defined aliases required ------------------------


/***********************************************************************************************
 **  Service Pages mit Auto-Alias (Nachfolgende Seiten werden mit Alias automatisch angelegt) **
 **  https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Service-Men%C3%BC             **
 ***********************************************************************************************/

/* DE: German
   Wenn das Service Menü abgesichert werden soll, kann eine cardUnlock vorgeschaltet werden. 
   Für diesen Fall ist folgende Vorgehensweise erforderlich:
   - cardUnlock Seite "Unlock_Service" in der Config unter pages auskommentieren ("//" entfernen)
   - Servicemenü aus pages "NSPanel_Service" unter pages kommentieren ("//" hinzufügen)
*/ 

/*************************************************************************************************
  ** Service pages with auto alias (subsequent pages are automatically created with alias)      **
  ** https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Service-Men%C3%BC               **
  ************************************************************************************************/

/* EN: English
    If the service menu needs to be secured, a cardUnlock can be installed upstream.
    In this case, the following procedure is required:
    - comment out cardUnlock page "Unlock_Service" in the config under pages (remove "//")
    - Comment service menu from pages "NSPanel_Service" under pages (add "//")
*/

//Level 0 (if service pages are used with cardUnlock)
let Unlock_Service: PageType = 
{
    'type': 'cardUnlock',
    'heading': findLocaleServMenu('service_pages'),
    'useColor': true,
    'items': [/*PageItem*/{ id: 'alias.0.NSPanel.Unlock',
                          targetPage: 'NSPanel_Service_SubPage',
                          autoCreateALias: true }
    ]
};

//Level_0 (if service pages are used without cardUnlock)
let NSPanel_Service: PageType = 
{
    'type': 'cardEntities',
    'heading': findLocaleServMenu('service_menu'),
    'useColor': true,
    'items': [
        /*PageItem*/{ navigate: true, id: 'NSPanel_Infos', icon: 'information-outline', offColor: Menu, onColor: Menu, name: findLocaleServMenu('infos'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ navigate: true, id: 'NSPanel_Einstellungen', icon: 'monitor-edit', offColor: Menu, onColor: Menu, name: findLocaleServMenu('settings'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ navigate: true, id: 'NSPanel_Firmware', icon: 'update', offColor: Menu, onColor: Menu, name: findLocaleServMenu('firmware'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ id: AliasPath + 'Config.rebootNSPanel', name: findLocaleServMenu('reboot') ,icon: 'refresh', offColor: MSRed, onColor: MSGreen, buttonText: findLocaleServMenu('start')},
    ]
};

//Level_0 (if service pages are used with cardUnlock)
let NSPanel_Service_SubPage: PageType = 
{
    'type': 'cardEntities',
    'heading': findLocaleServMenu('service_menu'),
    'useColor': true,
    'subPage': true,
    'parent': Unlock_Service,
    'home': 'Unlock_Service', 
    'items': [
        /*PageItem*/{ navigate: true, id: 'NSPanel_Infos', icon: 'information-outline', offColor: Menu, onColor: Menu, name: findLocaleServMenu('infos'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ navigate: true, id: 'NSPanel_Einstellungen', icon: 'monitor-edit', offColor: Menu, onColor: Menu, name: findLocaleServMenu('settings'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ navigate: true, id: 'NSPanel_Firmware', icon: 'update', offColor: Menu, onColor: Menu, name: findLocaleServMenu('firmware'), buttonText: findLocaleServMenu('more')},
        /*PageItem*/{ id: AliasPath + 'Config.rebootNSPanel', name: findLocaleServMenu('reboot') ,icon: 'refresh', offColor: MSRed, onColor: MSGreen, buttonText: findLocaleServMenu('start')},
    ]
};

        //Level_1
        let NSPanel_Infos: PageType = 
        {
            'type': 'cardEntities',
            'heading': findLocaleServMenu('nspanel_infos'),
            'useColor': true,
            'subPage': true,
            'parent': NSPanel_Service,
            'home': 'NSPanel_Service',        
            'items': [
                /*PageItem*/{ navigate: true, id: 'NSPanel_Wifi_Info_1', icon: 'wifi', offColor: Menu, onColor: Menu, name: findLocaleServMenu('wifi'), buttonText: findLocaleServMenu('more')},
                /*PageItem*/{ navigate: true, id: 'NSPanel_Sensoren', icon: 'memory', offColor: Menu, onColor: Menu, name: findLocaleServMenu('sensors_hardware'), buttonText: findLocaleServMenu('more')},
                /*PageItem*/{ navigate: true, id: 'NSPanel_IoBroker', icon: 'information-outline', offColor: Menu, onColor: Menu, name: findLocaleServMenu('info_iobroker'), buttonText: findLocaleServMenu('more')},
                /*PageItem*/{ id: AliasPath + 'Config.Update.UpdateMessage', name: findLocaleServMenu('update_message') ,icon: 'message-alert-outline', offColor: HMIOff, onColor: MSGreen},
            ]
        };
                //Level_2
                let NSPanel_Wifi_Info_1: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('nspanel_wifi1'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Infos,
                    'next': 'NSPanel_Wifi_Info_2',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'ipAddress', name: findLocaleServMenu('ip_address'), icon: 'ip-network-outline', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.BSSId', name: findLocaleServMenu('mac_address'), icon: 'check-network', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.RSSI', name: findLocaleServMenu('rssi'), icon: 'signal', unit: '%', colorScale: {'val_min': 100, 'val_max': 0} },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.Signal', name: findLocaleServMenu('wifi_signal'), icon: 'signal-distance-variant', unit: 'dBm', colorScale: {'val_min': 0, 'val_max': -100} },
                    ]
                };

                let NSPanel_Wifi_Info_2: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('nspanel_wifi2'),
                    'useColor': true,
                    'subPage': true,
                    'prev': 'NSPanel_Wifi_Info_1',
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.SSId', name: findLocaleServMenu('ssid'), icon: 'signal-distance-variant', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.Mode', name: findLocaleServMenu('mode'), icon: 'signal-distance-variant', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.Channel', name: findLocaleServMenu('channel'), icon: 'timeline-clock-outline', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Wifi.AP', name: findLocaleServMenu('accesspoint'), icon: 'router-wireless-settings', offColor: Menu, onColor: Menu },
                    ]
                };

                let NSPanel_Sensoren: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('sensors1'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Infos,
                    'next': 'NSPanel_Hardware',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Sensor.ANALOG.Temperature', name: findLocaleServMenu('room_temperature'), icon: 'home-thermometer-outline', unit: '°C', colorScale: {'val_min': 0, 'val_max': 40, 'val_best': 22 } },
                        /*PageItem*/{ id: AliasPath + 'Sensor.ESP32.Temperature', name: findLocaleServMenu('esp_temperature'), icon: 'thermometer', unit: '°C', colorScale: {'val_min': 0, 'val_max': 100, 'val_best': 50 } },
                        /*PageItem*/{ id: AliasPath + 'Sensor.TempUnit', name: findLocaleServMenu('temperature_unit'), icon: 'temperature-celsius', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Sensor.Time', name: findLocaleServMenu('refresh'), icon: 'clock-check-outline', offColor: Menu, onColor: Menu },
                    ]
                };

                let NSPanel_Hardware: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('hardware2'),
                    'useColor': true,
                    'subPage': true,
                    'prev': 'NSPanel_Sensoren',
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Product', name: findLocaleServMenu('product'), icon: 'devices', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Hardware', name: findLocaleServMenu('esp32_hardware'), icon: 'memory', offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Display.Model', name: findLocaleServMenu('nspanel_version'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Uptime', name: findLocaleServMenu('operating_time'), icon: 'timeline-clock-outline', offColor: Menu, onColor: Menu },
                    ]
                };

                let NSPanel_IoBroker: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('info_iobroker'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Infos,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'IoBroker.ScriptVersion', name: findLocaleServMenu('script_version_nspanelts'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'IoBroker.NodeJSVersion', name: findLocaleServMenu('nodejs_version'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'IoBroker.JavaScriptVersion', name: findLocaleServMenu('instance_javascript'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'IoBroker.ScriptName', name: findLocaleServMenu('scriptname'), offColor: Menu, onColor: Menu },
                    ]
                };

        //Level_1
        let NSPanel_Einstellungen: PageType = 
            {
                'type': 'cardGrid',
                'heading': findLocaleServMenu('settings'),
                'useColor': true,
                'subPage': true,
                'parent': NSPanel_Service,
                'home': 'NSPanel_Service',
                'items': [
                    /*PageItem*/{ navigate: true, id: 'NSPanel_Screensaver', icon: 'monitor-dashboard',offColor: Menu, onColor: Menu, name: findLocaleServMenu('screensaver'), buttonText: findLocaleServMenu('more')},
                    /*PageItem*/{ navigate: true, id: 'NSPanel_Relays', icon: 'electric-switch', offColor: Menu, onColor: Menu, name: findLocaleServMenu('relays'), buttonText: findLocaleServMenu('more')},
                    /*PageItem*/{ id:AliasPath + 'Config.temperatureUnitNumber', icon: 'gesture-double-tap', name: findLocaleServMenu('temp_unit'), offColor: Menu, onColor: Menu, 
                    modeList: ['°C', '°F', 'K']},
                    /*PageItem*/{ id: AliasPath + 'Config.localeNumber', icon: 'select-place', name: findLocaleServMenu('language'), offColor: Menu, onColor: Menu, 
                    modeList: ['en-US', 'de-DE', 'nl-NL', 'da-DK', 'es-ES', 'fr-FR', 'it-IT', 'ru-RU', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'af-ZA', 'ar-SY', 
                               'bg-BG', 'ca-ES', 'cs-CZ', 'el-GR', 'et-EE', 'fa-IR', 'fi-FI', 'he-IL', 'hr-xx', 'hu-HU', 'hy-AM', 'id-ID', 'is-IS', 'lb-xx', 
                               'lt-LT', 'ro-RO', 'sk-SK', 'sl-SI', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-TW']},
                   /*PageItem*/{ navigate: true, id: 'NSPanel_Script', icon: 'code-json',offColor: Menu, onColor: Menu, name: findLocaleServMenu('script'), buttonText: findLocaleServMenu('more')},            
                ]
            };

                //Level_2
                let NSPanel_Screensaver: PageType = 
                {
                    'type': 'cardGrid',
                    'heading': findLocaleServMenu('screensaver'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Einstellungen,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverDimmode', icon: 'sun-clock', offColor: Menu, onColor: Menu, name: findLocaleServMenu('dimmode')},
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverBrightness', icon: 'brightness-5', offColor: Menu, onColor: Menu, name: findLocaleServMenu('brightness')},
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverLayout', icon: 'page-next-outline', offColor: Menu, onColor: Menu, name: findLocaleServMenu('layout')},
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverWeather', icon: 'weather-partly-rainy', offColor: Menu, onColor: Menu, name: findLocaleServMenu('weather')},
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverDateformat', icon: 'calendar-expand-horizontal', offColor: Menu, onColor: Menu, name: findLocaleServMenu('date_format')},
                        /*PageItem*/{ navigate: true, id: 'NSPanel_ScreensaverIndicators', icon: 'monitor-edit', offColor: Menu, onColor: Menu, name: findLocaleServMenu('indicators')}
                    ]
                };
                            
                        //Level_3
                        let NSPanel_ScreensaverDimmode: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('dimmode'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'Dimmode.brightnessDay', name: findLocaleServMenu('brightness_day'), icon: 'brightness-5', offColor: Menu, onColor: Menu, minValue: 5, maxValue: 10},
                                /*PageItem*/{ id: AliasPath + 'Dimmode.brightnessNight', name: findLocaleServMenu('brightness_night'), icon: 'brightness-4', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 4},
                                /*PageItem*/{ id: AliasPath + 'Dimmode.hourDay', name: findLocaleServMenu('hour_day'), icon: 'sun-clock', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 23},
                                /*PageItem*/{ id: AliasPath + 'Dimmode.hourNight', name: findLocaleServMenu('hour_night'), icon: 'sun-clock-outline', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 23}
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverBrightness: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('brightness'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'ScreensaverInfo.activeBrightness', name: findLocaleServMenu('brightness_activ'), icon: 'brightness-5', offColor: Menu, onColor: Menu, minValue: 20, maxValue: 100},
                                /*PageItem*/{ id: AliasPath + 'Config.Screensaver.timeoutScreensaver', name: findLocaleServMenu('screensaver_timeout'), icon: 'clock-end', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 60},
                                /*PageItem*/{ id: AliasPath + 'Config.Screensaver.screenSaverDoubleClick', name: findLocaleServMenu('wakeup_doublecklick') ,icon: 'gesture-two-double-tap', offColor: HMIOff, onColor: HMIOn}
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverLayout: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('layout'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'Config.Screensaver.alternativeScreensaverLayout', name: findLocaleServMenu('alternative_layout') ,icon: 'page-previous-outline', offColor: HMIOff, onColor: HMIOn},
                                /*PageItem*/{ id: AliasPath + 'Config.Screensaver.ScreensaverAdvanced', name: findLocaleServMenu('advanced_layout') ,icon: 'page-next-outline', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverWeather: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('weather_parameters'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'ScreensaverInfo.weatherForecast', name: findLocaleServMenu('weather_forecast_offon') ,icon: 'weather-sunny-off', offColor: HMIOff, onColor: HMIOn},
                                /*PageItem*/{ id: AliasPath + 'ScreensaverInfo.weatherForecastTimer', name: findLocaleServMenu('weather_forecast_change_switch') ,icon: 'devices', offColor: HMIOff, onColor: HMIOn},
                                /*PageItem*/{ id: AliasPath + 'ScreensaverInfo.entityChangeTime', name: findLocaleServMenu('weather_forecast_change_time'), icon: 'cog-sync', offColor: Menu, onColor: Menu, minValue: 15, maxValue: 60},
                                /*PageItem*/{ id: AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout', name: findLocaleServMenu('weather_forecast_icon_colors') ,icon: 'format-color-fill', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverDateformat: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('date_format'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'Config.Dateformat.Switch.weekday', name: findLocaleServMenu('weekday_large') ,icon: 'calendar-expand-horizontal', offColor: HMIOff, onColor: HMIOn},
                                /*PageItem*/{ id: AliasPath + 'Config.Dateformat.Switch.month', name: findLocaleServMenu('month_large') ,icon: 'calendar-expand-horizontal', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverIndicators: PageType = 
                        {
                            'type': 'cardEntities',
                            'heading': findLocaleServMenu('indicators'),
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                /*PageItem*/{ id: AliasPath + 'Config.MRIcons.alternateMRIconSize.1', name: findLocaleServMenu('mr_icon1_size') ,icon: 'format-size', offColor: HMIOff, onColor: HMIOn},
                                /*PageItem*/{ id: AliasPath + 'Config.MRIcons.alternateMRIconSize.2', name: findLocaleServMenu('mr_icon2_size') ,icon: 'format-size', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                //Level_2
                let NSPanel_Relays: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('relays'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Einstellungen,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Relay.1', name: findLocaleServMenu('relay1_onoff'), icon: 'power', offColor: HMIOff, onColor: HMIOn},
                        /*PageItem*/{ id: AliasPath + 'Relay.2', name: findLocaleServMenu('relay2_onoff'), icon: 'power', offColor: HMIOff, onColor: HMIOn},
                    ]
                };

                //Level_2
                let NSPanel_Script: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('script'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Einstellungen,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Config.ScripgtDebugStatus', name: findLocaleServMenu('debugmode_offon') ,icon: 'code-tags-check', offColor: HMIOff, onColor: HMIOn},
                        /*PageItem*/{ id: AliasPath + 'Config.MQTT.portCheck', name: findLocaleServMenu('port_check_offon') ,icon: 'check-network', offColor: HMIOff, onColor: HMIOn},
                    ]
                };

        //Level_1
        let NSPanel_Firmware: PageType = 
            {
                'type': 'cardEntities',
                'heading': findLocaleServMenu('firmware'),
                'useColor': true,
                'subPage': true,
                'parent': NSPanel_Service,
                'home': 'NSPanel_Service',
                'items': [
                    /*PageItem*/{ id: AliasPath + 'autoUpdate', name: findLocaleServMenu('automatically_updates') ,icon: 'power', offColor: HMIOff, onColor: HMIOn},
                    /*PageItem*/{ navigate: true, id: 'NSPanel_FirmwareTasmota', icon: 'usb-flash-drive', offColor: Menu, onColor: Menu, name: findLocaleServMenu('tasmota_firmware'), buttonText: findLocaleServMenu('more')},
                    /*PageItem*/{ navigate: true, id: 'NSPanel_FirmwareBerry', icon: 'usb-flash-drive', offColor: Menu, onColor: Menu, name: findLocaleServMenu('berry_driver'), buttonText: findLocaleServMenu('more')},
                    /*PageItem*/{ navigate: true, id: 'NSPanel_FirmwareNextion', icon: 'cellphone-cog', offColor: Menu, onColor: Menu, name: findLocaleServMenu('nextion_tft_firmware'), buttonText: findLocaleServMenu('more')}
                ]
            };

                let NSPanel_FirmwareTasmota: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('tasmota'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Tasmota.Version', name: findLocaleServMenu('installed_release'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Tasmota_Firmware.onlineVersion', name: findLocaleServMenu('available_release'), offColor: Menu, onColor: Menu },                        
                        /*PageItem*/{ id: 'Divider' },
                        /*PageItem*/{ id: AliasPath + 'Config.Update.UpdateTasmota', name: findLocaleServMenu('update_tasmota') ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: findLocaleServMenu('start')},
                    ]
                };

                let NSPanel_FirmwareBerry: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('berry_driver'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Display.BerryDriver', name: findLocaleServMenu('installed_release'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Berry_Driver.onlineVersion', name: findLocaleServMenu('available_release'), offColor: Menu, onColor: Menu},                        
                        /*PageItem*/{ id: 'Divider' },
                        /*PageItem*/{ id: AliasPath + 'Config.Update.UpdateBerry', name: findLocaleServMenu('update_berry_driver') ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: findLocaleServMenu('start')},
                    ]
                };

                let NSPanel_FirmwareNextion: PageType = 
                {
                    'type': 'cardEntities',
                    'heading': findLocaleServMenu('nextion_tft'),
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        /*PageItem*/{ id: AliasPath + 'Display_Firmware.TFT.currentVersion', name: findLocaleServMenu('installed_release'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Display_Firmware.TFT.desiredVersion', name: findLocaleServMenu('desired_release'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Display.Model', name: findLocaleServMenu('nspanel_model'), offColor: Menu, onColor: Menu },
                        /*PageItem*/{ id: AliasPath + 'Config.Update.UpdateNextion', name: 'Nextion TFT Update' ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: findLocaleServMenu('start')},
                    ]
                };

// End of Service Pages

/***********************************************************************
 **                                                                   **
 **                           Configuration                           **
 **                                                                   **
 ***********************************************************************/

export const config: Config = {
    // Seiteneinteilung / Page division
    // Hauptseiten / Mainpages
    pages: [
        NSPanel_Service, //Auto-Alias Service Page
        //Unlock_Service            //Auto-Alias Service Page (Service Pages used with cardUnlock)
    ],
    // Unterseiten / Subpages
    subPages: [
        NSPanel_Service_SubPage, //Auto-Alias Service Page (only used with cardUnlock)
        NSPanel_Infos, //Auto-Alias Service Page
        NSPanel_Wifi_Info_1, //Auto-Alias Service Page
        NSPanel_Wifi_Info_2, //Auto-Alias Service Page
        NSPanel_Sensoren, //Auto-Alias Service Page
        NSPanel_Hardware, //Auto-Alias Service Page
        NSPanel_IoBroker, //Auot-Alias Service Page
        NSPanel_Einstellungen, //Auto-Alias Service Page
        NSPanel_Screensaver, //Auto-Alias Service Page
        NSPanel_ScreensaverDimmode, //Auto-Alias Service Page
        NSPanel_ScreensaverBrightness, //Auto-Alias Service Page
        NSPanel_ScreensaverLayout, //Auto-Alias Service Page
        NSPanel_ScreensaverWeather, //Auto-Alias Service Page
        NSPanel_ScreensaverDateformat, //Auto-Alias Service Page
        NSPanel_ScreensaverIndicators, //Auto-Alias Service Page
        NSPanel_Relays, //Auto-Alias Service Page
        NSPanel_Script, //Auto-Alias Service Page
        NSPanel_Firmware, //Auto-Alias Service Page
        NSPanel_FirmwareTasmota, //Auto-Alias Service Page
        NSPanel_FirmwareBerry, //Auto-Alias Service Page
        NSPanel_FirmwareNextion, //Auto-Alias Service Page
    ],

    /***********************************************************************
     **                                                                   **
     **                    Screensaver Configuration                      **
     **                                                                   **
     ***********************************************************************/
    leftScreensaverEntity: [
        // Examples for Advanced-Screensaver: https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-Config-Screensaver#entity-status-icons-ab-v400 
    ],
    
    bottomScreensaverEntity: [
        // bottomScreensaverEntity 1
        {
            ScreensaverEntity: 'accuweather.0.Daily.Day1.Sunrise',
            ScreensaverEntityFactor: 1,
            ScreensaverEntityDecimalPlaces: 0,
            ScreensaverEntityDateFormat: {hour: '2-digit', minute: '2-digit'}, // Description at Wiki-Pages
            ScreensaverEntityIconOn: 'weather-sunset-up',
            ScreensaverEntityIconOff: null,
            ScreensaverEntityText: 'Sonne',
            ScreensaverEntityUnitText: '%',
            ScreensaverEntityIconColor: MSYellow //{'val_min': 0, 'val_max': 100}
        },
        // bottomScreensaverEntity 2
        {
            ScreensaverEntity: 'accuweather.0.Current.WindSpeed',
            ScreensaverEntityFactor: (1000 / 3600),
            ScreensaverEntityDecimalPlaces: 1,
            ScreensaverEntityIconOn: 'weather-windy',
            ScreensaverEntityIconOff: null,
            ScreensaverEntityText: "Wind",
            ScreensaverEntityUnitText: 'm/s',
            ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 120}
        },
        // bottomScreensaverEntity 3
        {
            ScreensaverEntity: 'accuweather.0.Current.WindGust',
            ScreensaverEntityFactor: (1000 / 3600),
            ScreensaverEntityDecimalPlaces: 1,
            ScreensaverEntityIconOn: 'weather-tornado',
            ScreensaverEntityIconOff: null,
            ScreensaverEntityText: 'Böen',
            ScreensaverEntityUnitText: 'm/s',
            ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 120}
        },
        // bottomScreensaverEntity 4
        {
            ScreensaverEntity: 'accuweather.0.Current.WindDirectionText',
            ScreensaverEntityFactor: 1,
            ScreensaverEntityDecimalPlaces: 0,
            ScreensaverEntityIconOn: 'windsock',
            ScreensaverEntityIconOff: null,
            ScreensaverEntityText: 'Windr.',
            ScreensaverEntityUnitText: '°',
            ScreensaverEntityIconColor: White
        },
        // bottomScreensaverEntity 5 (for Alternative and Advanced Screensaver)
        {
            ScreensaverEntity: 'accuweather.0.Current.RelativeHumidity',
            ScreensaverEntityFactor: 1,
            ScreensaverEntityDecimalPlaces: 1,
            ScreensaverEntityIconOn: 'water-percent',
            ScreensaverEntityIconOff: null,
            ScreensaverEntityText: 'Feuchte',
            ScreensaverEntityUnitText: '%',
            ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 100, 'val_best': 65}
        },
        // bottomScreensaverEntity 6 (for Advanced Screensaver)
        {
            ScreensaverEntity: NSPanel_Path + 'Relay.1',
            ScreensaverEntityIconOn: 'coach-lamp-variant',
            ScreensaverEntityText: 'Street',
            ScreensaverEntityOnColor: Yellow,
            ScreensaverEntityOffColor: White,
            ScreensaverEntityOnText: 'Is ON',
            ScreensaverEntityOffText: 'Not ON'
        },
        // Examples for Advanced-Screensaver: https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-Config-Screensaver#entity-status-icons-ab-v400 
    ],

    indicatorScreensaverEntity: [
        // Examples for Advanced-Screensaver: https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-Config-Screensaver#entity-status-icons-ab-v400 
    ],

    // Status Icon 
    mrIcon1ScreensaverEntity: {
        ScreensaverEntity: NSPanel_Path + 'Relay.1',
        ScreensaverEntityIconOn: 'lightbulb',
        ScreensaverEntityIconOff: null,
        ScreensaverEntityValue: null,
        ScreensaverEntityValueDecimalPlace: 0,
        ScreensaverEntityValueUnit: null,
        ScreensaverEntityOnColor: On,
        ScreensaverEntityOffColor: HMIOff
    },
    mrIcon2ScreensaverEntity: {
        ScreensaverEntity: NSPanel_Path + 'Relay.2',
        ScreensaverEntityIconOn: 'lightbulb',
        ScreensaverEntityIconOff: null,
        ScreensaverEntityValue: null,
        ScreensaverEntityValueDecimalPlace: 0,
        ScreensaverEntityValueUnit: null,
        ScreensaverEntityOnColor: On,
        ScreensaverEntityOffColor: HMIOff
    },
// ------ DE: Ende der Screensaver Einstellungen --------------------
// ------ EN: End of screensaver settings ---------------------------

//-------DE: Anfang Einstellungen für Hardware Button, wenn Sie softwareseitig genutzt werden (Rule2) -------------
//-------EN: Start Settings for Hardware Button, if used in software (Rule2) --------------------------------------
    // DE: Konfiguration des linken Schalters des NSPanels
    // EN: Configuration of the left switch of the NSPanel
    button1: {
        // DE: Mögliche Werte wenn Rule2 definiert: 'page', 'toggle', 'set' - Wenn nicht definiert --> mode: null
        // EN: Possible values if Rule2 defined: 'page', 'toggle', 'set' - If not defined --> mode: null
        mode: null,
        // DE: Zielpage - Verwendet wenn mode = page
        // EN: Target page - Used if mode = page
        page: null,
        // DE: Zielentity - Verwendet wenn mode = set oder toggle
        // EN: Target entity - Used if mode = set or toggle
        entity: null,
        // DE: Zielwert - Verwendet wenn mode = set
        // EN: Target value - Used if mode = set
        setValue: null
    },

    // DE: Konfiguration des rechten Schalters des NSPanels
    // EN: Configuration of the right switch of the NSPanel
    button2: {
        mode: null,
        page: null,
        entity: null,
        setValue: null
    },

//--------- DE: Ende - Einstellungen für Hardware Button, wenn Sie softwareseitig genutzt werden (Rule2) -------------
//--------- EN: End - settings for hardware button if they are used in software (Rule2) ------------------------------

    // DE: WICHTIG !! Parameter nicht ändern  WICHTIG!!
    // EN: IMPORTANT !! Do not change parameters IMPORTANT!!
    panelRecvTopic: NSPanelReceiveTopic,
    panelSendTopic: NSPanelSendTopic,
    weatherEntity: weatherEntityPath,
    defaultOffColor: defaultOffColorParam,
    defaultOnColor: defaultOnColorParam,
    defaultColor: defaultColorParam,
    defaultBackgroundColor: defaultBackgroundColorParam,
};

// _________________________________ DE: Ab hier keine Konfiguration mehr _____________________________________
// _________________________________ EN:  No more configuration from here _____________________________________

const scriptVersion: string = 'v4.4.0.4';
const tft_version: string = 'v4.4.0';
const desired_display_firmware_version = 53;
const berry_driver_version = 9;

const tasmotaOtaUrl: string = 'http://ota.tasmota.com/tasmota32/release/';

const Icons = new IconsSelector();
let timeoutSlider: any;
let vwIconColor: number[] = [];
let weatherForecast: boolean;
let pageCounter: number = 0;
let alwaysOn: boolean = false;
let valueHiddenCards = getState(NSPanel_Path + 'Config.hiddenCards').val;

let buttonToggleState: {[key: string]: boolean} = {};

const axios = require('axios');
const dayjs = require('dayjs');
const moment  = require('moment');
const parseFormat = require('moment-parseformat');
moment.locale(getState(NSPanel_Path + 'Config.locale').val);

const scheduleList:{[key:string]: any} = {};

const globalTextColor: any = White; 
const Sliders2: number = 0;
let checkBlindActive: boolean = false;

async function Init_dayjs() {
    try {
        //Loading dayjs
        const dayjs = require('dayjs');
        const dayjsLanguages: any = ['en','de','nl','da','es','fr','it','ru','nb','nn',
                                     'pl','pt','af','ar','bg','ca','cs','el','et','fa',
                                     'fi','he','hr','hu','hy-am','id','is','lb','lt','ro',
                                     'sk','sl','sv','th','tr','uk','vi','zh-cn','zh-tw']
        for (let i=0; i<dayjsLanguages.length;i++) {
            require('dayjs/locale/'+ dayjsLanguages[i]);     
        } 
        dayjs.locale(getDayjsLocale());
    } catch (err: any) {
        log('error at function init_dayjs: ' + err.message,'warn'); 
    }        
}
Init_dayjs();

let useMediaEvents: boolean = false;
let timeoutMedia: any;
let timeoutPower: any;
let bgColorScrSaver: number = 0;
let globalTracklist: any;
let weatherAdapterInstanceNumber: number = 0;
let isSetOptionActive: boolean = false;


let nodeVersion: string = '';
let javaScriptVersion: string = '';

let scheduleInitDimModeDay: any;
let scheduleInitDimModeNight: any; 

onStop (function scriptStop () {
    if (scheduleSendTime!=null) _clearSchedule(scheduleSendTime);
    if (scheduleSendDate!=null) _clearSchedule(scheduleSendDate);
    if (scheduleSwichScreensaver!=null) _clearSchedule(scheduleSwichScreensaver);
    if (scheduleStartup!=null) _clearSchedule(scheduleStartup);
    if (scheduleCheckUpdates!=null) _clearSchedule(scheduleCheckUpdates);
    if (scheduleInitDimModeDay!=null) _clearSchedule(scheduleInitDimModeDay);
    if (scheduleInitDimModeNight!=null) _clearSchedule(scheduleInitDimModeNight);
    UnsubscribeWatcher();
}, 1000);

async function CheckConfigParameters() {
    try {
        if (existsObject(config.panelRecvTopic) == false) {
            log('Config-Parameter: << config.panelRecvTopic - ' + config.panelRecvTopic + ' >> is not reachable. Please Check Parameters!','error');
        }
        if (config.panelRecvTopic.indexOf('.tele.') < 0) {
            log('Config-Parameter: << config.panelRecvTopic - ' + config.panelRecvTopic + ' >> does not refer to the prefix .tele. Please Check Parameters!', 'error');
        }
        if (existsObject(config.panelSendTopic) == false) {
            const n = config.panelSendTopic.split('.');
            const a = n.shift();
            const i = n.shift();
            
            if (a === 'mqtt' && !isNaN(Number(i))) {
                sendTo(`${a}.${i}`, 'sendMessage2Client', {topic: n.join('/'), message: buildNSPanelString('time', '12:00')});
                await sleep(500);
            }
            if (await existsObjectAsync(config.panelSendTopic) == false) {
                log('Config-Parameter: << config.panelSendTopic - ' + config.panelSendTopic + ' >> is not reachable. Please Check Parameters!','error');
                stopScript(scriptName);
            }
        }
        if (weatherAdapterInstance.substring(0, weatherAdapterInstance.length - 3) == 'daswetter') {
            if (existsObject(weatherAdapterInstance + 'NextHours.Location_1.Day_1.current.symbol_value') == false)  {
                log('Weather adapter: << weatherAdapterInstance - ' + weatherAdapterInstance + ' >> is not installed. Please Check Adapter!','error');
            }
        }
        if (weatherAdapterInstance.substring(0, weatherAdapterInstance.length - 3) == 'accuweather') {
            if (existsObject(weatherAdapterInstance + 'Current.WeatherIcon') == false)  {
                log('Weather adapter: << weatherAdapterInstance - ' + weatherAdapterInstance + ' >> is not installed. Please Check Adapter!','error');
            }
        }

        let weatherAdapterInstanceArray: any = weatherAdapterInstance.split(".");
        weatherAdapterInstanceNumber = weatherAdapterInstanceArray[1];
        if (Debug) log('Number of weatherAdapterInstance: ' + weatherAdapterInstanceNumber,'info');

        const adapterList = $('system.adapter.*.alive');
        adapterList.each(function(id, i) {
            id = id.substring(0, id.lastIndexOf('.'));
            if(existsObject(id)) {
                let common = getObject(id).common;
                if (common.name == 'javascript') {
                    javaScriptVersion = common.version;
                    setIfExists(NSPanel_Path + 'IoBroker.JavaScriptVersion', 'v' + javaScriptVersion, null, true);
                    setIfExists(NSPanel_Path + 'IoBroker.ScriptName', (name as unknown as string).split('.').slice(2).join('.'), null, true);
                    let jsVersion = common.version.split('.');
                    let jsV = 10*parseInt(jsVersion[0]) + parseInt(jsVersion[1]);
                    if (jsV<61) log('JS-Adapter: ' + common.name + ' must be at least v6.1.3. Currently: v' + common.version, 'error');
                }     
            }
        });
        
        const hostList = $('system.host.*.nodeCurrent');
        hostList.each(function(id, i) {
            nodeVersion = getState(id).val;
            setIfExists(NSPanel_Path + 'IoBroker.NodeJSVersion',  'v' + nodeVersion, null , true);
            let nodeJSVersion = (getState(id).val).split('.');
            if (parseInt(nodeJSVersion[0]) < 18) {
                log('nodeJS must be at least v18.X.X. Currently: v' + getState(id).val + '! Please Update your System! --> iob nodejs-update 18', );
            }
            if (parseInt(nodeJSVersion[0])%2 != 0) {
                log('nodeJS does not have an even version number. An odd version number is a developer version. Please correct nodeJS version','info');
            }
        });
        if (config.mrIcon1ScreensaverEntity.ScreensaverEntity != null && existsObject(config.mrIcon1ScreensaverEntity.ScreensaverEntity) == false ) {
            log('mrIcon1ScreensaverEntity data point in the config not available - please adjust','warn');
        } 
        if (config.mrIcon2ScreensaverEntity.ScreensaverEntity != null && existsObject(config.mrIcon2ScreensaverEntity.ScreensaverEntity) == false) {
            log('mrIcon2ScreensaverEntity data point in the config not available - please adjust','warn');
        } 
        if (CheckEnableSetObject()) {
            log('setObjects enabled - create Alias Channels possible','info');
            isSetOptionActive = true;
        } else {    
            log('setObjects disabled - Please enable setObjects in JS-Adapter Instance - create Alias Channels not possible', 'warn');
        } 
    } catch (err: any) { 
        log('error at function CheckConfigParameters: ' + err.message, 'warn'); 
    }
}
CheckConfigParameters();

async function InitIoBrokerInfo() {
    try {
        if (isSetOptionActive) {
            // Script Version
            await createStateAsync(NSPanel_Path + 'IoBroker.ScriptVersion', scriptVersion, { type: 'string', write: false });
            setObject(AliasPath + 'IoBroker.ScriptVersion', {type: 'channel', common: {role: 'info', name:'Version NSPanelTS'}, native: {}});
            await createAliasAsync(AliasPath + 'IoBroker.ScriptVersion.ACTUAL', NSPanel_Path + 'IoBroker.ScriptVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
            // NodeJS Verion
            await createStateAsync(NSPanel_Path + 'IoBroker.NodeJSVersion', 'v' + nodeVersion, { type: 'string', write: false });
            setObject(AliasPath + 'IoBroker.NodeJSVersion', {type: 'channel', common: {role: 'info', name:'Version NodeJS'}, native: {}});
            await createAliasAsync(AliasPath + 'IoBroker.NodeJSVersion.ACTUAL', NSPanel_Path + 'IoBroker.NodeJSVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
            // JavaScript Version
            await createStateAsync(NSPanel_Path + 'IoBroker.JavaScriptVersion', 'v' + javaScriptVersion, { type: 'string', write: false });
            setObject(AliasPath + 'IoBroker.JavaScriptVersion', {type: 'channel', common: {role: 'info', name:'Version JavaScript Instanz'}, native: {}});
            await createAliasAsync(AliasPath + 'IoBroker.JavaScriptVersion.ACTUAL', NSPanel_Path + 'IoBroker.JavaScriptVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
            // ScriptName
            await createStateAsync(NSPanel_Path + 'IoBroker.ScriptName', 'v' + javaScriptVersion, { type: 'string', write: false });
            setObject(AliasPath + 'IoBroker.ScriptName', {type: 'channel', common: {role: 'info', name:'Scriptname'}, native: {}});
            await createAliasAsync(AliasPath + 'IoBroker.ScriptName.ACTUAL', NSPanel_Path + 'IoBroker.ScriptName', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
        }
        setIfExists(NSPanel_Path + 'IoBroker.ScriptVersion', scriptVersion, null, true);
    } catch (err: any) {
        log('error at funktion InitIoBrokerInfo ' + err.message, 'warn');
    }
}
InitIoBrokerInfo();

async function CheckDebugMode() {
    try {
        if (isSetOptionActive) {
            await createStateAsync(NSPanel_Path + 'Config.ScripgtDebugStatus', false, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.ScripgtDebugStatus', {type: 'channel', common: {role: 'socket', name:'ScripgtDebugStatus'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.ScripgtDebugStatus.ACTUAL', NSPanel_Path + 'Config.ScripgtDebugStatus', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.ScripgtDebugStatus.SET', NSPanel_Path + 'Config.ScripgtDebugStatus', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }

        if(getState(NSPanel_Path + 'Config.ScripgtDebugStatus').val){
            Debug = true;
            log('Debug mode activated','info');
        }else{
            Debug = false;
            log('Debug mode disabled','info');
        }

    } catch (err: any) {
        log('error at function CheckDebugModus: ' + err.message,'warn'); 
    } 
}
CheckDebugMode();

async function CheckMQTTPorts() {
    try {
        let instanceName: string = config.panelRecvTopic.substring(0,6);

        if (isSetOptionActive) {
            await createStateAsync(NSPanel_Path + 'Config.MQTT.portCheck', true, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.MQTT.portCheck', {type: 'channel', common: {role: 'socket', name:'mqttPortCheck'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.MQTT.portCheck.ACTUAL', NSPanel_Path + 'Config.MQTT.portCheck', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.MQTT.portCheck.SET', NSPanel_Path + 'Config.MQTT.portCheck', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }

        if (getState(NSPanel_Path + 'Config.MQTT.portCheck').val) {
            let adapterArray: any = [];
            let portArray: any = [];
            exec('iob l i --port --enabled', async (error, result, stderr) => {
                if (error == null){
                    if (result != undefined) {
                        log('Start MQTT-Port-Check -------------------------------------', 'info');
                        let resultString1 = result.split('+');
                        for (let i: number = 1; i < resultString1.length -1; i++) {
                            let resultString2: any = resultString1[i].split(':')
                            if (Debug) log(`MQTT-PORT-Check Result ` + JSON.stringify(resultString2));
                            let adapterInstanceName: string = resultString2[0].substring(16);
                            let adapterInstancePort: string = '';
                            if (resultString2[2].match("port") != null) {
                                adapterInstancePort = resultString2[3].substring(1, 5);
                            } else { adapterInstancePort = 'Kein Port gefunden'; }
                            log('-- '+ adapterInstanceName + ' - ' +  adapterInstancePort, 'info');
                            adapterArray[i] = adapterInstanceName.trim();
                            portArray[i] = adapterInstancePort.trim();
                        }
                        let mqttInstance = adapterArray.indexOf(instanceName);
                        
                        const mqttConfig = getObject(`system.adapter.${adapterArray[mqttInstance]}`)
                        if (mqttConfig && mqttConfig.native && mqttConfig.native.type == 'client') {
                            log('- MQTT-Port-Check OK: Instance of Adapter: ' +adapterArray[mqttInstance] + ' is running as client!','info');
                        } else {
                            for (let j: number = 1; j < portArray.length; j++) {
                                if (portArray[j] == portArray[mqttInstance] && adapterArray[j] == adapterArray[mqttInstance]) {
                                    log('- MQTT-Port-Check OK: Instance of Adapter: ' + adapterArray[j] + ' is running on Port:' + portArray[j], 'info');
                                } else if (portArray[j] == portArray[mqttInstance] && adapterArray[j] != adapterArray[mqttInstance]) {     
                                    log('Instance of Adapter: ' + adapterArray[j] + ' is running on same Port:' + portArray[j] + ' as ' + adapterArray[mqttInstance], 'warn');
                                    log('Please Change Port of Instance: ' + adapterArray[j], 'warn');
                                }
                            }
                        }
                        log('End MQTT-Port-Check ---------------------------------------','info');
                    }
                    
                } else if (error.toString().substring(0,21) == 'exec is not available') {
                    log('MQTT-Portcheck not possible - exec is not available. Please enable exec option in JS-Adapter instance settings', 'warn');
                    log('MQTT-Portcheck nicht möglich - exec ist nicht verfügbar. Bitte Haken bei -- Kommando Exec erlauben -- in JS-Adapter-Instanz setzen', 'warn');
                }   
            });
        }
    } catch (err: any) { 
        log('error at function CheckMQTTPorts: ' + err.message, 'warn'); 
    }
}

CheckMQTTPorts();

async function Init_Release() {
    const FWVersion = [41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56];
    const FWRelease = ['3.3.1','3.4.0','3.5.0','3.5.X','3.6.0','3.7.3','3.8.0','3.8.3','3.9.4','4.0.5','4.1.4','4.2.1','4.4.0','4.4.0','4.5.0','4.6.0'];
    try {
        if (existsObject(NSPanel_Path + 'Display_Firmware.desiredVersion') == false) {
            await createStateAsync(NSPanel_Path + 'Display_Firmware.desiredVersion', desired_display_firmware_version, { type: 'number', write: false });
        } else {
            await setStateAsync(NSPanel_Path + 'Display_Firmware.desiredVersion', desired_display_firmware_version, true);
        }

        if (existsObject(NSPanel_Path + 'Config.Update.activ') == false) {
            await createStateAsync(NSPanel_Path + 'Config.Update.activ', 1, { type: 'number', write: false });
        } else {
            await setStateAsync(NSPanel_Path + 'Config.Update.activ', 0, true);
        }

        let currentFW = 0;
        let findFWIndex = 0;
        log('Desired TFT Firmware: ' + desired_display_firmware_version + ' / ' + tft_version, 'info');
        if (existsObject(NSPanel_Path + 'Display_Firmware.currentVersion')) {
            currentFW = parseInt(getState(NSPanel_Path + 'Display_Firmware.currentVersion').val);
            findFWIndex = FWVersion.indexOf(currentFW);
            log('Installed TFT Firmware: ' + currentFW + ' / v' + FWRelease[findFWIndex], 'info');
        }
        //Create Long Term
        if (existsObject(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion') == false) {
            //Create TFT DP's
            if (isSetOptionActive) {
                await createStateAsync(NSPanel_Path + 'Display_Firmware.TFT.currentVersion', currentFW + ' / v' + FWRelease[findFWIndex], { type: 'string', write: false });
                await createStateAsync(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', desired_display_firmware_version, { type: 'string', write: false });
                setObject(AliasPath + 'Display_Firmware.TFT.currentVersion', {type: 'channel', common: {role: 'info', name:'current TFT-Version'}, native: {}});
                setObject(AliasPath + 'Display_Firmware.TFT.desiredVersion', {type: 'channel', common: {role: 'info', name:'desired TFT-Version'}, native: {}});
                await createAliasAsync(AliasPath + 'Display_Firmware.TFT.currentVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.TFT.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Display_Firmware.TFT.desiredVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });        
            }
        } else {
            //Create TFT DP's
            await setStateAsync(NSPanel_Path + 'Display_Firmware.TFT.currentVersion', currentFW + ' / v' + FWRelease[findFWIndex], true);
            await setStateAsync(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', desired_display_firmware_version + ' / ' + tft_version, true);
        }
    } catch (err: any) { 
        log('error at function Init_Release: ' + err.message, 'warn'); 
    }
}
Init_Release();

async function InitConfigParameters() {
    try {
        if (isSetOptionActive) {
            // alternativeScreensaverLayout (socket)
            await createStateAsync(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', false, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout', {type: 'channel', common: {role: 'socket', name:'alternativeScreensaverLayout'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout.ACTUAL', NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout.SET', NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

            await createStateAsync(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', false, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.Screensaver.ScreensaverAdvanced', {type: 'channel', common: {role: 'socket', name:'ScreensaverAdvanced'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Screensaver.ScreensaverAdvanced.ACTUAL', NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Screensaver.ScreensaverAdvanced.SET', NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

            // autoWeatherColorScreensaverLayout (socket)
            await createStateAsync(NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout', {type: 'channel', common: {role: 'socket', name:'alternativeScreensaverLayout'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout.ACTUAL', NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout.SET', NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

            // timeoutScreensaver 0-60 (Slider)
            await createStateAsync(NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', 10, { type: 'number', write: true });
            setObject(AliasPath + 'Config.Screensaver.timeoutScreensaver', {type: 'channel', common: {role: 'slider', name:'timeoutScreensaver'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Screensaver.timeoutScreensaver.ACTUAL', NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Screensaver.timeoutScreensaver.SET', NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });

            // screenSaverDoubleClick (socket)
            await createStateAsync(NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.Screensaver.screenSaverDoubleClick', {type: 'channel', common: {role: 'socket', name:'screenSaverDoubleClick'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Screensaver.screenSaverDoubleClick.ACTUAL', NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Screensaver.screenSaverDoubleClick.SET', NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

            if (existsObject(NSPanel_Path + 'Config.locale') == false) {
                // en-US, de-DE, nl-NL, da-DK, es-ES, fr-FR, it-IT, ru-RU, etc.    
                await createStateAsync(NSPanel_Path + 'Config.locale', 'de-DE', { type: 'string', write: true });
                setStateAsync(NSPanel_Path + 'Config.locale', 'de-DE');
            }

            if (existsObject(NSPanel_Path + 'Config.temperatureUnit') == false) {
                // '°C', '°F', 'K'
                await createStateAsync(NSPanel_Path + 'Config.temperatureUnit', '°C', { type: 'string', write: true });
            }

            // locale Tastensensor popupInSel buttonSensor
            if (existsObject(NSPanel_Path + 'Config.localeNumber') == false) {
                await createStateAsync(NSPanel_Path + 'Config.localeNumber', 1, { type: 'number', write: true });
                setObject(AliasPath + 'Config.localeNumber', {type: 'channel', common: {role: 'buttonSensor', name:'localeNumber'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.localeNumber.VALUE', NSPanel_Path + 'Config.localeNumber', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'VALUE' });
            }
            // temperatureUnit popupInSel buttonSensor
            if (existsObject(NSPanel_Path + 'Config.temperatureUnitNumber') == false) {
                await createStateAsync(NSPanel_Path + 'Config.temperatureUnitNumber', 0, { type: 'number', write: true });
                setObject(AliasPath + 'Config.temperatureUnitNumber', {type: 'channel', common: {role: 'buttonSensor', name:'temperatureUnitNumber'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.temperatureUnitNumber.VALUE', NSPanel_Path + 'Config.temperatureUnitNumber', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'VALUE' });
            }
            // Trigger DP for hiddenCards (with hiddenByTrigger)
            if (existsObject(NSPanel_Path + 'Config.hiddenCards') == false) {
                await createStateAsync(NSPanel_Path + 'Config.hiddenCards', false, { type: 'boolean', write: true });
            }
        }
    } catch (err: any) { 
        log('error at function InitConfigParameters: ' + err.message, 'warn'); 
    }
}
InitConfigParameters();

// Trigger for hidden Cards - if hiddenByTrigger is true/false
on({id: [NSPanel_Path + 'Config.hiddenCards'], change: "ne"}, async function (obj) {
    try {
        obj.state.val ? log('hidden Cards activated', 'info') : log('hidden Cards disabled', 'info');
        valueHiddenCards = obj.state.val
        if (obj.state.val) {
            activePage = config.pages[0];
            pageId = 0
            GeneratePage(activePage);
        }
    } catch (err: any) { 
        log('error at Trigger hidden Cards Status: ' + err.message, 'warn'); 
    }
});

on({id: [NSPanel_Path + 'Config.ScripgtDebugStatus'], change: "ne"}, async function (obj) {
    try {
        obj.state.val ? log('Debug mode activated', 'info') : log('Debug mode disabled', 'info');
        Debug = obj.state.val
    } catch (err: any) { 
        log('error at Trigger ScripgtDebugStatus: ' + err.message, 'warn'); 
    }
});

on({id: [NSPanel_Path + 'Config.localeNumber',
          NSPanel_Path + 'Config.temperatureUnitNumber'], change: "ne"}, async function (obj) {
    try {
        if (obj.id == NSPanel_Path + 'Config.localeNumber') {
            let localesList = [ 'en-US', 'de-DE', 'nl-NL', 'da-DK', 'es-ES', 'fr-FR', 'it-IT', 'ru-RU', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'af-ZA', 'ar-SY', 
                                'bg-BG', 'ca-ES', 'cs-CZ', 'el-GR', 'et-EE', 'fa-IR', 'fi-FI', 'he-IL', 'hr-xx', 'hu-HU', 'hy-AM', 'id-ID', 'is-IS', 'lb-xx', 
                                'lt-LT', 'ro-RO', 'sk-SK', 'sl-SI', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-TW'];
            setStateAsync(NSPanel_Path + 'Config.locale', localesList[obj.state.val]);
            SendDate();
        }
        if (obj.id == NSPanel_Path + 'Config.temperatureUnitNumber') {
            let tempunitList = ['°C', '°F', 'K'];
            setStateAsync(NSPanel_Path + 'Config.temperatureUnit', tempunitList[obj.state.val]);
        }
    } catch (err: any) { 
        log('error at Trigger temperatureUnitNumber + localeNumber: ' + err.message, 'warn'); 
    }
});

//switch for Screensaver 1 and Screensaver 2
async function Init_ScreensaverAdvanced() {
    try {
        if (existsState(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced') == false ) { 
            await createStateAsync(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', false, true, { type: 'boolean', write: true });
        }
    } catch (err: any) { 
        log('error at function Init_ScreensaverAdvanced: ' + err.message, 'warn'); 
    }
}
Init_ScreensaverAdvanced();

// checks whether setObjects() is available for the instance (true/false)
function CheckEnableSetObject() { 
    var enableSetObject = getObject("system.adapter.javascript." + instance).native.enableSetObject;
    return enableSetObject;
}

//switch BackgroundColors for Screensaver Indicators
async function Init_ActivePageData() {
    try {
        if (existsState(NSPanel_Path + 'ActivePage.heading') == false ) { 
            await createStateAsync(NSPanel_Path + 'ActivePage.heading', '', true, { type: 'string', write: false });
        }
        if (existsState(NSPanel_Path + 'ActivePage.type') == false ) { 
            await createStateAsync(NSPanel_Path + 'ActivePage.type', '', true, { type: 'string', write: false });
        }
        if (existsState(NSPanel_Path + 'ActivePage.id0') == false ) { 
            await createStateAsync(NSPanel_Path + 'ActivePage.id0', '', true, { type: 'string', write: false });
        }
    } catch (err: any) { 
        log('error at function Init_ActivePageData: ' + err.message, 'warn'); 
    }
}
Init_ActivePageData();

//switch BackgroundColors for Screensaver Indicators
async function Init_Screensaver_Backckground_Color_Switch() {
    try {
        const objDef: iobJS.StateObject = {
            _id: '',
            type: "state",
            common: {
                type: "number",
                name: "Color Indicator",
                role: "level",
                states: {0:'black', 1:'red', 2:'green', 3:'attention', 4: 'pink', 5: 'dark red'},
                read: true,
                write: true
            },
            "native": {},
        };
        await extendObjectAsync(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator', objDef)
        if (await existsStateAsync(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator')) {
            const obj = await getStateAsync(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator');
            if (obj && obj.val !== null && obj.val !== undefined) {
                bgColorScrSaver = obj.val;
            } else {
                setStateAsync(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator', bgColorScrSaver)
            }
        }
    } catch (err: any) { 
        log('error at function Init_Screensaver_Backckground_Color_Switch: ' + err.message, 'warn'); 
    }
}
Init_Screensaver_Backckground_Color_Switch();

on({id: NSPanel_Path + 'ScreensaverInfo.bgColorIndicator', change: "ne"}, async function (obj) {
    try {
        bgColorScrSaver = obj.state.val;
        if (bgColorScrSaver < 6) {
            HandleScreensaverUpdate();
        }
    } catch (err: any) { 
        log('error at trigger bgColorIndicator: ' + err.message, 'warn'); 
    }
});

// switch selection of screensaver layout
on({id: NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', change: "ne"}, async function (obj) {
    try {
        if (obj.state.val) setState( NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', false );
        //setState(config.panelSendTopic, 'pageType~pageStartup');
    } catch (err: any) { 
        log('error at trigger Screensaver Advanced: ' + err.message, 'warn'); 
    }
});

on({id: NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', change: "ne"}, async function (obj) {
    try {
        if (obj.state.val) setState( NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced', false );
        //setState(config.panelSendTopic, 'pageType~pageStartup');
    } catch (err: any) { 
        log('error at trigger Screensaver Alternativ: ' + err.message, 'warn'); 
    }
});

//go to Page X after bExit
async function Init_bExit_Page_Change() {
    try {
        alwaysOn = false;
        pageCounter = 0;
        if (existsState(NSPanel_Path + 'ScreensaverInfo.bExitPage') == false ) { 
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.bExitPage', -1, true, { type: 'number', write: true });
        }
    } catch (err: any) { 
        log('error at function Init_bExit_Page_Change: ' + err.message, 'warn'); 
    }
}
Init_bExit_Page_Change();

//Dim mode via trigger via motion detector
async function Init_Dimmode_Trigger() {
    try {
        if (existsState(NSPanel_Path + 'ScreensaverInfo.Trigger_Dimmode') == false ) { 
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.Trigger_Dimmode', false, true, { type: 'boolean', write: true });
        }
    } catch (err: any) { 
        log('error at function Init_Dimmode_Trigger: ' + err.message, 'warn'); 
    }
}
Init_Dimmode_Trigger();

async function InitActiveBrightness() {
    try {
        if (isSetOptionActive) {
            if (existsState(NSPanel_Path + 'ScreensaverInfo.activeBrightness') == false ||
                existsState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness') == false) {
                await createStateAsync(NSPanel_Path + 'ScreensaverInfo.activeBrightness', 100, { type: 'number', write: true });         
                await createStateAsync(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness', -1, { type: 'number', write: true });
            }
            //Create Alias activeBrightness
            setObject(AliasPath + 'ScreensaverInfo.activeBrightness', {type: 'channel', common: {role: 'slider', name:'activeBrightness'}, native: {}});
            await createAliasAsync(AliasPath + 'ScreensaverInfo.activeBrightness.ACTUAL', NSPanel_Path + 'ScreensaverInfo.activeBrightness', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'ScreensaverInfo.activeBrightness.SET', NSPanel_Path + 'ScreensaverInfo.activeBrightness', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }
    } catch (err: any) {
        log('error at function InitActiveBrightness: ' + err.message, 'warn');
    }
}
InitActiveBrightness();

on({id: [NSPanel_Path + 'ScreensaverInfo.activeBrightness'], change: 'ne'}, async function (obj) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val ?? -1;
        if (obj.state.val >= 0 || obj.state.val <= 100) {
            log('action at trigger activeBrightness: ' + obj.state.val + ' - activeDimmodeBrightness: ' + active, 'info');
            SendToPanel({ payload: 'dimmode~' + active + '~' + obj.state.val + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
            InitDimmode();
        }
    } catch (err:any) {
            log('error at trigger activeBrightness: ' + err.message, 'warn');
    }
});

on({id: [NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness'], change: "ne"}, async function (obj) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val ?? 80;
        if (obj.state.val != null && obj.state.val != -1) {
            if (obj.state.val < -1 || obj.state.val > 100) {
                log('activeDimmodeBrightness value only between -1 and 100', 'info');
                setStateAsync(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness', -1, true);
                alwaysOn = false;
                pageCounter = 0;
                useMediaEvents = false;
                screensaverEnabled = true;
                InitDimmode();
                HandleMessage('event', 'startup',undefined, undefined);
            } else {
                log('action at trigger activeDimmodeBrightness: ' + obj.state.val + ' - activeBrightness: ' + active, 'info');
                SendToPanel({ payload: 'dimmode~' + obj.state.val + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
            }
        } else {
            alwaysOn = false;
            pageCounter = 0;
            useMediaEvents = false;
            screensaverEnabled = true;
            InitDimmode();
            HandleMessage('event', 'startup',undefined, undefined);
        }
    } catch (err: any) {
        log('error at trigger activeDimmodeBrightness: ' + err.message, 'warn');
    }
});

on({id: String(NSPanel_Path) + 'ScreensaverInfo.Trigger_Dimmode', change: "ne"}, async function (obj) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val ?? 80;
        if (obj.state.val) {
            SendToPanel({ payload: 'dimmode~' + 100 + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
        } else {
            InitDimmode();
        }
     } catch (err: any) { 
        log('error at trigger Trigger_Dimmode: ' + err.message, 'warn'); 
    }
});

async function InitRebootPanel() {
    try {
        if (existsState(NSPanel_Path + 'Config.rebootNSPanel') == false) {
            await createStateAsync(NSPanel_Path + 'Config.rebootNSPanel', false, { type: 'boolean', write: true });
            setObject(AliasPath + 'Config.rebootNSPanel', {type: 'channel', common: {role: 'button', name:'Reboot NSPanel'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.rebootNSPanel.SET', NSPanel_Path + 'Config.rebootNSPanel', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
        }
    } catch (err: any) {
        log('error at function InitRebootPanel: ' + err.message, 'warn');
    }
}
InitRebootPanel();

on({id: AliasPath + 'Config.rebootNSPanel.SET', change: "any"}, async function (obj) {
    if (obj.state.val) {
        try {
            let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Backlog Restart 1`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Backlog Restart 1;`;
            }
            axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                .then(async function (response) {
                    if (response.status === 200) {
                        SendToPanel({ payload: 'pageType~pageStartup' });              
                        log('Tasmota Reboot', 'info');
                        setStateAsync(AliasPath + 'Config.rebootNSPanel.SET', false);
                        log("Name: " + name, 'info');
                        log("Instanz: " + instance, 'info');
                    } else {
                        log('Axios Status - Requesting locales: ' + response.state, 'warn');
                    }
                })
                .catch(function (error) {
                    if (error.code === 'EHOSTUNREACH') {
                        log(`Can't connect to display!`, 'warn')
                    } else log(error, 'warn');
                })
                .finally(function () {
                    if (Debug) {
                        log('Reboot NSPanel... done', 'info');
                    }
                });
        } catch (err: any) {
            log('error at Trigger Restart NSPanel: ' + err.message, 'warn');
        }
    }
});

async function InitUpdateDatapoints() {
    try {
        if (existsState(NSPanel_Path + 'Config.Update.UpdateTasmota') == false) {
            if (isSetOptionActive) {
                await createStateAsync(NSPanel_Path + 'Config.Update.UpdateTasmota', false, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + 'Config.Update.UpdateBerry', false, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + 'Config.Update.UpdateNextion', false, { type: 'boolean', write: true });
                setObject(AliasPath + 'Config.Update.UpdateTasmota', {type: 'channel', common: {role: 'button', name:'Tassmota update'}, native: {}});
                setObject(AliasPath + 'Config.Update.UpdateBerry', {type: 'channel', common: {role: 'button', name:'Berry-Driver update'}, native: {}});
                setObject(AliasPath + 'Config.Update.UpdateNextion', {type: 'channel', common: {role: 'button', name:'Nextion TFT update'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.Update.UpdateTasmota.SET', NSPanel_Path + 'Config.Update.UpdateTasmota', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
                await createAliasAsync(AliasPath + 'Config.Update.UpdateBerry.SET', NSPanel_Path + 'Config.Update.UpdateBerry', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
                await createAliasAsync(AliasPath + 'Config.Update.UpdateNextion.SET', NSPanel_Path + 'Config.Update.UpdateNextion', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
            }
        }
    } catch (err: any) {
        log('function InitUpdateDatapoints: ' + err.message, 'warn');
    }
}
InitUpdateDatapoints();

on({id: [NSPanel_Path + 'Config.Update.UpdateTasmota',
          NSPanel_Path + 'Config.Update.UpdateBerry',
          NSPanel_Path + 'Config.Update.UpdateNextion'], change: "any"}, async function (obj) {
    try {
        switch (obj.id) {
            case NSPanel_Path + 'Config.Update.UpdateTasmota':
                if (Debug) log('Tasmota Upgrade durchführen', 'info');
                update_tasmota_firmware();
                break;
            case NSPanel_Path + 'Config.Update.UpdateBerry':
                if (Debug) log('Berry Driver Update durchführen', 'info')
                update_berry_driver_version();
                break;
            case NSPanel_Path + 'Config.Update.UpdateNextion':
                if (Debug) log('FlashNextion durchführen', 'info')
                update_tft_firmware();
                break;
        } 
    } catch (err: any) { 
        log('error at Trigger Update Firmware: ' + err.message, 'warn'); 
    }
});

//switch Relays 1 + 2 with DP's
async function Init_Relays() {
    try {
        if (isSetOptionActive) {
            if (existsState(NSPanel_Path + 'Relay.1') == false ||
                existsState(NSPanel_Path + 'Relay.2') == false) {
                await createStateAsync(NSPanel_Path + 'Relay.1', true, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + 'Relay.2', true, { type: 'boolean', write: true });
            }
            setObject(AliasPath + 'Relay.1', {type: 'channel', common: {role: 'socket', name:'Relay.1'}, native: {}});
            await createAliasAsync(AliasPath + 'Relay.1.ACTUAL', NSPanel_Path + 'Relay.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Relay.1.SET', NSPanel_Path + 'Relay.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            //Create Alias alternateMRIconSize 2
            setObject(AliasPath + 'Relay.2', {type: 'channel', common: {role: 'socket', name:'Relay.2'}, native: {}});
            await createAliasAsync(AliasPath + 'Relay.2.ACTUAL', NSPanel_Path + 'Relay.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Relay.2.SET', NSPanel_Path + 'Relay.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }
    } catch (err: any) { 
        log('error at function Init_Relays: ' + err.message, 'warn'); 
    }
}
Init_Relays();

//Change MRIconsFont small/large
async function InitAlternateMRIconsSize() {
    try {
        if (isSetOptionActive) {
            if (existsState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1') == false ||
                existsState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2') == false) {
                await createStateAsync(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', false, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', false, { type: 'boolean', write: true });
            }
            //Create Alias alternateMRIconSize 1
            setObject(AliasPath + 'Config.MRIcons.alternateMRIconSize.1', {type: 'channel', common: {role: 'socket', name:'alternateMRIconSize.1'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.1.ACTUAL', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.1.SET', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            //Create Alias alternateMRIconSize 2
            setObject(AliasPath + 'Config.MRIcons.alternateMRIconSize.2', {type: 'channel', common: {role: 'socket', name:'alternateMRIconSize.2'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.2.ACTUAL', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.2.SET', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }
    } catch (err: any) { 
        log('error at function InitAlternateMRIconsSize: ' + err.message, 'warn'); 
    }
}
InitAlternateMRIconsSize();

//DateString short/long
async function InitDateformat() {
    try {
        if (isSetOptionActive) {
            if (existsState(NSPanel_Path + 'Config.Dateformat.weekday') == false ||
                existsState(NSPanel_Path + 'Config.Dateformat.month') == false ||
                existsState(NSPanel_Path + 'Config.Dateformat.customFormat') == false) {
                await createStateAsync(NSPanel_Path + 'Config.Dateformat.weekday', 'long', { type: 'string', write: true });
                await createStateAsync(NSPanel_Path + 'Config.Dateformat.month', 'long', { type: 'string', write: true });
                await createStateAsync(NSPanel_Path + 'Config.Dateformat.customFormat', '', { type: 'string', write: true });
            }
            if (existsState(NSPanel_Path + 'Config.Dateformat.Switch.weekday') == false ||
                existsState(NSPanel_Path + 'Config.Dateformat.Switch.month') == false) {
                await createStateAsync(NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + 'Config.Dateformat.Switch.month', true, { type: 'boolean', write: true });
                setObject(AliasPath + 'Config.Dateformat.Switch.weekday', {type: 'channel', common: {role: 'socket', name:'Dateformat Switch weekday'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.weekday.ACTUAL', NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.weekday.SET', NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
                setObject(AliasPath + 'Config.Dateformat.Switch.month', {type: 'channel', common: {role: 'socket', name:'Dateformat Switch month'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.month.ACTUAL', NSPanel_Path + 'Config.Dateformat.Switch.month', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.month.SET', NSPanel_Path + 'Config.Dateformat.Switch.month', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            }
        }    
    } catch (err: any) { 
        log('error at function InitDateformat: ' + err.message, 'warn'); 
    }
}
InitDateformat();
//Control Dateformat short/long from DP's
on({id: [String(NSPanel_Path) + 'Config.Dateformat.Switch.weekday',
          String(NSPanel_Path) + 'Config.Dateformat.Switch.month'], change: "ne"}, async function (obj) {
    try {
        if (obj.id == NSPanel_Path + 'Config.Dateformat.Switch.weekday') {
            if (getState(NSPanel_Path + 'Config.Dateformat.Switch.weekday').val) {
                setStateAsync(NSPanel_Path + 'Config.Dateformat.weekday', 'long');
            } else {
                setStateAsync(NSPanel_Path + 'Config.Dateformat.weekday', 'short');
            }
        } else if (obj.id == NSPanel_Path + 'Config.Dateformat.Switch.month') {
            if (getState(NSPanel_Path + 'Config.Dateformat.Switch.month').val) {
                setStateAsync(NSPanel_Path + 'Config.Dateformat.month', 'long');
            } else {
                setStateAsync(NSPanel_Path + 'Config.Dateformat.month', 'short');
            }
        }
        SendDate();
    } catch (err: any) { 
        log('error at Trigger Config.Dateformat: ' + err.message, 'warn'); 
    }
});

//Set Relays from Tasmota
const NSPanelStatTopic = NSPanelSendTopic.replace('.cmnd.','.stat.').replace(/\.CustomSend$/g,'.');
on({id: [String(NSPanelStatTopic) + 'POWER1',String(NSPanelStatTopic) + 'POWER2'], change: "ne"}, (obj) => {
    if (!obj || !obj.id) return
    const n = obj.id.substring(obj.id.length-1);
    if ( n === '1' || n === '2') {
        if (getState(NSPanel_Path + 'Relay.' + n).val != obj.state.val) {
            setState(NSPanel_Path + 'Relay.' + n, obj.state.val == 'ON' ? true : false, true);
        }
    }
})
//Control Relays from DP's
on({id: [String(NSPanel_Path) + 'Relay.1',String(NSPanel_Path) + 'Relay.2'], change: "ne", ack: false}, async function (obj) {
    try {
        let Button = obj.id!.split('.');        
        let urlString: string = ['http://',get_current_tasmota_ip_address(),'/cm?cmnd=Power',Button[Button.length - 1],' ',(obj.state ? obj.state.val : "")].join('');

        axios.get(urlString)
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(response.data, 'info');
                    }
                }
            })
            .catch(function (error) {
                if (error.code === 'EHOSTUNREACH') {
                    log(`Can't connect to display!`, 'warn')
                } else log(error, 'warn');
            })
            
    } catch (err: any) { 
        log('error at Trigger Relay1/2: ' + err.message, 'warn'); 
    }
});

async function SubscribeMRIcons () { 
    try {
        let arr = config.mrIcon1ScreensaverEntity.ScreensaverEntity != null ? [config.mrIcon1ScreensaverEntity.ScreensaverEntity] : [];
        arr = config.mrIcon1ScreensaverEntity.ScreensaverEntityValue != null ? [...arr, config.mrIcon1ScreensaverEntity.ScreensaverEntityValue] : arr;
        if (arr.length > 0) {
            on({id: arr, change: "ne"}, async function (obj) {
            if (obj.id!.substring(0,4) == 'mqtt') {
                    let Button = obj.id!.split('.'); 
                    if (getState(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6)).val != obj.state.val) {
                        await setStateAsync(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6), obj.state.val == 'ON' ? true : false);
                    }
                } else {
                    HandleScreensaverStatusIcons();
                }
            });
        }
        arr = config.mrIcon2ScreensaverEntity.ScreensaverEntity != null ? [config.mrIcon2ScreensaverEntity.ScreensaverEntity] : [];
        arr = config.mrIcon2ScreensaverEntity.ScreensaverEntityValue != null ? [...arr, config.mrIcon2ScreensaverEntity.ScreensaverEntityValue] : arr;
        if (arr.length > 0) {
            on({id: arr, change: "ne"}, async function (obj) {
                if (obj.id!.substring(0,4) == 'mqtt') {
                    let Button = obj.id!.split('.'); 
                    if (getState(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6)).val != obj.state.val) {
                        await setStateAsync(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6), obj.state.val == 'ON' ? true : false);
                    }
                } else {
                    HandleScreensaverStatusIcons();
                }
            });
        }
    } catch (err: any) { 
        log('error at function SubscribeMRIcons: ' + err.message, 'warn'); 
    }
}
SubscribeMRIcons();

// Create atomatically Wheather-Alias, if exists accuweather.0. and is not exists Config-Wheather-Alias
async function CreateWeatherAlias () {
    try {
        if (autoCreateAlias) {
            if (weatherAdapterInstance == 'daswetter.' + weatherAdapterInstanceNumber + '.') {
                try {
                    if (isSetOptionActive) {
                        if (!existsState(config.weatherEntity + '.ICON') && existsState('daswetter.' + weatherAdapterInstanceNumber + '.NextHours.Location_1.Day_1.current.symbol_value')) {
                            log('Weather alias for daswetter.' + weatherAdapterInstanceNumber + '. does not exist yet, will be created now', 'info'); 
                            setObject(config.weatherEntity, {_id: config.weatherEntity, type: 'channel', common: {role: 'weatherCurrent', name:'media'}, native: {}});
                            await createAliasAsync(config.weatherEntity + '.ICON', 'daswetter.' + weatherAdapterInstanceNumber + '.NextHours.Location_1.Day_1.current.symbol_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ICON' });
                            await createAliasAsync(config.weatherEntity + '.TEMP', 'daswetter.' + weatherAdapterInstanceNumber + '.NextHours.Location_1.Day_1.current.temp_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature', name: 'TEMP' });
                            await createAliasAsync(config.weatherEntity + '.TEMP_MIN', 'daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_1.Minimale_Temperatur_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.forecast.0', name: 'TEMP_MIN' });
                            await createAliasAsync(config.weatherEntity + '.TEMP_MAX', 'daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_1.Maximale_Temperatur_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.max.forecast.0', name: 'TEMP_MAX' });
                        } else {
                            log('weather alias for daswetter.' + weatherAdapterInstanceNumber + '. already exists', 'info');
                        }
                    }    
                } catch (err: any) {
                    log('error at function CreateWeatherAlias daswetter.' + weatherAdapterInstanceNumber + '. : ' + err.message, 'warn');
                }
            } else if (weatherAdapterInstance == 'accuweather.' + weatherAdapterInstanceNumber + '.') {
                try {
                    if (isSetOptionActive) {
                        if (!existsState(config.weatherEntity + '.ICON') && existsState('accuweather.' + weatherAdapterInstanceNumber + '.Current.WeatherIcon')) {
                            log('Weather alias for accuweather.' + weatherAdapterInstanceNumber + '. does not exist yet, will be created now', 'info'); 
                            setObject(config.weatherEntity, {_id: config.weatherEntity, type: 'channel', common: {role: 'weatherCurrent', name:'media'}, native: {}});
                            await createAliasAsync(config.weatherEntity + '.ICON', 'accuweather.' + weatherAdapterInstanceNumber + '.Current.WeatherIcon', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ICON' });
                            await createAliasAsync(config.weatherEntity + '.TEMP', 'accuweather.' + weatherAdapterInstanceNumber + '.Current.Temperature', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature', name: 'TEMP' });
                            await createAliasAsync(config.weatherEntity + '.TEMP_MIN', 'accuweather.' + weatherAdapterInstanceNumber + '.Daily.Day1.Temperature.Minimum', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.forecast.0', name: 'TEMP_MIN' });
                            await createAliasAsync(config.weatherEntity + '.TEMP_MAX', 'accuweather.' + weatherAdapterInstanceNumber + '.Daily.Day1.Temperature.Maximum', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.max.forecast.0', name: 'TEMP_MAX' });
                        } else {
                            log('weather alias for accuweather.' + weatherAdapterInstanceNumber + '. already exists', 'info');
                        }
                    }
                } catch (err: any) {
                    log('error at function CreateWeatherAlias accuweather.' + weatherAdapterInstanceNumber + '.: ' + err.message, 'warn');
                }
            }
        } 
    } catch (err: any) { 
        log('error at function CreateWeatherAlias: ' + err.message, 'warn'); 
    }  
}
CreateWeatherAlias();

//---------------------Begin PageNavi
async function InitPageNavi() {
    try {
        if (!existsState(NSPanel_Path + 'PageNavi')) {
            await createStateAsync(NSPanel_Path + 'PageNavi', <iobJS.StateCommon>{ type: 'string', write: true });
            await setStateAsync(NSPanel_Path + 'PageNavi', <iobJS.State>{ val: {"pagetype": "page","pageId": 0}, ack: true });        
        }
    } catch (err: any) {
        log('error at function InitPageNavi: ' + err.message, 'warn');
    }
}
InitPageNavi();

//PageNavi
on({id: [NSPanel_Path + 'PageNavi'], change: "any"}, async function (obj) {
    try {
        if (existsState(NSPanel_Path + 'PageNavi')) {
            let vObj = JSON.parse(obj.state.val);
            if (vObj.pagetype == 'page') {
                GeneratePage(config.pages[vObj.pageId]);
            } else if (vObj.pagetype == 'subpage') {
                GeneratePage(config.subPages[vObj.pageId]);
            }
        }
    } catch (err: any) { 
        log('error at Trigger PageNavi: ' + err.message, 'warn'); 
    }
});

//----------------------Begin Dimmode
function ScreensaverDimmode(timeDimMode:NSPanel.DimMode) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val ?? 80
        let dimmode = getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val ?? -1
        if (Debug) {
            log('function ScreensaverDimmode RGB-Wert HMIDark' + rgb_dec565(HMIDark), 'info');
        }
        if (Debug) {
            log('function ScreensaverDimmode Dimmode=' + timeDimMode.dimmodeOn, 'info');
        }
        if (timeDimMode.dimmodeOn != undefined ? timeDimMode.dimmodeOn : false) {
            if (compareTime(timeDimMode.timeNight != undefined ? timeDimMode.timeNight : '22:00', timeDimMode.timeDay != undefined ? timeDimMode.timeDay : '07:00', 'not between', undefined)) {
                SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessDay + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
                if (Debug) {
                    log('function ScreensaverDimmode -> Day NSPanel.Payload: ' + 'dimmode~' + timeDimMode.brightnessDay + '~' + active, 'info');
                }
            } else {
                SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessNight + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
                if (Debug) {
                    log('function ScreensaverDimmode -> Night NSPanel.Payload: ' + 'dimmode~' + timeDimMode.brightnessNight + '~' + active, 'info');
                }
            }
        } else {
            SendToPanel({ payload: 'dimmode~' + dimmode + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
        }
    } catch (err: any) {
        log('error at function ScreensaverDimmode: ' + err.message, 'warn');
    }
}

async function InitWeatherForecast() {
    try {
        if (isSetOptionActive) {
            //----Ability to choose between Accu-Weather Forecast or self-defined values in the screensaver---------------------------------
            if (existsState(NSPanel_Path + "ScreensaverInfo.weatherForecast") == false ||
                existsState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer") == false ||
                existsState(NSPanel_Path + "ScreensaverInfo.entityChangeTime") == false) {
                await createStateAsync(NSPanel_Path + "ScreensaverInfo.weatherForecast", true, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer", true, { type: 'boolean', write: true });
                await createStateAsync(NSPanel_Path + "ScreensaverInfo.entityChangeTime", 60, { type: 'number', write: true });
            }
            //Create Alias weatherForecast
            setObject(AliasPath + 'ScreensaverInfo.weatherForecast', {type: 'channel', common: {role: 'socket', name:'weatherForecast'}, native: {}});
            await createAliasAsync(AliasPath + 'ScreensaverInfo.weatherForecast.ACTUAL', NSPanel_Path + 'ScreensaverInfo.weatherForecast', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'ScreensaverInfo.weatherForecast.SET', NSPanel_Path + 'ScreensaverInfo.weatherForecast', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            //Create Alias weatherForecastTimer
            setObject(AliasPath + 'ScreensaverInfo.weatherForecastTimer', {type: 'channel', common: {role: 'socket', name:'weatherForecastTimer'}, native: {}});
            await createAliasAsync(AliasPath + 'ScreensaverInfo.weatherForecastTimer.ACTUAL', NSPanel_Path + 'ScreensaverInfo.weatherForecastTimer', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'ScreensaverInfo.weatherForecastTimer.SET', NSPanel_Path + 'ScreensaverInfo.weatherForecastTimer', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            //Create Alias entityChangeTime
            setObject(AliasPath + 'ScreensaverInfo.entityChangeTime', {type: 'channel', common: {role: 'slider', name:'entityChangeTime'}, native: {}});
            await createAliasAsync(AliasPath + 'ScreensaverInfo.entityChangeTime.ACTUAL', NSPanel_Path + 'ScreensaverInfo.entityChangeTime', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'ScreensaverInfo.entityChangeTime.SET', NSPanel_Path + 'ScreensaverInfo.entityChangeTime', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }
    } catch (err: any) {
        log('error at function InitWeatherForecast: ' + err.message, 'warn');
    }
}
InitWeatherForecast();

async function InitDimmode() {
    try {
        if (isSetOptionActive) {
            // Screensaver on dark at night ("brightnessNight: e.g. 2") or off ("brightnessNight:0")
            if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay')) {
                await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', <iobJS.StateCommon>{ type: 'number', write: true });
                await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', <iobJS.State>{ val: 8, ack: true });
                setObject(AliasPath + 'Dimmode.brightnessDay', {type: 'channel', common: {role: 'slider', name:'brightnessDay'}, native: {}});
                await createAliasAsync(AliasPath + 'Dimmode.brightnessDay.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Dimmode.brightnessDay.SET', NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
            }
            if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_hourDay')) {
                await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourDay', <iobJS.StateCommon>{ type: 'number', write: true });
                await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourDay', <iobJS.State>{ val: 7, ack: true });
                setObject(AliasPath + 'Dimmode.hourDay', {type: 'channel', common: {role: 'slider', name:'hourDay'}, native: {}});
                await createAliasAsync(AliasPath + 'Dimmode.hourDay.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_hourDay', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Dimmode.hourDay.SET', NSPanel_Path + 'NSPanel_Dimmode_hourDay', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
            }
            if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight')) {
                await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', <iobJS.StateCommon>{ type: 'number', write: true });
                await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', <iobJS.State>{ val: 1, ack: true });
                setObject(AliasPath + 'Dimmode.brightnessNight', {type: 'channel', common: {role: 'slider', name:'brightnessNight'}, native: {}});
                await createAliasAsync(AliasPath + 'Dimmode.brightnessNight.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Dimmode.brightnessNight.SET', NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
            }
            if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_hourNight')) {
                await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourNight', <iobJS.StateCommon>{ type: 'number', write: true });
                await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourNight', <iobJS.State>{ val: 22, ack: true });
                setObject(AliasPath + 'Dimmode.hourNight', {type: 'channel', common: {role: 'slider', name:'hourNight'}, native: {}});
                await createAliasAsync(AliasPath + 'Dimmode.hourNight.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_hourNight', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Dimmode.hourNight.SET', NSPanel_Path + 'NSPanel_Dimmode_hourNight', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
            }
            const vTimeDay = getState(NSPanel_Path + 'NSPanel_Dimmode_hourDay').val;
            const vTimeNight = getState(NSPanel_Path + 'NSPanel_Dimmode_hourNight').val;
            const timeDimMode: NSPanel.DimMode = {
                dimmodeOn: true,
                brightnessDay: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay').val,
                brightnessNight: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight').val,
                timeDay: (vTimeDay < 10) ? `0${vTimeDay}:00` : `${vTimeDay}:00`,
                timeNight: (vTimeNight < 10) ? `0${vTimeNight}:00` : `${vTimeNight}:00`
            };
            // timeDimMode Day
            scheduleInitDimModeDay = adapterSchedule({ hour: getState(NSPanel_Path + 'NSPanel_Dimmode_hourDay').val, minute: 0}, 24 * 60 * 60, () => {
                ScreensaverDimmode(timeDimMode);
            });
            // timeDimMode Night
            scheduleInitDimModeNight = adapterSchedule({ hour: getState(NSPanel_Path + 'NSPanel_Dimmode_hourNight').val, minute: 0 }, 24 * 60 * 60, () => {
                ScreensaverDimmode(timeDimMode);
            });
            if (getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val != null && getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val != -1) {
                SendToPanel({ payload: 'dimmode~' + getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val + '~' + getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val ?? 80 + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
            } else {
                if (isDimTimeInRange(timeDimMode.timeDay,timeDimMode.timeNight)) {
                    SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessDay + '~' + getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val?? 80 + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
                } else {
                    SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessNight + '~' + getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val ?? 80 + '~' + rgb_dec565(config.defaultBackgroundColor) + '~' + rgb_dec565(globalTextColor) + '~' + Sliders2 });
                }
                ScreensaverDimmode(timeDimMode);
            }
        }
    } catch (err: any) {
        log('error at function InitDimmode: ' + err.message, 'warn');
    }
}
InitDimmode();

function currentDimDate() {
    let d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDimTime(strTime) {
    let time = strTime.split(':');
    let d = currentDimDate();
    d.setHours(time[0]);
    d.setMinutes(time[1]);
    d.setSeconds(time[2]);
    return d;
}

function isDimTimeInRange(strLower, strUpper) {
    let now = new Date();
    let lower = addDimTime(strLower);
    let upper = addDimTime(strUpper);
    let inRange = false;
    if (upper > lower) {
        // opens and closes in same day
        inRange = (now >= lower && now <= upper) ? true : false;
    } else {
        // closes in the following day
        inRange = (now >= upper && now <= lower) ? false : true;
    }
    return inRange;
}

//--------------------End Dimmode

//--------------------Begin Consumtion (with Dimmode and Relays On Off)
// Funktion to calculate mean linear consumtion
async function Calc_Consumtion(Brightness: number, Relays: number) {
    try {
        return parseFloat(((Relays * 0.25) + ((0.0086 * Brightness) + 0.7429)).toFixed(2));
    } catch (err: any) {
        log('error at function Calc_Consumtion: ' + err.message, 'warn');
    }
}

// 
async function CountRelaysOn(Path: string) {
    try {
        let r1: boolean = getState(Path + 'Relay.1').val;
        let r2: boolean = getState(Path + 'Relay.2').val;

        if (r1 && r2) {
            return 2;
        } else if (!r1 && !r2) {
            return 0;
        } else {
            return 1;
        }
    } catch (err: any) {
        log('error at function CountRelaysOn: ' + err.message, 'warn');
    }
}

async function DetermineDimBrightness(Path: string) {
    try {

        const vTimeDay = getState(Path + 'NSPanel_Dimmode_hourDay').val;
        const vTimeNight = getState(Path + 'NSPanel_Dimmode_hourNight').val;
        const timeDimMode: NSPanel.DimMode = {
            dimmodeOn: true,
            brightnessDay: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay').val,
            brightnessNight: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight').val,
            timeDay: (vTimeDay < 10) ? `0${vTimeDay}:00` : `${vTimeDay}:00`,
            timeNight: (vTimeNight < 10) ? `0${vTimeNight}:00` : `${vTimeNight}:00`
        };

        if (getState(Path + 'ScreensaverInfo.activeDimmodeBrightness').val == -1) {
            if (getState(Path + 'ActivePage.id0').val == 'screensaver') {
                return await DetermineScreensaverDimmode(timeDimMode);
            } else {
                return getState(Path + 'ScreensaverInfo.activeBrightness').val;
            }
        } else {
            return getState(Path + 'ScreensaverInfo.activeDimmodeBrightness').val;
        }
    } catch (err: any) {
        log('error at function DetermineDimBrightness: ' + err.message, 'warn');
    }
}

async function DetermineScreensaverDimmode(timeDimMode:NSPanel.DimMode) {
    try {
        if (timeDimMode.dimmodeOn != undefined ? timeDimMode.dimmodeOn : false) {
            if (compareTime(timeDimMode.timeNight != undefined ? timeDimMode.timeNight : '22:00', timeDimMode.timeDay != undefined ? timeDimMode.timeDay : '07:00', 'not between', undefined)) {
                return timeDimMode.brightnessDay;
            } else {
                return timeDimMode.brightnessNight;
            }
        }
    } catch (err: any) {
        log('error at function DetermineScreensaverDimmode: ' + err.message, 'warn');
    }
}

async function InitMeanPowerConsumtion() {
    try {
        const MeanPower = NSPanel_Path + 'Consumtion.MeanPower';
        let meanConsumtion: number = await Calc_Consumtion(await DetermineDimBrightness(NSPanel_Path), await CountRelaysOn(NSPanel_Path));
        if (!existsState(MeanPower)) {
            await createStateAsync(MeanPower, <iobJS.StateCommon>{ type: 'number', write: true, unit: 'W' });
        }
        await setStateAsync(MeanPower, <iobJS.State>{ val: meanConsumtion, ack: true });
        if (Debug) log(meanConsumtion  + ' W', 'info');
    } catch (err: any) {
        log('error at function InitMeanPowerConsumtion: ' + err.message, 'warn');
    }
}
InitMeanPowerConsumtion();

// Trigger fires on currentPage, dim Standby and dimActive 
on({ id: [].concat(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay')
           .concat(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight')
           .concat(NSPanel_Path + 'ScreensaverInfo.activeBrightness')
           .concat(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness')
           .concat(NSPanel_Path + 'Relay.1')
           .concat(NSPanel_Path + 'Relay.2')
           .concat(NSPanel_Path + 'ActivePage.id0'), change: 'any' }, async (obj) => {

    await InitMeanPowerConsumtion();

});

//--------------------End Consumtion

// Data points for message to screensaver
const screensaverNotifyHeading = NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading';
const screensaverNotifyText = NSPanel_Path + 'ScreensaverInfo.popupNotifyText';

// Data points for message popupNotify Page
const popupNotifyHeading = NSPanel_Path + 'popupNotify.popupNotifyHeading';
const popupNotifyHeadingColor = NSPanel_Path + 'popupNotify.popupNotifyHeadingColor';
const popupNotifyText = NSPanel_Path + 'popupNotify.popupNotifyText';
const popupNotifyTextColor = NSPanel_Path + 'popupNotify.popupNotifyTextColor';
const popupNotifyInternalName = NSPanel_Path + 'popupNotify.popupNotifyInternalName'; // Written back with button action
const popupNotifyButton1TextColor = NSPanel_Path + 'popupNotify.popupNotifyButton1TextColor';
const popupNotifyButton1Text = NSPanel_Path + 'popupNotify.popupNotifyButton1Text';
const popupNotifyButton2TextColor = NSPanel_Path + 'popupNotify.popupNotifyButton2TextColor';
const popupNotifyButton2Text = NSPanel_Path + 'popupNotify.popupNotifyButton2Text';
const popupNotifySleepTimeout = NSPanel_Path + 'popupNotify.popupNotifySleepTimeout'; // in sec. / if 0, then the message remains
const popupNotifyAction = NSPanel_Path + 'popupNotify.popupNotifyAction'; // Response from the panel true/false
const popupNotifyLayout = NSPanel_Path + 'popupNotify.popupNotifyLayout';
const popupNotifyFontIdText = NSPanel_Path + 'popupNotify.popupNotifyFontIdText';  // 1 - 5
const popupNotifyIcon = NSPanel_Path + 'popupNotify.popupNotifyIcon';  // 1 - 5
const popupNotifyIconColor = NSPanel_Path + 'popupNotify.popupNotifyIconColor';  // 1 - 5
const popupNotifyBuzzer = NSPanel_Path + 'popupNotify.popupNotifyBuzzer';  // 1,1,1 -> off 0

async function InitPopupNotify() {
    try {

        if (!existsState(screensaverNotifyHeading)) {
            await createStateAsync(screensaverNotifyHeading, <iobJS.StateCommon>{ type: 'string', write: true });
            await setStateAsync(screensaverNotifyHeading, <iobJS.State>{ val: '', ack: true });
        }

        if (!existsState(screensaverNotifyText)) {
            await createStateAsync(screensaverNotifyText, <iobJS.StateCommon>{ type: 'string', write: true });
            await setStateAsync(screensaverNotifyText, <iobJS.State>{ val: '', ack: true });
        }

        await createStateAsync(popupNotifyHeading, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyHeadingColor, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyText, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyTextColor, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyInternalName, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyButton1Text, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyButton1TextColor, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyButton2Text, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyButton2TextColor, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifySleepTimeout, <iobJS.StateCommon>{ type: 'number', write: true });
        await createStateAsync(popupNotifyAction, <iobJS.StateCommon>{ type: 'boolean', write: true });
        await createStateAsync(popupNotifyLayout, <iobJS.StateCommon>{ type: 'number', write: true });
        await createStateAsync(popupNotifyFontIdText, <iobJS.StateCommon>{ type: 'number', write: true });
        await createStateAsync(popupNotifyIcon, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyIconColor, <iobJS.StateCommon>{ type: 'string', write: true });
        await createStateAsync(popupNotifyBuzzer,<iobJS.StateCommon>{type: 'string', def: '0', write: true});

        // Notification to screensaver
        on({ id: [screensaverNotifyHeading, screensaverNotifyText], change: 'ne', ack: false }, async (obj) => {
            const heading = getState(screensaverNotifyHeading).val;
            const text = getState(screensaverNotifyText).val;
            
            if (screensaverEnabled && heading != '' && text != '') {
                setIfExists(config.panelSendTopic, `notify~${heading}~${text}`);
            }

            if (obj.id) {
                await setStateAsync(obj.id, <iobJS.State>{ val: obj.state.val, ack: true }); // ack new value
            }
        });

        // popupNotify - Notification to a separate page
        on({ id: [popupNotifyText], change: 'any' }, async() => {

            let notification: string;

            let v_popupNotifyHeadingColor = (getState(popupNotifyHeadingColor).val != null) ? getState(popupNotifyHeadingColor).val  : '65504'// Farbe Headline - gelb 65504
            let v_popupNotifyButton1TextColor = (getState(popupNotifyButton1TextColor).val != null) ? getState(popupNotifyButton1TextColor).val  : '63488'// Farbe Button 1 - rot 63488
            let v_popupNotifyButton2TextColor = (getState(popupNotifyButton2TextColor).val != null) ? getState(popupNotifyButton2TextColor).val  : '2016'// Farbe Button 2 - grün 2016
            let v_popupNotifyTextColor = (getState(popupNotifyTextColor).val != null) ? getState(popupNotifyTextColor).val : '65535'// Farbe Text - weiss 65535
            let v_popupNotifyIconColor = (getState(popupNotifyIconColor).val != null) ? getState(popupNotifyIconColor).val  : '65535'// Farbe Icon - weiss 65535
            let v_popupNotifyFontIdText = (getState(popupNotifyFontIdText).val != null) ? getState(popupNotifyFontIdText).val  : '1'
            let v_popupNotifyIcon = (getState(popupNotifyIcon).val != null) ? getState(popupNotifyIcon).val : 'alert'
            let v_popupNotifyBuzzer = (getState(popupNotifyBuzzer).val != null) ? getState(popupNotifyBuzzer).val : '0';

            const heading = getState(popupNotifyHeading).val;
            const text = getState(popupNotifyText).val;

            notification = 'entityUpdateDetail' + '~'
                + getState(popupNotifyInternalName).val + '~'
                + heading + '~'
                + v_popupNotifyHeadingColor + '~'
                + getState(popupNotifyButton1Text).val + '~'
                + v_popupNotifyButton1TextColor + '~'
                + getState(popupNotifyButton2Text).val + '~'
                + v_popupNotifyButton2TextColor + '~'
                + text + '~'
                + v_popupNotifyTextColor + '~'
                + getState(popupNotifySleepTimeout).val;

            if (getState(popupNotifyLayout).val == 2) {
                notification = notification + '~'
                + v_popupNotifyFontIdText + '~'
                + Icons.GetIcon(v_popupNotifyIcon) + '~'
                + v_popupNotifyIconColor;
            }

            if (heading != '' && text != '') {
                setIfExists(config.panelSendTopic, 'pageType~popupNotify');
                setIfExists(config.panelSendTopic, notification);
            }

            //------ Tasmota Buzzer ------
            
            if (v_popupNotifyBuzzer != '0') {
                if (Debug){
                    log('Tasmota Buzzer enabled. Value: ' + v_popupNotifyBuzzer, 'info');
                }
                let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Buzzer ${v_popupNotifyBuzzer}`;
                if (tasmota_web_admin_password != '') {
                    urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Buzzer ${v_popupNotifyBuzzer}`;
                }

                axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                    .then(async function (response) {
                        if (response.status === 200) {
                            log('Axios Data: ' + JSON.stringify(response.data), 'info');
                        } else {
                            log('Axios Status - Tasmota Buzzer: ' + response.state, 'warn');
                        }
                    })
                    .catch(function (error) {
                        if (error.code === 'EHOSTUNREACH') {
                            log(`Can't connect to display!`, 'warn')
                        } else log(error, 'warn');
                    });
            } else {
                if (Debug){
                    log('Tasmota Buzzer disabled', 'info');
                }
            }
            //---- Tasmota Buzzer -----

        });
    } catch (err: any) {
        log('error at function InitPopupNotify: ' + err.message, 'warn');
    }
}
InitPopupNotify();

let subscriptions: any = {};
let screensaverEnabled: boolean = false;
let pageId = 0;
let activePage: PageType | undefined = undefined;

//Send time to NSPanel
let scheduleSendTime = adapterSchedule(new Date().setSeconds(0,0), 60, () => {
    try {
        SendTime();
        HandleScreensaverUpdate();
    } catch (err: any) {
        log('error at schedule SendTime: ' + err.message, 'warn');
    }
});

//Switch between Screensaver Entities and WeatherForecast
let scheduleSwichScreensaver = adapterSchedule(undefined, parseInt(getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val), () => {
    try {
        //WeatherForecast true/false Switchover delayed
        if (getState(NSPanel_Path + "ScreensaverInfo.popupNotifyHeading").val == '' && getState(NSPanel_Path + "ScreensaverInfo.popupNotifyText").val == '' && getState(NSPanel_Path + "ScreensaverInfo.weatherForecast").val == true && getState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer").val == true) {
            setStateDelayed(NSPanel_Path + "ScreensaverInfo.weatherForecast", false, (getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val / 2 * 1000), false);
        } else if (getState(NSPanel_Path + "ScreensaverInfo.popupNotifyHeading").val == '' && getState(NSPanel_Path + "ScreensaverInfo.popupNotifyText").val == '' && getState(NSPanel_Path + "ScreensaverInfo.weatherForecast").val == false && getState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer").val == true) {
            setStateDelayed(NSPanel_Path + "ScreensaverInfo.weatherForecast", true, (getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val / 2 * 1000), false);
        }
    } catch (err: any) {
        log('error at schedule entityChangeTime: ' + err.message, 'warn');
    }
});

function InitHWButton1Color() {
    try {
        if (config.mrIcon1ScreensaverEntity.ScreensaverEntity != null || config.mrIcon1ScreensaverEntity.ScreensaverEntity != undefined) {
            on({id: config.mrIcon1ScreensaverEntity.ScreensaverEntity, change: "ne"}, async function () {
                HandleScreensaverUpdate();
            });
        }
    } catch (err: any) {
        log('error at function InitHWButton1Color: ' + err.message, 'warn');
    }
}
InitHWButton1Color();

function InitHWButton2Color() {
    try {
        if (config.mrIcon2ScreensaverEntity.ScreensaverEntity != null || config.mrIcon2ScreensaverEntity.ScreensaverEntity != undefined) {
            on({id: config.mrIcon2ScreensaverEntity.ScreensaverEntity, change: "ne"}, async function () {
                HandleScreensaverUpdate();
            });
        }
    } catch (err: any) {
        log('error at function InitHWButton2Color: ' + err.message, 'warn');
    }
}
InitHWButton2Color();

//Switch between data points and weather forecast in the screensaver
on({id: [NSPanel_Path + "ScreensaverInfo.weatherForecast"], change: "ne"}, async function (obj) {
    try {    
        weatherForecast = obj.state.val;
        HandleScreensaverUpdate();
    } catch (err: any) {
        log('error at trigger weatherForecast: ' + err.message, 'warn');
    }
});

//Update if Changing Values on Wheather Alias
on({id: [config.weatherEntity + '.TEMP',
          config.weatherEntity + '.ICON'], change: "ne"}, async function (obj) {
    try {    
        HandleScreensaverUpdate();
    } catch (err: any) {
        log('error at trigger weatherForecast .TEMP + .ICON: ' + err.message, 'warn');
    }
});

let scheduleSendDate = adapterSchedule((new Date().setMinutes(0,0)),60*60, () => {
    SendDate();
});

// 3:30 a.m. Perform startup and receive current TFT version
let scheduleStartup = adapterSchedule({ hour: 3, minute: 30 }, 24*60*60, async () => {
    setIfExists(config.panelSendTopic, 'pageType~pageStartup');
});

// Updates currently compare every 12 hours
let scheduleCheckUpdates = adapterSchedule(undefined,60*60*12, () => {
    get_tasmota_status0();
    get_panel_update_data();
    check_updates();
});

// Check for updates with Start
get_locales();
get_locales_servicemenu();
setIfExists(config.panelSendTopic, 'pageType~pageStartup');
get_tasmota_status0();
get_panel_update_data();
check_updates();
/*
setTimeout(async function () {
    setState(config.panelSendTopic, 'pageType~pageStartup');
}, 90000);
*/

//------------------Begin Update Functions

function getDayjsLocale(): String {
    try {
        let locale = getState(NSPanel_Path + 'Config.locale').val;
        if (locale == "hy-AM" || locale == "zh-CN" || locale == "zh-TW") {
            return locale.toLowerCase();
        } else {
            return locale.substring(0, 2);
        }
    } catch (err: any) {
        log('error in function getDayjsLocale: ' + err.message, 'warn');
        // hier muß eine Return oder ein neuer throw err hin
        return '';
    }
}

async function get_locales() {
    try {
        if (Debug) {
            log('Requesting locales', 'info');
        }
        let urlString: string = 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/ioBroker/ioBroker_NSPanel_locales.json';

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    await createStateAsync(NSPanel_Path + 'NSPanel_locales_json', <iobJS.StateCommon>{ type: 'string', role: 'json', write: false });
                    await setStateAsync(NSPanel_Path + 'NSPanel_locales_json', <iobJS.State>{ val: JSON.stringify(response.data), ack: true });
                } else {
                    log('Axios Status - Requesting locales: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });

    } catch (err: any) {
        log('error requesting locales in function get_locales: ' + err.message, 'warn');
    }
}

async function get_locales_servicemenu() {
    try {
        if (Debug) {
            log('Requesting locales Service Menu', 'info');
        }
        let urlString: string = 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/ioBroker/ioBroker_NSPanel_locales_service.json';

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    await createStateAsync(NSPanel_Path + 'NSPanel_locales_service_json', <iobJS.StateCommon>{ type: 'string', role: 'json', write: false });
                    await setStateAsync(NSPanel_Path + 'NSPanel_locales_service_json', <iobJS.State>{ val: JSON.stringify(response.data), ack: true });
                } else {
                    log('Axios Status - Requesting locales Service Menu: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });

    } catch (err: any) {
        log('error requesting locales in function get_locales_servicemenu: ' + err.message, 'warn');
    }
}

async function check_updates() {
    try {
        if (Debug) log('Check-Updates', 'info');

        let Update: boolean = false;

        let InternalName: string = '';
        let Headline: string = '';
        let Text: string = '';

        const HeadlineColor: string = '63488'; // Farbe Rot
        const Button1: string = 'Nein';
        const Button1Color: string = '63488';  // Farbe Rot
        const Button2: string = 'Ja';
        const Button2Color: string = '2016';   // Farbe Grün
        const Timeout: number = 0;
        const Layout: number = 1;
        
        // Tasmota-Firmware-Vergleich
        if (existsObject(NSPanel_Path + 'Tasmota_Firmware.currentVersion') && existsObject(NSPanel_Path + 'Tasmota_Firmware.onlineVersion')) {
            let splitTasmotaVersion = (getState(NSPanel_Path + 'Tasmota_Firmware.currentVersion').val).split('.');
            let shortTasmoataVersion = splitTasmotaVersion[0] + '.' + splitTasmotaVersion[1] + '.' + splitTasmotaVersion[2]
            if (shortTasmoataVersion !== getState(NSPanel_Path + 'Tasmota_Firmware.onlineVersion').val) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {

                        log('Auto-Updates eingeschaltet - Update Tasmota wird durchgeführt', 'info');

                        // Perform Tasmota upgrade
                        update_tasmota_firmware();
                        // Current Tasmota version = online Tasmota version

                        await setStateAsync(NSPanel_Path + 'Tasmota_Firmware.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Tasmota_Firmware.onlineVersion').val, ack: true });
                    } else {
                        // Point out Tasmota updates
                        if (Debug) log('Tasmota-Firmware => Automatische Updates aus, manuelles Update nötig', 'info');

                        InternalName = 'TasmotaFirmwareUpdate';
                        Headline = 'Tasmota-Firmware Update';
                        Text = ['Es ist eine neue Version der Tasmota-Firmware', '\r\n', 'verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.onlineVersion')).val), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        Update = true;
                    }
                }
            } else {
                if (Debug) log('Already the latest Tasmota version on NSPanel', 'info');
            }
        }

        // Tasmota-Berry-Driver-Vergleich
        if (existsObject(NSPanel_Path + 'Berry_Driver.currentVersion')) {
            if (parseFloat(getState(NSPanel_Path + 'Berry_Driver.currentVersion').val) < berry_driver_version) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {

                        log('Auto-updates switched on - Berry driver update is carried out', 'info');

                        // Tasmota Berry-Driver Update durchführen
                        update_berry_driver_version();
                        // Aktuelle Berry-Driver Version = Online Berry-Driver Version
                        await setStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Berry_Driver.onlineVersion').val, ack: true });

                        if (Debug) log('Berry driver updated automatically', 'info');

                    } else {
                        //Auf BerryDriver-Update hinweisen
                        if (Debug) log('Berry Driver => Automatic updates off, manual update required', 'info');

                        InternalName = 'BerryDriverUpdate';
                        Headline = 'Berry-Driver Update';
                        Text = ['Es ist eine neue Version des Berry-Drivers', '\r\n', '(Tasmota) verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Berry_Driver.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(berry_driver_version), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        Update = true;
                    }
                }
            } else {
                if (Debug) log('Already the latest Berry driver on NSPanel', 'info');
            }
        }

        // TFT-Firmware-Vergleich
        if (existsObject(NSPanel_Path + 'Display_Firmware.currentVersion')) {
            if (parseInt(getState(NSPanel_Path + 'Display_Firmware.currentVersion').val) < desired_display_firmware_version) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {

                        log('Auto-updates switched on - update TFT firmware is carried out', 'info');

                        // TFT-Firmware Update durchführen
                        update_tft_firmware();
                        // Aktuelle TFT-Firmware Version = Online TFT-Firmware Version
                        await setStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Display_Firmware.onlineVersion').val, ack: true });

                        if (Debug) log('Display firmware updated automatically', 'info');

                    } else {
                        // Auf TFT-Firmware hinweisen
                        if (Debug) log('Display firmware => Automatic updates off, manual update required', 'info');

                        InternalName = 'TFTFirmwareUpdate';
                        Headline = 'TFT-Firmware Update';
                        Text = ['Es ist eine neue Version der TFT-Firmware', '\r\n', 'verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Display_Firmware.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(desired_display_firmware_version), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        Update = true;
                    }
                }
            } else {
                if (Debug) log('Already the latest display firmware on NSPanel', 'info');
            }
        }
        let update_message: boolean = getState(NSPanel_Path + 'Config.Update.UpdateMessage').val;
        if (Update && update_message) {
            await setStateAsync(popupNotifyHeading, <iobJS.State>{ val: Headline, ack: false });
            await setStateAsync(popupNotifyHeadingColor, <iobJS.State>{ val: HeadlineColor, ack: false });
            await setStateAsync(popupNotifyButton1Text, <iobJS.State>{ val: Button1, ack: false });
            await setStateAsync(popupNotifyButton1TextColor, <iobJS.State>{ val: Button1Color, ack: false });
            await setStateAsync(popupNotifyButton2Text, <iobJS.State>{ val: Button2, ack: false });
            await setStateAsync(popupNotifyButton2TextColor, <iobJS.State>{ val: Button2Color, ack: false });
            await setStateAsync(popupNotifySleepTimeout, <iobJS.State>{ val: Timeout, ack: false });
            await setStateAsync(popupNotifyInternalName, <iobJS.State>{ val: InternalName, ack: false });
            await setStateAsync(popupNotifyLayout, <iobJS.State>{ val: Layout, ack: false });
            await setStateAsync(popupNotifyText, <iobJS.State>{ val: [formatDate(getDateObject((new Date().getTime())), 'TT.MM.JJJJ SS:mm:ss'), '\r\n', '\r\n', Text].join(''), ack: false });
        } else if (Update && !update_message) {
            log('Updates for NSPanel available', 'info');
        } else {
            log('No Updates for NSPanel available', 'info');
        }

    } catch (err: any) {
        log('error at function check_updates: ' + err.message, 'warn');
    }
}

on({ id: NSPanel_Path + 'popupNotify.popupNotifyAction', change: 'any' }, async function (obj) {
    try {
        const val = obj.state ? obj.state.val : false;
        if (!val) {
            if (Debug) {
                log('Button1 was pressed', 'info');
            }
        } else if (val) {
            
            const internalName: string = getState(NSPanel_Path + 'popupNotify.popupNotifyInternalName').val;
            if (internalName.includes('Update')) {
                if (internalName == 'TasmotaFirmwareUpdate') {
                    update_tasmota_firmware();
                } else if (internalName == 'BerryDriverUpdate') {
                    update_berry_driver_version();
                } else if (internalName == 'TFTFirmwareUpdate') {
                    update_tft_firmware();
                }
            }
            if (Debug) {
                log('Button2 was pressed', 'info');
            }
        }
    } catch (err: any) {
        log('error at Trigger popupNotifyAction: ' + err.message, 'warn');
    }
});

async function get_panel_update_data() {
    try {
        if (isSetOptionActive) {
            await createStateAsync(NSPanel_Path + 'Config.Update.UpdateMessage', true, <iobJS.StateCommon>{ read: true, write: true, name: 'Update-Message', type: 'boolean', def: true });
            if (autoCreateAlias) {
                setObject(AliasPath + 'Config.Update.UpdateMessage', {type: 'channel', common: {role: 'socket', name:'UpdateMesssage'}, native: {}});
                await createAliasAsync(AliasPath + 'Config.Update.UpdateMessage.ACTUAL', NSPanel_Path + 'Config.Update.UpdateMessage', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'Config.Update.UpdateMessage.SET', NSPanel_Path + 'Config.Update.UpdateMessage', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            }
            await createStateAsync(NSPanel_Path + 'NSPanel_autoUpdate', false, <iobJS.StateCommon>{ read: true, write: true, name: 'Auto-Update', type: 'boolean', def: false });
            if (autoCreateAlias) {
                setObject(AliasPath + 'autoUpdate', {type: 'channel', common: {role: 'socket', name:'AutoUpdate'}, native: {}});
                await createAliasAsync(AliasPath + 'autoUpdate.ACTUAL', NSPanel_Path + 'NSPanel_autoUpdate', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
                await createAliasAsync(AliasPath + 'autoUpdate.SET', NSPanel_Path + 'NSPanel_autoUpdate', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            }
            await createStateAsync(NSPanel_Path + 'NSPanel_ipAddress', <iobJS.StateCommon>{ type: 'string', write: false });
            await setStateAsync(NSPanel_Path + 'NSPanel_ipAddress', <iobJS.State>{ val: get_current_tasmota_ip_address(), ack: true });
            if (autoCreateAlias) {
                setObject(AliasPath + 'ipAddress', {type: 'channel', common: {role: 'info', name:'ipAddress'}, native: {}});
                await createAliasAsync(AliasPath + 'ipAddress.ACTUAL', NSPanel_Path + 'NSPanel_ipAddress', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
            }
            get_online_tasmota_firmware_version();
            get_current_berry_driver_version();
            get_online_berry_driver_version();
            check_version_tft_firmware();
            check_online_display_firmware();
        }
    } catch (err: any) {
        log('error at function get_panel_update_data: ' + err.message, 'warn');
    }
}

function get_current_tasmota_ip_address() {
    try {
        const infoObjId = config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'INFO2';
        const infoObj = JSON.parse(getState(infoObjId).val);

        if (Debug) {
            log(`get_current_tasmota_ip_address: ${infoObj.Info2.IPAddress}`, 'info');
        }

        return infoObj.Info2.IPAddress;
    } catch (err: any) {
        log('error at function get_current_tasmota_ip_address: ' + err.message, 'warn');
    }
}

function get_online_tasmota_firmware_version() {
    try {
        if (Debug) {
            log('Requesting tasmota firmware version', 'info');
        }

        let urlString: string = 'https://api.github.com/repositories/80286288/releases/latest';

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    if (isSetOptionActive) {
                        const Tasmota_JSON = JSON.parse(JSON.stringify(response.data));// Write JSON result to variable
                        const TasmotaTagName = Tasmota_JSON.tag_name;                  // Filter JSON by "tag_name" and write to variable
                        const TasmotaVersionOnline = TasmotaTagName.replace(/v/i, ''); // Filter unnecessary "v" from variable and write to release variable
                        await createStateAsync(NSPanel_Path + 'Tasmota_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                        setObject(AliasPath + 'Tasmota_Firmware.onlineVersion', {type: 'channel', common: {role: 'info', name:'onlineVersion'}, native: {}});
                        await createAliasAsync(AliasPath + 'Tasmota_Firmware.onlineVersion.ACTUAL', NSPanel_Path + 'Tasmota_Firmware.onlineVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });                
                        await setStateAsync(NSPanel_Path + 'Tasmota_Firmware.onlineVersion', <iobJS.State>{ val: TasmotaVersionOnline, ack: true });
                        if (Debug) log('online tasmota firmware version => ' + TasmotaVersionOnline, 'info');
                    }  
                } else {
                    log('Axios Status - online tasmota firmware version: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });
            
    } catch (err: any) {
        log('error requesting firmware in function get_online_tasmota_firmware_version: ' + err.message, 'warn');
    }
}

function get_current_berry_driver_version() {
    try {
        if (Debug) {
            log('Requesting current berry driver version', 'info');
        }

        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=GetDriverVersion`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=GetDriverVersion`;
        }

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    if (isSetOptionActive) {
                        const BerryDriverVersionCurrent: string = JSON.parse(JSON.stringify(response.data)).nlui_driver_version;
                        await createStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                        await setStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.State>{ val: JSON.parse(JSON.stringify(response.data)).nlui_driver_version, ack: true });
                        if (autoCreateAlias) {
                            setObject(AliasPath + 'Display.BerryDriver', {type: 'channel', common: {role: 'info', name: 'Berry Driver'}, native: {}});
                            await createAliasAsync(AliasPath + 'Display.BerryDriver.ACTUAL', NSPanel_Path + 'Berry_Driver.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                        }
                        if (Debug) log('current berry driver version => ' + BerryDriverVersionCurrent, 'info');
                    }
                } else {
                    log('Axios Status - current berry driver version: ' + response.state, 'info');
                }
            })
            .catch(function (error) {
                if (error.code === 'EHOSTUNREACH') {
                    log(`Can't connect to display!`, 'warn')
                } else log(error, 'warn');
            });

    } catch (err: any) {
        log('error requesting firmware in function get_current_berry_driver_version: ' + err.message, 'warn');
    }
}

function get_tasmota_status0() {
    try {
        if (Debug) {
           log('Requesting tasmota status0', 'info');
        }
        
        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Status0`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Status0`;
        }

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    if (isSetOptionActive) {
                        await createStateAsync(NSPanel_Path + 'Tasmota_Firmware.currentVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Uptime', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Version', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Hardware', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.AP', <iobJS.StateCommon>{ type: 'number', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.SSId', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.BSSId', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Channel', <iobJS.StateCommon>{ type: 'number', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Mode', <iobJS.StateCommon>{ type: 'string', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.RSSI', <iobJS.StateCommon>{ type: 'number', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Signal', <iobJS.StateCommon>{ type: 'number', write: false });
                        await createStateAsync(NSPanel_Path + 'Tasmota.Product', <iobJS.StateCommon>{ type: 'string', write: false });

                        try {
                            const Tasmota_JSON = JSON.parse(JSON.stringify(response.data));
                            const tasmoVersion = Tasmota_JSON.StatusFWR.Version.indexOf('(') > -1 ? Tasmota_JSON.StatusFWR.Version.split('(')[0] : Tasmota_JSON.StatusFWR.Version;

                            await setStateAsync(NSPanel_Path + 'Tasmota_Firmware.currentVersion', <iobJS.State>{ val: tasmoVersion, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Uptime', <iobJS.State>{ val: Tasmota_JSON.StatusPRM.Uptime, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Version', <iobJS.State>{ val: Tasmota_JSON.StatusFWR.Version, ack: true });
                            let TasmotaHardware: string = Tasmota_JSON.StatusFWR.Hardware.split(' ');
                            await setStateAsync(NSPanel_Path + 'Tasmota.Hardware', <iobJS.State>{ val: TasmotaHardware[0] + '\r\n' + TasmotaHardware[1], ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.AP', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.AP, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.SSId', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.SSId, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.BSSId', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.BSSId, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.Channel', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.Channel, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.Mode', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.Mode, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.RSSI', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.RSSI, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Wifi.Signal', <iobJS.State>{ val: Tasmota_JSON.StatusSTS.Wifi.Signal, ack: true });
                            await setStateAsync(NSPanel_Path + 'Tasmota.Product', <iobJS.State>{ val: 'SONOFF NSPanel', ack: true });
                            if (Debug) log('current tasmota firmware version => ' + tasmoVersion, 'info');
                        } catch (err: any) {
                            log('error setState in function get_tasmota_status0' + err.message, 'warn');
                        }
                        if (autoCreateAlias) {
                            setObject(AliasPath + 'Tasmota.Uptime', {type: 'channel', common: {role: 'info', name: 'Uptime'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Version', {type: 'channel', common: {role: 'info', name:'Version'}, native: {}});        
                            setObject(AliasPath + 'Tasmota.Hardware', {type: 'channel', common: {role: 'info', name: 'Hardware'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Wifi.AP', {type: 'channel', common: {role: 'info', name:'AP'}, native: {}});        
                            setObject(AliasPath + 'Tasmota.Wifi.SSId', {type: 'channel', common: {role: 'info', name:'SSId'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Wifi.BSSId', {type: 'channel', common: {role: 'info', name: 'BSSId'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Wifi.Channel', {type: 'channel', common: {role: 'info', name:'Channel'}, native: {}});        
                            setObject(AliasPath + 'Tasmota.Wifi.Mode', {type: 'channel', common: {role: 'info', name: 'Mode'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Wifi.RSSI', {type: 'channel', common: {role: 'info', name:'RSSI'}, native: {}});        
                            setObject(AliasPath + 'Tasmota.Wifi.Signal', {type: 'channel', common: {role: 'info', name:'Signal'}, native: {}});
                            setObject(AliasPath + 'Tasmota.Product', {type: 'channel', common: {role: 'info', name:'Product'}, native: {}});
                            await createAliasAsync(AliasPath + 'Tasmota.Uptime.ACTUAL', NSPanel_Path + 'Tasmota.Uptime', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Version.ACTUAL', NSPanel_Path + 'Tasmota.Version', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Hardware.ACTUAL', NSPanel_Path + 'Tasmota.Hardware', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.AP.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.AP', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.SSId.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.SSId', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.BSSId.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.BSSId', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.Channel.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.Channel', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.Mode.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.Mode', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.RSSI.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.RSSI', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Wifi.Signal.ACTUAL', NSPanel_Path + 'Tasmota.Wifi.Signal', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
                            await createAliasAsync(AliasPath + 'Tasmota.Product.ACTUAL', NSPanel_Path + 'Tasmota.Product', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                        }
                    }
                } else {
                    log('Axios Status - get_tasmota_status0: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                if (error.code === 'EHOSTUNREACH') {
                    log(`Can't connect to display!`, 'warn')
                } else log(error, 'error');
            });
            
    } catch (err: any) {
        log('error requesting firmware in function get_tasmota_status0: ' + err.message, 'warn');
    }
}

function get_online_berry_driver_version() {
    try {
        if (NSPanel_Path + 'Config.Update.activ') {
            if (Debug) {
                log('Requesting online berry driver version', 'info');
            }

            let urlString = 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be';

            axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                .then(async function (response) {
                    if (response.status === 200) {
                        if (Debug) {
                            log(response.data, 'info');
                        }
                        if (isSetOptionActive) {
                            const BerryDriverVersionOnline = response.data.substring((response.data.indexOf('version_of_this_script = ') + 24), response.data.indexOf('version_of_this_script = ') + 27).replace(/\s+/g, '');
                            await createStateAsync(NSPanel_Path + 'Berry_Driver.onlineVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                            setObject(AliasPath + 'Berry_Driver.onlineVersion', {type: 'channel', common: {role: 'info', name:'onlineVersion'}, native: {}});
                            await createAliasAsync(AliasPath + 'Berry_Driver.onlineVersion.ACTUAL', NSPanel_Path + 'Berry_Driver.onlineVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                            await setStateAsync(NSPanel_Path + 'Berry_Driver.onlineVersion', <iobJS.State>{ val: BerryDriverVersionOnline, ack: true });
                            if (Debug) log('online berry driver version => ' + BerryDriverVersionOnline, 'info');
                        }
                    } else {
                        log('Axios Status - get_online_berry_driver_version: ' + response.state, 'warn');
                    }
                })
                .catch(function (error) {
                    log(error, 'warn');
                });

        }
    } catch (err: any) {
        log('error requesting firmware in function get_online_berry_driver_version: ' + err.message, 'warn');
    }
}

function check_version_tft_firmware() {
    try {
        if (Debug) {
            log('Requesting online TFT version', 'info');
        }

        let urlString = 'https://api.github.com/repos/joBr99/nspanel-lovelace-ui/releases/latest';

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(JSON.stringify(response.data), 'info');
                    }
                    let NSPanel_JSON = JSON.parse(JSON.stringify(response.data)); // Write JSON result to variable
                    let NSPanelTagName = NSPanel_JSON.tag_name;                   // created_at; published_at; name ; draft ; prerelease
                    let NSPanelVersion = NSPanelTagName.replace(/v/i, '');        // Filter unnecessary "v" from variable and write to release variable

                    await createStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                    await setStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.State>{ val: NSPanelVersion, ack: true });
                    if (Debug) log('online TFT firmware version => ' + NSPanelVersion, 'info');
                } else {
                    log('Axios Status - check_version_tft_firmware: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });

    } catch (err: any) {
        log('error requesting firmware in function check_version_tft_firmware: ' + err.message, 'warn');
    }
}

function check_online_display_firmware() {
    try {
        if (Debug) {
            log('Requesting online firmware version', 'info');
        }

        let urlString = 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/apps/nspanel-lovelace-ui/nspanel-lovelace-ui.py';

        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(response.data, 'info');
                    }
                    let desired_display_firmware_version = response.data.substring((response.data.indexOf('desired_display_firmware_version =') + 34), response.data.indexOf('desired_display_firmware_version =') + 38).replace(/\s+/g, '');

                    await createStateAsync(NSPanel_Path + 'Display_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                    await setStateAsync(NSPanel_Path + 'Display_Firmware.onlineVersion', <iobJS.State>{ val: desired_display_firmware_version, ack: true });
                    if (Debug) log('online display firmware version => ' + desired_display_firmware_version, 'info');
                } else {
                    log('Axios Status - check_online_display_firmware: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });

    } catch (err: any) {
        log('error requesting firmware in function check_online_display_firmware: ' + err.message, 'warn');
    }
}

//mqttCallback (topic: string, message: string): Promise<void> {
on({ id: config.panelRecvTopic }, async (obj) => {
    if (obj.state.val.startsWith('\{"CustomRecv":')) {
        try {
            const json = JSON.parse(obj.state.val);
            const split = json.CustomRecv.split(',');
            if (isSetOptionActive) {
                
                if (split[0] == 'event' && split[1] == 'startup') {
                    await createStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                    await createStateAsync(NSPanel_Path + 'NSPanel_Version', <iobJS.StateCommon>{ type: 'string', write: false });

                    await setStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.State>{ val: split[2], ack: true });
                    await setStateAsync(NSPanel_Path + 'NSPanel_Version', <iobJS.State>{ val: split[3], ack: true });
                    
                    if (autoCreateAlias) {
                        setObject(AliasPath + 'Display.TFTVersion', {type: 'channel', common: {role: 'info', name:'Display.TFTVersion'}, native: {}});
                        setObject(AliasPath + 'Display.Model', {type: 'channel', common: {role: 'info', name:'Display.Model'}, native: {}});
                        await createAliasAsync(AliasPath + 'Display.TFTVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                        await createAliasAsync(AliasPath + 'Display.Model.ACTUAL', NSPanel_Path + 'NSPanel_Version', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                    }
                }
            }
            
            if (isEventMethod(split[1])) HandleMessage(split[0], split[1], parseInt(split[2]), split);
        } catch (err: any) {
            log('error at trigger rceiving CustomRecv: ' + err.message, 'warn');
        }
        
    }
});

function update_berry_driver_version() {
    try {

        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1`;
        }        
        
        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
            .then(async function (response) {
                if (response.status === 200) {
                    if (Debug) {
                        log(response.data, 'info');
                    }
                } else {
                    log('Axios Status - update_berry_driver_version: ' + response.state, 'warn');
                }
            })
            .catch(function (error) {
                log(error, 'warn');
            });

    } catch (err: any) {
        log('error at function update_berry_driver_version: ' + err.message,  'warn');
    }
}

function update_tft_firmware() {
    if (getState(NSPanel_Path + 'Config.Update.activ').val == 0) {
        
        let desired_display_firmware_url =""
    
        if(getState(NSPanel_Path + 'NSPanel_Version').val =="us-l"){
            desired_display_firmware_url = `http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-l-${tft_version}.tft`;
        }else if (getState(NSPanel_Path + 'NSPanel_Version').val =="us-p"){
            desired_display_firmware_url = `http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-p-${tft_version}.tft`;
        }else{
            desired_display_firmware_url = `http://nspanel.pky.eu/lovelace-ui/github/nspanel-${tft_version}.tft`;
        }

        log('Start TFT-Upgrade for: ' + getState(NSPanel_Path + 'NSPanel_Version').val + ' Version', 'info');
        log('Install NextionTFT: ' + desired_display_firmware_url, 'info');

        try {
    
            let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=FlashNextion ${desired_display_firmware_url}`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=FlashNextion ${desired_display_firmware_url}`;
            }

            axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                .then(async function (response) {
                    if (response.status === 200) {
                        if (Debug) {
                            log(response.data, 'info');
                        }
                        await createStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string', write: false });
                        await setStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.State>{ val: tft_version, ack: true });
                        Init_Release();
                    } else {
                        log('Axios Status - update_tft_firmware: ' + response.state, 'warn');
                    }
                })
                .catch(function (error) {
                    log(error, 'warn');
                });
            
        } catch (err: any) {
            log('error request in function update_tft_firmware: ' + err.message, 'warn');
        }
    }
}

function update_tasmota_firmware() {
    try {
        if (getState(NSPanel_Path + 'Config.Update.activ').val == 0) {
            let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=OtaUrl ${tasmotaOtaUrl}${tasmotaOtaVersion}`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=OtaUrl ${tasmotaOtaUrl}${tasmotaOtaVersion}`;
            }

            axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                .then(async function (response) {
                    if (response.status === 200) {
                        if (Debug) {
                            log(response.data, 'info');
                        }
                    } else {
                        log('Axios Status - update_tasmota_firmware ==> set OTA: ' + response.state, 'warn');
                    }
                })
                .catch(function (error) {
                    log(error, 'warn');
                });

            urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Upgrade 1`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Upgrade 1`;
            }

            axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                .then(async function (response) {
                    if (response.status === 200) {
                        if (Debug) {
                            log(response.data, 'info');
                        }
                    } else {
                        log('Axios Status - update_tasmota_firmware: ' + response.state, 'warn');
                    }
                })
                .catch(function (error) {
                    log(error, 'warn');
                });

        }    
    } catch (err: any) {
        log('error request in function update_tasmota_firmware: ' + err.message, 'warn');
    }
}
//mqttCallback (topic: string, message: string): Promise<void> {
on({ id: config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'INFO1', change: 'ne'}, async (obj) => {
    try {
        if (getState(NSPanel_Path + 'Config.Update.activ').val == 0) {
            let Tasmota_JSON: any = JSON.parse(obj.state.val);
            if (Tasmota_JSON.Info1.Version.indexOf('safeboot') != -1) {
                log('Tasmota in Safeboot - Please wait while upgrading', 'warn');
                update_tasmota_firmware();
            } else {
                log('Tasmota upgrade complete. New Version: ' + Tasmota_JSON.Info1.Version, 'info');
                get_tasmota_status0();
                //check_updates();
            }
        }
    } catch (err: any) {
        log('error at trigger with reading senor-data: '+ err.message, 'warn');
    }
});

//------------------End Update Functions

async function SendToPanel(val: NSPanel.Payload | NSPanel.Payload[]) {
    try {
        if (Array.isArray(val)) {
            val.forEach(function (id) {
                setIfExists(config.panelSendTopic, id.payload);
                if (Debug) {
                    log('function SendToPanel payload: ' + id.payload, 'info');
                }
            });
        } else {
            setIfExists(config.panelSendTopic, val.payload);
        }

    } catch (err: any) {
        log('error at function SendToPanel: ' + err.message, 'warn');
    }
}

on({ id: NSPanel_Alarm_Path + 'Alarm.AlarmState', change: 'ne' }, async (obj) => {
    try {
        if ((obj.state ? obj.state.val : '') == 'armed' || (obj.state ? obj.state.val : '') == 'disarmed' || (obj.state ? obj.state.val : '') == 'triggered') {
            if (Debug) {
                log('Trigger AlarmState aktivePage: ' + activePage, 'info');
            }
            if (NSPanel_Path == getState(NSPanel_Alarm_Path + 'Alarm.PANEL').val) {
                if (activePage != undefined) GeneratePage(activePage!);
            }
        }
    } catch (err: any) {
        log('error at Trigger AlarmState: ' + err.message, 'warn');
    }
});

function HandleMessage(typ: string, method: NSPanel.EventMethod, page: number | undefined, words: string[] | undefined): void {
    try {
        if (typ == 'event') {
            switch (method as NSPanel.EventMethod) {
                case 'startup':
                    screensaverEnabled = false;
                    UnsubscribeWatcher();
                    HandleStartupProcess();
                    pageId = 0;
                    GeneratePage(config.pages[0]);
                    if (Debug) log('HandleMessage -> Startup', 'info');
                    Init_Release();
                    break;
                case 'sleepReached':
                    useMediaEvents = false;
                    screensaverEnabled = true;
                    if (pageId < 0)
                        pageId = 0;
                    HandleScreensaver();
                    if (Debug) log('HandleMessage -> sleepReached', 'info');
                    break;
                case 'pageOpenDetail':
                    if (words != undefined) {
                        screensaverEnabled = false;
                        UnsubscribeWatcher();
                        if (Debug) {
                            log('HandleMessage -> pageOpenDetail ' + words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4], 'info');
                        }
                        let tempId: PageItem['id'];
                        let tempPageItem = words[3].split('?');
                        let placeId: number | undefined = undefined;
                        if (!isNaN(parseInt(tempPageItem[0]))){
                            tempId = activePage!.items[tempPageItem[0]].id;
                            placeId = parseInt(tempPageItem[0])
                            if (tempId == undefined) {
                                throw new Error(`Missing id in HandleMessage!`)
                            }
                        } else {
                            tempId = tempPageItem[0];
                        }
                        let pageItem: PageItem = findPageItem(tempId);
                        if (pageItem !== undefined && isPopupType(words[2])) {
                            let temp: string | NSPanel.mediaOptional | undefined = tempPageItem[1]
                            if (isMediaOptional(temp)) SendToPanel(GenerateDetailPage(words[2], temp, pageItem, placeId));
                            else SendToPanel(GenerateDetailPage(words[2], undefined, pageItem, placeId));
                        }
                    }
                    break;
                case 'buttonPress2':
                    screensaverEnabled = false;
                    HandleButtonEvent(words);
                    if (Debug) {
                        if (words != undefined) log('HandleMessage -> buttonPress2 ' + words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4], 'info');
                    }
                    break;
                case 'renderCurrentPage':
                    // Event only for HA at this Moment
                    if (Debug) log('renderCurrentPage', 'info');
                    break;
                case 'button1':
                case 'button2':
                    screensaverEnabled = false;
                    HandleHardwareButton(method);
                    if (Debug) log('HandleMessage -> button1 /  button2', 'info')
                    break;
                default:
                    break;
            }
        }
    } catch (err: any) {
        log('error at function HandleMessage: ' + err.message, 'warn');
    }
}
//@ts-ignore ticaki bitte lösen, rückgabe kann undefined sein und ist es wenn ins catch gesprungen wird.
function findPageItem(searching: String): PageItem {
    try {

        let pageItem = activePage!.items.find(e => e.id === searching);

        if (pageItem !== undefined) {
            if (Debug) log('findPageItem -> pageItem ' + JSON.stringify(pageItem), 'info');
            return pageItem;
        }

        config.subPages.every(sp => {
            pageItem = sp.items.find(e => e.id === searching);

            return pageItem === undefined;
        });

        if (Debug) log('findPageItem -> pageItem SubPage ' + JSON.stringify(pageItem), 'info');
        //@ts-ignore ticaki bitte lösen, pageItem kann undefined sein.
        return pageItem;
    } catch (err: any) {
        log('error at function findPageItem: ' + err.message, 'warn');
    }
}

function GeneratePage(page: PageType): void {
    try {
            activePage = page;            
            setIfExists(NSPanel_Path + 'ActivePage.type', activePage.type, null, true);
            setIfExists(NSPanel_Path + 'ActivePage.heading', activePage.heading, null, true);
            setIfExists(NSPanel_Path + 'ActivePage.id0', activePage.items[0] !== undefined ? activePage.items[0].id : '', null, true);
            switch (page.type) {
                case 'cardEntities':
                    SendToPanel(GenerateEntitiesPage(page));
                    break;
                case 'cardThermo':
                    SendToPanel(GenerateThermoPage(page));
                    break;
                case 'cardGrid':
                    SendToPanel(GenerateGridPage(page));
                    break;
                case 'cardGrid2':
                    SendToPanel(GenerateGridPage2(page));
                    break;
                case 'cardMedia':
                    useMediaEvents = true;
                    SendToPanel(GenerateMediaPage(page));
                    break;
                case 'cardAlarm':
                    SendToPanel(GenerateAlarmPage(page));
                    break;
                case 'cardQR':
                    SendToPanel(GenerateQRPage(page));
                    break;
                case 'cardPower':
                    SendToPanel(GeneratePowerPage(page));
                    break;
                case 'cardChart':
                    SendToPanel(GenerateChartPage(page));
                    break;
                case 'cardLChart':
                    SendToPanel(GenerateChartPage(page));
                    break;
                case 'cardUnlock':
                    SendToPanel(GenerateUnlockPage(page));
                    break;
            }

    } catch (err: any) {
        if (err.message == "Cannot read properties of undefined (reading 'type')") {
            log('Please wait a few seconds longer when launching the NSPanel. Not all parameters are loaded yet.', 'warn');
        } else {
            log('error at function GeneratePage: ' + err.message, 'warn');
        }
    }
    
}

function HandleHardwareButton(method: NSPanel.EventMethod): void {
    try {
        let buttonConfig: NSPanel.ConfigButtonFunction = config[method];
        if(buttonConfig.mode === null) {
            return;
        }
        switch(buttonConfig.mode) {
            case 'page':
                if (Debug) log('HandleHardwareButton -> Mode Page', 'info');
                if (buttonConfig.page) {
                    if(method == 'button1') {
                        pageId = -1;
                    } else if (method == 'button2') {
                        pageId = -2;
                    }
                    GeneratePage(buttonConfig.page);
                    break;
                }
            case 'toggle':
                if (Debug) log('HandleHardwareButton -> Mode Toggle', 'info');
                if (buttonConfig.entity) {
                    let current = getState(buttonConfig.entity).val;
                    setState(buttonConfig.entity, !current);
                }
                screensaverEnabled = true;
                break;
            case 'set':
                if (Debug) log('HandleHardwareButton -> Mode Set', 'info');
                if (buttonConfig.setOn && existsState(buttonConfig.setOn.dp) && !buttonToggleState[method]) {
                    setState(buttonConfig.setOn.dp, buttonConfig.setOn.val);
                    buttonToggleState[method] = true;
                } else if (buttonConfig.setOff && existsState(buttonConfig.setOff.dp) && buttonToggleState[method]) {
                    setState(buttonConfig.setOff.dp, buttonConfig.setOff.val);
                    buttonToggleState[method] = false;
                } else if (buttonConfig.entity && existsState(buttonConfig.entity)) {
                    setState(buttonConfig.entity, buttonConfig.setValue);
                }
                screensaverEnabled = true;
                break;
        }
    } catch (err: any) {
        log('error at function HandleHardwareButton: ' + err.message, 'warn');
    }
}

function HandleStartupProcess(): void {
    SendDate();
    SendTime();
    SendToPanel({ payload: 'timeout~' + getState(NSPanel_Path + 'Config.Screensaver.timeoutScreensaver').val });
}

function SendDate(): void {
    try {
        if (existsObject(NSPanel_Path + 'Config.locale')) {
            let dpWeekday = existsObject(NSPanel_Path + 'Config.Dateformat.weekday') ? getState(NSPanel_Path + 'Config.Dateformat.weekday').val : 'short';
            let dpMonth = existsObject(NSPanel_Path + 'Config.Dateformat.month') ? getState(NSPanel_Path + 'Config.Dateformat.month').val : 'short';
			let dpCustomFormat = existsObject(NSPanel_Path + 'Config.Dateformat.customFormat') ? getState(NSPanel_Path + 'Config.Dateformat.customFormat').val : '';

            const date = new Date();
            const options: any = { weekday: dpWeekday, year: 'numeric', month: dpMonth, day: 'numeric' };
            const _SendDate = dpCustomFormat != '' ? dayjs().format(dpCustomFormat) : date.toLocaleDateString(getState(NSPanel_Path + 'Config.locale').val, options);

            SendToPanel({ payload: 'date~' + _SendDate });
        }
    } catch (err: any) {
        if (err.message = 'Cannot convert undefined or null to object') {
            log('Datumsformat noch nicht initialisiert', 'info');
        } else {
            log('error at function SendDate: ' + err.message, 'warn');
        }
    }
}

function SendTime(): void {
    try {
        /*const d = new Date();
        const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
        const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

        SendToPanel({ payload: 'time~' + hr + ':' + min });*/
        SendToPanel({ payload: `time~${new Date().toLocaleTimeString('de-DE', { hour: "2-digit", minute: "2-digit" })}`, });
    } catch (err: any) {
        log('error at function SendTime: ' + err.message, 'warn');
    }
}

function GenerateEntitiesPage(page: NSPanel.PageEntities): NSPanel.Payload[] {
    try {
        let out_msgs: NSPanel.Payload[];
        out_msgs = [{ payload: 'pageType~cardEntities' }]
        out_msgs.push({ payload: GeneratePageElements(page) });
        return out_msgs
    } catch (err: any) {
        log('error at function GenerateEntitiesPage: ' + err.message, 'warn');
        return [];
    }
}

function GenerateGridPage(page: NSPanel.PageGrid): NSPanel.Payload[] {
    try {
        let out_msgs: NSPanel.Payload[] = [{ payload: 'pageType~cardGrid' }];
        out_msgs.push({ payload: GeneratePageElements(page) });
        return out_msgs;
    } catch (err: any) {
        log('error at function GenerateGridPage: ' + err.message, 'warn');
        return [];
    }
}

function GenerateGridPage2(page: NSPanel.PageGrid2): NSPanel.Payload[] {
    try {
        let out_msgs: NSPanel.Payload[] = [{ payload: 'pageType~cardGrid2' }];
        out_msgs.push({ payload: GeneratePageElements(page) });
        return out_msgs;
    } catch (err: any) {
        log('error at function GenerateGridPage2: ' + err.message, 'warn');
        return [];
    }
}

function GeneratePageElements(page: PageType): string {
    try {
        activePage = page;
        let maxItems = 0;
        switch (page.type) {
            case 'cardThermo':
                maxItems = 1;
                break;
            case 'cardAlarm':
                maxItems = 1;
                break;
            case 'cardUnlock':
                maxItems = 1;
                break;
            case 'cardMedia':
                maxItems = 1;
                break;
            case 'cardQR':
                maxItems = 1;
                break;
            case 'cardPower':
                maxItems = 1;
                break;
            case 'cardChart':
                maxItems = 1;
                break;
            case 'cardEntities':
                if (getState(NSPanel_Path + 'NSPanel_Version').val == 'eu') {
                    maxItems = 4;
                } else {
                    maxItems = 5;
                }
                break;
            case 'cardGrid':
                maxItems = 6;
                break;
            case 'cardGrid2':
                if (getState(NSPanel_Path + 'NSPanel_Version').val == 'us-p') {
                    maxItems = 9;
                } else {
                    maxItems = 8;
                };
                break;
        }

        let pageData = 'entityUpd~' + page.heading + '~' + GetNavigationString(pageId);

        for (let index = 0; index < maxItems; index++) {
            if (page.items[index] !== undefined) {
                pageData += CreateEntity(page.items[index], index, 'useColor' in page ? page.useColor : false );
            }
        }
        if (Debug) log('GeneratePageElements pageData ' + pageData, 'info');
        return pageData;
    } catch (err: any) {
        log('error at function GeneratePageElements: ' + err.message, 'warn');
        return '';
    }
}

function CreateEntity(pageItem: PageItem, placeId: number, useColors: boolean = false): string {
    try {
        let iconId = '0';
        let iconId2 = '0';
        if (pageItem.id == 'delete') {
            return '~delete~~~~~';
        }
 
        let name: string;
        let buttonText: string = 'PRESS';
        let type: NSPanel.SerialType;

        // ioBroker
        if (pageItem.id && existsObject(pageItem.id) || pageItem.navigate === true) {
 
            let iconColor:number = rgb_dec565(config.defaultColor);
            let optVal:string = '0';
            let val: any = null;
 
            let o:any = undefined;
            if (pageItem.id != null && existsObject(pageItem.id)) {
                o = getObject(pageItem.id);
            } 
 
            // Fallback if no name is given
            name = pageItem.name !== undefined ? pageItem.name : o.common.name.de == undefined ? o.common.name : o.common.name.de;
            const prefix = pageItem.prefixName !== undefined ? pageItem.prefixName : '';
            const suffix = pageItem.suffixName !== undefined ? pageItem.suffixName : '';
 
            // If name is used with changing values
            if ((name || '').indexOf('getState(') != -1) {
                let dpName: string = name.slice(10, name.length -6);
                name = getState(dpName).val;
                RegisterEntityWatcher(dpName);
            }
            else if ((name || '').split('.').length > 3 && existsState(name)) {
                name = getState(name).val;
                RegisterEntityWatcher(name);
            }
            name = prefix + name + suffix;
 
            if (existsState(pageItem.id + '.GET')) {
                val = getState(pageItem.id + '.GET').val;
                RegisterEntityWatcher(pageItem.id + '.GET');
            }
            if(pageItem.monobutton != undefined && pageItem.monobutton == true){
                if (existsState(pageItem.id + '.ACTUAL')) {
                    val = getState(pageItem.id + '.ACTUAL').val;
                    RegisterEntityWatcher(pageItem.id + '.ACTUAL');
                }
            } else {
                if (existsState(pageItem.id + '.ACTUAL')) {
                    val = getState(pageItem.id + '.ACTUAL').val;
                    RegisterEntityWatcher(pageItem.id + '.ACTUAL');
                }
                if (existsState(pageItem.id + '.SET')) {
                    val = getState(pageItem.id + '.SET').val;
                    RegisterEntityWatcher(pageItem.id + '.SET');
                }
            }
            if (existsState(pageItem.id + '.ON_ACTUAL')) {
                val = getState(pageItem.id + '.ON_ACTUAL').val;
                RegisterEntityWatcher(pageItem.id + '.ON_ACTUAL');
            } 
            if (existsState(pageItem.id + '.ON_SET')) {
                val = getState(pageItem.id + '.ON_SET').val;
                RegisterEntityWatcher(pageItem.id + '.ON_SET');
            }
            if (existsState(pageItem.id + '.ON')) {
                val = getState(pageItem.id + '.ON').val;
                RegisterEntityWatcher(pageItem.id + '.ON');
            }
            
            if (pageItem.navigate) {
 
                if (pageItem.id == null && pageItem.targetPage != undefined) {
                    buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
 
                    if (Debug) log('CreateEntity statisch Icon Navi  ~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + pageItem.name + '~' + buttonText, 'info')
                    return '~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText;
 
                } else if (pageItem.id != null && pageItem.targetPage != undefined) {
 
                    type = 'button';
                    const role = o.common.role as NSPanel.roles;
                    switch (role) {
                        case 'socket':
                        case 'light':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
                            iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : iconId;
 
                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            if (existsState(pageItem.id + '.COLORDEC')) {
                                iconColor = getState(pageItem.id + '.COLORDEC').val;
                            } else {
                                if (val === true || val === 'true') {
                                    iconColor = GetIconColor(pageItem, true, useColors);
                                } else {
                                    iconColor = GetIconColor(pageItem, false, useColors);
                                }
                            }
                            if (val === true || val === 'true') { iconId = iconId2 };
                            break;
 
                        case 'blind':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                            iconColor = existsState(pageItem.id + '.COLORDEC') ? getState(pageItem.id + '.COLORDEC').val : GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? getState(pageItem.id + '.ACTUAL').val : true, useColors);
                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            break;
 
                        case 'door':
                        case 'window':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'door' ? Icons.GetIcon('door-closed') : Icons.GetIcon('window-closed-variant');
                            iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : role == 'door' ? Icons.GetIcon('door-open') : Icons.GetIcon('window-open-variant');
 
                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            if (existsState(pageItem.id + '.COLORDEC')) {
                                iconColor = getState(pageItem.id + '.COLORDEC').val;
                            } else {
                                if (val === true || val === 'true') {
                                    iconColor = GetIconColor(pageItem, true, useColors);
                                } else {
                                    iconColor = GetIconColor(pageItem, false, useColors);
                                }
                            }
                            if (val === true || val === 'true') { iconId = iconId2 };                       
                            break;
 
                        case 'info':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                            iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : iconId;
 
                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            if (existsState(pageItem.id + '.COLORDEC')) {
                                iconColor = getState(pageItem.id + '.COLORDEC').val;
                            } else {
                                if (val === true || val === 'true') {
                                    iconColor = GetIconColor(pageItem, false, useColors);
                                } else {
                                    iconColor = GetIconColor(pageItem, true, useColors);
                                }
                            }

                            if (pageItem.colorScale != undefined) {
                                let iconvalmin = (pageItem.colorScale.val_min != undefined) ? pageItem.colorScale.val_min : 0 ;
                                let iconvalmax = (pageItem.colorScale.val_max != undefined) ? pageItem.colorScale.val_max : 100 ;
                                let iconvalbest = (pageItem.colorScale.val_best != undefined) ? pageItem.colorScale.val_best : iconvalmin ;
                                let valueScale = val;
 
                                if (iconvalmin == 0 && iconvalmax == 1) {
                                    iconColor = (getState(pageItem.id).val == 1) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
                                } else {
                                    if (iconvalbest == iconvalmin) {
                                        valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                                    } else {
                                        if (valueScale < iconvalbest) {
                                            valueScale = scale(valueScale,iconvalmin, iconvalbest, 0, 10);
                                        } else if (valueScale > iconvalbest || iconvalbest != iconvalmin) {
                                            valueScale = scale(valueScale,iconvalbest, iconvalmax, 10, 0);
                                        } else {
                                            valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                                        }
                                    }
                                    let valueScaletemp = (Math.round(valueScale)).toFixed();
                                    iconColor = HandleColorScale(valueScaletemp);
                                }
                            }
                            
                            if (val === true || val === 'true') { iconId = iconId2 };
                            break;
 
                        case 'humidity':
 
                        case 'temperature':
 
                        case 'value.temperature':
 
                        case 'value.humidity':
 
                        case 'sensor.door':
 
                        case 'sensor.window':
 
                        case 'thermostat':
 
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'temperature' || role == 'value.temperature' || role == 'thermostat' ? Icons.GetIcon('thermometer') : Icons.GetIcon('information-outline');
            
                            let unit = '';
                            optVal = '0';
 
                            if (existsState(pageItem.id + '.ON_ACTUAL')) {
                                optVal = getState(pageItem.id + '.ON_ACTUAL').val;
                                unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ON_ACTUAL');
                            } else if (existsState(pageItem.id + '.ACTUAL')) {
                                optVal = getState(pageItem.id + '.ACTUAL').val;
                                unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ACTUAL');
                            } 
                            
                            iconColor = GetIconColor(pageItem, parseInt(optVal), useColors);
 
                            if (pageItem.colorScale != undefined) {
                                let iconvalmin = (pageItem.colorScale.val_min != undefined) ? pageItem.colorScale.val_min : 0 ;
                                let iconvalmax = (pageItem.colorScale.val_max != undefined) ? pageItem.colorScale.val_max : 100 ;
                                let iconvalbest = (pageItem.colorScale.val_best != undefined) ? pageItem.colorScale.val_best : iconvalmin ;
                                let valueScale = val;
 
                                if (iconvalmin == 0 && iconvalmax == 1) {
                                    iconColor = (getState(pageItem.id).val == 1) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
                                } else {
                                    if (iconvalbest == iconvalmin) {
                                        valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                                    } else {
                                        if (valueScale < iconvalbest) {
                                            valueScale = scale(valueScale,iconvalmin, iconvalbest, 0, 10);
                                        } else if (valueScale > iconvalbest || iconvalbest != iconvalmin) {
                                            valueScale = scale(valueScale,iconvalbest, iconvalmax, 10, 0);
                                        } else {
                                            valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                                        }
                                    }
                                    let valueScaletemp = (Math.round(valueScale)).toFixed();
                                    iconColor = HandleColorScale(valueScaletemp);
                                }
                            }
 
                            if (existsState(pageItem.id + '.USERICON')) {
                                iconId = Icons.GetIcon(getState(pageItem.id + '.USERICON').val);
                                if (Debug) log('iconid von ' + pageItem.id + '.USERICON: ' + getState(pageItem.id + '.USERICON').val, 'info');
                                RegisterEntityWatcher(pageItem.id + '.USERICON');
                            }
 
                            if (pageItem.useValue) {
                                if (pageItem.fontSize != undefined) {
                                    iconId = optVal + '¬' + pageItem.fontSize; 
                                } else {
                                    iconId = optVal; 
                                }
                            }

                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            break;
 
                        case 'warning':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                            iconColor = pageItem.onColor !== undefined ? GetIconColor(pageItem, true, useColors) : getState(pageItem.id + '.LEVEL').val;
                            name = pageItem.name !== undefined ? pageItem.name : getState(pageItem.id + '.INFO').val;
                            break;
 
                        default:
                            buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : existsState(pageItem.id + '.BUTTONTEXT') ? getState(pageItem.id + '.BUTTONTEXT').val : 'PRESS';
                            iconColor = pageItem.onColor !== undefined ? GetIconColor(pageItem, true, useColors) : existsState(pageItem.id + '.COLORDEC') ? getState(pageItem.id + '.COLORDEC').val : 65535;
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                            break;
                        //      return '~delete~~~~~';
                    }
 
                    if (Debug) log('CreateEntity Dynamische Icon Navi  ~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText, 'info')
                    return '~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText;
 
                } else {
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
 
                    if (Debug) log('CreateEntity Standard ~' + type + '~' + 'navigate.' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText, 'info')
                    return '~' + type + '~' + 'navigate.' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText;
                }
            }
            const role = o.common.role as NSPanel.roles
            switch (role) {
                case 'socket':
                case 'light':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
                    iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
                    
                    if (Debug) log('CreateEntity Icon role socket/light ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'hue':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? getState(pageItem.id + '.DIMMER').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (pageItem.interpolateColor != undefined && pageItem.interpolateColor == true && val) {
                        if (existsState(pageItem.id + '.HUE')) {
                            if (getState(pageItem.id + '.HUE').val != null) {
                                let huecolor = hsv2rgb(getState(pageItem.id + '.HUE').val, 1, 1);
                                let rgb: RGB = { red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2]) };
                                iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                            }
                        }
                    }
 
                    if (Debug) log('CreateEntity Icon role hue ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'ct':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? getState(pageItem.id + '.DIMMER').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (Debug) log('CreateEntity Icon role ct ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'rgb':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? getState(pageItem.id + '.DIMMER').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (existsState(pageItem.id + '.RED') && existsState(pageItem.id + '.GREEN') && existsState(pageItem.id + '.BLUE') && val) {
                        if (getState(pageItem.id + '.RED').val != null && getState(pageItem.id + '.GREEN').val != null && getState(pageItem.id + '.BLUE').val != null) {
                            let rgbRed = getState(pageItem.id + '.RED').val;
                            let rgbGreen = getState(pageItem.id + '.GREEN').val;
                            let rgbBlue = getState(pageItem.id + '.BLUE').val;
                            let rgb: RGB = { red: Math.round(rgbRed), green: Math.round(rgbGreen), blue: Math.round(rgbBlue) };
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    } 
 
                    if (Debug) log('CreateEntity Icon role rgb ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'cie':
                case 'rgbSingle':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1'
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? getState(pageItem.id + '.DIMMER').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (existsState(pageItem.id + '.RGB') && val) {
                        if (getState(pageItem.id + '.RGB').val != null) {
                            let hex = getState(pageItem.id + '.RGB').val;
                            let hexRed = parseInt(hex[1] + hex[2], 16);
                            let hexGreen = parseInt(hex[3] + hex[4], 16);
                            let hexBlue = parseInt(hex[5] + hex[6], 16);
                            let rgb: RGB = { red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue) };
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    } 
 
                    if (Debug) log('CreateEntity Icon role cie/rgbSingle ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'dimmer':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? getState(pageItem.id + '.ACTUAL').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (Debug) log('CreateEntity Icon role dimmer ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'blind':
                    type = 'shutter';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? getState(pageItem.id + '.ACTUAL').val : true, useColors);

                    let min_Level: number = 0;
                    let max_Level: number = 100;
                    if (pageItem.minValueLevel !== undefined && pageItem.maxValueLevel !== undefined) {
                        min_Level = pageItem.minValueLevel;
                        max_Level = pageItem.maxValueLevel;
                        val = Math.trunc(scale(getState(pageItem.id + '.ACTUAL').val, pageItem.minValueLevel, pageItem.maxValueLevel, 100, 0));
                    }

                    let icon_up = Icons.GetIcon('arrow-up');
                    let icon_stop = Icons.GetIcon('stop');
                    let icon_down = Icons.GetIcon('arrow-down');

                    if (Debug) log('pageItem.id: ' + getState(pageItem.id + '.ACTUAL').val, 'info');
                    if (Debug) log('min_Level: ' + min_Level, 'info');
                    if (Debug) log('max_Level: ' + max_Level, 'info');

                    let icon_up_status = 'enable';
                    let icon_down_status = 'enable';

                    let tempVal: number = getState(pageItem.id + '.ACTUAL').val 

                    //Disabled Status while bug in updating origin adapter data points of lift values
                    //let icon_up_status = tempVal === min_Level ? 'disable' : 'enable';
                    let icon_stop_status = 'enable';
                    if (tempVal === min_Level || tempVal === max_Level || checkBlindActive === false) {
                        //icon_stop_status = 'disable';
                    }
                    //let icon_down_status = tempVal === max_Level ? 'disable' : 'enable';
                    let value = icon_up + '|' + icon_stop + '|' + icon_down + '|' + icon_up_status + '|' + icon_stop_status + '|' + icon_down_status
                    
                    if (Debug) log('CreateEntity Icon role blind ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + value, 'info');

                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + value;
                    
                case 'gate':
                    type = 'text';
                    let gateState: string | undefined = undefined;
                    if (existsState(pageItem.id + '.ACTUAL')) {
 
                        if (getState(pageItem.id + '.ACTUAL').val == 0 || getState(pageItem.id + '.ACTUAL').val === false) {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('garage');
                            iconColor = GetIconColor(pageItem, false, useColors);
                            gateState = findLocale('window', 'closed');
                        } else {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('garage-open');
                            iconId = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : Icons.GetIcon('garage-open');
                            iconColor = GetIconColor(pageItem, true, useColors);
                            gateState = findLocale('window', 'opened');
                        }
 
                    }
                    if (gateState == undefined) {
                        throw new Error(`Missing ${pageItem.id}.ACTUAL for type ${type}`)
                    }
 
                    if (Debug) log('CreateEntity Icon role gate ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + gateState, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + gateState;
 
                case 'door':
                case 'window':
                    type = 'text';
                    let windowState;
 
                    if (existsState(pageItem.id + '.ACTUAL')) {
                        if (getState(pageItem.id + '.ACTUAL').val) {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'door' ? Icons.GetIcon('door-open') : Icons.GetIcon('window-open-variant');
                            iconColor = GetIconColor(pageItem, true, useColors);
                            windowState = findLocale('window', 'opened');
                        } else {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'door' ? Icons.GetIcon('door-closed') : Icons.GetIcon('window-closed-variant');
                            iconId = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : iconId;
                            iconColor = GetIconColor(pageItem, false, useColors);
                            windowState = findLocale('window', 'closed');
                        }
                    }
 
                    if (Debug) log('CreateEntity Icon role door/window ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + windowState, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + windowState;
 
                case 'motion': 
                    type = 'text';
                    if (val === true) {
                        optVal = 'On';
                        iconColor = GetIconColor(pageItem, true, useColors);
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('motion-sensor');
                    } else {
                        optVal = 'Off';
                        iconColor = GetIconColor(pageItem, false, useColors);
                        iconId = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : Icons.GetIcon('motion-sensor');
                    }
 
                    if (Debug) log('CreateEntity Icon role motion ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;
 
                case 'info':
 
                case 'humidity':
 
                case 'temperature':
 
                case 'value.temperature':
 
                case 'value.humidity':
 
                case 'sensor.door':
 
                case 'sensor.window':
 
                case 'thermostat':
                    type = 'text';
 
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'temperature' || role == 'value.temperature' || role == 'thermostat' ? Icons.GetIcon('thermometer') : Icons.GetIcon('information-outline');
     
                    let unit = '';
                    optVal = '0';
 
                    if (existsState(pageItem.id + '.ON_ACTUAL')) {
                        optVal = getState(pageItem.id + '.ON_ACTUAL').val;
                        unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ON_ACTUAL');
                    } else if (existsState(pageItem.id + '.ACTUAL')) {
                        optVal = getState(pageItem.id + '.ACTUAL').val;
                        unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ACTUAL');
                    }
  
                    iconColor = GetIconColor(pageItem, parseInt(optVal), useColors);
 
                    if (pageItem.colorScale != undefined) {
                        let iconvalmin = (pageItem.colorScale.val_min != undefined) ? pageItem.colorScale.val_min : 0 ;
                        let iconvalmax = (pageItem.colorScale.val_max != undefined) ? pageItem.colorScale.val_max : 100 ;
                        let iconvalbest = (pageItem.colorScale.val_best != undefined) ? pageItem.colorScale.val_best : iconvalmin ;
                        let valueScale = val;
 
                        if (iconvalmin == 0 && iconvalmax == 1) {
                            iconColor = (!pageItem.id || getState(pageItem.id).val == 1) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
                        } else {
                            if (iconvalbest == iconvalmin) {
                                valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                            } else {
                                if (valueScale < iconvalbest) {
                                    valueScale = scale(valueScale,iconvalmin, iconvalbest, 0, 10);
                                } else if (valueScale > iconvalbest || iconvalbest != iconvalmin) {
                                    valueScale = scale(valueScale,iconvalbest, iconvalmax, 10, 0);
                                } else {
                                    valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                                }
                            }
                            let valueScaletemp = (Math.round(valueScale)).toFixed();
                            iconColor = HandleColorScale(valueScaletemp);
                        }
                    }
 
                    if (existsState(pageItem.id + '.USERICON')) {
                        iconId = Icons.GetIcon(getState(pageItem.id + '.USERICON').val);
                        if (Debug) log('iconid von ' + pageItem.id + '.USERICON: ' + getState(pageItem.id + '.USERICON').val, 'info');
                        RegisterEntityWatcher(pageItem.id + '.USERICON');
                    }
 
                    if (pageItem.useValue) {
                        if (pageItem.fontSize != undefined) {
                            iconId = optVal + '¬' + pageItem.fontSize; 
                        } else {
                            iconId = optVal; 
                        }
                    }
 
                    if (Debug) log('CreateEntity Icon role info, humidity, temperature, value.temperature, value.humidity, sensor.door, sensor.window, thermostat', 'info');
                    if (Debug) log('CreateEntity  ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal+ ' ' + unit, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal + ' ' + unit;
 
                case 'buttonSensor':
 
                    type = 'input_sel';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let inSelText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
 
                    if (Debug) log('CreateEntity  Icon role buttonSensor ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + inSelText, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + inSelText;
 
                case 'button':
                    type = 'button';

                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    if (val === false) {
                        iconColor = GetIconColor(pageItem, false, useColors);
                    }

                    let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
 
                    if (Debug) log('CreateEntity  Icon role button ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText;
                case 'value.time':
                case 'level.timer':
                    type = 'timer';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let timerText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
 
                    if (existsState(pageItem.id + '.STATE')) {
                        val = getState(pageItem.id + '.STATE').val;
                        RegisterEntityWatcher(pageItem.id + '.STATE');
                    }
 
                    if (Debug) log('CreateEntity  Icon role level.timer ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + timerText, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + timerText;

                case 'value.alarmtime':
                    type = 'timer'; 
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('timer-outline');
                    let alarmtimerText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
 
                    if (existsState(pageItem.id + '.STATE')) {
                        val = getState(pageItem.id + '.STATE').val;
                        iconColor = (val == 'paused') ? rgb_dec565(colorScale10) : rgb_dec565(colorScale0);
                    }

                    if (existsState(pageItem.id + '.ACTUAL')) {
                        let timer_actual = getState(pageItem.id + '.ACTUAL').val
                        name = ('0' + String(Math.floor(timer_actual / 60))).slice(-2) + ':' + ('0' + String(timer_actual % 60)).slice(-2);
                    }

                    if (Debug) log('CreateEntity  Icon role value.alarmtime ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + alarmtimerText + ' ' + val, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + alarmtimerText;

                case 'level.mode.fan':
 
                    type = 'fan';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('fan');
                    optVal = '0';
 
                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }
 
                    if (Debug) log('CreateEntity  Icon role level.mode.fan ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;                
                    
                case 'lock':
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lock');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let lockState;
 
                    if (existsState(pageItem.id + '.ACTUAL')) {
                        if (getState(pageItem.id + '.ACTUAL').val) {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lock');
                            iconColor = GetIconColor(pageItem, true, useColors);
                            lockState = findLocale('lock', 'UNLOCK');
                        } else {
                            iconId = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : Icons.GetIcon('lock-open-variant');
                            iconColor = GetIconColor(pageItem, false, useColors);
                            lockState = findLocale('lock', 'LOCK');
                        }
                        lockState = pageItem.buttonText !== undefined ? pageItem.buttonText : lockState;
                    }
 
                    if (Debug) log('CreateEntity  Icon role lock ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + lockState, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + lockState;
 
                case 'slider':
                    type = 'number';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('plus-minus-variant');
 
                    iconColor = GetIconColor(pageItem, false, useColors);
 
                    if (Debug) log('CreateEntity  Icon role slider ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue;
 
                case 'volumeGroup':
                case 'volume':
                    type = 'number';
                    iconColor = GetIconColor(pageItem, false, useColors)
                    if (existsState(pageItem.id + '.MUTE')) {
                        getState(pageItem.id + '.MUTE').val ? iconColor = GetIconColor(pageItem, false, useColors) : iconColor = GetIconColor(pageItem, true, useColors);
                        RegisterEntityWatcher(pageItem.id + '.MUTE');
                    }
 
                    if (val > 0 && val <= 33 && !getState(pageItem.id + '.MUTE').val) {
                        iconId = Icons.GetIcon('volume-low');
                    } else if (val > 33 && val <= 66 && !getState(pageItem.id + '.MUTE').val) {
                        iconId = Icons.GetIcon('volume-medium');
                    } else if (val > 66 && val <= 100 && !getState(pageItem.id + '.MUTE').val) {
                        iconId = Icons.GetIcon('volume-high');
                    } else {
                        iconId = Icons.GetIcon('volume-mute');
                    }
 
                    if (Debug) log('CreateEntity  Icon role volumeGroup/volume ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue, 'info');
                    return '~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue;
 
                case 'warning':
                    type = 'text';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('alert-outline');
                    iconColor = getState(([pageItem.id, '.LEVEL'].join(''))).val;
                    let itemName = getState(([pageItem.id, '.TITLE'].join(''))).val;
                    let itemInfo = getState(([pageItem.id, '.INFO'].join(''))).val;
 
                    RegisterEntityWatcher(pageItem.id + '.LEVEL');
                    RegisterEntityWatcher(pageItem.id + '.INFO');
 
                    if (pageItem.useValue) {
                        iconId = itemInfo; 
                    }
 
                    if (Debug) log('CreateEntity  Icon role warning ~' + type + '~' + placeId + '~' + iconId + '~' + iconColor + '~' + itemName + '~' + itemInfo, 'info');
                    return '~' + type + '~' + itemName + '~' + iconId + '~' + iconColor + '~' + itemName + '~' + itemInfo;
 
                case 'timeTable':
                    type = 'text';
                    let itemFahrzeug:string = getState(pageItem.id + '.VEHICLE').val;
                    let itemUhrzeit:string = getState(pageItem.id + '.ACTUAL').val;
                    let itemRichtung:string = getState(pageItem.id + '.DIRECTION').val;
                    let itemVerspaetung:boolean = getState(pageItem.id + '.DELAY').val;
    
                    if (Icons.GetIcon(itemFahrzeug) != "") {
                        iconId = Icons.GetIcon(itemFahrzeug)
                    }else {
                        iconId=''
                    };
    
                    iconColor = (!itemVerspaetung) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
    
                    if (Debug) log('CreateEntity  Icon role timeTable ~' + type + '~' + itemRichtung + '~' + iconId + '~' + iconColor + '~' + itemRichtung + '~' + itemUhrzeit, 'info');
                    return '~' + type + '~' + itemRichtung + '~' + iconId + '~' + iconColor + '~' + itemRichtung + '~' + itemUhrzeit;
    
                default:
                    if (Debug) log('CreateEntity Icon keine passende Rolle gefunden', 'warn');
                    return '~delete~~~~~';
            }    
        }
        if (Debug) log('CreateEntity  return ~delete~~~~~', 'info');
        return '~delete~~~~~';
    } catch (err: any) {
        if (err.message == "Cannot read properties of undefined (reading 'common')") {
            log('Found Alias without channel: ' + pageItem.id + '! Please correct the Alias', 'warn');
            return '';
        } else {
            log('error at function CreateEntity: ' + err.message, 'warn');
            return '';
        }
    }
}

function findLocale(controlsObject: string, controlsState: string): string {
    const locale = getState(NSPanel_Path + 'Config.locale').val;
    const strJson = getState(NSPanel_Path + 'NSPanel_locales_json').val;

    if (Debug) {
        log(controlsObject + ' - ' + controlsState, 'info');
    }

    try {
        const obj = JSON.parse(strJson);
        const strLocale = obj[controlsObject][controlsState][locale];

        if (strLocale != undefined) {
            return strLocale;
        } else {
            return controlsState;
        }

    } catch (err: any) {
        if (err.message.substring(0, 35) == 'Cannot read properties of undefined') {
            if (Debug) {
                log('function findLocale: missing translation: ' + controlsObject + ' - ' + controlsState, 'info');
            }
        } else {
            log('error at function findLocale: ' + err.message, 'warn');
        }
        return controlsState;
    }
}

function findLocaleServMenu(controlsState: string): string {
    const locale = getState(NSPanel_Path + 'Config.locale').val;
    const strJson = getState(NSPanel_Path + 'NSPanel_locales_service_json').val;

    if (Debug) {
        log(controlsState, 'info');
    }

    try {
        const obj = JSON.parse(strJson);
        const strLocale = obj[controlsState][locale];

        if (strLocale != undefined) {
            return strLocale;
        } else {
            if (obj[controlsState]['en-US'] != undefined) {
                return obj[controlsState]['en-US'];
            } else {
                return controlsState;
            }
        }

    } catch (err: any) {
        if (err.message.substring(0, 35) == 'Cannot read properties of undefined') {
            if (Debug) {
                log('function findLocale: missing translation: ' + controlsState, 'info');
            }
        } else {
            log('error at function findLocale: ' + err.message, 'warn');
        }
        return controlsState;
    }
}

function GetIconColor(pageItem: PageItem, value: (boolean | number), useColors: boolean): number {
    try {
        // dimmer
        if ((pageItem.useColor || useColors) && pageItem.interpolateColor && typeof (value) === 'number') {
            let maxValue = pageItem.maxValueBrightness !== undefined ? pageItem.maxValueBrightness : 100;
            let minValue = pageItem.minValueBrightness !== undefined ? pageItem.minValueBrightness : 0;
            if (pageItem.maxValue !== undefined) maxValue = pageItem.maxValue;
            if (pageItem.minValue !== undefined) minValue = pageItem.minValue;
            value = value > maxValue ? maxValue : value;
            value = value < minValue ? minValue : value;

            return rgb_dec565(
                Interpolate(
                    pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor,
                    pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor,
                    scale(100 - value, minValue, maxValue, 0, 1)
                )
            );
        }

        if ((pageItem.useColor || useColors) && (typeof (value) === 'boolean' && value) || ((typeof (value) === 'number') && (value > (pageItem.minValueBrightness !== undefined ? pageItem.minValueBrightness : 0)))) {
            return rgb_dec565(pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor);
        }

        return rgb_dec565(pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor);
    } catch (err: any) {
        log('error at function GetIconColor: ' + err.message, 'warn');
        return -1;
    }
}

function RegisterEntityWatcher(id: string): void {
    try {
        if (subscriptions.hasOwnProperty(id)) {
            return;
        }

        subscriptions[id] = (on({ id: id, change: 'any' }, () => {
            if (pageId == -1 && config.button1.page) {
                SendToPanel({ payload: GeneratePageElements(config.button1.page) });
            }
            if (pageId == -2 && config.button2.page) {
                SendToPanel({ payload: GeneratePageElements(config.button2.page) });
            }
            if (activePage !== undefined) {
                SendToPanel({ payload: GeneratePageElements(activePage!) });
            }
        }));
    } catch (err: any) {
        log('error at function RegisterEntityWatcher: ' + err.message, 'warn');
    }
}

function RegisterDetailEntityWatcher(id: string, pageItem: PageItem, type: NSPanel.PopupType, placeId: number | undefined): void {
    try {
        if (subscriptions.hasOwnProperty(id)) {
            return;
        }
  
        if (Debug) log('id: ' + id + ' - pageItem: ' + JSON.stringify(pageItem) + ' - type: ' + type + ' - placeId: ' + placeId, 'info');

        subscriptions[id] = (on({ id: id, change: 'any' }, () => {
            SendToPanel(GenerateDetailPage(type, undefined, pageItem, placeId));
        }))
    } catch (err: any) {
        log('error at function RegisterDetailEntityWatcher: ' + err.message, 'warn');
    }
}

function GetUnitOfMeasurement(id: string): string {
    try {
        if (!existsObject(id))
            return '';

        let obj = getObject(id);
        if (typeof obj.common.unit !== 'undefined') {
            return obj.common.unit;
        }

        if (typeof obj.common.alias !== 'undefined' && typeof obj.common.alias.id !== 'undefined') {
            return GetUnitOfMeasurement(obj.common.alias.id);
        }

        return '';
    } catch (err: any) {
        log('error at function GetUnitOfMeasurement: ' + err.message, 'warn');
        return ''
    }
}

function GenerateThermoPage(page: NSPanel.PageThermo): NSPanel.Payload[] {
    try {
        UnsubscribeWatcher();
        let id = page.items[0].id
        let out_msgs: NSPanel.Payload[] = [];
        out_msgs.push({ payload: 'pageType~cardThermo' });
        
        // ioBroker
        if (id && existsObject(id)) {
            let o = getObject(id);
            let name = page.heading !== undefined ? page.heading : o.common.name.de;
            let currentTemp = 0;
            if (existsState(id + '.ACTUAL')) {
                currentTemp = (Math.round(parseFloat(getState(id + '.ACTUAL').val) * 10) / 10);
            }

            let minTemp = page.items[0].minValue !== undefined ? page.items[0].minValue : 50;   //Min Temp 5°C
            let maxTemp = page.items[0].maxValue !== undefined ? page.items[0].maxValue : 300;  //Max Temp 30°C
            let stepTemp = page.items[0].stepValue !== undefined ? page.items[0].stepValue : 5; //Default 0,5° Schritte

            let destTemp = 0;
            if (existsState(id + '.SET')) {
                // using minValue, if .SET is null (e.g. for tado AWAY or tado is off)
                let setValue = getState(id + '.SET').val;
                if (setValue == null) {
                    setValue = minTemp;
                }

                destTemp = setValue.toFixed(2) * 10;
            }
            let statusStr: String = 'MANU';

            if (existsState(id + '.MODE') && getState(id + '.MODE').val != null) {
                if (getState(id + '.MODE').val === 1) {
                    statusStr = 'MANU';
                } else {
                    statusStr = 'AUTO';
                }
            }

            //Add attributes if defined in alias
            let i_list = Array.prototype.slice.apply($('[state.id="' + id + '.*"]'));
            let bt = ['~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~'];
            
            let tempIcon: string = '';
            
            if ((i_list.length - 3) != 0) {

                let i = 0;
                switch (o.common.role as NSPanel.roles) {
                    case 'thermostat': {

                        if (existsState(id + '.AUTOMATIC') && getState(id + '.AUTOMATIC').val != null) {
                            if (getState(id + '.AUTOMATIC').val) {
                                bt[i++] = Icons.GetIcon('alpha-a-circle') + '~' + rgb_dec565(On) + '~1~' + 'AUTT' + '~';
                                statusStr = 'AUTO';
                            } else {
                                bt[i++] = Icons.GetIcon('alpha-a-circle') + '~33840~1~' + 'AUTT' + '~';
                            }
                        }
                        if (existsState(id + '.MANUAL') && getState(id + '.MANUAL').val != null) {
                            if (getState(id + '.MANUAL').val) {
                                bt[i++] = Icons.GetIcon('alpha-m-circle') + '~' + rgb_dec565(On) + '~1~' + 'MANT' + '~';
                                statusStr = 'MANU';
                            } else {
                                bt[i++] = Icons.GetIcon('alpha-m-circle') + '~33840~1~' + 'MANT' + '~';
                            }
                        }
                        if (existsState(id + '.PARTY') && getState(id + '.PARTY').val != null) {
                            if (getState(id + '.PARTY').val) {
                                bt[i++] = Icons.GetIcon('party-popper') + '~' + rgb_dec565(On) + '~1~' + 'PART' + '~';
                                statusStr = 'PARTY';
                            } else {
                                bt[i++] = Icons.GetIcon('party-popper') + '~33840~1~' + 'PART' + '~';
                            }
                        }
                        if (existsState(id + '.VACATION') && getState(id + '.VACATION').val != null) {
                            if (getState(id + '.VACATION').val) {
                                bt[i++] = Icons.GetIcon('palm-tree') + '~' + rgb_dec565(On) + '~1~' + 'VACT' + '~';
                                statusStr = 'VAC';
                            } else {
                                bt[i++] = Icons.GetIcon('palm-tree') + '~33840~1~' + 'VACT' + '~';
                            }
                        }
                        if (existsState(id + '.BOOST') && getState(id + '.BOOST').val != null) {
                            if (getState(id + '.BOOST').val) {
                                bt[i++] = Icons.GetIcon('fast-forward-60') + '~' + rgb_dec565(On) + '~1~' + 'BOOT' + '~';
                                statusStr = 'BOOST';
                            } else {
                                bt[i++] = Icons.GetIcon('fast-forward-60') + '~33840~1~' + 'BOOT' + '~';
                            }
                        }

                        for (let i_index in i_list) {
                            let thermostatState = i_list[i_index].split('.');
                            if (
                                thermostatState[thermostatState.length - 1] != 'SET' &&
                                thermostatState[thermostatState.length - 1] != 'ACTUAL' &&
                                thermostatState[thermostatState.length - 1] != 'MODE'
                            ) {
                                i++;

                                switch (thermostatState[thermostatState.length - 1]) {
                                    case 'HUMIDITY':
                                        if (existsState(id + '.HUMIDITY') && getState(id + '.HUMIDITY').val != null) {
                                            if (parseInt(getState(id + '.HUMIDITY').val) < 40) {
                                                bt[i - 1] = Icons.GetIcon('water-percent') + '~65504~1~' + 'HUM' + '~';
                                            } else if (parseInt(getState(id + '.HUMIDITY').val) < 30) {
                                                bt[i - 1] = Icons.GetIcon('water-percent') + '~63488~1~' + 'HUM' + '~';
                                            } else if (parseInt(getState(id + '.HUMIDITY').val) >= 40) {
                                                bt[i - 1] = Icons.GetIcon('water-percent') + '~2016~1~' + 'HUM' + '~';
                                            } else if (parseInt(getState(id + '.HUMIDITY').val) > 65) {
                                                bt[i - 1] = Icons.GetIcon('water-percent') + '~65504~1~' + 'HUM' + '~';
                                            } else if (parseInt(getState(id + '.HUMIDITY').val) > 75) {
                                                bt[i - 1] = Icons.GetIcon('water-percent') + '~63488~1~' + 'HUM' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'LOWBAT':
                                        if (existsState(id + '.LOWBAT') && getState(id + '.LOWBAT').val != null) {
                                            if (getState(id + '.LOWBAT').val) {
                                                bt[i - 1] = Icons.GetIcon('battery-low') + '~63488~1~' + 'LBAT' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('battery-high') + '~2016~1~' + 'LBAT' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'MAINTAIN':
                                        if (existsState(id + '.MAINTAIN') && getState(id + '.MAINTAIN').val != null) {
                                            if (getState(id + '.MAINTAIN').val >> .1) {
                                                bt[i - 1] = Icons.GetIcon('account-wrench') + '~60897~1~' + 'MAIN' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('account-wrench') + '~33840~1~' + 'MAIN' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'UNREACH':
                                        if (existsState(id + '.UNREACH') && getState(id + '.UNREACH').val != null) {
                                            if (getState(id + '.UNREACH').val) {
                                                bt[i - 1] = Icons.GetIcon('wifi-off') + '~63488~1~' + 'WLAN' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('wifi') + '~2016~1~' + 'WLAN' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'POWER':
                                        if (existsState(id + '.POWER') && getState(id + '.POWER').val != null) {
                                            if (getState(id + '.POWER').val) {
                                                bt[i - 1] = Icons.GetIcon('power-standby') + '~2016~1~' + 'POWER' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('power-standby') + '~33840~1~' + 'POWER' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'ERROR':
                                        if (existsState(id + '.ERROR') && getState(id + '.ERROR').val != null) {
                                            if (getState(id + '.ERROR').val) {
                                                bt[i - 1] = Icons.GetIcon('alert-circle') + '~63488~1~' + 'ERR' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('alert-circle') + '~33840~1~' + 'ERR' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'WORKING':
                                        if (existsState(id + '.WORKING') && getState(id + '.WORKING').val != null) {
                                            if (getState(id + '.WORKING').val) {
                                                bt[i - 1] = Icons.GetIcon('briefcase-check') + '~2016~1~' + 'WORK' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('briefcase-check') + '~33840~1~' + 'WORK' + '~';
                                            }
                                        } else i--;
                                        break;
                                    case 'WINDOWOPEN':
                                        if (existsState(id + '.WINDOWOPEN') && getState(id + '.WINDOWOPEN').val != null) {
                                            if (getState(id + '.WINDOWOPEN').val) {
                                                bt[i - 1] = Icons.GetIcon('window-open-variant') + '~63488~1~' + 'WIN' + '~';
                                            } else {
                                                bt[i - 1] = Icons.GetIcon('window-closed-variant') + '~2016~1~' + 'WIN' + '~';
                                            }
                                        } else i--;
                                        break;
                                    default:
                                        i--;
                                        break;
                                }
                            }
                        }

                        for (let j = i; j < 9; j++) {
                            bt[j] = '~~~~';
                        }
                    }
                    break;
                    case 'airCondition': {
                        if (existsState(id + '.MODE') && getState(id + '.MODE').val != null) {
                            let Mode = getState(id + '.MODE').val
                            let States = getObject(id + '.MODE').common.states;

                            let iconIndex: number = 1;
                            for (const statekey in States) {
                                let stateName: string = States[statekey];
                                let stateKeyNumber: number = parseInt(statekey);
                                if (stateName == 'OFF' || stateKeyNumber > 6) {
                                    continue;
                                }
                                if (stateKeyNumber == Mode) {
                                    statusStr = stateName.replace('_', ' ');
                                }

                                switch (stateName) {
                                    case 'AUTO':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[1] !== '') {
                                            tempIcon = page.items[0].iconArray[1];
                                        } else {
                                            tempIcon = 'air-conditioner';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~1024~1~' + 'AUTO' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'AUTO' + '~';
                                        }
                                        break;
                                    case 'COOL':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[2] !== '') {
                                            tempIcon = page.items[0].iconArray[2];
                                        } else {
                                            tempIcon = 'snowflake';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~11487~1~' + 'COOL' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'COOL' + '~';
                                        }
                                        break;
                                    case 'HEAT':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[3] !== '') {
                                            tempIcon = page.items[0].iconArray[3];
                                        } else {
                                            tempIcon = 'fire';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~64512~1~' + 'HEAT' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'HEAT' + '~';
                                        }
                                        break;
                                    case 'ECO':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[4] !== '') {
                                            tempIcon = page.items[0].iconArray[4];
                                        } else {
                                            tempIcon = 'alpha-e-circle-outline';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~2016~1~' + 'ECO' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'ECO' + '~';
                                        }
                                        break;
                                    case 'FAN_ONLY':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[5] !== '') {
                                            tempIcon = page.items[0].iconArray[5];
                                        } else {
                                            tempIcon = 'fan';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~11487~1~' + 'FAN_ONLY' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'FAN_ONLY' + '~';
                                        }
                                        break;
                                    case 'DRY':
                                        if (page.items[0].iconArray !== undefined && page.items[0].iconArray[6] !== '') {
                                            tempIcon = page.items[0].iconArray[6];
                                        } else {
                                            tempIcon = 'water-percent';
                                        }
                                        if (stateKeyNumber == Mode) {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~60897~1~' + 'DRY' + '~';
                                        } else {
                                            bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'DRY' + '~';
                                        }
                                        break;
                                }
                                iconIndex++;
                            }

                            if (iconIndex <= 7 && existsState(id + '.ECO') && getState(id + '.ECO').val != null) {
                                if (page.items[0].iconArray !== undefined && page.items[0].iconArray[4] !== '') {
                                    tempIcon = page.items[0].iconArray[4];
                                } else {
                                    tempIcon = 'alpha-e-circle-outline';
                                }
                                if (getState(id + '.ECO').val && getState(id + '.ECO').val == 1) {
                                    bt[iconIndex] = Icons.GetIcon(tempIcon) + '~2016~1~' + 'ECO' + '~';
                                    statusStr = 'ECO';
                                } else {
                                    bt[iconIndex] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'ECO' + '~';
                                }
                                iconIndex++;
                            }

                            if (iconIndex <= 7 && existsState(id + '.SWING') && getState(id + '.SWING').val != null) {
                                if (page.items[0].iconArray !== undefined && page.items[0].iconArray[7] !== '') {
                                    tempIcon = page.items[0].iconArray[7];
                                } else {
                                    tempIcon = 'swap-vertical-bold';
                                }
                                if (getState(id + '.POWER').val && getState(id + '.SWING').val == 1) {          //0=ON oder .SWING = true
                                    bt[7] = Icons.GetIcon(tempIcon) + '~2016~1~' + 'SWING' + '~';
                                } else {
                                    bt[7] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'SWING' + '~';
                                }
                                iconIndex++;
                            }

                            // Power Icon zuletzt pruefen, damit der Mode ggf. mit OFF ueberschrieben werden kann
                            if (existsState(id + '.POWER') && getState(id + '.POWER').val != null) {
                                if (page.items[0].iconArray !== undefined && page.items[0].iconArray[0] !== '') {
                                    tempIcon = page.items[0].iconArray[0];
                                } else {
                                    tempIcon = 'power-standby';
                                }
                                if (States[Mode] == 'OFF' || !getState(id + '.POWER').val) {
                                    bt[0] = Icons.GetIcon(tempIcon) + '~35921~0~' + 'POWER' + '~';
                                    statusStr = 'OFF';
                                }
                                else {
                                    bt[0] = Icons.GetIcon(tempIcon) + '~2016~1~' + 'POWER' + '~';
                                }
                            }
                        }
                    }
                    break;
                }
            }

            let destTemp2 = '';
            if (page.items[0].setThermoDestTemp2 != undefined) {
                let setValue2 = getState(id + '.' + page.items[0].setThermoDestTemp2).val;
                destTemp2 = '' + setValue2.toFixed(2) * 10;
            }

            let thermoPopup = 1;
            if (page.items[0].popupThermoMode1 != undefined) {
                thermoPopup = 0;
            }
            
            let temperatureUnit = getState(NSPanel_Path + 'Config.temperatureUnit').val;

            let icon_res = bt[0] + bt[1] + bt[2] + bt[3] + bt[4] + bt[5] + bt[6] + bt[7];

            out_msgs.push({
                payload: 'entityUpd~'
                    + name + '~'                                        // Heading
                    + GetNavigationString(pageId) + '~'                 // Page Navigation
                    + id + '~'                                          // internalNameEntity
                    + currentTemp + temperatureUnit+ '~'                // Actual temperature (string)
                    + destTemp + '~'                                    // Target temperature (numeric without comma)
                    + statusStr + '~'                                   // Mode
                    + minTemp + '~'                                     // Thermostat min temperature
                    + maxTemp + '~'                                     // Thermostat max temperatur
                    + stepTemp + '~'                                    // Steps for Target (5°C)
                    + icon_res                                      	// Icons Status
                    + findLocale('thermostat', 'Currently') + '~'       // Identifier in front of Current room temperature
                    + findLocale('thermostat', 'State') + '~~'          // Bezeichner vor State
                    + temperatureUnit + '~'                      	    // iconTemperature dstTempTwoTempMode
                    + destTemp2 + '~'                                   // dstTempTwoTempMode --> Wenn Wert, dann 2 Temp
                    + thermoPopup                                       // PopUp

            });

        }

        if (Debug) {
            log('GenerateThermoPage payload: ' + out_msgs, 'info');
        }
        return out_msgs;
    } catch (err: any) {
        log('error at function GenerateThermoPage: ' + err.message, 'warn');
        return [];
    }
}

function unsubscribeMediaSubscriptions(): void {
    for (let i = 0; i < config.pages.length; i++) {
        const page: NSPanel.PageType = config.pages[i];
        if (isPageMedia(page)) {  
            let mediaID = page.items[0].id;
            unsubscribe(mediaID + '.STATE');
            unsubscribe(mediaID + '.ARTIST');
            unsubscribe(mediaID + '.TITLE');
            unsubscribe(mediaID + '.ALBUM');
            unsubscribe(mediaID + '.VOLUME');
            unsubscribe(mediaID + '.REPEAT');
            unsubscribe(mediaID + '.SHUFFLE');
            unsubscribe(mediaID + '.QUEUE');
            unsubscribe(mediaID + '.DURATION');
            unsubscribe(mediaID + '.ELAPSED');
        }
    }
    for (let i = 0; i < config.subPages.length; i++) {
        const page: NSPanel.PageType = config.subPages[i];
        if (isPageMedia(page)) {  
            let mediaID = page.items[0].id;
            unsubscribe(mediaID + '.STATE');
            unsubscribe(mediaID + '.ARTIST');
            unsubscribe(mediaID + '.TITLE');
            unsubscribe(mediaID + '.ALBUM');
            unsubscribe(mediaID + '.VOLUME');
            unsubscribe(mediaID + '.REPEAT');
            unsubscribe(mediaID + '.SHUFFLE');
            unsubscribe(mediaID + '.QUEUE');
            unsubscribe(mediaID + '.DURATION');
            unsubscribe(mediaID + '.ELAPSED');
        }
    }
    if (Debug) log('unsubscribeMediaSubscriptions gestartet', 'info');
} 

function subscribeMediaSubscriptions(id: string): void {
    on({id:   [id + '.STATE',
               id + '.ARTIST',
               id + '.TITLE',
               id + '.ALBUM',
               id + '.VOLUME',
               id + '.REPEAT',
               id + '.SHUFFLE',
               id + '.DURATION',
               id + '.ELAPSED'], change: "any", ack: true}, async function () {
        if (useMediaEvents && pageCounter == 1) {
            GeneratePage(activePage!);
        }
    });
} 

function subscribeMediaSubscriptionsSonosAdd(id: string): void {
    on({id:   [id + '.QUEUE'], change: "any", ack: true}, async function () {
        if (useMediaEvents && pageCounter == 1) {
            GeneratePage(activePage!);
        }
    });
} 

async function createAutoMediaAlias (id: string, mediaDevice: string, adapterPlayerInstance: NSPanel.adapterPlayerInstanceType) {
    if (autoCreateAlias) {
        if (isSetOptionActive) {       
            switch (adapterPlayerInstance) {
                case "alexa2.0.":
                case "alexa2.1.":
                case "alexa2.2.":
                case "alexa2.3.":
                case "alexa2.4.":
                case "alexa2.5.":
                case "alexa2.6.":
                case "alexa2.7.":
                case "alexa2.8.":
                case "alexa2.9.": {
                    if (existsObject(id) == false) {
                        log('Alexa Alias ' + id + ' does not exist - will be created now', 'info');

                        const dpPath: string = adapterPlayerInstance + 'Echo-Devices.' + mediaDevice;
                        try {
                            setObject(id, {_id: id, type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ACTUAL', dpPath + '.Player.volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'ACTUAL'});
                            await createAliasAsync(id + '.ALBUM', dpPath + '.Player.currentAlbum', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + '.Player.currentArtist', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + '.Player.currentTitle', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.NEXT', dpPath + '.Player.controlNext', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.next', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + '.Player.controlPrevious', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.prev', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + '.Player.controlPlay', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.play', name: 'PLAY'});
                            await createAliasAsync(id + '.PAUSE', dpPath + '.Player.controlPause', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.pause', name: 'PAUSE'});
                            await createAliasAsync(id + '.STOP', dpPath + '.Commands.deviceStop', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.stop', name: 'STOP'});
                            await createAliasAsync(id + '.STATE', dpPath + '.Player.currentState', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STATE'});
                            await createAliasAsync(id + '.VOLUME', dpPath + '.Player.volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.REPEAT', dpPath + '.Player.controlRepeat', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.repeat', name: 'REPEAT'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + '.Player.controlShuffle', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE'});
                        } catch (err: any) {
                            log('error at function createAutoMediaAlias Adapter Alexa2: ' + err.message, 'warn');
                        }
                    }
                    //Add Alexa Datapoints > v4.3.3.18
                    if (existsObject(id + '.DURATION') == false) {
                        let dpPath: string = adapterPlayerInstance + 'Echo-Devices.' + mediaDevice;
                        await createAliasAsync(id + '.DURATION', dpPath + '.Player.mediaLength', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration.text', name: 'DURATION'});
                        await createAliasAsync(id + '.ELAPSED', dpPath + '.Player.mediaProgressStr', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed.text', name: 'ELAPSED'});
                    }

                }
                    break;
                case "sonos.0.":
                case "sonos.1.":
                case "sonos.2.":
                case "sonos.3.":
                case "sonos.4.":
                case "sonos.5.":
                case "sonos.6.":
                case "sonos.7.":
                case "sonos.8.":
                case "sonos.9.": {
                    if (existsObject(id) == false) {
                        log('Sonos Alias ' + id + ' does not exist - will be created now', 'info');

                        const dpPath: string = adapterPlayerInstance + 'root.' + mediaDevice;
                        try {
                            setObject(id, {_id: id, type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ACTUAL', dpPath + '.volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'ACTUAL'});
                            await createAliasAsync(id + '.ALBUM', dpPath + '.current_album', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + '.current_artist', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + '.current_title', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.CONTEXT_DESCRIPTION', dpPath + '.current_station', true, <iobJS.StateCommon> {type: 'string', role: 'media.station', name: 'CONTEXT_DESCRIPTION'});
                            await createAliasAsync(id + '.NEXT', dpPath + '.next', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.next', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + '.prev', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.prev', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + '.play', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.play', name: 'PLAY'});
                            await createAliasAsync(id + '.PAUSE', dpPath + '.pause', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.pause', name: 'PAUSE'});
                            await createAliasAsync(id + '.STOP', dpPath + '.stop', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.stop', name: 'STOP'});
                            await createAliasAsync(id + '.STATE', dpPath + '.state_simple', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STATE'});
                            await createAliasAsync(id + '.VOLUME', dpPath + '.volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.REPEAT', dpPath + '.repeat', true, <iobJS.StateCommon> {type: 'number', role: 'media.mode.repeat', name: 'REPEAT'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + '.shuffle', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE'});
                        } catch (err: any) {
                            log('error at function createAutoMediaAlias Adapter sonos: ' + err.message, 'warn');
                        }
                    }
                    //Add Sonos Datapoints > v4.3.3.15
                    if (existsObject(id + '.QUEUE') == false) {
                        let dpPath: string = adapterPlayerInstance + 'root.' + mediaDevice;
                        await createAliasAsync(id + '.QUEUE', dpPath + '.queue', true, <iobJS.StateCommon> {type: 'string', role: 'state', name: 'QUEUE'});
                        await createAliasAsync(id + '.DURATION', dpPath + '.current_duration_s', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration.text', name: 'DURATION'});
                        await createAliasAsync(id + '.ELAPSED', dpPath + '.current_elapsed_s', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed.text', name: 'ELAPSED'});
                    }

                }
                    break;
                case "spotify-premium.0.":
                case "spotify-premium.1.":
                case "spotify-premium.2.":
                case "spotify-premium.3.":
                case "spotify-premium.4.":
                case "spotify-premium.5.":
                case "spotify-premium.6.":
                case "spotify-premium.7.":
                case "spotify-premium.8.":
                case "spotify-premium.9.": {
                    if (existsObject(id) == false) {
                        log('Spotify Alias ' + id + ' does not exist - will be created now', 'info');

                        const dpPath: string = adapterPlayerInstance;
                        try {
                            setObject(id, {_id: id + 'player', type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ACTUAL', dpPath + 'player.volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'ACTUAL'});
                            await createAliasAsync(id + '.ALBUM', dpPath + 'player.album', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + 'player.artistName', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + 'player.trackName', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.CONTEXT_DESCRIPTION', dpPath + 'player.contextDescription', true, <iobJS.StateCommon> {type: 'string', role: 'media.station', name: 'CONTEXT_DESCRIPTION'});
                            await createAliasAsync(id + '.NEXT', dpPath + 'player.skipPlus', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.next', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + 'player.skipMinus', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.prev', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + 'player.play', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.play', name: 'PLAY'});
                            await createAliasAsync(id + '.PAUSE', dpPath + 'player.pause', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.pause', name: 'PAUSE'});
                            await createAliasAsync(id + '.STOP', dpPath + 'player.pause', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.stop', name: 'STOP'});
                            await createAliasAsync(id + '.STATE', dpPath + 'player.isPlaying', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STATE'});
                            await createAliasAsync(id + '.VOLUME', dpPath + 'player.volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.REPEAT', dpPath + 'player.repeat', true, <iobJS.StateCommon> {type: 'string', role: 'value', name: 'REPEAT'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + 'player.shuffle', true, <iobJS.StateCommon> {type: 'string', role: 'value', name: 'SHUFFLE'});

                        } catch (err: any) {
                            log('error at function createAutoMediaAlias Adapter spotify-premium: ' + err.message, 'warn');
                        }
                    }
                    //Add Spotify Datapoints > v4.3.3.42
                    //Spotify-Premium has Role value and a known Bug in player.progress
                    if (existsObject(id + '.DURATION') == false) {
                        const dpPath: string = adapterPlayerInstance;
                        await createAliasAsync(id + '.DURATION', dpPath + 'player.duration', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration.text', name: 'DURATION'});
                        await createAliasAsync(id + '.ELAPSED', dpPath + 'player.progress', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed.text', name: 'ELAPSED'});
                    }

                }
                    break;
                case "volumio.0.":
                case "volumio.1.":
                case "volumio.2.":
                case "volumio.3.":
                case "volumio.4.":
                case "volumio.5.":
                case "volumio.6.":
                case "volumio.7.":
                case "volumio.8.":
                case "volumio.9.": {
                    if (existsObject(id) == false) {
                        log('Volumio Alias ' + id + ' does not exist - will be created now', 'info');

                        const dpPath: string = adapterPlayerInstance;
                        try {
                            setObject(id, {_id: id, type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ACTUAL', dpPath + 'playbackInfo.volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'ACTUAL'});
                            await createAliasAsync(id + '.ALBUM', dpPath + 'playbackInfo.album', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + 'playbackInfo.artist', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + 'playbackInfo.title', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.NEXT', dpPath + 'player.next', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.next', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + 'player.prev', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.prev', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + 'player.play', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.play', name: 'PLAY'});
                            await createAliasAsync(id + '.PAUSE', dpPath + 'player.toggle', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.pause', name: 'PAUSE'});
                            await createAliasAsync(id + '.STOP', dpPath + 'player.stop', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.stop', name: 'STOP'});
                            await createAliasAsync(id + '.STATE', dpPath + 'playbackInfo.status', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STATE'});
                            await createAliasAsync(id + '.VOLUME', dpPath + 'playbackInfo.volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.REPEAT', dpPath + 'playbackInfo.repeat', true, <iobJS.StateCommon> {type: 'number', role: 'media.mode.repeat', name: 'REPEAT'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + 'queue.shuffle', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE'});
                            await createAliasAsync(id + '.status', dpPath + 'playbackInfo.status', true, <iobJS.StateCommon> {type: 'string', role: 'media.state', name: 'status'});
                        } catch (err: any) {
                            log('error function createAutoMediaAlias Adapter volumio: ' + err.message, 'warn');
                        }
                    }
                    //Add Volumio Datapoints > v4.3.3.42
                    if (existsObject(id + '.DURATION') == false) {
                        const dpPath: string = adapterPlayerInstance;
                        await createAliasAsync(id + '.DURATION', dpPath + 'playbackInfo.duration', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration', name: 'DURATION'});
                        //await createAliasAsync(id + '.ELAPSED', dpPath + 'player.progress', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed.text', name: 'ELAPSED'});
                    }
                }
                    break;
                case "squeezeboxrpc.0.":
                case "squeezeboxrpc.1.":
                case "squeezeboxrpc.2.":
                case "squeezeboxrpc.3.":
                case "squeezeboxrpc.4.":
                case "squeezeboxrpc.5.":
                case "squeezeboxrpc.6.":
                case "squeezeboxrpc.7.":
                case "squeezeboxrpc.8.":
                case "squeezeboxrpc.9.": {
                    if (existsObject(id) == false) {
                        log('Squeezebox Alias ' + id + ' does not exist - will be created now', 'info');

                        const dpPath: string = adapterPlayerInstance + 'Players.' + mediaDevice;
                        try {
                            setObject(id, {_id: id, type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ALBUM', dpPath + '.Album', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + '.Artist', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + '.Title', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.NEXT', dpPath + '.btnForward', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.forward', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + '.btnRewind', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.reverse', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + '.state', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'PLAY', alias: {id: dpPath + '.state', read: 'val === 1 ? true : false'}});
                            await createAliasAsync(id + '.PAUSE', dpPath + '.state', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'PAUSE', alias: {id: dpPath + '.state', read: 'val === 0 ? true : false'}});
                            await createAliasAsync(id + '.STOP', dpPath + '.state', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STOP', alias: {id: dpPath + '.state', read: 'val === 0 ? true : false'}});
                            await createAliasAsync(id + '.STATE', dpPath + '.Power', true, <iobJS.StateCommon> {type: 'number', role: 'switch', name: 'STATE'});
                            await createAliasAsync(id + '.VOLUME', dpPath + '.Volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.VOLUME_ACTUAL', dpPath + '.Volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'VOLUME_ACTUAL'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + '.PlaylistShuffle', true, <iobJS.StateCommon> {type: 'string', role: 'media.mode.shuffle', name: 'SHUFFLE'});
                            await createAliasAsync(id + '.REPEAT', dpPath + '.PlaylistRepeat', true, <iobJS.StateCommon> {type: 'number', role: 'media.mode.repeat', name: 'REPEAT'});
                            await createAliasAsync(id + '.DURATION', dpPath + '.Duration', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration', name: 'DURATION'});
                            await createAliasAsync(id + '.ELAPSED', dpPath + '.Time', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed', name: 'ELAPSED'});
                        } catch (err: any) {
                            log('error at function createAutoMediaAlias Adapter Squeezebox: ' + err.message, 'warn');
                        }
                    }
                }
                    break;
                case "bosesoundtouch.0.":
                case "bosesoundtouch.1.":
                case "bosesoundtouch.2.":
                case "bosesoundtouch.3.":
                case "bosesoundtouch.4.":
                case "bosesoundtouch.5.":
                case "bosesoundtouch.6.":
                case "bosesoundtouch.7.":
                case "bosesoundtouch.8.":
                case "bosesoundtouch.9.": {
                    if (existsObject(id) == false) {
                        log('bosesoundtouch Alias ' + id + ' does not exist - will be created now', 'info');

                        try {
                            let dpPath: string = adapterPlayerInstance;
                            await extendObjectAsync(id, {_id: id, type: 'channel', common: {role: 'media', name: 'media'}, native: {}});
                            await createAliasAsync(id + '.ACTUAL', dpPath + 'volume', true, <iobJS.StateCommon> {type: 'number', role: 'value.volume', name: 'ACTUAL'});
                            await createAliasAsync(id + '.VOLUME', dpPath + 'volume', true, <iobJS.StateCommon> {type: 'number', role: 'level.volume', name: 'VOLUME'});
                            await createAliasAsync(id + '.STATE', dpPath + 'on', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.state', name: 'STATE'});

                            dpPath = adapterPlayerInstance + 'nowPlaying';
                            await createAliasAsync(id + '.ALBUM', dpPath + '.album', true, <iobJS.StateCommon> {type: 'string', role: 'media.album', name: 'ALBUM'});
                            await createAliasAsync(id + '.ARTIST', dpPath + '.artist', true, <iobJS.StateCommon> {type: 'string', role: 'media.artist', name: 'ARTIST'});
                            await createAliasAsync(id + '.TITLE', dpPath + '.track', true, <iobJS.StateCommon> {type: 'string', role: 'media.title', name: 'TITLE'});
                            await createAliasAsync(id + '.DURATION', dpPath + '.total', true, <iobJS.StateCommon> {type: 'string', role: 'media.duration.text', name: 'DURATION'});
                            await createAliasAsync(id + '.ELAPSED', dpPath + '.time', true, <iobJS.StateCommon> {type: 'string', role: 'media.elapsed.text', name: 'ELAPSED'});
                            await createAliasAsync(id + '.REPEAT', dpPath + '.repeat', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.repeat', name: 'REPEAT'});
                            await createAliasAsync(id + '.SHUFFLE', dpPath + '.shuffle', true, <iobJS.StateCommon> {type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE'});
                            
                            dpPath = adapterPlayerInstance + 'keys';
                            await createAliasAsync(id + '.NEXT', dpPath + '.NEXT_TRACK', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.next', name: 'NEXT'});
                            await createAliasAsync(id + '.PREV', dpPath + '.PREV_TRACK', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.prev', name: 'PREV'});
                            await createAliasAsync(id + '.PLAY', dpPath + '.PLAY', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.play', name: 'PLAY'});
                            await createAliasAsync(id + '.PAUSE', dpPath + '.PAUSE', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.pause', name: 'PAUSE'});
                            await createAliasAsync(id + '.STOP', dpPath + '.STOP', true, <iobJS.StateCommon> {type: 'boolean', role: 'button.stop', name: 'STOP'});
                        } catch (err: any) {
                            log('error at function createAutoMediaAlias Adapter bosesoundtouch: ' + err.message, 'warn');
                        }
                    }
                    break;
                }
                default: {
                    log(`Dont find adapterPlayerInstance: ${adapterPlayerInstance}!`, 'warn')
                }
            }
        }
    }
}

function GenerateMediaPage(page: NSPanel.PageMedia): NSPanel.Payload[] {
    try {
        unsubscribeMediaSubscriptions();

        if (!page.items[0].id) throw new Error ('Missing page id for cardMedia!');

        let id = page.items[0].id;
        let tid = 0;
        let out_msgs: NSPanel.Payload[] = [];
        
        if (!page.items[0].adapterPlayerInstance!) throw new Error('page.items[0].adapterPlayerInstance is undefined!')
        let vInstance = page.items[0].adapterPlayerInstance!;
        let v1Adapter = vInstance.split('.');
        let v2Adapter:NSPanel.PlayerType = v1Adapter[0] as NSPanel.PlayerType;

        let vMediaDevice = (page.items[0].mediaDevice != undefined) ? page.items[0].mediaDevice : '';

        if (isPlayerWithMediaDevice(v2Adapter)) {
            if (!vMediaDevice) throw new Error(`Error in cardMedia! mediaDevice is empty! Page: ${JSON.stringify(page)}`);
        }
        createAutoMediaAlias(id, vMediaDevice, page.items[0].adapterPlayerInstance!);
   
        // Leave the display on if the alwaysOnDisplay parameter is specified (true)
        if (page.type == 'cardMedia' && pageCounter == 0 && page.items[0].alwaysOnDisplay != undefined) {
            out_msgs.push({ payload: 'pageType~cardMedia' });
            if (page.items[0].alwaysOnDisplay != undefined) {
                if (page.items[0].alwaysOnDisplay) {
                    pageCounter = 1;
                    if (alwaysOn == false) {
                        alwaysOn = true;
                        SendToPanel({ payload: 'timeout~0' });
                        subscribeMediaSubscriptions(page.items[0].id);
                        if (v2Adapter == 'sonos') {
                            subscribeMediaSubscriptionsSonosAdd(page.items[0].id);
                        } else if (v2Adapter == 'spotify-premium') {
                            setState(vInstance + 'getDevices', true);
                            setState(vInstance + 'getPlaybackInfo', true);
                            setState(vInstance + 'getPlaylists', true);
                        }
                    }
                }
            }
        } else if (page.type == 'cardMedia' && pageCounter == 1) {
            alwaysOn = true;
            subscribeMediaSubscriptions(page.items[0].id);
            if (v2Adapter == 'sonos') {
                subscribeMediaSubscriptionsSonosAdd(page.items[0].id); 
            }
        } else if (page.type == 'cardMedia' && pageCounter == -1) {
            //Do Nothing
        } else {
            out_msgs.push({ payload: 'pageType~cardMedia' });
        }

        if (existsObject(id)) {
            let name = getState(id + '.ALBUM').val;
            let title = getState(id + '.TITLE').val;
            if (title.length > 26) {
                title = title.slice(0, 26) + '...';
            }
            if (existsObject(id + '.DURATION') && existsObject(id + '.ELAPSED')) {
                if (v2Adapter == 'alexa2') {
                    if (Debug) log(getState(id + '.DURATION').val, 'info');
                    let Seconds = parseInt(getState(id + '.DURATION').val)%60 < 10 ? '0' : '' 
                    let Duration = Math.floor(getState(id + '.DURATION').val/60) + ":" + Seconds +  getState(id + '.DURATION').val%60 
                    let vElapsed = getState(id + '.ELAPSED').val;
                    if (vElapsed.length == 5) {
                        if(parseInt(vElapsed.slice(0,2)) < 9) {
                            vElapsed = vElapsed.slice(1);    
                        }
                    } 
                    if (vElapsed == 0) {
                        vElapsed = '0:00';    
                    } 
                    let vDuration = Duration;
                    if (vDuration.length == 5) {
                        if(parseInt(vDuration.slice(0,2)) < 9) {
                            vDuration = vDuration.slice(1);    
                        }
                    }
                    if (vDuration != '0:00') {
                        title = title + ' (' + vElapsed + '|' + vDuration + ')';
                    } else {
                        title = title + ' (' + vElapsed + ')';
                    }
                    if (title == ' (0:00)') {
                        title = '';
                    }
                } else if (v2Adapter == 'sonos' && getState(page.items[0].adapterPlayerInstance + 'root.' + page.items[0].mediaDevice + '.current_type').val == 0) {
                    let vElapsed = getState(id + '.ELAPSED').val;
                    if (vElapsed.length == 5) {
                        if(parseInt(vElapsed.slice(0,2)) < 9) {
                            vElapsed = vElapsed.slice(1);    
                        }
                    } else if (vElapsed.length == 8) {
                        vElapsed = vElapsed.slice(4);
                    }
                    let vDuration = getState(id + '.DURATION').val;
                    if (vDuration.length == 5) {
                        if(parseInt(vDuration.slice(0,2)) < 9) {
                            vDuration = vDuration.slice(1);    
                        }
                    } else if (vDuration.length == 8) {
                        vDuration = vDuration.slice(4);
                    }
                    title = title + ' (' + vElapsed + '|' + vDuration + ')';
                } else if (v2Adapter == 'bosesoundtouch') {
                    if (Debug) log(getState(id + '.ELAPSED').val, 'info');
                    let elapsedSeconds = parseInt(getState(id + '.ELAPSED').val)%60 < 10 ? '0' : '' 
                    let vElapsed = Math.floor(getState(id + '.ELAPSED').val/60) + ":" + elapsedSeconds +  getState(id + '.ELAPSED').val%60 
                    if (Debug) log(getState(id + '.DURATION').val, 'info');
                    let durationSeconds = parseInt(getState(id + '.DURATION').val)%60 < 10 ? '0' : '' 
                    let vDuration = Math.floor(getState(id + '.DURATION').val/60) + ":" + durationSeconds +  getState(id + '.DURATION').val%60 
                    title = title + ' (' + vElapsed + '|' + vDuration + ')';
                }
            } 

            let author = getState(id + '.ARTIST').val;

            if (v2Adapter == 'squeezeboxrpc' && author.length == 0) {
                if(existsObject(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playlist'].join('')))) {
                    if(existsObject(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playlist'].join('')))) {
                        let lmstracklist = JSON.parse(getState(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playlist'].join(''))).val);
                        let currentIndex: number = parseInt(getState([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.PlaylistCurrentIndex'].join('')).val);
                        author = lmstracklist[currentIndex].Artist + '|' + lmstracklist[currentIndex].Album;
                        if (author.length > 37) {
                            author = author.slice(0, 37) + '...';
                        }
                        let elapsedTime: number = parseInt(getState([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Time'].join('')).val);
                        let elapsedSeconds = elapsedTime%60 < 10 ? '0' : ''; 
                        let vElapsed = Math.floor(elapsedTime/60) + ":" + elapsedSeconds +  elapsedTime%60; 

                        let durationSeconds = parseInt(lmstracklist[currentIndex].Duration)%60 < 10 ? '0' : ''; 
                        let vDuration = Math.floor(parseInt(lmstracklist[currentIndex].Duration)/60) + ":" + durationSeconds +  parseInt(lmstracklist[currentIndex].Duration)%60; 
                        title = lmstracklist[currentIndex].title; 
                        if (title.length > 25) {
                            title = title.slice(0, 25) + '...';
                        }
                        title = title + ' (' + vElapsed + '|' + vDuration + ')';
                    }
                }
            }

            // Settings >>Aktualisierungsintervall für Statusinformationen<< = 1 !
            // If the refresh time is set to 1 second in the spotify-premium.X instance, 
            // the elapsed refresh bug '00:00' is not visible 
            if (v2Adapter == 'spotify-premium') {
                let vElapsed: string = getState(id + '.ELAPSED').val;
                if (vElapsed.substring(0,1) == '0') {
                    vElapsed = vElapsed.slice(1)
                }
                let vDuration: string = getState(id + '.DURATION').val;
                if (vDuration.substring(0,1) == '0') {
                    vDuration = vDuration.slice(1)
                }
                title = title + ' (' + vElapsed + '|' + vDuration + ')';
                if (title == ' (0:00|0:00)') {
                    title = '';
                }
            }

            let shuffle = getState(id + '.SHUFFLE').val;

            //New Adapter/Player
            let media_icon = Icons.GetIcon('playlist-music');

            //Spotify-Premium
            if (v2Adapter == 'spotify-premium') {
                media_icon = Icons.GetIcon('spotify');
                name = getState(id + '.CONTEXT_DESCRIPTION').val;
                let nameLength = name.length;
                if (name.substring(0,17) == 'Playlist: This Is') {
                    name = name.slice(18, 34) + '...';
                } else if (name.substring(0,9) == 'Playlist:') {
                    name = name.slice(10, 26) + '...';
                } else if (name.substring(0,6) == 'Album:') {
                    name = name.slice(7, 23) + '...';
                } else if (name.substring(0,6) == 'Track:') {
                    name = name.slice(7, 23) + '...';
                } else if (name.substring(0,7) == 'Artist:') {
                    name = name.slice(8, 24) + '...';
                }
                if (nameLength == 0) {
                    name = 'Spotify-Premium';
                }
                author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                if (author.length > 37) {
                    author = author.slice(0,37) + '...';
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = findLocale('media','no_music_to_control');
                }
            }

            //Sonos
            if (v2Adapter == 'sonos') {
                media_icon = Icons.GetIcon('alpha-s-circle');
                name = getState(id + '.CONTEXT_DESCRIPTION').val;
                let nameLenght = name.length;
                if (nameLenght == 0) {
                    name = page.heading;
                } else if (nameLenght > 16) {
                    name = name.slice(0,16) + '...'
                }
                if ((getState(id + '.ALBUM').val).length > 0) {
                    author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                    if (author.length > 37) {
                        author = author.slice(0,37) + '...';
                    }
                } else {
                    author = getState(id + '.ARTIST').val;
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = findLocale('media','no_music_to_control');
                }
            }

            //Bose Soundtouch
            if (v2Adapter == 'bosesoundtouch') {
                media_icon = Icons.GetIcon('alpha-b-circle');
                name = page.heading;
                
                if ((getState(id + '.ALBUM').val).length > 0) {
                    author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                    if (author.length > 37) {
                        author = author.slice(0,37) + '...';
                    }
                } else {
                    author = getState(id + '.ARTIST').val;
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = findLocale('media','no_music_to_control');
                }
            }

            //Logitech Squeezebox RPC
            if (v2Adapter == 'squeezeboxrpc') {
                media_icon = Icons.GetIcon('dlna');
                if (name.length == 0) {
                    name = page.heading;
                } else if (name.length > 16) {
                    name = name.slice(0,16) + '...'
                }
            }

            //Alexa2
            if (v2Adapter == 'alexa2') {
                media_icon = Icons.GetIcon('alpha-a-circle');
                name = getState(id + '.ALBUM').val;
                let nameLength = name.length;
                if (name.substring(0,9) == 'Playlist:') {
                    name = name.slice(10, 26) + '...';
                } else if (name.substring(0,6) == 'Album:') {
                    name = name.slice(7, 23) + '...';
                } else if (name.substring(0,6) == 'Track') {
                    name = 'Alexa Player';
                }
                if (nameLength == 0) {
                    name = 'Alexa Player';
                } else {
                    name = name.slice(0,16) + '...';
                }
                author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                if (author.length > 30) {
                    author = getState(id + '.ARTIST').val;
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = findLocale('media','no_music_to_control');
                }
            }

            //Volumio
            if (v2Adapter == 'volumio') {
                media_icon = Icons.GetIcon('clock-time-twelve-outline');
                if (name != undefined) { author = author + " | " + name; }
                name = page.heading;
            }

            let volume = scale(getState(id + '.VOLUME').val, activePage!.items[0]!.minValue ?? 0, activePage!.items[0]!.maxValue ?? 100, 100, 0);
            let iconplaypause = Icons.GetIcon('pause'); //pause
            let shuffle_icon = Icons.GetIcon('shuffle-variant'); //shuffle
            let onoffbutton = 1374;

            if (shuffle == 'off' || shuffle == false || shuffle == 0 || shuffle == 'false') {
                shuffle_icon = Icons.GetIcon('shuffle-disabled'); //shuffle
            }

            // Todo: Refresh automatisieren und dafür wieder Shuffle nutzen
            //if (v2Adapter == 'volumio') { shuffle_icon = Icons.GetIcon('shuffle-disabled'); } //Volumio: refresh playlist


            //For all players
            if (getState(id + '.STATE').val) {
                onoffbutton = 65535;
                iconplaypause = Icons.GetIcon('pause'); //pause
            } else {
                iconplaypause = Icons.GetIcon('play'); //play
            }

            //Ausnahme für squeezebox, da State = Power
            if (v2Adapter == 'squeezeboxrpc') {
                if (getState(id + '.PAUSE').val === false) {
                    onoffbutton = 65535;
                    iconplaypause = Icons.GetIcon('pause'); //pause
                } else {
                    iconplaypause = Icons.GetIcon('play'); //play
                }
            }

            //Ausnahme Volumio: status = string: play, pause, stop usw.
            if (v2Adapter == 'volumio') {
                if (getState(id + '.status').val == 'play') {
                    onoffbutton = 65535;
                    iconplaypause = Icons.GetIcon('pause'); //pause
                } else {
                    iconplaypause = Icons.GetIcon('play'); //play
                }
            }

            let currentSpeaker: string = findLocale('media','no_speaker_found');

            if (v2Adapter == 'alexa2') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', page.items[0].mediaDevice, '.Info.name'].join(''))).val;
            } else if (v2Adapter == 'spotify-premium') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'player.device.name'].join(''))).val;
            } else if (v2Adapter == 'sonos') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'root.', page.items[0].mediaDevice, '.members'].join(''))).val;
            } else if (v2Adapter == 'squeezeboxrpc') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playername'].join(''))).val;
            } else if (v2Adapter == 'bosesoundtouch') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'deviceInfo.name'].join(''))).val;
            } else if (v2Adapter == 'volumio') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'info.name'].join(''))).val;
            }
            //-------------------------------------------------------------------------------------------------------------
            // All Alexa devices (the online / player and commands directory is available) are listed and linked below
            // If the constant alexaSpeakerList contains at least one entry, the constant is used - otherwise all devices from the Alexa adapter
            let speakerListArray: string[] = [];
            if (page.items[0].speakerList && page.items[0].speakerList.length > 0) {
                for (let i_index in page.items[0].speakerList) {
                    speakerListArray.push(page.items[0].speakerList[i_index]);
                }
            } else if (v2Adapter == 'squeezeboxrpc') {
                // Beim Squeezeboxrpc ist jeder Player ein eigener Knoten im Objektbaum. Somit werden einzelne Aliase benötigt.
                const squeezeboxPlayerQuery: iobJS.QueryResult = $('channel[state.id=' + page.items[0].adapterPlayerInstance + '.Players.*.Playername]');
                squeezeboxPlayerQuery.each((playerId: string, playerIndex: number) => {
                    speakerListArray.push(getState(playerId).val);
                    page.items[0].speakerList = speakerListArray;
                });
            } else if (v2Adapter == 'spotify-premium') {
                // All possible Devices if page.items[0].speakerList empty
                if (Debug) log(getState(page.items[0].adapterPlayerInstance + 'devices.availableDeviceListString').val);
                speakerListArray = (getState(page.items[0].adapterPlayerInstance + 'devices.availableDeviceListString').val).split(';');
                page.items[0].speakerList = speakerListArray;
            } else {
                let i_list = Array.prototype.slice.apply($('[state.id="' + page.items[0].adapterPlayerInstance + 'Echo-Devices.*.Info.name"]'));
                for (let i_index in i_list) {
                    let i = i_list[i_index];
                    let deviceId = i;
                    deviceId = deviceId.split('.');
                    if (getState(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.online'].join(''))).val &&
                        existsObject(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.Player'].join(''))) &&
                        existsObject(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.Commands'].join('')))) {
                            speakerListArray.push(getState(i).val);
                    }
                }
            }
            //--------------------------------------------------------------------------------------------------------------

            let colMediaIcon = (page.items[0].colorMediaIcon != undefined) ? page.items[0].colorMediaIcon : White;
            let colMediaTitle = (page.items[0].colorMediaTitle != undefined) ? page.items[0].colorMediaTitle : White;
            let colMediaArtist = (page.items[0].colorMediaArtist != undefined) ? page.items[0].colorMediaArtist : White;

            //InSel Speaker
            let speakerListString: string = '~~~~~~'
            let speakerListIconCol = rgb_dec565(HMIOff);
            if (speakerListArray.length > 0) {
                speakerListIconCol = rgb_dec565(HMIOn);
                speakerListString = 'input_sel' + '~' + 
                                    tid + '?speakerlist' + '~' + 
                                    Icons.GetIcon('speaker') + '~' + 
                                    speakerListIconCol + '~' + 
                                    findLocale('media','speaker') + '~' + 
                                    'media0~'
            }

            //InSel Playlist
            let playListString: string = '~~~~~~'
            let playListIconCol = rgb_dec565(HMIOff);
            if (page.items[0].playList != undefined) {
                /* Volumio: get actual playlist if empty */
                if (v2Adapter == 'volumio') {
                    if (page.items[0].playList.length == 0) {

                    let urlString: string = `${getState(vInstance+'info.host').val}/api/listplaylists`;

                    axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                        .then(async function (response) {
                            if (response.status === 200) {
                                if (Debug) {
                                    log(JSON.stringify(response.data), 'info');
                                }
                                page.items[0].playList = JSON.parse(JSON.stringify(response.data));
                                if (Debug) log('volumio-playlist: ' + page.items[0].playList, 'info'); 
                            } else {
                                log('Axios Status - get_volumio-playlist: ' + response.state, 'warn');
                            }
                        })
                        .catch(function (error) {
                            log(error, 'warn');
                        });

                    }
                    /* Spotify: get all playlists if empty */
                } else if (v2Adapter == 'spotify-premium') {
                    page.items[0].playList = (getState(page.items[0].adapterPlayerInstance + 'playlists.playlistListString').val).split(';');
                }
                playListIconCol = rgb_dec565(HMIOn);
                playListString =    'input_sel' + '~' + 
                                    tid + '?playlist' + '~' + 
                                    Icons.GetIcon('playlist-play') + '~' + 
                                    playListIconCol + '~' + 
                                    //'PlayL ' + page.heading + '~' + 
                                    findLocale('media','playlist') + '~' +
                                    'media1~'
            } 

            //InSel Tracklist
            globalTracklist = ''

            let trackListString: string = '~~~~~~'
            let trackListIconCol = rgb_dec565(HMIOff);
            if (v2Adapter == 'volumio') { /* Volumio: get queue */
                setTimeout(async function () {

                    let urlString: string = `${getState(vInstance+'info.host').val}/api/getQueue`;

                    axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                        .then(async function (response) {
                            if (response.status === 200) {
                                if (Debug) {
                                    log(JSON.stringify(response.data), 'info');
                                }
                                const QUEUELIST = JSON.parse(JSON.stringify(response.data));
                                page.items[0].globalTracklist = QUEUELIST.queue;
                                if (Debug) { 
                                    for (let i_index in QUEUELIST.queue) { 
                                        log('volumio-queue: ' + QUEUELIST.queue[i_index], 'info'); 
                                    }
                                } 
                            } else {
                                log('Axios Status - get_volumio-queue: ' + response.state, 'warn');
                            }
                        })
                        .catch(function (error) {
                            log(error, 'warn');
                        });

                }, 2000);
                globalTracklist = page.items[0].globalTracklist;
            } else if(v2Adapter == 'squeezeboxrpc' && existsObject(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playlist'].join('')))) {
                let lmstracklist = JSON.parse(getState(([page.items[0].adapterPlayerInstance, 'Players.', page.items[0].mediaDevice, '.Playlist'].join(''))).val);
                globalTracklist = lmstracklist;
            } else if(v2Adapter == 'sonos' && existsObject(([page.items[0].adapterPlayerInstance, 'root.', page.items[0].mediaDevice, '.playlist_set'].join('')))) {
                let lmstracklist = getState(([page.items[0].adapterPlayerInstance, 'root.', page.items[0].mediaDevice, '.queue'].join(''))).val;
                lmstracklist = lmstracklist.replace(/\s*[\[{(].*?[)}\]]\s*/g, '');
                let lmstracklistTemp = lmstracklist.split(', ');
                let trackList: string = '[';
                if (getState(page.items[0].adapterPlayerInstance + 'root.' + page.items[0].mediaDevice + '.current_type').val == 0) {                
                    for (let i=0; i < lmstracklistTemp.length; i++) {
                        let trackTemp = lmstracklistTemp[i].split(' - ');
                        trackList = trackList + '{"id":"' + i + '","name":"' + trackTemp[0] + '","title":"' + trackTemp[1] + '"}'
                        if (i < lmstracklistTemp.length -1) {
                            trackList = trackList + ',';
                        } 
                    }
                }
                trackList = trackList + ']';
                if (Debug) log(trackList, 'info');
                globalTracklist = trackList;
            } else if (v2Adapter == 'spotify-premium') {
                try {
                    let tempTrackList = JSON.parse(getState(page.items[0].adapterPlayerInstance + 'player.playlist.trackListArray').val);
                    globalTracklist = tempTrackList;
                } catch {
                   log('Hello Mr. Developer something went wrong in tracklist!', 'debug')
                }
            }
            
            if (globalTracklist != null && globalTracklist.length != 0) {
                trackListIconCol = rgb_dec565(HMIOn);
                trackListString =   'input_sel' + '~' + 
                                    tid + '?tracklist' + '~' + 
                                    Icons.GetIcon('animation-play-outline') + '~' + 
                                    trackListIconCol + '~' + 
                                    findLocale('media','tracklist') + '~' +
                                    'media2~'
            }

            //InSel EQ
            let equalizerListString: string = '~~~~~~'
            let equalizerListIconCol = rgb_dec565(HMIOff);
            if (page.items[0].equalizerList != undefined) {
                equalizerListIconCol = rgb_dec565(HMIOn);
                equalizerListString =   'input_sel' + '~' + 
                                        tid + '?equalizer' + '~' + 
                                        Icons.GetIcon('equalizer-outline') + '~' + 
                                        equalizerListIconCol + '~' + 
                                        findLocale('media','equalizer') + '~' +
                                        'media3~'
            } else if (page.items[0].equalizerList == undefined && v2Adapter == 'sonos') {
                let equalizerListIconCol = rgb_dec565(HMIOn);
                //equalizerListString is used for favariteList
                equalizerListString =   'input_sel' + '~' + 
                                        tid + '?favorites' + '~' + 
                                        Icons.GetIcon('playlist-star') + '~' + 
                                        equalizerListIconCol + '~' + 
                                        findLocale('media','favorites') + '~' +
                                        'media3~'
            }

            //Repeat Control Button
            let repeatIcon = Icons.GetIcon('repeat-variant');
            let repeatIconCol = rgb_dec565(HMIOff);
            let repeatButtonString: string = '~~~~~~'

            if (v2Adapter == 'spotify-premium') {
                if (getState(id + '.REPEAT').val == 'context') {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 'track') {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'alexa2') {
                if (getState(id + '.REPEAT').val == true) {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'sonos') {
                if (getState(id + '.REPEAT').val == 1) {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 2) {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'bosesoundtouch') {
                if (getState(id + '.REPEAT').val == 'REPEAT_ALL') {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 'REPEAT_ONE') {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'squeezeboxrpc') {
                if (getState(id + '.REPEAT').val == 1) {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 2) {
                    repeatIcon = Icons.GetIcon('repeat');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'volumio') { /* Volumio: only Repeat true/false with API */
                if (getState(id + '.REPEAT').val == true) {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            }

            if (v2Adapter == 'spotify-premium' || 
                v2Adapter == 'alexa2'          || 
                v2Adapter == 'sonos'           || 
                v2Adapter == 'bosesoundtouch'  || 
                v2Adapter == 'volumio'         || 
                v2Adapter == 'squeezeboxrpc') {
                repeatButtonString =    'button' + '~' + 
                                        tid + '?repeat' + '~' + 
                                        repeatIcon + '~' + 
                                        repeatIconCol + '~' + 
                                        'Repeat' + '~' + 
                                        'media4'
            }

            //popUp Tools
            let toolsString: string = '~~~~~~'
            let toolsIconCol = rgb_dec565(colMediaIcon);
            if (v2Adapter == 'sonos') {
                if (page.items[0].crossfade == undefined || page.items[0].crossfade == false) {
                    toolsString =   'input_sel' + '~' + 
                                    tid + '?seek' + '~' + 
                                    media_icon + '~' + 
                                    toolsIconCol + '~' + 
                                    findLocale('media','seek') + '~' +
                                    'media5~'
                } else {
                    toolsString =   'input_sel' + '~' + 
                                    tid + '?crossfade' + '~' + 
                                    media_icon + '~' + 
                                    toolsIconCol + '~' + 
                                    findLocale('media','crossfade') + '~' +
                                    'media5~'
                }
            } else if (v2Adapter == 'squeezeboxrpc') {
                if (page.items[0].crossfade == undefined || page.items[0].crossfade == false) {
                    toolsString =   'input_sel' + '~' + 
                                    tid + '?seek' + '~' + 
                                    media_icon + '~' + 
                                    toolsIconCol + '~' + 
                                    findLocale('media','seek') + '~' +
                                    'media5~'
                }
            } else if (v2Adapter == 'spotify-premium') {
                if (page.items[0].crossfade == undefined || page.items[0].crossfade == false) {
                    toolsString =   'input_sel' + '~' + 
                                    tid + '?seek' + '~' + 
                                    media_icon + '~' + 
                                    toolsIconCol + '~' + 
                                    findLocale('media','seek') + '~' +
                                    'media5~'
                }
            } else {
                toolsString =   'button' + '~' + 
                                tid + '' + '~' + 
                                media_icon + '~' + 
                                toolsIconCol + '~' + 
                                findLocale('media','tools') + '~' +
                                'media5~'
            }

            out_msgs.push({
                payload: 'entityUpd~' +                   //entityUpd
                    name + '~' +                          //heading
                    GetNavigationString(pageId) + '~' +   //navigation
                    tid + '~' +                            //internalNameEntiy
                    title + '~' +                         //title
                    rgb_dec565(colMediaTitle) + '~' +     //titleColor
                    author + '~' +                        //author
                    rgb_dec565(colMediaArtist) + '~' +    //authorColor
                    volume + '~' +                        //volume
                    iconplaypause + '~' +                 //playpauseicon
                    onoffbutton + '~' +                   //On/Off Button Color
                    shuffle_icon + '~' +                  //iconShuffle                     --> Code
                    toolsString +
                    speakerListString +
                    playListString +
                    trackListString +
                    equalizerListString +
                    repeatButtonString
            });
        }
        if (Debug) {
            log('GenerateMediaPage payload: ' + JSON.stringify(out_msgs), 'info');
        }
        return out_msgs
    } catch (err: any) {
        log('error at function GenerateMediaPage: ' + err.message, 'warn');
        return [];
    }
}

async function createAutoAlarmAlias (id: string, nsPath: string){
    try {
        if (Debug){
            log('Alarm Alias Path: ' + id, 'info');
            log('Alarm 0_userdata Path: ' + nsPath, 'info');
        }
        if (autoCreateAlias) {
            if (isSetOptionActive) {
                if (existsState(nsPath + '.AlarmPin') == false || existsState(nsPath + '.AlarmState') == false || existsState(nsPath + '.AlarmType') == false || existsState(nsPath + '.PIN_Failed') == false || existsState(nsPath + '.PANEL') == false) {
                    await createStateAsync(nsPath + '.AlarmPin', '0000', { type: 'string', write: true });
                    await createStateAsync(nsPath + '.AlarmState', 'disarmed', { type: 'string', write: false });
                    await createStateAsync(nsPath + '.AlarmType', 'D1', { type: 'string', write: false });
                    await createStateAsync(nsPath + '.PIN_Failed', 0, { type: 'number', write: false });
                    await createStateAsync(nsPath + '.PANEL', NSPanel_Path, { type: 'string', write: false });     
                    setObject(id, {_id: id, type: 'channel', common: {role: 'sensor.fire.alarm', name:'alarm'}, native: {}});
                    await createAliasAsync(id + '.ACTUAL', nsPath + '.AlarmState', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                    await createAliasAsync(id + '.PIN', nsPath + '.AlarmPin', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'PIN' });
                    await createAliasAsync(id + '.TYPE', nsPath + '.AlarmType', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'TYPE' });
                    await createAliasAsync(id + '.PIN_Failed', nsPath + '.PIN_Failed', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'PIN_Failed' });
                    await createAliasAsync(id + '.PANEL', nsPath + '.PANEL', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'PANEL' });
                }
            }
        }
    } catch (err: any) {
        log('error at function createAutoAlarmAlias: ' + err.message, 'warn');
    }
}

function GenerateAlarmPage(page: NSPanel.PageAlarm): NSPanel.Payload[] {
    try {
        activePage = page;
        
        let id = page.items[0].id
        let name = page.heading;

        let out_msgs: NSPanel.Payload[] = [];
        out_msgs.push({ payload: 'pageType~cardAlarm' });
        let nsPath = NSPanel_Alarm_Path + 'Alarm';

        if (page.items[0].autoCreateALias) {
            if (!id) throw new Error ('Missing pageItem.id for cardAlarm! Property autoCreateAlias is true!');
            createAutoAlarmAlias(id, nsPath);
        }
        
        type AlarmEntityType = 'triggered' | 'armed' | 'disarmed' | 'pending' | 'arming';
        const AlarmEntityElements: AlarmEntityType[] = ['triggered', 'armed', 'disarmed', 'pending', 'arming']
        
        if (existsState(nsPath + '.AlarmPin') && existsState(nsPath + '.AlarmState') && existsState(nsPath + '.AlarmType')) {
            //let entityPin = getState(nsPath + 'AlarmPin').val;
            let entityState: AlarmEntityType = getState(nsPath + '.AlarmState').val as AlarmEntityType;
            if ( AlarmEntityElements.indexOf(entityState) == -1 ) {
                throw new Error(`Invalid value in state ${nsPath}.AlarmPin!`)
            }
            //let entityType = getState(nsPath + 'AlarmType').val;
            let arm1: string, arm2: string, arm3: string, arm4: string;
            let arm1ActionName: NSPanel.ButtonActionType | '', arm2ActionName: NSPanel.ButtonActionType | '', arm3ActionName: NSPanel.ButtonActionType | '', arm4ActionName: NSPanel.ButtonActionType | '';
            let icon = '0';
            let iconcolor = 63488;
            let numpadStatus = 'disable';
            let flashing = 'disable';

            if (Debug) {
                log('GenerateAlarmPage pageid: ' + id, 'info');
            }

            if (entityState == 'armed' || entityState == 'triggered') {
                if (page.items[0].actionStringArray !== undefined && page.items[0].actionStringArray[4] !== '') {
                    arm1 = page.items[0].actionStringArray[4];
                } else {
                    arm1 = findLocale('alarm_control_panel', 'disarm');     //'Deactivate'; //arm1*~*
                } 
                arm1ActionName = 'D1';                                      //arm1ActionName*~*
                arm2 = '';                                                  //arm2*~*
                arm2ActionName = '';                                        //arm2ActionName*~*
                arm3 = '';                                                  //arm3*~*
                arm3ActionName = '';                                        //arm3ActionName*~*
                arm4 = '';                                                  //arm4*~*
                arm4ActionName = '';                                        //arm4ActionName*~*
            } else/* if (entityState == 'disarmed' || entityState == 'arming' || entityState == 'pending')*/ {
                if (page.items[0].actionStringArray !== undefined && page.items[0].actionStringArray[0] !== '') {
                    arm1 = page.items[0].actionStringArray[0];
                } else {
                    arm1 = formatInSelText(findLocale('alarm_control_panel', 'arm_away'));                                           //'Vollschutz' //arm1*~*
                }
                arm1ActionName = 'A1';                                                                              //arm1ActionName*~*
                if (page.items[0].actionStringArray !== undefined && page.items[0].actionStringArray[1] !== '') {
                    arm2 = page.items[0].actionStringArray[1];
                } else {
                    arm2 = formatInSelText(findLocale('alarm_control_panel', 'arm_home'));                                           //'Zuhause';   //arm2*~*
                }    
                arm2ActionName = 'A2';                                                                              //arm2ActionName*~*
                if (page.items[0].actionStringArray !== undefined && page.items[0].actionStringArray[2] !== '') {
                    arm3 = page.items[0].actionStringArray[2];
                } else {
                    arm3 = formatInSelText(findLocale('alarm_control_panel', 'arm_night'));                                          //'Nacht';     //arm3*~*
                }
                arm3ActionName = 'A3';                                                                              //arm3ActionName*~*
                if (page.items[0].actionStringArray !== undefined && page.items[0].actionStringArray[3] !== '') {
                    arm4 = page.items[0].actionStringArray[3];
                } else {
                    arm4 = formatInSelText(findLocale('alarm_control_panel', 'arm_vacation'));                                       //'Besuch';    //arm4*~*
                }
                arm4ActionName = 'A4';                                                                              //arm4ActionName*~*
                if (Debug) {
                    log('GenerateAlarmPage String for arm1: ' + arm1 + ', arm2: ' + arm2 + ', arm3: ' + arm3 + ', arm4: ' + arm4, 'info');
                }
            } 

            if (entityState == 'armed') {
                icon = Icons.GetIcon('shield-home');                        //icon*~*
                iconcolor = 63488;                                          //iconcolor*~*
                numpadStatus = 'enable';                                    //numpadStatus*~*
                flashing = 'disable';                                       //flashing*
            }
            if (entityState == 'disarmed') {
                icon = Icons.GetIcon('shield-off');                         //icon*~*
                iconcolor = 2016;                                           //iconcolor*~*
                numpadStatus = 'enable';                                    //numpadStatus*~*
                flashing = 'disable';                                       //flashing*
            }
            if (entityState == 'arming' || entityState == 'pending') {
                icon = Icons.GetIcon('shield');                             //icon*~*
                iconcolor = rgb_dec565({ red: 243, green: 179, blue: 0 });  //iconcolor*~*
                numpadStatus = 'disable';                                   //numpadStatus*~*
                flashing = 'enable'                                         //flashing*
            }
            if (entityState == 'triggered') {
                iconcolor = rgb_dec565({ red: 223, green: 76, blue: 30 });  //icon*~*
                icon = Icons.GetIcon('bell-ring');                          //iconcolor*~*
                numpadStatus = 'enable';                                    //numpadStatus*~*
                flashing = 'enable'                                         //flashing*
            }
            
            out_msgs.push({
                payload: 'entityUpd~' +                     //entityUpd~*
                    name + '~' +                            //heading                    
                    GetNavigationString(pageId) + '~' +     //navigation*~* --> hiddenCardsv
                    id + '~' +                              //internalNameEntity*~*
                    arm1 + '~' +                            //arm1*~*
                    arm1ActionName + '~' +                  //arm1ActionName*~*
                    arm2 + '~' +                            //arm2*~*
                    arm2ActionName + '~' +                  //arm2ActionName*~*
                    arm3 + '~' +                            //arm3*~*
                    arm3ActionName + '~' +                  //arm3ActionName*~*
                    arm4 + '~' +                            //arm4*~*
                    arm4ActionName + '~' +                  //arm4ActionName*~*
                    icon + '~' +                            //icon*~*
                    iconcolor + '~' +                       //iconcolor*~*
                    numpadStatus + '~' +                    //numpadStatus*~*
                    flashing                                //flashing*
            });

            if (Debug) {
                log('GenerateAlarmPage payload: ' + JSON.stringify(out_msgs), 'info');
            }
            return out_msgs;
        }
        return [];
    } catch (err: any) {
        log('error at function GenerateAlarmPage: ' + err.message, 'warn');
        return [];
    }
}

async function createAutoUnlockAlias(id: string, dpPath: string) {
    try {
        if (Debug){
            log('Unlock Alias Path: ' + id, 'info');
            log('Unlock 0_userdata Path: ' + dpPath, 'info');
        }
        if (autoCreateAlias) {
            if (isSetOptionActive) {
                if (existsState(dpPath + 'UnlockPin') == false || existsState(dpPath + 'Access') == false) {
                    await createStateAsync(dpPath + 'UnlockPin', '0000', { type: 'string', write: true });
                    await createStateAsync(dpPath + 'Access', 'false', { type: 'boolean', write: false });
                    setObject(id, { _id: id, type: 'channel', common: { role: 'sensor.fire.alarm', name: 'sensor.fire.alarm' }, native: {} });
                    await createAliasAsync(id + '.PIN', dpPath + 'UnlockPin', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'PIN' });
                    await createAliasAsync(id + '.ACTUAL', dpPath + 'Access', true, <iobJS.StateCommon>{ type: 'boolean', role: 'sensor.fire.alarm', name: 'ACTUAL' });
                }
            }
        }
    } catch (err: any) {
        log('error at function createAutoUnlockAlias: ' + err.message, 'warn');
    }
    
}

function GenerateUnlockPage(page: NSPanel.PageUnlock): NSPanel.Payload[] {
    try {
        activePage = page;
        let id = page.items[0].id
        let name = page.heading;

        let out_msgs: NSPanel.Payload[] = [];
        out_msgs.push({ payload: 'pageType~cardAlarm' });

        let dpPath : string = ''
        let dpTempPath: any = NSPanel_Path.split('.');
        for (let i=0; i < dpTempPath.length - 2; i++) {
            dpPath = dpPath + dpTempPath[i] + '.';
        } 
        dpPath = (dpPath + 'Unlock.');

        if (page.items[0].autoCreateALias) {
            if (!id) throw new Error ('Missing pageItem.id for cardUnlock! Property autoCreateAlias is true!');
            createAutoUnlockAlias(id, dpPath)            
        }

        let unlock1 = findLocale('lock', 'UNLOCK');                     //unlock1*~*
        let unlock1ActionName: NSPanel.ButtonActionType | '' = 'U1';                                   //unlock1ActionName*~*

        let iconcolor = rgb_dec565({ red: 223, green: 76, blue: 30 });  //icon*~*
        let icon = Icons.GetIcon('lock-remove');                        //iconcolor*~*
        let numpadStatus = 'enable';                                    //numpadStatus*~*
        let flashing = 'disable'                                        //flashing*

        out_msgs.push({
            payload:    'entityUpd~' +                          //entityUpd~*
                        name + '~' +                            //heading                    
                        GetNavigationString(pageId) + '~' +     //navigation*~* --> hiddenCardsv
                        id + '~' +                              //internalNameEntity*~*
                        unlock1 + '~' +                         //unlock1*~*
                        unlock1ActionName + '~' +               //unlock1ActionName*~*
                        '~' +
                        '~' +
                        '~' +
                        '~' +
                        '~' +
                        '~' +
                        icon + '~' +                            //icon*~*
                        iconcolor + '~' +                       //iconcolor*~*
                        numpadStatus + '~' +                    //numpadStatus*~*
                        flashing                                //flashing*
            });

        if (Debug) {
            log('GenerateUnlockPage payload: ' + JSON.stringify(out_msgs), 'info');
        }
        return out_msgs;
        
    } catch (err: any) {
        log('error at function GenerateUnlockPage: ' + err.message, 'warn');
        return [];
    }
}

async function createAutoQRAlias(id:string, dpPath:string) {
    try {
        if (Debug){
            log('QRPage Alias Path: ' + id, 'info');
            log('QRPage 0_userdata Path: ' + dpPath, 'info');
        }
        if (autoCreateAlias) {
            if (isSetOptionActive) {
                if (existsState(dpPath + 'Daten') == false) {
                    await createStateAsync(dpPath + 'Daten', 'WIFI:T:undefined;S:undefined;P:undefined;H:undefined;', <iobJS.StateCommon>{ type: 'string', write: true });
                    await createStateAsync(dpPath + 'Switch', false, <iobJS.StateCommon>{ type: 'boolean', write: true });
                    setObject(id, { _id: id, type: 'channel', common: { role: 'switch.mode.wlan', name: 'QR Page' }, native: {} });
                    await createAliasAsync(id + '.ACTUAL', dpPath + 'Daten', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                    await createAliasAsync(id + '.SWITCH', dpPath + 'Switch', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SWITCH' });
                    log('Adjust data for the QR page under ' + dpPath + 'data. Follow the instructions in the wiki.', 'warn');
                }
            }
        }
    } catch (err: any) {
        log('error at function createAutoQRkAlias: ' + err.message, 'warn');
    } 
}

function GenerateQRPage(page: NSPanel.PageQR): NSPanel.Payload[] {
    try {
        activePage = page;
        if (!page.items[0].id) throw new Error ('Missing pageItem.id for cardQRPage!');
        let id = page.items[0].id;
        let out_msgs: NSPanel.Payload[] = [];
        out_msgs.push({ payload: 'pageType~cardQR' });

        let dpPath : string = ''
        let dpTempPath: any = NSPanel_Path.split('.');
        for (let i=0; i < dpTempPath.length - 2; i++) {
            dpPath = dpPath + dpTempPath[i] + '.';
        } 
        dpPath = (dpPath + 'GuestWiFi.');

        if (page.items[0].autoCreateALias) {
            createAutoQRAlias(id, dpPath)            
        }

        let o = getObject(id);

        let heading = page.heading !== undefined ? page.heading : o.common.name.de;
        let textQR = page.items[0].id + '.ACTUAL' !== undefined ? getState(page.items[0].id + '.ACTUAL').val : 'WIFI:T:undefined;S:undefined;P:undefined;H:undefined;';
        let hiddenPWD = false;
        if (page.items[0].hidePassword !== undefined && page.items[0].hidePassword == true) {
            hiddenPWD = true;
        }

        const tempstr = textQR.split(';');
        let optionalValue1: any;
        let optionalValue2: any;
        for (let w = 0; w < tempstr.length - 1; w++) {
            if (tempstr[w].substring(5, 6) == 'T') {
                tempstr[w].slice(7) == 'undefined' ? log('Adjust data (T) for the QR page under ' + dpPath + 'data. Follow the instructions in the wiki.', 'warn') : '' ;
            }            
            if (tempstr[w].substring(0, 1) == 'S') {
                tempstr[w].slice(2) == 'undefined' ? log('Adjust data (S) for the QR page under ' + dpPath + 'data. Follow the instructions in the wiki.', 'warn') : optionalValue1 = tempstr[w].slice(2);
            }
            if (tempstr[w].substring(0, 1) == 'P') {
                optionalValue2 = tempstr[w].slice(2);
            }
        }

        let type1 = 'text';
        let internalName1 = findLocale('qr', 'ssid');
        let iconId1 = Icons.GetIcon('wifi');
        let iconColor1 = 65535;
        let displayName1 = findLocale('qr', 'ssid');
        let type2 = 'text';
        let internalName2 = findLocale('qr', 'password');
        let iconColor2 = 65535;
        let iconId2 = Icons.GetIcon('key');
        let displayName2 = findLocale('qr', 'password');

        if (hiddenPWD) {
            iconColor1 = getState(page.items[0].id + '.SWITCH').val ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
            type2 = 'switch';
            internalName2 = id
            iconId2 = '';
            displayName2 = getState(page.items[0].id + '.SWITCH').val ? findLocale('qr', 'Wlan enabled') : findLocale('qr', 'Wlan disabled');
            optionalValue2 = getState(page.items[0].id + '.SWITCH').val ? 1 : 0;
        }

        out_msgs.push({
            payload: 'entityUpd~' +                     //entityUpd
                heading + '~' +                         //heading
                GetNavigationString(pageId) + '~' +     //navigation
                textQR + '~' +                          //textQR
                type1 + '~' +                           //type
                internalName1 + '~' +                   //internalName
                iconId1 + '~' +                         //iconId
                iconColor1 + '~' +                      //iconColor
                displayName1 + '~' +                    //displayName
                optionalValue1 + '~' +                  //optionalValue
                type2 + '~' +                           //type
                internalName2 + '~' +                   //internalName
                iconId2 + '~' +                         //iconId
                iconColor2 + '~' +                      //iconColor
                displayName2 + '~' +                    //displayName
                optionalValue2
        });

        if (Debug) {
            log('GenerateQRPage payload: ' + JSON.stringify(out_msgs), 'info');
        }
        return out_msgs;

    } catch (err: any) {
        log('error at function GenerateQRPage: ' + err.message, 'warn');
        return [];
    }
}

function unsubscribePowerSubscriptions(): void {
    for (let i = 0; i < config.pages.length; i++) {
        const page: NSPanel.PageType = config.pages[i];
        if (isPagePower(page)) {
            let powerID = page.items[0].id;
            unsubscribe(powerID + '.ACTUAL');
        }
    }
    for (let i = 0; i < config.subPages.length; i++) {
        const page: NSPanel.PageType = config.subPages[i];
        if (isPagePower(page)) {
                let powerID = page.items[0].id;
            unsubscribe(powerID + '.ACTUAL');
        }
    }
    if (Debug) log('unsubscribePowerSubscriptions getstartet', 'info');
} 

function subscribePowerSubscriptions(id: string): void {
    on({id: id + '.ACTUAL', change: "ne"}, async function () {
        (function () { if (timeoutPower) { clearTimeout(timeoutPower); timeoutPower = null; } })();
        timeoutPower = setTimeout(async function () {
            GeneratePage(activePage!);
        },25)
    });
} 

function GeneratePowerPage(page: NSPanel.PagePower): NSPanel.Payload[] {
    try {

        let obj:object = {};
        let demoMode = false;        
        if (page.items[0].id == undefined){
            log('No PageItem defined - cardPower demo mode active', 'info');
            demoMode = true;
        }

        activePage = page;
        if (Debug) {
            log('GeneratePowerPage PageItem.id = ' + page.items[0].id, 'info');
        }

        let heading = 'cardPower Example';
        if (demoMode != true) {
            let id = page.items[0].id
            unsubscribePowerSubscriptions();

            let o = getObject(id);
            heading = page.heading !== undefined ? page.heading : o.common.name.de;

            obj = JSON.parse((getState(page.items[0].id + '.ACTUAL').val));
        }
        
        let out_msgs: NSPanel.Payload[] = [];

        // Leave the display on if the alwaysOnDisplay parameter is specified (true)
        if (page.type == 'cardPower' && pageCounter == 0 && page.items[0].alwaysOnDisplay != undefined) {
            out_msgs.push({ payload: 'pageType~cardPower' });
            if (page.items[0].alwaysOnDisplay != undefined) {
                if (page.items[0].alwaysOnDisplay) {
                    pageCounter = 1;
                    if (alwaysOn == false) {
                        alwaysOn = true;
                        SendToPanel({ payload: 'timeout~0' });
                        subscribePowerSubscriptions(page.items[0].id);
                    }
                }
            }
        } else if (page.type == 'cardPower' && pageCounter == 1) {
            subscribePowerSubscriptions(page.items[0].id);
        } else {
            out_msgs.push({ payload: 'pageType~cardPower' });
        }

        if (Debug) {
            log('GeneratePowerPage PageItem.id = ' + page.items[0].id, 'info');
        }

        //Demo Data if no pageItem present
        let array_icon_color = [White, MSGreen, MSYellow, MSGreen, MSYellow, MSGreen, MSRed];
        let array_icon = ['home', 'battery-charging-60', 'solar-power-variant', 'wind-turbine', 'shape', 'transmission-tower', 'car'];
        let array_powerspeed = ['', '10', '-20', '-40', '-10', '-10', '-50'];
        let array_powerstate = ['', '0,5 kW', '0,9 kW', '2,8 kW', '0,2 kW', '0,1 kW', '4,6 kW'];

        let arrayColorScale = [colorScale0, colorScale1, colorScale2, colorScale3, colorScale4, colorScale5, colorScale6, colorScale7, colorScale8, colorScale9, colorScale10, White];

        if (!demoMode) {
            for (let obji = 1; obji < 7; obji++) {
                const color = obj[obji].iconColor !== '' ? obj[obji].iconColor : 0;
                array_icon_color[obji] = arrayColorScale[color];
                array_icon[obji] = obj[obji].icon;
                array_powerspeed[obji] = obj[obji].speed;
                array_powerstate[obji] = obj[obji].value + ' ' + obj[obji].unit ;
            }
            array_icon[0] = obj[0].icon;
            array_powerstate[0] = obj[0].value + ' ' + obj[0].unit;
            array_icon_color[0] = arrayColorScale[obj[0].iconColor];
        }

        let power_string : any = '';

        for (let i = 0; i < 6; i++ ) {
            power_string = power_string + '~';                                        // type (ignored)
            power_string = power_string + '~';                                        // intNameEntity (ignored)
            power_string = power_string + Icons.GetIcon(array_icon[i+1]) + '~';       // icon~
            power_string = power_string + rgb_dec565(array_icon_color[i+1]) + '~';    // icon_color~
            power_string = power_string + '~';                                        // display (ignored in TS)
            power_string = power_string + array_powerstate[i+1] + '~';                // optionalValue~
            power_string = power_string + array_powerspeed[i+1] + '~';                // speed~

            if (Debug) log(power_string, 'info');
        }

        power_string = power_string.substring(0, power_string.length - 1);
            
        out_msgs.push({
            payload: 'entityUpd~' +                                 //entityUpd~*
                heading                         + '~' +             //internalNameEntity*~*
                GetNavigationString(pageId)     + '~' +             //navigation*~*
            // Home Icon / Value below Home Icon
                '' + '~' +                                          // type (ignored)
                '' + '~' +                                          // intNameEntity (ignored)
                Icons.GetIcon(array_icon[0])    + '~' +             // icon
                rgb_dec565(array_icon_color[0]) + '~' +             // icon_color
                '' + '~' +                                          // display (ignored in TS)
                array_powerstate[0]             + '~' +             // optionalValue
                '' + '~' +                                          // speed
            // Value above Home Icon
                '' + '~' +                                          // type (ignored)
                '' + '~' +                                          // intNameEntity (ignored)
                '' + '~' +                                          // icon
                '' + '~' +                                          // icon_color
                '' + '~' +                                          // display (ignored in TS)
                '' + '~' +                                          // optionalValue
                '' + '~' +                                          // speed~
            // 1st to 6th Item
                power_string
        });
        if (Debug) log('GeneratePowerPage payload: ' + JSON.stringify(out_msgs), 'info');
        return out_msgs;

    } catch (err: any) {
        log('error at function GeneratePowerPage: ' + err.message, 'warn');
        return [];
    }
}

const timeValueRegEx = /\~\d+:(\d+)/g;
function GenerateChartPage(page: NSPanel.PageChart): NSPanel.Payload[] {
    try {
        activePage = page;

        let id = page.items[0].id;
	let out_msgs: NSPanel.Payload[] = [];
        out_msgs.push({ payload: 'pageType~' + page.type });

        let heading = page.heading !== undefined ? page.heading : "Chart...";

        const txt = getState(id + '.ACTUAL')?.val;
        if (!txt) {
            throw new Error(`Unable to get the state of ${id}.ACTUAL`)
        }

        let yAxisTicks : number[] = [];

        if (!page.items[0].yAxisTicks) {
            const sorted = [...String(txt).matchAll(timeValueRegEx)].map(x => Number(x[1])).sort((x, y) => x < y ? -1 : 1);
            if (sorted.length === 0) {
                throw new Error (`Page item ${id} yAxisTicks is undefined and unable to be calculated!`)
            }
            const minValue = sorted[0];
            const maxValue = sorted[sorted.length - 1];
            const tick = Math.max(Number(((maxValue - minValue) / 5).toFixed()), 10);

            let currentTick = minValue - tick;
            while(currentTick < (maxValue + tick)) {
                yAxisTicks.push(currentTick);
                currentTick += tick;
            }            

            if (Debug) {
                log(`Calculated yAxisTicks for ${id} (Min: ${minValue}, Max: ${maxValue}, Tick: ${tick}): ${yAxisTicks}`);
            }
        } else {            
            yAxisTicks = typeof page.items[0].yAxisTicks === 'string'
                            ? JSON.parse(getState(page.items[0].yAxisTicks).val)
                            : page.items[0].yAxisTicks;
        }

        if (!page.items[0].onColor) {
            throw new Error (`Page item ${id} onColor is undefined!`)
        }

        out_msgs.push({
            payload:    'entityUpd~' +                              //entityUpd
                        heading + '~' +                             //heading
                        GetNavigationString(pageId) + '~' +         //navigation
                        rgb_dec565(page.items[0].onColor) + '~' +   //color
                        page.items[0].yAxis + '~' +
                        yAxisTicks.join(':') + '~' +
                        txt
        });     

        if (Debug) log('GenerateChartPage payload: ' + JSON.stringify(out_msgs), 'info');
        return out_msgs;
    } catch (err: any) {
        log('error at function GenerateChartPage: ' + err.message, 'warn');
        return [];
    }
}

function setIfExists(id: string, value: any, type: string | null = null, ack: boolean = false): boolean {
    try {
        if (type === null) {
            if (existsState(id)) {
                setState(id, value, ack);
                return true;
            }
        } else {
            const obj = getObject(id);
            if (existsState(id) && obj.common.type !== undefined && obj.common.type === type) {
                setState(id, value, ack);
                return true;
            }
        }
    } catch (err: any) {
        log('error at function setIfExists: ' + err.message, 'warn');
    }
    return false;
}

function toggleState(id: string): boolean {
    try {
        const obj = getObject(id);
        if (existsState(id) && obj.common.type !== undefined && obj.common.type === 'boolean') {
            setIfExists(id, !getState(id).val);
            return true;
        }
    } catch (err: any) {
        log('error at function toggleState: ' + err.message, 'warn');
    }
    return false;
}

// Begin Monobutton	
function triggerButton(id: string): boolean{	
	try {	
		let obj = getObject(id);	
		if (existsState(id) && obj.common.type !== undefined && obj.common.type === "boolean") {	
			setState(id, true);	
			setTimeout(function() { setState(id, false) }, 250);
			return true;	
		}	
		
	}  catch (err: any) {	
        log('error at function triggerButton: ' + err.message, 'warn');	
    }	
    return false;		
}	
// End Monobutton

function HandleButtonEvent(words: any): void {
    try {

        // Turn off the display if the alwaysOnDisplay parameter was specified
        if (alwaysOn == true) {
            unsubscribePowerSubscriptions();
            unsubscribeMediaSubscriptions();
        }

        let tempid = words[2].split('?');
        let id = tempid[0];
        let buttonAction: NSPanel.ButtonActionType = words[3] as NSPanel.ButtonActionType;
        let pageItemID: string = '';

        if (!isNaN(id)) {
            if (activePage!.items[id].id == undefined) throw new Error ('Missing pageItem.id in HandleButtonEvent!');
            pageItemID = activePage!.items[id].id!;
            if (Debug) {
                    log('HandleButtonEvent activePage: ' + activePage!.items.length + ' id: ' + id + ' tempid: ' + tempid + ' pageItemId: ' + pageItemID);
            }
            id = pageItemID
        };

        if (Debug) {
            log('HandleButtonEvent übergebene Werte ' + words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4] + ' - PageId: ' + pageId, 'info');
        }

        if ((words[2]).substring(0, 8) == 'navigate') {
            GeneratePage(eval((words[2]).substring(9, (words[2]).length)));
            return;
        }

        if (words[2] == 'bNext' || words[2] == 'bPrev' || words[2] == 'bUp' || words[2] == 'bHome' || words[2] == 'bSubNext' || words[2] == 'bSubPrev' ) {
            buttonAction = words[2];
            pageCounter = 0;
            alwaysOn = false;
            SendToPanel({ payload: 'timeout~' + getState(NSPanel_Path + 'Config.Screensaver.timeoutScreensaver').val });
        }

        setOrCreate(NSPanel_Path + "Event.Button.Action", buttonAction ?? words[2], false, {name: 'Incoming button acion', type: 'string', role: 'text', write: false, read: true});
        setOrCreate(NSPanel_Path + "Event.Button.Value", words[4] != undefined ? words[4] : '', false, {name: 'Incoming button value', type: 'string', role: 'text', write: false, read: true});
        setOrCreate(NSPanel_Path + "Event.Button.Id", id, false, {name: 'Incoming button id', type: 'string', role: 'text', write: false, read: true});

        if (Debug) {
            log('HandleButtonEvent buttonAction: ' + buttonAction, 'info');
        }

        if (buttonAction.startsWith('swipe')) {
            buttonAction = 'bExit';
        }

        let pageNum:number = 0;

        switch (buttonAction) {
            case 'bUp':
                if (pageId < 0) { // Check whether button1page or button2page
                    pageId = 0;
                    UnsubscribeWatcher();
                    GeneratePage(config.pages[pageId]);
                } else {
                    pageNum = (((pageId - 1) % config.pages.length) + config.pages.length) % config.pages.length;
                    pageId = pageNum;
                    UnsubscribeWatcher();
                    if (activePage != undefined && activePage!.parent != undefined) {
                        //update pageID
                        for (let i = 0; i < config.pages.length; i++) {
                            if (config.pages[i] == activePage!.parent) {
                                pageId = i;
                                break;
                            }
                        }
                        GeneratePage(activePage!.parent);
                    }
                    else {
                        GeneratePage(config.pages[pageId]);
                    }
                    break;
                }
                break;
            case 'bNext':
                pageNum = (((pageId + 1) % config.pages.length) + config.pages.length) % config.pages.length;
                pageId = pageNum;
                UnsubscribeWatcher();
                //-Serching for next unhidden Page----------------------
                if (config.pages[pageId].hiddenByTrigger && valueHiddenCards) {
                    for (let i = pageId; i <= config.pages.length; i++) {
                        if (i == config.pages.length) {
                            i = 0
                        }
                        if (!config.pages[i].hiddenByTrigger) {
                            pageId = i;
                            break;
                        }
                    }  
                }
                GeneratePage(config.pages[pageId]);
                break;
            case 'bSubNext':
                UnsubscribeWatcher();
                // check this please
                GeneratePage(eval(activePage!.next!));
                break;
            case 'bPrev':
                pageNum = (((pageId - 1) % config.pages.length) + config.pages.length) % config.pages.length;
                pageId = pageNum;
                UnsubscribeWatcher();
                //-Searching for previous unhidden Page----------------------
                if (config.pages[pageId].hiddenByTrigger && valueHiddenCards) {
                    for (let i = pageId; i >= 0; i--) {
                        if (config.pages[i].hiddenByTrigger == false || config.pages[i].hiddenByTrigger == undefined) {
                            pageId = i;
                            break;
                        }
                    }  
                }
                if (activePage != undefined && activePage!.parent != undefined) {
                    //update pageID
                    for (let i = 0; i < config.pages.length; i++) {
                        if (config.pages[i] == activePage!.parent) {
                            pageId = i;
                            break;
                        }
                    }
                    GeneratePage(activePage!.parent);
                }
                else {
                    GeneratePage(config.pages[pageId]);
                }
                break;
            case 'bSubPrev':          
                UnsubscribeWatcher();
                // check this please
                GeneratePage(eval(activePage!.prev!));
                break;
            case 'bExit':
                if (Debug) {
                    log('HandleButtonEvent -> bExit: ' + words[2] + ' - ' + words[4] + ' - ' + pageId, 'info');
                }
                if (words[2] == 'screensaver') {
                    if (getState(NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick').val) {
                        if (words[4] >= 2) {
                            if (existsObject(NSPanel_Path + 'ScreensaverInfo.bExitPage') && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != null && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != -1) {
                                pageId = getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val;
                            }
                        } else {
                            if (getState(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading').val != '') {
                                setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading', '');
                            }
                            if (getState(NSPanel_Path + 'ScreensaverInfo.popupNotifyText').val != '') {
                                setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyText', '');
                            }
                            screensaverEnabled = true;
                            break;
                        }
                    } else {
                        if (getState(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading').val != '') {
                            setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading', '');
                        }
                        if (getState(NSPanel_Path + 'ScreensaverInfo.popupNotifyText').val != '') {
                            setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyText', '');
                        }
                        if (existsObject(NSPanel_Path + 'ScreensaverInfo.bExitPage') && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != null && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != -1) {
                            pageId = getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val
                        }
                        screensaverEnabled = true; // Activating screensaver also on One-Time click
                    }
		            activePage = config.pages[pageId];
	        	}
                if (words[2] == 'popupInSel' && activePage!.type == 'cardMedia') {
                    if (Debug) log('Leave popupInsel without any action', 'info')
                    pageCounter = 0;
                    GeneratePage(activePage!);
                    setTimeout(async function () {
                        pageCounter = 1;
                        GeneratePage(activePage!);
                    }, 3000);
                } else {
                    pageCounter = 0; 
                    GeneratePage(activePage!);
                }
                break;
                case 'bHome':
                    if (Debug) {
                        log('HandleButtonEvent -> bHome: ' + words[4] + ' - ' + pageId, 'info');
                    }
                    UnsubscribeWatcher();
                    const home = activePage!.home;
                    if (home !== undefined) {
                        pageId = config.pages.findIndex(a => a == eval(home))
                        pageId = pageId === -1 ? 0 : pageId;
                        GeneratePage(eval(home));
                    } else {
                        pageId = 0;
                        GeneratePage(config.pages[0]);
                    }
                    break;
            case 'notifyAction':
                if (words[4] == 'yes') {
                    setState(popupNotifyInternalName, <iobJS.State>{ val: words[2], ack: true });
                    setState(popupNotifyAction, <iobJS.State>{ val: true, ack: true });
                } else if (words[4] == 'no') {
                    setState(popupNotifyInternalName, <iobJS.State>{ val: words[2], ack: true });
                    setState(popupNotifyAction, <iobJS.State>{ val: false, ack: true });
                }

                setIfExists(config.panelSendTopic, 'exitPopup');

                break;
            case 'OnOff':
                if (existsObject(id)) {
                    let action = false;
                    if (words[4] == '1')
                        action = true;
                    let o = getObject(id);
                    if (Debug) {
                        log('HandleButtonEvent -> OnOff: ' + words[4] + ' - ' + id + ' - Role - ' + o.common.role, 'info')
                    }
                    const role = o.common.role as NSPanel.roles;
                    switch (role) {
                        case 'level.mode.fan':
                        case 'socket':
                        case 'light':
                            let pageItem = findPageItem(id);	
							if(pageItem.monobutton != undefined && pageItem.monobutton == true){	
								triggerButton(id + ".SET");
							}	
							else {	
								setIfExists(id + '.SET', action);
							}		
							break;
                        case 'dimmer':
                            setIfExists(id + '.ON_SET', action) ? true : setIfExists(id + '.ON_ACTUAL', action);
                            break;
                        case 'ct':
                            setIfExists(id + '.ON', action);
                            break;
                        case 'rgb':
                        case 'rgbSingle':
                        case 'hue':
                            setIfExists(id + '.ON_ACTUAL', action);
                            break;
                        case 'switch.mode.wlan':
                            setIfExists(id + '.SWITCH', action);
                            GeneratePage(activePage!);
                            break;
                    }
                }
                break;
            case 'button':
                if (['f1Icon', 'f2Icon', 'f3Icon', 'f4Icon', 'f5Icon'].indexOf(words[2]) != -1) {
                    const fNumber = parseInt(words[2].substring(1, 2)) - 1;
                    const indicatorScreensaverEntity = config.indicatorScreensaverEntity[fNumber];
                    if (indicatorScreensaverEntity != null && indicatorScreensaverEntity !== undefined && indicatorScreensaverEntity.ScreensaverEntityNaviToPage !== undefined) {
                        if (Debug) log('NaviToPage: ' + words[2]);
                        GeneratePage(indicatorScreensaverEntity.ScreensaverEntityNaviToPage);
                    } else {
                        const value = ['event','buttonPress2','screensaver','bExit','2'];
                        HandleButtonEvent(value);
                    }
                }

                if (existsObject(id)) {
                    let action = false;
                    if (words[4] == '1')
                        action = true;
                    let o = getObject(id);
                    switch (o.common.role as NSPanel.roles) {
                        case 'lock':
                        case 'button':
                            toggleState(id + '.SET') ? true : toggleState(id + '.ON_SET');
                            break; 
                        case 'buttonSensor':
                            if (existsObject(id + '.ACTUAL')) {
                                toggleState(id + '.ACTUAL');
                            }
                            break;
                        case 'socket':
                        case 'light':
	                        // Change for monobutton	
                            let pageItem = findPageItem(id);	
							if(pageItem.monobutton != undefined && pageItem.monobutton == true){	
								triggerButton(id + ".SET");
							}	
							else {	
								toggleState(id + ".SET") ? true : toggleState(id + ".ON_SET");
							}	
							break;	
                        case 'dimmer':
                            toggleState(id + '.ON_SET') ? true : toggleState(id + '.ON_ACTUAL');
                            break;
                        case 'ct':
                            toggleState(id + '.ON');
                            break;
                        case 'rgb':
                        case 'rgbSingle':
                        case 'hue':
                            toggleState(id + '.ON_ACTUAL');
                            break;
                        case 'media':
                            if (!activePage || activePage.type != 'cardMedia') {
                                if (activePage) throw new Error(`Found channel role media for card: ${activePage.type} not allowed`)
                                else throw new Error(`Something went wrong! Active Page is empty!`);
                            }
                            if (tempid[1] == undefined) {
                                if (Debug) log('Logo click', 'info');
                                GeneratePage(activePage!);
                            } else if (tempid[1] == 'repeat') {
                                
                                let pageItemRepeat = findPageItem(id);
                                if (isPageMediaItem(pageItemRepeat)) {
                                    let adapterInstanceRepeat = pageItemRepeat.adapterPlayerInstance;
                                    let adapterRepeat = adapterInstanceRepeat.split('.');
                                    const deviceAdapterRP: NSPanel.PlayerType = adapterRepeat[0] as NSPanel.PlayerType;
                                    
                                    switch (deviceAdapterRP) {
                                        case 'spotify-premium':
                                            if (Debug) log(getState(id + '.REPEAT').val);
                                            let stateSpotifyRepeat = getState(id + '.REPEAT').val;
                                            if (stateSpotifyRepeat == 'off') {
                                                setIfExists(id + '.REPEAT', 'context');
                                            } else if (stateSpotifyRepeat == 'context') {
                                                setIfExists(id + '.REPEAT', 'track');
                                            } else if (stateSpotifyRepeat == 'track') {
                                                setIfExists(id + '.REPEAT', 'off');
                                            }
                                            GeneratePage(activePage!);
                                            break;
                                        case 'bosesoundtouch':
                                            if (Debug) log(adapterInstanceRepeat);
                                            let stateBoseRepeat = getState(id + '.REPEAT').val;
                                            if (stateBoseRepeat == 'REPEAT_OFF') {
                                                setIfExists(adapterInstanceRepeat + 'key', 'REPEAT_ALL');
                                            } else if (stateBoseRepeat == 'REPEAT_ALL') {
                                                setIfExists(adapterInstanceRepeat + 'key', 'REPEAT_ONE');
                                            } else if (stateBoseRepeat == 'REPEAT_ONE') {
                                                setIfExists(adapterInstanceRepeat + 'key', 'REPEAT_OFF');
                                            }
                                            GeneratePage(activePage!);
                                            break;
                                        case 'sonos':
                                            let stateSonosRepeat = getState(id + '.REPEAT').val;
                                            if (stateSonosRepeat == 0) {
                                                setIfExists(id + '.REPEAT', 1);
                                            } else if (stateSonosRepeat == 1) {
                                                setIfExists(id + '.REPEAT', 2);
                                            } else if (stateSonosRepeat == 2) {
                                                setIfExists(id + '.REPEAT', 0);
                                            }
                                            GeneratePage(activePage!);
                                            break;
                                        case 'alexa2':
                                            try {
                                                setIfExists(id + '.REPEAT', !getState(id + '.REPEAT').val);
                                            } catch (err: any) {
                                                log('ALEXA2: Repeat kann nicht verändert werden', 'warn');
                                            }
                                            GeneratePage(activePage!);
                                            break;
                                        case 'volumio':
                                            let urlString: string = `${getState(adapterInstanceRepeat + 'info.host').val}/api/commands/?cmd=repeat`;
                                            axios.get(urlString, {headers: {'User-Agent': 'ioBroker'}})
                                                .then(async function (response) {
                                                    if (response.status === 200) {
                                                        if (Debug) {
                                                            log(response.data, 'info');
                                                        }
                                                        GeneratePage(activePage!);
                                                    } else {
                                                        log('Axios Status - adapterInstanceRepeat: ' + response.state, 'warn');
                                                    }
                                                })
                                                .catch(function (error) {
                                                    log(error, 'warn');
                                                });
                                            break;
                                        case 'squeezeboxrpc':
                                            try {
                                                switch (getState(id + '.REPEAT').val) {
                                                    case 0:
                                                        setIfExists(id + '.REPEAT', 1);
                                                        GeneratePage(activePage!);
                                                        break;
                                                    case 1:
                                                        setIfExists(id + '.REPEAT', 2)
                                                        GeneratePage(activePage!);
                                                        break;
                                                    case 2:
                                                        setIfExists(id + '.REPEAT', 0);
                                                        GeneratePage(activePage!);
                                                        break;
                                                }
                                            } catch (err: any) {
                                                log('Squeezebox: Repeat kann nicht verändert werden', 'warn');
                                            }
                                            break;
                                    }
                                }
                            }
                    }
                }
                break;
            case 'up':
                setIfExists(id + '.OPEN', true);
                checkBlindActive = true;
                break;
            case 'stop':
                setIfExists(id + '.STOP', true);
                checkBlindActive = false;
                break;
            case 'down':
                setIfExists(id + '.CLOSE', true);
                checkBlindActive = true;
                break;
            case 'positionSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    let pageItem = findPageItem(id);
                    if (pageItem.minValueLevel != undefined && pageItem.maxValueLevel != undefined) {
                        let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueLevel, pageItem.minValueLevel));
                        setIfExists(id + '.SET', sliderPos) ? true : setIfExists(id + '.ACTUAL', sliderPos);
                        checkBlindActive = true;
                    } else {
                        setIfExists(id + '.SET', parseInt(words[4])) ? true : setIfExists(id + '.ACTUAL', parseInt(words[4]));
                        checkBlindActive = true;
                    }
                }, 250);
                break;
            case 'tiltOpen':
                setIfExists(id + '.TILT_OPEN', true);
                break;
            case 'tiltStop':
                setIfExists(id + '.TILT_STOP', true);
                break;
            case 'tiltClose':
                setIfExists(id + '.TILT_CLOSE', true);
                break;
            case 'tiltSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    let pageItem = findPageItem(id);
                    if (pageItem.minValueTilt != undefined && pageItem.maxValueTilt != undefined) {
                        let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueTilt, pageItem.minValueTilt));
                        setIfExists(id + '.TILT_SET', sliderPos) ? true : setIfExists(id + '.TILT_ACTUAL', sliderPos);
                    } else {
                        setIfExists(id + '.TILT_SET', parseInt(words[4])) ? true : setIfExists(id + '.TILT_ACTUAL', parseInt(words[4]));
                    }
                }, 250);
                break;
            case 'brightnessSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    if (existsObject(id)) {
                        let o = getObject(id);
                        let pageItem = findPageItem(id);
                        const role = o.common.role as NSPanel.roles;
                        switch (role) {
                            case 'dimmer':
                                if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                                    let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueBrightness, pageItem.minValueBrightness));
                                    setIfExists(id + '.SET', sliderPos) ? true : setIfExists(id + '.ACTUAL', sliderPos);
                                } else {
                                    setIfExists(id + '.SET', parseInt(words[4])) ? true : setIfExists(id + '.ACTUAL', parseInt(words[4]));
                                }
                                break;
                            case 'rgb':
                            case 'ct':
                            case 'rgbSingle':
                            case 'hue':
                                if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                                    let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueBrightness, pageItem.minValueBrightness));
                                    setIfExists(id + '.DIMMER', sliderPos);
                                } else {
                                    setIfExists(id + '.DIMMER', parseInt(words[4]));
                                }
                                break;
                        }
                    }
                }, 250);
                break;
            case 'colorTempSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    let pageItem = findPageItem(id);
                    if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                        let colorTempK = Math.trunc(scale(parseInt(words[4]), 100, 0, pageItem.minValueColorTemp, pageItem.maxValueColorTemp));
                        setIfExists(id + '.TEMPERATURE', (colorTempK));
                    } else {
                        setIfExists(id + '.TEMPERATURE', parseInt(words[4]));
                    }
                }, 250);
                break;
            case 'colorWheel':
                let colorCoordinates = words[4].split('|');
                let rgb = pos_to_color(colorCoordinates[0], colorCoordinates[1]);
                if (Debug) {
                    log('HandleButtonEvent colorWeel -> rgb-Wert: ' + rgb, 'info');
                }
                if (Debug) {
                    log('HandleButtonEvent colorWeel -> getHue-Werte: ' + getHue(rgb.red, rgb.green, rgb.blue), 'info');
                }
                let o = getObject(id);
                switch (o.common.role as NSPanel.roles) {
                    case 'hue':
                        setIfExists(id + '.HUE', getHue(rgb.red, rgb.green, rgb.blue));
                        break;
                    case 'rgb':
                        setIfExists(id + '.RED', rgb.red);
                        setIfExists(id + '.GREEN', rgb.green);
                        setIfExists(id + '.BLUE', rgb.blue);
                        break;
                    case 'rgbSingle':
                        let pageItem = findPageItem(id);
                        if (pageItem.colormode == "xy") {
                            //For e.g. Deconz XY
                            setIfExists(id + ".RGB", rgb_to_cie(rgb.red, rgb.green, rgb.blue));
                            if (Debug) {
                                log('HandleButtonEvent colorWeel colorMode=xy -> rgb_to_cie Wert: ' + rgb_to_cie(rgb.red, rgb.green, rgb.blue), 'info');
                            }
                        }
                        else {
                            //For RGB
                            setIfExists(id + ".RGB", ConvertRGBtoHex(rgb.red, rgb.green, rgb.blue));
                        }
                        break;
                }
                break;
            case 'tempUpd':
                setIfExists(id + '.SET', parseInt(words[4]) / 10);
                break;
            case 'tempUpdHighLow':
                let temps = words[4].split('|');
                if (getState(id + '.ACTUAL2').val * 10 != parseInt(temps[1])) { // avoid writing if not needed
                    setIfExists(id + '.ACTUAL2', parseInt(temps[1]) / 10);
                }
                if (getState(id + '.SET').val * 10 != parseInt(temps[0])) {
                    setIfExists(id + '.SET', parseInt(temps[0]) / 10);
                }
                break;
            case 'media-back': {
                const tempPage = findPageItem(id);
                if (isPageMediaItem(tempPage)) {
                    if (tempPage.adapterPlayerInstance.startsWith('bosesoundtouch')) {
                        setIfExists(tempPage.adapterPlayerInstance + 'key', 'PREV_TRACK');
                    } else {
                        setIfExists(id + '.PREV', true);    
                    }
                    GeneratePage(activePage!);
                }
                break;
            }
            case 'media-pause':
                let pageItemTemp = findPageItem(id);
                if (isPageMediaItem(pageItemTemp)) {
                    let adaInstanceSplit = pageItemTemp.adapterPlayerInstance!.split('.');
                    if (adaInstanceSplit[0] == 'squeezeboxrpc') {
                        let adapterPlayerInstanceStateSeceltor: string = pageItemTemp.adapterPlayerInstance + 'Players.' + pageItemTemp.mediaDevice + '.state';
                        if (Debug) log('HandleButtonEvent media-pause Squeezebox-> adapterPlayerInstanceStateSeceltor: ' + adapterPlayerInstanceStateSeceltor, 'info');                    
                        let stateVal = getState(adapterPlayerInstanceStateSeceltor).val;
                        if (stateVal == 0) {
                            setState(adapterPlayerInstanceStateSeceltor, 1);
                        } else if (stateVal == 1) {
                            setState(adapterPlayerInstanceStateSeceltor, 0);
                        } else if (stateVal == null) {
                            setState(adapterPlayerInstanceStateSeceltor, 1);
                        }
                    } else if (pageItemTemp.adapterPlayerInstance.startsWith('bosesoundtouch')) {
                        setIfExists(pageItemTemp.adapterPlayerInstance + 'key', 'PLAY_PAUSE');
                    } else {
                        if (Debug) log('HandleButtonEvent media-pause -> .STATE Value: ' + getState(id + '.STATE').val, 'info');
                        if (getState(id + '.STATE').val === true) {
                            setIfExists(id + '.PAUSE', true);
                        } else {
                            setIfExists(id + '.PLAY', true);
                        }
                    }
                    GeneratePage(activePage!);
                }
                break;
            case 'media-next': {
                const tempPage = findPageItem(id);
                if (isPageMediaItem(tempPage)) {
                    if (tempPage.adapterPlayerInstance.startsWith('bosesoundtouch')) {
                        setIfExists(tempPage.adapterPlayerInstance + 'key', 'NEXT_TRACK');
                    } else {
                        setIfExists(id + '.NEXT', true);    
                    }
                    GeneratePage(activePage!);
                }
                break;
            }
            case 'media-shuffle': {
                const tempPage = findPageItem(id);
                if (isPageMediaItem(tempPage)) {
                    if (tempPage.adapterPlayerInstance.startsWith("volumio")) {
                        const item = findPageItem(id)
                        if (isPageMediaItem(item)) item.playList = []; 
                        break;
                    } //Volumio: empty playlist $uha-20230103
                    if ((tempPage.adapterPlayerInstance).startsWith("spotify")) {
                        if (getState(id + '.SHUFFLE').val == 'off') {
                            setIfExists(id + '.SHUFFLE', 'on');
                        } else {
                            setIfExists(id + '.SHUFFLE', 'off');
                        }
                    }
                    if ((tempPage.adapterPlayerInstance).startsWith("alexa")) {
                        if (getState(id + '.SHUFFLE').val == false) {
                            setIfExists(id + '.SHUFFLE', true);
                        } else {
                            setIfExists(id + '.SHUFFLE', false);
                        }
                    }
                    if ((tempPage.adapterPlayerInstance).startsWith("sonos")) {
                        if (getState(id + '.SHUFFLE').val == false) {
                            setIfExists(id + '.SHUFFLE', true);
                        } else {
                            setIfExists(id + '.SHUFFLE', false);
                        }
                    }
                    if ((tempPage.adapterPlayerInstance).startsWith("squeezeboxrpc")) {
                        if (getState(tempPage.adapterPlayerInstance + 'Players.' + tempPage.mediaDevice + '.PlaylistShuffle').val == 1) {
                            setIfExists(tempPage.adapterPlayerInstance + 'Players.' + tempPage.mediaDevice + '.PlaylistShuffle', 0);
                        } else {
                            setIfExists(tempPage.adapterPlayerInstance + 'Players.' + tempPage.mediaDevice + '.PlaylistShuffle', 1);
                        }
                    }
                    if ((tempPage.adapterPlayerInstance).startsWith("bosesoundtouch")) {
                        if (Debug) log(tempPage.adapterPlayerInstance + 'nowPlaying.shuffle');
                        if (getState(tempPage.adapterPlayerInstance + 'nowPlaying.shuffle').val == 'false') {
                            setIfExists(tempPage.adapterPlayerInstance + 'key', 'SHUFFLE_ON');
                        } else {
                            setIfExists(tempPage.adapterPlayerInstance + 'key', 'SHUFFLE_OFF');
                        }
                    }
                    GeneratePage(activePage!);
                }
                break;
            }
            case 'volumeSlider':
                subscribeMediaSubscriptions(id);
                useMediaEvents = true;
                pageCounter = 1; 
                let vVolume = scale(parseInt(words[4]), 100, 0, activePage!.items[0]!.minValue ?? 0, activePage!.items[0]!.maxValue ?? 100);
                setIfExists(id + '.VOLUME', Math.floor(vVolume));      
                break;
            case 'mode-speakerlist':
                let pageItem = findPageItem(id);
                if (isPageMediaItem(pageItem)) {
                    let adapterInstance = pageItem.adapterPlayerInstance!;
                    let adapter = adapterInstance!.split('.');
                    const deviceAdapter: NSPanel.PlayerType = adapter[0] as NSPanel.PlayerType;

                    switch (deviceAdapter) {
                        case 'spotify-premium':
                            let strDevicePI = pageItem.speakerList![words[4]];
                            let strDeviceID = spotifyGetDeviceID(strDevicePI);
                            setState(adapterInstance + 'devices.' + strDeviceID + ".useForPlayback", true);
                            break;
                        case 'alexa2':
                            let i_list = Array.prototype.slice.apply($('[state.id="' + adapterInstance + 'Echo-Devices.*.Info.name"]'));
                            for (let i_index in i_list) {
                                let i = i_list[i_index];
                                if ((getState(i).val) === pageItem.speakerList![words[4]]) {
                                    if (Debug) log('HandleButtonEvent mode-Speakerlist Alexa2: ' + getState(i).val + ' - ' + pageItem.speakerList![words[4]], 'info');
                                    let deviceId = i;
                                    deviceId = deviceId.split('.');
                                    setIfExists(adapterInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Commands.textCommand', 'Schiebe meine Musik auf ' + pageItem.speakerList![words[4]]);
                                    pageItem.mediaDevice = deviceId[3];
                                }
                            }
                            break;
                        case 'sonos':
                            break;
                        /*case 'chromecast':
                            break;*/
                        case 'squeezeboxrpc':
                            pageItem.mediaDevice = pageItem.speakerList![words[4]];
                            break;
                        case "volumio":
                            break;
                        case "bosesoundtouch":
                            break;
                    }
                    pageCounter = 0;
                    GeneratePage(activePage!);
                    setTimeout(async function () {
                        pageCounter = 1;
                        GeneratePage(activePage!);
                    }, 3000);
                }
                break;
            case 'mode-playlist':
                let pageItemPL = findPageItem(id);
                if (!isPageMediaItem(pageItemPL)) break;
                let adapterInstancePL = pageItemPL.adapterPlayerInstance!;
                let adapterPL = adapterInstancePL.split('.');
                const deviceAdapterPL: NSPanel.PlayerType = adapterPL[0] as NSPanel.PlayerType;

                switch (deviceAdapterPL) {
                    case 'spotify-premium':
                        let strDevicePI = pageItemPL.playList![words[4]];
                        if (Debug) log('HandleButtonEvent mode-playlist Spotify -> strDevicePI:  ' + strDevicePI, 'info');
                        let playlistListString = (getState(adapterInstancePL + 'playlists.playlistListString').val).split(';');
                        let playlistListIds = (getState(adapterInstancePL + 'playlists.playlistListIds').val).split(';');
                        let playlistIndex = playlistListString.indexOf(strDevicePI);
                        setState(adapterInstancePL + 'playlists.playlistList', playlistListIds[playlistIndex]);
                        setTimeout(async function () {
                            globalTracklist = (function () { try {return JSON.parse(getState(adapterInstancePL + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                        }, 2000);
                        break;
                    case 'alexa2':
                        let tempListItem = pageItemPL.playList![words[4]].split('.');
                        setState(adapterInstancePL + 'Echo-Devices.' + pageItemPL.mediaDevice + '.Music-Provider.' + tempListItem[0], tempListItem[1]);
                        break;
                    case 'sonos':
                        let strDevicePLSonos = pageItemPL.playList![words[4]].split('.');
                        if (Debug) log(adapterInstancePL + 'root.' + pageItemPL.mediaDevice + '.playlist_set', 'info')
                        setState(adapterInstancePL + 'root.' + pageItemPL.mediaDevice + '.playlist_set', strDevicePLSonos[0]);
                        break;                    
                    case 'volumio':
                        let strDevicePL = pageItemPL.playList![words[4]];
                        let urlString: string = `${getState(adapterInstancePL+'info.host').val}/api/commands/?cmd=playplaylist&name=${strDevicePL}`;
                        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                            .then(async function (response) {
                                if (response.status === 200) {
                                    if (Debug) {
                                        log(JSON.stringify(response.data), 'info');
                                    }
                                } else {
                                    log('Axios Status - mode-playlist: ' + response.state, 'warn');
                                }
                            })
                            .catch(function (error) {
                                log(error, 'warn');
                            });
                        break;
                    case 'squeezeboxrpc':
                        setState([adapterInstancePL, 'Players.', pageItemPL.mediaDevice, '.cmdPlayFavorite'].join(''), words[4]);
                        break;
                    case "bosesoundtouch":
                        if (Debug) log('bosesoundtouch - playlist ' + pageItemPL.adapterPlayerInstance + ' - ' + words[4]);
                        if (Debug) log(adapterInstancePL +  'key');
                        if (words[4] < 6) {
                            setState(adapterInstancePL +  'key', 'PRESET_' + (parseInt(words[4]) + 1));
                        } else if (words[4] == 6) {
                            setState(adapterInstancePL +  'key', 'AUX_INPUT');
                        }
                        break;
                    default:
                        log('Hello Mr. Developer u miss in mode-playlist something!', 'warn');
                }
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-tracklist':
                let pageItemTL = findPageItem(id);
                if (!isPageMediaItem(pageItemTL)) break;
                let adapterInstanceTL = pageItemTL.adapterPlayerInstance!;
                let adapterTL = adapterInstanceTL.split('.');
                const deviceAdapterTL: NSPanel.PlayerType = adapterTL[0] as NSPanel.PlayerType;

                switch (deviceAdapterTL) {
                    case 'spotify-premium':
                        //let trackArray = (function () { try {return JSON.parse(getState(pageItemTL.adapterPlayerInstance + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                        //setState(adapterInstanceTL + 'player.trackId', getAttr(trackArray, words[4] + '.id'));
                        setState(adapterInstanceTL + 'player.playlist.trackNo', parseInt(words[4]) + 1);
                        break;
                    case 'sonos':
                        setState(adapterInstanceTL + 'root.' + pageItemTL.mediaDevice + '.current_track_number', parseInt(words[4]) + 1);
                    case 'alexa2':
                        if (Debug) log('Aktuell hat alexa2 keine Tracklist', 'info');
                        break;
                    case 'volumio':
                        let urlString: string = `${getState(adapterInstanceTL+'info.host').val}/api/commands/?cmd=play&N=${words[4]}`;
                        axios.get(urlString, { headers: { 'User-Agent': 'ioBroker' } })
                            .then(async function (response) {
                                if (response.status === 200) {
                                    if (Debug) {
                                        log(JSON.stringify(response.data), 'info');
                                    }
                                } else {
                                    log('Axios Status - mode-tracklist: ' + response.state, 'warn');
                                }
                            })
                            .catch(function (error: any) {
                                log(error, 'warn');
                            });
                        break;
                    case 'squeezeboxrpc':
                        //@ts-ignore Fehler kommt von findPageItem in vscode
                        setState([adapterInstanceTL, 'Players.', pageItemTL.mediaDevice, '.PlaylistCurrentIndex'].join(''), words[4]);
                        break;
                    case "bosesoundtouch":
                        break;
                    default:
                        log('Hello Mr. Developer u miss in mode-tracklist something!', 'warn');
                }
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-repeat':
                let pageItemRP = findPageItem(id);
                if (!isPageMediaItem(pageItemRP)) break;
                let adapterInstanceRP = pageItemRP.adapterPlayerInstance!;
                let adapterRP = adapterInstanceRP.split('.');
                let deviceAdapterRP: NSPanel.PlayerType = adapterRP[0] as NSPanel.PlayerType;

                if (Debug) log(pageItemRP.repeatList![words[4]], 'warn');
                switch (deviceAdapterRP) {
                    case 'spotify-premium':
                        setIfExists(id + '.REPEAT', pageItemRP.repeatList![words[4]]);
                        GeneratePage(activePage!);
                        break;
                    case 'alexa2':
                        GeneratePage(activePage!);
                        break;
                }
                break;
            case 'mode-equalizer':
                let pageItemEQ = findPageItem(id);
                if (!isPageMediaItem(pageItemEQ)) break;
                if (Debug) log('HandleButtonEvent mode-equalizer -> id: ' + id, 'info');
                let lastIndex = (id.split('.')).pop();
                setState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode', pageItemEQ.equalizerList![words[4]]);
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-seek':
                let pageItemSeek = findPageItem(id);
                if (!isPageMediaItem(pageItemSeek)) break;
                let adapterInstanceSK = pageItemSeek.adapterPlayerInstance!;
                let adapterSK = adapterInstanceSK.split('.');
                let deviceAdapterSK: NSPanel.PlayerType = adapterSK[0] as NSPanel.PlayerType;
                switch (deviceAdapterSK) {
                    case 'spotify-premium':
                        setState(adapterInstanceSK + 'player.progressPercentage', parseInt(words[4]) * 10);
                        break;
                    case 'squeezeboxrpc':
                        const vDuration: number = getState(adapterInstanceSK + 'Players.' + pageItemSeek.mediaDevice + '.Duration').val;
                        const vSeekPercentage : number =  words[4] * 10;
                        const setSeekSeconds: number = vSeekPercentage * vDuration / 100;
                        if (Debug) log(adapterInstanceSK + 'Players.' + pageItemSeek.mediaDevice + '.cmdGoTime' + ': ' + setSeekSeconds + ' sec.');
                        setState(adapterInstanceSK + 'Players.' + pageItemSeek.mediaDevice + '.cmdGoTime', String(setSeekSeconds.toFixed(0)));
                        break;
                    case 'sonos':
                        if (Debug) log('HandleButtonEvent mode-seek -> id: ' + id, 'info');
                        setState(adapterInstanceSK + 'root.' + pageItemSeek.mediaDevice + '.seek', parseInt(words[4]) * 10);
                        break;
                }
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-crossfade':
                let pageItemCrossfade = findPageItem(id);
                if (!isPageMediaItem(pageItemCrossfade)) break;
                let adapterInstanceCF = pageItemCrossfade.adapterPlayerInstance!;
                let adapterCF = adapterInstanceCF.split('.');
                let deviceAdapterCF: NSPanel.PlayerType = adapterCF[0] as NSPanel.PlayerType;
                switch (deviceAdapterCF) {
                    case 'spotify-premium':
                        break;
                    case 'sonos':
                        if (Debug) log('HandleButtonEvent mode-crossfade -> id: ' + id, 'info');
                        let cfState: boolean = false;
                        if (parseInt(words[4]) == 0 ) { 
                            cfState = true; 
                        } 
                        setState(adapterInstanceCF + 'root.' + pageItemCrossfade.mediaDevice + '.crossfade', cfState);
                        break;
                }
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-favorites':
                let pageItemFav = findPageItem(id);
                if (!isPageMediaItem(pageItemFav)) break;
                if (Debug) log(getState(pageItemFav.adapterPlayerInstance + 'root.' + pageItemFav.mediaDevice + '.favorites_set').val, 'info');
                let favListArray = getState(pageItemFav.adapterPlayerInstance + 'root.' + pageItemFav.mediaDevice + '.favorites_list_array').val;
                setState(pageItemFav.adapterPlayerInstance + 'root.' + pageItemFav.mediaDevice + '.favorites_set', favListArray[words[4]]);
                pageCounter = 0;
                GeneratePage(activePage!);
                setTimeout(async function () {
                    pageCounter = 1;
                    GeneratePage(activePage!);
                }, 3000);
                break;
            case 'mode-insel':
                setIfExists(id + '.VALUE', parseInt(words[4]));
                break;
            case 'media-OnOff': {
                let pageItemTemp = findPageItem(id);
                if (!isPageMediaItem(pageItemTemp)) break;
                let adapterInstance = pageItemTemp.adapterPlayerInstance.split('.');
                if (adapterInstance[0] == 'squeezeboxrpc') {
                    let adapterPlayerInstancePowerSelector: string = [pageItemTemp.adapterPlayerInstance, 'Players.', pageItemTemp.mediaDevice, '.Power'].join('');
                    let stateVal = getState(adapterPlayerInstancePowerSelector).val;
                    if (stateVal === 0) {
                        setState(adapterPlayerInstancePowerSelector, 1);
                        setIfExists(id + '.STOP', false);
                        setIfExists(id + '.STATE', 1);
                    } else {
                        setState(adapterPlayerInstancePowerSelector, 0);
                        setIfExists(id + '.STOP', true);
                        setIfExists(id + '.STATE', 0);
                    }
                } else if (adapterInstance[0] == 'bosesoundtouch') {
                    setState(pageItemTemp.adapterPlayerInstance +  'key', 'POWER');
                } else {
                    setIfExists(id + '.STOP', true);
                }
                GeneratePage(activePage!);
                break;
            }
            case 'timer-start':
                if (words[4] != undefined) {
                    let timer_panel = words[4].split(':');
                    setIfExists(id + '.ACTUAL', (parseInt(timer_panel[1]) * 60) + parseInt(timer_panel[2]));
                }
                setIfExists(id + '.STATE', 'active');
                break;
            case 'timer-pause':
                setIfExists(id + '.STATE', 'paused');
                break;
            case 'timer-cancle':
                setIfExists(id + '.STATE', 'idle');
                setIfExists(id + '.ACTUAL', 0);
                break;
            case 'timer-finish':
                setIfExists(id + '.STATE', 'idle');
                setIfExists(id + '.ACTUAL', 0);
                break;
            case 'hvac_action':
                if (words[4] == 'BOOT' || words[4] == 'PART' || words[4] == 'AUTT' || words[4] == 'MANT' || words[4] == 'VACT') {

                    switch (words[4]) {
                        case 'BOOT':
                            setIfExists(words[2] + '.' + 'BOOST', !getState(words[2] + '.' + 'BOOST').val);
                            break;
                        case 'PART':
                            setIfExists(words[2] + '.' + 'PARTY', !getState(words[2] + '.' + 'PARTY').val);
                            break;
                        case 'AUTT':
                            setIfExists(words[2] + '.' + 'AUTOMATIC', !getState(words[2] + '.' + 'AUTOMATIC').val);
                            break;
                        case 'MANT':
                            setIfExists(words[2] + '.' + 'MANUAL', !getState(words[2] + '.' + 'MANUAL').val);
                            break;
                        case 'VACT':
                            setIfExists(words[2] + '.' + 'VACATION', !getState(words[2] + '.' + 'VACATION').val);
                            break;
                    }
                    let modes = ['BOOT', 'PART', 'AUTT', 'MANT', 'VACT'];
                    let modesDP = ['BOOST', 'PARTY', 'AUTOMATIC', 'MANUAL', 'VACATION'];
                    for (let mode=0; mode < 5; mode++) {
                        if (words[4] != modes[mode]) {
                            setIfExists(words[2] + '.' + modesDP[mode], false);
                        }
                    }
                    GeneratePage(activePage!);
                } else {
                    let HVACMode = getState(words[2] + '.MODE').val;

                    // Event is bound to its own object
                    if(existsObject(words[2] + '.' + words[4])) {
                        switch(words[4]) {
                            case 'SWING':
                                if (getState(words[2] + '.SWING').val == 0) {
                                    setIfExists(words[2] + '.SWING', 1);
                                } else {
                                    setIfExists(words[2] + '.' + 'SWING', 0);
                                }
                                break;
                            default: // Power and Eco can easily be toggled
                                setIfExists(words[2] + '.' + words[4], !getState(words[2] + '.' + words[4]).val);
                                break;
                        }
                    }

                    // Event is a mode of the list (mode change)
                    let HVACModeList = getObject(words[2] + '.MODE').common.states;
                    for(const statekey in HVACModeList) {
                        if(HVACModeList[statekey] == words[4]) {
                            HVACMode = parseInt(statekey);
                            break;
                        }
                    }
                    
                    setIfExists(words[2] + '.' + 'MODE', HVACMode);
                    GeneratePage(activePage!);
                }
                break;
            case 'mode-modus1':
                let pageItemT1 = findPageItem(id);
                if (isPageThermoItem(pageItemT1)) setIfExists(id + '.' + pageItemT1.setThermoAlias![0], pageItemT1.popupThermoMode1![parseInt(words[4])]);
                break;
            case 'mode-modus2':
                let pageItemT2 = findPageItem(id);
                if (isPageThermoItem(pageItemT2)) setIfExists(id + '.' + pageItemT2.setThermoAlias![1], pageItemT2.popupThermoMode2![parseInt(words[4])]);
                break;
            case 'mode-modus3':
                let pageItemT3 = findPageItem(id);
                if (isPageThermoItem(pageItemT3)) setIfExists(id + '.' + pageItemT3.setThermoAlias![2], pageItemT3.popupThermoMode3![parseInt(words[4])]);
                break;
            case 'number-set':
                let nobj = getObject(id);
                switch (nobj.common.role as NSPanel.roles) {
                    case 'level.mode.fan':
                        (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                        timeoutSlider = setTimeout(async function () {
                            setIfExists(id + '.SPEED', parseInt(words[4]));
                        }, 250);
                        break;
                    default:    
                        (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                        timeoutSlider = setTimeout(async function () {
                            setIfExists(id + '.SET', parseInt(words[4])) ? true : setIfExists(id + '.ACTUAL', parseInt(words[4]));
                        }, 250);
                        break;
                }
                break;
            case 'mode-preset_modes':
                setIfExists(id + '.MODE', parseInt(words[4]));
                break; 
            case 'A1': // Alarm page - activate alarm 1
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A1');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage!);
                },250);
                break;
            case 'A2': // Alarm page - activate alarm 2
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A2');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage!);
                },250);
                break;
            case 'A3': // Alarm page - activate alarm 3
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A3');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage!);
                },250);
                break;
            case 'A4': // Alarm page - activate alarm 4
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A4');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage!);
                },250);
                break;
            case 'D1': // Alarm page - deactivate alarm 4
                if (Debug) {
                    log('HandleButtonEvent Alarmpage D1 -> PIN: ' + getState(id + '.PIN').val, 'info');
                }
                if (Debug) {
                    log('HandleButtonEvent Alarmpage D1 -> words[4]: ' + words[4], 'info');
                }
                if (words[4] != '') {
                    if (getState(id + '.PIN').val == words[4]) {
                        setIfExists(id + '.PIN', '0000');
                        setIfExists(id + '.TYPE', 'D1');
                        setIfExists(id + '.ACTUAL', 'pending');
                        setIfExists(id + '.PIN_Failed', 0);
                    } else {
                        setIfExists(id + '.PIN_Failed', getState(id + '.PIN_Failed').val + 1);
                        setIfExists(id + '.ACTUAL', 'triggered');
                    }
                    setIfExists(id + '.PANEL', NSPanel_Path);
                    setTimeout(function(){
                        GeneratePage(activePage!);
                    },500);
                }
                break;
            case 'U1': // Unlock-Page
                let pageItemUnlock = findPageItem(id);
                if (words[4] == getState(id + '.PIN').val) {
                    UnsubscribeWatcher();
                    GeneratePage(eval(pageItemUnlock.targetPage!));
                    setIfExists(id + '.ACTUAL', true)
                } else {
                    setIfExists(id + '.ACTUAL', false)
                }
                break;
            default:
                break;
        }
    } catch (err: any) {
        log('error at function HandleButtonEvent: ' + err.message, 'warn');
    }
}

function setOrCreate(id : string, value : any, forceCreation: boolean = true, common: Partial<iobJS.StateCommon> = { }, callback?: iobJS.SetStateCallback) {
    if (!existsState(id)) {
        extendObject(id.split('.').slice(0, -2).join('.'), {type: 'channel', common:{name: 'channel'}, native:{}});
        extendObject(id.split('.').slice(0, -1).join('.'), {type: 'channel', common:{name: 'channel'}, native:{}});
        createState(id, value, forceCreation, common, callback);
    } else {
        setState(id, value, true);
    }
}
				   
//Determination of page navigation (CustomSend-Payload)
function GetNavigationString(pageId: number): string {
    try {

        if (Debug) {
            log('GetNavigationString Übergabe pageId: ' + pageId, 'info');
        }

        var navigationString:string = "";

        if (activePage!.subPage){
            //Left icon
            if (activePage!.prev == undefined){
                if (activePage!.parentIcon != undefined){                    
                    navigationString = 'button~bUp~' + Icons.GetIcon(activePage!.parentIcon);     
                    if (activePage!.parentIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage!.parentIconColor);        
                    } else {
                        navigationString += '~' + rgb_dec565(White);
                    }                
                } else {
                    navigationString = 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White);
                }
            } else {
                if (activePage!.prevIcon != undefined){       
                    navigationString = 'button~bSubPrev~' + Icons.GetIcon(activePage!.prevIcon);        
                    if (activePage!.prevIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage!.prevIconColor);        
                    } else {
                        navigationString += '~' + rgb_dec565(White);
                    }                     
                } else {
                    navigationString = 'button~bSubPrev~' + Icons.GetIcon('arrow-left-bold') + '~' + rgb_dec565(White);
                }                
            }

            //Right icon
            if (activePage!.next == undefined){
                if (activePage!.homeIcon != undefined){                    
                    navigationString += '~~~button~bHome~' + Icons.GetIcon(activePage!.homeIcon);      
                    if (activePage!.homeIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage!.homeIconColor) + '~~';;        
                    } else {
                        navigationString += '~' + rgb_dec565(White) + '~~';
                    }              
                } else {
                    navigationString += '~~~button~bHome~' + Icons.GetIcon('home') + '~' + rgb_dec565(White) + '~~';   
                }
            } else {
                if (activePage!.nextIcon != undefined){                    
                    navigationString += '~~~button~bSubNext~' + Icons.GetIcon(activePage!.nextIcon);    
                    if (activePage!.nextIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage!.nextIconColor) + '~~';        
                    } else {
                        navigationString += '~' + rgb_dec565(White) + '~~';
                    }                   
                } else {
                    navigationString += '~~~button~bSubNext~' + Icons.GetIcon('arrow-right-bold') + '~' + rgb_dec565(White) + '~~';  
                }                
            }
        }       

        if (activePage!.subPage && (navigationString != "")){
            return navigationString
        }

        switch (pageId) {
            case -1:
                return 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White) + ' ~~~delete~~~~~';
            case -2:
                return 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White) + '~~~delete~~~~~';
            default:
            {
                if (activePage!.prevIcon != undefined){                    
                    navigationString = 'button~bPrev~' + Icons.GetIcon(activePage!.prevIcon);        
                } else {
                    navigationString = 'button~bPrev~' + Icons.GetIcon('arrow-left-bold');
                }  

                if (activePage!.prevIconColor != undefined){                    
                    navigationString += '~' + rgb_dec565(activePage!.prevIconColor);        
                } else {
                    navigationString += '~' + rgb_dec565(White);
                }                    

                if (activePage!.nextIcon != undefined){                    
                    navigationString += '~~~button~bNext~' + Icons.GetIcon(activePage!.nextIcon);                
                } else {
                    navigationString += '~~~button~bNext~' + Icons.GetIcon('arrow-right-bold');
                }  
                if (activePage!.nextIconColor != undefined){                    
                    navigationString += '~' + rgb_dec565(activePage!.nextIconColor) + '~~';        
                } else {
                    navigationString += '~' + rgb_dec565(White) + '~~';
                }
                return navigationString;
            }
        }

    } catch (err: any) {
        log('error at function GetNavigationString: ' + err.message, 'warn');
    }
    return '';
}

function GenerateDetailPage(type: NSPanel.PopupType, optional: NSPanel.mediaOptional | undefined, pageItem: PageItem, placeId: number | undefined): NSPanel.Payload[] {
    if (Debug) log('GenerateDetailPage Übergabe Type: ' + type + ' - optional: ' + optional + ' - pageItem.id: ' + pageItem.id, 'info');
    try {
        let out_msgs: NSPanel.Payload[] = [];
        let id = pageItem.id;

        if (id && existsObject(id)) {

            const o = getObject(id);
            let val: (boolean | number) = 0;
            let icon = Icons.GetIcon('lightbulb');
            let iconColor = rgb_dec565(config.defaultColor);
            const role = o.common.role as NSPanel.roles;

            if (type == 'popupLight') {

                let switchVal = '0';
                let brightness = 0;
                switch (role) {
                case 'light': 
                case 'socket': {
                    if (existsState(id + '.GET')) {
                        val = getState(id + '.GET').val;
                        RegisterDetailEntityWatcher(id + '.GET', pageItem, type, placeId);
                    } else if (existsState(id + '.SET')) {
	                    if(pageItem.monobutton != undefined && pageItem.monobutton == true){	
                            val = getState(id + ".STATE").val;	
						    RegisterDetailEntityWatcher(id + ".STATE", pageItem, type, placeId);	
                        }	
                        else {	
                            val = getState(id + '.SET').val;	
                            RegisterDetailEntityWatcher(id + '.SET', pageItem, type, placeId);	
                        }
                    }

                    icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');

                    if (val) {
                        switchVal = '1';
                        iconColor = GetIconColor(pageItem, true, true);
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }
                    
                    let tempId = placeId != undefined ? placeId : id;

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'              // entityUpdateDetail
                            + tempId  + '~'
                            + icon + '~'                                 // iconId
                            + iconColor + '~'                            // iconColor
                            + switchVal + '~'                            // buttonState
                            + 'disable' + '~'                            // sliderBrightnessPos
                            + 'disable' + '~'                            // sliderColorTempPos
                            + 'disable' + '~'                            // colorMode
                            + ''        + '~'                            // Color identifier
                            + findLocale('lights', 'Temperature') + '~'  // Temperature identifier
                            + findLocale('lights', 'Brightness') + '~'   // Brightness identifier
                            + effect_supported
                    });
                }
                break;
                // Dimmer
                case 'dimmer': {
                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type, placeId);
                    } else if (existsState(id + '.ON_SET')) {
                        val = getState(id + '.ON_SET').val;
                        RegisterDetailEntityWatcher(id + '.ON_SET', pageItem, type, placeId);
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, val, false);
                        switchVal = '1'
                    }

                    if (existsState(id + '.ACTUAL')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.ACTUAL').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.ACTUAL').val;
                        }
                    } else {
                        log('function GenerateDetailPage  role:dimmer -> Alias-Datenpoint: ' + id + '.ACTUAL could not be read', 'warn');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type, placeId);

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }

                    let tempId = placeId != undefined ? placeId : id;
                    
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + 'disable' + '~'                           //sliderColorTempPos
                            + 'disable' + '~'                           //colorMod
                            + ''        + '~'                           //Color-identifier
                            + findLocale('lights', 'Temperature') + '~' //Temperature-identifier
                            + findLocale('lights', 'Brightness') + '~'  //Brightness-identifier
                            + effect_supported
                    });
                }
                break;
                // HUE-Licht
                case 'hue': {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type, placeId);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type, placeId);
                    } else {
                        log('function GenerateDetailPage role:hue -> Alias-Datenpunkt: ' + id + '.DIMMER could not be read', 'warn');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';
                    if (existsState(id + '.HUE')) {
                        if (getState(id + '.HUE').val != null) {
                            colorMode = 'enable';
                            let huecolor = hsv2rgb(getState(id + '.HUE').val, 1, 1);
                            let rgb: RGB = { red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2]) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    }
                    let colorTemp: any;
                    if (existsState(id + '.TEMPERATURE')) {
                        colorTemp = 0;
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 100, 0));
                            } else {
                                colorTemp = getState(id + '.TEMPERATURE').val;
                            }
                        }
                    } else {
                        colorTemp = 'disable';
                    }

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }

                    let tempId = placeId != undefined ? placeId : id;

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color'   + '~'                           //Color-identifier
                            + findLocale('lights', 'Temperature') + '~' //Temperature-identifier
                            + findLocale('lights', 'Brightness') + '~'  //Brightness-identifier
                            + effect_supported
                    });
                }
                break;
                // RGB-Licht
                case 'rgb': {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type, placeId);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type, placeId);
                    } else {
                        log('function GenerateDetailPage role:rgb -> Alias-Datenpunkt: ' + id + '.DIMMER could not be read', 'warn');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';
                    if (existsState(id + '.RED') && existsState(id + '.GREEN') && existsState(id + '.BLUE')) {
                        if (getState(id + '.RED').val != null && getState(id + '.GREEN').val != null && getState(id + '.BLUE').val != null) {
                            colorMode = 'enable';
                            let rgb: RGB = { red: Math.round(getState(id + '.RED').val), green: Math.round(getState(id + '.GREEN').val), blue: Math.round(getState(id + '.BLUE').val) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    }
                    let colorTemp: any;
                    if (existsState(id + '.TEMPERATURE')) {
                        colorTemp = 0;
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp!, 100, 0));
                            } else {
                                colorTemp = getState(id + '.TEMPERATURE').val;
                            }
                        }
                    } else {
                        colorTemp = 'disable';                        
                    }

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }

                    let tempId = placeId != undefined ? placeId : id;
                    
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-identifier
                            + findLocale('lights', 'Temperature') + '~' //Temperature-identifier
                            + findLocale('lights', 'Brightness') + '~'  //Brightness-identifier
                            + effect_supported
                    });
                }
                break;
                // RGB-Licht-einzeln (HEX)
                case 'rgbSingle': {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type, placeId);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type, placeId);
                    } else {
                        log('function GenerateDetailPage role:rgbSingle -> Alias-Datenpunkt: ' + id + '.DIMMER could not be read', 'warn');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';
                    if (existsState(id + '.RGB')) {
                        if (getState(id + '.RGB').val != null) {
                            colorMode = 'enable';
                            let hex = getState(id + '.RGB').val;
                            let hexRed = parseInt(hex[1] + hex[2], 16);
                            let hexGreen = parseInt(hex[3] + hex[4], 16);
                            let hexBlue = parseInt(hex[5] + hex[6], 16);
                            let rgb: RGB = { red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    }

                    let colorTemp:any;
                    if (existsState(id + '.TEMPERATURE')) {
                        colorTemp = 0;
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 100, 0));
                            } else {
                                colorTemp = getState(id + '.TEMPERATURE').val;
                            }
                        }
                    } else {
                        colorTemp = 'disable';
                    }

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }

                    let tempId = placeId != undefined ? placeId : id;
                    
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-identifier
                            + findLocale('lights', 'Temperature') + '~' //Temperature-identifier
                            + findLocale('lights', 'Brightness') + '~'  //Brightness-identifier
                            + effect_supported
                    });
                }
                break;
                // Farbtemperatur (CT)
                case 'ct': {

                    if (existsState(id + '.ON')) {
                        val = getState(id + '.ON').val;
                        RegisterDetailEntityWatcher(id + '.ON', pageItem, type, placeId);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type, placeId);
                    } else {
                        log('function GenerateDetailPage role:ct -> Alias-Datenpunkt: ' + id + '.DIMMER could not be read', 'warn');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';

                    let colorTemp = 0;
                    if (existsState(id + '.TEMPERATURE')) {
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 100, 0));
                            } else {
                                colorTemp = getState(id + '.TEMPERATURE').val;
                            }
                        }
                    } else {
                        log('function GenerateDetailPage role:ct -> Alias-Datenpunkt: ' + id + '.TEMPERATURE could not be read', 'warn');
                    }

                    let effect_supported = 'disable';
                    if (pageItem.modeList != undefined) {
                        effect_supported = 'enable';
                    }

                    let tempId = placeId != undefined ? placeId : id;
                    
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-identifier
                            + findLocale('lights', 'Temperature') + '~' //Temperature-identifier
                            + findLocale('lights', 'Brightness') + '~'  //Brightness-identifier
                            + effect_supported
                    });
                }
                break;
                }
            }

            if (type == 'popupShutter') {

                icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                if (existsState(id + '.ACTUAL')) {
                    val = getState(id + '.ACTUAL').val;
                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type, placeId);
                } else if (existsState(id + '.SET')) {
                    val = getState(id + '.SET').val;
                    //RegisterDetailEntityWatcher(id + '.SET', pageItem, type);
                }
                let tilt_position: any = 'disabled'
                if (existsState(id + '.TILT_ACTUAL')) {
                    tilt_position = getState(id + '.TILT_ACTUAL').val;
                    RegisterDetailEntityWatcher(id + '.TILT_ACTUAL', pageItem, type, placeId);
                } else if (existsState(id + '.TILT_SET')) {
                    tilt_position = getState(id + '.TILT_SET').val;
                    //RegisterDetailEntityWatcher(id + '.TILT_SET', pageItem, type);
                }
                
                let min_Level: number = 0;
                let max_Level: number = 100;
                if (pageItem.minValueLevel !== undefined && pageItem.maxValueLevel !== undefined) {
                    min_Level = pageItem.minValueLevel;
                    max_Level = pageItem.maxValueLevel;
                    val = Math.trunc(scale(getState(id + '.ACTUAL').val, pageItem.minValueLevel, pageItem.maxValueLevel, 100, 0));
                }
                let min_Tilt: number = 0; 
                let max_Tilt: number = 100;  
                if (pageItem.minValueTilt !== undefined && pageItem.maxValueTilt !== undefined) {
                    min_Tilt = pageItem.minValueTilt;
                    max_Tilt = pageItem.maxValueTilt;
                    tilt_position = Math.trunc(scale(getState(id + '.TILT_ACTUAL').val, pageItem.minValueTilt, pageItem.maxValueTilt, 100, 0));
                }

                if (Debug) log('minLevel '+ min_Level + ' maxLevel ' + max_Level + ' Level ' + val, 'info');
                if (Debug) log('minTilt '+ min_Tilt + ' maxTilt ' + max_Tilt + ' TiltPosition ' + tilt_position, 'info');

                let textSecondRow = '';
                let icon_id = icon;
                let icon_up = Icons.GetIcon('arrow-up');
                let icon_stop = Icons.GetIcon('stop');
                let icon_down = Icons.GetIcon('arrow-down');
                let tempVal: number = getState(pageItem.id + '.ACTUAL').val 
                
                //Disabled Status while bug in updating origin adapter data points of lift values
                let icon_up_status = 'enable';
                //let icon_up_status = tempVal === min_Level ? 'disable' : 'enable';
                let icon_stop_status = 'enable';
                if (tempVal === min_Level || tempVal === max_Level || checkBlindActive === false) {
                    //icon_stop_status = 'disable';
                }
                let icon_down_status = 'enable';
                //let icon_down_status = tempVal === max_Level ? 'disable' : 'enable';

                let textTilt = '';
                let iconTiltLeft = '';
                let iconTiltStop = '';
                let iconTiltRight = '';
                let iconTiltLeftStatus = 'disable';
                let iconTiltStopStatus = 'disable';
                let iconTiltRightStatus = 'disable';
                let tilt_pos = 'disable';

                if (existsState(id + '.TILT_SET')) {
                    textTilt = findLocale('blinds', 'Tilt');
                    iconTiltLeft = Icons.GetIcon('arrow-top-right');
                    iconTiltStop = Icons.GetIcon('stop');
                    iconTiltRight = Icons.GetIcon('arrow-bottom-left');
                    iconTiltLeftStatus = getState(id + '.TILT_ACTUAL').val != max_Tilt ? 'enable' : 'disable';
                    iconTiltStopStatus = 'enable';
                    iconTiltRightStatus = getState(id + '.TILT_ACTUAL').val != min_Tilt ? 'enable' : 'disable';
                    tilt_pos = tilt_position;
                }

                if (pageItem.secondRow != undefined) {
                    textSecondRow = pageItem.secondRow;
                }

                let tempId = placeId != undefined ? placeId : id;
                
                out_msgs.push({
                    payload: 'entityUpdateDetail' + '~'           //entityUpdateDetail
                        + tempId + '~'                            //entity_id
                        + val + '~'                               //Shutterposition
                        + textSecondRow + '~'                     //pos_status 2.line
                        + findLocale('blinds', 'Position') + '~'  //pos_translation
                        + icon_id + '~'                           //{icon_id}~
                        + icon_up + '~'                           //{icon_up}~
                        + icon_stop + '~'                         //{icon_stop}~
                        + icon_down + '~'                         //{icon_down}~
                        + icon_up_status + '~'                    //{icon_up_status}~
                        + icon_stop_status + '~'                  //{icon_stop_status}~
                        + icon_down_status + '~'                  //{icon_down_status}~
                        + textTilt + '~'                          //{textTilt}~
                        + iconTiltLeft + '~'                      //{iconTiltLeft}~
                        + iconTiltStop + '~'                      //{iconTiltStop}~
                        + iconTiltRight + '~'                     //{iconTiltRight}~
                        + iconTiltLeftStatus + '~'                //{iconTiltLeftStatus}~
                        + iconTiltStopStatus + '~'                //{iconTiltStopStatus}~
                        + iconTiltRightStatus + '~'               //{iconTiltRightStatus}~
                        + tilt_pos                                //{tilt_pos}")
                });
            }

            if (type == 'popupThermo') {
                let vIcon = (pageItem.icon != undefined) ? pageItem.icon : 'fan';
                let mode1 = (isPageThermoItem(pageItem) && pageItem.popupThermoMode1 != undefined) ? pageItem.popupThermoMode1.join('?') : '';
                let mode2 = (isPageThermoItem(pageItem) && pageItem.popupThermoMode2 != undefined) ? pageItem.popupThermoMode2.join('?') : '';
                let mode3 = (isPageThermoItem(pageItem) && pageItem.popupThermoMode3 != undefined) ? pageItem.popupThermoMode3.join('?') : '';

                let payloadParameters1 = '~~~~'
                if (isPageThermoItem(pageItem) && pageItem.popupThermoMode1 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias![0], pageItem, type, placeId);
                    payloadParameters1 =    pageItem.popUpThermoName![0] + '~'                                          //{heading}~            Mode 1
                                            + 'modus1' + '~'                                                           //{id}~                 Mode 1
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias![0]).val + '~'       //{ACTUAL}~             Mode 1
                                            + mode1 + '~';                                                             //{possible values}     Mode 1 (1-n)
                }

                let payloadParameters2 = '~~~~'
                if (isPageThermoItem(pageItem) && pageItem.popupThermoMode2 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias![1], pageItem, type, placeId);
                    payloadParameters2 =    pageItem.popUpThermoName![1] + '~'                                           //{heading}~            Mode 2
                                            + 'modus2' + '~'                                                            //{id}~                 Mode 2
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias![1]).val + '~'        //{ACTUAL}~             Mode 2
                                            + mode2 + '~';                                                              //{possible values}
                }

                let payloadParameters3 = '~~~~'
                if (isPageThermoItem(pageItem) && pageItem.popupThermoMode3 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias![2], pageItem, type, placeId);
                    payloadParameters3 =    pageItem.popUpThermoName![2] + '~'                                           //{heading}~            Mode 3
                                            + 'modus3' + '~'                                                            //{id}~                 Mode 3
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias![2]).val + '~'        //{ACTUAL}~             Mode 3
                                            + mode3;                                                                    //{possible values}     Mode 3 (1-n)
                }

                out_msgs.push({
                    payload: 'entityUpdateDetail' + '~'                                                 //entityUpdateDetail
                        + id + '~'                                                                      //{entity_id}
                        + Icons.GetIcon(vIcon) + '~'                                                    //{icon_id}~
                        + 11487 + '~'                                                                   //{icon_color}~
                        + payloadParameters1
                        + payloadParameters2
                        + payloadParameters3
                });
            }

            if (type == 'popupTimer') {

                let timer_actual: number = 0;

                if (existsState(id + '.ACTUAL')) {
                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type, placeId);
                    timer_actual = getState(id + '.ACTUAL').val;
                }

                if (existsState(id + '.STATE')) {
                    RegisterDetailEntityWatcher(id + '.STATE', pageItem, type, placeId);
                }

                let editable = 1;
                let action1 = '';
                let action2 = '';
                let action3 = '';
                let label1 = '';
                let label2 = '';
                let label3 = '';
                let min_remaining = 0;
                let sec_remaining = 0;
                if (existsState(id + '.STATE')) {
                    if (role == 'value.time') {
                        if (getState(id + '.STATE').val == 'idle' || getState(id + '.STATE').val == 'paused') {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 1;
                        } else {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 1;
                        }
                    } else if (role == 'level.timer') {
                        if (getState(id + '.STATE').val == 'idle' || getState(id + '.STATE').val == 'paused') {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 1;
                            action2 = 'start';
                            label2 = findLocale('timer', 'start');
                        } else {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 0;
                            action1 = 'pause';
                            action2 = 'cancle';
                            action3 = 'finish';
                            label1 = findLocale('timer', 'pause');
                            label2 = findLocale('timer', 'cancel');
                            label3 = findLocale('timer', 'finish');
                        }
                    } else if (role == 'value.alarmtime') {
                        if (getState(id + '.STATE').val == 'paused') {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 1;
                            action2 = 'start';
                            label2 = findLocale('timer', 'on');
                        } else {
                            min_remaining = Math.floor(timer_actual / 60);
                            sec_remaining = timer_actual % 60;
                            editable = 0;
                            action2 = 'pause';
                            label2 = findLocale('timer', 'off');
                        }
                    }

                    let tempId = placeId != undefined ? placeId : id;

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'  //entityUpdateDetail
                            + tempId + '~~'                  //{entity_id}
                            + rgb_dec565(White) + '~'        //{icon_color}~
                            + tempId + '~'
                            + min_remaining + '~'
                            + sec_remaining + '~'
                            + editable + '~'
                            + action1 + '~'
                            + action2 + '~'
                            + action3 + '~'
                            + label1 + '~'
                            + label2 + '~'
                            + label3
                    });
                }
            }    

            if (type == 'popupFan') {

                let switchVal = '0';
                if (role == 'level.mode.fan') {
                    if (existsState(id + '.SET')) {
                        val = getState(id + '.SET').val;
                        RegisterDetailEntityWatcher(id + '.SET', pageItem, type, placeId);
                    }
                    if (existsState(id + '.MODE')) {
                        RegisterDetailEntityWatcher(id + '.MODE', pageItem, type, placeId);
                    }

                    icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : 'fan';

                    if (val) {
                        switchVal = '1';
                        iconColor = GetIconColor(pageItem, true, true);
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let actualSpeed = getState(id + '.SPEED').val;
                    let maxSpeed = (pageItem.maxValue != undefined) ? pageItem.maxValue : 100; 
                    
                    let modeList = pageItem.modeList!.join('?');
                    let actualMode = pageItem.modeList![getState(id + '.MODE').val];

                    let tempId = placeId != undefined ? placeId : id;
                    // {tempid | icon | iconColor | switchVal | actualSpeed | maxSpeed: | findLocale | actualMode | modeList}
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'     // entityUpdateDetail
                            + tempId + '~'
                            + icon + '~'                        // iconId
                            + iconColor + '~'                   // iconColor
                            + switchVal + '~'                   // buttonState
                            + actualSpeed + '~'   
                            + maxSpeed + '~'   
                            + findLocale('fan', 'speed') + '~'   
                            + actualMode + '~'   
                            + modeList    
                    });
                }
            }

            if (type == 'popupInSel') {
                if (role == 'media') {
                    let actualState: any = '';
                    let optionalString: string = 'Kein Eintrag';
                    let mode: NSPanel.mediaOptional | '' = '';
                    if (isPageMediaItem(pageItem)) {
                        const vTempAdapter = (pageItem.adapterPlayerInstance!).split('.');
                        const vAdapter: NSPanel.PlayerType = vTempAdapter[0] as NSPanel.PlayerType;
                        if (optional == 'seek') {
                            if (vAdapter == 'sonos') {
                                const actualStateTemp: number = getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.seek').val;
                                actualState = Math.round(actualStateTemp / 10) * 10 + '%';
                                optionalString = '0%?10%?20%?30%?40%?50%?60%?70%?80%?90%?100%';
                            }
                            if (vAdapter == 'spotify-premium') {
                                const actualStateTemp: number = getState(pageItem.adapterPlayerInstance + 'player.progressPercentage').val;
                                actualState = Math.round(actualStateTemp / 10) * 10 + '%';
                                optionalString = '0%?10%?20%?30%?40%?50%?60%?70%?80%?90%?100%';
                            }
                            if (vAdapter == 'squeezeboxrpc') {
                                const actualStateTime: number = parseInt(getState(pageItem.adapterPlayerInstance + 'Players.' + pageItem.mediaDevice + '.Time').val);
                                const actualStateDuration: number = parseInt(getState(pageItem.adapterPlayerInstance + 'Players.' + pageItem.mediaDevice + '.Duration').val);
                                const actualStateTemp: number = actualStateTime * 100 / actualStateDuration;
                                actualState = Math.round(actualStateTemp / 10) * 10 + '%';
                                optionalString = '0%?10%?20%?30%?40%?50%?60%?70%?80%?90%?100%';
                            }
                            mode = 'seek';
                        } else if (optional == 'crossfade') {
                            if (existsObject(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.crossfade')) {
                                let actualStateTemp: boolean = getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.crossfade').val;
                                if (actualStateTemp) {
                                    actualState = findLocale('media', 'on');
                                } else {
                                    actualState = findLocale('media', 'off');
                                }
                            }
                            if (vAdapter == 'sonos') {
                                optionalString = findLocale('media', 'on') + '?' + findLocale('media', 'off');
                            }
                            mode = 'crossfade';
                        } else if (optional == 'speakerlist') {
                            if (vAdapter == 'spotify-premium') {
                                if (existsObject(pageItem.adapterPlayerInstance + 'player.device.name')) {
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'player.device.name').val);
                                }
                            } else if (vAdapter == 'alexa2') {
                                if (existsObject(pageItem.adapterPlayerInstance + 'player.device.name')) {
                                    //Todo Richtiges Device finden
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Info.name').val);
                                }
                            } else if (vAdapter == 'bosesoundtouch') {
                                if (existsObject(pageItem.adapterPlayerInstance + 'deviceInfo.name')) {
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'deviceInfo.name').val);
                                }
                            } else if (vAdapter == 'squeezeboxrpc') {
                                actualState = pageItem.mediaDevice;
                            }
                            let tempSpeakerList: string[] = [];
                            for (let i = 0; i < pageItem.speakerList!.length; i++) {
                                tempSpeakerList[i] = formatInSelText(pageItem.speakerList![i]).trim();
                            }
                            optionalString = pageItem.speakerList != undefined ? tempSpeakerList.join('?') : '';
                            mode = 'speakerlist';
                        } else if (optional == 'playlist') {
                            if (vAdapter == 'spotify-premium') {
                                if (existsObject(pageItem.adapterPlayerInstance + 'player.playlist.name')) {
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'player.playlist.name').val);
                                }
                                let tempPlayList: string[] = [];
                                for (let i = 0; i < pageItem.playList!.length; i++) {
                                    tempPlayList[i] = formatInSelText(pageItem.playList![i]);
                                }
                                optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                            } else if (vAdapter == 'alexa2') {
                                //Todo Richtiges Device finden
                                actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Player.currentAlbum').val);

                                let tPlayList: any = []
                                for (let i = 0; i < pageItem.playList!.length; i++) {
                                    if (Debug) log('function GenerateDetailPage role:media -> Playlist ' + pageItem.playList![i], 'info');
                                    let tempItem = pageItem.playList![i].split('.');
                                    tPlayList[i] = tempItem[1];
                                }

                                let tempPlayList: string[] = [];
                                for (let i = 0; i < tPlayList.length; i++) {
                                    tempPlayList[i] = formatInSelText(tPlayList[i]);
                                }
                                optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                            } else if (vAdapter == 'bosesoundtouch') {
                                if (existsObject(pageItem.adapterPlayerInstance + 'deviceInfo.name')) {
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'deviceInfo.name').val);
                                }
                                let tempPlayList: string[] = [];
                                let vPreset: string = 'No Entry';
                                for (let i = 1; i < 7; i++) {
                                    if (getState(pageItem.adapterPlayerInstance + 'presets.'+ i +'.source').val !== null) {
                                        vPreset = getState(pageItem.adapterPlayerInstance + 'presets.'+ i + '.source').val;
                                    } else {
                                        vPreset = 'Preset ' + i.toFixed;
                                    }
                                    tempPlayList[i - 1] = formatInSelText(vPreset.replace('_',' '));
                                    if (Debug) log(formatInSelText(vPreset.replace('_',' ')))
                                }
                                tempPlayList[6] = 'AUX INPUT';
                                optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                            } else if (vAdapter == 'sonos') {
                                if (Debug) log(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.playlist_set', 'info');
                                if (existsObject(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.playlist_set')) {
                                    actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.playlist_set').val);
                                }
                                let tempPlayList: string[] = [];
                                for (let i = 0; i < pageItem.playList!.length; i++) {
                                    tempPlayList[i] = formatInSelText(pageItem.playList![i]);
                                }
                                optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                            } else if (vAdapter == 'volumio') { /* Volumio: limit 900 chars */
                                actualState = ''; //todo: no actual playlistname saving
                                let tempPlayList: string[] = []; let tempPll = 0;
                                for (let i = 0; i < pageItem.playList!.length; i++) {
                                    tempPll += pageItem.playList![i].length; if (tempPll > 900) break;
                                    tempPlayList[i] = formatInSelText(pageItem.playList![i]);
                                }
                                optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                            } else if (vAdapter == 'squeezeboxrpc') {
                                // Playlist browsing not supported by squeezeboxrpc adapter. But Favorites can be used
                                actualState = ''; // Not supported by squeezeboxrpc adapter
                                let tempPlayList: string[] = [];
                                let pathParts: string[] = pageItem.adapterPlayerInstance!.split('.');
                                for (let favorite_index = 0; favorite_index < 45; favorite_index++) {
                                    let favorite_name_selector: string = [pathParts[0], pathParts[1], 'Favorites', favorite_index, 'Name'].join('.');
                                    if (!existsObject(favorite_name_selector)) {
                                        break;
                                    }
                                    let favoritename: string = getState(favorite_name_selector).val;
                                    tempPlayList.push(formatInSelText(favoritename));
                                }
                                optionalString = tempPlayList.length > 0 ? tempPlayList.join('?') : '';
                            }
                            mode = 'playlist';
                        } else if (optional == 'tracklist') {
                            actualState = '';
                            /* Volumio: works for files */
                            if (vAdapter == 'volumio') {
                                actualState = getState(pageItem.id + '.TITLE').val;
                                globalTracklist = pageItem.globalTracklist;
                            } else if (vAdapter == 'squeezeboxrpc') {
                                actualState = getState(pageItem.id + '.TITLE').val;
                            } else if (vAdapter == 'sonos') {
                                actualState = getState(pageItem.id + '.TITLE').val;
                            } else {
                                actualState = getState(pageItem.adapterPlayerInstance + 'player.trackName').val;
                            }
                            actualState = (actualState.replace('?', '')).split(' -');
                            actualState = actualState[0].split(" (");
                            actualState = formatInSelText(actualState[0]);
                            if (Debug) log(actualState, 'info');
                            if (Debug) log(globalTracklist, 'info');
                            //Limit 900 characters, then memory overflow --> Shorten as much as possible
                            let temp_array: any[] = [];
                            //let trackArray = (function () { try {return JSON.parse(getState(pageItem.adapterPlayerInstance + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                            for (let track_index = 0; track_index < 48; track_index++) {
                                let temp_cut_array = getAttr(globalTracklist, track_index + '.title');
                                /* Volumio: @local/NAS no title -> name */
                                if (temp_cut_array == undefined) {
                                    temp_cut_array = getAttr(globalTracklist, track_index + '.name');
                                }
                                if (Debug) log('function GenerateDetailPage role:media tracklist -> ' + temp_cut_array, 'info');
                                if (temp_cut_array != undefined) {
                                    temp_cut_array = (temp_cut_array.replace('?', '')).split(' -');
                                    temp_cut_array = temp_cut_array[0].split(" (");
                                    temp_cut_array = temp_cut_array[0];
                                    if (String(temp_cut_array[0]).length >= 22) {
                                        temp_array[track_index] = temp_cut_array.substring(0, 20) + '..';
                                    } else {
                                        temp_array[track_index] = temp_cut_array.substring(0, 23);
                                    }
                                }
                                else {
                                    break;
                                }
                            }
                            let tempTrackList: string[] = [];
                            for (let i = 0; i < temp_array.length; i++) {
                                tempTrackList[i] = formatInSelText(temp_array[i]);
                            }
                            optionalString = pageItem.playList != undefined ? tempTrackList.join('?') : ''
                            mode = 'tracklist';
                        } else if (optional == 'equalizer') {
                            if (pageItem.id == undefined) throw new Error('Missing pageItem.id in equalizer!');
                            let lastIndex = (pageItem.id.split('.')).pop();

                            if (existsObject(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode') == false ||
                                existsObject(NSPanel_Path + 'Media.Player.' + lastIndex + '.Speaker') == false) {
                                createState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode', <iobJS.StateCommon> {type: 'string', write: false});
                                createState(NSPanel_Path + 'Media.Player.' + lastIndex + '.Speaker', <iobJS.StateCommon> {type: 'string', write: false});
                            }

                            actualState = ''
                            if (getState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode').val != null) {
                                actualState = formatInSelText(getState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode').val);
                            }

                            let tempEQList: string[] = [];
                            for (let i = 0; i < pageItem.equalizerList!.length; i++) {
                                tempEQList[i] = formatInSelText(pageItem!.equalizerList![i]);
                            }

                            optionalString = pageItem.equalizerList != undefined ? tempEQList.join('?') : '';
                            mode = 'equalizer';
                        } else if (optional == 'repeat') {
                            actualState = getState(pageItem.adapterPlayerInstance + 'player.repeat').val;
                            optionalString = pageItem.repeatList!.join('?');
                            mode = 'repeat';
                        } else if (optional == 'favorites') {
                            if (Debug) log(getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.favorites_set').val, 'info')
                            actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.favorites_set').val);

                            let tempFavList: string[] = [];
                            let favList = getState(pageItem.adapterPlayerInstance + 'root.' + pageItem.mediaDevice + '.favorites_list_array').val;
                            for (let i = 0; i < favList.length; i++) {
                                tempFavList[i] = formatInSelText(favList[i]);
                            }
                            optionalString = tempFavList != undefined ? tempFavList.join('?') : '';
                            mode = 'favorites';
                        }

                        let tempId = placeId != undefined ? placeId : id;
                        // {tempid | color | NSPanel.mediaOptional | actualState | optionalString}
                        out_msgs.push({
                            payload: 'entityUpdateDetail2' + '~'     //entityUpdateDetail
                                + tempId + '?' + optional + '~~'         //{entity_id}
                                + rgb_dec565(HMIOn) + '~'            //{icon_color}~
                                + mode + '~'
                                + actualState + '~'
                                + optionalString
                        });
                        GeneratePage(activePage!);
                    }
                } else if (role == 'buttonSensor') {

                    let actualValue: string = '';

                    if (pageItem.inSel_ChoiceState || pageItem.inSel_ChoiceState == undefined) {
                        if (existsObject(pageItem.id + '.VALUE')) {
                            actualValue = formatInSelText(pageItem.modeList![getState(pageItem.id + '.VALUE').val]);
                            RegisterDetailEntityWatcher(id + '.VALUE', pageItem, type, placeId);
                        }
                    }
                    
                    let tempModeList: string[] = [];
                    for (let i = 0; i < pageItem.modeList!.length; i++) {
                        tempModeList[i] = formatInSelText(pageItem.modeList![i]);
                    }
                    let valueList = pageItem.modeList != undefined ? tempModeList.join('?') : '';

                    let tempId = placeId != undefined ? placeId : id;
                    // {tempid | color | NSPanel.mediaOptional | actualValue | valueList}
                    out_msgs.push({
                        payload: 'entityUpdateDetail2' + '~'     //entityUpdateDetail2
                            + tempId + '~~'                          //{entity_id}
                            + rgb_dec565(White) + '~'            //{icon_color}~
                            + 'insel' + '~'
                            + actualValue + '~'
                            + valueList
                    });
                } else if (role == 'light' ||
                           role == 'dimmer' ||
                           role == 'hue' ||
                           role == 'rgb' ||
                           role == 'rgbSingle' ||
                           role == 'ct') {
                               
                    //log(pageItem.id, 'info');
                    if (pageItem.modeList != undefined) {

                        let actualValue: string = '';

                        if (pageItem.inSel_ChoiceState || pageItem.inSel_ChoiceState == undefined) {
                            if (existsObject(pageItem.id + '.VALUE')) {
                                actualValue = formatInSelText(pageItem.modeList[getState(pageItem.id + '.VALUE').val]);
                                RegisterDetailEntityWatcher(id + '.VALUE', pageItem, type, placeId);
                            }
                        }

                        let tempModeList: string[] = [];
                        for (let i = 0; i < pageItem.modeList.length; i++) {
                            tempModeList[i] = formatInSelText(pageItem.modeList[i]);
                        }
                        let valueList = pageItem.modeList != undefined ? tempModeList.join('?') : '';

                        //log(valueList);
                        let tempId = placeId != undefined ? placeId : id;
                        // {tempid | color | 'insel' | actualValue | valueList}
                        out_msgs.push({
                            payload: 'entityUpdateDetail2' + '~'     //entityUpdateDetail2
                                + tempId + '~~'                          //{entity_id}
                                + rgb_dec565(White) + '~'            //{icon_color}~
                                + 'insel' + '~'
                                + actualValue + '~'
                                + valueList
                        });
                    }
                }
            }
        }
	    if (Debug) log('GenerateDetailPage -> payload: ' + JSON.stringify(out_msgs), 'info');     
        return out_msgs;

    } catch (err: any) {
        log('error at function GenerateDetailPage: ' + err.message, 'warn');
    }
    return [];
}

function scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    try {
        return (outMax + outMin) - ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    } catch (err: any) {
        log('error at function scale: ' + err.message, 'warn');
    }
    return 0
}

function UnsubscribeWatcher(): void {
    try {
        for (const [key, value] of Object.entries(subscriptions)) {
            unsubscribe(value);
            delete subscriptions[key];
        }
    } catch (err: any) {
        log('error at function UnsubscribeWatcher: ' + err.message, 'warn');
    }
}

function HandleScreensaver(): void {
    setIfExists(NSPanel_Path + 'ActivePage.type', 'screensaver', null, true);
    setIfExists(NSPanel_Path + 'ActivePage.id0', 'screensaver', null, true);
    setIfExists(NSPanel_Path + 'ActivePage.heading', 'Screensaver', null, true);
    if (existsObject(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced')) {
        if (getState(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced').val) {
            SendToPanel({ payload: 'pageType~screensaver2' });
        } else {
            SendToPanel({ payload: 'pageType~screensaver' });
        }
    } else {
        SendToPanel({ payload: 'pageType~screensaver' }); //Fallback
    }
    weatherForecast = getState(NSPanel_Path + 'ScreensaverInfo.weatherForecast').val;
    HandleScreensaverUpdate();
    HandleScreensaverStatusIcons();
    HandleScreensaverColors();
}

function HandleScreensaverUpdate(): void {
    try {
        
        if (screensaverEnabled) {

            UnsubscribeWatcher();

            let payloadString: string = '';
            let temperatureUnit = getState(NSPanel_Path + 'Config.temperatureUnit').val;
            let screensaverAdvanced = getState(NSPanel_Path + 'Config.Screensaver.ScreensaverAdvanced').val;

            //Create Weather MainIcon
            if (screensaverEnabled && config.weatherEntity != null && existsObject(config.weatherEntity)) {
                let icon = getState(config.weatherEntity + '.ICON').val;
                RegisterScreensaverEntityWatcher(config.weatherEntity + '.ICON')
                let temperature = '0';
                if (existsState(config.weatherEntity + '.ACTUAL')) {
                    temperature= getState(config.weatherEntity + '.ACTUAL').val;
                    RegisterScreensaverEntityWatcher(config.weatherEntity + '.ACTUAL')
                } else {
                    if (existsState(config.weatherEntity + '.TEMP')) {
                        temperature = getState(config.weatherEntity + '.TEMP').val;
                    } else {
                        'null';
                    }
                }           
                let optionalValue = temperature + ' ' + temperatureUnit;
                let entityIcon = '';
                let entityIconCol = 0;
                if (weatherAdapterInstance == 'daswetter.' + weatherAdapterInstanceNumber + '.') {
                    entityIcon = Icons.GetIcon(GetDasWetterIcon(parseInt(icon)));
                    entityIconCol = GetDasWetterIconColor(parseInt(icon));
                } else if (weatherAdapterInstance == 'accuweather.' + weatherAdapterInstanceNumber + '.') {
                    entityIcon = Icons.GetIcon(GetAccuWeatherIcon(parseInt(icon)));
                    entityIconCol = GetAccuWeatherIconColor(parseInt(icon));
                }

                payloadString += '~' +
                                '~' +
                                entityIcon + '~' +
                                entityIconCol + '~' +
                                '~' +
                                optionalValue + '~';
            }

            // 3 leftScreensaverEntities  
            if (screensaverAdvanced) {
                let checkpoint = true;
                let i = 0;
                if (config.leftScreensaverEntity && Array.isArray(config.leftScreensaverEntity)) {
                    for (i = 0; i < 3 && i < config.leftScreensaverEntity.length; i++) {
                        const leftScreensaverEntity = config.leftScreensaverEntity[i]
                        if (leftScreensaverEntity === null || leftScreensaverEntity === undefined) {
                            checkpoint = false;
                            break;;
                        }
                        RegisterScreensaverEntityWatcher(leftScreensaverEntity.ScreensaverEntity)

                        let val = getState(leftScreensaverEntity.ScreensaverEntity).val;
                        let iconColor = rgb_dec565(White);
                        let icon;
                        if (typeof leftScreensaverEntity.ScreensaverEntityIconOn == 'string' && existsObject(leftScreensaverEntity.ScreensaverEntityIconOn as string)) {
                            let iconName = getState(leftScreensaverEntity.ScreensaverEntityIconOn!).val;
                            icon = Icons.GetIcon(iconName);
                        } else {
                            icon = Icons.GetIcon(leftScreensaverEntity.ScreensaverEntityIconOn);
                        }

                        if (parseFloat(val + "") == val) {
                            val = parseFloat(val);
                        }

                        if (typeof (val) == 'number') {
                            val = (val * (leftScreensaverEntity.ScreensaverEntityFactor ? leftScreensaverEntity.ScreensaverEntityFactor! : 0)).toFixed(leftScreensaverEntity.ScreensaverEntityDecimalPlaces) + leftScreensaverEntity.ScreensaverEntityUnitText;
                            iconColor = GetScreenSaverEntityColor(leftScreensaverEntity);
                        }
                        else if (typeof (val) == 'boolean') {
                            iconColor = GetScreenSaverEntityColor(leftScreensaverEntity);
                            if (!val && leftScreensaverEntity.ScreensaverEntityIconOff != null) {
                                icon = Icons.GetIcon(leftScreensaverEntity.ScreensaverEntityIconOff)
                            }
                        }
                        else if (typeof (val) == 'string') {
                            iconColor = GetScreenSaverEntityColor(leftScreensaverEntity);
                            let pformat = parseFormat(val);
                            if (Debug) log('moments.js --> Datum ' + val + ' valid?: ' + moment(val, pformat, true).isValid(), 'info');
                            if (moment(val, pformat, true).isValid()) {
                                let DatumZeit = moment(val, pformat).unix(); // Umwandlung in Unix Time-Stamp
                                if (leftScreensaverEntity.ScreensaverEntityDateFormat !== undefined) {
                                    val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val, leftScreensaverEntity.ScreensaverEntityDateFormat);
                                } else {
                                    val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val);
                                }
                            }
                        }
                        const temp = leftScreensaverEntity.ScreensaverEntityIconColor;
                        if (temp && typeof temp == 'string' && existsObject(temp)) {
                            iconColor = getState(temp).val;
                        }

                        payloadString += '~' +
                            '~' +
                            icon + '~' +
                            iconColor + '~' +
                            leftScreensaverEntity.ScreensaverEntityText + '~' +
                            val + '~';
                    }
                }
                if (checkpoint == false) {
                    for (let j = i; j < 3; j++) {
                        payloadString += '~~~~~~';
                    }    
                }
            }

            // 6 bottomScreensaverEntities
            let maxEntities: number = 7;
            if (screensaverAdvanced == false) {
                maxEntities = 5;
                if (getState(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout').val) {
                maxEntities = 6; 
                }
            }

            if (weatherForecast) {

                if (getState(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout').val) {
                maxEntities = 5; 
                }
                
                for (let i = 1; i < maxEntities; i++) {
                    let TempMin = 0;
                    let TempMax = 0;
                    let DayOfWeek = 0;
                    let WeatherIcon = '0';
                    let WheatherColor = 0;

                    if (weatherAdapterInstance == 'daswetter.' + weatherAdapterInstanceNumber + '.') {
                        TempMin = getState('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Minimale_Temperatur_value').val;
                        TempMax = getState('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Maximale_Temperatur_value').val;
                        DayOfWeek = (getState('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Tag_value').val).substring(0,2);
                        WeatherIcon = GetDasWetterIcon(getState('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Wetter_Symbol_id').val);
                        WheatherColor = GetDasWetterIconColor(getState('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Wetter_Symbol_id').val);

                        RegisterScreensaverEntityWatcher('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Minimale_Temperatur_value');
                        RegisterScreensaverEntityWatcher('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Maximale_Temperatur_value');
                        RegisterScreensaverEntityWatcher('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Tag_value');
                        RegisterScreensaverEntityWatcher('daswetter.' + weatherAdapterInstanceNumber + '.NextDays.Location_1.Day_' + i + '.Wetter_Symbol_id');
                    } else if (weatherAdapterInstance == 'accuweather.' + weatherAdapterInstanceNumber + '.') {
                        if (i < 6) {
                            //Maximal 5 Tage bei accuweather
                            TempMin = (existsObject('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMin_d' + i)) ? getState('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMin_d' + i).val : 0;
                            TempMax = (existsObject('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMax_d' + i)) ? getState('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMax_d' + i).val : 0;
                            DayOfWeek = (existsObject('accuweather.' + weatherAdapterInstanceNumber + '.Summary.DayOfWeek_d' + i)) ? getState('accuweather.' + weatherAdapterInstanceNumber + '.Summary.DayOfWeek_d' + i).val : 0;
                            WeatherIcon = (existsObject('accuweather.' + weatherAdapterInstanceNumber + '.Summary.WeatherIcon_d' + i)) ? GetAccuWeatherIcon(getState('accuweather.' + weatherAdapterInstanceNumber + '.Summary.WeatherIcon_d' + i).val) : '';
                            WheatherColor = (existsObject('accuweather.' + weatherAdapterInstanceNumber + '.Summary.WeatherIcon_d' + i)) ? GetAccuWeatherIconColor(getState('accuweather.' + weatherAdapterInstanceNumber + '.Summary.WeatherIcon_d' + i).val) : 0;

                            RegisterScreensaverEntityWatcher('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMin_d' + i);
                            RegisterScreensaverEntityWatcher('accuweather.' + weatherAdapterInstanceNumber + '.Summary.TempMax_d' + i);
                            RegisterScreensaverEntityWatcher('accuweather.' + weatherAdapterInstanceNumber + '.Summary.DayOfWeek_d' + i);
                            RegisterScreensaverEntityWatcher('accuweather.' + weatherAdapterInstanceNumber + '.Summary.WeatherIcon_d' + i);
                        }
                    }

                    let tempMinMaxString: string = '';
                    if (weatherScreensaverTempMinMax == 'Min') {
                        tempMinMaxString = TempMin + temperatureUnit;
                    } else if (weatherScreensaverTempMinMax == 'Max') {
                        tempMinMaxString = TempMax + temperatureUnit;
                    } else if (weatherScreensaverTempMinMax == 'MinMax') {
                        tempMinMaxString = Math.round(TempMin) + '° ' + Math.round(TempMax) + '°';
                    }

                    if (weatherAdapterInstance == 'accuweather.' + weatherAdapterInstanceNumber + '.' && i == 6)  {

                        let nextSunEvent = 0
                        let valDateNow = new Date().getTime();
                        let arraySunEvent: number[] = [];

                        arraySunEvent[0] = getDateObject(getState('accuweather.' + weatherAdapterInstanceNumber + '.Daily.Day1.Sunrise').val).getTime();
                        arraySunEvent[1] = getDateObject(getState('accuweather.' + weatherAdapterInstanceNumber + '.Daily.Day1.Sunset').val).getTime();
                        arraySunEvent[2] = getDateObject(getState('accuweather.' + weatherAdapterInstanceNumber + '.Daily.Day2.Sunrise').val).getTime();
                        
                        let j = 0;
                        for (j = 0; j < 3; j++) {
                            if (arraySunEvent[j] > valDateNow) {
                                nextSunEvent = j;
                                break;
                            }
                        }
                        let sun = '';
                        if (j == 1) {
                            sun = 'weather-sunset-down';
                        } else {
                            sun = 'weather-sunset-up';
                        }

                        payloadString += '~' +
                                        '~' +
                                        Icons.GetIcon(sun) + '~' + 
                                        rgb_dec565(MSYellow) + '~' +
                                        'Sonne' + '~' +
                                        formatDate(getDateObject(arraySunEvent[nextSunEvent]), 'hh:mm') + '~';
                    } else {
                        payloadString += '~' +
                                        '~' +
                                        Icons.GetIcon(WeatherIcon) + '~' +
                                        WheatherColor + '~' +
                                        DayOfWeek + '~' +
                                        tempMinMaxString + '~';
                    }
                }

                //Alternativ Layout bekommt zusätzlichen Status
                if (config.bottomScreensaverEntity[4] && getState(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout').val) {
                    let val = getState(config.bottomScreensaverEntity[4].ScreensaverEntity).val;
                    if (parseFloat(val+"") == val) {     
                        val = parseFloat(val);
                    }
                    let iconColor = rgb_dec565(White);
                    if (typeof(val) == 'number') {
                        val = (val * (config.bottomScreensaverEntity[4].ScreensaverEntityFactor ? config.bottomScreensaverEntity[4].ScreensaverEntityFactor : 0)).toFixed(config.bottomScreensaverEntity[4].ScreensaverEntityDecimalPlaces) + config.bottomScreensaverEntity[4].ScreensaverEntityUnitText;
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[4]);
                    }
                    else if (typeof(val) == 'boolean') {
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[4]);
                    }
                    else if (typeof(val) == 'string') {
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[4]);

                        let pformat = parseFormat(val);
                        if (Debug) log('moments.js --> Datum ' + val + ' valid?: ' + moment(val, pformat, true).isValid(), 'info');
                        if (moment(val, pformat, true).isValid()) { 
                            let DatumZeit = moment(val, pformat).unix(); // Conversion to Unix time stamp
                            if (config.bottomScreensaverEntity[4].ScreensaverEntityDateFormat !== undefined) {
                                val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val, config.bottomScreensaverEntity[4].ScreensaverEntityDateFormat);
                            } else {
                                val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val);
                            }
                        }                

                    }
                    const temp = config.bottomScreensaverEntity[4].ScreensaverEntityIconColor
                    if (temp && typeof temp == 'string' && existsObject(temp)) {
                        iconColor = getState(temp).val;
                    }                
                    payloadString += '~' +
                                    '~' +
                                    Icons.GetIcon(config.bottomScreensaverEntity[4].ScreensaverEntityIconOn) + '~' +
                                    iconColor + '~' +
                                    config.bottomScreensaverEntity[4].ScreensaverEntityText + '~' +
                                    val
                } // Ende zusätzlichen Status Alternativ Layout

            } else {
		    // USER definierte Bottom Entities
                let checkpoint = true;
                let i = 0;
                for (i = 0; i < maxEntities - 1 && i < config.bottomScreensaverEntity.length; i++) {
                    if (config.bottomScreensaverEntity[i] == null || config.bottomScreensaverEntity[i] === undefined) {
                        checkpoint = false;
                        break;
                    } 
                    RegisterScreensaverEntityWatcher(config.bottomScreensaverEntity[i].ScreensaverEntity)
                    
                    let val = getState(config.bottomScreensaverEntity[i].ScreensaverEntity).val;
                    if (parseFloat(val+"") == val) {     
                        val = parseFloat(val);
                    }
                    let iconColor = rgb_dec565(White);
		    let icon;
                    if (config.bottomScreensaverEntity[i].ScreensaverEntityIconOn && existsObject(config.bottomScreensaverEntity[i].ScreensaverEntityIconOn!)) {
                        let iconName = getState(config.bottomScreensaverEntity[i].ScreensaverEntityIconOn!).val;
                        icon = Icons.GetIcon(iconName);
                    } else {
                        icon = Icons.GetIcon(config.bottomScreensaverEntity[i].ScreensaverEntityIconOn);
                    }    

                    if (typeof(val) == 'number') {
                        val = (val * (config.bottomScreensaverEntity[i].ScreensaverEntityFactor ? config.bottomScreensaverEntity[i].ScreensaverEntityFactor! : 0)).toFixed(config.bottomScreensaverEntity[i].ScreensaverEntityDecimalPlaces) + config.bottomScreensaverEntity[i].ScreensaverEntityUnitText;
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[i]);
                    }
                    else if (typeof(val) == 'boolean') {
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[i]);
                        if (!val && config.bottomScreensaverEntity[i].ScreensaverEntityIconOff != null) {
                            icon = Icons.GetIcon(config.bottomScreensaverEntity[i].ScreensaverEntityIconOff)
                        }
                        if (val && config.bottomScreensaverEntity[i].ScreensaverEntityOnText !=undefined) {
                            val = config.bottomScreensaverEntity[i].ScreensaverEntityOnText;
                        }
                        if (!val && config.bottomScreensaverEntity[i].ScreensaverEntityOffText !=undefined) {
                            val = config.bottomScreensaverEntity[i].ScreensaverEntityOffText;
                        }

                    }
                    else if (typeof(val) == 'string') {
                        iconColor = GetScreenSaverEntityColor(config.bottomScreensaverEntity[i]);
                        let pformat = parseFormat(val);
                        if (Debug) log('moments.js --> Datum ' + val + ' valid?: ' + moment(val, pformat, true).isValid(), 'info');
                        if (moment(val, pformat, true).isValid()) { 
                            let DatumZeit = moment(val, pformat).unix(); // Conversion to Unix time stamp
                            if (config.bottomScreensaverEntity[i].ScreensaverEntityDateFormat !== undefined) {
                                val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val, config.bottomScreensaverEntity[i].ScreensaverEntityDateFormat);
                            } else {
                                val = new Date(DatumZeit * 1000).toLocaleString(getState(NSPanel_Path + 'Config.locale').val);
                            }
                        }                
                    }

                    const temp = config.bottomScreensaverEntity[i].ScreensaverEntityIconColor
                    if (temp && typeof temp == 'string' && existsObject(temp)) {
                        iconColor = getState(temp).val;
                    }
                    if (i < maxEntities - 1) {
                        val = val + '~';
                    }
                    payloadString += '~' +
                                    '~' +
                                    icon + '~' +
                                    iconColor + '~' +
                                    config.bottomScreensaverEntity[i].ScreensaverEntityText + '~' +
                                    val
                }
                if (checkpoint == false) {
                    for (let j = i; j < maxEntities - 1; j++) {
                        payloadString += '~~~~~~';
                    }    
                }
            }

            if (screensaverAdvanced) {
                // 5 indicatorScreensaverEntities     
                for (let i = 0; i < 5 && i < config.indicatorScreensaverEntity.length; i++) {
                    const indicatorScreensaverEntity:NSPanel.ScreenSaverElementWithUndefined = config.indicatorScreensaverEntity[i];
                    if (indicatorScreensaverEntity === null || indicatorScreensaverEntity === undefined) {
                        break;
                    }
                    RegisterScreensaverEntityWatcher(indicatorScreensaverEntity.ScreensaverEntity)

                    let val = getState(indicatorScreensaverEntity.ScreensaverEntity).val;
                    if (parseFloat(val+"") == val) {     
                        val = parseFloat(val);
                    }
                    let iconColor = rgb_dec565(White);
            
                    let icon;
                    if (indicatorScreensaverEntity.ScreensaverEntityIconOn && existsObject(indicatorScreensaverEntity.ScreensaverEntityIconOn!)) {
                        let iconName = getState(indicatorScreensaverEntity.ScreensaverEntityIconOn!).val;
                        icon = Icons.GetIcon(iconName);
                    } else {
                        icon = Icons.GetIcon(indicatorScreensaverEntity.ScreensaverEntityIconOn);
                    }    

                    if (typeof(val) == 'number') {
                        val = (val * (indicatorScreensaverEntity.ScreensaverEntityFactor ? indicatorScreensaverEntity.ScreensaverEntityFactor! : 0)).toFixed(indicatorScreensaverEntity.ScreensaverEntityDecimalPlaces) + indicatorScreensaverEntity.ScreensaverEntityUnitText;
                        iconColor = GetScreenSaverEntityColor(indicatorScreensaverEntity);
                    }
                    else if (typeof(val) == 'boolean') {
                        iconColor = GetScreenSaverEntityColor(indicatorScreensaverEntity);
                        if (!val && indicatorScreensaverEntity.ScreensaverEntityIconOff != null) {
                            icon = Icons.GetIcon(indicatorScreensaverEntity.ScreensaverEntityIconOff)
                        }
                    }
                    const temp = indicatorScreensaverEntity.ScreensaverEntityIconColor
                    if (temp && typeof temp == 'string' && existsObject(temp)) {
                        iconColor = getState(temp).val;
                    }
                    payloadString += '~' +
                                    'f'+ (i+1) + 'Icon~' +
                                    icon + '~' +
                                    iconColor + '~' +
                                    indicatorScreensaverEntity.ScreensaverEntityText + '~' +
                                    val + '~';
                }
            }
            if (Debug) log('HandleScreensaverUpdate payload: weatherUpdate~' + payloadString, 'info');

            SendToPanel({ payload: 'weatherUpdate~' + payloadString });

            HandleScreensaverStatusIcons();

	    HandleScreensaverColors();
        }

    } catch (err: any) {
        log('error at function HandleScreensaverUpdate: ' + err.message, 'warn');
    }
}

function RegisterScreensaverEntityWatcher(id: string): void {
    try {
        if (subscriptions.hasOwnProperty(id)) {
            return;
        }

        subscriptions[id] = (on({ id: id, change: 'any' }, () => {
            HandleScreensaverUpdate();
        }));
    } catch (err: any) {
        log('function RegisterEntityWatcher: ' + err.message, 'warn');
    }
}

function HandleScreensaverStatusIcons() : void {
    try {
        let payloadString = '';
        const iconData: Record<'mrIcon1' | 'mrIcon2', NSPanel.ScreenSaverMRDataElement> = {
            mrIcon1: {
                ScreensaverEntity: config.mrIcon1ScreensaverEntity.ScreensaverEntity != null 
                                        && existsState(config.mrIcon1ScreensaverEntity.ScreensaverEntity) 
                                        ? getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val 
                                        : null,
                ScreensaverEntityIconOn: config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn 
                                            ? Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn) 
                                            : '',
                ScreensaverEntityIconOff: config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff 
                                            ? Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff) 
                                            : '',
                ScreensaverEntityOnColor: config.mrIcon1ScreensaverEntity.ScreensaverEntityOnColor,
                ScreensaverEntityOffColor: config.mrIcon1ScreensaverEntity.ScreensaverEntityOffColor,
                ScreensaverEntityValue: config.mrIcon1ScreensaverEntity.ScreensaverEntityValue === null 
                                        ? null 
                                        : getState(config.mrIcon1ScreensaverEntity.ScreensaverEntityValue).val,
                ScreensaverEntityValueDecimalPlace: config.mrIcon1ScreensaverEntity.ScreensaverEntityValueDecimalPlace,
                ScreensaverEntityValueUnit: config.mrIcon1ScreensaverEntity.ScreensaverEntityValueUnit,
                ScreensaverEntityIconSelect: config.mrIcon1ScreensaverEntity.ScreensaverEntityIconSelect
                                                && typeof config.mrIcon1ScreensaverEntity.ScreensaverEntityIconSelect === 'object' 
                                                ? config.mrIcon1ScreensaverEntity.ScreensaverEntityIconSelect
                                                : null,
                

            },
            mrIcon2: {
                ScreensaverEntity: config.mrIcon2ScreensaverEntity.ScreensaverEntity != null 
                                        && existsState(config.mrIcon2ScreensaverEntity.ScreensaverEntity) 
                                        ? getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val 
                                        : null,
                ScreensaverEntityIconOn: config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn 
                                            ? Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn) 
                                            : '',
                ScreensaverEntityIconOff: config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff 
                                            ? Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff) 
                                            : '',
                ScreensaverEntityOnColor: config.mrIcon2ScreensaverEntity.ScreensaverEntityOnColor,
                ScreensaverEntityOffColor: config.mrIcon2ScreensaverEntity.ScreensaverEntityOffColor,
                ScreensaverEntityValue: config.mrIcon2ScreensaverEntity.ScreensaverEntityValue === null 
                                        ? null 
                                        : getState(config.mrIcon2ScreensaverEntity.ScreensaverEntityValue).val,
                ScreensaverEntityValueDecimalPlace: config.mrIcon2ScreensaverEntity.ScreensaverEntityValueDecimalPlace,
                ScreensaverEntityValueUnit: config.mrIcon2ScreensaverEntity.ScreensaverEntityValueUnit,
                ScreensaverEntityIconSelect: config.mrIcon2ScreensaverEntity.ScreensaverEntityIconSelect 
                                                && typeof config.mrIcon2ScreensaverEntity.ScreensaverEntityIconSelect === 'object' 
                                                ? config.mrIcon2ScreensaverEntity.ScreensaverEntityIconSelect
                                                : null,
            }
        }
        for (const a in iconData) {
            if (iconData[a].ScreensaverEntityValue !== null) {
                switch (typeof iconData[a].ScreensaverEntityValue) {
                    case "string":
                        if (iconData[a].ScreensaverEntityValue === '' || isNaN(iconData[a].ScreensaverEntityValue)) break;
                    case "number":
                    case "bigint":
                        iconData[a].ScreensaverEntityValue = Number(iconData[a].ScreensaverEntityValue).toFixed(iconData[a].ScreensaverEntityValueDecimalPlace);
                        break;
                    case "boolean":
                        break;
                    case "symbol":
                    case "undefined":
                    case "object":
                    case "function":
                        iconData[a].ScreensaverEntityValue = null;
                }
            }
            let hwBtn1Col: RGB = iconData[a].ScreensaverEntityOffColor;
            if (iconData[a].ScreensaverEntity != null || iconData[a].ScreensaverEntityValue != null) {
                // Prüfung ob ScreensaverEntity vom Typ String ist
                if (iconData[a].ScreensaverEntity != null) {
                    if (typeof (iconData[a].ScreensaverEntity) == 'string') {
                        if (Debug) log('Entity ist String', 'info')
                        switch (String(iconData[a].ScreensaverEntity).toUpperCase()) { 
                            case 'ON': 
                            case 'OK': 
                            case 'AN': 
                            case 'YES': 
                            case 'TRUE': 
                            case 'ONLINE': 
                                hwBtn1Col = iconData[a].ScreensaverEntityOnColor;
                                break;
                            default:
                        }
                        if (Debug) log('Value: ' + iconData[a].ScreensaverEntity + ' Color: ' + JSON.stringify(hwBtn1Col), 'info')
                        // Alles was kein String ist in Boolean umwandeln
                    } else {
                        if (Debug) log('Entity ist kein String', 'info')
                        if (!!iconData[a].ScreensaverEntity) {
                            hwBtn1Col = iconData[a].ScreensaverEntityOnColor;
                        }
                    }
                }

                // Icon ermitteln
                if (iconData[a].ScreensaverEntityIconSelect && iconData[a].ScreensaverEntity != null) {
                    const icon = iconData[a].ScreensaverEntityIconSelect[iconData[a].ScreensaverEntity];
                    if (icon !== undefined) {
                        payloadString += Icons.GetIcon(icon);
                        if (Debug) log('SelectIcon: '+payloadString, 'info')
                    }
                } else if (iconData[a].ScreensaverEntity) {
                    payloadString += iconData[a].ScreensaverEntityIconOn;
                    if (Debug) log('Icon if true '+payloadString, 'info')    
                } else {
                    if (iconData[a].ScreensaverEntityIconOff) {
                        payloadString += iconData[a].ScreensaverEntityIconOff;
                        if (Debug) log('Icon1 else true '+payloadString, 'info')  
                    } else {
                        payloadString += iconData[a].ScreensaverEntityIconOn;
                        if (Debug) log('Icon1 else false '+payloadString, 'info')  
                    }
                } 
                
                if (iconData[a].ScreensaverEntityValue != null) { 
                    payloadString += iconData[a].ScreensaverEntityValue;
                    payloadString += (iconData[a].ScreensaverEntityValueUnit == null) ? '' : iconData[a].ScreensaverEntityValueUnit; 
                }                       
                            
                payloadString += '~' + rgb_dec565(hwBtn1Col) + '~';
            } else {
                hwBtn1Col = Black;
                payloadString += '~~';
            }
        }
        
        let alternateScreensaverMFRIcon1Size = getState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1').val
        let alternateScreensaverMFRIcon2Size = getState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2').val
        //Alternate MRIcon Size
        if (alternateScreensaverMFRIcon1Size) {
            payloadString += '1~';
        } else {
            payloadString += '~';
        }
        if (alternateScreensaverMFRIcon2Size) {
            payloadString += '1~';
        } else {
            payloadString += '~';
        }
        // statusUpdate~icon1~icon1Color~icon1font~icon2~icon2color~icon2font~icon2font
        SendToPanel({ payload: 'statusUpdate~' + payloadString });

    } catch (err: any) {
        log('error at function HandleScreensaverStatusIcons: ' + err.message, 'warn');
    }
}

function HandleColorScale(valueScaletemp: string): number {
    switch (valueScaletemp) {
        case '0':
            return rgb_dec565(colorScale0);
        case '1':
            return rgb_dec565(colorScale1);
        case '2':
            return rgb_dec565(colorScale2);
        case '3':
            return rgb_dec565(colorScale3);
        case '4':
            return rgb_dec565(colorScale4);
        case '5':
            return rgb_dec565(colorScale5);
        case '6':
            return rgb_dec565(colorScale6);
        case '7':
            return rgb_dec565(colorScale7);
        case '8':
            return rgb_dec565(colorScale8);
        case '9':
            return rgb_dec565(colorScale9);
        case '10':
            return rgb_dec565(colorScale10);
        default:
            return rgb_dec565(colorScale10);
    }
}

function HandleScreensaverColors(): void {
    try {
        let vwIcon: number[] = [];
        if (getState(NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout').val) {
            vwIcon[0] = vwIconColor[0];
            vwIcon[1] = vwIconColor[1];
            vwIcon[2] = vwIconColor[2];
            vwIcon[3] = vwIconColor[3];
            vwIcon[4] = vwIconColor[4];
        } else {
            if (weatherForecast) {
                vwIcon[0] = rgb_dec565(sctMainIcon);
                vwIcon[1] = rgb_dec565(sctF1Icon);
                vwIcon[2] = rgb_dec565(sctF2Icon);
                vwIcon[3] = rgb_dec565(sctF3Icon);
                vwIcon[4] = rgb_dec565(sctF4Icon);
            } else {
                vwIcon[0] = rgb_dec565(sctMainIcon);
                vwIcon[1] = vwIconColor[1];
                vwIcon[2] = vwIconColor[2];
                vwIcon[3] = vwIconColor[3];
                vwIcon[4] = vwIconColor[4];
            }
        }

        let scrSvrBGCol: any; 

        if (bgColorScrSaver == 0) {
            scrSvrBGCol = rgb_dec565(scbackground);
        } else if (bgColorScrSaver == 1) {
            scrSvrBGCol = rgb_dec565(scbackgroundInd1);
        } else if (bgColorScrSaver == 2) {
            scrSvrBGCol = rgb_dec565(scbackgroundInd2);
        } else if (bgColorScrSaver == 3) {
            scrSvrBGCol = rgb_dec565(scbackgroundInd3);
        } else if (bgColorScrSaver == 4) {
            scrSvrBGCol = rgb_dec565({red:255, green:16, blue:240});
        } else if (bgColorScrSaver == 5) {
            scrSvrBGCol = rgb_dec565({ red: 100, green: 0, blue: 0 });
        }
        
        let payloadString = buildNSPanelString(
                            'color'                     ,
                            scrSvrBGCol                 ,      //background
                            rgb_dec565(sctime)          ,      //time
                            rgb_dec565(sctimeAMPM)      ,      //timeAMPM~
                            rgb_dec565(scdate)          ,      //date~
                            rgb_dec565(sctMainText)     ,      //tMainText~
                            rgb_dec565(sctForecast1)    ,      //tForecast1~
                            rgb_dec565(sctForecast2)    ,      //tForecast2~
                            rgb_dec565(sctForecast3)    ,      //tForecast3~
                            rgb_dec565(sctForecast4)    ,      //tForecast4~
                            rgb_dec565(sctForecast1Val) ,      //tForecast1Val~
                            rgb_dec565(sctForecast2Val) ,      //tForecast2Val~
                            rgb_dec565(sctForecast3Val) ,      //tForecast3Val~
                            rgb_dec565(sctForecast4Val) ,      //tForecast4Val~
                            rgb_dec565(scbar)           ,      //bar~
                            rgb_dec565(sctMainTextAlt)  ,      //tMainTextAlt
                            rgb_dec565(sctTimeAdd)                  //tTimeAdd
        );

        SendToPanel({ payload: payloadString });
    } catch (err: any) {
        log('error at function HandleScreensaverColors: '+ err.message, 'warn');
    }
}

function GetScreenSaverEntityColor(configElement: NSPanel.ScreenSaverElement | null): number {
    try {
        let colorReturn: number;
        if (configElement && configElement.ScreensaverEntityIconColor != undefined) {
            const ScreensaverEntityIconColor = configElement.ScreensaverEntityIconColor as NSPanel.IconScaleElement;
            if (typeof getState(configElement.ScreensaverEntity).val == 'boolean') {
                let iconvalbest = (typeof ScreensaverEntityIconColor == 'object' && ScreensaverEntityIconColor.val_best !== undefined ) ? ScreensaverEntityIconColor.val_best : false ;
                colorReturn = (getState(configElement.ScreensaverEntity).val == iconvalbest) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
            } else if (typeof ScreensaverEntityIconColor == 'object') {
                const iconvalmin: number = ScreensaverEntityIconColor.val_min != undefined ? ScreensaverEntityIconColor.val_min : 0 ;
                const iconvalmax: number = ScreensaverEntityIconColor.val_max != undefined ? ScreensaverEntityIconColor.val_max : 100 ;
                const iconvalbest: number = ScreensaverEntityIconColor.val_best != undefined ? ScreensaverEntityIconColor.val_best : iconvalmin ;
                let valueScale = getState(configElement.ScreensaverEntity).val * configElement.ScreensaverEntityFactor!;

                if (iconvalmin == 0 && iconvalmax == 1) {
                    colorReturn = (getState(configElement.ScreensaverEntity).val == 1) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
                } else {
                    if (iconvalbest == iconvalmin) {
                        valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                    } else {
                        if (valueScale < iconvalbest) {
                            valueScale = scale(valueScale,iconvalmin, iconvalbest, 0, 10);
                        } else if (valueScale > iconvalbest || iconvalbest != iconvalmin) {
                            valueScale = scale(valueScale,iconvalbest, iconvalmax, 10, 0);
                        } else {
                            valueScale = scale(valueScale,iconvalmin, iconvalmax, 10, 0);
                        }
                    }
                    //limit if valueScale is smaller/larger than 0-10
                    if (valueScale > 10) valueScale = 10;
                    if (valueScale < 0) valueScale = 0;

                    let valueScaletemp = (Math.round(valueScale)).toFixed();                   
                    colorReturn = HandleColorScale(valueScaletemp);
                }
                if (ScreensaverEntityIconColor.val_min == undefined) {
                    colorReturn = rgb_dec565(configElement.ScreensaverEntityIconColor as RGB);
                }
            } else {
                colorReturn = rgb_dec565(White);
            }
        } else {
            const value: number | boolean = configElement ? getState(configElement.ScreensaverEntity).val : 0;
            if (configElement && typeof value == 'boolean') {
                if (value) {
                    if (configElement.ScreensaverEntityOnColor != undefined) {
                        colorReturn = rgb_dec565(configElement.ScreensaverEntityOnColor);
                    } else {
                        colorReturn = rgb_dec565(White);
                    }
                } else {
                    if (configElement.ScreensaverEntityOffColor != undefined) {
                        colorReturn = rgb_dec565(configElement.ScreensaverEntityOffColor);
                    } else {
                        colorReturn = rgb_dec565(White);
                    }
                }
            } else {
                colorReturn = rgb_dec565(White);
            }
        }
        return colorReturn;
    } catch (err: any) {
        log('error at function GetScreenSaverEntityColor: '+ err.message, 'warn');
    }
    return rgb_dec565(White);
}

function GetAccuWeatherIcon(icon: number): string {
    try {
        switch (icon) {
            case 30:        // Hot
                return 'weather-sunny-alert'; // exceptional

            case 24:        // Ice
            case 31:        // Cold
                return 'snowflake-alert';  // exceptional

            case 7:         // Cloudy
            case 8:         // Dreary (Overcast)
            case 38:        // Mostly Cloudy
                return 'weather-cloudy';  // cloudy

            case 11:        // fog
                return 'weather-fog';  // fog

            case 25:        // Sleet
                return 'weather-hail';  // Hail

            case 15:        // T-Storms
                return 'weather-lightning';  // lightning

            case 16:        // Mostly Cloudy w/ T-Storms
            case 17:        // Partly Sunny w/ T-Storms
            case 41:        // Partly Cloudy w/ T-Storms
            case 42:        // Mostly Cloudy w/ T-Storms
                return 'weather-lightning-rainy';  // lightning-rainy

            case 33:        // Clear
            case 34:        // Mostly Clear
            case 37:        // Hazy Moonlight
                return 'weather-night';

            case 3:         // Partly Sunny
            case 4:         // Intermittent Clouds
            case 6:         // Mostly Cloudy
            case 35:        // Partly Cloudy
            case 36:        // Intermittent Clouds
                return 'weather-partly-cloudy';  // partlycloudy

            case 18:        // pouring
                return 'weather-pouring';  // pouring

            case 12:        // Showers
            case 13:        // Mostly Cloudy w/ Showers
            case 14:        // Partly Sunny w/ Showers
            case 26:        // Freezing Rain
            case 39:        // Partly Cloudy w/ Showers
            case 40:        // Mostly Cloudy w/ Showers
                return 'weather-rainy';  // rainy

            case 19:        // Flurries
            case 20:        // Mostly Cloudy w/ Flurries
            case 21:        // Partly Sunny w/ Flurries
            case 22:        // Snow
            case 23:        // Mostly Cloudy w/ Snow
            case 43:        // Mostly Cloudy w/ Flurries
            case 44:        // Mostly Cloudy w/ Snow
                return 'weather-snowy';  // snowy

            case 29:        // Rain and Snow
                return 'weather-snowy-rainy';  // snowy-rainy

            case 1:         // Sunny
            case 2:         // Mostly Sunny
            case 5:         // Hazy Sunshine
                return 'weather-sunny';  // sunny

            case 32:        // windy
                return 'weather-windy';  // windy

            default:
                return 'alert-circle-outline';
        }
    } catch (err: any) {
        log('error at function GetAccuWeatherIcon: '+ err.message, 'warn');
    }
    return '';
}

function GetAccuWeatherIconColor(icon: number): number {
    try{
        switch (icon) {
            case 24:        // Ice
            case 30:        // Hot
            case 31:        // Cold
                return rgb_dec565(swExceptional);  // exceptional

            case 7:         // Cloudy
            case 8:         // Dreary (Overcast)
            case 38:        // Mostly Cloudy
                return rgb_dec565(swCloudy);  // cloudy

            case 11:        // fog
                return rgb_dec565(swFog);  // fog

            case 25:        // Sleet
                return rgb_dec565(swHail);  // Hail

            case 15:        // T-Storms
                return rgb_dec565(swLightning);  // lightning

            case 16:        // Mostly Cloudy w/ T-Storms
            case 17:        // Partly Sunny w/ T-Storms
            case 41:        // Partly Cloudy w/ T-Storms
            case 42:        // Mostly Cloudy w/ T-Storms
                return rgb_dec565(swLightningRainy);  // lightning-rainy

            case 33:        // Clear
            case 34:        // Mostly Clear
            case 37:        // Hazy Moonlight
                return rgb_dec565(swClearNight);

            case 3:         // Partly Sunny
            case 4:         // Intermittent Clouds
            case 6:         // Mostly Cloudy
            case 35:        // Partly Cloudy
            case 36:        // Intermittent Clouds
                return rgb_dec565(swPartlycloudy);  // partlycloudy

            case 18:        // pouring
                return rgb_dec565(swPouring);  // pouring

            case 12:        // Showers
            case 13:        // Mostly Cloudy w/ Showers
            case 14:        // Partly Sunny w/ Showers
            case 26:        // Freezing Rain
            case 39:        // Partly Cloudy w/ Showers
            case 40:        // Mostly Cloudy w/ Showers
                return rgb_dec565(swRainy);  // rainy

            case 19:        // Flurries
            case 20:        // Mostly Cloudy w/ Flurries
            case 21:        // Partly Sunny w/ Flurries
            case 22:        // Snow
            case 23:        // Mostly Cloudy w/ Snow
            case 43:        // Mostly Cloudy w/ Flurries
            case 44:        // Mostly Cloudy w/ Snow
                return rgb_dec565(swSnowy);  // snowy

            case 29:        // Rain and Snow
                return rgb_dec565(swSnowyRainy);  // snowy-rainy

            case 1:         // Sunny
            case 2:         // Mostly Sunny
            case 5:         // Hazy Sunshine
                return rgb_dec565(swSunny);  // sunny

            case 32:        // windy
                return rgb_dec565(swWindy);  // windy

            default:
                return rgb_dec565(White);
        }
    } catch (err: any) {
        log('error at function GetAccuWeatherIconColor: '+ err.message, 'warn');
    }
    return 0;
}

function GetDasWetterIcon(icon: number): string {
    try {
        switch (icon) {
		    case 1:         // Sonnig
                 return 'weather-sunny';  // sunny
 
			case 2:         // Teils bewölkt
            case 3:         // Bewölkt
                return 'weather-partly-cloudy';  // partlycloudy
				
            case 4:         // Bedeckt
                return 'weather-cloudy';  // cloudy
				
            case 5:        // Teils bewölkt mit leichtem Regen
            case 6:        // Bewölkt mit leichtem Regen
            case 8:        // Teils bewölkt mit mäßigem Regen
            case 9:        // Bewölkt mit mäßigem Regen
                return 'weather-partly-rainy';  // partly-rainy
				
            case 7:        // Bedeckt mit leichtem Regen
                return 'weather-rainy';  // rainy
				
		    case 10:        // Bedeckt mit mäßigem Regen
                return 'weather-pouring';  // pouring
				
            case 11:        // Teils bewölkt mit starken Regenschauern
            case 12:        // Bewölkt mit stürmischen Regenschauern
                return 'weather-partly-lightning';  // partlylightning
				
            case 13:        // Bedeckt mit stürmischen Regenschauern
                return 'weather-lightning';  // lightning
				
            case 14:        // Teils bewölkt mit stürmischen Regenschauern und Hagel
			case 15:        // Bewölkt mit stürmischen Regenschauern und Hagel
			case 16:        // Bedeckt mit stürmischen Regenschauern und Hagel
                return 'weather-hail';  // Hail
 
            case 17:        // Teils bewölkt mit Schnee
            case 18:        // Bewölkt mit Schnee
                return 'weather-partly-snowy';  // partlysnowy
				
			case 19:        // Bedeckt mit Schneeschauern
                return 'weather-snowy';  // snowy
 
            case 20:        // Teils bewölkt mit Schneeregen
            case 21:        // Bewölkt mit Schneeregen
                return 'weather-partly-snowy-rainy';
 
            case 22:        // Bedeckt mit Schneeregen
                return 'weather-snowy-rainy';  // snowy-rainy
 
            default:
                return 'alert-circle-outline';
        }
    } catch (err: any) {
        log('error at function GetDasWetterIcon: '+ err.message, 'warn');
    }
    return '';
}
 
function GetDasWetterIconColor(icon: number): number {
    try{
        switch (icon) {
            case 1:         // Sonnig
                return rgb_dec565(swSunny);
 
            case 2:         // Teils bewölkt
            case 3:         // Bewölkt
                return rgb_dec565(swPartlycloudy);
 
            case 4:         // Bedeckt
                return rgb_dec565(swCloudy);
 
            case 5:        // Teils bewölkt mit leichtem Regen
            case 6:        // Bewölkt mit leichtem Regen
            case 8:        // Teils bewölkt mit mäßigem Regen
            case 9:        // Bewölkt mit mäßigem Regen
                return rgb_dec565(swRainy);
 
            case 7:        // Bedeckt mit leichtem Regen
                return rgb_dec565(swRainy);
 
            case 10:        // Bedeckt mit mäßigem Regen
                return rgb_dec565(swPouring);
 
            case 11:        // Teils bewölkt mit starken Regenschauern
            case 12:        // Bewölkt mit stürmischen Regenschauern
                return rgb_dec565(swLightningRainy);
 
            case 13:        // Bedeckt mit stürmischen Regenschauern
                return rgb_dec565(swLightning);
 
            case 14:        // Teils bewölkt mit stürmischen Regenschauern und Hagel
			case 15:        // Bewölkt mit stürmischen Regenschauern und Hagel
			case 16:        // Bedeckt mit stürmischen Regenschauern und Hagel
                return rgb_dec565(swHail);
 
            case 17:        // Teils bewölkt mit Schnee
            case 18:        // Bewölkt mit Schnee
                return rgb_dec565(swSnowy);
 
            case 19:        // Bedeckt mit Schneeschauern
                return rgb_dec565(swSnowy);
 
            case 20:        // Teils bewölkt mit Schneeregen
            case 21:        // Bewölkt mit Schneeregen
                return rgb_dec565(swSnowyRainy);  // snowy-rainy
 
            case 22:        // Bedeckt mit Schneeregen
                return rgb_dec565(swSnowyRainy);
 
            default:
                return rgb_dec565(White);
        }
    } catch (err: any) {
        log('error at function GetDasWetterIconColor: '+ err.message, 'warn');
    }
    return 0;
}

//------------------Begin Read Internal Sensor Data
//mqttCallback (topic: string, message: string): Promise<void> {
on({ id: config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'SENSOR' }, async (obj) => {
    try {
        const Tasmota_Sensor = JSON.parse(obj.state.val);

        await createStateAsync(NSPanel_Path + 'Sensor.Time', <iobJS.StateCommon>{ type: 'string', write: false });
        await createStateAsync(NSPanel_Path + 'Sensor.TempUnit', <iobJS.StateCommon>{ type: 'string', write: false });
        await createStateAsync(NSPanel_Path + 'Sensor.ANALOG.Temperature', <iobJS.StateCommon>{ type: 'number', 'unit': '°C', write: false });
        await createStateAsync(NSPanel_Path + 'Sensor.ESP32.Temperature', <iobJS.StateCommon>{ type: 'number', 'unit': '°C', write: false });
        let dateTime: string = Tasmota_Sensor.Time.split('T');
        await setStateAsync(NSPanel_Path + 'Sensor.Time', <iobJS.State>{ val: dateTime[0] + '\r\n' + dateTime[1] , ack: true });
        await setStateAsync(NSPanel_Path + 'Sensor.TempUnit', <iobJS.State>{ val: '°' + Tasmota_Sensor.TempUnit, ack: true });
        
        /* Some messages do not include temperature values, so catch ecxeption for them separately */
        try {
            await setStateAsync(NSPanel_Path + 'Sensor.ANALOG.Temperature', <iobJS.State>{ val: parseFloat(Tasmota_Sensor.ANALOG.Temperature1), ack: true });
            await setStateAsync(NSPanel_Path + 'Sensor.ESP32.Temperature', <iobJS.State>{ val: parseFloat(Tasmota_Sensor.ESP32.Temperature), ack: true });
        } catch (e){
            /* Nothing to do */
        }
        
        if (autoCreateAlias) {
            setObject(AliasPath + 'Sensor.ANALOG.Temperature', {type: 'channel', common: {role: 'info', name: ''}, native: {}});
            setObject(AliasPath + 'Sensor.ESP32.Temperature', {type: 'channel', common: {role: 'info', name:''}, native: {}});
            setObject(AliasPath + 'Sensor.Time', {type: 'channel', common: {role: 'info', name:''}, native: {}});
            setObject(AliasPath + 'Sensor.TempUnit', {type: 'channel', common: {role: 'info', name:''}, native: {}});        
            await createAliasAsync(AliasPath + 'Sensor.ANALOG.Temperature.ACTUAL', NSPanel_Path + 'Sensor.ANALOG.Temperature', true, <iobJS.StateCommon>{ type: 'number', 'unit': '°C' });
            await createAliasAsync(AliasPath + 'Sensor.ESP32.Temperature.ACTUAL', NSPanel_Path + 'Sensor.ESP32.Temperature', true, <iobJS.StateCommon>{ type: 'number', 'unit': '°C' });
            await createAliasAsync(AliasPath + 'Sensor.Time.ACTUAL', NSPanel_Path + 'Sensor.Time', true, <iobJS.StateCommon>{ type: 'string' });
            await createAliasAsync(AliasPath + 'Sensor.TempUnit.ACTUAL', NSPanel_Path + 'Sensor.TempUnit', true, <iobJS.StateCommon>{ type: 'string' });
        }
    } catch (err: any) {
        log('error Trigger reading senor-data: '+ err.message, 'warn');
    }
});
//------------------End Read Internal Sensor Data

function formatInSelText(Text: string ): string { 
    let splitText = Text.split(' ');
    let lengthLineOne = 0;
    let arrayLineOne: string[] = [];
    for (let i = 0; i < splitText.length; i++) {
        lengthLineOne = lengthLineOne + splitText[i].length + 1;
        if (lengthLineOne > 12) {
            break;        
        } else {
            arrayLineOne[i] = splitText[i];
        }
    }
    let textLineOne = arrayLineOne.join(' ');
    let arrayLineTwo: string[] = [];
    for (let i = arrayLineOne.length; i < splitText.length; i++) {
            arrayLineTwo[i] = splitText[i];
    }
    let textLineTwo = arrayLineTwo.join(' ');
    if (textLineTwo.length > 12) {
        textLineTwo = textLineTwo.substring(0,9) + '...';
    }
    if (textLineOne.length != 0) {
        return textLineOne + '\r\n' + textLineTwo.trim();
    } else {
        return textLineTwo.trim();
    }
}

function GetBlendedColor(percentage: number): RGB {
    if (percentage < 50) {
        return Interpolate(config.defaultOffColor, config.defaultOnColor, percentage / 50.0);
    }

    return Interpolate(Red, White, (percentage - 50) / 50.0);
}

function Interpolate(color1: RGB, color2: RGB, fraction: number): RGB {
    let r: number = InterpolateNum(color1.red, color2.red, fraction);
    let g: number = InterpolateNum(color1.green, color2.green, fraction);
    let b: number = InterpolateNum(color1.blue, color2.blue, fraction);
    return { red: Math.round(r), green: Math.round(g), blue: Math.round(b) };
}

function InterpolateNum(d1: number, d2: number, fraction: number): number {
    return d1 + (d2 - d1) * fraction;
}

function rgb_dec565(rgb: RGB): number {
    //return ((Math.floor(rgb.red / 255 * 31) << 11) | (Math.floor(rgb.green / 255 * 63) << 5) | (Math.floor(rgb.blue / 255 * 31)));
    return ((rgb.red >> 3) << 11) | ((rgb.green >> 2)) << 5 | ((rgb.blue) >> 3);
}

/**
 * Convert radians to degrees
 * @param rad radians to convert, expects rad in range +/- PI per Math.atan2
 * @returns {number} degrees equivalent of rad
 */
function rad2deg(rad): number {
    return (360 + 180 * rad / Math.PI) % 360;
}

function ColorToHex(color): string {
    let hexadecimal: string = color.toString(16);
    return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red: number, green: number, blue: Number): string {
    return '#' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

/**
 * Convert h,s,v values to r,g,b
 * @param hue in range [0, 360]
 * @param saturation in range 0 to 1
 * @param value in range 0 to 1
 * @returns {[number, number, number]} [r, g,b] in range 0 to 255
 */
function hsv2rgb(hue: number, saturation: number, value: number): [number, number, number] {
    hue /= 60;
    let chroma = value * saturation;
    let x = chroma * (1 - Math.abs((hue % 2) - 1));
    let rgb: [number, number, number] = hue <= 1 ? [chroma, x, 0] :
        hue <= 2 ? [x, chroma, 0] :
            hue <= 3 ? [0, chroma, x] :
                hue <= 4 ? [0, x, chroma] :
                    hue <= 5 ? [x, 0, chroma] :
                        [chroma, 0, x];

    return rgb.map(v => (v + value - chroma) * 255) as [number, number, number];
}

function getHue(red: number, green: number, blue: number): number {

    let min = Math.min(Math.min(red, green), blue);
    let max = Math.max(Math.max(red, green), blue);

    if (min == max) {
        return 0;
    }

    let hue = 0;
    if (max == red) {
        hue = (green - blue) / (max - min);

    } else if (max == green) {
        hue = 2 + (blue - red) / (max - min);

    } else {
        hue = 4 + (red - green) / (max - min);
    }

    hue = hue * 60;
    if (hue < 0) hue = hue + 360;

    return Math.round(hue);
}

function pos_to_color(x: number, y: number): RGB {
    let r = 160 / 2;
    x = Math.round((x - r) / r * 100) / 100;
    y = Math.round((r - y) / r * 100) / 100;

    r = Math.sqrt(x * x + y * y);
    let sat = 0
    if (r > 1) {
        sat = 0;
    } else {
        sat = r;
    }

    let hsv = rad2deg(Math.atan2(y, x));
    let rgb = hsv2rgb(hsv, sat, 1);

    return { red: Math.round(rgb[0]), green: Math.round(rgb[1]), blue: Math.round(rgb[2]) };
}

/**
 * 
 * @param red 
 * @param green 
 * @param blue 
 * @returns 
 */
function rgb_to_cie(red: number, green: number, blue: number): string
{
   //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
   let vred   = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
   let vgreen = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
   let vblue  = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

   //RGB values to XYZ using the Wide RGB D65 conversion formula
   let X = vred * 0.664511 + vgreen * 0.154324 + vblue * 0.162028;
   let Y = vred * 0.283881 + vgreen * 0.668433 + vblue * 0.047685;
   let Z = vred * 0.000088 + vgreen * 0.072310 + vblue * 0.986039;

   //Calculate the xy values from the XYZ values
   let ciex = (X / (X + Y + Z)).toFixed(4);
   let ciey = (Y / (X + Y + Z)).toFixed(4);
   let cie  = "[" + ciex + "," + ciey + "]"

   return cie;
}

/**
 *
 * @param vDeviceString 
 * @returns 
 */
function spotifyGetDeviceID(vDeviceString: string): string {
    const availableDeviceIDs: string = getState("spotify-premium.0.devices.availableDeviceListIds").val;
    const availableDeviceNames: string = getState("spotify-premium.0.devices.availableDeviceListString").val;
    let arrayDeviceListIds: string[] = availableDeviceIDs.split(";");
    let arrayDeviceListSting: string[] = availableDeviceNames.split(";");
    let indexPos: number = arrayDeviceListSting.indexOf(vDeviceString);
    let strDevID = arrayDeviceListIds[indexPos];
    return strDevID;
}
/**
 * Join arguments with ~ and return the string;
 * @param tokens unlimited numbers of strings
 * @returns 
 */
function buildNSPanelString(...tokens: (string|number)[]): string {
    return tokens.join('~');
}

type RGB = NSPanel.RGB;
type PageItem = NSPanel.PageItem;
type PageType = NSPanel.PageType;
type Config = NSPanel.Config;
type PageEntities = NSPanel.PageEntities;
type PageChart = NSPanel.PageChart;
type PagePower = NSPanel.PagePower;
type PageGrid = NSPanel.PageGrid;
type PageQR = NSPanel.PageQR;
type PageGrid2 = NSPanel.PageGrid2;
type PageMedia = NSPanel.PageMedia;
type PageThermo = NSPanel.PageThermo;
type PageUnlock = NSPanel.PageUnlock;
type PageAlarm = NSPanel.PageAlarm;



/**
 * 
 * @param time  object { hour: number, minutes: number } | number: Time as number in ms
 * @param repeatTime in seconds
 * @param callback what todo
 * @returns 
 */
function adapterSchedule(time: {hour?: number, minute?: number} | undefined | number, repeatTime: number, callback: () => void): number|null {
    if (typeof callback !== 'function') return null
    const ref = Math.random() + 1;
    scheduleList[ref] = setTimeout(_schedule, 1, time, ref, repeatTime, callback), true;
    return ref;
}

function _schedule(time: {hour?: number, minute?: number} | undefined | number, ref: number, repeatTime: number, callback, init: boolean = false) {
    if (!scheduleList[ref]) return;
    if (!init) callback();
    let targetTime: number;
    if ( time === undefined) {
        targetTime = new Date().setMilliseconds(0) + repeatTime * 1000;
        time = targetTime;
    } else if (typeof time === 'number') {
        targetTime = time + repeatTime * 1000;
        time = targetTime;
    } else {
        time.hour = time.hour !== undefined ? time.hour : -1;
        time.minute = time.minute !== undefined ? time.minute : 0;
        targetTime = time.hour !== -1 ? new Date().setHours(time.hour, time.minute, 0, 0) : new Date().setMinutes(time.minute, 0, 0);
        if (new Date().getTime() >= targetTime) {
            targetTime += repeatTime * 1000;
            targetTime = time.hour !== -1 ? new Date(targetTime).setHours(time.hour, time.minute, 0, 0) : new Date(targetTime).setMinutes(time.minute, 0, 0);
        }
    }
    const timeout = targetTime - new Date().getTime();
    scheduleList[ref] = setTimeout(_schedule, timeout, time, ref, repeatTime, callback);
}
function _clearSchedule(ref: number): null {
    if (scheduleList[ref]) clearTimeout(scheduleList[ref]);
    delete scheduleList[ref];
    return null;
}  
const ArrayPlayerTypeWithMediaDevice = ['alexa2', 'sonos', 'squeezeboxrpc'] as const
const ArrayPlayerTypeWithOutMediaDevice = ['spotify-premium', 'volumio', 'bosesoundtouch'] as const

function isPlayerWithMediaDevice (F: string | NSPanel._PlayerTypeWithMediaDevice): F is NSPanel._PlayerTypeWithMediaDevice {
    return ArrayPlayerTypeWithMediaDevice.indexOf(F as NSPanel._PlayerTypeWithMediaDevice) != -1;
}
/** check if NSPanel.adapterPlayerInstanceType has all Playertypes */
function checkSortedPlayerType(F: NSPanel.notSortedPlayerType) {
    const test: NSPanel.adapterPlayerInstanceType = F;
}

function isMediaOptional(F: string | NSPanel.mediaOptional): F is NSPanel.mediaOptional {
    switch(F as NSPanel.mediaOptional) {
        case "seek":
        case "crossfade":
        case "speakerlist":
        case "playlist":
        case "tracklist":
        case "equalizer":
        case "repeat":
        case "favorites":
            return true;
        default:
            return false
    }
}

function isEventMethod(F: string | NSPanel.EventMethod): F is NSPanel.EventMethod {
    switch(F as NSPanel.EventMethod) {
        case "startup":
        case "sleepReached":
        case "pageOpenDetail":
        case "buttonPress2":
        case "renderCurrentPage":
        case "button1":
        case "button2":
            return true;
        default:
            // Have to talk about this.
            log(`Please report to developer: Unknown NSPanel.EventMethod: ${F} `, 'warn');
            return false;
    }
}

function isPopupType(F: NSPanel.PopupType | string): F is NSPanel.PopupType {
    switch(F as NSPanel.PopupType) {
        case "popupFan":
        case "popupInSel":
        case "popupLight":
        case "popupLightNew":
        case "popupNotify":
        case "popupShutter":
        case "popupThermo":
        case "popupTimer":
            return true;
        default:
            log(`Please report to developer: Unknown NSPanel.PopupType: ${F} `, 'warn');
            return false;
    }
}
// If u get a error here u forgot something in PagetypeType or PageType
function checkPageType(F: NSPanel.PagetypeType, A: NSPanel.PageType) {
    A.type = F;
}
function isPageMediaItem(F: NSPanel.PageItem | NSPanel.PageMediaItem):F is NSPanel.PageMediaItem {
    return  'adapterPlayerInstance' in F
}

function isPageThermoItem(F: PageItem | NSPanel.PageThermoItem):F is NSPanel.PageThermoItem {
    return  'popupThermoMode1' in F;
}

function isPageMedia(F: NSPanel.PageType | NSPanel.PageMedia):F is NSPanel.PageMedia {
    return F.type == 'cardMedia';
}
function isPagePower(F: NSPanel.PageType | NSPanel.PagePower):F is NSPanel.PagePower {
    return F.type == 'cardPower';
}

namespace NSPanel {
    export type PopupType = 'popupFan' | 'popupInSel' | 'popupLight' | 'popupLightNew' | 'popupNotify' | 'popupShutter' | 'popupThermo' | 'popupTimer' 



    export type EventMethod = 'startup' | 'sleepReached' | 'pageOpenDetail' | 'buttonPress2' | 'renderCurrentPage' | 'button1' | 'button2'
    export type panelRecvType = {
        event: 'event';
        method: EventMethod
    }


    export type SerialType = 'button' | 'light' | 'shutter' | 'text' | 'input_sel' | 'timer' | 'number' | 'fan' 

    export type roles = 'light' |'socket'|'dimmer'| 'hue' | 'rgb' | 'rgbSingle' | 'ct' | 'blind' | 'door' | 'window' | 'volumeGroup' | 'volume' 
        | 'info' | 'humidity' | 'temperature' | 'value.temperature' | 'value.humidity' | 'sensor.door' | 'sensor.window' | 'thermostat' | 'warning'
        | 'cie' | 'gate' | 'motion' | 'buttonSensor' | 'button' | 'value.time' | 'level.timer' | 'value.alarmtime' | 'level.mode.fan' | 'lock' | 'slider'  
        | 'switch.mode.wlan' | 'media' | 'timeTable' | 'airCondition'

    export type ButtonActionType = 'bExit' | 'bUp' | 'bNext' | 'bSubNext' | 'bPrev' | 'bSubPrev' | 'bHome' | 'notifyAction' | 'OnOff' | 'button' | 'up' | 'stop' | 'down'
        | 'positionSlider' | 'tiltOpen' | 'tiltStop' | 'tiltSlider' | 'tiltClose' | 'brightnessSlider' | 'colorTempSlider' | 'colorWheel' | 'tempUpd' | 'tempUpdHighLow' | 'media-back'
        | 'media-pause' | 'media-next' | 'media-shuffle' | 'volumeSlider' | 'mode-speakerlist' | 'mode-playlist' | 'mode-tracklist' | 'mode-repeat' | 'mode-equalizer' | 'mode-seek' | 'mode-crossfade'
        | 'mode-favorites' | 'mode-insel' | 'media-OnOff' | 'timer-start' | 'timer-pause' | 'timer-cancle' | 'timer-finish' | 'hvac_action' | 'mode-modus1' | 'mode-modus2' | 'mode-modus3' | 'number-set'
        | 'mode-preset_modes' | 'A1' | 'A2' | 'A3' | 'A4' | 'D1' | 'U1' | 'f1Icon' | 'f2Icon' | 'f3Icon' | 'f4Icon' | 'f5Icon' 
        


    export type RGB = {
        red: number,
        green: number,
        blue: number
    };

    export type Payload = {
        payload: string;
    };

    export type PageBaseType = {
        type: PagetypeType,
        uniqueName?: string,
        heading: string,
        items: PageItem[],
        useColor: boolean,
        subPage?: boolean,
        parent?: PageType,
        parentIcon?: string,
        parentIconColor?: RGB,
        prev?: string,
        prevIcon?: string,
        prevIconColor?: RGB,
        next?: string,
        nextIcon?: string,
        nextIconColor?: RGB,
        home?: string,
        homeIcon?: string,
        homeIconColor?: RGB,
        hiddenByTrigger?: boolean
    };


    export type PagetypeType = 'cardChart' | 'cardLChart' | 'cardEntities' |'cardGrid'|'cardGrid2'|'cardThermo'|'cardMedia'|'cardUnlock'|'cardQR'|'cardAlarm'|'cardPower' //| 'cardBurnRec'

    export type PageType = PageChart | PageEntities | PageGrid | PageGrid2 | PageThermo | PageMedia | PageUnlock | PageQR | PageAlarm | PagePower

    export type PageEntities = {
        type: 'cardEntities',
        items: [PageItem?, PageItem?, PageItem?, PageItem?, PageItem?],
    } & PageBaseType

    export type PageGrid = {
        type: 'cardGrid',
        items: [PageItem?, PageItem?, PageItem?, PageItem?, PageItem?, PageItem?],
    } & PageBaseType

    export type PageGrid2 = {
        type: 'cardGrid2',
        items: [PageItem?, PageItem?, PageItem?, PageItem?, PageItem?, PageItem?, PageItem?, PageItem?, PageItem?],
    } & PageBaseType

    export type PageThermo = {
        type: 'cardThermo',
        items: [PageThermoItem],
        
    } & Omit<PageBaseType, 'useColor'>

    export type PageMedia = {
        type: 'cardMedia',
        items: [PageMediaItem],
    } & Omit<PageBaseType, 'useColor' | 'autoCreateAlias'>

    
    export type PageAlarm = {
        type: 'cardAlarm',
        items: [PageItem],
    } & Omit<PageBaseType, 'useColor'>

    export type PageUnlock = {
        type: 'cardUnlock',
        items: [PageItem],
    } & Omit<PageBaseType, 'useColor'> & Partial<Pick<PageBaseType, 'useColor'>>

    export type PageQR = {
        type: 'cardQR',
        items: [PageItem],
    } & Omit<PageBaseType, 'useColor'>

    export type PagePower = {
        type: 'cardPower',
        items: [PageItem],
    } & Omit<PageBaseType, 'useColor'>

    export type PageChart = {
        type: 'cardChart' | 'cardLChart',
        items: PageItem[],
    } & Omit<PageBaseType, 'useColor'>

    export type PageItem = PageBaseItem | PageMediaItem | PageThermoItem

    export type PageMediaItem = {
        adapterPlayerInstance: adapterPlayerInstanceType,
        mediaDevice?: string,
        colorMediaIcon?: RGB,
        colorMediaArtist?: RGB,
        colorMediaTitle?: RGB,
        speakerList?: string[],
        playList?: string[],
        equalizerList?: string[],
        repeatList?: string[],
        globalTracklist?: string[],
        crossfade?: boolean, 
    } & PageBaseItem

    export type PageThermoItem = {
        popupThermoMode1?: string[],
        popupThermoMode2?: string[],
        popupThermoMode3?: string[],
        popUpThermoName?: string[],
        setThermoAlias?: string[],
        setThermoDestTemp2?: string,
    } & PageBaseItem |
    {
        popupThermoMode1?: string[],
        popupThermoMode2?: string[],
        popupThermoMode3?: string[],
        popUpThermoName?: string[],
        setThermoAlias?: string[],
        setThermoDestTemp2?: string,
    } & PageBaseItem
    // mean string start with getState(' and end with ').val
    type getStateID = string;
    export type PageBaseItem = {
        uniqueName?: string,
        role?: string,
        id?: string | null,
        icon?: string,
        icon2?: string,
        onColor?: RGB,
        offColor?: RGB,
        useColor?: boolean,
        interpolateColor?: boolean,
        minValueBrightness?: number,
        maxValueBrightness?: number,
        minValueColorTemp?: number,
        maxValueColorTemp?: number,
        minValueLevel?: number,
        maxValueLevel?: number,
        minValueTilt?: number,
        maxValueTilt?: number,
        minValue?: number,
        maxValue?: number,
        stepValue?: number,
        prefixName?: string,
        suffixName?: string,
        name?: string | getStateID,
        secondRow?: string,
        buttonText?: string,
        unit?: string,
        navigate?: boolean,
        colormode?: string,
        colorScale?: IconScaleElement, 
        targetPage?: string,
        modeList?: string[],
        hidePassword?: boolean,
        autoCreateALias?: boolean
        yAxis?: string,
        yAxisTicks?: number[] | string,
        xAxisDecorationId?: string,
        useValue?: boolean,
        monobutton?: boolean,
        inSel_ChoiceState?: boolean,
        iconArray?: string[],
        fontSize?: number,
        actionStringArray?: string[],
        alwaysOnDisplay?: boolean,
    }

    export type DimMode = {
        dimmodeOn: (boolean | undefined),
        brightnessDay: (number | undefined),
        brightnessNight: (number | undefined),
        timeDay: (string | undefined),
        timeNight: (string | undefined)
    }

    export type ConfigButtonFunction = {
        mode: 'page' | 'toggle' | 'set' | null,
        page: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | PageGrid2 | PagePower | PageChart | PageUnlock | null),
        entity: string | null,
        setValue: string | number | boolean | null
        setOn?: {dp:string, val:iobJS.StateValue}
        setOff?: {dp:string, val:iobJS.StateValue};
    }

    export type Config = {
        panelRecvTopic: string,
        panelSendTopic: string,
        weatherEntity: string,
        leftScreensaverEntity: leftScreensaverEntityType
        bottomScreensaverEntity: ScreenSaverElement[],
        indicatorScreensaverEntity: indicatorScreensaverEntityType
        mrIcon1ScreensaverEntity: ScreenSaverMRElement,
        mrIcon2ScreensaverEntity: ScreenSaverMRElement,
        defaultColor: RGB,
        defaultOnColor: RGB,
        defaultOffColor: RGB,
        defaultBackgroundColor: RGB,
        pages: PageType[],
        subPages: PageType[],
        button1: ConfigButtonFunction,
        button2: ConfigButtonFunction
    }
    export type leftScreensaverEntityType = [ScreenSaverElementWithUndefined, ScreenSaverElementWithUndefined, ScreenSaverElementWithUndefined] | [];
    export type indicatorScreensaverEntityType = [ScreenSaverElementWithUndefined?, ScreenSaverElementWithUndefined?, ScreenSaverElementWithUndefined?, ScreenSaverElementWithUndefined?, ScreenSaverElementWithUndefined?] | [];
    export type ScreenSaverElementWithUndefined = null | undefined | ScreenSaverElement
    export type ScreenSaverElement = {
        ScreensaverEntity: string,
        ScreensaverEntityText: string,
        ScreensaverEntityFactor?: number,
        ScreensaverEntityDecimalPlaces?: number,
        ScreensaverEntityDateFormat?: Intl.DateTimeFormatOptions,
        ScreensaverEntityIconOn?: string | null,
        ScreensaverEntityIconOff?: string | null,
        ScreensaverEntityUnitText?: string,
        ScreensaverEntityIconColor?: RGB | IconScaleElement | string
        ScreensaverEntityOnColor?: RGB
        ScreensaverEntityOffColor?: RGB
        ScreensaverEntityOnText?: string | null,
        ScreensaverEntityOffText?: string | null,
        ScreensaverEntityNaviToPage?: PageType
    }

    export type ScreenSaverMRElement = {
        ScreensaverEntity: string | null,
        ScreensaverEntityIconOn: string | null,
        ScreensaverEntityIconSelect?: {[key: string]: string} | null | undefined,
        ScreensaverEntityIconOff: string | null,
        ScreensaverEntityValue: string | null,
        ScreensaverEntityValueDecimalPlace: number | null,
        ScreensaverEntityValueUnit: string | null,
        ScreensaverEntityOnColor: RGB,
        ScreensaverEntityOffColor: RGB
    }
    export type ScreenSaverMRDataElement = {
        ScreensaverEntity: string | number | boolean | null,
        ScreensaverEntityIconOn: string | null,
        ScreensaverEntityIconOff: string | null,
        ScreensaverEntityValue: string | number | boolean | null,
        ScreensaverEntityValueDecimalPlace: number | null,
        ScreensaverEntityValueUnit: string | null,
        ScreensaverEntityOnColor: RGB,
        ScreensaverEntityOffColor: RGB
        ScreensaverEntityIconSelect: {[key: string]: string} | null,
    }

    export type IconScaleElement = { 
        val_min:number, 
        val_max:number, 
        val_best?: number
    }
    /** we need this to have a nice order when using switch() */
    export type adapterPlayerInstanceType =
    'alexa2.0.' | 'alexa2.1.'| 'alexa2.2.' | 'alexa2.3.' | 'alexa2.4.' | 'alexa2.5.' | 'alexa2.6.' | 'alexa2.7.' | 'alexa2.8.' | 'alexa2.9.' 
    | 'sonos.0.' | 'sonos.1.' | 'sonos.2.' | 'sonos.3.' | 'sonos.4.' | 'sonos.5.' | 'sonos.6.' | 'sonos.7.' | 'sonos.8.' | 'sonos.9.' 
    | 'spotify-premium.0.' | 'spotify-premium.1.' | 'spotify-premium.2.' | 'spotify-premium.3.' | 'spotify-premium.4.' | 'spotify-premium.5.' | 'spotify-premium.6.' | 'spotify-premium.7.' | 'spotify-premium.8.' | 'spotify-premium.9.' 
    | 'volumio.0.' | 'volumio.1.' | 'volumio.2.' | 'volumio.3.' |'volumio.4.' | 'volumio.5.' | 'volumio.6.' | 'volumio.7.' | 'volumio.8.' | 'volumio.9.' 
    | 'squeezeboxrpc.0.' | 'squeezeboxrpc.1.' | 'squeezeboxrpc.2.' | 'squeezeboxrpc.3.' | 'squeezeboxrpc.4.' | 'squeezeboxrpc.5.' | 'squeezeboxrpc.6.' | 'squeezeboxrpc.7.' | 'squeezeboxrpc.8.' | 'squeezeboxrpc.9.' 
    | 'bosesoundtouch.0.' | 'bosesoundtouch.1.' | 'bosesoundtouch.2.' | 'bosesoundtouch.3.' |'bosesoundtouch.4.' | 'bosesoundtouch.5.' | 'bosesoundtouch.6.' | 'bosesoundtouch.7.' | 'bosesoundtouch.8.' | 'bosesoundtouch.9.' 

    export type PlayerType = _PlayerTypeWithMediaDevice | _PlayerTypeWithOutMediaDevice;

    export type _PlayerTypeWithOutMediaDevice = typeof ArrayPlayerTypeWithOutMediaDevice[number] 
    export type _PlayerTypeWithMediaDevice = typeof ArrayPlayerTypeWithMediaDevice[number]

    export type notSortedPlayerType = `${PlayerType}.0.` | `${PlayerType}.1.` | `${PlayerType}.2.` | `${PlayerType}.3.` | `${PlayerType}.4.` | `${PlayerType}.5.` | `${PlayerType}.6.` | `${PlayerType}.7.` | `${PlayerType}.8.` | `${PlayerType}.9.`  

    export type mediaOptional = 'seek' | 'crossfade' | 'speakerlist' | 'playlist' | 'tracklist' | 'equalizer' | 'repeat' | 'favorites'

}
