from icon_mapping import get_icon_id

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

sensor_mapping_on = {
    "door": "door-open",
}

sensor_mapping_off = {
    "door": "door-closed",
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

cover_mapping_open = {
    "awning": "window-open",
    "blind": "blinds-open",
    "curtain": "curtains-closed",
    "damper": "checkbox-blank-circle",
    "door": "door-open",
    "garage": "garage-open",
    "gate": "gate-open",
    "shade": "blinds-open",
    "shutter": "window-shutter-open",
    "window": "window-open"
}

cover_mapping_closed = {
    "awning": "window-closed",
    "blind": "blinds",
    "curtain": "curtains",
    "damper": "circle-slice-8",
    "door": "door-closed",
    "garage": "garage",
    "gate": "gate",
    "shade": "blinds",
    "shutter": "window-shutter",
    "window": "window-closed"
}

cover_mapping_action_open = {
    "awning":   "arrow-up",
    "blind":    "arrow-up",
    "curtain":  "arrow-expand-horizontal",
    "damper":   "arrow-up",
    "door":     "arrow-expand-horizontal",
    "garage":   "arrow-up",
    "gate":     "arrow-expand-horizontal",
    "shade":    "arrow-up",
    "shutter":  "arrow-up",
    "window": "arrow-up"
}

cover_mapping_action_close = {
    "awning": "arrow-down",
    "blind": "arrow-down",
    "curtain": "arrow-collapse-horizontal",
    "damper": "arrow-down",
    "door": "arrow-collapse-horizontal",
    "garage": "arrow-down",
    "gate": "arrow-collapse-horizontal",
    "shade":  "arrow-down",
    "shutter": "arrow-down",
    "window": "arrow-down"
}

cover_mapping_action_stop = {
    "awning": "stop",
    "blind": "stop",
    "curtain": "stop",
    "damper": "stop",
    "door": "stop",
    "garage": "stop",
    "gate": "stop",
    "shade": "stop",
    "shutter": "stop",
    "window": "stop"
}

def map_to_mdi_name(ha_type, state=None, device_class=None, cardType=None):
    if ha_type == "weather":
        return weather_mapping[state] if state in weather_mapping else "alert-circle-outline"
    if ha_type == "button":
        return "gesture-tap-button"
    if ha_type == "scene":
        return "palette"
    if ha_type == "script":
        return "script-text"
    if ha_type == "switch":
        return "light-switch"
    if ha_type == "number":
        return "ray-vertex"
    if ha_type == "light":
        return "lightbulb"
    if ha_type == "fan":
        return "fan"
    if ha_type == "input_boolean":
        return "check-circle-outline" if state == "on" else "close-circle-outline"
    if ha_type == "cover":
        if state == "closed":
            return cover_mapping_closed[device_class] if device_class in cover_mapping_closed else "alert-circle-outline"
        else:
            return cover_mapping_open[device_class] if device_class in cover_mapping_open else "alert-circle-outline"
    if ha_type == "lock":
        return "lock-open" if state == "unlocked" else "lock"

    elif ha_type == "sensor":
        if state == "on":
            return sensor_mapping_on[device_class] if device_class in sensor_mapping_on else "alert-circle-outline"
        elif state == "off":
            return sensor_mapping_off[device_class] if device_class in sensor_mapping_off else "alert-circle-outline"
        else:
            return sensor_mapping[device_class] if device_class in sensor_mapping else "alert-circle-outline"

    return "alert-circle-outline"

def get_icon_id_ha(ha_name, state=None, device_class=None, overwrite=None):
    if overwrite is not None:
        return get_icon_id(overwrite)
    return get_icon_id(map_to_mdi_name(ha_name, state, device_class))

def get_action_id_ha(ha_type, action, device_class=None, overwrite=None):
    if overwrite is not None:
        return get_icon_id(overwrite)
    if ha_type == "cover":
        if action == "open":
            actionicon = cover_mapping_action_open[device_class] if device_class in cover_mapping_action_open else "alert-circle-outline"
        elif action == "close":
            actionicon = cover_mapping_action_close[device_class] if device_class in cover_mapping_action_close else "alert-circle-outline"
        elif action == "stop":
            actionicon = cover_mapping_action_stop[device_class] if device_class in cover_mapping_action_stop else "alert-circle-outline"
        else:
            actionicon = "alert-circle-outline"
    else:
        actionicon = "alert-circle-outline"
    return get_icon_id(actionicon)
