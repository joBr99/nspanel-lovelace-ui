/*-----------------------------------------------------------------------
TypeScript v3.9.0.4 zur Steuerung des SONOFF NSPanel mit dem ioBroker by @Armilar / @Sternmiere / @Britzelpuf
- abgestimmt auf TFT 49 / v3.9.0 / BerryDriver 8 / Tasmota 12.3.1
@joBr99 Projekt: https://github.com/joBr99/nspanel-lovelace-ui/tree/main/ioBroker
NsPanelTs.ts (dieses TypeScript in ioBroker) Stable: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/NsPanelTs.ts
icon_mapping.ts: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/icon_mapping.ts (TypeScript muss in global liegen)
ioBroker-Unterstützung: https://forum.iobroker.net/topic/50888/sonoff-nspanel
WIKI zu diesem Projekt unter: https://github.com/joBr99/nspanel-lovelace-ui/wiki (siehe Sidebar)
Icons unter: https://htmlpreview.github.io/?https://github.com/jobr99/Generate-HASP-Fonts/blob/master/cheatsheet.html

*******************************************************************************
Achtung Änderung des Sonoff ESP-Temperatursensors
!!! Bitte "SetOption146 1" in der Tasmota-Console ausführen !!!
*******************************************************************************
In bestimmten Situationen kommt es vor, dass sich das Panel mit FlashNextion
unter Tasmota > 12.2.0 nicht flashen lässt. Für den Fall ein Tasmota Downgrade 
durchführen und FlashNextion wiederholen.
*******************************************************************************

ReleaseNotes:
    Bugfixes und Erweiterungen:
        - 07.10.2022 - v3.5.0   Upgrade TFT 43
        - 07.10.2022 - v3.5.0   Add Backgroundcolor to Pages
        - 08.10.2022 - v3.5.0   Add Tilt-Slider and TILT_Functions (Open/Stop/Close) to Blinds/Cover/Shutter popUp
        - 12.10.2022 - v3.5.0   Add PageNavigation via Datapoint
        - 25.10.2022 - v3.5.0   Add New Parameters to popUpNotify / Layout 2
        - 26.10.2022 - v3.5.0.1 Fix Thermostat for tado Support (by Sternmiere)
        - 27.10.2022 - v3.5.0.1 Add VirtualDevice Gate
        - 27.10.2022 - v3.5.0.2 Applied Boy Scout Rule (Fixed some typos, changed var to let, fixed min/max colorTemp Bug)
        - 30.10.2022 - v3.5.0.3 Fixed Media Play/Pause icon for alexa (and others) devices
        - 31.10.2022 - v3.5.0.4 Reengineering Media Subscriptions
        - 02.11.2022 - v3.5.0.5 Page navigation continues with page 0 from the last page
        - 04.11.2022 - v3.5.0.5 Create Auto-Alias for Service Pages
        - 07.11.2022 - v3.5.0.5 Create Auto-Alias for Alexa2, Spotify-Premium, Sonos
        - 08.11.2022 - v3.5.0.5 Create Auto-Alias for Wheather-Forcast (Screensaver Big-Icon)
        - 07.10.2022 - v3.6.0   Upgrade TFT 45
        - 09.11.2022 - v3.6.0   Add new Alias-DeviceTyp cie (control colors with XY)
        - 16.11.2022 - v3.6.0   Control Relay 1 + 2 via Datapoints
        - 17.11.2022 - v3.6.0   Add Datapoint to Control Screensaver-Dimmode
        - 17.11.2022 - v3.6.0   Change to Page after bExit 
        - 18.11.2022 - v3.6.0   Add cardChart by fumanchi (only on DEV)
        - 24.11.2022 - v3.6.0   Add Background Color Switch via DP
        - 26.11.2022 - v3.6.0   Add cardMedia Colors
        - 26.11.2022 - v3.6.0   Add cardThermostat Popup 
        - 28.11.2022 - v3.6.0.1 Bugfix in bExit
        - 29.11.2022 - v3.6.0.2 Update Berry Version 6
        - 30.11.2022 - v3.6.0.3 Bugfix string/number compare current BerryDriver (DP as string)
        - 05.12.2022 - v3.6.0.4 Add bHome to Navigation
        - 05.12.2022 - v3.6.0.4 Add changeable Center-Icon in cardPower with Color and Value
        - 08.12.2022 - v3.6.0.4 Bugfix - Use MRIcons in Screensaver with null
        - 13.12.2022 - v3.6.0.4 Add Sensor-Values to cardGrid
        - 13.12.2022 - v3.6.0.4 Hotfix - Update screensaver temperature without weather forecast
        - 14.12.2022 - v3.7.0   Move Config "active" to DP activeBrightness and add DP activeDimmodeBrightness
        - 19.12.2022 - v3.7.0   Change weather icons for exceptional (window-close)
        - 19.12.2022 - v3.7.0   Add DasWetter / Add DasWetter in create AutoAlias / Const MinMax
        - 19.11.2022 - v3.7.0   Add cardChart on PROD (implemented but working with v3.7.0 --> next TFT)
        - 10.12.2022 - v3.7.0   Add Shuffle to Media Player
        - 10.12.2022 - v3.7.0   Remove Old Speakerlist and Add 5 GridCard Control PageItems
        - 10.12.2022 - v3.7.0   Add In_Sel PopUp to cardMedia
        - 15.12.2022 - v3.7.0   Add alternate MRIcon Size
        - 20.12.2022 - v3.7.0   Add popUpTimer / New ALIAS Type level.timer
        - 21.12.2022 - v3.7.0   Add Fan / New ALIAS Type level.mode.fan
        - 22.12.2022 - v3.7.0   Add InSel - InputSelector with Alias Type buttonSensor (DP .VALUE)
        - 23.10.2022 - v3.7.0   Upgrade TFT 46
        - 28.12.2022 - v3.7.3.0 Hotfix - bUp case
        - 28.12.2022 - v3.7.3.0 Update Berry Version 8
        - 29.12.2022 - v3.7.3.1 Hotfix - us-p - DateString - Use long/short Weekday and long/short Month
        - 29.12.2022 - v3.7.3.2 Add pageItem.id to Submenu; New Parameter targetPage by TT-TOM / @tt-tom17
        - 30.12.2022 - v3.8.0   Add New HMI-Navi
        - 01.01.2023 - v3.8.0   Add Tasmota "Web Admin Password"
        - 02.01.2023 - v3.8.0   Add Navigation bSubPrev and bSubNext and Subpages for bHome
        - 03.01.2023 - v3.8.0   Bugfix for cardThermostat - Payload (Minor)
        - 04.01.2023 - v3.8.0   Add Volumio-Player to cardMedia by @egal
        - 05.01.2023 - v3.8.0   Upgrade TFT 47
        - 06.01.2023 - v3.8.0   Add Volumio Tracklist by @egal
        - 06.01.2023 - v3.8.1   HMI-Hotfix
        - 06.01.2023 - v3.8.2   Add globalTracklist for every Volumio-Player by @egal 
        - 07.01.2023 - v3.8.3   Upgrade TFT 48
        - 08.01.2023 - v3.8.3   Add cardLChart for Line diagrams
        - 09.01.2023 - v3.8.3   Add new monobutton Functions by @ronny130286 
        - 10.01.2023 - v3.8.3   Add Repeat-Button and external Tracklists/Queues to Volumio Media-Player by @egal
        - 11.01.2023 - v3.8.3   Add configurable navigation buttons by @ravenst0ne (v3.8.1.1)
        - 11.01.2023 - v3.8.3   Add Char"€" to HMI
        - 11.01.2023 - v3.8.3   Fix Switch-Off for Color Lights
        - 15.01.2023 - v3.9.0   Fix bExit if externel bExit page is set in DP
        - 16.01.2023 - v3.9.0   Add Values, Decimal Places to mrIcons
        - 16.01.2023 - v3.9.0   Preparation of the cardPower for TFT 3.9.0 --> New Payload
        - 16.01.2023 - v3.9.0   Preparation of the cardAlarm for TFT 3.9.0 --> New Payload and Add heading
        - 16.01.2023 - v3.9.0   Add configurable navigation buttons for top level pages and icon colors by @ravenst0ne (v3.8.3.1)
        - 18.01.2023 - v3.9.0   Add new ServicePages, Reboot and Update DP's inlc. Auto-Alias
        - 19.01.2023 - v3.9.0   Add Indicator Color Scales to Info Aliases
        - 20.01.2023 - v3.9.0   Move TS-Config-Parameters to 0_userdata NSPanel-Config
        - 22.01.2023 - v3.9.0   Refactoring Screensaver (HMI)
        - 24.01.2023 - v3.9.0   New Function "Check Config Parameters"
        - 25.01.2023 - v3.9.0   Fix Tasmota- Firmware-Upgrade with Safeboot
        - 27.01.2023 - v3.9.0   Add getState in PageItem.name with prefix and suffix
        - 28.01.2023 - v3.9.0   Fix TFT-Version Path in function update_tft_firmware (drop ".")
        - 29.01.2023 - v3.9.0   Upgrade TFT 49
	- 03.02.2023 - v3.9.0.2 Hotfix Screensaver bExit
	- 06.02.2023 - v3.9.0.3 PR #754 - added missing 'tempUpdHighLow' ButtonEvent handling - by @fre4242	
	- 07.02.2023 - v3.9.0.4 Open activepage again after closing popupLight or popupShutter

        Todo Next Release
        - XX.XX.2023 - v4.0.0   Add cardUnlock 
        
*****************************************************************************************************************
* Falls Aliase durch das Skript erstellt werden sollen, muss in der JavaScript Instanz "setObect" gesetzt sein! *
*****************************************************************************************************************

Wenn Rule definiert, dann können die Hardware-Tasten ebenfalls für Seitensteuerung (dann nicht mehr als Relais) genutzt werden

Tasmota Konsole:
    Rule2 on Button1#state do Publish %topic%/%prefix%/RESULT {"CustomRecv":"event,button1"} endon on Button2#state do Publish %topic%/%prefix%/RESULT {"CustomRecv":"event,button2"} endon
    Rule2 1 (Rule aktivieren)
    Rule2 0 (Rule deaktivieren)

Mögliche Seiten-Ansichten:
    screensaver Page    - wird nach definiertem Zeitraum (config) mit Dimm-Modus aktiv (Uhrzeit, Datum, Aktuelle Temperatur mit Symbol)
                          (die 4 kleineren Icons können als Wetter-Vorschau + 4Tage (Symbol + Höchsttemperatur) oder zur Anzeige definierter Infos konfiguriert werden)
    cardEntities Page   - 4 vertikale angeordnete Steuerelemente - auch als Subpage
    cardGrid Page       - 6 horizontal angeordnete Steuerelemente in 2 Reihen a 3 Steuerelemente - auch als Subpage
    cardThermo Page     - Thermostat mit Solltemperatur, Isttemperatur, Mode - Weitere Eigenschaften können im Alias definiert werden
    cardMedia Page      - Mediaplayer - Ausnahme: Alias sollte mit Alias-Manager automatisch über Alexa-Verzeichnis Player angelegt werden
    cardAlarm Page      - Alarmseite mit Zustand und Tastenfeld
    cardPower Page      - Energiefluss
    cardChart Page      - Balken-Diagramme aus History, SQL ider InfluxDB
    cardLChart Page     - Linien-Diagramme aus History, SQL ider InfluxDB

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

    AccuWeather:        - Bei Nutzung der Wetterfunktionen (und zur Icon-Konvertierung) im Screensaver
    Alexa2:             - Bei Nutzung der dynamischen SpeakerList in der cardMedia
    Geräte verwalten    - Für Erstellung der Aliase
    Alias-Manager       - !!! ausschließlich für MEDIA-Alias
    MQTT-Adapter        - Für Kommunikation zwischen Skript und Tasmota
    JavaScript-Adapter

Upgrades in Konsole:
    Tasmota BerryDriver     : Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1
    TFT EU STABLE Version   : FlashNextion http://nspanel.pky.eu/lovelace-ui/github/nspanel-v3.9.0.tft
---------------------------------------------------------------------------------------
*/
let Icons = new IconsSelector();
let timeoutSlider: any;
let vwIconColor = [];
let weatherForecast: boolean;

// Ab hier Anpassungen vornehmen

const Debug = false;

let manually_Update = false;                                // bei Bedarf anpassen

const autoCreateAlias = true;                               // Für diese Option muss der Haken in setObjects in deiner javascript.X. Instanz gesetzt sein.  
const weatherAdapterInstance: string = 'accuweather.0.';    // Möglich 'accuweather.0.' oder 'daswetter.0.'
const weatherScreensaverTempMinMax: string = 'MinMax';      // Mögliche Werte: 'Min', 'Max' oder 'MinMax'

const tasmota_web_admin_user: string = 'admin';             // ändern, falls der User im Tasmota vor dem Kompilieren umbenannt wurde (Standard Tasmota: admin)
const tasmota_web_admin_password: string = '';              // setzten, falls "Web Admin Password" in Tasmote vergeben

// Setzen der bevorzugten Tasmota32-Version
const tasmotaOtaVersion: string = 'tasmota32-nspanel.bin';
// Es können ebenfalls andere Versionen verwendet werden wie zum Beispiel:
// 'tasmota32-nspanel.bin' oder 'tasmota32.bin' oder 'tasmota32-DE.bin' oder etc.

const NSPanel_Path = '0_userdata.0.NSPanel.1.';         // Anpassen an das jewilige NSPanel
const NSPanel_Alarm_Path = '0_userdata.0.NSPanel.';     // Pfad für gemeinsame Nutzung durch mehrere Panels (bei Nutzung der cardAlarm)

const AliasPath: string = 'alias.0.' + NSPanel_Path.substring(13, NSPanel_Path.length);

// Farbkonstanten zur Nutzung in den PageItems
const HMIOff:           RGB = { red:  68, green: 115, blue: 158 };     // Blau-Off - Original Entity Off
const HMIOn:            RGB = { red:   3, green: 169, blue: 244 };     // Blau-On
const HMIDark:          RGB = { red:  29, green:  29, blue:  29 };     // Original Background Color
const Off:              RGB = { red: 253, green: 128, blue:   0 };     // Orange-Off - schönere Farbübergänge
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
const colorSpotify:     RGB = { red:  30, green: 215, blue:  96 };
const colorAlexa:       RGB = { red:  49, green: 196, blue: 243 };
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

//-- Anfang der Beispiele für Seitengestaltung -- Selbstdefinierte Aliase erforderlich ----------------


//-- ENDE der Beispiele für Seitengestaltung -- Selbstdefinierte Aliase erforderlich ------------------


/***********************************************************************************************
 **  Service Pages mit Auto-Alias (Nachfolgende Seiten werden mit Alias automatisch angelegt) **
 **  https://github.com/joBr99/nspanel-lovelace-ui/wiki/NSPanel-Service-Men%C3%BC             **
 ***********************************************************************************************/

//Level_0 
let NSPanel_Service = <PageEntities>
{
    'type': 'cardEntities',
    'heading': 'NSPanel Service',
    'useColor': true,
    'items': [
        <PageItem>{ navigate: true, id: 'NSPanel_Infos', icon: 'information-outline', offColor: Menu, onColor: Menu, name: 'Infos', buttonText: 'mehr...'},
        <PageItem>{ navigate: true, id: 'NSPanel_Einstellungen', icon: 'monitor-edit', offColor: Menu, onColor: Menu, name: 'Einstellungen', buttonText: 'mehr...'},
        <PageItem>{ navigate: true, id: 'NSPanel_Firmware', icon: 'update', offColor: Menu, onColor: Menu, name: 'Firmware', buttonText: 'mehr...'},
        <PageItem>{ id: AliasPath + 'Config.rebootNSPanel', name: 'Reboot NSPanel' ,icon: 'refresh', offColor: MSRed, onColor: MSGreen, buttonText: 'Start'},
    ]
};
        //Level_1
        let NSPanel_Infos = <PageEntities>
        {
            'type': 'cardEntities',
            'heading': 'NSPanel Infos',
            'useColor': true,
            'subPage': true,
            'parent': NSPanel_Service,
            'home': 'NSPanel_Service',        
            'items': [
                <PageItem>{ navigate: true, id: 'NSPanel_Wifi_Info_1', icon: 'wifi', offColor: Menu, onColor: Menu, name: 'Wifi/WLAN', buttonText: 'mehr...'},
                <PageItem>{ navigate: true, id: 'NSPanel_Sensoren', icon: 'memory', offColor: Menu, onColor: Menu, name: 'Sensoren/Hardware', buttonText: 'mehr...'}
            ]
        };
                //Level_2
                let NSPanel_Wifi_Info_1 = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'NSPanel Wifi (1)',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Infos,
                    'next': 'NSPanel_Wifi_Info_2',
                    'items': [
                        <PageItem>{ id: AliasPath + 'ipAddress', name: 'IP-Adresse', icon: 'ip-network-outline', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.BSSId', name: 'MAC Adresse', icon: 'check-network', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.RSSI', name: 'RSSI', icon: 'signal', unit: '%', colorScale: {'val_min': 100, 'val_max': 0} },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.Signal', name: 'Wifi-Signal', icon: 'signal-distance-variant', unit: 'dBm', colorScale: {'val_min': 0, 'val_max': -100} },
                    ]
                };

                let NSPanel_Wifi_Info_2 = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'NSPanel Wifi (2)',
                    'useColor': true,
                    'subPage': true,
                    'prev': 'NSPanel_Wifi_Info_1',
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: 'alias.0.Test.Wiki_SSID', name: 'SSId', icon: 'signal-distance-variant', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.Mode', name: 'Modus', icon: 'signal-distance-variant', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.Channel', name: 'Kanal', icon: 'timeline-clock-outline', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Wifi.AP', name: 'AP', icon: 'router-wireless-settings', offColor: Menu, onColor: Menu },
                    ]
                };

                let NSPanel_Sensoren = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Sensoren (1)',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Infos,
                    'next': 'NSPanel_Hardware',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Sensor.ANALOG.Temperature', name: 'Raum Temperatur', icon: 'home-thermometer-outline', unit: '°C', colorScale: {'val_min': 0, 'val_max': 40, 'val_best': 22 } },
                        <PageItem>{ id: AliasPath + 'Sensor.ESP32.Temperature', name: 'ESP Temperatur', icon: 'thermometer', unit: '°C', colorScale: {'val_min': 0, 'val_max': 100, 'val_best': 50 } },
                        <PageItem>{ id: AliasPath + 'Sensor.TempUnit', name: 'Temperatur Einheit', icon: 'temperature-celsius', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Sensor.Time', name: 'Aktualisierung', icon: 'clock-check-outline', offColor: Menu, onColor: Menu },
                    ]
                };

                let NSPanel_Hardware = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Hardware (2)',
                    'useColor': true,
                    'subPage': true,
                    'prev': 'NSPanel_Sensoren',
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Tasmota.Product', name: 'Produkt', icon: 'devices', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Hardware', name: 'ESP32 Hardware', icon: 'memory', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Display.Model', name: 'NSPanel Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota.Uptime', name: 'Betriebszeit', icon: 'timeline-clock-outline', offColor: Menu, onColor: Menu },
                    ]
                };

        //Level_1
        let NSPanel_Einstellungen = <PageGrid>
            {
                'type': 'cardGrid',
                'heading': 'Einstellungen',
                'useColor': true,
                'subPage': true,
                'parent': NSPanel_Service,
                'home': 'NSPanel_Service',
                'items': [
                    <PageItem>{ navigate: true, id: 'NSPanel_Screensaver', icon: 'monitor-dashboard',offColor: Menu, onColor: Menu, name: 'Screensaver', buttonText: 'mehr...'},
                    <PageItem>{ navigate: true, id: 'NSPanel_Relays', icon: 'electric-switch', offColor: Menu, onColor: Menu, name: 'Relais', buttonText: 'mehr...'},
                    <PageItem>{ id:AliasPath + 'Config.temperatureUnitNumber', icon: 'gesture-double-tap', name: 'Temp. Einheit', offColor: Menu, onColor: Menu, 
                    modeList: ['°C', '°F', 'K']},
                    <PageItem>{ id: AliasPath + 'Config.localeNumber', icon: 'select-place', name: 'Sprache', offColor: Menu, onColor: Menu, 
                    modeList: ['en-US', 'de-DE', 'nl-NL', 'da-DK', 'es-ES', 'fr-FR', 'it-IT', 'ru-RU', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'af-ZA', 'ar-SY', 
                               'bg-BG', 'ca-ES', 'cs-CZ', 'el-GR', 'et-EE', 'fa-IR', 'fi-FI', 'he-IL', 'hr-xx', 'hu-HU', 'hy-AM', 'id-ID', 'is-IS', 'lb-xx', 
                               'lt-LT', 'ro-RO', 'sk-SK', 'sl-SI', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-TW']},
                                
                ]
            };

                //Level_2
                let NSPanel_Screensaver = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Einstellungen',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Einstellungen,
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ navigate: true, id: 'NSPanel_ScreensaverDimmode', icon: 'wifi', offColor: Menu, onColor: Menu, name: 'Dimmode/Sonstige', buttonText: 'mehr...'},
                        <PageItem>{ navigate: true, id: 'NSPanel_Weather', icon: 'weather-partly-rainy', offColor: Menu, onColor: Menu, name: 'Wetter', buttonText: 'mehr...'},
                        <PageItem>{ navigate: true, id: 'NSPanel_Dateformat', icon: 'calendar-expand-horizontal', offColor: Menu, onColor: Menu, name: 'Datumsformat', buttonText: 'mehr...'},
                        <PageItem>{ navigate: true, id: 'NSPanel_Indicators', icon: 'monitor-edit', offColor: Menu, onColor: Menu, name: 'Indikatoren', buttonText: 'mehr...'}
                    ]
                };
                            
                        //Level_3
                        let NSPanel_ScreensaverDimmode = <PageEntities>
                        {
                            'type': 'cardEntities',
                            'heading': 'Dimmode (1)',
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'next': 'NSPanel_ScreensaverOther',
                            'items': [
                                <PageItem>{ id: AliasPath + 'Dimmode.brightnessDay', name: 'Brightness Tag', icon: 'brightness-5', offColor: Menu, onColor: Menu, minValue: 5, maxValue: 10},
                                <PageItem>{ id: AliasPath + 'Dimmode.brightnessNight', name: 'Brightness Nacht', icon: 'brightness-4', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 4},
                                <PageItem>{ id: AliasPath + 'Dimmode.hourDay', name: 'Stunde Tag', icon: 'sun-clock', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 23},
                                <PageItem>{ id: AliasPath + 'Dimmode.hourNight', name: 'Stunde Nacht', icon: 'sun-clock-outline', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 23}
                            ]
                        };

                        //Level_3
                        let NSPanel_ScreensaverOther = <PageEntities>
                        {
                            'type': 'cardEntities',
                            'heading': 'Sonstige (2)',
                            'useColor': true,
                            'subPage': true,
                            'prev': 'NSPanel_ScreensaverDimmode',
                            'home': 'NSPanel_Service',
                            'items': [
                                <PageItem>{ id: AliasPath + 'ScreensaverInfo.activeBrightness', name: 'Helligkeit Aktiv', icon: 'brightness-5', offColor: Menu, onColor: Menu, minValue: 20, maxValue: 100},
                                <PageItem>{ id: AliasPath + 'Config.Screensaver.timeoutScreensaver', name: 'Screensaver Timeout', icon: 'clock-end', offColor: Menu, onColor: Menu, minValue: 0, maxValue: 60},
                                <PageItem>{ id: AliasPath + 'Config.Screensaver.screenSaverDoubleClick', name: 'Doppelklick Weakup' ,icon: 'gesture-two-double-tap', offColor: HMIOff, onColor: HMIOn},                                            
                                <PageItem>{ id: AliasPath + 'Config.Screensaver.alternativeScreensaverLayout', name: 'Alternativ Layout' ,icon: 'page-previous-outline', offColor: HMIOff, onColor: HMIOn},            
                            ]
                        };

                        //Level_3
                        let NSPanel_Weather = <PageEntities>
                        {
                            'type': 'cardEntities',
                            'heading': 'Wetter Parameter',
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                <PageItem>{ id: AliasPath + 'ScreensaverInfo.weatherForecast', name: 'Vorhersage Aus/An' ,icon: 'weather-sunny-off', offColor: HMIOff, onColor: HMIOn},
                                <PageItem>{ id: AliasPath + 'ScreensaverInfo.weatherForecastTimer', name: 'Vorhersage Wechsel' ,icon: 'devices', offColor: HMIOff, onColor: HMIOn},
                                <PageItem>{ id: AliasPath + 'ScreensaverInfo.entityChangeTime', name: 'Wechselzeit/s', icon: 'cog-sync', offColor: Menu, onColor: Menu, minValue: 15, maxValue: 60},
                                <PageItem>{ id: AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout', name: 'Symbolfarben' ,icon: 'format-color-fill', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                        //Level_3
                        let NSPanel_Dateformat = <PageEntities>
                        {
                            'type': 'cardEntities',
                            'heading': 'Datumsformat',
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                <PageItem>{ id: AliasPath + 'Config.Dateformat.Switch.weekday', name: 'Wochentag (lang)' ,icon: 'calendar-expand-horizontal', offColor: HMIOff, onColor: HMIOn},
                                <PageItem>{ id: AliasPath + 'Config.Dateformat.Switch.month', name: 'Monat (lang)' ,icon: 'calendar-expand-horizontal', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                        //Level_3
                        let NSPanel_Indicators = <PageEntities>
                        {
                            'type': 'cardEntities',
                            'heading': 'Indikatoren',
                            'useColor': true,
                            'subPage': true,
                            'parent': NSPanel_Screensaver,
                            'home': 'NSPanel_Service',
                            'items': [
                                <PageItem>{ id: AliasPath + 'Config.MRIcons.alternateMRIconSize.1', name: 'Icon 1 (klein/groß)' ,icon: 'format-size', offColor: HMIOff, onColor: HMIOn},
                                <PageItem>{ id: AliasPath + 'Config.MRIcons.alternateMRIconSize.2', name: 'Icon 2 (klein/groß)' ,icon: 'format-size', offColor: HMIOff, onColor: HMIOn},
                            ]
                        };

                //Level_2
                let NSPanel_Relays = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Relais',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Einstellungen,
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Relay.1', name: 'Relais 1 (aus/an)' ,icon: 'power', offColor: HMIOff, onColor: HMIOn},
                        <PageItem>{ id: AliasPath + 'Relay.2', name: 'Relais 2 (aus/an)' ,icon: 'power', offColor: HMIOff, onColor: HMIOn},
                    ]
                };

        //Level_1
        let NSPanel_Firmware = <PageEntities>
            {
                'type': 'cardEntities',
                'heading': 'Firmware',
                'useColor': true,
                'subPage': true,
                'parent': NSPanel_Service,
                'home': 'NSPanel_Service',
                'items': [
                    <PageItem>{ id: AliasPath + 'autoUpdate', name: 'Auto-Updates' ,icon: 'power', offColor: HMIOff, onColor: HMIOn},
                    <PageItem>{ navigate: true, id: 'NSPanel_FirmwareTasmota', icon: 'usb-flash-drive', offColor: Menu, onColor: Menu, name: 'Tasmota Firmware', buttonText: 'mehr...'},
                    <PageItem>{ navigate: true, id: 'NSPanel_FirmwareBerry', icon: 'usb-flash-drive', offColor: Menu, onColor: Menu, name: 'Berry-Driver', buttonText: 'mehr...'},
                    <PageItem>{ navigate: true, id: 'NSPanel_FirmwareNextion', icon: 'cellphone-cog', offColor: Menu, onColor: Menu, name: 'Nextion TFT', buttonText: 'mehr...'}
                ]
            };

                let NSPanel_FirmwareTasmota = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Tasmota',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Tasmota.Version', name: 'Installierte Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Tasmota_Firmware.onlineVersion', name: 'Verfügbare Version', offColor: Menu, onColor: Menu },                        
                        <PageItem>{ id: 'Divider' },
                        <PageItem>{ id: AliasPath + 'Config.Update.UpdateTasmota', name: 'Tasmota Update' ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: 'Start'},
                    ]
                };

                let NSPanel_FirmwareBerry = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Berry-Driver',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Display.BerryDriver', name: 'Installierte Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Berry_Driver.onlineVersion', name: 'Verfügbare Version', offColor: Menu, onColor: Menu},                        
                        <PageItem>{ id: 'Divider' },
                        <PageItem>{ id: AliasPath + 'Config.Update.UpdateBerry', name: 'Berry-Driver Update' ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: 'Start'},
                    ]
                };

                let NSPanel_FirmwareNextion = <PageEntities>
                {
                    'type': 'cardEntities',
                    'heading': 'Nextion TFT',
                    'useColor': true,
                    'subPage': true,
                    'parent': NSPanel_Firmware,
                    'home': 'NSPanel_Service',
                    'items': [
                        <PageItem>{ id: AliasPath + 'Display_Firmware.TFT.currentVersion', name: 'Installierte Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Display_Firmware.TFT.desiredVersion', name: 'Benötigte Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Display.Model', name: 'NSPanel Version', offColor: Menu, onColor: Menu },
                        <PageItem>{ id: AliasPath + 'Config.Update.UpdateNextion', name: 'Nextion TFT Update' ,icon: 'refresh', offColor: HMIOff, onColor: MSGreen, buttonText: 'Start'},
                    ]
                };

