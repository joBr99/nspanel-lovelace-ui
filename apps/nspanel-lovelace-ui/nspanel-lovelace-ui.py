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

        use_api = cfg.get("use_api")

        topic_send = cfg.get("panelSendTopic")
        topic_recv = cfg.get("panelRecvTopic")
        api_panel_name = cfg.get("panelName")
        api_device_id = cfg.get("panelDeviceId")

        mqttsend = LuiMqttSender(self, use_api, topic_send, api_panel_name)

        controller = LuiController(cfg, mqttsend.send_mqtt_msg)
        
        desired_tasmota_driver_version   = 8
        desired_display_firmware_version = 53
        version     = "v4.3.1"
        
        model       = cfg.get("model")
        if model == "us-l":
            desired_display_firmware_url = cfg._config.get("displayURL-US-L", f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-l-{version}.tft")
        elif model == "us-p":
            desired_display_firmware_url = cfg._config.get("displayURL-US-P", f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-p-{version}.tft")
        else:
            desired_display_firmware_url = cfg._config.get("displayURL-EU",   f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-{version}.tft")
        desired_tasmota_driver_url       = cfg._config.get("berryURL",         "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be")

        mode = cfg.get("updateMode")
        updater = Updater(self.log, mqttsend.send_mqtt_msg, mqttsend.request_berry_driver_version, topic_send, mode, desired_display_firmware_version, model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url)

        # Request Tasmota Driver Version
        updater.request_berry_driver_version()

        LuiMqttListener(topic_recv, use_api, api_panel_name, api_device_id, controller, updater)

        self.log(f'Started ({version})')
