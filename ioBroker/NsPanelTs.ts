/*-----------------------------------------------------------------------
TypeScript zur Steuerung des SONOFF NSPanel mit dem ioBroker
- abgestimmt auf TFT 38 / v3.1.0.1 / BerryDriver 4 / Tasmota 12.0.1
joBr99 Projekt: https://github.com/joBr99/nspanel-lovelace-ui/tree/main/ioBroker
NsPanelTs.ts (dieses TypeScript in ioBroker) Stable: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/NsPanelTs.ts
icon_mapping.ts: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/icon_mapping.ts (TypeScript muss in global liegen)
ioBroker-Unterstützung: https://forum.iobroker.net/topic/50888/sonoff-nspanel
 
ReleaseNotes:
    Bugfixes und Erweiterungen:
        - cardQR (für Gäste WLAN)
        - cardThermo (Neues Design für Alias Thermostat und zusätzlich für Alias Klimaanlage)
        - 08.05.2022 - V2.9.0 - Menüpfeile bei HardwareButtons (button1Page; button2Page) mit Navigation auf Page 0
        - 08.05.2022 - V2.9.0 - Standard-Brightness über neuen Parameter active einstellbar (Test mit 2.9.3)
        - 08.05.2022 - V2.9.0 - Schalter (Licht, Dimmer, Hue, etc) in cardGrid lassen sich wieder schalten
        - 14.06.2022 - V2.9.0 - Aktion auf Submenüs schaltet unmittelbar auf vorheriges Mainmenu (Many thanks to Grrzzz)
        - 14.06.2022 - V2.9.0 - Menü-Pfeile in Subpages (z.B. card QR, cardMedia, etc) (Many thanks to Grrzzz)
        - 15.06.2022 - V3.0.0 - Date/Time im Screensaver auf Basis localString (de-DE/en-EN/nl-NL/etc.)
        - 16.06.2022 - V3.0.0 - Multilingual - config.locale (en-EN, de-DE, nl-NL, da-DK, es-ES, fr-FR, it-IT, ru-RU, etc.)
        - 16.06.2022 - V3.0.0 - Bugfix by Grrzzz - Subpages
        - 18.06.2022 - V3.1.0 - Längere Textfelder in cardEntities
        - 18.06.2022 - V3.1.0 - Detail-Page Lights/Shutter hat neuen Parameter "id"
        - 19.06.2022 - V3.1.0 - Bugfix toLocalTimeString in en-EN/en-US
        - 19.06.2022 - V3.1.0 - Fehler in findLocale abgefangen
        - 19.06.2022 - V3.1.0 - Umstellung auf "Home Assistant" Sprachfile
        - 19.06.2022 - V3.1.0 - Alias "light" und "socket" haben optionalen Parameter icon2 für negative Zustände

    Known Bug
        - Github Issue #286
    
Wenn Rule definiert, dann können die Hardware-Tasten ebenfalls für Seitensteuerung (dann nicht mehr als Releais) genutzt werden
Tasmota Konsole: 
    Rule2 on Button1#state do Publish %topic%/%prefix%/RESULT {"CustomRecv":"event,button1"} endon on Button2#state do Publish %topic%/%prefix%/RESULT {"CustomRecv":"event,button2"} endon
    Rule2 1 (Rule aktivieren)
    Rule2 0 (Rule deaktivieren) 
 
Mögliche Seiten-Ansichten:
    screensaver Page    - wird nach definiertem Zeitraum (config) mit Dimm-Modus aktiv (Uhrzeit, Datum, Aktuelle Temperatur mit Symbol)
                          (die 4 kleineren Icons können als Wetter-Vorschau + 4Tage (Symbol + Höschsttemperatur) oder zur Anzeige definierter Infos konfiguriert werden)   
    cardEtities Page    - 4 vertikale angeordnete Steuerelemente - auch als Subpage
    cardGrid Page       - 6 horizontal angeordnete Steuerelemente in 2 Reihen a 3 Steuerelemente - auch als Subpage
    cardThermo Page     - Thermostat mit Solltemperatur, Isttemperatur, Mode - Weitere Eigenschaften können im Alias definiert werden
    cardMedia Page      - Mediaplayer - Ausnahme: Alias sollte mit Alias-Manager automatisch über Alexa-Verzeichnes Player angelegt werden
    cardAlarm Page      - Alarmseite mit Zustand und Tastenfeld
 
Popup-Pages:
    popupLight Page     - in Abhängigkeit zum gewählten Alias werden "Helligkeit", "Farb-Temperatur" und "Farbauswahl" bereitgestellt
    popupShutter Page   - die Shutter-Potition (Rollo, Jalousie, Markise, Leinwand, etc.) kann über einen Slider verändert werden.
    popupNotify Page    - Info - Seite mit Headline Text und Buttons - Intern für manuelle Updates / Extern zur Befüllung von Datenpunkten unter 0_userdata
    screensaver Notify  - Über zwei externe Datenpunkte in 0_userdata können "Headline" und "Text" an den Screensaver zur Info gesendet werden
 
Mögliche Aliase: (Vorzugsweise mit ioBroker-Adapter "Geräte verwalten" konfigurieren, da SET, GET, ACTUAL, etc. verwendet werden)    
    Info                - Werte aus Datenpunkt
    Schieberegler       - Slider numerische Werte (SET/ACTUAL)
    Lautstärke:         - Volume (SET/ACTUAL) und MUTE 
    Lautstärke-Gruppe:  - analog Lautstärke 
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
    Verschluss          - Türschloss SET/ACTUAL/OPEN
    Taste               - Für Szenen oder Radiosender, etc. --> Nur Funktionsaufruf - Kein Taster wie MonoButton - True/False
    Tastensensor        - analog Taste
    Thermostat          - Aktuelle Raumtemperatur, Setpoint, etc. 
    Klimaanlage         - Buttons zur Steuerung der Klimaanlage im unteren Bereich
    Temperatur          - Anzeige von Temperture - Datenpunkten, ananlog Info
    Feuchtigkeit        - Anzeige von Humidity - Datenpunkten, ananlog Info 
    Medien              - Steuerung von Alexa - Über Alias-Manager im Verzeichnis Player automatisch anlegen (Geräte-Manager funktioniert nicht) 
    Wettervorhersage    - Aktuelle Außen-Temperatur (Temp) und aktuelles Accu-Wheather-Icon (Icon) für Screensaver
 
Interne Sonoff-Sensoren (über Tasmota):
    ESP-Temperatur      - wird in 0_userdata.0. abgelegt, kann als Alias importieert werden
    Temperatur          - Raumtemperatur - wird in 0_userdata.0. abgelegt, kann als Alias importieert werden 
                          (!!! Achtung: der interne Sonoff-Sensor liefert keine exakten Daten, da das NSPanel-Board und der ESP selbst Hitze produzieren !!! 
                          ggf. Offset einplanen oder besser einen externen Sensor über Zigbee etc. verwenden)
    Timestamp           - wird in 0_userdata.0. Zeitpunkt der letzten Sensorübertragung
Tasmota-Status0 - (zyklische Ausführung) 
    liefert relevanten Tasmota-Informationen und kann bei Bedarf in "function get_tasmota_status0()" erweitert werden. Daten werden in 0_userdata.0. abgelegt
Erforderliche Adapter:
    Accu-Wheater:       - Bei Nutzung der Wetterfunktionen (und zur Icon-Konvertierung) im Screensaver
    Alexa2:             - Bei Nutzung der dynamischen SpeakerList in der cardMedia
    Geräte verwalten    - Für Erstellung der Aliase
    Alias-Manager       - !!! ausschießlich für MEDIA-Alias
    MQTT-Adapter        - Für Kommunikation zwischen Skript und Tasmota
    JavaScript-Adapter
Upgrades in Konsole:
    Tasmota BerryDriver     : Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1
    TFT EU STABLE Version   : FlashNextion http://nspanel.pky.eu/lovelace-ui/github/nspanel-v3.1.0.tft
---------------------------------------------------------------------------------------
*/ 
var Icons = new IconsSelector();
var timeoutSlider: any;
const NSPanel_Path = "0_userdata.0.NSPanel.1."
const Debug = false;
var manually_Update = true;

//const Off: RGB = { red: 68, green: 115, blue: 158 };  //Blau-Off
const Off: RGB = { red: 253, green: 128, blue: 0 };     //Orange-Off - schönere Farbübergänge
const On: RGB = { red: 253, green: 216, blue: 53 };
const MSRed: RGB = { red: 251, green: 105, blue: 98 };
const MSYellow: RGB = { red: 255, green: 235, blue: 156 };
const MSGreen: RGB = { red: 121, green: 222, blue: 121 };
const Red: RGB = { red: 255, green: 0, blue: 0 };
const White: RGB = { red: 255, green: 255, blue: 255 }; 
const Yellow: RGB = { red: 255, green: 255, blue: 0 };
const Green: RGB = { red: 0, green: 255, blue: 0 };
const Blue: RGB = { red: 0, green: 0, blue: 255 };
const Gray: RGB = { red: 136, green: 136, blue: 136 };
const Black: RGB = { red: 0, green: 0, blue: 0 };
const colorSpotify: RGB = { red: 30, green: 215, blue: 96 };
const colorAlexa: RGB = { red: 49, green: 196, blue: 243 };
const colorRadio: RGB = { red: 255, green: 127, blue: 0 };
const BatteryFull: RGB = { red: 96, green: 176, blue: 62 };
const BatteryEmpty: RGB = { red: 179, green: 45, blue: 25 };

//----------------------Begin Dimmode
//Screensaver nachts auf dunkel ("brightnessNight: z.B. 2") oder aus ("brightnessNight:0") 
if (existsState(NSPanel_Path + "NSPanel_Dimmode_brightnessDay") == false || existsState(NSPanel_Path + "NSPanel_Dimmode_hourDay") == false || existsState(NSPanel_Path + "NSPanel_Dimmode_brightnessNight") == false || existsState(NSPanel_Path + "NSPanel_Dimmode_hourNight") == false) {
    createState(NSPanel_Path + "NSPanel_Dimmode_brightnessDay", 8, {type: 'number'}, function() {setState(NSPanel_Path + "NSPanel_Dimmode_brightnessDay", 8)});
    createState(NSPanel_Path + "NSPanel_Dimmode_hourDay", 7, {type: 'number'}, function() {setState(NSPanel_Path + "NSPanel_Dimmode_hourDay", 7)});
    createState(NSPanel_Path + "NSPanel_Dimmode_brightnessNight", 1, {type: 'number'}, function() {setState(NSPanel_Path + "NSPanel_Dimmode_brightnessNight", 1)});
    createState(NSPanel_Path + "NSPanel_Dimmode_hourNight", 22, {type: 'number'}, function() {setState(NSPanel_Path + "NSPanel_Dimmode_hourNight", 22)});
}
var vBrightnessDay = getState(NSPanel_Path + "NSPanel_Dimmode_brightnessDay").val;
var vBrightnessNight = getState(NSPanel_Path + "NSPanel_Dimmode_brightnessNight").val;
var vTimeDay = getState(NSPanel_Path + "NSPanel_Dimmode_hourDay").val;
if (vTimeDay < 10) {
    var TimeDay = "0" + vTimeDay.toString() + ":00";
} else {
    var TimeDay = vTimeDay.toString() + ":00";
}
var vTimeNight = getState(NSPanel_Path + "NSPanel_Dimmode_hourNight").val;
if (vTimeNight < 10) {
    var TimeNight = "0" + vTimeNight.toString() + ":00";
} else {
    var TimeNight = vTimeNight.toString() + ":00";
}
var timeDimMode = <DimMode>{dimmodeOn: true, brightnessDay: vBrightnessDay, brightnessNight: vBrightnessNight, timeDay: TimeDay, timeNight: TimeNight};
//--------------------End Dimmode

//----Möglichkeit, im Screensaver zwischen Accu-Weather Forecast oder selbstdefinierten Werten zu wählen---------------------------------
var weatherForecast = true; //true = WheatherForecast 5 Days --- false = Config --> firstScreensaverEntity - fourthScreensaverEntity ...

//Alexa-Instanz
var alexaInstanz = "alexa2.0"
var alexaDevice = "G0XXXXXXXXXXXXXX"; //Primär zu steuerndes Device oder Gruppe aus alexa2-Adapter (Seriennummer)

// Wenn alexaSpeakerList definiert, dann werden Einträge verwendet, sonst alle relevanten Devices aus Alexa-Instanz
// Speakerwechsel funktioniert nicht bei Radio/TuneIn sonden bei Playlists
//const alexaSpeakerList = []; //Beispiel ["Echo Spot Buero","Überall","Gartenhaus","Esszimmer","Heimkino"];
const alexaSpeakerList = ["Echo Spot Buero","Überall","Gartenhaus","Esszimmer","Heimkino","Echo Dot Küche"];

//Datenpunkte für Nachricht an Screensaver 
var screensaverNotifyHeading = NSPanel_Path + "ScreensaverInfo.popupNotifyHeading";
var screensaverNotifyText = NSPanel_Path + "ScreensaverInfo.popupNotifyText";
createState(screensaverNotifyHeading, {type: 'string'});
createState(screensaverNotifyText, {type: 'string'});

//Datenpunkte für Nachricht popupNotify Page 
var popupNotifyHeading = NSPanel_Path + "popupNotify.popupNotifyHeading";
var popupNotifyText = NSPanel_Path + "popupNotify.popupNotifyText";
var popupNotifyInternalName = NSPanel_Path + "popupNotify.popupNotifyInternalName"; // Wird mit Button-Action zurückgeschrieben
var popupNotifyButton1Text = NSPanel_Path + "popupNotify.popupNotifyButton1Text";
var popupNotifyButton2Text = NSPanel_Path + "popupNotify.popupNotifyButton2Text";
var popupNotifySleepTimeout = NSPanel_Path + "popupNotify.popupNotifySleepTimeout"; // in sek. / wenn 0, dann bleibt die Nachricht stehen
var popupNotifyAction = NSPanel_Path + "popupNotify.popupNotifyAction"; // Antwort aus dem Panel true/false
createState(popupNotifyHeading, {type: 'string'});
createState(popupNotifyText, {type: 'string'});
createState(popupNotifyInternalName, {type: 'string'});
createState(popupNotifyButton1Text, {type: 'string'});
createState(popupNotifyButton2Text, {type: 'string'});
createState(popupNotifySleepTimeout, {type: 'number'});
createState(popupNotifyAction, {type: 'boolean'});

var Test_Licht: PageEntities =
{
    "type": "cardEntities",
    "heading": "Color Aliase",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.TestRGBLichteinzeln", name: "RGB-Licht Hex-Color", interpolateColor: true},
        //<PageItem>{ id: "alias.0.NSPanel_1.TestFarbtemperatur", name: "Farbtemperatur", interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestRGBLicht", name: "RGB-Licht", minValueBrightness: 0, maxValueBrightness: 100, interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestCTmitHUE", name: "HUE-Licht-CT", minValueBrightness: 0, maxValueBrightness: 70, minValueColorTemp: 500, maxValueColorTemp: 6500, interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestHUELicht", name: "HUE-Licht-Color", minValueColorTemp: 500, maxValueColorTemp: 6500, interpolateColor: true}
    ]
};

