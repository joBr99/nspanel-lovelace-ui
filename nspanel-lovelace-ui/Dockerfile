# https://developers.home-assistant.io/docs/add-ons/configuration#add-on-dockerfile
ARG BUILD_ARCH
FROM ghcr.io/hassio-addons/base-python/${BUILD_ARCH}:12.0.2

LABEL org.opencontainers.image.title="Home Assistant Add-on: NSPanel Lovelace UI"
LABEL org.opencontainers.image.description=""
LABEL org.opencontainers.image.source="https://github.com/joBr99/nspanel-lovelace-ui"

COPY rootfs/usr/bin/mqtt-manager/requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

# Copy root filesystem
COPY rootfs /

RUN chmod +x /usr/bin/mqtt-manager/run.sh
