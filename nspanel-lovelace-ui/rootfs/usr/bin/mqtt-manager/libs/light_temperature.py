"""Shared Kelvin conversion for light controls and popup rendering."""
import math


def positive_number(value):
    try:
        number = float(value)
        return number if math.isfinite(number) and number > 0 else None
    except (ValueError, TypeError, OverflowError):
        return None


def kelvin_bounds(attributes):
    low = positive_number(attributes.get('min_color_temp_kelvin'))
    high = positive_number(attributes.get('max_color_temp_kelvin'))
    # Compatibility with integrations still exposing mired attributes.
    if low is None:
        mired = positive_number(attributes.get('max_mireds'))
        low = 1_000_000 / mired if mired else None
    if high is None:
        mired = positive_number(attributes.get('min_mireds'))
        high = 1_000_000 / mired if mired else None
    if low is None or high is None or low >= high:
        return None
    return low, high


def slider_to_kelvin(value, attributes):
    bounds = kelvin_bounds(attributes)
    try:
        position = float(value)
    except (ValueError, TypeError, OverflowError):
        return None
    if bounds is None or not math.isfinite(position):
        return None
    low, high = bounds
    position = max(0, min(100, position))
    return round(high + (low - high) * position / 100)


def temperature_slider(attributes):
    bounds = kelvin_bounds(attributes)
    if bounds is None:
        return 'disable'
    current = positive_number(attributes.get('color_temp_kelvin'))
    if current is None:
        mired = positive_number(attributes.get('color_temp'))
        current = 1_000_000 / mired if mired else None
    if current is None:
        return 'unknown'
    low, high = bounds
    return round(max(0, min(100, (high - current) / (high - low) * 100)))
