"""Format sensor display values without changing their cached HA state."""
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP, localcontext


def format_sensor_value(state, precision):
    if type(precision) is not int or not 0 <= precision <= 100:
        return state
    try:
        value = Decimal(state)
        if not value.is_finite():
            return state
        with localcontext() as context:
            context.prec = max(28, len(value.as_tuple().digits), value.adjusted() + 1) + precision + 2
            rounded = value.quantize(Decimal(1).scaleb(-precision), rounding=ROUND_HALF_UP)
            return format(rounded, f".{precision}f")
    except (InvalidOperation, ValueError, TypeError):
        return state
