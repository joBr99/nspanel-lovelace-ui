import libs.home_assistant
import logging
import time
from libs.helper import pos_to_color, scale

def wait_for_ha_cache():
    mustend = time.time() + 5
    while time.time() < mustend:
        if len(libs.home_assistant.home_assistant_entity_state_cache) == 0:
            time.sleep(0.1)

def calculate_dim_values(sleepTracking, sleepTrackingZones, sleepBrightness, screenBrightness, sleepOverride, return_involved_entities=False):
    dimmode = 10
    dimValueNormal = 100
    involved_entities = []

    if sleepBrightness:
        if isinstance(sleepBrightness, int):
            dimmode = sleepBrightness
        elif libs.home_assistant.is_existent(sleepBrightness):
            involved_entities.append(sleepBrightness)
            dimmode = int(float(libs.home_assistant.get_entity_data(sleepBrightness).get('state', 10)))

    if screenBrightness:
        if isinstance(screenBrightness, int):
            dimValueNormal = screenBrightness
        elif libs.home_assistant.is_existent(screenBrightness):
            involved_entities.append(screenBrightness)
            dimValueNormal = int(float(libs.home_assistant.get_entity_data(screenBrightness).get('state', 100)))

    # force sleep brightness to zero in case sleepTracking is active
    if sleepTracking:
        if libs.home_assistant.is_existent(sleepTracking):
            involved_entities.append(sleepTracking)
            state = libs.home_assistant.get_entity_data(sleepTracking).get('state', '')
            if state in sleepTrackingZones:
                logging.info("sleepTracking active forcing brightnesss to 0")
                dimmode = 0

    # overwrite everything with sleepOverwrite
    if sleepOverride and isinstance(sleepOverride, dict) and sleepOverride.get("entity") and sleepOverride.get("brightness"):
        entity = sleepOverride.get("entity")
        if libs.home_assistant.is_existent(entity):
            involved_entities.append(entity)
            state = libs.home_assistant.get_entity_data(entity).get('state', '')
            if state in ["on", "true", "home"]:
                dimmode = sleepOverride.get("brightness")

    if return_involved_entities:
        return involved_entities
    else:
        return dimmode, dimValueNormal

