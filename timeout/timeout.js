define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;

    var input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.top = 0;
    input.style.left = 0;
    input.style.color = 'black';
    document.body.appendChild(input);
    input.focus();

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...

    API.addSettings('onEnd', function(){
        var minnoLogs = window.piGlobal.current.logs.map(minnoMap);
        vanillaTimeout(minnoLogs, function(logs){
            createCsv(['Measurement','delay','latency'], logs);
        });
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
                {inherit: 'timeout', data: {duration:300}},
                {inherit: 'timeout', data: {duration:800}}

            ]
        }
        
    ]);

    return API.script;

    function minnoMap(log, index){
        var latency = log.latency;
        var delay = {0:50, 1:150, 2:300,3:800}[index % 4];
        return ['minno', delay, latency];
    }

    function now(){
        return performance.now ? performance.now() : +new Date();
    }

    function testTimeout(delay, done){
        var results = [];
        test();

        function test(){
            if (results.length >= REPEAT_TIMES) return done(results); // end recursion
            var begin = now();
            setTimeout(function(){
                results.push(['vanilla', delay, now()-begin]);
                test(); // recursion
            }, delay);
        }
    }

    function vanillaTimeout(results, done){
        testTimeout(50, function(logs){
            results = results.concat(logs);
            console.log('finished vanilla50');
            testTimeout(150, function(logs){
                results = results.concat(logs);
                console.log('finished vanilla150');
                testTimeout(300, function(logs){
                    results = results.concat(logs);
                    console.log('finished vanilla300');
                    testTimeout(800, function(logs){
                        results = results.concat(logs);
                        console.log('finished vanilla800');
                        done(results);
                    });
                });
            });
        });
    }
});
