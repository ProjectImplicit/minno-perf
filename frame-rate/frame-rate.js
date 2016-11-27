define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 10;

    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs;
        var minnoLogs = {
            displayLatency: logs.map(function(log){return log.latency;})
        };
        statistics(minnoLogs);
        createCsv(minnoLogs);
    });

    API.addSequence([
        {
            mixer: 'repeat',
            times: REPEAT_TIMES,
            data: [
                {
                    input: [ 
                        {handle: 'first',on: 'keypressed',key:'A'},
                        {handle: 'second',on: 'keypressed',key:'B'}
                    ],

                    stimuli: [ {media :' ', css: {background:'white', width:'100%', height:'100%'}} ],

                    interactions: [
                        {
                            conditions: [{type:'inputEquals',value:'first'}],
                            actions: [
                                {type:'showStim',handle:'All'},
                                {type: 'log'}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'second'}],
                            actions: [
                                {type: 'log'},
                                {type:'endTrial'}
                            ]
                        }
                    ]
                }
            ]
        }
    ]);

    return API.script;
});
