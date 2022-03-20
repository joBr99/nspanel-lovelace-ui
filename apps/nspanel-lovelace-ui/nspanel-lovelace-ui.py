import json
import datetime
import hassapi as hass
from helper import scale, pos_to_color, rgb_dec565, rgb_brightness
from icon_mapper import get_icon_id

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
  import babel.dates

class NsPanelLovelaceUIManager(hass.Hass):
  def initialize(self):

    data = self.args["config"]
    NsPanelLovelaceUI(self, data)

class Updater:
  def __init__(self, nsplui, mode):
    self.desired_display_firmware_version = 11
    self.desired_display_firmware_url     = "http://nspanel.pky.eu/lovelace-ui/github/nspanel-b0027d4.tft"
    self.desired_tasmota_driver_version   = 3
    self.desired_tasmota_driver_url       = "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be"

    self.mode = mode
    self.nsplui = nsplui
    self.current_tasmota_driver_version   = None
    self.current_display_firmware_version = None

  def set_tasmota_driver_version(self, driver_version):
    self.current_tasmota_driver_version = driver_version
  def set_current_display_firmware_version(self, panel_version):
    self.current_display_firmware_version = panel_version
  def check_pre_req(self):
    # we need to know both versions to continue
    if self.current_tasmota_driver_version is not None and self.current_display_firmware_version is not None:
      # tasmota driver has to be at least version 2 for Update command and panel has to be at version 11 for notify commands
      if self.current_tasmota_driver_version >= 2 and self.current_display_firmware_version >= 11:
        return True
    return False
  def check_updates(self):
    # return's true if a notification was send to the panel
    # run pre req check
    if self.check_pre_req():
      self.nsplui.api.log("Update Pre-Check sucessful Tasmota Driver Version: %s Panel Version: %s", self.current_tasmota_driver_version, self.current_display_firmware_version, level="DEBUG")
      # check if tasmota driver needs update
      if self.current_tasmota_driver_version < self.desired_tasmota_driver_version:
        self.nsplui.api.log("Update of Tasmota Driver needed")
        # in auto mode just do the update
        if self.mode == "auto":
          self.update_berry_driver()
          return False
        # send notification about the update
        if self.mode == "auto-notify":
          update_msg = "There's an update avalible for the tasmota      berry driver, do you want to start the update  now?                                                                      If you encounter issues after the update or      this message appears frequently, please checkthe manual and repeat the installation steps   for the tasmota berry driver. "
          self.nsplui.send_message_page("updateBerryNoYes", "Driver Update available!", update_msg, "Dismiss", "Yes")
          return True
        return False
      # check if display firmware needs an update
      if self.current_display_firmware_version < self.desired_display_firmware_version:
        self.nsplui.api.log("Update of Display Firmware needed")
        # in auto mode just do the update
        if self.mode == "auto":
          self.update_panel_driver()
          return False
        # send notification about the update
        if self.mode == "auto-notify":
          update_msg = "There's a firmware update avalible for the       nextion sceen inside of nspanel, do you want  to start the update now?                                     If the update fails check the installation         manual and flash again over the tasmota console. Be pationed the update will take a while."
          self.nsplui.send_message_page("updateDisplayNoYes", "Display Update available!", update_msg, "Dismiss", "Yes")
          return True
        return False
    else:
      self.nsplui.api.log("Update Pre-Check failed Tasmota Driver Version: %s Panel Version: %s", self.current_tasmota_driver_version, self.current_display_firmware_version)
      return False
  def update_berry_driver(self):
    self.nsplui.mqtt.mqtt_publish(self.nsplui.config["panelSendTopic"].replace("CustomSend", "UpdateDriverVersion"), self.desired_tasmota_driver_url)
  def update_panel_driver(self):
    self.nsplui.mqtt.mqtt_publish(self.nsplui.config["panelSendTopic"].replace("CustomSend", "FlashNextion"), self.desired_display_firmware_url)

