import websocket
import ssl
import logging
import json
from threading import Thread
import time
import environ

home_assistant_url = ""
home_assistant_token = ""
settings = {}
auth_ok = False
next_id = 0
request_all_states_id = 0
ws_connected = False
home_assistant_entity_state_cache = {}

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
    global auth_ok, request_all_states_id, home_assistant_entity_state_cache
    json_msg = json.loads(message)
    if json_msg["type"] == "auth_required":
        authenticate_client()
    elif json_msg["type"] == "auth_ok":
        auth_ok = True
        logging.info("Home Assistant auth OK. Requesting existing states.")
        subscribe_to_events()
        _get_all_states()
        if ON_CONNECT_HANDLER is not None:
            ON_CONNECT_HANDLER()
    elif json_msg["type"] == "event" and json_msg["event"]["event_type"] == "state_changed":
        entity_id = json_msg["event"]["data"]["entity_id"]
        home_assistant_entity_state_cache[entity_id] = json_msg["event"]["data"]["new_state"]
        send_entity_update(entity_id)
    elif json_msg["type"] == "result" and not json_msg["success"]:
        logging.error("Failed result: ")
        logging.error(json_msg)
    elif json_msg["type"] == "result" and json_msg["success"]:
        if json_msg["id"] == request_all_states_id:
            for entity in json_msg["result"]:
                # logging.debug(f"test {entity['entity_id']}")
                home_assistant_entity_state_cache[entity["entity_id"]] = entity
            # logging.debug(f"request_all_states_id {json_msg['result']}")
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
    logging.error("WebSocket connection closed!")
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
        ws.close()
        time.sleep(1)
        ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
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


def _get_all_states():
    global next_id, request_all_states_id
    msg = {
        "id": next_id,
        "type": "get_states",
    }
    request_all_states_id = next_id
    send_message(json.dumps(msg))

# Got new value from Home Assistant, publish to MQTT


def send_entity_update(entity_id):
    global on_ha_update
    on_ha_update(entity_id)

def set_entity_brightness(home_assistant_name: str, light_level: int, color_temp: int) -> bool:
    """Set entity brightness"""
    global next_id
    try:
        # Format Home Assistant state update
        msg = None
        if home_assistant_name.startswith("light."):
            msg = {
                "id": next_id,
                "type": "call_service",
                "domain": "light",
                "service": "turn_on",
                "service_data": {
                    "brightness_pct": light_level,
                },
                "target": {
                    "entity_id": home_assistant_name
                }
            }
            if color_temp > 0:
                msg["service_data"]["kelvin"] = color_temp
        elif home_assistant_name.startswith("switch."):
            msg = {
                "id": next_id,
                "type": "call_service",
                "domain": "switch",
                "service": "turn_on" if light_level > 0 else "turn_off",
                "target": {
                    "entity_id": home_assistant_name
                }
            }

        if msg:
            send_message(json.dumps(msg))
            return True
        else:
            logging.error(F"{home_assistant_name} is now a recognized domain.")
            return False
    except:
        logging.exception("Failed to send entity update to Home Assisatant.")
        return False


def set_entity_color_temp(entity_name: str, color_temp: int) -> bool:
    """Set entity brightness"""
    global next_id
    try:
        # Format Home Assistant state update
        msg = {
            "id": next_id,
            "type": "call_service",
            "domain": "light",
            "service": "turn_on",
            "service_data": {
                "kelvin": color_temp
            },
            "target": {
                "entity_id": entity_name
            }
        }
        send_message(json.dumps(msg))
        return True
    except:
        logging.exception("Failed to send entity update to Home Assisatant.")
        return False


def set_entity_color_saturation(entity_name: str, light_level: int, color_saturation: int, color_hue: int) -> bool:
    """Set entity brightness"""
    global next_id
    try:
        # Format Home Assistant state update
        msg = {
            "id": next_id,
            "type": "call_service",
            "domain": "light",
            "service": "turn_on",
            "service_data": {
                "hs_color": [
                    color_hue,
                    color_saturation
                ],
                "brightness_pct": light_level
            },
            "target": {
                "entity_id": entity_name
            }
        }
        send_message(json.dumps(msg))
        return True
    except Exception as e:
        logging.exception("Failed to send entity update to Home Assisatant.")
        return False


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
            }
        }
        send_message(json.dumps(msg))
        return True
    except Exception as e:
        logging.exception("Failed to send entity update to Home Assisatant.")
        return False


def get_entity_data(entity_id: str):
    if entity_id in home_assistant_entity_state_cache:
        return home_assistant_entity_state_cache[entity_id]
    else:
        return None


def send_message(message):
    global ws, next_id
    next_id += 1
    ws.send(message)
