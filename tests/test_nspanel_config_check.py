import importlib.util
import sys
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "tools" / "nspanel_config_check.py"
SPEC = importlib.util.spec_from_file_location("nspanel_config_check", SCRIPT_PATH)
assert SPEC is not None
assert SPEC.loader is not None
nspanel_config_check = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = nspanel_config_check
SPEC.loader.exec_module(nspanel_config_check)


def test_valid_panel_config_has_no_findings():
    data = {
        "nspanel-1": {
            "module": "nspanel-lovelace-ui",
            "class": "NsPanelLovelaceUIManager",
            "config": {
                "panelRecvTopic": "tele/nspanel/RESULT",
                "panelSendTopic": "cmnd/nspanel/CustomSend",
                "model": "eu",
                "screensaver": {"defaultCard": "home"},
                "cards": [
                    {
                        "type": "cardGrid",
                        "title": "Home",
                        "key": "home",
                        "entities": [{"entity": "navigate.lights"}],
                    }
                ],
                "hiddenCards": [
                    {"type": "cardEntities", "title": "Lights", "key": "lights"}
                ],
            },
        }
    }

    findings = nspanel_config_check.check_apps_yaml(data)

    assert findings == []


def test_reports_missing_required_panel_keys_and_invalid_model():
    data = {
        "nspanel-1": {
            "module": "wrong-module",
            "class": "WrongClass",
            "config": {
                "panelRecvTopic": "tele/nspanel/RESULT",
                "model": "kitchen-wall-goblin",
                "cards": [],
            },
        }
    }

    findings = nspanel_config_check.check_apps_yaml(data)
    messages = [finding.message for finding in findings]

    assert "nspanel-1: module should be 'nspanel-lovelace-ui'" in messages
    assert "nspanel-1: class should be 'NsPanelLovelaceUIManager'" in messages
    assert "nspanel-1: config.panelSendTopic is required" in messages
    assert "nspanel-1: config.model should be one of: eu, us-l, us-p" in messages


def test_reports_navigation_targets_default_card_and_duplicate_keys():
    data = {
        "nspanel-1": {
            "module": "nspanel-lovelace-ui",
            "class": "NsPanelLovelaceUIManager",
            "config": {
                "panelRecvTopic": "tele/nspanel/RESULT",
                "panelSendTopic": "cmnd/nspanel/CustomSend",
                "screensaver": {"defaultCard": "missing-home"},
                "cards": [
                    {
                        "type": "cardGrid",
                        "title": "Home",
                        "key": "home",
                        "entities": [{"entity": "navigate.missing-room"}],
                    },
                    {"type": "cardGrid", "title": "Duplicate", "key": "home"},
                ],
            },
        }
    }

    findings = nspanel_config_check.check_apps_yaml(data)
    messages = [finding.message for finding in findings]

    assert "nspanel-1: duplicate card key 'home'" in messages
    assert "nspanel-1: navigate.missing-room has no matching card key" in messages
    assert "nspanel-1: screensaver.defaultCard 'missing-home' has no matching card key" in messages


def test_ignores_non_nspanel_appdaemon_apps():
    data = {
        "hello_world": {
            "module": "hello",
            "class": "HelloWorld",
        },
        "nspanel-1": {
            "module": "nspanel-lovelace-ui",
            "class": "NsPanelLovelaceUIManager",
            "config": {
                "panelRecvTopic": "tele/nspanel/RESULT",
                "panelSendTopic": "cmnd/nspanel/CustomSend",
                "cards": [],
            },
        },
    }

    findings = nspanel_config_check.check_apps_yaml(data)

    assert findings == []