var Test_Funktionen: PageEntities =
{
    "type": "cardEntities",
    "heading": "Sonstige Aliase",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.TestLautstärke", offColor: MSRed /*if mute=true*/, onColor: MSGreen ,name: "Echo Spot Büro", minValue: 0, maxValue: 100},
        <PageItem>{ id: "alias.0.NSPanel_1.TestTemperatur",name: "Temperatur außen", icon: "thermometer", onColor: White},
        <PageItem>{ id: "alias.0.NSPanel_1.TestFeuchtigkeit", name: "Luftfeuchte außen", icon: "water-percent", unit: "%H", onColor: White},
        <PageItem>{ id: "alias.0.NSPanel_1.TestInfo", name: "Windstärke", icon: "wind-power-outline", offColor: MSRed, onColor: MSGreen, unit: "bft", minValue: 0, maxValue: 12, interpolateColor: true, useColor: true}
    ]
};

var Buero_Seite_1: PageEntities =
{
    "type": "cardEntities",
    "heading": "Büro",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Schreibtischlampe", interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.Deckenbeleuchtung", interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.Testlampe2", name: "Filamentlampe", minValueBrightness: 0, maxValueBrightness: 70, interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.Luftreiniger", icon: "power", icon2: "",offColor: MSRed, onColor: MSGreen}
        //<PageItem>{ id: "alias.0.NSPanel_1.TestVentil1", icon: "valve-open", icon2: "valve-closed",offColor: MSRed, onColor: MSGreen, name: "Test-Ventil 1"}
    ]
};

var Fenster_1: PageEntities =
{
    "type": "cardEntities",
    "heading": "Fenster und Türen",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.TestFenster", offColor: MSRed, onColor: MSGreen, name: "Büro Fenster"},
        <PageItem>{ id: "alias.0.NSPanel_1.Haustuer", offColor: MSRed, onColor: MSGreen, name: "Haustür"},
        <PageItem>{ id: "alias.0.NSPanel_1.TestBlind", onColor: White, name: "IKEA Fyrtur"},
        <PageItem>{ id: "alias.0.NSPanel_1.TestDoorlock", offColor: MSRed, onColor: MSGreen, name: "Türschloss"},
    ]
};

var Button_1: PageEntities =
{
    "type": "cardEntities",
    "heading": "Button Aliase",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.TestTastensensor", name: "Tastensensor (FFN)"},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.NDR2", icon: "radio", name: "Taste (NDR2)", onColor: colorRadio},
    ]
};

var Subpages_1: PageEntities =
{
    "type": "cardEntities",
    "heading": "Test Subpages",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ navigate: true, id: "Abfall", onColor: White, name: "Abfallkalender"},
        <PageItem>{ navigate: true, id: "WLAN", onColor: White, name: "Gäste WLAN"},
    ]
};

//Subpage 1 von Subpages_1
var Abfall: PageEntities =
{
    "type": "cardEntities",
    "heading": "Abfallkalender",
    "useColor": true,
    "subPage": true,
    "parent": Subpages_1,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Abfall.event1",icon: "trash-can"},
        <PageItem>{ id: "alias.0.NSPanel_1.Abfall.event2",icon: "trash-can"},
        <PageItem>{ id: "alias.0.NSPanel_1.Abfall.event3",icon: "trash-can"},
        <PageItem>{ id: "alias.0.NSPanel_1.Abfall.event4",icon: "trash-can"}
    ]
};

var Buero_Seite_2: PageGrid =
{
    "type": "cardGrid",
    "heading": "Büro 2",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Schreibtischlampe", name: "Schreibtisch"},
        <PageItem>{ id: "alias.0.NSPanel_1.Deckenbeleuchtung", name: "Deckenlampe"},
        <PageItem>{ id: "alias.0.NSPanel_1.TestFenster", offColor: MSRed, onColor: MSGreen, name: "Büro Fenster"},
        <PageItem>{ id: "alias.0.NSPanel_1.Luftreiniger", icon: "power", offColor: MSRed, onColor: MSGreen},
        <PageItem>{ id: "alias.0.NSPanel_1.TestBlind", icon: "projector-screen", onColor: White, name: "Beamer"},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.Bob", icon: "play", onColor: White, name: "TuneIn"}
    ]
};

var Alexa: PageMedia = 
{
    "type": "cardMedia",
    "heading": "Alexa",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.Alexa.PlayerBuero" }]
};

var Buero_Themostat: PageThermo = 
{
    "type": "cardThermo",
    "heading": "Test Thermostat",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.Thermostat_Büro", minValue: 50, maxValue: 300 }]
};

var Buero_Klimaanlage: PageThermo = 
{
    "type": "cardThermo",
    "heading": "Test Klimaanlage",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.TestKlimaanlage", minValue: 170, maxValue: 250}]
};

//Subpage 2 von Subpages_1
var WLAN: PageQR = 
{
    "type": "cardQR",
    "heading": "Gäste WLAN",
    "useColor": true,
    "subPage": true,
    "parent": Subpages_1,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.Guest_Wifi" }]
};

var Buero_Alarm: PageAlarm = 
{
    "type": "cardAlarm",
    "heading": "Alarm",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.Alarm" }]
};

var button1Page: PageGrid =
{
    "type": "cardGrid",
    "heading": "Radio",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.FFN", icon: "radio", name: "FFN", onColor: colorRadio},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.Antenne" , icon: "radio", name: "Antenne Nds.", onColor: colorRadio},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.NDR2", icon: "radio", name: "NDR2", onColor: colorRadio},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.Bob", icon: "radio", name: "Radio BOB", onColor: colorRadio},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.Spotify", icon: "spotify", name: "Party Playlist", onColor: colorSpotify},
        <PageItem>{ id: "alias.0.NSPanel_1.Radio.Alexa", icon: "playlist-music", name: "Playlist 2021", onColor: colorAlexa}
    ]
};

var button2Page: PageEntities =
{
    "type": "cardEntities",
    "heading": "Büro",
    "useColor": true,
    "subPage": false,
    "parent": undefined,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Schreibtischlampe"},
        <PageItem>{ id: "alias.0.NSPanel_1.Deckenbeleuchtung"}
    ]
};

//Subpages 2 (+ Info)
var Service: PageEntities =
{
    "type": "cardEntities",
    "heading": "NSPanel Service",
    "useColor": true,
    "subPage": false,
    "parent": undefined, 
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.NSPanel_AutoUpdate", name: "Auto-Updates" ,icon: "update", offColor: MSRed, onColor: MSGreen},
        <PageItem>{ navigate: true, id: "NSPanel_Infos", icon: "information-outline", onColor: White, name: "NSPanel Infos"},
        <PageItem>{ navigate: true, id: "NSPanel_Firmware_Updates", icon: "update", onColor: White, name: "Manuelle-Updates"},
        <PageItem>{ navigate: true, id: "NSPanel_Einstellungen", icon: "wrench-outline", onColor: White, name: "Einstellungen"}
    ]
};

//Subpage 1 von Subpages_2
var NSPanel_Infos: PageEntities =
{
    "type": "cardEntities",
    "heading": "NSPanel Infos",
    "useColor": true,
    "subPage": true,
    "parent": Service,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.NSPanel_Hardware", name: "Hardware", icon: "memory", offColor: MSYellow, onColor: MSYellow, useColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.NSPanel_ESP_Temp", name: "ESP Temperatur", icon: "thermometer", unit: "°C", offColor: MSYellow, onColor: MSYellow, useColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.NSPanel_UpTime", name: "Uptime", icon: "timeline-clock-outline", offColor: MSYellow, onColor: MSYellow, useColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.NSPanel_RSSI", name: "Wifi-Signal", icon: "signal-distance-variant", unit: "dBm", offColor: MSYellow, onColor: MSYellow, useColor: true}
    ]
};

//Subpage 2 von Subpages_2
var NSPanel_Einstellungen: PageEntities =
{
    "type": "cardEntities",
    "heading": "Screensaver",
    "useColor": true,
    "subPage": true,
    "parent": Service,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Dimmode_BrightnessDay", name: "Brightness Tag", icon: "brightness-5", offColor: MSYellow, onColor: MSYellow, useColor: true, minValue: 5, maxValue: 10},
        <PageItem>{ id: "alias.0.NSPanel_1.Dimmode_BrightnessNight", name: "Brightness Nacht", icon: "brightness-4", offColor: MSYellow, onColor: MSYellow, useColor: true, minValue: 0, maxValue: 4},
        <PageItem>{ id: "alias.0.NSPanel_1.Dimmode_HourDay", name: "Stunde Tag", icon: "sun-clock", offColor: MSYellow, onColor: MSYellow, useColor: true, minValue: 0, maxValue: 23},
        <PageItem>{ id: "alias.0.NSPanel_1.Dimmode_HourNight", name: "Stunde Nacht", icon: "sun-clock-outline", offColor: MSYellow, onColor: MSYellow, useColor: true, minValue: 0, maxValue: 23}
    ]
};

//Subpage 3 von Subpages_2
var NSPanel_Firmware_Updates: PageEntities =
{
    "type": "cardEntities",
    "heading": "Firmware-Updates",
    "useColor": true,
    "subPage": true,
    "parent": Service,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.Tasmota_Version", name: "Tasmota Firmware", useColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TFT_Firmware", name: "TFT-Firmware", useColor: true},
    ]
};

export const config: Config = {
    panelRecvTopic: "mqtt.0.SmartHome.NSPanel_1.tele.RESULT",       //anpassen
    panelSendTopic: "mqtt.0.SmartHome.NSPanel_1.cmnd.CustomSend",   //anpassen
    firstScreensaverEntity: { ScreensaverEntity: "hmip.0.devices.3014F711A000185BE9922BCF.channels.1.humidity", ScreensaverEntityIcon: "water-percent", ScreensaverEntityText: "Luft", ScreensaverEntityUnitText: "%" },
    secondScreensaverEntity: { ScreensaverEntity: "accuweather.0.Daily.Day1.Day.PrecipitationProbability", ScreensaverEntityIcon: "weather-pouring", ScreensaverEntityText: "Regen", ScreensaverEntityUnitText: "%" },
    thirdScreensaverEntity: { ScreensaverEntity: "0_userdata.0.Wetter.Windstaerke_homaticIP", ScreensaverEntityIcon: "weather-windy", ScreensaverEntityText: "Wind", ScreensaverEntityUnitText: "bft" },
    fourthScreensaverEntity: { ScreensaverEntity: "accuweather.0.Current.UVIndex", ScreensaverEntityIcon: "solar-power", ScreensaverEntityText: "UV", ScreensaverEntityUnitText: "" },
    timeoutScreensaver: 15,
    dimmode: 8,
    active: 100, //Standard-Brightness TFT
    screenSaverDoubleClick: false,
    locale: "de-DE",                    //en-US, de-DE, nl-NL, da-DK, es-ES, fr-FR, it-IT, ru-RU, etc.
    timeFormat: "%H:%M",                //currently not used 
    dateFormat: "%A, %d. %B %Y",        //currently not used 
    weatherEntity: "alias.0.Wetter",
    defaultOffColor: Off,
    defaultOnColor: On,
    defaultColor: Off,
    temperatureUnit: "°C",
    pages: [
            Buero_Seite_2,
            Buero_Seite_1,
            Buero_Klimaanlage, 
            Button_1,
            Test_Licht,
            Test_Funktionen,
            Fenster_1,
    	    Subpages_1,
            Alexa,
            Buero_Themostat,
            Buero_Alarm,
            Service
    ],
    subPages: [
                Abfall,
                WLAN,
                NSPanel_Infos,
                NSPanel_Einstellungen,
                NSPanel_Firmware_Updates
    ],
    button1Page: button1Page,
    button2Page: button2Page
};

// _________________________________ Ab hier keine Konfiguration mehr _____________________________________

//Notification an Screensaver
on({id: [screensaverNotifyHeading, screensaverNotifyText], change: "ne"}, async function (obj) {
    setState(config.panelSendTopic,(['notify~',getState(screensaverNotifyHeading).val,'~',getState(screensaverNotifyText).val].join('')));
});

//popupNotify - Notification an separate Seite
on({id: [popupNotifyInternalName, popupNotifyHeading, popupNotifyText, popupNotifyButton1Text, popupNotifyButton2Text, popupNotifySleepTimeout], change: "ne"}, async function (obj) {
    var notification = "entityUpdateDetail"                    + "~"
                       + getState(popupNotifyInternalName).val + "~"
                       + getState(popupNotifyHeading).val      + "~" 
                       + "65504"                                + "~" //Farbe Headline - gelb
                       + getState(popupNotifyButton1Text).val  + "~"
                       + "63488"                               + "~"  //Farbe Button1 - rot
                       + getState(popupNotifyButton2Text).val  + "~"
                       + "2016"                               +  "~"   //Farbe Button2 - grün
                       + getState(popupNotifyText).val         + "~"
                       + "65535"                               + "~"  //Farbe Text - weiß
                       + getState(popupNotifySleepTimeout).val;
    clearTimeout(timer);
    var timer = setTimeout(function() {
        setState(config.panelSendTopic, "pageType~popupNotify");
        setState(config.panelSendTopic, notification);
    }, 500);                   
});

var subscriptions: any = {};
var screensaverEnabled : boolean = false;
var pageId = 0;

//Neu für Subpages
var activePage = undefined;

schedule("* * * * *", function () {
    SendTime();
});
schedule("0 * * * *", function () {
    SendDate();
});

//3:30 Uhr Startup durchführen und aktuelle TFT-Version empfangen
schedule({hour: 3, minute: 30}, function () {
    setState(config.panelSendTopic, 'pageType~pageStartup');
});

//´timeDimMode Day
schedule({hour: getState(NSPanel_Path+ "NSPanel_Dimmode_hourDay").val, minute: 0}, function () {
    ScreensaverDimmode();
});

//´timeDimMode Night
schedule({hour: getState(NSPanel_Path+ "NSPanel_Dimmode_hourNight").val, minute: 0}, function () {
    ScreensaverDimmode();
});

//Updates vergleichen aktuell alle 30 Minuten 
schedule("*/30 * * * *", function () {
    get_tasmota_status0();
    get_panel_update_data();
    check_updates();
});

//Mit Start auf Updates checken
get_locales();
setState(config.panelSendTopic, 'pageType~pageStartup');
get_tasmota_status0();
get_panel_update_data();
check_updates();

//------------------Begin Update Functions

function get_locales() { 
    exec('curl https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/ioBroker/ioBroker_NSPanel_locales.json', function (error, result, stderr){
        if (result) {
            createState(NSPanel_Path + "NSPanel_locales_json");
            var timer = setTimeout(function() {
                setIfExists(NSPanel_Path + 'NSPanel_locales_json', result);
            }, 2000); 
        }
    });
}

