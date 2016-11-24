define(['./downloadFile.js', './UAparser.js'], function(downloadFile, UAParser){
    
    function createCsv(data){
        var parser = new UAParser();
        var ua = parser.getResult();
        var csv = [];

        for (var key in data) {
            var dataArr = data[key];
            var fileName = [ua.browser.name, ua.browser.version, ua.os.name, +new Date() + ''].map(snakeCase).join('-')+'.csv';
            var browserData = [
                ua.browser.name,
                ua.browser.version,
                /^[0-9]*/.exec(ua.browser.version)[0], // simplified browser version (only first number in string
                ua.engine.name,
                ua.engine.version,
                ua.os.name,
                ua.os.version,
                key
            ].map(escapeCsv);

            var csvContent = browserData.concat(dataArr).join(',');
            csv.push(csvContent);
        }

        downloadFile(fileName,csvContent); 
    }

    return createCsv;

    function snakeCase(value){return value.replace(/ /g,'_');}
    function escapeCsv(value){return '"' + escapeDoubleQuotes(value) + '"';}
    function escapeDoubleQuotes(str) { return str.replace(/\\([\s\S])|(")/g,'\\$1$2');}
});
