"""Resolve MQTT settings without leaking credentials into startup errors."""
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class MQTTConfigurationError(ValueError):
    pass


def validate_mqtt(settings):
    host = settings.get('mqtt_server')
    if not isinstance(host, str) or not host.strip():
        raise MQTTConfigurationError('MQTT host is missing. Configure mqtt_server in /config/panels.yaml or enable the Supervisor MQTT service.')
    port = settings.get('mqtt_port')
    try:
        if isinstance(port, bool) or not isinstance(port, (int, str)):
            raise ValueError
        port = int(port)
        if not 1 <= port <= 65535:
            raise ValueError
    except (ValueError, TypeError):
        raise MQTTConfigurationError('MQTT port is missing or invalid. Set mqtt_port to an integer from 1 to 65535 in /config/panels.yaml.') from None
    return {**settings, 'mqtt_server': host.strip(), 'mqtt_port': port}


def resolve_mqtt(settings):
    # Explicit YAML/environment host means manual configuration, including
    # anonymous access. Never mix its credentials with another discovered broker.
    if settings.get('mqtt_server'):
        return validate_mqtt(settings)
    token = os.getenv('SUPERVISOR_TOKEN')
    if token and 'STANDALONE' not in os.environ:
        request = Request('http://supervisor/services/mqtt', headers={'Authorization': f'Bearer {token}'})
        try:
            with urlopen(request, timeout=10) as response:
                result = json.load(response)
            data = result.get('data') if isinstance(result, dict) else None
            if not isinstance(data, dict) or result.get('result') != 'ok':
                raise MQTTConfigurationError('Supervisor MQTT service is unavailable. Check that the MQTT broker add-on is running and provides the MQTT service, or configure MQTT in /config/panels.yaml.')
        except (HTTPError, URLError, TimeoutError, OSError, ValueError) as exc:
            if isinstance(exc, HTTPError):
                exc.close()
            if isinstance(exc, MQTTConfigurationError):
                raise
            raise MQTTConfigurationError('Cannot retrieve the Supervisor MQTT service. Check broker service availability or configure MQTT in /config/panels.yaml.') from None
        resolved = dict(settings)
        for key, source in [('mqtt_server', 'host'), ('mqtt_port', 'port'),
                            ('mqtt_username', 'username'), ('mqtt_password', 'password')]:
            if not resolved.get(key):
                resolved[key] = data.get(source)
        return validate_mqtt(resolved)
    return validate_mqtt(settings)
