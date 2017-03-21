define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...

    API.addSettings('onEnd', function(){
        var minnoLogs = window.piGlobal.current.logs.reduce(minnoReducer, []);
        vanillaTimeout(minnoLogs, createCsv);
        statistics(minnoLogs.filter(function(log){return log[0] === 'minno50';}));
        createCsv(['Measurement', 'Latency'], minnoLogs);
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
            case 0: accu.minno50.push(['minno50', latency]); break;
            case 1: accu.minno150.push(['minno150', latency]); break;
            case 2: accu.minno300.push(['minno300', latency]); break;
        }
        return accu;
    }

    function now(){
        return performance.now ? performance.now() : +new Date();
    }

    function testTimeout(results, delay, done){
        var begin = now();
        setTimeout(function(){
            results.push(['vanilla' + delay, now()-begin]);
            if (results.length < REPEAT_TIMES) testTimeout(results, delay, done);
            else done(results);
        }, delay);
    }

    function vanillaTimeout(logs, done){
        testTimeout(logs, 50, function(){
            console.log('finished vanilla50');
            testTimeout(logs, 150, function(){
                console.log('finished vanilla150');
                testTimeout(logs, 300, function(){
                    console.log('finished vanilla300');
                    done(logs);
                });
            });
        });
    }
});
