/*
 * @author 2023 @tt-tom
 * 
 * Version 5.1.1
 * 
 * Das Script erstellt die Datenpunkte und Alias für den Abfallkalender im Sonoff NSPanel
 * Es wird der iCal Adapter benötigt und eine URL mit Terminen vom Entsorger bzw. eine .ics-Datei mit den Terminen.
 * Das Script triggert auf dem bereitgestellten JSON im iCal adapter und füllt die 0_userdata.0 Datenpunkte
 * Weitere Informationen findest du in der FAQ auf Github https://github.com/joBr99/nspanel-lovelace-ui/wiki
 * 
 * changelog
 *  - 06.12.2023 - v5.0.2 add custom name for trashtype
 *  - 06.12.2023 - v5.1.0 Refactoring
 *  - 22.01.2024 - v5.1.1 Add tow Events more
 * 
 * 
*/


const idTrashData: string = 'ical.0.data.table'; // Datenpunkt mit Daten im JSON Format
const idUserdataAbfallVerzeichnis: string = '0_userdata.0.Abfallkalender'; // Name des Datenpunktverzeichnis unter 0_userdata.0 -> Strandard = 0_userdata.0.Abfallkalender
const idAliasPanelVerzeichnis: string = 'alias.0.NSPanel.allgemein'; //Name PanelVerzeichnis unter alias.0. Standard = alias.0.NSPanel.1
const idAliasAbfallVerzeichnis: string = 'Abfall'; //Name Verzeichnis unterhalb der idPanelverzeichnis  Standard = Abfall

const anzahlZeichenLoeschen: number = 14; // x Zeichen links vom String abziehen, wenn vor dem Eventname noch Text steht z.B. Strassenname; Standard = 0
const jsonEventName1: string = 'Hausmüll'; // Vergleichstring für Schwarze Tonne
const customEventName1: string = '';        // benutzerdefinierter Text für schwarze Tonne
const jsonEventName2: string = 'Gelber Sack'; // Vergleichstring für Gelbe Tonne / Sack
const customEventName2: string = '';        // benutzerdefinierter Text für gelbe Tonne
const jsonEventName3: string = 'Papier';    // Vergleichstring für Blaue Tonne
const customEventName3: string = '';       // benutzerdefinierter Text für blaue Tonne
const jsonEventName4: string = 'Biomüll';   // Vergleichstring für Braune Tonne
const customEventName4: string = '';        // benutzerdefinierter Text für braune Tonne
const jsonEventName5: string = 'Treppe';   // Vergleichstring für Event 5
const customEventName5: string = 'Besen schwingen';        // benutzerdefinierter Text für Event 5
const jsonEventName6: string = '';   // Vergleichstring für Event 6
const customEventName6: string = '';        // benutzerdefinierter Text für Event 6

const Debug: boolean = false;

// ------------------------- Trigger zum füllen der 0_userdata Datenpunkte aus dem json vom ical Adapter -------------------------------

// Trigger auf JSON Datenpunkt
on({ id: idTrashData, change: 'ne' }, async function () {
    JSON_auswerten();
});

// ------------------------------------- Ende Trigger ------------------------------------

