var browserPerf = require('browser-perf');

var options = {
    preScript: function(browser){
        return browser
            .get('http://localhost/pip/src/index.html?url=/pip-perf/simple/fr-script.js')
            .then(function(){
                return browser.sleep(9000);
            })
            .then(function(){
                return browser.elementById('canvas');
            })
            .then(function(el){
                return el.sendKeys(' ');
            })
            .then(function(){
                return browser.sleep(1000);
            });
    },

    actions: [

    ]
}

browserPerf('', function(err, res){
    if (err) throw err;
    console.log(res);
}, options);
