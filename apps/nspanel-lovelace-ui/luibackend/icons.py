from icon_mapping import get_icon_char
import apis
from helper import get_attr_safe

weather_mapping = {
    'clear-night': 'weather-night',
    'cloudy': 'weather-cloudy',
    'exceptional': 'alert-circle-outline',
    'fog': 'weather-fog',
    'hail': 'weather-hail',
    'lightning': 'weather-lightning',
    'lightning-rainy': 'weather-lightning-rainy',
    'partlycloudy': 'weather-partly-cloudy',
    'pouring': 'weather-pouring',
    'rainy': 'weather-rainy',
    'snowy': 'weather-snowy',
    'snowy-rainy': 'weather-snowy-rainy',
    'sunny': 'weather-sunny',
    'windy': 'weather-windy',
    'windy-variant': 'weather-windy-variant'
}

sensor_mapping_off = {
    "battery": "battery",
    "battery_charging": "battery",
    "carbon_monoxide": "smoke-detector",
    "cold": "thermometer",
    "connectivity": "close-network-outline",
    "door": "door-closed",
    "garage_door": "garage",
    "power": "power-plug-off",
    "gas": "checkbox-marked-circle",
    "problem": "checkbox-marked-circle",
    "safety": "checkbox-marked-circle",
    "tamper": "check-circle",
    "smoke": "smoke-detector-variant",
    "heat": "thermometer",
    "light": "brightness-5",
    "lock": "lock",
    "moisture": "water-off",
    "motion": "motion-sensor-off",
    "occupancy": "home-outline",
    "opening": "square",
    "plug": "power-plug-off",
    "presence": "home-outline",
    "running": "stop",
    "sound": "music-note-off",
    "update": "package",
    "vibration": "crop-portrait",
    "window": "window-closed",
}

sensor_mapping_on = {
    "battery": "battery-outline",
    "battery_charging": "battery-charging",
    "carbon_monoxide": "smoke-detector-alert",
    "cold": "snowflake",
    "connectivity": "check-network-outline",
    "door": "door-open",
    "garage_door": "garage-open",
    "power": "power-plug",
    "gas": "alert-circle",
    "problem": "alert-circle",
    "safety": "alert-circle",
    "tamper": "alert-circle",
    "smoke": "smoke-detector-variant-alert",
    "heat": "fire",
    "light": "brightness-7",
    "lock": "lock-open",
    "moisture": "water",
    "motion": "motion-sensor",
    "occupancy": "home",
    "opening": "square-outline",
    "plug": "power-plug",
    "presence": "home",
    "running": "play",
    "sound": "music-note",
    "update": "package-up",
    "vibration": "vibrate",
    "window": "window-open",
}

sensor_mapping = {
    "apparent_power": "flash",
    "aqi": "smog",
    "battery": "battery",
    "carbon_dioxide": "smog",
    "carbon_monoxide": "smog",
    "current": "flash",
    "date": "calendar",
    "duration": "timer",
    "energy": "flash",
    "frequency": "chart-bell-curve",
    "gas": "gas-cylinder",
    "humidity": "air-humidifier",
    "illuminance": "light",
    "monetary": "cash",
    "nitrogen_dioxide": "smog",
    "nitrogen_monoxide": "smog",
    "nitrous_oxide": "smog",
    "ozone": "smog",
    "pm1": "smog",
    "pm10": "smog",
    "pm25": "smog",
    "power_factor": "flash",
    "power": "flash",
    "pressure": "gauge",
    "reactive_power": "flash",
    "signal_strength": "signal",
    "sulphur_dioxide": "smog",
    "temperature": "thermometer",
    "timestamp": "calendar-clock",
    "volatile_organic_compounds": "smog",
    "voltage": "flash"
}

cover_mapping = {
    #"device_class": ("icon-open",             "icon-closed",    "icon-cover-open",         "icon-cover-stop", "icon-cover-close")
    "awning":        ("window-open",           "window-closed",   "arrow-up",                "stop",            "arrow-down"),
    "blind":         ("blinds-open",           "blinds",          "arrow-up",                "stop",            "arrow-down"),
    "curtain":       ("curtains",              "curtains-closed", "arrow-expand-horizontal", "stop",            "arrow-collapse-horizontal"),
    "damper":        ("checkbox-blank-circle", "circle-slice-8",  "arrow-up",                "stop",            "arrow-down"),
    "door":          ("door-open",             "door-closed",     "arrow-expand-horizontal", "stop",            "arrow-collapse-horizontal"),
    "garage":        ("garage-open",           "garage",          "arrow-up",                "stop",            "arrow-down"),
    "gate":          ("gate-open",             "gate",            "arrow-expand-horizontal", "stop",            "arrow-collapse-horizontal"),
    "shade":         ("blinds-open",           "blinds",          "arrow-up",                "stop",            "arrow-down"),
    "shutter":       ("window-shutter-open",   "window-shutter",  "arrow-up",                "stop",            "arrow-down"),
    "window":        ("window-open",           "window-closed",   "arrow-up",                "stop",            "arrow-down"),
}

