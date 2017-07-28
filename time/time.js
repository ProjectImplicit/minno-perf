define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...

    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs.map(function(log){return log.latency;});
        var minnoLogs = logs.map(function(v){return ['minno', v];});
        vanilla(function(vanillaLogs){
            var allLogs = vanillaLogs.concat(minnoLogs);
            console.log('minno stats:');
            statistics(logs);
            console.log('vanilla stats:');
            statistics(vanillaLogs.map(function(l){return l[1];}));
            createCsv(['Measurement', 'latency'], allLogs);
        });
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
                                {type:'resetTimer'}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'second'}],
                            actions: [
                                {type:'log'},
                                {type:'endTrial'}
                            ]
                        }
                    ]
                }
            ]
        }
        
    ]);

    return API.script;

    function vanilla(cb){
        var logs = [];
        var begin;
        document.addEventListener('keydown', listener);
        function listener(e){
            if (e.which === 65) begin = now();
            if (e.which === 66 && begin) logs.push(['vanilla', now() - begin]);
            if (logs.length >= REPEAT_TIMES) {
                document.removeEventListener('keydown', listener);
                cb(logs);
            }
        }
    }

    function now(){
        return performance ? performance.now() : Date.now();
    }
});
