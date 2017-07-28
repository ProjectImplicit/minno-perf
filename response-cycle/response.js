define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 10;
    var delayMap = [300,700];
    var arduinoInputs = window.arduinoInputs = [];
    var mainStim = {media :' ', css: {background:'white', width:'100%', height:'100%'}};
    var allStim = [mainStim]
        .concat(
            [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]
                .map(function(left){
                    return {media :{html:'<div></div>'}, css: {background:'red'}, size: {width:5, height:5}, location:{top:5, left:left}};
                }),
            [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]
                .map(function(left){
                    return {media :{html:'<div></div>'}, css: {background:'red'}, size: {width:5, height:5}, location:{bottom:5, left:left}};
                })
        );

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...
    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs.map(function(log){return log.latency;});
        var arduino = arduinoInputs.map(function(row){return row.split(',');});
        var minnoLogs = logs.map(function(log,index){return ['minno', log].concat(arduino[index], delayMap[index % delayMap.length]);});
        createCsv(['Measurement', 'Player Latency','showlatency', 'hidelatency', 'delay'], minnoLogs);
    });

    API.addSequence([
        {
            mixer: 'repeat',
            times: REPEAT_TIMES,
            data: [
                {
                    input: [ 
                        {handle: 'first',on: 'keypressed',key:65},
                        {handle: 'second',on: 'keypressed',key:66}
                    ],

                    stimuli: allStim,

                    interactions: [
                        {
                            conditions: [{type:'inputEquals',value:'first'}],
                            actions: [
                                {type:'showStim',handle:'All'},
                                {type:'resetTimer'}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'second'}],
                            actions: [
                                {type: 'log'},
                                {type:'hideStim',handle:'All'},
                                {type:'removeInput', handle: 'All'},
                                {type:'setInput', input: arduinolisten() }
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'arduinoValue'}],
                            actions: [
                                {type:'endTrial'}
                            ]
                        }
                    ]
                }
            ]
        }
    ]);

    return API.script;

    function arduinolisten(){
        var result='';
        var listener;

        function on(cb){
            document.addEventListener('keydown', listener = function(e){
                if (e.which === 13) {e.preventDefault(); return cb(e, 'keydown');}
                var key = e.keyCode;
                result += key === 188 ? ',' : String.fromCharCode(key);
            });
        }

        function off(){
            arduinoInputs.push(result); // first char caches the keypress from before
            result='';
            document.removeEventListener('keydown', listener);
        }

        return {handle: 'arduinoValue', on:on, off:off};
    }
});