function check_updates() {
    
    const desired_display_firmware_version = 38;
    const berry_driver_version = 4;

    if (Debug) console.log("Check-Updates");
    //Tasmota-Firmware-Vergleich
    if (existsObject(NSPanel_Path + "Tasmota_Firmware.currentVersion") && existsObject(NSPanel_Path + "Tasmota_Firmware.onlineVersion")) {
        if (getState(NSPanel_Path + "Tasmota_Firmware.currentVersion").val !== getState(NSPanel_Path + "Tasmota_Firmware.onlineVersion").val) {
            if (existsState(NSPanel_Path + "NSPanel_autoUpdate")) {
                if (getState(NSPanel_Path + "NSPanel_autoUpdate").val) {
                    if (Debug) console.log("Auto-Updates eingeschaltet - Update wird durchgeführt");
                    //Tasmota Upgrade durchführen
                    update_tasmota_firmware()
                    //Aktuelle Tasmota Version = Online Tasmota Version
                    setState(NSPanel_Path + "Tasmota_Firmware.currentVersion", getState(NSPanel_Path + "Tasmota_Firmware.onlineVersion").val);
                } else {
                    //Auf Tasmota-Updates hinweisen
                    if (Debug) console.log("Automatische Updates aus");
                    let Path = NSPanel_Path + 'popupNotify.';
                    let InternalName = 'TasmotaFirmwareUpdate';
                    let Headline = 'Tasmota-Firmware Update';
                    let Text = ['Es ist eine neue Version der Tasmota-Firmware','\r\n','verfügbar','\r\n','\r\n','Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.currentVersion')).val),'\r\n','Verfügbare Version: ' + String(getState((String(NSPanel_Path) + 'Tasmota_Firmware.onlineVersion')).val),'\r\n','\r\n','Upgrade durchführen?'].join('');
                    let Button1 = 'Nein';
                    let Button2 = 'Ja';
                    let Timeout = 0;
                    setStateDelayed((String(Path) + 'popupNotifyHeading'), Headline, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyText'), ([formatDate(getDateObject((new Date().getTime())), "TT.MM.JJJJ SS:mm:ss"),'\r\n','\r\n',Text].join('')), false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton1Text'), Button1, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton2Text'), Button2, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifySleepTimeout'), Timeout, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyInternalName'), InternalName, false, parseInt(((0) || "").toString(), 60000), false);                      
                }              
            }
        } else {
            if (Debug) console.log("Tasmota-Version auf NSPanel aktuell");
        }
    }
    //Tasmota-Berry-Driver-Vergleich
    if (existsObject(NSPanel_Path + "Berry_Driver.currentVersion")) {
        if (getState(NSPanel_Path + "Berry_Driver.currentVersion").val < berry_driver_version) {
            if (existsState(NSPanel_Path + "NSPanel_autoUpdate")) {
                if (getState(NSPanel_Path + "NSPanel_autoUpdate").val) {
                    //Tasmota Berry-Driver Update durchführen
                    update_berry_driver_version()
                    //Aktuelle Berry-Driver Version = Online Berry-Driver Version
                    setState(NSPanel_Path + "Berry_Driver.currentVersion", getState(NSPanel_Path + "Berry_Driver.onlineVersion").val);
                    if (Debug) console.log("Berry-Driver automatisch aktualisiert");
                } else {
                    //Auf BerryDriver-Update hinweisen
                    if (Debug) console.log("Automatische Updates aus");
                    let Path = NSPanel_Path + 'popupNotify.';
                    let InternalName = 'BerryDriverUpdate';
                    let Headline = 'Berry-Driver Update';
                    let Text = ['Es ist eine neue Version des Berry-Drivers','\r\n','(Tasmota) verfügbar','\r\n','\r\n','Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Berry_Driver.currentVersion')).val),'\r\n','Verfügbare Version: ' + String(berry_driver_version),'\r\n','\r\n','Upgrade durchführen?'].join('');
                    let Button1 = 'Nein';
                    let Button2 = 'Ja';
                    let Timeout = 0;
                    setStateDelayed((String(Path) + 'popupNotifyHeading'), Headline, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyText'), ([formatDate(getDateObject((new Date().getTime())), "TT.MM.JJJJ SS:mm:ss"),'\r\n','\r\n',Text].join('')), false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton1Text'), Button1, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton2Text'), Button2, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifySleepTimeout'), Timeout, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyInternalName'), InternalName, false, parseInt(((0) || "").toString(), 60000), false);
                }
            }            
        } else {
            if (Debug) console.log("Berry-Driver auf NSPanel aktuell");
        }
    }
    //TFT-Firmware-Vergleich
    if (existsObject(NSPanel_Path + "Display_Firmware.currentVersion")) {
        if (parseInt(getState(NSPanel_Path + "Display_Firmware.currentVersion").val) !== desired_display_firmware_version) {
            if (existsState(NSPanel_Path + "NSPanel_autoUpdate")) {
                if (getState(NSPanel_Path + "NSPanel_autoUpdate").val) {
                    //TFT-Firmware Update durchführen
                    update_tft_firmware()
                    //Aktuelle TFT-Firmware Version = Online TFT-Firmware Version
                    setState(NSPanel_Path + "Display_Firmware.currentVersion", getState(NSPanel_Path + "Display_Firmware.onlineVersion").val);
                
                    if (Debug) console.log("Display_Firmware automatisch aktualisiert");
                } else {
                    //Auf TFT-Firmware hinweisen
                    if (Debug) console.log("Automatische Updates aus");
                    let Path = NSPanel_Path + 'popupNotify.';
                    let InternalName = 'TFTFirmwareUpdate';
                    let Headline = 'TFT-Firmware Update';
                    let Text = ['Es ist eine neue Version der TFT-Firmware','\r\n','verfügbar','\r\n','\r\n','Installierte Version: ' + String(getState((String(NSPanel_Path) + 'Display_Firmware.currentVersion')).val),'\r\n','Verfügbare Version: ' + String(desired_display_firmware_version),'\r\n','\r\n','Upgrade durchführen?'].join('');
                    let Button1 = 'Nein';
                    let Button2 = 'Ja';
                    let Timeout = 0;
                    setStateDelayed((String(Path) + 'popupNotifyHeading'), Headline, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyText'), ([formatDate(getDateObject((new Date().getTime())), "TT.MM.JJJJ SS:mm:ss"),'\r\n','\r\n',Text].join('')), false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton1Text'), Button1, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyButton2Text'), Button2, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifySleepTimeout'), Timeout, false, parseInt(((0) || "").toString(), 60000), false);
                    setStateDelayed((String(Path) + 'popupNotifyInternalName'), InternalName, false, parseInt(((0) || "").toString(), 60000), false);
                }
            }
        } else {
            if (Debug) console.log("Display_Firmware auf NSPanel aktuell");
        }
    }
}

on({id: [].concat([NSPanel_Path + 'popupNotify.popupNotifyAction']), change: "any"}, async function (obj) {
    if ((obj.state ? obj.state.val : "") == false) {
        manually_Update = false
        if (Debug) console.log('Es wurde Button1 gedrückt');
    } else if ((obj.state ? obj.state.val : "") == true) {
        if (manually_Update) {
            if (getState(NSPanel_Path + "popupNotify.popupNotifyInternalName").val = "TasmotaFirmwareUpdate") {
                update_tasmota_firmware();
            } else if (getState(NSPanel_Path + "popupNotify.popupNotifyInternalName").val = "BerryDriverUpdate") {
                update_berry_driver_version();
            } else if (getState(NSPanel_Path + "popupNotify.popupNotifyInternalName").val = "TFTFirmwareUpdate") {
                update_tft_firmware();
            }
        }
        if (Debug) console.log('Es wurde Button2 gedrückt');
    }
});

function get_panel_update_data() {
    createState(NSPanel_Path + "NSPanel_autoUpdate", false, {read: true, write: true, name: "Auto-Updater", type: "boolean", def: false});
    createState(NSPanel_Path + "NSPanel_ipAddress");
    setIfExists(NSPanel_Path + "NSPanel_ipAddress", get_current_tasmota_ip_address());
    get_online_tasmota_firmware_version();
    get_current_berry_driver_version();
    get_online_berry_driver_version();
    check_version_tft_firmware();
    check_online_display_firmware();
}
 
function get_current_tasmota_ip_address() {
    let mqttInfo2 =  config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 6) + "INFO2";
    let Tasmota_Info2 = JSON.parse(getState(mqttInfo2).val);
    return Tasmota_Info2.Info2.IPAddress;
}

function get_online_tasmota_firmware_version() {
    exec('curl -X GET -k \'https://api.github.com/repositories/80286288/releases/latest\'', function (error, result, stderr){	//GitAPI aufruf für JSON Inhalt von Latest Tasmota Release
        var Tasmota_JSON = JSON.parse(result) 				//JSON Resultat in Variable Schreiben
        var TasmotaTagName = Tasmota_JSON.tag_name 			//JSON nach "tag_name" filtern und in Variable schreiben
        var TasmotaVersionOnline = TasmotaTagName.replace(/v/i, ""); 		//Aus Variable überflüssiges "v" filtern und in Release-Variable schreiben    
        createState(NSPanel_Path + "Tasmota_Firmware.onlineVersion");
        setIfExists(NSPanel_Path + "Tasmota_Firmware.onlineVersion", TasmotaVersionOnline);
    });
}

function get_current_berry_driver_version() {
    require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=GetDriverVersion'].join('')), async function (error, response, result) {
        createState(NSPanel_Path + "Berry_Driver.currentVersion");
        setIfExists(NSPanel_Path + 'Berry_Driver.currentVersion', getAttr(result, 'nlui_driver_version'));
    });
}

function get_tasmota_status0() {
    require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=Status0'].join('')), async function (error, response, result) {
        createState(NSPanel_Path + "Tasmota_Firmware.currentVersion");
        createState(NSPanel_Path + "Tasmota.Uptime");
        createState(NSPanel_Path + "Tasmota.Version");
        createState(NSPanel_Path + "Tasmota.Hardware");
        createState(NSPanel_Path + "Tasmota.Wifi.AP");
        createState(NSPanel_Path + "Tasmota.Wifi.SSId");
        createState(NSPanel_Path + "Tasmota.Wifi.BSSId");
        createState(NSPanel_Path + "Tasmota.Wifi.Channel");
        createState(NSPanel_Path + "Tasmota.Wifi.Mode");
        createState(NSPanel_Path + "Tasmota.Wifi.RSSI");
        createState(NSPanel_Path + "Tasmota.Wifi.Signal");

        var Tasmota_JSON = JSON.parse(result)
        let tasmoVersion = Tasmota_JSON.StatusFWR.Version.split("(");
        setIfExists(NSPanel_Path + "Tasmota_Firmware.currentVersion", tasmoVersion[0]);
        setIfExists(NSPanel_Path + "Tasmota.Uptime", Tasmota_JSON.StatusPRM.Uptime);
        setIfExists(NSPanel_Path + "Tasmota.Version", Tasmota_JSON.StatusFWR.Version);
        setIfExists(NSPanel_Path + "Tasmota.Hardware", Tasmota_JSON.StatusFWR.Hardware);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.AP", Tasmota_JSON.StatusSTS.Wifi.AP);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.SSId", Tasmota_JSON.StatusSTS.Wifi.SSId);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.BSSId", Tasmota_JSON.StatusSTS.Wifi.BSSId);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.Channel", Tasmota_JSON.StatusSTS.Wifi.Channel);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.Mode", Tasmota_JSON.StatusSTS.Wifi.Mode);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.RSSI", Tasmota_JSON.StatusSTS.Wifi.RSSI);
        setIfExists(NSPanel_Path + "Tasmota.Wifi.Signal", Tasmota_JSON.StatusSTS.Wifi.Signal);  
    });
}

function get_online_berry_driver_version() { 
    exec('curl https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be', function (error, result, stderr){
        if (result) {
            let BerryDriverVersionOnline = result.substring((result.indexOf("version_of_this_script = ") + 24), result.indexOf("version_of_this_script = ") + 27).replace(/\s+/g, '');
            createState(NSPanel_Path + "Berry_Driver.onlineVersion");
            setIfExists(NSPanel_Path + 'Berry_Driver.onlineVersion', BerryDriverVersionOnline);
        }
    });
}

function check_version_tft_firmware() {
    exec('curl -X GET -k \'https://api.github.com/repos/joBr99/nspanel-lovelace-ui/releases/latest\'', function (error, result, stderr){	//GitAPI aufruf für JSON Inhalt von Latest Tasmota Release
        var NSPanel_JSON = JSON.parse(result) 				//JSON Resultat in Variable Schreiben
        var NSPanelTagName = NSPanel_JSON.tag_name 			//created_at; published_at; name ; draft ; prerelease
        var NSPanelVersion = NSPanelTagName.replace(/v/i, ""); 		//Aus Variable überflüssiges "v" filtern und in Release-Variable schreiben
        createState(NSPanel_Path + "TFT_Firmware.onlineVersion");
        setIfExists(NSPanel_Path + 'TFT_Firmware.onlineVersion', NSPanelVersion);
    });
}

function check_online_display_firmware() {
    exec('curl https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/apps/nspanel-lovelace-ui/nspanel-lovelace-ui.py', function (error, result, stderr){
        if (result) {
            let desired_display_firmware_version = result.substring((result.indexOf("desired_display_firmware_version =") + 34), result.indexOf("desired_display_firmware_version =") + 38).replace(/\s+/g, '');
            createState(NSPanel_Path + "Display_Firmware.onlineVersion");
            setIfExists(NSPanel_Path + 'Display_Firmware.onlineVersion', desired_display_firmware_version);
        }
    });
}

on({ id: config.panelRecvTopic }, function (obj) {
    if (obj.state.val.startsWith('\{"CustomRecv":')) {      
        var json = JSON.parse(obj.state.val);
        var split = json.CustomRecv.split(",");
        if (split[0] == "event" && split[1] == "startup") {
            createState(NSPanel_Path + 'Display_Firmware.currentVersion',{ type:'string'});
            createState(NSPanel_Path + 'NSPanel_Version',{ type:'string'});
            setIfExists(NSPanel_Path + 'Display_Firmware.currentVersion',split[2]);
            setIfExists(NSPanel_Path + 'NSPanel_Version',split[3]);
        }
    }
});

function update_berry_driver_version() {
    require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=Backlog UpdateDriverVersion https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be; Restart 1'].join('')), async function (error, response, result) {
    });
}

function update_tft_firmware() {
    const tft_version : string = "v3.1.0";
    var desired_display_firmware_url = "http://nspanel.pky.eu/lovelace-ui/github/nspanel-" + tft_version + ".tft"
    require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=FlashNextion ', desired_display_firmware_url].join('')), async function (error, response, result) {
        createState(NSPanel_Path + "TFT_Firmware.onlineVersion");
        setIfExists(NSPanel_Path + 'TFT_Firmware.onlineVersion', tft_version);
    });
}

function update_tasmota_firmware() {
    require("request")((['http://',get_current_tasmota_ip_address(),'/cm?cmnd=Upgrade 1'].join('')), async function (error, response, result) {
    });
}
//------------------End Update Functions

// Only monitor the extra nodes if present
var updateArray: string[] = [];

if (config.firstScreensaverEntity !== null && config.firstScreensaverEntity.ScreensaverEntity != null && existsState(config.firstScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.firstScreensaverEntity.ScreensaverEntity)
}
if (config.secondScreensaverEntity !== null && config.secondScreensaverEntity.ScreensaverEntity != null && existsState(config.secondScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.secondScreensaverEntity.ScreensaverEntity)
}
if (config.thirdScreensaverEntity !== null && config.thirdScreensaverEntity.ScreensaverEntity != null && existsState(config.thirdScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.thirdScreensaverEntity.ScreensaverEntity)
}
if (config.fourthScreensaverEntity !== null && config.fourthScreensaverEntity.ScreensaverEntity != null && existsState(config.fourthScreensaverEntity.ScreensaverEntity)) {
    updateArray.push(config.fourthScreensaverEntity.ScreensaverEntity)
}
if (updateArray.length > 0) {
    on(updateArray, function () {
        HandleScreensaverUpdate();
    })
}