def handle_buttons(entity_id, btype, value, entity_config=None):
    match btype:
        case 'button':
            button_press(entity_id, value)
        case 'OnOff':
            on_off(entity_id, value)
        case 'number-set':
            if entity_id.startswith('fan'):
                attr = libs.home_assistant.get_entity_data(entity_id).get('attributes', [])
                value = float(value) * float(attr.get(percentage_step, 0))
            service_data = {
                "value": int(value)
            }
            call_ha_service(entity_id, "set_value", service_data=service_data)
        case 'up' | 'stop' | 'down' | 'tiltOpen' | 'tiltStop' | 'tiltClose' | 'media-next' | 'media-back' | 'media-pause' | 'timer-cancel' | 'timer-pause' | 'timer-finish':
            action_service_mapping = {
                'up': 'open_cover',
                'stop': 'stop_cover',
                'down': 'close_cover',
                'tiltOpen': 'open_cover_tilt',
                'tiltStop': 'stop_cover_tilt',
                'tiltClose': 'close_cover_tilt',
                'media-next': 'media_next_track',
                'media-back': 'media_previous_track',
                'media-pause': 'media_play_pause',
                'timer-cancel': 'cancel',
                'timer-pause': 'pause',
                'timer-finish': 'finish',
            }
            service = action_service_mapping[btype]
            call_ha_service(entity_id, service)
        case 'timer-start':
            if value:
                service_data = {
                    "duration": value
                }
                call_ha_service(entity_id, "start", service_data=service_data)
            else:
                call_ha_service(entity_id, "start")
        case 'positionSlider':
            service_data = {
                "position": int(value)
            }
            call_ha_service(entity_id, "set_cover_position", service_data=service_data)
        case 'tiltSlider':
            service_data = {
                "tilt_position": int(value)
            }
            call_ha_service(entity_id, "set_cover_tilt_position", service_data=service_data)
        case 'media-OnOff':
            state = libs.home_assistant.get_entity_data(entity_id).get('state', '')
            if state == "off":
                call_ha_service(entity_id, "turn_on")
            else:
                call_ha_service(entity_id, "turn_off")
        case 'media-shuffle':
            suffle = libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get('shuffle')
            service_data = {
                "shuffle": not suffle
            }
            call_ha_service(entity_id, "set_value", service_data=service_data)
        case 'volumeSlider':
            pos = int(value)
            # HA wants to have this value between 0 and 1 as float
            pos = pos/100
            service_data = {
                "volume_level": pos
            }
            call_ha_service(entity_id, "volume_set", service_data=service_data)
        case 'speaker-sel':
            service_data = {
                "volume_level": value
            }
            call_ha_service(entity_id, "select_source", service_data=service_data)
        # for light detail page
        case 'brightnessSlider':
            # scale 0-100 to ha brightness range
            brightness = int(scale(int(value), (0, 100), (0,255)))
            service_data = {
                "brightness": brightness
            }
            call_ha_service(entity_id, "turn_on", service_data=service_data)
        case 'colorTempSlider':
            attr = libs.home_assistant.get_entity_data(entity_id).get('attributes', [])
            min_mireds = attr.get("min_mireds")
            max_mireds = attr.get("max_mireds")
            # scale 0-100 to ha brightness range
            color_val = int(scale(int(value), (0, 100), (min_mireds, max_mireds)))
            service_data = {
                "color_temp": color_val
            }
            call_ha_service(entity_id, "turn_on", service_data=service_data)
        case 'colorWheel':
            value = value.split('|')
            color = pos_to_color(int(value[0]), int(value[1]), int(value[2]))
            service_data = {
                "rgb_color": color
            }
            call_ha_service(entity_id, "turn_on", service_data=service_data)
        case 'disarm' | 'arm_home' | 'arm_away' | 'arm_night' | 'arm_vacation':
            service_data = {
                "code": value
            }
            call_ha_service(entity_id, f"alarm_{btype}", service_data=service_data)
        case 'mode-preset_modes' | 'mode-swing_modes' | 'mode-fan_modes':
            mapping = {
                'mode-preset_modes': 'preset_modes',
                'mode-swing_modes': 'swing_modes',
                'mode-fan_modes': 'fan_mode'
            }
            if btype in mapping:
                modes = libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get(mapping[btype], [])
                if modes:
                    mode = modes[int(value)]
                    service_data = {
                        mapping[btype]: mode
                    }
                    call_ha_service(entity_id, f"set_{mapping[btype]}", service_data=service_data)
        case 'mode-input_select' | 'mode-select':
            options = libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get("options", [])
            if options:
                option = options[int(value)]
                service_data = {
                    "option": option
                }
                call_ha_service(entity_id, "select_option", service_data=service_data)
        case 'mode-media_player':
            options = libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get("source_list", [])
            if options:
                option = options[int(value)]
                service_data = {
                    "source": option
                }
                call_ha_service(entity_id, "select_source", service_data=service_data)
        case 'mode-light':
            options = entity_config.get("effectList", libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get("effect_list", []))
            if options:
                option = options[int(value)]
                service_data = {
                    "effect": option
                }
                call_ha_service(entity_id, "turn_on", service_data=service_data)
        case 'tempUpd':
            temp = int(value)/10
            service_data = {
                "temperature": temp
            }
            call_ha_service(entity_id, "set_temperature", service_data=service_data)
        case 'tempUpdHighLow':
            value = value.split("|")
            temp_high = int(value[0])/10
            temp_low = int(value[1])/10
            service_data = {
                "target_temp_high": temp_high,
                "target_temp_low": temp_low,
            }
            call_ha_service(entity_id, "set_temperature", service_data=service_data)
        case 'hvac_action':
            service_data = {
                "hvac_mode": value
            }
            call_ha_service(entity_id, "set_hvac_mode", service_data=service_data)
        case _:
           logging.error("Not implemented: %s", btype)


    #  # for cardUnlock
    #  if button_type == "cardUnlock-unlock":
    #      curCard = self._config.get_card_by_uuid(
    #          entity_id.replace('navigate.', ''))
    #      if curCard is not None:
    #          if int(curCard.raw_config.get("pin")) == int(value):
    #              dstCard = self._config.search_card(
    #                  curCard.raw_config.get("destination"))
    #              if dstCard is not None:
    #                  if dstCard.hidden:
    #                      self._previous_cards.append(self._current_card)
    #                  self._current_card = dstCard
    #                  self._pages_gen.render_card(self._current_card)

    #  if button_type == "opnSensorNotify":
    #      msg = ""
    #      entity = apis.ha_api.get_entity(entity_id)
    #      if "open_sensors" in entity.attributes and entity.attributes.open_sensors is not None:
    #          for e in entity.attributes.open_sensors:
    #              msg += f"- {apis.ha_api.get_entity(e).attributes.friendly_name}\r\n"
    #      self._pages_gen.send_message_page(
    #          "opnSensorNotifyRes", "", msg, "", "")

def call_ha_service(entity_id, service, service_data = {}):
    etype = entity_id.split(".")[0]
    libs.home_assistant.call_service(
        entity_name=entity_id,
        domain=etype,
        service=service,
        service_data=service_data
    )

def button_press(entity_id, value):
    etype = entity_id.split(".")[0]
    match etype:
        case 'scene' | 'script':
            call_ha_service(entity_id, "turn_on")
        case 'light' | 'switch' | 'input_boolean' | 'automation' | 'fan':
            call_ha_service(entity_id, "toggle")
        case 'lock':
            state = libs.home_assistant.get_entity_data(entity_id).get('state', '')
            if state == "locked":
                call_ha_service(entity_id, "unlock")
            else:
                call_ha_service(entity_id, "lock")
        case 'button' | 'input_button':
            call_ha_service(entity_id, "press")
        case 'input_select' | 'select':
            call_ha_service(entity_id, "select_next")
        case 'vacuum':
            state = libs.home_assistant.get_entity_data(entity_id).get('state', '')
            if state == "docked":
                call_ha_service(entity_id, "start")
            else:
                call_ha_service(entity_id, "return_to_base")
        case _:
            logging.error("buttonpress for entity type %s not implemented", etype)

    #      elif entity_id.startswith('service'):
    #          apis.ha_api.call_service(entity_id.replace(
    #              'service.', '', 1).replace('.', '/', 1), **entity_config.data)

def on_off(entity_id, value):
    etype = entity_id.split(".")[0]
    match etype:
        case 'light' | 'switch' | 'input_boolean' | 'automation' | 'fan':
            service = "turn_off"
            if value == "1":
                service = "turn_on"
            call_ha_service(entity_id, service)
        case _:
            logging.error(
                "Control action on_off not implemented for %s", entity_id)
