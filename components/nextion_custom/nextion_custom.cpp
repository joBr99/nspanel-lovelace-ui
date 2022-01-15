#include "nextion_custom.h"

#ifdef USE_ESP32_FRAMEWORK_ARDUINO

#include "esphome/components/wifi/wifi_component.h"
#include "esphome/core/application.h"
#include "esphome/core/helpers.h"
#include "esphome/core/util.h"
#include "esphome/core/version.h"

namespace esphome {
namespace NextionCustom {

static const char *const TAG = "nextion_custom";

static const char *const SUCCESS_RESPONSE = "{\"error\":0}";

static const uint8_t WAKE_RESPONSE[7] = {0xFF, 0xFF, 0xFF, 0x88, 0xFF, 0xFF, 0xFF};

void NextionCustom::setup() {
}

void NextionCustom::loop() {
  uint8_t d;

  while (this->available()) {
    this->read_byte(&d);
    this->buffer_.push_back(d);
	//ESP_LOGD(TAG, "ReceivedD: 0x%02x", d);
    if (!this->process_data_()) {
      ESP_LOGD(TAG, "Received: 0x%02x", d);
      this->buffer_.clear();
    }
  }
  
}

bool NextionCustom::process_data_() {
  uint32_t at = this->buffer_.size() - 1;
  auto *data = &this->buffer_[0];
  uint8_t new_byte = data[at];

//  if (data[0] == WAKE_RESPONSE[0]) {  // Screen wake message
//    if (at < 6)
//      return new_byte == WAKE_RESPONSE[at];
//    if (new_byte == WAKE_RESPONSE[at]) {
//      ESP_LOGD(TAG, "Screen wake message received");
//      this->initialize();
//      return false;
//    }
//    return false;
//  }
//
  // Byte 0: HEADER1 (always 0x55)
  if (at == 0)
    return new_byte == 0x55;
  // Byte 1: HEADER2 (always 0xBB)
  if (at == 1)
    return new_byte == 0xBB;

  // length
  if (at == 2){
    return true;	
  }
  uint8_t length = data[2];

  // Wait until all data comes in
  if (at - 3 < length){
	//ESP_LOGD(TAG, "Message Length: (%d/%d)", at - 2, length);
	//ESP_LOGD(TAG, "Received: 0x%02x", new_byte);
	return true;
  }


  // Wait for CRC
  if (at == 2 + length || at == 2 + length + 1)
    return true;

  uint16_t crc16 = encode_uint16(data[3 + length + 1], data[3 + length]);
  uint16_t calculated_crc16 = NextionCustom::crc16(data, 3 + length);

  if (crc16 != calculated_crc16) {
    ESP_LOGW(TAG, "Received invalid message checksum %02X!=%02X", crc16, calculated_crc16);
    return false;
  }else{
	ESP_LOGD(TAG, "Received valid message checksum %02X==%02X", crc16, calculated_crc16);
  }

  const uint8_t *message_data = data + 3;
  std::string message(message_data, message_data + length);

  #if ESPHOME_VERSION_CODE >= VERSION_CODE(2022, 1, 0)
    ESP_LOGD(TAG, "Received NextionCustom: PAYLOAD=%s RAW=[%s]", message.c_str(),
             format_hex_pretty(message_data, length).c_str());
  #else
    ESP_LOGD(TAG, "Received NextionCustom: PAYLOAD=%s RAW=[%s]", message.c_str(),
             hexencode(message_data, length).c_str());
  #endif
  this->process_command_(message);
  return false;
}

void NextionCustom::process_command_(const std::string &message) {
	this->incoming_msg_callback_.call(message);
}

void NextionCustom::add_incoming_msg_callback(std::function<void(std::string)> callback) {
    this->incoming_msg_callback_.add(std::move(callback));
}

void NextionCustom::dump_config() { ESP_LOGCONFIG(TAG, "NextionCustom:"); }


void NextionCustom::send_command_(const std::string &command) {
  ESP_LOGD(TAG, "Sending: %s", command.c_str());
  this->write_str(command.c_str());
  const uint8_t to_send[3] = {0xFF, 0xFF, 0xFF};
  this->write_array(to_send, sizeof(to_send));
}

void NextionCustom::send_special_hex_cmd(const std::string &command) {
  ESP_LOGD(TAG, "Sending: special hex cmd");

  const uint8_t to_send[3] = {0x09, 0x19, 0x08};
  this->write_array(to_send, sizeof(to_send));
  //this->write_str(" fffb 0002 0000 0020");
  this->write_str(command.c_str());
  const uint8_t to_send2[3] = {0xFF, 0xFF, 0xFF};
  this->write_array(to_send2, sizeof(to_send2));
}

void NextionCustom::send_custom_command(const std::string &command) {
  ESP_LOGD(TAG, "Sending custom command: %s", command.c_str());
  std::vector<uint8_t> data = {0x55, 0xBB};
  data.push_back(command.length() & 0xFF);
  //data.push_back((command.length() >> 8) & 0xFF);
  data.insert(data.end(), command.begin(), command.end());
  auto crc = crc16(data.data(), data.size());
  data.push_back(crc & 0xFF);
  data.push_back((crc >> 8) & 0xFF);
  this->write_array(data);
  
  #if ESPHOME_VERSION_CODE >= VERSION_CODE(2022, 1, 0)
    ESP_LOGD(TAG, "Send NextionCustom: PAYLOAD=%s RAW=[%s]", command.c_str(),
             format_hex_pretty(&data[0], data.size()).c_str());
  #else
    ESP_LOGD(TAG, "Send NextionCustom: PAYLOAD=%s RAW=[%s]", command.c_str(),
             hexencode(&data[0], data.size()).c_str());
  #endif
}

uint16_t NextionCustom::crc16(const uint8_t *data, uint16_t len) {
  uint16_t crc = 0xFFFF;
  while (len--) {
    crc ^= *data++;
    for (uint8_t i = 0; i < 8; i++) {
      if ((crc & 0x01) != 0) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

}  // namespace NextionCustom
}  // namespace esphome

#endif  // USE_ESP32_FRAMEWORK_ARDUINO