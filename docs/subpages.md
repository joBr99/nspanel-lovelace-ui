# Navigation and hidden cards

Use card `key` values as navigation targets. Put pages that should not appear in the main carousel under `hiddenCards` in the same panel.

```yaml
cards:
  - type: cardGrid
    title: Home
    key: home
    entities:
      - entity: navigate.settings
        name: Settings
        icon: mdi:cog
hiddenCards:
  - type: cardEntities
    title: Settings
    key: settings
    entities:
      - entity: input_number.panel_brightness
defaultCard: navigate.home
```

This snippet belongs under `nspanels.<panel_name>`. `defaultCard` is a **panel-level** setting, alongside `cards` and `screensaver`. Use `navigate.<key>`, not the AppDaemon `screensaver.defaultCard` location. Keep keys unique within each panel. `navigate.UP` returns from a hidden page.
