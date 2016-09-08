var browserPerf = require('browser-perf');

let click = browser => browser 
    .elementById('canvas')
    .then(el => el.sendKeys(' '));
    
let sleep = browser => browser.sleep(1000);

var options = {
    preScript: browser => browser
        .get('http://localhost/pip/src/index.html?url=/pip-perf/simple/fr-script.js')
        .then(() => browser.waitForElementByCss('#canvas', 5000)),

    metrics: ['TimelineMetrics', 'ChromeTracingMetrics', 'RafRenderingStats'],
    actions: [
        click, sleep, click, sleep, click, sleep
    ]
};

browserPerf('', function(err, res){
    if (err) throw err;
    res = res[0];

    var docs = new browserPerf.docs();
    var Table = require('cli-table');
    var table = new Table({head:['prop', 'value', 'summary'], truncate:'...'});

    for (var i in res){
        table.push([
            i, 
            res[i] + ' ' + (docs.getProp(i, 'unit') || '') , 
            (docs.getProp(i, 'summary') || '') + '\n' +  (docs.getProp(i, 'details') || '')]);
    }

    console.log(table.toString());
}, options);
