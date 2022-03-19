type Payload = {
    payload: string;
};

type Page = {
    type: string,
    heading: string
}

interface PageEntities extends Page {
    type: "cardEntities",
    items: string[]
}

interface PageThermo extends Page {
    type: "cardThermo",
    item: string
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
    batEntity: string,
    pvEntity: string,
    pages: (PageThermo | PageEntities)[]
}


var subscriptions: any = {};

var pageId = 0;

var config: Config = {
    panelRecvTopic: "mqtt.0.tele.WzDisplay.RESULT",
    panelSendTopic: "mqtt.0.cmnd.WzDisplay.CustomSend",
    batEntity: "alias.0.Batterie.ACTUAL",
    pvEntity: "alias.0.Pv.ACTUAL",
    timeoutScreensaver: 15,
    dimmode: 8,
    locale: "de_DE",
    timeFormat: "%H:%M",
    dateFormat: "%A, %d. %B %Y",
    weatherEntity: "alias.0.Wetter",

    temperatureUnit: "°C",
    pages: [
        {
            "type": "cardEntities",
            "heading": "Haus",
            "items": [
                "alias.0.Rolladen_Eltern",
                "alias.0.Erker",
                "alias.0.Küche",
                "alias.0.Wand"
            ]
        },
        {
            "type": "cardEntities",
            "heading": "Strom",
            "items": [
                "alias.0.Netz",
                "alias.0.Hausverbrauch",
                "alias.0.Pv",
                "alias.0.Batterie"
            ]
        },
        {
            "type": "cardThermo",
            "heading": "Thermostat",
            "item": "alias.0.WzNsPanel"
        }
    ]
};

schedule("* * * * *", function () {
    SendTime();
});
schedule("0 * * * *", function () {
    SendDate();
});

on([config.pvEntity, config.batEntity], function () {
    HandleScreensaverUpdate();
})

