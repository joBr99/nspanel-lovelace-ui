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
        mqtt_server = settings["mqtt_server"]
        mqtt_port = int(settings["mqtt_port"])
        logging.info("Connecting to %s:%i as %s",
                     mqtt_server, mqtt_port, mqtt_client_name)
        while True:
            try:
                self.client.connect(mqtt_server, mqtt_port, 5)
                break  # Connection call did not raise exception, connection is sucessfull
            except Exception:  # pylint: disable=broad-exception-caught
                logging.exception(
                    "Failed to connect to MQTT %s:%i. Will try again in 10 seconds.",
                    mqtt_server,
                    mqtt_port,
                )
                time.sleep(10.)
        self.client.loop_start()
        process_thread = threading.Thread(target=self.process_in_queue, args=(self.client, self.msg_in_queue))
        process_thread.daemon = True
        process_thread.start()

    def on_mqtt_connect(self, client, userdata, flags, rc):
        if rc != 0:
            logging.error("MQTT connection failed with return code: %s", rc)
            return
        logging.info("Connected to MQTT Server")
        # subscribe to panelRecvTopic of each panel
        for settings_panel in self.settings["nspanels"].values():
            topic = settings_panel["panelRecvTopic"]
            result, _ = client.subscribe(topic)
            if result == mqtt.MQTT_ERR_SUCCESS:
                logging.debug("Subscribed to panel topic: %s", topic)
            else:
                logging.error("Failed to subscribe to panel topic '%s' (result=%s)", topic, result)

    def on_mqtt_message(self, client, userdata, msg):
        try:
            payload_text = msg.payload.decode('utf-8')
            if payload_text == "":
                logging.debug("Ignoring empty MQTT payload on topic: %s", msg.topic)
                return
            if msg.topic in self.msg_out_queue_list.keys():
                data = json.loads(payload_text)
                if "CustomRecv" in data:
                    queue = self.msg_out_queue_list[msg.topic]
                    queue.put(("MQTT:", data["CustomRecv"]))
                else:
                    logging.debug("JSON payload on topic '%s' has no 'CustomRecv' key", msg.topic)
            else:
                logging.debug("Received unhandled message on topic: %s", msg.topic)
        except UnicodeDecodeError:
            logging.exception("Failed to decode MQTT payload as UTF-8 on topic: %s", msg.topic)
        except json.JSONDecodeError:
            logging.exception("Failed to parse MQTT JSON payload on topic: %s", msg.topic)
        except Exception:  # pylint: disable=broad-exception-caught
            logging.exception("Unexpected error while processing MQTT message on topic: %s", msg.topic)
            try:
                logging.error(msg.payload.decode('utf-8'))
            except Exception:  # pylint: disable=broad-exception-caught
                logging.error(
                    "Something went wrong when processing the exception message, couldn't decode payload to utf-8.")

    def process_in_queue(self, client, msg_in_queue):
        while True:
            try:
                msg = msg_in_queue.get()
                result = client.publish(msg[0], msg[1])
                if result.rc != mqtt.MQTT_ERR_SUCCESS:
                    logging.error("Failed publishing message to topic '%s' (rc=%s)", msg[0], result.rc)
            except Exception:  # pylint: disable=broad-exception-caught
                logging.exception("Failed processing outgoing MQTT queue message")
