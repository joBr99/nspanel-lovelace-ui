#!/bin/bash

#echo "All done!" > /share/example_addon_output.txt
export CONFIG_FILE=/share/config.yml
if test -f "$CONFIG_FILE"; then
    echo "$CONFIG_FILE exists."
else
    cp config.yml.example $CONFIG_FILE
fi
python main.py