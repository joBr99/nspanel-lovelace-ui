const dp_userdata: string = '0_userdata.0.NSPanel';
const dp_alias: string = 'alias.0.NSPanel';

// dpAction wird wenn der Wecker gestellt wird auf false geschaltet
// dpAction wird wenn die Weckzeit erreicht ist auf true geschaltet
// Der nachfolgende Datenpunkt muss manuell erstellt werden...
const dpAction: string = '0_userdata.0.example_boolean';

const Debug = true;

let time: number;
let scheduleAlarmTime: any = null;
on({ id: dp_userdata + '.AlarmTime.State', change: 'ne' }, async (obj) => {

    time = getState(dp_userdata + '.AlarmTime.Time').val;
    if (Debug) log('Uhrzeit: ' + time, 'info');
    if ('paused' == obj.state.val) {
        await setStateAsync(dpAction, <iobJS.State>{ val: false, ack: true });
        (function () { if (scheduleAlarmTime) { 
            clearSchedule(scheduleAlarmTime); 
            scheduleAlarmTime = null; 
            } 
        });
    } else if ('active' == obj.state.val) {
        let stunde: number = Math.floor(time / 60);
        let minute: number = time % 60;
        if (Debug) log('Weckzeit: ' + ('0' + stunde).slice(-2) + ':' + ('0' + minute).slice(-2), 'info');
        scheduleAlarmTime = schedule(minute + ' ' + stunde + ' * * *', async () => {
            await setStateAsync(dpAction, <iobJS.State>{ val: false, ack: true });
            await setStateAsync(dp_userdata + '.AlarmTime.State', <iobJS.State>{ val: 'paused', ack: true });
        });
    }
});

async function Init_Datenpunkte() {
    if (existsState(dp_alias + '.AlarmTime.ACTUAL') == false) {
        await createStateAsync(dp_userdata + '.AlarmTime.Time', '0', { type: 'number' });
        await createStateAsync(dp_userdata + '.AlarmTime.State', 'paused', { type: 'string' });
        setObject(dp_alias + '.AlarmTime', { type: 'channel', common: { role: 'value.alarmtime', name: 'Alarmtime' }, native: {} });
        await createAliasAsync(dp_alias + '.AlarmTime.ACTUAL', dp_userdata + '.AlarmTime.Time', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
        await createAliasAsync(dp_alias + '.AlarmTime.STATE', dp_userdata + '.AlarmTime.State', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'STATE' });
        log("<PageItem>{id: '"+ dp_alias + ".AlarmTime', name: 'Wecker', onColor: Red, offColor: Green, useColor: true}", 'info');
    }
}
Init_Datenpunkte();
