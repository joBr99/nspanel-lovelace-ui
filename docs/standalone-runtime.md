# Standalone operation

Home Assistant Container installations do not provide the Supervisor add-on store. You can run the Python backend separately and manage `panels.yaml` yourself. The bundled web editor requires Supervisor ingress; it is not a standalone authenticated web server.

From a checkout, with Python 3.10 or later:

```sh
cd nspanel-lovelace-ui/rootfs/usr/bin/mqtt-manager
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export CONFIG_FILE=/absolute/path/to/panels.yaml
python main.py
```

Use the [panel configuration example](configure_mqtt.md) and add your connection settings at the top level:

```yaml
home_assistant_address: http://homeassistant.local:8123
home_assistant_token: YOUR_LONG_LIVED_ACCESS_TOKEN
mqtt_server: 192.168.1.10
mqtt_port: 1883
mqtt_username: nspanel
mqtt_password: YOUR_MQTT_PASSWORD
```

Replace placeholders with actual values and protect the file containing credentials. Run the process under your service manager for persistent operation. Configuration changes reload the process. See [connection modes](connection-modes.md) for the compatible ESPHome alternative.
