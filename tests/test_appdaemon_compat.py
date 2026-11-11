"""AppDaemon features kept by the add-on: time/date text templates and service.* buttons."""
import importlib.util
import json
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch
from zoneinfo import ZoneInfo

BACKEND = Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'
sys.path.insert(0, str(BACKEND))
# Import the package first so the modules below share it after the stubs are removed.
from libs.helper import rgb_dec565
with patch.dict(sys.modules, {name: types.ModuleType(name) for name in
                             ('websocket', 'dateutil', 'dateutil.parser', 'babel')}):
    import ha_cards
    import ha_control
    import ha_icons

SERVICE = {'entity': 'service.water_heater.set_operation_mode', 'name': 'Bojler ON',
           'icon': 'mdi:water-boiler', 'status': 'water_heater.bojler',
           'color': {'electric': [255, 128, 0]},
           'data': {'entity_id': 'water_heater.bojler', 'operation_mode': 'electric'}}
CALL = dict(entity_name=None, domain='water_heater', service='set_operation_mode', service_data=SERVICE['data'])


def load_panel():
    stubs = {name: types.ModuleType(name) for name in
             ('dateutil', 'dateutil.tz', 'babel', 'babel.dates', 'scheduler', 'scheduler.trigger')}
    stubs['dateutil'].tz = stubs['dateutil.tz']
    stubs['dateutil.tz'].gettz = ZoneInfo
    stubs['babel'].dates = stubs['babel.dates']
    # Babel is not installed in CI; like Babel, an empty pattern renders no text.
    stubs['babel.dates'].format_date = lambda value, pattern, locale: value.strftime(pattern)
    stubs['scheduler'].Scheduler = Mock()
    stubs.update({'ha_cards': ha_cards, 'ha_control': ha_control,
                  'libs.home_assistant': ha_cards.libs.home_assistant})
    spec = importlib.util.spec_from_file_location('compat_test_panel', BACKEND / 'panel.py')
    module = importlib.util.module_from_spec(spec)
    with patch.dict(sys.modules, stubs):
        spec.loader.exec_module(module)
    panel = module.LovelaceUIPanel.__new__(module.LovelaceUIPanel)
    panel.updater = Mock(active=False)
    panel.updater.button.return_value = None
    panel.msg_out_queue = Mock()
    panel.sendTopic = 'cmnd/test/CustomSend'
    panel.name = 'test'
    return module, panel


class TimeDateTextTests(unittest.TestCase):
    def test_text_under_time_and_after_date_follows_templates(self):
        module, panel = load_panel()
        time_template, date_template = "{{ states('sensor.pod_godzina') }}", "ha:{{ states('sensor.data') }}"
        panel.settings = {'timeZone': 'Europe/Warsaw', 'timeFormat': '%H:%M', 'dateFormat': '',
                          'locale': 'pl_PL', 'timeAdditionalTemplate': time_template,
                          'dateAdditionalTemplate': date_template}
        results = {time_template: 'D:03 1.29 0.0', date_template: 'Poniedziałek, 9 listopada 2026'}
        ha = module.libs.home_assistant
        with patch.object(ha, 'get_template', side_effect=lambda template, target: results[template]) as get_template, \
             patch.object(module.libs.panel_cmd, 'custom_send') as send:
            panel.update_time()
            panel.update_date()
            results[time_template] = 1.3  # HA returns native types for numeric results
            panel.ha_event_callback('timeAdditionalTemplate')
            results[date_template] = None  # not rendered yet
            panel.ha_event_callback('dateAdditionalTemplate')
            panel.settings['dateFormat'] = '%d.%m.'
            panel.settings.pop('timeAdditionalTemplate')
            panel.update_time()
            panel.update_date()
        messages = [call.args[2] for call in send.call_args_list]
        self.assertRegex(messages[0], r'^time~\d\d:\d\d~D:03 1\.29 0\.0$')
        self.assertEqual(messages[1], 'date~Poniedziałek, 9 listopada 2026')
        self.assertRegex(messages[2], r'^time~\d\d:\d\d~1\.3$')
        self.assertEqual(messages[3], 'date~')
        self.assertRegex(messages[4], r'^time~\d\d:\d\d~$')
        self.assertRegex(messages[5], r'^date~\d\d\.\d\d\.$')
        # Each template is registered under its setting name, which routes updates back.
        get_template.assert_any_call(time_template, 'timeAdditionalTemplate')
        get_template.assert_any_call(date_template, 'dateAdditionalTemplate')


