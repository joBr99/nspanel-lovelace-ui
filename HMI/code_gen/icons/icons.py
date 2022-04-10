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

# write mapping lib for typescript
with open(os.path.join(__location__, "../../../iobroker", "icon_mapping.ts"), 'w') as f:
    f.write("""
export class IconsSelector {
    iconMap = new Map<string, string>([
""")
    for icon in icon_metadata:
        iconchar = chr(int(icon['hex'], 16))
        name = icon["name"]
        f.write(f"        [\"{name}\", \"{iconchar}\"],\n")
    f.write("]);\n")
    f.write("""
    GetIcon(ma_name:string):string{
        if(this.iconMap.has(ma_name)){
            return this.iconMap.get(ma_name)!;
        }
        return ""; 
    }
}

""");

# write documentation file
#with open(os.path.join(__location__, "../..","icons.md"), 'w') as f:
#    f.write("""
## Icons IDs
#This file contains the Icons IDs included in the display firmware, addressable via serial.
#
#MD Icon Name | Icon
#------------ | ----
#""")
#    for icon in icon_metadata:
#        val = icon["name"]
#        f.write(f"mdi:{val} | ![{val}](https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/0aeb4d612644d80d9d1fe242f705f362985de5dc/svg/{val}.svg)\n")
