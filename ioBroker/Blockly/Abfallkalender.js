const idAbfalliCal = 'ical.1'; // iCal Instanz zum Abfallkalender
const idZeichenLoeschen = 14; // x Zeichen links vom String abziehen, wenn vor dem Eventname noch Text steht z.B. Strassenname; Standard = 0
const idRestmuellName ='Hausmüll'; // Schwarze Tonne
const idWertstoffName = 'Gelber Sack'; // Gelbe Tonne / Sack
const idPappePapierName = 'Papier';  // Blaue Tonne
const idBioabfaelleName = 'Biomüll'; // Braune Tonne
 
 
var i, Muell_JSON, Event2, Color = 0;
 
for (i = 1; i <= 4; i++) {
    if (!existsState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.date')) {
        log(i + '.date nicht vorhanden, wurde erstellt');
        createState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.date', '',
            {
                name: parseFloat(i) + '.date',
                role: 'state',
                type: 'string',
                read: true,
                write: true,
                def: ''
            });
    };
    if (!existsState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.event')) {
        log(i + '.event nicht vorhanden, wurde erstellt');
        createState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.event', '',
            {
                name: parseFloat(i) + '.event',
                role: 'state',
                type: 'string',
                read: true,
                write: true,
                def: ''
            });
    };
    if (!existsState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.color')) {
        log(i + '.color nicht vorhanden, wurde erstellt');
        createState('0_userdata.0.Abfallkalender.' + parseFloat(i) + '.color', 0,
            {
                name: parseFloat(i) + '.color',
                role: 'state',
                type: 'number',
                read: true,
                write: true,
                def: 0
            });
    };
}
 
function subsequenceFromStartLast(sequence, at1) {
    var start = at1;
    var end = sequence.length;
    return sequence.slice(start, end);
}
 
on({ id: idAbfalliCal + '.data.table', change: "ne" }, async function () {
 
    for (i = 0; i <= 3; i++) {
        Muell_JSON = getState(idAbfalliCal + '.data.table').val;
        setStateDelayed((['0_userdata.0.Abfallkalender.', parseFloat(i) + 1, '.date'].join('')), getAttr(Muell_JSON, (String(i) + '.date')), false, parseInt(((0) || "").toString(), 10), false);
        Event2 = subsequenceFromStartLast(getAttr(Muell_JSON, (String(i) + '.event')), idZeichenLoeschen);
        setStateDelayed((['0_userdata.0.Abfallkalender.', parseFloat(i) + 1, '.event'].join('')), Event2, false, parseInt(((0) || "").toString(), 10), false);
        if (Event2 == idRestmuellName) {
            Color = 33840;
        } else if (Event2 == idBioabfaelleName) {
            Color = 2016;
        } else if (Event2 == idPappePapierName) {
            Color = 31;
        } else if (Event2 == idWertstoffName) {
            Color = 65504;
        }
        setStateDelayed((['0_userdata.0.Abfallkalender.', parseFloat(i) + 1, '.color'].join('')), Color, false, parseInt(((0) || "").toString(), 10), false);
    }
});
