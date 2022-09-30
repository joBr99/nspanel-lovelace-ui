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
import apis
def get_icon_id(ma_name):
    if "text:" in ma_name:
        return ma_name.replace("text:","")
    if "ha:" in ma_name:
        return apis.ha_api.render_template(ma_name.replace("ha:",""))
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

# write mapping lib for python
with open(os.path.join(__location__, "../../../ip-symcon", "icon_mapping.php"), 'w') as f:
    f.write("$icons = [\n")
    for icon in icon_metadata:
        iconchar = chr(int(icon['hex'], 16))
        name = icon["name"]
        f.write(f"    \"{name}\" => \"{iconchar}\",\n")
    f.write("];\n")
    f.write("""

function get_icon($name) {
  global $icons;
  if (strpos('text:', $name) !== false) {
    return str_replace('text:', "", $name);
  }
  $ma_name = str_replace('mdi:', "", $name);
  if (array_key_exists($ma_name, $icons)) {
    return $icons[$ma_name];
  }else{
    return $icons["alert-circle-outline"];
  }
}

    """)