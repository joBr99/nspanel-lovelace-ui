import logging

LOGGER = logging.getLogger(__name__)

HA_API = None

class Entity(object):
    def __init__(self, entity_input_config):
        self.entityId = entity_input_config.get("entity", "unknown")
        self.nameOverride = entity_input_config.get("name")
        self.iconOverride = entity_input_config.get("icon")

class Card(object):
    def __init__(self, card_input_config):
        self.cardType = card_input_config.get("type", "unknown")
        self.title =  card_input_config.get("title", "unknown")
        # for single entity card like climate or media
        self.entity = None
        if card_input_config.get("entity") is not None:
            self.entity = Entity(card_input_config.get("entity"))
        # for pages like grid or entities
        self.entities = []
        for e in card_input_config.get("entities", []):
            self.entities.append(Entity(e))

class LuiBackendConfig(object):

    _DEFAULT_CONFIG = {
        'panelRecvTopic': "tele/tasmota_your_mqtt_topic/RESULT",
        'panelSendTopic': "cmnd/tasmota_your_mqtt_topic/CustomSend",
        'updateMode': "auto-notify",
        'model': "eu",
        'timeoutScreensaver': 20,
        'brightnessScreensaver': 20,
        'brightnessScreensaverTracking': None,
        'locale': "en_US",
        'timeFormat': "%H:%M",
        'dateFormatBabel': "full",
        'dateFormat': "%A, %d. %B %Y",
        'weather': 'weather.example',
        'weatherUnit': 'celsius',
        'weatherOverrideForecast1': None,
        'weatherOverrideForecast2': None,
        'weatherOverrideForecast3': None,
        'weatherOverrideForecast4': None,
        'doubleTapToUnlock': False,
        'cards': [{
            'type': 'entities',
            'entities': [{
                'entity': 'switch.test_item',
                'name': 'Test Item'
                }, {
                'entity': 'switch.test_item'
            }],
            'title': 'Example Entities Page'
        }, {
            'type': 'grid',
            'entities': [{
                'entity': 'switch.test_item'
                }, {
                'entity': 'switch.test_item'
                }, {
                'entity': 'switch.test_item'
                }
            ],
            'title': 'Example Grid Page'
        }, {
            'type': 'climate',
            'entity': 'climate.test_item'
            'title': 'Example Climate Page'
        }]
    }

    def __init__(self, ha_api, config_in):
        global HA_API
        HA_API = ha_api
        self._config = {}
        self._config_cards = []
        self._current_card = None

        self.load(config_in)

    def load(self, args):
        for k, v in args.items():
            if k in self._DEFAULT_CONFIG:
                self._config[k] = v
        LOGGER.info(f"Loaded config: {self._config}")

        for card in self.get("cards"):
            self._config_cards.append(Card(card))
        # set current card to first card
        self._current_card = self._config_cards[0]


    def get(self, name):
        value = self._config.get(name)
        if value is None:
            value = self._DEFAULT_CONFIG.get(name)
        return value

