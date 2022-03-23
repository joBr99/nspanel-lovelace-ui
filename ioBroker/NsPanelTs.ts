
const Months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const Days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const Red: RGB = { red: 255, green: 0, blue: 0 };
const White: RGB = { red: 255, green: 255, blue: 255 };
const Off: RGB = { red: 68, green: 115, blue: 158 };
const On: RGB = { red: 253, green: 216, blue: 53 };
const BatteryFull: RGB = { red: 96, green: 176, blue: 62 }
const BatteryEmpty: RGB = { red: 179, green: 45, blue: 25 }

var Wohnen: PageEntities =
{
    "type": "cardEntities",
    "heading": "Haus",
    "useColor": true,
    "items": [
        <PageItem>{ id: "alias.0.Stern"},
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
        <PageItem>{ id: "alias.0.Netz", icon: 4, interpolateColor: true, offColor: BatteryFull, onColor: Red , minValue: -1000, maxValue: 1000 },
        <PageItem>{ id: "alias.0.Hausverbrauch", icon: 4, interpolateColor: true, offColor: BatteryFull, onColor: Red , maxValue: 1000 },
        <PageItem>{ id: "alias.0.Pv", icon: 4, interpolateColor: true, offColor: Off, onColor: BatteryFull , maxValue: 1000 },
        <PageItem>{ id: "alias.0.Batterie", icon: 34, interpolateColor: true, offColor: BatteryEmpty, onColor: BatteryFull }
    ]
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
    leftEntity: "alias.0.Batterie.ACTUAL",
    leftEntityIcon: 34,
    leftEntityText: "Batterie",
    leftEntityUnitText: "%",
    rightEntity: "alias.0.Pv.ACTUAL",
    rightEntityIcon: 32,
    rightEntityText: "PV",
    rightEntityUnitText: "W",
    timeoutScreensaver: 15,
    dimmode: 8,
    locale: "de_DE",
    timeFormat: "%H:%M",
    dateFormat: "%A, %d. %B %Y",
    weatherEntity: "alias.0.Wetter",
    defaultOffColor: Off,
    defaultOnColor: On,
    defaultColor: Off,
    temperatureUnit: "°C",
    pages: [Wohnen, Strom,
        {
            "type": "cardThermo",
            "heading": "Thermostat",
            "useColor": true,
            "items": [<PageItem>{ id: "alias.0.WzNsPanel" }]
        }
    ],
    button1Page: button1Page,
    button2Page: button2Page
};



var subscriptions: any = {};

var pageId = 0;

schedule("* * * * *", function () {
    SendTime();
});
schedule("0 * * * *", function () {
    SendDate();
});


// Only monitor the extra nodes if one or both are present
var updateArray: string[] = [];
if (config.rightEntity !== null && existsState(config.rightEntity)) {
    updateArray.push(config.rightEntity)
}

if (config.leftEntity !== null && existsState(config.leftEntity)) {
    updateArray.push(config.leftEntity)
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
        if (split[1] == "pageOpenDetail") {
            UnsubscribeWatcher();
            let pageItem = config.pages[pageId].items.find(e => e.id === split[3]);
            if (pageItem !== undefined)
                SendToPanel(GenerateDetailPage(split[2], pageItem));
        }
        else {
            HandleMessage(split[0], split[1], parseInt(split[2]), split);
        }
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
        var pageNum = (page % config.pages.length);
        pageId = Math.abs(pageNum);

        if (method == 'pageOpen' || method == 'startup') {
            UnsubscribeWatcher();

            if (method == 'startup')
                HandleStartupProcess();

            GeneratePage(config.pages[pageId]);
        }

        if (method == 'buttonPress2') {
            HandleButtonEvent(words)
        }

        if (method == 'screensaverOpen') {
            HandleScreensaver()
        }

        if (method == 'button1' || method == 'button2') {
            HandleHardwareButton(method);
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
    }
}

function HandleHardwareButton(method: string): void {
    let page: (PageThermo | PageEntities | PageGrid);
    if (config.button1Page !== null && method == "button1") {
        page = config.button1Page;
    }
    else if (config.button2Page !== null && method == "button2") {
        page = config.button2Page;
    }
    else {
        return;
    }
    GeneratePage(page);
}

