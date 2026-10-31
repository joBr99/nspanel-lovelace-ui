"""Regression coverage for the reviewed R09 feature and reliability changes."""
import importlib.util
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import sys
from threading import Event
import types
import unittest
from unittest.mock import Mock, patch

BACKEND = Path(__file__).resolve().parents[1] / 'nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager'
sys.path.insert(0, str(BACKEND))
with patch.dict(sys.modules, {name: types.ModuleType(name) for name in
                             ('websocket', 'dateutil', 'dateutil.parser', 'babel')}):
    import ha_cards
import ha_colors
from libs.helper import rgb_dec565


class ConnectionTests(unittest.TestCase):
    def setUp(self):
        spec = importlib.util.spec_from_file_location('feature_test_ha', BACKEND / 'libs/home_assistant.py')
        self.ha = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {'websocket': types.ModuleType('websocket')}):
            spec.loader.exec_module(self.ha)
        self.ha.ws = Mock()
        self.ha.auth_ok = True
        self.ha.on_ha_update = Mock()

    def reply(self, **reply):
        self.ha.on_message(None, json.dumps(reply))

    def sent(self):
        return [json.loads(call.args[0]) for call in self.ha.ws.send.call_args_list]

    def test_concurrent_requests_are_sent_in_id_order(self):
        def send(i):
            if i % 3 == 0:
                self.ha.call_service('light.test', 'light', 'toggle', {})
            elif i % 3 == 1:
                self.ha.cache_template('{{ %s }}' % i, 'sensor.display')
            else:
                self.ha._get_display_registry()
        with ThreadPoolExecutor(max_workers=12) as pool:
            list(pool.map(send, range(150)))
        self.assertEqual([m['id'] for m in self.sent()], list(range(1, 151)))

    def test_immediate_replies_are_correlated_before_send_returns(self):
        def immediate(message):
            msg = json.loads(message)
            results = {'get_states': [{'entity_id': 'sensor.test', 'state': '1'}],
                       'config/entity_registry/list_for_display': {'entities': [{'ei': 'sensor.test', 'dp': 2}]},
                       'execute_script': {'response': {'answer': 42}}}
            self.reply(type='result', id=msg['id'], success=True, result=results[msg['type']])
        self.ha.ws.send.side_effect = immediate
        self.ha._get_all_states()
        self.ha._get_display_registry()
        self.assertEqual(self.ha.get_entity_data('sensor.test')['state'], '1')
        self.assertEqual(self.ha.sensor_display_precision, {'sensor.test': 2})
        self.assertEqual(self.ha.execute_script('sensor.test', 'test', 'test', {}), {'answer': 42})
        self.assertFalse(self.ha.response_buffer)

    def test_templates_share_subscription_and_notify_displayed_entities(self):
        template = '{{ states("sensor.source") }}'
        self.ha.cache_template('ha:' + template, 'sensor.display')
        self.ha.cache_template(template, 'navigate.home')
        self.assertEqual(len(self.sent()), 1)
        message = self.sent()[0]
        self.assertEqual(message['template'], template)
        self.reply(type='result', id=message['id'], success=True, result=None)
        self.reply(type='event', id=message['id'], event={'result': 'Kitchen', 'listeners': {'entities': ['sensor.source']}})
        self.ha.on_ha_update.assert_any_call('sensor.display')
        self.ha.on_ha_update.assert_any_call('navigate.home')
        self.assertEqual(self.ha.get_template('ha:' + template), 'Kitchen')
        self.ha.on_ha_update.reset_mock()
        self.reply(type='event', id=message['id'], event={'result': 'Kitchen'})
        self.ha.on_ha_update.assert_not_called()
        self.reply(type='event', event={'event_type': 'state_changed', 'data': {'entity_id': 'sensor.source', 'new_state': {'state': 'Kitchen'}}})
        self.assertEqual(len(self.sent()), 1)

    def test_reconnect_restores_templates_and_esphome_subscription(self):
        self.ha.cache_template('ha:{{ 1 }}', 'sensor.display')
        self.ha.subscribe_to_nspanel_events(Mock())
        self.ha._ws_connection_close(None, 1001, 'test')
        self.assertFalse(self.ha.auth_ok)
        self.assertFalse(self.ha.call_service('light.test', 'light', 'toggle', {}))
        self.ha.ws.reset_mock()
        self.reply(type='auth_ok')
        sent = self.sent()
        self.assertEqual([m['id'] for m in sent], list(range(1, len(sent) + 1)))
        self.assertEqual(sum(m['type'] == 'render_template' for m in sent), 1)
        self.assertEqual(sum(m.get('event_type') == 'esphome.nspanel.data' for m in sent), 1)

    def test_template_subscription_can_retry_after_failure(self):
        self.ha.cache_template('{{ 1 }}', 'sensor.display')
        self.reply(type='result', id=self.sent()[0]['id'], success=False, error={'code': 'test'})
        self.ha.cache_template('{{ 1 }}', 'sensor.display')
        self.assertEqual(len(self.sent()), 2)

    def test_script_timeout_and_disconnect_clean_pending_requests(self):
        self.assertEqual(self.ha.execute_script('sensor.test', 'test', 'test', {}, timeout=0), {})
        self.assertFalse(self.ha.response_buffer)
        self.ha.ws.send.side_effect = lambda message: self.ha._ws_connection_close(None, 1001, 'test')
        self.assertEqual(self.ha.execute_script('sensor.test', 'test', 'test', {}, timeout=1), {})
        self.assertFalse(self.ha.response_buffer)

    def test_forecast_requests_are_shared_nonblocking_and_keep_last_good_result(self):
        started, finish, updated = Event(), Event(), Event()
        response = {'weather.home': {'forecast': [{'datetime': '2026-10-27T00:00:00+00:00', 'temperature': 12}]}}
        def fetch(*args, **kwargs):
            started.set()
            self.assertTrue(finish.wait(2))
            return response
        self.ha.execute_script = Mock(side_effect=fetch)
        self.ha.on_ha_update = Mock(side_effect=lambda entity: updated.set())
        self.assertEqual(self.ha.get_forecast('weather.home', 'daily'), {})
        self.assertTrue(started.wait(2))
        with ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda _: self.ha.get_forecast('weather.home', 'daily'), range(20)))
        self.assertEqual(results, [{}] * 20)
        self.ha.execute_script.assert_called_once_with('weather.home', 'weather', 'get_forecasts', {'type': 'daily'}, timeout=8)
        finish.set()
        self.assertTrue(updated.wait(2))
        self.assertEqual(self.ha.get_forecast('weather.home', 'daily'), response)
        self.assertEqual(self.ha.execute_script.call_count, 1)
        entry = self.ha.forecast_cache[('weather.home', 'daily')]
        self.ha.execute_script = Mock(return_value={})
        self.ha._refresh_forecast(('weather.home', 'daily'), entry)
        self.assertEqual(self.ha.get_forecast('weather.home', 'daily'), response)
        self.assertEqual(self.ha.execute_script.call_count, 1)
        self.ha.execute_script = Mock(return_value={'weather.home': {'forecast': 'bad'}})
        self.ha._refresh_forecast(('weather.home', 'daily'), entry)
        self.assertEqual(entry['response'], response)


