import libs.home_assistant
import ha_icons
import ha_colors
from libs.localization import get_translation
import panel_cards


class HAEntity(panel_cards.Entity):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        # get data from HA
        data = libs.home_assistant.get_entity_data(self.entity_id)
        if data:
            self.state = data.get("state")
            self.attributes = data.get("attributes", [])
            print(data)

        # HA Entities
        entity_type_panel = "text"
        icon_char = ha_icons.get_icon_ha(self.etype, self.state, self.attributes.get(
            "device_class", None), self.attributes.get("media_content_type", None))
        color = ha_colors.get_entity_color(
            self.etype, self.state, self.attributes)
        name = self.attributes.get("friendly_name", "unknown")
        value = ""

        match self.etype:
            case 'switch' | 'input_boolean' | 'automation':
                entity_type_panel = "switch"
                value = 1 if self.state == "on" else 0
            case 'lock':
                entity_type_panel = "button"
                value = get_translation(self.locale, "frontend.ui.card.lock.lock") if self.state == "unlocked" else get_translation(
                    self.locale, "frontend.ui.card.lock.unlock")
            case 'input_text':
                value = self.state
            case 'input_select' | 'select':
                entity_type_panel = "input_sel"
                value = self.state
            case 'light':
                entity_type_panel = "light"
                value = 1 if self.state == "on" else 0
            case 'fan':
                entity_type_panel = "fan"
                value = 1 if self.state == "on" else 0
            case 'button' | 'input_button':
                entity_type_panel = "button"
                value = get_translation(
                    self.locale, "frontend.ui.card.button.press")
            case 'scene':
                entity_type_panel = "button"
                value = get_translation(
                    self.locale, "frontend.ui.card.scene.activate")
            case 'script':
                entity_type_panel = "button"
                value = get_translation(
                    self.locale, "frontend.ui.card.script.run")
            case 'number' | 'input_number':
                entity_type_panel = "number"
                min_v = self.attributes.get("min", 0)
                max_v = self.attributes.get("max", 100)
                value = f"{self.state}|{min_v}|{max_v}"
            case 'timer':
                entity_type_panel = "timer"
                value = get_translation(
                    self.locale, f"backend.component.timer.state._.{self.state}")
            case 'alarm_control_panel':
                value = get_translation(
                    self.locale, f"frontend.state_badge.alarm_control_panel.{self.state}")
            case 'vacuum':
                entity_type_panel = "button"
                if self.state == "docked":
                    value = get_translation(
                        self.locale, "frontend.ui.card.vacuum.actions.start_cleaning")
                else:
                    value = get_translation(
                        self.locale, "frontend.ui.card.vacuum.actions.return_to_base")
            case 'media_player':
                entity_type_panel = "media_pl"
                value = self.state
            case 'sun':
                value = get_translation(
                    self.locale, f"backend.component.sun.state._.{self.state}")
            case 'person':
                value = get_translation(
                    self.locale, f"backend.component.person.state._.{self.state}")
            case 'climate':
                # TODO: temp unit
                temp_unit = "celsius"
                state_value = get_translation(
                    self.locale, f"backend.component.climate.state._.{self.state}")
                temperature = self.attributes.get("temperature", "")
                temperature_unit = "°C" if (temp_unit == "celsius") else "°F"
                value = f"{state_value} {temperature}{temperature_unit}"
                currently_tanslation = get_translation(
                    self.locale, "frontend.ui.card.climate.currently")
                current_temperature = self.attributes.get(
                    "current_temperature", "")
                value += f"\r\n{currently_tanslation}: {current_temperature}{temperature_unit}"
            case 'cover':
                entity_type_panel = "shutter"
                device_class = self.attributes.get("device_class", "window")
                icon_up = ""
                icon_stop = ""
                icon_down = ""
                icon_up_status = "disable"
                icon_stop_status = "disable"
                icon_down_status = "disable"
                bits = self.attributes.get("supported_features")
                pos = self.attributes.get("current_position")
                if pos is None:
                    pos_status = self.state
                    pos = "disable"
                else:
                    pos_status = pos
                if bits & 0b00000001:  # SUPPORT_OPEN
                    if (pos != 100 and not (self.state == "open" and pos == "disable")):
                        icon_up_status = "enable"
                    icon_up = ha_icons.get_action_icon(
                        etype=self.etype, action="open", device_class=device_class)
                if bits & 0b00000010:  # SUPPORT_CLOSE
                    if (pos != 0 and not (self.state == "closed" and pos == "disable")):
                        icon_down_status = "enable"
                    icon_down = ha_icons.get_action_icon(
                        etype=self.etype, action="close", device_class=device_class)
                if bits & 0b00001000:  # SUPPORT_STOP
                    icon_stop = ha_icons.get_action_icon(
                        etype=self.etype, action="stop", device_class=device_class)
                    icon_stop_status = "enable"
                value = f"{icon_up}|{icon_stop}|{icon_down}|{icon_up_status}|{icon_stop_status}|{icon_down_status}"
            case _:
                name = "unsupported"

        # elif entityType in ["sensor", "binary_sensor"]:
        #    entityTypePanel = "text"
        #    device_class = entity.attributes.get("device_class", "")
        #    unit_of_measurement = entity.attributes.get(
        #        "unit_of_measurement", "")
        #    value = entity.state
        #    # limit value to 4 chars on us-p
        #    if self._config.get("model") == "us-p" and cardType == "cardEntities":
        #        value = entity.state[:4]
        #        if value[-1] == ".":
        #            value = value[:-1]
        #    if device_class != "temperature":
        #        value = value + " "
        #    value = value + unit_of_measurement
        #    if entityType == "binary_sensor":
        #        value = get_translation(
        #            self._locale, f"backend.component.binary_sensor.state.{device_class}.{entity.state}")
        #    if (cardType == "cardGrid" or cardType == "cardGrid2") and entityType == "sensor" and icon is None:
        #        icon_id = entity.state[:4]
        #        if icon_id[-1] == ".":
        #            icon_id = icon_id[:-1]
        #    else:
        #        icon_id = get_icon_ha(entityId, overwrite=icon)

        # elif entityType == "weather":
        #    entityTypePanel = "text"
        #    unit = get_attr_safe(entity, "temperature_unit", "")
        #    if type(item.stype) == int and len(entity.attributes.forecast) >= item.stype:
        #        fdate = dp.parse(
        #            entity.attributes.forecast[item.stype]['datetime'])
        #        global babel_spec
        #        if babel_spec is not None:
        #            dateformat = "E" if item.nameOverride is None else item.nameOverride
        #            name = babel.dates.format_datetime(
        #                fdate.astimezone(), dateformat, locale=self._locale)
        #        else:
        #            dateformat = "%a" if item.nameOverride is None else item.nameOverride
        #            name = fdate.astimezone().strftime(dateformat)
        #        icon_id = get_icon_ha(
        #            entityId, stateOverwrite=entity.attributes.forecast[item.stype]['condition'])
        #        value = f'{entity.attributes.forecast[item.stype].get("temperature", "")}{unit}'
        #        color = self.get_entity_color(
        #            entity, ha_type=entityType, stateOverwrite=entity.attributes.forecast[item.stype]['condition'], overwrite=colorOverride)
        #    else:
        #        value = f'{get_attr_safe(entity, "temperature", "")}{unit}'
        # else:
        #

        return f"~{entity_type_panel}~iid.{self.iid}~{icon_char}~{color}~{name}~{value}"