simple_type_mapping = {
    'button':       'gesture-tap-button',
    'navigate':     'gesture-tap-button',
    'input_button': 'gesture-tap-button',
    'input_select': 'gesture-tap-button',
    'scene':        'palette',
    'script':       'script-text',
    'switch':       'light-switch',
    'automation':   'robot',
    'number':       'ray-vertex',
    'input_number': 'ray-vertex',
    'light':        'lightbulb',
    'fan':          'fan',
    'person':       'account',
    'vacuum':       'robot-vacuum',
    'timer':        'timer-outline'

}

alarm_control_panel_mapping = {
    'disarmed':       'shield-off',
    'armed_home':     'shield-home',
    'armed_away':     'shield-lock',
    'armed_night':    'weather-night',
    'armed_vacation': 'shield-airplane',
    'arming':         'shield',
    'pending':        'shield',
    'triggered':      'bell-ring'
}

climate_mapping = {
    'auto':       'calendar-sync',
    'heat_cool':  'calendar-sync',
    'heat':  'fire',
    'off':  'power',
    'cool':  'snowflake',
    'dry':  'water-percent',
    'fan_only':  'fan'
}

media_content_type_mapping = {
    'music': 'music',
    'tvshow': 'movie',
    'video': 'video',
    'episode': 'alert-circle-outline',
    'channel': 'alert-circle-outline',
    'playlist': 'alert-circle-outline'
}

def get_icon(ha_type, overwrite=None):
    if overwrite is not None:
        if type(overwrite) is str:
            return get_icon_char(overwrite)
    
    result_icon = "alert-circle-outline"
    if ha_type == "script":
        result_icon = "script-text"
    elif ha_type == "alarm-arm-fail":
        result_icon = "progress-alert"

    return get_icon_char(result_icon)

def get_action_icon(ha_type, action, device_class=None, overwrite=None):
    if overwrite is not None:
        return get_icon_char(overwrite)
    if ha_type == "cover":
        if action == "open":
            actionicon = cover_mapping[device_class][2] if device_class in cover_mapping else "alert-circle-outline"
        elif action == "close":
            actionicon = cover_mapping[device_class][4] if device_class in cover_mapping else "alert-circle-outline"
        elif action == "stop":
            actionicon = cover_mapping[device_class][3] if device_class in cover_mapping else "alert-circle-outline"
        else:
            actionicon = "alert-circle-outline"
    else:
        actionicon = "alert-circle-outline"
    return get_icon_char(actionicon)

def get_icon_ha(entity_id, overwrite=None, stateOverwrite=None):

    ha_type = entity_id.split(".")[0]
    if (apis.ha_api.entity_exists(entity_id)):
        entity = apis.ha_api.get_entity(entity_id)
        state = entity.state if stateOverwrite is None else stateOverwrite

    if overwrite is not None:
        if type(overwrite) is str:
            return get_icon_char(overwrite)
        if type(overwrite) is dict:
            for overwrite_state, overwrite_icon in overwrite.items():
                if overwrite_state == state:
                    return get_icon_char(overwrite_icon)

    result_icon = "alert-circle-outline"

    # icons only based on state
    if ha_type in simple_type_mapping:
        result_icon = simple_type_mapping[ha_type]
    elif ha_type == "weather":
        result_icon = weather_mapping[state] if state in weather_mapping else "alert-circle-outline"
    elif ha_type == "input_boolean":
        result_icon = "check-circle-outline" if state == "on" else "close-circle-outline"
    elif ha_type == "lock":
        result_icon = "lock-open" if state == "unlocked" else "lock"
    elif ha_type == "sun":
        result_icon = "weather-sunset-up" if state == "above_horizon" else "weather-sunset-down"
    elif ha_type == "alarm_control_panel":
        if state in alarm_control_panel_mapping:
            result_icon = alarm_control_panel_mapping[state]
    elif ha_type == "climate":
        if state in climate_mapping:
            result_icon = climate_mapping[state]
    # icons only based on state and device_class
    elif ha_type == "cover":
        device_class = get_attr_safe(entity, "device_class", "window")
        if state == "closed":
            result_icon = cover_mapping[device_class][1] if device_class in cover_mapping else "alert-circle-outline"
        else:
            result_icon = cover_mapping[device_class][0] if device_class in cover_mapping else "alert-circle-outline"
    elif ha_type == "sensor":
        device_class = get_attr_safe(entity, "device_class", "")
        result_icon = sensor_mapping[device_class] if device_class in sensor_mapping else "alert-circle-outline"
    elif ha_type == "binary_sensor":
        device_class = get_attr_safe(entity, "device_class", "")
        if state == "on":
            result_icon = "checkbox-marked-circle"
            if device_class in sensor_mapping_on:
                result_icon = sensor_mapping_on[device_class]
        else:
            result_icon = "radiobox-blank"
            if device_class in sensor_mapping_off:
                result_icon = sensor_mapping_off[device_class]
    # based on media_content_type
    elif ha_type == "media_player":
        result_icon = "speaker-off"
        if "media_content_type" in entity.attributes:
            if entity.attributes.media_content_type in media_content_type_mapping:
                result_icon = media_content_type_mapping[entity.attributes.media_content_type]

    return get_icon_char(result_icon)
