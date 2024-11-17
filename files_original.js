



function file_getContents(refFile, callback, force=false) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", refFile, true);
    if (force) {
        rawFile.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status == "200") {
                callback(rawFile.responseText);
            } else if (rawFile.status == "404") {
                window.console.error('file_getContents - failed to get refFile(' + refFile + ')');
            }
        }
    }.bind(callback);
    rawFile.send(null);
}

function file_getJson(refFile, callback) {
    var getContentsCallback = function(contentsText) {
        var obj = JSON.parse(contentsText);
        callback(obj);
    }
    file_getContents(refFile, getContentsCallback);
}
