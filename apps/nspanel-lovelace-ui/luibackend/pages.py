import datetime
import dateutil.parser as dp

from icon_mapping import get_icon_id
from icons import get_icon_id_ha
from helper import scale, rgb_dec565, rgb_brightness, get_attr_safe, convert_temperature
from localization import get_translation

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
    import babel.dates

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
        icon_color = default_color_on if entity.state in ["on", "unlocked"] else default_color_off

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
        self._send_mqtt_msg(f"date~{date}")

    def page_type(self, target_page):
        self._send_mqtt_msg(f"pageType~{target_page}")
    
    def update_screensaver_weather(self):
        global babel_spec
        we_name = self._config._config_screensaver.entity.entityId
        unit = self._config._config_screensaver.raw_config.get("weatherUnit", "celsius")

        if self._ha_api.entity_exists(we_name):
            we = self._ha_api.get_entity(we_name)
        else:
            self._ha_api.error(f"Skipping Weather Update, entity {we_name} not found")
            return

        icon_cur        = get_icon_id_ha("weather", state=we.state)
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
                    icon = get_icon_id_ha("weather", state=we.attributes.forecast[fid]['condition'])
                    down = convert_temperature(we.attributes.forecast[fid]['temperature'], unit)
                else:
                    up = ""
                    icon = ""
                    down = ""
            else:
                self._ha_api.log(f"Forecast {i} is overriden with {wOF}")
                icon = wOF.get("icon")
                name = wOF.get("name")
                entity = self._ha_api.get_entity(wOF.get("entity"))
                up = name if name is not None else entity.attributes.friendly_name
                icon = get_icon_id_ha("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
                down = f"{entity.state} {unit_of_measurement}"
            weather_res+=f"~{up}~{icon}~{down}"

        altLayout = ""
        if self._config._config_screensaver.raw_config.get("alternativeLayout", False) is True:
            altLayout = f"~{get_icon_id('water-percent')}~{we.attributes.humidity} %"

        self._send_mqtt_msg(f"weatherUpdate~{icon_cur}~{text_cur}{weather_res}{altLayout}")

    def generate_entities_item(self, entity):
        entityId = entity.entityId
        icon = entity.iconOverride
        name = entity.nameOverride
        # type of the item is the string before the "." in the entityId
        entityType = entityId.split(".")[0]
        
        self._ha_api.log(f"Generating item for {entityId} with type {entityType}", level="DEBUG")
        # Internal types
        if entityType == "delete":
            return f"~{entityType}~~~~~"
        if entityType == "navigate":
            page_search_res = self._config.searchCard(entityId)
            if page_search_res is not None:
                name = name if name is not None else page_search_res.title
                text = get_translation(self._locale,"PRESS")
                icon_id = get_icon_id(icon) if icon is not None else get_icon_id("gesture-tap-button")
                return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
            else:
                return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~page not found~"
        if not self._ha_api.entity_exists(entityId):
            return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~Not found check~ apps.yaml"
        
        # HA Entities
        entity = self._ha_api.get_entity(entityId)
        name = name if name is not None else entity.attributes.friendly_name
        if entityType == "cover":
            icon_id = get_icon_id_ha("cover", state=entity.state, overwrite=icon)
            return f"~shutter~{entityId}~{icon_id}~17299~{name}~"
        if entityType in "light":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha("light", overwrite=icon)
            return f"~{entityType}~{entityId}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if entityType in ["switch", "input_boolean"]:
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha(entityType, state=entity.state, overwrite=icon)
            return f"~switch~{entityId}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if entityType in ["sensor", "binary_sensor"]:
            device_class = entity.attributes.get("device_class", "")
            icon_id = get_icon_id_ha("sensor", state=entity.state, device_class=device_class, overwrite=icon)
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            value = entity.state + " " + unit_of_measurement
            icon_color = self.get_entity_color(entity)
            return f"~text~{entityId}~{icon_id}~{icon_color}~{name}~{value}"
        if entityType in ["button", "input_button"]:
            icon_id = get_icon_id_ha("button", overwrite=icon)
            text = get_translation(self._locale,"PRESS")
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "scene":
            icon_id = get_icon_id_ha("scene", overwrite=icon)
            text = get_translation(self._locale,"ACTIVATE")
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "script":
            icon_id = get_icon_id_ha("script", overwrite=icon)
            text = get_translation(self._locale,"run")
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "lock":
            icon_id = get_icon_id_ha("lock", state=entity.state, overwrite=icon)
            icon_color = self.get_entity_color(entity)
            text = get_translation(self._locale,"lock") if entity.state == "unlocked" else get_translation(self._locale,"unlock")
            return f"~button~{entityId}~{icon_id}~{icon_color}~{name}~{text}"
        if entityType == "number":
            icon_id = get_icon_id_ha("number", overwrite=icon)
            min_v = entity.attributes.get("min", 0)
            max_v = entity.attributes.get("max", 100)
            return f"~number~{entityId}~{icon_id}~17299~{name}~{entity.state}|{min_v}|{max_v}"
        if entityType == "fan":
            icon_id = get_icon_id_ha("fan", overwrite=icon)
            icon_color = self.get_entity_color(entity)
            return f"~number~{entityId}~{icon_id}~{icon_color}~{name}~{entity.attributes.percentage}|0|100"
        if entityType == "input_text":
            icon_id = get_icon_id_ha("input_text", overwrite=icon)
            value = entity.state
            return f"~text~{entityId}~{icon_id}~17299~{name}~{value}"
        return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~error~"

    def generate_entities_page(self, navigation, heading, items):
        command = f"entityUpd~{heading}~{navigation}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item)
        self._send_mqtt_msg(command)



    def generate_thermo_page(self, navigation, entity):
        item = entity.entityId
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~{heading}~{navigation}~{item}~220~220~Not found~150~300~5"
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
            command = f"entityUpd~{heading}~{navigation}~{item}~{current_temp}~{dest_temp}~{status}~{min_temp}~{max_temp}~{step_temp}{icon_res}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, navigation, entity):
        item = entity.entityId
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~|Not found||{item}|{get_icon_id('alert-circle-outline')}|Please check your|apps.yaml in AppDaemon|50|{get_icon_id('alert-circle-outline')}"
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
            command = f"entityUpd~{heading}~{navigation}~{item}~{icon}~{title}~{author}~{volume}~{iconplaypause}~{source}~{speakerlist[:200]}~{onoffbutton}"
        self._send_mqtt_msg(command)
        
    def generate_alarm_page(self, navigation, entity):
        item = entity.entityId
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~{item}~~Not found~Not found~Check your~Check your~apps.~apps.~yaml~yaml~0~~0"
        else:
            entity        = self._ha_api.get_entity(item)
            icon = get_icon_id("shield-off")
            color = rgb_dec565([255,255,255])
            supported_modes = []
            numpad = "enable"
            if entity.state == "disarmed":
                color = rgb_dec565([13,160,53])
                icon = get_icon_id("shield-off")
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
            command = f"entityUpd~{item}~{navigation}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}"
        self._send_mqtt_msg(command)
        
    def render_card(self, card, send_page_type=True):
        self._ha_api.log(f"Started rendering of page {card.pos} with type {card.cardType}")
        if len(self._config._config_cards) == 1:
            navigation = "0|0"
        else:
            navigation = "1|1"
        if card.pos is None:
            navigation = "2|0"
        # Switch to page
        if send_page_type:
            self.page_type(card.cardType)

        if card.cardType in ["cardEntities", "cardGrid"]:
            self.generate_entities_page(navigation, card.title, card.entities)
            return
        if card.cardType == "cardThermo":
            self.generate_thermo_page(navigation, card.entity)
        if card.cardType == "cardMedia":
            self.generate_media_page(navigation, card.entity)
        if card.cardType == "cardAlarm":
            self.generate_alarm_page(navigation, card.entity)
        if card.cardType == "screensaver":
            self.update_screensaver_weather()


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
        color_translation      = "Color"
        brightness_translation = get_translation(self._locale, "brightness")
        color_temp_translation = get_translation(self._locale, "color_temperature")
        self._send_mqtt_msg(f"entityUpdateDetail~{get_icon_id('lightbulb')}~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}~{color_translation}~{color_temp_translation}~{brightness_translation}")
    
    def generate_shutter_detail_page(self, entity):
        entity = self._ha_api.get_entity(entity)
        pos = int(entity.attributes.get("current_position", 50))
        pos_translation = get_translation(self._locale, "position")
        self._send_mqtt_msg(f"entityUpdateDetail~{pos}~{pos_translation}: {pos}~{pos_translation}")

    def send_message_page(self, id, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~{id}~{heading}~65535~{b1}~65535~{b2}~65535~{msg}~65535~0")