on({ id: config.panelRecvTopic }, function (obj) {
    if (obj.state.val.startsWith('\{"CustomRecv":')) {
        var json = JSON.parse(obj.state.val);

        var split = json.CustomRecv.split(",");
        HandleMessage(split[0], split[1], parseInt(split[2]), split);
    }
});

function SendToPanel(val: Payload | Payload[]): void {
    if (Array.isArray(val)) {
        val.forEach(function (id, i) {
            setState(config.panelSendTopic, id.payload);
            if (Debug) console.log(id.payload);
        });
    }
    else
        setState(config.panelSendTopic, val.payload);
}


on({id: [].concat([NSPanel_Path + 'Alarm.AlarmState']), change: "ne"}, async function (obj) {
  if ((obj.state ? obj.state.val : "") == 'armed' || (obj.state ? obj.state.val : "") == 'disarmed' || (obj.state ? obj.state.val : "") == 'triggered') {
     GeneratePage(config.pages[8]);   //----------- muss noch dynamisch gefunden werden ------------------------------------------- 
  }
});

function HandleMessage(typ: string, method: string, page: number, words: Array<string>): void {
    if (typ == "event") {
        switch (method) {
            case "startup":
                screensaverEnabled = false;
                UnsubscribeWatcher();
                HandleStartupProcess();
                pageId = 0;
                GeneratePage(config.pages[0]);
                break;
            case "sleepReached":
                screensaverEnabled = true;
                if (pageId < 0)
                    pageId = 0;
                HandleScreensaver();
                break;
            case "pageOpenDetail":
                screensaverEnabled = false;
                UnsubscribeWatcher();
                let pageItem = findPageItem(words[3]);  
                if (pageItem !== undefined)
                    SendToPanel(GenerateDetailPage(words[2], pageItem));                                         
            case "buttonPress2":
                screensaverEnabled = false;
                HandleButtonEvent(words);
                if (Debug) console.log(words[0] + " - " + words[1] + " - " + words[2] + " - " + words[3] + " - " + words[4]);
                break;
            case "button1":
            case "button2":
                screensaverEnabled = false;
                HandleHardwareButton(method);
            default:
                break;
        }
    }
}

function findPageItem(searching: String) : PageItem {
    let pageItem = activePage.items.find(e => e.id === searching);
    
    if (pageItem !== undefined) {
        return pageItem;
    }
    config.subPages.every (sp => {
        pageItem =  sp.items.find(e => e.id === searching);
        if (pageItem !== undefined) {           
            return false;
        }
        return true;
    });   
    
    return pageItem;
}

function GeneratePage(page: Page): void {
    activePage = page;
    switch (page.type) {
        case "cardEntities":
            SendToPanel(GenerateEntitiesPage(<PageEntities>page));
            break;
        case "cardThermo":
            SendToPanel(GenerateThermoPage(<PageThermo>page));
            break;
        case "cardGrid":
            SendToPanel(GenerateGridPage(<PageGrid>page));
            break;
        case "cardMedia":
            SendToPanel(GenerateMediaPage(<PageMedia>page));
            break;
        case "cardAlarm":
            SendToPanel(GenerateAlarmPage(<PageAlarm>page));
            break;
        case "cardQR":
            SendToPanel(GenerateQRPage(<PageQR>page));
            break;
    }
}

function HandleHardwareButton(method: string): void {
    let page: (PageThermo | PageMedia | PageAlarm | PageEntities | PageGrid | PageQR);
    if (config.button1Page !== null && method == "button1") {
        page = config.button1Page;
        pageId = -1;
    }
    else if (config.button2Page !== null && method == "button2") {
        page = config.button2Page;
        pageId = -2;
    }
    else {
        return;
    }
    GeneratePage(page);
}

function HandleStartupProcess(): void {
    SendDate();
    SendTime();
    SendToPanel({ payload: "timeout~" + config.timeoutScreensaver });
    SendToPanel({ payload: "dimmode~" + config.dimmode + "~" + config.active});
}

function SendDate(): void {

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    const date = new Date(year,month,day,1,1,1);
    const options : any  = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var _SendDate = date.toLocaleDateString(config.locale, options); 

    SendToPanel(<Payload>{ payload: "date~" + _SendDate });

}

function SendTime(): void {

    var d = new Date();
    var hr = d.getHours().toString();
    var min = d.getMinutes().toString();

    if (d.getHours() < 10) {
        hr = "0" + d.getHours().toString();
    }
    if (d.getMinutes() < 10) {
        min = "0" + d.getMinutes().toString();
    }
    SendToPanel(<Payload>{ payload: "time~" + hr + ":" + min });
}

function ScreensaverDimmode() {
    if (timeDimMode.dimmodeOn != undefined ? timeDimMode.dimmodeOn : false) {
        if (compareTime(timeDimMode.timeNight != undefined ? timeDimMode.timeNight : "23:00", timeDimMode.timeDay != undefined ? timeDimMode.timeDay : "06:00", "not between", null)) {
            SendToPanel({ payload: "dimmode~" + timeDimMode.brightnessDay + "~" + config.active });
        } else {
            SendToPanel({ payload: "dimmode~" + timeDimMode.brightnessNight + "~" + config.active }); 
        }         
    } else {
        SendToPanel({ payload: "dimmode~" + config.dimmode + "~" + config.active });
    }
}

function GenerateEntitiesPage(page: PageEntities): Payload[] {
    var out_msgs: Array<Payload> = [];
    out_msgs = [{ payload: "pageType~cardEntities" }]
    out_msgs.push({ payload: GeneratePageElements(page) });
    return out_msgs
}

function GenerateGridPage(page: PageGrid): Payload[] {
    var out_msgs: Array<Payload> = [];
    out_msgs = [{ payload: "pageType~cardGrid" }]
    out_msgs.push({ payload: GeneratePageElements(page) });
    return out_msgs
}

function GeneratePageElements(page: Page): string {
    activePage = page;
    let maxItems = 0;
    switch (page.type) {
        case "cardThermo":
            maxItems = 1;
            break;
        case "cardAlarm":
            maxItems = 1;
            break;
        case "cardMedia":
            maxItems = 1;
            break;
        case "cardQR":
            maxItems = 1;
            break;
        case "cardEntities":
            maxItems = 4;
            break;
        case "cardGrid":
            maxItems = 6;
            break;
    }

    let pageData = "entityUpd~" + page.heading + "~" + GetNavigationString(pageId);

    for (let index = 0; index < maxItems; index++) {
        if (page.items[index] !== undefined) {
            pageData += CreateEntity(page.items[index], index + 1, page.useColor);
        }
    }
    return pageData;
}

function CreateEntity(pageItem: PageItem, placeId: number, useColors: boolean = false): string {
    var iconId = "0"
    if (pageItem.id == "delete") {
        return "~delete~~~~~"
    }
    var name: string;
    var type: string;

    // ioBroker
    if (existsObject(pageItem.id) || pageItem.navigate === true) {
        var iconColor = rgb_dec565(config.defaultColor);

        if (pageItem.navigate) {
            type = "button";
            iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("gesture-tap-button");
            iconColor = GetIconColor(pageItem, true, useColors);
            let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : "PRESS";        
            return "~" + type + "~" + "navigate." + pageItem.id + "~" + iconId + "~" + iconColor + "~" + pageItem.name + "~" + buttonText;
        }

        let o = getObject(pageItem.id)
        var val = null;

        if (existsState(pageItem.id + ".GET")) {
            val = getState(pageItem.id + ".GET").val;
            RegisterEntityWatcher(pageItem.id + ".GET");
        }
        else if (existsState(pageItem.id + ".SET")) {
            val = getState(pageItem.id + ".SET").val;
            RegisterEntityWatcher(pageItem.id + ".SET");
        }

        name = pageItem.name !== undefined ? pageItem.name : o.common.name.de

        switch (o.common.role) {
            case "socket":
            
            case "light":
                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "socket"  ? Icons.GetIcon("power-socket-de") : Icons.GetIcon("lightbulb");
                var iconId2 = pageItem.icon2 !== undefined ? Icons.GetIcon(pageItem.icon2) : o.common.role == "socket"  ? Icons.GetIcon("power-socket-de") : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, true, useColors);
                } else {
                    iconColor = GetIconColor(pageItem, false, useColors);
                    if (pageItem.icon !== undefined) {
                        if (pageItem.icon2 !== undefined) {
                            iconId = iconId2;
                        } 
                    }
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;
                
            case "hue":

                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    val = getState(pageItem.id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL");
                }

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".DIMMER") ? 100 - getState(pageItem.id + ".DIMMER").val : true, useColors);
                }

                if (existsState(pageItem.id + ".HUE")) {
                    if (getState(pageItem.id + ".HUE").val != null) {
                        let huecolor = hsv2rgb(getState(pageItem.id + ".HUE").val,1,1);
                        let rgb = <RGB>{ red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2])}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        //RegisterDetailEntityWatcher(id + ".HUE");
                    } 
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;

            case "ct":

                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (existsState(pageItem.id + ".ON")) {
                    val = getState(pageItem.id + ".ON").val;
                    RegisterEntityWatcher(pageItem.id + ".ON");
                }

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".DIMMER") ? 100 - getState(pageItem.id + ".DIMMER").val : true, useColors);
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;

            case "rgb":

                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    val = getState(pageItem.id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL");
                }

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".DIMMER") ? 100 - getState(pageItem.id + ".DIMMER").val : true, useColors);
                }

                if (existsState(pageItem.id + ".RED") && existsState(pageItem.id + ".GREEN") && existsState(pageItem.id + ".BLUE")) {
                    if (getState(pageItem.id + ".RED").val != null && getState(pageItem.id + ".GREEN").val != null && getState(pageItem.id + ".BLUE").val != null) {
                        let rgbRed = getState(pageItem.id + ".RED").val;
                        let rgbGreen = getState(pageItem.id + ".GREEN").val;
                        let rgbBlue = getState(pageItem.id + ".BLUE").val;
                        let rgb = <RGB>{ red: Math.round(rgbRed), green: Math.round(rgbGreen), blue: Math.round(rgbBlue)}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                    } 
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;

            case "rgbSingle":

                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    val = getState(pageItem.id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL");
                }

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".DIMMER") ? 100 - getState(pageItem.id + ".DIMMER").val : true, useColors);
                }

                if (existsState(pageItem.id + ".RGB")) {
                    if (getState(pageItem.id + ".RGB").val != null) {
                        var hex = getState(pageItem.id + ".RGB").val;
                        var hexRed = parseInt(hex[1]+hex[2],16);
                        var hexGreen = parseInt(hex[3]+hex[4],16);
                        var hexBlue = parseInt(hex[5]+hex[6],16);
                        let rgb = <RGB>{ red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue)}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                    } 
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;
                
            case "dimmer":
                type = "light"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lightbulb");
                var optVal = "0"
                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    val = getState(pageItem.id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL");
                }
                else if (existsState(pageItem.id + ".ON_SET")) {
                    val = getState(pageItem.id + ".ON_SET").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_SET");
                }
                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".ACTUAL") ? 100 - getState(pageItem.id + ".ACTUAL").val : true, useColors);
                }  

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal;
                
            case "blind":
                type = "shutter"
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("window-open");
                iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".ACTUAL") ? getState(pageItem.id + ".ACTUAL").val : true, useColors);
                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~"

            case "door":

            case "window":
                type = "text";
                if (existsState(pageItem.id + ".ACTUAL")) {
                    if (getState(pageItem.id + ".ACTUAL").val) {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "door"  ? Icons.GetIcon("door-open") : Icons.GetIcon("window-open-variant");
                        iconColor = GetIconColor(pageItem, false, useColors);
                        var windowState = findLocale("window","opened");
                    } else {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "door"  ? Icons.GetIcon("door-closed") : Icons.GetIcon("window-closed-variant");
                        //iconId = Icons.GetIcon("window-closed-variant");
                        iconColor = GetIconColor(pageItem, true, useColors);
                        var windowState = findLocale("window","closed");
                    }
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }
                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + windowState;

            case "info":

            case "humidity":

            case "temperature":

            case "value.temperature":

            case "value.humidity":

            case "sensor.door": 

            case "sensor.window":
                
            case "thermostat":
                type = "text";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "value.temperature" || o.common.role == "thermostat" ? Icons.GetIcon("thermometer") : Icons.GetIcon("information-outline");
                let unit = "";
                var optVal = "0"
                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    optVal = getState(pageItem.id + ".ON_ACTUAL").val;
                    unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + ".ON_ACTUAL");
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL");
                }
                else if (existsState(pageItem.id + ".ACTUAL")) {
                    optVal = getState(pageItem.id + ".ACTUAL").val;
                    unit = pageItem.unit !== undefined ? pageItem.unit : GetUnitOfMeasurement(pageItem.id + ".ACTUAL");
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }

                if (o.common.role == "value.temperature") {
                    iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("thermometer");
                }

                iconColor = GetIconColor(pageItem, parseInt(optVal), useColors);

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + optVal + " " + unit;

            case "buttonSensor":           
            case "button":
                type = "button";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("gesture-tap-button");
                iconColor = GetIconColor(pageItem, true, useColors);
                let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : "PRESS";
                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + buttonText;
            
            case "lock":
                type = "button";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lock");
                iconColor = GetIconColor(pageItem, true, useColors);
                
                if (existsState(pageItem.id + ".ACTUAL")) {
                    if (getState(pageItem.id + ".ACTUAL").val) {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lock");
                        iconColor = GetIconColor(pageItem, true, useColors);
                        var lockState = findLocale("lock","UNLOCK")
                    } else {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("lock-open-variant");
                        iconColor = GetIconColor(pageItem, false, useColors);
                        var lockState = findLocale("lock","LOCK")
                    }
                    lockState = pageItem.buttonText !== undefined ? pageItem.buttonText : lockState;
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + lockState;
                
            case "slider":    
                type = "number";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("plus-minus-variant");
                if (existsState(pageItem.id + ".SET")) {
                    val = getState(pageItem.id + ".SET").val;
                    RegisterEntityWatcher(pageItem.id + ".SET");
                }
                if (existsState(pageItem.id + ".ACTUAL")) {
                    val = getState(pageItem.id + ".ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }

                iconColor = GetIconColor(pageItem, false, useColors)

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + val + "|" + pageItem.minValue + "|" + pageItem.maxValue;

            case "volumeGroup":
            case "volume":
                type = "number";
                if (existsState(pageItem.id + ".SET")) {
                    val = getState(pageItem.id + ".SET").val;
                    RegisterEntityWatcher(pageItem.id + ".SET");
                }
                if (existsState(pageItem.id + ".ACTUAL")) {
                    val = getState(pageItem.id + ".ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }

                iconColor = GetIconColor(pageItem, false, useColors)
                if (existsState(pageItem.id + ".MUTE")) {
                    getState(pageItem.id + ".MUTE").val ? iconColor = GetIconColor(pageItem, false, useColors) : iconColor = GetIconColor(pageItem, true, useColors);                
                    RegisterEntityWatcher(pageItem.id + ".MUTE");
                }
                
                if (val > 0 && val <= 33 && !getState(pageItem.id + ".MUTE").val) {
                    iconId = Icons.GetIcon("volume-low");
                } else if (val > 33 && val <= 66 && !getState(pageItem.id + ".MUTE").val) {
                    iconId = Icons.GetIcon("volume-medium");
                } else if (val > 66 && val <= 100 && !getState(pageItem.id + ".MUTE").val) {
                    iconId = Icons.GetIcon("volume-high");
                } else {
                    iconId = Icons.GetIcon("volume-mute");
                }

                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + val + "|" + pageItem.minValue + "|" + pageItem.maxValue;

            case "warning":
                type = "text";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("alert-outline");
                iconColor = getState(([pageItem.id,'.LEVEL'].join(''))).val;
                let itemName = getState(([pageItem.id,'.TITLE'].join(''))).val;
                let itemInfo = getState(([pageItem.id,'.INFO'].join(''))).val;
                return "~" + type + "~" + itemName + "~" + iconId + "~" + iconColor + "~" + itemName + "~" + itemInfo;

            default:
                return "~delete~~~~~";
        }
    }
    return "~delete~~~~~"
}

function findLocale(controlsObject: string, controlsState: string) : string {
    var locale = config.locale;
    var strJson = getState(NSPanel_Path + 'NSPanel_locales_json').val;
    var obj = JSON.parse(strJson);

    try {
        var strLocale = obj[controlsObject][controlsState][locale];

        if (strLocale != undefined) {
            return strLocale;
        } else {
            return controlsState;
        }
    } catch (e) {
        console.log(e);            
        return controlsState 
    }
}


function GetIconColor(pageItem: PageItem, value: (boolean | number), useColors: boolean): number {
    // dimmer
    if ((pageItem.useColor || useColors) && pageItem.interpolateColor && typeof (value) === "number") {
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
            ));
    }

    if ((pageItem.useColor || useColors) && ((typeof (value) === "boolean" && value) || value > (pageItem.minValueBrightness !== undefined ? pageItem.minValueBrightness : 0))) {
        return rgb_dec565(pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor)
    }
    
    return rgb_dec565(pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor);
}

