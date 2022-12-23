import os
import json
from collections import defaultdict

keys = {
    'frontend.ui.card.light.brightness':                            'lights.Brightness',
    'frontend.ui.card.light.color_temperature':                     'lights.Temperature',
    'backend.component.binary_sensor.state.window.off':             'window.closed',
    'backend.component.binary_sensor.state.window.on':              'window.opened',
    'backend.component.binary_sensor.state.door.off':               'door.closed',
    'backend.component.binary_sensor.state.door.on':                'door.opened',
    'frontend.ui.card.lock.lock':                                   'lock.LOCK',
    'frontend.ui.card.lock.unlock':                                 'lock.UNLOCK',
    'frontend.ui.card.cover.position':                              'blinds.Position',
    'frontend.ui.card.climate.currently':                           'thermostat.Currently',
    'frontend.ui.panel.config.devices.entities.state':              'thermostat.State',
    'frontend.ui.card.climate.operation':                           'thermostat.Action',

    'frontend.ui.card.button.press':                                'button.press',
    'frontend.ui.card.script.run':                                  'script.run',
    'frontend.ui.card.scene.activate':                              'scene.activate',
    'frontend.ui.card.vacuum.actions.start_cleaning':               'vacuum.start_cleaning',
    'frontend.ui.card.vacuum.actions.return_to_base':               'vacuum.return_to_base',
    'frontend.ui.card.cover.tilt_position':                         'blinds.tilt_position',
    'frontend.ui.card.fan.speed':                                   'fan.speed',
    'frontend.ui.card.timer.actions.start':                         'timer.start',
    'frontend.ui.card.timer.actions.pause':                         'timer.pause',
    'frontend.ui.card.timer.actions.cancel':                        'timer.cancel',
    'frontend.ui.card.timer.actions.finish':                        'timer.finish',
    'frontend.state_badge.alarm_control_panel.armed':               'alarm_control_panel.armed',
    'frontend.state_badge.alarm_control_panel.armed_away':          'alarm_control_panel.armed_away',
    'frontend.state_badge.alarm_control_panel.armed_custom_bypass': 'alarm_control_panel.armed_custom_bypass',
    'frontend.state_badge.alarm_control_panel.armed_home':          'alarm_control_panel.armed_home',
    'frontend.state_badge.alarm_control_panel.armed_night':         'alarm_control_panel.armed_night',
    'frontend.state_badge.alarm_control_panel.armed_vacation':      'alarm_control_panel.armed_vacation',
    'frontend.state_badge.alarm_control_panel.arming':              'alarm_control_panel.arming',
    'frontend.state_badge.alarm_control_panel.disarmed':            'alarm_control_panel.disarmed',
    'frontend.state_badge.alarm_control_panel.disarming':           'alarm_control_panel.disarming',
    'frontend.state_badge.alarm_control_panel.pending':             'alarm_control_panel.pending',
    'frontend.state_badge.alarm_control_panel.triggered':           'alarm_control_panel.triggered',
    'frontend.state_attributes.climate.hvac_action.cooling':        'hvac_action.cooling',
    'frontend.state_attributes.climate.hvac_action.drying':         'hvac_action.drying',
    'frontend.state_attributes.climate.hvac_action.fan':            'hvac_action.fan',
    'frontend.state_attributes.climate.hvac_action.heating':        'hvac_action.heating',
    'frontend.state_attributes.climate.hvac_action.idle':           'hvac_action.idle',
    'frontend.state_attributes.climate.hvac_action.off':            'hvac_action.off',
    'frontend.ui.card.alarm_control_panel.arm_away':                'alarm_control_panel.arm_away',
    'frontend.ui.card.alarm_control_panel.arm_custom_bypass':       'alarm_control_panel.arm_custom_bypass',
    'frontend.ui.card.alarm_control_panel.arm_home':                'alarm_control_panel.arm_home',
    'frontend.ui.card.alarm_control_panel.arm_night':               'alarm_control_panel.arm_night',
    'frontend.ui.card.alarm_control_panel.arm_vacation':            'alarm_control_panel.arm_vacation',
    'frontend.ui.card.alarm_control_panel.clear_code':              'alarm_control_panel.clear_code',
    'frontend.ui.card.alarm_control_panel.code':                    'alarm_control_panel.code',
    'frontend.ui.card.alarm_control_panel.disarm':                  'alarm_control_panel.disarm',
    'backend.component.climate.state._.off':                        'climate.off',
    'backend.component.climate.state._.heat':                       'climate.heat',
    'backend.component.climate.state._.cool':                       'climate.cool',
    'backend.component.climate.state._.heat_cool':                  'climate.heat_cool',
    'backend.component.climate.state._.auto':                       'climate.auto',
    'backend.component.climate.state._.dry':                        'climate.dry',
    'backend.component.climate.state._.fan_only':                   'climate.fan_only',
    'backend.component.timer.state._.active':                       'timer.active',
    'backend.component.timer.state._.idle':                         'timer.idle',
    'backend.component.timer.state._.paused':                       'timer.paused',
}


