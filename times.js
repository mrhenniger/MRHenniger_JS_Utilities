"use strict";
/*
    Class:  Strings
    What:  A wrapper class for JavaScript strings intended to make string manipulation and evaluation easier than
           vanilla JavaScript while avoiding bulky frameworks.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  October 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class Times {
    // other member data goes here
    /*
     * Function:  constructor
     *
     * @param  any  Element to be converted to a string.
     */
    constructor(ref = null) {
        this.className = 'Times';
        this.__core = null;
        // @ts-ignore - The following line is constructed correctly.
        if (typeof (ref === null || ref === void 0 ? void 0 : ref.className) !== 'undefined' && (ref === null || ref === void 0 ? void 0 : ref.className) === 'Strings') {
            // @ts-ignore - The following line is constructed correctly.
            ref = ref.str();
        }
        const refType = typeof ref;
        if (refType === 'number'
            || refType === 'string') {
            // @ts-ignore - The following line is constructed correctly.
            this.__core = new Date(ref);
        }
        else if (ref === null) {
            this.__core = new Date(0);
        }
        // @ts-ignore - The following line is constructed correctly.
        else if (typeof ref.className !== 'undefined' && ref.className === 'Times') {
            // @ts-ignore - The following line is constructed correctly.
            this.__core = ref.getCore();
        }
        else {
            this.__core == ref;
        }
    }
    __convertNull() {
        if (this.__core === null) {
            this.__core = new Date(0);
        }
        return this;
    }
    /*
     * Function:  getCore
     *
     * Description:  An accessor for the wrapped Date object.
     *
     * @param  none
     *
     * @return  Date  The wrapped Date object.
     */
    getCore() {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core;
    }
    str() {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core.toDateString();
    }
    getMilliseconds() {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core.getTime();
    }
    getSeconds() {
        return Math.floor(this.getMilliseconds() / 1000);
    }
    equals(rightSide) {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.getMilliseconds() === rightSide.getMilliseconds();
    }
    static now() {
        return new Times(Date.now());
    }
    add(toAdd) {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        let sum = this.__core.getTime();
        if (typeof toAdd === 'number') {
            sum += Math.floor(toAdd);
        }
        else {
            sum += toAdd.getMilliseconds();
        }
        return new Times(sum);
    }
    subtract(toSubtract) {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof toSubtract === 'number') {
            result -= Math.floor(toSubtract);
        }
        else {
            result -= toSubtract.getMilliseconds();
        }
        return new Times(result);
    }
    multiply(theMultiplier) {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof theMultiplier === 'number') {
            result *= Math.floor(theMultiplier);
        }
        else {
            result *= theMultiplier.getMilliseconds();
        }
        return new Times(result);
    }
    divide(theDividend) {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof theDividend === 'number') {
            result /= theDividend;
        }
        else {
            result /= theDividend.getMilliseconds();
        }
        result = Math.floor(result);
        return new Times(result);
    }
}
