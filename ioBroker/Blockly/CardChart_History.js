var sourceDP = 'alias.0.Wohnzimmer.Heizung.ACTUAL';
var targetDP = '0_userdata.0.Test.chartTest';
var rangeHours = 24;
var maxXAchsisTicks = 6;
var historyInstance = 'history.0';

on({id: sourceDP, change: "any"}, async function (obj) {
    sendTo(historyInstance, 'getHistory', {
        id: sourceDP,
        options: {
            start:     Date.now() - (60 * 60 * 1000 * rangeHours),
            end:       Date.now(),
            count:     rangeHours,
            limit:     rangeHours,
            aggregate: 'average'
        }
    }, function (result) {
        var cardChartString = "";
        var stepXAchsis = rangeHours / maxXAchsisTicks;

        for (var i = 0; i < rangeHours; i++){
            var deltaHour = rangeHours - i;
            var targetDate = new Date(Date.now() - (deltaHour * 60 * 60 * 1000));

            //Check history items for requested hours
            for (var j = 0, targetValue = 0; j < result.result.length; j++) {
                var valueDate = new Date(result.result[j].ts);
                var value = (Math.round(result.result[j].val * 10) / 10);

                if (valueDate > targetDate){                        
                    if ((targetDate.getHours() % stepXAchsis) == 0){
                        cardChartString += targetValue + '^' + targetDate.getHours() + ':00' + '~';
                    } else {
                        cardChartString += targetValue + '~';
                    }
                    break;
                } else {
                    targetValue = value;
                }
            }
        }
        
        cardChartString = cardChartString.substring(0,cardChartString.length-1);
        if (existsState(targetDP) == false ) { 
            createState(targetDP, cardChartString, true, { type: 'string' });
        } else {
            setState(targetDP, cardChartString, true);
        }
    });    
});