
from helper import rgb_dec565

default_screensaver_color_mapping = {
    #"item":            "color in decimal RGB565 (0-65535)"
    "background":       "0",
    "time":             "65535",
    "timeAMPM":         "65535",
    "date":             "65535",
    "tMainIcon":        "65535",
    "tMainText":        "65535",
    "tForecast1":       "65535",
    "tForecast2":       "65535",
    "tForecast3":       "65535",
    "tForecast4":       "65535",
    "tF1Icon":          "65535",
    "tF2Icon":          "65535",
    "tF3Icon":          "65535",
    "tF4Icon":          "65535",
    "tForecast1Val":    "65535",
    "tForecast2Val":    "65535",
    "tForecast3Val":    "65535",
    "tForecast4Val":    "65535",
    "bar":              "65535",
    "tMRIcon":          "65535",
    "tMR":              "65535",
    "tTimeAdd":         "65535"
}

default_weather_icon_color_mapping = {
    #"item-per HA"             "color in decimal RGB 565 (0-65535)"
    "clear-night":              "35957", #50% grey
    "cloudy":                   "31728", #grey-blue
    "exceptional":              "63488", #red
    "fog":                      "21130", #75% grey
    "hail":                     "65535", #white
    "lightning":                "65120", #golden-yellow
    "lightning-rainy":          "50400", #dark-golden-yellow
    "partlycloudy":             "35957", #50% grey
    "pouring":                  "249",   #blue
    "rainy":                    "33759", #light-blue
    "snowy":                    "65535", #white
    "snowy-rainy":              "44479", #light-blue-grey
    "sunny":                    "63469", #bright-yellow
    "windy":                    "35957", #50% grey
    "windy-variant":            "35957"  #50% grey
}

def get_screensaver_color_output(theme, state=None):
    color_output = "color"
    for key in default_screensaver_color_mapping:
        color_output += f"~{map_color(key=key, theme=theme, state=state)}"
    return color_output

def map_color(key, theme, state=None):
    config_color = default_screensaver_color_mapping[key]
#   Use theme color if set
    if key in theme:
        config_color = rgb_dec565(theme[key])
#   Use Autocolouring for weather
    elif state is not None:
        if key in ["tMainIcon", "tF1Icon", "tF2Icon", "tF3Icon", "tF4Icon"]:
            config_color = map_weather_icon_color(key=key, theme=theme, state=state)
    return config_color

def map_weather_icon_color(key, theme, state):
    if key in state and state[key] in theme:
        config_color = rgb_dec565(theme[state[key]])
    elif key in state and state[key] in default_weather_icon_color_mapping:
        config_color = default_weather_icon_color_mapping[state[key]]
    else:
        config_color = "65535"
    return config_color
