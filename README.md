# Note Current State
This is at a really early stage, I stated on the implementation of the serial protocol.

# NsPanel Custom Widget UI

This is a replacement for the stock ui on nspanel, it can be controlled via custom serial command, like the stock one (but with different commands). This enables a user experiance, where it's possible to use nspanel with custom UI, but without messing around with Nextion Editor, because it's possible to configure widgets.

# Custom Protocol
```
55 BB [payload length] [payload] [crc]
```

Payload length contains the number of bytes of the payload.

CRC is "CRC-16 (MODBUS) Big Endian" calculated over the payload

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.

## Example for valid Message
This message has to be generated for the Message "1337" (1337 is not a valid command, this is just an example)
```
55 BB  04  31 33 33 37  AB F1 00
```
