"""Daily brightness schedules in the panel's local wall-clock time."""
from datetime import datetime
import re
from zoneinfo import ZoneInfo


def schedule_entries(schedule):
    if not isinstance(schedule, list) or not schedule:
        raise ValueError('brightness schedule must be a non-empty list')
    entries = {}
    for entry in schedule:
        if not isinstance(entry, dict):
            raise ValueError('brightness schedule entries require time and value')
        clock = entry.get('time')
        if not isinstance(clock, str) or not re.fullmatch(r'\d{2}:\d{2}(:\d{2})?', clock):
            raise ValueError('brightness schedule time must be HH:MM or HH:MM:SS')
        parts = [int(part) for part in clock.split(':')]
        hour, minute = parts[:2]
        second = parts[2] if len(parts) == 3 else 0
        if hour > 23 or minute > 59 or second > 59:
            raise ValueError('brightness schedule time is outside the valid range')
        value = entry.get('value')
        if type(value) is not int or not 0 <= value <= 100:
            raise ValueError('brightness schedule value must be an integer from 0 to 100')
        key = hour * 3600 + minute * 60 + second
        if key in entries:
            raise ValueError('brightness schedule times must be unique')
        entries[key] = value
    return sorted(entries.items())


def validate_brightness(value):
    if isinstance(value, list):
        schedule_entries(value)
    elif not (type(value) is int and 0 <= value <= 100 or isinstance(value, str) and value.strip()):
        raise ValueError('brightness must be 0–100, an entity ID, or a daily time/value schedule')


def scheduled_brightness(schedule, timezone='Europe/Berlin', now=None):
    entries = schedule_entries(schedule)
    local = datetime.now(ZoneInfo(timezone)) if now is None else now.astimezone(ZoneInfo(timezone))
    clock = local.hour * 3600 + local.minute * 60 + local.second
    # Before the first entry, yesterday's final setting remains in effect.
    value = entries[-1][1]
    for start, brightness in entries:
        if start > clock:
            break
        value = brightness
    return value
