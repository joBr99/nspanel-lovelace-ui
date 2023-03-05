import secrets
import string

import apis

def uuid():
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(10))

class Entity(object):
    def __init__(self, entity_input_config):
        self.uuid = f"uuid.{uuid()}"
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
        self.condTemplate  = entity_input_config.get("state_template")
        self.assumedState  = entity_input_config.get("assumed_state", False)
        self.stype         = entity_input_config.get("type")
        self.value         = entity_input_config.get("value")
        self.data  = entity_input_config.get("data", {})
        self.entity_input_config = entity_input_config

class Card(object):
    def __init__(self, card_input_config, hidden=False):
        self.uuid = f"uuid.{uuid()}"
        self.uuid_prev = None
        self.uuid_next = None
        self.hidden = hidden
        self.raw_config = card_input_config
        self.cardType = card_input_config.get("type", "unknown")
        self.title =  card_input_config.get("title", "unknown")
        self.key = card_input_config.get("key", "unknown")
        self.nav1Override = None
        if card_input_config.get("navItem1"):
            self.nav1Override = Entity(card_input_config.get("navItem1"))
        self.nav2Override = None
        if card_input_config.get("navItem2"):
            self.nav2Override = Entity(card_input_config.get("navItem2"))
        self.sleepTimeout  = card_input_config.get("sleepTimeout")
        self.last_update = 0
        self.cooldown = card_input_config.get("cooldown", 0)
        # for single entity card like climate or media
        self.entity = None
        if card_input_config.get("entity") is not None:
            self.entity = Entity(card_input_config)
        # for pages like grid or entities
        self.entities = []
        for e in card_input_config.get("entities", []):
            self.entities.append(Entity(e))
        self.id = f"{self.cardType}_{self.key}".replace(".","_").replace("~","_").replace(" ","_")
        
    def get_entity_names(self, uuid=False):
        entityIds = {}
        if self.entity is not None:
            entityIds[self.entity.uuid] = self.entity.entityId
            if self.entity.status is not None:
                entityIds[self.entity.uuid] = self.entity.status
        for e in self.entities:
            entityIds[e.uuid] = e.entityId
            if e.status is not None:
                entityIds[e.uuid] = e.status

        # additional keys to check
        add_ent_keys = ['statusIcon1', 'statusIcon2', 'alarmControl']
        for ent_key in add_ent_keys:
            val = self.raw_config.get(ent_key)
            if val is not None:
                entityIds[f"{ent_key}."] = val.get("entity")

        if uuid:
            return entityIds
        else:
            return entityIds.values()

    def get_entity_list(self):
        entitys = []
        if self.entity is not None:
            entitys.append(self.entity)
        if self.entities:
            for e in self.entities:
                entitys.append(e)
        if self.nav1Override:
            entitys.append(self.nav1Override)
        if self.nav2Override:
            entitys.append(self.nav2Override)
        return entitys


class LuiBackendConfig(object):

    def dict_recursive_update(self, source: dict, target: dict) -> dict:
        for sk, sv in source.items():
            if sk in target and isinstance(target[sk], dict):
                target[sk] = self.dict_recursive_update(sv, target[sk])
            else:
                target[sk] = sv
        return target

    def __init__(self, ha_api, config_in):
        apis.ha_api = ha_api
        self._config = {}
        self._config_cards = []
        self._config_screensaver = None

        self._DEFAULT_CONFIG = {
            'panelRecvTopic': "tele/tasmota_your_mqtt_topic/RESULT",
            'panelSendTopic': "cmnd/tasmota_your_mqtt_topic/CustomSend",
            'updateMode': "auto-notify",
            'model': "eu",
            'sleepTimeout': 20,
            'sleepBrightness': 20,
            'screenBrightness': 100,
            'defaultBackgroundColor': "ha-dark",
            'sleepTracking': None,
            'sleepTrackingZones': ["not_home", "off"],
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
        apis.ha_api.log("Input config: %s", inconfig)
        self._config = self.dict_recursive_update(inconfig, self._DEFAULT_CONFIG)
        apis.ha_api.log("Loaded config: %s", self._config)

        # parse cards
        for card in self.get("cards"):
            self._config_cards.append(Card(card))
            
        # setup prev and next uuids
        top_level_cards = list(filter(lambda card: not card.hidden, self._config_cards))
        card_uuids = [card.uuid for card in top_level_cards]

        prev_uuids = card_uuids[-1:] + card_uuids[:-1]
        next_uuids = card_uuids[ 1:] + card_uuids[: 1]

        if len(card_uuids) > 1:
            for prev_uuids, card, next_uuids in zip(prev_uuids, top_level_cards, next_uuids):
                (card.uuid_prev, card.uuid_next) = (prev_uuids, next_uuids)
                
        # parse screensaver
        self._config_screensaver = Card(self.get("screensaver"))

        # parse hidden cards
        for card in self.get("hiddenCards"):
            self._config_cards.append(Card(card, hidden=True))
        # all entites sorted by generated key, to be able to use short identifiers
        self._config_entites_table = {x.uuid: x for x in self.get_all_entitys()}
        self._config_card_table = {x.uuid: x for x in self._config_cards}

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
            entities.extend(card.get_entity_names())
        entities.extend(self._config_screensaver.get_entity_names())
        return entities

    def get_all_entitys(self):
        entities = []
        for card in self._config_cards:
            entities.extend(card.get_entity_list())
        return entities

    def search_card(self, id):
        id = id.replace("navigate.", "")
        if id.startswith("uuid"):
            return self.get_card_by_uuid(id)
        # legacy type_key
        for card in self._config_cards:
            if card.id == id:
                return card
        if self._config_screensaver.id == id:
            return self._config_screensaver

        # just search for key
        for card in self._config_cards:
            if card.key == id:
                return card
        if self._config_screensaver.key == id:
            return self._config_screensaver

    def get_default_card(self):
        defaultCard = self._config.get("screensaver.defaultCard")
        if defaultCard is not None:
            defaultCard = apis.ha_api.render_template(defaultCard)
            defaultCard = self.search_card(defaultCard)
            if defaultCard is not None:
                return defaultCard
        else:
            return self._config_cards[0]

    def get_card_by_uuid(self, uuid):
        return self._config_card_table.get(uuid)
    