on({ id: config.panelRecvTopic }, function (obj) {
    if (obj.state.val.startsWith('\{"CustomRecv":')) {
        var json = JSON.parse(obj.state.val);

        var split = json.CustomRecv.split(",");
        if (split[1] == "pageOpenDetail") {
            UnsubscribeWatcher();
            SendToPanel(GenerateDetailPage(split[2], split[3]));
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
            var retMsgs: Array<Payload> = [];
            if (config.pages[pageId].type == "cardEntities") {
                retMsgs = GenerateEntitiesPage(pageId, <PageEntities>config.pages[pageId])
            } else if (config.pages[pageId].type == "cardThermo") {
                retMsgs = GenerateThermoPage(pageId, <PageThermo>config.pages[pageId])
            }
            if (method == 'startup')
                HandleStartupProcess();
            SendToPanel(retMsgs)
        }

        if (method == 'buttonPress' || method == "tempUpd") {
            HandleButtonEvent(words)
        }

        if (method == 'screensaverOpen') {
            HandleScreensaver()
        }
    }
}

function HandleStartupProcess(): void {
    SendDate();
    SendTime();
    SendToPanel({ payload: "timeout," + config.timeoutScreensaver });
    SendToPanel({ payload: "dimmode," + config.dimmode });
}

function SendDate(): void {
    var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    var days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    var d = new Date();
    var day = days[d.getDay()];
    var date = d.getDate();
    var month = months[d.getMonth()];
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

function GenerateEntitiesPage(pageNum: number, page: PageEntities): Payload[] {
    var out_msgs: Array<Payload> = [];
    out_msgs = [{ payload: "pageType,cardEntities" }, { payload: "entityUpdHeading," + config.pages[pageNum].heading }]

    page.items.forEach(function (id, i) {
        out_msgs.push(CreateEntity(id, i + 1));
    })
    return out_msgs
}

function CreateEntity(id: string, placeId: number): Payload {
    var type = "delete"
    var iconId = 0
    var name = "FriendlyName"
    if (id == "delete") {
        return { payload: "entityUpd," + placeId + "," + type };
    }

    // ioBroker
    if (existsObject(id)) {
        let o = getObject(id)
        var val = null;
        name = o.common.name.de

        if (existsState(id + ".GET")) {
            val = getState(id + ".GET").val;
            RegisterEntityWatcher(id + ".GET", id, placeId);
        }
        else if (existsState(id + ".SET")) {
            val = getState(id + ".SET").val;
            RegisterEntityWatcher(id + ".SET", id, placeId);
        }
        switch (o.common.role) {
            case "light":
                type = "light"
                iconId = 1
                var optVal = "0"
                if (val === true || val === "true")
                    optVal = "1"
                return { payload: "entityUpd," + placeId + "," + type + "," + id + "," + iconId + "," + name + "," + optVal }

            case "dimmer":
                type = "light"
                iconId = 1
                var optVal = "0"
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterEntityWatcher(id + ".ON_ACTUAL", id, placeId);
                }
                else if (existsState(id + ".ON_SET")) {
                    val = getState(id + ".ON_SET").val;
                    RegisterEntityWatcher(id + ".ON_SET", id, placeId);
                }
                if (val === true || val === "true")
                    optVal = "1"
                return { payload: "entityUpd," + placeId + "," + type + "," + id + "," + iconId + "," + name + "," + optVal }

            case "blind":
                type = "shutter"
                iconId = 0
                return { payload: "entityUpd," + placeId + "," + type + "," + id + "," + iconId + "," + name }

            case "info":
            case "value.temperature":
                type = "text"

                var optVal = "0"
                if (existsState(id + ".ON_ACTUAL")) {
                    optVal = getState(id + ".ON_ACTUAL").val + " " + GetUnitOfMeasurement(id + ".ON_ACTUAL");
                    RegisterEntityWatcher(id + ".ON_ACTUAL", id, placeId);
                }
                else if (existsState(id + ".ACTUAL")) {
                    optVal = getState(id + ".ACTUAL").val;
                    RegisterEntityWatcher(id + ".ACTUAL", id, placeId);
                }

                if (o.common.role == "value.temperature") {
                    iconId = 2;
                    optVal += config.temperatureUnit;
                }
                else {
                    optVal += GetUnitOfMeasurement(id + ".ACTUAL");
                }
                return { payload: "entityUpd," + placeId + "," + type + "," + id + "," + iconId + "," + name + "," + optVal };

            case "button":
                type = "button";
                iconId = 3;
                var optVal = "PRESS";
                return { payload: "entityUpd," + placeId + "," + type + "," + id + "," + iconId + "," + name + "," + optVal };

            default:
                break
        }
    }
    return { payload: "entityUpd," + placeId + "," + type };
}

function RegisterEntityWatcher(id: string, entityId: string, placeId: number): void {
    if (subscriptions.hasOwnProperty(id)) {
        return;
    }
    subscriptions[id] = (on({ id: id, change: 'any' }, function (data) {
        SendToPanel(CreateEntity(entityId, placeId));
    }))
}


function RegisterDetailEntityWatcher(id: string, entityId: string, type: string): void {
    if (subscriptions.hasOwnProperty(id)) {
        return;
    }
    subscriptions[id] = (on({ id: id, change: 'any' }, function () {
        SendToPanel(GenerateDetailPage(type, entityId));
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

function GenerateThermoPage(pageNum: number, page: PageThermo): Payload[] {
    var id = page.item
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

function HandleButtonEvent(words): void {
    let id = words[4]

    if (words[6] == "OnOff" && existsObject(id)) {

        var action = false
        if (words[7] == "1")
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

    if (words[6] == "up")
        setState(id + ".OPEN", true)
    if (words[6] == "stop")
        setState(id + ".STOP", true)
    if (words[6] == "down")
        setState(id + ".CLOSE", true)
    if (words[6] == "button")
        setState(id + ".SET", true)
    if (words[6] == "positionSlider")
        setState(id + ".SET", parseInt(words[7]))

    if (words[6] == "brightnessSlider")
        if (existsState(id + ".SET"))
            setState(id + ".SET", parseInt(words[7]));
        else if (existsState(id + ".ACTUAL"))
            setState(id + ".ACTUAL", parseInt(words[7]));
    //     out_msgs.push({ payload: id, action: "turn_on", domain: "lightBrightness", brightness: parseInt(words[7]) })
    // if (words[6] == "colorTempSlider")
    //     out_msgs.push({ payload: id, action: "turn_on", domain: "lightTemperature", temperature: parseInt(words[7]) })
    if (words[1] == "tempUpd") {
        setState(words[3] + ".SET", parseInt(words[4]) / 10)
    }
}

function GenerateDetailPage(type: string, entityId: string): Payload[] {

    var out_msgs: Array<Payload> = [];
    let id = entityId
    if (existsObject(id)) {
        var o = getObject(id)
        var val = null;
        if (type == "popupLight") {
            let switchVal = "0"
            if (o.common.role == "light") {
                if (existsState(id + ".GET")) {
                    val = getState(id + ".GET").val;
                    RegisterDetailEntityWatcher(id + ".GET", id, type);
                }
                else if (existsState(id + ".SET")) {
                    val = getState(id + ".SET").val;
                    RegisterDetailEntityWatcher(id + ".SET", id, type);
                }

                if (val)
                    switchVal = "1"

                out_msgs.push({ payload: "entityUpdateDetail," + switchVal + ",disable,disable,disable" })
            }

            if (o.common.role == "dimmer") {
                if (existsState(id + ".ON_ACTUAL")) {
                    val = getState(id + ".ON_ACTUAL").val;
                    RegisterDetailEntityWatcher(id + ".ON_ACTUAL", id, type);
                }

                else if (existsState(id + ".ON_SET")) {
                    val = getState(id + ".ON_SET").val;
                    RegisterDetailEntityWatcher(id + ".ON_SET", id, type);
                }

                if (val === true || val === "true")
                    switchVal = "1"
                let brightness = 0;
                if (existsState(id + ".ACTUAL")) {
                    brightness = Math.trunc(scale(getState(id + ".ACTUAL").val, 0, 100, 0, 100))
                    RegisterDetailEntityWatcher(id + ".ACTUAL", id, type);
                }
                let colortemp = "disable"
                //let attr_support_color = attr.supported_color_modes
                //if (attr_support_color.includes("color_temp"))
                // colortemp = Math.trunc(scale(attr.color_temp, attr.min_mireds, attr.max_mireds, 0, 100))

                out_msgs.push({ payload: "entityUpdateDetail," + switchVal + "," + brightness + "," + colortemp })
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

        let temperature: string = getState(config.weatherEntity + ".TEMP").val;
        let humidity = getState(config.weatherEntity + ".HUMIDITY").val;
        let u1 = getState(config.batEntity).val;
        let u2 = getState(config.pvEntity).val;

        SendToPanel(<Payload>{ payload: "weatherUpdate,?" + GetAccuWeatherIcon(parseInt(icon)) + "?" + temperature.toString() + " " + config.temperatureUnit + "?26?" + humidity + " %?Batterie?34?" + u1 + "%?PV?32?" + u2 + "W" })
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

