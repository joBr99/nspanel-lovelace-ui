import datetime
import dateutil.parser as dp
import time

import apis

from theme import get_screensaver_color_output
from icon_mapping import get_icon_id
from icons import get_icon, get_icon_ha
from icons import get_action_icon
from helper import scale, rgb_dec565, rgb_brightness, get_attr_safe, convert_temperature
from localization import get_translation
from config import Entity

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
    import babel.dates

class LuiPagesGen(object):

    def __init__(self, config, send_mqtt_msg):
        self._config = config
        self._locale  = config.get("locale")
        self._send_mqtt_msg = send_mqtt_msg
    
    def get_entity_color(self, entity, ha_type=None, stateOverwrite=None, overwrite=None):
        if overwrite is not None:
            if type(overwrite) in [str, list]:
                return rgb_dec565(overwrite)
            if type(overwrite) is dict:
                state = entity.state
                for overwrite_state, overwrite_val in overwrite.items():
                    if overwrite_state == state:
                        return rgb_dec565(overwrite_val)
        if isinstance(entity, str):
            default_color = rgb_dec565([68, 115, 158])
            return default_color
        else:
            state = entity.state
            if stateOverwrite is not None:
                state = stateOverwrite
            attr = entity.attributes
            default_color_on  = rgb_dec565([253, 216, 53])
            default_color_off = rgb_dec565([68, 115, 158])
            icon_color = default_color_on if state in ["on", "unlocked", "above_horizon", "home", "active"] else default_color_off

            if ha_type == "alarm_control_panel":
                if state == "disarmed":
                    icon_color = rgb_dec565([13,160,53])
                if state == "arming":
                    icon_color = rgb_dec565([244,180,0])
                if state in ["armed_home", "armed_away", "armed_night", "armed_vacation", "pending", "triggered"]:
                    icon_color = rgb_dec565([223,76,30])

            if ha_type == "climate":
                if state in ["auto", "heat_cool"]:
                    icon_color = 1024
                if state == "heat":
                    icon_color = 64512
                if state == "off":
                    icon_color = 35921
                if state == "cool":
                    icon_color = 11487
                if state == "dry":
                    icon_color = 60897
                if state == "fan_only":
                    icon_color = 35921

            if ha_type == "weather":
                if state in ["partlycloudy", "windy"]:
                    icon_color = 38066 #50% grey
                if state == "clear-night":
                    icon_color = 38060 #yellow grey
                if state == "windy-variant":
                    icon_color: 64495 #red grey
                if state == "cloudy":
                    icon_color = 31728 #grey-blue
                if state == "exceptional":
                    icon_color = 63878 #red
                if state == "fog":
                    icon_color = 38066 #75% grey
                if state in ["hail", "snowy"]: 
                    icon_color = 65535 #white
                if state == "lightning":
                    icon_color = 65120 #golden-yellow
                if state == "lightning-rainy":
                    icon_color = 50400 #dark-golden-yellow
                if state == "pouring":
                    icon_color = 12703 #blue
                if state == "rainy":
                    icon_color = 25375 #light-blue
                if state == "snowy-rainy":
                    icon_color = 38079 #light-blue-grey
                if state == "sunny":
                    icon_color = 65504 #bright-yellow

            if "rgb_color" in attr and attr.rgb_color:
                color = attr.rgb_color
                if "brightness" in attr and attr.brightness:
                    color = rgb_brightness(color, attr.brightness)
                icon_color = rgb_dec565(color)
            elif "brightness" in attr and attr.brightness:
                color = rgb_brightness([253, 216, 53], attr.brightness)
                icon_color = rgb_dec565(color)
            return icon_color


    def update_time(self, kwargs):
        time = datetime.datetime.now().strftime(self._config.get("timeFormat"))
        addTemplate = self._config.get("timeAdditionalTemplate")
        addTimeText = apis.ha_api.render_template(addTemplate)
        self._send_mqtt_msg(f"time~{time}~{addTimeText}")

    def update_date(self, kwargs):
        global babel_spec
        if babel_spec is not None:
            dateformat = self._config.get("dateFormatBabel")
            date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=self._locale)
        else:
            dateformat = self._config.get("dateFormat")
            date = datetime.datetime.now().strftime(dateformat)
            
        addTemplate = self._config.get("dateAdditionalTemplate")
        addDateText = apis.ha_api.render_template(addTemplate)
        self._send_mqtt_msg(f"date~{date}{addDateText}")

    def page_type(self, target_page):
        if target_page == "cardUnlock":
            target_page = "cardAlarm"
        self._send_mqtt_msg(f"pageType~{target_page}")
    
    def update_screensaver_weather(self, theme):
        entities = self._config._config_screensaver.entities

        # default screensaver based on configured entity
        if len(entities) == 0:
            entities.append(self._config._config_screensaver.entity)
            for i in range(0,4):
                entities.append(Entity({'entity': f'{self._config._config_screensaver.entity.entityId}','type': i}))

        item_str = ""
        for item in entities:
            item_str += self.generate_entities_item(item, "cardEntities", mask=["type", "entityId"])
    
        self._send_mqtt_msg(f"weatherUpdate{item_str}")
        # send color if configured in screensaver
        if theme is not None:
            self._send_mqtt_msg(get_screensaver_color_output(theme=theme))

    def update_status_icons(self):
        status_res = ""
        altfont = ""
        for i in range(1,3):
            statusIcon = self._config._config_screensaver.raw_config.get(f"statusIcon{i}")
            if statusIcon is not None and apis.ha_api.entity_exists(statusIcon.get("entity","")):
                icon = statusIcon.get("icon")
                entity = apis.ha_api.get_entity(statusIcon.get("entity"))
                entityType = statusIcon.get("entity").split(".")[0]
                icon = get_icon_ha(statusIcon.get("entity"), overwrite=icon)
                color = self.get_entity_color(entity, ha_type=entityType, overwrite=statusIcon.get("color", None))
                status_res += f"~{icon}~{color}"
                altfont += f'~{statusIcon.get("altFont", "")}'
            else:
                status_res += "~~"
                altfont += "~"
        self._send_mqtt_msg(f"statusUpdate{status_res}{altfont}")

    def generate_entities_item(self, item, cardType="cardGrid", temp_unit="", mask=None):
        entityId = item.entityId
        icon = item.iconOverride
        colorOverride = item.colorOverride
        name = item.nameOverride
        uuid = item.uuid
        
        # check ha template for name
        if item.nameOverride is not None and ("{" in item.nameOverride and "}" in item.nameOverride):
            name = apis.ha_api.render_template(item.nameOverride)
        
        # type of the item is the string before the "." in the entityId
        if entityId is not None:
            entityType = entityId.split(".")[0]
        else:
            entityType = "delete"

        apis.ha_api.log(f"Generating item for {entityId} with type {entityType}", level="DEBUG")

        status_entity = apis.ha_api.get_entity(item.status) if item.status and apis.ha_api.entity_exists(item.status) else None
        status_state = status_entity.state if status_entity is not None else None

        entity = apis.ha_api.get_entity(entityId) if apis.ha_api.entity_exists(entityId) else None
        entity_state = entity.state if entity is not None else None

        state = status_state if status_state is not None else entity_state

        if state is not None:
            if item.condState is not None and item.condState != state:
                return ""
            if item.condStateNot is not None and item.condStateNot == state:
                return ""
        if item.condTemplate is not None and apis.ha_api.render_template(item.condTemplate):
            return ""

        # Internal types
        if entityType == "delete":
            return f"~{entityType}~~~~~"
        if entityType == "navigate":
            page_search_res = self._config.search_card(entityId)
            if page_search_res is not None:
                name = name if name is not None else page_search_res.title
                text = get_translation(self._locale, "frontend.ui.card.button.press")
                if status_entity:
                    icon_res = get_icon_ha(item.status, overwrite=icon)
                    icon_color = self.get_entity_color(status_entity, ha_type=item.status.split(".")[0], overwrite=colorOverride)
                    if item.status.startswith("sensor") and (cardType == "cardGrid" or cardType == "cardGrid2") and item.iconOverride is None:
                        icon_res = status_entity.state[:4]
                        if icon_res[-1] == ".":
                            icon_res = icon_res[:-1]
                else:
                    #icon_color = rgb_dec565(colorOverride) if colorOverride is not None and type(colorOverride) is list else 17299
                    icon_color = self.get_entity_color(entityId, overwrite=colorOverride)
                    icon_res = get_icon_ha(entityId, overwrite=icon)
                return f"~button~{entityId}~{icon_res}~{icon_color}~{name}~{text}"
            else:
                return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~page not found~"
        if entityType == "iText":
            value   = entityId.split(".", 2)[1]
            name = name if name is not None else "conf name missing"
            icon_color = icon_color = rgb_dec565(colorOverride) if colorOverride is not None and type(colorOverride) is list else 17299
            icon_res = get_icon_id(icon) if icon is not None else get_icon_id("alert-circle-outline")
            return f"~text~{entityId}~{icon_res}~{icon_color}~{name}~{value}"
        if entityType == "service":
            icon_id = get_icon("script", overwrite=icon)
            text = get_translation(self._locale, "frontend.ui.card.script.run")
            icon_color = icon_color = rgb_dec565(colorOverride) if colorOverride is not None and type(colorOverride) is list else 17299
            if status_entity:
                icon_id = get_icon_ha(item.status, overwrite=icon)
                icon_color = self.get_entity_color(status_entity, ha_type=item.status.split(".")[0], overwrite=colorOverride)
                if item.status.startswith("sensor") and (cardType == "cardGrid" or cardType == "cardGrid2") and item.iconOverride is None:
                    icon_id = status_entity.state[:4]
                    if icon_id[-1] == ".":
                        icon_id = icon_id[:-1]
            return f"~button~{uuid}~{icon_id}~{icon_color}~{name}~{text}"

        if entity is None:
            return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~Not found check~ apps.yaml"

        
        # HA Entities
        # common res vars
        entityTypePanel = "text"
        icon_id = get_icon_ha(entityId, overwrite=icon)
        color = self.get_entity_color(entity, ha_type=entityType, overwrite=colorOverride)
        value = ""
        name = name if name is not None else entity.attributes.get("friendly_name","unknown")

        if entityType == "cover":
            entityTypePanel = "shutter"
            device_class = entity.attributes.get("device_class", "window")
            icon_id = get_icon_ha(entityId, overwrite=icon)
            icon_up   = ""
            icon_stop = ""
            icon_down = ""
            icon_up_status = "disable"
            icon_stop_status = "disable"
            icon_down_status = "disable"
            bits = entity.attributes.supported_features
            pos = entity.attributes.get("current_position")
            if pos is None:
                pos_status = entity.state
                pos = "disable"
            else:
                pos_status = pos
            if bits & 0b00000001: # SUPPORT_OPEN
                if ( pos != 100 and not (entity.state == "open" and pos == "disable") ) or item.assumedState:
                    icon_up_status = "enable"
                icon_up   = get_action_icon(ha_type=entityType, action="open", device_class=device_class)
            if bits & 0b00000010: # SUPPORT_CLOSE
                if ( pos != 0 and not (entity.state == "closed" and pos == "disable") ) or item.assumedState:
                    icon_down_status = "enable"
                icon_down = get_action_icon(ha_type=entityType, action="close", device_class=device_class)
            if bits & 0b00001000: # SUPPORT_STOP
                icon_stop = get_action_icon(ha_type=entityType, action="stop", device_class=device_class)
                icon_stop_status = "enable"
            value = f"{icon_up}|{icon_stop}|{icon_down}|{icon_up_status}|{icon_stop_status}|{icon_down_status}"
        elif entityType in "light":
            entityTypePanel = "light"
            value = 1 if entity.state == "on" else 0
        elif entityType in ["switch", "input_boolean", "automation"]:
            entityTypePanel = "switch"
            value = 1 if entity.state == "on" else 0
        elif entityType in "fan":
            entityTypePanel = "fan"
            value = 1 if entity.state == "on" else 0
        elif entityType in ["sensor", "binary_sensor"]:
            entityTypePanel = "text"
            device_class = entity.attributes.get("device_class", "")
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            value = entity.state
            
            # limit value to 4 chars on us-p
            if self._config.get("model") == "us-p" and cardType == "cardEntities":
                value = entity.state[:4]
                if value[-1] == ".":
                    value = value[:-1]
                    
            if device_class != "temperature":
                value = value + " "
            value = value + unit_of_measurement
            if entityType == "binary_sensor":
                value = get_translation(self._locale, f"backend.component.binary_sensor.state.{device_class}.{entity.state}")
            if (cardType == "cardGrid" or cardType == "cardGrid2") and entityType == "sensor" and icon is None:
                icon_id = entity.state[:4]
                if icon_id[-1] == ".":
                    icon_id = icon_id[:-1]
            else:
                icon_id = get_icon_ha(entityId, overwrite=icon)
        elif entityType in ["button", "input_button"]:
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.button.press")
        elif entityType == "scene":
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.scene.activate")
        elif entityType == "script":
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.script.run")
        elif entityType == "lock":
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.lock.lock") if entity.state == "unlocked" else get_translation(self._locale, "frontend.ui.card.lock.unlock")
        elif entityType in ["number", "input_number"]:
            entityTypePanel = "number"
            min_v = entity.attributes.get("min", 0)
            max_v = entity.attributes.get("max", 100)
            value = f"{entity.state}|{min_v}|{max_v}"
        elif entityType == "input_text":
            entityTypePanel = "text"
            value = entity.state
        elif entityType in ["input_select", "select"]:
            entityTypePanel = "input_sel"
            value = entity.state
        elif entityType == "vacuum":
            entityTypePanel = "button"
            if entity.state == "docked":
                value = get_translation(self._locale, f"frontend.ui.card.vacuum.actions.start_cleaning")
            else:
                value = get_translation(self._locale, f"frontend.ui.card.vacuum.actions.return_to_base")
        elif entityType == "alarm_control_panel":
            entityTypePanel = "text"
            value = get_translation(self._locale, f"frontend.state_badge.alarm_control_panel.{entity.state}")
        elif entityType == "media_player":
            entityTypePanel = "media_pl"
            value = entity.state
        elif entityType == "sun":
            entityTypePanel = "text"
            value = get_translation(self._locale, f"backend.component.sun.state._.{entity.state}")
        elif entityType == "person":
            entityTypePanel = "text"
            value = get_translation(self._locale, f"backend.component.person.state._.{entity.state}")
        elif entityType == "climate":
            entityTypePanel = "text"
            state_value  = get_translation(self._locale, f"backend.component.climate.state._.{entity.state}")
            temperature = get_attr_safe(entity, "temperature", "")
            temperature_unit = "°C" if(temp_unit == "celsius") else "°F"
            value = f"{state_value} {temperature}{temperature_unit}"
            currently_tanslation = get_translation(self._locale, f"frontend.ui.card.climate.currently")
            current_temperature = get_attr_safe(entity, "current_temperature", "")
            value += f"\r\n{currently_tanslation}: {current_temperature}{temperature_unit}"
        elif entityType == "timer":
            entityTypePanel = "timer"
            value = get_translation(self._locale, f"backend.component.timer.state._.{entity.state}")
        elif entityType == "weather":
            entityTypePanel = "text"
            unit = get_attr_safe(entity, "temperature_unit", "")
            if type(item.stype) == int and len(entity.attributes.forecast) >= item.stype:
                fdate = dp.parse(entity.attributes.forecast[item.stype]['datetime'])
                global babel_spec
                if babel_spec is not None:
                    dateformat = "E" if item.nameOverride is None else item.nameOverride
                    name = babel.dates.format_datetime(fdate.astimezone(), dateformat, locale=self._locale)
                else:
                    dateformat = "%a" if item.nameOverride is None else item.nameOverride
                    name = fdate.astimezone().strftime(dateformat)
                icon_id = get_icon_ha(entityId, stateOverwrite=entity.attributes.forecast[item.stype]['condition'])
                value = f'{entity.attributes.forecast[item.stype].get("temperature", "")}{unit}'
                color = self.get_entity_color(entity, ha_type=entityType, stateOverwrite=entity.attributes.forecast[item.stype]['condition'], overwrite=colorOverride)
            else:
                value = f'{get_attr_safe(entity, "temperature", "")}{unit}'
        else:
            name = "unsupported"
        # Overwrite for value
        ovalue = item.value
        if ovalue is not None:
            splitted_string = ovalue.rpartition('}')
            template_string = f"{splitted_string[0]}{splitted_string[1]}"
            templates_result = apis.ha_api.render_template(template_string)
            value = f"{templates_result}{splitted_string[2]}"
        if self._locale == "he_IL" and any("\u0590" <= c <= "\u05EA" for c in name):
            name = name[::-1]
        # use uuid instead for some types and probably expand on this in future
        if entityType in ["light"]:
            entityId = uuid
        # remove stuff defined in mask
        if mask is not None:
            if "type" in mask:
                entityTypePanel = ""
            if "entityId" in mask:
                entityId = ""
        # change font on cardgrid
        if item.font:
            font = 0
            if item.font == "small":
                font = 0
            elif item.font == "medium-icon":
                font = 1
            elif item.font == "medium":
                font = 2
            elif item.font == "large":
                font = 3
            elif isinstance(item.font, int):
                font = item.font
            icon_id = f'{icon_id}¬{font}'
        return f"~{entityTypePanel}~{entityId}~{icon_id}~{color}~{name}~{value}"

    def generate_entities_page(self, navigation, heading, items, cardType, tempUnit):
        command = f"entityUpd~{heading}~{navigation}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item, cardType, tempUnit)
        self._send_mqtt_msg(command)

    def generate_thermo_page(self, navigation, title, entity, temp_unit, overwrite_supported_modes):
        item = entity.entityId

        if(temp_unit == "celsius"):
            temperature_unit_icon = get_icon_id("temperature-celsius")
            temperature_unit = "°C"

        else:
            temperature_unit_icon = get_icon_id("temperature-fahrenheit")
            temperature_unit = "°F"

        if not apis.ha_api.entity_exists(item):
            command = f"entityUpd~Not found~{navigation}~{item}~check~220~apps.yaml~150~300~5~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Please~your~~"
        else:
            entity       = apis.ha_api.get_entity(item)
            heading      = title if title != "unknown" else entity.attributes.friendly_name
            current_temp = get_attr_safe(entity, "current_temperature", "")
            dest_temp    = get_attr_safe(entity, "temperature", None)
            dest_temp2   = ""
            if dest_temp is None:
                dest_temp    = get_attr_safe(entity, "target_temp_high", 0)
                dest_temp2   = get_attr_safe(entity, "target_temp_low", None)
                if dest_temp2 != None and dest_temp2 != "null":
                    dest_temp2   = int(dest_temp2*10)
                else:
                    dest_temp2 = ""
            dest_temp    = int(dest_temp*10)

            hvac_action  = get_attr_safe(entity, "hvac_action", "")
            state_value  = ""
            if hvac_action != "":
                state_value = get_translation(self._locale, f"frontend.state_attributes.climate.hvac_action.{hvac_action}")
                state_value += "\r\n("
            state_value += get_translation(self._locale, f"backend.component.climate.state._.{entity.state}")
            if hvac_action != "":
                state_value += ")"
            
            min_temp     = int(get_attr_safe(entity, "min_temp", 0)*10)
            max_temp     = int(get_attr_safe(entity, "max_temp", 0)*10)
            step_temp    = int(get_attr_safe(entity, "target_temp_step", 0.5)*10) 
            icon_res_list = []
            icon_res = ""

            hvac_modes = get_attr_safe(entity, "hvac_modes", [])
            if overwrite_supported_modes is not None:
                hvac_modes = overwrite_supported_modes
            for mode in hvac_modes:
                icon_id = get_icon_ha(item, stateOverwrite=mode)
                color_on = 64512
                if mode in ["auto", "heat_cool"]:
                    color_on = 1024
                if mode == "heat":
                    color_on = 64512
                if mode == "off":
                    color_on = 35921
                if mode == "cool":
                    color_on = 11487
                if mode == "dry":
                    color_on = 60897
                if mode == "fan_only":
                    color_on = 35921
                state = 0
                if(mode == entity.state):
                    state = 1
                
                icon_res_list.append(f"~{icon_id}~{color_on}~{state}~{mode}")

            icon_res = "".join(icon_res_list)

            if len(icon_res_list) == 1 and not self._config.get("model") == "us-p":
                icon_res = "~"*4 + icon_res_list[0] + "~"*4*6
            elif len(icon_res_list) == 2 and not self._config.get("model") == "us-p":
                icon_res = "~"*4*2 + icon_res_list[0] + "~"*4*2 + icon_res_list[1] + "~"*4*2
            elif len(icon_res_list) == 3 and not self._config.get("model") == "us-p":
                icon_res = "~"*4*2 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4
            elif len(icon_res_list) == 4 and not self._config.get("model") == "us-p":
                icon_res = "~"*4 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4 + icon_res_list[3]
            elif len(icon_res_list) >= 5 or self._config.get("model") == "us-p":
                icon_res = "".join(icon_res_list) + "~"*4*(8-len(icon_res_list))
            
            currently_translation = get_translation(self._locale, "frontend.ui.card.climate.currently")
            state_translation = get_translation(self._locale, "frontend.ui.panel.config.devices.entities.state")
            action_translation = get_translation(self._locale, "frontend.ui.card.climate.operation").replace(' ','\r\n')
            
            detailPage = "1"
            if any(x in ["preset_modes", "swing_modes", "fan_modes"] for x in entity.attributes):
                detailPage = "0"

            command = f"entityUpd~{heading}~{navigation}~{item}~{current_temp} {temperature_unit}~{dest_temp}~{state_value}~{min_temp}~{max_temp}~{step_temp}{icon_res}~{currently_translation}~{state_translation}~{action_translation}~{temperature_unit_icon}~{dest_temp2}~{detailPage}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, navigation, title, entity, entities, mediaBtn):
        entityId = entity.entityId
        if entity.status is not None:
            entityId = entity.status
        if not apis.ha_api.entity_exists(entityId):
            command = f"entityUpd~Not found~{navigation}~{entityId}~Please check your~~apps.yaml in AppDaemon~~0~{get_icon_id('alert-circle-outline')}~~"
        else:
            media_icon = self.generate_entities_item(entity, "cardGrid")
            ha_entity     = apis.ha_api.get_entity(entityId)
            heading       = title if title != "unknown" else ha_entity.attributes.friendly_name
            title         = get_attr_safe(ha_entity, "media_title", "")
            author        = get_attr_safe(ha_entity, "media_artist", "")
            volume        = int(get_attr_safe(ha_entity, "volume_level", 0)*100)
            iconplaypause = get_icon_id("pause") if ha_entity.state == "playing" else get_icon_id("play")
            bits = ha_entity.attributes.supported_features
            onoffbutton = "disable"
            if bits & 0b10000000:
                if ha_entity.state == "off":
                    onoffbutton = 1374
                else:
                    onoffbutton = rgb_dec565([255,152,0])
            shuffleBtn = "disable"
            if bits & 0b100000000000000:
                shuffle = get_attr_safe(ha_entity, "shuffle", "")
                if shuffle == False:
                    shuffleBtn = get_icon_id('shuffle-disabled')
                elif shuffle == True:
                    shuffleBtn = get_icon_id('shuffle')

            item_str = ""
            for item in entities:
                item_str += self.generate_entities_item(item, "cardGrid")
            
            bck_override = entity.iconOverride
            if entity.status is not None:
                bck_entity = entity.entityId
                entity.entityId = entity.status

            entity.iconOverride = "mdi:speaker"
            item_str += self.generate_entities_item(entity, "cardGrid")
            
            entity.iconOverride = bck_override
            if entity.status is not None:
                entity.entityId = bck_entity

            command = f"entityUpd~{heading}~{navigation}~{entityId}~{title}~~{author}~~{volume}~{iconplaypause}~{onoffbutton}~{shuffleBtn}{media_icon}{item_str}"
        self._send_mqtt_msg(command)
        
    def generate_alarm_page(self, navigation, title, entity, overwrite_supported_modes, alarmBtn):
        item = entity.entityId
        if not apis.ha_api.entity_exists(item):
            command = f"entityUpd~Not found~{navigation}~{item}~Not found~Not found~Check your~Check your~apps.~apps.~yaml~yaml~0~~0"
        else:
            entity = apis.ha_api.get_entity(item)
            icon = get_icon_id("shield-off")
            color = rgb_dec565([255,255,255])
            supported_modes = []
            numpad = "enable"
            if entity.state == "disarmed":
                color = rgb_dec565([13,160,53])
                icon = get_icon_id("shield-off")
                if not entity.attributes.get("code_arm_required", False):
                    numpad = "disable"
                if overwrite_supported_modes is None:
                    bits = entity.attributes.supported_features
                    if bits & 0b000001:
                        supported_modes.append("arm_home")
                    if bits & 0b000010:
                        supported_modes.append("arm_away")
                    if bits & 0b000100:
                        supported_modes.append("arm_night")
                    if bits & 0b100000:
                        supported_modes.append("arm_vacation")
                else:
                    supported_modes = overwrite_supported_modes
            else:
                supported_modes.append("disarm")

            if entity.state == "armed_home":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-home")
            if entity.state == "armed_away":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-lock")
            if entity.state == "armed_night":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("weather-night")
            if entity.state == "armed_vacation":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-airplane")

            flashing = "disable"
            if entity.state in ["arming", "pending"]:
                color = rgb_dec565([243,179,0])
                icon = get_icon_id("shield")
                flashing = "enable"
            if entity.state == "triggered":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("bell-ring")
                flashing = "enable"

            #add button to show sensor state
            add_btn = ""
            if "open_sensors" in entity.attributes and entity.attributes.open_sensors is not None:
                add_btn=f"{get_icon_id('progress-alert')}~{rgb_dec565([243,179,0])}~"
            if alarmBtn is not None and type(alarmBtn) is dict:
                entity  = alarmBtn.get("entity")
                iconnav = get_icon("alarm-arm-fail", overwrite=alarmBtn.get("icon"))
                status  = alarmBtn.get("status")
                if status is not None and apis.ha_api.entity_exists(status):
                    icon_color = self.get_entity_color(apis.ha_api.get_entity(status))
                else:
                    icon_color = rgb_dec565([243,179,0])
                add_btn=f"{iconnav}~{icon_color}~{entity}"
                
                
            # add padding to arm buttons
            arm_buttons = ""
            for b in supported_modes:
                modeName = f"frontend.ui.card.alarm_control_panel.{b}"
                arm_buttons += f"~{get_translation(self._locale, modeName)}~{b}"
            if len(supported_modes) < 4:
                arm_buttons += "~"*((4-len(supported_modes))*2)
            command = f"entityUpd~{title}~{navigation}~{item}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}~{add_btn}"
        self._send_mqtt_msg(command)
        
    def generate_unlock_page(self, navigation, item, title, destination, pin):
        color = rgb_dec565([255,0,0])
        icon = get_icon_id("lock")
        supported_modes = ["cardUnlock-unlock"]
        
        # add padding to arm buttons
        arm_buttons = ""
        for b in supported_modes:
            arm_buttons += f'~{get_translation(self._locale, "frontend.ui.card.lock.unlock")}~{b}'
            if len(supported_modes) < 4:
                arm_buttons += "~"*((4-len(supported_modes))*2)
        numpad = "enable"
        command = f"entityUpd~{title}~{navigation}~{item}{arm_buttons}~{icon}~{color}~{numpad}~disable~"
        self._send_mqtt_msg(command)

    def generate_qr_page(self, navigation, heading, items, cardType, qrcode):
        qrcode = apis.ha_api.render_template(qrcode)
        command = f"entityUpd~{heading}~{navigation}~{qrcode}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item, cardType)
        self._send_mqtt_msg(command)

    def generate_power_page(self, navigation, heading, items):
        command = f"entityUpd~{heading}~{navigation}"
        for item in items:
            command += self.generate_entities_item(item, "cardEntities")
            speed = 0
            if apis.ha_api.entity_exists(item.entityId):
                entity = apis.ha_api.get_entity(item.entityId)
                speed = str(item.entity_input_config.get("speed", 0))
                if isinstance(speed, str):
                    speed = apis.ha_api.render_template(speed)
            command += f"~{speed}"
        self._send_mqtt_msg(command)

    def render_card(self, card, send_page_type=True):

        # page type is false, so this request is from a callback
        if not send_page_type and card.cooldown != 0:
            if (time.time()-card.last_update) < card.cooldown:
                return
        card.last_update = time.time()
        
        
        leftBtn = "delete~~~~~"
        if card.uuid_prev is not None:
            leftBtn = self.generate_entities_item(Entity(
                {
                    'entity': f'navigate.{card.uuid_prev}',
                    'icon': 'mdi:arrow-left-bold',
                    'color': [255, 255, 255],
                }
            ))[1:]

        rightBtn = "delete~~~~~"
        if card.uuid_prev is not None:
            rightBtn = self.generate_entities_item(Entity(
                {
                    'entity': f'navigate.{card.uuid_next}',
                    'icon': 'mdi:arrow-right-bold',
                    'color': [255, 255, 255],
                }
            ))[1:]

        if card.hidden:
            leftBtn = f"x~navUp~{get_icon_id('mdi:arrow-up-bold')}~65535~~"
            rightBtn = "delete~~~~~"

        if card.nav1Override is not None:
            leftBtn = self.generate_entities_item(card.nav1Override)[1:]

        if card.nav2Override is not None:
            rightBtn = self.generate_entities_item(card.nav2Override)[1:]

        navigation = f"{leftBtn}~{rightBtn}"

        # Switch to page
        if send_page_type:
            if card.cardType == "cardGrid" and len(card.entities) > 6:
                card.cardType = "cardGrid2"
            self.page_type(card.cardType)

        # send sleep timeout if there is one configured for the current card
        if card.sleepTimeout is not None:
            self._send_mqtt_msg(f"timeout~{card.sleepTimeout}")
        else:
            self._send_mqtt_msg(f'timeout~{self._config.get("sleepTimeout")}')
        
        temp_unit = card.raw_config.get("temperatureUnit", "celsius")
        if card.cardType in ["cardEntities", "cardGrid", "cardGrid2"]:
            self.generate_entities_page(navigation, card.title, card.entities, card.cardType, temp_unit)
            return
        if card.cardType == "cardThermo":
            temp_unit = card.raw_config.get("temperatureUnit", "celsius")
            overwrite_supported_modes = card.raw_config.get("supportedModes")
            self.generate_thermo_page(navigation, card.title, card.entity, temp_unit, overwrite_supported_modes)
            return
        if card.cardType == "cardMedia":
            mediaBtn = card.raw_config.get("mediaControl", "")
            self.generate_media_page(navigation, card.title, card.entity, card.entities, mediaBtn)
            return
        if card.cardType == "cardAlarm":
            alarmBtn = card.raw_config.get("alarmControl")
            overwrite_supported_modes = card.raw_config.get("supportedModes")
            self.generate_alarm_page(navigation, card.title, card.entity, overwrite_supported_modes, alarmBtn)
            return
        if card.cardType == "cardUnlock":
            pin = card.raw_config.get("pin", 3830)
            destination = card.raw_config.get("destination")
            item = card.uuid
            self.generate_unlock_page(navigation, item, card.title, destination, pin)
            return
        if card.cardType in ["screensaver", "screensaver2"]:
            theme = card.raw_config.get("theme")
            self.update_screensaver_weather(theme)
            self.update_status_icons()
            return
        if card.cardType == "cardQR":
            qrcode = card.raw_config.get("qrCode", "")
            self.generate_qr_page(navigation, card.title, card.entities, card.cardType, qrcode)
            return
        if card.cardType == "cardPower":
            self.generate_power_page(navigation, card.title, card.entities)
            return

    def generate_light_detail_page(self, entity_id, is_open_detail=False):
        if entity_id.startswith('uuid'):
            entity_config = self._config._config_entites_table.get(entity_id)
            entity = apis.ha_api.get_entity(entity_config.entityId)
        else:
            entity = apis.ha_api.get_entity(entity_id)
        switch_val = 1 if entity.state == "on" else 0
        icon_color = self.get_entity_color(entity)
        brightness = "disable"
        color_temp = "disable"
        color = "disable"
        effect_supported = "disable"
        
        if "onoff" not in entity.attributes.supported_color_modes:
            brightness = 0
        if entity.state == "on":
            if "brightness" in entity.attributes and entity.attributes.brightness:
                # scale 0-255 brightness from ha to 0-100
                brightness = int(scale(entity.attributes.brightness,(0,255),(0,100)))
            else:
                brightness = "disable"
            if "color_temp" in entity.attributes.supported_color_modes and entity.attributes.supported_color_modes:
                if "color_temp" in entity.attributes and entity.attributes.color_temp:
                    # scale ha color temp range to 0-100
                    color_temp = int(scale(entity.attributes.color_temp,(entity.attributes.min_mireds, entity.attributes.max_mireds),(0,100)))
                else:
                    color_temp = "unknown"
            else:
                color_temp = "disable"
            list_color_modes = ["xy", "rgb", "rgbw", "hs"]
            if any(item in list_color_modes for item in entity.attributes.supported_color_modes):
                color = "enable"
            else:
                color = "disable"
            if "effect_list" in entity.attributes:
                effect_supported = "enable"
        color_translation      = "Color"
        brightness_translation = get_translation(self._locale, "frontend.ui.card.light.brightness")
        color_temp_translation = get_translation(self._locale, "frontend.ui.card.light.color_temperature")
        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}~{color_translation}~{color_temp_translation}~{brightness_translation}~{effect_supported}", force=is_open_detail)
    
    def generate_shutter_detail_page(self, entity_id, is_open_detail=False):
        entity       = apis.ha_api.get_entity(entity_id)
        entityType   = "cover"
        device_class = entity.attributes.get("device_class", "window")
        icon_id      = get_icon_ha(entity_id)
        
        pos = entity.attributes.get("current_position")
        if pos is None:
            pos_status = entity.state
            pos = "disable"
        else:
            pos_status = pos
        
        pos_translation = ""
        icon_up   = ""
        icon_stop = ""
        icon_down = ""
        icon_up_status = "disable"
        icon_stop_status = "disable"
        icon_down_status = "disable"
        textTilt = ""
        iconTiltLeft = ""
        iconTiltStop = ""
        iconTiltRight = ""
        iconTiltLeftStatus = "disable"
        iconTiltStopStatus = "disable"
        iconTiltRightStatus = "disable"
        tilt_pos = "disable"

        bits = entity.attributes.supported_features

        # position supported
        if bits & 0b00001111:
            pos_translation = get_translation(self._locale, "frontend.ui.card.cover.position")
        if bits & 0b00000001: # SUPPORT_OPEN
            if ( pos != 100 and not (entity.state == "open" and pos == "disable") ):
                icon_up_status = "enable"
            icon_up   = get_action_icon(ha_type=entityType, action="open", device_class=device_class)
        if bits & 0b00000010: # SUPPORT_CLOSE
            if ( pos != 0 and not (entity.state == "closed" and pos == "disable") ):
                icon_down_status = "enable"
            icon_down = get_action_icon(ha_type=entityType, action="close", device_class=device_class)
        #if bits & 0b00000100: # SUPPORT_SET_POSITION
        if bits & 0b00001000: # SUPPORT_STOP
            icon_stop = get_action_icon(ha_type=entityType, action="stop", device_class=device_class)
            icon_stop_status = "enable"

        # tilt supported
        if bits & 0b11110000:
            textTilt = get_translation(self._locale, "frontend.ui.card.cover.tilt_position")
        if bits & 0b00010000: # SUPPORT_OPEN_TILT
            iconTiltLeft = get_icon_id('arrow-top-right')
            iconTiltLeftStatus = "enable"
        if bits & 0b00100000: # SUPPORT_CLOSE_TILT
            iconTiltRight = get_icon_id('arrow-bottom-left')
            iconTiltRightStatus = "enable"
        if bits & 0b01000000: # SUPPORT_STOP_TILT
            iconTiltStop = get_icon_id('stop')
            iconTiltStopStatus = "enable"
        if bits & 0b10000000: # SUPPORT_SET_TILT_POSITION
            tilt_pos = get_attr_safe(entity, "current_tilt_position", 0)
            if(tilt_pos == 0):
                iconTiltRightStatus = "disable"
            if(tilt_pos == 100):
                iconTiltLeftStatus  = "disable"

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{pos}~{pos_translation}: {pos_status}~{pos_translation}~{icon_id}~{icon_up}~{icon_stop}~{icon_down}~{icon_up_status}~{icon_stop_status}~{icon_down_status}~{textTilt}~{iconTiltLeft}~{iconTiltStop}~{iconTiltRight}~{iconTiltLeftStatus}~{iconTiltStopStatus}~{iconTiltRightStatus}~{tilt_pos}", force=is_open_detail)

    def generate_fan_detail_page(self, entity_id, is_open_detail=False):
        entity = apis.ha_api.get_entity(entity_id)
        switch_val = 1 if entity.state == "on" else 0
        icon_color = self.get_entity_color(entity)
        speed = entity.attributes.get("percentage")
        percentage_step = entity.attributes.get("percentage_step")
        speedMax = 100
        if percentage_step is None:
            speed = "disable"
        else:
            if speed is None:
                speed = 0
            speed = round(speed/percentage_step)
            speedMax = int(100/percentage_step)

        speed_translation = get_translation(self._locale, "frontend.ui.card.fan.speed")

        preset_mode = entity.attributes.get("preset_mode", "")
        preset_modes = entity.attributes.get("preset_modes", [])
        if preset_modes is not None:
            preset_modes = "?".join(entity.attributes.get("preset_modes", []))
        else:
            preset_modes = ""

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~~{icon_color}~{switch_val}~{speed}~{speedMax}~{speed_translation}~{preset_mode}~{preset_modes}", force=is_open_detail)

    def generate_thermo_detail_page(self, entity_id, is_open_detail=False):
        icon_id = get_icon_ha(entity_id)
        entity = apis.ha_api.get_entity(entity_id)
        icon_color = self.get_entity_color(entity, ha_type="climate")

        modes_out = ""
        for mode in ["preset_modes", "swing_modes", "fan_modes"]:
            heading = get_translation(self._locale, f"frontend.ui.card.climate.{mode[:-1]}")
            cur_mode = entity.attributes.get(mode[:-1], "")
            modes = entity.attributes.get(mode, [])
            if modes is not None:
                if mode == "preset_modes":
                    translated_modes = []
                    for elem in modes:
                        translated_modes.append(get_translation(self._locale, f"frontend.state_attributes.climate.preset_mode.{elem}"))
                    cur_mode = get_translation(self._locale, f"frontend.state_attributes.climate.preset_mode.{cur_mode}")
                    modes_res = "?".join(translated_modes)
                else:
                    modes_res = "?".join(modes)
                if modes:
                    modes_out += f"{heading}~{mode}~{cur_mode}~{modes_res}~"

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{icon_id}~{icon_color}~{modes_out}", force=is_open_detail)  

    def generate_input_select_detail_page(self, entity_id, is_open_detail=False):
        options_list = None
        if entity_id.startswith('uuid'):
            entity_config = self._config._config_entites_table.get(entity_id)
            entity = apis.ha_api.get_entity(entity_config.entityId)
            ha_type = entity_config.entityId.split(".")[0]
            options_list = entity_config.entity_input_config.get("effectList")
        else:
            entity = apis.ha_api.get_entity(entity_id)
            ha_type = entity_id.split(".")[0]
        options = []
        icon_color = 0
        icon_color = self.get_entity_color(entity, ha_type=ha_type)
        state = entity.state
        if ha_type in ["input_select", "select"]:
            options = entity.attributes.get("options", [])
        elif ha_type == "light":
            if options_list is not None:
                options = options_list
            else:
                options = entity.attributes.get("effect_list", [])[:15]
        elif ha_type == "media_player":
            state = entity.attributes.get("source", "")
            options = entity.attributes.get("source_list", [])
        options = "?".join(options)
        self._send_mqtt_msg(f"entityUpdateDetail2~{entity_id}~~{icon_color}~{ha_type}~{state}~{options}~", force=is_open_detail)

    def generate_timer_detail_page(self, entity_id, is_open_detail=False):
        if isinstance(entity_id, dict):
            entity_id = entity_id["entity_id"]
        entity = apis.ha_api.get_entity(entity_id)
        icon_color = self.get_entity_color(entity)
        if entity.state in ["idle", "paused"]:
            editable = 1
            if entity.state == "paused":
                time_remaining = entity.attributes.get("remaining")
            else:
                time_remaining = entity.attributes.get("duration")
            min_remaining = time_remaining.split(":")[1]
            sec_remaining = time_remaining.split(":")[2]
            action1 = ""
            action2 = "start"
            action3 = ""
            label1  = ""
            label2  = get_translation(self._locale, "frontend.ui.card.timer.actions.start")
            label3  = ""
        else: #active
            editable = 0
            apis.ha_api.run_in(self.generate_timer_detail_page, 1, entity_id=entity_id)
            finishes_at = dp.parse(entity.attributes.get("finishes_at"))
            delta = finishes_at - datetime.datetime.now(datetime.timezone.utc)
            hours, remainder = divmod(delta.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)
            min_remaining = int(minutes)
            sec_remaining = int(seconds)
            action1 = "pause"
            action2 = "cancel"
            action3 = "finish"
            label1  = get_translation(self._locale, "frontend.ui.card.timer.actions.pause")
            label2  = get_translation(self._locale, "frontend.ui.card.timer.actions.cancel")
            label3  = get_translation(self._locale, "frontend.ui.card.timer.actions.finish")
        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~~{icon_color}~{entity_id}~{min_remaining}~{sec_remaining}~{editable}~{action1}~{action2}~{action3}~{label1}~{label2}~{label3}", force=is_open_detail)
        
    def send_message_page(self, ident, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~{ident}~{heading}~65535~{b1}~65535~{b2}~65535~{msg}~65535~0")
    
