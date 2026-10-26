import json
import apis

class LuiMqttListener(object):

    def __init__(self, use_api, topic, api_panel_name, api_device_id, controller, updater):
        self._controller = controller
        self._updater = updater
        self._api_device_id = api_device_id

        # Setup, mqtt subscription and callback
        if use_api:
            apis.ha_api.listen_event(self.api_event_callback, "esphome.nspanel.data")
        else:
            apis.mqtt_api.mqtt_subscribe(topic=topic)
            apis.mqtt_api.listen_event(self.mqtt_event_callback, "MQTT_MESSAGE", topic=topic, namespace='mqtt')

    def api_event_callback(self, event_name, data, kwargs):
        if not "device_id" in data:
            return
        if not data["device_id"] == self._api_device_id:
            return

        apis.ha_api.log(f'API callback for: {data}')

        self.customrecv_event_callback(event_name, data, kwargs)

    def mqtt_event_callback(self, event_name, data, kwargs):
        apis.ha_api.log(f'MQTT callback for: {data}')

        # Parse Json Message from Tasmota and strip out message from nextion display
        data = json.loads(data["payload"])

        self.customrecv_event_callback(event_name, data, kwargs)

    def customrecv_event_callback(self, event_name, data, kwargs):
        if("nlui_driver_version" in data):
            msg = data["nlui_driver_version"]
            self._updater.set_tasmota_driver_version(int(msg))
            self._updater.check_updates()
        if("CustomRecv" not in data):
            return
        msg = data["CustomRecv"]
        apis.ha_api.log(f"Received Message from Screen: {msg}")
        # Split message into parts seperated by ","
        msg = msg.split(",")
        # run action based on received command
        if msg[0] == "event":
            if msg[1] == "startup":
                self._updater.request_berry_driver_version()
                display_firmware_version = int(msg[2])
                model                    = msg[3]
                self._updater.set_current_display_firmware_version(display_firmware_version, model)
                # check for updates
                msg_send = self._updater.check_updates()
                # send messages for current page 
                if not msg_send:
                    self._controller.startup()
            if msg[1] == "sleepReached":
                entity_id = msg[2]
                self._controller.button_press(entity_id, "sleepReached", None)
                # try to request tasmota driver version again in case it's still None
                if self._updater.current_tasmota_driver_version is None:
                    self._updater.request_berry_driver_version()
            if msg[1] == "buttonPress2":
                entity_id = msg[2]
                btype = msg[3]
                value = msg[4] if len(msg) > 4 else None

                if entity_id == "updateDisplayNoYes" and value == "yes":
                    self._updater.update_panel_driver()
                if entity_id == "updateBerryNoYes" and value == "yes":
                    self._updater.update_berry_driver()

                self._controller.button_press(entity_id, btype, value)
            if msg[1] == "pageOpenDetail":
                self._controller.detail_open(msg[2], msg[3])

class LuiMqttSender(object):
    def __init__(self, api, use_api, topic_send, api_panel_name, quiet):
        self._ha_api = api
        self._use_api = use_api
        self._topic_send = topic_send
        self._api_panel_name = api_panel_name
        self._prev_msg = ""
        self._quiet = quiet

    def send_mqtt_msg(self, msg, topic=None, force=False):
        if not force and self._prev_msg == msg:
            apis.ha_api.log(f"Dropping identical consecutive message: {msg}")
            return
        self._prev_msg = msg

        if self._quiet is False:
            apis.ha_api.log(f"Sending Message: {msg}")
            
        if self._use_api:
            apis.ha_api.call_service(service="esphome/" + self._api_panel_name + "_nspanelui_api_call", command=2, data=msg)
        else:
            if topic is None:
                topic = self._topic_send
            apis.mqtt_api.mqtt_publish(topic, msg)

    def request_berry_driver_version(self):
        if self._use_api:
            apis.ha_api.call_service(service="esphome/" + self._api_panel_name + "_nspanelui_api_call", command=1, data="x")
        else:
            apis.mqtt_api.mqtt_publish(self._topic_send.replace("CustomSend", "GetDriverVersion"), "x")

    def flash_nextion(self, url):
        if self._use_api:
            apis.ha_api.call_service(service="esphome/" + self._api_panel_name + "_nspanelui_api_call", command=255, data=url)
        else:
            apis.mqtt_api.mqtt_publish(self._topic_send.replace("CustomSend", "FlashNextion"), url)
