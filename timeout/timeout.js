define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...

    API.addSettings('onEnd', function(){
        var minnoLogs = window.piGlobal.current.logs.reduce(minnoReducer, {minno50:[], minno150:[], minno300:[]});
        statistics(minnoLogs.minno50);
        createCsv(minnoLogs);
    });

    API.addTrialSets('timeout', [
        {
            input: [ {handle: 'first',on: 'timeout',duration:'<%= trialData.duration %>'} ],
            stimuli: [ {media :' ', css: {background:'white', width:'100%', height:'100%'}} ],
            interactions: [
                {
                    conditions: [{type:'inputEquals',value:'first'}],
                    actions: [
                        {type:'log'},
                        {type:'endTrial'}
                    ]
                }
            ]
        }
    ]);

    API.addSequence([
        {
            mixer: 'repeat',
            times: REPEAT_TIMES,
            data: [
                {inherit: 'timeout', data: {duration:50}},
                {inherit: 'timeout', data: {duration:150}},
                {inherit: 'timeout', data: {duration:300}}
            ]
        }
        
    ]);

    return API.script;

    function minnoReducer(accu, log, index){
        var latency = log.latency;
        switch (index % 3){
            case 0: accu.minno50.push(latency); break;
            case 1: accu.minno150.push(latency); break;
            case 2: accu.minno300.push(latency); break;
        }
        return accu;
    }
});
