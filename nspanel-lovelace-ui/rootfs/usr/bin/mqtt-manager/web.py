"""Ingress-only configuration editor, independent of panel connectivity."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import logging
import os
from pathlib import Path

import yaml

from config_manager import CARD_TYPES, MAX_BYTES, ConfigError, ConfigStore, ConflictError, import_yaml, parse_yaml

FRONTEND = Path(__file__).with_name("frontend")


def handler_for(store, allowed_peer="172.30.32.2"):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            logging.info("Editor: " + fmt, *args)

        def respond(self, status, body, content_type="application/json"):
            if content_type == "application/json":
                body = json.dumps(body).encode()
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(body)

        def authorized(self):
            # Never trust forwarding headers: only the Supervisor may reach this port.
            if self.client_address[0] != allowed_peer:
                self.respond(403, {"error": "Use Home Assistant ingress to open the editor."})
                return False
            return True

        def do_GET(self):
            if not self.authorized():
                return
            path = self.path.split("?", 1)[0]
            if path == "/api/config":
                try:
                    self.respond(200, {**store.read(), "cardTypes": CARD_TYPES})
                except (OSError, UnicodeError):
                    self.respond(500, {"error": "Unable to read panels.yaml. Check add-on logs."})
                return
            assets = {"/": ("index.html", "text/html; charset=utf-8"),
                      "/editor.js": ("editor.js", "text/javascript; charset=utf-8"),
                      "/style.css": ("style.css", "text/css; charset=utf-8")}
            if path not in assets:
                self.respond(404, {"error": "Not found"})
                return
            filename, mime = assets[path]
            self.respond(200, (FRONTEND / filename).read_bytes(), mime)

        def do_POST(self):
            if not self.authorized():
                return
            if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
                self.respond(415, {"error": "Expected application/json"})
                return
            try:
                size = int(self.headers.get("Content-Length", "0"))
                if not 0 < size <= MAX_BYTES:
                    raise ConfigError("Request must be smaller than 1 MiB.")
                body = json.loads(self.rfile.read(size))
                if not isinstance(body, dict):
                    raise ConfigError("Expected an object.")
                if self.path == "/api/import":
                    result = import_yaml(body.get("yaml"))
                    result["yaml"] = yaml.safe_dump(result["config"], sort_keys=False, allow_unicode=True)
                elif self.path == "/api/parse":
                    result = {"config": parse_yaml(body.get("yaml"))}
                elif self.path == "/api/serialize":
                    text = yaml.safe_dump(body.get("config"), sort_keys=False, allow_unicode=True)
                    parse_yaml(text)
                    result = {"yaml": text}
                elif self.path == "/api/config":
                    result = store.save(body.get("yaml"), body.get("revision"))
                else:
                    self.respond(404, {"error": "Not found"})
                    return
                self.respond(200, result)
            except ConflictError as exc:
                self.respond(409, {"error": str(exc)})
            except (ConfigError, ValueError, TypeError, UnicodeError, RecursionError) as exc:
                self.respond(400, {"error": str(exc)})
            except OSError:
                logging.exception("Editor could not save configuration")
                self.respond(500, {"error": "Unable to save configuration. Check add-on logs."})
    return Handler


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    store = ConfigStore(os.environ.get("CONFIG_FILE", "/config/panels.yaml"))
    ThreadingHTTPServer(("0.0.0.0", 8099), handler_for(store)).serve_forever()
