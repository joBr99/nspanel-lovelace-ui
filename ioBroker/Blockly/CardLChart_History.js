const sourceDP = 'alias.0.Wohnzimmer.Heizung.ACTUAL';
const targetDP = '0_userdata.0.Test.chartTest';
const numberOfHoursAgo = 24;   // Period of time in hours which shall be visualized
const xAxisTicksEveryM = 60;   // Time after x axis gets a tick  in minutes
const xAxisLabelEveryM = 240;  // Time after x axis is labeled  in minutes
const historyInstance = 'history.0';

const Debug = false;
const maxX = 1420;
const limitMeasurements = 35;

createState(targetDP, "", {
        name: 'SensorGrid',
        desc: 'Sensor Values [~<time>:<value>]*',
        type: 'string',
        role: 'value',
});

on({id: sourceDP, change: "any"}, async function (obj) {
    sendTo(historyInstance, 'getHistory', {
        id: sourceDP,
        options: {
            start:     Date.now() - (numberOfHoursAgo * 60 * 60 * 1000 ), //Time in ms: hours * 60m * 60s * 1000ms
            end:       Date.now(),
            count:     limitMeasurements,
            limit:     limitMeasurements,
            aggregate: 'average'
        }
    }, function (result) {
        var ticksAndLabels = ""
        var coordinates = "";
        var cardLChartString = "";

        let ticksAndLabelsList = []
        var date = new Date();
        date.setMinutes(0, 0, 0);
        var ts = Math.round(date.getTime() / 1000);
        var tsYesterday = ts - (numberOfHoursAgo * 3600);
        
        for (var x = tsYesterday, i = 0; x < ts; x += (xAxisTicksEveryM * 60), i += xAxisTicksEveryM)
        {
            if (i % xAxisLabelEveryM) 
            {
                ticksAndLabelsList.push(i);
            } else 
            {
                var currentDate = new Date(x * 1000);
                // Hours part from the timestamp
                var hours = "0" + currentDate.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + currentDate.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + currentDate.getSeconds();
                var formattedTime = hours.slice(-2) + ':' + minutes.slice(-2);
                ticksAndLabelsList.push(String(i) + "^" + formattedTime);
            }
        }
        ticksAndLabels = ticksAndLabelsList.join("+");        

        let list = [];
        let offSetTime = Math.round(result.result[0].ts / 1000);
        let counter = Math.round((result.result[result.result.length -1 ].ts / 1000 - offSetTime) / maxX);        
        for (var i = 0; i <  result.result.length; i++) 
        {           
            var time = Math.round(((result.result[i].ts / 1000) - offSetTime) / counter);
            var value = Math.round(result.result[i].val * 10);
            if ((value != null) && (value != 0)){
                list.push(time + ":" + value)
            }
        }

        coordinates = list.join("~");
        cardLChartString = ticksAndLabels + '~' + coordinates
        setState(targetDP, cardLChartString, true);
        
        if (Debug) console.log(cardLChartString);
    });    
});