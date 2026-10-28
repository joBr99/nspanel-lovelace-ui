import websocket
import ssl
import logging
import json
from threading import Thread, RLock, Event
from datetime import datetime
import time
import os

home_assistant_url = ""
home_assistant_token = ""
settings = {}
auth_ok = False
next_id = 0
request_lock = RLock()
known_templates = {}  # canonical expression -> displayed entity IDs
subscribed_templates = {}
forecast_lock = RLock()
forecast_cache = {}
FORECAST_CACHE_SECONDS = 300
FORECAST_RETRY_SECONDS = 30
FORECAST_TIMEOUT_SECONDS = 8
request_all_states_id = 0
request_display_registry_id = None
sensor_display_precision = {}
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
    global auth_ok, next_id, sensor_display_precision
    try:
        reply = json.loads(message)
    except json.JSONDecodeError:
        logging.exception("Failed to parse Home Assistant websocket message as JSON")
        return

    message_type = reply.get("type")
    if message_type == "auth_required":
        authenticate_client()
    elif message_type == "auth_ok":
        with request_lock:
            _cancel_pending()
            next_id = 0
            template_cache.clear()
            subscribed_templates.clear()
            sensor_display_precision = {}
            auth_ok = True
            templates = tuple(known_templates)
        logging.info("Home Assistant auth OK. Requesting existing states.")
        subscribe_to_events()
        _get_all_states()
        send_message({"type": "subscribe_events", "event_type": "entity_registry_updated"})
        if nspanel_event_handler is not None:
            subscribe_to_nspanel_events(nspanel_event_handler)
        for template in templates:
            cache_template(template)
        _get_display_registry()
        if ON_CONNECT_HANDLER is not None:
            ON_CONNECT_HANDLER()
    elif message_type == "event":
        event = reply.get("event", {})
        with request_lock:
            pending = response_buffer.get(reply.get("id"))
            if pending and pending.get("kind") == "template":
                template = pending["template"]
                previous = template_cache.get(template)
                template_cache[template] = {
                    "result": event.get("result"),
                    "listener-entities": (event.get("listeners") or {}).get("entities", []),
                }
                targets = tuple(known_templates.get(template, ())) if previous is None or previous["result"] != event.get("result") else ()
            else:
                targets = ()
        if pending and pending.get("kind") == "template":
            for entity_id in targets:
                send_entity_update(entity_id)
        elif event.get("event_type") == "entity_registry_updated":
            _get_display_registry()
        elif event.get("event_type") == "state_changed":
            data = event.get("data", {})
            entity_id = data.get("entity_id")
            if entity_id:
                home_assistant_entity_state_cache[entity_id] = data.get("new_state")
                send_entity_update(entity_id)
        elif event.get("event_type") == "esphome.nspanel.data":
            data = event.get("data", {})
            nspanel_data_callback(data.get("device_id"), data.get("CustomRecv"))
    elif message_type == "result":
        with request_lock:
            pending = response_buffer.get(reply.get("id"))
            if pending and pending.get("kind") == "template":
                if not reply.get("success"):
                    subscribed_templates.pop(pending["template"], None)
                    response_buffer.pop(reply.get("id"), None)
            else:
                response_buffer.pop(reply.get("id"), None)
            if pending and "event" in pending:
                pending["result"] = reply.get("result")
                pending["error"] = None if reply.get("success") else reply.get("error", "Request failed")
                pending["event"].set()
        if not reply.get("success"):
            logging.error("Home Assistant request failed: %s", reply)
            return
        kind = pending.get("kind") if pending else None
        if kind == "display_registry":
            result = reply.get("result", {})
            if not isinstance(result, dict) or not isinstance(result.get("entities"), list):
                logging.warning("Unexpected Home Assistant display registry response")
                return
            previous = sensor_display_precision
            sensor_display_precision = {
                entry["ei"]: entry["dp"] for entry in result["entities"]
                if isinstance(entry, dict) and isinstance(entry.get("ei"), str)
                and entry["ei"].startswith("sensor.") and type(entry.get("dp")) is int
                and 0 <= entry["dp"] <= 100
            }
            for entity_id in previous.keys() | sensor_display_precision.keys():
                if previous.get(entity_id) != sensor_display_precision.get(entity_id):
                    send_entity_update(entity_id)
        elif kind == "states":
            previous = dict(home_assistant_entity_state_cache)
            home_assistant_entity_state_cache.clear()
            home_assistant_entity_state_cache.update({entity["entity_id"]: entity for entity in reply.get("result", [])})
            for entity_id in previous.keys() | home_assistant_entity_state_cache.keys():
                send_entity_update(entity_id)


def _cancel_pending():
    """Called under request_lock, before a connection's IDs can be reused."""
    for pending in response_buffer.values():
        if "event" in pending:
            pending["error"] = "Home Assistant disconnected"
            pending["event"].set()
    response_buffer.clear()


def _ws_connection_open(ws):
    global ws_connected, auth_ok
    with request_lock:
        ws_connected = True
        auth_ok = False
    logging.info("WebSocket connection to Home Assistant opened.")
    if ON_CONNECT_HANDLER is not None:
        ON_CONNECT_HANDLER()


def _ws_connection_close(ws, close_status_code, close_msg):
    global ws_connected, auth_ok
    with request_lock:
        ws_connected = False
        auth_ok = False
        _cancel_pending()
        subscribed_templates.clear()
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
        "type": "subscribe_events",
        "event_type": "state_changed"
    }
    send_message(json.dumps(msg))

