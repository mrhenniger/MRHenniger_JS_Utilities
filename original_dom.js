var Constant = Object.freeze({
    DEFAULT_INT: 0,
    DEFAULT_STR: '',
    DEFAULT_FLT: 0.0,
});



function newVue(eleID, params={methods:{}, data:{}, computed:{}}) {
    params.el = eleID;
    return new Vue(params);
}



let DomInterface = (function(ref = null) {
    ref = (typeof ref === 'object' && ref !== null && typeof ref.name === 'string' && ref.name === 'Strings') ? ref.str() : ref;

    let name = 'DomInterface';
    let __core = null;

    let refType = typeof ref;
    if (ref === null) {
        let temp = document.getElementsByTagName('body');
        __core = temp[0];
    } else if (refType === 'string' && ref === 'head') {
        let temp = document.getElementsByTagName('head');
        __core = temp[0];
    } else if (refType === 'string') {
        let temp = document.getElementsByTagName('body');
        __core = temp[0];
        first(ref);
    } else if (refType === 'object' && typeof ref.name === 'string' && ref.name === 'DomInterface') {
        __core = ref.getCore();
    } else if (refType === 'object' && ((typeof ref.name === 'undefined') || (ref.name === ''))) {
        __core = ref;
    } else {
        debugger;
        window.console.error('DomInterface::constructor - Unrecognized ref', ref);
    }

    function getCore() {
        return __core;
    }



    function find(eleID) {
        eleID = typeof eleID.name !== 'undefined' ? eleID : Strings(eleID);
        eleID = eleID.trim().whitespaceCondense();

        // Error Check - More than one #
        let idCount = eleID.count('#');
        if (idCount > 1) {
            window.console.error('DomInterface::find - eleID has more than one #', eleID);
            return null;
        }

        // Error Check - # not at start
        if (idCount === 1 && eleID.contains('#') && !eleID.starts('#')) {
            window.console.error('DomInterface::find - # in eleID is not at the start', eleID);
            return null;
        }

        // Determine the next search element and the remainder
        let layerCount = eleID.count(' ') + 1;
        let searchEleId = Strings('');
        let remainEleId = Strings('');
        if (layerCount === 1) {
            searchEleId = eleID;
        } else {
            searchEleId = eleID.stripAfterTag(' ');
            remainEleId = eleID.stripBeforeTag(' ');
        }

        // Search
        let elements = null;
        let classCount = searchEleId.count('.');
        if (classCount > 1) {
            elements = __getMultiples(searchEleId);
        } else if (searchEleId.starts('#')) {
            elements = __getElementById(searchEleId);
        } else if (searchEleId.starts('.')) {
            elements = __getElementsByClassName(searchEleId);
        } else {
            elements = __getElementsByTagName(searchEleId);
        }
        elements = elements === null ? [] : elements;
        // Note:  At this point elements is an array of raw javascript dom elements

        // Check that we are on a leaf node
        if (remainEleId.equals('')) {
            for (let i=0; i<elements.length; i++) {
                elements[i] = DomInterface(elements[i]);
            }
            return elements;
        }

        // Search into the next layer
        let ret = [];
        for(let j=0; j<elements.length; j++) {
            let anEle = DomInterface(elements[j]);
            let findResult = anEle.find(remainEleId);
            if (findResult.length > 0) {
                ret = ret.concat(findResult);
            }
        }

        return ret;
    }

    function __getMultiples(eleID) {
        if (typeof eleID === 'object' && eleID.name === 'Strings') {
            // Do nothing
        } else if (typeof eleID === 'string') {
            eleID = Strings(eleID);
        } else {
            window.console.error('DomInterface::__getMultiples - eleID invalid', eleID);
            return null;
        }
        eleID = eleID.rtrim('.').trim().rtrim('.');
        let firstEleIsAClass = eleID.starts('.');
        eleID = eleID.ltrim('.');

        // Error check
        if (eleID.contains(' ')) {
            window.console.error('DomInterface::__getMultiples - Invalid mulitiple identifier', eleID);
            return null;
        }

        // Compile the list of element class IDs
        let bits = eleID.explode('.');
        if (firstEleIsAClass) {
            bits[0] = bits[0].prepend('.');
        }
        let bitsSize = bits.length;
        let eleStrs = [];
        for (let i=0; i<bitsSize; i++) {
            let aBit = bits[i];
            if (!aBit.isEmpty()) {
                if (!aBit.starts('.')) {
                    aBit = aBit.prepend('.');
                }
                eleStrs.push(aBit);
            }
        }

        // If there are no resulting eles we can get out early
        let eleStrsSize = eleStrs.length;
        if (eleStrsSize === 0) {
            return [];
        }

        // Get a matching set for the first element
        let redux = find(eleStrs[0]);
        let reduxSize = redux.length;
        for (let reduxIndex=0; reduxIndex<reduxSize; reduxIndex++) {
            if (redux[reduxIndex] != null) {
                for (let eleStrsIndex=1; eleStrsIndex<eleStrsSize; eleStrsIndex++) {
                    let aClass = eleStrs[eleStrsIndex].ltrim('.');
                    if (!redux[reduxIndex].hasClass(aClass)) {
                        redux[reduxIndex] = null;
                        break;
                    }
                }
            }
        }

        // Package the return
        let ret = [];
        for (let reduxIndex=0; reduxIndex<reduxSize; reduxIndex++) {
            if (redux[reduxIndex] != null) {
                ret.push(redux[reduxIndex]);
            }
        }

        // Done!
        return ret;
    }

    function __getElementById(eleID) {
        if (typeof eleID === 'object' && eleID.name === 'Strings') {
            // Do nothing
        } else if (typeof eleID === 'string') {
            eleID = Strings(eleID);
        } else {
            window.console.error('DomInterface::__getElementById - eleID invalid', eleID);
            return null;
        }

        eleID = eleID.trim();
        if (!eleID.starts('#')) {
            window.console.error('DomInterface::__getElementById - Invalid eleID', eleID);
            return null;
        }
        eleID = eleID.ltrim('#');

        let ret = [];
        let searchResult = document.getElementById(eleID.str()); // Note:  By definition getElementById is not available to __core but rather document only.
        if (searchResult !== null) {
            ret.push(searchResult);
        }

        //Return the raw dom elements set of at most one
        return ret;
    }

    function __getElementsByClassName(eleID) {
        if (typeof eleID === 'object' && eleID.name === 'Strings') {
            // Do nothing
        } else if (typeof eleID === 'string') {
            eleID = Strings(eleID);
        } else {
            window.console.error('DomInterface::__getElementsByClassName - eleID invalid', eleID);
            return null;
        }

        eleID = eleID.trim();
        if (!eleID.starts('.')) {
            window.console.error('DomInterface::__getElementsByClassName - Invalid eleID', eleID);
            return null;
        }
        eleID = eleID.ltrim('.');

        let ret = [];
        let searchResultArr  = __core.getElementsByClassName(eleID.str());
        let searchResultSize = searchResultArr.length;
        for (let i=0; i<searchResultSize; i++) {
            ret.push(searchResultArr[i]);
        }

        //Return the raw dom elements set
        return ret;
    }

    function __getElementsByTagName(eleID) {
        if (typeof eleID === 'object' && eleID.name === 'Strings') {
            // Do nothing
        } else if (typeof eleID === 'string') {
            eleID = Strings(eleID);
        } else {
            window.console.error('DomInterface::__getElementsByTagName - eleID invalid', eleID);
            return null;
        }

        eleID = eleID.trim();
        if (eleID.starts('#') || eleID.starts('.')) {
            window.console.error('DomInterface::__getElementsByTagName - Invalid eleID', eleID.str());
            return null;
        }

        let ret = [];
        let searchResultArr  = __core.getElementsByTagName(eleID.str());
        let searchResultSize = searchResultArr.length;
        for (let i=0; i<searchResultSize; i++) {
            ret.push(searchResultArr[i]);
        }

        //Return the raw dom elements set
        return ret;
    }

    function first(eleID) {
        let collection = find(eleID);

        if (collection.length === 0) {
            return null;
        }

        return collection[0];
    }

    function last(eleID) {
        let collection = find(eleID);

        if (collection.length === 0) {
            return null;
        }

        return collection[collection.length - 1];
    }

    function size() {
        if (typeof __core !== 'array') {
            return null;
        }
        return __core.length;
    }

    function getIndex(index) {
        if (!isNanN(index)) {
            index = Integer(index);
        } else {
            throw('DomInterface::getIndex - invalid index: ' + String(index));
        }

        size = typeof __core === 'array' ? __core.length : 1;

        if (index < 0) {
            throw('DomInterface::getIndex - index (' + String(index) + ') out of bounds');
        } else if (index >= size) {
            throw('DomInterface::getIndex - index (' + String(index) + ') out of bounds - size(' + String(size) + ')');
        }

        if (typeof __core === 'array') {
            return DomInterface(__core[index]);
        } else {
            return DomInterface(__core);
        }
    }

    function expect(qty) {
        if (typeof qty === 'number') {
            qty = Number(qty);
            if (qty < 0 ) {
                throw('DomInterface::expect - negative qty: ' + String(qty));
            }
        } else {
            throw('DomInterface::expect - invalid qty: ' + String(qty));
        }

        let coreType = typeof __core;
        if (coreType === 'array') {
            if (__core.length === qty) {
                return DomInterface(__core);
            } else {
                throw('DomInterface::expect - invalid qty: ' + String(qty));
                return null;
            }
        } else if (qty !== 1) {
            throw('DomInterface::expect - invalid qty: ' + String(qty));
            return null;
        }

        return DomInterface(__core);
    }

    function create(eleTag, attributes={}) {
        let newEle = document.createElement(eleTag);

        let keys = Object.keys(attributes);
        let aKey = null;
        for (let index=0; index<keys.length; index++) {
            aKey = keys[index];
            newEle.setAttribute(aKey, attributes[aKey])
        }

        return DomInterface(newEle);
    }

    function remove() {
        __core.remove();
        __core = null;
        return null;
    }

    function att(attName, attVal) {
        if (typeof attVal === 'undefined') {
            return __core.getAttribute(attName);
        } else {
            __core.setAttribute(attName, attVal);
            return DomInterface(__core);
        }
    }

    function prepend(child) {
        let childEle = child.getCore();
        __core.prepend(childEle);
        return DomInterface(__core);
    }

    function append(child) {
        let childEle = child.getCore();
        __core.append(childEle);
        return DomInterface(__core);
    }

    function appendChild(child) {
        let childEle = child.getCore();
        __core.appendChild(childEle);
        return DomInterface(__core);
    }

    function reactAdd(refClass) {
        const root = ReactDOM.createRoot(__core);
        const e = React.createElement;
        root.render(e(refClass));
    }

    function addClass(refClass) {
        refClass = (typeof refClass === 'object' && typeof refClass.name === 'string' && refClass.name === 'Strings') ? refClass.str() : refClass;
        __core.classList.add(refClass);
        return DomInterface(__core);
    }

    function removeClass(targetClass) {
        __core.classList.remove(targetClass);
        return DomInterface(__core);
    }

    function hasClass(refClass) {
        refClass = (typeof refClass === 'object' && typeof refClass.name === 'string' && refClass.name === 'Strings') ? refClass.str() : refClass;
        return __core.classList.contains(refClass);
    }

    function getClassList() {
        return __core.classList;
    }

    function hide() {
        return addClass('hidden');
    }

    function show() {
        return removeClass('hidden');
    }

    function val(newVal) {
        if (typeof newVal === 'undefined') {
            return __core.value;
        }

        __core.value = newVal;
        return DomInterface(__core);
    }

    function innerHTML(newVal) {
        if (typeof newVal === 'undefined') {
            return __core.innerHTML;
        }

       newVal =
            typeof newVal === 'object' && typeof newVal.name !== 'unknown' && newVal.name === 'Strings' ?
            newVal.str() :
            newVal;

        __core.innerHTML = newVal;
        return DomInterface(__core);
    }

    function innerHTMLPrepend(newContent) {
        let current = __core.innerHTML;
        __core.innerHTML = newContent + __core.innerHTML;
        return DomInterface(__core);
    }

    function innerHTMLAppend(newContent) {
        let current = __core.innerHTML;
        __core.innerHTML = __core.innerHTML + newContent;
        return DomInterface(__core);
    }

    function innerHTMLWipe() {
        innerHTML('');
        return DomInterface(__core);
    }

    function __svg(content, att={}) {
        // Add the SVG
        innerHTMLAppend(content);

        // Find the SVG that was just added
        let svg = last('svg');
        let svgCore = svg.getCore();

        // Then in turn apply the attributes
        let keys = Object.keys(att);
        let aKey = null;
        for (let index=0; index<keys.length; index++) {
            aKey = keys[index];
            svgCore.setAttribute(aKey, att[aKey])
        }
    }
    function svg(imageName, att={}) {
        __svgCache = typeof __svgCache === 'undefined' ? {} : __svgCache;

        if (typeof __svgCache[imageName] !== 'undefined') {
            if (typeof __svgCache[imageName] === 'string') {
                __svg(__svgCache[imageName], att);
            } else {
                __svgCache[imageName].then(() => {
                    __svg(__svgCache[imageName], att);
                })
            }
        } else {
            __svgCache[imageName] = new Promise ((resolve,reject) => {
                let imagePath = startup.relativeBase + 'images/' + imageName + '.svg';
                file_getContents(imagePath, function (contents) {
                    __svgCache[imageName] = contents;
                    __svg(__svgCache[imageName], att);
                    resolve();
                }.bind(imageName));
            })
        }

        return DomInterface(__core);
    }

    function addAnnimationEnd(callback) {
        __core.addEventListener("webkitAnimationEnd", callback);
        __core.addEventListener("animationend", callback);
        return DomInterface(__core);
    }

    function removeAnnimationEnd(callback) {
        __core.removeEventListener("webkitAnimationEnd", callback);
        __core.removeEventListener("animationend", callback);
        return DomInterface(__core);
    }

    function addEvtLstnr(event, func) {
        __core.addEventListener(event, func);
        return DomInterface(__core);
    }

    function rmEvtLstnr(event, func) {
        __core.removeEventListener(event, func);
        return DomInterface(__core);
    }

    function children() {
        return __core.childNodes;
    }

    function firstChild() {
        if (__core.children.length === 0) {
            return null;
        }

        return DomInterface(__core.children[0]);
    }

    function nthChild(oneBasedIndex) {
        if (
            __core.children.length === 0 ||
            __core.children.length >= oneBasedIndex
        ) {
            return null;
        }

        let zeroBasedIndex = oneBasedIndex - 1;
        return DomInterface(__core.children[zeroBasedIndex]);
    }

    function lastChild() {
        if (__core.children.length === 0) {
            return null;
        }

        let lastIndex = __core.children.length - 1;
        return DomInterface(__core.children[lastIndex]);
    }

    function clone(srcNode) {
        let srcCore = srcNode.getCore();
        let srcClone = srcCore.cloneNode(true);
        __core.appendChild(srcClone);
        return DomInterface(__core);
    }


    function focus() {
        __core.focus();
        return DomInterface(__core);
    }

    function unfocus() {
        __core.blur();
        return DomInterface(__core);
    }


    function height(newVal) {
        // Check for getting value
        if (typeof newVal === 'undefined') {
            let ret = __core.style.height;
            let retType = typeof ret;
            if (retType === 'string' && ret.endsWith('px')) {
                ret = ret.substr(0,ret.length - 2);
                ret = parseInt(ret);
                return ret;
            }

            ret = __core.clientHeight;
            retType = typeof ret;
            if (retType === 'number') {
                return ret;
            }

            return null;
        }

        // Check for setting value
        if (typeof newVal !== 'number') {
            window.console.log('DomInterface::height - Parameter newValue is not a number');
            return null;
        }
        __core.style.height = newVal;

        // Returned modified element
        return DomInterface(__core);
    }

    function width(newVal) {
        // Check for getting value
        if (typeof newVal === 'undefined') {
            let ret = __core.style.width;
            let retType = typeof ret;
            if (retType === 'string' && ret.endsWith('px')) {
                ret = ret.substr(0,ret.length - 2);
                ret = parseInt(ret);
                return ret;
            }

            ret = __core.clientWidth;
            retType = typeof ret;
            if (retType === 'number') {
                return ret;
            }

            return null;
        }

        // Check for setting value
        if (typeof newVal !== 'number') {
            window.console.log('DomInterface::height - Parameter newValue is not a number');
            return null;
        }
        __core.style.width = newVal;

        // Returned modified element
        return DomInterface(__core);
    }





    /*
        function pic(imageName, att={}) {
            let newPic = create('picture');
            append(newPic);

            let imageNameSVG = 'images/' + imageName + '.svg';
            let newSVG = create('source', {type: 'image/svg+xml', srcset: imageNameSVG});
            newPic.append(newSVG);

    //        let imageNameWEBP = 'images/' + imageName + '.webp';
    //        let newWEBP = create('source', {type: 'image/webp', srcset: imageNameWEBP});
    //        newPic.append(newWEBP);

            let imageNamePNG = 'images/' + imageName + '.png';
            let newImgAlt = typeof att.alt === 'undefined' ? imageName : att.alt;
            let newImgPNG = create('img', {src: imageNamePNG, alt: newImgAlt});
            newPic.append(newImgPNG);

    //        let imageNameJPG = 'images/' + imageName + '.jpg';
    //        let newImgJPG = create('img', {src: imageNameJPG, alt: newImgAlt});
    //        newPic.append(newImgJPG);

            return newPic;
        }

        function svg(imageName, att={}) {
            att.type = 'svg';
            return pic(imageName, att);
        }

        function webp(imageName, att={}) {
            att.type = 'webp';
            return pic(imageName, att);
        }

        function png(imageName, att={}) {
            att.type = 'png';
            return pic(imageName, att);
        }

        function jpg(imageName, att={}) {
            att.type = 'jpg';
            return pic(imageName, att);
        }
    */

    return {
        __core: __core,
        name: name,
        getCore: getCore,
        find: find,
        first: first,
        last: last,
        size: size,
        getIndex: getIndex,
        expect: expect,
        create: create,
        remove: remove,
        att: att,
        prepend: prepend,
        append: append,
        appendChild: appendChild,
        reactAdd: reactAdd,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        getClassList: getClassList,
        hide: hide,
        show: show,
        focus: focus,
        unfocus: unfocus,
        val: val,
        innerHTML: innerHTML,
        innerHTMLPrepend: innerHTMLPrepend,
        innerHTMLAppend: innerHTMLAppend,
        innerHTMLWipe: innerHTMLWipe,
        svg: svg,
        addAnnimationEnd: addAnnimationEnd,
        removeAnnimationEnd: removeAnnimationEnd,
        addEvtLstnr: addEvtLstnr,
        rmEvtLstnr: rmEvtLstnr,
        children: children,
        firstChild: firstChild,
        nthChild: nthChild,
        lastChild: lastChild,
        clone: clone,
        height: height,
        width: width,
    }
});



