from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'))
from libs.light_temperature import slider_to_kelvin, temperature_slider


class LightTemperatureTests(unittest.TestCase):
    def test_kelvin_endpoints_roundtrip_and_clamping(self):
        attributes = {'min_color_temp_kelvin': 2000, 'max_color_temp_kelvin': 6500}
        for position, expected in [(0, 6500), (63, 3665), (100, 2000), (-10, 6500), (110, 2000)]:
            self.assertEqual(slider_to_kelvin(str(position), attributes), expected)
            self.assertEqual(temperature_slider({**attributes, 'color_temp_kelvin': expected}), max(0, min(100, position)))

    def test_invalid_ranges_and_values_do_not_raise(self):
        for attributes in ({}, {'min_color_temp_kelvin': 2000},
                           {'min_color_temp_kelvin': 6500, 'max_color_temp_kelvin': 2000},
                           {'min_color_temp_kelvin': 2000, 'max_color_temp_kelvin': 2000},
                           {'min_color_temp_kelvin': 'nan', 'max_color_temp_kelvin': 6500}):
            self.assertIsNone(slider_to_kelvin('63', attributes))
            self.assertEqual(temperature_slider(attributes), 'disable')
        attributes = {'min_color_temp_kelvin': 2000, 'max_color_temp_kelvin': 6500}
        for value in ('bad', 'nan', 'inf', None):
            self.assertIsNone(slider_to_kelvin(value, attributes))
        self.assertEqual(temperature_slider(attributes), 'unknown')

    def test_legacy_fallback_and_kelvin_precedence(self):
        attributes = {'min_mireds': 200, 'max_mireds': 500, 'color_temp': 500}
        self.assertEqual(slider_to_kelvin(0, attributes), 5000)
        self.assertEqual(temperature_slider(attributes), 100)
        attributes.update(min_color_temp_kelvin=2500, max_color_temp_kelvin=6500, color_temp_kelvin=6500)
        self.assertEqual(slider_to_kelvin(100, attributes), 2500)
        self.assertEqual(temperature_slider(attributes), 0)
