
default_screensaver_color_mapping = {
    #"item":            "color in decimal RGB565 (1-65535)"
    "background":       "0",
    "time":             "1111",
    "timeAMPM":         "65535",
    "date":             "65535",
    "tMainIcon":         "65535",
    "tMainText":         "65535",
    "tForecast1":        "65535",
    "tForecast2":        "65535",
    "tForecast3":        "65535",
    "tForecast4":        "65535",
    "tF1Icon":           "65535",
    "tF2Icon":           "65535",
    "tf3Icon":           "65535",
    "tf4Icon":           "65535",
    "tForecast1Val":     "65535",
    "tForecast2Val":     "65535",
    "tForecast3Val":     "65535",
    "tForecast4Val":     "65535",
    "bar":              "65535",
    "tMainIconAlt":     "65535",
    "tMainTextAlt":     "65535",
    "tMRIcon":          "65535",
    "tMR":              "65535"
}


def map_color(key, theme= None, state=None):
#    read theme for override
    if theme is not None and key in theme:
        config_color = theme[key]
    else:
        config_color = default_screensaver_color_mapping[key]
    return config_color

def get_screensaver_color_output(theme=None):
    color_output = "color"
    for key in default_screensaver_color_mapping:
        color_output += f"~{map_color(key=key, theme=theme)}"
    return color_output
