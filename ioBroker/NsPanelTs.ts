/*-----------------------------------------------------------------------
joBr99 Projekt: https://github.com/joBr99/nspanel-lovelace-ui/tree/main/ioBroker

NsPanelTs.ts (dieses TypeScript in ioBroker) Stable: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/NsPanelTs.ts
icon_mapping.ts: https://github.com/joBr99/nspanel-lovelace-ui/blob/main/ioBroker/icon_mapping.ts (TypeScript muss in global liegen)

Mögliche Aliase:    
    Info - Werte aus Datenpunkt 
    Licht - An/Aus (Schalter)
    Steckdose - An/Aus (Schalter)
    Dimmer - An/Aus, Brightness
    Farbtemperatur - An/Aus, Farbtemperatur und Brightness 
    HUE-Licht - Zum Schalten von Color-Leuchtmitteln über HUE-Wert, Brightness, Farbtemperatur, An/Aus (HUE kann auch fehlen) 
    RGB-Licht - RGB-Leuchtmitteln/Stripes welche Rot/Grün/ und Blau separat benötigen (Tasmota, WifiLight, etc.) + Brightness, Farbtemperatur 
    RGB-Licht-einzeln - RGB-Leuchtmitteln/Stripes welche HEX-Farbwerte benötigen (Tasmota, WifiLight, etc.) + Brightness, Farbtemperatur 
    Jalousien - Up, Stop, Down, Position 
    Fenster - Sensor open 
    Tür - Sensor open 
    Taste - Für Szenen oder Radiosender, etc. --> Nur Funktionsaufruf - Kein Taster wie MonoButton - True/False
    ??? wahrscheinlich wäre Tastensensor besser geeignet, um Alias-Taste langfristig für einen MonoButton (Taster) zu verwenden ???
    Thermostat - Aktuelle Raumtemperatur, Setpoint, etc. 
    Feuchtigkeit - Anzeige von Humidity - Datenpunkten, ananlog Info 
    Medien - Steuerung von Alexa - Über Alias-Manager im Verzeichnis Player automatisch anlegen (Geräte-Manager funktioniert nicht) 
    Wetter - Aktuelle Außen-Temperatur und aktuelles Accu-Wheather-Icon für Screensaver
---------------------------------------------------------------------------------------
*/ 
var Icons = new IconsSelector();
var timeoutSlider;

const Months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const Days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const Red: RGB = { red: 255, green: 0, blue: 0 };
const White: RGB = { red: 255, green: 255, blue: 255 };
const Yellow: RGB = { red: 253, green: 216, blue: 53 };
const Green: RGB = { red: 96, green: 176, blue: 62 }
const Brown: RGB = { red: 120, green: 80, blue: 59 }
const Gray: RGB = { red: 69, green: 69, blue: 69 }
const Off: RGB = { red: 68, green: 115, blue: 158 };
const On: RGB = { red: 253, green: 216, blue: 53 };
const BatteryFull: RGB = { red: 96, green: 176, blue: 62 }
const BatteryEmpty: RGB = { red: 179, green: 45, blue: 25 }


//----Ability to choose between Accu-Weather Forcast or self-defined values in the screensaver---------------------------------
var weatherForecast = true; //true = WheatherForecast 5 Days --- false = Config --> firstScreensaverEntity - fourthScreensaverEntity ...

//Alexa2-Instanz
var alexaInstanz = "alexa2.0"
var alexaDevice = "G0XXXXXXXXXXXXXX"; //Primär zu steuendes Device
//If alexaSpeakerList is defined, then entries are used, otherwise all relevant devices from the ioBroker Alexa2 adapter
const alexaSpeakerList = []; //Example ["Echo Spot Buero","Überall","Gartenhaus","Esszimmer","Heimkino"];

//Datenpunkte für Nachricht an Screensaver 
var popupNotifyHeading = "0_userdata.0.WzDisplay.popupNotifyHeading";
var popupNotifyText = "0_userdata.0.WzDisplay.popupNotifyText";

