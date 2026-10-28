from libs.helper import rgb_dec565, rgb_brightness
import ast
import re


def _normalize_rgb(value):
    """Accept [r,g,b], JSON/python RGB text, #RRGGBB or rgb(r,g,b)."""
    if isinstance(value, str):
        value = value.strip()
        if re.fullmatch(r"#[0-9a-fA-F]{6}", value):
            return [int(value[i:i+2], 16) for i in (1, 3, 5)]
        match = re.fullmatch(r"rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)", value, re.I)
        if match:
            value = [int(x) for x in match.groups()]
        else:
            try:
                value = ast.literal_eval(value)
            except (ValueError, SyntaxError, TypeError, MemoryError, RecursionError):
                return None
    if isinstance(value, (list, tuple)) and len(value) == 3:
        if all(type(x) is int and 0 <= x <= 255 for x in value):
            return list(value)
    return None


def get_entity_color(etype, state, attr, overwrite=None):
    if overwrite is not None:
        # Original AppDaemon color entities return text. Normalize safely to
        # integer RGB triples before passing them to the RGB565 converter.
        # Invalid/unavailable colors fall back to the standard entity color.
        candidate = overwrite.get(state) if isinstance(overwrite, dict) else overwrite
        color = _normalize_rgb(candidate)
        if color is not None:
            return rgb_dec565(color)

    default_color_on = rgb_dec565([253, 216, 53])
    default_color_off = rgb_dec565([68, 115, 158])
    icon_color = default_color_on if state in [
        "on", "unlocked", "above_horizon", "home", "active"] else default_color_off
    if etype == "alarm_control_panel":
        if state == "disarmed":
            icon_color = rgb_dec565([13, 160, 53])
        if state == "arming":
            icon_color = rgb_dec565([244, 180, 0])
        if state in ["armed_home", "armed_away", "armed_night", "armed_vacation", "pending", "triggered"]:
            icon_color = rgb_dec565([223, 76, 30])
    if etype == "climate":
        if state in ["auto", "heat_cool"]:
            icon_color = 1024
        if state == "heat":
            icon_color = 64512
        if state == "off":
            icon_color = 35921
        if state == "cool":
            icon_color = 11487
        if state == "dry":
            icon_color = 60897
        if state == "fan_only":
            icon_color = 35921
    if etype == "weather":
        if state in ["partlycloudy", "windy"]:
            icon_color = 38066  # 50% grey
        if state == "clear-night":
            icon_color = 38060  # yellow grey
        if state == "windy-variant":
            icon_color: 64495  # red grey
        if state == "cloudy":
            icon_color = 31728  # grey-blue
        if state == "exceptional":
            icon_color = 63878  # red
        if state == "fog":
            icon_color = 38066  # 75% grey
        if state in ["hail", "snowy"]:
            icon_color = 65535  # white
        if state == "lightning":
            icon_color = 65120  # golden-yellow
        if state == "lightning-rainy":
            icon_color = 50400  # dark-golden-yellow
        if state == "pouring":
            icon_color = 12703  # blue
        if state == "rainy":
            icon_color = 25375  # light-blue
        if state == "snowy-rainy":
            icon_color = 38079  # light-blue-grey
        if state == "sunny":
            icon_color = 65504  # bright-yellow
    if "rgb_color" in attr and attr.get("rgb_color"):
        color = attr.get("rgb_color")
        if "brightness" in attr and attr.get("brightness"):
            color = rgb_brightness(color, attr.get("brightness"))
        icon_color = rgb_dec565(color)
    elif "brightness" in attr and attr.get("brightness"):
        color = rgb_brightness([253, 216, 53], attr.get("brightness"))
        icon_color = rgb_dec565(color)
    return icon_color
