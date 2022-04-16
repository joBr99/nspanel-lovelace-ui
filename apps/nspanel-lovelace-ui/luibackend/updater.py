class Updater:
    def __init__(self, log, send_mqtt_msg, topic_send, mode, desired_display_firmware_version, desired_display_firmware_model, desired_display_firmware_url, desired_tasmota_driver_version, desired_tasmota_driver_url):
        
        self._log = log
        
        self.desired_display_firmware_version = desired_display_firmware_version
        self.desired_display_firmware_model = desired_display_firmware_model
        self.desired_display_firmware_url     = desired_display_firmware_url
        self.desired_tasmota_driver_version   = desired_tasmota_driver_version
        self.desired_tasmota_driver_url       = desired_tasmota_driver_url
        
        self.mode = mode
        self._send_mqtt_msg = send_mqtt_msg
        self.topic_send = topic_send
        self.current_tasmota_driver_version   = None
        self.current_display_firmware_version = None
        self.current_display_model = None

    def set_tasmota_driver_version(self, driver_version):
        self.current_tasmota_driver_version   = driver_version
    def set_current_display_firmware_version(self, panel_version, panel_model=None):
        self.current_display_firmware_version = panel_version
        self.current_display_model            = panel_model

    def check_pre_req(self):
        # we need to know both versions to continue
        if self.current_tasmota_driver_version is not None and self.current_display_firmware_version is not None:
            # tasmota driver has to be at least version 2 for Update command 
            # and panel has to be at version 11 for notify commands
            # version 16 for new button cmd format
            if self.current_tasmota_driver_version >= 2 and self.current_display_firmware_version >= 16:
                return True
            return False

    def send_message_page(self, id, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType,popupNotify")
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~{id}~{heading}~65535~{b1}~65535~{b2}~65535~{msg}~65535~0")
        self._send_mqtt_msg(f"entityUpdateDetail,|{id}|{heading}|65535|{b1}|65535|{b2}|65535|{msg}|65535|0")

    def check_updates(self):
        # return's true if a notification was send to the panel
        # run pre req check
        if self.check_pre_req():
            self._log("Update Pre-Check sucessful Tasmota Driver Version: %s Panel Version: %s", self.current_tasmota_driver_version, self.current_display_firmware_version)
            # check if tasmota driver needs update
            if self.current_tasmota_driver_version < self.desired_tasmota_driver_version:
                self._log("Update of Tasmota Driver needed")
                # in auto mode just do the update
                if self.mode == "auto":
                    self.update_berry_driver()
                    return False
                # send notification about the update
                if self.mode == "auto-notify":
                    update_msg = "There's an update available for the Tasmota    Berry driver, do you want to start the update  now?                                                                      If you encounter issues after the update or      this message appears frequently, please checkthe manual and repeat the installation steps   for the Tasmota Berry driver. "
                    self.send_message_page("updateBerryNoYes", "Driver Update available!", update_msg, "Dismiss", "Yes")
                    return True
                return False
            # check if model has changed
            if self.current_display_model is not None and self.current_display_model != self.desired_display_firmware_model:
                self._log(f"Mismatch between Display Firmware ({self.current_display_model}) and configured model ({self.desired_display_firmware_model})")
                update_msg = f"The configured display firmware model has changed, do you want to start the update now? Current Model: {self.current_display_model}         Configured Model: {self.desired_display_firmware_model} If the update fails check the installation          manual and flash your version again over the Tasmota console. Be patient, the update will   take a while."
                self.send_message_page("updateDisplayNoYes", "Display Update available!", update_msg, "Dismiss", "Yes")
                return True

            # check if display firmware needs an update
            if self.current_display_firmware_version < self.desired_display_firmware_version:
                self._log("Update of Display Firmware needed")
                # in auto mode just do the update
                if self.mode == "auto":
                    self.update_panel_driver()
                    return False
                # send notification about the update
                if self.mode == "auto-notify":
                    update_msg = "There's a firmware update available for the      Nextion screen of the NSPanel. Do you want tostart the update now?                                         If the update fails check the installation         manual and flash again over the Tasmota        console.                                                                 Be patient, the update will take a while."
                    self.send_message_page("updateDisplayNoYes", "Display Update available!", update_msg, "Dismiss", "Yes")
                    return True
                return False
        else:
            self._log("Update Pre-Check failed Tasmota Driver Version: %s Panel Version: %s", self.current_tasmota_driver_version, self.current_display_firmware_version)
            return False

    def request_berry_driver_version(self):
        self.current_tasmota_driver_version = None
        topic = self.topic_send.replace("CustomSend", "GetDriverVersion")
        self._send_mqtt_msg("X", topic=topic)

    def update_berry_driver(self):
        topic = self.topic_send.replace("CustomSend", "Backlog")
        self._send_mqtt_msg(f"UpdateDriverVersion {self.desired_tasmota_driver_url}; Restart 1", topic=topic)
    def update_panel_driver(self):
        topic = self.topic_send.replace("CustomSend", "FlashNextion")
        self._send_mqtt_msg(self.desired_display_firmware_url, topic=topic)