// Ende der Service Pages

/***********************************************************************
 **                                                                   **
 **                           Configuration                           **
 **                                                                   **
 ***********************************************************************/

export const config: Config = {
    panelRecvTopic: 'mqtt.0.SmartHome.NSPanel_1.tele.RESULT',       // Bitte anpassen
    panelSendTopic: 'mqtt.0.SmartHome.NSPanel_1.cmnd.CustomSend',   // Bitte anpassen

    // 4 kleine Icons im Screensaver
    // Mit 3.9.0 neue Parameter - Bitte anpassen - siehe auch Wiki
    firstScreensaverEntity:   { ScreensaverEntity: 'accuweather.0.Hourly.h0.PrecipitationProbability',
                                ScreensaverEntityFactor: 1,                                 //New
                                ScreensaverEntityDecimalPlaces: 0,                          //New 
                                ScreensaverEntityIcon: 'weather-pouring', 
                                ScreensaverEntityText: 'Regen', 
                                ScreensaverEntityUnitText: '%', 
                                ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 100} 
                              },
    secondScreensaverEntity:  { ScreensaverEntity: 'accuweather.0.Current.WindSpeed', 
                                ScreensaverEntityFactor: (1000/3600),                       //New
                                ScreensaverEntityDecimalPlaces: 1,                          //New 
                                ScreensaverEntityIcon: 'weather-windy', 
                                ScreensaverEntityText: "Wind", 
                                ScreensaverEntityUnitText: 'm/s', 
                                ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 35} 
                              },
    thirdScreensaverEntity:   { ScreensaverEntity: 'accuweather.0.Current.UVIndex',
                                ScreensaverEntityFactor: 1,                                 //New
                                ScreensaverEntityDecimalPlaces: 0,                          //New  
                                ScreensaverEntityIcon: 'solar-power', 
                                ScreensaverEntityText: 'UV', 
                                ScreensaverEntityUnitText: '', 
                                ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 9} 
                              },
    fourthScreensaverEntity:  { ScreensaverEntity: 'accuweather.0.Current.RelativeHumidity', 
                                ScreensaverEntityFactor: 1,                                 //New
                                ScreensaverEntityDecimalPlaces: 0,                          //New 
                                ScreensaverEntityIcon: 'water-percent', 
                                ScreensaverEntityText: 'Luft', 
                                ScreensaverEntityUnitText: '%', 
                                ScreensaverEntityIconColor: {'val_min': 0, 'val_max': 100, 'val_best': 65} 
                              },

    // Indikator Icons im oberen Teil des Screensavers
    // Mit 3.9.0 neue Parameter - Bitte anpassen - siehe auch Wiki
    mrIcon1ScreensaverEntity: { ScreensaverEntity: 'mqtt.0.SmartHome.NSPanel_1.stat.POWER1', 
                                ScreensaverEntityIconOn: 'lightbulb',                           //Rename
                                ScreensaverEntityIconOff: null, 
                                ScreensaverEntityValue: null,                                   //New
                                ScreensaverEntityValueDecimalPlace : 0,                         //New
                                ScreensaverEntityValueUnit: null,                               //New
                                ScreensaverEntityOnColor: On, 
                                ScreensaverEntityOffColor: HMIOff },
    mrIcon2ScreensaverEntity: { ScreensaverEntity: 'mqtt.0.SmartHome.NSPanel_1.stat.POWER2', 
                                ScreensaverEntityIconOn: 'heat-wave',
                                ScreensaverEntityIconOff: null, 
                                ScreensaverEntityValue: NSPanel_Path + 'Sensor.ANALOG.Temperature',
                                ScreensaverEntityValueDecimalPlace : 1,
                                ScreensaverEntityValueUnit: '°', 
                                ScreensaverEntityOnColor: MSRed, 
                                ScreensaverEntityOffColor: Yellow },

    weatherEntity: 'alias.0.Wetter',    // Dieser Alias wird automatisch für den gewählten Wetter erstellt und kann entsprechend angepasst werden
    defaultOffColor: Off,               // Default-Farbe für Off-Zustände
    defaultOnColor: On,                 // Default-Farbe für On-Zustände
    defaultColor: Off,
    defaultBackgroundColor: HMIDark,    // Default-Hintergrundfarbe HMIDark oder Black

    // Mit 3.9.0 in Datenpunkte verschoben. Auch über Service Pages konfigurierbar
        //alternativeScreensaverLayout: false,
        //autoWeatherColorScreensaverLayout: true,
        //timeoutScreensaver: 10,
        //screenSaverDoubleClick: true,
        //temperatureUnit: '°C',
        //locale: 'de-DE',                    

    pages: [

            NSPanel_Service         //Auto-Alias Service Page
    ],
    subPages: [
                
                NSPanel_Infos,                          //Auto-Alias Service Page
                    NSPanel_Wifi_Info_1,                //Auto-Alias Service Page
                    NSPanel_Wifi_Info_2,                //Auto-Alias Service Page
                    NSPanel_Sensoren,                   //Auto-Alias Service Page
                    NSPanel_Hardware,                   //Auto-Alias Service Page
                NSPanel_Einstellungen,                  //Auto-Alias Service Page
                    NSPanel_Screensaver,                //Auto-Alias Service Page
                        NSPanel_ScreensaverDimmode,     //Auto-Alias Service Page
                        NSPanel_ScreensaverOther,       //Auto-Alias Service Page
                        NSPanel_Weather,                //Auto-Alias Service Page
                        NSPanel_Dateformat,             //Auto-Alias Service Page
                        NSPanel_Indicators,             //Auto-Alias Service Page
                        NSPanel_Relays,                 //Auto-Alias Service Page
                NSPanel_Firmware,                       //Auto-Alias Service Page
                    NSPanel_FirmwareTasmota,            //Auto-Alias Service Page
                    NSPanel_FirmwareBerry,              //Auto-Alias Service Page
                    NSPanel_FirmwareNextion,            //Auto-Alias Service Page
    ],
    button1Page: null,   //Beispiel-Seite auf Button 1, wenn Rule2 definiert - Wenn nicht definiert --> button1Page: null, 
    button2Page: null    //Beispiel-Seite auf Button 2, wenn Rule2 definiert - Wenn nicht definiert --> button1Page: null,
};



// _________________________________ Ab hier keine Konfiguration mehr _____________________________________

const request = require('request');

//Desired Firmware
const tft_version: string = 'v3.9.0';
const desired_display_firmware_version = 49;
const berry_driver_version = 8;
const tasmotaOtaUrl: string = 'http://ota.tasmota.com/tasmota32/release/';

let useMediaEvents: boolean = false;
let timeoutMedia: any;
let timeoutPower: any;
let bgColorScrSaver: number = 0;
let globalTracklist: any;