var Test_Licht: PageEntities =
{
    "type": "cardEntities",
    "heading": "Color Aliase",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.NSPanel_1.TestRGBLichteinzeln", name: "RGB-Licht Hex-Color", interpolateColor: true},
        //<PageItem>{ id: "alias.0.NSPanel_1.TestFarbtemperatur", name: "Farbtemperatur", interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestRGBLicht", name: "RGB-Licht", minValueBrightness: 0, maxValueBrightness: 70, interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestCTmitHUE", name: "HUE-Licht-CT", minValueBrightness: 0, maxValueBrightness: 70, minValueColorTemp: 500, maxValueColorTemp: 6500, interpolateColor: true},
        <PageItem>{ id: "alias.0.NSPanel_1.TestHUELicht", name: "HUE-Licht-Color", minValueColorTemp: 500, maxValueColorTemp: 6500, interpolateColor: true}
    ]
};

var Wohnen: PageEntities =
{
    "type": "cardEntities",
    "heading": "Haus",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.Stern", name: "Sternsteckdose"},
        <PageItem>{ id: "alias.0.Erker"},
        <PageItem>{ id: "alias.0.Küche", interpolateColor: true },
        <PageItem>{ id: "alias.0.Wand" }
    ]
};

var Strom: PageEntities =
{
    "type": "cardEntities",
    "heading": "Strom",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.Netz", icon: "flash", interpolateColor: true, offColor: BatteryFull, onColor: Red, minValue: -1000, maxValue: 1000 },
        <PageItem>{ id: "alias.0.Hausverbrauch", icon: "flash", interpolateColor: true, offColor: BatteryFull, onColor: Red, maxValue: 1000 },
        <PageItem>{ id: "alias.0.Pv", icon: "solar-power", interpolateColor: true, offColor: Off, onColor: BatteryFull, maxValue: 1000 },
        <PageItem>{ id: "alias.0.Batterie", icon: "battery-medium", interpolateColor: true, offColor: BatteryEmpty, onColor: BatteryFull }
    ]
};

var Müll: PageEntities =
{
    "type": "cardEntities",
    "heading": "Müllkalender",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.WzNsPanel.Müll.Bio_Tonne"    ,unit:"Tage",  icon: "trash-can",onColor: Brown},
        <PageItem>{ id: "alias.0.WzNsPanel.Müll.Graue_Tonne"   ,unit:"Tage",icon: "trash-can",onColor: Gray},
        <PageItem>{ id: "alias.0.WzNsPanel.Müll.Grüne_Tonne"    ,unit:"Tage",icon: "trash-can",onColor: Green},
        <PageItem>{ id: "alias.0.WzNsPanel.Müll.Gelbe_Tonne"    ,unit:"Tage",icon: "trash-can",onColor: Yellow}
    ]
};

var Alexa: PageMedia = 
{
    "type": "cardMedia",
    "heading": "Alexa",
    "useColor": true,
    "items": [<PageItem>{ id: "alias.0.NSPanel_1.Alexa.PlayerBuero" }]
};

var button1Page: PageGrid =
{
    "type": "cardGrid",
    "heading": "Radio",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.Radio.NJoy" },
        <PageItem>{ id: "alias.0.Radio.Delta_Radio" },
        <PageItem>{ id: "alias.0.Radio.NDR2" },
    ]
};


var button2Page: PageEntities =
{
    "type": "cardEntities",
    "heading": "Knopf2",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.Schlafen" },
        <PageItem>{ id: "alias.0.Stern" }
    ]
};

