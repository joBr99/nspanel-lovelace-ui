import os
import json
import datetime
import locale
import appdaemon.plugins.hass.hassapi as hass

class NsPanelLovelanceUIManager(hass.Hass):
  def initialize(self):

    # Check if config folder exists
    config_folder = "/config/appdaemon/nspanel_config"
    if not os.path.exists(config_folder):
      self.log("Config folder not found, creating ...")
      os.makedirs(config_folder)

    # Check config folder for config files
    for file in os.listdir(config_folder):
      filename = os.fsdecode(file)
      if filename.endswith(".json"): 
        filename = os.path.join(config_folder, filename)
        self.log("Found Config file: %s", filename)
        # Parse config file
        with open(filename, 'r') as f:
          data = json.loads(f.read())
          # Create Instance of NsPanelLovelanceUI class
          NsPanelLovelanceUI(self, data)


class NsPanelLovelanceUI:
  def __init__(self, api, config):
    self.api = api
    self.config = config
    self.current_page_nr = 0

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

  def scale(self, val, src, dst):
    """
    Scale the given value from the scale of src to the scale of dst.
    """
    return ((val - src[0]) / (src[1]-src[0])) * (dst[1]-dst[0]) + dst[0]

  def handle_mqtt_incoming_message(self, event_name, data, kwargs):
    # Parse Json Message from Tasmota and strip out message from nextion display
    msg = json.loads(data["payload"])["CustomRecv"]
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

        # send messages for current page
        page_type = self.config["pages"][self.current_page_nr]["type"]
        self.generate_page(self.current_page_nr, page_type)

      if msg[1] == "pageOpen":
        # Calculate current page
        recv_page = int(msg[2])
        self.current_page_nr = recv_page % len(self.config["pages"])
        self.api.log("received pageOpen command, raw page: %i, calc page: %i", recv_page, self.current_page_nr)
        page_type = self.config["pages"][self.current_page_nr]["type"]
        self.generate_page(self.current_page_nr, page_type)

      if msg[1] == "buttonPress":
        self.api.log("received buttonPress command")
        entity_id = msg[4]
        if(msg[6] == "OnOff"):
          if(msg[7] == "1"):
            self.api.turn_on(entity_id)
          else:
            self.api.turn_off(entity_id)
        if(msg[6] == "up"):
          self.api.get_entity(entity_id).call_service("open_cover")
        if(msg[6] == "stop"):
          self.api.get_entity(entity_id).call_service("stop_cover")
        if(msg[6] == "down"):
          self.api.get_entity(entity_id).call_service("close_cover")

        if(msg[6] == "button"):
          self.api.get_entity(entity_id).call_service("press")

        if(msg[6] == "brightnessSlider"):
          # scale 0-100 to ha brightness range
          brightness = int(self.scale(int(msg[7]),(0,100),(0,255)))
          self.api.get_entity(entity_id).call_service("turn_on", brightness=brightness)

        if(msg[6] == "colorTempSlider"):
          entity = self.api.get_entity(entity_id)
          #scale 0-100 from slider to color range of lamp
          color_val = self.scale(int(msg[7]), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
          self.api.get_entity(entity_id).call_service("turn_on", color_temp=color_val)

        if(msg[6] == "positionSlider"):
          pos = int(msg[7])
          pos = 100 - pos
          self.api.get_entity(entity_id).call_service("set_cover_position", position=pos)

      if msg[1] == "pageOpenDetail":
        self.api.log("received pageOpenDetail command")
        if(msg[2] == "popupLight"):
          entity = self.api.get_entity(msg[3])
          switch_val = 1 if entity.state == "on" else 0
          # scale 0-255 brightness from ha to 0-100
          brightness = int(self.scale(entity.attributes.brightness,(0,255),(0,100)))
          # scale ha color temp range to 0-100
          color_temp = self.scale(entity.attributes.color_temp,(entity.attributes.min_mireds, entity.attributes.max_mireds),(0,100))
          self.send_mqtt_msg("entityUpdateDetail,{0},{1},{2}".format(switch_val,brightness,color_temp))

        if(msg[2] == "popupShutter"):
          pos = self.api.get_entity(msg[3]).attributes.current_position
          # reverse position for slider
          pos = 100-pos
          self.send_mqtt_msg("entityUpdateDetail,{0}".format(pos))

      if msg[1] == "tempUpd":
        self.api.log("received tempUpd command")
        # TODO: implement tempUpd function

  def send_mqtt_msg(self,msg):
    self.mqtt.mqtt_publish(self.config["panelSendTopic"], msg)

  def update_time(self, kwargs):
    time = datetime.datetime.now().strftime(self.config["timeFormat"])
    self.send_mqtt_msg("time,{0}".format(time))

  def update_date(self, kwargs):
    # TODO: implement localization of date
    date = datetime.datetime.now().strftime(self.config["dateFormat"])
    self.send_mqtt_msg("date,?{0}".format(date))

  def generate_entities_item(self, item, item_nr, item_type):
    self.api.log("generating item command for %s with type %s", item, item_type)

    if item_type == "delete":
      return "entityUpd,{0},{1}".format(item_nr, item_type)
      
    entity = self.api.get_entity(item)
    name = entity.attributes.friendly_name

    if item_type == "cover":
      return "entityUpd,{0},{1},{2},{3},{4}".format(item_nr, "shutter", item, 0, name)

    if item_type == "light":
      switch_val = 1 if entity.state == "on" else 0
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, item_type, item, 1, name, switch_val)

    if item_type == "switch":
      switch_val = 1 if entity.state == "on" else 0
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, item_type, item, 4, name, switch_val)

    if item_type == "sensor":
      icon_id = 0
      icon_id = {
        "temperature": 2
      }[entity.attributes.device_class]
      
      value = entity.state + " " + entity.attributes.unit_of_measurement
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, "text", item, icon_id, name, value)

    if item_type == "button":
      return "entityUpd,{0},{1},{2},{3},{4},{5}".format(item_nr, item_type, item, 3, name, "PRESS")

  def generate_thermo_page(self, item):
    entity       = self.api.get_entity(item)
    heading      = entity.attributes.friendly_name
    current_temp = entity.attributes.current_temperature*10
    dest_temp    = entity.attributes.temperature*10
    status       = entity.attributes.hvac_action
    min_temp     = entity.attributes.min_temp*10
    max_temp     = entity.attributes.max_temp*10
    step_temp    = 0.5*10

    return "entityUpd,{0},{1},{2},{3},{4},{5},{6},{7}".format(item, heading, current_temp, dest_temp, status, min_temp, max_temp, step_temp)


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
        # type of item is the string before the "." in the item name
        item_type = item.split(".")[0]
        command = self.generate_entities_item(item, current_item_nr, item_type)
        self.send_mqtt_msg(command)

    if page_type == "cardThermo":
      # Send page type
      self.send_mqtt_msg("pageType,{0}".format(page_type))
      command = self.generate_thermo_page(self.config["pages"][self.current_page_nr]["item"])
      self.send_mqtt_msg(command)
