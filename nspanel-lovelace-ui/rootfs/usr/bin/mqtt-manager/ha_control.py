import libs.home_assistant
import logging
import time

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
            dimValueNormal = int(libs.home_assistant.get_entity_data(sleepBrightness).get('state', 10))

    if screenBrightness:
        if isinstance(screenBrightness, int):
            dimValueNormal = screenBrightness
        elif libs.home_assistant.is_existent(screenBrightness):
            involved_entities.append(screenBrightness)
            dimValueNormal = int(libs.home_assistant.get_entity_data(screenBrightness).get('state', 100))

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

def handle_buttons(entity_id, btype, value):
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

       case _:
          logging.error("Not implemented: %s", btype)

    #  if button_type == "media-OnOff":
    #      if apis.ha_api.get_entity(entity_id).state == "off":
    #          apis.ha_api.get_entity(entity_id).call_service("turn_on")
    #      else:
    #          apis.ha_api.get_entity(entity_id).call_service("turn_off")
    #  if button_type == "media-shuffle":
    #      suffle = not apis.ha_api.get_entity(entity_id).attributes.shuffle
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "shuffle_set", shuffle=suffle)
    #  if button_type == "volumeSlider":
    #      pos = int(value)
    #      # HA wants this value between 0 and 1 as float
    #      pos = pos/100
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "volume_set", volume_level=pos)
    #  if button_type == "speaker-sel":
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "select_source", source=value)
    #
    #  # for light detail page
    #  if button_type == "brightnessSlider":
    #      # scale 0-100 to ha brightness range
    #      brightness = int(scale(int(value), (0, 100), (0,255)))
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "turn_on", brightness=brightness)
    #  if button_type == "colorTempSlider":
    #      entity = apis.ha_api.get_entity(entity_id)
    #      # scale 0-100 from slider to color range of lamp
    #      color_val = scale(int(
    #          value), (0, 100), (entity.attributes.min_mireds, entity.attributes.max_mireds))
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "turn_on", color_temp=color_val)
    #  if button_type == "colorWheel":
    #      apis.ha_api.log(value)
    #      value = value.split('|')
    #      color = pos_to_color(int(value[0]), int(value[1]), int(value[2]))
    #      apis.ha_api.log(color)
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "turn_on", rgb_color=color)
    #
    #  # for climate page
    #  if button_type == "tempUpd":
    #      temp = int(value)/10
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "set_temperature", temperature=temp)
    #  if button_type == "tempUpdHighLow":
    #      value = value.split("|")
    #      temp_high = int(value[0])/10
    #      temp_low = int(value[1])/10
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "set_temperature", target_temp_high=temp_high, target_temp_low=temp_low)
    #  if button_type == "hvac_action":
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          "set_hvac_mode", hvac_mode=value)
    #
    #  # for alarm page
    #  if button_type in ["disarm", "arm_home", "arm_away", "arm_night", "arm_vacation"]:
    #      apis.ha_api.get_entity(entity_id).call_service(
    #          f"alarm_{button_type}", code=value)
    #  if button_type == "opnSensorNotify":
    #      msg = ""
    #      entity = apis.ha_api.get_entity(entity_id)
    #      if "open_sensors" in entity.attributes and entity.attributes.open_sensors is not None:
    #          for e in entity.attributes.open_sensors:
    #              msg += f"- {apis.ha_api.get_entity(e).attributes.friendly_name}\r\n"
    #      self._pages_gen.send_message_page(
    #          "opnSensorNotifyRes", "", msg, "", "")
    #
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
    #
    #  if button_type == "mode-preset_modes":
    #      entity = apis.ha_api.get_entity(entity_id)
    #      preset_mode = entity.attributes.preset_modes[int(value)]
    #      entity.call_service("set_preset_mode", preset_mode=preset_mode)
    #
    #  if button_type == "mode-swing_modes":
    #      entity = apis.ha_api.get_entity(entity_id)
    #      swing_mode = entity.attributes.swing_modes[int(value)]
    #      entity.call_service("set_swing_mode", swing_mode=swing_mode)
    #
    #  if button_type == "mode-fan_modes":
    #      entity = apis.ha_api.get_entity(entity_id)
    #      fan_mode = entity.attributes.fan_modes[int(value)]
    #      entity.call_service("set_fan_mode", fan_mode=fan_mode)
    #
    #  if button_type in ["mode-input_select", "mode-select"]:
    #      entity = apis.ha_api.get_entity(entity_id)
    #      option = entity.attributes.options[int(value)]
    #      entity.call_service("select_option", option=option)
    #
    #  if button_type == "mode-light":
    #      if entity_id.startswith('uuid'):
    #          entity_config = self._config._config_entites_table.get(
    #              entity_id)
    #          entity_id = entity_config.entityId
    #      entity = apis.ha_api.get_entity(entity_id)
    #      options_list = entity_config.entity_input_config.get("effectList")
    #      if options_list is not None:
    #          option = options_list[int(value)]
    #      else:
    #          option = entity.attributes.effect_list[int(value)]
    #      entity.call_service("turn_on", effect=option)
    #
    #  if button_type == "mode-media_player":
    #      entity = apis.ha_api.get_entity(entity_id)
    #      option = entity.attributes.source_list[int(value)]
    #      entity.call_service("select_source", source=option)
    #
    #  # timer detail page
    #  if button_type == "timer-start":
    #      if value is not None:
    #          apis.ha_api.get_entity(entity_id).call_service(
    #              "start", duration=value)
    #      else:
    #          apis.ha_api.get_entity(entity_id).call_service("start")

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
            libs.home_assistant.call_service(
                entity_name=entity_id,
                domain=etype,
                service=service,
                service_data={}
            )
        case _:
            logging.error(
                "Control action on_off not implemented for %s", entity_id)