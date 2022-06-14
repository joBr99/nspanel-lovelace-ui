class Entity(object):
    def __init__(self, entity_input_config):
        if type(entity_input_config) is not dict:
            #self._ha_api.log("Config error, not a dict check your entity configs")
            self.entityId = "error"
        else:
            self.entityId  = entity_input_config.get("entity", "unknown")
        self.nameOverride  = entity_input_config.get("name")
        self.iconOverride  = entity_input_config.get("icon")
        self.colorOverride = entity_input_config.get("color")
        self.status        = entity_input_config.get("status")
        self.condState     = entity_input_config.get("state")
        self.condStateNot  = entity_input_config.get("state_not")

class Card(object):
    def __init__(self, card_input_config, pos=None):
        self.pos = pos
        self.raw_config = card_input_config
        self.cardType = card_input_config.get("type", "unknown")
        self.title =  card_input_config.get("title", "unknown")
        self.key = card_input_config.get("key", "unknown")
        # for single entity card like climate or media
        self.entity = None
        if card_input_config.get("entity") is not None:
            self.entity = Entity(card_input_config)
        # for pages like grid or entities
        self.entities = []
        for e in card_input_config.get("entities", []):
            self.entities.append(Entity(e))
        self.id = f"{self.cardType}_{self.key}".replace(".","_").replace("~","_").replace(" ","_")
        #self._ha_api.log(f"Created Card {self.cardType} with pos {pos} and id {self.id}")
    
    def get_entity_list(self):
        entityIds = []
        if self.entity is not None:
            entityIds.append(self.entity.entityId)
            if self.entity.status is not None:
                entityIds.append(self.entity.status)
        else:
            for e in self.entities:
                entityIds.append(e.entityId)
                if e.status is not None:
                    entityIds.append(e.status)

        # additional keys to check
        add_ent_keys = ['weatherOverrideForecast1', 'weatherOverrideForecast2', 'weatherOverrideForecast3', 'weatherOverrideForecast4', 'statusIcon1', 'statusIcon2', 'alarmControl']
        for ent_key in add_ent_keys:
            val = self.raw_config.get(ent_key)
            if val is not None:
                entityIds.append(val.get("entity"))
        return entityIds

class LuiBackendConfig(object):

    def dict_recursive_update(self, source: dict, target: dict) -> dict:
        for sk, sv in source.items():
            if sk in target and isinstance(target[sk], dict):
                target[sk] = self.dict_recursive_update(sv, target[sk])
            else:
                target[sk] = sv
        return target

    def __init__(self, ha_api, config_in):
        self._ha_api = ha_api
        self._config = {}
        self._config_cards = []
        self._config_screensaver = None
        self._config_hidden_cards = []

        self._DEFAULT_CONFIG = {
            'panelRecvTopic': "tele/tasmota_your_mqtt_topic/RESULT",
            'panelSendTopic': "cmnd/tasmota_your_mqtt_topic/CustomSend",
            'updateMode': "auto-notify",
            'model': "eu",
            'sleepTimeout': 20,
            'sleepBrightness': 20,
            'screenBrightness': 100,
            'sleepTracking': None,
            'sleepOverride': None,
            'locale': "en_US",
            'timeFormat': "%H:%M",
            'dateFormatBabel': "full",
            'dateAdditionalTemplate': "",
            'timeAdditionalTemplate': "",
            'dateFormat': "%A, %d. %B %Y",
            'cards': [{
                'type': 'cardEntities',
                'entities': [{
                    'entity': 'iText.',
                    'name': 'MQTT Config successful',
                    'icon': 'mdi:check',
                    'color:': [0, 255, 0],
                    },{
                    'entity': 'iText.',
                    'name': 'Continue adding',
                    'icon': 'mdi:arrow-right-bold',
                    },{
                    'entity': 'iText.',
                    'name': 'cards to your',
                    'icon': 'mdi:card',
                    },{
                    'entity': 'iText.',
                    'name': 'apps.yaml',
                    'icon': 'mdi:cog',
                    }],
                'title': 'Setup successful'
            }],
            'screensaver': {
                'type': 'screensaver',
                'entity': 'weather.example',
                'weatherUnit': 'celsius',
                'forecastSkip': 0,
                'weatherOverrideForecast1': None,
                'weatherOverrideForecast2': None,
                'weatherOverrideForecast3': None,
                'weatherOverrideForecast4': None,
                'doubleTapToUnlock': False,
                'alternativeLayout': False,
                'defaultCard': None,
                'key': 'screensaver'
            },
            'hiddenCards': []
        }

        self.load(config_in)

    def load(self, inconfig):
        self._ha_api.log("Input config: %s", inconfig)
        self._config = self.dict_recursive_update(inconfig, self._DEFAULT_CONFIG)
        self._ha_api.log("Loaded config: %s", self._config)
        
        # parse cards displayed on panel
        pos = 0
        for card in self.get("cards"):
            self._config_cards.append(Card(card, pos))
            pos = pos + 1
        # parse screensaver
        self._config_screensaver = Card(self.get("screensaver"))

        # parsed hidden pages that can be accessed through navigate
        for card in self.get("hiddenCards"):
            self._config_hidden_cards.append(Card(card))

    def get(self, name):
        path = name.split(".")
        value = self._config
        for p in path:
            if value is not None:
                value = value.get(p, None)
        if value is not None:
            return value
        # try to get a value from default config
        value = self._DEFAULT_CONFIG
        for p in path:
            if value is not None:
                value = value.get(p, None)
        return value
    
    def get_all_entity_names(self):
        entities = []
        for card in self._config_cards:
            entities.extend(card.get_entity_list())
        for card in self._config_hidden_cards:
            entities.extend(card.get_entity_list())
        entities.extend(self._config_screensaver.get_entity_list())
        return entities

    def getCard(self, pos):
        card = self._config_cards[pos%len(self._config_cards)]
        return card

    def searchCard(self, id):
        id = id.replace("navigate.", "")
        for card in self._config_cards:
            if card.id == id:
                return card
        if self._config_screensaver.id == id:
            return self._config_screensaver
        for card in self._config_hidden_cards:
            if card.id == id:
                return card
