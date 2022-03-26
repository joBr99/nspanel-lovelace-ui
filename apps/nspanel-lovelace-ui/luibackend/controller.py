import logging
import datetime
from helper import scale, pos_to_color

from pages import LuiPagesGen

LOGGER = logging.getLogger(__name__)

class LuiController(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._send_mqtt_msg = send_mqtt_msg

        # first child of root page (default, after startup)
        self._current_page = self._config._page_config.childs[0]
        
        self._pages_gen = LuiPagesGen(ha_api, config, send_mqtt_msg)

        # send panel back to startup page on restart of this script
        self._pages_gen.page_type("pageStartup")
        
        # time update callback
        time = datetime.time(0, 0, 0)
        ha_api.run_minutely(self._pages_gen.update_time, time)
        # weather callback
        weather_interval = 15 * 60 # 15 minutes
        ha_api.run_every(self.weather_update, "now", weather_interval)
        # register callbacks
        self.register_callbacks()

        self.current_screensaver_brightness = 20
        # calc screensaver brightness
        # set brightness of screensaver
        if type(self._config.get("brightnessScreensaver")) == int:
            self.current_screensaver_brightness = self._config.get("brightnessScreensaver")
        elif type(self._config.get("brightnessScreensaver")) == list:
            sorted_timesets = sorted(self._config.get("brightnessScreensaver"), key=lambda d: self._ha_api.parse_time(d['time']))
            found_current_dim_value = False
            for index, timeset in enumerate(sorted_timesets):
                self._ha_api.run_daily(self.update_screensaver_brightness, timeset["time"], value=timeset["value"])
                LOGGER.info("Current time %s", self._ha_api.get_now().time())
                if self._ha_api.parse_time(timeset["time"]) > self._ha_api.get_now().time() and not found_current_dim_value:
                    # first time after current time, set dim value
                    self.current_screensaver_brightness = sorted_timesets[index-1]["value"]
                    LOGGER.info("Setting dim value to %s", sorted_timesets[index-1])
                    found_current_dim_value = True
                # still no dim value
                if not found_current_dim_value:
                    self.current_screensaver_brightness = sorted_timesets[-1]["value"]
                # send screensaver brightness in case config has changed
                self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})

    def startup(self):
        LOGGER.info(f"Startup Event")
        # send time and date on startup
        self._pages_gen.update_time("")
        self._pages_gen.update_date("")

        # set screensaver timeout
        timeout = self._config.get("timeoutScreensaver")
        self._send_mqtt_msg(f"timeout,{timeout}")
        
        # set current screensaver brightness
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})
        
        # send panel to screensaver
        self._pages_gen.page_type("screensaver")
        self.weather_update("")

    def update_screensaver_brightness(self, kwargs):
        self.current_screensaver_brightness = kwargs['value']
        self._send_mqtt_msg(f"dimmode,{self.current_screensaver_brightness}")

    def weather_update(self, kwargs):
        we_name = self._config.get("weather")
        unit    = "°C"
        self._pages_gen.update_screensaver_weather(kwargs={"weather": we_name, "unit": unit})

    def register_callbacks(self):
        items = self._config.get_root_page().get_all_item_names()
        LOGGER.debug(f"Registering callbacks for the following items: {items}")
        for item in items:
            if self._ha_api.entity_exists(item):
                self._ha_api.listen_state(self.state_change_callback, entity_id=item, attribute="all")

    def state_change_callback(self, entity, attribute, old, new, kwargs):
        LOGGER.debug(f"Got callback for: {entity}")
        LOGGER.debug(f"Current page has the following items: {self._current_page.get_items()}")
        if entity in self._current_page.get_all_item_names(recursive=False):
            LOGGER.debug(f"Callback Entity is on current page: {entity}")
            self._pages_gen.render_page(self._current_page, send_page_type=False)
            # send detail page update, just in case
            if self._current_page.data.get("type", "unknown") in ["cardGrid", "cardEntities"]:
                if entity.startswith("light"):
                    self._pages_gen.generate_light_detail_page(entity)
                if entity.startswith("cover"):
                    self._pages_gen.generate_shutter_detail_page(entity)


    def detail_open(self, detail_type, entity_id):
        if detail_type == "popupShutter":
            self._pages_gen.generate_shutter_detail_page(entity_id)
        if detail_type == "popupLight":
            self._pages_gen.generate_light_detail_page(entity_id)

    def button_press(self, entity_id, button_type, value):
        LOGGER.info(f"Button Press Event; entity_id: {entity_id}; button_type: {button_type}; value: {value} ")
        # internal buttons
        if entity_id == "screensaver" and button_type == "enter":
            self._pages_gen.render_page(self._current_page)
        if button_type == "bExit":
            self._pages_gen.render_page(self._current_page)

        if button_type == "bNext":
            self._current_page = self._current_page.next()
            self._pages_gen.render_page(self._current_page)
        if button_type == "bPrev":
            self._current_page = self._current_page.prev()
            self._pages_gen.render_page(self._current_page)
        
        elif entity_id == "updateDisplayNoYes" and value == "no":
            self._pages_gen.render_page(self._current_page)

        # buttons with actions on HA
        if button_type == "OnOff":
            if value == "1":
                self._ha_api.turn_on(entity_id)
            else:
                self._ha_api.turn_off(entity_id)

        # for shutter / covers
        if button_type == "up":
            self._ha_api.get_entity(entity_id).call_service("open_cover")
        if button_type == "stop":
            self._ha_api.get_entity(entity_id).call_service("stop_cover")
        if button_type == "down":
            self._ha_api.get_entity(entity_id).call_service("close_cover")
        if button_type == "positionSlider":
            pos = int(value)
            self._ha_api.get_entity(entity_id).call_service("set_cover_position", position=pos)

        if button_type == "button":
            if entity_id.startswith('navigate'):
                # internal for navigation to nested pages
                topage = self._config.get_root_page().search_page_by_name(entity_id)[0]
                self._pages_gen.render_page(topage)
            elif entity_id.startswith('scene'):
                self._ha_api.get_entity(entity_id).call_service("turn_on")
            elif entity_id.startswith('light') or entity_id.startswith('switch') or entity_id.startswith('input_boolean'):
                self._ha_api.get_entity(entity_id).call_service("toggle")
            else:
                self._ha_api.get_entity(entity_id).call_service("press")

        # for media page
        if button_type == "media-next":
            self._ha_api.get_entity(entity_id).call_service("media_next_track")
        if button_type == "media-back":
            self._ha_api.get_entity(entity_id).call_service("media_previous_track")
        if button_type == "media-pause":
            self._ha_api.get_entity(entity_id).call_service("media_play_pause")
        if button_type == "hvac_action":
            self._ha_api.get_entity(entity_id).call_service("set_hvac_mode", hvac_mode=value)
        if button_type == "volumeSlider":
            pos = int(value)
            # HA wants this value between 0 and 1 as float
            pos = pos/100
            self._ha_api.get_entity(entity_id).call_service("volume_set", volume_level=pos)

        # for light detail page
        if button_type == "brightnessSlider":
            # scale 0-100 to ha brightness range
            brightness = int(scale(int(value),(0,100),(0,255)))
            self._ha_api.get_entity(entity_id).call_service("turn_on", brightness=brightness)
        if button_type == "colorTempSlider":
            entity = self._ha_api.get_entity(entity_id)
            #scale 0-100 from slider to color range of lamp
            color_val = scale(int(value), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
            self._ha_api.get_entity(entity_id).call_service("turn_on", color_temp=color_val)
        if button_type == "colorWheel":
            self._ha_api.log(value)
            value = value.split('|')
            color = pos_to_color(int(value[0]), int(value[1]))
            self._ha_api.log(color)
            self._ha_api.get_entity(entity_id).call_service("turn_on", rgb_color=color)
        
        # for climate page
        if button_type == "tempUpd":
            temp = int(value)/10
            self._ha_api.get_entity(entity_id).call_service("set_temperature", temperature=temp)
