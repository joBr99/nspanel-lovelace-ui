import websocket
import ssl
import logging
import json
from threading import Thread
import time
import os

home_assistant_url = ""
home_assistant_token = ""
settings = {}
auth_ok = False
next_id = 0
request_all_states_id = 0
ws_connected = False
home_assistant_entity_state_cache = {}
template_cache = {}
response_buffer = {}
nspanel_event_handler = None


ON_CONNECT_HANDLER = None
ON_DISCONNECT_HANDLER = None


def init(settings_from_manager, on_ha_update_from_manager):
    global home_assistant_url, home_assistant_token, settings, on_ha_update
    settings = settings_from_manager
    on_ha_update = on_ha_update_from_manager
    home_assistant_url = settings["home_assistant_address"]
    home_assistant_token = settings["home_assistant_token"]
    # Disable logging from underlying "websocket"
    logging.getLogger("websocket").propagate = False
    # Disable logging from underlying "websocket"
    logging.getLogger("websockets").propagate = False


def register_on_connect_handler(handler):
    global ON_CONNECT_HANDLER
    ON_CONNECT_HANDLER = handler


def register_on_disconnect_handler(handler):
    global ON_DISCONNECT_HANDLER
    ON_DISCONNECT_HANDLER = handler


def on_message(ws, message):
    global auth_ok, request_all_states_id, home_assistant_entity_state_cache, response_buffer, template_cache
    try:
        json_msg = json.loads(message)
    except json.JSONDecodeError:
        logging.exception("Failed to parse Home Assistant websocket message as JSON")
        return

    message_type = json_msg.get("type")
    if message_type == "auth_required":
        authenticate_client()
    elif message_type == "auth_ok":
        auth_ok = True
        logging.info("Home Assistant auth OK. Requesting existing states.")
        subscribe_to_events()
        _get_all_states()
        if ON_CONNECT_HANDLER is not None:
            ON_CONNECT_HANDLER()
    # for templates
    elif message_type == "event" and json_msg.get("id") in response_buffer:
        event = json_msg.get("event", {})
        listeners = event.get("listeners", {})
        template_cache[response_buffer[json_msg["id"]]] = {
            "result": event.get("result"),
            "listener-entities": listeners.get("entities", [])
        }
    elif message_type == "event" and json_msg.get("event", {}).get("event_type") == "state_changed":
        event_data = json_msg.get("event", {}).get("data", {})
        entity_id = event_data.get("entity_id")
        if not entity_id:
            logging.debug("Received state_changed event without entity_id")
            return
        home_assistant_entity_state_cache[entity_id] = event_data.get("new_state")
        send_entity_update(entity_id)
        # rerender template
        for template, template_cache_entry in template_cache.items():
            if entity_id in template_cache_entry.get("listener-entities", []):
                cache_template(template)
    elif message_type == "event" and json_msg.get("event", {}).get("event_type") == "esphome.nspanel.data":
        event_data = json_msg.get("event", {}).get("data", {})
        device_id = event_data.get("device_id")
        custom_recv = event_data.get("CustomRecv")
        if nspanel_event_handler is None:
            logging.debug("No NsPanel event handler registered; dropping event for device '%s'", device_id)
            return
        nspanel_event_handler(device_id, custom_recv)
    elif message_type == "result" and not json_msg.get("success"):
        logging.error("Home Assistant request failed: %s", json_msg)
    elif message_type == "result" and json_msg.get("success"):
        if json_msg.get("id") == request_all_states_id:
            for entity in json_msg.get("result", []):
                home_assistant_entity_state_cache[entity["entity_id"]] = entity
        else:
            if json_msg.get("id") in response_buffer and json_msg.get("result"):
                response_buffer[json_msg["id"]] = json_msg["result"]
        return None  # Ignore success result messages
    else:
        logging.debug(message)


def _ws_connection_open(ws):
    global ws_connected
    ws_connected = True
    logging.info("WebSocket connection to Home Assistant opened.")
    if ON_CONNECT_HANDLER is not None:
        ON_CONNECT_HANDLER()


def _ws_connection_close(ws, close_status_code, close_msg):
    global ws_connected
    ws_connected = False
    logging.error(
        "WebSocket connection closed (status=%s, message=%s)",
        close_status_code,
        close_msg,
    )
    if ON_DISCONNECT_HANDLER is not None:
        ON_DISCONNECT_HANDLER()


def connect():
    Thread(target=_do_connection, daemon=True).start()


def _do_connection():
    global home_assistant_url, ws, settings
    ws_url = home_assistant_url.replace(
        "https://", "wss://").replace("http://", "ws://")
    if settings["is_addon"]:
        ws_url += "/core/websocket"
    else:
        ws_url += "/api/websocket"
    ws = websocket.WebSocketApp(F"{ws_url}", on_message=on_message,
                                on_open=_ws_connection_open, on_close=_ws_connection_close)
    while True:
        logging.info(F"Connecting to Home Assistant at {ws_url}")
        try:
            ws.close()
            time.sleep(1)
            ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
        except Exception:
            logging.exception("WebSocket connection loop failed")
        time.sleep(10)


