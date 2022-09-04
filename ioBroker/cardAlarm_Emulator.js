//The further processing of the alarm system logic of cardAlarm is mainly carried out in an external script. This emulator can be used as a basis for an external alarm script

// Bitte nspanelAlarmPath anpassen
const nspanelAlarmPath = '0_userdata.0.NSPanel.Alarm.';

// Der Rest wird dynamisch für das jeweilige Panel ermittelt
const dpAlarmState = nspanelAlarmPath + 'AlarmState';
on({id: dpAlarmState, change: "ne"}, async function (obj) {
    if ((obj.state ? obj.state.val : "") == 'arming') {
        // weitere ioBroker-Überprüfung - z.B. Fenster offen
        console.log("Alles Okay - Alarm wird aktiviert")
        setStateDelayed(dpAlarmState, 'armed', false, parseInt(((1000) || "").toString(), 10), true);
    } else if ((obj.state ? obj.state.val : "") == 'pending') {
        console.log("Alles Okay - Alarm wird deaktiviert")
        setStateDelayed(dpAlarmState, 'disarmed', false, parseInt(((1000) || "").toString(), 10), true);
    } else if ((obj.state ? obj.state.val : "") == 'triggered') {
        console.log("Trigger ausgelöst - Alarm bleibt aktiv")
        // Wenn der PIN bei der Deaktivierung falsch war
        // Zum Beispiel Meldung an Telegram oder popupNotify
        // an Panel senden
    }
});
