import datetime
from helper import scale, pos_to_color

from pages import LuiPagesGen

class LuiController(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._send_mqtt_msg = send_mqtt_msg

        self._current_card = self._config._config_screensaver
        self._previous_cards = []
        # first card (default, after startup)
        self._previous_cards.append(self._config.getCard(0))
        
        self._pages_gen = LuiPagesGen(ha_api, config, send_mqtt_msg)

        # send panel back to startup page on restart of this script
        self._pages_gen.page_type("pageStartup")
        
        # time update callback
        time = datetime.time(0, 0, 0)
        ha_api.run_minutely(self._pages_gen.update_time, time)

        # Setup date callback
        ha_api.run_daily(self._pages_gen.update_date, time)

        # register callbacks
        self.register_callbacks()

        # register callbacks for each time
        if type(self._config.get("sleepBrightness")) == list:
            for index, timeset in enumerate(self._config.get("sleepBrightness")):
                self._ha_api.run_daily(self.update_screensaver_brightness, timeset["time"], value=timeset["value"])
        
        # calculate current brightness
        self.current_screensaver_brightness = self.calc_current_screensaver_brightness()

        # call update_screensaver_brightness on changes of entity configured in brightnessScreensaverTracking
        bst = self._config.get("sleepTracking")
        if bst is not None and self._ha_api.entity_exists(bst):
            self._ha_api.listen_state(self.update_screensaver_brightness_state_callback, entity_id=bst)

        # register callback for state changes on tracked value
        sleep_brightness_config = self._config.get("sleepBrightness")
        if type(sleep_brightness_config) == str and self._ha_api.entity_exists(sleep_brightness_config):
            self._ha_api.listen_state(self.update_screensaver_brightness_state_callback, entity_id=sleep_brightness_config)

    def startup(self):
        self._ha_api.log(f"Startup Event")
        # send time and date on startup
        self._pages_gen.update_time("")
        self._pages_gen.update_date("")

        # set screensaver timeout
        timeout = self._config.get("sleepTimeout")
        self._send_mqtt_msg(f"timeout~{timeout}")
        
        # set current screensaver brightness
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})
        
        # send panel to screensaver
        self._pages_gen.render_card(self._current_card)


    def update_screensaver_brightness_state_callback(self, entity, attribute, old, new, kwargs):
        if type(self._config.get("sleepBrightness")) == str:
            self.current_screensaver_brightness = self.calc_current_screensaver_brightness()
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})
        
    def update_screensaver_brightness(self, kwargs):
        bst = self._config.get("sleepTracking")
        brightness = 0
        if bst is not None and self._ha_api.entity_exists(bst) and self._ha_api.get_entity(bst).state in ["not_home", "off"]:
            brightness = 0
        else:
            self.current_screensaver_brightness = kwargs['value']
            brightness = kwargs['value']
        self._send_mqtt_msg(f"dimmode~{brightness}")
        
    def calc_current_screensaver_brightness(self):
        current_screensaver_brightness = 20
        sleep_brightness_config = self._config.get("sleepBrightness")
        # set brightness of screensaver
        if type(sleep_brightness_config) == int:
            current_screensaver_brightness = sleep_brightness_config
        elif type(sleep_brightness_config) == str:
                current_screensaver_brightness = int(float(self._ha_api.get_state(sleep_brightness_config)))
        elif type(sleep_brightness_config) == list:
            sorted_timesets = sorted(sleep_brightness_config, key=lambda d: self._ha_api.parse_time(d['time']))
            # calc current screensaver brightness
            found_current_dim_value = False
            for index, timeset in enumerate(sorted_timesets):
                self._ha_api.log("Current time %s", self._ha_api.get_now().time())
                if self._ha_api.parse_time(timeset["time"]) > self._ha_api.get_now().time() and not found_current_dim_value:
                    # first time after current time, set dim value
                    current_screensaver_brightness = sorted_timesets[index-1]["value"]
                    self._ha_api.log("Setting dim value to %s", sorted_timesets[index-1])
                    found_current_dim_value = True
            # still no dim value
            if not found_current_dim_value:
                current_screensaver_brightness = sorted_timesets[-1]["value"]
        return current_screensaver_brightness

    def register_callbacks(self):
        items = self._config.get_all_entity_names()
        self._ha_api.log(f"Registering callbacks for the following items: {items}")
        for item in items:
            if self._ha_api.entity_exists(item):
                self._ha_api.listen_state(self.state_change_callback, entity_id=item, attribute="all")

    def state_change_callback(self, entity, attribute, old, new, kwargs):
        self._ha_api.log(f"Got callback for: {entity}", level="DEBUG")
        self._ha_api.log(f"Current page has the following items: {self._current_card.get_entity_list()}", level="DEBUG")
        if entity in self._current_card.get_entity_list():
            self._ha_api.log(f"Callback Entity is on current page: {entity}", level="DEBUG")
            self._pages_gen.render_card(self._current_card, send_page_type=False)
            # send detail page update, just in case
            if self._current_card.cardType in ["cardGrid", "cardEntities"]:
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
        self._ha_api.log(f"Button Press Event; entity_id: {entity_id}; button_type: {button_type}; value: {value} ")
        # internal buttons
        if entity_id == "screensaver" and button_type == "bExit":
            # get default card if there is one
            if self._config.get("screensaver.defaultCard") is not None:
                dstCard = self._config.searchCard(self._config.get("screensaver.defaultCard"))
                if dstCard is not None:
                    self._previous_cards = []
                    self._previous_cards.append(dstCard)
            # check for double tap if configured and render current page
            if self._config.get("screensaver.doubleTapToUnlock") and int(value) >= 2:
                self._current_card = self._previous_cards.pop()
                self._pages_gen.render_card(self._current_card)
            elif not self._config.get("screensaver.doubleTapToUnlock"):
                self._current_card = self._previous_cards.pop()
                self._pages_gen.render_card(self._current_card)
            return
            
        if button_type == "sleepReached":
            self._previous_cards.append(self._current_card)
            self._current_card = self._config._config_screensaver
            self._pages_gen.render_card(self._current_card)
            return

        if button_type == "bExit":
            self._pages_gen.render_card(self._current_card)
        if button_type == "bUp":
            self._current_card = self._previous_cards.pop()
            self._pages_gen.render_card(self._current_card)

        if button_type == "bNext":
            card = self._config.getCard(self._current_card.pos+1)
            self._current_card = card
            self._pages_gen.render_card(card)
        if button_type == "bPrev":
            card = self._config.getCard(self._current_card.pos-1)
            self._current_card = card
            self._pages_gen.render_card(card)
        
        elif entity_id == "updateDisplayNoYes" and value == "no":
            self._pages_gen.render_card(self._current_card)

        # buttons with actions on HA
        if button_type == "OnOff":
            if value == "1":
                self._ha_api.turn_on(entity_id)
            else:
                self._ha_api.turn_off(entity_id)

        if button_type == "number-set":
            if entity_id.startswith('fan'):
                self._ha_api.get_entity(entity_id).call_service("set_percentage", percentage=value)
            else:
                self._ha_api.get_entity(entity_id).call_service("set_value", value=value)

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
                self._previous_cards.append(self._current_card)
                self._current_card = self._config.searchCard(entity_id)
                self._pages_gen.render_card(self._current_card)
            elif entity_id.startswith('scene'):
                self._ha_api.get_entity(entity_id).call_service("turn_on")
            elif entity_id.startswith('script'):
                self._ha_api.get_entity(entity_id).call_service("turn_on")
            elif entity_id.startswith('light') or entity_id.startswith('switch') or entity_id.startswith('input_boolean'):
                self._ha_api.get_entity(entity_id).call_service("toggle")
            elif entity_id.startswith('lock'):
                if self._ha_api.get_entity(entity_id).state == "locked":
                    self._ha_api.get_entity(entity_id).call_service("unlock")
                else:
                    self._ha_api.get_entity(entity_id).call_service("lock")
            else:
                self._ha_api.get_entity(entity_id).call_service("press")

        # for media page
        if button_type == "media-next":
            self._ha_api.get_entity(entity_id).call_service("media_next_track")
        if button_type == "media-back":
            self._ha_api.get_entity(entity_id).call_service("media_previous_track")
        if button_type == "media-pause":
            self._ha_api.get_entity(entity_id).call_service("media_play_pause")
        if button_type == "media-OnOff":
            if self._ha_api.get_entity(entity_id).state == "off":
                self._ha_api.get_entity(entity_id).call_service("turn_on")
            else:
                self._ha_api.get_entity(entity_id).call_service("turn_off")
        if button_type == "volumeSlider":
            pos = int(value)
            # HA wants this value between 0 and 1 as float
            pos = pos/100
            self._ha_api.get_entity(entity_id).call_service("volume_set", volume_level=pos)
        if button_type == "speaker-sel":
            self._ha_api.get_entity(entity_id).call_service("select_source", source=value)
            
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
        if button_type == "hvac_action":
            self._ha_api.get_entity(entity_id).call_service("set_hvac_mode", hvac_mode=value)
            
        # for alarm page
        if button_type in ["disarm", "arm_home", "arm_away", "arm_night", "arm_vacation"]:
            self._ha_api.get_entity(entity_id).call_service(f"alarm_{button_type}", code=value)
