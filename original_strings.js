let Strings = (function(ref) {
    let name = 'Strings';

    let __coreStr = null;
    let refType = typeof ref;
    if (refType === 'undefined' || ref === '') {
        __coreStr = '';
    } else if (refType === 'string') {
        __coreStr = ref;
    } else if (refType === 'number') {
        __coreStr = String(ref);
    } else if (ref === true) {
        __coreStr = 'true';
    } else if (ref === false) {
        __coreStr = 'false';
    } else if (ref === null) {
        __coreStr = 'null';
    } else if (refType === 'object') {
        if (typeof ref.name === 'Strings' && typeof ref.str !== 'undefined') {
            __coreStr = ref.str();
        } else {
            // Note:  Objects should not be passed into the constructor directly
            __coreStr = JSON.stringify(ref);
        }
    } else {
        window.console.error('Strings::constructor - Unrecognized ref', ref);
    }

    function str() {
        return __coreStr;
    }

    function isEmpty() {
        return __coreStr === '';
    }

    function equals(rightSide) {
        rightSide = typeof rightSide.name !== 'undefined' ? rightSide.str() : rightSide;
        return __coreStr === rightSide;
    }

    function count(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if (__coreStr === '' || needle === '') {
            return 0;
        }

        return __coreStr.split(needle).length - 1;
    }

    function starts(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if ((__coreStr !== '' && needle === '') || (__coreStr === '' && needle !== '')) {
            return false;
        }
        if (typeof needle !== 'string') {
            window.console.error('Strings::starts - needle is not a string', needle);
            return false;
        }

        return __coreStr.startsWith(needle);
    }

    function ends(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if ((__coreStr !== '' && needle === '') || (__coreStr === '' && needle !== '')) {
            return false;
        }
        if (typeof needle !== 'string') {
            window.console.error('Strings::ends - needle is not a string', needle);
            return false;
        }

        return __coreStr.endsWith(needle);
    }

    function contains(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if ((__coreStr !== '' && needle === '') || (__coreStr === '' && needle !== '')) {
            return false;
        }
        if (typeof needle !== 'string') {
            window.console.error('Strings::contains - needle is not a string', needle);
            return false;
        }

        return __coreStr.includes(needle);
    }

    function prepend(ref) {
        __coreStr = (new Strings(ref)).str() + __coreStr;
        return Strings(__coreStr);
    }

    function append(ref) {
        __coreStr = __coreStr + (new Strings(ref)).str();
        return Strings(__coreStr);
    }

    function stripHtml()
    {
        let mod = __coreStr.replace(/<(?:.|\n)*?>/gm, '');
        mod = String(mod).trim();

        return Strings(mod);
    }

    function conditionForXML()
    {
        let conditioned = String(refStr).trim();
        var before = '';
        while( conditioned != before )
        {
            before = conditioned;
            conditioned = conditioned.replace('&',  ' and ');
            conditioned = conditioned.replace('  ', ' ');
        }
        return Strings(conditioned);
    }

    function ltrim(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if (typeof needle !== 'string') {
            window.console.error('Strings::ltrim - needle is not a string', needle);
            return false;
        }

        if (__coreStr === '' || needle === '' || (__coreStr.length < needle.length)) {
            return Strings(__coreStr);
        }

        if (__coreStr.startsWith(needle)) {
            let mod = __coreStr.substring(needle.length);
            let ret = Strings(mod);

            if (mod.startsWith(needle)) {
                return ret.rtrim(needle);
            }

            return ret;
        }

        return Strings(__coreStr);
    }

    function rtrim(needle) {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if (typeof needle !== 'string') {
            window.console.error('Strings::rtrim - needle is not a string', needle);
            return false;
        }

        if (__coreStr === '' || needle === '' || (__coreStr.length < needle.length)) {
            return Strings(__coreStr);
        }

        if (__coreStr.endsWith(needle)) {
            let diff = __coreStr.length - needle.length;
            let mod = __coreStr.substring(0, diff);
            let ret = Strings(mod);

            if (mod.endsWith(needle)) {
                return ret.rtrim(needle);
            }

            return ret;
        }

        return Strings(__coreStr);
    }

    function trim(needle = ' ') {
        needle = typeof needle.name !== 'undefined' ? needle.str() : needle;
        if (typeof needle !== 'string') {
            window.console.error('Strings::trim - needle is not a string', needle);
            return false;
        }

        if (__coreStr === '' || needle === '' || (__coreStr.length < needle.length)) {
            return Strings(__coreStr);
        }

        return ltrim(needle).rtrim(needle);
    }

    function whitespaceCondense() {
        let before = '';
        let mod = __coreStr;
        while (before != mod) {
            before = mod;
            mod = mod.replace('\n\r', '\n');
            mod = mod.replace('\r\n', '\n');
            mod = mod.replace(' \n',  '\n');
            mod = mod.replace('\n ',  '\n');
            mod = mod.replace(' \t',  '\t');
            mod = mod.replace('\t ',  '\t');
            mod = mod.replace('  ', ' ');
        }
        return Strings(mod);
    }

    function stripBeforeTag(tag) {
        tag = typeof tag.name !== 'undefined' ? tag.str() : tag;

        // Error Check - Bad tag
        if (typeof tag !== 'string') {
            window.console.error('Strings::stripBeforeTag - tag is not a string', tag);
            return false;
        }

        if (tag === '') {
            return String(__coreStr);
        }

        let pos = __coreStr.indexOf(tag);
        if (pos === -1) {
            return String(__coreStr);
        }

        let mod = __coreStr.substring(pos);
        return Strings(mod);
    }

    function stripAfterTag(tag) {
        tag = typeof tag.name !== 'undefined' ? tag.str() : tag;

        // Error Check - Bad tag
        if (typeof tag !== 'string') {
            window.console.error('Strings::stripAfterTag - tag is not a string', tag);
            return false;
        }

        if (tag === '') {
            return String(__coreStr);
        }

        let pos = __coreStr.indexOf(tag);
        if (pos === -1) {
            return String(__coreStr);
        }
        pos += tag.length;

        let mod = __coreStr.substring(0, pos);
        return Strings(mod);
    }

    function explode(delimit) {
        let delimitCount = count(delimit);
        if (delimitCount >= 1) {
            // Do nothing
        } else if (delimitCount == 0) {
            let retItem = Strings(__coreStr);
            return [retItem];
        } else {
            return [];
        }

        let bits = __coreStr.split(delimit);
        let bitsSize = bits.length;
        let ret = [];
        for (let i=0; i<bitsSize; i++) {
            ret.push(Strings(bits[i]));
        }

        return ret;
    }

    function implode(glue, bits) {
        let bitsSize = bits.length;
        if (bitsSize === 1) {
            return bits[0];
        }
        return bits.join(glue);
    }





    function isValidEmail() {
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(__coreStr);
    }

    function getPasswordStrengthError() {
        let lowerCaseRegEx = new RegExp("[a-z]+", "g");
        let upperCaseRegEx = new RegExp("[A-Z]+", "g");
        let numberRegEx = new RegExp("[0-9]+", "g");
        let symbolRegEx = new RegExp("[!@#$%^&*]+", "g");
        let mustHave = 'Must have a lower case, an upper case, a number and a symbol (!@#$%^&*)';

        if (__coreStr.length == 0) {
            return Strings('Missing password');
        } else if (__coreStr.length < 8) {
            return Strings('Minimum password length is 8 characters');
        } else if (!lowerCaseRegEx.test(__coreStr)) {
            return Strings('Missing a lower case letter.  ' + mustHave);
        } else if (!upperCaseRegEx.test(__coreStr)) {
            return Strings('Missing an upper case letter.  ' + mustHave);
        } else if (!numberRegEx.test(__coreStr)) {
            return Strings('Missing a number.  ' + mustHave);
        } else if (!symbolRegEx.test(__coreStr)) {
            return Strings('Missing a symbol.  ' + mustHave);
        }

        return null;
    }

    // This custom JSON stringify function is intended to generate a JSON string that is compatible with the PHP JSON
    // parser.
    function jsonStringify(obj) {
        let objType = typeof(obj);
        if (!(['object', 'number', 'string', 'boolean', null]).includes(objType)) {
            window.console.error('strings::jsonStrinify - Passed invalid parameter type in place of ojbect:  ' + objType);
            return null;
        }

        // Handle base types:  string and number
        if (objType === 'string' || objType === 'number') {
            return Strings(`"${obj}"`);
        }

        // Handle null
        if (obj === null) {
            return Strings('null');
        }

        // Handle boolean true
        if (obj === true) {
            return Strings('true');
        }

        // Handle boolean false
        if (obj === false) {
            return Strings('false');
        }

        // Handle an array
        if (objType === 'object' && typeof(obj.length) !== 'undefined') {
            let toolStrings = new Strings();
            let ret = '[';
            for (let index=0; index<obj.length; index++) {
                ret += toolStrings.jsonStringify(obj[index]).str() + ',';
            }
            ret = (new Strings(ret)).ends(',') ? ret.substr(0, ret.length - 1) : ret;
            ret += ']';
            return Strings(ret);
        }

        // Handle an object
        if (objType === 'object') {
            let toolStrings = new Strings();
            let fieldNames = Object.getOwnPropertyNames(obj);
            let ret = '{';
            for (let index=0; index<fieldNames.length; index++) {
                let value = toolStrings.jsonStringify(obj[fieldNames[index]]).str();
                if (!(['[]', '{}']).includes(value)) {
                    ret += `"${fieldNames[index]}":` + toolStrings.jsonStringify(obj[fieldNames[index]]).str() + ',';
                }
            }
            ret = (new Strings(ret)).ends(',') ? ret.substr(0, ret.length - 1) : ret;
            ret += '}';
            return Strings(ret);
        }

        // Default handler
        return new Strings();
    }

    function jsonParse() {
        return JSON.parse(__coreStr);
    }

    // Encode string compatible with posting as a field payload
    function htmlspecialchars() {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        let newCore = __coreStr.replace(/[&<>"']/g, function(m) { return map[m]; });
        return Strings(newCore);
    }

    // Decode posting compatible string
    function htmlspecialchars_decode() {
        let newCore = __coreStr.replaceAll('&amp;', '&');
        newCore = newCore.replaceAll('&lt;', '<');
        newCore = newCore.replaceAll('&gt;', '>');
        newCore = newCore.replaceAll('&quot;', '"');
        newCore = newCore.replaceAll('&#039;', "'");

        return Strings(newCore);
    }

    // Random string generator
    function random(length = 10) {
        let newCore = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*_+-=:;<>?';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            newCore += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return Strings(newCore);
    }

    return {
        __coreStr: __coreStr,
        name: name,
        str: str,
        isEmpty: isEmpty,
        equals: equals,
        count: count,
        starts: starts,
        ends: ends,
        contains: contains,
        prepend: prepend,
        append: append,
        stripHtml: stripHtml,
        conditionForXML: conditionForXML,
        ltrim: ltrim,
        rtrim: rtrim,
        trim: trim,
        whitespaceCondense: whitespaceCondense,
        stripBeforeTag: stripBeforeTag,
        stripAfterTag: stripAfterTag,
        explode: explode,
        implode: implode,
        isValidEmail: isValidEmail,
        getPasswordStrengthError: getPasswordStrengthError,
        jsonStringify: jsonStringify,
        jsonParse: jsonParse,
        htmlspecialchars: htmlspecialchars,
        htmlspecialchars_decode: htmlspecialchars_decode,
        random: random,
    }
});
