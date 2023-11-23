import libs.home_assistant
import ha_icons
import ha_colors
from libs.localization import get_translation
import panel_cards
import logging
import dateutil.parser as dp
import babel
from libs.icon_mapping import get_icon_char
from libs.helper import rgb_dec565, scale

class HAEntity(panel_cards.Entity):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self, cardType=""):

        if self.icon_overwrite and self.icon_overwrite.startswith("ha:"):
            out = libs.home_assistant.render_template(self.icon_overwrite[3:])
            self.icon_overwrite = out

        if self.etype in ["delete", "navigate", "iText"]:
            out = super().render()
            if self.etype == "navigate" and "status" in self.config:
                status_out = HAEntity(self.locale,
                                    {
                                        'entity': f'{self.config.get("status")}',
                                    }, self.panel
                                ).render().split("~")
                status_out[2] = out.split("~")[2]
                status_out = "~".join(status_out)
                return status_out
            return out

        # get data from HA
        data = libs.home_assistant.get_entity_data(self.entity_id)
        if data:
            self.state = data.get("state")
            self.attributes = data.get("attributes", [])
        else:
            return "~text~iid.404~X~6666~not found~"

        # HA Entities
        entity_type_panel = "text"
        icon_char = ha_icons.get_icon_ha(self.etype, self.state, device_class=self.attributes.get("device_class", None), media_content_type=self.attributes.get("media_content_type", None), overwrite=self.config.get("icon"))
        color = ha_colors.get_entity_color(
            self.etype, self.state, self.attributes)
        if self.color_overwrite:
            color = rgb_dec565(self.color_overwrite)
        name = self.config.get("name", self.attributes.get("friendly_name", "unknown"))
        if self.name_overwrite:
            name = self.name_overwrite
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
            entity = HAEntity(locale, config, panel)
            self.entities.append(entity)
        if "entities" in config:
            for e in config.get("entities"):
                entity = HAEntity(locale, e, panel)
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
        if self.hidden:
            leftBtn = panel_cards.Entity(self.locale,
                                         {
                                             'entity': f'navigate.UP',
                                             'icon': 'mdi:arrow-up-bold',
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
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

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
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

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
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

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
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

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
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

class AlarmCard(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

    def render(self):
        main_entity = self.entities[0]
        main_entity.render()

        icon = get_icon_char("shield-off")
        color = rgb_dec565([255,255,255])
        supported_modes = []
        numpad = "enable"
        if main_entity.state == "disarmed":
            color = rgb_dec565([13,160,53])
            icon = get_icon_char("shield-off")
            if not main_entity.attributes.get("code_arm_required", False):
                numpad = "disable"
            if self.config.get("supported_modes") is None:
                bits = main_entity.attributes.get("supported_features")
                if bits & 0b000001:
                    supported_modes.append("arm_home")
                if bits & 0b000010:
                    supported_modes.append("arm_away")
                if bits & 0b000100:
                    supported_modes.append("arm_night")
                if bits & 0b100000:
                    supported_modes.append("arm_vacation")
            else:
                supported_modes = self.config.get("supported_modes")
        else:
            supported_modes.append("disarm")

        if main_entity.state == "armed_home":
            color = rgb_dec565([223,76,30])
            icon = get_icon_char("shield-home")
        if main_entity.state == "armed_away":
            color = rgb_dec565([223,76,30])
            icon = get_icon_char("shield-lock")
        if main_entity.state == "armed_night":
            color = rgb_dec565([223,76,30])
            icon = get_icon_char("weather-night")
        if main_entity.state == "armed_vacation":
            color = rgb_dec565([223,76,30])
            icon = get_icon_char("shield-airplane")

        flashing = "disable"
        if main_entity.state in ["arming", "pending"]:
            color = rgb_dec565([243,179,0])
            icon = get_icon_char("shield")
            flashing = "enable"
        if main_entity.state == "triggered":
            color = rgb_dec565([223,76,30])
            icon = get_icon_char("bell-ring")
            flashing = "enable"

        #add button to show sensor state
        add_btn = ""
        if "open_sensors" in main_entity.attributes and main_entity.attributes.get("open_sensors") is not None:
            add_btn=f"{get_icon_char('progress-alert')}~{rgb_dec565([243,179,0])}~"

        # add padding to arm buttons
        arm_buttons = ""
        for b in supported_modes:
            modeName = f"frontend.ui.card.alarm_control_panel.{b}"
            arm_buttons += f"~{get_translation(self.locale, modeName)}~{b}"
        if len(supported_modes) < 4:
            arm_buttons += "~"*((4-len(supported_modes))*2)
        result = f"{self.title}~{self.gen_nav()}~{main_entity.entity_id}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}~{add_btn}"
        libs.panel_cmd.entityUpd(self.panel.sendTopic, result)

class Screensaver(HACard):
    def __init__(self, locale, config, panel):
        super().__init__(locale, config, panel)

        if not self.type:
            self.type = "screensaver"

        self.statusIcon1 = None
        if "statusIcon1" in config:
            self.statusIcon1 = HAEntity(locale, config.get("statusIcon1"), panel)
        self.statusIcon2 = None
        if "statusIcon2" in config:
            self.statusIcon2 = HAEntity(locale, config.get("statusIcon2"), panel)

    def get_entities(self):
        ent = [e.entity_id for e in self.entities]
        if self.statusIcon1:
            ent.append(self.statusIcon1.entity_id)
        if self.statusIcon2:
            ent.append(self.statusIcon2.entity_id)
        return ent

    def render(self):
        result = ""
        for e in self.entities:
            result += e.render(cardType=self.type)
        libs.panel_cmd.weatherUpdate(self.panel.sendTopic, result[1:])

        statusUpdateResult = ""
        icon1font = ""
        icon2font = ""
        if self.statusIcon1:
            si1 = self.statusIcon1.render().split('~')
            statusUpdateResult += f"{si1[3]}~{si1[4]}"
            icon1font = self.statusIcon1.font
        else:
            statusUpdateResult += "~"
        if self.statusIcon2:
            si2 = self.statusIcon2.render().split('~')
            statusUpdateResult += f"~{si2[3]}~{si2[4]}"
            icon2font = self.statusIcon2.font
        else:
            statusUpdateResult += "~~"

        libs.panel_cmd.statusUpdate(self.panel.sendTopic, f"{statusUpdateResult}~{icon1font}~{icon2font}")



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
        case 'cardAlarm':
            card = AlarmCard(locale, settings, panel)
        case _:
            logging.error("card type %s not implemented", settings["type"])
            return "NotImplemented", None
    return card.iid, card

def detail_open(locale, detail_type, ha_entity_id, entity_id):
    data = libs.home_assistant.get_entity_data(ha_entity_id)
    if data:
        state = data.get("state")
        attributes = data.get("attributes", [])
    else:
        logging.error("popup entity %s not found", ha_entity_id)
        return

    match detail_type:
        case 'popupShutter' | 'cover':
            print(f"not implemented {detail_type}")
        case 'popupLight' | 'light':
            switch_val = 1 if state == "on" else 0
            icon_color = 6666
            brightness = "disable"
            color_temp = "disable"
            color = "disable"
            effect_supported = "disable"

            if "onoff" not in attributes.get("supported_color_modes"):
                brightness = 0
            if state == "on":
                if "brightness" in attributes and attributes.get("brightness"):
                    # scale 0-255 brightness from ha to 0-100
                    brightness = int(scale(attributes.get("brightness"),(0,255),(0,100)))
                else:
                    brightness = "disable"
                if "color_temp" in attributes.get("supported_color_modes"):
                    if "color_temp" in attributes and attributes.get("color_temp"):
                        # scale ha color temp range to 0-100
                        color_temp = int(scale(attributes.get("color_temp"), (attributes.get("min_mireds"), attributes.get("max_mireds")),(0,100)))
                    else:
                        color_temp = "unknown"
                else:
                    color_temp = "disable"
                list_color_modes = ["xy", "rgb", "rgbw", "hs"]
                if any(item in list_color_modes for item in attributes.get("supported_color_modes")):
                    color = "enable"
                else:
                    color = "disable"
                if "effect_list" in attributes:
                    effect_supported = "enable"
            color_translation      = "Color"
            brightness_translation = get_translation(locale, "frontend.ui.card.light.brightness")
            color_temp_translation = get_translation(locale, "frontend.ui.card.light.color_temperature")
            return f'{entity_id}~~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}~{color_translation}~{color_temp_translation}~{brightness_translation}~{effect_supported}'
        case 'popupFan' | 'fan':
            print(f"not implemented {detail_type}")
        case 'popupThermo' | 'climate':
            print(f"not implemented {detail_type}")
        case 'popupInSel' | 'input_select' | 'select':
            print(f"not implemented {detail_type}")
        case 'popupTimer' | 'timer':
            print(f"not implemented {detail_type}")
        case _:
            logging.error("popup type %s not implemented", detail_type)
            return "NotImplemented", None
