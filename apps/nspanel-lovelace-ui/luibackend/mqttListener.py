import json

import logging

LOGGER = logging.getLogger(__name__)

class LuiMqttListener(object):

    def __init__(self, mqtt_api, topic, controller):
        self._controller = controller
        # Setup, mqtt subscription and callback
        mqtt_api.mqtt_subscribe(topic=topic)
        mqtt_api.listen_event(self.mqtt_event_callback, "MQTT_MESSAGE", topic=topic, namespace='mqtt')


    def mqtt_event_callback(self, event_name, data, kwargs):
        LOGGER.info(f'MQTT callback for: {data}')
        # Parse Json Message from Tasmota and strip out message from nextion display
        data = json.loads(data["payload"])
        if("CustomRecv" not in data):
            return
        msg = data["CustomRecv"]
        LOGGER.info(f"Received Message from Screen: {msg}")
        # Split message into parts seperated by ","
        msg = msg.split(",")
        # run action based on received command
        if msg[0] == "event":
            if msg[1] == "startup":
                display_firmware_version = int(msg[2])
                self._controller.startup(display_firmware_version)
            if msg[1] == "pageOpen":
                self._controller.next()
            if msg[1] == "buttonPress2":
                entity_id = msg[2]
                btype = msg[3]
                value = msg[4] if len(msg) > 4 else None
                self._controller.button_press(entity_id, btype, value)

