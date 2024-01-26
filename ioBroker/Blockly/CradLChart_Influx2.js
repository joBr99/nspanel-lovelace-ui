const Debug = false;

const NSPanel_Path = '0_userdata.0.NSPanel.1.';
const Path = NSPanel_Path + 'Influx2NSPanel.cardLChart.';
const InfluxInstance = 'influxdb.1';
const influxDbBucket = 'iobroker';
const numberOfHoursAgo = 24;
const xAxisTicksEveryM = 60;
const xAxisLabelEveryM = 240;

// this records holds all sensors and their corresponding states which act as the data source for the charts
// add all sensors which are to be displayed in this script, there is no need to use multiple scripts
const sensors : Record<string, string> = {};
/*         ↓ Id of the sensor                 ↓ Id of the data source for the charts */
sensors['deconz.0.Sensors.65.temperature'] = Path + 'buero_temperature';
sensors['deconz.0.Sensors.65.humidity'] = Path + 'buero_luftfeuchte';

// create data source for NsPanel on script startup
Object.keys(sensors).forEach(async x => {
    await generateDateAsync(x, sensors[x]);
});

// then listen to the sensors and update the data source states accordingly
on({ id: Object.keys(sensors), change: 'any' }, async function (obj) {
    if (!obj.id) {
        return;
    }

    await generateDateAsync(obj.id, sensors[obj.id]);
});

async function generateDateAsync(sensorId: string, dataPointId: string) {
    const query =[
        'from(bucket: "' + influxDbBucket + '")',
        '|> range(start: -' + numberOfHoursAgo + 'h)',
        '|> filter(fn: (r) => r["_measurement"] == "' + sensorId + '")',
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
    
    if (Debug) console.log(result);
    const numResults = result.result.length;
    let coordinates : string = '';
    for (let r = 0; r < numResults; r++) 
    {
        const list : string[] = []
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