function RegisterEntityWatcher(id: string): void {

    if (subscriptions.hasOwnProperty(id)) {
        return;
    }

    subscriptions[id] = (on({ id: id, change: 'any' }, function (data) {        
        if(pageId == -1 && config.button1Page != undefined)
            SendToPanel({ payload: GeneratePageElements(config.button1Page) });
        if(pageId == -2 && config.button2Page != undefined)
            SendToPanel({ payload: GeneratePageElements(config.button2Page) });
        if(activePage!=undefined)
            SendToPanel({ payload: GeneratePageElements(activePage) });
    }))
}

function RegisterDetailEntityWatcher(id: string, pageItem: PageItem, type: string): void {
    if (subscriptions.hasOwnProperty(id)) {
        return;
    }
    subscriptions[id] = (on({ id: id, change: 'any' }, function () {
        SendToPanel(GenerateDetailPage(type, pageItem));
    }))
}

function GetUnitOfMeasurement(id: string): string {
    if (!existsObject(id))
        return "";

    let obj = getObject(id);
    if (typeof obj.common.unit !== 'undefined') {
        return obj.common.unit
    }

    if (typeof obj.common.alias !== 'undefined' && typeof obj.common.alias.id !== 'undefined') {
        return GetUnitOfMeasurement(obj.common.alias.id);
    }
    return "";
}

