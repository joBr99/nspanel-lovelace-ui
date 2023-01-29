
from helper import rgb_dec565

default_screensaver_color_mapping = {
    #"item":            "color in decimal RGB565 (0-65535)"
    "background":       "0",
    "time":             "65535",
    "timeAMPM":         "65535",
    "date":             "65535",
    "tMainText":        "65535",
    "tForecast1":       "65535",
    "tForecast2":       "65535",
    "tForecast3":       "65535",
    "tForecast4":       "65535",
    "tForecast1Val":    "65535",
    "tForecast2Val":    "65535",
    "tForecast3Val":    "65535",
    "tForecast4Val":    "65535",
    "bar":              "65535",
    "tMainTextAlt2":    "65535",
    "tTimeAdd":         "65535"
}

def get_screensaver_color_output(theme, state=None):
    color_output = "color"
    for key in default_screensaver_color_mapping:
        color_output += f"~{map_color(key=key, theme=theme)}"
    return color_output

def map_color(key, theme):
    config_color = default_screensaver_color_mapping[key]
#   Use theme color if set
    if key in theme:
        config_color = rgb_dec565(theme[key])
    return config_color