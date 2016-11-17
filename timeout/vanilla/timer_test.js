define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor('stroop');

    API.addSettings('logger', {pulse:0});
    var counter = 0;

	API.addSequence([
        {
            mixer:'repeat',
            times: 1000,
            data: [
                {
                    interactions: [
                        {
                            conditions:[{type:'begin'}],
                            actions: [
                                {type:'trigger',handle : 'end',duration:300}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'end'}],
                            actions: [
                                {type:'log'},
                                {type: 'custom', fn: function(){(counter++ % 10) ? 0 : console.log(counter)}},
                                {type:'endTrial'}
                            ]
                        }

                    ]
                }
            ]
        },

    ]);

	API.addSettings('hooks',{
		endTask: function(){
			var validFileNameRegex = /[,\/:*?""<>|]/g;
			var logs = API.getCurrent().logs;
			var values = logs.map(function(log){return log.latency});

			console.log('Average latency:', average(values));
			console.log('STD:', standardDeviation(values));
			console.log('Minmax', Math.min.apply(Math, values), Math.max.apply(Math, values));
		}
	});

	return API.script;

    function standardDeviation(values){
        var avg = average(values);

        var squareDiffs = values.map(function(value){
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }

    function average(data){
        var sum = data.reduce(function(sum, value){
            return sum + value;
        }, 0);

        var avg = sum / data.length;
        return avg;
    }
});

