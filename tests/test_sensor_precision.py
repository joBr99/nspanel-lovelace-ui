import importlib.util
import json
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch

BACKEND = Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'
sys.path.insert(0, str(BACKEND))
from libs.sensor_display import format_sensor_value


class SensorPrecisionTests(unittest.TestCase):
    def test_numeric_and_special_states(self):
        for state, precision, expected in [
            ('7.75165151099879', 2, '7.75'), ('7.75165151099879', 1, '7.8'),
            ('7.75165151099879', 0, '8'), ('1.005', 2, '1.01'),
            ('-1.25', 1, '-1.3'), ('7', 2, '7.00'), ('1e-3', 3, '0.001'),
            ('unknown', 2, 'unknown'), ('unavailable', 2, 'unavailable'),
            ('NaN', 2, 'NaN'), ('Infinity', 2, 'Infinity'), ('', 2, ''),
            ('7.75165151099879', None, '7.75165151099879'),
            ('7.75', True, '7.75'), ('7.75', -1, '7.75'),
        ]:
            with self.subTest(state=state, precision=precision):
                self.assertEqual(format_sensor_value(state, precision), expected)

    def setUp(self):
        spec = importlib.util.spec_from_file_location('precision_test_ha', BACKEND / 'libs/home_assistant.py')
        self.ha = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {'websocket': types.ModuleType('websocket')}):
            spec.loader.exec_module(self.ha)
        self.ha.ws = Mock()
        self.ha.auth_ok = True
        self.ha.on_ha_update = Mock()

    def message(self, message):
        self.ha.on_message(None, json.dumps(message))

    def registry(self, entities):
        self.ha._get_display_registry()
        self.message({'type': 'result', 'success': True,
                      'id': self.ha.request_display_registry_id, 'result': {'entities': entities}})

    def test_registry_roundtrip_changes_and_removal(self):
        self.registry([{'ei': 'sensor.power', 'dp': 0}, {'ei': 'sensor.energy', 'dp': 2},
                       {'ei': 'sensor.bad', 'dp': '2'}, {'ei': 'light.example', 'dp': 1}])
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.power': 0, 'sensor.energy': 2})
        self.ha.on_ha_update.assert_any_call('sensor.power')
        self.ha.on_ha_update.reset_mock()
        self.registry([{'ei': 'sensor.power', 'dp': 1}, {'ei': 'sensor.energy'}])
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.power': 1})
        self.ha.on_ha_update.assert_any_call('sensor.energy')
        self.ha.on_ha_update.assert_any_call('sensor.power')

    def test_auth_reconnect_and_registry_event(self):
        self.ha.sensor_display_precision = {'sensor.old': 3}
        self.message({'type': 'auth_ok'})
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.old': 3})
        sent = [json.loads(call.args[0]) for call in self.ha.ws.send.call_args_list]
        self.assertTrue(any(m.get('event_type') == 'entity_registry_updated' for m in sent))
        self.assertEqual(sent[-1]['type'], 'config/entity_registry/list_for_display')
        self.message({'type': 'event', 'event': {'event_type': 'entity_registry_updated', 'data': {'entity_id': 'sensor.power'}}})
        self.assertEqual(json.loads(self.ha.ws.send.call_args.args[0])['type'], 'config/entity_registry/list_for_display')

    def test_failed_registry_does_not_break_state_updates(self):
        self.ha._get_display_registry()
        self.message({'type': 'result', 'success': False, 'id': self.ha.request_display_registry_id, 'error': {'code': 'unauthorized'}})
        state = {'state': '7.75165151099879', 'attributes': {}}
        self.message({'type': 'event', 'event': {'event_type': 'state_changed', 'data': {'entity_id': 'sensor.power', 'new_state': state}}})
        self.assertEqual(self.ha.get_entity_data('sensor.power'), state)
        self.ha.on_ha_update.assert_called_with('sensor.power')

    def test_actual_sensor_render_on_cards(self):
        # Date/weather libraries are unrelated to this sensor-rendering path.
        stubs = {'websocket': types.ModuleType('websocket'),
                 'dateutil': types.ModuleType('dateutil'),
                 'dateutil.parser': types.ModuleType('dateutil.parser'),
                 'babel': types.ModuleType('babel')}
        with patch.dict(sys.modules, stubs):
            import ha_cards
        ha = ha_cards.libs.home_assistant
        state = {'state': '7.75165151099879', 'attributes': {'unit_of_measurement': 'kW'}}
        with patch.object(ha, 'get_entity_data', return_value=state), \
             patch.object(ha, 'sensor_display_precision', {'sensor.power': 2}):
            entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.power'}, types.SimpleNamespace(model='eu'))
            for card in ('cardGrid', 'cardGrid2', 'cardEntities', 'screensaver'):
                result = entity.render(cardType=card).split('~')
                self.assertEqual(result[-1], '7.75 kW')
                if card in ('cardGrid', 'cardGrid2'):
                    self.assertEqual(result[3], '7.75')
            self.assertEqual(state['state'], '7.75165151099879')

    def test_grid_font_sizes(self):
        stubs = {name: types.ModuleType(name) for name in ('websocket', 'dateutil', 'dateutil.parser', 'babel')}
        with patch.dict(sys.modules, stubs):
            import ha_cards
        ha = ha_cards.libs.home_assistant
        state = {'state': '12.2', 'attributes': {'unit_of_measurement': '%'}}
        with patch.object(ha, 'get_entity_data', return_value=state), patch.object(ha, 'sensor_display_precision', {}):
            for font, number in [('small', 0), ('medium-icon', 1), ('medium', 2), ('large', 3), (None, None)]:
                entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.humidity', 'font': font}, types.SimpleNamespace(model='eu'))
                for card in ('cardGrid', 'cardGrid2', 'cardEntities', 'screensaver'):
                    fields = entity.render(cardType=card).split('~')
                    self.assertEqual(fields[-1], '12.2 %')
                    if card in ('cardGrid', 'cardGrid2'):
                        suffix = '' if number is None else f'¬{number}'
                        self.assertEqual(fields[3], '12.2' + suffix)
                    else:
                        self.assertNotIn('¬', fields[3])
            entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.humidity', 'font': 'small', 'icon': 'mdi:water-percent'}, types.SimpleNamespace(model='eu'))
            self.assertTrue(entity.render(cardType='cardGrid').split('~')[3].endswith('¬0'))

    def test_grid_absolute_humidity_keeps_font_suffix_without_unit(self):
        stubs = {name: types.ModuleType(name) for name in ('websocket', 'dateutil', 'dateutil.parser', 'babel')}
        with patch.dict(sys.modules, stubs):
            import ha_cards
        ha = ha_cards.libs.home_assistant
        state = {'state': '8.441', 'attributes': {'unit_of_measurement': 'g/m³'}}
        with patch.object(ha, 'get_entity_data', return_value=state), \
             patch.object(ha, 'sensor_display_precision', {'sensor.humidity': 2}):
            for font, suffix in [('small', '¬0'), ('medium', '¬2')]:
                entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.humidity', 'font': font}, types.SimpleNamespace(model='eu'))
                for card in ('cardGrid', 'cardGrid2'):
                    with self.subTest(font=font, card=card):
                        self.assertEqual(entity.render(cardType=card).split('~')[3], '8.44' + suffix)
                for card in ('cardEntities', 'screensaver'):
                    self.assertEqual(entity.render(cardType=card).split('~')[-1], '8.44 g/m³')

    def test_older_registry_response_cannot_replace_new_precision(self):
        self.ha._get_display_registry()
        older = self.ha.request_display_registry_id
        self.registry([{'ei': 'sensor.power', 'dp': 0}])
        self.message({'type': 'result', 'success': True, 'id': older,
                      'result': {'entities': [{'ei': 'sensor.power', 'dp': 1}]}})
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.power': 0})

    def test_reconnect_retains_precision_until_valid_registry_response(self):
        self.ha.sensor_display_precision = {'sensor.power': 0}
        self.message({'type': 'auth_ok'})
        for state in ('1910.0', '1910'):
            self.assertEqual(format_sensor_value(state, self.ha.sensor_display_precision['sensor.power']), '1910')
        self.message({'type': 'result', 'success': False, 'id': self.ha.request_display_registry_id})
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.power': 0})
        self.registry([{'ei': 'sensor.power', 'dp': 1}])
        self.assertEqual(format_sensor_value('1910', self.ha.sensor_display_precision['sensor.power']), '1910.0')
