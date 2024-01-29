/**
* generate an JSON for display Power-Card on NSPanel
* Source: https://github.com/joBr99/nspanel-lovelace-ui/wiki/ioBroker-Card-Definitionen-(Seiten)#cardpower-ab-ts-script-v341
* Version: 0.1 - L4rs
*/
schedule("* * * * *", function () {
 
    // Definition der Datenpunkte für das JSON der POWER-Card und der anzuzeigenden Leistungswerte
    var powerCardJson = "0_userdata.0.NSPanel.Energie.PowerCard",
      pwr1 = "", // Batterie
      pwr2 = Math.round(getState("mqtt.0.SmartHome.Energie.PV.openDTU.114180710360.0.power").val),    // Solar
      pwr3 = "",    // Wind
      pwr4 = "",   // Verbraucher
      pwr5 = Math.round(getState("hm-rpc.0.MEQ0706303.1.POWER").val),    // Stromnetz
      pwr6 = 0, // Auto
      pwrHome = Math.round(pwr5 - pwr2);    // Berechnung des Energiefluss anstelle eines Datenpunktes
    
    // Definition der Keys im JSON
    var keys = ["id", "value", "unit", "icon", "iconColor", "speed"];
    
    // Definition der "Kacheln", inkl. StandardIcon. Es können alle Icon aus dem Iconmapping genutzt werden.
    // Kacheln die nicht genutzt werden sollen, müssen wie z.b. item1 formatiert sein
    var home = [0, pwrHome, "W", "home-lightning-bolt-outline", 0]; // Icon home
    var item1 = [1, pwr1, "", "", 0, ""];   // Icon battery-charging-60
    var item2 = [2, pwr2, "W", "solar-power-variant-outline", 3, pwr2 > 0 ? -2 : 0]; // Icon solar-power-variant
    var item3 = [3, pwr3, "", "", 0, ""];   // Icon wind-turbine
    var item4 = [4, pwr4, "", "", 0, ""];   // Icon shape
    var item5 = [5, pwr5, "W", "transmission-tower", 10, 10];   // Icon transmission-tower
    var item6 = [6, pwr6, "kW", "car-electric-outline", 5, 0];  // Icon car
    
    /**
     * JSON generieren und in den Datenpunkt schreiben,
     *
     *  --- ab hier keine Änderungen mehr ---
     */
    function func(tags, values) {
      return Object.assign(
        ...tags.map((element, index) => ({ [element]: values[index] }))
      );
    }
    
    setState(
      powerCardJson,
      JSON.stringify([
        func(keys, home),
        func(keys, item1),
        func(keys, item2),
        func(keys, item3),
        func(keys, item4),
        func(keys, item5),
        func(keys, item6),
      ])
    );
   });