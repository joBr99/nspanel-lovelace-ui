from uuid import getnode as get_mac
import paho.mqtt.client as mqtt
import logging
import time
import json
import threading


class MqttManager:
    def __init__(self, settings, msg_in_queue, msg_out_queue_list):
        mqtt_client_name = "NSPanelLovelaceManager_" + str(get_mac())
        self.client = mqtt.Client(mqtt_client_name)
        self.msg_in_queue = msg_in_queue
        self.msg_out_queue_list = msg_out_queue_list
        self.settings = settings

        self.client.on_connect = self.on_mqtt_connect
        self.client.on_message = self.on_mqtt_message
        self.client.username_pw_set(
            settings["mqtt_username"], settings["mqtt_password"])
        # Wait for connection
        connection_return_code = 0
        mqtt_server = settings["mqtt_server"]
        mqtt_port = int(settings["mqtt_port"])
        logging.info("Connecting to %s:%i as %s",
                     mqtt_server, mqtt_port, mqtt_client_name)
        while True:
            try:
                self.client.connect(mqtt_server, mqtt_port, 5)
                break  # Connection call did not raise exception, connection is sucessfull
            except:  # pylint: disable=bare-except
                logging.exception(
                    "Failed to connect to MQTT %s:%i. Will try again in 10 seconds. Code: %s", mqtt_server, mqtt_port, connection_return_code)
                time.sleep(10.)
        self.client.loop_start()
        process_thread = threading.Thread(target=self.process_in_queue, args=(self.client, self.msg_in_queue))
        process_thread.daemon = True
        process_thread.start()

    def on_mqtt_connect(self, client, userdata, flags, rc):
        logging.info("Connected to MQTT Server")
        # subscribe to panelRecvTopic of each panel
        for settings_panel in self.settings["nspanels"].values():
            client.subscribe(settings_panel["panelRecvTopic"])

    def on_mqtt_message(self, client, userdata, msg):
        try:
            if msg.payload.decode() == "":
                return
            if msg.topic in self.msg_out_queue_list.keys():
                data = json.loads(msg.payload.decode('utf-8'))
                if "CustomRecv" in data:
                    queue = self.msg_out_queue_list[msg.topic]
                    queue.put(("MQTT:", data["CustomRecv"]))
            else:
                logging.debug("Received unhandled message on topic: %s", msg.topic)
        except Exception:  # pylint: disable=broad-exception-caught
            logging.exception("Something went wrong during processing of message:")
            try:
                logging.error(msg.payload.decode('utf-8'))
            except:  # pylint: disable=bare-except
                logging.error(
                    "Something went wrong when processing the exception message, couldn't decode payload to utf-8.")

    def process_in_queue(self, client, msg_in_queue):
        while True:
            msg = msg_in_queue.get()
            client.publish(msg[0], msg[1])