import logging

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
        self.name  = self.name.replace(".","_")
        self.name  = self.name.replace(",","_")
        self.name  = self.name.replace(" ","_")

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

    def search_page_by_name(self, name):
        name = name.replace("navigate.", "")
        pages = []
        for i in self.childs:
            # compare name of current page
            if i.name == name:
                pages.append(i)
            # current pages has also childs
            if len(i.childs) > 0:
                pages.extend(i.search_page_by_name(name))
        return pages

        return items

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
                items.append(f"navigate.{i.name}")
            else:
                items.append(i.data)
        return items

    def get_all_item_names(self, recursive=True):
        items = []
        for i in self.childs:
            if len(i.childs) > 0:
                if recursive:
                    items.extend(i.get_all_item_names())
            else:
                if type(i.data) is dict:
                    items.append(i.data.get("item", next(iter(i.data))))
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

        root_page = {"items": self.get("pages"), "type": "internal", "heading": "root"}
        self._page_config = PageNode(root_page)

        LOGGER.info(f"Parsed Page config to the following Tree: \n {self._page_config.dump()}")

    def check(self):
        return

    def get(self, name):
        value = self._config.get(name)
        if value is None:
            value = self._DEFAULT_CONFIG.get(name)
        return value

    def get_root_page(self):
        return self._page_config