export const config: Config = {
    panelRecvTopic: "mqtt.0.tele.WzDisplay.RESULT",
    panelSendTopic: "mqtt.0.cmnd.WzDisplay.CustomSend",
    firstScreensaverEntity: { ScreensaverEntity: "alias.0.Wetter.HUMIDITY", ScreensaverEntityIcon: "water-percent", ScreensaverEntityText: "Luft", ScreensaverEntityUnitText: "%" },
    secondScreensaverEntity: { ScreensaverEntity: "alias.0.Wetter.PRECIPITATION_CHANCE", ScreensaverEntityIcon: "weather-pouring", ScreensaverEntityText: "Regen", ScreensaverEntityUnitText: "%" },
    thirdScreensaverEntity: { ScreensaverEntity: "alias.0.Batterie.ACTUAL", ScreensaverEntityIcon: "battery-medium", ScreensaverEntityText: "Batterie", ScreensaverEntityUnitText: "%" },
    fourthScreensaverEntity: { ScreensaverEntity: "alias.0.Pv.ACTUAL", ScreensaverEntityIcon: "solar-power", ScreensaverEntityText: "PV", ScreensaverEntityUnitText: "W" },
    timeoutScreensaver: 15,
    dimmode: 8,
    screenSaverDoubleClick: false,
    locale: "de_DE",
    timeFormat: "%H:%M",
    dateFormat: "%A, %d. %B %Y",
    weatherEntity: "alias.0.Wetter",
    defaultOffColor: Off,
    defaultOnColor: On,
    defaultColor: Off,
    temperatureUnit: "°C",
    pages: [
            //Test_Licht, 
            Wohnen, 
            Strom, 
            Müll, 
            Alexa,
        {
            "type": "cardThermo",
            "heading": "Thermostat",
            "useColor": true,
            "items": [<PageItem>{ id: "alias.0.WzNsPanel", name: "Wohnzimmer" }]
        }
    ],
    button1Page: button1Page,
    button2Page: button2Page
};

// _________________________________ End configuration _____________________________________

var subscriptions: any = {};
var screensaverEnabled : boolean = false;
var pageId = 0;

schedule("* * * * *", function () {
    SendTime();
});
schedule("0 * * * *", function () {
    SendDate();
});

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
        });
    }
    else
        setState(config.panelSendTopic, val.payload);
}

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
                if(pageId < 0)
                    pageId = 0;
                HandleScreensaver();
                break;
            case "pageOpenDetail":
                screensaverEnabled = false;
                UnsubscribeWatcher();
                let pageItem = config.pages[pageId].items.find(e => e.id === words[3]);
                if (pageItem !== undefined)
                    SendToPanel(GenerateDetailPage(words[2], pageItem));
            case "buttonPress2":
                screensaverEnabled = false;
                HandleButtonEvent(words);
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

function GeneratePage(page: Page): void {
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
    }
}

function HandleHardwareButton(method: string): void {
    let page: (PageThermo | PageMedia | PageEntities | PageGrid);
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
    SendToPanel({ payload: "dimmode~" + config.dimmode });
}

