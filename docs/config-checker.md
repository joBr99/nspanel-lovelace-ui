# Configuration checker

The repository includes a small helper script that checks common `apps.yaml` mistakes before you restart AppDaemon.

```bash
python3 tools/nspanel_config_check.py /config/appdaemon/apps/apps.yaml
```

The checker reads the AppDaemon `apps.yaml` file, finds NSPanel Lovelace UI app blocks, and validates references that are easy to mistype.

## What it checks

The checker currently validates:

- the NSPanel AppDaemon app block uses the expected `module` and `class`;
- `config.panelRecvTopic` and `config.panelSendTopic` are present;
- `config.model`, when set, is one of `eu`, `us-l`, or `us-p`;
- card `key` values are unique across `cards` and `hiddenCards`;
- every `navigate.<key>` entity has a matching card `key`;
- `screensaver.defaultCard` points to an existing card `key`.

It does not connect to Home Assistant or MQTT, so it cannot verify whether entity IDs exist or whether the panel is online. Use it as a quick static check before looking at AppDaemon logs.

## Requirements

The script uses Python 3 and PyYAML to read YAML files. Home Assistant/AppDaemon environments usually already include YAML support. If you run it on another machine and see a PyYAML error, install PyYAML in that Python environment first.

Example with a virtual environment:

```bash
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install pyyaml
python3 tools/nspanel_config_check.py /path/to/apps.yaml
```

## Example output

A valid configuration prints:

```text
OK: no NSPanel configuration issues found
```

A configuration with navigation and default-card mistakes prints errors like:

```text
ERROR: nspanel-1: navigate.livingroom has no matching card key
ERROR: nspanel-1: screensaver.defaultCard 'home' has no matching card key
```

Fix the reported keys in `apps.yaml`, restart the AppDaemon add-on, and then check the AppDaemon logs if the panel still does not behave as expected.
