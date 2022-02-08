# Nextion Berry Driver

This berry driver is intended for the usage with a custom HMI/TFT firmware on nspanel.

It adds the following commands to Tasmota:

- `Nextion Payload`

Send's normal Nextion Commands to the Screen (suffixed by 0xFFFFFF)


- `CustomSend Payload`

Send's normal Custom Commands to the Screen in the following format: 
`55 BB [payload length] [payload] [crc] [crc]`


- `FlashNextion URL`

Start's flashing a tft file to the nextion screen via Nextion Upload Protocol 1.2
Might be required to send the command twice (known issue, didn't investigate yet)

Webserver must be reachable via HTTP and support Range Header

Example: `FlashNextion http://192.168.75.30:8123/local/nspanel.tft`


Besides the commands, serial input will be published on 'RESULT' Topic, depending on the input in one of the following formats:
- `{"CustomRecv":%s}`
- `{"nextion":%s}`
