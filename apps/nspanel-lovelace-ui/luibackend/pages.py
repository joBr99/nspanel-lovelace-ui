import datetime
import dateutil.parser as dp

from theme import get_screensaver_color_output
from icon_mapping import get_icon_id
from icons import get_icon_id_ha
from icons import get_action_id_ha
from helper import scale, rgb_dec565, rgb_brightness, get_attr_safe, convert_temperature
from localization import get_translation

# check Babel
import importlib
babel_spec = importlib.util.find_spec("babel")
if babel_spec is not None:
    import babel.dates

class LuiPagesGen(object):

    def __init__(self, ha_api, config, send_mqtt_msg):
        self._ha_api = ha_api
        self._config = config
        self._locale  = config.get("locale")
        self._send_mqtt_msg = send_mqtt_msg
    
    def get_entity_color(self, entity, overwrite=None):
        if overwrite is not None:
            if type(overwrite) is list:
                return rgb_dec565(overwrite)
            if type(overwrite) is dict:
                state = entity.state
                for overwrite_state, overwrite_val in overwrite.items():
                    if overwrite_state == state:
                        return rgb_dec565(overwrite_val)
                    
        attr = entity.attributes
        default_color_on  = rgb_dec565([253, 216, 53])
        default_color_off = rgb_dec565([68, 115, 158])
        icon_color = default_color_on if entity.state in ["on", "unlocked"] else default_color_off

        if "rgb_color" in attr:
            color = attr.rgb_color
            if "brightness" in attr:
                color = rgb_brightness(color, attr.brightness)
            icon_color = rgb_dec565(color)
        elif "brightness" in attr:
            color = rgb_brightness([253, 216, 53], attr.brightness)
            icon_color = rgb_dec565(color)
        return icon_color

    def update_time(self, kwargs):
        time = datetime.datetime.now().strftime(self._config.get("timeFormat"))
        addTemplate = self._config.get("timeAdditionalTemplate")
        addTimeText = self._ha_api.render_template(addTemplate)
        self._send_mqtt_msg(f"time~{time}~{addTimeText}")

    def update_date(self, kwargs):
        global babel_spec
        if babel_spec is not None:
            dateformat = self._config.get("dateFormatBabel")
            date = babel.dates.format_date(datetime.datetime.now(), dateformat, locale=self._locale)
        else:
            dateformat = self._config.get("dateFormat")
            date = datetime.datetime.now().strftime(dateformat)
            
        addTemplate = self._config.get("dateAdditionalTemplate")
        addDateText = self._ha_api.render_template(addTemplate)
        self._send_mqtt_msg(f"date~{date}{addDateText}")

    def page_type(self, target_page):
        self._send_mqtt_msg(f"pageType~{target_page}")
    
    def update_screensaver_weather(self, theme):
        global babel_spec
        we_name = self._config._config_screensaver.entity.entityId
        unit = self._config._config_screensaver.raw_config.get("weatherUnit", "celsius")
        state = {}
        
        if self._ha_api.entity_exists(we_name):
            we = self._ha_api.get_entity(we_name)
        else:
            self._ha_api.error(f"Skipping Weather Update, entity {we_name} not found")
            return

        icon_cur        = get_icon_id_ha("weather", state=we.state)
        state["tMainIcon"] = we.state
        text_cur        = convert_temperature(we.attributes.temperature, unit)

        forecastSkip = self._config._config_screensaver.raw_config.get(f"forecastSkip")+1
        # check if the difference between the first 2 forecast items is less than 24h
        difference = (dp.parse(we.attributes.forecast[forecastSkip]['datetime']) - dp.parse(we.attributes.forecast[0]['datetime']))
        total_seconds = difference.total_seconds()
        same_day = total_seconds < 86400
        weather_res = ""
        for i in range(1,5):
            wOF = self._config._config_screensaver.raw_config.get(f"weatherOverrideForecast{i}")
            if wOF is None:
                fid = (i-1)*forecastSkip
                if len(we.attributes.forecast) >= fid:
                    up = we.attributes.forecast[fid]['datetime']
                    up   = dp.parse(up).astimezone()
                    if babel_spec is not None:
                        if same_day:
                            up = babel.dates.format_time(up, "H:mm", locale=self._locale)
                        else:
                            up = babel.dates.format_date(up, "E", locale=self._locale)
                    else:
                        if same_day:
                            up = up.strftime('%H:%M')
                        else:
                            up = up.strftime('%a')
                    icon = get_icon_id_ha("weather", state=we.attributes.forecast[fid]['condition'])
                    if i == 1:
                        state["tF1Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 2:
                        state["tF2Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 3:
                        state["tF3Icon"] = we.attributes.forecast[fid]['condition']
                    elif i == 4:
                        state["tF4Icon"] = we.attributes.forecast[fid]['condition']
                    down = convert_temperature(we.attributes.forecast[fid]['temperature'], unit)
                else:
                    up = ""
                    icon = ""
                    down = ""
            else:
                self._ha_api.log(f"Forecast {i} is overriden with {wOF}")
                icon = wOF.get("icon")
                name = wOF.get("name")
                entity = self._ha_api.get_entity(wOF.get("entity"))
                up = name if name is not None else entity.attributes.friendly_name
                icon = get_icon_id_ha("sensor", state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
                down = f"{entity.state} {unit_of_measurement}"
            weather_res+=f"~{up}~{icon}~{down}"

        altLayout = "~~"
        if self._config._config_screensaver.raw_config.get("alternativeLayout", False):
            altLayout = f"~{get_icon_id('water-percent')}~{we.attributes.humidity} %"

        # status icons
        status_res = ""
        for i in range(1,3):
            statusIcon = self._config._config_screensaver.raw_config.get(f"statusIcon{i}")
            if statusIcon is not None:
                icon = statusIcon.get("icon")
                entity = self._ha_api.get_entity(statusIcon.get("entity"))
                entityType = statusIcon.get("entity").split(".")[0]
                icon = get_icon_id_ha(entityType, state=entity.state, device_class=entity.attributes.get("device_class", ""), overwrite=icon)
                color = self.get_entity_color(entity, overwrite=statusIcon.get("color", None))
                status_res += f"~{icon}~{color}"

        self._send_mqtt_msg(f"weatherUpdate~{icon_cur}~{text_cur}{weather_res}{altLayout}{status_res}")
        
        # send color if configured in screensaver
        if theme is not None:
            if not ("autoWeather" in theme and theme["autoWeather"]):
                state = None
            self._send_mqtt_msg(get_screensaver_color_output(theme=theme, state=state))

    def generate_entities_item(self, item, cardType):
        entityId = item.entityId
        icon = item.iconOverride
        colorOverride = item.colorOverride
        name = item.nameOverride
        uuid = item.uuid
        # type of the item is the string before the "." in the entityId
        entityType = entityId.split(".")[0]
        
        self._ha_api.log(f"Generating item for {entityId} with type {entityType}", level="DEBUG")
        # Internal types
        if entityType == "delete":
            return f"~{entityType}~~~~~"
        if entityType == "navigate":
            page_search_res = self._config.searchCard(entityId)
            if page_search_res is not None:
                icon_res = get_icon_id_ha("navigate", overwrite=icon)
                status_entity = None
                name = name if name is not None else page_search_res.title
                text = get_translation(self._locale, "frontend.ui.card.button.press")
                if item.status is not None and self._ha_api.entity_exists(item.status):
                    status_entity = self._ha_api.get_entity(item.status)
                    icon_res = get_icon_id_ha(item.status.split(".")[0], state=status_entity.state, device_class=status_entity.attributes.get("device_class", "_"), overwrite=icon)
                    icon_color = self.get_entity_color(status_entity, overwrite=colorOverride)
                    if item.status.startswith("sensor") and cardType == "cardGrid":
                        icon_res = status_entity.state[:4]
                        if icon_res[-1] == ".":
                            icon_res = icon_res[:-1]
                else:
                    icon_color = rgb_dec565(colorOverride) if colorOverride is not None and type(colorOverride) is list else 17299
                return f"~button~{entityId}~{icon_res}~{icon_color}~{name}~{text}"
            else:
                return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~page not found~"
        if entityType == "iText":
                value   = entityId.split(".", 2)[1]
                name = name if name is not None else "conf name missing"
                icon_res = get_icon_id(icon) if icon is not None else get_icon_id("alert-circle-outline")
                return f"~text~{entityId}~{icon_res}~17299~{name}~{value}"
        if entityType == "service":
            icon_id = get_icon_id_ha("script", overwrite=icon)
            text = get_translation(self._locale, "frontend.ui.card.script.run")
            return f"~button~{uuid}~{icon_id}~17299~{name}~{text}"
        if not self._ha_api.entity_exists(entityId):
            return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~Not found check~ apps.yaml"
        
        # HA Entities
        entity = self._ha_api.get_entity(entityId)
        # check state for if a condition is defined
        if item.condState is not None and item.condState == entity.state:
            return ""
        if item.condStateNot is not None and item.condState != entity.state:
            return ""
        
        name = name if name is not None else entity.attributes.get("friendly_name","unknown")
        if entityType == "cover":

            device_class = entity.attributes.get("device_class", "window")
            icon_id = get_icon_id_ha(ha_type=entityType, state=entity.state, device_class=device_class, overwrite=icon)
            
            icon_up   = ""
            icon_stop = ""
            icon_down = ""
            icon_up_status = "disable"
            icon_stop_status = "disable"
            icon_down_status = "disable"
            bits = entity.attributes.supported_features
            pos = entity.attributes.get("current_position")
            if pos is None:
                pos_status = entity.state
                pos = "disable"
            else:
                pos_status = pos
            if bits & 0b00000001: # SUPPORT_OPEN
                if pos != 100 and not (entity.state == "open" and pos == "disable"):
                    icon_up_status = "enable"
                icon_up   = get_action_id_ha(ha_type=entityType, action="open", device_class=device_class)
            if bits & 0b00000010: # SUPPORT_CLOSE
                if pos != 0 and not (entity.state == "closed" and pos == "disable"):
                    icon_down_status = "enable"
                icon_down = get_action_id_ha(ha_type=entityType, action="close", device_class=device_class)
            if bits & 0b00001000: # SUPPORT_STOP
                icon_stop = get_action_id_ha(ha_type=entityType, action="stop", device_class=device_class)
                icon_stop_status = "enable"

            return f"~shutter~{entityId}~{icon_id}~17299~{name}~{icon_up}|{icon_stop}|{icon_down}|{icon_up_status}|{icon_stop_status}|{icon_down_status}"
        if entityType in "light":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            icon_id = get_icon_id_ha("light", state=entity.state, overwrite=icon)
            return f"~{entityType}~{entityId}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if entityType in ["switch", "input_boolean", "automation"]:
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            icon_id = get_icon_id_ha(entityType, state=entity.state, overwrite=icon)
            return f"~switch~{entityId}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if entityType in "fan":
            switch_val = 1 if entity.state == "on" else 0
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            icon_id = get_icon_id_ha(entityType, state=entity.state, overwrite=icon)
            return f"~fan~{entityId}~{icon_id}~{icon_color}~{name}~{switch_val}"
        if entityType in ["sensor", "binary_sensor"]:
            device_class = entity.attributes.get("device_class", "")
            unit_of_measurement = entity.attributes.get("unit_of_measurement", "")
            value = entity.state + " " + unit_of_measurement
            if cardType == "cardGrid" and entityType == "sensor":
                icon_id = entity.state[:4]
                if icon_id[-1] == ".":
                    icon_id = icon_id[:-1]
            else:
                icon_id = get_icon_id_ha("sensor", state=entity.state, device_class=device_class, overwrite=icon)
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            return f"~text~{entityId}~{icon_id}~{icon_color}~{name}~{value}"
        if entityType in ["button", "input_button"]:
            icon_id = get_icon_id_ha("button", overwrite=icon)
            text = get_translation(self._locale, "frontend.ui.card.button.press")
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "scene":
            icon_id = get_icon_id_ha("scene", overwrite=icon)
            text = get_translation(self._locale, "frontend.ui.card.scene.activate")
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "script":
            icon_id = get_icon_id_ha("script", overwrite=icon)
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            text = get_translation(self._locale, "frontend.ui.card.script.run")
            return f"~button~{entityId}~{icon_id}~{icon_color}~{name}~{text}"
        if entityType == "lock":
            icon_id = get_icon_id_ha("lock", state=entity.state, overwrite=icon)
            icon_color = self.get_entity_color(entity, overwrite=colorOverride)
            text = get_translation(self._locale, "frontend.ui.card.lock.lock") if entity.state == "unlocked" else get_translation(self._locale, "frontend.ui.card.lock.unlock")
            return f"~button~{entityId}~{icon_id}~{icon_color}~{name}~{text}"
        if entityType in ["number", "input_number"]:
            icon_id = get_icon_id_ha("number", state=entity.state, overwrite=icon)
            min_v = entity.attributes.get("min", 0)
            max_v = entity.attributes.get("max", 100)
            return f"~number~{entityId}~{icon_id}~17299~{name}~{entity.state}|{min_v}|{max_v}"
        if entityType == "input_text":
            icon_id = get_icon_id_ha("input_text", state=entity.state, overwrite=icon)
            value = entity.state
            return f"~text~{entityId}~{icon_id}~17299~{name}~{value}"
        if entityType == "input_select":
            icon_id = get_icon_id_ha("button", state=entity.state, overwrite=icon)
            text = entity.state
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        if entityType == "vacuum":
            icon_id = get_icon_id_ha("vacuum", state=entity.state, overwrite=icon)
            if entity.state == "docked":
                text = "Start"
            else:
                text = "Return"
            return f"~button~{entityId}~{icon_id}~17299~{name}~{text}"
        return f"~text~{entityId}~{get_icon_id('alert-circle-outline')}~17299~unsupported~"

    def generate_entities_page(self, navigation, heading, items, cardType):
        command = f"entityUpd~{heading}~{navigation}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item, cardType)
        self._send_mqtt_msg(command)

    def generate_thermo_page(self, navigation, title, entity, temp_unit):
        item = entity.entityId

        if(temp_unit == "celsius"):
            temperature_unit_icon = get_icon_id("temperature-celsius")
            temperature_unit = "°C"

        else:
            temperature_unit_icon = get_icon_id("temperature-fahrenheit")
            temperature_unit = "°F"

        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~Not found~{navigation}~{item}~check~220~apps.yaml~150~300~5~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Please~your~~"
        else:
            entity       = self._ha_api.get_entity(item)
            heading      = title if title != "unknown" else entity.attributes.friendly_name
            current_temp = get_attr_safe(entity, "current_temperature", "")
            dest_temp    = get_attr_safe(entity, "temperature", None)
            dest_temp2   = ""
            if dest_temp is None:
                dest_temp    = get_attr_safe(entity, "target_temp_high", 0)
                dest_temp2   = int(get_attr_safe(entity, "target_temp_low", 0)*10)
            dest_temp    = int(dest_temp*10)

            hvac_action  = get_attr_safe(entity, "hvac_action", "")
            state_value  = ""
            if hvac_action != "":
                state_value = get_translation(self._locale, f"frontend.state_attributes.climate.hvac_action.{hvac_action}")
                state_value += "\r\n("
            state_value += get_translation(self._locale, f"backend.component.climate.state._.{entity.state}")
            if hvac_action != "":
                state_value += ")"
            
            min_temp     = int(get_attr_safe(entity, "min_temp", 0)*10)
            max_temp     = int(get_attr_safe(entity, "max_temp", 0)*10)
            step_temp    = int(get_attr_safe(entity, "target_temp_step", 0.5)*10) 
            icon_res = ""
            hvac_modes = get_attr_safe(entity, "hvac_modes", [])
            for mode in hvac_modes:
                icon_id = get_icon_id('alert-circle-outline')
                color_on = 64512
                if mode in ["auto", "heat_cool"]:
                    icon_id = get_icon_id("calendar-sync")
                    color_on = 1024
                if mode == "heat":
                    icon_id = get_icon_id("fire")
                    color_on = 64512
                if mode == "off":
                    icon_id = get_icon_id("power")
                    color_on = 35921
                if mode == "cool":
                    icon_id = get_icon_id("snowflake")
                    color_on = 11487
                if mode == "dry":
                    icon_id = get_icon_id("water-percent")
                    color_on = 60897
                if mode == "fan_only":
                    icon_id = get_icon_id("fan")
                    color_on = 35921
                state = 0
                if(mode == entity.state):
                    state = 1
                icon_res += f"~{icon_id}~{color_on}~{state}~{mode}"
    
            len_hvac_modes = len(hvac_modes)
            padding_len = 8-len_hvac_modes
            icon_res = icon_res + "~"*4*padding_len
            
            currently_translation = get_translation(self._locale, "frontend.ui.card.climate.currently")
            state_translation = get_translation(self._locale, "frontend.ui.panel.config.devices.entities.state")
            action_translation = get_translation(self._locale, "frontend.ui.card.climate.operation")

            command = f"entityUpd~{heading}~{navigation}~{item}~{current_temp} {temperature_unit}~{dest_temp}~{state_value}~{min_temp}~{max_temp}~{step_temp}{icon_res}~{currently_translation}~{state_translation}~{action_translation}~{temperature_unit_icon}~{dest_temp2}"
        self._send_mqtt_msg(command)

    def generate_media_page(self, navigation, title, entity, mediaBtn):
        item = entity.entityId
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~Not found~{navigation}~{item}~{get_icon_id('alert-circle-outline')}~Please check your~apps.yaml in AppDaemon~~0~{get_icon_id('alert-circle-outline')}~~~disable"
        else:
            entity        = self._ha_api.get_entity(item)
            heading       = title if title != "unknown" else entity.attributes.friendly_name
            icon          = get_icon_id('speaker-off')
            title         = get_attr_safe(entity, "media_title", "")
            author        = get_attr_safe(entity, "media_artist", "")
            volume        = int(get_attr_safe(entity, "volume_level", 0)*100)
            iconplaypause = get_icon_id("pause") if entity.state == "playing" else get_icon_id("play")
            if "media_content_type" in entity.attributes:
                if entity.attributes.media_content_type == "music":
                    icon = get_icon_id("music")
            source        = get_attr_safe(entity, "source", "")
            speakerlist   = get_attr_safe(entity, "source_list",[])
            if source in speakerlist:
                # move current source to the end of the list
                speakerlist.remove(source)
                speakerlist.append(source)
            if len(speakerlist) == 1:
                speakerlist = []
            speakerlist = "?".join(speakerlist)
            bits = entity.attributes.supported_features
            onoffbutton = "disable"
            if bits & 0b10000000:
                if entity.state == "off":
                    onoffbutton = 1374
                else:
                    onoffbutton = rgb_dec565([255,152,0])
            command = f"entityUpd~{heading}~{navigation}~{item}~{icon}~{title}~{author}~{volume}~{iconplaypause}~{source}~{speakerlist[:200]}~{onoffbutton}~{mediaBtn}"
        self._send_mqtt_msg(command)
        
    def generate_alarm_page(self, navigation, entity, alarmBtn):
        item = entity.entityId
        if not self._ha_api.entity_exists(item):
            command = f"entityUpd~{item}~{navigation}~Not found~Not found~Check your~Check your~apps.~apps.~yaml~yaml~0~~0"
        else:
            entity = self._ha_api.get_entity(item)
            icon = get_icon_id("shield-off")
            color = rgb_dec565([255,255,255])
            supported_modes = []
            numpad = "enable"
            if entity.state == "disarmed":
                color = rgb_dec565([13,160,53])
                icon = get_icon_id("shield-off")
                if not entity.attributes.get("code_arm_required", False):
                    numpad = "disable"
                bits = entity.attributes.supported_features
                if bits & 0b000001:
                    supported_modes.append("arm_home")
                if bits & 0b000010:
                    supported_modes.append("arm_away")
                if bits & 0b000100:
                    supported_modes.append("arm_night")
                if bits & 0b100000:
                    supported_modes.append("arm_vacation")
            else:
                supported_modes.append("disarm")

            if entity.state == "armed_home":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-home")
            if entity.state == "armed_away":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-lock")
            if entity.state == "armed_night":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("weather-night")
            if entity.state == "armed_vacation":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("shield-airplane")

            flashing = "disable"
            if entity.state in ["arming", "pending"]:
                color = rgb_dec565([243,179,0])
                icon = get_icon_id("shield")
                flashing = "enable"
            if entity.state == "triggered":
                color = rgb_dec565([223,76,30])
                icon = get_icon_id("bell-ring")
                flashing = "enable"

            #add button to show sensor state
            add_btn = ""
            if "open_sensors" in entity.attributes and entity.attributes.open_sensors is not None:
                add_btn=f"{get_icon_id('progress-alert')}~{rgb_dec565([243,179,0])}~opnSensorNotify"
            if alarmBtn is not None and type(alarmBtn) is dict:
                entity  = alarmBtn.get("entity")
                iconnav = get_icon_id_ha("alarm-arm-fail", overwrite=alarmBtn.get("icon"))
                status  = alarmBtn.get("status")
                if status is not None and self._ha_api.entity_exists(status):
                    icon_color = self.get_entity_color(self._ha_api.get_entity(status))
                else:
                    icon_color = rgb_dec565([243,179,0])
                add_btn=f"{iconnav}~{icon_color}~{entity}"
                
            # add padding to arm buttons
            arm_buttons = ""
            for b in supported_modes:
                modeName = f"frontend.ui.card.alarm_control_panel.{b}"
                arm_buttons += f"~{get_translation(self._locale, modeName)}~{b}"
            if len(supported_modes) < 4:
                arm_buttons += "~"*((4-len(supported_modes))*2)
            command = f"entityUpd~{item}~{navigation}{arm_buttons}~{icon}~{color}~{numpad}~{flashing}~{add_btn}"
        self._send_mqtt_msg(command)
        

    def generate_qr_page(self, navigation, heading, items, cardType, qrcode):
        qrcode = self._ha_api.render_template(qrcode)
        command = f"entityUpd~{heading}~{navigation}~{qrcode}"
        # Get items and construct cmd string
        for item in items:
            command += self.generate_entities_item(item, cardType)
        self._send_mqtt_msg(command)


    def render_card(self, card, send_page_type=True):    
        self._ha_api.log(f"Started rendering of page {card.pos} with type {card.cardType}")
        
        if len(self._config._config_cards) == 1:
            navigation = "0|0"
        else:
            navigation = "1|1"
        if card.pos is None:
            navigation = "2|0"            

        # Switch to page
        if send_page_type:
            self.page_type(card.cardType)

        if card.cardType in ["cardEntities", "cardGrid"]:
            self.generate_entities_page(navigation, card.title, card.entities, card.cardType)
            return
        if card.cardType == "cardThermo":
            temp_unit = card.raw_config.get("temperatureUnit", "celsius")
            self.generate_thermo_page(navigation, card.title, card.entity, temp_unit)
        if card.cardType == "cardMedia":
            mediaBtn = card.raw_config.get("mediaControl", "")
            self.generate_media_page(navigation, card.title, card.entity, mediaBtn)
        if card.cardType == "cardAlarm":
            alarmBtn = card.raw_config.get("alarmControl")
            self.generate_alarm_page(navigation, card.entity, alarmBtn)
        if card.cardType == "screensaver":
            theme = card.raw_config.get("theme")
            self.update_screensaver_weather(theme)
        if card.cardType == "cardQR":
            qrcode = card.raw_config.get("qrCode", "")
            self.generate_qr_page(navigation, card.title, card.entities, card.cardType, qrcode)



    def generate_light_detail_page(self, entity_id):
        entity = self._ha_api.get_entity(entity_id)
        switch_val = 1 if entity.state == "on" else 0
        icon_color = self.get_entity_color(entity)
        brightness = "disable"
        color_temp = "disable"
        color = "disable"
        if entity.state == "on":
            if "brightness" in entity.attributes:
                # scale 0-255 brightness from ha to 0-100
                brightness = int(scale(entity.attributes.brightness,(0,255),(0,100)))
            else:
                brightness = "disable"
            if "color_temp" in entity.attributes.supported_color_modes:
                if "color_temp" in entity.attributes:
                    # scale ha color temp range to 0-100
                    color_temp = int(scale(entity.attributes.color_temp,(entity.attributes.min_mireds, entity.attributes.max_mireds),(0,100)))
                else:
                    color_temp = "unknown"
            else:
                color_temp = "disable"
            list_color_modes = ["xy", "rgb", "rgbw", "hs"]
            if any(item in list_color_modes for item in entity.attributes.supported_color_modes):
                color = "enable"
            else:
                color = "disable"
        color_translation      = "Color"
        brightness_translation = get_translation(self._locale, "frontend.ui.card.light.brightness")
        color_temp_translation = get_translation(self._locale, "frontend.ui.card.light.color_temperature")
        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{get_icon_id('lightbulb')}~{icon_color}~{switch_val}~{brightness}~{color_temp}~{color}~{color_translation}~{color_temp_translation}~{brightness_translation}")
    
    def generate_shutter_detail_page(self, entity_id):
        entity = self._ha_api.get_entity(entity_id)
        entityType="cover"
        device_class = entity.attributes.get("device_class", "window")
        icon_id   = get_icon_id_ha(entityType, state=entity.state, device_class=device_class)
        
        pos = entity.attributes.get("current_position")
        if pos is None:
            pos_status = entity.state
            pos = "disable"
        else:
            pos_status = pos
        
        pos_translation = ""
        icon_up   = ""
        icon_stop = ""
        icon_down = ""
        icon_up_status = "disable"
        icon_stop_status = "disable"
        icon_down_status = "disable"
        textTilt = ""
        iconTiltLeft = ""
        iconTiltStop = ""
        iconTiltRight = ""
        iconTiltLeftStatus = "disable"
        iconTiltStopStatus = "disable"
        iconTiltRightStatus = "disable"
        tilt_pos = "disable"

        bits = entity.attributes.supported_features

        # position supported
        if bits & 0b00001111:
            pos_translation = get_translation(self._locale, "frontend.ui.card.cover.position")
        if bits & 0b00000001: # SUPPORT_OPEN
            if pos != 100 and not (entity.state == "open" and pos == "disable"):
                icon_up_status = "enable"
            icon_up   = get_action_id_ha(ha_type=entityType, action="open", device_class=device_class)
        if bits & 0b00000010: # SUPPORT_CLOSE
            if pos != 0 and not (entity.state == "closed" and pos == "disable"):
                icon_down_status = "enable"
            icon_down = get_action_id_ha(ha_type=entityType, action="close", device_class=device_class)
        #if bits & 0b00000100: # SUPPORT_SET_POSITION
        if bits & 0b00001000: # SUPPORT_STOP
            icon_stop = get_action_id_ha(ha_type=entityType, action="stop", device_class=device_class)
            icon_stop_status = "enable"

        # tilt supported
        if bits & 0b11110000:
            textTilt = get_translation(self._locale, "frontend.ui.card.cover.tilt_position")
        if bits & 0b00010000: # SUPPORT_OPEN_TILT
            iconTiltLeft = get_icon_id('arrow-top-right')
            iconTiltLeftStatus = "enable"
        if bits & 0b00100000: # SUPPORT_CLOSE_TILT
            iconTiltRight = get_icon_id('arrow-bottom-left')
            iconTiltRightStatus = "enable"
        if bits & 0b01000000: # SUPPORT_STOP_TILT
            iconTiltStop = get_icon_id('stop')
            iconTiltStopStatus = "enable"
        if bits & 0b10000000: # SUPPORT_SET_TILT_POSITION
            tilt_pos = get_attr_safe(entity, "current_tilt_position", 0)
            if(tilt_pos == 0):
                iconTiltRightStatus = "disable"
            if(tilt_pos == 100):
                iconTiltLeftStatus  = "disable"

        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{pos}~{pos_translation}: {pos_status}~{pos_translation}~{icon_id}~{icon_up}~{icon_stop}~{icon_down}~{icon_up_status}~{icon_stop_status}~{icon_down_status}~{textTilt}~{iconTiltLeft}~{iconTiltStop}~{iconTiltRight}~{iconTiltLeftStatus}~{iconTiltStopStatus}~{iconTiltRightStatus}~{tilt_pos}")

    def generate_fan_detail_page(self, entity_id):
        entity = self._ha_api.get_entity(entity_id)
        switch_val = 1 if entity.state == "on" else 0
        icon_color = self.get_entity_color(entity)
        speed = entity.attributes.get("percentage")
        speedMax = 100
        if(speed is None):
            speed = "disable"
        else:
            speed = round(entity.attributes.get("percentage")/entity.attributes.get("percentage_step"))
            speedMax = int(100/entity.attributes.get("percentage_step"))

        speed_translation = get_translation(self._locale, "frontend.ui.card.fan.speed")
        self._send_mqtt_msg(f"entityUpdateDetail~{entity_id}~{get_icon_id('fan')}~{icon_color}~{switch_val}~{speed}~{speedMax}~{speed_translation}")

    def send_message_page(self, ident, heading, msg, b1, b2):
        self._send_mqtt_msg(f"pageType~popupNotify")
        self._send_mqtt_msg(f"entityUpdateDetail~{ident}~{heading}~65535~{b1}~65535~{b2}~65535~{msg}~65535~0")
