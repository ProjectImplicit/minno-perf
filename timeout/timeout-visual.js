define(['pipAPI', '../utils/statistics.js', '../utils/createCsv.js'], function(APIconstructor, statistics, createCsv) {

    var API = new APIconstructor();
    var REPEAT_TIMES = 100;
    var arduinoInputs = window.arduinoInputs = [];
    var delayMap = [100,110,150,400,800];

    API.addSettings('redirect', location.href + '#'); // prevent redirect so we have a chance to download...
    API.addSettings('onEnd', function(){
        var minnoLogs = window.piGlobal.current.logs.map(a => a.latency);
        var logs = arduinoInputs
            .map(function(row){return row.split(',');})
            .map(function(row){return ['minno'].concat(row);})
            .map(function(row,index){return row.concat(delayMap[index % delayMap.length], minnoLogs[index]);});
        createCsv(['Measurement', 'showlatency', 'hidelatency', 'delay', 'measuredto'], logs);
    });

    API.addTrialSets('timer', [{
        input: [ {handle: 'first',on: 'keypressed',key:65} ],
        stimuli: [ {media :' ', css: {background:'white', width:'100%', height:'100%'}} ],
        interactions: [
            {
                conditions: [{type:'inputEquals',value:'first'}],
                actions: [
                    {type:'showStim',handle:'All'},
                    {type:'removeInput', handle: 'All'},
                    {type:'resetTimer'},
                    {type: 'setInput', input: {on:'timeout', handle:'time', duration: '<%= trialData.delay %>'}}
                ]
            },
            {
                conditions: [{type:'inputEquals',value:'time'}],
                actions: [
                    {type:'hideStim',handle:'All'},
                    {type: 'log'},
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
    }]);

    API.addSequence([
        {
            mixer: 'repeat',
            times: REPEAT_TIMES,
            data: [
                {inherit:'timer', data:{delay:100}},
                {inherit:'timer', data:{delay:110}},
                {inherit:'timer', data:{delay:150}},
                {inherit:'timer', data:{delay:400}},
                {inherit:'timer', data:{delay:800}}
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
            input.style.opacity = 0;
            parent.appendChild(input);
            input.focus();
            input.addEventListener('keydown', function(e){
                if (e.which === 13) cb(e, 'keydown'); 
            });
        }

        function off(){
            arduinoInputs.push(input.value); // first char caches the keypress from before
            parent.removeChild(input);
            input = null; // don't leak memory
        }

        return {handle: 'arduinoValue', on:on, off:off};
    }
});
