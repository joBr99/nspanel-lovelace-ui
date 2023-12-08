const dp_userdata: string = '0_userdata.0.NSPanel';
const dp_alias: string = 'alias.0.NSPanel';

// Der nachfolgende Datenpunkt muss manuell angelegt werden
const dpAction: string = '0_userdata.0.example_boolean';  // anpassen

const Debug = false;

let intervallCounter: any;

let sec_timer = getState(dp_userdata + '.Countdown.Time').val;
on({ id: dp_userdata + '.Countdown.State', change: 'ne' }, async (obj) => {

  switch (obj.state.val) {
      case 'active':
    if (intervallCounter) { clearInterval(intervallCounter); intervallCounter = null; };
    intervallCounter = setInterval(async () => {
      if (getState(dp_userdata + '.Countdown.Time').val > 0) {
        sec_timer = getState(dp_userdata + '.Countdown.Time').val;
        setState(dp_userdata + '.Countdown.Time', (sec_timer - 1), false);
      } else {
        setState(dp_userdata + '.Countdown.Time', 0,  false);
        setState(dp_userdata + '.Countdown.State', 'idle', false);
        // An dieser Stelle kann auch noch eine Meldung an Alexa oder Telegram, etc. erfolgen
      }
    }, 1000);

          break;
      default:
    if (intervallCounter) { clearInterval(intervallCounter); intervallCounter = null; };

          break;
  }
});

async function Init_Datenpunkte() {
  if (existsState(dp_alias + '.Countdown.ACTUAL') == false) {
    await createStateAsync(dp_userdata + '.Countdown.Time', '0', { type: 'number'});
    await createStateAsync(dp_userdata + '.Countdown.State', 'paused', { type: 'string' });
    setObject(dp_alias + '.Countown', { type: 'channel', common: { role: 'level.timer', name: 'Countdown' }, native: {} });
    await createAliasAsync(dp_alias + '.Countdown.ACTUAL', dp_userdata + '.Countdown.Time', true, <iobJS.StateCommon>{ type: 'number', role: 'state', name: 'ACTUAL' });
    await createAliasAsync(dp_alias + '.Countdown.STATE', dp_userdata + '.Countdown.State', true, <iobJS.StateCommon>{ type: 'string', role: 'state', name: 'STATE' });
    log("<PageItem>{id: '"+ dp_alias + ".Countdown', name: 'Timer'}", 'info');
  }
}
Init_Datenpunkte();
