"use strict";
/*
    Class:  Files
    What:  A class which provides access to local files and via http. NOTE:  THIS IS STILL UNDER DEVELOPMENT.  USE WITH
           CAUTION!!!
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  November 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class Files {
    /*
    * Function:  getContents
    *
    * Description:  A utility function intended to provide the similar functionality to the PHP function
    *               file_getContents.  Intended for the opening of text based files.
    *
    * @param  refFile  The file name containing the needed content.
    * @param  force  When true ignore the cache and do a full retrieve.
    *
    * @return  Promises  Resolves with the text content.
    */
    static getContents(refFile, force = false) {
        refFile = typeof refFile === 'string' ? refFile : refFile.str();
        let ret = new Promises();
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", refFile, true);
        if (force) {
            rawFile.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status == 200) {
                    ret.accept(rawFile.responseText);
                }
                else if (rawFile.status == 404) {
                    let errorMessage = `File::getContents - Failed to get refFile(${refFile})`;
                    ret.reject(errorMessage);
                    window.console.error(errorMessage);
                }
            }
        };
        rawFile.send();
        return ret;
        /* Note:  Have been exploring using fetch.  The call to response.json() is returning a promise which does not
                  resolve.  Have not understood this yet.  Leaving these notes in place for future exploration.
debugger;
        let ret = new Promises();
        fetch(refFile, {mode: 'no-cors'})
            .then(response => {
debugger;
                return response.json()
            })
            .then(data => {
                let content = data.results;
debugger;
                callback(content);
                //ret.accept(content);
            }).catch(() => {
                ret.reject('Failed to fetch contents for:  ' + refFile);
            });
        return ret;
        */
    }
    /*
    * Function:  getJson
    *
    * Description:  A utility function for getting the content of a json file and returning the parsed object.
    *
    * @param  refFile  The file name containing the needed json.
    * @param  force  When true ignore the cache and do a full retrieve.
    *
    * @return  Promises  Resolves with the text content.
    */
    static getJson(refFile, force = false) {
        refFile = typeof refFile === 'string' ? refFile : refFile.str();
        let ret = new Promises();
        let contentsPromise = Files.getContents(refFile, force);
        contentsPromise.then((content) => {
            let contentObj = JSON.parse(content);
            ret.accept(contentObj);
        }).catch(() => {
            let errorMessage = `File::getJson - Failed to get object from refFile(${refFile})`;
            ret.reject(errorMessage);
            window.console.error(errorMessage);
        });
        return ret;
    }
}
