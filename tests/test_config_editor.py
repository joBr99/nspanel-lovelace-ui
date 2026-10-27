"""Run with python -m unittest discover -s tests."""
import copy
import http.client
import json
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'
sys.path.insert(0, str(BACKEND))
from config_manager import ConfigError, ConfigStore, ConflictError, import_yaml, parse_yaml, validate
from web import handler_for, standalone_credentials
import yaml


class ConfigurationTests(unittest.TestCase):
    def setUp(self):
        self.config = parse_yaml((BACKEND / 'panels.yaml.example').read_text())

    def test_existing_config_round_trip_and_unknown_fields(self):
        self.config['custom_option'] = {'nested': ['keep me']}
        result = import_yaml(yaml.safe_dump(self.config))
        self.assertEqual(result['config'], self.config)
        self.assertEqual(result['errors'], [])

    def test_appdaemon_conversion(self):
        old = {'module': 'nspanel-lovelace-ui', 'class': 'NsPanelLovelaceUIManager', 'config': {
            'panelRecvTopic': 'tele/p/RESULT', 'panelSendTopic': 'cmnd/p/CustomSend',
            'timezone': 'UTC', 'dateFormatBabel': 'medium', 'dateFormat': '%A',
            'screensaver': {'entity': 'weather.home', 'defaultCard': 'navigate.main'},
            'cards': [{'type': 'cardThermo', 'entity': 'climate.room', 'temperatureUnit': 'fahrenheit'}],
            'updateMode': 'auto', 'berryURL': 'http://example/driver.be', 'custom_option': 42}}
        result = import_yaml(yaml.safe_dump({'panel': old, 'other': {'module': 'something_else'}}))
        panel = result['config']['nspanels']['panel']
        self.assertEqual(panel['dateFormat'], 'medium')
        self.assertEqual(panel['timeZone'], 'UTC')
        self.assertEqual(panel['temp_unit'], 'fahrenheit')
        self.assertEqual(panel['defaultCard'], 'navigate.main')
        self.assertEqual(panel['screensaver']['entities'][1]['day'], 1)
        self.assertEqual(panel['custom_option'], 42)
        self.assertEqual(result['errors'], [])
        self.assertTrue(any('berryURL' in w for w in result['warnings']))

    def test_schedules_preview_and_save(self):
        panel = next(iter(self.config['nspanels'].values()))
        panel['sleepBrightness'] = [{'time': '22:00', 'value': 10}]
        result = import_yaml(yaml.safe_dump(self.config))
        self.assertEqual(result['errors'], [])
        validate(result['config'])
        with tempfile.TemporaryDirectory() as directory:
            store = ConfigStore(Path(directory) / 'panels.yaml')
            store.save(yaml.safe_dump(result['config']), store.read()['revision'])
            self.assertEqual(parse_yaml(store.read()['yaml']), result['config'])

    def test_reject_bad_yaml(self):
        for text in ['[]', 'a: 1\na: 2', 'a: !include /etc/passwd', 'a: &x [*x]', 'a: .nan', 'a: 2020-01-01', '1: value']:
            with self.subTest(text=text), self.assertRaises(ConfigError): parse_yaml(text)

    def test_duplicate_topics_and_card_type(self):
        panel = next(iter(self.config['nspanels'].values()))
        self.config['nspanels']['duplicate'] = copy.deepcopy(panel)
        with self.assertRaisesRegex(ConfigError, 'already used'): validate(self.config)
        del self.config['nspanels']['duplicate']
        panel['cards'][0]['type'] = 'nonexistent'
        with self.assertRaisesRegex(ConfigError, 'card type'): validate(self.config)

    def test_backup_conflict_and_failed_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            store = ConfigStore(Path(directory) / 'panels.yaml')
            first = store.read()
            text = yaml.safe_dump(self.config)
            saved = store.save(text, first['revision'])
            with self.assertRaises(ConflictError): store.save(text, first['revision'])
            with self.assertRaises(ConfigError): store.save('nspanels: []', saved['revision'])
            self.assertEqual(store.read(), saved)
            store.save(text + '\n', saved['revision'])
            self.assertEqual(store.path.with_suffix('.yaml.bak').read_text(), text)
            self.assertEqual(store.path.stat().st_mode & 0o777, 0o600)

    def test_repository_appdaemon_examples(self):
        for path in (ROOT / 'appdaemon').glob('apps-*.yaml'):
            if '!include' in path.read_text():
                with self.assertRaises(ConfigError): import_yaml(path.read_text())
                continue
            result = import_yaml(path.read_text())
            self.assertEqual(result['format'], 'AppDaemon')
            self.assertTrue(result['config']['nspanels'])


class HttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.store = ConfigStore(Path(self.temp.name) / 'panels.yaml')
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), handler_for(self.store, '127.0.0.1'))
        self.thread = threading.Thread(target=self.server.serve_forever)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown(); self.server.server_close(); self.thread.join(); self.temp.cleanup()

    def request(self, method, path, data=None, content_type='application/json', headers=None):
        connection = http.client.HTTPConnection(*self.server.server_address)
        connection.request(method, path, json.dumps(data) if data is not None else None,
                           {'Content-Type': content_type, **(headers or {})})
        response = connection.getresponse()
        status, body = response.status, response.read()
        connection.close()
        return status, body

    def test_editor_and_save(self):
        self.assertEqual(self.request('GET', '/')[0], 200)
        self.assertEqual(self.request('GET', '/../web.py')[0], 404)
        status, body = self.request('GET', '/api/config')
        data = json.loads(body)
        self.assertEqual(status, 200)
        self.assertEqual(self.request('POST', '/api/config', {'yaml': 'nspanels: {}', 'revision': data['revision']})[0], 200)
        self.assertEqual(self.request('POST', '/api/config', {'yaml': 'nspanels: {}', 'revision': 'stale'})[0], 409)
        self.assertEqual(self.request('POST', '/api/import', {'yaml': 'a: !include file'})[0], 400)
        self.assertEqual(self.request('POST', '/api/config', {}, 'text/plain')[0], 415)
        self.assertEqual(self.request('POST', '/api/import', [1, 2])[0], 400)

    def test_ingress_rejects_direct_requests(self):
        self.server.RequestHandlerClass = handler_for(self.store)
        self.assertEqual(self.request('GET', '/api/config')[0], 403)
        self.assertEqual(self.request('POST', '/api/config', {})[0], 403)

    def test_standalone_authentication_and_save(self):
        import base64
        credentials = standalone_credentials({'WEB_STANDALONE': 'true', 'WEB_PASSWORD': 'test-secret'})
        self.server.RequestHandlerClass = handler_for(self.store, credentials=credentials)
        for path in ('/', '/editor.js', '/api/config'):
            self.assertEqual(self.request('GET', path)[0], 401)
            self.assertEqual(self.request('GET', path, headers={'Authorization': 'Basic !!!'})[0], 401)
        self.assertEqual(self.request('POST', '/api/config', {})[0], 401)
        bad = {'Authorization': 'Basic ' + base64.b64encode(b'admin:wrong').decode()}
        self.assertEqual(self.request('GET', '/api/config', headers=bad)[0], 401)
        good = {'Authorization': 'Basic ' + base64.b64encode(credentials).decode()}
        status, body = self.request('GET', '/api/config', headers=good)
        self.assertEqual(status, 200)
        revision = json.loads(body)['revision']
        self.assertEqual(self.request('POST', '/api/config', {'yaml': 'nspanels: {}', 'revision': revision}, headers=good)[0], 200)
        self.assertEqual(self.request('GET', '/', headers=good)[0], 200)


class StandaloneSettingsTests(unittest.TestCase):
    def test_opt_in_and_required_password(self):
        self.assertIsNone(standalone_credentials({}))
        self.assertIsNone(standalone_credentials({'WEB_STANDALONE': 'false', 'WEB_PASSWORD': 'secret'}))
        self.assertEqual(standalone_credentials({'WEB_STANDALONE': '1', 'WEB_USERNAME': 'user', 'WEB_PASSWORD': 'secret'}), b'user:secret')
        for env in ({'WEB_STANDALONE': 'true'}, {'WEB_STANDALONE': 'yes'},
                    {'WEB_STANDALONE': 'true', 'WEB_USERNAME': 'a:b', 'WEB_PASSWORD': 'secret'}):
            with self.assertRaises(ValueError): standalone_credentials(env)


if __name__ == '__main__': unittest.main()
