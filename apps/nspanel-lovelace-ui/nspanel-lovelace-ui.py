import json
import datetime
import hassapi as hass
from color import pos_to_color, rgb_dec565, rgb_brightness

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
  import babel.dates


class NsPanelLovelaceUIManager(hass.Hass):
  def initialize(self):

    data = self.args["config"]
    NsPanelLovelaceUI(self, data)

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

  def handle_mqtt_incoming_message(self, event_name, data, kwargs):
    # Parse Json Message from Tasmota and strip out message from nextion display
    data = json.loads(data["payload"])
    if("CustomRecv" not in data):
      self.api.log("Received Message from Tasmota: %s", data, level="DEBUG")
      return
    msg = data["CustomRecv"]
    self.api.log("Received Message from Tasmota: %s", msg) #, level="DEBUG"
    
    # Split message into parts seperated by ","
    msg = msg.split(",")

    # run action based on received command
    # TODO: replace with match case after appdeamon container swiched to python 3.10 - https://pakstech.com/blog/python-switch-case/ - https://www.python.org/dev/peps/pep-0636/
    if msg[0] == "event":

      if msg[1] == "startup":
        self.api.log("Handling startup event", level="DEBUG")
        
        # send date and time
        self.update_time("")
        self.update_date("")

        # set screensaver timeout
        timeout = self.config["timeoutScreensaver"]
        self.send_mqtt_msg(f"timeout,{timeout}")

        # send screensaver brightness
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})

        # send messages for current page
        page_type = self.config["pages"][self.current_page_nr]["type"]
        self.generate_page(self.current_page_nr, page_type)

      if msg[1] == "pageOpen":
        # Calculate current page
        recv_page = int(msg[2])
        self.current_page_nr = recv_page % len(self.config["pages"])
        self.api.log("Received pageOpen command, raw page: %i, calc page: %i", recv_page, self.current_page_nr, level="DEBUG")
        # get type of current page
        page_type = self.config["pages"][self.current_page_nr]["type"]
        # generate commands for current page
        self.generate_page(self.current_page_nr, page_type)

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

  def send_mqtt_msg(self,msg):
    self.api.log("Send Message from Tasmota: %s", msg) #, level="DEBUG"
    self.mqtt.mqtt_publish(self.config["panelSendTopic"], msg)

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

    weathericons = {
      'clear-night': 17,
      'cloudy': 12,
      'exceptional': 11,
      'fog': 13,
      'hail': 14,
      'lightning': 15,
      'lightning-rainy': 16,
      'partlycloudy': 18,
      'pouring': 19,
      'rainy': 20,
      'snowy': 21,
      'snowy-rainy': 22,
      'sunny': 23,
      'windy': 24,
      'windy-variant': 25
    }

    o1 = we.attributes.forecast[0]['datetime']
    o1 = datetime.datetime.fromisoformat(o1)
    o1 = babel.dates.format_date(o1, "E", locale=self.config["locale"])
    i1 = weathericons[we.attributes.forecast[0]['condition']]
    u1 = we.attributes.forecast[0]['temperature']
    o2 = we.attributes.forecast[1]['datetime']
    o2 = datetime.datetime.fromisoformat(o2)
    o2 = babel.dates.format_date(o2, "E", locale=self.config["locale"])
    i2 = weathericons[we.attributes.forecast[1]['condition']]
    u2 = we.attributes.forecast[1]['temperature']
    self.send_mqtt_msg(f"weatherUpdate,?{weathericons[we.state]}?{we.attributes.temperature}{unit}?{26}?{we.attributes.humidity} %?{o1}?{i1}?{u1}?{o2}?{i2}?{u2}")

  def scale(self, val, src, dst):
    """
    Scale the given value from the scale of src to the scale of dst.
    """
    return ((val - src[0]) / (src[1]-src[0])) * (dst[1]-dst[0]) + dst[0]

  def handle_button_press(self, entity_id, btype, optVal=None):
    if(btype == "OnOff"):
      if(optVal == "1"):
        self.api.turn_on(entity_id)
      else:
        self.api.turn_off(entity_id)
    if(btype == "up"):
      self.api.get_entity(entity_id).call_service("open_cover")
    if(btype == "stop"):
      self.api.get_entity(entity_id).call_service("stop_cover")
    if(btype == "down"):
      self.api.get_entity(entity_id).call_service("close_cover")
      
    if(btype == "button"):
      if(entity_id.startswith('scene')):
        self.api.get_entity(entity_id).call_service("turn_on")
      else:
        self.api.get_entity(entity_id).call_service("press")

    if(btype == "media-next"):
      self.api.get_entity(entity_id).call_service("media_next_track")
    if(btype == "media-back"):
      self.api.get_entity(entity_id).call_service("media_previous_track")
    if(btype == "media-pause"):
      self.api.get_entity(entity_id).call_service("media_play_pause")

    if(btype == "hvac_action"):
      self.api.get_entity(entity_id).call_service("set_hvac_mode", hvac_mode=optVal)


    if(btype == "brightnessSlider"):
      # scale 0-100 to ha brightness range
      brightness = int(self.scale(int(optVal),(0,100),(0,255)))
      self.api.get_entity(entity_id).call_service("turn_on", brightness=brightness)
      
    if(btype == "colorTempSlider"):
      entity = self.api.get_entity(entity_id)
      #scale 0-100 from slider to color range of lamp
      color_val = self.scale(int(optVal), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
      self.api.get_entity(entity_id).call_service("turn_on", color_temp=color_val)

    if(btype == "colorWheel"):
      self.api.log(optVal)
      optVal = optVal.split('|')
      color = pos_to_color(int(optVal[0]), int(optVal[1]))
      self.api.log(color)
      self.api.get_entity(entity_id).call_service("turn_on", rgb_color=color)
      
    if(btype == "positionSlider"):
      pos = int(optVal)
      self.api.get_entity(entity_id).call_service("set_cover_position", position=pos)

    if(btype == "volumeSlider"):
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

    if page_type == "cardEntities":
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

  def generate_page(self, page_number, page_type):
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

    # type of item is the string before the "." in the item name
    item_type = item.split(".")[0]

    self.api.log("Generating item command for %s with type %s", item, item_type, level="DEBUG")

    if item_type == "delete":
      return f",{item_type},,,,,"
    
    if not self.api.entity_exists(item):
      return f",text,{item},11,17299,Not found check, apps.yaml"
    entity = self.api.get_entity(item)
    name = entity.attributes.friendly_name

    if item_type == "cover":
      return f",shutter,{item},0,17299,{name},"

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

      return f",{item_type},{item},1,{icon_color},{name},{switch_val}"

    if item_type == "switch" or item_type == "input_boolean":
      switch_val = 1 if entity.state == "on" else 0
      icon_id = 4
      if item_type == "input_boolean" and switch_val == 1:
        icon_id = 6
      else:
        icon_id = 7
      
      return f",switch,{item},{icon_id},17299,{name},{switch_val}"

    if item_type == "sensor":
      icon_id = 0
      unit_of_measurement = ""
      icon_mapping = {
        "temperature": 2,
        "power": 4
      }
      if "device_class" in entity.attributes:
        if entity.attributes.device_class in icon_mapping:
          icon_id = icon_mapping[entity.attributes.device_class]
      
      if "unit_of_measurement" in entity.attributes:
        unit_of_measurement = entity.attributes.unit_of_measurement

      value = entity.state + " " + unit_of_measurement
      return f",text,{item},{icon_id},17299,{name},{value}"

    if item_type == "button" or item_type == "input_button":
      return f",button,{item},3,17299,{name},PRESS"
    
    if item_type == "scene":
      return f",button,{item},10,17299,{name},ACTIVATE"

  def generate_entities_page(self, items):
    # Set Items of Page
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
      icon_id = 11
      color_on = 64512
      if mode == "auto":
        icon_id = 29
        color_on = 1024
      if mode == "heat":
        icon_id = 28
        color_on = 64512
      if mode == "off":
        icon_id = 27
        color_on = 35921


      if mode == "cool":
        icon_id = 31
        color_on = 11487
      if mode == "dry":
        icon_id = 26
        color_on = 60897
      if mode == "fan_only":
        icon_id = 30
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
      # uneven use first 5 icons
      icon_res = icon_res + ","*4*4
    
    return f"entityUpd,{item},{heading},{current_temp},{dest_temp},{status},{min_temp},{max_temp},{step_temp}{icon_res}"

  def generate_media_page(self, item):

    if not self.api.entity_exists(item):
      return f"entityUpd,|{item}|Not found|11|Please check your|apps.yaml in AppDaemon|50|11"

    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    icon         = 0
    title        = ""
    author       = ""
    volume       = 0
    #iconplaypause = 9
    if "media_content_type" in entity.attributes:
      if entity.attributes.media_content_type == "music":
        icon = 5
    if "media_title" in entity.attributes:
      title  = entity.attributes.media_title
    if "media_artist" in entity.attributes:
      author = entity.attributes.media_artist
    if "volume_level" in entity.attributes:
      volume = int(entity.attributes.volume_level*100)

    if entity.state == "playing":
      iconplaypause = 8
    else:
      iconplaypause = 9

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
          brightness = int(self.scale(entity.attributes.brightness,(0,255),(0,100)))
        else:
          brightness = "disable"
        if "color_temp" in entity.attributes.supported_color_modes:
          if "color_temp" in entity.attributes:
            # scale ha color temp range to 0-100
            color_temp = int(self.scale(entity.attributes.color_temp,(entity.attributes.min_mireds, entity.attributes.max_mireds),(0,100)))
          else:
            color_temp = "unknown"
        else:
          color_temp = "disable"
          
        if "xy" in entity.attributes.supported_color_modes or "rgb" in entity.attributes.supported_color_modes or "rgbw" in entity.attributes.supported_color_modes or "hs" in entity.attributes.supported_color_modes:
          color = "enable"
        else:
          color = "disable"
      self.send_mqtt_msg(f"entityUpdateDetail,1,{icon_color},{switch_val},{brightness},{color_temp},{color}")

      if page_type == "popupShutter":
        pos = self.api.get_entity(entity).attributes.current_position
        # reverse position for slider
        pos = 100-pos
        self.send_mqtt_msg(f"entityUpdateDetail,{pos}")
