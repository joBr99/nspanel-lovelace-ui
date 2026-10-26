import sys
from pathlib import Path
from queue import Queue
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'))
from firmware import FirmwareUpdater, firmware_settings


class FirmwareTests(unittest.TestCase):
    def updater(self, api=False, **options):
        return FirmwareUpdater({'panelSendTopic': 'cmnd/kitchen/CustomSend', **options}, Queue(), api)

    def test_notify_confirm_and_duplicate_click(self):
        u = self.updater()
        self.assertTrue(u.startup(['event', 'startup', '52', 'eu']))
        self.assertEqual(u.queue.get()[1], 'pageType~popupNotify')
        self.assertIn('updateDisplayNoYes', u.queue.get()[1])
        self.assertEqual(u.button(['event', 'buttonPress2', 'updateDisplayNoYes', 'button', 'yes']), 'updating')
        topic, url = u.queue.get()
        self.assertEqual(topic, 'cmnd/kitchen/FlashNextion')
        self.assertTrue(url.endswith('nspanel-v4.7.3.tft'))
        u.button(['event', 'buttonPress2', 'updateDisplayNoYes', 'button', 'yes'])
        self.assertTrue(u.queue.empty())
        self.assertFalse(u.startup(['event', 'startup', '52', 'eu']))
        self.assertFalse(u.active)

    def test_dismiss_and_unprompted_yes(self):
        u = self.updater()
        u.button(['event', 'buttonPress2', 'updateDisplayNoYes', 'button', 'yes'])
        self.assertTrue(u.queue.empty())
        u.startup(['event', 'startup', '52', 'eu'])
        self.assertEqual(u.button(['event', 'buttonPress2', 'updateDisplayNoYes', 'button', 'no']), 'resume')
        self.assertFalse(u.active)
        self.assertFalse(u.startup(['event', 'startup', '52', 'eu']))

    def test_modes_models_and_no_downgrade(self):
        for version in ('53', '54'):
            self.assertFalse(self.updater().startup(['event', 'startup', version, 'eu']))
        self.assertFalse(self.updater(updateMode='manual').startup(['event', 'startup', '52', 'eu']))
        u = self.updater(updateMode='auto')
        u.startup(['event', 'startup', '52', 'eu'])
        self.assertEqual(u.queue.get()[0], 'cmnd/kitchen/FlashNextion')
        u = self.updater(updateMode='auto', model='us-l')
        u.startup(['event', 'startup', '53', 'eu'])
        self.assertTrue(u.prompt)
        for model in ('us-p', 'us-l'):
            self.assertIn(f'nspanel-{model}-', firmware_settings({'model': model})[3])

    def test_api_and_override(self):
        u = self.updater(api=True, updateMode='auto', displayFirmwareVersion=60,
                         **{'displayURL-EU': 'http://ha.local/custom.tft'})
        u.startup(['event', 'startup', '53', 'eu'])
        self.assertEqual(u.queue.get(), ('cmnd/kitchen/CustomSend', 'http://ha.local/custom.tft', 255))

    def test_invalid_and_ancient_startup(self):
        for fields in (['event', 'startup'], ['event', 'startup', 'bad', 'eu'], ['event', 'startup', '15', 'eu']):
            u = self.updater()
            self.assertFalse(u.startup(fields))
            self.assertTrue(u.queue.empty())
        for url in ('https://host/a.tft', 'file:///etc/passwd', 'http://host/a;Restart 1'):
            with self.assertRaises(ValueError): firmware_settings({'displayURL-EU': url})

    def test_timeout_does_not_retry(self):
        u = self.updater(updateMode='auto')
        with patch('firmware.time.monotonic', return_value=0): u.startup(['event', 'startup', '52', 'eu'])
        with patch('firmware.time.monotonic', return_value=601): self.assertFalse(u.active)
        self.assertFalse(u.startup(['event', 'startup', '52', 'eu']))
