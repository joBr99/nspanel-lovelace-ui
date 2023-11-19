# https://developers.home-assistant.io/docs/add-ons/configuration#add-on-dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Copy Python requirements file
COPY requirements.txt /tmp/

# Setup base
# hadolint ignore=DL3003,DL3042
RUN \
    apk add --no-cache --virtual .build-dependencies \
    build-base=0.5-r3 \
    python3-dev=3.11.6-r0 \
    \
    && apk add --no-cache \
    py3-pip=23.1.2-r0 \
    py3-wheel=0.40.0-r1 \
    python3=3.11.6-r0 \
    \
    && pip install -r /tmp/requirements.txt \
    \
    && apk del --no-cache --purge .build-dependencies

# Copy root filesystem
COPY rootfs /
