// Pfad zum WLED-Modul
const wledPath = 'wled.0.2cf43212d23c.';

// Pfad zu 0_userdata Datenpunkten
const userdataPath = '0_userdata.0.NSPanelOwn.WLED.';

// WLED Effektliste als Konstante (Favoriten)
// Listen müssen gleiche Werte wie im Panel haben

const presetList =    ['Preset 0', 'Add Preset'];
        
const colorsList =    ['Default', '* Color 1', '* Color Gradient', '* Colors 1&2', '* Colors Only', '* Random Cycle', 'Analogus','April Night', 'Aqua Flash', 'Atlantica', 'Aurora', 
                        'Beach', 'Beech', 'Blink Red', 'Breeze', 'C9', 'C9 New', 'Candy', 'Candy2', 'Cloud', 
                        'Cyane', 'Departure', 'Drywet', 'Fairy Reaf', 'Fire', 'Forest', 'etc'
                    ];
        
const effectsList =   ['Solid', 'Android', 'Aurora', 'Blends', 'Blink', 'Blink Rainbow', 'Bouncing Balls','Bpm', 'Breathe', 'Candle', 'Candle Multi', 
                    'Candy Cane', 'Chase', 'Chase 1', 'Chase 2', 'Chase 3', 'Chase Flash', 'Chase Flash Rnd', 'Chase Rainbow', 'Chase Random', 
                    'Chunchun', 'Colorful', 'Colorloop', 'Colortwinkles', 'Colorwaves', 'Dancing Shadows', 'etc'
                    ];

on({id: userdataPath + 'Presets', change: "ne"}, async function (obj) {
    console.log(wledPath + 'ps' + ' = ' + obj.state.val);
    setState(wledPath + 'ps', obj.state.val)
});

// Trigger auf NSPanel Colors
on({id: userdataPath + 'Colors', change: "ne"}, async function (obj) {
    let wledObj = getObject(wledPath + 'seg.0.pal');
    let tempStringColor = colorsList[obj.state.val]

    for (let i = 1; i < 71; i++) {
        if (wledObj.common.states[i] == undefined) {
            break;
        }
        if (wledObj.common.states[i] == tempStringColor) {
            console.log(i + ' - ' + wledObj.common.states[i]);
            setState(wledPath + 'seg.0.pal', i)
            break;
        }
    }
});

// Trigger auf NSPanel Effekte
on({id: userdataPath + 'Effects', change: "ne"}, async function (obj) {
    let wledObj = getObject(wledPath + 'seg.0.fx');
    let tempStringEffect = effectsList[obj.state.val]

    for (let i = 1; i < 118; i++) {
        if (wledObj.common.states[i] == undefined) {
            break;
        }
        if (wledObj.common.states[i] == tempStringEffect) {
            console.log(i + ' - ' + wledObj.common.states[i]);
            setState(wledPath + 'seg.0.fx', i)
            break;
        }
    }
});