class NsPanelLovelaceUI:
  def __init__(self, api, config):
    self.api = api
    self.config = config
    self.current_page_nr = 0
    self.current_screensaver_brightness = 10
    
    # check configured items
    self.check_items()

    # Setup, mqtt subscription and callback
    self.mqtt = self.api.get_plugin_api("MQTT")
    self.mqtt.mqtt_subscribe(topic=self.config["panelRecvTopic"])
    self.mqtt.listen_event(self.handle_mqtt_incoming_message, "MQTT_MESSAGE", topic=self.config["panelRecvTopic"], namespace='mqtt')

    if "updateMode" in self.config:
      update_mode = self.config["updateMode"]
    else:
      update_mode = "auto-notify"
    self.updater = Updater(self, update_mode)


    # Request Tasmota Driver Version
    self.mqtt.mqtt_publish(self.config["panelSendTopic"].replace("CustomSend", "GetDriverVersion"), "x")

    # send panel back to startup page on restart of this script
    self.send_mqtt_msg("pageType,pageStartup")

    # Setup time callback
    time = datetime.time(0, 0, 0)
    self.api.run_minutely(self.update_time, time)

    # Setup date callback
    time = datetime.time(0, 0, 0)
    self.api.run_daily(self.update_date, time)
    # send date update in case config has been changed
    self.update_date("")

    # Setup weather callback
    weather_interval = 15 * 60 # 15 minutes
    self.api.run_every(self.update_screensaver_weather, "now", weather_interval)

    # set brightness of screensaver
    if type(self.config["brightnessScreensaver"]) == int:
      self.current_screensaver_brightness = self.config["brightnessScreensaver"]
    elif type(self.config["brightnessScreensaver"]) == list:
      sorted_timesets = sorted(self.config["brightnessScreensaver"], key=lambda d: self.api.parse_time(d['time']))
      found_current_dim_value = False
      for index, timeset in enumerate(sorted_timesets):
        self.api.run_daily(self.update_screensaver_brightness, timeset["time"], value=timeset["value"])
        self.api.log("Current time %s", self.api.get_now().time(), level="DEBUG")
        if self.api.parse_time(timeset["time"]) > self.api.get_now().time() and not found_current_dim_value:
          # first time after current time, set dim value
          self.current_screensaver_brightness = sorted_timesets[index-1]["value"]
          self.api.log("Setting dim value to %s", sorted_timesets[index-1]) #level="DEBUG"
          found_current_dim_value = True
          # send screensaver brightness in case config has changed
          self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})
    
    # register callbacks
    self.register_callbacks()

  def send_mqtt_msg(self,msg):
    self.api.log("Send Message to Tasmota: %s", msg) #, level="DEBUG"
    self.mqtt.mqtt_publish(self.config["panelSendTopic"], msg)

  def handle_mqtt_incoming_message(self, event_name, data, kwargs):
    # Parse Json Message from Tasmota and strip out message from nextion display
    data = json.loads(data["payload"])
    # pass tasmota driver version to updater class
    if("nlui_driver_version" in data):
      msg = data["nlui_driver_version"]
      self.api.log("Received Driver Version from Tasmota: %s", int(msg), level="DEBUG")
      self.updater.set_tasmota_driver_version(int(msg))
      return
    if("CustomRecv" not in data):
      self.api.log("Received Message from Tasmota, but not from nextion screen: %s", data, level="DEBUG")
      return
    msg = data["CustomRecv"]
    self.api.log("Received Message from Tasmota: %s", msg) #, level="DEBUG"
    
    # Split message into parts seperated by ","
    msg = msg.split(",")

    # run action based on received command
    if msg[0] == "event":

      if msg[1] == "startup":
        self.api.log("Handling startup event", level="DEBUG")

        # grab version from screen and pass to updater class
        self.updater.set_current_display_firmware_version(int(msg[2]))

        # send date and time
        self.update_time("")
        self.update_date("")

        # set screensaver timeout
        timeout = self.config["timeoutScreensaver"]
        self.send_mqtt_msg(f"timeout,{timeout}")

        # send screensaver brightness
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})

        # check for updates
        msg_send = self.updater.check_updates()

        # send messages for current page 
        if not msg_send:
          self.generate_page(self.current_page_nr)

      if msg[1] == "pageOpen":
        # Calculate current page
        recv_page = int(msg[2])
        self.current_page_nr = recv_page % len(self.config["pages"])
        self.api.log("Received pageOpen command, raw page: %i, calc page: %i", recv_page, self.current_page_nr, level="DEBUG")
        # generate commands for current page
        self.generate_page(self.current_page_nr)

      if msg[1] == "buttonPress":
        entity_id = msg[4]
        btype = msg[6]
        if len(msg) > 7:
          value = msg[7]
        else:
          value = None
        self.handle_button_press(entity_id, btype, value)

      if msg[1] == "pageOpenDetail":
        self.api.log("Received pageOpenDetail command", level="DEBUG")
        self.generate_detail_page(msg[2], msg[3])

      if msg[1] == "tempUpd":
        self.api.log("Received tempUpd command", level="DEBUG")
        temp = int(msg[4])/10
        self.api.get_entity(msg[3]).call_service("set_temperature", temperature=temp)

      if msg[1] == "screensaverOpen":
        self.update_screensaver_weather("")

  def update_time(self, kwargs):
    time = datetime.datetime.now().strftime(self.config["timeFormat"])
    self.send_mqtt_msg(f"time,{time}")

  def update_date(self, kwargs):
    global babel_spec
    if babel_spec is not None:
      self.api.log("Babel package found", level="DEBUG")
      if "dateFormatBabel" in self.config:
        dateformat = self.config["dateFormatBabel"]
      else:
        dateformat = "full"
      date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=self.config["locale"])
      self.send_mqtt_msg(f"date,?{date}")
    else:
      self.api.log("Babel package not found", level="DEBUG")
      date = datetime.datetime.now().strftime(self.config["dateFormat"])
      self.send_mqtt_msg(f"date,?{date}")

  def update_screensaver_brightness(self, kwargs):
    self.current_screensaver_brightness = kwargs['value']
    self.send_mqtt_msg(f"dimmode,{self.current_screensaver_brightness}")

  def update_screensaver_weather(self, kwargs):
    if not ("weatherEntity" in self.config and self.api.entity_exists(self.config["weatherEntity"])):
      return
    we = self.api.get_entity(self.config["weatherEntity"])
    unit = "°C"

    # this maps possible states from ha to material design icon names
    weathericons = {
      'clear-night': 'weather-night',
      'cloudy': 'weather-cloudy',
      'exceptional': 'alert-circle-outline',
      'fog': 'weather-fog',
      'hail': 'weather-hail',
      'lightning': 'weather-lightning',
      'lightning-rainy': 'weather-lightning-rainy',
      'partlycloudy': 'weather-partly-cloudy',
      'pouring': 'weather-pouring',
      'rainy': 'weather-rainy',
      'snowy': 'weather-snowy',
      'snowy-rainy': 'weather-snowy-rainy',
      'sunny': 'weather-sunny',
      'windy': 'weather-windy',
      'windy-variant': 'weather-windy-variant'
    }

    o1 = we.attributes.forecast[0]['datetime']
    o1 = datetime.datetime.fromisoformat(o1)
    o1 = babel.dates.format_date(o1, "E", locale=self.config["locale"])
    i1 = get_icon_id(weathericons[we.attributes.forecast[0]['condition']])
    u1 = we.attributes.forecast[0]['temperature']
    o2 = we.attributes.forecast[1]['datetime']
    o2 = datetime.datetime.fromisoformat(o2)
    o2 = babel.dates.format_date(o2, "E", locale=self.config["locale"])
    i2 = get_icon_id(weathericons[we.attributes.forecast[1]['condition']])
    u2 = we.attributes.forecast[1]['temperature']
    self.send_mqtt_msg(f"weatherUpdate,?{get_icon_id(weathericons[we.state])}?{we.attributes.temperature}{unit}?{26}?{we.attributes.humidity} %?{o1}?{i1}?{u1}?{o2}?{i2}?{u2}")


  def handle_button_press(self, entity_id, btype, optVal=None):

    if entity_id == "updateBerryNoYes" and optVal == "yes":
      # go back to main page before starting the update
      self.generate_page(self.current_page_nr)
      self.updater.update_berry_driver()
    elif entity_id == "updateBerryNoYes" and optVal == "no":
      self.generate_page(self.current_page_nr)

    if entity_id == "updateDisplayNoYes" and optVal == "yes":
      self.updater.update_panel_driver()
    elif entity_id == "updateDisplayNoYes" and optVal == "no":
      self.generate_page(self.current_page_nr)

    if btype == "OnOff":
      if optVal == "1":
        self.api.turn_on(entity_id)
      else:
        self.api.turn_off(entity_id)
    if btype == "up":
      self.api.get_entity(entity_id).call_service("open_cover")
    if btype == "stop":
      self.api.get_entity(entity_id).call_service("stop_cover")
    if btype == "down":
      self.api.get_entity(entity_id).call_service("close_cover")
      
    if btype == "button":
      if entity_id.startswith('scene'):
        self.api.get_entity(entity_id).call_service("turn_on")
      if entity_id.startswith('light') or entity_id.startswith('switch'):
        self.api.get_entity(entity_id).call_service("toggle")
      else:
        self.api.get_entity(entity_id).call_service("press")

    if btype == "media-next":
      self.api.get_entity(entity_id).call_service("media_next_track")
    if btype == "media-back":
      self.api.get_entity(entity_id).call_service("media_previous_track")
    if btype == "media-pause":
      self.api.get_entity(entity_id).call_service("media_play_pause")

    if btype == "hvac_action":
      self.api.get_entity(entity_id).call_service("set_hvac_mode", hvac_mode=optVal)


    if btype == "brightnessSlider":
      # scale 0-100 to ha brightness range
      brightness = int(scale(int(optVal),(0,100),(0,255)))
      self.api.get_entity(entity_id).call_service("turn_on", brightness=brightness)
      
    if btype == "colorTempSlider":
      entity = self.api.get_entity(entity_id)
      #scale 0-100 from slider to color range of lamp
      color_val = scale(int(optVal), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
      self.api.get_entity(entity_id).call_service("turn_on", color_temp=color_val)

    if btype == "colorWheel":
      self.api.log(optVal)
      optVal = optVal.split('|')
      color = pos_to_color(int(optVal[0]), int(optVal[1]))
      self.api.log(color)
      self.api.get_entity(entity_id).call_service("turn_on", rgb_color=color)
      
    if btype == "positionSlider":
      pos = int(optVal)
      self.api.get_entity(entity_id).call_service("set_cover_position", position=pos)

    if btype == "volumeSlider":
      pos = int(optVal)
      # HA wants this value between 0 and 1 as float
      pos = pos/100
      self.api.get_entity(entity_id).call_service("volume_set", volume_level=pos)

  def check_items(self):
    items = []
    for page in self.config["pages"]:
      if "item" in page:
        items.append(page["item"])
      if "items" in page:
        items.extend(page["items"])
    
    for item in items:
      if self.api.entity_exists(item) or item == "delete":
        self.api.log("Found configured item in Home Assistant %s", item, level="DEBUG")
      else:
        self.api.error("The following item does not exist in Home Assistant, configuration error: %s", item)

  def register_callbacks(self):
    items = []
    for page in self.config["pages"]:
      if "item" in page:
        items.append(page["item"])
      if "items" in page:
        items.extend(page["items"])
    
    for item in items:
      if not self.api.entity_exists(item):
        continue
      self.api.log("Enable state callback for %s", item, level="DEBUG")
      self.api.handle = self.api.listen_state(self.state_change_callback, entity_id=item, attribute="all")

  def state_change_callback(self, entity, attribute, old, new, kwargs):
    current_page_config = self.config["pages"][self.current_page_nr]

    page_type = current_page_config["type"]

    self.api.log(f"Got state_callback from {entity}", level="DEBUG")

    if page_type in ["cardEntities", "cardGrid"]:
      items = current_page_config["items"]
      if entity in items:
        self.api.log(f"State change on current page for {entity}", level="DEBUG")
        # send update of the page
        command = self.generate_entities_page(items)
        self.send_mqtt_msg(command)
        if(entity.startswith("cover")):
          self.generate_detail_page("popupShutter", entity)
        if(entity.startswith("light")):
          self.generate_detail_page("popupLight", entity)

      return
    
    if page_type == "cardThermo" or page_type == "cardMedia":
      if entity == current_page_config["item"]:
        self.api.log(f"State change on current page for {entity}", level="DEBUG")
        # send update of the whole page
        if page_type == "cardThermo":
          self.send_mqtt_msg(self.generate_thermo_page(entity))
          return
        if page_type == "cardMedia":
          self.send_mqtt_msg(self.generate_media_page(entity))
          return
      return

  def generate_page(self, page_number):
    # get type of current page
    page_type = self.config["pages"][self.current_page_nr]["type"]
    self.api.log("Generating page commands for page %i with type %s", self.current_page_nr, page_type, level="DEBUG")
    if page_type == "cardEntities":
      # Send page type
      self.send_mqtt_msg(f"pageType,{page_type}")
      # Set Heading of Page
      self.send_mqtt_msg(f"entityUpdHeading,{self.config['pages'][self.current_page_nr]['heading']}")

      command = self.generate_entities_page(self.config["pages"][self.current_page_nr]["items"])
      self.send_mqtt_msg(command)

    if page_type == "cardGrid":
      # Send page type
      self.send_mqtt_msg(f"pageType,{page_type}")
      # Set Heading of Page
      self.send_mqtt_msg(f"entityUpdHeading,{self.config['pages'][self.current_page_nr]['heading']}")

      command = self.generate_entities_page(self.config["pages"][self.current_page_nr]["items"])
      self.send_mqtt_msg(command)

    if page_type == "cardThermo":
      # Send page type
      self.send_mqtt_msg(f"pageType,{page_type}")
      command = self.generate_thermo_page(self.config["pages"][self.current_page_nr]["item"])
      self.send_mqtt_msg(command)
      
    if page_type == "cardMedia":
      # Send page type
      self.send_mqtt_msg("pageType,{0}".format(page_type))
      command = self.generate_media_page(self.config["pages"][self.current_page_nr]["item"])
      self.send_mqtt_msg(command)

  def generate_entities_item(self, item):

    # type of the item is the string before the "." in the item name
    item_type = item.split(".")[0]

    self.api.log("Generating item command for %s with type %s", item, item_type, level="DEBUG")

    if item_type == "delete":
      return f",{item_type},,,,,"
    
    if not self.api.entity_exists(item):
      return f",text,{item},{get_icon_id('alert-circle-outline')},17299,Not found check, apps.yaml"

    entity = self.api.get_entity(item)
    name = entity.attributes.friendly_name

    if item_type == "cover":
      return f",shutter,{item},{get_icon_id('window-open')},17299,{name},"

    if item_type == "light":     
      switch_val = 1 if entity.state == "on" else 0
      icon_color = 17299
      if "rgb_color" in entity.attributes:
        color = entity.attributes.rgb_color
        if "brightness" in entity.attributes:
          color = rgb_brightness(color, entity.attributes.brightness)
        icon_color = rgb_dec565(color)
      elif "brightness" in entity.attributes:
        color = rgb_brightness([253, 216, 53], entity.attributes.brightness)
        icon_color = rgb_dec565(color)
      return f",{item_type},{item},{get_icon_id('lightbulb')},{icon_color},{name},{switch_val}"

    if item_type == "switch" or item_type == "input_boolean":
      switch_val = 1 if entity.state == "on" else 0
      icon_id = get_icon_id("flash")
      if item_type == "input_boolean":
        if switch_val == 1:
          icon_id = get_icon_id("check-circle-outline")
        else:
          icon_id = get_icon_id("close-circle-outline")
      return f",switch,{item},{icon_id},17299,{name},{switch_val}"

    if item_type == "sensor":
      # maps ha device classes to material design icons
      icon_mapping = {
        "temperature": "thermometer",
        "power": "flash"
      }
      if "device_class" in entity.attributes:
        if entity.attributes.device_class in icon_mapping:
          icon_id = icon_mapping[entity.attributes.device_class]
        else:
          self.api.log("No Icon found for device_class: %s. Please open a issue on github to report the missing mapping.", entity.attributes.device_class)
          icon_id = get_icon_id('alert-circle-outline')
      else:
        icon_id = get_icon_id('alert-circle-outline')
      unit_of_measurement = ""
      if "unit_of_measurement" in entity.attributes:
        unit_of_measurement = entity.attributes.unit_of_measurement
      value = entity.state + " " + unit_of_measurement
      return f",text,{item},{icon_id},17299,{name},{value}"

    if item_type == "button" or item_type == "input_button":
      return f",button,{item},{get_icon_id('gesture-tap-button')},17299,{name},PRESS"
    
    if item_type == "scene":
      return f",button,{item},{get_icon_id('palette')},17299,{name},ACTIVATE"

  def generate_entities_page(self, items):
    # Get items and construct cmd string
    command = "entityUpd"
    for item in items:
      command += self.generate_entities_item(item)
    return command

  def get_safe_ha_attribute(self, eattr, attr, default):
    return eattr[attr] if attr in eattr else default

  def generate_thermo_page(self, item):
    
    if not self.api.entity_exists(item):
      return f"entityUpd,{item},Not found,220,220,Not found,150,300,5"

    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    current_temp = int(self.get_safe_ha_attribute(entity.attributes, "current_temperature", 0)*10)
    dest_temp    = int(self.get_safe_ha_attribute(entity.attributes, "temperature", 0)*10)
    status       = self.get_safe_ha_attribute(entity.attributes, "hvac_action", "")
    min_temp     = int(self.get_safe_ha_attribute(entity.attributes, "min_temp", 0)*10) 
    max_temp     = int(self.get_safe_ha_attribute(entity.attributes, "max_temp", 0)*10) 
    step_temp    = int(self.get_safe_ha_attribute(entity.attributes, "target_temp_step", 0.5)*10) 

    icon_res = ""
    hvac_modes = self.get_safe_ha_attribute(entity.attributes, "hvac_modes", [])
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
    
    return f"entityUpd,{item},{heading},{current_temp},{dest_temp},{status},{min_temp},{max_temp},{step_temp}{icon_res}"

  def generate_media_page(self, item):

    if not self.api.entity_exists(item):
      return f"entityUpd,|{item}|Not found|{get_icon_id('alert-circle-outline')}|Please check your|apps.yaml in AppDaemon|50|11"

    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    icon         = 0
    title        = ""
    author       = ""
    volume       = 0
    if "media_content_type" in entity.attributes:
      if entity.attributes.media_content_type == "music":
        icon = get_icon_id("music")
    if "media_title" in entity.attributes:
      title  = entity.attributes.media_title
    if "media_artist" in entity.attributes:
      author = entity.attributes.media_artist
    if "volume_level" in entity.attributes:
      volume = int(entity.attributes.volume_level*100)

    if entity.state == "playing":
      iconplaypause = get_icon_id("pause")
    else:
      iconplaypause = get_icon_id("play")

    return f"entityUpd,|{item}|{heading}|{icon}|{title}|{author}|{volume}|{iconplaypause}"


  def generate_detail_page(self, page_type, entity):
    if page_type == "popupLight":
      entity = self.api.get_entity(entity)
      switch_val = 1 if entity.state == "on" else 0

      icon_color = 17299

      if "rgb_color" in entity.attributes:
        color = entity.attributes.rgb_color
        if "brightness" in entity.attributes:
          color = rgb_brightness(color, entity.attributes.brightness)
        icon_color = rgb_dec565(color)
      elif "brightness" in entity.attributes:
        color = rgb_brightness([253, 216, 53], entity.attributes.brightness)
        icon_color = rgb_dec565(color)

      brightness = "disable"
      color_temp = "disable"
      color = "disable"
      # scale 0-255 brightness from ha to 0-100
      if entity.state == "on":
        if "brightness" in entity.attributes:
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
      self.send_mqtt_msg(f"entityUpdateDetail,{get_icon_id('lightbulb')},{icon_color},{switch_val},{brightness},{color_temp},{color}")

    if page_type == "popupShutter":
      pos = self.api.get_entity(entity).attributes.current_position
      # reverse position for slider
      pos = 100-pos
      self.send_mqtt_msg(f"entityUpdateDetail,{pos}")

  def send_message_page(self, id, heading, msg, b1, b2):
    self.send_mqtt_msg(f"pageType,popupNotify")
    self.send_mqtt_msg(f"entityUpdateDetail,|{id}|{heading}|65535|{b1}|65535|{b2}|65535|{msg}|65535|0")

