import json
import apis

class LuiMqttListener(object):

    def __init__(self, topic, controller, updater):
        self._controller = controller
        self._updater = updater

        # Setup, mqtt subscription and callback
        apis.mqtt_api.mqtt_subscribe(topic=topic)
        apis.mqtt_api.listen_event(self.mqtt_event_callback, "MQTT_MESSAGE", topic=topic, namespace='mqtt')


    def mqtt_event_callback(self, event_name, data, kwargs):
        apis.mqtt_api.log(f'MQTT callback for: {data}')
        # Parse Json Message from Tasmota and strip out message from nextion display
        data = json.loads(data["payload"])
        if("nlui_driver_version" in data):
            msg = data["nlui_driver_version"]
            self._updater.set_tasmota_driver_version(int(msg))
            self._updater.check_updates()
        if("CustomRecv" not in data):
            return
        msg = data["CustomRecv"]
        apis.mqtt_api.log(f"Received Message from Screen: {msg}")
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
    def __init__(self, api, topic_send):
        self._ha_api = api
        self._topic_send = topic_send
        self._prev_msg = ""

    def send_mqtt_msg(self, msg, topic=None, force=False):
        if not force and self._prev_msg == msg:
            self._ha_api.log(f"Dropping identical consecutive message: {msg}")
            return
        self._prev_msg = msg
        if topic is None:
            topic = self._topic_send
        self._ha_api.log(f"Sending MQTT Message: {msg}")
        apis.mqtt_api.mqtt_publish(topic, msg)
