from datetime import datetime, timezone
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'))
from libs.brightness import scheduled_brightness, validate_brightness
with patch.dict(sys.modules, {'websocket': types.ModuleType('websocket')}):
    import ha_control


class BrightnessTests(unittest.TestCase):
    schedule = [{'time': '22:00', 'value': 0}, {'time': '07:00:00', 'value': 40}]

    def test_boundary_and_overnight(self):
        for clock, expected in [('00:00', 0), ('06:59', 0), ('07:00', 40), ('21:59', 40), ('22:00', 0)]:
            now = datetime.fromisoformat('2026-10-26T' + clock + ':00+00:00')
            self.assertEqual(scheduled_brightness(self.schedule, 'UTC', now), expected)

    def test_timezone_and_dst(self):
        for stamp, expected in [('2026-07-01T05:00:00+00:00', 40), ('2026-12-01T05:00:00+00:00', 0), ('2026-12-01T06:00:00+00:00', 40)]:
            self.assertEqual(scheduled_brightness(self.schedule, 'Europe/Berlin', datetime.fromisoformat(stamp)), expected)
        single = [{'time': '12:00', 'value': 7}]
        self.assertEqual(scheduled_brightness(single, 'UTC', datetime(2026, 1, 1, tzinfo=timezone.utc)), 7)

    def test_invalid_schedules(self):
        for value in [[], [{'time': '25:00', 'value': 10}], [{'time': '07:60', 'value': 10}],
                      [{'time': 'sunset', 'value': 10}], [{'time': '07:00', 'value': 101}],
                      [{'time': '07:00', 'value': True}],
                      [{'time': '07:00', 'value': 10}, {'time': '07:00:00', 'value': 20}]]:
            with self.subTest(value=value), self.assertRaises(ValueError): validate_brightness(value)

    def test_resolution_and_precedence(self):
        ha = ha_control.libs.home_assistant
        states = {'sensor.brightness': {'state': '125.5'}, 'person.me': {'state': 'not_home'}, 'binary_sensor.override': {'state': 'on'}}
        with patch.object(ha, 'get_entity_data', side_effect=lambda e: states.get(e)), patch.object(ha, 'is_existent', side_effect=lambda e: e in states):
            calc = ha_control.calculate_dim_values
            self.assertEqual(calc(None, [], 0, 0, None), (0, 0))
            self.assertEqual(calc(None, [], 'sensor.brightness', 100, None), (100, 100))
            self.assertEqual(calc('person.me', ['not_home'], 30, 100, None), (0, 100))
            self.assertEqual(calc(None, [], 30, 100, {'entity': 'binary_sensor.override', 'brightness': 0}), (0, 100))
            self.assertEqual(calc(None, [], self.schedule, self.schedule, None, timezone='UTC', now=datetime(2026, 1, 1, 7, tzinfo=timezone.utc)), (40, 40))
            self.assertIn('sensor.missing', calc(None, [], 'sensor.missing', 100, None, return_involved_entities=True))
