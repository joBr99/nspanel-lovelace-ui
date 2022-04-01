import logging
import datetime

from icon_mapping import get_icon_id
from icons import get_icon_id_ha
from helper import scale, rgb_dec565, rgb_brightness, get_attr_safe, convert_temperature_from_celsius
from localization import get_translation

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
    import babel.dates

LOGGER = logging.getLogger(__name__)

class LuiPagesGen(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._locale  = config.get("locale")
        self._send_mqtt_msg = send_mqtt_msg
    
    def get_entity_color(self, entity):
        attr = entity.attributes
        default_color_on  = rgb_dec565([253, 216, 53])
        default_color_off = rgb_dec565([68, 115, 158])
        icon_color = default_color_on if entity.state == "on" else default_color_off

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
        self._send_mqtt_msg(f"time~{time}")

    def update_date(self, kwargs):
        global babel_spec
        if babel_spec is not None:
            dateformat = self._config.get("dateFormatBabel")
            date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=self._locale)
        else:
            dateformat = self._config.get("dateFormat")
            date = datetime.datetime.now().strftime(dateformat)
        self._send_mqtt_msg(f"date~?{date}")

    def page_type(self, target_page):
        self._send_mqtt_msg(f"pageType~{target_page}")
    
    def generate_screensaver_page(self):
        self.page_type("screensaver")
        self.update_screensaver_weather()
        
    def update_screensaver_weather(self):
        global babel_spec
        we_name = self._config.get("weather")
        unit = self._config.get("weatherUnit")

        if self._ha_api.entity_exists(we_name):
            we = self._ha_api.get_entity(we_name)
        else:
            LOGGER.error("Skipping Weather Update, entity not found")
            return

        icon_cur        = get_icon_id_ha("weather", state=we.state)
        text_cur        = convert_temperature_from_celsius(we.attributes.temperature, unit)

        weather_res = ""
        for i in range(1,5):
            wOF = self._config.get(f"weatherOverrideForecast{i}")
            if wOF is None:
                up = we.attributes.forecast[i-1]['datetime']
                up   = datetime.datetime.fromisoformat(up)
                if babel_spec is not None:
                    up = babel.dates.format_date(up, "E", locale=self._locale)
                else:
                    up = up.strftime("%a")
                icon = get_icon_id_ha("weather", state=we.attributes.forecast[i-1]['condition'])
                down = convert_temperature_from_celsius(we.attributes.forecast[i-1]['temperature'], unit)
            else:
                LOGGER.info(f"Forecast {i} is overriden with {wOF}")
                icon = None
                name = None
                if type(wOF) is dict:
                    icon = next(iter(wOF.items()))[1].get('icon')
                    name = next(iter(wOF.items()))[1].get('name')
                    wOF = next(iter(wOF.items()))[0]
                entity = self._ha_api.get_entity(wOF)
                up = name if name is not None else entity.attributes.friendly_name
                icon = get_icon_id_ha("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
                down = f"{entity.state} {unit_of_measurement}"
            weather_res+=f"~{up}~{icon}~{down}"

        self._send_mqtt_msg(f"weatherUpdate~{icon_cur}~{text_cur}{weather_res}")

    def generate_entities_item(self, item):
        icon = None
        name = None
        if type(item) is dict:
            icon = next(iter(item.items()))[1].get('icon')
            name = next(iter(item.items()))[1].get('name')
            item = next(iter(item.items()))[0]
        # type of the item is the string before the "." in the item name
        item_type = item.split(".")[0]
        LOGGER.debug(f"Generating item command for {item} with type {item_type}",)
        # Internal Entities 
        if item_type == "delete":
            return f"~{item_type}~~~~~"
        if item_type == "navigate":
            page_search = self._config.get_root_page().search_page_by_name(item)
            if len(page_search) > 0:
                page_data = page_search[0].data
                if name is None:
                    name = page_data.get("heading")
                text = get_translation(self._locale,"PRESS")
                icon_id = get_icon_id(icon) if icon is not None else get_icon_id(page_data.get("icon", "gesture-tap-button"))
                return f"~button~{item}~{icon_id}~17299~{name}~{text}"
            else:
                return f"~text~{item}~{get_icon_id('alert-circle-outline')}~17299~page not found~"
        if not self._ha_api.entity_exists(item):
            return f"~text~{item}~{get_icon_id('alert-circle-outline')}~17299~Not found check~ apps.yaml"
        
        # HA Entities
        entity = self._ha_api.get_entity(item)
        name = name if name is not None else entity.attributes.friendly_name
        if item_type == "cover":
            icon_id = get_icon_id_ha("cover", state=entity.state, overwrite=icon)
            return f"~shutter~{item}~{icon_id}~17299~{name}~"
        if item_type in "light":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha("light", overwrite=icon)
            return f"~{item_type}~{item}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if item_type in ["switch", "input_boolean"]:
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha(item_type, state=entity.state, overwrite=icon)
            return f"~switch~{item}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if item_type in ["sensor", "binary_sensor"]:
            device_class = entity.attributes.get("device_class", "")
            icon_id = get_icon_id_ha("sensor", state=entity.state, device_class=device_class, overwrite=icon)
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            value = entity.state + " " + unit_of_measurement
            icon_color = self.get_entity_color(entity)
            return f"~text~{item}~{icon_id}~{icon_color}~{name}~{value}"
        if item_type in ["button", "input_button"]:
            icon_id = get_icon_id_ha("button", overwrite=icon)
            text = get_translation(self._locale,"PRESS")
            return f"~button~{item}~{icon_id}~17299~{name}~{text}"
        if item_type == "scene":
            icon_id = get_icon_id_ha("scene", overwrite=icon)
            text = get_translation(self._locale,"ACTIVATE")
            return f"~button~{item}~{icon_id}~17299~{name}~{text}"
        if item_type == "script":
            icon_id = get_icon_id_ha("script", overwrite=icon)
            text = get_translation(self._locale,"run")
            return f"~button~{item}~{icon_id}~17299~{name}~{text}"
        if item_type == "number":
            icon_id = get_icon_id_ha("number", overwrite=icon)
            min_v = entity.attributes.get("min", 0)
            max_v = entity.attributes.get("max", 100)
            return f"~number~{item}~{icon_id}~17299~{name}~{entity.state}|{min_v}|{max_v}"

    def generate_entities_page(self, heading, items):
        navigation = ""
        command = f"entityUpd~{heading}~{navigation}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item)
        self._send_mqtt_msg(command)



    def generate_thermo_page(self, item):
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~{item}~Not found~220~220~Not found~150~300~5"
        else:
            entity       = self._ha_api.get_entity(item)
            heading      = entity.attributes.friendly_name
            current_temp = int(get_attr_safe(entity, "current_temperature", 0)*10)
            dest_temp    = int(get_attr_safe(entity, "temperature", 0)*10)
            status       = get_attr_safe(entity, "hvac_action", "")
            status       = get_translation(self._locale,status)
            min_temp     = int(get_attr_safe(entity, "min_temp", 0)*10)
            max_temp     = int(get_attr_safe(entity, "max_temp", 0)*10)
            step_temp    = int(get_attr_safe(entity, "target_temp_step", 0.5)*10) 
            icon_res = ""
            hvac_modes = get_attr_safe(entity, "hvac_modes", [])
            for mode in hvac_modes:
                icon_id = get_icon_id('alert-circle-outline')
                color_on = 64512
                if mode == "auto":
                    icon_id = get_icon_id("calendar-sync")
                    color_on = 1024
                if mode == "heat":
                    icon_id = get_icon_id("fire")
                    color_on = 64512
                if mode == "off":
                    icon_id = get_icon_id("power")
                    color_on = 35921
                if mode == "cool":
                    icon_id = get_icon_id("snowflake")
                    color_on = 11487
                if mode == "dry":
                    icon_id = get_icon_id("water-percent")
                    color_on = 60897
                if mode == "fan_only":
                    icon_id = get_icon_id("fan")
                    color_on = 35921
                state = 0
                if(mode == entity.state):
                    state = 1
                icon_res += f"~{icon_id}~{color_on}~{state}~{mode}"
    
            len_hvac_modes = len(hvac_modes)
            if len_hvac_modes%2 == 0:
                # even
                padding_len = int((4-len_hvac_modes)/2)
                icon_res =  "~"*4*padding_len + icon_res + "~"*4*padding_len
                # use last 4 icons
                icon_res =  "~"*4*5 + icon_res
            else:
                # uneven
                padding_len = int((5-len_hvac_modes)/2)
                icon_res =  "~"*4*padding_len + icon_res + "~"*4*padding_len
                # use first 5 icons
                icon_res = icon_res + "~"*4*4
            command = f"entityUpd~{heading}~~{item}~{current_temp}~{dest_temp}~{status}~{min_temp}~{max_temp}~{step_temp}{icon_res}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, item):
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~|{item}|Not found|{get_icon_id('alert-circle-outline')}|Please check your|apps.yaml in AppDaemon|50|{get_icon_id('alert-circle-outline')}"
        else:
            entity        = self._ha_api.get_entity(item)
            heading       = entity.attributes.friendly_name
            icon          = 0
            title         = get_attr_safe(entity, "media_title", "")
            author        = get_attr_safe(entity, "media_artist", "")
            volume        = int(get_attr_safe(entity, "volume_level", 0)*100)
            iconplaypause = get_icon_id("pause") if entity.state == "playing" else get_icon_id("play")
            if "media_content_type" in entity.attributes:
                if entity.attributes.media_content_type == "music":
                    icon = get_icon_id("music")
            source        = get_attr_safe(entity, "source", "")
            speakerlist   = get_attr_safe(entity, "source_list",[])
            if source in speakerlist:
                # move current source to the end of the list
                speakerlist.remove(source)
                speakerlist.append(source)
            if len(speakerlist) == 1:
                speakerlist = []
            speakerlist = "?".join(speakerlist)
            bits = entity.attributes.supported_features
            onoffbutton = "disable"
            if bits & 0b10000000:
                if entity.state == "off":
                    onoffbutton = 1374
                else:
                    onoffbutton = rgb_dec565([255,255,255])
            command = f"entityUpd~|{heading}||{item}|{icon}|{title}|{author}|{volume}|{iconplaypause}|{source}|{speakerlist[:200]}|{onoffbutton}"
        self._send_mqtt_msg(command)
        
    def generate_alarm_page(self, item):
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~{item}~Not found~Not found~Check your~Check your~apps.~apps.~yaml~yaml~0~~0"
        else:
            entity        = self._ha_api.get_entity(item)
            icon = get_icon_id("shield-off")
            color = rgb_dec565([255,255,255])
            supported_modes = []
            numpad = "enable"
            if entity.state == "disarmed":
                color = rgb_dec565([13,160,53])
                icon = get_icon_id("shield-off")
                test = entity.attributes.get("code_arm_required", "false")
                if not entity.attributes.get("code_arm_required", False):
                    numpad = "disable"
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

            # add padding to arm buttons
            arm_buttons = ""
            for b in supported_modes:
                arm_buttons += f"~{get_translation(self._locale, b)}~{b}"
            if len(supported_modes) < 4:
                arm_buttons += "~"*((4-len(supported_modes))*2)
            navigation = ""
            command = f"entityUpd~{item}~{navigation}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}"
        self._send_mqtt_msg(command)
        
    def render_page(self, page, send_page_type=True):
        config    = page.data
        page_type = config["type"]
        LOGGER.info(f"Started rendering of page {page.pos} with type {page_type}")
        # Switch to page
        if send_page_type:
            self.page_type(page_type)
        if page_type in ["cardEntities", "cardGrid"]:
            heading = config.get("heading", "unknown")
            self.generate_entities_page(heading, page.get_items())
            return
        if page_type == "cardThermo":
            self.generate_thermo_page(page.data.get("item"))
        if page_type == "cardMedia":
            self.generate_media_page(page.data.get("item"))
        if page_type == "cardAlarm":
            self.generate_alarm_page(page.data.get("item"))


    def generate_light_detail_page(self, entity):
        entity = self._ha_api.get_entity(entity)
        switch_val = 1 if entity.state == "on" else 0
        icon_color = self.get_entity_color(entity)
        brightness = "disable"
        color_temp = "disable"
        color = "disable"
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
        self._send_mqtt_msg(f"entityUpdateDetail~{get_icon_id('lightbulb')}~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}")
    
    def generate_shutter_detail_page(self, entity):
        entity = self._ha_api.get_entity(entity)
        pos = 100-int(entity.attributes.get("current_position", 50))
        self._send_mqtt_msg(f"entityUpdateDetail,{pos}")

    def send_message_page(self, id, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~|{id}|{heading}|65535|{b1}|65535|{b2}|65535|{msg}|65535|0")