async function Init_Release() {
    const FWVersion = [41,42,43,44,45,46,47,48,49,50,51]
    const FWRelease = ['3.3.1','3.4.0','3.5.0','3.5.X','3.6.0','3.7.3','3.8.0','3.8.3','3.9.0','4.0.0','4.1.0']
    try {
        if (existsObject(NSPanel_Path + 'Display_Firmware.desiredVersion') == false) {
            await createStateAsync(NSPanel_Path + 'Display_Firmware.desiredVersion', desired_display_firmware_version, { type: 'number' });
        } else {
            await setStateAsync(NSPanel_Path + 'Display_Firmware.desiredVersion', desired_display_firmware_version);
        }

        if (existsObject(NSPanel_Path + 'Config.Update.activ') == false) {
            await createStateAsync(NSPanel_Path + 'Config.Update.activ', 1, { type: 'number' });
        } else {
            await setStateAsync(NSPanel_Path + 'Config.Update.activ', 0);
        }

        let currentFW = 0;
        let findFWIndex = 0;
        console.log('Desired TFT Firmware: ' + desired_display_firmware_version + ' / ' + tft_version);
        if (existsObject(NSPanel_Path + 'Display_Firmware.currentVersion')) {
            currentFW = parseInt(getState(NSPanel_Path + 'Display_Firmware.currentVersion').val);
            findFWIndex = FWVersion.indexOf(currentFW);
            console.log('Installed TFT Firmware: ' + currentFW + ' / v' + FWRelease[findFWIndex]);
        }
        //Create Long Term
        if (existsObject(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion') == false) {
            //Create TFT DP's
            await createStateAsync(NSPanel_Path + 'Display_Firmware.TFT.currentVersion', currentFW + ' / v' + FWRelease[findFWIndex], { type: 'string' });
            await createStateAsync(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', desired_display_firmware_version, { type: 'string' });
            setObject(AliasPath + 'Display_Firmware.TFT.currentVersion', {type: 'channel', common: {role: 'info', name:'current TFT-Version'}, native: {}});
            setObject(AliasPath + 'Display_Firmware.TFT.desiredVersion', {type: 'channel', common: {role: 'info', name:'desired TFT-Version'}, native: {}});
            await createAliasAsync(AliasPath + 'Display_Firmware.TFT.currentVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.TFT.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Display_Firmware.TFT.desiredVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });        
        } else {
            //Create TFT DP's
            await setStateAsync(NSPanel_Path + 'Display_Firmware.TFT.currentVersion', currentFW + ' / v' + FWRelease[findFWIndex]);
            await setStateAsync(NSPanel_Path + 'Display_Firmware.TFT.desiredVersion', desired_display_firmware_version + ' / ' + tft_version);
        }
    } catch (err) { 
        console.warn('function Init_Release: ' + err.message); 
    }
}
Init_Release();

async function InitConfigParameters() {
    try {
        // alternativeScreensaverLayout (socket)
        await createStateAsync(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', false, { type: 'boolean' });
        setObject(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout', {type: 'channel', common: {role: 'socket', name:'alternativeScreensaverLayout'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout.ACTUAL', NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.Screensaver.alternativeScreensaverLayout.SET', NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

        // autoWeatherColorScreensaverLayout (socket)
        await createStateAsync(NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, { type: 'boolean' });
        setObject(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout', {type: 'channel', common: {role: 'socket', name:'alternativeScreensaverLayout'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout.ACTUAL', NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.Screensaver.autoWeatherColorScreensaverLayout.SET', NSPanel_Path + 'Config.Screensaver.autoWeatherColorScreensaverLayout', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

        // timeoutScreensaver 0-60 (Slider)
        await createStateAsync(NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', 10, { type: 'number' });
        setObject(AliasPath + 'Config.Screensaver.timeoutScreensaver', {type: 'channel', common: {role: 'slider', name:'timeoutScreensaver'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.Screensaver.timeoutScreensaver.ACTUAL', NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.Screensaver.timeoutScreensaver.SET', NSPanel_Path + 'Config.Screensaver.timeoutScreensaver', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });

        // screenSaverDoubleClick (socket)
        await createStateAsync(NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, { type: 'boolean' });
        setObject(AliasPath + 'Config.Screensaver.screenSaverDoubleClick', {type: 'channel', common: {role: 'socket', name:'screenSaverDoubleClick'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.Screensaver.screenSaverDoubleClick.ACTUAL', NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.Screensaver.screenSaverDoubleClick.SET', NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });

        if (existsObject(NSPanel_Path + 'Config.locale') == false) {
            // en-US, de-DE, nl-NL, da-DK, es-ES, fr-FR, it-IT, ru-RU, etc.    
            await createStateAsync(NSPanel_Path + 'Config.locale', 'de-DE', { type: 'string' });
            setStateAsync(NSPanel_Path + 'Config.locale', 'de-DE');
        }

        if (existsObject(NSPanel_Path + 'Config.temperatureUnit') == false) {
            // '°C', '°F', 'K'
            await createStateAsync(NSPanel_Path + 'Config.temperatureUnit', '°C', { type: 'string' });
        }

        // locale Tastensensor popupInSel buttonSensor
        if (existsObject(NSPanel_Path + 'Config.localeNumber') == false) {
            await createStateAsync(NSPanel_Path + 'Config.localeNumber', 1, { type: 'number' });
            setObject(AliasPath + 'Config.localeNumber', {type: 'channel', common: {role: 'buttonSensor', name:'localeNumber'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.localeNumber.VALUE', NSPanel_Path + 'Config.localeNumber', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'VALUE' });
        }
        // temperatureUnit popupInSel buttonSensor
        if (existsObject(NSPanel_Path + 'Config.temperatureUnitNumber') == false) {
            await createStateAsync(NSPanel_Path + 'Config.temperatureUnitNumber', 0, { type: 'number' });
            setObject(AliasPath + 'Config.temperatureUnitNumber', {type: 'channel', common: {role: 'buttonSensor', name:'temperatureUnitNumber'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.temperatureUnitNumber.VALUE', NSPanel_Path + 'Config.temperatureUnitNumber', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'VALUE' });
        }
    } catch (err) { 
        console.warn('function Init_Release: ' + err.message); 
    }
}
InitConfigParameters();
on({id: [].concat(NSPanel_Path + 'Config.localeNumber')
          .concat(NSPanel_Path + 'Config.temperatureUnitNumber'), change: "ne"}, async function (obj) {
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
    } catch (err) { 
        console.warn('function InitConfigParameters: ' + err.message); 
    }
});
async function CheckConfigParameters() {
    try {
        if (existsObject(config.panelRecvTopic) == false) {
            console.error('Config-Parameter: << config.panelRecvTopic - ' + config.panelRecvTopic + ' >> is not reachable. Please Check Parameters!');
        }
        if (existsObject(config.panelSendTopic) == false) {
            console.error('Config-Parameter: << config.panelSendTopic - ' + config.panelSendTopic + ' >> is not reachable. Please Check Parameters!');
        }
        if (weatherAdapterInstance.substring(0, weatherAdapterInstance.length - 3) == 'daswetter') {
            if (existsObject(weatherAdapterInstance + 'NextHours.Location_1.Day_1.current.symbol_value') == false)  {
                console.error('Wetter-Adapter: << weatherAdapterInstance - ' + weatherAdapterInstance + ' >> is not installed. Please Check Adapter!');
            }
        }
        if (weatherAdapterInstance.substring(0, weatherAdapterInstance.length - 3) == 'accuweather') {
            if (existsObject(weatherAdapterInstance + 'Current.WeatherIcon') == false)  {
                console.error('Wetter-Adapter: << weatherAdapterInstance - ' + weatherAdapterInstance + ' >> is not installed. Please Check Adapter!');
            }
        }

        const adapterList = $('system.adapter.*.alive');
        adapterList.each(function(id, i) {
            id = id.substring(0, id.lastIndexOf('.'));
            if(existsObject(id)) {
                let common = getObject(id).common;
                if (common.name == 'javascript') {
                    let jsVersion = common.version.split('.');
                    if (parseInt(jsVersion[0]) < 6) { 
                        console.error('JS-Adapter: ' + common.name + ' must be at least v6.1.3. Currently: v' + common.version);
                    } else if (parseInt(jsVersion[1]) < 1) {
                        console.error('JS-Adapter: ' + common.name + ' must be at least v6.1.3. Currently: v' + common.version);
                    }
                }     
            }
        });
        const hostList = $('system.host.*.nodeCurrent');
        hostList.each(function(id, i) {
            let nodeJSVersion = (getState(id).val).split('.');
            if (parseInt(nodeJSVersion[0]) < 16) {
                console.warn('nodeJS must be at least v16.X.X. Currently: v' + getState(id).val + '! Please Update your System!');
            }
            if (parseInt(nodeJSVersion[0])%2 != 0) {
                console.warn('nodeJS does not have an even version number. An odd version number is a developer version. Please correct nodeJS version');
            }
        });
        if (existsObject(config.mrIcon1ScreensaverEntity.ScreensaverEntity) == false) {
            console.warn('mrIcon1ScreensaverEntity data point in the config not available - please adjust');
        } 
        if (existsObject(config.mrIcon2ScreensaverEntity.ScreensaverEntity) == false) {
            console.warn('mrIcon2ScreensaverEntity data point in the config not available - please adjust');
        } 
    } catch (err) { 
        console.warn('function CheckConfigParameters: ' + err.message); 
    }
}
CheckConfigParameters();

//switch BackgroundColors for Screensaver Indicators
async function Init_ActivePageData() {
    try {
        if (existsState(NSPanel_Path + 'ActivePage.heading') == false ) { 
            await createStateAsync(NSPanel_Path + 'ActivePage.heading', '', true, { type: 'string' });
        }
        if (existsState(NSPanel_Path + 'ActivePage.type') == false ) { 
            await createStateAsync(NSPanel_Path + 'ActivePage.type', '', true, { type: 'string' });
        }
    } catch (err) { 
        console.warn('function Init_ActivePageData: ' + err.message); 
    }
}
Init_ActivePageData();

//switch BackgroundColors for Screensaver Indicators
async function Init_Screensaver_Backckground_Color_Switch() {
    try {
        if (existsState(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator') == false ) { 
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.bgColorIndicator', 0, true, { type: 'number' });
        }
    } catch (err) { 
        console.warn('function Init_Screensaver_Backckground_Color_Switch: ' + err.message); 
    }
}
Init_Screensaver_Backckground_Color_Switch();

on({id: NSPanel_Path + 'ScreensaverInfo.bgColorIndicator', change: "ne"}, async function (obj) {
    try {
        bgColorScrSaver = obj.state.val;
        if (bgColorScrSaver < 4) {
            HandleScreensaverUpdate();
        }
    } catch (err) { 
        console.warn('trigger bgColorIndicator: ' + err.message); 
    }
});

//go to Page X after bExit
async function Init_bExit_Page_Change() {
    try {
        if (existsState(NSPanel_Path + 'ScreensaverInfo.bExitPage') == false ) { 
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.bExitPage', null, true, { type: 'number' });
        }
    } catch (err) { 
        console.warn('function Init_bExit_Page_Change: ' + err.message); 
    }
}
Init_bExit_Page_Change();

//Dimmode über Trigger über BWM
async function Init_Dimmode_Trigger() {
    try {
        if (existsState(NSPanel_Path + 'ScreensaverInfo.Trigger_Dimmode') == false ) { 
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.Trigger_Dimmode', false, true, { type: 'boolean' });
        }
    } catch (err) { 
        console.warn('function Init_Dimmode_Trigger: ' + err.message); 
    }
}
Init_Dimmode_Trigger();

async function InitActiveBrightness() {
    try {
        if (existsState(NSPanel_Path + 'ScreensaverInfo.activeBrightness') == false ||
            existsState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness') == false) {
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.activeBrightness', 100, { type: 'number' });         
            await createStateAsync(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness', null, { type: 'number' });
        }
        //Create Alias activeBrightness
        setObject(AliasPath + 'ScreensaverInfo.activeBrightness', {type: 'channel', common: {role: 'slider', name:'activeBrightness'}, native: {}});
        await createAliasAsync(AliasPath + 'ScreensaverInfo.activeBrightness.ACTUAL', NSPanel_Path + 'ScreensaverInfo.activeBrightness', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'ScreensaverInfo.activeBrightness.SET', NSPanel_Path + 'ScreensaverInfo.activeBrightness', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
    } catch (err) {
        console.warn('function InitActiveBrightness: ' + err.message);
    }
}
InitActiveBrightness();
on({id: [].concat(String(NSPanel_Path) + 'ScreensaverInfo.activeDimmodeBrightness'), change: "ne"}, async function (obj) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val;

        if (obj.state.val != null) {
            console.log(obj.state.val + ' - ' + active);
            SendToPanel({ payload: 'dimmode~' + obj.state.val + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) });
        } else {
            InitDimmode();
        }
    } catch (err) { 
        console.warn('trigger activeBrightness: ' + err.message); 
    }
});
on({id: String(NSPanel_Path) + 'ScreensaverInfo.Trigger_Dimmode', change: "ne"}, async function (obj) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val;
        if (obj.state.val) {
            SendToPanel({ payload: 'dimmode~' + 100 + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) });
        } else {
            InitDimmode();
        }
     } catch (err) { 
        console.warn('trigger Trigger_Dimmode: ' + err.message); 
    }
});

async function InitRebootPanel() {
    try {
        if (existsState(NSPanel_Path + 'Config.rebootNSPanel') == false) {
            await createStateAsync(NSPanel_Path + 'Config.rebootNSPanel', false, { type: 'boolean' });
            setObject(AliasPath + 'Config.rebootNSPanel', {type: 'channel', common: {role: 'button', name:'Reboot NSPanel'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.rebootNSPanel.SET', NSPanel_Path + 'Config.rebootNSPanel', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
        }
    } catch (err) {
        console.warn('function InitRebootPanel: ' + err.message);
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
            request({
                url: `${urlString}`,
                headers: {
                    'User-Agent': 'ioBroker'
                }
            }, async function () {
                SendToPanel({ payload: 'pageType~pageStartup' });              
                console.log('Tasmota Reboot');
                setStateAsync(AliasPath + 'Config.rebootNSPanel.SET', false);
                console.log("Name: " + name);
                console.log("Instanz: " + instance);
            });
        } catch (err) {
            console.warn('error at Trigger Restart NSPanel: ' + err.message);
        }
    }
});

async function InitUpdateDatapoints() {
    try {
        if (existsState(NSPanel_Path + 'Config.Update.UpdateTasmota') == false) {
            await createStateAsync(NSPanel_Path + 'Config.Update.UpdateTasmota', false, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + 'Config.Update.UpdateBerry', false, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + 'Config.Update.UpdateNextion', false, { type: 'boolean' });
            setObject(AliasPath + 'Config.Update.UpdateTasmota', {type: 'channel', common: {role: 'button', name:'Tassmota update'}, native: {}});
            setObject(AliasPath + 'Config.Update.UpdateBerry', {type: 'channel', common: {role: 'button', name:'Berry-Driver update'}, native: {}});
            setObject(AliasPath + 'Config.Update.UpdateNextion', {type: 'channel', common: {role: 'button', name:'Nextion TFT update'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Update.UpdateTasmota.SET', NSPanel_Path + 'Config.Update.UpdateTasmota', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
            await createAliasAsync(AliasPath + 'Config.Update.UpdateBerry.SET', NSPanel_Path + 'Config.Update.UpdateBerry', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
            await createAliasAsync(AliasPath + 'Config.Update.UpdateNextion.SET', NSPanel_Path + 'Config.Update.UpdateNextion', true, <iobJS.StateCommon>{ type: 'boolean', role: 'state', name: 'SET' });
        }
    } catch (err) {
        console.warn('function InitRebootPanel: ' + err.message);
    }
}
InitUpdateDatapoints();
on({id: [].concat(NSPanel_Path + 'Config.Update.UpdateTasmota')
          .concat(NSPanel_Path + 'Config.Update.UpdateBerry')
          .concat(NSPanel_Path + 'Config.Update.UpdateNextion'), change: "any"}, async function (obj) {
    try {
        switch (obj.id) {
            case NSPanel_Path + 'Config.Update.UpdateTasmota':
                if (Debug) console.log('Tasmota Upgrade durchführen');
                update_tasmota_firmware();
                break;
            case NSPanel_Path + 'Config.Update.UpdateBerry':
                if (Debug) console.log('Berry Driver Update durchführen')
                update_berry_driver_version();
                break;
            case NSPanel_Path + 'Config.Update.UpdateNextion':
                if (Debug) console.log('FlashNextion durchführen')
                update_tft_firmware();
                break;
        } 
    } catch (err) { 
        console.warn('error at Trigger Update Firmware: ' + err.message); 
    }
});

//switch Relays 1 + 2 with DP's
async function Init_Relays() {
    try {
        if (existsState(NSPanel_Path + 'Relay.1') == false ||
            existsState(NSPanel_Path + 'Relay.2') == false) {
            await createStateAsync(NSPanel_Path + 'Relay.1', true, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + 'Relay.2', true, { type: 'boolean' });
        }
        setObject(AliasPath + 'Relay.1', {type: 'channel', common: {role: 'socket', name:'Relay.1'}, native: {}});
        await createAliasAsync(AliasPath + 'Relay.1.ACTUAL', NSPanel_Path + 'Relay.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Relay.1.SET', NSPanel_Path + 'Relay.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        //Create Alias alternateMRIconSize 2
        setObject(AliasPath + 'Relay.2', {type: 'channel', common: {role: 'socket', name:'Relay.2'}, native: {}});
        await createAliasAsync(AliasPath + 'Relay.2.ACTUAL', NSPanel_Path + 'Relay.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Relay.2.SET', NSPanel_Path + 'Relay.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
    } catch (err) { 
        console.warn('function Init_Relays: ' + err.message); 
    }
}
Init_Relays();

//Change MRIconsFont small/large
async function InitAlternateMRIconsSize() {
    try {
        if (existsState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1') == false ||
            existsState(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2') == false) {
            await createStateAsync(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', false, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', false, { type: 'boolean' });
        }
        //Create Alias alternateMRIconSize 1
        setObject(AliasPath + 'Config.MRIcons.alternateMRIconSize.1', {type: 'channel', common: {role: 'socket', name:'alternateMRIconSize.1'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.1.ACTUAL', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.1.SET', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.1', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        //Create Alias alternateMRIconSize 2
        setObject(AliasPath + 'Config.MRIcons.alternateMRIconSize.2', {type: 'channel', common: {role: 'socket', name:'alternateMRIconSize.2'}, native: {}});
        await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.2.ACTUAL', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
        await createAliasAsync(AliasPath + 'Config.MRIcons.alternateMRIconSize.2.SET', NSPanel_Path + 'Config.MRIcons.alternateMRIconSize.2', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
    } catch (err) { 
        console.warn('function InitAlternateMRIconsSize: ' + err.message); 
    }
}
InitAlternateMRIconsSize();


//DateString short/long
async function InitDateformat() {
    try {
        if (existsState(NSPanel_Path + 'Config.Dateformat.weekday') == false ||
            existsState(NSPanel_Path + 'Config.Dateformat.month') == false) {
            await createStateAsync(NSPanel_Path + 'Config.Dateformat.weekday', 'long', { type: 'string' });
            await createStateAsync(NSPanel_Path + 'Config.Dateformat.month', 'long', { type: 'string' });
        }
        if (existsState(NSPanel_Path + 'Config.Dateformat.Switch.weekday') == false ||
            existsState(NSPanel_Path + 'Config.Dateformat.Switch.month') == false) {
            await createStateAsync(NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + 'Config.Dateformat.Switch.month', true, { type: 'boolean' });
            setObject(AliasPath + 'Config.Dateformat.Switch.weekday', {type: 'channel', common: {role: 'socket', name:'Dateformat Switch weekday'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.weekday.ACTUAL', NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.weekday.SET', NSPanel_Path + 'Config.Dateformat.Switch.weekday', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
            setObject(AliasPath + 'Config.Dateformat.Switch.month', {type: 'channel', common: {role: 'socket', name:'Dateformat Switch month'}, native: {}});
            await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.month.ACTUAL', NSPanel_Path + 'Config.Dateformat.Switch.month', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Config.Dateformat.Switch.month.SET', NSPanel_Path + 'Config.Dateformat.Switch.month', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }
    } catch (err) { 
        console.warn('function InitDateformat: ' + err.message); 
    }
}
InitDateformat();
//Control Dateformat short/long from DP's
on({id: [].concat(String(NSPanel_Path) + 'Config.Dateformat.Switch.weekday')
          .concat(String(NSPanel_Path) + 'Config.Dateformat.Switch.month'), change: "ne"}, async function (obj) {
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
    } catch (err) { 
        console.warn('error at Trigger Config.Dateformat: ' + err.message); 
    }
});

//Control Relays from DP's
on({id: [].concat(String(NSPanel_Path) + 'Relay.1').concat(String(NSPanel_Path) + 'Relay.2'), change: "ne"}, async function (obj) {
    try {
        let Button = obj.id.split('.');
        require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=Power',Button[Button.length - 1],' ',(obj.state ? obj.state.val : "")].join(''))).on("error", function (err) {console.error(err.message);});
    } catch (err) { 
        console.warn('error at Trigger Relay1/2: ' + err.message); 
    }
});

async function SubscribeMRIcons () { 
    try {
        if (config.mrIcon1ScreensaverEntity.ScreensaverEntity != null) {
            on({id: config.mrIcon1ScreensaverEntity.ScreensaverEntity, change: "ne"}, async function (obj) {
                if (obj.id.substring(0,4) == 'mqtt') {
                    let Button = obj.id.split('.'); 
                    if (getState(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6)).val != obj.state.val) {
                        await setStateAsync(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6), obj.state.val == 'ON' ? true : false);
                    }
                } else {
                    HandleScreensaverStatusIcons();
                }
            });
        }
        if (config.mrIcon2ScreensaverEntity.ScreensaverEntity != null) {
            on({id: config.mrIcon2ScreensaverEntity.ScreensaverEntity, change: "ne"}, async function (obj) {
                if (obj.id.substring(0,4) == 'mqtt') {
                    let Button = obj.id.split('.'); 
                    if (getState(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6)).val != obj.state.val) {
                        await setStateAsync(NSPanel_Path + 'Relay.' + Button[Button.length - 1].substring(5,6), obj.state.val == 'ON' ? true : false);
                    }
                } else {
                    HandleScreensaverStatusIcons();
                }
            });
        }
    } catch (err) { 
        console.warn('function SubscribeMRIcons: ' + err.message); 
    }
}
SubscribeMRIcons();

// Create atomatically Wheather-Alias, if exists accuweather.0. and is not exists Config-Wheather-Alias
async function CreateWeatherAlias () {
    try {
        if (autoCreateAlias) {
            if (weatherAdapterInstance == 'daswetter.0.') {
                try {
                    if (!existsState(config.weatherEntity + '.ICON') && existsState('daswetter.0.NextHours.Location_1.Day_1.current.symbol_value')) {
                        console.log('Wetter-Alias existiert noch nicht, wird jetzt angelegt'); 
                        setObject(config.weatherEntity, {_id: config.weatherEntity, type: 'channel', common: {role: 'weatherCurrent', name:'media'}, native: {}});
                        await createAliasAsync(config.weatherEntity + '.ICON', 'daswetter.0.NextHours.Location_1.Day_1.current.symbol_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ICON' });
                        await createAliasAsync(config.weatherEntity + '.TEMP', 'daswetter.0.NextHours.Location_1.Day_1.current.temp_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature', name: 'TEMP' });
                        await createAliasAsync(config.weatherEntity + '.TEMP_MIN', 'daswetter.0.NextDays.Location_1.Day_1.Minimale_Temperatur_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.forecast.0', name: 'TEMP_MIN' });
                        await createAliasAsync(config.weatherEntity + '.TEMP_MAX', 'daswetter.0.NextDays.Location_1.Day_1.Maximale_Temperatur_value', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.max.forecast.0', name: 'TEMP_MAX' });
                    } else {
                        console.log('Wetter-Alias für daswetter.0. existiert bereits');
                    }
                } catch (err) {
                    console.log('function InitPageNavi: ' + err.message);
                }
            } else if (weatherAdapterInstance == 'accuweather.0.') {
                try {
                    if (!existsState(config.weatherEntity + '.ICON') && existsState('accuweather.0.Current.WeatherIcon')) {
                        console.log('Wetter-Alias existiert noch nicht, wird jetzt angelegt'); 
                        setObject(config.weatherEntity, {_id: config.weatherEntity, type: 'channel', common: {role: 'weatherCurrent', name:'media'}, native: {}});
                        await createAliasAsync(config.weatherEntity + '.ICON', 'accuweather.0.Current.WeatherIcon', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ICON' });
                        await createAliasAsync(config.weatherEntity + '.TEMP', 'accuweather.0.Current.Temperature', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature', name: 'TEMP' });
                        await createAliasAsync(config.weatherEntity + '.TEMP_MIN', 'accuweather.0.Daily.Day1.Temperature.Minimum', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.forecast.0', name: 'TEMP_MIN' });
                        await createAliasAsync(config.weatherEntity + '.TEMP_MAX', 'accuweather.0.Daily.Day1.Temperature.Maximum', true, <iobJS.StateCommon>{ type: 'number', role: 'value.temperature.max.forecast.0', name: 'TEMP_MAX' });
                    } else {
                        console.log('Wetter-Alias für accuweather.0. existiert bereits');
                    }
                } catch (err) {
                    console.log('function InitPageNavi: ' + err.message);
                }
            }
        } 
    } catch (err) { 
        console.warn('function CreateWeatherAlias: ' + err.message); 
    }  
}
CreateWeatherAlias();

//---------------------Begin PageNavi
async function InitPageNavi() {
    try {
        if (!existsState(NSPanel_Path + 'PageNavi')) {
            await createStateAsync(NSPanel_Path + 'PageNavi', <iobJS.StateCommon>{ type: 'string' });
            await setStateAsync(NSPanel_Path + 'PageNavi', <iobJS.State>{ val: {"pagetype": "page","pageId": 0}, ack: true });
        }
    } catch (err) {
        console.log('function InitPageNavi: ' + err.message);
    }
}
InitPageNavi();

//PageNavi
on({id: [].concat([NSPanel_Path + 'PageNavi']), change: "any"}, async function (obj) {
    try {
        if (existsState(NSPanel_Path + 'PageNavi')) {
            let vObj = JSON.parse(obj.state.val);
            if (vObj.pagetype == 'page') {
                GeneratePage(config.pages[vObj.pageId]);
            } else if (vObj.pagetype == 'subpage') {
                GeneratePage(config.subPages[vObj.pageId]);
            }
        }
    } catch (err) { 
        console.warn('error at Trigger PageNavi: ' + err.message); 
    }
});

//----------------------Begin Dimmode
function ScreensaverDimmode(timeDimMode: DimMode) {
    try {
        let active = getState(NSPanel_Path + 'ScreensaverInfo.activeBrightness').val
        let dimmode = getState(NSPanel_Path + 'ScreensaverInfo.activeDimmodeBrightness').val
        if (Debug) {
            console.log(rgb_dec565(HMIDark));
        }
        if (Debug) {
            console.log('Dimmode=' + timeDimMode.dimmodeOn);
        }
        if (timeDimMode.dimmodeOn != undefined ? timeDimMode.dimmodeOn : false) {
            if (compareTime(timeDimMode.timeNight != undefined ? timeDimMode.timeNight : '22:00', timeDimMode.timeDay != undefined ? timeDimMode.timeDay : '07:00', 'not between', undefined)) {
                SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessDay + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) });
                if (Debug) {
                    console.log('Day Payload: ' + 'dimmode~' + timeDimMode.brightnessDay + '~' + active);
                }
            } else {
                SendToPanel({ payload: 'dimmode~' + timeDimMode.brightnessNight + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) });
                if (Debug) {
                    console.log('Night Payload: ' + 'dimmode~' + timeDimMode.brightnessNight + '~' + active);
                }
            }
        } else {
            SendToPanel({ payload: 'dimmode~' + dimmode + '~' + active + '~' + rgb_dec565(config.defaultBackgroundColor) });
        }
    } catch (err) {
        console.warn('function ScreensaverDimmode: ' + err.message);
    }
}

async function InitWeatherForecast() {
    try {
        //----Möglichkeit, im Screensaver zwischen Accu-Weather Forecast oder selbstdefinierten Werten zu wählen---------------------------------
        if (existsState(NSPanel_Path + "ScreensaverInfo.weatherForecast") == false ||
            existsState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer") == false ||
            existsState(NSPanel_Path + "ScreensaverInfo.entityChangeTime") == false) {
            await createStateAsync(NSPanel_Path + "ScreensaverInfo.weatherForecast", true, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer", true, { type: 'boolean' });
            await createStateAsync(NSPanel_Path + "ScreensaverInfo.entityChangeTime", 60, { type: 'number' });
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
    } catch (err) {
        console.warn('function InitWeatherForecast: ' + err.message);
    }
}
InitWeatherForecast();

async function InitDimmode() {
    try {
        // Screensaver nachts auf dunkel ("brightnessNight: z.B. 2") oder aus ("brightnessNight:0")
        if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay')) {
            await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', <iobJS.StateCommon>{ type: 'number' });
            await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', <iobJS.State>{ val: 8, ack: true });
            setObject(AliasPath + 'Dimmode.brightnessDay', {type: 'channel', common: {role: 'slider', name:'brightnessDay'}, native: {}});
            await createAliasAsync(AliasPath + 'Dimmode.brightnessDay.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Dimmode.brightnessDay.SET', NSPanel_Path + 'NSPanel_Dimmode_brightnessDay', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }

        if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_hourDay')) {
            await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourDay', <iobJS.StateCommon>{ type: 'number' });
            await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourDay', <iobJS.State>{ val: 7, ack: true });
            setObject(AliasPath + 'Dimmode.hourDay', {type: 'channel', common: {role: 'slider', name:'hourDay'}, native: {}});
            await createAliasAsync(AliasPath + 'Dimmode.hourDay.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_hourDay', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Dimmode.hourDay.SET', NSPanel_Path + 'NSPanel_Dimmode_hourDay', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }

        if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight')) {
            await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', <iobJS.StateCommon>{ type: 'number' });
            await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', <iobJS.State>{ val: 1, ack: true });
            setObject(AliasPath + 'Dimmode.brightnessNight', {type: 'channel', common: {role: 'slider', name:'brightnessNight'}, native: {}});
            await createAliasAsync(AliasPath + 'Dimmode.brightnessNight.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Dimmode.brightnessNight.SET', NSPanel_Path + 'NSPanel_Dimmode_brightnessNight', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }

        if (!existsState(NSPanel_Path + 'NSPanel_Dimmode_hourNight')) {
            await createStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourNight', <iobJS.StateCommon>{ type: 'number' });
            await setStateAsync(NSPanel_Path + 'NSPanel_Dimmode_hourNight', <iobJS.State>{ val: 22, ack: true });
            setObject(AliasPath + 'Dimmode.hourNight', {type: 'channel', common: {role: 'slider', name:'hourNight'}, native: {}});
            await createAliasAsync(AliasPath + 'Dimmode.hourNight.ACTUAL', NSPanel_Path + 'NSPanel_Dimmode_hourNight', true, <iobJS.StateCommon>{ type: 'number', role: 'value', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'Dimmode.hourNight.SET', NSPanel_Path + 'NSPanel_Dimmode_hourNight', true, <iobJS.StateCommon>{ type: 'number', role: 'level', name: 'SET' });
        }

        const vTimeDay = getState(NSPanel_Path + 'NSPanel_Dimmode_hourDay').val;
        const vTimeNight = getState(NSPanel_Path + 'NSPanel_Dimmode_hourNight').val;

        const timeDimMode = <DimMode>{
            dimmodeOn: true,
            brightnessDay: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessDay').val,
            brightnessNight: getState(NSPanel_Path + 'NSPanel_Dimmode_brightnessNight').val,
            timeDay: (vTimeDay < 10) ? `0${vTimeDay}:00` : `${vTimeDay}:00`,
            timeNight: (vTimeNight < 10) ? `0${vTimeNight}:00` : `${vTimeNight}:00`
        };

        // timeDimMode Day
        schedule({ hour: getState(NSPanel_Path + 'NSPanel_Dimmode_hourDay').val, minute: 0 }, () => {
            ScreensaverDimmode(timeDimMode);
        });

        // timeDimMode Night
        schedule({ hour: getState(NSPanel_Path + 'NSPanel_Dimmode_hourNight').val, minute: 0 }, () => {
            ScreensaverDimmode(timeDimMode);
        });

        ScreensaverDimmode(timeDimMode);
    } catch (err) {
        console.warn('function InitDimmode: ' + err.message);
    }
}

InitDimmode();

//--------------------End Dimmode

// Datenpunkte für Nachricht an Screensaver
const screensaverNotifyHeading = NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading';
const screensaverNotifyText = NSPanel_Path + 'ScreensaverInfo.popupNotifyText';

// Datenpunkte für Nachricht popupNotify Page
const popupNotifyHeading = NSPanel_Path + 'popupNotify.popupNotifyHeading';
const popupNotifyHeadingColor = NSPanel_Path + 'popupNotify.popupNotifyHeadingColor';
const popupNotifyText = NSPanel_Path + 'popupNotify.popupNotifyText';
const popupNotifyTextColor = NSPanel_Path + 'popupNotify.popupNotifyTextColor';
const popupNotifyInternalName = NSPanel_Path + 'popupNotify.popupNotifyInternalName'; // Wird mit Button-Action zurückgeschrieben
const popupNotifyButton1TextColor = NSPanel_Path + 'popupNotify.popupNotifyButton1TextColor';
const popupNotifyButton1Text = NSPanel_Path + 'popupNotify.popupNotifyButton1Text';
const popupNotifyButton2TextColor = NSPanel_Path + 'popupNotify.popupNotifyButton2TextColor';
const popupNotifyButton2Text = NSPanel_Path + 'popupNotify.popupNotifyButton2Text';
const popupNotifySleepTimeout = NSPanel_Path + 'popupNotify.popupNotifySleepTimeout'; // in sek. / wenn 0, dann bleibt die Nachricht stehen
const popupNotifyAction = NSPanel_Path + 'popupNotify.popupNotifyAction'; // Antwort aus dem Panel true/false
const popupNotifyLayout = NSPanel_Path + 'popupNotify.popupNotifyLayout';
const popupNotifyFontIdText = NSPanel_Path + 'popupNotify.popupNotifyFontIdText';  // 1 - 5
const popupNotifyIcon = NSPanel_Path + 'popupNotify.popupNotifyIcon';  // 1 - 5
const popupNotifyIconColor = NSPanel_Path + 'popupNotify.popupNotifyIconColor';  // 1 - 5

async function InitPopupNotify() {
    try {
        if (!existsState(screensaverNotifyHeading)) {
            await createStateAsync(screensaverNotifyHeading, <iobJS.StateCommon>{ type: 'string' });
            await setStateAsync(screensaverNotifyHeading, <iobJS.State>{ val: '', ack: true });
        }

        if (!existsState(screensaverNotifyText)) {
            await createStateAsync(screensaverNotifyText, <iobJS.StateCommon>{ type: 'string' });
            await setStateAsync(screensaverNotifyText, <iobJS.State>{ val: '', ack: true });
        }

        await createStateAsync(popupNotifyHeading, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyHeadingColor, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyText, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyTextColor, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyInternalName, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyButton1Text, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyButton1TextColor, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyButton2Text, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyButton2TextColor, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifySleepTimeout, <iobJS.StateCommon>{ type: 'number' });
        await createStateAsync(popupNotifyAction, <iobJS.StateCommon>{ type: 'boolean' });
        await createStateAsync(popupNotifyLayout, <iobJS.StateCommon>{ type: 'number' });
        await createStateAsync(popupNotifyFontIdText, <iobJS.StateCommon>{ type: 'number' });
        await createStateAsync(popupNotifyIcon, <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(popupNotifyIconColor, <iobJS.StateCommon>{ type: 'string' });

        // Notification to screensaver
        on({ id: [screensaverNotifyHeading, screensaverNotifyText], change: 'ne', ack: false }, async (obj) => {
            const heading = getState(screensaverNotifyHeading).val;
            const text = getState(screensaverNotifyText).val;

            setIfExists(config.panelSendTopic, `notify~${heading}~${text}`);

            if (obj.id) {
                await setStateAsync(obj.id, <iobJS.State>{ val: obj.state.val, ack: true }); // ack new value
            }
        });

        // popupNotify - Notification an separate Seite
        on({ id: [popupNotifyInternalName], change: 'ne' }, async () => {

            let notification: string;

            let v_popupNotifyHeadingColor = (getState(popupNotifyHeadingColor).val != null) ? getState(popupNotifyHeadingColor).val  : '65504'// Farbe Headline - gelb 65504
            let v_popupNotifyButton1TextColor = (getState(popupNotifyButton1TextColor).val != null) ? getState(popupNotifyButton1TextColor).val  : '63488'// Farbe Headline - gelb 65504
            let v_popupNotifyButton2TextColor = (getState(popupNotifyButton2TextColor).val != null) ? getState(popupNotifyButton2TextColor).val  : '2016'// Farbe Headline - gelb 65504
            let v_popupNotifyTextColor = (getState(popupNotifyTextColor).val != null) ? getState(popupNotifyTextColor).val : '65535'// Farbe Headline - gelb 65504
            let v_popupNotifyIconColor = (getState(popupNotifyIconColor).val != null) ? getState(popupNotifyIconColor).val  : '65535'// Farbe Headline - gelb 65504
            let v_popupNotifyFontIdText = (getState(popupNotifyFontIdText).val != null) ? getState(popupNotifyFontIdText).val  : '1'
            let v_popupNotifyIcon = (getState(popupNotifyIcon).val != null) ? getState(popupNotifyIcon).val : 'alert'

            notification = 'entityUpdateDetail' + '~'
                + getState(popupNotifyInternalName).val + '~'
                + getState(popupNotifyHeading).val + '~'
                + v_popupNotifyHeadingColor + '~'
                + getState(popupNotifyButton1Text).val + '~'
                + v_popupNotifyButton1TextColor + '~'
                + getState(popupNotifyButton2Text).val + '~'
                + v_popupNotifyButton2TextColor + '~'
                + getState(popupNotifyText).val + '~'
                + v_popupNotifyTextColor + '~'
                + getState(popupNotifySleepTimeout).val;

            if (getState(popupNotifyLayout).val == 2) {
                notification = notification + '~'
                + v_popupNotifyFontIdText + '~'
                + Icons.GetIcon(v_popupNotifyIcon) + '~'
                + v_popupNotifyIconColor;
            }

            setIfExists(config.panelSendTopic, 'pageType~popupNotify');
            setIfExists(config.panelSendTopic, notification);

        });
    } catch (err) {
        console.warn('function InitPopupNotify: ' + err.message);
    }
}

InitPopupNotify();

let subscriptions: any = {};
let screensaverEnabled: boolean = false;
let pageId = 0;

// Neu für Subpages
let activePage = undefined;

//Uhrzeit an NSPanel senden
schedule('* * * * *', () => {
    try {
        SendTime();
        HandleScreensaverUpdate();
    } catch (err) {
        console.warn('schedule SendTime: ' + err.message);
    }
});

//Wechsel zwischen Screensaver Entities und WeatherForecast
schedule('*/' + getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val +  ' * * * * *', () => {
    try {
        //WeatherForecast true/false Umschaltung verzögert
        if (getState(NSPanel_Path + "ScreensaverInfo.popupNotifyHeading").val == '' && getState(NSPanel_Path + "ScreensaverInfo.popupNotifyText").val == '' && getState(NSPanel_Path + "ScreensaverInfo.weatherForecast").val == true && getState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer").val == true) {
            setStateDelayed(NSPanel_Path + "ScreensaverInfo.weatherForecast", false, (getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val / 2 * 1000), false);
        } else if (getState(NSPanel_Path + "ScreensaverInfo.popupNotifyHeading").val == '' && getState(NSPanel_Path + "ScreensaverInfo.popupNotifyText").val == '' && getState(NSPanel_Path + "ScreensaverInfo.weatherForecast").val == false && getState(NSPanel_Path + "ScreensaverInfo.weatherForecastTimer").val == true) {
            setStateDelayed(NSPanel_Path + "ScreensaverInfo.weatherForecast", true, (getState(NSPanel_Path + 'ScreensaverInfo.entityChangeTime').val / 2 * 1000), false);
        }
    } catch (err) {
        console.warn('schedule entityChangeTime: ' + err.message);
    }
});

function InitHWButton1Color() {
    try {
        if (config.mrIcon1ScreensaverEntity.ScreensaverEntity != null || config.mrIcon1ScreensaverEntity.ScreensaverEntity != undefined) {
            on({id: config.mrIcon1ScreensaverEntity.ScreensaverEntity, change: "ne"}, async function () {
                HandleScreensaverUpdate();
            });
        }
    } catch (err) {
        console.warn('function InitHWButton1Color: ' + err.message);
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
    } catch (err) {
        console.warn('function InitHWButton2Color: ' + err.message);
    }
}
InitHWButton2Color();

//Wechsel zwischen Datenpunkten und Weather-Forecast im Screensaver
on({id: [].concat([NSPanel_Path + "ScreensaverInfo.weatherForecast"]), change: "ne"}, async function (obj) {
    try {    
        weatherForecast = obj.state.val;
        HandleScreensaverUpdate();
    } catch (err) {
        console.warn('trigger weatherForecast: ' + err.message);
    }
});

//Update if Changing Values on Wheather Alias
on({id: [].concat(config.weatherEntity + '.TEMP')
          .concat(config.weatherEntity + '.ICON'), change: "ne"}, async function (obj) {
    try {    
        HandleScreensaverUpdate();
    } catch (err) {
        console.warn('trigger weatherForecast: ' + err.message);
    }
});

schedule('0 * * * *', () => {
    SendDate();
});

// 3:30 Uhr Startup durchführen und aktuelle TFT-Version empfangen
schedule({ hour: 3, minute: 30 }, async () => {
    await setStateAsync(config.panelSendTopic, 'pageType~pageStartup');
});

// Updates vergleichen aktuell alle 12 Stunden
schedule('{"time":{"start":"00:00","end":"23:59","mode":"hours","interval":12},"period":{"days":1}}', () => {
    get_tasmota_status0();
    get_panel_update_data();
    check_updates();
});

// Mit Start auf Updates checken
get_locales();
setState(config.panelSendTopic, 'pageType~pageStartup');
get_tasmota_status0();
get_panel_update_data();
check_updates();
/*
setTimeout(async function () {
    setState(config.panelSendTopic, 'pageType~pageStartup');
}, 90000);
*/

//------------------Begin Update Functions

function get_locales() {
    try {
        if (Debug) {
            console.log('Requesting locales');
        }
        request({
            url: 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/ioBroker/ioBroker_NSPanel_locales.json',
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            try {
                if (result) {
                    await createStateAsync(NSPanel_Path + 'NSPanel_locales_json', <iobJS.StateCommon>{ type: 'string', role: 'json' });
                    await setStateAsync(NSPanel_Path + 'NSPanel_locales_json', <iobJS.State>{ val: result, ack: true });
                }
            } catch (err) {
                console.log('get_locales: ' + err.message);
            }
        });
    } catch (err) {
        console.error('error requesting locales in function get_locales: ' + err.message);
    }
}

async function check_updates() {
    try {
        if (Debug) {
            console.log('Check-Updates');
        }
        // Tasmota-Firmware-Vergleich
        if (existsObject(NSPanel_Path + 'Tasmota_Firmware.currentVersion') && existsObject(NSPanel_Path + 'Tasmota_Firmware.onlineVersion')) {
            let splitTasmotaVersion = (getState(NSPanel_Path + 'Tasmota_Firmware.currentVersion').val).split('.');
            let shortTasmoataVersion = splitTasmotaVersion[0] + '.' + splitTasmotaVersion[1] + '.' + splitTasmotaVersion[2]
            if (shortTasmoataVersion !== getState(NSPanel_Path + 'Tasmota_Firmware.onlineVersion').val) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {
                        if (Debug) {
                            console.log('Auto-Updates eingeschaltet - Update wird durchgeführt');
                        }
                        // Tasmota Upgrade durchführen
                        update_tasmota_firmware();
                        // Aktuelle Tasmota Version = Online Tasmota Version

                        await setStateAsync(NSPanel_Path + 'Tasmota_Firmware.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Tasmota_Firmware.onlineVersion').val, ack: true });
                    } else {
                        // Auf Tasmota-Updates hinweisen
                        if (Debug) {
                            console.log('Automatische Updates aus');
                        }

                        const InternalName = 'TasmotaFirmwareUpdate';
                        const Headline = 'Tasmota-Firmware Update';
                        const Text = ['Es ist eine neue Version der Tasmota-Firmware', '\r\n', 'verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.onlineVersion')).val), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        const Button1 = 'Nein';
                        const Button2 = 'Ja';
                        const Timeout = 0;

                        await setStateAsync(popupNotifyHeading, <iobJS.State>{ val: Headline, ack: false });
                        await setStateAsync(popupNotifyText, <iobJS.State>{ val: [formatDate(getDateObject((new Date().getTime())), 'TT.MM.JJJJ SS:mm:ss'), '\r\n', '\r\n', Text].join(''), ack: false });
                        await setStateAsync(popupNotifyButton1Text, <iobJS.State>{ val: Button1, ack: false });
                        await setStateAsync(popupNotifyButton2Text, <iobJS.State>{ val: Button2, ack: false });
                        await setStateAsync(popupNotifySleepTimeout, <iobJS.State>{ val: Timeout, ack: false });
                        await setStateAsync(popupNotifyInternalName, <iobJS.State>{ val: InternalName, ack: false });
                    }
                }
            } else {
                if (Debug) {
                    console.log('Tasmota-Version auf NSPanel aktuell');
                }
            }
        }

        // Tasmota-Berry-Driver-Vergleich
        if (existsObject(NSPanel_Path + 'Berry_Driver.currentVersion')) {
            if (parseFloat(getState(NSPanel_Path + 'Berry_Driver.currentVersion').val) < berry_driver_version) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {
                        // Tasmota Berry-Driver Update durchführen
                        update_berry_driver_version();
                        // Aktuelle Berry-Driver Version = Online Berry-Driver Version
                        await setStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Berry_Driver.onlineVersion').val, ack: true });

                        if (Debug) {
                            console.log('Berry-Driver automatisch aktualisiert');
                        }
                    } else {
                        //Auf BerryDriver-Update hinweisen
                        if (Debug) {
                            console.log('Automatische Updates aus');
                        }

                        const InternalName = 'BerryDriverUpdate';
                        const Headline = 'Berry-Driver Update';
                        const Text = ['Es ist eine neue Version des Berry-Drivers', '\r\n', '(Tasmota) verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Berry_Driver.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(berry_driver_version), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        const Button1 = 'Nein';
                        const Button2 = 'Ja';
                        const Timeout = 0;

                        await setStateAsync(popupNotifyHeading, <iobJS.State>{ val: Headline, ack: false });
                        await setStateAsync(popupNotifyText, <iobJS.State>{ val: [formatDate(getDateObject((new Date().getTime())), 'TT.MM.JJJJ SS:mm:ss'), '\r\n', '\r\n', Text].join(''), ack: false });
                        await setStateAsync(popupNotifyButton1Text, <iobJS.State>{ val: Button1, ack: false });
                        await setStateAsync(popupNotifyButton2Text, <iobJS.State>{ val: Button2, ack: false });
                        await setStateAsync(popupNotifySleepTimeout, <iobJS.State>{ val: Timeout, ack: false });
                        await setStateAsync(popupNotifyInternalName, <iobJS.State>{ val: InternalName, ack: false });
                    }
                }
            } else {
                if (Debug) {
                    console.log('Berry-Driver auf NSPanel aktuell');
                }
            }
        }

        // TFT-Firmware-Vergleich
        if (existsObject(NSPanel_Path + 'Display_Firmware.currentVersion')) {
            if (parseInt(getState(NSPanel_Path + 'Display_Firmware.currentVersion').val) < desired_display_firmware_version) {
                if (existsState(NSPanel_Path + 'NSPanel_autoUpdate')) {
                    if (getState(NSPanel_Path + 'NSPanel_autoUpdate').val) {
                        // TFT-Firmware Update durchführen
                        update_tft_firmware();
                        // Aktuelle TFT-Firmware Version = Online TFT-Firmware Version
                        await setStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.State>{ val: getState(NSPanel_Path + 'Display_Firmware.onlineVersion').val, ack: true });

                        if (Debug) {
                            console.log('Display_Firmware automatisch aktualisiert');
                        }
                    } else {
                        // Auf TFT-Firmware hinweisen
                        if (Debug) {
                            console.log('Automatische Updates aus');
                        }

                        const InternalName = 'TFTFirmwareUpdate';
                        const Headline = 'TFT-Firmware Update';
                        const Text = ['Es ist eine neue Version der TFT-Firmware', '\r\n', 'verfügbar', '\r\n', '\r\n', 'Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Display_Firmware.currentVersion')).val), '\r\n', 'Verfügbare Version: ' + String(desired_display_firmware_version), '\r\n', '\r\n', 'Upgrade durchführen?'].join('');
                        const Button1 = 'Nein';
                        const Button2 = 'Ja';
                        const Timeout = 0;

                        await setStateAsync(popupNotifyHeading, <iobJS.State>{ val: Headline, ack: false });
                        await setStateAsync(popupNotifyText, <iobJS.State>{ val: [formatDate(getDateObject((new Date().getTime())), 'TT.MM.JJJJ SS:mm:ss'), '\r\n', '\r\n', Text].join(''), ack: false });
                        await setStateAsync(popupNotifyButton1Text, <iobJS.State>{ val: Button1, ack: false });
                        await setStateAsync(popupNotifyButton2Text, <iobJS.State>{ val: Button2, ack: false });
                        await setStateAsync(popupNotifySleepTimeout, <iobJS.State>{ val: Timeout, ack: false });
                        await setStateAsync(popupNotifyInternalName, <iobJS.State>{ val: InternalName, ack: false });
                    }
                }
            } else {
                if (Debug) {
                    console.log('Display_Firmware auf NSPanel aktuell');
                }
            }
        }
    } catch (err) {
        console.warn('function check_updates: ' + err.message);
    }
}

on({ id: NSPanel_Path + 'popupNotify.popupNotifyAction', change: 'any' }, async function (obj) {
    try {
        const val = obj.state ? obj.state.val : false;
        if (!val) {
            manually_Update = false;
            if (Debug) {
                console.log('Es wurde Button1 gedrückt');
            }
        } else if (val) {
            if (manually_Update) {
                const internalName = getState(NSPanel_Path + 'popupNotify.popupNotifyInternalName').val;

                if (internalName == 'TasmotaFirmwareUpdate') {
                    update_tasmota_firmware();
                } else if (internalName == 'BerryDriverUpdate') {
                    update_berry_driver_version();
                } else if (internalName == 'TFTFirmwareUpdate') {
                    update_tft_firmware();
                }
            }
            if (Debug) {
                console.log('Es wurde Button2 gedrückt');
            }
        }
    } catch (err) {
        console.warn('Trigger popupNotifyAction: ' + err.message);
    }
});

async function get_panel_update_data() {
    try {
        await createStateAsync(NSPanel_Path + 'NSPanel_autoUpdate', false, <iobJS.StateCommon>{ read: true, write: true, name: 'Auto-Update', type: 'boolean', def: false });
        if (autoCreateAlias) {
            setObject(AliasPath + 'autoUpdate', {type: 'channel', common: {role: 'socket', name:'AutoUpdate'}, native: {}});
            await createAliasAsync(AliasPath + 'autoUpdate.ACTUAL', NSPanel_Path + 'NSPanel_autoUpdate', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'ACTUAL' });
            await createAliasAsync(AliasPath + 'autoUpdate.SET', NSPanel_Path + 'NSPanel_autoUpdate', true, <iobJS.StateCommon>{ type: 'boolean', role: 'switch', name: 'SET' });
        }
        await createStateAsync(NSPanel_Path + 'NSPanel_ipAddress', <iobJS.StateCommon>{ type: 'string' });
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
    } catch (err) {
        console.warn('function get_panel_update_data: ' + err.message);
    }
}

function get_current_tasmota_ip_address() {
    try {
        const infoObjId = config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'INFO2';
        const infoObj = JSON.parse(getState(infoObjId).val);

        if (Debug) {
            console.log(`get_current_tasmota_ip_address: ${infoObj.Info2.IPAddress}`);
        }

        return infoObj.Info2.IPAddress;
    } catch (err) {
        console.warn('function get_current_tasmota_ip_address: ' + err.message);
    }
}

function get_online_tasmota_firmware_version() {
    try {
        if (Debug) {
            console.log('Requesting tasmota firmware version');
        }
        request({
            url: 'https://api.github.com/repositories/80286288/releases/latest',
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            try {
                const Tasmota_JSON = JSON.parse(result);                       // JSON Resultat in Variable Schreiben
                const TasmotaTagName = Tasmota_JSON.tag_name;                  // JSON nach "tag_name" filtern und in Variable schreiben
                const TasmotaVersionOnline = TasmotaTagName.replace(/v/i, ''); // Aus Variable überflüssiges "v" filtern und in Release-Variable schreiben

                await createStateAsync(NSPanel_Path + 'Tasmota_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string' });
                setObject(AliasPath + 'Tasmota_Firmware.onlineVersion', {type: 'channel', common: {role: 'info', name:'onlineVersion'}, native: {}});
                await createAliasAsync(AliasPath + 'Tasmota_Firmware.onlineVersion.ACTUAL', NSPanel_Path + 'Tasmota_Firmware.onlineVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });                
                await setStateAsync(NSPanel_Path + 'Tasmota_Firmware.onlineVersion', <iobJS.State>{ val: TasmotaVersionOnline, ack: true });
            } catch (err) {
                console.log('get_online_tasmota_firmware_version: ' + err.message);
            }
        });
    } catch (err) {
        console.warn('error requesting firmware in function get_online_tasmota_firmware_version: ' + err.message);
    }
}

function get_current_berry_driver_version() {
    try {
        if (Debug) {
            console.log('Requesting current berry driver version');
        }

        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=GetDriverVersion`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=GetDriverVersion`;
        }

        request({

            url: `${urlString}`,
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            try {
                await createStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.StateCommon>{ type: 'string' });
                await setStateAsync(NSPanel_Path + 'Berry_Driver.currentVersion', <iobJS.State>{ val: JSON.parse(result).nlui_driver_version, ack: true });
                if (autoCreateAlias) {
                    setObject(AliasPath + 'Display.BerryDriver', {type: 'channel', common: {role: 'info', name: 'Berry Driver'}, native: {}});
                    await createAliasAsync(AliasPath + 'Display.BerryDriver.ACTUAL', NSPanel_Path + 'Berry_Driver.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                }
            } catch (err) {
                console.warn('get_current_berry_driver_version: ' + err.message);
            }
        });
    } catch (err) {
        console.warn('error requesting firmware in function get_current_berry_driver_version: ' + err.message);
    }
}

function get_tasmota_status0() {
    try {
        if (Debug) {
            console.log('Requesting tasmota status0');
        }
        
        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Status0`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Status0`;
        }

        request({
            url: `${urlString}`,
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            await createStateAsync(NSPanel_Path + 'Tasmota_Firmware.currentVersion', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Uptime', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Version', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Hardware', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.AP', <iobJS.StateCommon>{ type: 'number' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.SSId', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.BSSId', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Channel', <iobJS.StateCommon>{ type: 'number' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Mode', <iobJS.StateCommon>{ type: 'string' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.RSSI', <iobJS.StateCommon>{ type: 'number' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Wifi.Signal', <iobJS.StateCommon>{ type: 'number' });
            await createStateAsync(NSPanel_Path + 'Tasmota.Product', <iobJS.StateCommon>{ type: 'string' });

            try {
                const Tasmota_JSON = JSON.parse(result);
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
            } catch (err) {
                console.warn('get_tasmota_status0' + err.message);
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
        });
    } catch (err) {
        console.warn('error requesting firmware in function get_tasmota_status0: ' + err.message);
    }
}

function get_online_berry_driver_version() {
    try {
        if (NSPanel_Path + 'Config.Update.activ') {
            if (Debug) {
                console.log('Requesting online berry driver version');
            }
            request({
                url: 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be',
                headers: {
                    'User-Agent': 'ioBroker'
                }
            }, async (error, response, result) => {
                if (result) {
                    try {
                        const BerryDriverVersionOnline = result.substring((result.indexOf('version_of_this_script = ') + 24), result.indexOf('version_of_this_script = ') + 27).replace(/\s+/g, '');
                        await createStateAsync(NSPanel_Path + 'Berry_Driver.onlineVersion', <iobJS.StateCommon>{ type: 'string' });
                        setObject(AliasPath + 'Berry_Driver.onlineVersion', {type: 'channel', common: {role: 'info', name:'onlineVersion'}, native: {}});
                        await createAliasAsync(AliasPath + 'Berry_Driver.onlineVersion.ACTUAL', NSPanel_Path + 'Berry_Driver.onlineVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                        await setStateAsync(NSPanel_Path + 'Berry_Driver.onlineVersion', <iobJS.State>{ val: BerryDriverVersionOnline, ack: true });
                    } catch (err) {
                        console.log('get_online_berry_driver_version' +  err.message);
                    }
                }
            });
        }
    } catch (err) {
        console.warn('error requesting firmware in function get_online_berry_driver_version: ' + err.message);
    }
}

function check_version_tft_firmware() {
    try {
        if (Debug) {
            console.log('Requesting online TFT version');
        }
        request({
            url: 'https://api.github.com/repos/joBr99/nspanel-lovelace-ui/releases/latest',
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            if (result) {
                try {
                    let NSPanel_JSON = JSON.parse(result);                      // JSON Resultat in Variable Schreiben
                    let NSPanelTagName = NSPanel_JSON.tag_name;                 // created_at; published_at; name ; draft ; prerelease
                    let NSPanelVersion = NSPanelTagName.replace(/v/i, '');      // Aus Variable überflüssiges "v" filtern und in Release-Variable schreiben

                    await createStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string' });
                    await setStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.State>{ val: NSPanelVersion, ack: true });
                } catch (err) {
                    console.log('check_version_tft_firmware: ' + err.message);
                }
            }
        });
    } catch (err) {
        console.warn('error requesting firmware in function check_version_tft_firmware: ' + err.message);
    }
}

function check_online_display_firmware() {
    try {
        if (Debug) {
            console.log('Requesting online firmware version');
        }
        request({
            url: 'https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/apps/nspanel-lovelace-ui/nspanel-lovelace-ui.py',
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async (error, response, result) => {
            if (result) {
                try {
                    let desired_display_firmware_version = result.substring((result.indexOf('desired_display_firmware_version =') + 34), result.indexOf('desired_display_firmware_version =') + 38).replace(/\s+/g, '');

                    await createStateAsync(NSPanel_Path + 'Display_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string' });
                    await setStateAsync(NSPanel_Path + 'Display_Firmware.onlineVersion', <iobJS.State>{ val: desired_display_firmware_version, ack: true });
                } catch (err) {
                    console.warn('check_online_display_firmware' + err.message);
                }
            }
        });
    } catch (err) {
        console.warn('error requesting firmware in function check_online_display_firmware: ' + err.message);
    }
}

on({ id: config.panelRecvTopic }, async (obj) => {
    if (obj.state.val.startsWith('\{"CustomRecv":')) {
        try {
            let json = JSON.parse(obj.state.val);
            let split = json.CustomRecv.split(',');
            if (split[0] == 'event' && split[1] == 'startup') {
                await createStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.StateCommon>{ type: 'string' });
                await createStateAsync(NSPanel_Path + 'NSPanel_Version', <iobJS.StateCommon>{ type: 'string' });

                await setStateAsync(NSPanel_Path + 'Display_Firmware.currentVersion', <iobJS.State>{ val: split[2], ack: true });
                await setStateAsync(NSPanel_Path + 'NSPanel_Version', <iobJS.State>{ val: split[3], ack: true });
                
                if (autoCreateAlias) {
                    setObject(AliasPath + 'Display.TFTVersion', {type: 'channel', common: {role: 'info', name:'Display.TFTVersion'}, native: {}});
                    setObject(AliasPath + 'Display.Model', {type: 'channel', common: {role: 'info', name:'Display.Model'}, native: {}});
                    await createAliasAsync(AliasPath + 'Display.TFTVersion.ACTUAL', NSPanel_Path + 'Display_Firmware.currentVersion', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                    await createAliasAsync(AliasPath + 'Display.Model.ACTUAL', NSPanel_Path + 'NSPanel_Version', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'ACTUAL' });
                }
            }
        } catch (err) {
            console.warn('error rceiving CustomRecv: ' + err.message);
        }
    }
});

function update_berry_driver_version() {
    try {

        let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1`;
        if (tasmota_web_admin_password != '') {
            urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1`;
        }        
        
        request({
            url: `${urlString}`,
            headers: {
                'User-Agent': 'ioBroker'
            }
        }, async function () {

        });
    } catch (err) {
        console.warn('error at function update_berry_driver_version: ' + err.message);
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

        console.log('Start TFT-Upgrade for: ' + getState(NSPanel_Path + 'NSPanel_Version').val + ' Version');
        console.log('Install NextionTFT: ' + desired_display_firmware_url);

        try {
    
            let urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=FlashNextion ${desired_display_firmware_url}`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=FlashNextion ${desired_display_firmware_url}`;
            }
    
            request({
                url: `${urlString}`,
                headers: {
                    'User-Agent': 'ioBroker'
                }
            }, async function () {
                await createStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.StateCommon>{ type: 'string' });
                await setStateAsync(NSPanel_Path + 'TFT_Firmware.onlineVersion', <iobJS.State>{ val: tft_version, ack: true });
            });

        } catch (err) {
            console.warn('error at function update_tft_firmware: ' + err.message);
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

            request({
                url: `${urlString}`,
                headers: {
                    'User-Agent': 'ioBroker'
                }
            });

            urlString = `http://${get_current_tasmota_ip_address()}/cm?cmnd=Upgrade 1`;
            if (tasmota_web_admin_password != '') {
                urlString = `http://${get_current_tasmota_ip_address()}/cm?user=${tasmota_web_admin_user}&password=${tasmota_web_admin_password}&cmnd=Upgrade 1`;
            }

            request({
                url: `${urlString}`,
                headers: {
                    'User-Agent': 'ioBroker'
                }
            }, async function () {
            });
        }    
    } catch (err) {
        console.warn('error at function update_tasmota_firmware: ' + err.message);
    }
}

on({ id: config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'INFO1', change: 'ne'}, async (obj) => {
    try {
        if (getState(NSPanel_Path + 'Config.Update.activ').val == 0) {
            let Tasmota_JSON: any = JSON.parse(obj.state.val);
            if (Tasmota_JSON.Info1.Version.indexOf('safeboot') != -1) {
                console.warn('Tasmota in Safeboot - Please wait while upgrading');
                update_tasmota_firmware();
            } else {
                console.log('Tasmota upgrade complete. New Version: ' + Tasmota_JSON.Info1.Version);
                get_tasmota_status0();
                check_updates();
            }
        }
    } catch (err) {
        console.warn('error with reading senor-data: '+ err.message);
    }
});

//------------------End Update Functions

// Only monitor the extra nodes if present
let updateArray: string[] = [];

if (config.firstScreensaverEntity !== null && config.firstScreensaverEntity.ScreensaverEntity != null && existsState(config.firstScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.firstScreensaverEntity.ScreensaverEntity);
}
if (config.secondScreensaverEntity !== null && config.secondScreensaverEntity.ScreensaverEntity != null && existsState(config.secondScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.secondScreensaverEntity.ScreensaverEntity);
}
if (config.thirdScreensaverEntity !== null && config.thirdScreensaverEntity.ScreensaverEntity != null && existsState(config.thirdScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.thirdScreensaverEntity.ScreensaverEntity);
}
if (config.fourthScreensaverEntity !== null && config.fourthScreensaverEntity.ScreensaverEntity != null && existsState(config.fourthScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.fourthScreensaverEntity.ScreensaverEntity);
}
if (updateArray.length > 0) {
    on(updateArray, () => {
        HandleScreensaverUpdate();
    });
}

on({ id: config.panelRecvTopic, change: 'any' }, async function (obj) {
    try {
        if (obj.state.val.startsWith('\{"CustomRecv":')) {
            try {
                let json = JSON.parse(obj.state.val);

                let split = json.CustomRecv.split(',');
                HandleMessage(split[0], split[1], parseInt(split[2]), split);
            } catch (err) {
                console.warn(err.message);
            }
        }
    } catch (err) {
        console.warn('Trigger panelRecTopic: ' + err.message);
    }
});

function SendToPanel(val: Payload | Payload[]): void {
    try {
        if (Array.isArray(val)) {
            val.forEach(function (id) {
                setState(config.panelSendTopic, id.payload);
                if (Debug) {
                    console.log(id.payload);
                }
            });
        } else {
            setState(config.panelSendTopic, val.payload);
        }
    } catch (err) {
        console.warn('function SendToPanel: ' + err.message);
    }
}

on({ id: NSPanel_Alarm_Path + 'Alarm.AlarmState', change: 'ne' }, async (obj) => {
    try {
        if ((obj.state ? obj.state.val : '') == 'armed' || (obj.state ? obj.state.val : '') == 'disarmed' || (obj.state ? obj.state.val : '') == 'triggered') {
            if (Debug) {
                console.log(activePage);
            }
            if (NSPanel_Path == getState(NSPanel_Alarm_Path + 'Alarm.PANEL').val) {
                GeneratePage(activePage);
            }
        }
    } catch (err) {
        console.warn('Trigger AlarmState: ' + err.message);
    }
});

function HandleMessage(typ: string, method: string, page: number, words: Array<string>): void {
    try {
        if (typ == 'event') {
            switch (method) {
                case 'startup':
                    screensaverEnabled = false;
                    UnsubscribeWatcher();
                    HandleStartupProcess();
                    pageId = 0;
                    GeneratePage(config.pages[0]);
                    break;
                case 'sleepReached':
                    useMediaEvents = false;
                    screensaverEnabled = true;
                    if (pageId < 0)
                        pageId = 0;
                    HandleScreensaver();
                    break;
                case 'pageOpenDetail':
                    screensaverEnabled = false;
                    UnsubscribeWatcher();
                    let tempPageItem = words[3].split('?');
                    let pageItem = findPageItem(tempPageItem[0]);
                    if (pageItem !== undefined) {
                        //console.log(words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4]);
                        SendToPanel(GenerateDetailPage(words[2], tempPageItem[1], pageItem));
                    }
                    break;
                case 'buttonPress2':
                    screensaverEnabled = false;
                    HandleButtonEvent(words);
                    if (Debug) {
                        console.log(words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4]);
                    }
                    break;
                case 'button1':
                case 'button2':
                    screensaverEnabled = false;
                    HandleHardwareButton(method);
                    break;
                default:
                    break;
            }
        }
    } catch (err) {
        console.warn('function HandleMessage: ' + err.message);
    }
}

function findPageItem(searching: String): PageItem {
    try {

        let pageItem = activePage.items.find(e => e.id === searching);

        if (pageItem !== undefined) {
            return pageItem;
        }

        config.subPages.every(sp => {
            pageItem = sp.items.find(e => e.id === searching);

            return pageItem === undefined;
        });

        return pageItem;
    } catch (err) {
        console.warn('function findPageItem: ' + err.message);
    }
}

function GeneratePage(page: Page): void {
    try {
        activePage = page;
        setIfExists(NSPanel_Path + 'ActivePage.type', activePage.type);
        setIfExists(NSPanel_Path + 'ActivePage.heading', activePage.heading);
        switch (page.type) {
            case 'cardEntities':
                SendToPanel(GenerateEntitiesPage(<PageEntities>page));
                break;
            case 'cardThermo':
                SendToPanel(GenerateThermoPage(<PageThermo>page));
                break;
            case 'cardGrid':
                SendToPanel(GenerateGridPage(<PageGrid>page));
                break;
            case 'cardMedia':
                useMediaEvents = true;
                SendToPanel(GenerateMediaPage(<PageMedia>page));
                break;
            case 'cardAlarm':
                SendToPanel(GenerateAlarmPage(<PageAlarm>page));
                break;
            case 'cardQR':
                SendToPanel(GenerateQRPage(<PageQR>page));
                break;
            case 'cardPower':
                SendToPanel(GeneratePowerPage(<PagePower>page));
                break;
            case 'cardChart':
                SendToPanel(GenerateChartPage(<PageChart>page));
                break;
            case 'cardLChart':
                SendToPanel(GenerateChartPage(<PageChart>page));
                break;
            case 'cardUnlock':
                SendToPanel(GenerateUnlockPage(<PageUnlock>page));
                break;
        }
    } catch (err) {
        if (err.message == "Cannot read properties of undefined (reading 'type')") {
            console.log('Please wait a few seconds longer when launching the NSPanel. Not all parameters are loaded yet.');
        } else {
            console.warn('function GeneratePage: ' + err.message);
        }
    }
}

function HandleHardwareButton(method: string): void {
    try {
        let page: (PageThermo | PageMedia | PageAlarm | PageEntities | PageGrid | PageQR | PagePower | PageChart | PageUnlock);
        if (config.button1Page !== null && method == 'button1') {
            page = config.button1Page;
            pageId = -1;
        } else if (config.button2Page !== null && method == 'button2') {
            page = config.button2Page;
            pageId = -2;
        } else {
            return;
        }

        GeneratePage(page);
    } catch (err) {
        console.warn('function HandleHardwareButton: ' + err.message);
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

            const date = new Date();
            const options: any = { weekday: dpWeekday, year: 'numeric', month: dpMonth, day: 'numeric' };
            const _SendDate = date.toLocaleDateString(getState(NSPanel_Path + 'Config.locale').val, options);

            SendToPanel(<Payload>{ payload: 'date~' + _SendDate });
        }
    } catch (err) {
        if (err.message = 'Cannot convert undefined or null to object') {
            console.log('Datumsformat noch nicht initialisiert');
        } else {
            console.warn('function SendDate: ' + err.message);
        }
    }
}

function SendTime(): void {
    try {
        const d = new Date();
        const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
        const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

        SendToPanel(<Payload>{ payload: 'time~' + hr + ':' + min });
    } catch (err) {
        console.warn('function SendTime: ' + err.message);
    }
}

function GenerateEntitiesPage(page: PageEntities): Payload[] {
    try {
        let out_msgs: Array<Payload>;
        out_msgs = [{ payload: 'pageType~cardEntities' }]
        out_msgs.push({ payload: GeneratePageElements(page) });
        return out_msgs
    } catch (err) {
        console.warn('function GenerateEntitiesPage: ' + err.message);
    }
}

function GenerateGridPage(page: PageGrid): Payload[] {
    try {
        let out_msgs: Array<Payload> = [{ payload: 'pageType~cardGrid' }];
        out_msgs.push({ payload: GeneratePageElements(page) });
        return out_msgs;
    } catch (err) {
        console.warn('function GenerateGridPage: ' + err.message);
    }
}

function GeneratePageElements(page: Page): string {
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
        }

        let pageData = 'entityUpd~' + page.heading + '~' + GetNavigationString(pageId);

        for (let index = 0; index < maxItems; index++) {
            if (page.items[index] !== undefined) {
                pageData += CreateEntity(page.items[index], index + 1, page.useColor);
            }
        }
        return pageData;
    } catch (err) {
        console.warn('function GeneratePageElements: ' + err.message);
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
        let type: string;

        // ioBroker
        if (existsObject(pageItem.id) || pageItem.navigate === true) {

            let iconColor = rgb_dec565(config.defaultColor);
            let optVal = '0';
            let val = null;

            let o:any
            if (pageItem.id != null && existsObject(pageItem.id)) {
                o = getObject(pageItem.id);
            } 

            // Fallback if no name is given
            name = pageItem.name !== undefined ? pageItem.name : o.common.name.de;
            let prefix = pageItem.prefixName !== undefined ? pageItem.prefixName : '';
            let suffix = pageItem.suffixName !== undefined ? pageItem.suffixName : '';

            // If name is used with changing values
            if (name.indexOf('getState(') != -1) {
                let dpName: string = name.slice(10, name.length -6);
                name = getState(dpName).val;
                RegisterEntityWatcher(dpName);
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

                if (pageItem.id == null && pageItem.targetPage != undefined){
                    let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);

                    return '~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + pageItem.name + '~' + buttonText;
                } else if (pageItem.id != null && pageItem.targetPage != undefined){
                    let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';
                    type = 'button';
                    
                    switch (o.common.role) {
                        case 'socket':
                        case 'light':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
                            iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : o.common.role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
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
                            break;                   
                        case 'blind':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                            iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? getState(pageItem.id + '.ACTUAL').val : true, useColors);
                            break;
                        case 'door':
                        case 'window':
                            if (existsState(pageItem.id + '.ACTUAL')) {
                                if (getState(pageItem.id + '.ACTUAL').val) {
                                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'door' ? Icons.GetIcon('door-open') : Icons.GetIcon('window-open-variant');
                                    iconColor = GetIconColor(pageItem, false, useColors);
                                } else {
                                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'door' ? Icons.GetIcon('door-closed') : Icons.GetIcon('window-closed-variant');
                                    iconColor = GetIconColor(pageItem, true, useColors);
                                }
                            }
                            break;
                        case 'info':
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                            iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : Icons.GetIcon('gesture-tap-button');
                            iconColor = GetIconColor(pageItem, true, useColors);
                            if (val === true || val === 'true') {
                                iconColor = GetIconColor(pageItem, true, useColors);
                            } else {
                                iconColor = GetIconColor(pageItem, false, useColors);
                                if (pageItem.icon !== undefined) {
                                    if (pageItem.icon2 !== undefined) {
                                        iconId = iconId2;
                                    }
                                }
                            };
                            break;
                        default:
                            return '~delete~~~~~';
                    }
                    return '~' + type + '~' + 'navigate.' + pageItem.targetPage + '~' + iconId + '~' + iconColor + '~' + pageItem.name + '~' + buttonText;   
                } else {
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';

                    return '~' + type + '~' + 'navigate.' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + pageItem.name + '~' + buttonText;                    
                } 
            } 

            switch (o.common.role) {
                case 'socket':
                case 'light':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
                    iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : o.common.role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');
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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'hue':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';

                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? 100 - getState(pageItem.id + '.DIMMER').val : true, useColors);
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
                                let rgb = <RGB>{ red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2]) };
                                iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                            }
                        }
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'ct':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';

                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? 100 - getState(pageItem.id + '.DIMMER').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'rgb':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';

                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? 100 - getState(pageItem.id + '.DIMMER').val : true, useColors);
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
                            let rgb = <RGB>{ red: Math.round(rgbRed), green: Math.round(rgbGreen), blue: Math.round(rgbBlue) };
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    } 

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'cie':
                case 'rgbSingle':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';

                    if (val === true || val === 'true') {
                        optVal = '1'
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.DIMMER') ? 100 - getState(pageItem.id + '.DIMMER').val : true, useColors);
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
                            let rgb = <RGB>{ red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue) };
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        }
                    } 

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'dimmer':
                    type = 'light';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('lightbulb');
                    optVal = '0';

                    if (val === true || val === 'true') {
                        optVal = '1';
                        iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? 100 - getState(pageItem.id + '.ACTUAL').val : true, useColors);
                    } else {
                        iconColor = GetIconColor(pageItem, false, useColors);
                        if (pageItem.icon !== undefined) {
                            if (pageItem.icon2 !== undefined) {
                                iconId = iconId2;
                            }
                        }
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'blind':
                    type = 'shutter';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + '.ACTUAL') ? getState(pageItem.id + '.ACTUAL').val : true, useColors);

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~';

                case 'gate':
                    type = 'text';
                    let gateState: string;
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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + gateState;

                case 'door':
                case 'window':
                    type = 'text';
                    let windowState;

                    if (existsState(pageItem.id + '.ACTUAL')) {
                        if (getState(pageItem.id + '.ACTUAL').val) {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'door' ? Icons.GetIcon('door-open') : Icons.GetIcon('window-open-variant');
                            iconColor = GetIconColor(pageItem, false, useColors);
                            windowState = findLocale('window', 'opened');
                        } else {
                            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'door' ? Icons.GetIcon('door-closed') : Icons.GetIcon('window-closed-variant');
                            iconColor = GetIconColor(pageItem, true, useColors);
                            windowState = findLocale('window', 'closed');
                        }
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + windowState;

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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;

                case 'info':

                case 'humidity':

                case 'temperature':

                case 'value.temperature':

                case 'value.humidity':

                case 'sensor.door':

                case 'sensor.window':

                case 'thermostat':
                    type = 'text';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'value.temperature' || o.common.role == 'thermostat' ? Icons.GetIcon('thermometer') : Icons.GetIcon('information-outline');
                    let unit = '';
                    optVal = '0';

                    if (existsState(pageItem.id + '.ON_ACTUAL')) {
                        optVal = getState(pageItem.id + '.ON_ACTUAL').val;
                        unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ON_ACTUAL');
                    } else if (existsState(pageItem.id + '.ACTUAL')) {
                        optVal = getState(pageItem.id + '.ACTUAL').val;
                        unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + '.ACTUAL');
                    }

                    if (o.common.role == 'value.temperature') {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('thermometer');
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

                    if (pageItem.useValue) {
                        iconId = optVal; 
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal + ' ' + unit;

                case 'buttonSensor':

                    type = 'input_sel';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let inSelText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + inSelText;

                case 'button':
                    type = 'button';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + buttonText;

                case 'level.timer':
                    type = 'timer';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('gesture-tap-button');
                    iconColor = GetIconColor(pageItem, true, useColors);
                    let timerText = pageItem.buttonText !== undefined ? pageItem.buttonText : 'PRESS';

                    if (existsState(pageItem.id + '.STATE')) {
                        val = getState(pageItem.id + '.STATE').val;
                        RegisterEntityWatcher(pageItem.id + '.STATE');
                    }

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + timerText;

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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + optVal;                
                    
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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + lockState;

                case 'slider':
                    type = 'number';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('plus-minus-variant');

                    iconColor = GetIconColor(pageItem, false, useColors);

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue;

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

                    return '~' + type + '~' + pageItem.id + '~' + iconId + '~' + iconColor + '~' + name + '~' + val + '|' + pageItem.minValue + '|' + pageItem.maxValue;

                case 'warning':
                    type = 'text';
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('alert-outline');
                    iconColor = getState(([pageItem.id, '.LEVEL'].join(''))).val;
                    let itemName = getState(([pageItem.id, '.TITLE'].join(''))).val;
                    let itemInfo = getState(([pageItem.id, '.INFO'].join(''))).val;

                    return '~' + type + '~' + itemName + '~' + iconId + '~' + iconColor + '~' + itemName + '~' + itemInfo;

                default:
                    return '~delete~~~~~';
            }
            
        }
        
        return '~delete~~~~~';
    } catch (err) {
        if (err.message == "Cannot read properties of undefined (reading 'common')") {
            console.warn('Found Alias without channel: ' + pageItem.id + '! Please correct the Alias');
        } else {
            console.warn('function CreateEntity: ' + err.message);
        }
    }
}

