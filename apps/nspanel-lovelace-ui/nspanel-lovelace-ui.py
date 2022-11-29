import hassapi as hass

from luibackend.config import LuiBackendConfig
from luibackend.controller import LuiController
from luibackend.mqtt import LuiMqttListener, LuiMqttSender
from luibackend.updater import Updater

class NsPanelLovelaceUIManager(hass.Hass):

    def initialize(self):
        self.log('Starting')
        mqtt_api = self._mqtt_api = self.get_plugin_api("MQTT")
        cfg = self._cfg = LuiBackendConfig(self, self.args["config"])
        
        topic_send = cfg.get("panelSendTopic")
        mqttsend = LuiMqttSender(self, mqtt_api, topic_send)

        # Request Tasmota Driver Version
        mqtt_api.mqtt_publish(topic_send.replace("CustomSend", "GetDriverVersion"), "x")

        controller = LuiController(cfg, mqttsend.send_mqtt_msg)
        
        desired_display_firmware_version = 45
        version     = "v3.6.0"
        
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
        
        desired_tasmota_driver_version   = 6
        desired_tasmota_driver_url       = "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be"
        
        mode = cfg.get("updateMode")
        topic_send = cfg.get("panelSendTopic")
        updater = Updater(self.log, mqttsend.send_mqtt_msg, topic_send, mode, desired_display_firmware_version, model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url)

        topic_recv = cfg.get("panelRecvTopic")
        LuiMqttListener(mqtt_api, topic_recv, controller, updater)

        self.log('Started')