function SendDate(): void {
    var d = new Date();
    var day = Days[d.getDay()];
    var date = d.getDate();
    var month = Months[d.getMonth()];
    var year = d.getFullYear();
    var _sendDate = "date~" + day + " " + date + " " + month + " " + year;
    SendToPanel(<Payload>{ payload: _sendDate });
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
    let maxItems = 0;
    switch (page.type) {
        case "cardThermo":
            maxItems = 1;
            break;
        case "cardMedia":
            maxItems = 1;
            break;
        case "cardEntities":
            maxItems = 4;
            break;
        case "cardGrid":
            maxItems = 6;
            break;
    }
    let pageData = "entityUpd~" + page.heading + "~" + GetNavigationString(pageId)
    for (let index = 0; index < maxItems; index++) {
        if (page.items[index] !== undefined) {
            pageData += CreateEntity(page.items[index], index + 1, page.useColor);
        }
        else {
            pageData += CreateEntity(<PageItem>{ id: "delete" }, index + 1);
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
    if (existsObject(pageItem.id)) {
        let o = getObject(pageItem.id)
        var val = null;
        name = pageItem.name !== undefined ? pageItem.name : o.common.name.de

        if (existsState(pageItem.id + ".GET")) {
            val = getState(pageItem.id + ".GET").val;
            RegisterEntityWatcher(pageItem.id + ".GET");
        }
        else if (existsState(pageItem.id + ".SET")) {
            val = getState(pageItem.id + ".SET").val;
            RegisterEntityWatcher(pageItem.id + ".SET");
        }
        var iconColor = rgb_dec565(config.defaultColor);

        switch (o.common.role) {
            case "socket":   
            case "light":
                type = "light"
                 iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "socket"  ? Icons.GetIcon("power-socket-de") : Icons.GetIcon("lightbulb");
                var optVal = "0"

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, true, useColors);
                } else {
                    iconColor = GetIconColor(pageItem, false, useColors);
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
                        //RegisterDetailEntityWatcher(id + ".HUE", pageItem, type);
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
                        var windowState = "opened"
                    } else {
                        iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : o.common.role == "door"  ? Icons.GetIcon("door-closed") : Icons.GetIcon("window-closed-variant");
                        //iconId = Icons.GetIcon("window-closed-variant");
                        iconColor = GetIconColor(pageItem, true, useColors);
                        var windowState = "closed"
                    }
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL");
                }
                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + iconColor + "~" + name + "~" + windowState;
            
            case "info":
            case "humidity":
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

            case "button":
                type = "button";
                iconId = pageItem.icon !== undefined ? Icons.GetIcon(pageItem.icon) : Icons.GetIcon("gesture-tap-button");
                let buttonText = pageItem.name !== undefined ? pageItem.name : "PRESS";
                iconColor = GetIconColor(pageItem, true, useColors);
                return "~" + type + "~" + pageItem.id + "~" + iconId + "~" + + iconColor + "~" + name + "~" + buttonText;

            default:
                return "~delete~~~~~";
        }
    }

    return "~delete~~~~~"
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

    if ((pageItem.useColor || useColors) && ((typeof (value) === "boolean" && value) || value > (pageItem.minValueBrightness !== undefined ? pageItem.minValueBrightness : 0) || value > (pageItem.minValue !== undefined ? pageItem.minValue : 0))) {
        return rgb_dec565(pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor)
    }
    
    return rgb_dec565(pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor);
}

