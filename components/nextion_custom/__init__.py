from esphome import automation
import esphome.config_validation as cv
import esphome.codegen as cg

from esphome.components import uart, time, switch, sensor
from esphome.const import (
    CONF_ID,
    CONF_NAME,
    CONF_ON_CLICK,
    CONF_TEMPERATURE,
    CONF_THEN,
    CONF_TIME_ID,
    CONF_TYPE,
    CONF_TRIGGER_ID,
)

AUTO_LOAD = ["text_sensor"]
CODEOWNERS = ["@joBr99"]
DEPENDENCIES = ["uart", "wifi", "esp32"]


nextion_custom_ns = cg.esphome_ns.namespace("NextionCustom")
NextionCustom = nextion_custom_ns.class_("NextionCustom", cg.Component, uart.UARTDevice)


NextionCustomMsgIncomingTrigger = nextion_custom_ns.class_(
    "NextionCustomMsgIncomingTrigger",
    automation.Trigger.template(cg.std_string)
)

CONF_INCOMING_MSG = 'on_incoming_msg'


CONFIG_SCHEMA = cv.All(
    cv.Schema(
        {
            cv.GenerateID(): cv.declare_id(NextionCustom),
            cv.Required(CONF_INCOMING_MSG): automation.validate_automation(
                cv.Schema(
                    {
                        cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(NextionCustomMsgIncomingTrigger),
                    }
                )
            ),        
        }
    )
    .extend(uart.UART_DEVICE_SCHEMA)
    .extend(cv.COMPONENT_SCHEMA),
    cv.only_with_arduino,
)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    await uart.register_uart_device(var, config)

    for conf in config.get(CONF_INCOMING_MSG, []):
        trigger = cg.new_Pvariable(conf[CONF_TRIGGER_ID], var)
        await automation.build_automation(trigger, [(cg.std_string, "x")], conf)

    cg.add_define("USE_NEXTIONCUSTOM")