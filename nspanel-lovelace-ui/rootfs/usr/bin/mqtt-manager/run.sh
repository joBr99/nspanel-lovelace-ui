#!/usr/bin/with-contenv bashio

if [ -z ${STANDALONE+x} ]; then
  export MQTT_USER=$(bashio::services "mqtt" "username")
  export MQTT_PASS=$(bashio::services "mqtt" "password")
  export MQTT_SERVER=$(bashio::services "mqtt" "host")
  export MQTT_PORT=$(bashio::services "mqtt" "port")
else
  echo "RUNNING IN STANDALONE MODE"
fi
export CONFIG_FILE=/config/panels.yaml
if test -f "$CONFIG_FILE"; then
    echo "$CONFIG_FILE exists."
else
    cp /usr/bin/mqtt-manager/panels.yaml.example $CONFIG_FILE
fi

declare LOGLEVEL
declare logtofile
LOGLEVEL=$(bashio::config 'loglevel')
logtofile=$(bashio::config 'logtofile')

export LOGLEVEL

if [[ "$logtofile" == "true" ]]; then
    python /usr/bin/mqtt-manager/main.py 2>&1 | tee /config/out.log
else
    python /usr/bin/mqtt-manager/main.py
fi
