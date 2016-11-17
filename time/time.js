define(['pipAPI', 'underscore'], function(APIconstructor, _) {

    var API = new APIconstructor();

    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs;
        console.log('average' , _.sum(logs, 'latency') / logs.length);
        console.log('max' , _.max(logs, 'latency').latency);
        console.log('min' , _.min(logs, 'latency').latency);
        console.log('sd' , sd(logs));
    });

    API.addSequence([
        {
            mixer: 'repeat',
            times: 100,
            data: [
                {
                    input: [ 
                        {handle: 'first',on: 'keypressed',key:'A'},
                        {handle: 'second',on: 'keypressed',key:'B'}
                    ],

                    stimuli: [ {media :' ', css: {background:'cyan', width:'300px', height:'300px'}} ],

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

    function sd(arr){
        var average = _.sum(arr, 'latency') / arr.length;
        var variance = _.sum(arr, function(log){return Math.pow(log.latency - average, 2);}) / arr.length;
        return Math.sqrt(variance);
    }

    return API.script;
});
