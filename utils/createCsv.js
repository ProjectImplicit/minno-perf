define(['./downloadFile.js', './UAParser.js'], function(downloadFile, UAParser){
    
    function createCsv(data, extraHeaders){
        var csv = [
            'Browser,"Browser Version","Short Browser Version",Engine,"Engine Version",OS,"OS Version",Measurement,Latency'.concat(extraHeaders ? ',' : '', extraHeaders || '')
        ];
        var parser = new UAParser();
        var ua = parser.getResult();
        var fileName = [ua.browser.name, ua.browser.version, ua.os.name, +new Date() + ''].map(snakeCase).join('-')+'.csv';
        var browserData = [
            ua.browser.name,
            ua.browser.version,
            /^[0-9]*/.exec(ua.browser.version)[0], // simplified browser version (only first number in string
            ua.engine.name,
            ua.engine.version,
            ua.os.name,
            ua.os.version
        ].map(escapeCsv);

        for (var key in data) {
            var dataArr = data[key];
            var csvArr = dataArr.map(function(value){ return browserData.concat(escapeCsv(key), value).join(','); });
            csv = csv.concat(csvArr);
        }

        downloadFile(fileName,csv.join('\n')); 
    }

    return createCsv;

    function snakeCase(value){return value.replace(/ /g,'_');}
    function escapeCsv(value){return '"' + escapeDoubleQuotes(value) + '"';}
    function escapeDoubleQuotes(str) { return str.replace(/\\([\s\S])|(")/g,'\\$1$2');}
});