function findLocale(controlsObject: string, controlsState: string): string {
    const locale = getState(NSPanel_Path + 'Config.locale').val;
    const strJson = getState(NSPanel_Path + 'NSPanel_locales_json').val;

    if (Debug) {
        console.log(controlsObject + ' - ' + controlsState);
    }

    try {
        const obj = JSON.parse(strJson);
        const strLocale = obj[controlsObject][controlsState][locale];

        if (strLocale != undefined) {
            return strLocale;
        } else {
            return controlsState;
        }

    } catch (err) {
        if (err.message.substring(0, 35) == 'Cannot read properties of undefined') {
            if (Debug) {
                console.log('function findLocale: missing translation: ' + controlsObject + ' - ' + controlsState);
            }
        } else {
            console.warn('function findLocale: ' + err.message);
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
                    scale(value, minValue, maxValue, 0, 1)
                )
            );
        }

        if ((pageItem.useColor || useColors) && ((typeof (value) === 'boolean' && value) || value > (pageItem.minValueBrightness !== undefined ? pageItem.minValueBrightness : 0))) {
            return rgb_dec565(pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor);
        }

        return rgb_dec565(pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor);
    } catch (err) {
        console.warn('function GetIconColor: ' + err.message);
    }
}

function RegisterEntityWatcher(id: string): void {
    try {
        if (subscriptions.hasOwnProperty(id)) {
            return;
        }

        subscriptions[id] = (on({ id: id, change: 'any' }, () => {
            if (pageId == -1 && config.button1Page != undefined) {
                SendToPanel({ payload: GeneratePageElements(config.button1Page) });
            }
            if (pageId == -2 && config.button2Page != undefined) {
                SendToPanel({ payload: GeneratePageElements(config.button2Page) });
            }
            if (activePage !== undefined) {
                SendToPanel({ payload: GeneratePageElements(activePage) });
            }
        }));
    } catch (err) {
        console.warn('function RegisterEntityWatcher: ' + err.message);
    }
}

