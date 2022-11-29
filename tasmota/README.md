# Nextion Berry Driver (autoexec.be)

This berry driver is intended for the usage with a custom HMI/TFT firmware on nspanel and is based on the implementation of [peepshow-21's ns-flash](https://github.com/peepshow-21/ns-flash), but this implementation has the ability to skip directly to the end of the file by using HTTP Range Headers and is able to use higher serial speeds during flashing, which both lead into hugely improved flashing times.

It adds the following commands to Tasmota:

- `Nextion Payload`

Send's normal Nextion Commands to the Screen (suffixed by 0xFFFFFF)


- `CustomSend Payload`

Send's normal Custom Commands to the Screen in the following format: 
`55 BB [payload length] [payload] [crc] [crc]`

- `FlashNextion URL`

Start's flashing a tft file to the nextion screen via Nextion Upload Protocol 1.2

Webserver must be reachable via HTTP

Example: `FlashNextion http://192.168.75.30:8123/local/nspanel.tft`

- `GetDriverVersion`

Returns the version currently defined in the berry script

- `UpdateDriverVersion URL`

Downloads the autoexec.be script from the specified URL and loads it.

- `FlashNextionAdv[0-5] URL`

Start's flashing a tft file to the nextion screen with different Modi.

Nextion Upload Proto 1.2 with 921600 Baud (same as FlashNextion): `FlashNextionAdv0 http://nspanel.pky.eu/lui.tft`

Nextion Upload Proto 1.1 with 921600 Baud: `FlashNextionAdv1 http://nspanel.pky.eu/lui.tft`

Nextion Upload Proto 1.2 with 115200 Baud: `FlashNextionAdv2 http://nspanel.pky.eu/lui.tft`

Nextion Upload Proto 1.1 with 115200 Baud: `FlashNextionAdv3 http://nspanel.pky.eu/lui.tft`

Nextion Upload Proto 1.2 with 256000 Baud: `FlashNextionAdv4 http://nspanel.pky.eu/lui.tft`

Nextion Upload Proto 1.1 with 256000 Baud: `FlashNextionAdv5 http://nspanel.pky.eu/lui.tft`


Besides the commands, serial input will be published on 'RESULT' Topic, depending on the input in one of the following formats:
- `{"CustomRecv":%s}`
- `{"nextion":%s}`













<details>
  <summary>Nextion Berry Driver Legacy Range (Old version with HTTP Range Method)</summary>
 

This berry driver is intended for the usage with a custom HMI/TFT firmware on nspanel.

It adds the following commands to Tasmota:

- `Nextion Payload`

Send's normal Nextion Commands to the Screen (suffixed by 0xFFFFFF)


- `CustomSend Payload`

Send's normal Custom Commands to the Screen in the following format: 
`55 BB [payload length] [payload] [crc] [crc]`


- `FlashNextion URL`

Start's flashing a tft file to the nextion screen via Nextion Upload Protocol 1.1
Might be required to send the command twice (known issue, didn't investigate yet)

- `FlashNextionFast URL`

Start's flashing a tft file to the nextion screen via Nextion Upload Protocol 1.2
Might be required to send the command twice (known issue, didn't investigate yet)

Webserver must be reachable via HTTP and support Range Header

Example: `FlashNextion http://192.168.75.30:8123/local/nspanel.tft`

- `GetDriverVersion`

Returns the version currently defined in the berry script

- `UpdateDriverVersion URL`

Downloads the autoexec.be script from the specified URL and loads it.



Besides the commands, serial input will be published on 'RESULT' Topic, depending on the input in one of the following formats:
- `{"CustomRecv":%s}`
- `{"nextion":%s}`

  
</details>