function HandleStartupProcess(): void {
    SendDate();
    SendTime();
    SendToPanel({ payload: "timeout," + config.timeoutScreensaver });
    SendToPanel({ payload: "dimmode," + config.dimmode });
}

function SendDate(): void {
    var d = new Date();
    var day = Days[d.getDay()];
    var date = d.getDate();
    var month = Months[d.getMonth()];
    var year = d.getFullYear();
    var _sendDate = "date,?" + day + " " + date + " " + month + " " + year;
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
    SendToPanel(<Payload>{ payload: "time," + hr + ":" + min });
}

function GenerateEntitiesPage(page: PageEntities): Payload[] {
    var out_msgs: Array<Payload> = [];
    out_msgs = [{ payload: "pageType,cardEntities" }, { payload: "entityUpdHeading," + page.heading }]
    out_msgs.push({ payload: GeneratePageElements(page.items, 4,page.useColor) });
    return out_msgs
}

function GenerateGridPage(page: PageGrid): Payload[] {
    var out_msgs: Array<Payload> = [];
    out_msgs = [{ payload: "pageType,cardGrid" }, { payload: "entityUpdHeading," + page.heading }]
    out_msgs.push({ payload: GeneratePageElements(page.items, 6, page.useColor) });
    return out_msgs
}

function GeneratePageElements(pageItems: PageItem[], maxItems: number, useColors: boolean = false): string {
    let pageData = "entityUpd";
    for (let index = 0; index < maxItems; index++) {
        if (pageItems[index] !== undefined) {
            pageData += CreateEntity(pageItems[index], index + 1, useColors);
        }
        else {
            pageData += CreateEntity(<PageItem>{ id: "delete" }, index + 1);
        }
    }
    return pageData;
}

function CreateEntity(pageItem: PageItem, placeId: number, useColors: boolean = false): string {
    var iconId = 0
    if (pageItem.id == "delete") {
        return ",delete,,,,,"
    }
    var name: string;
    var type: string;
    // ioBroker
    if (existsObject(pageItem.id)) {
        let o = getObject(pageItem.id)
        var val = null;
        name = o.common.name.de

        if (existsState(pageItem.id + ".GET")) {
            val = getState(pageItem.id + ".GET").val;
            RegisterEntityWatcher(pageItem.id + ".GET", pageItem.id, placeId);
        }
        else if (existsState(pageItem.id + ".SET")) {
            val = getState(pageItem.id + ".SET").val;
            RegisterEntityWatcher(pageItem.id + ".SET", pageItem.id, placeId);
        }
        var iconColor = rgb_dec565(config.defaultColor);

        switch (o.common.role) {
            case "light":
                type = "light"
                iconId = pageItem.icon !== undefined ? pageItem.icon : 1;
                var optVal = "0"

                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, true, useColors);
                }

                return "," + type + "," + pageItem.id + "," + iconId + "," + iconColor + "," + name + "," + optVal;

            case "dimmer":
                type = "light"
                iconId = pageItem.icon !== undefined ? pageItem.icon : 1;
                var optVal = "0"
                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    val = getState(pageItem.id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL", pageItem.id, placeId);
                }
                else if (existsState(pageItem.id + ".ON_SET")) {
                    val = getState(pageItem.id + ".ON_SET").val;
                    RegisterEntityWatcher(pageItem.id + ".ON_SET", pageItem.id, placeId);
                }
                if (val === true || val === "true") {
                    optVal = "1"
                    iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".ACTUAL") ? getState(pageItem.id + ".ACTUAL").val : true, useColors);
                }

                return "," + type + "," + pageItem.id + "," + iconId + "," + iconColor + "," + name + "," + optVal;

            case "blind":
                type = "shutter"
                iconId = pageItem.icon !== undefined ? pageItem.icon : 0;
                iconColor = GetIconColor(pageItem, existsState(pageItem.id + ".ACTUAL") ? getState(pageItem.id + ".ACTUAL").val : true, useColors);
                return "," + type + "," + pageItem.id + "," + iconId + "," + iconColor + "," + name + ","

            case "info":
            case "value.temperature":
                type = "text";
                iconId = pageItem.icon !== undefined ? pageItem.icon : 11;
                let unit = "";
                var optVal = "0"
                if (existsState(pageItem.id + ".ON_ACTUAL")) {
                    optVal = getState(pageItem.id + ".ON_ACTUAL").val;
                    unit = GetUnitOfMeasurement(pageItem.id + ".ON_ACTUAL");
                    RegisterEntityWatcher(pageItem.id + ".ON_ACTUAL", pageItem.id, placeId);
                }
                else if (existsState(pageItem.id + ".ACTUAL")) {
                    optVal = getState(pageItem.id + ".ACTUAL").val;
                    unit = GetUnitOfMeasurement(pageItem.id + ".ACTUAL");
                    RegisterEntityWatcher(pageItem.id + ".ACTUAL", pageItem.id, placeId);
                }

                if (o.common.role == "value.temperature") {
                    iconId = pageItem.icon !== undefined ? pageItem.icon : 2;
                }

                iconColor = GetIconColor(pageItem, parseInt(optVal), useColors);

                return "," + type + "," + pageItem.id + "," + iconId + "," + iconColor + "," + name + "," + optVal + " " + unit;

            case "button":
                type = "button";
                iconId = pageItem.icon !== undefined ? pageItem.icon : 3;
                let buttonText = pageItem.buttonText !== undefined ? pageItem.buttonText : "PRESS";
                iconColor = GetIconColor(pageItem, true, useColors);
                return "," + type + "," + pageItem.id + "," + iconId + "," + + iconColor + "," + name + "," + buttonText;

            default:
                return ",delete,,,,";
        }
    }

    return ",delete,,,,,"
}

