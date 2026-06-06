# Troubleshooting Home Assistant setups

This page collects the most common checks for Home Assistant/AppDaemon installations where the panel does not show the expected content after setup, update, or configuration changes.

## AppDaemon is running the expected apps.yaml

If the panel still shows old pages after editing `apps.yaml`, or if HACS shows an update but the running behavior looks unchanged, first verify that AppDaemon is reading the file you edited.

With recent AppDaemon add-on versions the config directory changed. This project expects the Home Assistant add-on to use the classic app directory:

```yaml
app_dir: /config/appdaemon/apps
```

Check the following:

1. `appdaemon.yaml` contains the expected `app_dir` setting.
2. Your NSPanel app configuration is in `/config/appdaemon/apps/apps.yaml`.
3. There is no second stale `apps.yaml` in another AppDaemon config path.
4. AppDaemon was restarted after changing the configuration or after updating through HACS.

A stale AppDaemon path is a common reason for confusing symptoms such as:

- changes in `apps.yaml` do not appear on the panel;
- the panel keeps using an older card layout;
- HACS updated the backend but AppDaemon still behaves like the previous version.

## Check the AppDaemon log after each change

After editing `apps.yaml`, restart AppDaemon and check the add-on log. For a healthy MQTT plugin startup you should see a message similar to:

```text
INFO MQTT: MQTT Plugin initialization complete
```

If the MQTT plugin cannot connect, the panel will not receive content. Authentication and broker errors are usually visible in the AppDaemon log or in the MQTT broker log.

Also check for Python tracebacks or YAML parse errors immediately after restart. A single indentation error in `apps.yaml` can prevent the AppDaemon app from loading.

## Verify MQTT topics on both sides

The Tasmota MQTT topic and the `apps.yaml` topics must match each other.

Typical values look like this:

```yaml
panelRecvTopic: "tele/tasmota_your_mqtt_topic/RESULT"
panelSendTopic: "cmnd/tasmota_your_mqtt_topic/CustomSend"
```

In Tasmota, avoid changing the `FullTopic` unless you also understand how it changes the MQTT send and receive topics. If the panel shows `Waiting for content`, it is often still publishing messages, but AppDaemon may be listening on a different topic.

## Validate navigation targets

Navigation items use the `navigate.` prefix and point to cards by their `key` value:

```yaml
entities:
  - entity: navigate.livingroom
```

The target card must have a matching key in `cards` or `hiddenCards`:

```yaml
hiddenCards:
  - type: cardGrid
    title: Living Room
    key: livingroom
```

If a navigation item does not work, check that:

- the target card has a `key`;
- the key matches exactly, including case;
- the key is unique;
- the target card is defined under `cards` or `hiddenCards` for the same panel app.

## Check defaultCard

`screensaver.defaultCard` is evaluated when leaving the screensaver. It should point to a card key that exists in the top-level `cards` list and is reachable as a navigation target.

Example:

```yaml
screensaver:
  defaultCard: home
cards:
  - type: cardGrid
    title: Home
    key: home
```

If the panel does not return to the expected page after the screensaver, verify the target card key first.

## Template-based configuration

Some configuration values can contain Home Assistant templates. If a template reads an entity state, make sure that entity exists and has the states or attributes used by the template.

For example, climate entities often expose additional details through attributes such as `hvac_action`:

```jinja2
{{ state_attr('climate.living_room', 'hvac_action') }}
```

When debugging templates, test them in Home Assistant under **Developer Tools > Template** before placing them in `apps.yaml`.

## Information to include in a GitHub issue

If the checks above do not solve the problem, include the following when opening an issue:

- the relevant `apps.yaml` section for the affected panel;
- `appdaemon.yaml` with secrets removed;
- the AppDaemon log directly after a restart;
- screenshots of the Tasmota MQTT configuration with secrets removed;
- the panel model (`eu`, `us-l`, or `us-p`);
- whether the backend was installed through HACS or manually.

Please remove passwords, access tokens, broker credentials, and private URLs before posting logs or configuration files.
