#!/usr/bin/env python
import logging
import time
import subprocess
import libs.home_assistant
import libs.panel_cmd
import yaml
from panel import LovelaceUIPanel
import os
import threading
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
import signal
import sys
from queue import Queue
from mqtt import MqttManager

logging.getLogger("watchdog").propagate = False

settings = {}
panels = {}
panel_in_queues = {}
panel_out_queue = Queue(maxsize=20)
last_settings_file_mtime = 0
mqtt_connect_time = 0
has_sent_reload_command = False

logging.basicConfig(level=logging.DEBUG)

def on_ha_update(entity_id):
    global panel_in_queues
    # send HA updates to all panels
    for queue in panel_in_queues.values():
        queue.put(("HA:", entity_id))

def connect():
    global settings, panel_out_queue
    if settings["mqtt_server"] != "":
        MqttManager(settings, panel_out_queue, panel_in_queues)
    else:
        logging.info("MQTT values not configured, will not connect.")

    # MQTT Connected, start APIs if configured
    if settings["home_assistant_address"] != "" and settings["home_assistant_token"] != "":
        libs.home_assistant.init(settings, on_ha_update)
        libs.home_assistant.connect()
    else:
        logging.info("Home Assistant values not configured, will not connect.")

def setup_panels():
    global settings, panel_in_queues
    # Create NsPanel object
    for name, settings_panel in settings["nspanels"].items():
        if "timeZone" not in settings_panel:
            settings_panel["timeZone"] = settings.get("timeZone", "Europe/Berlin")
        if "locale" not in settings_panel:
            settings_panel["timezone"] = settings.get("locale", "en_US")
        if "hiddenCards" not in settings_panel:
            settings_panel["hiddenCards"] = settings.get("hiddenCards", [])

        msg_in_queue = Queue(maxsize=20)
        panel_in_queues[settings_panel["panelRecvTopic"]] = msg_in_queue
        panel_thread = threading.Thread(target=panel_thread_target, args=(msg_in_queue, name, settings_panel, panel_out_queue))
        panel_thread.daemon = True
        panel_thread.start()

def panel_thread_target(queue_in, name, settings_panel, queue_out):
    panel = LovelaceUIPanel(name, settings_panel, queue_out)
    while True:
        msg = queue_in.get()
        if msg[0] == "MQTT:":
            panel.customrecv_event_callback(msg[1])
        elif msg[0] == "HA:":
            panel.ha_event_callback(msg[1])

def get_config_file():
    CONFIG_FILE = os.getenv('CONFIG_FILE')
    if not CONFIG_FILE:
        CONFIG_FILE = './panels.yaml'
    return CONFIG_FILE

def get_config(file):
    global settings

    try:
        with open(file, 'r', encoding="utf8") as file:
            settings = yaml.safe_load(file)
    except yaml.YAMLError as exc:
        print ("Error while parsing YAML file:")
        if hasattr(exc, 'problem_mark'):
            if exc.context != None:
                print ('  parser says\n' + str(exc.problem_mark) + '\n  ' +
                    str(exc.problem) + ' ' + str(exc.context) +
                    '\nPlease correct data and retry.')
            else:
                print ('  parser says\n' + str(exc.problem_mark) + '\n  ' +
                    str(exc.problem) + '\nPlease correct data and retry.')
        else:
            print ("Something went wrong while parsing yaml file")
        return False

    if not settings.get("mqtt_username"):
        settings["mqtt_username"] = os.getenv('MQTT_USER')
    if not settings.get("mqtt_password"):
        settings["mqtt_password"] = os.getenv('MQTT_PASS')
    if not settings.get("mqtt_port"):
        settings["mqtt_port"] = os.getenv('MQTT_PORT')
    if not settings.get("mqtt_server"):
        settings["mqtt_server"] = os.getenv('MQTT_SERVER')


    settings["is_addon"] = False

    if not settings.get("home_assistant_token"):
        st = os.getenv('SUPERVISOR_TOKEN')
        if st and "home_assistant_token" not in settings and "home_assistant_address" not in settings:
            settings["home_assistant_token"] = st
            settings["home_assistant_address"] = "http://supervisor"
            settings["is_addon"] = True
    return True

def config_watch():
    class ConfigChangeEventHandler(FileSystemEventHandler):
        def __init__(self, base_paths):
            self.base_paths = base_paths

        def dispatch(self, event):
            for base_path in self.base_paths:
                if event.src_path.endswith(base_path):
                    super(ConfigChangeEventHandler, self).dispatch(event)
                    return

        def on_modified(self, event):
            logging.info('Modification detected. Reloading panels.')
            pid = os.getpid()
            os.kill(pid, signal.SIGTERM)

    logging.info('Watching for changes in config file')
    project_files = []
    project_files.append(get_config_file())
    handler = ConfigChangeEventHandler(project_files)
    observer = Observer()
    observer.schedule(handler, path=os.path.dirname(get_config_file()), recursive=True)
    observer.start()
    while True:
        time.sleep(1)

def signal_handler(signum, frame):
    logging.info(f"Received signal {signum}. Initiating restart...")
    python = sys.executable
    os.execl(python, python, *sys.argv)

if __name__ == '__main__':
    signal.signal(signal.SIGTERM, signal_handler)
    threading.Thread(target=config_watch).start()
    if (get_config(get_config_file())):
        connect()
        setup_panels()
    else:
        while True:
          time.sleep(100)