function GenerateThermoPage(page: PageThermo): Payload[] {
    var id = page.items[0].id
    var out_msgs: Array<Payload> = [];
    out_msgs.push({ payload: "pageType~cardThermo" });

    // ioBroker
    if (existsObject(id)) {
        let o = getObject(id)
        let name = page.heading !== undefined ? page.heading : o.common.name.de
        let currentTemp = 0;
        if (existsState(id + ".ACTUAL"))
            currentTemp = (Math.round(parseFloat(getState(id + ".ACTUAL").val) * 10)/10);

        let destTemp = 0;
        if (existsState(id + ".SET")) {
            destTemp = getState(id + ".SET").val.toFixed(2) * 10;
        }
        let statusStr : String = "MANU"
        let status = ""
        if (existsState(id + ".MODE"))
            status = getState(id + ".MODE").val;

        let minTemp = page.items[0].minValue !== undefined ? page.items[0].minValue : 50;   //Min Temp 5°C
        let maxTemp = page.items[0].maxValue !== undefined ? page.items[0].maxValue : 300;  //Max Temp 30°C
        let stepTemp = 5
        
        //Attribute hinzufügen, wenn im Alias definiert
        let i_list = Array.prototype.slice.apply($('[state.id="' + id + '.*"]'));
        if ((i_list.length - 3) != 0) {
    
            var i = 0;    
            var bt = ["~~~~","~~~~","~~~~","~~~~","~~~~","~~~~","~~~~","~~~~","~~~~"];    

            if (o.common.role == "thermostat") {
                for (let i_index in i_list) {
                    let thermostatState = i_list[i_index].split('.');
                    if (thermostatState[thermostatState.length-1] != "SET" && 
                        thermostatState[thermostatState.length-1] != "ACTUAL" && 
                        thermostatState[thermostatState.length-1] != "MODE")  {
                        i++;

                        switch (thermostatState[thermostatState.length-1]) {
                            case "HUMIDITY":
                                if (existsState(id + ".HUMIDITY") && getState(id + ".HUMIDITY").val != null) {
                                    if (parseInt(getState(id + ".HUMIDITY").val) < 40) {
                                        bt[i-1] =  Icons.GetIcon("water-percent") + "~65504~1~" + "HUMIDITY" + "~";
                                    } else if (parseInt(getState(id + ".HUMIDITY").val) < 30) {
                                        bt[i-1] =  Icons.GetIcon("water-percent") + "~63488~1~" + "HUMIDITY" + "~";
                                    } else if (parseInt(getState(id + ".HUMIDITY").val) >= 40) {
                                        bt[i-1] =  Icons.GetIcon("water-percent") + "~2016~1~" + "HUMIDITY" + "~";
                                    } else if (parseInt(getState(id + ".HUMIDITY").val) > 65) {
                                        bt[i-1] =  Icons.GetIcon("water-percent") + "~65504~1~" + "HUMIDITY" + "~";
                                    } else if (parseInt(getState(id + ".HUMIDITY").val) > 75) {
                                        bt[i-1] =  Icons.GetIcon("water-percent") + "~63488~1~" + "HUMIDITY" + "~";
                                    }
                                } else i--;
                                break;
                            case "LOWBAT":
                                if (existsState(id + ".LOWBAT") && getState(id + ".LOWBAT").val != null) {
                                    if (getState(id + ".LOWBAT").val) {
                                        bt[i-1] =  Icons.GetIcon("battery-low") + "~63488~1~" + "LOWBAT" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("battery-high") + "~2016~1~" + "LOWBAT" + "~";
                                    }
                                } else i--;
                                break;
                            case "MAINTAIN":
                                if (existsState(id + ".MAINTAIN") && getState(id + ".MAINTAIN").val != null) {
                                    if (getState(id + ".MAINTAIN").val >> .1) {
                                        bt[i-1] =  Icons.GetIcon("fire") + "~60897~1~" + "MAINTAIN" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("fire") + "~33840~0~" + "MAINTAIN" + "~";
                                    }
                                } else i--;
                                break;
                            case "UNREACH":
                                if (existsState(id + ".UNREACH") && getState(id + ".UNREACH").val != null) {
                                    if (getState(id + ".UNREACH").val) {
                                        bt[i-1] =  Icons.GetIcon("wifi-off") + "~63488~1~" + "UNREACH" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("wifi") + "~2016~1~" + "UNREACH" + "~";
                                    }
                                } else i--;
                                break;
                            case "POWER":
                                if (existsState(id + ".POWER") && getState(id + ".POWER").val != null) {
                                    if (getState(id + ".POWER").val) {
                                        bt[i-1] =  Icons.GetIcon("power-standby") + "~2016~1~" + "POWER" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("power-standby") + "~33840~1~" + "POWER" + "~";
                                    }
                                } else i--;
                                break;
                            case "ERROR":
                                if (existsState(id + ".ERROR") && getState(id + ".ERROR").val != null) {
                                    if (getState(id + ".ERROR").val) {
                                        bt[i-1] =  Icons.GetIcon("alert-circle") + "~63488~1~" + "ERROR" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("alert-circle") + "~33840~1~" + "ERROR" + "~";
                                    }
                                } else i--;
                                break;
                            case "WORKING":
                                if (existsState(id + ".WORKING") && getState(id + ".WORKING").val != null) {
                                    if (getState(id + ".WORKING").val) {
                                        bt[i-1] =  Icons.GetIcon("briefcase-check") + "~2016~1~" + "WORKING" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("briefcase-check") + "~33840~1~" + "WORKING" + "~";
                                    }
                                } else i--;
                                break;
                            case "BOOST":
                                if (existsState(id + ".BOOST") && getState(id + ".BOOST").val != null) {
                                    if (getState(id + ".BOOST").val) {
                                        bt[i-1] =  Icons.GetIcon("fast-forward-60") + "~2016~1~" + "BOOST" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("fast-forward-60") + "~33840~1~" + "BOOST" + "~";
                                    }
                                } else i--;                            
                                break;
                            case "PARTY":
                                if (existsState(id + ".PARTY") && getState(id + ".PARTY").val != null) {
                                    if (getState(id + ".PARTY").val) {
                                        bt[i-1] =  Icons.GetIcon("party-popper") + "~2016~1~" + "PARTY" + "~";
                                    } else {
                                        bt[i-1] =  Icons.GetIcon("party-popper") + "~33840~1~" + "PARTY" + "~";
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
                    bt[j] = "~~~~";
                }
            }

            if (o.common.role == "airCondition") {
                if (existsState(id + ".MODE") && getState(id + ".MODE").val != null) {
                    let Mode = getState(id + ".MODE").val
                    if (existsState(id + ".POWER") && getState(id + ".POWER").val != null) {
                        if (Mode != 0 || getState(id + ".POWER").val) {                                 //0=ON oder .POWER = true
                            bt[0] =  Icons.GetIcon("power-standby") + "~2016~1~" + "POWER" + "~";
                            statusStr = "ON";
                        } else {
                            bt[0] =  Icons.GetIcon("power-standby") + "~35921~0~" + "POWER" + "~";
                            statusStr = "OFF";
                        }
                    }
                    if (Mode == 1) {                                                                //1=AUTO
                        bt[1] =  Icons.GetIcon("air-conditioner") + "~1024~1~" + "AUTO" + "~";
                        statusStr = "AUTO";
                    } else {
                        bt[1] =  Icons.GetIcon("air-conditioner") + "~35921~0~" + "AUTO" + "~";
                    }
                    if (Mode == 2) {                                                                //2=COOL
                        bt[2] =  Icons.GetIcon("snowflake") + "~11487~1~" + "COOL" + "~";
                        statusStr = "COOL";
                    } else {
                        bt[2] =  Icons.GetIcon("snowflake") + "~35921~0~" + "COOL" + "~";
                    }
                    if (Mode == 3) {                                                                //3=HEAT
                        bt[3] =  Icons.GetIcon("fire") + "~64512~1~" + "HEAT" + "~";
                        statusStr = "HEAT";
                    } else {
                        bt[3] =  Icons.GetIcon("fire") + "~35921~0~" + "HEAT" + "~";
                    }
                    if (Mode == 4) {                                                                //4=ECO
                        bt[4] =  Icons.GetIcon("alpha-e-circle-outline") + "~2016~1~" + "ECO" + "~";
                        statusStr = "ECO";
                    } else {
                        bt[4] =  Icons.GetIcon("alpha-e-circle-outline") + "~35921~0~" + "ECO" + "~";
                    }
                    if (Mode == 5) {                                                                //5=FANONLY
                        bt[5] =  Icons.GetIcon("fan") + "~11487~1~" + "FAN" + "~";
                        statusStr = "FAN ONLY";
                    } else {
                        bt[5] =  Icons.GetIcon("fan") + "~35921~0~" + "FAN" + "~";
                    }
                    if (Mode == 6) {                                                                //6=DRY
                        bt[6] =  Icons.GetIcon("water-percent") + "~60897~1~" + "DRY" + "~";
                        statusStr = "DRY";
                    } else {
                        bt[6] =  Icons.GetIcon("water-percent") + "~35921~0~" + "DRY" + "~";
                    }
                    if (existsState(id + ".SWING") && getState(id + ".SWING").val != null) {
                        if (getState(id + ".POWER").val && getState(id + ".SWING").val == 1) {          //0=ON oder .SWING = true
                            bt[7] =  Icons.GetIcon("swap-vertical-bold") + "~2016~1~" + "SWING" + "~";
                        } else {
                            bt[7] =  Icons.GetIcon("swap-vertical-bold") + "~35921~0~" + "SWING" + "~";
                        }
                    }    
                }
            }
        }

        let icon_res = bt[0] + bt[1] + bt[2] + bt[3] + bt[4] + bt[5] + bt[6] + bt[7];



        out_msgs.push({ payload: "entityUpd~" 
                                 + name                                 + "~"   //Heading
                                 + GetNavigationString(pageId)          + "~"   //Page Navigation
                                 + id                                   + "~"   //internalNameEntiy
                                 + currentTemp + config.temperatureUnit + "~"   //Ist-Temperatur (String)
                                 + destTemp                             + "~"   //Soll-Temperatur (numerisch ohne Komma)
                                 + statusStr                            + "~"   //Mode
                                 + minTemp                              + "~"   //Thermostat Min-Temperatur
                                 + maxTemp                              + "~"   //Thermostat Max-Temperatur
                                 + stepTemp                             + "~"   //Schritte für Soll (5°C)
                                 + icon_res                                     //Icons Status
                                 + findLocale("thermostat","Currently") + "~"   //Bezeicher vor Aktueller Raumtemperatur
                                 + findLocale("thermostat","State")     + "~"   //Bezeicner vor 
                                 + findLocale("thermostat","Action")    + "~"   //Bezeichner vor HVAC
                                 + config.temperatureUnit               + "~"   //Bezeichner hinter Solltemp
                                 + ""                                   + "~"   //iconTemperature
                                 + ""                                           //dstTempTwoTempMode
                                 });                    
    
    }

    if (Debug) console.log(out_msgs);
    return out_msgs
}


function GenerateMediaPage(page: PageMedia): Payload[] {
    var id = page.items[0].id

    //RegisterEntityWatcher(id + ".TITLE");
    var out_msgs: Array<Payload> = [];
    out_msgs.push({ payload: "pageType~cardMedia" });
    if (existsObject(id)) {

        let name = getState(id + ".ALBUM").val;             
        let media_icon = Icons.GetIcon("playlist-music");
        let title = getState(id + ".TITLE").val;
        let author = getState(id + ".ARTIST").val;
        let volume = getState(id + ".VOLUME").val;
        var iconplaypause = Icons.GetIcon("pause"); //pause
        var onoffbutton = 1374;
        if (getState(id + ".STATE").val) {
            onoffbutton = 65535;
            iconplaypause = Icons.GetIcon("pause"); //pause
        } else {
            iconplaypause = Icons.GetIcon("play"); //play
        }
        let currentSpeaker = getState(([alexaInstanz,'.Echo-Devices.',alexaDevice,'.Info.name'].join(''))).val;
                
//-------------------------------------------------------------------------------------------------------------
// nachfolgend alle Alexa-Devices (ist Online / Player- und Commands-Verzeichnis vorhanden) auflisten und verketten
// Wenn Konstante alexaSpeakerList mind. einen Eintrag enthält, wird die Konstante verwendet - ansonsten Alle Devices aus dem Alexa Adapter
        let speakerlist = "";
        if (alexaSpeakerList.length > 0) {
            for (let i_index in alexaSpeakerList) {
                speakerlist = speakerlist + alexaSpeakerList[i_index] + "?";
            } 
        } else {        
            let i_list = Array.prototype.slice.apply($('[state.id="' + alexaInstanz + '.Echo-Devices.*.Info.name"]'));
            for (let i_index in i_list) {
                let i = i_list[i_index];
                let deviceId = i;
                deviceId = deviceId.split('.');
                if (getState(([alexaInstanz,'.Echo-Devices.',deviceId[3],'.online'].join(''))).val && 
                    existsObject(([alexaInstanz,'.Echo-Devices.',deviceId[3],'.Player'].join(''))) &&
                    existsObject(([alexaInstanz,'.Echo-Devices.',deviceId[3],'.Commands'].join('')))) {
                        speakerlist = speakerlist + getState(i).val + "?";
                }
            }
        }
        speakerlist = speakerlist.substring(0,speakerlist.length-1);
//--------------------------------------------------------------------------------------------------------------

        out_msgs.push({ payload: "entityUpd~" +                         //entityUpd
                                  name + "~" +                          //heading
                                  GetNavigationString(pageId) + "~" +   //navigation
                                  id + "~" +                            //internalNameEntiy
                                  media_icon + "~" +                    //icon
                                  title + "~" +                         //title
                                  author + "~" +                        //author
                                  volume + "~" +                        //volume
                                  iconplaypause + "~" +                 //playpauseicon
                                  currentSpeaker + "~" +                //currentSpeaker
                                  speakerlist + "~" +                   //speakerList-seperated-by-?
                                  onoffbutton});                        //On/Off Button Color
    }
    if (Debug) console.log(out_msgs);
    return out_msgs
} 

function GenerateAlarmPage(page: PageAlarm): Payload[] {
    var id = page.items[0].id
    var out_msgs: Array<Payload> = [];
    out_msgs.push({ payload: "pageType~cardAlarm" });
    var nsPath = NSPanel_Path + "Alarm."

    if (existsState(nsPath + "AlarmPin") == false || existsState(nsPath + "AlarmState") == false || existsState(nsPath + "AlarmType") == false) {
        createState(nsPath + "AlarmPin", "0000", {type: 'string'}, function() {setState(nsPath + "AlarmPin", "0000")});
        createState(nsPath + "AlarmState", "disarmed", {type: 'string'}, function() {setState(nsPath + "AlarmState", "disarmed")});
        createState(nsPath + "AlarmType", "0", {type: 'string'}, function() {setState(nsPath + "AlarmType", "0")});
    }

    if (existsState(nsPath + "AlarmPin") && existsState(nsPath + "AlarmState") && existsState(nsPath + "AlarmType")) {
        var entityPin = getState(nsPath + "AlarmPin").val;
        var entityState = getState(nsPath + "AlarmState").val;
        var entityType = getState(nsPath + "AlarmType").val 
        var arm1: string, arm2: string, arm3: string, arm4: string; 
        var arm1ActionName: string, arm2ActionName: string, arm3ActionName: string, arm4ActionName: string;
        var icon = "0";
        var iconcolor = 63488;
        var numpadStatus = "disable";
        var flashing = "disable";

        if (Debug) console.log(id);

        if (entityState == "armed" || entityState == "triggered") {
            arm1 = "Deaktivieren";                                      //arm1*~*
            arm1ActionName = "D1";                                      //arm1ActionName*~*
            arm2 = "";                                                  //arm2*~*
            arm2ActionName = "";                                        //arm2ActionName*~*
            arm3 = "";                                                  //arm3*~*
            arm3ActionName = "";                                        //arm3ActionName*~*
            arm4 = "";                                                  //arm4*~*
            arm4ActionName = "";                                        //arm4ActionName*~*
        } 
        if (entityState == "disarmed" || entityState == "arming" || entityState == "pending") {
            arm1 = "Vollschutz";                                        //arm1*~*
            arm1ActionName = "A1";                                      //arm1ActionName*~*
            arm2 = "Zuhause";                                           //arm2*~*
            arm2ActionName = "A2";                                      //arm2ActionName*~*
            arm3 = "Nacht";                                             //arm3*~*
            arm3ActionName = "A3";                                      //arm3ActionName*~*
            arm4 = "Besuch";                                            //arm4*~*
            arm4ActionName = "A4";                                      //arm4ActionName*~*
        }

        if (entityState == "armed") {
            icon = Icons.GetIcon("shield-home");                        //icon*~*
            iconcolor = 63488;                                          //iconcolor*~*
            numpadStatus = "enable";                                    //numpadStatus*~*
            flashing = "disable";                                       //flashing*
        }
        if (entityState == "disarmed") {
            icon = Icons.GetIcon("shield-off");                         //icon*~*
            iconcolor = 2016;                                           //iconcolor*~*
            numpadStatus = "enable";                                    //numpadStatus*~*
            flashing = "disable";                                       //flashing*
        }
        if (entityState == "arming" || entityState == "pending") {
            icon = Icons.GetIcon("shield");                             //icon*~*
            iconcolor = rgb_dec565({ red: 243, green: 179, blue: 0 });  //iconcolor*~*
            numpadStatus = "disable";                                   //numpadStatus*~*
            flashing = "enable"                                         //flashing*
        }
        if (entityState == "triggered") {
            iconcolor = rgb_dec565({ red: 223, green: 76, blue: 30 });  //icon*~*
            icon = Icons.GetIcon("bell-ring");                          //iconcolor*~*
            numpadStatus = "enable";                                   //numpadStatus*~*
            flashing = "enable"                                         //flashing*
        }
         
    out_msgs.push({ payload:    "entityUpd~" +                          //entityUpd~*
                                id + "~" +                              //internalNameEntity*~*
                                GetNavigationString(pageId) + "~" +     //navigation*~* --> hiddenCards
                                arm1 + "~" +                            //arm1*~*
                                arm1ActionName + "~" +                  //arm1ActionName*~*
                                arm2 + "~" +                            //arm2*~*
                                arm2ActionName + "~" +                  //arm2ActionName*~*
                                arm3 + "~" +                            //arm3*~*
                                arm3ActionName + "~" +                  //arm3ActionName*~*
                                arm4 + "~" +                            //arm4*~*
                                arm4ActionName + "~" +                  //arm4ActionName*~*
                                icon + "~" +                            //icon*~*
                                iconcolor + "~" +                       //iconcolor*~*
                                numpadStatus + "~" +                    //numpadStatus*~*
                                flashing});                             //flashing*
    
    if (Debug) console.log(out_msgs);
    return out_msgs
    }
}

function GenerateQRPage(page: PageQR): Payload[] {
    activePage = page;
    
    var id = page.items[0].id
    var out_msgs: Array<Payload> = [];
    out_msgs.push({ payload: "pageType~cardQR" });

    let o = getObject(id)

    var heading = page.heading !== undefined ? page.heading : o.common.name.de
    var textQR = page.items[0].id + ".ACTUAL" !== undefined ? getState(page.items[0].id + ".ACTUAL").val : "WIFI:T:undefined;S:undefined;P:undefined;H:undefined;"

    const tempstr = textQR.split(";");
    for (let w = 0; w < tempstr.length - 1; w++) {
        if (tempstr[w].substring(0,1) == "S") {
            var optionalValue1 = tempstr[w].slice(2);
        }
        if (tempstr[w].substring(0,1) == "P") {
            var optionalValue2 = tempstr[w].slice(2);
        }  
    }

    var type1  = "text"                 	    
    var internalName1 = "SSID"
    var iconId1 = Icons.GetIcon("wifi");
    var displayName1 = "SSID"
    var type2 = "text"
    var internalName2 = "Passwort"
    var iconId2 = Icons.GetIcon("key");
    var displayName2 = "Passwort"

    out_msgs.push({ payload:    "entityUpd~" +                          //entityUpd
                                heading + "~" +                         //heading
                                GetNavigationString(pageId) + "~" +     //navigation
                                textQR + "~" +                          //textQR
                                type1 + "~" +                   	    //type
                                internalName1 + "~" +                   //internalName
                                iconId1 + "~" +                         //iconId
                                65535 + "~" +                           //iconColor
                                displayName1 + "~" +                    //displayName
                                optionalValue1 + "~" +                  //optionalValue
                                type2 + "~" +                           //type
                                internalName2 + "~" +                   //internalName
                                iconId2 + "~" +                         //iconId
                                65535 + "~" +                           //iconColor
                                displayName2 + "~" +                    //displayName
                                optionalValue2});                       //optionalValue

    //entityUpd,heading,navigation,textQR[,type,internalName,iconId,displayName,optionalValue]x2
    return out_msgs
}

function setIfExists(id: string, value: any, type: string | null = null): boolean {
    if (type === null) {
        if (existsState(id)) {
            setState(id, value);
            return true;
        }
    }
    else {
        let obj = getObject(id);
        if (existsState(id) && obj.common.type !== undefined && obj.common.type === type) {
            setState(id, value);
            return true;
        }
    }
    return false;
}

function toggleState(id: string): boolean {
    let obj = getObject(id);
    if (existsState(id) && obj.common.type !== undefined && obj.common.type === "boolean") {
        setIfExists(id, !getState(id).val);
        return true;
    }
    return false;
}

function HandleButtonEvent(words): void {
    var id = words[2]
    var buttonAction = words[3];

    if (Debug) {
        console.log(words[0] + " - " + words[1] + " - " + words[2] + " - " + words[3] + " - " + words[4] + " - PageId: " + pageId);
    }

    if ((words[2]).substring(0, 8) == "navigate"){
        GeneratePage(eval((words[2]).substring(9, (words[2]).length)));
        return;
    }
         
    switch (buttonAction) {        
        case "bUp":
            if (pageId < 0) { //Prüfen, ob button1page oder button2page 
                pageId = 0;
            } else {
                pageId = Math.abs(pageNum);
            }
            UnsubscribeWatcher();
            GeneratePage(config.pages[pageId]);
    	    break;
        case "bNext":
            var pageNum = ((pageId + 1) % config.pages.length);
            pageId = Math.abs(pageNum);
            UnsubscribeWatcher();
            GeneratePage(config.pages[pageId]);
            break;
        case "bPrev":
            var pageNum = ((pageId - 1) % config.pages.length);
            pageId = Math.abs(pageNum);          
            UnsubscribeWatcher();            
            if(activePage!=undefined && activePage.parent!=undefined) {                                    
                //update pageID
                for (let i=0; i<config.pages.length; i++) {
                    if(config.pages[i] == activePage.parent) {
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
        case "bExit":
            if (config.screenSaverDoubleClick) {
                if (words[4] == 2) {
                    GeneratePage(config.pages[pageId]);
                }
            } else {
                if (Debug) console.log("bExit: " + words[4] + " - "+ pageId)
                GeneratePage(activePage); 
            }
            break;
        case "notifyAction":
            if (words[4] == "yes") {
                setIfExists(popupNotifyInternalName, words[2]); 
                setIfExists(popupNotifyAction , true);
            } else if (words[4] == "no") {
                setIfExists(popupNotifyInternalName, words[2]);
                setIfExists(popupNotifyAction , false)
            }
            setIfExists(config.panelSendTopic, "exitPopup")
            break;
        case "OnOff":            
            if (existsObject(id)) {
                var action = false
                if (words[4] == "1")
                    action = true;
                let o = getObject(id)
                switch (o.common.role) {
                    case "socket":
                    case "light":
                        setIfExists(id + ".SET", action);
                        break;
                    case "dimmer":
                        setIfExists(id + ".ON_SET", action) ? true : setIfExists(id + ".ON_ACTUAL", action);
                        break;
                    case "ct":
                        setIfExists(id + ".ON", action);
                        break;
                    case "rgb":
                    case "rgbSingle":
                    case "hue": // Armilar
                        setIfExists(id + ".ON_ACTUAL", action);
                }
            }
            break;
        case "up":
            setIfExists(id + ".OPEN", true)
            break;
        case "stop":
            setIfExists(id + ".STOP", true)
            break;
        case "down":
            setIfExists(id + ".CLOSE", true)
            break;
        case "button":            
            if (existsObject(id)) {
                var action = false
                if (words[4] == "1")
                    action = true;
                let o = getObject(id)
                switch (o.common.role) {
                    case "lock":
                    case "button": 
                        toggleState(id + ".SET") ? true : toggleState(id + ".ON_SET");
                        break;
                    case "buttonSensor":
                        toggleState(id + ".ACTUAL");
                        break;
                    case "socket":
                    case "light":
                        toggleState(id + ".SET") ? true : toggleState(id + ".ON_SET");
                        break;
                    case "dimmer":
                        toggleState(id + ".ON_SET") ? true : toggleState(id + ".ON_ACTUAL");
                        break;
                    case "ct":
                        toggleState(id + ".ON");
                        break;
                    case "rgb":
                    case "rgbSingle":
                    case "hue": // Armilar
                        toggleState(id + ".ON_ACTUAL");
                }
            }
            break;
        case "positionSlider":
           (function () {if (timeoutSlider) {clearTimeout(timeoutSlider); timeoutSlider = null;}})();
            timeoutSlider = setTimeout(async function () {
                setIfExists(id + ".SET", parseInt(words[4])) ? true : setIfExists(id + ".ACTUAL", parseInt(words[4]));
            }, 250);    
            break;
        case "brightnessSlider":            
            (function () {if (timeoutSlider) {clearTimeout(timeoutSlider); timeoutSlider = null;}})();
            timeoutSlider = setTimeout(async function () {
                if (existsObject(id)) { 
                    let o = getObject(id);
                    let pageItem = findPageItem(id);
                                                                     
                    switch (o.common.role) {
                        case "dimmer":                            
                            if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {  
                                let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueBrightness, pageItem.minValueBrightness))
                                setIfExists(id + ".SET", sliderPos) ? true : setIfExists(id + ".ACTUAL", sliderPos);
                            } else {
                                setIfExists(id + ".SET", parseInt(words[4])) ? true : setIfExists(id + ".ACTUAL", parseInt(words[4]));
                            }
                            break;
                        case "rgb":
                        case "ct":
                        case "rgbSingle":
                        case "hue":
                            if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {  
                                let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueBrightness, pageItem.minValueBrightness))
                                setIfExists(id + ".DIMMER", sliderPos);
                            } else {
                                setIfExists(id + ".DIMMER", parseInt(words[4]));
                            }
                            break;
                    }
                }
            }, 250);
            break;
        case "colorTempSlider": // Armilar - Slider tickt verkehrt - Hell = 0 / Dunkel = 100 -> Korrektur
            (function () {if (timeoutSlider) {clearTimeout(timeoutSlider); timeoutSlider = null;}})();
            timeoutSlider = setTimeout(async function () {
                let pageItem = findPageItem(id);                
                if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                    let colorTempK = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.minValueColorTemp, pageItem.maxValueColorTemp));
                    setIfExists(id + ".TEMPERATURE", (colorTempK));
                } else {
                    setIfExists(id + ".TEMPERATURE", 100 - words[4]);
                }
            }, 250);
            break;
        case "colorWheel":
            let colorCoordinates = words[4].split('|');
            let rgb = pos_to_color(colorCoordinates[0], colorCoordinates[1]);
            if (Debug) console.log(rgb);
            if (Debug) console.log(getHue(rgb.red, rgb.green, rgb.blue));
            let o = getObject(id);
            switch (o.common.role) {
                case "hue":
                    setIfExists(id + ".HUE", getHue(rgb.red, rgb.green, rgb.blue));
                    break;
                case "rgb":
                    setIfExists(id + ".RED", rgb.red);
                    setIfExists(id + ".GREEN", rgb.green);
                    setIfExists(id + ".BLUE", rgb.blue);
                    break;    
                case "rgbSingle":
                    setIfExists(id + ".RGB", ConvertRGBtoHex(rgb.red, rgb.green, rgb.blue));          
            }
            break;
        case "tempUpd":
            setIfExists(id + ".SET", parseInt(words[4]) / 10)
            break;
        case "media-back":
            setIfExists(id + ".PREV", true)
            break;
        case "media-pause":
            if (getState(id + ".STATE").val === true) {
                setIfExists(id + ".PAUSE", true)
            } else {
                setIfExists(id + ".PLAY", true)
            }    
            break;
        case "media-next":
            setIfExists(id + ".NEXT", true)
            break;
        case "volumeSlider":
            setIfExists(id + ".VOLUME", parseInt(words[4]))
            break;
        case "speaker-sel":
            let i_list = Array.prototype.slice.apply($('[state.id="' + alexaInstanz + '.Echo-Devices.*.Info.name"]'));
            for (let i_index in i_list) {
                let i = i_list[i_index];
                if ((getState(i).val) === words[4]){
                    let deviceId = i;
                    deviceId = deviceId.split('.');
                    setIfExists(alexaInstanz + ".Echo-Devices." + alexaDevice + ".Commands.textCommand", "Schiebe meine Musik auf " + words[4]);
                    alexaDevice = deviceId[3]
                }
            }
            break;
        case "media-OnOff":
            setIfExists(id + ".STOP", true)
            break;
        case "hvac_action":
            if (words[4] == "BOOST" || words[4] == "PARTY") {
                setIfExists(words[2] + "." + words[4], !getState(words[2] + "." + words[4]).val)
            } 
            else {
                var HVACMode = 0;
                switch (words[4]) {
                    case "POWER":
                        HVACMode = 0;
                        setIfExists(words[2] + "." + words[4], !getState(words[2] + "." + words[4]).val)
                        if (getState(words[2] + "." + words[4]).val) {
                            HVACMode = 1;
                        }
                        break;
                    case "AUTO":
                        HVACMode = 1;
                        break;
                    case "COOL":
                        HVACMode = 2;
                        break;
                    case "HEAT":
                        HVACMode = 3;
                        break; 
                    case "ECO":
                        HVACMode = 4;
                        break; 
                    case "FAN":
                        HVACMode = 5;
                        break; 
                    case "DRY":
                        HVACMode = 6;
                        break;     
                    case "SWING":
                        HVACMode = getState(words[2] + "." + "MODE").val;
                        if (getState(words[2] + "." + "SWING").val == 0) { 
                            setIfExists(words[2] + "." + "SWING", 1)    
                        } else {
                            setIfExists(words[2] + "." + "SWING", 0)    
                        }
                        break;       
                }
                setIfExists(words[2] + "." + "MODE", HVACMode)
                GeneratePage(config.pages[pageId]);
            }

            break;
        case "number-set":
            setIfExists(id + ".SET", parseInt(words[4])) ? true : setIfExists(id + ".ACTUAL", parseInt(words[4]));
            break;
        case "A1": //Alarm-Page Alarm 1 aktivieren
            if (words[4] != "") {
                setIfExists(id + ".TYPE", "A1");
                setIfExists(id + ".PIN", words[4]);
                setIfExists(id + ".ACTUAL", "arming");
                setTimeout(function(){
                    GeneratePage(config.pages[pageId]);
                },250)
            }
            break; 
        case "A2": //Alarm-Page Alarm 2 aktivieren
            if (words[4] != "") {
                setIfExists(id + ".TYPE", "A2");
                setIfExists(id + ".PIN", words[4]);
                setIfExists(id + ".ACTUAL", "arming");
                setTimeout(function(){
                    GeneratePage(config.pages[pageId]);
                },250)
            }
            break; 
        case "A3": //Alarm-Page Alarm 3 aktivieren
            if (words[4] != "") {
                setIfExists(id + ".TYPE", "A3");
                setIfExists(id + ".PIN", words[4]);
                setIfExists(id + ".ACTUAL", "arming");
                setTimeout(function(){
                    GeneratePage(config.pages[pageId]);
                },250)
            }
            break; 
        case "A4": //Alarm-Page Alarm 4 aktivieren
            if (words[4] != "") {
                setIfExists(id + ".TYPE", "A4");
                setIfExists(id + ".PIN", words[4]);
                setIfExists(id + ".ACTUAL", "arming");
                setTimeout(function(){
                    GeneratePage(config.pages[pageId]);
                },250)
            }
            break;         
        case "D1": //Alarm-Page Alarm Deaktivieren
            if (Debug) console.log("D1: "  + getState(id + ".PIN").val);
            if (words[4] != "") {
                if (getState(id + ".PIN").val == words[4]) {
                    setIfExists(id + ".PIN", "0000");
                    setIfExists(id + ".TYPE", "D1");
                    setIfExists(id + ".ACTUAL", "pending");
                    setTimeout(function(){
                        GeneratePage(config.pages[pageId]);
                    },250)
                }
            }
            break;  
        default:
            break;
    }
}

