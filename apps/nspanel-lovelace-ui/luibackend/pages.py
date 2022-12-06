import datetime
import dateutil.parser as dp

import apis

from theme import get_screensaver_color_output
from icon_mapping import get_icon_id
from icons import get_icon
from icons import get_action_icon
from helper import scale, rgb_dec565, rgb_brightness, get_attr_safe, convert_temperature
from localization import get_translation

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
    
    def get_entity_color(self, entity, ha_type=None, overwrite=None):
        if overwrite is not None:
            if type(overwrite) is list:
                return rgb_dec565(overwrite)
            if type(overwrite) is dict:
                state = entity.state
                for overwrite_state, overwrite_val in overwrite.items():
                    if overwrite_state == state:
                        return rgb_dec565(overwrite_val)

        attr = entity.attributes
        default_color_on  = rgb_dec565([253, 216, 53])
        default_color_off = rgb_dec565([68, 115, 158])
        icon_color = default_color_on if entity.state in ["on", "unlocked", "above_horizon", "home"] else default_color_off

        if ha_type == "alarm_control_panel":
            if entity.state == "disarmed":
                icon_color = rgb_dec565([13,160,53])
            if entity.state == "arming":
                icon_color = rgb_dec565([244,180,0])
            if entity.state in ["armed_home", "armed_away", "armed_night", "armed_vacation", "pending", "triggered"]:
                icon_color = rgb_dec565([223,76,30])

        if ha_type == "climate":
            if entity.state in ["auto", "heat_cool"]:
                icon_color = 1024
            if entity.state == "heat":
                icon_color = 64512
            if entity.state == "off":
                icon_color = 35921
            if entity.state == "cool":
                icon_color = 11487
            if entity.state == "dry":
                icon_color = 60897
            if entity.state == "fan_only":
                icon_color = 35921

        if "rgb_color" in attr:
            color = attr.rgb_color
            if "brightness" in attr:
                color = rgb_brightness(color, attr.brightness)
            icon_color = rgb_dec565(color)
        elif "brightness" in attr:
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
        self._send_mqtt_msg(f"pageType~{target_page}")
    
    def update_screensaver_weather(self, theme):
        global babel_spec
        we_name = self._config._config_screensaver.entity.entityId
        unit = self._config._config_screensaver.raw_config.get("weatherUnit", "celsius")
        state = {}
        
        if apis.ha_api.entity_exists(we_name):
            we = apis.ha_api.get_entity(we_name)
        else:
            apis.ha_api.error(f"Skipping Weather Update, entity {we_name} not found")
            return

        icon_cur        = get_icon("weather", state=we.state)
        state["tMainIcon"] = we.state
        text_cur        = convert_temperature(we.attributes.temperature, unit)

        forecastSkip = self._config._config_screensaver.raw_config.get(f"forecastSkip")+1
        # check if the difference between the first 2 forecast items is less than 24h
        difference = (dp.parse(we.attributes.forecast[forecastSkip]['datetime']) - dp.parse(we.attributes.forecast[0]['datetime']))
        total_seconds = difference.total_seconds()
        same_day = total_seconds < 86400
        weather_res = ""
        for i in range(1,5):
            wOF = self._config._config_screensaver.raw_config.get(f"weatherOverrideForecast{i}")
            if wOF is None:
                fid = (i-1)*forecastSkip
                if len(we.attributes.forecast) >= fid:
                    up = we.attributes.forecast[fid]['datetime']
                    up   = dp.parse(up).astimezone()
                    if babel_spec is not None:
                        if same_day:
                            up = babel.dates.format_time(up, "H:mm", locale=self._locale)
                        else:
                            up = babel.dates.format_date(up, "E", locale=self._locale)
                    else:
                        if same_day:
                            up = up.strftime('%H:%M')
                        else:
                            up = up.strftime('%a')
                    icon = get_icon("weather", state=we.attributes.forecast[fid]['condition'])
                    if i == 1:
                        state["tF1Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 2:
                        state["tF2Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 3:
                        state["tF3Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 4:
                        state["tF4Icon"] = we.attributes.forecast[fid]['condition']
                    down = convert_temperature(we.attributes.forecast[fid]['temperature'], unit)
                else:
                    up = ""
                    icon = ""
                    down = ""
            else:
                apis.ha_api.log(f"Forecast {i} is overriden with {wOF}")
                icon = wOF.get("icon")
                name = wOF.get("name")
                entity = apis.ha_api.get_entity(wOF.get("entity"))
                up = name if name is not None else entity.attributes.friendly_name
                icon = get_icon("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                if "color" in wOF:
                    if theme is None:
                        theme = {}
                    color = wOF.get("color")
                    if type(color) is dict:
                        for overwrite_state, overwrite_val in color.items():
                            if overwrite_state == entity.state:
                                color = overwrite_val
                    if i == 1:
                        theme["tF1Icon"] = color
                    elif i == 2:
                        theme["tF2Icon"] = color
                    elif i == 3:
                        theme["tF3Icon"] = color
                    elif i == 4:
                        theme["tF4Icon"] = color

                unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
                down = f"{entity.state} {unit_of_measurement}"
            weather_res+=f"~{up}~{icon}~{down}"

        altLayout = "~~"
        if self._config._config_screensaver.raw_config.get("alternativeLayout", False):
            altLayout = f"~{get_icon_id('water-percent')}~{we.attributes.humidity} %"

        # status icons
        status_res = ""
        for i in range(1,3):
            statusIcon = self._config._config_screensaver.raw_config.get(f"statusIcon{i}")
            if statusIcon is not None and apis.ha_api.entity_exists(statusIcon.get("entity","")):
                icon = statusIcon.get("icon")
                entity = apis.ha_api.get_entity(statusIcon.get("entity"))
                entityType = statusIcon.get("entity").split(".")[0]
                icon = get_icon(entityType, state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                color = self.get_entity_color(entity, ha_type=entityType, overwrite=statusIcon.get("color", None))
                status_res += f"~{icon}~{color}"

        self._send_mqtt_msg(f"weatherUpdate~{icon_cur}~{text_cur}{weather_res}{altLayout}{status_res}")
        
        # send color if configured in screensaver
        if theme is not None:
            if not ("autoWeather" in theme and theme["autoWeather"]):
                state = None
            self._send_mqtt_msg(get_screensaver_color_output(theme=theme, state=state))

    def generate_entities_item(self, item, cardType, temp_unit=""):
        entityId = item.entityId
        icon = item.iconOverride
        colorOverride = item.colorOverride
        name = item.nameOverride
        uuid = item.uuid
        # type of the item is the string before the "." in the entityId
        entityType = entityId.split(".")[0]
        
        apis.ha_api.log(f"Generating item for {entityId} with type {entityType}", level="DEBUG")
        # Internal types
        if entityType == "delete":
            return f"~{entityType}~~~~~"
        if entityType == "navigate":
            page_search_res = self._config.searchCard(entityId)
            if page_search_res is not None:
                icon_res = get_icon("navigate", overwrite=icon)
                status_entity = None
                name = name if name is not None else page_search_res.title
                text = get_translation(self._locale, "frontend.ui.card.button.press")
                if item.status is not None and apis.ha_api.entity_exists(item.status):
                    status_entity = apis.ha_api.get_entity(item.status)
                    icon_res = get_icon(item.status.split(".")[0], state=status_entity.state, device_class=status_entity.attributes.get("device_class", "_"), overwrite=icon)
                    icon_color = self.get_entity_color(status_entity, ha_type=item.status.split(".")[0], overwrite=colorOverride)
                    if item.status.startswith("sensor") and cardType == "cardGrid":
                        icon_res = status_entity.state[:4]
                        if icon_res[-1] == ".":
                            icon_res = icon_res[:-1]
                else:
                    icon_color = rgb_dec565(colorOverride) if colorOverride is not None and type(colorOverride) is list else 17299
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
            if item.status is not None and apis.ha_api.entity_exists(item.status):
                status_entity = apis.ha_api.get_entity(item.status)
                icon_id = get_icon(item.status.split(".")[0], state=status_entity.state, device_class=status_entity.attributes.get("device_class", "_"), overwrite=icon)
                icon_color = self.get_entity_color(status_entity, ha_type=item.status.split(".")[0], overwrite=colorOverride)
                if item.status.startswith("sensor") and cardType == "cardGrid":
                    icon_id = status_entity.state[:4]
                    if icon_id[-1] == ".":
                        icon_id = icon_id[:-1]
            return f"~button~{uuid}~{icon_id}~{icon_color}~{name}~{text}"
        if not apis.ha_api.entity_exists(entityId):
            return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~Not found check~ apps.yaml"
        
        # HA Entities
        entity = apis.ha_api.get_entity(entityId)
        # check state for if a condition is defined
        if item.condState is not None and item.condState == entity.state:
            return ""
        if item.condStateNot is not None and item.condState != entity.state:
            return ""
        
        # common res vars
        entityTypePanel = "text"
        icon_id = get_icon(entityType, state=entity.state, overwrite=icon)
        color = self.get_entity_color(entity, ha_type=entityType, overwrite=colorOverride)
        value = ""
        name = name if name is not None else entity.attributes.get("friendly_name","unknown")

        if entityType == "cover":
            entityTypePanel = "shutter"
            device_class = entity.attributes.get("device_class", "window")
            icon_id = get_icon(ha_type=entityType, state=entity.state, device_class=device_class, overwrite=icon)
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
            value = entity.state + " " + unit_of_measurement
            if entityType == "binary_sensor":
                value = get_translation(self._locale, f"backend.component.binary_sensor.state.{device_class}.{entity.state}")
            if cardType == "cardGrid" and entityType == "sensor" and icon is None:
                icon_id = entity.state[:4]
                if icon_id[-1] == ".":
                    icon_id = icon_id[:-1]
            else:
                icon_id = get_icon(entityType, state=entity.state, device_class=device_class, overwrite=icon)
        elif entityType in ["button", "input_button"]:
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.button.press")
        elif entityType == "scene":
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.scene.activate")
        elif entityType == "script":
            entityTypePanel = "button"
            value = get_translation(self._locale, "frontend.ui.card.script.run")
            override = item.entity_input_config.get("action_name")
            if override is not None:
                value = override
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
            entityTypePanel = "text"
            icon = get_icon_id('speaker-off')
            if "media_content_type" in entity.attributes:
                if entity.attributes.media_content_type == "music":
                    icon = get_icon_id("music")
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
        else:
            name = "unsupported"
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
                icon_id = get_icon("climate", state=mode)
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

            if len(icon_res_list) == 1:
                icon_res = "~"*4 + icon_res_list[0] + "~"*4*6
            elif len(icon_res_list) == 2:
                icon_res = "~"*4*2 + icon_res_list[0] + "~"*4*2 + icon_res_list[1] + "~"*4*2
            elif len(icon_res_list) == 3:
                icon_res = "~"*4*2 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4
            elif len(icon_res_list) == 4:
                icon_res = "~"*4 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4 + icon_res_list[3]
            elif len(icon_res_list) >= 5:
                icon_res = "~"*4 + "".join(icon_res_list) + "~"*4*(7-len(icon_res_list))
            
            currently_translation = get_translation(self._locale, "frontend.ui.card.climate.currently")
            state_translation = get_translation(self._locale, "frontend.ui.panel.config.devices.entities.state")
            action_translation = get_translation(self._locale, "frontend.ui.card.climate.operation").replace(' ','\r\n')
            
            detailPage = ""
            if any(x in ["preset_modes", "swing_modes", "fan_modes"] for x in entity.attributes):
                detailPage = "1"

            command = f"entityUpd~{heading}~{navigation}~{item}~{current_temp} {temperature_unit}~{dest_temp}~{state_value}~{min_temp}~{max_temp}~{step_temp}{icon_res}~{currently_translation}~{state_translation}~{action_translation}~{temperature_unit_icon}~{dest_temp2}~{detailPage}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, navigation, title, entity, entities, mediaBtn):
        item = entity.entityId
        if not apis.ha_api.entity_exists(item):
            command = f"entityUpd~Not found~{navigation}~{item}~{get_icon_id('alert-circle-outline')}~Please check your~apps.yaml in AppDaemon~~0~{get_icon_id('alert-circle-outline')}~~~disable"
        else:
            entity        = apis.ha_api.get_entity(item)
            heading       = title if title != "unknown" else entity.attributes.friendly_name
            title         = get_attr_safe(entity, "media_title", "")
            author        = get_attr_safe(entity, "media_artist", "")
            volume        = int(get_attr_safe(entity, "volume_level", 0)*100)
            iconplaypause = get_icon_id("pause") if entity.state == "playing" else get_icon_id("play")
            bits = entity.attributes.supported_features
            onoffbutton = "disable"
            if bits & 0b10000000:
                if entity.state == "off":
                    onoffbutton = 1374
                else:
                    onoffbutton = rgb_dec565([255,152,0])
            shuffleBtn = "disable"
            if bits & 0b100000000000000:
                shuffle = get_attr_safe(entity, "shuffle", "")
                if shuffle == False:
                    shuffleBtn = get_icon_id('shuffle-disabled')
                elif shuffle == True:
                    shuffleBtn = get_icon_id('shuffle')

            media_icon = self.generate_entities_item(item, "cardGrid")

            item_str = ""
            for item in entities:
                item_str += self.generate_entities_item(item, "cardGrid")

            command = f"entityUpd~{heading}~{navigation}~{item}~{title}~~{author}~~{volume}~{iconplaypause}~{onoffbutton}~{shuffleBtn}{media_icon}{item_str}"
        self._send_mqtt_msg(command)
        
    def generate_alarm_page(self, navigation, entity, overwrite_supported_modes, alarmBtn):
        item = entity.entityId
        if not apis.ha_api.entity_exists(item):
            command = f"entityUpd~{item}~{navigation}~Not found~Not found~Check your~Check your~apps.~apps.~yaml~yaml~0~~0"
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
            command = f"entityUpd~{item}~{navigation}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}~{add_btn}"
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
        for idx, item in enumerate(items):
            entity = apis.ha_api.get_entity(item.entityId)
            icon_color = self.get_entity_color(entity, overwrite=item.colorOverride)
            device_class = entity.attributes.get("device_class", "")
            icon = get_icon(item.entityId.split(".")[0], state=entity.state, device_class=device_class, overwrite=item.iconOverride)
            speed = 0
            if float(entity.state) > 0:
                speed = item.entity_input_config.get("speed", 1)
                apis.ha_api.log(f"{item.data}")
            if idx == 0:
                command += f"~{icon_color}~{icon}~{entity.state}"
            else:
                command += f"~{icon_color}~{icon}~{speed}~{entity.state}"
        self._send_mqtt_msg(command)

    def render_card(self, card, send_page_type=True):    
        apis.ha_api.log(f"Started rendering of page {card.pos} with type {card.cardType}")
        
        if len(self._config._config_cards) == 1:
            navigation = "0|0"
        else:
            navigation = "1|1"
        if card.pos is None:
            navigation = "2|0"            

        # Switch to page
        if send_page_type:
            self.page_type(card.cardType)
        
        temp_unit = card.raw_config.get("temperatureUnit", "celsius")
        if card.cardType in ["cardEntities", "cardGrid"]:
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
            self.generate_alarm_page(navigation, card.entity, overwrite_supported_modes, alarmBtn)
            return
        if card.cardType == "screensaver":
            theme = card.raw_config.get("theme")
            self.update_screensaver_weather(theme)
            return
        if card.cardType == "cardQR":
            qrcode = card.raw_config.get("qrCode", "")
            self.generate_qr_page(navigation, card.title, card.entities, card.cardType, qrcode)
            return
        if card.cardType == "cardPower":
            self.generate_power_page(navigation, card.title, card.entities)
            return

    def generate_light_detail_page(self, entity_id):
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
            if "brightness" in entity.attributes:
                # scale 0-255 brightness from ha to 0-100
                brightness = int(scale(entity.attributes.brightness,(0,255),(0,100)))
            else:
                brightness = "disable"
            if "color_temp" in entity.attributes.supported_color_modes:
                if "color_temp" in entity.attributes:
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
        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}~{color_translation}~{color_temp_translation}~{brightness_translation}~{effect_supported}")
    
    def generate_shutter_detail_page(self, entity_id):
        entity = apis.ha_api.get_entity(entity_id)
        entityType="cover"
        device_class = entity.attributes.get("device_class", "window")
        icon_id   = get_icon(entityType, state=entity.state, device_class=device_class)
        
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

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{pos}~{pos_translation}: {pos_status}~{pos_translation}~{icon_id}~{icon_up}~{icon_stop}~{icon_down}~{icon_up_status}~{icon_stop_status}~{icon_down_status}~{textTilt}~{iconTiltLeft}~{iconTiltStop}~{iconTiltRight}~{iconTiltLeftStatus}~{iconTiltStopStatus}~{iconTiltRightStatus}~{tilt_pos}")

    def generate_fan_detail_page(self, entity_id):
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

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~~{icon_color}~{switch_val}~{speed}~{speedMax}~{speed_translation}~{preset_mode}~{preset_modes}")

    def generate_thermo_detail_page(self, entity_id):
        entity = apis.ha_api.get_entity(entity_id)
        icon_id = get_icon("climate", state=entity.state)
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

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{icon_id}~{icon_color}~{modes_out}")  

    def generate_input_select_detail_page(self, entity_id):
        entity = apis.ha_api.get_entity(entity_id)
        options = []
        icon_color = 0
        ha_type = entity_id.split(".")[0]
        icon_color = self.get_entity_color(entity, ha_type=ha_type)
        if ha_type in ["input_select", "select"]:
            options = entity.attributes.get("options", [])
        if ha_type == "light":
            options = entity.attributes.get("effect_list", [])[:15]
        options = "?".join(options)
        self._send_mqtt_msg(f"entityUpdateDetail2~{entity_id}~~{icon_color}~{ha_type}~{entity.state}~{options}~")
        
    def send_message_page(self, ident, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~{ident}~{heading}~65535~{b1}~65535~{b2}~65535~{msg}~65535~0")
