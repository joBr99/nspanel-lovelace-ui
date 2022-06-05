import os
import json

def build_locale_filestring(locale):
    if locale in ["zh_CN", "zh_Hans_CN", "zh_Hans"]:
        locale = "zh-Hans"
    elif locale in ["zh_TW", "zh_Hant_TW", "zh_Hant"]:
        locale = "zh-Hant"
    elif locale == "en_GB":
        locale = "en-GB"
    elif locale == "pt_BR":
        locale = "pt-BR"
    else:
        locale = locale.split("_")[0]

    filename = f"{locale}.json"
    path_frontend_file = os.path.join(os.getcwd(), "translations", "frontend", filename)
    path_backend_file  = os.path.join(os.getcwd(), "translations", "backend" , filename)
    return path_frontend_file, path_backend_file

def lookup(path_frontend_file, path_backend_file, lookupstr):
    if not (os.path.exists(path_frontend_file) and os.path.exists(path_backend_file)):
        return "error"
    with open(path_frontend_file, 'r') as f, open(path_backend_file, 'r') as b:
        translations = { "frontend": json.load(f), "backend": json.load(b)}
        res = translations
        for k in lookupstr.split("."):
            if k in res:
                res = res[k]
        if type(res) is not str:
            res = "error"
        return res

def get_translation(locale, lookupstr):
    path_frontend_file, path_backend_file = build_locale_filestring(locale)
    res = lookup(path_frontend_file, path_backend_file, lookupstr)
    if res == "error":
        path_frontend_file, path_backend_file = build_locale_filestring("en_US")
        res = lookup(path_frontend_file, path_backend_file, lookupstr)
    return res

#print(get_translation("en_US", "frontend.state_attributes.climate.hvac_action.idle"))