def authenticate_client():
    global home_assistant_token
    logging.info("Sending auth to Home Assistant")
    msg = {
        "type": "auth",
        "access_token": home_assistant_token
    }
    send_message(json.dumps(msg))


def subscribe_to_events():
    global next_id
    msg = {
        "id": next_id,
        "type": "subscribe_events",
        "event_type": "state_changed"
    }
    send_message(json.dumps(msg))

def subscribe_to_nspanel_events(nsp_callback):
    global next_id, nspanel_event_handler
    nspanel_event_handler = nsp_callback
    msg = {
        "id": next_id,
        "type": "subscribe_events",
        "event_type": "esphome.nspanel.data"
    }
    send_message(json.dumps(msg))

def _get_all_states():
    global next_id, request_all_states_id
    msg = {
        "id": next_id,
        "type": "get_states",
    }
    request_all_states_id = next_id
    send_message(json.dumps(msg))

# Got new value from Home Assistant, send update to callback method
def send_entity_update(entity_id):
    global on_ha_update
    on_ha_update(entity_id)

def nspanel_data_callback(device_id, msg):
    if nspanel_event_handler is None:
        logging.debug("NsPanel callback invoked before handler was registered")
        return
    nspanel_event_handler(device_id, msg)

def call_service(entity_name: str, domain: str, service: str, service_data: dict) -> bool:
    global next_id
    try:
        msg = {
            "id": next_id,
            "type": "call_service",
            "domain": domain,
            "service": service,
            "service_data": service_data,
            "target": {
                "entity_id": entity_name
            },
        }
        send_message(json.dumps(msg))
        return True
    except Exception:
        logging.exception(
            "Failed to call Home Assistant service: %s.%s for %s",
            domain, service, entity_name
        )
        return False

def send_msg_to_panel(service: str, service_data: dict) -> bool:
    global next_id
    try:
        msg = {
            "id": next_id,
            "type": "call_service",
            "domain": "esphome",
            "service": service,
            "service_data": service_data,
        }
        send_message(json.dumps(msg))
        return True
    except Exception:
        logging.exception("Failed to call Home Assistant panel service: %s", service)
        return False

def execute_script(entity_name: str, domain: str, service: str, service_data: dict) -> str:
    global next_id, response_buffer
    try:
        call_id = next_id
        # request answer for this call
        response_buffer[call_id] = True
        msg = {
            "id": call_id,
            "type": "execute_script",
            "sequence": [
               {
                   "service": f"{domain}.{service}",
                   "data": service_data,
                   "target": {
                       "entity_id": [entity_name]
                    },
                   "response_variable": "service_result"
                },
               {
                   "stop": "done",
                   "response_variable": "service_result"
                }
            ]
        }
        send_message(json.dumps(msg))
        # busy waiting for response with a timeout of 0.4 seconds- maybe there's a better way of doing this
        mustend = time.time() + 0.4
        while time.time() < mustend:
            if response_buffer[call_id] == True:
                #print(f'loooooooooop {time.time()}')
                time.sleep(0.0001)
            else:
                return response_buffer[call_id]["response"]
        raise TimeoutError("Did not recive respose in time to HA script call")
    except Exception:
        logging.exception("Failed to call Home Assistant script: %s.%s", domain, service)
        return {}

def cache_template(template):
    if not template:
        raise ValueError("Invalid template")
    global next_id, response_buffer
    try:
        call_id = next_id
        response_buffer[call_id] = template
        msg = {
            "id": call_id,
            "type": "render_template",
            "template": template
        }
        send_message(json.dumps(msg))
        return True
    except Exception:
        logging.exception("Failed to render template.")
        return False

def get_template(template):
    global template_cache
    if template in template_cache:
        return template_cache[template].get("result")
    else:
        mustend = time.time() + 0.5
        while time.time() < mustend:
            if template not in template_cache:
                time.sleep(0.0001)
            else:
                return template_cache.get(template, []).get("result", "404")

def get_template_listener_entities(template):
    global template_cache
    if template in template_cache:
        return template_cache[template].get("listener-entities")
    else:
        mustend = time.time() + 0.5
        while time.time() < mustend:
            if template not in template_cache:
                time.sleep(0.0001)
            else:
                return template_cache.get(template, []).get("listener-entities", "404")

def get_entity_data(entity_id: str):
    if entity_id in home_assistant_entity_state_cache:
        return home_assistant_entity_state_cache[entity_id]
    else:
        return None
def is_existent(entity_id: str):
    if entity_id in home_assistant_entity_state_cache:
        return True
    else:
        return False


def send_message(message):
    global ws, next_id
    try:
        next_id += 1
        ws.send(message)
    except NameError:
        logging.error("WebSocket client is not initialized; dropping outgoing message")
    except Exception:
        logging.exception("Failed sending websocket message to Home Assistant")