// ------------------------------------- Funktion JSON auswerten und DP füllen -------------------------------
async function JSON_auswerten() {
    try {

        let trashJSON: any;
        let instanzName: any;
        let eventName: string;
        let eventDatum: string;
        let eventStartdatum: string;
        let farbNummer: number = 0;
        let farbString: string;
        let abfallNummer: number = 1;

        trashJSON = getState(idTrashData).val;
        instanzName = idTrashData.split('.');

        if (Debug) log('Rohdaten von Instanz ' + instanzName[0] + ': ' + JSON.stringify(trashJSON), 'info')


        if (Debug) log('Anzahl Trash - Daten: ' + trashJSON.length, 'info');

        for (let i = 0; i < trashJSON.length; i++) {
            if (abfallNummer === 7) {
                if (Debug) log('Alle Abfall-Datenpunkte gefüllt', 'warn');
                break;
            }

            log('Daten vom ical Adapter werden ausgewertet', 'info');
            eventName = getAttr(trashJSON, (String(i) + '.event')).slice(anzahlZeichenLoeschen, getAttr(trashJSON, (String(i) + '.event')).length);
            // Leerzeichen vorne und hinten löschen
            eventName = eventName.trimEnd();
            eventName = eventName.trimStart();
            eventDatum = getAttr(trashJSON, (String(i) + '.date'));
            eventStartdatum = getAttr(trashJSON, (String(i) + '._date'));

            let d: Date = currentDate();
            let d1: Date = new Date(eventStartdatum);

            if (Debug) log('--------- Nächster Termin wird geprüft ---------', 'info');
            //if (Debug)  log(d + ' ' + d1, 'info');
            if (Debug) log('Startdatum UTC: ' + eventStartdatum, 'info');
            if (Debug) log('Datum: ' + eventDatum, 'info');
            if (Debug) log('Event: ' + eventName, 'info');
            if (Debug) log('Kontrolle Leerzeichen %' + eventName + '%', 'info');

            if (d.getTime() <= d1.getTime()) {
                if ((eventName == jsonEventName1) || (eventName == jsonEventName2) || (eventName == jsonEventName3) || (eventName == jsonEventName4) || (eventName == jsonEventName5) || (eventName == jsonEventName6)) {

                    switch (eventName) {
                        case jsonEventName1:
                            farbNummer = 33840;
                            if (customEventName1 != '') {
                                eventName = customEventName1;
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                        case jsonEventName2:
                            farbNummer = 65504;
                            if (customEventName2 != '') {
                                eventName = customEventName2;
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                        case jsonEventName3:
                            farbNummer = 31;
                            if (customEventName3 != '') {
                                eventName = customEventName3
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                        case jsonEventName4:
                            farbNummer = 2016;
                            if (customEventName4 != '') {
                                eventName = customEventName4;
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                        case jsonEventName5:
                            farbNummer = 2016;
                            if (customEventName5 != '') {
                                eventName = customEventName5;
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                        case jsonEventName6:
                            farbNummer = 2016;
                            if (customEventName6 != '') {
                                eventName = customEventName6
                                if (Debug) log('Event customName: ' + eventName, 'info');
                            };
                            break;
                    }
                
                    //if (farbString != undefined) farbNummer = rgb_dec565(hex_rgb(farbString));


                    setState(idUserdataAbfallVerzeichnis + '.' + String(abfallNummer) + '.date', eventDatum);
                    setState(idUserdataAbfallVerzeichnis + '.' + String(abfallNummer) + '.event', eventName);
                    setState(idUserdataAbfallVerzeichnis + '.' + String(abfallNummer) + '.color', farbNummer);


                    //if (Debug) log('farbString: ' + farbString + ' farbNummer: ' + farbNummer, 'info');
                    if (Debug) log('Abfallnummer: ' + abfallNummer, 'info');

                    abfallNummer += 1
                } else {
                    if (Debug) log('Kein Abfalltermin => Event passt mit keinem Abfallnamen überein.', 'warn');
                }
            } else {
                if (Debug) log('Termin liegt vor dem heutigen Tag', 'warn');
            }
        }
    } catch (err) {
        log('error at subscrption: ' + err.message, 'warn');
    }
};

// ------------------------------------- Ende Funktion JSON ------------------------------

// ------------------------------------- Funktion zur Prüfung und Erstellung der Datenpunkte in 0_userdata.0 und alias.0 -----------------------

async function Init_Datenpunkte() {
    try {
        for (let i = 1; i <= 6; i++) {
            if (existsObject(idUserdataAbfallVerzeichnis + '.' + String(i)) == false) {
                log('Datenpunkt ' + idUserdataAbfallVerzeichnis + '.' + String(i) + ' werden angelegt', 'info')
                await createStateAsync(idUserdataAbfallVerzeichnis + '.' + String(i) + '.date', '', { type: 'string' });
                await createStateAsync(idUserdataAbfallVerzeichnis + '.' + String(i) + '.event', '', { type: 'string' });
                await createStateAsync(idUserdataAbfallVerzeichnis + '.' + String(i) + '.color', 0, { type: 'number' });
                setObject(idAliasPanelVerzeichnis + '.' + idAliasAbfallVerzeichnis, { type: 'device', common: { name: { de: 'Abfall', en: 'Trash' } }, native: {} });
                setObject(idAliasPanelVerzeichnis + '.' + idAliasAbfallVerzeichnis + '.event' + String(i), { type: 'channel', common: { role: 'warning', name: { de: 'Ereignis ' + String(i), en: 'Event' + String(i) } }, native: {} });
                await createAliasAsync(idAliasPanelVerzeichnis + '.' + idAliasAbfallVerzeichnis + '.event' + String(i) + '.TITLE', idUserdataAbfallVerzeichnis + '.' + String(i) + '.event', true, <iobJS.StateCommon>{ type: 'string', role: 'weather.title.short', name: { de: 'TITEL', en: 'TITLE' } });
                await createAliasAsync(idAliasPanelVerzeichnis + '.' + idAliasAbfallVerzeichnis + '.event' + String(i) + '.LEVEL', idUserdataAbfallVerzeichnis + '.' + String(i) + '.color', true, <iobJS.StateCommon>{ type: 'number', role: 'value.warning', name: { de: 'LEVEL', en: 'LEVEL' } });
                await createAliasAsync(idAliasPanelVerzeichnis + '.' + idAliasAbfallVerzeichnis + '.event' + String(i) + '.INFO', idUserdataAbfallVerzeichnis + '.' + String(i) + '.date', true, <iobJS.StateCommon>{ type: 'string', role: 'weather.title', name: { de: 'INFO', en: 'INFO' } });
                log('Fertig', 'info')
            } else {
                log('Datenpunkt ' + idUserdataAbfallVerzeichnis + '.' + String(i) + ' vorhanden', 'info')
            }
        }
        log('Startabfrage der Daten', 'info');
        JSON_auswerten();
    } catch (err) {
        log('error at function Init_Datenpunkte: ' + err.message, 'warn');
    }
}
Init_Datenpunkte();

// --------------------------- Ende Funktion Datenpunkte ------------------------------------------------


// --------------------------- Zusatzfuktionen -------------------------------------------------------------
function currentDate() {
    let d: Date = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function rgb_dec565(rgb: RGB): number {
    //return ((Math.floor(rgb.red / 255 * 31) << 11) | (Math.floor(rgb.green / 255 * 63) << 5) | (Math.floor(rgb.blue / 255 * 31)));
    return ((rgb.red >> 3) << 11) | ((rgb.green >> 2)) << 5 | ((rgb.blue) >> 3);
}

function hex_rgb(colorhex: string): RGB {
    let r = parseInt(colorhex.substring(1, 3), 16);
    let g = parseInt(colorhex.substring(3, 5), 16);
    let b = parseInt(colorhex.substring(5, 7), 16);
    return { red: r, green: g, blue: b };
}

type RGB = {
    red: number,
    green: number,
    blue: number
};

// -------------------- Ende Zudatzfunktionen --------------------------------------------------------------------------
