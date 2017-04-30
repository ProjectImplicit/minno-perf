define(function(){
    // Create a file and allow user to download it
    return downloadFile;

    /**
     * @name isIEBelow10
     * @description Checks whether current browser is IE and of version below 10
     */
    function isIEBelow10() {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) < 10 : false;
    }

    function isSafari(){ return /constructor/i.test(window.HTMLElement) || window.safari;}

    /**
     * by @cssensei (from his colleagues at https://github.com/ifeelgoods) in issue #2391
     *
     * @name downloadFile
     * @description Triggers download of a csv file.  Logic provided
     * @param {string} fileName the filename we'd like our file to be
     * @param {string} csvContent the csv content that we'd like to download as a file
     */
    function downloadFile(fileName, csvContent) {
        var D = document;
        var a = D.createElement('a');
        var strMimeType = 'application/octet-stream;charset=utf-8';
        var rawFile;

        if (!fileName) {
            var currentDate = new Date();
            fileName = 'CSV Export - ' + currentDate.getFullYear() + (currentDate.getMonth() + 1) +
                currentDate.getDate() + currentDate.getHours() +
                    currentDate.getMinutes() + currentDate.getSeconds() + '.csv';
        }

        if (isIEBelow10()) {
            var frame = D.createElement('iframe');
            document.body.appendChild(frame);

            frame.contentWindow.document.open('text/html', 'replace');
            frame.contentWindow.document.write('sep=,\r\n' + csvContent);
            frame.contentWindow.document.close();
            frame.contentWindow.focus();
            frame.contentWindow.document.execCommand('SaveAs', true, fileName);

            document.body.removeChild(frame);
            return true;
        }

        // IE10+
        if (navigator.msSaveBlob) {
            return navigator.msSaveBlob(new Blob(['\ufeff', csvContent], {
                type: strMimeType
            }), fileName);
        }

        //html5 A[download]
        if ('download' in a) {
            var blob = new Blob([csvContent], {
                type: strMimeType
            });
            rawFile = URL.createObjectURL(blob);
            a.setAttribute('download', fileName);
        } else {
            rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(csvContent);
            a.setAttribute('target', '_blank');
            a.setAttribute('download', fileName);
        }

        // this throws an error but saves the file nonetheless...
        if (isSafari()) return location.href = rawFile;

        a.href = rawFile;
        a.setAttribute('style', 'display:none;');
        D.body.appendChild(a);
        setTimeout(function() {
            if (a.click) {
                a.click();
                // Workaround for Safari 5
            } else if (document.createEvent) {
                var eventObj = document.createEvent('MouseEvents');
                eventObj.initEvent('click', true, true);
                a.dispatchEvent(eventObj);
            }
            //D.body.removeChild(a);

        }, 100);
    }
});
