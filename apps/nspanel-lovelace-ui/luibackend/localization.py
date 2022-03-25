translations = {
    'af_ZA': {
        'ACTIVATE': "Aktiveer",
    },
    'ca_ES': {
        'PRESS': "Prem",
        'ACTIVATE': "Activar",
    },
    'cs_CZ': {
        'PRESS': "Stisknutí",
        'ACTIVATE': "Aktivovat",
    },
    'cy_GB': {
        'ACTIVATE': "Actifadu",
    },
    'da_DK': {
        'PRESS': "Tryk",
        'ACTIVATE': "Aktiver",
    },
    'de_DE': {
        'PRESS': "Drücken",
        'ACTIVATE': "Aktivieren",
    },
    'en_GB': {
    },
    'en_US': {
        'PRESS': "Press",
        'ACTIVATE': "Activate",
    },
    'es_ES': {
        'PRESS': "Pulsa",
        'ACTIVATE': "Activar",
    },
    'et_EE': {
        'PRESS': "Vajuta nuppu",
        'ACTIVATE': "Aktiveeri",
    },
    'eu_ES': {
        'ACTIVATE': "Aktibatu",
    },
    'fi_FI': {
        'PRESS': "Paina",
        'ACTIVATE': "Aktivoi",
    },
    'fr_FR': {
        'PRESS': "Appui",
        'ACTIVATE': "Activer",
    },
    'fy_DE': {
    },
    'gl_ES': {
    },
    'hr_HR': {
        'ACTIVATE': "Aktivirati",
    },
    'id_ID': {
        'PRESS': "Tekan",
        'ACTIVATE': "Aktifkan",
    },
    'is_IS': {
        'PRESS': "Ýttu á",
        'ACTIVATE': "Virkja",
    },
    'it_IT': {
        'PRESS': "Premi",
        'ACTIVATE': "Attiva",
    },
    'nl_NL': {
        'PRESS': "Klik",
        'ACTIVATE': "Activeren",
    },
    'nn_NO': {
        'ACTIVATE': "Aktiver",
    },
    'pt_PT': {
        'PRESS': "Pressione",
        'ACTIVATE': "Ativar",
    },
    'sr_RS': {
        'PRESS': "Pritisnite taster",
        'ACTIVATE': "Aktiviraj",
    },
    'sv_SE': {
        'PRESS': "Tryck",
        'ACTIVATE': "Aktivera",
    },
}

def get_translation(locale, input):
    if locale in translations:
        return translations.get(locale).get(input, input)
    else:
        return input
    
