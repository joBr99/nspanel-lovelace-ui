import json
import os

icons = [
    "alert-circle-outline",
    "lightbulb",
    "thermometer",
    "gesture-tap-button",
    "flash",
    "music",
    "check-circle-outline",
    "close-circle-outline",
    "pause",
    "play",
    "palette",
    "window-open",
    "weather-cloudy",
    "weather-fog",
    "weather-hail",
    "weather-lightning",
    "weather-lightning-rainy",
    "weather-night",
    "weather-partly-cloudy",
    "weather-pouring",
    "weather-rainy",
    "weather-snowy",
    "weather-snowy-rainy",
    "weather-sunny",
    "weather-windy",
    "weather-windy-variant",
    "water-percent",
    "power",
    "fire",
    "calendar-sync",
    "fan",
    "snowflake",
    "solar-power",
    "battery-charging-medium",
    "battery-medium",
    "shield-home"
]


__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

with open(os.path.join(__location__, "icons.json"),'r') as f:
    icon_metadata = json.load(f)

icon_nextion_string = ""
icon_name_list = []

for icon_name in icons:
    #print(icon_name)
    icon = next((item for item in icon_metadata if item["name"] == icon_name), None)
    if icon == None:
        print(f"WARNING ICON NOT FOUND: {icon_name}")
    else:
        hex = icon['hex']
        s = int(hex, 16)
        #print(chr(s), end = '')
        icon_nextion_string += chr(s)
        icon_name_list.append(icon_name)

# write mapping lib for python
with open(os.path.join(__location__, "../../../apps/nspanel-lovelace-ui", "icon_mapper.py"), 'w') as f:
    f.write("icons = {\n")
    for idx, val in enumerate(icon_name_list):
        f.write(f"    '{val}': {idx},\n")
    f.write("}\n")
    f.write("""
def get_icon_id(ma_name):
    if ma_name in icons:
        return icons[ma_name]
    else:
        return icons["alert-circle-outline"]
    """)

# write documentation file
with open(os.path.join(__location__, "../..","icons.md"), 'w') as f:
    f.write("""
# Icons IDs
This file contains the Icons IDs included in the display firmware, addressable via serial.

ID | MD Icon Name | Icon
-- | ------------ | ----
""")
    for idx, val in enumerate(icon_name_list):
        f.write(f"{idx} | {val} | ![{val}](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/{val}.svg)\n")


print("=== STRING for HMI Project ===")
print("=== Put the following string into the txt field in nextion ===")
print(icon_nextion_string)
