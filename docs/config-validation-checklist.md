# Home Assistant configuration checklist

Use this checklist after changing `apps.yaml`, updating the backend through HACS, or troubleshooting a panel that does not show the expected page.

## 1. Confirm AppDaemon reads the file you edited

- `appdaemon.yaml` points AppDaemon to the expected app directory:

```yaml
app_dir: /config/appdaemon/apps
```

- The panel configuration is in `/config/appdaemon/apps/apps.yaml`.
- There is no second stale `apps.yaml` in another AppDaemon config path.
- AppDaemon was restarted after the change.

See [Troubleshooting Home Assistant setups](troubleshooting.md#appdaemon-is-running-the-expected-appsyaml) for more details.

## 2. Check MQTT before debugging cards

The panel and AppDaemon must use matching MQTT topics.

```yaml
panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
```

Check that:

- Tasmota connects successfully to the MQTT broker;
- the Tasmota topic matches the topic used in `apps.yaml`;
- `FullTopic` was not changed unless the resulting send and receive topics were also adjusted;
- the AppDaemon log shows successful MQTT plugin initialization.

A healthy AppDaemon MQTT startup contains a line similar to:

```text
INFO MQTT: MQTT Plugin initialization complete
```

## 3. Validate the panel app block

Each panel app should define the required AppDaemon metadata and the main `config` block:

```yaml
nspanel-1:
  module: nspanel-lovelace-ui
  class: NsPanelLovelaceUIManager
  config:
    panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
    panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
    model: eu
```

Check that:

- the panel app name is unique;
- `module` and `class` are unchanged;
- `model` matches the panel type (`eu`, `us-l`, or `us-p`);
- required keys are indented under `config`.

## 4. Validate cards and navigation targets

Navigation entries use the `navigate.` prefix and target a card `key`:

```yaml
entities:
  - entity: navigate.livingroom
```

The target card must exist in `cards` or `hiddenCards`:

```yaml
hiddenCards:
  - type: cardGrid
    title: Living Room
    key: livingroom
```

Check that:

- every `navigate.<key>` has a matching card `key`;
- card keys are unique;
- key names match exactly, including case;
- the target card belongs to the same panel app.

## 5. Validate `defaultCard`

If the panel opens the wrong page after leaving the screensaver, check `screensaver.defaultCard` first:

```yaml
screensaver:
  defaultCard: home
cards:
  - type: cardGrid
    title: Home
    key: home
```

The value of `defaultCard` should match a card key that exists in the panel configuration.

## 6. Test Home Assistant templates separately

When configuration values contain Home Assistant templates, test them in **Developer Tools > Template** before adding them to `apps.yaml`.

Example:

```jinja2
{{ state_attr('climate.living_room', 'hvac_action') }}
```

Check that every referenced entity exists and that the template handles unavailable or missing states.

## 7. Restart and read logs after the change

After editing `apps.yaml`:

1. restart the AppDaemon add-on;
2. open the AppDaemon log;
3. look for YAML parse errors, Python tracebacks, MQTT connection errors, or missing entities;
4. verify the panel receives fresh content.

If the issue remains, collect the information listed in [Information to include in a GitHub issue](troubleshooting.md#information-to-include-in-a-github-issue).
