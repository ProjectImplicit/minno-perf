define(['pipAPI', 'underscore'], function(APIconstructor, _) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 10;

    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs;
        var delta = [];
        for (var i = 0; i < REPEAT_TIMES; i++) delta.push(logs[2*i+1].latency - logs[2*i].latency);
        console.log('average' , _.sum(delta) / delta.length);
        console.log('max' , _.max(delta));
        console.log('min' , _.min(delta));
        //console.log('sd' , sd(logs));
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
