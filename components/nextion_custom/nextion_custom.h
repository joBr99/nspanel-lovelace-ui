#pragma once

#ifdef USE_ESP32_FRAMEWORK_ARDUINO

#include <utility>

#include "esphome/components/text_sensor/text_sensor.h"
#include "esphome/components/switch/switch.h"
//#include "esphome/components/time/real_time_clock.h"
#include "esphome/components/uart/uart.h"
#include "esphome/core/automation.h"
#include "esphome/core/component.h"
#include "esphome/core/defines.h"

namespace esphome {
namespace NextionCustom {

class NextionCustom : public Component, public uart::UARTDevice {
 public:
  void setup() override;
  void loop() override;

  float get_setup_priority() const override { return setup_priority::DATA; }

  void dump_config() override;

  void send_custom_command(const std::string &command);
  
  
  void send_special_hex_cmd(const std::string &command);

  void add_incoming_msg_callback(std::function<void(std::string)> callback);

  void send_command_(const std::string &command);


 protected:
  static uint16_t crc16(const uint8_t *data, uint16_t len);

  bool process_data_();
  void process_command_(const std::string &message);

  CallbackManager<void(std::string)> incoming_msg_callback_;

  std::vector<uint8_t> buffer_;
};


}  // namespace NextionCustom
}  // namespace esphome

#endif  // USE_ESP32_FRAMEWORK_ARDUINO