function RegisterDetailEntityWatcher(id: string, pageItem: PageItem, type: string): void {
    try {
        if (subscriptions.hasOwnProperty(id)) {
            return;
        }

        subscriptions[id] = (on({ id: id, change: 'any' }, () => {
            SendToPanel(GenerateDetailPage(type, undefined, pageItem));
        }))
    } catch (err) {
        console.warn('function RegisterDetailEntityWatcher: ' + err.message);
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
    } catch (err) {
        console.warn('function GetUnitOfMeasurement: ' + err.message);
    }
}

function GenerateThermoPage(page: PageThermo): Payload[] {
    try {
        let id = page.items[0].id
        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~cardThermo' });

        // ioBroker
        if (existsObject(id)) {
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
            let status = '';
            if (existsState(id + '.MODE')) {
                status = getState(id + '.MODE').val;    // FixMe: Variable status is never used!
            }

            //Attribute hinzufügen, wenn im Alias definiert
            let i_list = Array.prototype.slice.apply($('[state.id="' + id + '.*"]'));
            let bt = ['~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~', '~~~~'];
            if ((i_list.length - 3) != 0) {

                let i = 0;

                if (o.common.role == 'thermostat') {

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
                                            bt[i - 1] = Icons.GetIcon('power-standby') + '~2016~1~' + 'POW' + '~';
                                        } else {
                                            bt[i - 1] = Icons.GetIcon('power-standby') + '~33840~1~' + 'POW' + '~';
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

                if (o.common.role == 'airCondition') {
                    if (existsState(id + '.MODE') && getState(id + '.MODE').val != null) {
                        let Mode = getState(id + '.MODE').val
                        if (existsState(id + '.POWER') && getState(id + '.POWER').val != null) {
                            if (Mode != 0 || getState(id + '.POWER').val) {                             //0=ON oder .POWER = true
                                bt[0] = Icons.GetIcon('power-standby') + '~2016~1~' + 'POWER' + '~';
                                statusStr = 'ON';
                            } else {
                                bt[0] = Icons.GetIcon('power-standby') + '~35921~0~' + 'POWER' + '~';
                                statusStr = 'OFF';
                            }
                        }
                        if (Mode == 1) {                                                                //1=AUTO
                            bt[1] = Icons.GetIcon('air-conditioner') + '~1024~1~' + 'AUTO' + '~';
                            statusStr = 'AUTO';
                        } else {
                            bt[1] = Icons.GetIcon('air-conditioner') + '~35921~0~' + 'AUTO' + '~';
                        }
                        if (Mode == 2) {                                                                //2=COOL
                            bt[2] = Icons.GetIcon('snowflake') + '~11487~1~' + 'COOL' + '~';
                            statusStr = 'COOL';
                        } else {
                            bt[2] = Icons.GetIcon('snowflake') + '~35921~0~' + 'COOL' + '~';
                        }
                        if (Mode == 3) {                                                                //3=HEAT
                            bt[3] = Icons.GetIcon('fire') + '~64512~1~' + 'HEAT' + '~';
                            statusStr = 'HEAT';
                        } else {
                            bt[3] = Icons.GetIcon('fire') + '~35921~0~' + 'HEAT' + '~';
                        }
                        if (Mode == 4) {                                                                //4=ECO
                            bt[4] = Icons.GetIcon('alpha-e-circle-outline') + '~2016~1~' + 'ECO' + '~';
                            statusStr = 'ECO';
                        } else {
                            bt[4] = Icons.GetIcon('alpha-e-circle-outline') + '~35921~0~' + 'ECO' + '~';
                        }
                        if (Mode == 5) {                                                                //5=FANONLY
                            bt[5] = Icons.GetIcon('fan') + '~11487~1~' + 'FAN' + '~';
                            statusStr = 'FAN ONLY';
                        } else {
                            bt[5] = Icons.GetIcon('fan') + '~35921~0~' + 'FAN' + '~';
                        }
                        if (Mode == 6) {                                                                //6=DRY
                            bt[6] = Icons.GetIcon('water-percent') + '~60897~1~' + 'DRY' + '~';
                            statusStr = 'DRY';
                        } else {
                            bt[6] = Icons.GetIcon('water-percent') + '~35921~0~' + 'DRY' + '~';
                        }
                        if (existsState(id + '.SWING') && getState(id + '.SWING').val != null) {
                            if (getState(id + '.POWER').val && getState(id + '.SWING').val == 1) {          //0=ON oder .SWING = true
                                bt[7] = Icons.GetIcon('swap-vertical-bold') + '~2016~1~' + 'SWING' + '~';
                            } else {
                                bt[7] = Icons.GetIcon('swap-vertical-bold') + '~35921~0~' + 'SWING' + '~';
                            }
                        }
                    }
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
                    + currentTemp + temperatureUnit+ '~'                // Ist-Temperatur (String)
                    + destTemp + '~'                                    // Soll-Temperatur (numerisch ohne Komma)
                    + statusStr + '~'                                   // Mode
                    + minTemp + '~'                                     // Thermostat Min-Temperatur
                    + maxTemp + '~'                                     // Thermostat Max-Temperatur
                    + stepTemp + '~'                                    // Schritte für Soll (5°C)
                    + icon_res                                      // Icons Status
                    + findLocale('thermostat', 'Currently') + '~'       // Bezeichner vor Aktueller Raumtemperatur
                    + findLocale('thermostat', 'State') + '~~'           // Bezeichner vor State
                    + temperatureUnit + '~'                      // iconTemperature dstTempTwoTempMode
                    + destTemp2 + '~'                                   // dstTempTwoTempMode --> Wenn Wert, dann 2 Temp
                    + thermoPopup                                       // PopUp

            });

        }

        if (Debug) {
            console.log(out_msgs);
        }
        return out_msgs;
    } catch (err) {
        console.warn('function GenerateThermoPage: ' + err.message);
    }
}

function unsubscribeMediaSubscriptions(): void {
    for (let i = 0; i < config.pages.length; i++) {
        if (config.pages[i].type == 'cardMedia') {
            let mediaID = config.pages[i].items[0].id;
            unsubscribe(mediaID + '.STATE')
            unsubscribe(mediaID + '.ARTIST')
            unsubscribe(mediaID + '.TITLE')
            unsubscribe(mediaID + '.ALBUM')
            unsubscribe(mediaID + '.VOLUME')
            unsubscribe(mediaID + '.REPEAT')
            unsubscribe(mediaID + '.SHUFFLE')
        }
    }
    for (let i = 0; i < config.subPages.length; i++) {
        if (config.subPages[i].type == 'cardMedia') {
            let mediaID = config.subPages[i].items[0].id;
            unsubscribe(mediaID + '.STATE')
            unsubscribe(mediaID + '.ARTIST')
            unsubscribe(mediaID + '.TITLE')
            unsubscribe(mediaID + '.ALBUM')
            unsubscribe(mediaID + '.VOLUME')
            unsubscribe(mediaID + '.REPEAT')
            unsubscribe(mediaID + '.SHUFFLE')
        }
    }
} 

function subscribeMediaSubscriptions(id: string): void {
    on({id: [].concat([id + '.STATE']).concat([id + '.VOLUME']).concat([id + '.ARTIST']).concat([id + '.ALBUM']).concat([id + '.TITLE']).concat([id + '.SHUFFLE']).concat([id + '.REPEAT']), change: "ne"}, async function () {
        (function () { if (timeoutMedia) { clearTimeout(timeoutMedia); timeoutMedia = null; } })();
        timeoutMedia = setTimeout(async function () {
            if (useMediaEvents) {
                GeneratePage(activePage);
            }
        },50)
    });
} 

async function createAutoMediaAlias(id: string, mediaDevice: string, adapterPlayerInstance: string) {
    if (autoCreateAlias) {

        if (adapterPlayerInstance == 'alexa2.0.') {
            if (existsObject(id) == false){
                console.log('Alexa Alias ' + id + ' does not exist - will be created now');

                let dpPath: string = adapterPlayerInstance + 'Echo-Devices.' + mediaDevice;
                try {
                    setObject(id, {_id: id, type: 'channel', common: {role: 'media', name:'media'}, native: {}});
                    await createAliasAsync(id + '.ACTUAL', dpPath + '.Player.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'value.volume', name: 'ACTUAL' });
                    await createAliasAsync(id + '.ALBUM', dpPath + '.Player.currentAlbum', true, <iobJS.StateCommon>{ type: 'string', role: 'media.album', name: 'ALBUM' });
                    await createAliasAsync(id + '.ARTIST', dpPath + '.Player.currentArtist', true, <iobJS.StateCommon>{ type: 'string', role: 'media.artist', name: 'ARTIST' });
                    await createAliasAsync(id + '.TITLE', dpPath + '.Player.currentTitle', true, <iobJS.StateCommon>{ type: 'string', role: 'media.title', name: 'TITLE' });
                    await createAliasAsync(id + '.NEXT', dpPath + '.Player.controlNext', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.next', name: 'NEXT' });
                    await createAliasAsync(id + '.PREV', dpPath + '.Player.controlPrevious', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.prev', name: 'PREV' });
                    await createAliasAsync(id + '.PLAY', dpPath + '.Player.controlPlay', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.play', name: 'PLAY' });
                    await createAliasAsync(id + '.PAUSE', dpPath + '.Player.controlPause', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.pause', name: 'PAUSE' });
                    await createAliasAsync(id + '.STOP', dpPath + '.Commands.deviceStop', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.stop', name: 'STOP' });
                    await createAliasAsync(id + '.STATE', dpPath + '.Player.currentState', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.state', name: 'STATE' });
                    await createAliasAsync(id + '.VOLUME', dpPath + '.Player.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'level.volume', name: 'VOLUME' });
                    await createAliasAsync(id + '.REPEAT', dpPath + '.Player.controlRepeat', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.mode.repeat', name: 'REPEAT' });
                    await createAliasAsync(id + '.SHUFFLE', dpPath + '.Player.controlShuffle', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE' });        
                } catch (err) {
                    console.warn('function createAutoMediaAlias: ' + err.message);
                }
            }
        }

        if (adapterPlayerInstance == 'spotify-premium.0.') {
            if (existsObject(id) == false){
                console.log('Spotify Alias ' + id + ' does not exist - will be created now');

                let dpPath: string = adapterPlayerInstance;
                try {
                    setObject(id, {_id: id + 'player', type: 'channel', common: {role: 'media', name:'media'}, native: {}});
                    await createAliasAsync(id + '.ACTUAL', dpPath + 'player.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'value.volume', name: 'ACTUAL' });
                    await createAliasAsync(id + '.ALBUM', dpPath + 'player.album', true, <iobJS.StateCommon>{ type: 'string', role: 'media.album', name: 'ALBUM' });
                    await createAliasAsync(id + '.ARTIST', dpPath + 'player.artistName', true, <iobJS.StateCommon>{ type: 'string', role: 'media.artist', name: 'ARTIST' });
                    await createAliasAsync(id + '.TITLE', dpPath + 'player.trackName', true, <iobJS.StateCommon>{ type: 'string', role: 'media.title', name: 'TITLE' });
                    await createAliasAsync(id + '.CONTEXT_DESCRIPTION', dpPath + 'player.contextDescription', true, <iobJS.StateCommon>{ type: 'string', role: 'media.station', name: 'CONTEXT_DESCRIPTION' });
                    await createAliasAsync(id + '.NEXT', dpPath + 'player.skipPlus', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.next', name: 'NEXT' });
                    await createAliasAsync(id + '.PREV', dpPath + 'player.skipMinus', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.prev', name: 'PREV' });
                    await createAliasAsync(id + '.PLAY', dpPath + 'player.play', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.play', name: 'PLAY' });
                    await createAliasAsync(id + '.PAUSE', dpPath + 'player.pause', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.pause', name: 'PAUSE' });
                    await createAliasAsync(id + '.STOP', dpPath + 'player.pause', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.stop', name: 'STOP' });
                    await createAliasAsync(id + '.STATE', dpPath + 'player.isPlaying', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.state', name: 'STATE' });
                    await createAliasAsync(id + '.VOLUME', dpPath + 'player.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'level.volume', name: 'VOLUME' });
                    await createAliasAsync(id + '.REPEAT', dpPath + 'player.repeat', true, <iobJS.StateCommon>{ type: 'string', role: 'value', name: 'REPEAT' });
                    await createAliasAsync(id + '.SHUFFLE', dpPath + 'player.shuffle', true, <iobJS.StateCommon>{ type: 'string', role: 'value', name: 'SHUFFLE' });
                
                } catch (err) {
                    console.warn('function createAutoMediaAlias: ' + err.message);
                }
            }
        }

        if (adapterPlayerInstance == 'sonos.0.') {
            if (existsObject(id) == false){
                console.log('Sonos Alias ' + id + ' does not exist - will be created now');

                let dpPath: string = adapterPlayerInstance + 'root.' + mediaDevice;
                try {
                    setObject(id, {_id: id, type: 'channel', common: {role: 'media', name:'media'}, native: {}});
                    await createAliasAsync(id + '.ACTUAL', dpPath + '.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'value.volume', name: 'ACTUAL' });
                    await createAliasAsync(id + '.ALBUM', dpPath + '.current_album', true, <iobJS.StateCommon>{ type: 'string', role: 'media.album', name: 'ALBUM' });
                    await createAliasAsync(id + '.ARTIST', dpPath + '.current_artist', true, <iobJS.StateCommon>{ type: 'string', role: 'media.artist', name: 'ARTIST' });
                    await createAliasAsync(id + '.TITLE', dpPath + '.current_title', true, <iobJS.StateCommon>{ type: 'string', role: 'media.title', name: 'TITLE' });
                    await createAliasAsync(id + '.CONTEXT_DESCRIPTION', dpPath + '.current_station', true, <iobJS.StateCommon>{ type: 'string', role: 'media.station', name: 'CONTEXT_DESCRIPTION' });
                    await createAliasAsync(id + '.NEXT', dpPath + '.next', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.next', name: 'NEXT' });
                    await createAliasAsync(id + '.PREV', dpPath + '.prev', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.prev', name: 'PREV' });
                    await createAliasAsync(id + '.PLAY', dpPath + '.play', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.play', name: 'PLAY' });
                    await createAliasAsync(id + '.PAUSE', dpPath + '.pause', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.pause', name: 'PAUSE' });
                    await createAliasAsync(id + '.STOP', dpPath + '.stop', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.stop', name: 'STOP' });
                    await createAliasAsync(id + '.STATE', dpPath + '.state_simple', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.state', name: 'STATE' });
                    await createAliasAsync(id + '.VOLUME', dpPath + '.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'level.volume', name: 'VOLUME' });
                    await createAliasAsync(id + '.REPEAT', dpPath + '.repeat', true, <iobJS.StateCommon>{ type: 'number', role: 'media.mode.repeat', name: 'REPEAT' });
                    await createAliasAsync(id + '.SHUFFLE', dpPath + '.shuffle', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE' });                    
                } catch (err) {
                    console.warn('function createAutoMediaAlias: ' + err.message);
                }
            }
        }

        if (adapterPlayerInstance.startsWith('volumio')) {
            if (existsObject(id) == false){
                console.log('Volumio Alias ' + id + ' does not exist - will be created now')

                let dpPath: string = adapterPlayerInstance;
                try {
                    setObject(id, {_id: id, type: 'channel', common: {role: 'media', name:'media'}, native: {}});
                    await createAliasAsync(id + '.ACTUAL', dpPath + 'playbackInfo.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'value.volume', name: 'ACTUAL' });
                    await createAliasAsync(id + '.ALBUM', dpPath + 'playbackInfo.album', true, <iobJS.StateCommon>{ type: 'string', role: 'media.album', name: 'ALBUM' });
                    await createAliasAsync(id + '.ARTIST', dpPath + 'playbackInfo.artist', true, <iobJS.StateCommon>{ type: 'string', role: 'media.artist', name: 'ARTIST' });
                    await createAliasAsync(id + '.TITLE', dpPath + 'playbackInfo.title', true, <iobJS.StateCommon>{ type: 'string', role: 'media.title', name: 'TITLE' });
                    await createAliasAsync(id + '.NEXT', dpPath + 'player.next', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.next', name: 'NEXT' });
                    await createAliasAsync(id + '.PREV', dpPath + 'player.prev', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.prev', name: 'PREV' });
                    await createAliasAsync(id + '.PLAY', dpPath + 'player.play', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.play', name: 'PLAY' });
                    await createAliasAsync(id + '.PAUSE', dpPath + 'player.toggle', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.pause', name: 'PAUSE' });
                    await createAliasAsync(id + '.STOP', dpPath + 'player.stop', true, <iobJS.StateCommon>{ type: 'boolean', role: 'button.stop', name: 'STOP' });
                    await createAliasAsync(id + '.STATE', dpPath + 'playbackInfo.status', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.state', name: 'STATE' });
                    await createAliasAsync(id + '.VOLUME', dpPath + 'playbackInfo.volume', true, <iobJS.StateCommon>{ type: 'number', role: 'level.volume', name: 'VOLUME' });
                    await createAliasAsync(id + '.REPEAT', dpPath + 'playbackInfo.repeat', true, <iobJS.StateCommon>{ type: 'number', role: 'media.mode.repeat', name: 'REPEAT' });
                    await createAliasAsync(id + '.SHUFFLE', dpPath + 'queue.shuffle', true, <iobJS.StateCommon>{ type: 'boolean', role: 'media.mode.shuffle', name: 'SHUFFLE' });                    
                    await createAliasAsync(id + '.status', dpPath + 'playbackInfo.status', true, <iobJS.StateCommon>{ type: 'string', role: 'media.state', name: 'status' });
                } catch (err) {
                    console.warn('function createAutoMediaAlias: ' + err.message);
                }
            }
        }
    }    
}

function GenerateMediaPage(page: PageMedia): Payload[] {
    try {
        let id = page.items[0].id;

        let out_msgs: Array<Payload> = [];

        unsubscribeMediaSubscriptions();
        
        subscribeMediaSubscriptions(id);

        if (page.items[0].autoCreateALias) {
            let vMediaDevice = (page.items[0].mediaDevice != undefined) ? page.items[0].mediaDevice : '';
            createAutoMediaAlias(id, vMediaDevice, page.items[0].adapterPlayerInstance);
        }

        out_msgs.push({ payload: 'pageType~cardMedia' });
        if (existsObject(id)) {
            let name = getState(id + '.ALBUM').val;
            let title = getState(id + '.TITLE').val;
            let author = getState(id + '.ARTIST').val;
            let shuffle = getState(id + '.SHUFFLE').val;

            let vInstance = page.items[0].adapterPlayerInstance;
            let v1Adapter = vInstance.split('.');
            let v2Adapter = v1Adapter[0];

            //Neue Adapter/Player
            let media_icon = Icons.GetIcon('playlist-music');

            //Spotify-Premium
            if (v2Adapter == 'spotify-premium') {
                media_icon = Icons.GetIcon('spotify');
                name = getState(id + '.CONTEXT_DESCRIPTION').val;
                let nameLength = name.length;
                if (name.substring(0,9) == 'Playlist:') {
                    name = name.slice(10, 26) + '...';
                } else if (name.substring(0,6) == 'Album:') {
                    name = name.slice(7, 23) + '...';
                } else if (name.substring(0,6) == 'Track') {
                    name = 'Spotify-Premium';
                }
                if (nameLength == 0) {
                    name = 'Spotify-Premium';
                }
                author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                if (author.length > 30) {
                    author = getState(id + '.ARTIST').val;
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = 'no music to control';
                }
            }

            //Sonos
            if (v2Adapter == 'sonos') {
                media_icon = Icons.GetIcon('music');
                name = getState(id + '.CONTEXT_DESCRIPTION').val;
                let nameLenght = name.length;
                if (nameLenght == 0) {
                    name = 'Sonos Player';
                }
                author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = 'no music to control';
                }
            }

            //Logitech Squeezebox RPC
            if (v2Adapter == 'squeezeboxrpc') {
                media_icon = Icons.GetIcon('dlna');
                let nameLength = name.length;
                if (nameLength == 0) {
                    name = 'Squeezebox RPC';
                    author = 'no music to control';
                }
            }

            //Alexa2
            if (v2Adapter == 'alexa2') {
                media_icon = Icons.GetIcon('music-circle');
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
                }
                author = getState(id + '.ARTIST').val + ' | ' + getState(id + '.ALBUM').val;
                if (author.length > 30) {
                    author = getState(id + '.ARTIST').val;
                }
                if ((getState(id + '.ARTIST').val).length == 0) {
                    author = 'no music to control';
                }
            }

            //Volumio
            if (v2Adapter == 'volumio') {
                if (name != undefined) { author = author + " [" + name + "]"; }
                name = getState(vInstance + 'info.name').val;  /* page.heading; 
                                                                  getState(id + '.TRACK').val; */
            }

            let volume = getState(id + '.VOLUME').val;
            let iconplaypause = Icons.GetIcon('pause'); //pause
            let shuffle_icon = Icons.GetIcon('shuffle-variant'); //shuffle
            let onoffbutton = 1374;

            if (shuffle == 'off' || shuffle == false || shuffle == 0) {
                shuffle_icon = Icons.GetIcon('shuffle-disabled'); //shuffle
            }
            if (v2Adapter == 'volumio') { shuffle_icon = Icons.GetIcon('refresh'); } //Volumio: refresh playlist


            //Für alle Player
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

            let currentSpeaker = 'kein Speaker gefunden';

            if (v2Adapter == 'alexa2') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', page.items[0].mediaDevice, '.Info.name'].join(''))).val;
            } else if (v2Adapter == 'spotify-premium') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'player.device.name'].join(''))).val;
            } else if (v2Adapter == 'sonos') {
                currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'root.', page.items[0].mediaDevice, '.members'].join(''))).val;
            } else if (v2Adapter == 'squeezeboxrpc') {
                if(existsObject(([page.items[0].adapterPlayerInstance, 'Playername'].join('')))) {
                    currentSpeaker = getState(([page.items[0].adapterPlayerInstance, 'Playername'].join(''))).val;
                }
            }
            //-------------------------------------------------------------------------------------------------------------
            // nachfolgend alle Alexa-Devices (ist Online / Player- und Commands-Verzeichnis vorhanden) auflisten und verketten
            // Wenn Konstante alexaSpeakerList mind. einen Eintrag enthÃ¤lt, wird die Konstante verwendet - ansonsten Alle Devices aus dem Alexa Adapter
            let speakerList = '';
            if (page.items[0].speakerList.length > 0) {
                for (let i_index in page.items[0].speakerList) {
                    speakerList = speakerList + page.items[0].speakerList[i_index] + '?';
                }
            } else {
                let i_list = Array.prototype.slice.apply($('[state.id="' + page.items[0].adapterPlayerInstance + 'Echo-Devices.*.Info.name"]'));
                for (let i_index in i_list) {
                    let i = i_list[i_index];
                    let deviceId = i;
                    deviceId = deviceId.split('.');
                    if (getState(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.online'].join(''))).val &&
                        existsObject(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.Player'].join(''))) &&
                        existsObject(([page.items[0].adapterPlayerInstance, 'Echo-Devices.', deviceId[3], '.Commands'].join('')))) {
                        speakerList = speakerList + getState(i).val + '?';
                    }
                }
            }
            speakerList = speakerList.substring(0, speakerList.length - 1);
            //--------------------------------------------------------------------------------------------------------------

            let colMediaIcon = (page.items[0].colorMediaIcon != undefined) ? page.items[0].colorMediaIcon : White;
            let colMediaTitle = (page.items[0].colorMediaTitle != undefined) ? page.items[0].colorMediaTitle : White;
            let colMediaArtist = (page.items[0].colorMediaArtist != undefined) ? page.items[0].colorMediaArtist : White;

            //InSel Speaker
            let speakerListString: string = '~~~~~~'
            let speakerListIconCol = rgb_dec565(HMIOff);
            if (page.items[0].speakerList != undefined) {
                speakerListIconCol = rgb_dec565(HMIOn);
                speakerListString = 'input_sel' + '~' + 
                                    id + '?speakerlist' + '~' + 
                                    Icons.GetIcon('speaker') + '~' + 
                                    speakerListIconCol + '~' + 
                                    'Speaker' + '~' + 
                                    'media0~'
            }

            //InSel Playlist
            let playListString: string = '~~~~~~'
            let playListIconCol = rgb_dec565(HMIOff);
            if (page.items[0].playList != undefined) {
                /* Volumio: get actual playlist if empty */
                if (v2Adapter == 'volumio') {
                    if (page.items[0].playList.length == 0) {
                        request({ url: `${getState(vInstance+'info.host').val}/api/listplaylists`, headers: {'User-Agent': 'ioBroker'} }, 
                            async (error, response, result) => {
                                try { 
                                    page.items[0].playList = JSON.parse(result);
                                    if (Debug) console.log(page.items[0].playList); 
                                } catch (err) { 
                                    console.log('get_volumio-playlist: ' + err.message); 
                                }
                            } 
                        );
                    }
                }
                playListIconCol = rgb_dec565(HMIOn);
                playListString =    'input_sel' + '~' + 
                                    id + '?playlist' + '~' + 
                                    Icons.GetIcon('playlist-play') + '~' + 
                                    playListIconCol + '~' + 
                                    'PlayL ' + page.heading + '~' + 
                                    'media1~'
            } 

            //InSel Tracklist
            let trackListString: string = '~~~~~~'
            let trackListIconCol = rgb_dec565(HMIOff);
            if (v2Adapter == 'volumio') { /* Volumio: get queue */
                setTimeout(async function () {
                    request({ url: `${getState(vInstance+'info.host').val}/api/getQueue`, headers: {'User-Agent': 'ioBroker'} }, 
                            async (error, response, result) => {
                                try { 
                                    const QUEUELIST = JSON.parse(result);
                                    page.items[0].globalTracklist = QUEUELIST.queue;
                                    if (Debug) { for (let i_index in QUEUELIST.queue) console.log(QUEUELIST.queue[i_index]); }
                                } catch (err) { 
                                    console.log('get_volumio-queue: ' + err.message); 
                                }
                            } 
                        );
                    }, 2000);
                globalTracklist = page.items[0].globalTracklist;
            }
            
            if (globalTracklist!= null && globalTracklist.length != 0) {
                trackListIconCol = rgb_dec565(HMIOn);
                trackListString =   'input_sel' + '~' + 
                                    id + '?tracklist' + '~' + 
                                    Icons.GetIcon('animation-play-outline') + '~' + 
                                    trackListIconCol + '~' + 
                                    'Tracklist' + '~' + 
                                    'media2~'
            }

            //InSel EQ
            let equalizerListString: string = '~~~~~~'
            let equalizerListIconCol = rgb_dec565(HMIOff);
            if (page.items[0].equalizerList != undefined) {
                equalizerListIconCol = rgb_dec565(HMIOn);
                equalizerListString =   'input_sel' + '~' + 
                                        id + '?equalizer' + '~' + 
                                        Icons.GetIcon('equalizer-outline') + '~' + 
                                        equalizerListIconCol + '~' + 
                                        'Equalizer' + '~' + 
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
                if (getState(id + '.REPEAT').val == 'all') {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 'one') {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'squeezeboxrpc') {
                if (getState(id + '.REPEAT').val == 1) {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(HMIOn);
                } else if (getState(id + '.REPEAT').val == 2) {
                    repeatIcon = Icons.GetIcon('repeat-once');
                    repeatIconCol = rgb_dec565(HMIOn);
                }
            } else if (v2Adapter == 'volumio') { /* Volumio: only Repeat true/false with API */
                if (getState(id + '.REPEAT').val == true) {
                    repeatIcon = Icons.GetIcon('repeat-variant');
                    repeatIconCol = rgb_dec565(colMediaIcon);
                }
            }

            if (v2Adapter == 'spotify-premium' || v2Adapter == 'alexa2' || v2Adapter == 'sonos' || v2Adapter == 'volumio') {
                repeatButtonString =    'button' + '~' + 
                                        id + '?repeat' + '~' + 
                                        repeatIcon + '~' + 
                                        repeatIconCol + '~' + 
                                        'Repeat' + '~' + 
                                        'media4'
            }

            out_msgs.push({
                payload: 'entityUpd~' +                   //entityUpd
                    name + '~' +                          //heading
                    GetNavigationString(pageId) + '~' +   //navigation
                    id + '~' +                            //internalNameEntiy
                    title + '~' +                         //title
                    rgb_dec565(colMediaTitle) + '~' +     //titleColor
                    author + '~' +                        //author
                    rgb_dec565(colMediaArtist) + '~' +    //authorColor
                    volume + '~' +                        //volume
                    iconplaypause + '~' +                 //playpauseicon
                    onoffbutton + '~' +                   //On/Off Button Color
                    shuffle_icon + '~' +                  //iconShuffle                     --> Code
                    'button' + '~' +                      //type                MediaIcon   --> Code
                    id + '~' +                            //internalNameEntity  MediaIcon   --> Code
                    media_icon + '~' +                    //icon                MediaIcon
                    rgb_dec565(colMediaIcon) + '~~~' +    //iconColor           MediaIcon
                    speakerListString +
                    playListString +
                    trackListString +
                    equalizerListString +
                    repeatButtonString
            });
        }
        if (Debug) {
            console.log(out_msgs);
        }
        return out_msgs
    } catch (err) {
        console.warn('function GenerateMediaPage: ' + err.message);
    }
}

function GenerateAlarmPage(page: PageAlarm): Payload[] {
    try {
        activePage = page;
        let id = page.items[0].id
        let name = page.heading;

        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~cardAlarm' });
        let nsPath = NSPanel_Alarm_Path + 'Alarm.';

        if (existsState(nsPath + 'AlarmPin') == false || existsState(nsPath + 'AlarmState') == false || existsState(nsPath + 'AlarmType') == false || existsState(nsPath + 'PIN_Failed') == false || existsState(nsPath + 'PANEL') == false) {
            createState(nsPath + 'AlarmPin', '0000', { type: 'string' }, function () { setState(nsPath + 'AlarmPin', '0000') });
            createState(nsPath + 'AlarmState', 'disarmed', { type: 'string' }, function () { setState(nsPath + 'AlarmState', 'disarmed') });
            createState(nsPath + 'AlarmType', 'D1', { type: 'string' }, function () { setState(nsPath + 'AlarmType', 'D1') });
            createState(nsPath + 'PIN_Failed', 0, { type: 'number' }, function () { setState(nsPath + 'PIN_Failed', 0) });
            createState(nsPath + 'PANEL', NSPanel_Path, { type: 'string' }, function () { setState(nsPath + 'PANEL', NSPanel_Path) });
        }

        if (existsState(nsPath + 'AlarmPin') && existsState(nsPath + 'AlarmState') && existsState(nsPath + 'AlarmType')) {
            //let entityPin = getState(nsPath + 'AlarmPin').val;
            let entityState = getState(nsPath + 'AlarmState').val;
            //let entityType = getState(nsPath + 'AlarmType').val;
            let arm1: string, arm2: string, arm3: string, arm4: string;
            let arm1ActionName: string, arm2ActionName: string, arm3ActionName: string, arm4ActionName: string;
            let icon = '0';
            let iconcolor = 63488;
            let numpadStatus = 'disable';
            let flashing = 'disable';

            if (Debug) {
                console.log(id);
            }

            if (entityState == 'armed' || entityState == 'triggered') {
                arm1 = 'Deaktivieren';                                      //arm1*~*
                arm1ActionName = 'D1';                                      //arm1ActionName*~*
                arm2 = '';                                                  //arm2*~*
                arm2ActionName = '';                                        //arm2ActionName*~*
                arm3 = '';                                                  //arm3*~*
                arm3ActionName = '';                                        //arm3ActionName*~*
                arm4 = '';                                                  //arm4*~*
                arm4ActionName = '';                                        //arm4ActionName*~*
            }

            if (entityState == 'disarmed' || entityState == 'arming' || entityState == 'pending') {
                arm1 = 'Vollschutz';                                        //arm1*~*
                arm1ActionName = 'A1';                                      //arm1ActionName*~*
                arm2 = 'Zuhause';                                           //arm2*~*
                arm2ActionName = 'A2';                                      //arm2ActionName*~*
                arm3 = 'Nacht';                                             //arm3*~*
                arm3ActionName = 'A3';                                      //arm3ActionName*~*
                arm4 = 'Besuch';                                            //arm4*~*
                arm4ActionName = 'A4';                                      //arm4ActionName*~*
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
                console.log(out_msgs);
            }
            return out_msgs;
        }
    } catch (err) {
        console.warn('function GenerateAlarmPage: ' + err.message);
    }
}

function GenerateUnlockPage(page: PageUnlock): Payload[] {
    try {
        activePage = page;
        let id = page.items[0].id
        let name = page.heading;

        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~cardAlarm' });
        let nsPath = NSPanel_Alarm_Path + 'Unlock.';

        if (Debug) {
            console.log(out_msgs);
        }
        return out_msgs;
        
    } catch (err) {
        console.warn('function GenerateAlarmPage: ' + err.message);
    }
}

function GenerateQRPage(page: PageQR): Payload[] {
    try {
        activePage = page;

        let id = page.items[0].id;
        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~cardQR' });

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
            if (tempstr[w].substring(0, 1) == 'S') {
                optionalValue1 = tempstr[w].slice(2);
            }
            if (tempstr[w].substring(0, 1) == 'P') {
                optionalValue2 = tempstr[w].slice(2);
            }
        }

        let type1 = 'text';
        let internalName1 = 'SSID';
        let iconId1 = Icons.GetIcon('wifi');
        let displayName1 = 'SSID';
        let type2 = 'text';
        let internalName2 = 'Passwort';
        let iconId2 = Icons.GetIcon('key');
        let displayName2 = 'Passwort';

        if (hiddenPWD) {
            type2 = 'disable';
            iconId2 = '';
            displayName2 = '';
        }

        out_msgs.push({
            payload: 'entityUpd~' +                     //entityUpd
                heading + '~' +                         //heading
                GetNavigationString(pageId) + '~' +     //navigation
                textQR + '~' +                          //textQR
                type1 + '~' +                           //type
                internalName1 + '~' +                   //internalName
                iconId1 + '~' +                         //iconId
                65535 + '~' +                           //iconColor
                displayName1 + '~' +                    //displayName
                optionalValue1 + '~' +                  //optionalValue
                type2 + '~' +                           //type
                internalName2 + '~' +                   //internalName
                iconId2 + '~' +                         //iconId
                65535 + '~' +                           //iconColor
                displayName2 + '~' +                    //displayName
                optionalValue2
        });

        return out_msgs;

    } catch (err) {
        console.warn('function GenerateQRPage: ' + err.message);
    }
}

function unsubscribePowerSubscriptions(): void {
    for (let i = 0; i < config.pages.length; i++) {
        if (config.pages[i].type == 'cardPower') {
            let powerID = config.pages[i].items[0].id;
            unsubscribe(powerID + '.ACTUAL');
        }
    }
    for (let i = 0; i < config.subPages.length; i++) {
        if (config.subPages[i].type == 'cardPower') {
            let powerID = config.subPages[i].items[0].id;
            unsubscribe(powerID + '.ACTUAL');
        }
    }
} 

function subscribePowerSubscriptions(id: string): void {
    on({id: id + '.ACTUAL', change: "ne"}, async function () {
        (function () { if (timeoutPower) { clearTimeout(timeoutPower); timeoutPower = null; } })();
        timeoutPower = setTimeout(async function () {
            if (useMediaEvents) {
                GeneratePage(activePage);
            }
        },25)
    });
} 

function GeneratePowerPage(page: PagePower): Payload[] {
    try {
        activePage = page;
        
        let id = page.items[0].id;

        if (Debug) {
            console.log(page.items[0].id);
        }
        
        unsubscribePowerSubscriptions();
        subscribePowerSubscriptions(id);
        
        let demoMode = false;

        try {
            id = page.items[0].id
        } catch (err) {
            console.log("Kein PageItem definiert - cardPower Demo-Modus aktiv");
            demoMode = true;
        }

        let heading = 'cardPower Example';
        if (demoMode != true) {
            let o = getObject(id);
            heading = page.heading !== undefined ? page.heading : o.common.name.de;
        }

        const obj = JSON.parse((getState(page.items[0].id + '.ACTUAL').val));

        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~cardPower' });

        //Demo Data if no pageItem present
        let array_icon_color = [White, MSGreen, MSYellow, MSGreen, MSYellow, MSGreen, MSRed];
        let array_icon = ['home', 'battery-charging-60', 'solar-power-variant', 'wind-turbine', 'shape', 'transmission-tower', 'car'];
        let array_powerspeed = ['', '-1', '2', '4', '1', '1', '5'];
        let array_powerstate = ['', '0,5 kW', '0,9 kW', '2,8 kW', '0,2 kW', '0,1 kW', '4,6 kW'];

        let arrayColorScale = [colorScale0, colorScale1, colorScale2, colorScale3, colorScale4, colorScale5, colorScale6, colorScale7, colorScale8, colorScale9, colorScale10];

        let homeIconColor = 0;
        if (!demoMode) {
            for (let obji = 0; obji < 7; obji++) {
                array_icon_color[obji + 1] = arrayColorScale[obj[obji].iconColor];
                array_icon[obji + 1] = obj[obji].icon;
                array_powerspeed[obji + 1] = obj[obji].speed;
                array_powerstate[obji + 1] = obj[obji].value + ' ' + obj[obji].unit ;
            }
            array_icon[0] = obj[0].icon;
            array_powerstate[0] = obj[0].value + ' ' + obj[0].unit;
            homeIconColor = obj[0].iconColor;
        }

        let power_string : any = '';

        for (let i = 1; i < 7; i++ ) {
            power_string = power_string + rgb_dec565(array_icon_color[i+1]) + '~';    // icon_color~
            power_string = power_string + Icons.GetIcon(array_icon[i+1]) + '~';       // icon~
            power_string = power_string + array_powerspeed[i+1] + '~';                // speed~
            power_string = power_string + array_powerstate[i+1] + '~';                // entity.state~
        }

        power_string = power_string.substring(0, power_string.length - 1);

        out_msgs.push({
            payload: 'entityUpd~' +                                 //entityUpd~*
                heading                         + '~' +             //internalNameEntity*~*
                GetNavigationString(pageId)     + '~' +             //navigation*~*
                rgb_dec565(array_icon_color[homeIconColor]) + '~' + // icon_color~              Mitte
                Icons.GetIcon(array_icon[0])    + '~' +             // icon~                    Mitte
                '~' +                                               // ignored                  Mitte
                array_powerstate[0]             + '~' +             // entity.state~            Mitte
                '' + '~' +                                          // ignored                  Mitte
                '' + '~' +                                          // ignored                  Mitte
                '' + '~' +                                          // ignored                  Mitte
                '' + '~' +                                          // Value above Home Icon    Mitte (JSON erweitern)
                power_string
        });

        return out_msgs;

    } catch (err) {
        console.warn('function GeneratePowerPage: ' + err.message);
    }
}

function GenerateChartPage(page: PageChart): Payload[] {
    try {
        activePage = page;

        let id = page.items[0].id;
        let out_msgs: Array<Payload> = [];
        out_msgs.push({ payload: 'pageType~' + page.type });

        let heading = page.heading !== undefined ? page.heading : "Chart...";

        let txt = getState(id + '.ACTUAL').val;

        let yAxisTicks = (typeof page.items[0].yAxisTicks == 'object') ? page.items[0].yAxisTicks : JSON.parse(getState(page.items[0].yAxisTicks).val);

        out_msgs.push({
            payload:    'entityUpd~' +                              //entityUpd
                        heading + '~' +                             //heading
                        GetNavigationString(pageId) + '~' +         //navigation
                        rgb_dec565(page.items[0].onColor) + '~' +   //color
                        page.items[0].yAxis + '~' +
                        yAxisTicks.join(':') + '~' +
                        txt
        });

        if (Debug) console.log(out_msgs);

        return out_msgs;

    } catch (err) {
        console.warn('function GenerateChartPage: ' + err.message);
    }
}

function setIfExists(id: string, value: any, type: string | null = null): boolean {
    try {
        if (type === null) {
            if (existsState(id)) {
                setState(id, value);
                return true;
            }
        } else {
            const obj = getObject(id);
            if (existsState(id) && obj.common.type !== undefined && obj.common.type === type) {
                setState(id, value);
                return true;
            }
        }

        return false;
    } catch (err) {
        console.warn('function setIfExists: ' + err.message);
    }
}

function toggleState(id: string): boolean {
    try {
        const obj = getObject(id);
        if (existsState(id) && obj.common.type !== undefined && obj.common.type === 'boolean') {
            setIfExists(id, !getState(id).val);
            return true;
        }
        return false;
    } catch (err) {
        console.warn('function toggleState: ' + err.message);
    }
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
		return false;	
	}  catch (err) {	
        console.warn('function triggerButton: ' + err.message);	
    }		
}	
// End Monobutton

function HandleButtonEvent(words: any): void {
    try {
        let tempid = words[2].split('?');
        let id = tempid[0];
        let buttonAction = words[3];

        if (Debug) {
            console.log(words[0] + ' - ' + words[1] + ' - ' + words[2] + ' - ' + words[3] + ' - ' + words[4] + ' - PageId: ' + pageId);
        }

        if ((words[2]).substring(0, 8) == 'navigate') {
            GeneratePage(eval((words[2]).substring(9, (words[2]).length)));
            return;
        }

        if (words[2] == 'bNext' || words[2] == 'bPrev' || words[2] == 'bUp' || words[2] == 'bHome' || words[2] == 'bSubNext' || words[2] == 'bSubPrev' ) {
            buttonAction = words[2];
        }

        if (Debug) {
            console.log(buttonAction);
        }

        if (buttonAction.startsWith('swipe')) {
            buttonAction = 'bExit';
        }

        let pageNum:number = 0;

        switch (buttonAction) {
            case 'bUp':
                if (pageId < 0) { // Prüfen, ob button1page oder button2page
                    pageId = 0;
                    UnsubscribeWatcher();
                    GeneratePage(config.pages[pageId]);
                } else {
                    pageNum = (((pageId - 1) % config.pages.length) + config.pages.length) % config.pages.length;
                    pageId = pageNum;
                    UnsubscribeWatcher();
                    if (activePage != undefined && activePage.parent != undefined) {
                        //update pageID
                        for (let i = 0; i < config.pages.length; i++) {
                            if (config.pages[i] == activePage.parent) {
                                pageId = i;
                                break;
                            }
                        }
                        GeneratePage(activePage.parent);
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
                GeneratePage(config.pages[pageId]);
                break;
            case 'bSubNext':
                UnsubscribeWatcher();
                GeneratePage(eval(activePage.next));
                break;
            case 'bPrev':
                pageNum = (((pageId - 1) % config.pages.length) + config.pages.length) % config.pages.length;
                pageId = pageNum;
                UnsubscribeWatcher();
                if (activePage != undefined && activePage.parent != undefined) {
                    //update pageID
                    for (let i = 0; i < config.pages.length; i++) {
                        if (config.pages[i] == activePage.parent) {
                            pageId = i;
                            break;
                        }
                    }
                    GeneratePage(activePage.parent);
                }
                else {
                    GeneratePage(config.pages[pageId]);
                }
                break;
            case 'bSubPrev':          
                UnsubscribeWatcher();
                GeneratePage(eval(activePage.prev));
                break;
            case 'bExit':
                if ((words[2] == 'popupShutter') || (words[2] == 'popupLight')) {
                    GeneratePage(activePage);
                } else if (getState(NSPanel_Path + 'Config.Screensaver.screenSaverDoubleClick').val && words[2] == 'screensaver') {
                    if (words[4] >= 2) {
                        setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading', '');
                        setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyText', '');
                        if (existsObject(NSPanel_Path + 'ScreensaverInfo.bExitPage') && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != null) {
                            pageId = getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val;
                            activePage = config.pages[pageId];
                            GeneratePage(activePage);
                        } else {
                            GeneratePage(activePage);
                        }
                    } else {
                        setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading', '');
                        setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyText', '');
                        screensaverEnabled = true;
                        break;
                    }
                } else {
                    if (Debug) {
                        console.log('bExit: ' + words[4] + ' - ' + pageId);
                    }
                    setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyHeading', '');
                    setIfExists(NSPanel_Path + 'ScreensaverInfo.popupNotifyText', '');
                    if (existsObject(NSPanel_Path + 'ScreensaverInfo.bExitPage') && getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val != null) {
                        pageId = getState(NSPanel_Path + 'ScreensaverInfo.bExitPage').val
                        activePage = config.pages[pageId];
                        GeneratePage(activePage);
                    } else {
                        GeneratePage(activePage);
                    }
                }
                break;
            case 'bHome':
                if (Debug) {
                    console.log('bExit: ' + words[4] + ' - ' + pageId);
                }
                UnsubscribeWatcher();
                if (activePage.home != undefined) {
                    GeneratePage(eval(activePage.home));
                } else {
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
                    switch (o.common.role) {
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
                    }
                }
                break;
            case 'button':
                if (existsObject(id)) {
                    let action = false;
                    if (words[4] == '1')
                        action = true;
                    let o = getObject(id);
                    switch (o.common.role) {
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
	                        // Änderung für Monobutton	
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
                        case 'hue': // Armilar
                            toggleState(id + '.ON_ACTUAL');
                        case 'media':
                            if (tempid[1] == 'repeat') {
                                let pageItemRepeat = findPageItem(id);
                                let adapterInstanceRepeat = pageItemRepeat.adapterPlayerInstance;
                                let adapterRepeat = adapterInstanceRepeat.split('.');
                                let deviceAdapterRP = adapterRepeat[0];

                                switch (deviceAdapterRP) {
                                    case 'spotify-premium':
                                        let stateSpotifyRepeat = getState(id + '.REPEAT').val
                                        if (stateSpotifyRepeat == 'off') {
                                            setIfExists(id + '.REPEAT', 'context');
                                        } else if (stateSpotifyRepeat == 'context') {
                                            setIfExists(id + '.REPEAT', 'track');
                                        } else if (stateSpotifyRepeat == 'track') {
                                            setIfExists(id + '.REPEAT', 'off');
                                        }
                                        break;
                                    case 'alexa2':
                                        try {
                                            if (getState(id + '.REPEAT').val == 'false') {
                                                setIfExists(id + '.REPEAT', true);
                                            } else {
                                                setIfExists(id + '.REPEAT', false);
                                            }
                                        } catch (err) {
                                            console.log('Repeat kann nicht verändert werden');
                                        }
                                        break;
                                    case 'volumio':
                                        request({ url:`${getState(adapterInstanceRepeat+'info.host').val}/api/commands/?cmd=repeat`, headers: {'User-Agent': 'ioBroker'} }, 
                                            async (error, response, result)=>{}); /* nothing todo @ error */
                                        break;
                                }
                            }
                    }
                }
                break;
            case 'up':
                setIfExists(id + '.OPEN', true);
                break;
            case 'stop':
                setIfExists(id + '.STOP', true);
                break;
            case 'down':
                setIfExists(id + '.CLOSE', true);
                break;
            case 'positionSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    setIfExists(id + '.SET', parseInt(words[4])) ? true : setIfExists(id + '.ACTUAL', parseInt(words[4]));
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
                    setIfExists(id + '.TILT_SET', parseInt(words[4])) ? true : setIfExists(id + '.TILT_ACTUAL', parseInt(words[4]));
                }, 250);
                break;
            case 'brightnessSlider':
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    if (existsObject(id)) {
                        let o = getObject(id);
                        let pageItem = findPageItem(id);

                        switch (o.common.role) {
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
            case 'colorTempSlider': // Armilar - Slider tickt verkehrt - Hell = 0 / Dunkel = 100 -> Korrektur
                (function () { if (timeoutSlider) { clearTimeout(timeoutSlider); timeoutSlider = null; } })();
                timeoutSlider = setTimeout(async function () {
                    let pageItem = findPageItem(id);
                    if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                        let colorTempK = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.minValueColorTemp, pageItem.maxValueColorTemp));
                        setIfExists(id + '.TEMPERATURE', (colorTempK));
                    } else {
                        setIfExists(id + '.TEMPERATURE', 100 - words[4]);
                    }
                }, 250);
                break;
            case 'colorWheel':
                let colorCoordinates = words[4].split('|');
                let rgb = pos_to_color(colorCoordinates[0], colorCoordinates[1]);
                if (Debug) {
                    console.log(rgb);
                }
                if (Debug) {
                    console.log(getHue(rgb.red, rgb.green, rgb.blue));
                }
                let o = getObject(id);
                switch (o.common.role) {
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
                            //Für z.B. Deconz XY
                            setIfExists(id + ".RGB", rgb_to_cie(rgb.red, rgb.green, rgb.blue));
                            if (Debug) {
                                console.log(rgb_to_cie(rgb.red, rgb.green, rgb.blue));
                            }
                        }
                        else {
                            //Für RGB
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
            case 'media-back':
                setIfExists(id + '.PREV', true);
                break;
            case 'media-pause':
                let pageItemTemp = findPageItem(id);
                let adaInstanceSplit = pageItemTemp.adapterPlayerInstance.split('.');
                if (adaInstanceSplit[0] == 'squeezeboxrpc') {
                    let stateVal = getState(pageItemTemp.adapterPlayerInstance + 'state').val;
                    if (stateVal == 0) {
                        setState(pageItemTemp.adapterPlayerInstance + 'state', 1);
                    } else if (stateVal == 1) {
                        setState(pageItemTemp.adapterPlayerInstance + 'state', 0);
                    } else if (stateVal == null) {
                        setState(pageItemTemp.adapterPlayerInstance + 'state', 1);
                    }
                } else {
                    if (getState(id + '.STATE').val === true) {
                        setIfExists(id + '.PAUSE', true);
                    } else {
                        setIfExists(id + '.PLAY', true);
                    }
                }
                break;
            case 'media-next':
                setIfExists(id + '.NEXT', true);
                break;
            case 'media-shuffle':
                if ((findPageItem(id).adapterPlayerInstance).startsWith("volumio")) { findPageItem(id).playList = []; break; } //Volumio: empty playlist $uha-20230103
                if (getState(id + '.SHUFFLE').val == 'off') {
                    setIfExists(id + '.SHUFFLE', 'on');
                } else {
                    setIfExists(id + '.SHUFFLE', 'off');
                }
                break;
            case 'volumeSlider':
                setIfExists(id + '.VOLUME', parseInt(words[4]))
                break;
            case 'mode-speakerlist':
                let pageItem = findPageItem(id);
                let adapterInstance = pageItem.adapterPlayerInstance;
                let adapter = adapterInstance.split('.');
                let deviceAdapter = adapter[0];

                switch (deviceAdapter) {
                    case 'spotify-premium':
                        let strDevicePI = pageItem.speakerList[words[4]];
                        let strDeviceID = spotifyGetDeviceID(strDevicePI);
                        setState(adapterInstance + 'devices.' + strDeviceID + ".useForPlayback", true);
                        break;
                    case 'alexa2':
                        let i_list = Array.prototype.slice.apply($('[state.id="' + adapterInstance + 'Echo-Devices.*.Info.name"]'));
                        for (let i_index in i_list) {
                            let i = i_list[i_index];
                            if ((getState(i).val) === pageItem.speakerList[words[4]]) {
                                console.log(getState(i).val + ' - ' + pageItem.speakerList[words[4]]);
                                let deviceId = i;
                                deviceId = deviceId.split('.');
                                setIfExists(adapterInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Commands.textCommand', 'Schiebe meine Musik auf ' + pageItem.speakerList[words[4]]);
                                pageItem.mediaDevice = deviceId[3];
                            } 
                        }
                        break;
                    case 'sonos':
                        break;
                    case 'chromecast':
                        break;
                }
                break;
            case 'mode-playlist':
                let pageItemPL = findPageItem(id);
                let adapterInstancePL = pageItemPL.adapterPlayerInstance;
                let adapterPL = adapterInstancePL.split('.');
                let deviceAdapterPL = adapterPL[0];

                switch (deviceAdapterPL) {
                    case 'spotify-premium':
                        let strDevicePI = pageItemPL.playList[words[4]];
                        console.log(strDevicePI);
                        let playlistListString = (getState(adapterInstancePL + 'playlists.playlistListString').val).split(';');
                        let playlistListIds = (getState(adapterInstancePL + 'playlists.playlistListIds').val).split(';');
                        let playlistIndex = playlistListString.indexOf(strDevicePI);
                        setState(adapterInstancePL + 'playlists.playlistList', playlistListIds[playlistIndex]);
                        setTimeout(async function () {
                            globalTracklist = (function () { try {return JSON.parse(getState(adapterInstancePL + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                        }, 2000);
                        break;
                    case 'alexa2':
                        let tempListItem = pageItemPL.playList[words[4]].split('.');
                        setState(adapterInstancePL + 'Echo-Devices.' + pageItemPL.mediaDevice + '.Music-Provider.' + tempListItem[0], tempListItem[1]);
                        break;
                    case 'volumio':
                        let strDevicePL = pageItemPL.playList[words[4]];
                        request({ url:`${getState(adapterInstancePL+'info.host').val}/api/commands/?cmd=playplaylist&name=${strDevicePL}`, headers: {'User-Agent': 'ioBroker'} }, 
                                  async (error, response, result)=>{}); /* nothing todo @ error */
                        break;
                }
                break;
            case 'mode-tracklist':
                let pageItemTL = findPageItem(id);
                let adapterInstanceTL = pageItemTL.adapterPlayerInstance;
                let adapterTL = adapterInstanceTL.split('.')
                let deviceAdapterTL = adapterTL[0];

                switch (deviceAdapterTL) {
                    case 'spotify-premium':
                        let trackArray = (function () { try {return JSON.parse(getState(pageItemTL.adapterPlayerInstance + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                        setState(adapterInstanceTL + 'player.trackId', getAttr(trackArray, words[4] + '.id'));
                        break;
                    case 'alexa2':
                        if (Debug) console.log('Aktuell hat alexa2 keine Tracklist');
                        break;
                    case 'volumio':
                        request({ url:`${getState(adapterInstanceTL+'info.host').val}/api/commands/?cmd=play&N=${words[4]}`, headers: {'User-Agent': 'ioBroker'} }, 
                            async (error, response, result)=>{}); /* nothing todo @ error */
                        break;
                }
                break;
            case 'mode-repeat':
                let pageItemRP = findPageItem(id);
                let adapterInstanceRP = pageItemRP.adapterPlayerInstance;
                let adapterRP = adapterInstanceRP.split('.');
                let deviceAdapterRP = adapterRP[0];

                switch (deviceAdapterRP) {
                    case 'spotify-premium':
                        setIfExists(id + '.REPEAT', pageItemRP.repeatList[words[4]]);
                        break;
                    case 'alexa2':
                        break;
                }
                break;
            case 'mode-equalizer':
                let pageItemEQ = findPageItem(id);
                if (Debug) console.log(id);
                let lastIndex = (id.split('.')).pop();
                setState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode', pageItemEQ.equalizerList[words[4]]);
                setTimeout(async function () {
                    GenerateDetailPage('popupInSel','equalizer', pageItemEQ);
                }, 2000);
                break;
            case 'mode-insel':
                setIfExists(id + '.VALUE', parseInt(words[4]));
                break;
            case 'media-OnOff':
                let pageItemTem = findPageItem(id);
                let adaInstanceSpli = pageItemTem.adapterPlayerInstance.split('.');
                if (adaInstanceSpli[0] == 'squeezeboxrpc') {
                    let stateVal = getState(pageItemTem.adapterPlayerInstance + 'Power').val;
                    if (stateVal === 0) {
                        setState(pageItemTem.adapterPlayerInstance + 'Power', 1);
                        setIfExists(id + '.STOP', false);
                        setIfExists(id + '.STATE', 1);
                    } else {
                        setState(pageItemTem.adapterPlayerInstance + 'Power', 0);
                        setIfExists(id + '.STOP', true);
                        setIfExists(id + '.STATE', 0);
                    }
                } else {
                    setIfExists(id + '.STOP', true);
                }
                break;
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
                    GeneratePage(config.pages[pageId]);
                } else {
                    let HVACMode = 0;
                    switch (words[4]) {
                        case 'POWER':
                            HVACMode = 0;
                            setIfExists(words[2] + '.' + words[4], !getState(words[2] + '.' + words[4]).val);
                            if (getState(words[2] + '.' + words[4]).val) {
                                HVACMode = 1;
                            }
                            break;
                        case 'AUTO':
                            HVACMode = 1;
                            break;
                        case 'COOL':
                            HVACMode = 2;
                            break;
                        case 'HEAT':
                            HVACMode = 3;
                            break;
                        case 'ECO':
                            HVACMode = 4;
                            break;
                        case 'FAN':
                            HVACMode = 5;
                            break;
                        case 'DRY':
                            HVACMode = 6;
                            break;
                        case 'SWING':
                            HVACMode = getState(words[2] + '.MODE').val;
                            if (getState(words[2] + '.SWING').val == 0) {
                                setIfExists(words[2] + '.SWING', 1);
                            } else {
                                setIfExists(words[2] + '.' + 'SWING', 0);
                            }
                            break;
                    }
                    setIfExists(words[2] + '.' + 'MODE', HVACMode);
                    GeneratePage(config.pages[pageId]);
                }
                break;
            case 'mode-modus1':
                let pageItemT1 = findPageItem(id);
                setIfExists(id + '.' + pageItemT1.setThermoAlias[0], pageItemT1.popupThermoMode1[parseInt(words[4])]);
                break;
            case 'mode-modus2':
                let pageItemT2 = findPageItem(id);
                setIfExists(id + '.' + pageItemT2.setThermoAlias[1], pageItemT2.popupThermoMode2[parseInt(words[4])]);
                break;
            case 'mode-modus3':
                let pageItemT3 = findPageItem(id);
                setIfExists(id + '.' + pageItemT3.setThermoAlias[2], pageItemT3.popupThermoMode3[parseInt(words[4])]);
                break;
            case 'number-set':
                let nobj = getObject(id);
                switch (nobj.common.role) {
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
            case 'A1': // Alarm-Page Alarm 1 aktivieren
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A1');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage);
                },250);
                break;
            case 'A2': // Alarm-Page Alarm 2 aktivieren
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A2');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage);
                },250);
                break;
            case 'A3': // Alarm-Page Alarm 3 aktivieren
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A3');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage);
                },250);
                break;
            case 'A4': // Alarm-Page Alarm 4 aktivieren
                if (words[4] != '') {
                    setIfExists(id + '.TYPE', 'A4');
                    setIfExists(id + '.PIN', words[4]);
                    setIfExists(id + '.ACTUAL', 'arming');
                    setIfExists(id + '.PANEL', NSPanel_Path);
                }
                setTimeout(function(){
                    GeneratePage(activePage);
                },250);
                break;
            case 'D1': // Alarm-Page Alarm Deaktivieren
                if (Debug) {
                    console.log('D1: ' + getState(id + '.PIN').val);
                }
                if (Debug) {
                    console.log(words[4]);
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
                        GeneratePage(activePage);
                    },500);
                }
                break;
            default:
                break;
        }
    } catch (err) {
        console.log('function HandleButtonEvent: ' + err.message);
    }
}

//Determination of page navigation (CustomSend-Payload)
function GetNavigationString(pageId: number): string {
    try {

        if (Debug) {
            console.log(pageId);
        }

        var navigationString:string = "";

        if (activePage.subPage){
            //Left icon
            if (activePage.prev == undefined){
                if (activePage.parentIcon != undefined){                    
                    navigationString = 'button~bUp~' + Icons.GetIcon(activePage.parentIcon);     
                    if (activePage.parentIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage.parentIconColor);        
                    } else {
                        navigationString += '~' + rgb_dec565(White);
                    }                
                } else {
                    navigationString = 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White);
                }
            } else {
                if (activePage.prevIcon != undefined){       
                    navigationString = 'button~bSubPrev~' + Icons.GetIcon(activePage.prevIcon);        
                    if (activePage.prevIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage.prevIconColor);        
                    } else {
                        navigationString += '~' + rgb_dec565(White);
                    }                     
                } else {
                    navigationString = 'button~bSubPrev~' + Icons.GetIcon('arrow-left-bold') + '~' + rgb_dec565(White);
                }                
            }

            //Right icon
            if (activePage.next == undefined){
                if (activePage.homeIcon != undefined){                    
                    navigationString += '~~~button~bHome~' + Icons.GetIcon(activePage.homeIcon);      
                    if (activePage.homeIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage.homeIconColor) + '~~';;        
                    } else {
                        navigationString += '~' + rgb_dec565(White) + '~~';
                    }              
                } else {
                    navigationString += '~~~button~bHome~' + Icons.GetIcon('home') + '~' + rgb_dec565(White) + '~~';   
                }
            } else {
                if (activePage.nextIcon != undefined){                    
                    navigationString += '~~~button~bSubNext~' + Icons.GetIcon(activePage.nextIcon);    
                    if (activePage.nextIconColor != undefined){                    
                        navigationString += '~' + rgb_dec565(activePage.nextIconColor) + '~~';        
                    } else {
                        navigationString += '~' + rgb_dec565(White) + '~~';
                    }                   
                } else {
                    navigationString += '~~~button~bSubNext~' + Icons.GetIcon('arrow-right-bold') + '~' + rgb_dec565(White) + '~~';  
                }                
            }
        }       

        if (activePage.subPage && (navigationString != "")){
            return navigationString
        }

        switch (pageId) {
            case -1:
                return 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White) + ' ~~~delete~~~~~';
            case -2:
                return 'button~bUp~' + Icons.GetIcon('arrow-up-bold') + '~' + rgb_dec565(White) + '~~~delete~~~~~';
            default:
            {
                if (activePage.prevIcon != undefined){                    
                    navigationString = 'button~bPrev~' + Icons.GetIcon(activePage.prevIcon);        
                } else {
                    navigationString = 'button~bPrev~' + Icons.GetIcon('arrow-left-bold');
                }  

                if (activePage.prevIconColor != undefined){                    
                    navigationString += '~' + rgb_dec565(activePage.prevIconColor);        
                } else {
                    navigationString += '~' + rgb_dec565(White);
                }                    

                if (activePage.nextIcon != undefined){                    
                    navigationString += '~~~button~bNext~' + Icons.GetIcon(activePage.nextIcon);                
                } else {
                    navigationString += '~~~button~bNext~' + Icons.GetIcon('arrow-right-bold');
                }  
                if (activePage.nextIconColor != undefined){                    
                    navigationString += '~' + rgb_dec565(activePage.nextIconColor) + '~~';        
                } else {
                    navigationString += '~' + rgb_dec565(White) + '~~';
                }
                return navigationString;
            }
        }

    } catch (err) {
        console.log('function GetNavigationString: ' + err.message);
    }
}

function GenerateDetailPage(type: string, optional: string, pageItem: PageItem): Payload[] {
    if (Debug) console.log(type + ' - ' + optional + ' - ' + pageItem.id);
    try {
        let out_msgs: Array<Payload> = [];
        let id = pageItem.id;

        if (existsObject(id)) {
            let o = getObject(id);
            let val: (boolean | number) = 0;
            let icon = Icons.GetIcon('lightbulb');
            let iconColor = rgb_dec565(config.defaultColor);

            if (type == 'popupLight') {
                let switchVal = '0';
                let brightness = 0;
                if (o.common.role == 'light' || o.common.role == 'socket') {
                    if (existsState(id + '.GET')) {
                        val = getState(id + '.GET').val;
                        RegisterDetailEntityWatcher(id + '.GET', pageItem, type);
                    } else if (existsState(id + '.SET')) {
	                    if(pageItem.monobutton != undefined && pageItem.monobutton == true){	
                            val = getState(id + ".STATE").val;	
						    RegisterDetailEntityWatcher(id + ".STATE", pageItem, type);	
                        }	
                        else {	
                            val = getState(id + '.SET').val;	
                            RegisterDetailEntityWatcher(id + '.SET', pageItem, type);	
                        }
                        //val = getState(id + '.SET').val;
                        //RegisterDetailEntityWatcher(id + '.SET', pageItem, type);
                    }

                    icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == 'socket' ? Icons.GetIcon('power-socket-de') : Icons.GetIcon('lightbulb');

                    if (val) {
                        switchVal = '1';
                        iconColor = GetIconColor(pageItem, true, true);
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'   // entityUpdateDetail
                            + id + '~'
                            + icon + '~'   // iconId
                            + iconColor + '~'   // iconColor
                            + switchVal + '~'   // buttonState
                            + 'disable' + '~'   // sliderBrightnessPos
                            + 'disable' + '~'   // sliderColorTempPos
                            + 'disable' + '~'   // colorMode
                            + ''        + '~'   // Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~'   // Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')
                    });         // Brightness-Bezeichnung
                }

                // Dimmer
                if (o.common.role == 'dimmer') {
                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type);
                    } else if (existsState(id + '.ON_SET')) {
                        val = getState(id + '.ON_SET').val;
                        RegisterDetailEntityWatcher(id + '.ON_SET', pageItem, type);
                    }

                    if (val === true) {
                        let iconColor = GetIconColor(pageItem, val, false);
                        switchVal = '1'
                    }

                    if (existsState(id + '.ACTUAL')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.ACTUAL').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.ACTUAL').val;
                        }
                    } else {
                        console.warn('Alisas-Datenpunkt: ' + id + '.ACTUAL could not be read');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, 100 - brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type);

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'   //entityUpdateDetail
                            + id + '~'
                            + icon + '~'        //iconId
                            + iconColor + '~'   //iconColor
                            + switchVal + '~'   //buttonState
                            + brightness + '~'  //sliderBrightnessPos
                            + 'disable' + '~'   //sliderColorTempPos
                            + 'disable' + '~'   //colorMod
                            + ''        + '~'   //Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~'   //Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')
                    });         //Brightness-Bezeichnung

                }

                // HUE-Licht
                if (o.common.role == 'hue') {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type);
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.DIMMER could not be read');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, 100 - brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';
                    if (existsState(id + '.HUE')) {
                        if (getState(id + '.HUE').val != null) {
                            colorMode = 'enable';
                            let huecolor = hsv2rgb(getState(id + '.HUE').val, 1, 1);
                            let rgb = <RGB>{ red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2]) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                            //RegisterDetailEntityWatcher(id + '.HUE', pageItem, type);
                        }
                    }

                    let colorTemp = 0;
                    if (existsState(id + '.TEMPERATURE')) {
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                            } else {
                                colorTemp = 100 - getState(id + '.TEMPERATURE').val;
                            }
                            //RegisterDetailEntityWatcher(id + '.TEMPERATURE', pageItem, type);
                        }
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.TEMPERATURE could not be read');
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + id + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color'   + '~'                           //Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~' //Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')        //Brightness-Bezeichnung
                    });
                }

                // RGB-Licht
                if (o.common.role == 'rgb') {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type);
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.DIMMER could not be read');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, 100 - brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';
                    if (existsState(id + '.RED') && existsState(id + '.GREEN') && existsState(id + '.BLUE')) {
                        if (getState(id + '.RED').val != null && getState(id + '.GREEN').val != null && getState(id + '.BLUE').val != null) {
                            colorMode = 'enable';
                            let rgb = <RGB>{ red: Math.round(getState(id + '.RED').val), green: Math.round(getState(id + '.GREEN').val), blue: Math.round(getState(id + '.BLUE').val) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                            //RegisterDetailEntityWatcher(id + '.HUE', pageItem, type);
                        }
                    }

                    let colorTemp = 0;
                    if (existsState(id + '.TEMPERATURE')) {
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                            } else {
                                colorTemp = 100 - getState(id + '.TEMPERATURE').val;
                            }
                            //RegisterDetailEntityWatcher(id + '.TEMPERATURE', pageItem, type);
                        }
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.TEMPERATURE could not be read');
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + id + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~' //Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')        //Brightness-Bezeichnung
                    });
                }

                // RGB-Licht-einzeln (HEX)
                if (o.common.role == 'rgbSingle') {

                    if (existsState(id + '.ON_ACTUAL')) {
                        val = getState(id + '.ON_ACTUAL').val;
                        RegisterDetailEntityWatcher(id + '.ON_ACTUAL', pageItem, type);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type);
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.DIMMER could not be read');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, 100 - brightness, true);
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
                            let rgb = <RGB>{ red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue) }
                            iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                            //RegisterDetailEntityWatcher(id + '.HUE', pageItem, type);
                        }
                    }

                    let colorTemp = 0;
                    if (existsState(id + '.TEMPERATURE')) {
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                            } else {
                                colorTemp = 100 - getState(id + '.TEMPERATURE').val;
                            }
                            //RegisterDetailEntityWatcher(id + '.TEMPERATURE', pageItem, type);
                        }
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.TEMPERATURE could not be read');
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + id + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~' //Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')        //Brightness-Bezeichnung
                    });
                }

                // Farbtemperatur
                if (o.common.role == 'ct') {

                    if (existsState(id + '.ON')) {
                        val = getState(id + '.ON').val;
                        RegisterDetailEntityWatcher(id + '.ON', pageItem, type);
                    }

                    if (existsState(id + '.DIMMER')) {
                        if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                            brightness = Math.trunc(scale(getState(id + '.DIMMER').val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                        } else {
                            brightness = getState(id + '.DIMMER').val;
                        }
                        RegisterDetailEntityWatcher(id + '.DIMMER', pageItem, type);
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.DIMMER could not be read');
                    }

                    if (val === true) {
                        iconColor = GetIconColor(pageItem, 100 - brightness, true);
                        switchVal = '1';
                    } else {
                        iconColor = GetIconColor(pageItem, false, true);
                    }

                    let colorMode = 'disable';

                    let colorTemp = 0;
                    if (existsState(id + '.TEMPERATURE')) {
                        if (getState(id + '.TEMPERATURE').val != null) {
                            if (pageItem.minValueColorTemp !== undefined && pageItem.maxValueColorTemp !== undefined) {
                                colorTemp = Math.trunc(scale(getState(id + '.TEMPERATURE').val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                            } else {
                                colorTemp = 100 - getState(id + '.TEMPERATURE').val;
                            }
                            //RegisterDetailEntityWatcher(id + '.TEMPERATURE', pageItem, type);
                        }
                    } else {
                        console.warn('Alias-Datenpunkt: ' + id + '.TEMPERATURE could not be read');
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'             //entityUpdateDetail
                            + id + '~'
                            + icon + '~'                                //iconId
                            + iconColor + '~'                           //iconColor
                            + switchVal + '~'                           //buttonState
                            + brightness + '~'                          //sliderBrightnessPos
                            + colorTemp + '~'                           //sliderColorTempPos
                            + colorMode + '~'                           //colorMode   (if hue-alias without hue-datapoint, then disable)
                            + 'Color' + '~'                             //Color-Bezeichnung
                            + findLocale('lights', 'Temperature') + '~' //Temperature-Bezeichnung
                            + findLocale('lights', 'Brightness')        //Brightness-Bezeichnung
                    });
                }
            }

            if (type == 'popupShutter') {
                icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon('window-open');
                if (existsState(id + '.ACTUAL')) {
                    val = getState(id + '.ACTUAL').val;
                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type);
                } else if (existsState(id + '.SET')) {
                    val = getState(id + '.SET').val;
                    RegisterDetailEntityWatcher(id + '.SET', pageItem, type);
                }
                let tilt_position: any = 'disabled'
                if (existsState(id + '.TILT_ACTUAL')) {
                    tilt_position = getState(id + '.TILT_ACTUAL').val;
                    RegisterDetailEntityWatcher(id + '.TILT_ACTUAL', pageItem, type);
                } else if (existsState(id + '.TILT_SET')) {
                    tilt_position = getState(id + '.TILT_SET').val;
                    RegisterDetailEntityWatcher(id + '.TILT_SET', pageItem, type);
                }

                let textSecondRow = '';
                let icon_id = icon;
                let icon_up = Icons.GetIcon('arrow-up');
                let icon_stop = Icons.GetIcon('stop');
                let icon_down = Icons.GetIcon('arrow-down');
                let icon_up_status = getState(id + '.ACTUAL').val != 100 ? 'enable' : 'disable';
                let icon_stop_status = 'enable';
                let icon_down_status = getState(id + '.ACTUAL').val != 0 ? 'enable' : 'disable';
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
                    iconTiltLeftStatus = getState(id + '.TILT_ACTUAL').val != 100 ? 'enable' : 'disable';
                    iconTiltStopStatus = 'enable';
                    iconTiltRightStatus = getState(id + '.TILT_ACTUAL').val != 0 ? 'enable' : 'disable';
                    tilt_pos = tilt_position;
                }

                if (pageItem.secondRow != undefined) {
                    textSecondRow = pageItem.secondRow;
                }

                out_msgs.push({
                    payload: 'entityUpdateDetail' + '~'           //entityUpdateDetail
                        + id + '~'                                //entity_id
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
                let mode1 = (pageItem.popupThermoMode1 != undefined) ? pageItem.popupThermoMode1.join('?') : '';
                let mode2 = (pageItem.popupThermoMode2 != undefined) ? pageItem.popupThermoMode2.join('?') : '';
                let mode3 = (pageItem.popupThermoMode3 != undefined) ? pageItem.popupThermoMode3.join('?') : '';

                let payloadParameters1 = '~~~~'
                if (pageItem.popupThermoMode1 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias[0], pageItem, type);
                    payloadParameters1 =    pageItem.popUpThermoName[0] + '~'                                          //{heading}~            Mode 1
                                            + 'modus1' + '~'                                                           //{id}~                 Mode 1
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias[0]).val + '~'       //{ACTUAL}~             Mode 1
                                            + mode1 + '~';                                                             //{possible values}     Mode 1 (1-n)
                }

                let payloadParameters2 = '~~~~'
                if (pageItem.popupThermoMode2 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias[1], pageItem, type);
                    payloadParameters2 =    pageItem.popUpThermoName[1] + '~'                                           //{heading}~            Mode 2
                                            + 'modus2' + '~'                                                            //{id}~                 Mode 2
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias[1]).val + '~'        //{ACTUAL}~             Mode 2
                                            + mode2 + '~';                                                              //{possible values}
                }

                let payloadParameters3 = '~~~~'
                if (pageItem.popupThermoMode3 != undefined) {
                    RegisterDetailEntityWatcher(pageItem.id + "." + pageItem.setThermoAlias[2], pageItem, type);
                    payloadParameters3 =    pageItem.popUpThermoName[2] + '~'                                           //{heading}~            Mode 3
                                            + 'modus3' + '~'                                                            //{id}~                 Mode 3
                                            + getState(pageItem.id + "." + pageItem.setThermoAlias[2]).val + '~'        //{ACTUAL}~             Mode 3
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
                    RegisterDetailEntityWatcher(id + '.ACTUAL', pageItem, type);
                    timer_actual = getState(id + '.ACTUAL').val;
                } 

                if (existsState(id + '.STATE')) {
                    RegisterDetailEntityWatcher(id + '.STATE', pageItem, type);
                } 

                let editable = 1;
                let action1 = '';
                let action2 = '';
                let action3 = '';
                let label1  = '';
                let label2  = '';
                let label3  = '';
                let min_remaining = 0;
                let sec_remaining = 0;
                if (existsState(id + '.STATE')) {
                    if (getState(id + '.STATE').val == 'idle' || getState(id + '.STATE').val == 'paused') {
                        min_remaining = Math.floor(timer_actual / 60);
                        sec_remaining = timer_actual % 60;
                        editable = 1;
                        action2 = 'start';
                        label2 = 'START';
                    } else {
                        min_remaining = Math.floor(timer_actual / 60);
                        sec_remaining = timer_actual % 60;
                        editable = 0;
                        action1 = 'pause';
                        action2 = 'cancle';
                        action3 = 'finish';
                        label1  = 'PAUSE';
                        label2  = 'CANCLE';
                        label3  = 'FINISH';
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'  //entityUpdateDetail
                            + id + '~~'                      //{entity_id}
                            + rgb_dec565(White) + '~'        //{icon_color}~
                            + id + '~' 
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
                if (o.common.role == 'level.mode.fan') {
                    if (existsState(id + '.SET')) {
                        val = getState(id + '.SET').val;
                        RegisterDetailEntityWatcher(id + '.SET', pageItem, type);
                    }
                    if (existsState(id + '.MODE')) {
                        RegisterDetailEntityWatcher(id + '.MODE', pageItem, type);
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
                    
                    let modeList = pageItem.modeList.join('?');
                    let actualMode = pageItem.modeList[getState(id + '.MODE').val];
                    
                    out_msgs.push({
                        payload: 'entityUpdateDetail' + '~'     // entityUpdateDetail
                            + id + '~'
                            + icon + '~'                        // iconId
                            + iconColor + '~'                   // iconColor
                            + switchVal + '~'                   // buttonState
                            + actualSpeed + '~'   
                            + maxSpeed + '~'   
                            + 'Speed' + '~'   
                            + actualMode + '~'   
                            + modeList    
                    });
                }
            }

            if (type == 'popupInSel') {
                if (o.common.role == 'media') {
                    let actualState: any = '';
                    let optionalString: string = 'Kein Eintrag';
                    let mode: string = '';

                    let vTempAdapter = (pageItem.adapterPlayerInstance).split('.');
                    let vAdapter = vTempAdapter[0];

                    if (optional == 'speakerlist') {
                        if (vAdapter == 'spotify-premium') {
                            if (existsObject(pageItem.adapterPlayerInstance + 'player.device.name')) {
                                actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'player.device.name').val);
                            }
                        } else if (vAdapter == 'alexa2') {
                            if (existsObject(pageItem.adapterPlayerInstance + 'player.device.name')) {
                                //Todo Richtiges Device finden
                                actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Info.name').val);
                            }
                        }
                        let tempSpeakerList = [];
                        for (let i = 0; i < pageItem.speakerList.length; i++) {
                            tempSpeakerList[i] = formatInSelText(pageItem.speakerList[i]);
                        }
                        optionalString = pageItem.speakerList != undefined ? tempSpeakerList.join('?') : '';
                        mode = 'speakerlist';
                    } else if (optional == 'playlist') {
                        if (vAdapter == 'spotify-premium') {
                            if (existsObject(pageItem.adapterPlayerInstance + 'player.playlist.name')) {
                                actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'player.playlist.name').val);
                            }
                            let tempPlayList = [];
                            for (let i = 0; i < pageItem.playList.length; i++) {
                                tempPlayList[i] = formatInSelText(pageItem.playList[i]);
                            }
                            optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                        } else if (vAdapter == 'alexa2') {
                            //Todo Richtiges Device finden
                            actualState = formatInSelText(getState(pageItem.adapterPlayerInstance + 'Echo-Devices.' + pageItem.mediaDevice + '.Player.currentAlbum').val);
            
                            let tPlayList: any = []
                            for (let i = 0; i < pageItem.playList.length; i++) {
                                console.log(pageItem.playList[i]);
                                let tempItem = pageItem.playList[i].split('.');
                                tPlayList[i] = tempItem[1];
                            }
                            
                            let tempPlayList = [];
                            for (let i = 0; i < tPlayList.length; i++) {
                                tempPlayList[i] = formatInSelText(tPlayList[i]);
                            }
                            optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                        } else if (vAdapter == 'volumio') { /* Volumio: limit 900 chars */
                            actualState = ''; //todo: no actual playlistname saving
                            let tempPlayList = []; let tempPll = 0;
                            for (let i = 0; i < pageItem.playList.length; i++) {
                                tempPll += pageItem.playList[i].length; if (tempPll > 900) break;
                                tempPlayList[i] = formatInSelText(pageItem.playList[i]);
                            }
                            optionalString = pageItem.playList != undefined ? tempPlayList.join('?') : ''
                        } /**/
                        mode = 'playlist';
                    } else if (optional == 'tracklist') {
                        actualState = '';
                        /* Volumio: works for files */
                        if (vAdapter == 'volumio') {
                            actualState = getState(pageItem.id + '.TITLE').val;
                            globalTracklist = pageItem.globalTracklist;
                        } else {
                            actualState = getState(pageItem.adapterPlayerInstance + 'player.trackName').val;
                        }
                        actualState = (actualState.replace('?','')).split(' -');
                        actualState = actualState[0].split(" (");
                        actualState = formatInSelText(actualState[0]);
                        //Limit 900 Zeichen, danach Speicherüberlauf --> Soweit kürzen wie möglich
                        let temp_array = [];
                        //let trackArray = (function () { try {return JSON.parse(getState(pageItem.adapterPlayerInstance + 'player.playlist.trackListArray').val);} catch(e) {return {};}})();
                        for (let track_index=0; track_index < 45; track_index++) {
                            let temp_cut_array = getAttr(globalTracklist, track_index + '.title');
                            /* Volumio: @local/NAS no title -> name */
                            if (temp_cut_array == undefined) {
                                temp_cut_array = getAttr(globalTracklist, track_index + '.name');
                            }
                            if (Debug) console.log(temp_cut_array);
                            if (temp_cut_array != undefined) {
                                temp_cut_array = (temp_cut_array.replace('?','')).split(' -');
                                temp_cut_array = temp_cut_array[0].split(" (");
                                temp_cut_array = temp_cut_array[0];
                                if (String(temp_cut_array[0]).length >= 22) {
                                    temp_array[track_index] = temp_cut_array.substring(0,20) + '..';
                                } else {
                                    temp_array[track_index] = temp_cut_array.substring(0,23);
                                }
                            }
                        }
                        let tempTrackList = [];
                        for (let i = 0; i < temp_array.length; i++) {
                            tempTrackList[i] = formatInSelText(temp_array[i]);
                        }
                        optionalString = pageItem.playList != undefined ? tempTrackList.join('?') : ''
                        mode = 'tracklist';
                    } else if (optional == 'equalizer') {
                    
                        let lastIndex = (pageItem.id.split('.')).pop();

                        if (existsObject(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode') == false || 
                            existsObject(NSPanel_Path + 'Media.Player.' + lastIndex + '.Speaker') == false) {
                            createState(NSPanel_Path  + 'Media.Player.' + lastIndex + '.EQ.activeMode', <iobJS.StateCommon>{ type: 'string' });
                            createState(NSPanel_Path  + 'Media.Player.' + lastIndex + '.Speaker', <iobJS.StateCommon>{ type: 'string' });
                        }
                        
                        actualState = ''
                        if (getState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode').val != null) {
                            actualState = formatInSelText(getState(NSPanel_Path + 'Media.Player.' + lastIndex + '.EQ.activeMode').val);
                        }
                        
                        let tempEQList = [];
                        for (let i = 0; i < pageItem.equalizerList.length; i++) {
                            tempEQList[i] = formatInSelText(pageItem.equalizerList[i]);
                        }
                        optionalString = pageItem.equalizerList != undefined ? tempEQList.join('?') : '';

                        //optionalString = pageItem.equalizerList.join('?');
                        mode = 'equalizer';
                    } else if (optional == 'repeat') {
                        actualState = getState(pageItem.adapterPlayerInstance + 'player.repeat').val;
                        optionalString = pageItem.repeatList.join('?');
                        mode = 'repeat';
                    }

                    out_msgs.push({
                        payload: 'entityUpdateDetail2' + '~'     //entityUpdateDetail
                            + id + '?' + optional + '~~'         //{entity_id}
                            + rgb_dec565(HMIOn) + '~'            //{icon_color}~
                            + mode + '~'
                            + actualState + '~'
                            + optionalString
                    });
                } else if (o.common.role == 'buttonSensor') {

                    let actualValue: string = '';
                    if (existsObject(pageItem.id + '.VALUE')) {
                        actualValue = formatInSelText(pageItem.modeList[getState(pageItem.id + '.VALUE').val]);
                        RegisterDetailEntityWatcher(id + '.VALUE', pageItem, type);
                    }

                    let tempModeList = [];
                    for (let i = 0; i < pageItem.modeList.length; i++) {
                        tempModeList[i] = formatInSelText(pageItem.modeList[i]);
                    }
                    let valueList = pageItem.modeList != undefined ? tempModeList.join('?') : '';
                    //let valueList = pageItem.modeList.join('?');

                    out_msgs.push({
                        payload: 'entityUpdateDetail2' + '~'     //entityUpdateDetail2
                            + id + '~~'                          //{entity_id}
                            + rgb_dec565(White) + '~'            //{icon_color}~
                            + 'insel' + '~'
                            + actualValue + '~'
                            + valueList
                    });
                }
            }
        }
        return out_msgs;

    } catch (err) {
        console.log('function GenerateDetailPage: ' + err.message);
    }
}

function scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    try {
        return (outMax + outMin) - ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    } catch (err) {
        console.log('function scale: ' + err.message);
    }
}

function UnsubscribeWatcher(): void {
    try {
        for (const [key, value] of Object.entries(subscriptions)) {
            unsubscribe(value);
            delete subscriptions[key];
        }
    } catch (err) {
        console.log('function UnsubscribeWatcher: ' + err.message);
    }
}

function HandleScreensaver(): void {
    setIfExists(NSPanel_Path + 'ActivePage.type', 'screensaver');
    setIfExists(NSPanel_Path + 'ActivePage.heading', 'Screensaver');
    SendToPanel({ payload: 'pageType~screensaver' });
    UnsubscribeWatcher();
    HandleScreensaverUpdate();
    HandleScreensaverColors();
}

function HandleScreensaverUpdate(): void {
    try {
        let arrayEntityType = [];
        let arrayEntityIntNameEntity = [];
        let arrayEntityIcon = [];
        let arrayEntityIconColor = [];
        let arrayEntityDisplayName = [];
        let arrayEntityOptionalValue = [];

        //Create MainIcon
        if (screensaverEnabled && config.weatherEntity != null && existsObject(config.weatherEntity)) {
            let icon = getState(config.weatherEntity + '.ICON').val;
            let temperature =
                existsState(config.weatherEntity + '.ACTUAL') ? getState(config.weatherEntity + '.ACTUAL').val :
                    existsState(config.weatherEntity + '.TEMP') ? getState(config.weatherEntity + '.TEMP').val : 'null';
            let temperatureUnit = getState(NSPanel_Path + 'Config.temperatureUnit').val;
            arrayEntityOptionalValue[0] = temperature + ' ' + temperatureUnit;
            if (weatherAdapterInstance == 'daswetter.0.') {
                arrayEntityIcon [0] = Icons.GetIcon(GetDasWetterIcon(parseInt(icon)));
                arrayEntityIconColor[0] = GetDasWetterIconColor(parseInt(icon));
            } else if (weatherAdapterInstance == 'accuweather.0.') {
                arrayEntityIcon [0] = Icons.GetIcon(GetAccuWeatherIcon(parseInt(icon)));
                arrayEntityIconColor[0] = GetAccuWeatherIconColor(parseInt(icon));
            }

            arrayEntityType[0] = '';
            arrayEntityIntNameEntity[0] = '';
            arrayEntityDisplayName[0] = '';
            arrayEntityOptionalValue[0] = temperature + ' ' + temperatureUnit;

            if (weatherForecast) {
                // AccuWeather Forecast Tag 2 - Tag 5 -- Wenn weatherForecast = true
                for (let i = 2; i < 6; i++) {

                    let TempMin = 0;
                    let TempMax = 0;
                    let DayOfWeek = 0;
                    let WeatherIcon = '0';

                    if (weatherAdapterInstance == 'daswetter.0.') {
                        TempMin = getState('daswetter.0.NextDays.Location_1.Day_' + i + '.Minimale_Temperatur_value').val;
                        TempMax = getState('daswetter.0.NextDays.Location_1.Day_' + i + '.Maximale_Temperatur_value').val;
                        DayOfWeek = (getState('daswetter.0.NextDays.Location_1.Day_' + i + '.Tag_value').val).substring(0,2);
                        WeatherIcon = GetDasWetterIcon(getState('daswetter.0.NextDays.Location_1.Day_' + i + '.Wetter_Symbol_id').val);
                        vwIconColor[i-1] = GetDasWetterIconColor(getState('daswetter.0.NextDays.Location_1.Day_' + i + '.Wetter_Symbol_id').val);
                    } else if (weatherAdapterInstance == 'accuweather.0.') {
                        TempMin = getState('accuweather.0.Summary.TempMin_d' + i).val;
                        TempMax = getState('accuweather.0.Summary.TempMax_d' + i).val;
                        DayOfWeek = getState('accuweather.0.Summary.DayOfWeek_d' + i).val;
                        WeatherIcon = GetAccuWeatherIcon(getState('accuweather.0.Summary.WeatherIcon_d' + i).val);
                        vwIconColor[i-1] = GetAccuWeatherIconColor(getState('accuweather.0.Summary.WeatherIcon_d' + i).val);
                    } 
                    let tempMinMaxString: string = '';
                    if (weatherScreensaverTempMinMax == 'Min') {
                        tempMinMaxString = TempMin + temperatureUnit;
                    } else if (weatherScreensaverTempMinMax == 'Max') {
                        tempMinMaxString = TempMax + temperatureUnit;
                    } else if (weatherScreensaverTempMinMax == 'MinMax') {
                        tempMinMaxString = Math.round(TempMin) + '° ' + Math.round(TempMax) + '°';
                    }
                    arrayEntityType[i-1] = ''; 
                    arrayEntityIntNameEntity[i-1] = '';
                    arrayEntityIcon[i-1] = Icons.GetIcon(WeatherIcon);
                    arrayEntityIconColor[i-1] = vwIconColor[i-1];
                    arrayEntityDisplayName[i-1] = DayOfWeek;
                    arrayEntityOptionalValue[i-1] = tempMinMaxString;
                }
            } else {
                arrayEntityType[1] = '';
                arrayEntityType[2] = '';
                arrayEntityType[3] = '';
                arrayEntityType[4] = ''; 
                arrayEntityIntNameEntity[1] = '';
                arrayEntityIntNameEntity[2] = '';
                arrayEntityIntNameEntity[3] = '';
                arrayEntityIntNameEntity[4] = '';
                arrayEntityOptionalValue[1] = (getState(config.firstScreensaverEntity.ScreensaverEntity).val * config.firstScreensaverEntity.ScreensaverEntityFactor).toFixed(config.firstScreensaverEntity.ScreensaverEntityDecimalPlaces) + config.firstScreensaverEntity.ScreensaverEntityUnitText;
                arrayEntityOptionalValue[2] = (getState(config.secondScreensaverEntity.ScreensaverEntity).val * config.secondScreensaverEntity.ScreensaverEntityFactor).toFixed(config.secondScreensaverEntity.ScreensaverEntityDecimalPlaces) + config.secondScreensaverEntity.ScreensaverEntityUnitText;
                arrayEntityOptionalValue[3] = (getState(config.thirdScreensaverEntity.ScreensaverEntity).val * config.thirdScreensaverEntity.ScreensaverEntityFactor).toFixed(config.thirdScreensaverEntity.ScreensaverEntityDecimalPlaces) + config.thirdScreensaverEntity.ScreensaverEntityUnitText;
                arrayEntityOptionalValue[4] = (getState(config.fourthScreensaverEntity.ScreensaverEntity).val * config.fourthScreensaverEntity.ScreensaverEntityFactor).toFixed(config.fourthScreensaverEntity.ScreensaverEntityDecimalPlaces) + config.fourthScreensaverEntity.ScreensaverEntityUnitText;
                arrayEntityIcon[1] = Icons.GetIcon(config.firstScreensaverEntity.ScreensaverEntityIcon);
                arrayEntityIcon[2] = Icons.GetIcon(config.secondScreensaverEntity.ScreensaverEntityIcon);
                arrayEntityIcon[3] = Icons.GetIcon(config.thirdScreensaverEntity.ScreensaverEntityIcon);
                arrayEntityIcon[4] = Icons.GetIcon(config.fourthScreensaverEntity.ScreensaverEntityIcon);
                arrayEntityDisplayName[1] = config.firstScreensaverEntity.ScreensaverEntityText;
                arrayEntityDisplayName[2] = config.secondScreensaverEntity.ScreensaverEntityText;
                arrayEntityDisplayName[3] = config.thirdScreensaverEntity.ScreensaverEntityText;
                arrayEntityDisplayName[4] = config.fourthScreensaverEntity.ScreensaverEntityText;
                GetScreenSaverEntityColor(config.firstScreensaverEntity, 1, sctF1Icon);
                arrayEntityIconColor[1] = vwIconColor[1];
                GetScreenSaverEntityColor(config.secondScreensaverEntity, 2, sctF2Icon);
                arrayEntityIconColor[2] = vwIconColor[2];
                GetScreenSaverEntityColor(config.thirdScreensaverEntity, 3, sctF3Icon);
                arrayEntityIconColor[3] = vwIconColor[3];
                GetScreenSaverEntityColor(config.fourthScreensaverEntity, 4, sctF4Icon);    
                arrayEntityIconColor[4] = vwIconColor[4];
            }

            //AltLayout
            if (getState(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout').val) {           
                arrayEntityType[5] = ''; 
                arrayEntityIntNameEntity[5] = '';
                arrayEntityIcon[5] = Icons.GetIcon(config.fourthScreensaverEntity.ScreensaverEntityIcon);
                arrayEntityIconColor[5] = rgb_dec565(White);
                arrayEntityDisplayName[5] = '';
                arrayEntityOptionalValue[5] = getState(config.fourthScreensaverEntity.ScreensaverEntity).val + ' ' + config.fourthScreensaverEntity.ScreensaverEntityUnitText ;
            }

            HandleScreensaverColors();

            let payloadString = '';
            let max_index = 5;
            if (getState(NSPanel_Path + 'Config.Screensaver.alternativeScreensaverLayout').val) {
                max_index = 6;
            }
            
            for (let j = 0; j < max_index; j++) {
                payloadString +=    arrayEntityType[j] + '~' +
                                    arrayEntityIntNameEntity[j] + '~' +
                                    arrayEntityIcon[j] + '~' +
                                    arrayEntityIconColor[j] + '~' +
                                    arrayEntityDisplayName[j] + '~' +
                                    arrayEntityOptionalValue[j] + '~';
            }

            if (Debug) console.log('weatherUpdate~' + payloadString);

            SendToPanel(<Payload>{ payload: 'weatherUpdate~' + payloadString });

            HandleScreensaverStatusIcons();

        }
    } catch (err) {
        console.log('HandleScreensaverUpdate: ' + err.message);
    }
}

function HandleScreensaverStatusIcons() : void {
    try {
        let payloadString = '';
        let hwBtn1Col: any = config.mrIcon1ScreensaverEntity.ScreensaverEntityOffColor;
        if (config.mrIcon1ScreensaverEntity.ScreensaverEntity != null) {
            if (typeof (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val) == 'string') {
                let hwBtn1: string = getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val;
                if (hwBtn1 == 'ON') {
                    hwBtn1Col = config.mrIcon1ScreensaverEntity.ScreensaverEntityOnColor;
                }
                if (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val) {
                    payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn);
                } else {
                    if (config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff != null) {
                        payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff);
                    } else {
                        payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn);
                    }
                } 
                if (config.mrIcon1ScreensaverEntity.ScreensaverEntityValue != null) {
                    payloadString += (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntityValue).val).toFixed(config.mrIcon1ScreensaverEntity.ScreensaverEntityValueDecimalPlace);
                    payloadString += config.mrIcon1ScreensaverEntity.ScreensaverEntityValueUnit;                        
                }
                payloadString += '~' + rgb_dec565(hwBtn1Col) + '~';
            } else if (typeof (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val) == 'boolean') {
                let hwBtn1: boolean = getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val;
                if (hwBtn1) {
                    hwBtn1Col = config.mrIcon1ScreensaverEntity.ScreensaverEntityOnColor;
                }
                if (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntity).val) {
                    payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn);
                } else {
                    if (config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff != null) {
                        payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOff);
                    } else {
                        payloadString += Icons.GetIcon(config.mrIcon1ScreensaverEntity.ScreensaverEntityIconOn);
                    }
                } 
                if (config.mrIcon1ScreensaverEntity.ScreensaverEntityValue != null) {
                    payloadString += (getState(config.mrIcon1ScreensaverEntity.ScreensaverEntityValue).val).toFixed(config.mrIcon1ScreensaverEntity.ScreensaverEntityValueDecimalPlace);
                    payloadString += config.mrIcon1ScreensaverEntity.ScreensaverEntityValueUnit;                        
                }
                payloadString += '~' + rgb_dec565(hwBtn1Col) + '~';
            }
        } else {
            hwBtn1Col = Black;
            payloadString += '~~';
        }

        let hwBtn2Col: any = config.mrIcon2ScreensaverEntity.ScreensaverEntityOffColor;
        if (config.mrIcon2ScreensaverEntity.ScreensaverEntity != null) {
            if (typeof (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val) == 'string') {
                let hwBtn2: string = getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val;
                if (hwBtn2 == 'ON') {
                    hwBtn2Col = config.mrIcon2ScreensaverEntity.ScreensaverEntityOnColor;
                }
                if (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val) {
                    payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn);
                } else {
                    if (config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff != null) {
                        payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff);
                    } else {
                        payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn);
                    }
                } 
                if (config.mrIcon2ScreensaverEntity.ScreensaverEntityValue != null) {
                    payloadString += (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntityValue).val).toFixed(config.mrIcon2ScreensaverEntity.ScreensaverEntityValueDecimalPlace);
                    payloadString += config.mrIcon2ScreensaverEntity.ScreensaverEntityValueUnit;                        
                }
                payloadString += '~' + rgb_dec565(hwBtn2Col) + '~';
            } else if (typeof (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val) == 'boolean') {
                let hwBtn2: boolean = getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val;
                if (hwBtn2) {
                    hwBtn2Col = config.mrIcon2ScreensaverEntity.ScreensaverEntityOnColor;
                }
                if (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntity).val) {
                    payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn);
                } else {
                    if (config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff != null) {
                        payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOff);
                    } else {
                        payloadString += Icons.GetIcon(config.mrIcon2ScreensaverEntity.ScreensaverEntityIconOn);
                    }
                } 
                if (config.mrIcon2ScreensaverEntity.ScreensaverEntityValue != null) {
                    payloadString += (getState(config.mrIcon2ScreensaverEntity.ScreensaverEntityValue).val).toFixed(config.mrIcon2ScreensaverEntity.ScreensaverEntityValueDecimalPlace);
                    payloadString += config.mrIcon2ScreensaverEntity.ScreensaverEntityValueUnit;                        
                }
                payloadString += '~' + rgb_dec565(hwBtn2Col) + '~';
            }
        } else {
            hwBtn2Col = Black;
            payloadString += '~~';
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

        SendToPanel(<Payload>{ payload: 'statusUpdate~' + payloadString });

    } catch (err) {
        console.log('HandleScreensaverStatusIcons: ' + err.message);
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
    }
}

