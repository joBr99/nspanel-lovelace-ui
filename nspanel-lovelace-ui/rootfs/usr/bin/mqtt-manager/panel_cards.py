from libs.helper import iid, rgb_dec565
from libs.icon_mapping import get_icon_char
from libs.localization import get_translation


class Card:
    def __init__(self, locale, config, panel=None):
        self.iid = iid()
        self.iid_prev = None
        self.iid_next = None
        self.navigate_key = config.get("key", None)
        self.locale = locale
        self.title = config.get("title", "")
        self.type = config.get("type", "")
        self.panel = panel

    def render(self):
        raise NotImplementedError


class Entity:
    def __init__(self, locale, config, panel):
        self.iid = iid()
        self.locale = locale
        self.entity_id = config["entity"]
        self.etype = self.entity_id.split(".")[0]
        self.panel = panel
        self.icon_overwrite = config.get("icon", None)
        self.name_overwrite = config.get("name", None)

    def render(self, cardType=""):
        icon_char = self.icon_overwrite or ""
        color = rgb_dec565([255, 255, 255])
        name = self.name_overwrite or ""
        value = ""
        match self.etype:
            case 'delete':
                return f"~delete~~~~~"
            case 'navigate':
                page_search_res = self.panel.searchCard(
                    self.entity_id.split(".")[1])
                if page_search_res is not None:
                    name = name if name is not None else page_search_res.title
                    value = get_translation(
                        self.locale, "frontend.ui.card.button.press")
                    return f"~button~{self.entity_id}~{get_icon_char(icon_char)}~{color}~{name}~{value}"
                else:
                    return f"~text~{self.entity_id}~{get_icon_char('mdi:alert-circle-outline')}~17299~page not found~"
            case 'iText':
                # TODO: Render as HA Template
                value = self.entity_id.split(".")[1]
                return f"~text~{self.entity_id}~{get_icon_char(icon_char)}~{color}~{name}~{value}"