function GetNavigationString(pageId: number): string {
    if (Debug) console.log(pageId);
   
    if(activePage.subPage)
        return "1|0";

    switch (pageId) {
        case 0:
            return "0|1";
        case config.pages.length - 1:
            return "1|0";
        case -1:
            return "2|0";
        case -2:
            return "2|0";
        default:
            return "1|1";
    }
}

function GenerateDetailPage(type: string, pageItem: PageItem): Payload[] {

    var out_msgs: Array<Payload> = [];
    let id = pageItem.id

    if (existsObject(id)) {
        var o = getObject(id)
        var val: (boolean | number) = 0;
        let icon = Icons.GetIcon("lightbulb");
        var iconColor = rgb_dec565(config.defaultColor);
        if (type == "popupLight") {
            let switchVal = "0"
            let brightness = 0;
            if (o.common.role == "light" || o.common.role == "socket") {
                if (existsState(id + ".GET")) {
                    val = getState(id + ".GET").val;
                    RegisterDetailEntityWatcher(id + ".GET", pageItem, type);
                }
                else if (existsState(id + ".SET")) {
                    val = getState(id + ".SET").val;
                    RegisterDetailEntityWatcher(id + ".SET", pageItem, type);
                }

                icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "socket"  ? Icons.GetIcon("power-socket-de") : Icons.GetIcon("lightbulb");

                if (val) {
                    switchVal = "1";
                    iconColor = GetIconColor(pageItem, true, true);
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                out_msgs.push({ payload: "entityUpdateDetail"                   + "~"   //entityUpdateDetail
                                         + id                                   + "~"
                                         + icon                                 + "~"   //iconId
                                         + iconColor                            + "~"   //iconColor
                                         + switchVal                            + "~"   //buttonState
                                         + "disable"                            + "~"   //sliderBrightnessPos
                                         + "disable"                            + "~"   //sliderColorTempPos
                                         + "disable"                            + "~"   //colorMode
                                         + findLocale("lights","Color")         + "~"   //Color-Bezeichnung
                                         + findLocale("lights","Temperature")   + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});         //Brightness-Bezeichnung
            }

            //Dimmer          
            if (o.common.role == "dimmer") {
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterDetailEntityWatcher(id + ".ON_ACTUAL", pageItem, type);
                } 
                else if (existsState(id + ".ON_SET")) {
                    val = getState(id + ".ON_SET").val;
                    RegisterDetailEntityWatcher(id + ".ON_SET", pageItem, type);
                } 

                if (val === true) {
                    var iconColor = GetIconColor(pageItem, val, false);
                    switchVal = "1"
                }
                
                if (existsState(id + ".ACTUAL")) {                     
                    if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                        brightness = Math.trunc(scale(getState(id + ".ACTUAL").val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                    } else {
                        brightness = getState(id + ".ACTUAL").val;
                    }
                } else {
                    console.warn("Alisas-Datenpunkt: " + id + ".ACTUAL could not be read");
                }

                if (val === true) {
                    iconColor = GetIconColor(pageItem, 100 - brightness, true);
                    switchVal = "1";
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                RegisterDetailEntityWatcher(id + ".ACTUAL", pageItem, type);

                out_msgs.push({ payload: "entityUpdateDetail"                   + "~"   //entityUpdateDetail
                                         + id                                   + "~"
                                         + icon                                 + "~"   //iconId
                                         + iconColor                            + "~"   //iconColor
                                         + switchVal                            + "~"   //buttonState
                                         + brightness                           + "~"   //sliderBrightnessPos
                                         + "disable"                            + "~"   //sliderColorTempPos
                                         + "disable"                            + "~"   //colorMod
                                         + findLocale("lights","Color")         + "~"   //Color-Bezeichnung
                                         + findLocale("lights","Temperature")   + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});         //Brightness-Bezeichnung

                console.log("light." + id)

            }
            
            //HUE-Licht
            if (o.common.role == "hue") {
                
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterDetailEntityWatcher(id + ".ON_ACTUAL", pageItem, type);
                }

                if (existsState(id + ".DIMMER")) {
                    if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                        brightness = Math.trunc(scale(getState(id + ".DIMMER").val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                    } else {
                        brightness = getState(id + ".DIMMER").val;
                    }
                    RegisterDetailEntityWatcher(id + ".DIMMER", pageItem, type);
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".DIMMER could not be read");
                }

                if (val === true) {
                    iconColor = GetIconColor(pageItem, 100 - brightness, true);
                    switchVal = "1";
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                var colorMode = "disable"
                if (existsState(id + ".HUE")) {
                    if (getState(id + ".HUE").val != null) {
                        colorMode = "enable";
                        let huecolor = hsv2rgb(getState(id + ".HUE").val,1,1);
                        let rgb = <RGB>{ red: Math.round(huecolor[0]), green: Math.round(huecolor[1]), blue: Math.round(huecolor[2])}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        //RegisterDetailEntityWatcher(id + ".HUE", pageItem, type);
                    } 
                }

                var colorTemp = 0;
                if (existsState(id + ".TEMPERATURE")) {
                    if (getState(id + ".TEMPERATURE").val != null) {
                        if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                            colorTemp = Math.trunc(scale(getState(id + ".TEMPERATURE").val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                        } else {
                            colorTemp = 100 - getState(id + ".TEMPERATURE").val;
                        }
                        //RegisterDetailEntityWatcher(id + ".TEMPERATURE", pageItem, type);
                    } 
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".TEMPERATURE could not be read");
                }

                out_msgs.push({ payload: "entityUpdateDetail"                   + "~"   //entityUpdateDetail
                                         + id                                   + "~"
                                         + icon                                 + "~"   //iconId
                                         + iconColor                            + "~"   //iconColor
                                         + switchVal                            + "~"   //buttonState
                                         + brightness                           + "~"   //sliderBrightnessPos
                                         + colorTemp                            + "~"   //sliderColorTempPos
                                         + colorMode                            + "~"   //colorMode   (if hue-alias without hue-datapoint, then disable)
                                         + findLocale("lights","Color")         + "~"   //Color-Bezeichnung
                                         + findLocale("lights","Temperature")   + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});         //Brightness-Bezeichnung
            }

            //RGB-Licht
            if (o.common.role == "rgb") {
                
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterDetailEntityWatcher(id + ".ON_ACTUAL", pageItem, type);
                }

                if (existsState(id + ".DIMMER")) {
                    if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                        brightness = Math.trunc(scale(getState(id + ".DIMMER").val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                    } else {
                        brightness = getState(id + ".DIMMER").val;
                    }
                    RegisterDetailEntityWatcher(id + ".DIMMER", pageItem, type);
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".DIMMER could not be read");
                }

                if (val === true) {
                    iconColor = GetIconColor(pageItem, 100 - brightness, true);
                    switchVal = "1";
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                var colorMode = "disable"
                if (existsState(id + ".RED") && existsState(id + ".GREEN") && existsState(id + ".BLUE")) {
                    if (getState(id + ".RED").val != null && getState(id + ".GREEN").val != null && getState(id + ".BLUE").val != null) {
                        colorMode = "enable";
                        let rgb = <RGB>{ red: Math.round(getState(id + ".RED").val), green: Math.round(getState(id + ".GREEN").val), blue: Math.round(getState(id + ".BLUE").val)}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        //RegisterDetailEntityWatcher(id + ".HUE", pageItem, type);
                    } 
                }

                var colorTemp = 0;
                if (existsState(id + ".TEMPERATURE")) {
                    if (getState(id + ".TEMPERATURE").val != null) {
                        if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                            colorTemp = Math.trunc(scale(getState(id + ".TEMPERATURE").val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                        } else {
                            colorTemp = 100 - getState(id + ".TEMPERATURE").val;
                        }
                        //RegisterDetailEntityWatcher(id + ".TEMPERATURE", pageItem, type);
                    } 
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".TEMPERATURE could not be read");
                }

                out_msgs.push({ payload: "entityUpdateDetail"                   + "~"   //entityUpdateDetail
                                         + id                                   + "~"
                                         + icon                                 + "~"   //iconId
                                         + iconColor                            + "~"   //iconColor
                                         + switchVal                            + "~"   //buttonState
                                         + brightness                           + "~"   //sliderBrightnessPos
                                         + colorTemp                            + "~"   //sliderColorTempPos
                                         + colorMode                            + "~"   //colorMode   (if hue-alias without hue-datapoint, then disable)
                                         + findLocale("lights","Color")         + "~"   //Color-Bezeichnung
                                         + findLocale("lights","Temperature")   + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});         //Brightness-Bezeichnung
            }

            //RGB-Licht-einzeln (HEX)
            if (o.common.role == "rgbSingle") {
                
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterDetailEntityWatcher(id + ".ON_ACTUAL", pageItem, type);
                }

                if (existsState(id + ".DIMMER")) {
                    if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                        brightness = Math.trunc(scale(getState(id + ".DIMMER").val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                    } else {
                        brightness = getState(id + ".DIMMER").val;
                    }
                    RegisterDetailEntityWatcher(id + ".DIMMER", pageItem, type);
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".DIMMER could not be read");
                }

                if (val === true) {
                    iconColor = GetIconColor(pageItem, 100 - brightness, true);
                    switchVal = "1";
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                var colorMode = "disable"
                if (existsState(id + ".RGB")) {
                    if (getState(id + ".RGB").val != null) {
                        colorMode = "enable";
                        var hex = getState(id + ".RGB").val;
                        var hexRed = parseInt(hex[1]+hex[2],16);
                        var hexGreen = parseInt(hex[3]+hex[4],16);
                        var hexBlue = parseInt(hex[5]+hex[6],16);
                        let rgb = <RGB>{ red: Math.round(hexRed), green: Math.round(hexGreen), blue: Math.round(hexBlue)}
                        iconColor = rgb_dec565(pageItem.interpolateColor !== undefined ? rgb : config.defaultOnColor);
                        //RegisterDetailEntityWatcher(id + ".HUE", pageItem, type);
                    } 
                }

                var colorTemp = 0;
                if (existsState(id + ".TEMPERATURE")) {
                    if (getState(id + ".TEMPERATURE").val != null) {
                        if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                            colorTemp = Math.trunc(scale(getState(id + ".TEMPERATURE").val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                        } else {
                            colorTemp = 100 - getState(id + ".TEMPERATURE").val;
                        }
                        //RegisterDetailEntityWatcher(id + ".TEMPERATURE", pageItem, type);
                    } 
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".TEMPERATURE could not be read");
                }

                out_msgs.push({ payload: "entityUpdateDetail"                   + "~"   //entityUpdateDetail
                                         + id                                   + "~"
                                         + icon                                 + "~"   //iconId
                                         + iconColor                            + "~"   //iconColor
                                         + switchVal                            + "~"   //buttonState
                                         + brightness                           + "~"   //sliderBrightnessPos
                                         + colorTemp                            + "~"   //sliderColorTempPos
                                         + colorMode                            + "~"   //colorMode   (if hue-alias without hue-datapoint, then disable)
                                         + findLocale("lights","Color")         + "~"   //Color-Bezeichnung
                                         + findLocale("lights","Temperature")   + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});         //Brightness-Bezeichnung
            }

            //Farbtemperatur
            if (o.common.role == "ct") {

                if (existsState(id + ".ON")) {
                    val = getState(id + ".ON").val;
                    RegisterDetailEntityWatcher(id + ".ON", pageItem, type);
                }
                
                if (existsState(id + ".DIMMER")) {
                    if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {
                        brightness = Math.trunc(scale(getState(id + ".DIMMER").val, pageItem.minValueBrightness, pageItem.maxValueBrightness, 100, 0));
                    } else {
                        brightness = getState(id + ".DIMMER").val;
                    }
                    RegisterDetailEntityWatcher(id + ".DIMMER", pageItem, type);
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".DIMMER could not be read");
                }

                if (val === true) {
                    iconColor = GetIconColor(pageItem, 100 - brightness, true);
                    switchVal = "1";
                } else {
                    iconColor = GetIconColor(pageItem, false, true);
                }

                var colorMode = "disable"

                var colorTemp = 0;
                if (existsState(id + ".TEMPERATURE")) {
                    if (getState(id + ".TEMPERATURE").val != null) {
                        if (pageItem.minValueColorTemp !== undefined && pageItem.minValueColorTemp !== undefined) {
                            colorTemp = Math.trunc(scale(getState(id + ".TEMPERATURE").val, pageItem.minValueColorTemp, pageItem.maxValueColorTemp, 0, 100));
                        } else {
                            colorTemp = 100 - getState(id + ".TEMPERATURE").val;
                        }
                        //RegisterDetailEntityWatcher(id + ".TEMPERATURE", pageItem, type);
                    } 
                } else {
                    console.warn("Alias-Datenpunkt: " + id + ".TEMPERATURE could not be read");
                }

                out_msgs.push({ payload: "entityUpdateDetail" + "~"                   //entityUpdateDetail
                                         + icon               + "~"                   //iconId
                                         + iconColor          + "~"                   //iconColor
                                         + switchVal          + "~"                   //buttonState
                                         + brightness         + "~"                   //sliderBrightnessPos
                                         + colorTemp          + "~"                   //sliderColorTempPos
                                         + colorMode          + "~"                   //colorMode   (if hue-alias without hue-datapoint, then disable)
                                         + findLocale("lights","Color") + "~"         //Color-Bezeichnung
                                         + findLocale("lights","Temperature") + "~"   //Temperature-Bezeichnung
                                         + findLocale("lights","Brightness")});       //Brightness-Bezeichnung
            }

        }

        if (type == "popupShutter") {
            icon = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("window-open");
            if (existsState(id + ".ACTUAL")) {
                val = getState(id + ".ACTUAL").val;
                RegisterDetailEntityWatcher(id + ".ACTUAL", pageItem, type);
            } else if (existsState(id + ".SET")) {
                val = getState(id + ".SET").val;
                RegisterDetailEntityWatcher(id + ".SET", pageItem, type);
            }
            out_msgs.push({ payload: "entityUpdateDetail" + "~"           //entityUpdateDetail
                                     + id                 + "~"
                                     + val                + "~"           //Shutterposition
                                     + ""                 + "~"   
                                     + findLocale("blinds","Position")}); //Position-Bezeichnung                                     
        }
    }
    return out_msgs
}

function scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (outMax+outMin)-((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

function UnsubscribeWatcher(): void {
    for (const [key, value] of Object.entries(subscriptions)) {
        unsubscribe(value);
        delete subscriptions[key]
    }
}

function HandleScreensaver(): void {
    SendToPanel({ payload: "pageType~screensaver"})
    UnsubscribeWatcher();
    HandleScreensaverUpdate();
}

function HandleScreensaverUpdate(): void {
    if (screensaverEnabled && config.weatherEntity != null && existsObject(config.weatherEntity)) {
        var icon = getState(config.weatherEntity + ".ICON").val;
 
        let temperature: string =
            existsState(config.weatherEntity + ".ACTUAL") ? getState(config.weatherEntity + ".ACTUAL").val :
                existsState(config.weatherEntity + ".TEMP") ? getState(config.weatherEntity + ".TEMP").val : "null";
 
        let payloadString =
            "weatherUpdate~" + Icons.GetIcon(GetAccuWeatherIcon(parseInt(icon))) + "~"
            + temperature + " " + config.temperatureUnit + "~"
 
/*-------------------------------------------------------------------------------------------------------------------------------------*/
        if (weatherForecast == true) {
            // Accu-Weather Forecast Tag 2 - Tag 5 -- Wenn weatherForecast = true
            for (let i = 2; i < 6; i++) {
                let TempMax = getState("accuweather.0.Summary.TempMax_d" + i).val;
                let DayOfWeek = getState("accuweather.0.Summary.DayOfWeek_d" + i).val;
                let WeatherIcon = GetAccuWeatherIcon(getState("accuweather.0.Summary.WeatherIcon_d" + i).val);
                payloadString += DayOfWeek + "~" + Icons.GetIcon(WeatherIcon) + "~" + TempMax + " " + config.temperatureUnit + "~";
            }
        } 
        else {
            //In Config definierte Zustände wenn weatherForecast = false
            payloadString += GetScreenSaverEntityString(config.firstScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.secondScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.thirdScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.fourthScreensaverEntity);
        }
/*-------------------------------------------------------------------------------------------------------------------------------------*/
        SendToPanel(<Payload>{ payload: payloadString });
    }
}

function GetScreenSaverEntityString(configElement: ScreenSaverElement | null): string {
    if (configElement != null && configElement.ScreensaverEntity != null && existsState(configElement.ScreensaverEntity)) {
        let u1 = getState(configElement.ScreensaverEntity).val;
        return configElement.ScreensaverEntityText + "~" + Icons.GetIcon(configElement.ScreensaverEntityIcon) + "~" + u1 + " " + configElement.ScreensaverEntityUnitText + "~";
    }
    else {
        return "~~~";
    }
}

function GetAccuWeatherIcon(icon: number): string {
    switch (icon) {
        case 24:        // Ice        
        case 30:        // Hot    
        case 31:        // Cold    
            return "window-open";  // exceptional

        case 7:         // Cloudy
        case 8:         // Dreary (Overcast)        
        case 38:        // Mostly Cloudy
            return "weather-cloudy";  // cloudy

        case 11:        // fog
            return "weather-fog";  // fog

        case 25:        // Sleet    
            return "weather-hail";  // Hail

        case 15:        // T-Storms    
            return "weather-lightning";  // lightning

        case 16:        // Mostly Cloudy w/ T-Storms
        case 17:        // Partly Sunny w/ T-Storms
        case 41:        // Partly Cloudy w/ T-Storms       
        case 42:        // Mostly Cloudy w/ T-Storms
            return "weather-lightning-rainy";  // lightning-rainy

        case 33:        // Clear
        case 34:        // Mostly Clear
        case 37:        // Hazy Moonlight
            return "weather-night";

        case 3:         // Partly Sunny
        case 4:         // Intermittent Clouds
        case 6:         // Mostly Cloudy
        case 35: 	    // Partly Cloudy
        case 36: 	    // Intermittent Clouds
            return "weather-partly-cloudy";  // partlycloudy 

        case 18:        // pouring
            return "weather-pouring";  // pouring

        case 12:        // Showers
        case 13:        // Mostly Cloudy w/ Showers
        case 14:        // Partly Sunny w/ Showers      
        case 26:        // Freezing Rain
        case 39:        // Partly Cloudy w/ Showers
        case 40:        // Mostly Cloudy w/ Showers
            return "weather-rainy";  // rainy

        case 19:        // Flurries
        case 20:        // Mostly Cloudy w/ Flurries
        case 21:        // Partly Sunny w/ Flurries
        case 22:        // Snow
        case 23:        // Mostly Cloudy w/ Snow
        case 43:        // Mostly Cloudy w/ Flurries
        case 44:        // Mostly Cloudy w/ Snow
            return "weather-snowy";  // snowy

        case 29:        // Rain and Snow
            return "weather-snowy-rainy";  // snowy-rainy

        case 1:         // Sunny
        case 2: 	    // Mostly Sunny
        case 5:         // Hazy Sunshine
            return "weather-sunny";  // sunny

        case 32:        // windy
            return "weather-windy";  // windy

        default:
            return "alert-circle-outline";
    }
}

//------------------Begin Read Internal Sensor Data
on({ id: config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 6) + "SENSOR" }, function (obj) {
    let mqttSensor =  config.panelRecvTopic.substring(0, config.panelRecvTopic.length - 6) + "SENSOR";
    let Tasmota_Sensor = JSON.parse(getState(mqttSensor).val);
    createState(NSPanel_Path + 'Sensor.Time');
    createState(NSPanel_Path + 'Sensor.TempUnit');
    createState(NSPanel_Path + 'Sensor.ANALOG.Temperature');
    createState(NSPanel_Path + 'Sensor.ESP32.Temperature');
    setIfExists(NSPanel_Path + 'Sensor.Time', Tasmota_Sensor.Time);
    setIfExists(NSPanel_Path + 'Sensor.TempUnit', "°" + Tasmota_Sensor.TempUnit);
    setIfExists(NSPanel_Path + 'Sensor.ANALOG.Temperature', Tasmota_Sensor.ANALOG.Temperature1);
    setIfExists(NSPanel_Path + 'Sensor.ESP32.Temperature', Tasmota_Sensor.ESP32.Temperature);
});
//------------------End Read Internal Sensor Data

function GetBlendedColor(percentage: number): RGB {
    if (percentage < 50)
        return Interpolate(config.defaultOffColor, config.defaultOnColor, percentage / 50.0);
    return Interpolate(Red, White, (percentage - 50) / 50.0);
}

function Interpolate(color1: RGB, color2: RGB, fraction: number): RGB {
    var r: number = InterpolateNum(color1.red, color2.red, fraction);
    var g: number = InterpolateNum(color1.green, color2.green, fraction);
    var b: number = InterpolateNum(color1.blue, color2.blue, fraction);
    return <RGB>{ red: Math.round(r), green: Math.round(g), blue: Math.round(b) };
}

function InterpolateNum(d1: number, d2: number, fraction: number): number {
    return d1 + (d2 - d1) * fraction;
}

function rgb_dec565(rgb: RGB): number {
    return ((Math.floor(rgb.red / 255 * 31) << 11) | (Math.floor(rgb.green / 255 * 63) << 5) | (Math.floor(rgb.blue / 255 * 31)));
}

/* Convert radians to degrees
rad - radians to convert, expects rad in range +/- PI per Math.atan2
returns {number} degrees equivalent of rad
*/
function rad2deg(rad) {
  return (360 + 180 * rad / Math.PI) % 360;
}

function ColorToHex(color) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red: number, green: number, blue: Number) {
  return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
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
  let rgb = hue <= 1? [chroma, x, 0]:
            hue <= 2? [x, chroma, 0]:
            hue <= 3? [0, chroma, x]:
            hue <= 4? [0, x, chroma]:
            hue <= 5? [x, 0, chroma]:
                      [chroma, 0, x];

  return rgb.map(v => (v + value - chroma) * 255);
}

function getHue(red: number, green: number, blue:number) {

    var min = Math.min(Math.min(red, green), blue);
    var max = Math.max(Math.max(red, green), blue);

    if (min == max) {
        return 0;
    }

    var hue = 0;
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
    var r = 160/2;
    var x = Math.round((x - r) / r * 100) / 100;
    var y = Math.round((r - y) / r * 100) / 100;
    
    r = Math.sqrt(x*x + y*y);
    let sat = 0
    if (r > 1) {
        sat = 0;
    } else {
        sat = r;
    }

    var hsv = rad2deg(Math.atan2(y, x));
    var rgb = hsv2rgb(hsv,sat,1);

    return <RGB>{ red: Math.round(rgb[0]), green: Math.round(rgb[1]), blue: Math.round(rgb[2]) };
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
    useColor: boolean,
    subPage: boolean,
    parent: Page,
};

interface PageEntities extends Page {
    type: "cardEntities",
    items: PageItem[],
};

interface PageGrid extends Page {
    type: "cardGrid",
    items: PageItem[],
};

interface PageThermo extends Page {
    type: "cardThermo",
    items: PageItem[],
};

interface PageMedia extends Page {
    type: "cardMedia",
    items: PageItem[],
};

interface PageAlarm extends Page {
    type: "cardAlarm",
    items: PageItem[],
};

interface PageQR extends Page {
    type: "cardQR",
    items: PageItem[],
};

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
    name: (string | undefined),
    buttonText: (string | undefined),
    unit: (string | undefined),
    navigate: (boolean | undefined),
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
    timeoutScreensaver: number,
    dimmode: number,
    active: number,
    locale: string,
    timeFormat: string,
    dateFormat: string,
    weatherEntity: string | null,
    screenSaverDoubleClick: boolean,
    temperatureUnit: string,
    firstScreensaverEntity: ScreenSaverElement | null,
    secondScreensaverEntity: ScreenSaverElement | null,
    thirdScreensaverEntity: ScreenSaverElement | null,
    fourthScreensaverEntity: ScreenSaverElement | null,
    defaultColor: RGB,
    defaultOnColor: RGB,
    defaultOffColor: RGB,
    pages: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid)[],
    subPages: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid)[],
    button1Page: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | null),
    button2Page: (PageThermo | PageMedia | PageAlarm | PageQR | PageEntities | PageGrid | null),
};

type ScreenSaverElement = {
    ScreensaverEntity: string | null,
    ScreensaverEntityIcon: string | null,
    ScreensaverEntityText: string | null,
    ScreensaverEntityUnitText: string | null,
}
