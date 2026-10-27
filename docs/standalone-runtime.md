# Standalone operation

Home Assistant Container installations do not provide the Supervisor add-on store. You can run the Python backend separately and manage `panels.yaml` yourself. The web editor supports authenticated standalone access when explicitly enabled; see the Docker configuration below.

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

## Standalone Docker web editor (4.8.4+)

Enable direct browser access with `WEB_STANDALONE: "true"` and set `WEB_PASSWORD`. `WEB_USERNAME` defaults to `admin`. Without this opt-in, only Home Assistant Supervisor ingress is accepted. Standalone mode refuses to start the editor if the password is missing or blank; every page and API request requires HTTP Basic authentication.

```yaml
services:
  nspanel-lovelace-ui:
    image: ghcr.io/jobr99/nspanel-lovelace-ui:latest
    environment:
      STANDALONE: "1"
      WEB_STANDALONE: "true"
      WEB_USERNAME: admin
      WEB_PASSWORD: "${NSPANEL_WEB_PASSWORD:?Set NSPANEL_WEB_PASSWORD}"
      LOGLEVEL: INFO
    ports:
      - "8099:8099"
    volumes:
      - ./nspanel-config:/config
    restart: unless-stopped
```

Set `NSPANEL_WEB_PASSWORD` in your Compose environment or `.env`, then recreate the container. Open `http://<docker-host>:8099` and enter the username/password in the browser login prompt. Basic authentication is not encrypted over HTTP; use a trusted local network or an HTTPS reverse proxy for remote access. Restrict the published port to the intended network.

`STANDALONE` disables Supervisor MQTT discovery and uses `LOGLEVEL`/`LOGTOFILE` for logging; `WEB_STANDALONE` independently enables authenticated direct access to the editor. The panel backend still needs a Home Assistant connection and MQTT settings in `/config/panels.yaml`. This enables the editor without Supervisor, not operation of panels without Home Assistant. Environment-provided editor credentials are not included in YAML exports. Use an image built with this feature; older images do not recognize these variables.
