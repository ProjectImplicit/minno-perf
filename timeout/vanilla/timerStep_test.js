define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor('stroop');

    API.addSettings('logger', {pulse:0});
    var counter = 0;

	API.addSequence([
        {
            mixer:'repeat',
            times: 100,
            data: [
                {
                    interactions: [
                        {
                            conditions:[{type:'begin'}],
                            actions: [
                                {type:'trigger',handle : 'step',duration:500}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'step'}],
                            actions: [
                                {type:'trigger',handle : 'end',duration:500}
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
			var averageLatency = _.reduce(logs, function(sum, log){return sum + log.latency;},0) / logs.length;

			console.log('Average latency:', averageLatency);

			// transform to arrays
			logs = _.map(logs, function(log){
				return [log.log_serial, log.latency].join(',');
			});

			// add headers
			logs.unshift(['serial', 'latency']);

			// join by newlines
			logs = logs.join('\r\n');

			// save file as csv
			// has to be .txt for IE
			//saveTextAs(logs, navigator.userAgent.replace(validFileNameRegex,'_')+'.txt');
		}
	});

	return API.script;
});
		
