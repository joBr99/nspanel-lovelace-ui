icons = {
    'alert-circle-outline': 0,
    'lightbulb': 1,
    'thermometer': 2,
    'gesture-tap-button': 3,
    'flash': 4,
    'music': 5,
    'check-circle-outline': 6,
    'close-circle-outline': 7,
    'pause': 8,
    'play': 9,
    'palette': 10,
    'window-open': 11,
    'weather-cloudy': 12,
    'weather-fog': 13,
    'weather-hail': 14,
    'weather-lightning': 15,
    'weather-lightning-rainy': 16,
    'weather-night': 17,
    'weather-partly-cloudy': 18,
    'weather-pouring': 19,
    'weather-rainy': 20,
    'weather-snowy': 21,
    'weather-snowy-rainy': 22,
    'weather-sunny': 23,
    'weather-windy': 24,
    'weather-windy-variant': 25,
    'water-percent': 26,
    'power': 27,
    'fire': 28,
    'calendar-sync': 29,
    'fan': 30,
    'snowflake': 31,
    'solar-power': 32,
    'battery-charging-medium': 33,
    'battery-medium': 34,
    'shield-home': 35,
    'door-open': 36,
    'door-closed': 37,
    'window-closed': 38,
}

def get_icon_id(ma_name):
    if ma_name in icons:
        return icons[ma_name]
    else:
        return icons["alert-circle-outline"]
    