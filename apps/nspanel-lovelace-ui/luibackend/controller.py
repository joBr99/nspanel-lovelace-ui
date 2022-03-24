import logging
import datetime

from pages import LuiPages

LOGGER = logging.getLogger(__name__)

class LuiController(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._send_mqtt_msg = send_mqtt_msg

        self._current_page = None
        self._previous_page = None
        
        self._pages = LuiPages(ha_api, config, send_mqtt_msg)
        # Setup time update callback
        time = datetime.time(0, 0, 0)
        ha_api.run_minutely(self._pages.update_time, time)

        # send panel back to startup page on restart of this script
        self._pages.page_type("pageStartup")
        
        #{'type': 'sceensaver', 'weather': 'weather.k3ll3r', 'items': [{'type': 'cardEntities', 'heading': 'Test Entities 1', 'items': ['switch.test_item', {'type': 'cardEntities', 'heading': 'Test Entities 1', 'items': ['switch.test_item', 'switch.test_item', 'switch.test_item', 'switch.test_item']}, 'switch.test_item', 'switch.test_item']}, {'type': 'cardGrid', 'heading': 'Test Grid 1', 'items': ['switch.test_item', 'switch.test_item', 'switch.test_item']}]}

    
    def startup(self, display_firmware_version):
        LOGGER.info(f"Startup Event; Display Firmware Version is {display_firmware_version}")
        # send time and date on startup
        self._pages.update_time("")
        self._pages.update_date("")

        # send panel to root page
        self._current_page = self._config.get_root_page()
        self._pages.render_page(self._current_page)


    def next(self):
        return

    def button_press(self, entity_id, btype, value):
        LOGGER.debug(f"Button Press Event; entity_id: {entity_id}; btype: {btype}; value: {value} ")
        if(entity_id == "screensaver" and btype == "enter"):
            if self._previous_page is None:
                self._pages.render_page(self._current_page.childs[0])
            else:
                self._pages.render_page(self._previous_page)

