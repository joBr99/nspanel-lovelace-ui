import logging
import datetime

from icon_mapping import get_icon_id
from icons import get_icon_id_ha
from helper import scale, rgb_dec565, rgb_brightness
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
        self._send_mqtt_msg(f"time,{time}")

    def update_date(self, kwargs):
        global babel_spec
        if babel_spec is not None:
            dateformat = self._config.get("dateFormatBabel")
            date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=self._locale)
        else:
            dateformat = self._config.get("dateFormat")
            date = datetime.datetime.now().strftime(dateformat)
        self._send_mqtt_msg(f"date,?{date}")

    def page_type(self, target_page):
        self._send_mqtt_msg(f"pageType,{target_page}")
    
    def update_screensaver_weather(self, kwargs):
        global babel_spec
        we_name = kwargs['weather']
        unit = kwargs['unit']

        if self._ha_api.entity_exists(we_name):
            we = self._ha_api.get_entity(we_name)
        else:
            LOGGER.error("Skipping Weather Update, entitiy not found")
            return

        icon_cur        = get_icon_id_ha("weather", state=we.state)
        text_cur        = f"{we.attributes.temperature}{unit}"
        icon_cur_detail = get_icon_id("water-percent")
        text_cur_detail = f"{we.attributes.humidity} %"

        wOF1 = self._config.get("weatherOverrideForecast1")
        if wOF1 is None:
            up1   = we.attributes.forecast[0]['datetime']
            up1   = datetime.datetime.fromisoformat(up1)
            if babel_spec is not None:
                up1 = babel.dates.format_date(up1, "E", locale=self._locale)
            else:
                up1 = up1.strftime("%a")
            icon1 = get_icon_id_ha("weather", state=we.attributes.forecast[0]['condition'])
            down1 = f"{we.attributes.forecast[0]['temperature']} {unit}"
        else:
            LOGGER.info(f"Forecast 1 is overrriden with {wOF1}")
            icon = None
            name = None
            if type(wOF1) is dict:
                icon = next(iter(wOF1.items()))[1].get('icon')
                name = next(iter(wOF1.items()))[1].get('name')
                wOF1 = next(iter(wOF1.items()))[0]
            entity = self._ha_api.get_entity(wOF1)
            up1 = name if name is not None else entity.attributes.friendly_name
            icon1 = get_icon_id_ha("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            down1 = f"{entity.state} {unit_of_measurement}"


        wOF2 = self._config.get("weatherOverrideForecast2")
        if wOF2 is None:
            up2   = we.attributes.forecast[1]['datetime']
            up2   = datetime.datetime.fromisoformat(up2)
            if babel_spec is not None:
                up2 = babel.dates.format_date(up2, "E", locale=self._locale)
            else:
                up2 = up2.strftime("%a")
            icon2 = get_icon_id_ha("weather", state=we.attributes.forecast[1]['condition'])
            down2 = f"{we.attributes.forecast[1]['temperature']} {unit}"

        else:
            LOGGER.info(f"Forecast 2 is overrriden with {wOF2}")
            icon = None
            name = None
            if type(wOF2) is dict:
                icon = next(iter(wOF2.items()))[1].get('icon')
                name = next(iter(wOF2.items()))[1].get('name')
                wOF2 = next(iter(wOF2.items()))[0]
            entity = self._ha_api.get_entity(wOF2)
            up2 = name if name is not None else entity.attributes.friendly_name
            icon2 = get_icon_id_ha("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            down2 = f"{entity.state} {unit_of_measurement}"

            
        self._send_mqtt_msg(f"weatherUpdate,?{icon_cur}?{text_cur}?{icon_cur_detail}?{text_cur_detail}?{up1}?{icon1}?{down1}?{up2}?{icon2}?{down2}")

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
            return f",{item_type},,,,,"
        if item_type == "navigate":
            page_search = self._config.get_root_page().search_page_by_name(item)
            if len(page_search) > 0:
                page_data = page_search[0].data
                if name is None:
                    name = page_data.get("heading")
                text = get_translation(self._locale,"PRESS")
                icon_id = get_icon_id(icon) if icon is not None else get_icon_id(page_data.get("icon", "gesture-tap-button"))
                return f",button,{item},{icon_id},17299,{name},{text}"
            else:
                return f",text,{item},{get_icon_id('alert-circle-outline')},17299,page not found,"
        if not self._ha_api.entity_exists(item):
            return f",text,{item},{get_icon_id('alert-circle-outline')},17299,Not found check, apps.yaml"
        
        # HA Entities
        entity = self._ha_api.get_entity(item)
        name = name if name is not None else entity.attributes.friendly_name
        if item_type == "cover":
            icon_id = get_icon_id_ha("cover", state=entity.state, overwrite=icon)
            return f",shutter,{item},{icon_id},17299,{name},"
        if item_type in "light":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha("light", overwrite=icon)
            return f",{item_type},{item},{icon_id},{icon_color},{name},{switch_val}"
        if item_type in ["switch", "input_boolean"]:
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity)
            icon_id = get_icon_id_ha(item_type, state=entity.state, overwrite=icon)
            return f",switch,{item},{icon_id},{icon_color},{name},{switch_val}"
        if item_type in ["sensor", "binary_sensor"]:
            device_class = entity.attributes.get("device_class", "")
            icon_id = get_icon_id_ha("sensor", state=entity.state, device_class=device_class, overwrite=icon)
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            value = entity.state + " " + unit_of_measurement
            icon_color = self.get_entity_color(entity)
            return f",text,{item},{icon_id},{icon_color},{name},{value}"
        if item_type in ["button", "input_button"]:
            icon_id = get_icon_id_ha("button", overwrite=icon)
            text = get_translation(self._locale,"PRESS")
            return f",button,{item},{icon_id},17299,{name},{text}"
        if item_type == "scene":
            icon_id = get_icon_id_ha("scene", overwrite=icon)
            text = get_translation(self._locale,"ACTIVATE")
            return f",button,{item},{icon_id},17299,{name},{text}"


    def generate_entities_page(self, heading, items):
        # Set Heading of Page
        self._send_mqtt_msg(f"entityUpdHeading,{heading}")
        # Get items and construct cmd string
        command = "entityUpd"
        for item in items:
            command += self.generate_entities_item(item)
        self._send_mqtt_msg(command)


    def generate_thermo_page(self, item):
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd,{item},Not found,220,220,Not found,150,300,5"
        else:
            entity       = self._ha_api.get_entity(item)
            heading      = entity.attributes.friendly_name
            current_temp = int(entity.attributes.get("current_temperature", 0)*10)
            dest_temp    = int(entity.attributes.get("temperature", 0)*10)
            status       = entity.attributes.get("hvac_action", "")
            status       = get_translation(self._locale,status)
            min_temp     = int(entity.attributes.get("min_temp", 0)*10)
            max_temp     = int(entity.attributes.get("max_temp", 0)*10)
            step_temp    = int(entity.attributes.get("target_temp_step", 0.5)*10) 
            icon_res = ""
            hvac_modes = entity.attributes.get("hvac_modes", [])
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
                icon_res += f",{icon_id},{color_on},{state},{mode}"
    
            len_hvac_modes = len(hvac_modes)
            if len_hvac_modes%2 == 0:
                # even
                padding_len = int((4-len_hvac_modes)/2)
                icon_res =  ","*4*padding_len + icon_res + ","*4*padding_len
                # use last 4 icons
                icon_res =  ","*4*5 + icon_res
            else:
                # uneven
                padding_len = int((5-len_hvac_modes)/2)
                icon_res =  ","*4*padding_len + icon_res + ","*4*padding_len
                # use first 5 icons
                icon_res = icon_res + ","*4*4
            command = f"entityUpd,{item},{heading},{current_temp},{dest_temp},{status},{min_temp},{max_temp},{step_temp}{icon_res}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, item):
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd,|{item}|Not found|{get_icon_id('alert-circle-outline')}|Please check your|apps.yaml in AppDaemon|50|{get_icon_id('alert-circle-outline')}"
        else:
            entity        = self._ha_api.get_entity(item)
            heading       = entity.attributes.friendly_name
            icon          = 0
            title         = entity.attributes.get("media_title", "")
            author        = entity.attributes.get("media_artist", "")
            volume        = int(entity.attributes.get("volume_level", 0)*100)
            iconplaypause = get_icon_id("pause") if entity.state == "playing" else get_icon_id("play")
            if "media_content_type" in entity.attributes:
                if entity.attributes.media_content_type == "music":
                    icon = get_icon_id("music")
            source        = entity.attributes.get("source", "")
            speakerlist   = entity.attributes.get("source_list","")
            if source in speakerlist:
                speakerlist.remove(source)
                speakerlist.append(source)
            speakerlist = "?".join(speakerlist)
            command = f"entityUpd,|{item}|{heading}|{icon}|{title}|{author}|{volume}|{iconplaypause}|{source}|{speakerlist}"
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
        self._send_mqtt_msg(f"entityUpdateDetail,{get_icon_id('lightbulb')},{icon_color},{switch_val},{brightness},{color_temp},{color}")
    
    def generate_shutter_detail_page(self, entity):
        pos = 100-int(entity.attributes.get("current_position", 50))
        self._send_mqtt_msg(f"entityUpdateDetail,{pos}")

    def send_message_page(self, id, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType,popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail,|{id}|{heading}|65535|{b1}|65535|{b2}|65535|{msg}|65535|0")