def subscribe_to_nspanel_events(nsp_callback):
    global next_id, nspanel_event_handler
    nspanel_event_handler = nsp_callback
    msg = {
        "type": "subscribe_events",
        "event_type": "esphome.nspanel.data"
    }
    send_message(json.dumps(msg))

def _get_all_states():
    global next_id, request_all_states_id
    msg = {
        "type": "get_states",
    }
    request_all_states_id = send_message(msg, pending={"kind": "states"})

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
            "type": "call_service",
            "domain": domain,
            "service": service,
            "service_data": service_data,
            "target": {
                "entity_id": entity_name
            },
        }
        return send_message(msg) is not None
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
            "type": "call_service",
            "domain": "esphome",
            "service": service,
            "service_data": service_data,
        }
        return send_message(msg) is not None
    except Exception:
        logging.exception("Failed to call Home Assistant panel service: %s", service)
        return False

def execute_script(entity_name: str, domain: str, service: str, service_data: dict, timeout=0.4) -> dict:
    pending = {"event": Event(), "result": None, "error": None}
    call_id = send_message({
        "type": "execute_script",
        "sequence": [
            {"service": f"{domain}.{service}", "data": service_data,
             "target": {"entity_id": [entity_name]}, "response_variable": "service_result"},
            {"stop": "done", "response_variable": "service_result"},
        ],
    }, pending=pending)
    if call_id is None:
        return {}
    try:
        if not pending["event"].wait(timeout):
            logging.warning("Timed out waiting for %s.%s", domain, service)
            return {}
        result = pending["result"]
        if pending["error"] is not None or not isinstance(result, dict):
            return {}
        response = result.get("response")
        return response if isinstance(response, dict) else {}
    finally:
        with request_lock:
            # A reconnect may already have reused this numeric ID.
            if response_buffer.get(call_id) is pending:
                response_buffer.pop(call_id, None)


def get_forecast(entity_id, forecast_type):
    """Serve the last good forecast while one background request refreshes it."""
    key = (entity_id, forecast_type)
    with forecast_lock:
        entry = forecast_cache.setdefault(key, {"response": {}, "expires": 0, "pending": False})
        if not entry["pending"] and time.monotonic() >= entry["expires"]:
            entry["pending"] = True
            Thread(target=_refresh_forecast, args=(key, entry), daemon=True).start()
        return entry["response"]


def _refresh_forecast(key, entry):
    entity_id, forecast_type = key
    changed = False
    try:
        response = execute_script(entity_id, "weather", "get_forecasts", {"type": forecast_type},
                                  timeout=FORECAST_TIMEOUT_SECONDS)
        data = response.get(entity_id)
        forecast = data.get("forecast") if isinstance(data, dict) else None
        valid = isinstance(forecast, list) and bool(forecast) and all(
            isinstance(item, dict) and isinstance(item.get("datetime"), str) for item in forecast)
        if valid:
            try:
                for item in forecast:
                    datetime.fromisoformat(item["datetime"])
            except ValueError:
                valid = False
        with forecast_lock:
            if valid:
                changed = entry["response"] != response
                entry["response"] = response
            entry["expires"] = time.monotonic() + (FORECAST_CACHE_SECONDS if valid else FORECAST_RETRY_SECONDS)
    except Exception:
        logging.exception("Failed to refresh forecast for %s", entity_id)
        with forecast_lock:
            entry["expires"] = time.monotonic() + FORECAST_RETRY_SECONDS
    finally:
        with forecast_lock:
            entry["pending"] = False
    if changed:
        send_entity_update(entity_id)


def _template_key(template):
    return template[3:] if template.startswith("ha:") else template


def cache_template(template, displayed_entity_id=None):
    if not isinstance(template, str) or not template:
        raise ValueError("Invalid template")
    template = _template_key(template)
    with request_lock:
        targets = known_templates.setdefault(template, set())
        if displayed_entity_id is not None:
            targets.add(displayed_entity_id)
        if template in subscribed_templates:
            return True
        # Register before sending: even an immediate response must be correlated.
        subscribed_templates[template] = True
        call_id = send_message({"type": "render_template", "template": template},
                               pending={"kind": "template", "template": template})
        if call_id is None:
            subscribed_templates.pop(template, None)
            return False
        return True


def get_template(template, displayed_entity_id=None):
    cache_template(template, displayed_entity_id)
    with request_lock:
        return template_cache.get(_template_key(template), {}).get("result")


def get_template_listener_entities(template):
    with request_lock:
        return template_cache.get(_template_key(template), {}).get("listener-entities", [])


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


def send_message(message, pending=None):
    """Allocate IDs, register replies and send in the same critical section."""
    global next_id
    with request_lock:
        data = json.loads(message) if isinstance(message, str) else dict(message)
        if data.get("type") != "auth" and not auth_ok:
            return None
        request_id = None
        try:
            if data.get("type") != "auth":
                next_id += 1
                request_id = next_id
                data["id"] = request_id
                if pending is not None:
                    response_buffer[request_id] = pending
            ws.send(json.dumps(data))
            return request_id
        except Exception:
            response_buffer.pop(request_id, None)
            logging.exception("Failed sending websocket message to Home Assistant")
            return None


def _get_display_registry():
    """HA resolves user and integration-suggested precision into the compact dp field."""
    global request_display_registry_id
    request_display_registry_id = send_message({"type": "config/entity_registry/list_for_display"},
                                               pending={"kind": "display_registry"})
