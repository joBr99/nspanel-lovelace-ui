"""Daily brightness schedules in the panel's local wall-clock time."""
from datetime import datetime
import re
from zoneinfo import ZoneInfo

# AppDaemon accepted H:MM:SS too, and sunrise/sunset with an optional signed offset.
CLOCK = r'(\d{1,2}):(\d{2})(?::(\d{2}))?'
SUN_EVENT = r'(sunrise|sunset)(?:\s*([+-])\s*' + CLOCK + r')?'


def _seconds(hour, minute, second):
    hour, minute, second = int(hour), int(minute), int(second or 0)
    if hour > 23 or minute > 59 or second > 59:
        raise ValueError('brightness schedule time is outside the valid range')
    return hour * 3600 + minute * 60 + second


def schedule_entries(schedule):
    """Validate a schedule into (event, seconds, value); event is None for clock times,
    otherwise sunrise/sunset with seconds as the signed offset."""
    if not isinstance(schedule, list) or not schedule:
        raise ValueError('brightness schedule must be a non-empty list')
    entries = {}
    for entry in schedule:
        if not isinstance(entry, dict):
            raise ValueError('brightness schedule entries require time and value')
        clock = entry.get('time')
        clock = clock.strip() if isinstance(clock, str) else ''
        if match := re.fullmatch(CLOCK, clock):
            key = (None, _seconds(*match.groups()))
        elif match := re.fullmatch(SUN_EVENT, clock):
            event, sign, *offset = match.groups()
            seconds = _seconds(*offset) if sign else 0
            key = (event, -seconds if sign == '-' else seconds)
        else:
            raise ValueError('brightness schedule time must be HH:MM, HH:MM:SS, sunrise or sunset '
                             '(optionally with an offset such as "sunset + 1:00:00")')
        value = entry.get('value')
        if type(value) is not int or not 0 <= value <= 100:
            raise ValueError('brightness schedule value must be an integer from 0 to 100')
        if key in entries:
            raise ValueError('brightness schedule times must be unique')
        entries[key] = value
    return [(event, seconds, value) for (event, seconds), value in entries.items()]


def validate_brightness(value):
    if isinstance(value, list):
        schedule_entries(value)
    elif not (type(value) is int and 0 <= value <= 100 or isinstance(value, str) and value.strip()):
        raise ValueError('brightness must be 0–100, an entity ID, or a daily time/value schedule')


def _sun_seconds(next_event, local):
    """Today's event in seconds after local midnight, from Home Assistant's next occurrence."""
    event = next_event.astimezone(local.tzinfo)
    seconds = event.hour * 3600 + event.minute * 60 + event.second
    if event.date() > local.date():
        # Today's event has passed. Tomorrow's is a few minutes off; never place it after now.
        seconds = min(seconds, local.hour * 3600 + local.minute * 60 + local.second)
    return seconds


def scheduled_brightness(schedule, timezone='Europe/Berlin', now=None, sun=None, default=None):
    """sun maps 'sunrise'/'sunset' to their next occurrence (sun.sun next_rising/next_setting).
    Entries whose event is missing are skipped; default applies when none is left."""
    local = datetime.now(ZoneInfo(timezone)) if now is None else now.astimezone(ZoneInfo(timezone))
    clock = local.hour * 3600 + local.minute * 60 + local.second
    entries = []
    for event, seconds, brightness in schedule_entries(schedule):
        if event:
            if not (sun or {}).get(event):
                continue
            seconds = (_sun_seconds(sun[event], local) + seconds) % 86400
        entries.append((seconds, brightness))
    if not entries:
        return default
    entries.sort()
    # Before the first entry, yesterday's final setting remains in effect.
    value = entries[-1][1]
    for start, brightness in entries:
        if start > clock:
            break
        value = brightness
    return value
