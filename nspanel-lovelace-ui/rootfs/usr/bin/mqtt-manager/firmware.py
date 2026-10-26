"""TFT update negotiation for the existing Lovelace UI display protocol."""
import logging
import time
from urllib.parse import urlsplit

# Match the versioned firmware targets shipped with the AppDaemon backend.
DISPLAY_VERSION = 54
DISPLAY_RELEASE = 'v4.8.1'
MODELS = {'eu': '', 'us-p': '-us-p', 'us-l': '-us-l'}
PROMPT_ID = 'updateDisplayNoYes'


def firmware_settings(settings):
    model = settings.get('model', 'eu')
    mode = settings.get('updateMode', 'auto-notify')
    version = settings.get('displayFirmwareVersion', DISPLAY_VERSION)
    if model not in MODELS or mode not in ('manual', 'auto', 'auto-notify'):
        raise ValueError('Invalid firmware model or updateMode')
    if type(version) is not int or version < 16:
        raise ValueError('displayFirmwareVersion must be an integer of at least 16')
    url = settings.get(f'displayURL-{model.upper()}',
                       f'http://nspanel.pky.eu/lovelace-ui/github/nspanel{MODELS[model]}-{DISPLAY_RELEASE}.tft')
    if not isinstance(url, str):
        raise ValueError('Display firmware URL must be a string')
    parsed = urlsplit(url)
    if parsed.scheme != 'http' or not parsed.hostname or any(c.isspace() for c in url) or ';' in url:
        raise ValueError('Display firmware URL must be an HTTP URL without whitespace or semicolons')
    return model, mode, version, url


class FirmwareUpdater:
    def __init__(self, settings, queue, use_ha_api=False):
        self.model, self.mode, self.version, self.url = firmware_settings(settings)
        self.topic = settings['panelSendTopic']
        self.queue = queue
        self.use_ha_api = use_ha_api
        self.prompt = False
        self.started = None
        self.attempted = False
        self.dismissed = False

    @property
    def active(self):
        if self.started is not None and time.monotonic() - self.started > 600:
            logging.warning('TFT update on %s did not report startup within 10 minutes; check the device log', self.topic)
            self.started = None
        return self.prompt or self.started is not None

    def startup(self, fields):
        if len(fields) < 4:
            logging.warning('Startup has no TFT version/model on %s', self.topic)
            return False
        try:
            current = int(fields[2])
        except (TypeError, ValueError):
            logging.warning('Invalid TFT version on %s: %r', self.topic, fields[2])
            return False
        self.started = None
        self.prompt = False
        mismatch = fields[3] != self.model
        needed = current < self.version or mismatch
        if not needed or self.mode == 'manual' or self.dismissed:
            return False
        if self.attempted:
            logging.warning('TFT still differs from target on %s after update; not retrying automatically', self.topic)
            return False
        if current < 16:
            logging.warning('TFT on %s is too old for update dialogs; flash manually', self.topic)
            return False
        # A model change always requires explicit confirmation, even in auto mode.
        if self.mode == 'auto' and not mismatch:
            self.flash()
            return True
        self.prompt = True
        message = (f'Display firmware {current} ({fields[3]}) -> {self.version} ({self.model}). '
                   'Install now? Keep power connected during the update.')
        self.queue.put((self.topic, 'pageType~popupNotify'))
        self.queue.put((self.topic, f'entityUpdateDetail~{PROMPT_ID}~Display update~65535~Dismiss~65535~Install~65535~{message}~65535~0'))
        return True

    def button(self, fields):
        if len(fields) < 3 or fields[2] != PROMPT_ID:
            return None
        if not self.prompt:
            return 'ignored'
        value = fields[4] if len(fields) > 4 else None
        if value == 'yes':
            self.flash()
            return 'updating'
        if value == 'no' or (len(fields) > 3 and fields[3] == 'bExit'):
            self.prompt = False
            self.dismissed = True
            return 'resume'
        return 'ignored'

    def flash(self):
        if self.attempted:
            return
        if self.use_ha_api:
            command = (self.topic, self.url, 255)
        else:
            prefix, separator, suffix = self.topic.rpartition('/')
            if not separator or suffix != 'CustomSend':
                raise ValueError('TFT updates require panelSendTopic ending in /CustomSend')
            command = (prefix + '/FlashNextion', self.url)
        self.queue.put(command)
        self.prompt = False
        self.attempted = True
        self.started = time.monotonic()
        logging.info('Requested TFT update on %s to version %s (%s)', self.topic, self.version, self.model)