function RegisterEntityWatcher(id: string): void {
    if (subscriptions.hasOwnProperty(id)) {
        return;
    }
    subscriptions[id] = (on({ id: id, change: 'any' }, function (data) {
        if(pageId >= 0)
            SendToPanel({ payload: GeneratePageElements(config.pages[pageId]) });
        if(pageId == -1 && config.button1Page != undefined)
            SendToPanel({ payload: GeneratePageElements(config.button1Page) });
        if(pageId == -2 && config.button2Page != undefined)
            SendToPanel({ payload: GeneratePageElements(config.button2Page) });
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
        let name = page.items[0].name !== undefined ? page.items[0].name : o.common.name.de
        let currentTemp = 0;
        if (existsState(id + ".ACTUAL"))
            currentTemp = (Math.round(parseFloat(getState(id + ".ACTUAL").val) * 10)/10)*10;

        let destTemp = 0;
        if (existsState(id + ".SET")) {
            destTemp = getState(id + ".SET").val.toFixed(2) * 10;
        }

        let status = ""
        if (existsState(id + ".MODE"))
            status = getState(id + ".MODE").val;
        let minTemp = 180 //Min Temp 5°C
        let maxTemp = 300 //Max Temp 30°C
        let stepTemp = 5
        
        //Dynamically add attributes if defined in alias
        var thermButton = 0;
        let i_list = Array.prototype.slice.apply($('[state.id="' + id + '.*"]'));
        if ((i_list.length - 3) != 0) {
            console.log(i_list.length -3)
            if ((i_list.length -3)%2 == 0) {
                if ((i_list.length - 3) == 2) {
                    thermButton = 6;
                } else {
                    thermButton = 5;
                }
            } else {
                if ((i_list.length - 3) == 1) {
                    thermButton = 2;
                } else if ((i_list.length - 3) == 3) {
                    thermButton = 1;
                } else {
                    thermButton = 0;
                }    
            }
                
            var i = 0;    
            var bt = ["","","","","","","","",""];  
            for (i = 0; i < thermButton; i++) {
                bt[i] = "~~~~";
            }
            for (let i_index in i_list) {
                let thermostatState = i_list[i_index].split('.');
                if (thermostatState[thermostatState.length-1] != "SET" && thermostatState[thermostatState.length-1] != "ACTUAL" && thermostatState[thermostatState.length-1] != "MODE")  {
                    i++;
                    
                    switch (thermostatState[thermostatState.length-1]) {
                        case "HUMIDITY":
                            if (existsState(id + ".HUMIDITY") && getState(id + ".HUMIDITY").val != null) {
                                if (parseInt(getState(id + ".HUMIDITY").val) < 40) {
                                    bt[i-1] =  Icons.GetIcon("water-percent") + "~65504~1~bt" + (i-1) + "~";
                                } else if (parseInt(getState(id + ".HUMIDITY").val) < 30) {
                                    bt[i-1] =  Icons.GetIcon("water-percent") + "~63488~1~bt" + (i-1) + "~";
                                } else if (parseInt(getState(id + ".HUMIDITY").val) > 65) {
                                    bt[i-1] =  Icons.GetIcon("water-percent") + "~65504~1~bt" + (i-1) + "~";
                                } else if (parseInt(getState(id + ".HUMIDITY").val) > 75) {
                                    bt[i-1] =  Icons.GetIcon("water-percent") + "~63488~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "LOWBAT":
                            if (existsState(id + ".LOWBAT") && getState(id + ".LOWBAT").val != null) {
                                if (getState(id + ".LOWBAT").val) {
                                    bt[i-1] =  Icons.GetIcon("battery-low") + "~63488~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("battery-high") + "~2016~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "MAINTAIN":
                            if (existsState(id + ".MAINTAIN") && getState(id + ".MAINTAIN").val != null) {
                                if (getState(id + ".MAINTAIN").val >> .1) {
                                    bt[i-1] =  Icons.GetIcon("fire") + "~60897~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("fire") + "~33840~0~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "UNREACH":
                            if (existsState(id + ".UNREACH") && getState(id + ".UNREACH").val != null) {
                                if (getState(id + ".UNREACH").val) {
                                    bt[i-1] =  Icons.GetIcon("wifi-off") + "~63488~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("wifi") + "~2016~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "POWER":
                            if (existsState(id + ".POWER") && getState(id + ".POWER").val != null) {
                                if (getState(id + ".POWER").val) {
                                    bt[i-1] =  Icons.GetIcon("power-standby") + "~2016~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("power-standby") + "~33840~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "ERROR":
                            if (existsState(id + ".ERROR") && getState(id + ".ERROR").val != null) {
                                if (getState(id + ".ERROR").val) {
                                    bt[i-1] =  Icons.GetIcon("alert-circle") + "~63488~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("alert-circle") + "~33840~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "WORKING":
                            if (existsState(id + ".WORKING") && getState(id + ".WORKING").val != null) {
                                if (getState(id + ".WORKING").val) {
                                    bt[i-1] =  Icons.GetIcon("briefcase-check") + "~2016~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("briefcase-check") + "~33840~1~bt" + (i-1) + "~";
                                }
                            } else i--;
                            break;
                        case "BOOST":
                            if (existsState(id + ".BOOST") && getState(id + ".BOOST").val != null) {
                                if (getState(id + ".BOOST").val) {
                                    bt[i-1] =  Icons.GetIcon("fast-forward-60") + "~2016~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("fast-forward-60") + "~33840~1~bt" + (i-1) + "~";
                                }
                            } else i--;                            
                            break;
                        case "PARTY":
                            if (existsState(id + ".PARTY") && getState(id + ".PARTY").val != null) {
                                if (getState(id + ".PARTY").val) {
                                    bt[i-1] =  Icons.GetIcon("party-popper") + "~2016~1~bt" + (i-1) + "~";
                                } else {
                                    bt[i-1] =  Icons.GetIcon("party-popper") + "~33840~1~bt" + (i-1) + "~";
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
        
        let icon_res = bt[0] + bt[1] + bt[2] + bt[3] + bt[4] + bt[5] + bt[6] + bt[7] + bt[8];


        out_msgs.push({ payload: "entityUpd~" + name + "~" + GetNavigationString(pageId) + "~" + id + "~" + currentTemp + "~" + destTemp + "~" + status + "~" + minTemp + "~" + maxTemp + "~" + stepTemp + "~" +icon_res})
    }

    return out_msgs
}

function GenerateMediaPage(page: PageMedia): Payload[] {
    var id = page.items[0].id
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
        //console.log(id);
                
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
        out_msgs.push({ payload: "entityUpd~" +
                                  name + "~" +
                                  id + "~" +
                                  id + "~" +         //????
                                  media_icon + "~" +
                                  title + "~" +
                                  author + "~" +
                                  volume + "~" +
                                  iconplaypause + "~" +
                                  currentSpeaker + "~" +
                                  speakerlist + "~" +
                                  onoffbutton});
    }
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
        setState(id, !getState(id).val);
        return true;
    }
    return false;
}

function HandleButtonEvent(words): void {
    let id = words[2]
    let buttonAction = words[3];

    switch (buttonAction) {
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
            GeneratePage(config.pages[pageId]);
            break;
        case "bExit":
            if (config.screenSaverDoubleClick) {
                if (words[4] == 2)
                    GeneratePage(config.pages[pageId]);
            }
            else
                GeneratePage(config.pages[pageId]);
            break;
        case "OnOff":
            if (existsObject(id)) {
                var action = false
                if (words[4] == "1")
                    action = true
                let o = getObject(id)
                switch (o.common.role) {
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
            toggleState(id + ".SET") ? true : toggleState(id + ".ON_SET")
            break;
        case "positionSlider":
           (function () {if (timeoutSlider) {clearTimeout(timeoutSlider); timeoutSlider = null;}})();
            timeoutSlider = setTimeout(async function () {
                setIfExists(id + ".SET", parseInt(words[4])) ? true : setIfExists(id + ".ACTUAL", parseInt(words[4]));
                //console.log("PositionSlider feuert");
            }, 250);    
            break;
        case "brightnessSlider":
            (function () {if (timeoutSlider) {clearTimeout(timeoutSlider); timeoutSlider = null;}})();
            timeoutSlider = setTimeout(async function () {
                if (existsObject(id)) {
                    let o = getObject(id);
                    let pageItem = config.pages[pageId].items.find(e => e.id === id);
                    //console.log(o.common.role);
                    switch (o.common.role) {
                        case "dimmer":
                            if (pageItem.minValueBrightness != undefined && pageItem.maxValueBrightness != undefined) {  
                                let sliderPos = Math.trunc(scale(parseInt(words[4]), 0, 100, pageItem.maxValueBrightness, pageItem.minValueBrightness))
                                setIfExists(id + ".SET", sliderPos) ? true : setIfExists(id + ".ACTUAL", sliderPos);
                            } else {
            setIfExists(id + ".SET", parseInt(words[4])) ? true : setIfExists(id + ".ACTUAL", parseInt(words[4]));
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
                let pageItem = config.pages[pageId].items.find(e => e.id === id);
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
            //console.log(rgb);
            //console.log(getHue(rgb.red, rgb.green, rgb.blue));
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
        case "tempUpd":
            setIfExists(id + ".SET", parseInt(words[4]) / 10)
            break;
        default:
            break;
    }
}
function GetNavigationString(pageId: number): string {
    switch (pageId) {
        case 0:
            return "0|1";
        case config.pages.length - 1:
            return "1|0";
        case -1:
            return "0|0";
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
            if (o.common.role == "light") {
                if (existsState(id + ".GET")) {
                    val = getState(id + ".GET").val;
                    RegisterDetailEntityWatcher(id + ".GET", pageItem, type);
                }
                else if (existsState(id + ".SET")) {
                    val = getState(id + ".SET").val;
                    RegisterDetailEntityWatcher(id + ".SET", pageItem, type);
                }

                if (val) {
                    switchVal = "1";
                    iconColor = GetIconColor(pageItem, true, false);
                }

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + + iconColor + "~" + switchVal + ",disable,disable,disable" + "~Color~Temperature~Brightness" })
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
                
                let colorTemp = "disable"
                let colorMode = "disable"

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + iconColor + "~" + switchVal + "~" + brightness + "~" + colorTemp + "~" + colorMode + "~Color~Temperature~Brightness" })
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

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + iconColor + "~" + switchVal + "~" + brightness + "~" + colorTemp + "~" + colorMode + "~Color~Temperature~Brightness" })
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

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + iconColor + "~" + switchVal + "~" + brightness + "~" + colorTemp + "~" + colorMode + "~Color~Temperature~Brightness" })
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

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + iconColor + "~" + switchVal + "~" + brightness + "~" + colorTemp + "~" + colorMode + "~Color~Temperature~Brightness" })
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

                out_msgs.push({ payload: "entityUpdateDetail~" + icon + "~" + iconColor + "~" + switchVal + "~" + brightness + "~" + colorTemp + "~" + colorMode + "~Color~Temperature~Brightness" })
            }

        }

        if (type == "popupShutter") {
            if (existsState(id + ".ACTUAL")) {
                val = getState(id + ".ACTUAL").val;
                RegisterDetailEntityWatcher(id + ".ACTUAL", pageItem, type);
            } else if (existsState(id + ".SET")) {
                val = getState(id + ".SET").val;
                RegisterDetailEntityWatcher(id + ".SET", pageItem, type);
            }
            out_msgs.push({ payload: "entityUpdateDetail~" + val + "~~Position" })
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

        if (weatherForecast == true) {
            // Accu-Weather Forecast Tag 2 - Tag 5 -- Wenn weatherForecast = true
            for (let i = 2; i < 6; i++) {
                let TempMax = getState("accuweather.0.Summary.TempMax_d" + i).val;
                let DayOfWeek = getState("accuweather.0.Summary.DayOfWeek_d" + i).val;
                let WeatherIcon = GetAccuWeatherIcon(getState("accuweather.0.Summary.WeatherIcon_d" + i).val);
                payloadString += DayOfWeek + "~" + Icons.GetIcon(WeatherIcon) + "~" + TempMax + " °C~";
            }
        } 
        else {
            //In Config definierte Zustände wenn weatherForecast = false
            payloadString += GetScreenSaverEntityString(config.firstScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.secondScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.thirdScreensaverEntity);
            payloadString += GetScreenSaverEntityString(config.fourthScreensaverEntity);
        }

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
    useColor: boolean
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

type PageItem = {
    id: string,
    icon: (string | undefined),
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
    unit: (string | undefined)
}

type Config = {
    panelRecvTopic: string,
    panelSendTopic: string,
    timeoutScreensaver: number,
    dimmode: number,
    //brightnessScreensaver:
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
    pages: (PageThermo | PageMedia | PageEntities | PageGrid)[],
    button1Page: (PageThermo | PageMedia | PageEntities | PageGrid | null),
    button2Page: (PageThermo | PageMedia | PageEntities | PageGrid | null),
};

type ScreenSaverElement = {
    ScreensaverEntity: string | null,
    ScreensaverEntityIcon: string | null,
    ScreensaverEntityText: string | null,
    ScreensaverEntityUnitText: string | null,
}
