from jinja2 import Environment, BaseLoader
from typing import (
    Any
)
import libs.home_assistant

def states(entity_id):
    return libs.home_assistant.get_entity_data(entity_id).get("state")

def state_attr(entity_id, attr):
    return libs.home_assistant.get_entity_data(entity_id).get('attributes', []).get(attr)

def iif(value: Any, if_true: Any = True, if_false: Any = False, if_none: Any = False) -> Any:
    if value is None:
        return if_none
    if bool(value):
        return if_true
    return if_false

func_dict = {
    "states": states,
    "state_attr": state_attr,
    "iif": iif
}

def render(template):
    jinja_template = Environment(loader=BaseLoader()).from_string(template)
    jinja_template.globals.update(func_dict)
    template_string = jinja_template.render()
    return template_string