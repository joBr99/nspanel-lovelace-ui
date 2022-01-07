# Note Current State
This is at a really early stage, I stated on the implementation of the serial protocol.

# NsPanel Custom Widget UI

This is a replacement for the stock ui on nspanel, it can be controlled via custom serial command, like the stock one (but with different commands). This enables a user experiance, where it's possible to use nspanel with custom UI, but without messing around with Nextion Editor, because it's possible to configure widgets.

# Custom Protocol
```
55 BB [payload length] [payload] [crc]
```

This protocol does not try to implement broken JSON Commands with a specified type (lol).
Instead the commands are plain text commands with parameters.
