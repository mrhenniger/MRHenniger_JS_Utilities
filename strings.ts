/*
    Class:  Strings
    What:  A wrapper class for JavaScript strings intended to make string manipulation and evaluation easier than
           vanilla JavaScript while avoiding bulky frameworks.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  September 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class Strings implements Named {
    className: string;
    private __core: string;
    // other member data goes here

    /*
     * Function:  constructor
     *
     * @param  any  Element to be converted to a string.
     */
    constructor(ref: any = '') {
        this.className = "Strings";
        this.__core = '';

        let refType = typeof ref;
        if (refType === 'undefined' || ref === '') {
            // Do nothing, we accept the default to empty string above
        } else if (refType === 'string') {
            this.__core = ref;
        } else if (refType === 'number') {
            this.__core = String(ref);
        } else if (ref === true) {
            this.__core = 'true';
        } else if (ref === false) {
            this.__core = 'false';
        } else if (ref === null) {
            this.__core = 'null';
        } else if (refType === 'object') {
            if (typeof ref.className !== 'undefined' && ref.className === 'Strings') {
                this.__core = ref.str();
            } else {
                // Note:  Objects should not be passed into the constructor directly, but
                //        if they are then we just serialize the object to a string
                this.__core = JSON.stringify(ref);
            }
        } else {
            window.console.error('Strings::constructor - Unrecognized ref', ref);
        }
    }

    /*
     * Function:  str
     *
     * Description:  An accessor for the wrapped JavaScript string.
     *
     * @param  none
     *
     * @return  string  The wrapped sring
     */
    public str(): string {
        return this.__core;
    }

    /*
     * Function:  isEmpty
     *
     * Description:  Evaluate the string as an empty string.
     *
     * @param  none
     *
     * @return  boolean  The string is empty(true) or is not/has at least one character (false).
     */
    public isEmpty(): boolean {
        return this.__core === '';
    }

    /*
     * Function:  duplicate
     *
     * Description:  Creates a copy.
     *
     * @param  rightSide  The string used for the equivalency.  This would be the right side value with == or === operators.
     *
     * @return  Strings  A copy of this.
     */
    public duplicate(): Strings {
        return new Strings(this.__core);
    }

    /*
     * Function:  equals
     *
     * Description:  Checks the parameter for equivalency against the wrapped string.
     *
     * @param  rightSide  The string used for the equivalency.  This would be the right side value with == or === operators.
     *
     * @return  boolean  The string matches (true) or it doesn't (false).
     */
    public equals(rightSide: string|Strings): boolean {
        if (typeof rightSide === 'string') {
            return this.__core === rightSide;
        } else {
            return this.__core === rightSide.str();
        }
    }

    /*
     * Function:  count
     *
     * Description:  Determines the number of occurrences of the string parameter in the wrapped string.
     *
     * @param  needle  The string for which will be searched in the wrapped string (haystack).
     *
     * @return  number  A count of the number of matches of the parameter string in the wrapped string.
     */
    public count(needle: string|Strings): number {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if (this.__core === '' || needle === '') {
            return 0;
        }

        return this.__core.split(needle).length - 1;
    }

    /*
     * Function:  starts
     *
     * Description:  Determine if the wrapped string starts with the parameter string.
     *
     * @param  needle  The string with which to determine whether the wrapped string starts with it.
     *
     * @return  boolean  The wrapped string starts with the parameter string (true), or it doesn't (false).
     */
    public starts(needle: string|Strings): boolean {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if ((this.__core !== '' && needle === '') || (this.__core === '' && needle !== '')) {
            return false;
        }

        return this.__core.startsWith(needle);
    }

    /*
     * Function:  ends
     *
     * Description:  Determine if the wrapped string ends with the parameter string.
     *
     * @param  needle  The string with which to determine whether the wrapped string ends with it.
     *
     * @return  boolean  The wrapped string end with the parameter string (true), or it doesn't (false).
     */
    public ends(needle: string|Strings): boolean {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if ((this.__core !== '' && needle === '') || (this.__core === '' && needle !== '')) {
            return false;
        }

        return this.__core.endsWith(needle);
    }

    /*
     * Function:  contains
     *
     * Description:  Determine if the parameter string is contained intact in the wrapped string.
     *
     * @param  needle  The string with which to determine whether the wrapped string has it intact and in sequence within it.
     *
     * @return  boolean  The string is contained (true) or is isn't (false).
     */
    public contains(needle: string|Strings): boolean {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if ((this.__core !== '' && needle === '') || (this.__core === '' && needle !== '')) {
            return false;
        }

        return this.__core.includes(needle);
    }

    /*
     * Function:  prepend
     *
     * Description:  Adds the parameter string to the start of the wrapped string.
     *
     * @param  ref  The string to be added to the start of the string.
     *
     * @return  boolean  The concatenated string.
     */
    public prepend(ref: string|Strings): Strings {
        ref = typeof ref !== 'string' ? ref.str() : ref;

        this.__core = ref + this.__core;

        return this;
    }

    /*
     * Function:  append
     *
     * Description:  Adds the parameter string to the end of the wrapped string.
     *
     * @param  ref  The string to be added to the end of the string.
     *
     * @return  boolean  The concatenated string.
     */
    public append(ref: string|Strings): Strings {
        ref = typeof ref !== 'string' ? ref.str() : ref;

        this.__core = this.__core + ref;

        return this;
    }

    /*
     * Function:  ltrim
     *
     * Description:  If the wrapped string starts with the parameter string, the parameter string is removed from the
     *               head of the wrapped string.  The function is recursive so multiple instances of the parameter
     *               string will be removed if they are in sequence at the head.
     *
     * @param  ref  The string to be removed from the head of the wrapped string.
     *
     * @return  Strings  The resulting wrapped string after trimming.
     */
    public ltrim(needle: string|Strings): Strings {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if (
            this.__core === ''
            || needle === ''
            || (this.__core.length < needle.length)
        ) {
            return this;
        }

        if (this.__core.startsWith(needle)) {
            this.__core = this.__core.substring(needle.length);
            return this.ltrim(needle);
        }

        return this;
    }

    /*
     * Function:  rtrim
     *
     * Description:  If the wrapped string ends with the parameter string, the parameter string is removed from the
     *               end of the wrapped string.  The function is recursive so multiple instances of the parameter
     *               string will be removed if they are in sequence at the end.
     *
     * @param  ref  The string to be removed from the end of the wrapped string.
     *
     * @return  Strings  The resulting wrapped string after trimming.
     */
    public rtrim(needle: string|Strings): Strings {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if (
            this.__core === ''
            || needle === ''
            || (this.__core.length < needle.length)
        ) {
            return this;
        }

        if (this.__core.endsWith(needle)) {
            let diff = this.__core.length - needle.length;
            this.__core = this.__core.substring(0, diff);
            return this.rtrim(needle);
        }

        return this;
    }

    /*
     * Function:  trim
     *
     * Description:  If the wrapped string starts or ends with the parameter string, the parameter string is removed
     *               from both the head and end of the wrapped string.  The function is recursive so multiple instances
     *               of the parameter string will be removed if they are in sequences at head or the end.  Also, if used
     *               without a parameter provided, space characters will be stripped from the head and end.
     *
     * @param  ref  The string to be removed from the head or end of the wrapped string.
     *
     * @return  Strings  The resulting wrapped string after trimming.
     */
    public trim(needle: string|Strings = ' ') {
        needle = typeof needle !== 'string' ? needle.str() : needle;

        if (
            this.__core === ''
            || needle === ''
            || (this.__core.length < needle.length)
        ) {
            return this;
        }

        return this.ltrim(needle).rtrim(needle);
    }

    /*
     * Function:  whitespaceCondense
     *
     * Description:  Reduces white space characters in sequence to a minimum.
     *
     * @param  none
     *
     * @return  Strings  The reduced string.
     */
    public whitespaceCondense(): Strings {
        let before = '';
        let mod = this.__core;
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
        this.__core = mod;
        return this;
    }

    /*
     * Function:  stripBeforeTag
     *
     * Description:  Remove all characters up to, and including, a tag/marker string from within the contained string.
     *
     * @param  tag  The marker string for which the characters before are to be removed.
     *
     * @return  Strings  The reduced string if the tag/marker was found.
     */
    public stripBeforeTag(tag: string|Strings): Strings {
        tag = typeof tag !== 'string' ? tag.str() : tag;

        if (tag === '') {
            return this;
        }

        let pos = this.__core.indexOf(tag) + tag.length;
        if (pos === -1) {
            return this;
        }

        this.__core = this.__core.substring(pos);
        return this;
    }

    /*
     * Function:  stripAfterTag
     *
     * Description:  Remove all characters after, and including, a tag/marker string from within the contained string.
     *
     * @param  tag  The marker string for which the characters after are to be removed.
     *
     * @return  Strings  The reduced string if the tag/marker was found.
     */
    public stripAfterTag(tag: string|Strings): Strings {
        tag = typeof tag !== 'string' ? tag.str() : tag;

        if (tag === '') {
            return this;
        }

        let pos = this.__core.indexOf(tag);
        if (pos === -1) {
            return this;
        }

        this.__core = this.__core.substring(0, pos);
        return this;
    }

    /*
     * Function:  explode
     *
     * Description:  Break the contained string into an array of small strings using the parameter string as a
     *               delimiter.
     *
     * @param  delimit  The delimiter string used to break up the contained string.
     *
     * @return  Strings[]  The resulting series of string segments.  If the delimiter was not found in the wrapped
     *                     string, this result will still be an array, but with only one element, the original wrapped
     *                     string.
     */
    public explode(delimit: string|Strings): Strings[] {
        delimit = typeof delimit !== 'string' ? delimit.str() : delimit;

        let delimitLen = delimit.length;
        if (delimitLen >= 1) {
            // Do nothing
        } else if (delimitLen == 0) {
            return [this];
        } else {
            return [];
        }

        let bits = this.__core.split(delimit);
        let bitsSize = bits.length;
        let ret = [];
        for (let i=0; i<bitsSize; i++) {
            ret.push(new Strings(bits[i]));
        }

        return ret;
    }

    /*
     * Function:  implode
     *
     * Description:  Join and array of strings into a new contained string using a parameter string as glue to be placed
     *               between each of the string elements.
     *
     * @param  glue  The string to be placed between each of the array string elements.
     *
     * @return  Strings  The resulting joined string.
     */
    public implode(glue: string|Strings, bits: string[]|Strings[]): Strings {
        if (bits.length === 0) {
            this.__core = '';
            return this;
        }

        glue = typeof glue !== 'string' ? glue.str() : glue;

        let bitsSize = bits.length;
        for(let index=0; index<bitsSize; index++) {
            // @ts-ignore - The following line is constructed correctly.
            bits[index] =  bits[index]?.className === 'Strings' ? bits[index].str() : bits[index];
        }

        if (bitsSize === 1) {
            this.__core = typeof bits[0] !== 'string' ? bits[0].str() : bits[0]; // Note, this should not necessary, but my IDE is not detecting the conditioning in the previous loop
            return this;
        }

        this.__core = bits.join(glue);
        return this;
    }

    /*
     * Function:  replace
     *
     * Description:  Replace all instances of a substring in a string.
     *
     * @param  glue  The string to be placed between each of the array string elements.
     *
     * @return  Strings  The resulting modified string.
     */
    public replace(needle: string|Strings, replacement: string|Strings): Strings {
        needle = typeof needle === 'string' ? needle : needle.str();
        replacement = typeof replacement === 'string' ? replacement : replacement.str();

        // Check:  Can't possibly find by length
        if (needle.length > this.__core.length) {
            return this;
        }

        // Check:  Neither the haystack nor the needle have any length
        if (needle.length === 0 || this.__core.length === 0) {
            return this;
        }

        // Check:  There isn't even one instance of the needle in the haystack
        if (this.__core.indexOf(needle) === -1) {
            return this;
        }

        // Do the replacements
        let bits = this.__core.split(needle);
        this.__core = bits.join(replacement);

        // Done!
        return this;
    }

    /*
     * Function:  stripHtml
     *
     * Description:  Remove html code from the contained string.
     *
     * @param  none
     *
     * @return  Strings  The resulting string stripped of contained html characters.
     */
    public stripHtml(): Strings {
        // Note:  I would love to claim this is my own, but I lifted it from Stack Overflow...
        //        https://stackoverflow.com/questions/822452/strip-html-tags-from-text-using-plain-javascript

        this.__core =
            this.__core
                //-- remove BR tags and replace them with line break
                .replace(/<br>/gi, "\n")
                .replace(/<br\s\/>/gi, "\n")
                .replace(/<br\/>/gi, "\n")

                //-- remove P and A tags but preserve what's inside of them
                .replace(/<p.*>/gi, "\n")
                .replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)")

                //-- remove all inside SCRIPT and STYLE tags
                .replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "")
                .replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "")

                //-- remove all else
                .replace(/<(?:.|\s)*?>/g, "")

                //-- get rid of more than 2 multiple line breaks:
                .replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n")

                //-- get rid of more than 2 spaces:
                .replace(/ +(?= )/g,'')

                //-- get rid of html-encoded characters:
                .replace(/&nbsp;/gi," ")
                .replace(/&amp;/gi,"&")
                .replace(/&quot;/gi,'"')
                .replace(/&lt;/gi,'<')
                .replace(/&gt;/gi,'>');

        this.whitespaceCondense();
        return this;
    }

    /*
     * Function:  conditionForXML
     *
     * Description:  Remove characters that will not offend an XML encoder.
     *
     * @param  none
     *
     * @return  Strings  The resulting converted string.
     */
    public conditionForXML(): Strings {
        this.trim();
        var before = '';
        while( this.__core != before )
        {
            before = this.__core;
            this.__core = this.__core.replace('&',  ' and ');
        }
        return this;
    }

    /*
     * Function:  jsonStringify
     *
     * Description:  This custom JSON stringify function is intended to generate a JSON string that is compatible with
     *               the PHP JSON parser.
     *
     * @param  obj  The JSON object to be converted to a string.
     *
     * @return  Strings  The resulting JSON converted to a string.
     */
    public jsonStringify(obj: any): Strings {
        let objType = typeof(obj);
        if (!(['object', 'number', 'string', 'boolean', null]).includes(objType)) {
            window.console.error('strings::jsonStrinify - Passed invalid parameter type in place of object:  ' + objType);
            this.__core = '';
            return this;
        }

        // Handle base types:  string and number
        if (objType === 'string' || objType === 'number') {
            this.__core = `"${obj}"`;
            return this;
        }

        // Handle null
        if (obj === null) {
            this.__core = 'null';
            return this;
        }

        // Handle boolean true
        if (obj === true) {
            this.__core = 'true';
            return this;
        }

        // Handle boolean false
        if (obj === false) {
            this.__core = 'false';
            return this;
        }

        // Handle an array
        if (objType === 'object' && typeof(obj.length) !== 'undefined') {
            let toolStrings = new Strings();

            this.__core = '[';
            for (let index=0; index<obj.length; index++) {
                this.__core += toolStrings.jsonStringify(obj[index]).str() + ',';
            }
            this.__core = this.ends(',') ? this.__core.substr(0, this.__core.length - 1) : this.__core;
            this.__core += ']';

            return this;
        }

        // Handle an object
        if (objType === 'object') {
            let toolStrings = new Strings();
            let fieldNames = Object.getOwnPropertyNames(obj);
            this.__core = '{';
            for (let index=0; index<fieldNames.length; index++) {
                let value = toolStrings.jsonStringify(obj[fieldNames[index]]).str();
                if (!(['[]', '{}']).includes(value)) {
                    this.__core += `"${fieldNames[index]}":` + toolStrings.jsonStringify(obj[fieldNames[index]]).str() + ',';
                }
            }
            this.__core = this.ends(',') ? this.__core.substr(0, this.__core.length - 1) : this.__core;
            this.__core += '}';
            return this;
        }

        // Default handler
        this.__core = '';
        return this;
    }

    /*
     * Function:  isJSON
     *
     * Description:  Evaluates the contained string to see if it is a valid JSON representation.
     *
     * @param  none
     *
     * @return  boolean  Returns true if a valid JSON representation and false otherwise.
     */
    public isJSON(): boolean {
        try {
            JSON.parse(this.__core);
        } catch (e) {
            return false;
        }
        return true;
    }

    /*
     * Function:  jsonParse
     *
     * Description:  Convert the contained string to a JSON object.
     *
     * @param  none
     *
     * @return  object  The string converted to an object.  In the case of a failure to convert an empty object {} is
     *                  returned.
     */
    public jsonParse(): object {
        let ret = {};
        try {
            ret = JSON.parse(this.__core);
        } catch (e) {}
        return ret;
    }

    /*
     * Function:  htmlspecialchars
     *
     * Description:  The JavaScript version of the PHP function.
     *
     * @param  none
     *
     * @return  Strings  The string converted.
     */
    public htmlspecialchars(): Strings {
        this.__core = this.__core
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        return this;
    }

    /*
     * Function:  isValidEmail
     *
     * Description:  Evalute if the wrapped string is correctly formatted as an email address.
     *
     * @param  none
     *
     * @return  boolean  The string is correctly formatted (true), or it is not (false).
     */
    public isValidEmail(): boolean {
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(this.__core);
    }

    /*
     * Function:  getPasswordStrengthError
     *
     * Description:  Evaluate the strength of a password and return an appropriate error.
     *
     * @param  none
     *
     * @return  Strings  If the password is evaluated as strong, then an empty string is returned, otherwise an
     *                   appropriate error is returned.
     */
    public getPasswordStrengthError(): Strings {
        let lowerCaseRegEx = new RegExp("[a-z]+", "g");
        let upperCaseRegEx = new RegExp("[A-Z]+", "g");
        let numberRegEx = new RegExp("[0-9]+", "g");
        let symbolRegEx = new RegExp("[!@#$%^&*]+", "g");
        let mustHave = 'Must have a lower case, an upper case, a number and a symbol (!@#$%^&*)';

        if (this.__core.length == 0) {
            return new Strings('Missing password');
        } else if (this.__core.length < 8) {
            return new Strings('Minimum password length is 8 characters');
        } else if (!lowerCaseRegEx.test(this.__core)) {
            return new Strings('Missing a lower case letter.  ' + mustHave);
        } else if (!upperCaseRegEx.test(this.__core)) {
            return new Strings('Missing an upper case letter.  ' + mustHave);
        } else if (!numberRegEx.test(this.__core)) {
            return new Strings('Missing a number.  ' + mustHave);
        } else if (!symbolRegEx.test(this.__core)) {
            return new Strings('Missing a symbol.  ' + mustHave);
        }

        return new Strings('');
    }

    /*
     * Function:  random
     *
     * Description:  Generate a random string of characters
     *
     * @param  length  The desired length of the string.  This parameter is optional and has a default value of 10.
     *
     * @return  Strings  The randomly generated string.
     */
    public random(length: number = 10) {
        this.__core = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*_+-=:;<>?';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            this.__core += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return this;
    }

    /*
     * Function:  length
     *
     * Description:  Return the length of the string
     *
     * @return  number  The length of the string
     */
    public length() {
        return this.__core.length;
    }

    /*
     * Function:  isNumeric
     *
     * Description:  Evaluates the string as a valid representation of a number.
     *
     * @return  boolean  Returns true if the string is a valid representation of a number, false otherwise.
     */
    public isNumeric(): boolean {
        // @ts-ignore - Chosing to ignore this error
        return !isNaN(parseFloat(this.__core)) && isFinite(this.__core);
    }

    /*
     * Function:  number
     *
     * Description:  Convert the numberic representation to a number.
     *
     * @return  boolean  Return false if not a valid representation of a number, otherwise returns numeric version of
     *                   the string.
     */
    public number(): number|boolean {
        if (this.isNumeric()) {
            return Number(this.__core);
        }
        return false;
    }

    /*
     * Function:  lower
     *
     * Description:  Make the string all lower case characters.
     *
     * @return  Strings  The string converted.
     */
    public lower(): Strings {
        this.__core = this.__core.toLowerCase();
        return this;
    }

    /*
     * Function:  upper
     *
     * Description:  Make the string all upper case characters.
     *
     * @return  Strings  The string converted.
     */
    public upper(): Strings {
        this.__core = this.__core.toUpperCase();
        return this;
    }



}
