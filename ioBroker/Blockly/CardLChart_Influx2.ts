/**
 * Dieses Script fragt eine influxDb ab, um Daten für die cardLcart (Liniendiagramm) zuberechnen und im richtigen Format bereitzustellen.
 * Es erstellt automatisch einen Datenpunkt.
 * Die Abfrage muss ggf. angepasst werden. Aktuell ermittelt sie Werte der letzten 24h, zu Stundenwerten zusammengefasst.
 */

const Debug = false; // true für erweiterte Ausgaben im Log
 
const NSPanel_Path = '0_userdata.0.NSPanel.';
const Path = NSPanel_Path + 'Influx2NSPanel.cardLChart.';
const InfluxInstance = 'influxdb.0';
const influxDbBucket = 'storage_short';
const numberOfHoursAgo = 24;
const xAxisTicksEveryM = 60;
const xAxisLabelEveryM = 240;
//
 
const sensors : Record<string, Record <string, string>> = {};
/**
 * Hier werden die Sensoren festgelegt nach flogendem Schema
 * 
 * sensors[‘Datenpunkt(kompletter Pfad) des Messwertes'] = {'taget': 'Name des Datenpunkt für die Chartwerte', 'measurement': 'genutzter Alias in der Influxdb für den Messwert'};
 * 
 * Wenn der Wert in der Datenbank keinen Alias hat bleibt der Wert 'measurement':  weg.
 * Jeder Messwert bekommt einen eigenen sensors[...] = {'target':....}
 */


sensors['netatmo-crawler.0.stationData.1.temperature'] = {'target':'AussenTemp', 'measurement':'wetter.temperatur'};
 
//  #####   ab hier keine Änderungen mehr nötig   #####
 
// create data source for NsPanel on script startup
Object.keys(sensors).forEach(async id => {
   await generateDateAsync(id);
});
 
// then listen to the sensors and update the data source states accordingly
on({ id: Object.keys(sensors), change: 'any' }, async function (obj) {
   if (!obj.id) {
       return;
   }
   await generateDateAsync(obj.id);
});
 
//__________________________
// Beschreibe diese Funktion: Daten generieren
async function generateDateAsync(sensorId: string) {
   let idMeasurement = sensors[sensorId].measurement;
   if (idMeasurement =='' ||idMeasurement == undefined) {idMeasurement = sensorId};
   const dataPointId:string = Path + sensors[sensorId].target +'.ACTUAL';
   if (Debug) log(`(f) generateDateAsync: ${sensorId} ${dataPointId} > ${idMeasurement}`);
   
   const query =[
       'from(bucket: "' + influxDbBucket + '")',
       '|> range(start: -' + numberOfHoursAgo + 'h)',
       '|> filter(fn: (r) => r["_measurement"] == "' + idMeasurement + '")',
       '|> filter(fn: (r) => r["_field"] == "value")',
       '|> drop(columns: ["from", "ack", "q"])',
       '|> aggregateWindow(every: 1h, fn: last, createEmpty: false)',
       '|> map(fn: (r) => ({ r with _rtime: int(v: r._time) - int(v: r._start)}))',
       '|> yield(name: "_result")'].join('');
 
   if (Debug) console.log('Query: ' + query);
 
   const result : any = await sendToAsync(InfluxInstance, 'query', query);
   if (result.error) {
       console.error(result.error);
       return;
   }
   if (Debug) console.log(JSON.stringify(result));
   const numResults = result.result.length;
   let coordinates : string = '';
   for (let r = 0; r < numResults; r++) 
   {
       const list : string[] = [];
       const numValues = result.result[r].length;
 
       for (let i = 0; i < numValues; i++) 
       {
           const time = Math.round(result.result[r][i]._rtime/1000/1000/1000/60);
           const value = Math.round(result.result[r][i]._value * 10);
           list.push(time + ":" + value);
       }
 
       coordinates = list.join("~");
       if (Debug) console.log(coordinates);
   }
 
   const ticksAndLabelsList : string[] = []
   const date = new Date();
   date.setMinutes(0, 0, 0);
   const ts = Math.round(date.getTime() / 1000); 
   const tsYesterday = ts - (numberOfHoursAgo * 3600);
   if (Debug) console.log('Iterate from ' + tsYesterday + ' to ' + ts + ' stepsize=' + (xAxisTicksEveryM * 60));
   for (let x = tsYesterday, i = 0; x < ts; x += (xAxisTicksEveryM * 60), i += xAxisTicksEveryM)
   {
       if ((i % xAxisLabelEveryM))
           ticksAndLabelsList.push('' + i);
       else
       {
           const currentDate = new Date(x * 1000);
           // Hours part from the timestamp
           const hours = "0" + String(currentDate.getHours());
           // Minutes part from the timestamp
           const minutes = "0" + String(currentDate.getMinutes());
           const formattedTime = hours.slice(-2) + ':' + minutes.slice(-2);
 
           ticksAndLabelsList.push(String(i) + "^" + formattedTime);
       }
   }
   if (Debug) console.log('Ticks & Label: ' + ticksAndLabelsList);
   if (Debug) console.log('Coordinates: ' + coordinates);
   await setOrCreate(dataPointId, ticksAndLabelsList.join("+") + '~' + coordinates, true);
}
 
//__________________________
// Beschreibe diese Funktion: Datenpunkte anlegen bzw. schreiben
async function setOrCreate(id : string, value : any, ack : boolean) {
   if (!(await existsStateAsync(id))) {
        await createStateAsync(id, value, {
           name: id.split('.').reverse()[0],
           desc: 'Sensor Values [~<time>:<value>]*',
           type: 'string',
           role: 'value',
       });
   } else {
       await setStateAsync(id, value, ack);
   }
}
