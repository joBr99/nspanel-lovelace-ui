# EspHome component

See my esphome.yaml for the config used on the nspanel device.
Messages are currently handled on the "on_incoming_msg" lambda. 
An proper implementation where you can configure the pages within esphome yaml is currently missing.
It should be possible to recact to buttonPress Events within this lambda. (through calling a home assistant service or something like that)

To flash a new tft file I'm currently switching to the offical nextion component, which is also in the esphome.yaml
It might be needed to switch to hidden page and disable recmod/reparse mod. To access hidden page press the hidden button 10 times.

![image](https://user-images.githubusercontent.com/29555657/149628769-2caa3ebc-1019-421b-b316-1845c55acf09.png)
