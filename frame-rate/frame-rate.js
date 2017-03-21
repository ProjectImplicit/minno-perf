define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 200;
    var arduinoInputs = window.arduinoInputs = [];

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...
    API.addSettings('onEnd', function(){
        var logs = window.piGlobal.current.logs.map(function(log){return log.latency;});
        var arduino = arduinoInputs.map(function(row){return row.split(',');});
        var minnoLogs =  logs.map(function(log,index){return ['minno', log].concat(arduino[index]);});
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

                    stimuli: [ {media :' ', css: {background:'white', width:'100%', height:'100%'}} ],

                    interactions: [
                        {
                            conditions: [{type:'inputEquals',value:'first'}],
                            actions: [
                                {type:'custom', fn: () => console.log('first')},
                                {type:'showStim',handle:'All'},
                                {type:'resetTimer'}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'second'}],
                            actions: [
                                {type:'custom', fn: () => console.log('second')},
                                {type: 'log'},
                                {type:'hideStim',handle:'All'},
                                {type:'removeInput', handle: 'All' },
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
        var parent = document.body;
        var input = null;
        function on(cb){
            input = document.createElement('input');
            input.style.position = 'fixed';
            parent.appendChild(input);
            input.focus();
            input.addEventListener('keydown', function(e){
                if (e.which === 13) cb(e, 'keydown'); 
            });
        }

        function off(){
            arduinoInputs.push(input.value.substr(1)); // first char caches the keypress from before
            parent.removeChild(input);
            input = null; // don't leak memory
        }

        return {handle: 'arduinoValue', on:on, off:off};
    }
});
