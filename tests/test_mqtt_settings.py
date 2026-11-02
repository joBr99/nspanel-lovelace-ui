import importlib.util
import io
import json
import os
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch
from urllib.error import HTTPError

BACKEND = Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'
sys.path.insert(0, str(BACKEND))
from libs.mqtt_settings import MQTTConfigurationError, resolve_mqtt, validate_mqtt


class MQTTSettingsTests(unittest.TestCase):
    def test_manual_settings_bypass_discovery(self):
        settings = {'mqtt_server': 'broker', 'mqtt_port': '1883'}
        with patch.dict(os.environ, {'SUPERVISOR_TOKEN': 'secret'}, clear=True), patch('libs.mqtt_settings.urlopen') as request:
            self.assertEqual(resolve_mqtt(settings)['mqtt_port'], 1883)
            request.assert_not_called()

    def test_discovery_success_and_timeout(self):
        response = {'result': 'ok', 'data': {'host': 'broker', 'port': 1883, 'username': 'user', 'password': 'secret'}}
        with patch.dict(os.environ, {'SUPERVISOR_TOKEN': 'token'}, clear=True), patch('libs.mqtt_settings.urlopen', return_value=io.StringIO(json.dumps(response))) as request:
            settings = resolve_mqtt({'mqtt_server': '', 'mqtt_port': ''})
            self.assertEqual(settings['mqtt_server'], 'broker')
            self.assertEqual(settings['mqtt_port'], 1883)
            self.assertEqual(settings['mqtt_password'], 'secret')
            self.assertEqual(request.call_args.kwargs['timeout'], 10)

    def test_unavailable_service_has_safe_actionable_error(self):
        with patch.dict(os.environ, {'SUPERVISOR_TOKEN': 'private-token'}, clear=True):
            for failure in (HTTPError('url', 400, 'private-token', {}, None), TimeoutError()):
                with patch('libs.mqtt_settings.urlopen', side_effect=failure):
                    with self.assertRaises(MQTTConfigurationError) as error:
                        resolve_mqtt({})
                    self.assertIn('/config/panels.yaml', str(error.exception))
                    self.assertNotIn('private-token', str(error.exception))
            with patch('libs.mqtt_settings.urlopen', return_value=io.StringIO('{"result":"error","message":"Service not enabled"}')):
                with self.assertRaisesRegex(MQTTConfigurationError, 'unavailable'):
                    resolve_mqtt({})

    def test_invalid_ports_and_missing_host(self):
        for port in ('', None, 'abc', 0, 65536, True, 1883.5):
            with self.subTest(port=port), self.assertRaisesRegex(MQTTConfigurationError, 'port'):
                validate_mqtt({'mqtt_server': 'broker', 'mqtt_port': port})
        with self.assertRaisesRegex(MQTTConfigurationError, 'host'):
            validate_mqtt({'mqtt_server': '', 'mqtt_port': 1883})

    def test_standalone_never_queries_supervisor(self):
        with patch.dict(os.environ, {'STANDALONE': '1', 'SUPERVISOR_TOKEN': 'token'}, clear=True), patch('libs.mqtt_settings.urlopen') as request:
            with self.assertRaises(MQTTConfigurationError):
                resolve_mqtt({})
            request.assert_not_called()

    def test_startup_retries_then_connects_and_esphome_skips_discovery(self):
        stubs = {name: types.ModuleType(name) for name in ('panel', 'mqtt', 'watchdog', 'watchdog.events', 'watchdog.observers', 'websocket')}
        stubs['panel'].LovelaceUIPanel = Mock()
        stubs['mqtt'].MqttManager = Mock()
        stubs['watchdog.events'].FileSystemEventHandler = object
        stubs['watchdog.observers'].Observer = Mock()
        spec = importlib.util.spec_from_file_location('mqtt_test_main', BACKEND / 'main.py')
        module = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, stubs):
            spec.loader.exec_module(module)
        module.settings = {'home_assistant_address': '', 'home_assistant_token': ''}
        resolved = {'mqtt_server': 'broker', 'mqtt_port': 1883}
        with patch.object(module, 'resolve_mqtt', side_effect=[MQTTConfigurationError('Service unavailable'), MQTTConfigurationError('Service unavailable'), resolved]) as resolve, patch.object(module, 'get_config', return_value=True) as reload_config, patch.object(module.time, 'sleep') as sleep:
            module.connect()
            self.assertEqual(resolve.call_count, 3)
            self.assertEqual(reload_config.call_count, 2)
            self.assertEqual(sleep.call_count, 2)
            sleep.assert_called_with(10)
            module.MqttManager.assert_called_once_with(resolved, module.panel_out_queue, module.panel_in_queues)
        module.settings['use_ha_api'] = True
        with patch.object(module, 'resolve_mqtt') as resolve:
            module.connect()
            resolve.assert_not_called()