// Note: the includer follows the "revealing object" pattern
var Includer = (function() {

    let __syncQueue              = [];
    let __syncProcessingCount    = 0;
    let __syncProcessingCallback = null;

    let __deferQueue = [];
    let __deferProcessingCount    = 0;
    let __deferProcessingCallback = null;

    let __headEle = DomInterface('head');

    let __ready = {};
    function ready(file) {
        if (typeof __ready[file] === 'undefined') {

        }
    };

    function __add(file, args, queue) {
window.console.log('includer::__add - ENTER', file, args);
        args.force = typeof args.force === 'undefined' ? false : args.force === true;

        if (typeof args.type === 'undefined') {
            if (file.endsWith('.js')) {
                args.type = 'js';
            } else if (file.endsWith('.css')) {
                args.type = 'css';
            }
        }

        if (args.type === 'module') {
            let base = startup.relativeBase + 'modules/' + file;
            __add(base + '.template', {type: 'template',        defer: args.defer, force: args.force}, queue);
            __add(base + '.css',      {type: 'text/css',        defer: args.defer, force: args.force}, queue);
            __add(base + '.js',       {type: 'text/javascript', defer: args.defer, force: args.force}, queue);
            return;
        } else if (args.type === 'svelte') {
            let base = startup.relativeBase + 'svelte/' + file + '/dist/bundle';
            __add(base + '.css',      {type: 'text/css',        defer: args.defer, force: args.force}, queue);
            __add(base + '.js',       {type: 'text/javascript', defer: args.defer, force: args.force}, queue);
            return;
        } else if (args.type === 'dialog') {
            let base = startup.relativeBase + 'dialogs/' + file;
            __add(base + '.template', {type: 'template',        defer: args.defer, force: args.force}, queue);
            __add(base + '.css',      {type: 'text/css',        defer: args.defer, force: args.force}, queue);
            __add(base + '.js',       {type: 'text/javascript', defer: args.defer, force: args.force}, queue);
            return;
        }





        queue.push({file: file, args: args});
    };

    function addSync(file, args) {
//window.console.log('includer::addSync - ENTER - file', file);
//if (Strings(file).starts('css')) {
//    debugger;
//}
        args.defer = false;
        __add(file, args, __syncQueue);
window.console.log('includer::addSync - EXIT', __syncQueue, __syncQueue.length);
    };

    function addDefer(file, args) {
//window.console.log('includer::addDefer - ENTER - file', file);
//if (Strings(file).starts('css')) {
//    debugger;
//}
        args.defer = true;
        __add(file, args, __deferQueue);
window.console.log('includer::addDefer - EXIT', __deferQueue, __deferQueue.length);
    }

    function __syncProcessingIncrement() {
        __syncProcessingCount++;
window.console.log('includer::__syncProcessingIncrement - __syncProcessingCount', __syncProcessingCount, __syncQueue);
        if (__syncProcessingCount >= __syncQueue.length) {
window.console.log('includer::__syncProcessingIncrement - Recognize sync complete');
            if (__syncProcessingCallback !== null) {
window.console.log('includer::__syncProcessingIncrement - Calling callback');
                __syncProcessingCallback.call();
                __syncQueue              = [];
                __syncProcessingCount    = 0;
                __syncProcessingCallback = null;
            }
        }
    };

    function __deferProcessingIncrement() {
        __deferProcessingCount++;
window.console.log('includer::__deferProcessingIncrement - __deferProcessingCount', __deferProcessingCount, __deferQueue);
        if (__deferProcessingCount >= __deferQueue.length) {
window.console.log('includer::__deferProcessingIncrement - Recognize sync complete');
            if (__deferProcessingCallback !== null) {
window.console.log('includer::__deferProcessingIncrement - Calling callback');
                __deferProcessingCallback.call();
                __deferQueue              = [];
                __deferProcessingCount    = 0;
                __deferProcessingCallback = null;
            }
        }
    };

    function __processInclude(file, args={}) {
//debugger;
        if (typeof args.type === 'undefined') {
            window.console.error('includer::__processInclude - Undefined type', file, args);
            return;
        }
        type = args.type;
        defer = typeof args.defer === 'undefined' ? false : args.defer === true;
        force = typeof args.force === 'undefined' ? false : args.force === true;
window.console.log('includer::__processInclude - file, type, defer, force', file, type, defer, force);

        __creator   = typeof __creator   === 'undefined' ? DomInterface('head')        : __creator;
        __dom       = typeof __dom       === 'undefined' ? DomInterface('body')        : __dom;
//debugger;
        __templates = typeof __templates === 'undefined' ? __dom.first('#templates') : __templates;

        switch (type) {
            case "js":
            case "text/javascript":
                type = 'text/javascript';
                break;
            case "css":
            case "text/css":
                type = 'text/css';
                break;
            case "template":
                // do nothing
                break;
            default:
                window.console.error('includer::__processInclude - unrecognized type', type);
        }

        if (type === 'template') {

            file_getContents(file, function(contents){
                let redux = file;
                let bits = null;
                if (redux.includes('.')) {
                    bits = redux.split('.');
                    bits.pop();
                    redux = bits.pop();
                }
                bits = redux.split('/');
                redux = bits.pop();

window.console.log('includer::__processInclude - template', file, redux);
                let newTemplate = __creator.create('template', {'id':redux + '-template'}).innerHTML(contents);

                __templates.append(newTemplate);

            }, force);

        } else {

            let tag = type === 'text/css' ? 'link' : 'script';
            let attributes = {};

            if( force ) file += '?' + String((new Date).getTime());
            if (type === 'text/css') {
                attributes.href = file;
            } else {
                attributes.src = file;
            }

            attributes.type = type;

            if (type === 'text/css') {
                attributes.rel = 'stylesheet';
            }

            attributes.defer = defer;
            if (defer === false) {
                attributes.onload = __syncProcessingIncrement();
            }

window.console.log('includer::__processInclude - appending:  ', tag, force, file, type, defer);

            let newInclude = __creator.create(tag, attributes);
            __headEle.append(newInclude);
        }
    };

    function __processSync(callback=null) {
        if (__syncQueue.length == 0) {
            if (callback !== null) {
                callback.call();
            }
            return false;
        }

        __syncQueue.forEach(function(aSync) {
            __processInclude(aSync.file, aSync.args);
        });

        if (callback !== null) {
            callback.call();
        }

        return true;
    };

    function __processDefer(callback=null) {
        if (__deferQueue.length == 0) {
            if (callback !== null) {
                callback.call();
            }
            return false;
        }

        __deferQueue.forEach(function(aDefer) {
            __processInclude(aDefer.file, aDefer.args);
        });

        if (callback !== null) {
            callback.call();
        }

        return true;
    };

    function process(syncCallback=null, deferCallback=null) {
        __syncProcessingCallback  = syncCallback  !== null ? syncCallback  : __syncProcessingCallback;
        __deferProcessingCallback = deferCallback !== null ? deferCallback : __deferProcessingCallback;

        __processSync(function(){
window.console.log('includer::process - Recognize syncs queued, calling defer');
            return __processDefer(__deferProcessingCallback);
        });
        if (__syncQueue.length === 0 && __syncProcessingCallback !== null) {
window.console.log('includer::process - Calling callback');
            __syncProcessingCallback.call();
        }

        return true;
    };

    return {
        addSync:  addSync,
        addDefer: addDefer,
        process:  process,
    }

})();