class ServiceButtonTests(unittest.TestCase):
    def setUp(self):
        self.ha = ha_cards.libs.home_assistant
        self.panel = types.SimpleNamespace(model='eu', msg_out_queue=Mock(), sendTopic='test')

    def test_renders_like_appdaemon_with_and_without_status(self):
        plain = ha_cards.HAEntity('pl_PL', {'entity': SERVICE['entity'], 'name': 'Bojler OFF'}, self.panel)
        status = ha_cards.HAEntity('pl_PL', SERVICE, self.panel)
        states = {'water_heater.bojler': {'state': 'electric', 'attributes': {'friendly_name': 'Bojler'}}}
        boiler_icon = ha_icons.get_icon_ha('script', '', overwrite='mdi:water-boiler')
        with patch.object(self.ha, 'get_entity_data', side_effect=states.get):
            self.assertEqual(plain.render(), f"~button~iid.{plain.iid}~{ha_icons.get_icon_ha('script', '')}"
                                             f"~{rgb_dec565([68, 115, 158])}~Bojler OFF~Uruchom")
            self.assertEqual(status.render(), f"~button~iid.{status.iid}~{boiler_icon}"
                                              f"~{rgb_dec565([255, 128, 0])}~Bojler ON~Uruchom")
            states['water_heater.bojler']['state'] = 'off'
            self.assertIn(f"~{rgb_dec565([68, 115, 158])}~Bojler ON~", status.render())
            states.clear()
            self.assertIn('not found', status.render())

    def test_only_configured_card_entries_call_the_action(self):
        with patch.object(ha_control.libs.home_assistant, 'call_service', return_value=True) as call:
            ha_control.handle_buttons(SERVICE['entity'], 'button', None, entity_config=SERVICE)
            call.assert_called_once_with(**CALL)
            call.reset_mock()
            for entity_id, config in [(SERVICE['entity'], {}),  # raw MQTT event, not a card entry
                                      ('service.homeassistant.restart', SERVICE),
                                      ('service.water_heater', {'entity': 'service.water_heater'}),
                                      (SERVICE['entity'], {**SERVICE, 'data': 'off'})]:
                with self.subTest(entity=entity_id), self.assertLogs(level='ERROR'):
                    ha_control.handle_buttons(entity_id, 'button', None, entity_config=config)
            call.assert_not_called()
            ha_control.handle_buttons('light.desk', 'button', None)
            call.assert_called_once_with(entity_name='light.desk', domain='light', service='toggle', service_data={})

    def test_panel_press_resolves_iid_to_card_entry(self):
        module, panel = load_panel()
        entity = ha_cards.HAEntity('pl_PL', SERVICE, self.panel)
        panel.current_card = types.SimpleNamespace(entities=[entity])
        with patch.object(module.ha_control.libs.home_assistant, 'call_service', return_value=True) as call:
            panel.customrecv_event_callback(f'event,buttonPress2,iid.{entity.iid},button')
            call.assert_called_once_with(**CALL)
            call.reset_mock()
            with self.assertLogs(level='ERROR'):
                panel.customrecv_event_callback('event,buttonPress2,service.homeassistant.restart,button')
            call.assert_not_called()

    def test_websocket_target_only_for_entity_actions(self):
        spec = importlib.util.spec_from_file_location('compat_test_ha', BACKEND / 'libs/home_assistant.py')
        ha = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {'websocket': types.ModuleType('websocket')}):
            spec.loader.exec_module(ha)
        ha.ws, ha.auth_ok = Mock(), True
        ha.call_service(None, 'water_heater', 'set_operation_mode', SERVICE['data'])
        ha.call_service('light.desk', 'light', 'toggle', {})
        action, toggle = [json.loads(call.args[0]) for call in ha.ws.send.call_args_list]
        self.assertEqual(action, {'type': 'call_service', 'domain': 'water_heater', 'service': 'set_operation_mode',
                                  'service_data': SERVICE['data'], 'id': 1})
        self.assertEqual(toggle['target'], {'entity_id': 'light.desk'})


class PageSwitchTests(unittest.TestCase):
    def setUp(self):
        self.module, self.panel = load_panel()
        panel = self.panel
        panel.model = 'us-p'
        panel.settings = {'locale': 'en_US', 'screensaver': {'doubleTapToUnlock': True}}
        panel.screensaver = ha_cards.Screensaver('en_US', {'type': 'screensaver', 'entities': []}, panel)
        self.card = ha_cards.EntitiesCard('en_US', {'type': 'cardGrid', 'title': 'Lights', 'entities': []}, panel)
        panel.current_card = panel.screensaver
        panel.privious_cards = []
        panel.get_default_card = Mock(return_value=self.card)
        panel.update_time = Mock()
        panel.update_date = Mock()
        panel.dimmode = Mock()
        panel.updater.startup.return_value = False

    def messages(self):
        return [call.args[0][1] for call in self.panel.msg_out_queue.put.call_args_list]

    def test_startup_sends_screensaver_content_without_ha_update(self):
        self.panel.customrecv_event_callback('event,startup,54,us-p')
        messages = self.messages()
        self.assertEqual(messages[0], 'pageType~screensaver')
        self.assertTrue(messages[1].startswith('weatherUpdate~'))
        self.assertTrue(messages[2].startswith('statusUpdate~'))

    def test_double_tap_navigation_and_return_render_content(self):
        panel = self.panel
        panel.screensaver.render()  # Prime the duplicate-message cache.
        panel.msg_out_queue.reset_mock()
        panel.customrecv_event_callback('event,buttonPress2,screensaver,bExit,1')
        self.assertEqual(self.messages(), [])
        panel.customrecv_event_callback('event,buttonPress2,screensaver,bExit,2')
        messages = self.messages()
        self.assertEqual(messages[0], 'pageType~cardGrid')
        self.assertTrue(messages[1].startswith('entityUpd~Lights~'))
        panel.msg_out_queue.reset_mock()
        panel.customrecv_event_callback('event,sleepReached,cardGrid')
        messages = self.messages()
        self.assertEqual(messages[0], 'pageType~screensaver')
        self.assertTrue(messages[1].startswith('weatherUpdate~'))
        self.assertTrue(messages[2].startswith('statusUpdate~'))

    def test_switch_and_requested_render_once_and_update_guard_remains(self):
        panel = self.panel
        panel.current_card = self.card
        panel.render_current_page(switchPages=True, requested=True)
        self.assertEqual(len(self.messages()), 2)
        panel.msg_out_queue.reset_mock()
        panel.render_current_page(requested=True)
        self.assertEqual(len(self.messages()), 1)
        self.assertTrue(self.messages()[0].startswith('entityUpd~'))
        panel.msg_out_queue.reset_mock()
        panel.updater.active = True
        panel.render_current_page(switchPages=True, requested=True)
        self.assertEqual(self.messages(), [])
