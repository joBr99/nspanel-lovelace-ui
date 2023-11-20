import libs.home_assistant
import ha_icons
import ha_colors
from libs.localization import get_translation
import panel_cards
import logging
import dateutil.parser as dp
import babel
from libs.icon_mapping import get_icon_char
from libs.helper import rgb_dec565

class HAEntity(panel_cards.Entity):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self, cardType=""):
        # get data from HA
        data = libs.home_assistant.get_entity_data(self.entity_id)
        if data:
            self.state = data.get("state")
            self.attributes = data.get("attributes", [])
            #print(data)

        # HA Entities
        entity_type_panel = "text"
        icon_char = ha_icons.get_icon_ha(self.etype, self.state, device_class=self.attributes.get("device_class", None), media_content_type=self.attributes.get("media_content_type", None), overwrite=self.config.get("icon"))
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
            case 'sensor':
                device_class = self.attributes.get("device_class", "")
                unit_of_measurement = self.attributes.get("unit_of_measurement", "")
                value = self.state
                # limit value to 4 chars on us-p
                if self.panel.model == "us-p" and cardType == "cardEntities":
                    value = self.state[:4]
                    if value[-1] == ".":
                        value = value[:-1]

                if device_class != "temperature":
                    value = value + " "
                value = value + unit_of_measurement
                if cardType in ["cardGrid", "cardGrid2"] and not self.icon_overwrite:
                    icon_char = value
            case 'binary_sensor':
                device_class = self.attributes.get("device_class", "")
                value = get_translation(self.locale, f"backend.component.binary_sensor.state.{device_class}.{entity.state}")
            case 'weather':
                attr = self.config.get("attribute", "temperature")
                value = str(self.attributes.get(attr, self.state))

                # settings for forecast
                forecast_type = None
                if self.config.get("day"):
                    forecast_type = "daily"
                    pos = self.config.get("day")
                    datetime_format = "E"
                if self.config.get("hour"):
                    forecast_type = "hourly"
                    pos = self.config.get("hour")
                    datetime_format = "H:mm"
                if forecast_type:
                    forecast = libs.home_assistant.execute_script(
                        entity_name=self.entity_id,
                        domain='weather',
                        service="get_forecast",
                        service_data={
                            'type': forecast_type
                        }
                    ).get("forecast", [])
                    if len(forecast) > pos:
                        forcast_pos = forecast[pos]
                        forcast_condition = forcast_pos.get("condition", "")
                        forcast_date = dp.parse(forcast_pos.get("datetime")).astimezone()

                        icon_char = ha_icons.get_icon_ha(self.etype, forcast_condition)
                        name = babel.dates.format_datetime(forcast_date, datetime_format, locale=self.locale)

                        attr = self.config.get("attribute", "temperature")
                        value = str(forcast_pos.get(attr, "not found"))
                    else:
                        name: "unknown"
                # add units
                if attr in ["temperature", "apparent_temperature", "templow"]:
                    value += self.config.get("unit", "°C")
                else:
                    value += self.config.get("unit", "")
            case _:
                name = "unsupported"

        return f"~{entity_type_panel}~iid.{self.iid}~{icon_char}~{color}~{name}~{value}"

class HACard(panel_cards.Card):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)
        # Generate Entity for each Entity in Config
        self.entities = []
        if "entity" in config:
            iid, entity = entity_factory(locale, config, panel)
            self.entities.append(entity)
        if "entities" in config:
            for e in config.get("entities"):
                iid, entity = entity_factory(locale, e, panel)
                self.entities.append(entity)

    def get_iid_entities(self):
        return [(e.iid, e.entity_id) for e in self.entities]

    def get_entities(self):
        return [e.entity_id for e in self.entities]

    def gen_nav(self):
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
        result = f"{leftBtn}~{rightBtn}"
        return result

class EntitiesCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        result = f"{self.title}~{self.gen_nav()}"
        for e in self.entities:
            result += e.render(cardType=self.type)
        return result

class QRCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)
        self.qrcode = config.get("qrCode", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    def render(self):
        # TODO: Render QRCode as HomeAssistant Template
        #qrcode = apis.ha_api.render_template(qrcode)
        result = f"{self.title}~{self.gen_nav()}~{self.qrcode}"
        for e in self.entities:
            result += e.render()
        return result

class PowerCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        result = f"{self.title}~{self.gen_nav()}"
        for e in self.entities:
            result += e.render()
            speed = 0
            # TODO: Implement speed card power
            #if apis.ha_api.entity_exists(item.entityId):
            #    entity = apis.ha_api.get_entity(item.entityId)
            #    speed = str(item.entity_input_config.get("speed", 0))
            #    if isinstance(speed, str):
            #        speed = apis.ha_api.render_template(speed)
            result += f"~{speed}"
        return result

class MediaCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        main_entity = self.entities[0]
        media_icon = main_entity.render()
        if not self.title:
            self.title = main_entity.attributes.get("friendly_name", "unknown")
        title = main_entity.attributes.get("media_title", "")
        author = main_entity.attributes.get("media_artist", "")
        volume = int(main_entity.attributes.get("media_artist", 0)*100)
        iconplaypause = get_icon_char("pause") if main_entity.state == "playing" else get_icon_char("play")
        onoffbutton = "disable"
        shuffleBtn = "disable"

        bits = main_entity.attributes.get("supported_features")
        if bits & 0b10000000:
            if main_entity.state == "off":
                onoffbutton = 1374
            else:
                onoffbutton = rgb_dec565([255,152,0])

        if bits & 0b100000000000000:
            shuffle = main_entity.attributes.get("shuffle", "")
            if shuffle == False:
                shuffleBtn = get_icon_char('shuffle-disabled')
            elif shuffle == True:
                shuffleBtn = get_icon_char('shuffle')

        # generate button entities
        button_str = ""
        for e in self.entities[1:]:
            button_str += e.render()
        result = f"{self.title}~{self.gen_nav()}~{main_entity.entity_id}~{title}~~{author}~~{volume}~{iconplaypause}~{onoffbutton}~{shuffleBtn}{media_icon}{button_str}"
        return result

class ClimateCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        main_entity = self.entities[0]

        #TODO: temp unit
        temp_unit = "celsius"
        if(temp_unit == "celsius"):
            temperature_unit_icon = get_icon_char("temperature-celsius")
            temperature_unit = "°C"

        else:
            temperature_unit_icon = get_icon_char("temperature-fahrenheit")
            temperature_unit = "°F"

        main_entity.render()
        if not self.title:
            self.title = main_entity.attributes.get("friendly_name", "unknown")
        current_temp = main_entity.attributes.get("current_temperature", "")
        dest_temp    = main_entity.attributes.get("temperature", None)
        dest_temp2   = ""
        if dest_temp is None:
            dest_temp    = main_entity.attributes.get("target_temp_high", 0)
            dest_temp2   = main_entity.attributes.get("target_temp_low", None)
            if dest_temp2 != None and dest_temp2 != "null":
                dest_temp2   = int(dest_temp2*10)
            else:
                dest_temp2 = ""
        dest_temp    = int(dest_temp*10)

        hvac_action  = main_entity.attributes.get("hvac_action", "")
        state_value  = ""
        if hvac_action != "":
            state_value = get_translation(self.locale, f"frontend.state_attributes.climate.hvac_action.{hvac_action}")
            state_value += "\r\n("
        state_value += get_translation(self.locale, f"backend.component.climate.state._.{main_entity.state}")
        if hvac_action != "":
            state_value += ")"

        min_temp     = int(main_entity.attributes.get("min_temp", 0)*10)
        max_temp     = int(main_entity.attributes.get("max_temp", 0)*10)
        step_temp    = int(main_entity.attributes.get("target_temp_step", 0.5)*10)
        icon_res_list = []
        icon_res = ""

        hvac_modes = main_entity.attributes.get("hvac_modes", [])
        if main_entity.config.get("supported_modes"):
            hvac_modes = main_entity.config.get("supported_modes")
        for mode in hvac_modes:
            icon_id = ha_icons.get_icon_ha("climate", mode)
            color_on = 64512
            if mode in ["auto", "heat_cool"]:
                color_on = 1024
            if mode == "heat":
                color_on = 64512
            if mode == "off":
                color_on = 35921
            if mode == "cool":
                color_on = 11487
            if mode == "dry":
                color_on = 60897
            if mode == "fan_only":
                color_on = 35921
            state = 0
            if(mode == main_entity.state):
                state = 1

            icon_res_list.append(f"~{icon_id}~{color_on}~{state}~{mode}")

        icon_res = "".join(icon_res_list)

        if len(icon_res_list) == 1 and not self.panel.model == "us-p":
            icon_res = "~"*4 + icon_res_list[0] + "~"*4*6
        elif len(icon_res_list) == 2 and not self.panel.model == "us-p":
            icon_res = "~"*4*2 + icon_res_list[0] + "~"*4*2 + icon_res_list[1] + "~"*4*2
        elif len(icon_res_list) == 3 and not self.panel.model == "us-p":
            icon_res = "~"*4*2 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4
        elif len(icon_res_list) == 4 and not self.panel.model == "us-p":
            icon_res = "~"*4 + icon_res_list[0] + "~"*4 + icon_res_list[1] + "~"*4 + icon_res_list[2] + "~"*4 + icon_res_list[3]
        elif len(icon_res_list) >= 5 or self.panel.model == "us-p":
            icon_res = "".join(icon_res_list) + "~"*4*(8-len(icon_res_list))

        currently_translation = get_translation(self.locale, "frontend.ui.card.climate.currently")
        state_translation = get_translation(self.locale, "frontend.ui.panel.config.devices.entities.state")
        action_translation = get_translation(self.locale, "frontend.ui.card.climate.operation").replace(' ','\r\n')

        detailPage = "1"
        if any(x in ["preset_modes", "swing_modes", "fan_modes"] for x in main_entity.attributes):
            detailPage = "0"

        result = f"{self.title}~{self.gen_nav()}~{main_entity.entity_id}~{current_temp} {temperature_unit}~{dest_temp}~{state_value}~{min_temp}~{max_temp}~{step_temp}{icon_res}~{currently_translation}~{state_translation}~{action_translation}~{temperature_unit_icon}~{dest_temp2}~{detailPage}"
        return result


class Screensaver(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)
        if not self.type:
            self.type = "screensaver"
    def render(self):
        result = ""
        for e in self.entities:
            result += e.render(cardType=self.type)
        return result[1:]


def card_factory(locale, settings, panel):
    match settings["type"]:
        case 'cardEntities' | 'cardGrid':
            card = EntitiesCard(locale, settings, panel)
        case 'cardQR':
            card = QRCard(locale, settings, panel)
        case 'cardPower':
            card = PowerCard(locale, settings, panel)
        case 'cardMedia':
            card = MediaCard(locale, settings, panel)
        case 'cardThermo':
            card = ClimateCard(locale, settings, panel)
        case _:
            logging.error("card type %s not implemented", settings["type"])
            return "NotImplemented", None
    return card.iid, card


def entity_factory(locale, settings, panel):
    etype = settings["entity"].split(".")[0]
    if etype in ["delete", "navigate", "iText"]:
        entity = panel_cards.Entity(locale, settings, panel)
    else:
        entity = HAEntity(locale, settings, panel)
    return entity.iid, entity
