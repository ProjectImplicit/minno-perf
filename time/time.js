define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...

    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs.map(function(log){return log.latency;});
        statistics(logs);
        createCsv({Minno:logs});
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
});
