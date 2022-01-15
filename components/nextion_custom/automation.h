#pragma once

#include <utility>

#include "esphome/core/component.h"
#include "esphome/core/automation.h"
#include "nextion_custom.h"

namespace esphome {
namespace NextionCustom {

class NextionCustomMsgIncomingTrigger : public Trigger<std::string> {
 public:
  explicit NextionCustomMsgIncomingTrigger(NextionCustom *parent) {
    parent->add_incoming_msg_callback([this](const std::string &value) { this->trigger(value); });
  }
};

}  // namespace NextionCustom
}  // namespace esphome