class EntitiesCard(panel_cards.Card):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)
        self.entities = []
        if "entities" in config:
            for e in config.get("entities"):
                # print(e)
                iid, entity = entity_factory(locale, e, panel)
                self.entities.append(entity)

    def get_iid_entities(self):
        return [(e.iid, e.entity_id) for e in self.entities]

    def render(self):
        leftBtn = "delete~~~~~"
        if self.iid_prev:
            leftBtn = panel_cards.Entity(self.locale,
                                         {
                                             'entity': f'navigate.{self.iid_prev}',
                                             'icon': 'mdi:arrow-left-bold',
                                             'color': [255, 255, 255],
                                         }, self.panel
                                         ).render()[1:]
        rightBtn = "delete~~~~~"
        if self.iid_next:
            rightBtn = panel_cards.Entity(self.locale,
                                          {
                                              'entity': f'navigate.{self.iid_next}',
                                              'icon': 'mdi:arrow-right-bold',
                                              'color': [255, 255, 255],
                                          }, self.panel
                                          ).render()[1:]
        result = f"{self.title}~{leftBtn}~{rightBtn}"
        for e in self.entities:
            result += e.render()
        return result


class Screensaver(panel_cards.Card):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)
        if "entities" in config:
            for e in config.get("entities"):
                # print(e)
                HAEntity(locale, e, panel)
        # elif "entity" in config:

    def render(self):
        return ""


def card_factory(locale, settings, panel):
    match settings["type"]:
        case 'cardEntities' | 'cardGrid':
            card = EntitiesCard(locale, settings, panel)
        case _:
            card = panel_cards.Card(locale, settings, panel)
    return card.iid, card


def entity_factory(locale, settings, panel):
    etype = settings["entity"].split(".")[0]
    if etype in ["delete", "navigate"]:
        entity = panel_cards.Entity(locale, settings, panel)
    else:
        entity = HAEntity(locale, settings, panel)
    return entity.iid, entity
