from pathlib import Path
from queue import Queue
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'))
from firmware import FirmwareUpdater


class FirmwareReleaseTests(unittest.TestCase):
    def test_previous_tft_prompts_and_uses_model_specific_release(self):
        for model, suffix in [('eu', ''), ('us-p', '-us-p'), ('us-l', '-us-l')]:
            with self.subTest(model=model):
                queue = Queue()
                updater = FirmwareUpdater({'model': model, 'panelSendTopic': 'cmnd/panel/CustomSend'}, queue)
                self.assertTrue(updater.startup(['event', 'startup', '54', model]))
                self.assertIn('55', queue.get()[1] + queue.get()[1])
                updater.button(['event', 'buttonPress2', 'updateDisplayNoYes', 'button', 'yes'])
                self.assertEqual(queue.get(), ('cmnd/panel/FlashNextion',
                    f'http://nspanel.pky.eu/lovelace-ui/github/nspanel{suffix}-v4.8.11.tft'))
                self.assertFalse(updater.startup(['event', 'startup', '55', model]))

    def test_current_tft_does_not_prompt_and_custom_target_is_preserved(self):
        queue = Queue()
        updater = FirmwareUpdater({'panelSendTopic': 'cmnd/panel/CustomSend'}, queue)
        self.assertFalse(updater.startup(['event', 'startup', '55', 'eu']))
        self.assertTrue(queue.empty())
        custom = FirmwareUpdater({'panelSendTopic': 'cmnd/panel/CustomSend', 'displayFirmwareVersion': 56,
                                  'displayURL-EU': 'http://example.com/custom.tft', 'updateMode': 'auto'}, queue)
        self.assertTrue(custom.startup(['event', 'startup', '55', 'eu']))
        self.assertEqual(queue.get(), ('cmnd/panel/FlashNextion', 'http://example.com/custom.tft'))
