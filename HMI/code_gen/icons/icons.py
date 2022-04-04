import json
import os

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

with open(os.path.join(__location__, "icons.json"),'r') as f:
    icon_metadata = json.load(f)



# write mapping lib for python
with open(os.path.join(__location__, "../../../apps/nspanel-lovelace-ui/luibackend", "icon_mapping.py"), 'w') as f:
    f.write("icons = {\n")
    for icon in icon_metadata:
        iconchar = chr(int(icon['hex'], 16))
        name = icon["name"]
        f.write(f"    '{name}': '{iconchar}',\n")
    f.write("}\n")
    f.write("""
def get_icon_id(ma_name):
    ma_name = ma_name.replace("mdi:","")
    if ma_name in icons:
        return icons[ma_name]
    else:
        return icons["alert-circle-outline"]
    """)

#icon_nextion_string = ""
#icon_name_list = []
#
#for icon_name in icons:
#    #print(icon_name)
#    icon = next((item for item in icon_metadata if item["name"] == icon_name), None)
#    #if icon is None:
#    #    print(f"WARNING ICON NOT FOUND: {icon_name}")
#    #else:
#    #    hex = icon['hex']
#    #    s = int(hex, 16)
#    #    #print(chr(s), end = '')
#    #    icon_nextion_string += chr(s)
#    #    icon_name_list.append(icon_name)
#
## write mapping lib for python
#with open(os.path.join(__location__, "../../../apps/nspanel-lovelace-ui/luibackend", "icon_mapping.py"), 'w') as f:
#    f.write("icons = {\n")
#    for idx, val in enumerate(icon_name_list):
#        f.write(f"    '{val}': {idx},\n")
#    f.write("}\n")
#    f.write("""
#def get_icon_id(ma_name):
#    if ma_name in icons:
#        return icons[ma_name]
#    else:
#        return icons["alert-circle-outline"]
#    """)
#
## write documentation file
#with open(os.path.join(__location__, "../..","icons.md"), 'w') as f:
#    f.write("""
## Icons IDs
#This file contains the Icons IDs included in the display firmware, addressable via serial.
#
#ID | MD Icon Name | Icon
#-- | ------------ | ----
#""")
#    for idx, val in enumerate(icon_name_list):
#        f.write(f"{idx} | {val} | ![{val}](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/{val}.svg)\n")
#
#
#print("=== STRING for HMI Project ===")
#print("=== Put the following string into the txt field in nextion ===")
#print(icon_nextion_string)
#