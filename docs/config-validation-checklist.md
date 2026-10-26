# Configuration checklist

Before applying a panel configuration:

- Use `nspanels.<name>` in `panels.yaml`, without AppDaemon `module`, `class`, or `config` wrappers.
- Match topics and model to the panel; assign unique receive topics.
- Set `locale`, `timeZone`, `timeFormat`, and Babel `dateFormat` (for example `full`).
- Define a `screensaver` object and at least one supported card in `cards`.
- Use entity objects such as `- entity: light.kitchen` and verify those IDs exist in Home Assistant.
- Keep navigation keys unique and define `defaultCard: navigate.<key>` at panel level when needed.
- Use numeric brightness, an entity ID, or a daily time/value brightness schedule.
- Review import warnings; preserving an option does not mean the runtime implements it.
- Stop the old backend before using the same panel topics.
- Select **Save & apply**, check the add-on log, and verify the physical display.

See [configuration](config-overview.md), [migration](config-migration-standalone.md), and [troubleshooting](troubleshooting.md) for details.
