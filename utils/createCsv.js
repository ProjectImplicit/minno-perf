define(['./downloadFile.js', './UAParser.js'], function(downloadFile, UAParser){
    
    // headers is an array of descriptions for the data
    // data is an array of arrays with data corresponding to the headers
    // createCsv :: ([String], [String|Number]) -> String csv
    function createCsv(headers, data){
        var headRow = ['Browser','Browser Version','Short Browser Version','Engine','Engine Version','OS','OS Version']
            .concat(headers)
            .map(escapeCsv)
            .join(',');

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

        var rows = data
            .map(function(values){ return values.map(escapeCsv);})
            .map(function(values){ return browserData.concat(values);})
            .map(function(row){ return row.join(',');});

        var csv = [headRow]
            .concat(rows)
            .join('\n');

        downloadFile(fileName,csv); 
        return csv;
    }

    return createCsv;

    function snakeCase(value){return value.replace(/ /g,'_');}
    function escapeCsv(value){return '"' + escapeDoubleQuotes(value) + '"';}
    function escapeDoubleQuotes(str) { return typeof str === 'string' ? str.replace(/\\([\s\S])|(")/g,'\\$1$2') : str;}
});
