import json

import logging

LOGGER = logging.getLogger(__name__)

class LuiMqttListener(object):

    def __init__(self, mqtt_api, topic, controller, updater):
        self._controller = controller
        self._updater = updater
        # Setup, mqtt subscription and callback
        mqtt_api.mqtt_subscribe(topic=topic)
        mqtt_api.listen_event(self.mqtt_event_callback, "MQTT_MESSAGE", topic=topic, namespace='mqtt')


    def mqtt_event_callback(self, event_name, data, kwargs):
        LOGGER.info(f'MQTT callback for: {data}')
        # Parse Json Message from Tasmota and strip out message from nextion display
        data = json.loads(data["payload"])
        if("nlui_driver_version" in data):
            msg = data["nlui_driver_version"]
            self._updater.set_tasmota_driver_version(int(msg))
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
                self._updater.set_current_display_firmware_version(display_firmware_version)
                # check for updates
                msg_send = self._updater.check_updates()
                # send messages for current page 
                if not msg_send:
                    self._controller.startup()
            if msg[1] == "screensaverOpen":
                self._controller.weather_update("")
            if msg[1] == "buttonPress2":
                entity_id = msg[2]
                btype = msg[3]
                value = msg[4] if len(msg) > 4 else None

                if entity_id == "updateDisplayNoYes" and value == "yes":
                    self._updater.update_panel_driver()

                self._controller.button_press(entity_id, btype, value)
            if msg[1] == "pageOpenDetail":
                self._controller.detail_open(msg[2], msg[3])