function HandleScreensaverColors(): void {
    try {
        let vwIcon = [];
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
        }

        let payloadString = 'color'                     + '~' +
                            scrSvrBGCol                 + '~' +      //background
                            rgb_dec565(sctime)          + '~' +      //time
                            rgb_dec565(sctimeAMPM)      + '~' +      //timeAMPM~
                            rgb_dec565(scdate)          + '~' +      //date~
                            rgb_dec565(sctMainText)     + '~' +      //tMainText~
                            rgb_dec565(sctForecast1)    + '~' +      //tForecast1~
                            rgb_dec565(sctForecast2)    + '~' +      //tForecast2~
                            rgb_dec565(sctForecast3)    + '~' +      //tForecast3~
                            rgb_dec565(sctForecast4)    + '~' +      //tForecast4~
                            rgb_dec565(White)           + '~' +      //tF1Icon~         rgb_dec565(sctF1Icon)
                            rgb_dec565(White)           + '~' +      //tF2Icon~         rgb_dec565(sctF2Icon)
                            rgb_dec565(White)           + '~' +      //tF3Icon~         rgb_dec565(sctF3Icon)
                            rgb_dec565(White)           + '~' +      //tF4Icon~         rgb_dec565(sctF4Icon)
                            rgb_dec565(sctForecast1Val) + '~' +      //tForecast1Val~
                            rgb_dec565(sctForecast2Val) + '~' +      //tForecast2Val~
                            rgb_dec565(sctForecast3Val) + '~' +      //tForecast3Val~
                            rgb_dec565(sctForecast4Val) + '~' +      //tForecast4Val~
                            rgb_dec565(scbar)           + '~' +      //bar~
                            rgb_dec565(sctMainTextAlt)  + '~' +      //tMainTextAlt
                            rgb_dec565(White)           + '~' +
                            rgb_dec565(sctTimeAdd);

        SendToPanel(<Payload>{ payload: payloadString });
    } catch (err) {
        console.warn('HandleScreensaverColors: '+ err.message);
    }
}

