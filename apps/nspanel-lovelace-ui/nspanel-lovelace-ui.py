import hassapi as hass

from luibackend.config import LuiBackendConfig
from luibackend.controller import LuiController
from luibackend.mqtt import LuiMqttListener, LuiMqttSender
from luibackend.updater import Updater

import apis

class NsPanelLovelaceUIManager(hass.Hass):

    def initialize(self):
        self.log('Starting')
        apis.ha_api   = self
        apis.mqtt_api = self.get_plugin_api("MQTT")

        cfg = self._cfg = LuiBackendConfig(self, self.args["config"])
        
        topic_send = cfg.get("panelSendTopic")
        topic_recv = cfg.get("panelRecvTopic")

        mqttsend = LuiMqttSender(self, topic_send)

        # Request Tasmota Driver Version
        apis.mqtt_api.mqtt_publish(topic_send.replace("CustomSend", "GetDriverVersion"), "x")

        controller = LuiController(cfg, mqttsend.send_mqtt_msg)
        
        desired_tasmota_driver_version   = 8
        desired_display_firmware_version = 46
        version     = "v3.7.0"
        
        model       = cfg.get("model")
        match model:
            case "us-l":
                desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-l-{version}.tft"
            case "us-p":
                desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-p-{version}.tft"
            case _:
                desired_display_firmware_url = f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-{version}.tft"
        desired_tasmota_driver_url       = "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be"

        mode = cfg.get("updateMode")
        updater = Updater(self.log, mqttsend.send_mqtt_msg, topic_send, mode, desired_display_firmware_version, model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url)

        LuiMqttListener(topic_recv, controller, updater)

        self.log('Started')
