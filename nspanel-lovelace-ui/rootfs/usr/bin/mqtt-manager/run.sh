#!/usr/bin/with-contenv bashio

# MQTT discovery runs in Python so failed Supervisor requests can be retried.
export CONFIG_FILE=/config/panels.yaml
if test -f "$CONFIG_FILE"; then
    echo "$CONFIG_FILE exists."
else
    cp /usr/bin/mqtt-manager/panels.yaml.example $CONFIG_FILE
fi

declare LOGLEVEL
declare logtofile
if [ -z "${STANDALONE+x}" ] && [ -n "${SUPERVISOR_TOKEN:-}" ]; then
  LOGLEVEL=$(bashio::config 'loglevel')
  logtofile=$(bashio::config 'logtofile')
else
  LOGLEVEL=${LOGLEVEL:-INFO}
  logtofile=${LOGTOFILE:-false}
fi

export LOGLEVEL

if [[ "$logtofile" == "true" ]]; then
    python /usr/bin/mqtt-manager/main.py 2>&1 | tee /config/out.log
else
    python /usr/bin/mqtt-manager/main.py
fi
