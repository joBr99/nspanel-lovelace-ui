import logging
import datetime

from icon_mapping import get_icon_id
from icons import get_icon_id_ha
from helper import scale, pos_to_color, rgb_dec565, rgb_brightness

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
    import babel.dates

LOGGER = logging.getLogger(__name__)

class LuiPages(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._send_mqtt_msg = send_mqtt_msg
    
    def getEntityColor(self, entity):
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
            locale     = self._config.get("locale")
            date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=locale)
        else:
            dateformat = self._config.get("dateFormat")
            date = datetime.datetime.now().strftime(dateformat)
        self._send_mqtt_msg(f"date,?{date}")

    def page_type(self, target_page):
        self._send_mqtt_msg(f"pageType,{target_page}")
    
    def update_screensaver_weather(self, kwargs):
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

        up1   = we.attributes.forecast[0]['datetime']
        up1   = datetime.datetime.fromisoformat(up1)
        icon1 = get_icon_id_ha("weather", state=we.attributes.forecast[0]['condition'])
        down1 = we.attributes.forecast[0]['temperature']

        up2   = we.attributes.forecast[1]['datetime']
        up2   = datetime.datetime.fromisoformat(up2)
        icon2 = get_icon_id_ha("weather", state=we.attributes.forecast[1]['condition'])
        down2 = we.attributes.forecast[1]['temperature']

        global babel_spec
        if babel_spec is not None:
            up1 = babel.dates.format_date(up1, "E", locale=self.config["locale"])
            up2 = babel.dates.format_date(up2, "E", locale=self.config["locale"])
        else:
            up1 = up1.strftime("%a")
            up2 = up2.strftime("%a")

        self._send_mqtt_msg(f"weatherUpdate,?{icon_cur}?{text_cur}?{icon_cur_detail}?{text_cur_detail}?{up1}?{icon1}?{down1}?{up2}?{icon2}?{down2}")

    def generate_entities_item(self, item):
        icon = None
        if type(item) is dict:
            icon = next(iter(item.items()))[1]['icon']
            item = next(iter(item.items()))[0]
        # type of the item is the string before the "." in the item name
        item_type = item.split(".")[0]
        LOGGER.info(f"Generating item command for {item} with type {item_type}",)
        # Internal Entities 
        if item_type == "delete":
            return f",{item_type},,,,,"
        if item_type == "navigate":
            icon_id = get_icon_id_ha("button", overwrite=icon)
            return f",button,{item},0,17299,{item},PRESS"
        if not self._ha_api.entity_exists(item):
            return f",text,{item},{get_icon_id('alert-circle-outline')},17299,Not found check, apps.yaml"
        # HA Entities
        entity = self._ha_api.get_entity(item)
        name = entity.attributes.friendly_name
        if item_type == "cover":
            icon_id = get_icon_id_ha("cover", state=entity.state, overwrite=icon)
            return f",shutter,{item},{icon_id},17299,{name},"
        if item_type in "light":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.getEntityColor(entity)
            icon_id = get_icon_id_ha("light", overwrite=icon)
            return f",{item_type},{item},{icon_id},{icon_color},{name},{switch_val}"
        if item_type in ["switch", "input_boolean"]:
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.getEntityColor(entity)
            icon_id = get_icon_id_ha(item_type, state=entity.state, overwrite=icon)
            return f",switch,{item},{icon_id},{icon_color},{name},{switch_val}"
        if item_type in ["sensor", "binary_sensor"]:
            device_class = self.get_safe_ha_attribute(entity.attributes, "device_class", "")
            icon_id = get_icon_id_ha("sensor", state=entity.state, device_class=device_class, overwrite=icon)
            unit_of_measurement = self.get_safe_ha_attribute(entity.attributes, "unit_of_measurement", "")
            value = entity.state + " " + unit_of_measurement
            return f",text,{item},{icon_id},17299,{name},{value}"
        if item_type in ["button", "input_button"]:
            icon_id = get_icon_id_ha("button", overwrite=icon)
            return f",button,{item},{icon_id},17299,{name},PRESS"
        if item_type == "scene":
            icon_id = get_icon_id_ha("scene", overwrite=icon)
            return f",button,{item},{icon_id},17299,{name},ACTIVATE"


    def generate_entities_page(self, heading, items):
        # Set Heading of Page
        self._send_mqtt_msg(f"entityUpdHeading,{heading}")
        # Get items and construct cmd string
        command = "entityUpd"
        for item in items:
            command += self.generate_entities_item(item)
        self._send_mqtt_msg(command)



    def render_page(self, page):
        config  = page.data
        ptype   = config["type"]
        LOGGER.info(f"Started rendering of page x with type {ptype}")
        # Switch to page
        self.page_type(ptype)
        if ptype == "screensaver":
            we_name = config["weather"]
            # update weather information
            self.update_screensaver_weather(kwargs={"weather": we_name, "unit": "°C"})
            return
        if ptype == "cardEntities":
            heading = config.get("heading", "unknown")
            self.generate_entities_page(heading, page.get_items())
            return


