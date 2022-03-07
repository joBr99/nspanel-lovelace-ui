import os
import json
import datetime
import time
import appdaemon.plugins.hass.hassapi as hass

class NsPanelLovelanceUIManager(hass.Hass):
  def initialize(self):

    data = self.args["config"]
    NsPanelLovelanceUI(self, data)

class NsPanelLovelanceUI:
  def __init__(self, api, config):
    self.api = api
    self.config = config
    self.current_page_nr = 0
    self.current_screensaver_brightness = 10

    # Setup, mqtt subscription and callback
    self.mqtt = self.api.get_plugin_api("MQTT")
    self.mqtt.mqtt_subscribe(topic=self.config["panelRecvTopic"])
    self.mqtt.listen_event(self.handle_mqtt_incoming_message, "MQTT_MESSAGE", topic=self.config["panelRecvTopic"], namespace='mqtt')

    # Setup time callback
    time = datetime.time(0, 0, 0)
    self.api.run_minutely(self.update_time, time)

    # Setup date callback
    time = datetime.time(0, 0, 0)
    self.api.run_daily(self.update_date, time)
    self.update_date("")

    # set brightness of screensaver
    if type(self.config["brightnessScreensaver"]) == int:
      self.current_screensaver_brightness = self.config["brightnessScreensaver"]
    elif type(self.config["brightnessScreensaver"]) == list:
      for timeset in self.config["brightnessScreensaver"]:
        self.api.run_daily(self.update_screensaver_brightness, timeset["time"], value=timeset["value"])

    # register callbacks
    self.register_callbacks()

  def handle_mqtt_incoming_message(self, event_name, data, kwargs):
    t = time.process_time()
    # Parse Json Message from Tasmota and strip out message from nextion display
    data = json.loads(data["payload"])
    if("CustomRecv" not in data):
      self.api.log("Recived unknown msg %s", data)
      return
    msg = data["CustomRecv"]
    self.api.log("Recived Message from Tasmota: %s", msg)
    
    # Split message into parts seperated by ","
    msg = msg.split(",")

    # run action based on received command
    # TODO: replace with match case after appdeamon container swiched to python 3.10 - https://pakstech.com/blog/python-switch-case/ - https://www.python.org/dev/peps/pep-0636/
    if msg[0] == "event":

      if msg[1] == "startup":
        self.api.log("received startup command")
        
        # send date and time
        self.update_time("")
        self.update_date("")

        # set screensaver timeout
        timeout = self.config["timeoutScreensaver"]
        if timeout > 60:
          timeout = 60
        if timeout < 5:
          timeout = 5
        timeout = timeout * 1000
        self.send_mqtt_msg("timeout,{0}".format(timeout))

        # send screensaver brightness
        self.update_screensaver_brightness(kwargs={"value": self.current_screensaver_brightness})

        # send messages for current page
        page_type = self.config["pages"][self.current_page_nr]["type"]
        self.generate_page(self.current_page_nr, page_type)

      if msg[1] == "pageOpen":
        # Calculate current page
        recv_page = int(msg[2])
        self.current_page_nr = recv_page % len(self.config["pages"])
        self.api.log("received pageOpen command, raw page: %i, calc page: %i", recv_page, self.current_page_nr)
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
        self.api.log("received pageOpenDetail command")
        if(msg[2] == "popupLight"):
          entity = self.api.get_entity(msg[3])
          switch_val = 1 if entity.state == "on" else 0
          # scale 0-255 brightness from ha to 0-100
          if entity.state == "on":
            if entity.attributes.get("brightness"):
              brightness = int(self.scale(entity.attributes.brightness,(0,255),(0,100)))
            else:
              brightness = "disable"
            if "color_temp" in entity.attributes.supported_color_modes:
              # scale ha color temp range to 0-100
              color_temp = self.scale(entity.attributes.color_temp,(entity.attributes.min_mireds, entity.attributes.max_mireds),(0,100))
            else:
              color_temp = "disable"
          else:
            brightness = 0
            color_temp = "disable"
          self.send_mqtt_msg("entityUpdateDetail,{0},{1},{2}".format(switch_val,brightness,color_temp))

        if(msg[2] == "popupShutter"):
          pos = self.api.get_entity(msg[3]).attributes.current_position
          # reverse position for slider
          pos = 100-pos
          self.send_mqtt_msg("entityUpdateDetail,{0}".format(pos))

      if msg[1] == "tempUpd":
        self.api.log("received tempUpd command")
        temp = int(msg[4])/10
        self.api.get_entity(msg[3]).call_service("set_temperature", temperature=temp)
    self.api.log("time_taken to answer %s : %s", data["CustomRecv"], time.process_time()-t)

  def send_mqtt_msg(self,msg):
    self.mqtt.mqtt_publish(self.config["panelSendTopic"], msg)

  def update_time(self, kwargs):
    time = datetime.datetime.now().strftime(self.config["timeFormat"])
    self.send_mqtt_msg("time,{0}".format(time))

  def update_date(self, kwargs):
    # TODO: implement localization of date
    date = datetime.datetime.now().strftime(self.config["dateFormat"])
    self.send_mqtt_msg("date,?{0}".format(date))

  def update_screensaver_brightness(self, kwargs):
    self.current_screensaver_brightness = kwargs['value']
    self.send_mqtt_msg(f"dimmode,{self.current_screensaver_brightness}")

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
      self.api.get_entity(entity_id).call_service("press")

    if(btype == "media-next"):
      self.api.get_entity(entity_id).call_service("media_next_track")
    if(btype == "media-back"):
      self.api.get_entity(entity_id).call_service("media_previous_track")
    if(btype == "media-pause"):
      self.api.get_entity(entity_id).call_service("media_play_pause")


    if(btype == "brightnessSlider"):
      # scale 0-100 to ha brightness range
      brightness = int(self.scale(int(optVal),(0,100),(0,255)))
      self.api.get_entity(entity_id).call_service("turn_on", brightness=brightness)
      
    if(btype == "colorTempSlider"):
      entity = self.api.get_entity(entity_id)
      #scale 0-100 from slider to color range of lamp
      color_val = self.scale(int(optVal), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
      self.api.get_entity(entity_id).call_service("turn_on", color_temp=color_val)
      
    if(btype == "positionSlider"):
      pos = int(optVal)
      self.api.get_entity(entity_id).call_service("set_cover_position", position=pos)

    if(btype == "volumeSlider"):
      pos = int(optVal)
      # HA wants this value between 0 and 1 as float
      pos = pos/100
      self.api.get_entity(entity_id).call_service("volume_set", volume_level=pos)

  def register_callbacks(self):
    items = []
    for page in self.config["pages"]:
      if "item" in page:
        items.append(page["item"])
      if "items" in page:
        items.extend(page["items"])
    
    for item in items:
      self.api.log("enable state callback for %s", item)
      self.api.handle = self.api.listen_state(self.state_change_callback, entity_id=item, attribute="all")

  def state_change_callback(self, entity, attribute, old, new, kwargs):
    current_page_config = self.config["pages"][self.current_page_nr]

    page_type = current_page_config["type"]

    self.api.log("got state_callback from {0}".format(entity))
    
    
    if page_type == "cardEntities":
      items = current_page_config["items"]
      if entity in items:
        self.api.log("State change on current page for {0}".format(entity))
        # send update of the item on page
        command = self.generate_entities_item(entity, items.index(entity)+1)
        self.send_mqtt_msg(command)
        # TODO: Send data of detail page, just in case this page is currently open
      return
    
    if page_type == "cardThermo" or page_type == "cardMedia":
      if entity == current_page_config["item"]:
        self.api.log("State change on current page for {0}".format(entity))
        # send update of the whole page
        if page_type == "cardThermo":
          self.send_mqtt_msg(self.generate_thermo_page(entity))
          return
        if page_type == "cardMedia":
          self.send_mqtt_msg(self.generate_media_page(entity))
          return
      return



    # TODO: Call Method for refresh of the item/page of the current entity 

  def generate_entities_item(self, item, item_nr):

    # type of item is the string before the "." in the item name
    item_type = item.split(".")[0]

    self.api.log("generating item command for %s with type %s", item, item_type)

    if item_type == "delete":
      return "entityUpd,{0},{1}".format(item_nr, item_type)
    
    if not self.api.entity_exists(item):
      return
    entity = self.api.get_entity(item)
    name = entity.attributes.friendly_name

    if item_type == "cover":
      return "entityUpd,{0},{1},{2},{3},{4}".format(item_nr, "shutter", item, 0, name)

    if item_type == "light":
      switch_val = 1 if entity.state == "on" else 0
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, item_type, item, 1, name, switch_val)

    if item_type == "switch" or item_type == "input_boolean":
      switch_val = 1 if entity.state == "on" else 0
      icon_id = 4
      if item_type == "input_boolean" and switch_val == 1:
        icon_id = 6
      else:
        icon_id = 7
      
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, "switch", item, icon_id, name, switch_val)

    if item_type == "sensor":
      icon_id = 0
      icon_mapping = {
        "temperature": 2,
        "power": 4
      }
      if entity.attributes.device_class in icon_mapping:
        icon_id = icon_mapping[entity.attributes.device_class]
      
      value = entity.state + " " + entity.attributes.unit_of_measurement
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, "text", item, icon_id, name, value)

    if item_type == "button" or item_type == "input_button":
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, "button", item, 3, name, "PRESS")

  def generate_thermo_page(self, item):
    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    current_temp = int(entity.attributes.current_temperature*10)
    dest_temp    = int(entity.attributes.temperature*10)
    status       = entity.attributes.hvac_action
    min_temp     = int(entity.attributes.min_temp*10)
    max_temp     = int(entity.attributes.max_temp*10)
    step_temp    = int(0.5*10)

    return "entityUpd,{0},{1},{2},{3},{4},{5},{6},{7}".format(item, heading, current_temp, dest_temp, status, min_temp, max_temp, step_temp)

  def generate_media_page(self, item):
    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    icon         = 0
    title        = ""
    author       = ""
    volume       = 0
    iconplaypause = 8
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


  def generate_page(self, page_number, page_type):
    self.api.log("generating page commands for page %i with type %s", self.current_page_nr, page_type)
    if page_type == "cardEntities":
      # Send page type
      self.send_mqtt_msg("pageType,{0}".format(page_type))
      # Set Heading of Page
      self.send_mqtt_msg("entityUpdHeading,{0}".format(self.config["pages"][self.current_page_nr]["heading"]))

      # Set Items of Page
      current_item_nr = 0
      for item in self.config["pages"][self.current_page_nr]["items"]:
        current_item_nr += 1
        command = self.generate_entities_item(item, current_item_nr)
        self.send_mqtt_msg(command)

    if page_type == "cardThermo":
      # Send page type
      self.send_mqtt_msg("pageType,{0}".format(page_type))
      command = self.generate_thermo_page(self.config["pages"][self.current_page_nr]["item"])
      self.send_mqtt_msg(command)
      
    if page_type == "cardMedia":
      # Send page type
      self.send_mqtt_msg("pageType,{0}".format(page_type))
      command = self.generate_media_page(self.config["pages"][self.current_page_nr]["item"])
      self.send_mqtt_msg(command)

