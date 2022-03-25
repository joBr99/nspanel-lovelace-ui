translations = {
    'de_DE': {
        'ACTIVATE': "AKTIVIEREN",
        'PRESS': "DRÜCKEN",
        }
}

def get_translation(locale, input):
    if locale in translations:
        return translations.get(locale).get(input, input)
    else:
        return input