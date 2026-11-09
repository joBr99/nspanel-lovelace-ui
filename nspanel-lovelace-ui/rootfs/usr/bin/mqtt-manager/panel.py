from dateutil import tz
import datetime
import threading
import logging
import libs.panel_cmd
from scheduler import Scheduler
import scheduler.trigger as trigger
import time
import babel.dates
from ha_cards import Screensaver, card_factory, detail_open
import ha_control
from firmware import FirmwareUpdater

class LovelaceUIPanel:

    def __init__(self, name_panel, settings_panel, msg_out_queue, use_ha_api=False):
        self.updater = FirmwareUpdater(settings_panel, msg_out_queue, use_ha_api)
        self._last_dim_command = None
        self._active_detail = None
        self._last_detail_payload = None
        self.name = name_panel
        self.settings = settings_panel
        self.msg_out_queue = msg_out_queue
        self.sendTopic = self.settings["panelSendTopic"]
        self.recvTopic = self.settings["panelRecvTopic"]
        self.model = self.settings.get("model", "eu")

        self.temp_unit = self.settings.get("temp_unit", "celsius")

        self.current_card = None
        self.privious_cards = []
        self.cards = {}
        self.hidden_cards = {}
        self.screensaver = None
        self.navigate_keys = {}
        self.entity_iids = {}

        # generate cards for input settings
        for c in self.settings.get("cards"):
            iid, card = card_factory(self.settings["locale"], c, self)
             # Check if we acually got a card
            if card:
                self.cards[iid] = card
                # collect nav keys of cards
                if card.navigate_key:
                    self.navigate_keys[card.navigate_key] = iid
                # collect iids of entities
                for e in card.get_iid_entities():
                    self.entity_iids[e[0]] = e[1]

        # setup prev and next iids
        top_level_cards = list(self.cards.values())
        card_iids = [card.iid for card in top_level_cards]
        prev_iids = card_iids[-1:] + card_iids[:-1]
        next_iids = card_iids[1:] + card_iids[: 1]
        if len(card_iids) > 1:
            for prev_iids, card, next_iids in zip(prev_iids, top_level_cards, next_iids):
                (card.iid_prev, card.iid_next) = (prev_iids, next_iids)

        # generate cards for input settings
        for c in self.settings.get("hiddenCards", []):
            iid, card = card_factory(self.settings["locale"], c, self)
            card.hidden = True
            self.hidden_cards[iid] = card
            # collect nav keys of cards
            if card.navigate_key:
                self.navigate_keys[card.navigate_key] = iid
            # collect iids of entities
            for e in card.get_iid_entities():
                self.entity_iids[e[0]] = e[1]

        self.schedule = Scheduler()
        self.schedule.minutely(datetime.time(second=0), self.update_time)
        self.schedule.hourly(datetime.time(
            minute=0, second=0), self.update_date)
        schedule_thread = threading.Thread(target=self.schedule_thread_target)
        schedule_thread.daemon = True
        schedule_thread.start()

        # check if ha state cache is already populated
        ha_control.wait_for_ha_cache()

        #request templates on cards
        if isinstance(self.settings.get("sleepBrightness",""), str) and self.settings.get("sleepBrightness", "").startswith("ha:"):
            libs.home_assistant.cache_template(self.settings.get("sleepBrightness"))
        if isinstance(self.settings.get("screenBrightness",""), str) and self.settings.get("screenBrightness", "").startswith("ha:"):
            libs.home_assistant.cache_template(self.settings.get("screenBrightness"))
        # Subscribe now so the first time/date message already carries the text.
        for key in ("timeAdditionalTemplate", "dateAdditionalTemplate"):
            self.additional_text(key)
        for c in self.cards.values():
            if hasattr(c, "qrcode"):
                if c.qrcode.startswith("ha:"):
                    libs.home_assistant.cache_template(c.qrcode)
            for e in c.entities:
                e.prerender()
        for c in self.hidden_cards.values():
            if hasattr(c, "qrcode"):
                if c.qrcode.startswith("ha:"):
                    libs.home_assistant.cache_template(c.qrcode)
            for e in c.entities:
                e.prerender()
        self.screensaver = Screensaver(self.settings["locale"], self.settings["screensaver"], self)
        if self.screensaver.statusIcon1:
            self.screensaver.statusIcon1.prerender()
        if self.screensaver.statusIcon2:
            self.screensaver.statusIcon2.prerender()
        for e in self.screensaver.entities:
            e.prerender()

        libs.panel_cmd.page_type(self.msg_out_queue, self.sendTopic, "pageStartup")


    def schedule_thread_target(self):
        while True:
            try:
                self.schedule.exec_jobs()
                if any(isinstance(self.settings.get(key), list) for key in ("sleepBrightness", "screenBrightness")):
                    self.dimmode(only_if_changed=True)
            except Exception:
                logging.exception("Scheduler execution failed for panel '%s'", self.name)
            time.sleep(1)

    def additional_text(self, key):
        # AppDaemon treats these settings as templates, so the "ha:" prefix is optional.
        # The setting name is the update target: ha_event_callback resends time/date on change.
        template = self.settings.get(key)
        if not isinstance(template, str) or not template:
            return ""
        result = libs.home_assistant.get_template(template, key)
        return "" if result is None else str(result)

    def update_time(self):
        use_timezone = tz.gettz(self.settings["timeZone"])
        time_string = datetime.datetime.now(
            use_timezone).strftime(self.settings["timeFormat"])
        libs.panel_cmd.send_time(self.msg_out_queue, self.sendTopic, time_string,
                                 self.additional_text("timeAdditionalTemplate"))

    def update_date(self):
        dateformat = self.settings["dateFormat"]
        date_string = babel.dates.format_date(
            datetime.datetime.now(tz.gettz(self.settings["timeZone"])), dateformat, locale=self.settings["locale"])
        # Like AppDaemon, the extra text follows the date directly (use dateFormat: '' for text only).
        libs.panel_cmd.send_date(self.msg_out_queue, self.sendTopic,
                                 date_string + self.additional_text("dateAdditionalTemplate"))

    def searchCard(self, iid):
        if iid in self.navigate_keys:
            iid = self.navigate_keys[iid]
        if iid in self.cards:
            return self.cards[iid]
        if iid in self.hidden_cards:
            return self.hidden_cards[iid]

    def ha_event_callback(self, entity_id):
        if self.updater.active:
            return
        if entity_id == "timeAdditionalTemplate":
            return self.update_time()
        if entity_id == "dateAdditionalTemplate":
            return self.update_date()
        active_detail = getattr(self, "_active_detail", None)
        if active_detail:
            if entity_id == active_detail[1]:
                self._render_detail()
        elif self.current_card and entity_id in self.current_card.get_entities():
            self.render_current_page(requested=True)

        involved_entities = ha_control.calculate_dim_values(
            self.settings.get("sleepTracking"),
            self.settings.get("sleepTrackingZones", ["not_home", "off"]),
            self.settings.get("sleepBrightness"),
            self.settings.get("screenBrightness"),
            self.settings.get("sleepOverride"),
            timezone=self.settings.get("timeZone", "Europe/Berlin"),
            return_involved_entities=True
        )
        if entity_id in involved_entities:
            self.dimmode()


    def _render_detail(self, force=False):
        detail_type, entity_id, panel_id, options = self._active_detail
        payload = detail_open(self.settings["locale"], detail_type, entity_id, panel_id,
                              self.msg_out_queue, sendTopic=self.sendTopic, options_list=options)
        if payload is None:
            return
        if force or payload != self._last_detail_payload:
            command = libs.panel_cmd.entityUpdateDetail2 if detail_type == "popupInSel" else libs.panel_cmd.entityUpdateDetail
            command(self.msg_out_queue, self.sendTopic, payload)
            self._last_detail_payload = payload

    def render_current_page(self, switchPages=False, requested=False, force=False):
        if self.updater.active:
            return
        if not self.current_card:
            return
        if switchPages or force:
            self._active_detail = None
            self._last_detail_payload = None
        if (switchPages or force) and self.current_card is self.screensaver:
            self.screensaver.invalidate()
        if switchPages:
            libs.panel_cmd.page_type(self.msg_out_queue, self.sendTopic, self.current_card.type)
        if requested:
            self.current_card.render()

    def dimmode(self, only_if_changed=False):
        if self.updater.active:
            return
        # send dimmode
        dimValue, dimValueNormal = ha_control.calculate_dim_values(
            self.settings.get("sleepTracking"),
            self.settings.get("sleepTrackingZones", ["not_home", "off"]),
            self.settings.get("sleepBrightness"),
            self.settings.get("screenBrightness"),
            self.settings.get("sleepOverride"),
            timezone=self.settings.get("timeZone", "Europe/Berlin"),
        )

        backgroundColor = self.settings.get("defaultBackgroundColor", "ha-dark")
        if backgroundColor == "ha-dark":
            backgroundColor = 6371
        elif backgroundColor == "black":
            backgroundColor = 0
        fontColor = ""
        featExperimentalSliders = self.settings.get("featExperimentalSliders", 0)
        command = (dimValue, dimValueNormal, backgroundColor, fontColor, featExperimentalSliders)
        if not only_if_changed or command != self._last_dim_command:
            libs.panel_cmd.dimmode(self.msg_out_queue, self.sendTopic, *command)
            self._last_dim_command = command

    def get_default_card(self):
        defaultCard = self.settings.get("defaultCard")
        if defaultCard and "." in defaultCard:
            card = self.searchCard(defaultCard.split(".")[1])
            if card:
                return card
        return list(self.cards.values())[0]

    def customrecv_event_callback(self, msg):
        logging.debug("Recv Message from NsPanel (%s): %s", self.name, msg)
        msg = msg.split(",")
        if len(msg) < 2:
            logging.error("Malformed panel message on '%s': %s", self.name, msg)
            return
        if msg[0] == "event" and msg[1] == "startup" and len(msg) >= 4:
            self.current_card = (self.get_default_card() if self.settings.get("screensaver", {}).get("disable", False) else self.screensaver)
            if self.updater.startup(msg):
                return
        if msg[0] == "event" and msg[1] == "buttonPress2":
            result = self.updater.button(msg)
            if result == "resume":
                self.customrecv_event_callback("event,startup")
                return
            if result is not None:
                return
        if self.updater.active:
            return
        # run action based on received command
        if msg[0] == "event":
            if msg[1] == "startup":
                self.update_date()
                self.update_time()

                if self.settings.get("screensaver", {}).get("disable", False):
                    self.current_card = self.get_default_card()
                else:
                    self.current_card = self.screensaver
                self.render_current_page(switchPages=True)

                # send sleepTimeout
                sleepTimeout = self.settings.get("sleepTimeout", 20)
                if self.current_card.config.get("sleepTimeout"):
                    sleepTimeout = self.current_card.config.get("sleepTimeout")
                libs.panel_cmd.timeout(self.msg_out_queue, self.sendTopic, sleepTimeout)
                self.dimmode()

            if msg[1] == "sleepReached":
                self.privious_cards.append(self.current_card)
                self.current_card = self.screensaver
                self.render_current_page(switchPages=True)
            if msg[1] == "renderCurrentPage":
                self.render_current_page(requested=True, force=True)
            if msg[1] == "buttonPress2":
                if len(msg) < 4:
                    logging.error("Malformed buttonPress2 payload on '%s': %s", self.name, msg)
                    return
                entity_id = msg[2]
                if entity_id == "":
                    return
                btype = msg[3]
                value = msg[4] if len(msg) > 4 else None
                entity_config = {}
                action_context = {
                    "panel": self.name,
                    "btype": btype,
                    "value": value,
                }
                if btype == "bExit":
                    if entity_id in ["screensaver", "screensaver2"] and self.settings.get("screensaver").get("doubleTapToUnlock") and value == "1":
                        return

                    # in case privious_cards is empty add a default card
                    if len(self.privious_cards) == 0:
                        self.privious_cards.append(self.get_default_card())

                    if self.settings.get("defaultCard") and entity_id in ["screensaver", "screensaver2"]:
                        logging.debug("Defaulting to card %s", self.settings.get("defaultCard"))
                        self.privious_cards = [self.get_default_card()]

                    self.current_card = self.privious_cards.pop()
                    self.render_current_page(switchPages=True)
                    return

                # replace iid with real entity id
                if entity_id.startswith("iid."):
                    iid = entity_id.split(".")[1]
                    for e in self.current_card.entities:
                        if e.iid == iid:
                            entity_id = e.entity_id
                            entity_config = e.config

                match btype:
                    case 'button':
                        match entity_id.split(".")[0]:
                            # handle internal stuff
                            case 'navigate':
                                card_iid = entity_id.split(".")[1]
                                if card_iid == "UP":
                                    if len(self.privious_cards) == 0:
                                        self.privious_cards.append(self.get_default_card())
                                    self.current_card = self.privious_cards.pop()
                                    self.render_current_page(switchPages=True)
                                else:
                                    self.privious_cards.append(self.current_card)
                                    self.current_card = self.searchCard(card_iid)
                                    self.render_current_page(switchPages=True)
                            # send ha stuff to ha
                            case _:
                                ha_control.handle_buttons(
                                    entity_id,
                                    btype,
                                    value,
                                    entity_config=entity_config,
                                    action_context=action_context,
                                )
                    case 'cardUnlock-unlock':
                        card_iid = entity_id.split(".")[1]
                        if int(self.current_card.config.get("pin")) == int(value):
                            self.privious_cards.append(self.current_card)
                            self.current_card = self.searchCard(card_iid)
                            self.render_current_page(switchPages=True)
                    case 'mode-light':
                        ha_control.handle_buttons(
                            entity_id,
                            btype,
                            value,
                            entity_config=entity_config,
                            action_context=action_context,
                        )
                    case _:
                        ha_control.handle_buttons(
                            entity_id,
                            btype,
                            value,
                            action_context=action_context,
                        )

            if msg[1] == "pageOpenDetail":
                if len(msg) < 4:
                    logging.error("Malformed pageOpenDetail payload on '%s': %s", self.name, msg)
                    return
                entity_id = msg[3]
                effectList = None
                # replace iid with real entity id
                if entity_id.startswith("iid."):
                    iid = entity_id.split(".")[1]
                    for e in self.current_card.entities:
                        if e.iid == iid:
                            entity_id = e.entity_id
                            if entity_id.startswith("light"):
                                effectList = e.config.get("effectList")
                self._active_detail = (msg[2], entity_id, msg[3], effectList)
                self._last_detail_payload = None
                self._render_detail(force=True)