langs = ["en-US", "de-DE", "nl-NL", "da-DK", "es-ES", "fr-FR", "it-IT", "ru-RU", "nb-NO", "nn-NO", "pl-PL", "pt-PT", 
         "af-ZA", "ar-SY", "bg-BG", "ca-ES", "cs-CZ", "el-GR", "et-EE", "fa-IR", "fi-FI", "he-IL", "hr-xx", "hu-HU", 
         "hy-AM", "id-ID", "is-IS", "lb-xx", "lt-LT", "ro-RO", "sk-SK", "sl-SI", "sv-SE", "th-TH", "tr-TR", "uk-UA",
         "vi-VN", "zh-CN", "zh-TW"]


def build_locale_filestring(locale):
    if locale in ["zh-CN", "zh-Hans-CN", "zh-Hans"]:
        locale = "zh-Hans"
    elif locale in ["zh-TW", "zh-Hant-TW", "zh-Hant"]:
        locale = "zh-Hant"
    elif locale == "en_GB":
        locale = "en-GB"
    elif locale == "pt_BR":
        locale = "pt-BR"
    else:
        locale = locale.split("-")[0]

    filename = f"{locale}.json"
    dir_path = os.getcwd()
    path_frontend_file = os.path.join(dir_path, "apps", "nspanel-lovelace-ui", "luibackend", "translations", "frontend", filename)
    path_backend_file  = os.path.join(dir_path, "apps", "nspanel-lovelace-ui", "luibackend", "translations", "backend" , filename)
    return path_frontend_file, path_backend_file

def lookup(path_frontend_file, path_backend_file, lookupstr):
    with open(path_frontend_file, 'r', encoding="utf-8") as f, open(path_backend_file, 'r', encoding="utf-8") as b:
        translations = { "frontend": json.load(f), "backend": json.load(b)}
        res = translations
        for k in lookupstr.split("."):
            if k in res:
                res = res[k]
        if type(res) is not str:
            print(f"Warning result is not a String: {lookupstr}")
            res = ""
        return res

def get_translation(locale, lookupstr):
    path_frontend_file, path_backend_file = build_locale_filestring(locale)
    res = lookup(path_frontend_file, path_backend_file, lookupstr)
    if locale == "he_IL":
        res = res[::-1]
    return res
    
out = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
for src, dst in keys.items():
    dst = dst.split(".")
    for lang in langs:
        out[dst[0]][dst[1]][lang] = get_translation(lang, src)

#print(json.dumps(out, indent=4, ensure_ascii=False))

with open("ioBroker_NSPanel_locales_beta.json", "wb") as text_file:
    text_file.write(json.dumps(out, indent=4, ensure_ascii=False).encode('utf8'))
