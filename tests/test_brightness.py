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
                      [{'time': 'noon', 'value': 10}], [{'time': 'sunset + 25:00:00', 'value': 10}],
                      [{'time': 'sunset +', 'value': 10}], [{'time': 420, 'value': 10}],
                      [{'time': '07:00', 'value': 101}], [{'time': '07:00', 'value': True}],
                      [{'time': '07:00', 'value': 10}, {'time': '07:00:00', 'value': 20}],
                      [{'time': 'sunset', 'value': 10}, {'time': 'sunset + 0:00', 'value': 20}]]:
            with self.subTest(value=value), self.assertRaises(ValueError): validate_brightness(value)
        validate_brightness([{'time': '7:00:00', 'value': 10}, {'time': 'sunset - 0:30', 'value': 0},
                             {'time': 'sunrise+1:00:00', 'value': 20}, {'time': 'sunset', 'value': 5}])

    def test_sunrise_sunset_follow_home_assistant_sun(self):
        schedule = [{'time': 'sunrise', 'value': 20}, {'time': 'sunset', 'value': 1}]
        # HA next_rising/next_setting as seen at each moment (Warsaw, November: 06:55 and 16:01 CET).
        for stamp, rising, setting, expected in [
            ('2026-11-09T21:00:00+00:00', '2026-11-10T05:55:06+00:00', '2026-11-10T15:01:40+00:00', 1),
            ('2026-11-10T05:50:00+00:00', '2026-11-10T05:55:06+00:00', '2026-11-10T15:01:40+00:00', 1),
            # Just after sunrise HA already reports tomorrow's later sunrise; must not flip back.
            ('2026-11-10T05:55:30+00:00', '2026-11-11T05:57:00+00:00', '2026-11-10T15:01:40+00:00', 20),
            ('2026-11-10T15:00:00+00:00', '2026-11-11T05:57:00+00:00', '2026-11-10T15:01:40+00:00', 20),
            ('2026-11-10T15:02:00+00:00', '2026-11-11T05:57:00+00:00', '2026-11-11T15:00:10+00:00', 1),
            ('2026-11-10T23:30:00+00:00', '2026-11-11T05:57:00+00:00', '2026-11-11T15:00:10+00:00', 1)]:
            sun = {'sunrise': datetime.fromisoformat(rising), 'sunset': datetime.fromisoformat(setting)}
            with self.subTest(now=stamp):
                self.assertEqual(scheduled_brightness(schedule, 'Europe/Warsaw', datetime.fromisoformat(stamp), sun), expected)

    def test_sun_offsets_and_missing_sun(self):
        schedule = [{'time': 'sunrise - 0:30:00', 'value': 20}, {'time': 'sunset + 1:00:00', 'value': 0}]
        sun = {'sunrise': datetime.fromisoformat('2026-11-10T06:00:00+00:00'),
               'sunset': datetime.fromisoformat('2026-11-10T15:00:00+00:00')}
        for clock, expected in [('05:29', 0), ('05:30', 20), ('15:59', 20), ('16:00', 0)]:
            now = datetime.fromisoformat('2026-11-10T' + clock + ':00+00:00')
            self.assertEqual(scheduled_brightness(schedule, 'UTC', now, sun), expected)
        now = datetime(2026, 11, 10, 12, tzinfo=timezone.utc)
        self.assertEqual(scheduled_brightness(schedule, 'UTC', now, {}, default=10), 10)
        self.assertEqual(scheduled_brightness(schedule + [{'time': '12:00', 'value': 0}], 'UTC', now, {}, default=10), 0)

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
            sun_schedule = [{'time': 'sunrise', 'value': 20}, {'time': 'sunset', 'value': 1}]
            now = datetime(2026, 11, 10, 12, tzinfo=timezone.utc)
            # Without sun.sun the defaults stay in effect.
            self.assertEqual(calc(None, [], sun_schedule, sun_schedule, None, timezone='UTC', now=now), (10, 100))
            states['sun.sun'] = {'state': 'above_horizon', 'attributes': {
                'next_rising': '2026-11-11T05:57:00.123456+00:00', 'next_setting': '2026-11-10T15:01:40+00:00'}}
            self.assertEqual(calc(None, [], sun_schedule, 80, None, timezone='UTC', now=now), (20, 80))