function GetIconColor(pageItem: PageItem, value: (boolean | number), useColors: boolean): number {
    // dimmer
    if ((pageItem.useColor || useColors) && pageItem.interpolateColor && typeof (value) === "number") {
        let maxValue = pageItem.maxValue !== undefined ? pageItem.maxValue : 100;
        let minValue = pageItem.minValue !== undefined ? pageItem.minValue : 0;
        value = value > maxValue ? maxValue : value;
        value = value < minValue ? minValue : value;
        return rgb_dec565(
            Interpolate(
                pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor,
                pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor,
                scale(value, minValue, maxValue, 0, 1)
            ));
    }

    if ((pageItem.useColor || useColors) && ((typeof (value) === "boolean" && value) || value > (pageItem.minValue !== undefined ? pageItem.minValue : 0))) {
        return rgb_dec565(pageItem.onColor !== undefined ? pageItem.onColor : config.defaultOnColor)
    }

    return rgb_dec565(pageItem.offColor !== undefined ? pageItem.offColor : config.defaultOffColor);
}

function RegisterEntityWatcher(id: string, entityId: string, placeId: number): void {
    if (subscriptions.hasOwnProperty(id)) {
        return;
    }
    subscriptions[id] = (on({ id: id, change: 'any' }, function (data) {
        GeneratePage(config.pages[pageId]);
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
    out_msgs.push({ payload: "pageType,cardThermo" });

    // ioBroker
    if (existsObject(id)) {
        let o = getObject(id)
        let name = o.common.name.de
        let currentTemp = 0;
        if (existsState(id + ".ACTUAL"))
            currentTemp = parseInt(getState(id + ".ACTUAL").val) * 10;

        let destTemp = 0;
        if (existsState(id + ".SET"))
            destTemp = parseInt(getState(id + ".SET").val) * 10;

        let status = ""
        if (existsState(id + ".MODE"))
            status = destTemp = getState(id + ".MODE").val;
        let minTemp = 180
        let maxTemp = 300
        let stepTemp = 5

        out_msgs.push({ payload: "entityUpd," + id + "," + name + "," + currentTemp + "," + destTemp + "," + status + "," + minTemp + "," + maxTemp + "," + stepTemp })
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
            log(id)
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

    if (words[3] == "OnOff" && existsObject(id)) {
        var action = false
        if (words[4] == "1")
            action = true
        let o = getObject(id)
        switch (o.common.role) {
            case "light":
                setState(id + ".SET", action);
                break;
            case "dimmer":
                if (existsState(id + ".ON_SET"))
                    setState(id + ".ON_SET", action);
                else if (existsState(id + ".ON_ACTUAL"))
                    setState(id + ".ON_ACTUAL", action);
        }
    }

    if (words[3] == "up")
        setState(id + ".OPEN", true)
    if (words[3] == "stop")
        setState(id + ".STOP", true)
    if (words[3] == "down")
        setState(id + ".CLOSE", true)
    if (words[3] == "button") {
        toggleState(id + ".SET") ? true : toggleState(id + ".ON_SET")
    }
    if (words[3] == "positionSlider")
        setState(id + ".SET", parseInt(words[4]))

    if (words[3] == "brightnessSlider")
        if (existsState(id + ".SET"))
            setState(id + ".SET", parseInt(words[4]));
        else if (existsState(id + ".ACTUAL"))
            setState(id + ".ACTUAL", parseInt(words[4]));
    //     out_msgs.push({ payload: id, action: "turn_on", domain: "lightBrightness", brightness: parseInt(words[7]) })
    // if (words[6] == "colorTempSlider")
    //     out_msgs.push({ payload: id, action: "turn_on", domain: "lightTemperature", temperature: parseInt(words[7]) })
    if (words[3] == "tempUpd") {
        setState(words[3] + ".SET", parseInt(words[4]) / 10)
    }
}

function GenerateDetailPage(type: string, pageItem: PageItem): Payload[] {

    var out_msgs: Array<Payload> = [];
    let id = pageItem.id
    if (existsObject(id)) {
        var o = getObject(id)
        var val: (boolean | number) = 0;
        let icon = 1;
        var iconColor = rgb_dec565(config.defaultColor);
        if (type == "popupLight") {
            let switchVal = "0"
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

                out_msgs.push({ payload: "entityUpdateDetail," + icon + "," + + iconColor + "," + switchVal + ",disable,disable,disable" })
            }

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
                let brightness = 0;
                if (existsState(id + ".ACTUAL")) {
                    brightness = Math.trunc(scale(getState(id + ".ACTUAL").val, 0, 100, 0, 100))
                    iconColor = GetIconColor(pageItem, brightness, false);
                    RegisterDetailEntityWatcher(id + ".ACTUAL", pageItem, type);
                }
                let colorTemp = "disable"
                let colorMode = "disable"
                //let attr_support_color = attr.supported_color_modes
                //if (attr_support_color.includes("color_temp"))
                // colortemp = Math.trunc(scale(attr.color_temp, attr.min_mireds, attr.max_mireds, 0, 100))

                out_msgs.push({ payload: "entityUpdateDetail," + icon + "," + iconColor + "," + switchVal + "," + brightness + "," + colorTemp + "," + colorMode })
            }

        }

        if (type == "popupShutter") {
            if (existsState(id + ".ACTUAL"))
                val = getState(id + ".ACTUAL").val;
            else if (existsState(id + ".SET"))
                val = getState(id + ".SET").val;
            out_msgs.push({ payload: "entityUpdateDetail," + val })
        }
    }
    return out_msgs
}

function scale(number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function UnsubscribeWatcher(): void {
    for (const [key, value] of Object.entries(subscriptions)) {
        unsubscribe(value);
        delete subscriptions[key]
    }
}

function HandleScreensaver(): void {
    UnsubscribeWatcher();
    HandleScreensaverUpdate();
}

function HandleScreensaverUpdate(): void {
    if (config.weatherEntity != null && existsObject(config.weatherEntity)) {
        var icon = getState(config.weatherEntity + ".ICON").val;

        let temperature: string =
            existsState(config.weatherEntity + ".ACTUAL") ? getState(config.weatherEntity + ".ACTUAL").val :
                existsState(config.weatherEntity + ".TEMP") ? getState(config.weatherEntity + ".TEMP").val : "null";
        let humidity = getState(config.weatherEntity + ".HUMIDITY").val;


        let payloadString =
            "weatherUpdate,?" + GetAccuWeatherIcon(parseInt(icon)) + "?"
            + temperature + " " + config.temperatureUnit + "?26?"
            + humidity + " %?";

        if (existsState(config.leftEntity)) {
            let u1 = getState(config.leftEntity).val;
            payloadString += config.leftEntityText + "?" + config.leftEntityIcon + "?" + u1 + " " + config.leftEntityUnitText + "?";
        }
        else {
            payloadString += "???";
        }

        if (existsState(config.rightEntity)) {
            let u2 = getState(config.rightEntity).val;
            payloadString += config.rightEntityText + "?" + config.rightEntityIcon + "?" + u2 + " " + config.rightEntityUnitText;
        }
        else {
            payloadString += "??";
        }
        SendToPanel(<Payload>{ payload: payloadString });
    }
}

function GetAccuWeatherIcon(icon: number): number {
    switch (icon) {
        case 24:        // Ice        
        case 30:        // Hot    
        case 31:        // Cold    
            return 11;  // exceptional

        case 7:         // Cloudy
        case 8:         // Dreary (Overcast)        
        case 38:        // Mostly Cloudy
            return 12;  // cloudy

        case 11:        // fog
            return 13;  // fog

        case 25:        // Sleet    
            return 14;  // Hail

        case 15:        // T-Storms    
            return 15;  // lightning

        case 16:        // Mostly Cloudy w/ T-Storms
        case 17:        // Partly Sunny w/ T-Storms
        case 41:        // Partly Cloudy w/ T-Storms       
        case 42:        // Mostly Cloudy w/ T-Storms
            return 16;  // lightning-rainy

        case 33:        // Clear
        case 34:        // Mostly Clear
        case 37:        // Hazy Moonlight
            return 17;

        case 3:         // Partly Sunny
        case 4:         // Intermittent Clouds
        case 6:         // Mostly Cloudy
        case 35: 	    // Partly Cloudy
        case 36: 	    // Intermittent Clouds
            return 18;  // partlycloudy 

        case 18:        // pouring
            return 19;  // pouring

        case 12:        // Showers
        case 13:        // Mostly Cloudy w/ Showers
        case 14:        // Partly Sunny w/ Showers      
        case 26:        // Freezing Rain
        case 39:        // Partly Cloudy w/ Showers
        case 40:        // Mostly Cloudy w/ Showers
            return 20;  // rainy

        case 19:        // Flurries
        case 20:        // Mostly Cloudy w/ Flurries
        case 21:        // Partly Sunny w/ Flurries
        case 22:        // Snow
        case 23:        // Mostly Cloudy w/ Snow
        case 43:        // Mostly Cloudy w/ Flurries
        case 44:        // Mostly Cloudy w/ Snow
            return 21;  // snowy

        case 29:        // Rain and Snow
            return 22;  // snowy-rainy

        case 1:         // Sunny
        case 2: 	    // Mostly Sunny
        case 5:         // Hazy Sunshine
            return 23;  // sunny

        case 32:        // windy
            return 24;  // windy

        default:
            return 1;
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

type PageItem = {
    id: string,
    icon: (number | undefined),
    onColor: (RGB | undefined),
    offColor: (RGB | undefined),
    useColor: (boolean | undefined),
    interpolateColor: (boolean | undefined),
    minValue: (number | undefined),
    maxValue: (number | undefined),
    buttonText: (string | undefined)
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
    temperatureUnit: string,
    leftEntity: string,
    leftEntityIcon: number,
    leftEntityText: string,
    leftEntityUnitText: string | null,
    rightEntity: string,
    rightEntityIcon: number,
    rightEntityText: string,
    rightEntityUnitText: string | null,
    defaultColor: RGB,
    defaultOnColor: RGB,
    defaultOffColor: RGB,
    pages: (PageThermo | PageEntities | PageGrid)[],
    button1Page: (PageThermo | PageEntities | PageGrid | null),
    button2Page: (PageThermo | PageEntities | PageGrid | null),
};
