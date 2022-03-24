import logging

from luibackend.exceptions import LuiBackendConfigIncomplete
from luibackend.exceptions import LuiBackendConfigError


LOGGER = logging.getLogger(__name__)

class PageNode(object):
    def __init__(self, data, parent=None):
        self.data = data
        self.name = None
        self.childs = []
        self.parent = parent
        self.pos = None

        if "items" in data:
            childs = data.pop("items")
            for page in childs:
                self.add_child(PageNode(page, self))

        name  = self.data.get("heading", "unkown") if type(self.data) is dict else self.data
        ptype = self.data.get("type", "unkown") if type(self.data) is dict else "leaf"

        self.name = f"{ptype}.{name}" if type(self.data) is dict else self.data

    def add_child(self, obj):
        obj.pos = len(self.childs)
        self.childs.append(obj)

    def next(self):
        if self.parent is not None:
            pos    = self.pos
            length = len(self.parent.childs)
            return self.parent.childs[(pos+1)%length]
        else:
            return self
    def prev(self):
        if self.parent is not None:
            pos    = self.pos
            length = len(self.parent.childs)
            return self.parent.childs[(pos-1)%length]
        else:
            return self

    def dump(self, indent=0):
        """dump tree to string"""
        tab = '    '*(indent-1) + ' |- ' if indent > 0 else ''
        name   = self.name
        parent = self.parent.name if self.parent is not None else "root"
        dumpstring = f"{tab}{self.pos}:{name} -> {parent} \n"
        for obj in self.childs:
            dumpstring += obj.dump(indent + 1)
        return dumpstring
    
    def get_items(self):
        items = []
        for i in self.childs:
            if len(i.childs) > 0:
                items.append("navigate.todo")
            else:
                items.append(i.data)
        return items



class LuiBackendConfig(object):

    _DEFAULT_CONFIG = {
        'panelRecvTopic': "tele/tasmota_your_mqtt_topic/RESULT",
        'panelSendTopic': "cmnd/tasmota_your_mqtt_topic/CustomSend",
        'updateMode': "auto-notify",
        'timeoutScreensaver': 20,
        'brightnessScreensaver': 20,
        'locale': "en_US",
        'timeFormat': "%H:%M",
        'dateFormatBabel': "full",
        'dateFormat': "%A, %d. %B %Y",
        'weather': 'weather.example',
        'pages': [{
            'type': 'cardEntities',
            'heading': 'Test Entities 1',
            'items': ['switch.test_item', 'switch.test_item', 'switch.test_item']
            }, {
            'type': 'cardGrid',
            'heading': 'Test Grid 1',
            'items': ['switch.test_item', 'switch.test_item', 'switch.test_item']
            }
        ]
    }

    def __init__(self, args=None, check=True):
        self._config = {}
        self._page_config = None
        
        if args:
            self.load(args)

        if check:
            self.check()

    def load(self, args):
        for k, v in args.items():
            if k in self._DEFAULT_CONFIG:
                self._config[k] = v
        LOGGER.info(f"Loaded config: {self._config}")

        root_page = {"items": self.get("pages")}
        self._page_config = PageNode(root_page)

        LOGGER.info(f"Parsed Page config to the following Tree: \n {self._page_config.dump()}")

    def check(self):
        errors = 0

    def get(self, name):
        value = self._config.get(name)
        if value is None:
            value = self._DEFAULT_CONFIG.get(name)
        return value

    def get_root_page(self):
        return self._page_config

    def get_child_by_heading(self, heading):
        for page in self._current_page.childs:
            if heading == page.data["heading"]:
                self._current_page = page
        return self._current_page

