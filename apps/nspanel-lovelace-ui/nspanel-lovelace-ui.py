import adbase as ad

from luibackend.config import LuiBackendConfig
from luibackend.controller import LuiController
from luibackend.mqtt import LuiMqttListener, LuiMqttSender
from luibackend.updater import Updater

import apis
import json
from typing import Literal

class NsPanelLovelaceUIManager(ad.ADBase):

    def initialize(self):
        self.adapi = self.get_ad_api()
        self.adapi.log('Starting')
        apis.ad_api = self.adapi
        apis.ha_api   = self.get_plugin_api("HASS")
        apis.mqtt_api = self.get_plugin_api("MQTT")

        cfg = self._cfg = LuiBackendConfig(apis.ha_api, self.args["config"])

        use_api = cfg.get("use_api") == True

        topic_send = cfg.get("panelSendTopic")
        topic_recv = cfg.get("panelRecvTopic")
        api_panel_name = cfg.get("panelName")
        api_device_id = cfg.get("panelDeviceId")
        quiet = cfg.get("quiet")

        mqttsender = self._mqttsender = LuiMqttSender(apis.ha_api, use_api, topic_send, api_panel_name, quiet)

        self._controller = LuiController(cfg, mqttsender.send_mqtt_msg)
        
        desired_tasmota_driver_version   = 8
        desired_display_firmware_version = 53
        version     = "v4.7.3"
        
        model       = cfg.get("model")
        if model == "us-l":
            desired_display_firmware_url = cfg._config.get("displayURL-US-L", f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-l-{version}.tft")
        elif model == "us-p":
            desired_display_firmware_url = cfg._config.get("displayURL-US-P", f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-us-p-{version}.tft")
        else:
            desired_display_firmware_url = cfg._config.get("displayURL-EU",   f"http://nspanel.pky.eu/lovelace-ui/github/nspanel-{version}.tft")
        desired_tasmota_driver_url       = cfg._config.get("berryURL",         "https://raw.githubusercontent.com/joBr99/nspanel-lovelace-ui/main/tasmota/autoexec.be")

        mode = cfg.get("updateMode")
        updater = Updater(self.adapi.log, mqttsender, topic_send, mode, desired_display_firmware_version, model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url)
        
        # Request Tasmota Driver Version
        updater.request_berry_driver_version()

        LuiMqttListener(use_api, topic_recv, api_panel_name, api_device_id, self._controller, updater)

        self.adapi.log(f'Started ({version})')
        
    #
    # helpers
    #
    
    def show_card(self, card_key: str) -> None:
        """Used to show card on panel"""
        
        msg = json.dumps({"CustomRecv":f"event,buttonPress2,navigate.{card_key},button"})
        topic = self._cfg.get("panelRecvTopic")
        self._mqttsender.send_mqtt_msg(msg, topic)
        
    def navigate(self, direction: Literal['up', 'prev', 'next']) -> None:
        """Used to navigate different directions on the panel"""
        
        msg = json.dumps({"CustomRecv":f"event,buttonPress2,nav{direction.title()},button"})
        topic = self._cfg.get("panelRecvTopic")
        self._mqttsender.send_mqtt_msg(msg, topic)
        
    @property
    def current_card(self) -> str:
        """Used to get the panel's current card"""
        
        return self._controller.current_card.key