function GetScreenSaverEntityColor(configElement: ScreenSaverElement | null, index: number, color: RGB): void {
    try {
        if (configElement.ScreensaverEntityIconColor != undefined) {
            if (typeof getState(configElement.ScreensaverEntity).val == 'boolean') {
                vwIconColor[index] = (getState(configElement.ScreensaverEntity).val == true) ? rgb_dec565(colorScale10) : rgb_dec565(colorScale0);
            } else if (typeof configElement.ScreensaverEntityIconColor == 'object') {
                let iconvalmin = (configElement.ScreensaverEntityIconColor.val_min != undefined) ? configElement.ScreensaverEntityIconColor.val_min : 0 ;
                let iconvalmax = (configElement.ScreensaverEntityIconColor.val_max != undefined) ? configElement.ScreensaverEntityIconColor.val_max : 100 ;
                let iconvalbest = (configElement.ScreensaverEntityIconColor.val_best != undefined) ? configElement.ScreensaverEntityIconColor.val_best : iconvalmin ;
                let valueScale = getState(configElement.ScreensaverEntity).val * configElement.ScreensaverEntityFactor;

                if (iconvalmin == 0 && iconvalmax == 1) {
                    vwIconColor[index] = (getState(configElement.ScreensaverEntity).val == 1) ? rgb_dec565(colorScale0) : rgb_dec565(colorScale10);
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
                    vwIconColor[index] = HandleColorScale(valueScaletemp);
                }
                if (configElement.ScreensaverEntityIconColor.val_min == undefined) {
                    vwIconColor[index] = rgb_dec565(configElement.ScreensaverEntityIconColor);
                }
            } else {
                vwIconColor[index] = rgb_dec565(color);
            }
        } else {
            vwIconColor[index] = rgb_dec565(color);
        }
    } catch (err) {
        console.warn('GetScreenSaverEntityColor: '+ err.message);
    }
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
    } catch (err) {
        console.warn('GetAccuWeatherIcon: '+ err.message);
    }
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
    } catch (err) {
        console.warn('GetAccuWeatherIconColor: '+ err.message);
    }
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
    } catch (err) {
        console.warn('GetDasWetterIcon: '+ err.message);
    }
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
    } catch (err) {
        console.warn('GetDasWetterIconColor: '+ err.message);
    }
}

//------------------Begin Read Internal Sensor Data
on({ id: config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 'RESULT'.length) + 'SENSOR' }, async (obj) => {
    try {
        const Tasmota_Sensor = JSON.parse(obj.state.val);

        await createStateAsync(NSPanel_Path + 'Sensor.Time', <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(NSPanel_Path + 'Sensor.TempUnit', <iobJS.StateCommon>{ type: 'string' });
        await createStateAsync(NSPanel_Path + 'Sensor.ANALOG.Temperature', <iobJS.StateCommon>{ type: 'number', 'unit': '°C' });
        await createStateAsync(NSPanel_Path + 'Sensor.ESP32.Temperature', <iobJS.StateCommon>{ type: 'number', 'unit': '°C' });
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
    } catch (err) {
        console.warn('error with reading senor-data: '+ err.message);
    }
});
//------------------End Read Internal Sensor Data

function formatInSelText(Text: string ) : string { 
    let splitText = Text.split(' ');
    let lengthLineOne = 0;
    let arrayLineOne = [];
    for (let i = 0; i < splitText.length; i++) {
        lengthLineOne = lengthLineOne + splitText[i].length + 1;
        if (lengthLineOne > 12) {
            break;        
        } else {
            arrayLineOne[i] = splitText[i];
        }
    }
    let textLineOne = arrayLineOne.join(' ');
    let arrayLineTwo = [];
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
    return <RGB>{ red: Math.round(r), green: Math.round(g), blue: Math.round(b) };
}

function InterpolateNum(d1: number, d2: number, fraction: number): number {
    return d1 + (d2 - d1) * fraction;
}

function rgb_dec565(rgb: RGB): number {
    //return ((Math.floor(rgb.red / 255 * 31) << 11) | (Math.floor(rgb.green / 255 * 63) << 5) | (Math.floor(rgb.blue / 255 * 31)));
    return ((rgb.red >> 3) << 11) | ((rgb.green >> 2)) << 5 | ((rgb.blue) >> 3);
}

/* Convert radians to degrees
rad - radians to convert, expects rad in range +/- PI per Math.atan2
returns {number} degrees equivalent of rad
*/
function rad2deg(rad) {
    return (360 + 180 * rad / Math.PI) % 360;
}

function ColorToHex(color) {
    let hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red: number, green: number, blue: Number) {
    return '#' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

/* Convert h,s,v values to r,g,b
hue - in range [0, 360]
saturation - in range 0 to 1
value - in range 0 to 1
returns {Array|number} [r, g,b] in range 0 to 255
 */
function hsv2rgb(hue: number, saturation: number, value: number) {
    hue /= 60;
    let chroma = value * saturation;
    let x = chroma * (1 - Math.abs((hue % 2) - 1));
    let rgb = hue <= 1 ? [chroma, x, 0] :
        hue <= 2 ? [x, chroma, 0] :
            hue <= 3 ? [0, chroma, x] :
                hue <= 4 ? [0, x, chroma] :
                    hue <= 5 ? [x, 0, chroma] :
                        [chroma, 0, x];

    return rgb.map(v => (v + value - chroma) * 255);
}

function getHue(red: number, green: number, blue: number) {

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

    return <RGB>{ red: Math.round(rgb[0]), green: Math.round(rgb[1]), blue: Math.round(rgb[2]) };
}

function rgb_to_cie(red, green, blue)
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

function spotifyGetDeviceID(vDeviceString) {
    const availableDeviceIDs = getState("spotify-premium.0.devices.availableDeviceListIds").val;
    const availableDeviceNames = getState("spotify-premium.0.devices.availableDeviceListString").val;
    let arrayDeviceListIds = availableDeviceIDs.split(";");
    let arrayDeviceListSting = availableDeviceNames.split(";");
    let indexPos = arrayDeviceListSting.indexOf(vDeviceString);
    let strDevID = arrayDeviceListIds[indexPos];
    return strDevID;
}

type RGB = {
    red: number,
    green: number,
    blue: number
};

type Payload = {
    payload: string;
};

type Page = {
    type: string,
    heading: string,
    items: PageItem[],
    useColor: (boolean | false),
    subPage: (boolean | false),
    parent: (Page | undefined),
    parentIcon: (string | undefined),
    parentIconColor: (RGB | undefined),
    prev: (string | undefined),
    prevIcon: (string | undefined),
    prevIconColor: (RGB | undefined),
    next: (string | undefined),
    nextIcon: (string | undefined),
    nextIconColor: (RGB | undefined),
    home: (string | undefined),
    homeIcon: (string | undefined),
    homeIconColor: (RGB | undefined)
};

interface PageEntities extends Page {
    type: 'cardEntities',
    items: PageItem[],
}

interface PageGrid extends Page {
    type: 'cardGrid',
    items: PageItem[],
}

interface PageThermo extends Page {
    type: 'cardThermo',
    items: PageItem[],
}

interface PageMedia extends Page {
    type: 'cardMedia',
    items: PageItem[],
}

interface PageAlarm extends Page {
    type: 'cardAlarm',
    items: PageItem[],
}

interface PageUnlock extends Page {
    type: 'cardUnlock',
    items: PageItem[],
}

interface PageQR extends Page {
    type: 'cardQR',
    items: PageItem[],
}

interface PagePower extends Page {
    type: 'cardPower',
    items: PageItem[],
}

interface PageChart extends Page {
    type: 'cardChart' | 'cardLChart',
    items: PageItem[],
}

type PageItem = {
    id: string,
    icon: (string | undefined),
    icon2: (string | undefined),
    onColor: (RGB | undefined),
    offColor: (RGB | undefined),
    useColor: (boolean | undefined),
    interpolateColor: (boolean | undefined),
    minValueBrightness: (number | undefined),
    maxValueBrightness: (number | undefined),
    minValueColorTemp: (number | undefined),
    maxValueColorTemp: (number | undefined),
    minValue: (number | undefined),
    maxValue: (number | undefined),
    stepValue: (number | undefined),
    prefixName: (string | undefined),
    suffixName: (string | undefined),
    name: (string | undefined),
    secondRow: (string | undefined),
    buttonText: (string | undefined),
    unit: (string | undefined),
    navigate: (boolean | undefined),
    colormode: (string | undefined),
    colorScale: (any | undefined), 
    adapterPlayerInstance: (string | undefined),
    mediaDevice: (string | undefined),
    targetPage: (string | undefined),
    speakerList: (string[] | undefined),
    playList: (string[] | undefined),
    equalizerList: (string[] | undefined),
    repeatList: (string[] | undefined),
    globalTracklist: (string[] | undefined), 
    modeList: (string[] | undefined),
    hidePassword: (boolean | undefined),
    autoCreateALias: (boolean | undefined)
    colorMediaIcon: (RGB | undefined),
    colorMediaArtist: (RGB | undefined),
    colorMediaTitle: (RGB | undefined),
    popupThermoMode1: (string[] | undefined),
    popupThermoMode2: (string[] | undefined),
    popupThermoMode3: (string[] | undefined),
    popUpThermoName: (string[] | undefined),
    setThermoAlias: (string[] | undefined),
    setThermoDestTemp2: (string | undefined),
    yAxis: (string | undefined),
    yAxisTicks: (number[] | string | undefined),
    xAxisDecorationId: (string | undefined),
    popupType: (string | undefined),
    popupOptions: (string[] | undefined),
    useValue: (boolean | undefined),
    monobutton: (boolean | undefined)
}

type DimMode = {
    dimmodeOn: (boolean | undefined),
    brightnessDay: (number | undefined),
    brightnessNight: (number | undefined),
    timeDay: (string | undefined),
    timeNight: (string | undefined)
}

type Config = {
    panelRecvTopic: string,
    panelSendTopic: string,
    weatherEntity: string | null,
    firstScreensaverEntity: ScreenSaverElement | null,
    secondScreensaverEntity: ScreenSaverElement | null,
    thirdScreensaverEntity: ScreenSaverElement | null,
    fourthScreensaverEntity: ScreenSaverElement | null,
    mrIcon1ScreensaverEntity: ScreenSaverMRElement | null,
    mrIcon2ScreensaverEntity: ScreenSaverMRElement | null,
    defaultColor: RGB,
    defaultOnColor: RGB,
    defaultOffColor: RGB,
    defaultBackgroundColor: RGB,
    pages: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | PagePower | PageChart | PageUnlock )[],
    subPages: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | PagePower | PageChart | PageUnlock)[],
    button1Page: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | PagePower | PageChart | PageUnlock | null),
    button2Page: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | PagePower | PageChart | PageUnlock | null)
}

type ScreenSaverElement = {
    ScreensaverEntity: string | null,
    ScreensaverEntityFactor: number | 1,
    ScreensaverEntityDecimalPlaces: number | 0,
    ScreensaverEntityIcon: string | null,
    ScreensaverEntityText: string | null,
    ScreensaverEntityUnitText: string | null,
    ScreensaverEntityIconColor: any | null
}

type ScreenSaverMRElement = {
    ScreensaverEntity: string | null,
    ScreensaverEntityIconOn: string | null,
    ScreensaverEntityIconOff: string | null,
    ScreensaverEntityValue: string | null,
    ScreensaverEntityValueDecimalPlace: number | null,
    ScreensaverEntityValueUnit: string | null,
    ScreensaverEntityOnColor: RGB,
    ScreensaverEntityOffColor: RGB
}