class RenderingTests(unittest.TestCase):
    def setUp(self):
        self.panel = types.SimpleNamespace(model='eu', msg_out_queue=Mock(), sendTopic='test',
                                           searchCard=Mock(return_value=types.SimpleNamespace(title='Home')))
        self.ha = ha_cards.libs.home_assistant
        self.state = {'state': '12.2', 'attributes': {'friendly_name': 'Humidity', 'unit_of_measurement': '%'}}
        self.state_patch = patch.object(self.ha, 'get_entity_data', return_value=self.state)
        self.state_patch.start()
        self.addCleanup(self.state_patch.stop)

    def test_rgb_strings_and_invalid_colors(self):
        for value in ([223, 255, 0], (223, 255, 0), '[223, 255, 0]', '(223,255,0)', '#dfff00', 'rgb(223,255,0)'):
            self.assertEqual(ha_colors.get_entity_color('sensor', 'on', {}, value), rgb_dec565([223,255,0]))
        default = ha_colors.get_entity_color('sensor', 'on', {})
        for value in ('unknown', '__import__("os")', '[1,2]', '[256,2,3]', '[1.1,2,3]', '[True,2,3]', {'on': 'invalid'}):
            self.assertEqual(ha_colors.get_entity_color('sensor', 'on', {}, value), default)

    def test_dynamic_name_and_color_for_sensor_and_internal_entities(self):
        for entity_id in ('sensor.humidity', 'navigate.home', 'iText.test'):
            config = {'entity': entity_id, 'name': 'ha:{{ name }}', 'color': 'ha:{{ color }}'}
            entity = ha_cards.HAEntity('en_US', config, self.panel)
            with patch.object(self.ha, 'cache_template') as subscribe:
                entity.prerender()
                subscribe.assert_any_call(config['name'], entity_id)
            for name in ('Bedroom', 'Office', ''):
                with patch.object(self.ha, 'get_template', side_effect=lambda expression, target: name if expression == config['name'] else '[223,255,0]'):
                    rendered = entity.render().split('~')
                self.assertNotIn('ha:', rendered[5])
                if name:
                    self.assertEqual(rendered[5], name)
                self.assertEqual(rendered[4], str(rgb_dec565([223,255,0])))
            self.assertEqual(config['name'], 'ha:{{ name }}')
            with patch.object(self.ha, 'get_template', return_value=None):
                self.assertNotIn('ha:', entity.render())

    def test_signed_power_speed_and_invalid_values(self):
        for value, expected in [(40, 40), (-40, -40), ('-20.9', -20), (200, 120), (-200, -120), ('nan', 0), ('inf', 0), ('unavailable', 0), (None, 0)]:
            card = ha_cards.PowerCard('en_US', {'entities': [{'entity': 'sensor.power', 'speed': value}]}, self.panel)
            with patch.object(ha_cards.libs.panel_cmd, 'entityUpd') as send:
                card.render()
                self.assertEqual(send.call_args.args[2].split('~')[-1], str(expected))
        for expression in ('{{ states("sensor.speed") }}', 'ha:{{ states("sensor.speed") }}'):
            card = ha_cards.PowerCard('en_US', {'entities': [{'entity': 'sensor.power', 'speed': expression}]}, self.panel)
            with patch.object(self.ha, 'get_template', return_value='-35'), patch.object(ha_cards.libs.panel_cmd, 'entityUpd') as send:
                card.render()
                self.assertEqual(send.call_args.args[2].split('~')[-1], '-35')

    def test_hidden_navigation_preserves_up_and_main_navigation(self):
        config = {'type': 'cardGrid', 'entities': [], 'navItem2': {'entity': 'navigate.home', 'icon': 'mdi:home'}}
        card = ha_cards.EntitiesCard('en_US', config, self.panel)
        card.iid_prev, card.iid_next = 'previous', 'next'
        self.assertIn('navigate.previous', card.gen_nav())
        self.assertIn('navigate.next', card.gen_nav())
        self.assertNotIn('navigate.home', card.gen_nav())
        card.hidden = True
        self.assertIn('navigate.UP', card.gen_nav())
        self.assertIn('navigate.home', card.gen_nav())
        self.assertIn('navigate.home', card.get_entities())

    def test_forecast_zero_index_and_multiple_days(self):
        forecast = {'weather.home': {'forecast': [
            {'datetime': f'2026-10-{20 + i}T00:00:00+00:00', 'temperature': 10 + i, 'condition': 'sunny'}
            for i in range(6)
        ]}}
        dates = types.SimpleNamespace(format_datetime=Mock(return_value='Day'))
        with patch.object(self.ha, 'get_forecast', return_value=forecast) as get_forecast, \
             patch.object(ha_cards.dp, 'parse', create=True), \
             patch.object(ha_cards.babel, 'dates', dates, create=True):
            for field, index in [('day', i) for i in range(6)] + [('hour', 0)]:
                entity = ha_cards.HAEntity('en_US', {'entity': 'weather.home', field: index}, self.panel)
                self.assertEqual(entity.render(cardType='screensaver2').split('~')[-1], f'{10 + index}°C')
                get_forecast.assert_called_with('weather.home', 'daily' if field == 'day' else 'hourly')

    def test_qr_template_expression_survives_multiple_updates(self):
        expression = 'ha:{{ states("sensor.wifi") }}'
        card = ha_cards.QRCard('en_US', {'type': 'cardQR', 'qrCode': expression}, self.panel)
        with patch.object(self.ha, 'get_template', side_effect=['first', 'second']) as template, \
             patch.object(ha_cards.libs.panel_cmd, 'entityUpd') as send:
            card.render()
            self.assertTrue(send.call_args.args[2].endswith('~first'))
            card.render()
            self.assertTrue(send.call_args.args[2].endswith('~second'))
            template.assert_called_with(expression, card.iid)
        self.assertEqual(card.qrcode, expression)
        self.assertIn(card.iid, card.get_entities())

    def test_numeric_zero_template_values_are_preserved(self):
        entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.humidity', 'name': 'ha:{{ 0 }}', 'value': 'ha:{{ 0 }}'}, self.panel)
        with patch.object(self.ha, 'get_template', return_value=0):
            fields = entity.render().split('~')
            self.assertEqual(fields[5:], ['0', '0'])

    def test_screensaver_status_icon_templates_render_text_and_embedded_icons(self):
        humidity = 'ha:{{states("sensor.temp_wohn_humidity")}}%'
        heating = 'ha:{{iif(state_attr("climate.wohnzimmer_boden", "hvac_action")!="heating", "<I>mdi:heat-wave</I> ", "", "")}}'
        config = {
            'statusIcon1': {'entity': 'sensor.temp_wohn_humidity', 'icon': humidity},
            'statusIcon2': {'entity': 'climate.wohnzimmer_boden', 'icon': heating},
        }
        card = ha_cards.Screensaver('en_US', config, self.panel)
        heat_icon = ha_cards.get_icon_char('mdi:heat-wave')
        for humidity_result, heating_result, expected in [
            ('45%', '<I>mdi:heat-wave</I> ', heat_icon + ' '),
            ('46%', '', ''),
            ('0%', '<I>mdi:heat-wave</I> ', heat_icon + ' '),
        ]:
            with self.subTest(humidity=humidity_result, heating=heating_result), \
                 patch.object(self.ha, 'get_template', side_effect=lambda template, target: humidity_result if template == humidity else heating_result), \
                 patch.object(ha_cards.libs.panel_cmd, 'statusUpdate') as send:
                card.render()
                payload = send.call_args.args[2].split('~')
                self.assertEqual(payload[0], humidity_result)
                self.assertEqual(payload[2], expected)
        self.assertEqual(card.statusIcon1.config['icon'], humidity)
        self.assertEqual(card.statusIcon2.config['icon'], heating)

    def test_icon_template_zero_and_static_icons(self):
        for entity_id in ('sensor.humidity', 'iText.test', 'navigate.home'):
            entity = ha_cards.HAEntity('en_US', {'entity': entity_id, 'icon': 'ha:{{ 0 }}'}, self.panel)
            with patch.object(self.ha, 'get_template', return_value=0):
                self.assertEqual(entity.render().split('~')[3], '0')
        entity = ha_cards.HAEntity('en_US', {'entity': 'sensor.humidity', 'icon': 'mdi:water-percent'}, self.panel)
        self.assertEqual(entity.render().split('~')[3], ha_cards.get_icon_char('mdi:water-percent'))

    def test_screensaver_deduplicates_each_payload_and_can_force_refresh(self):
        self.panel.model = 'us-l'
        card = ha_cards.Screensaver('en_US', {
            'entities': [{'entity': 'sensor.power', 'icon': 'mdi:transmission-tower',
                          'color': 'ha:{{ color }}'}],
            'theme': {'background': 0},
            'statusIcon1': {'entity': 'sensor.power', 'icon': 'ha:{{ status }}'},
        }, self.panel)
        results = {'ha:{{ color }}': '[0,255,0]', 'ha:{{ status }}': '85%'}
        self.state['state'] = '1910.0'
        self.state['attributes']['unit_of_measurement'] = 'W'
        with patch.object(self.ha, 'sensor_display_precision', {'sensor.power': 0}), \
             patch.object(self.ha, 'get_template', side_effect=lambda expression, target: results[expression]), \
             patch.object(ha_cards.libs.panel_cmd, 'weatherUpdate') as weather, \
             patch.object(ha_cards.libs.panel_cmd, 'screensaverColor') as color, \
             patch.object(ha_cards.libs.panel_cmd, 'statusUpdate') as status:
            for raw in ('1910.0', '1910', '1910.0', '1910'):
                self.state['state'] = raw
                card.render()
            self.assertEqual((weather.call_count, color.call_count, status.call_count), (1, 1, 1))
            self.assertIn('1910 W', weather.call_args.args[2])
            self.state['state'] = '1911'
            card.render()
            self.assertEqual((weather.call_count, color.call_count, status.call_count), (2, 1, 1))
            results['ha:{{ status }}'] = ''
            card.render()
            self.assertEqual((weather.call_count, color.call_count, status.call_count), (2, 1, 2))
            card.theme['background'] = 1
            card.render()
            self.assertEqual((weather.call_count, color.call_count, status.call_count), (2, 2, 2))
            card.invalidate()
            card.render()
            self.assertEqual((weather.call_count, color.call_count, status.call_count), (3, 3, 3))

    def test_panel_refresh_invalidation_preserves_brightness_updates(self):
        stubs = {name: types.ModuleType(name) for name in
                 ('dateutil', 'dateutil.tz', 'babel', 'babel.dates', 'scheduler', 'scheduler.trigger')}
        stubs['ha_cards'] = ha_cards
        stubs['libs.home_assistant'] = self.ha
        stubs['scheduler'].Scheduler = Mock()
        spec = importlib.util.spec_from_file_location('refresh_test_panel', BACKEND / 'panel.py')
        module = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, stubs):
            spec.loader.exec_module(module)
        panel = module.LovelaceUIPanel.__new__(module.LovelaceUIPanel)
        panel.updater = types.SimpleNamespace(active=False)
        panel.screensaver = Mock()
        panel.screensaver.get_entities.return_value = ['sensor.power']
        panel.current_card = panel.screensaver
        panel.settings = {}
        panel.msg_out_queue = Mock()
        panel.sendTopic = 'test'
        panel.name = 'test'
        panel.dimmode = Mock()
        with patch.object(module.ha_control, 'calculate_dim_values', return_value=['sensor.power']):
            panel.ha_event_callback('sensor.power')
        panel.dimmode.assert_called_once()
        panel.screensaver.invalidate.assert_not_called()
        panel.screensaver.render.assert_called_once()
        panel.customrecv_event_callback('event,renderCurrentPage')
        panel.screensaver.invalidate.assert_called_once()
        with patch.object(module.libs.panel_cmd, 'page_type'):
            panel.render_current_page(switchPages=True)
        self.assertEqual(panel.screensaver.invalidate.call_count, 2)
