import hassapi as hass

from luibackend.config import LuiBackendConfig
from luibackend.controller import LuiController
from luibackend.mqttListener import LuiMqttListener
from luibackend.updater import Updater

class NsPanelLovelaceUIManager(hass.Hass):

    def initialize(self):
        self.log('Starting')
        mqtt_api = self._mqtt_api = self.get_plugin_api("MQTT")
        cfg = self._cfg = LuiBackendConfig(self, self.args["config"])
        
        topic_send = cfg.get("panelSendTopic")
        def send_mqtt_msg(msg, topic=None):
            if topic is None:
                topic = topic_send
            self.log(f"Sending MQTT Message: {msg}")
            mqtt_api.mqtt_publish(topic, msg)

        # Request Tasmota Driver Version
        mqtt_api.mqtt_publish(topic_send.replace("CustomSend", "GetDriverVersion"), "x")

        controller = LuiController(self, cfg, send_mqtt_msg)
        
        desired_display_firmware_version = 38
        version     = "v3.1.0"
        
        model       = cfg.get("model")
        if model == "us-l":
            # us landscape version
            desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-l-{version}.tft"
        elif model == "us-p":
            # us portrait version
            desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-p-{version}.tft"
        else:
            # eu version
            desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-{version}.tft"
        
        desired_tasmota_driver_version   = 4
        desired_tasmota_driver_url       = "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be"
        
        mode = cfg.get("updateMode")
        topic_send = cfg.get("panelSendTopic")
        updater = Updater(self.log, send_mqtt_msg, topic_send, mode, desired_display_firmware_version, model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url)

        topic_recv = cfg.get("panelRecvTopic")
        LuiMqttListener(mqtt_api, topic_recv, controller, updater)

        self.log('Started')
