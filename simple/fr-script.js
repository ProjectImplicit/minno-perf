define(['pipAPI'], function(APIconstructor) {

    var API = new APIconstructor();

    API.addSequence([
        {
            mixer: 'repeat',
            times: 9,
            data: [
                {
                    input: [ {handle:'space',on:'space'} ],

                    stimuli: [ {media :' ', css: {background:'cyan', width:'300px', height:'300px'}} ],

                    interactions: [
                        {
                            conditions: [{type:'inputEquals',value:'space'}],
                            actions: [
                                {type:'showStim',handle:'All'},
                                { type: 'trigger', handle: 'end', duration: 500}
                            ]
                        },
                        {
                            conditions: [{type:'inputEquals',value:'end'}],
                            actions: [{type:'endTrial'}]
                        }
                    ]
                }
            ]
        }
    ]);

    return API.script;
});
