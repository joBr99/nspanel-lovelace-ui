from dateutil import tz
import datetime
import threading
import logging
import libs.panel_cmd
from scheduler import Scheduler
import scheduler.trigger as trigger
import time
import babel.dates
from ha_cards import Screensaver, EntitiesCard, card_factory
import ha_control

class LovelaceUIPanel:

    def __init__(self, mqtt_client_from_manager, name_panel, settings_panel):
        self.mqtt_client = mqtt_client_from_manager
        self.name = name_panel
        self.settings = settings_panel
        self.sendTopic = self.settings["panelSendTopic"]
        self.recvTopic = self.settings["panelRecvTopic"]
        self.model = self.settings.get("model", "eu")


        self.current_card = None
        self.privious_cards = []
        self.cards = {}
        self.hidden_cards = {}
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
            minute=0, second=0), self.update_time)
        schedule_thread = threading.Thread(target=self.schedule_thread_target)
        schedule_thread.daemon = True
        schedule_thread.start()

    def schedule_thread_target(self):
        while True:
            self.schedule.exec_jobs()
            time.sleep(1)

    def update_time(self):
        use_timezone = tz.gettz(self.settings["timeZone"])
        time_string = datetime.datetime.now(
            use_timezone).strftime(self.settings["timeFormat"])
        libs.panel_cmd.send_time(self.sendTopic, time_string)

    def update_date(self):
        dateformat = self.settings["dateFormat"]
        date_string = babel.dates.format_date(
            datetime.datetime.now(), dateformat, locale=self.settings["locale"])
        libs.panel_cmd.send_date(self.sendTopic, date_string)

    def searchCard(self, iid):
        if iid in self.navigate_keys:
            iid = self.navigate_keys[iid]
        if iid in self.cards:
            return self.cards[iid]
        if iid in self.hidden_cards:
            return self.hidden_cards[iid]

    def ha_event_callback(self, entity_id):
        #logging.debug(f"{entity_id} updated/state changed")
        if entity_id in self.current_card.get_entities():
            self.render_current_page()

        involved_entities = ha_control.calculate_dim_values(
            self.settings.get("sleepTracking"),
            self.settings.get("sleepTrackingZones", ["not_home", "off"]),
            self.settings.get("sleepBrightness"),
            self.settings.get("screenBrightness"),
            self.settings.get("sleepOverride"),
            return_involved_entities=True
        )
        if entity_id in involved_entities:
            dimmode()


    def render_current_page(self, switchPages=False):
        if switchPages:
            libs.panel_cmd.page_type(self.sendTopic, self.current_card.type)

        if self.current_card.type in ["screensaver", "screensaver2"]:
            libs.panel_cmd.weatherUpdate(self.sendTopic, self.current_card.render())
        else:
            libs.panel_cmd.entityUpd(self.sendTopic, self.current_card.render())
        # send sleepTimeout
        sleepTimeout = self.settings.get("sleepTimeout", 20)
        if self.current_card.config.get("sleepTimeout"):
            sleepTimeout = self.current_card.config.get("sleepTimeout")
        libs.panel_cmd.timeout(self.sendTopic, sleepTimeout)
        dimmode()

    def dimmode():
        # send dimmode
        dimValue, dimValueNormal = ha_control.calculate_dim_values(
            self.settings.get("sleepTracking"),
            self.settings.get("sleepTrackingZones", ["not_home", "off"]),
            self.settings.get("sleepBrightness"),
            self.settings.get("screenBrightness"),
            self.settings.get("sleepOverride"),
        )

        backgroundColor = self.settings.get("defaultBackgroundColor", "ha-dark")
        if backgroundColor == "ha-dark":
            backgroundColor = 6371
        elif backgroundColor == "black":
            backgroundColor = 0
        fontColor = ""
        featExperimentalSliders = self.settings.get("featExperimentalSliders", 0)
        libs.panel_cmddimmode(self.sendTopic, dimValue, dimValueNormal, backgroundColor, fontColor, featExperimentalSliders)


    def customrecv_event_callback(self, msg):
        logging.debug("Recv Message from NsPanel: %s", msg)
        msg = msg.split(",")
        # run action based on received command
        if msg[0] == "event":
            if msg[1] == "startup":
                # TODO: Handle Update Messages
                self.update_date()
                self.update_time()

                # check if ha state cache is already populated
                ha_control.wait_for_ha_cache()

                self.current_card = Screensaver(self.settings["locale"], self.settings["screensaver"], self)
                self.render_current_page(switchPages=True)
            if msg[1] == "sleepReached":
                self.privious_cards.append(self.current_card)
                self.current_card = Screensaver(self.settings["locale"], self.settings["screensaver"], self)
                self.render_current_page(switchPages=True)
            if msg[1] == "buttonPress2":
                entity_id = msg[2]
                btype = msg[3]
                value = msg[4] if len(msg) > 4 else None
                if btype == "bExit":
                    if entity_id=="screensaver" and self.settings.get("screensaver").get("doubleTapToUnlock") and value == "1":
                        return

                    # in case privious_cards is empty add a default card
                    if len(self.privious_cards) == 0:
                        self.privious_cards.append(
                            list(self.cards.values())[0]) # TODO: Impelement default card config
                    self.current_card = self.privious_cards.pop()
                    self.render_current_page(switchPages=True)
                    return

                # replace iid with real entity id
                if entity_id.startswith("iid."):
                    iid = entity_id.split(".")[1]
                    if iid in self.entity_iids:
                        entity_id = self.entity_iids[iid]

                match btype:
                    case 'button':
                        match entity_id.split(".")[0]:
                            # handle internal stuff
                            case 'navigate':
                                iid = entity_id.split(".")[1]
                                self.privious_cards.append(self.current_card)
                                self.current_card = self.searchCard(iid)
                                self.render_current_page(switchPages=True)

                            # send ha stuff to ha
                            case _:
                                ha_control.handle_buttons(entity_id, btype, value)
                    case _:
                        ha_control.handle_buttons(entity_id, btype, value)

            if msg[1] == "pageOpenDetail":
                print("pageOpenDetail")
