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
class Times implements Named {
    className: string;
    private __core: Date|null;
    // other member data goes here

    /*
     * Function:  constructor
     *
     * @param  any  Element to be converted to a string.
     */
    constructor(ref: number|string|Strings|Date|Times|null = null) {
        this.className = 'Times';
        this.__core = null;

        // @ts-ignore - The following line is constructed correctly.
        if (typeof ref?.className !== 'undefined' && ref?.className === 'Strings') {
            // @ts-ignore - The following line is constructed correctly.
            ref = ref.str();
        }

        const refType = typeof ref;
        if (
            refType === 'number'
            || refType === 'string'
        ) {
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

    private __convertNull(): Times {
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
    public getCore(): Date {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core;
    }

    public str(): string {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core.toDateString();
    }

    public getMilliseconds(): number {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.__core.getTime();
    }

    public getSeconds(): number {
        return Math.floor(this.getMilliseconds()/1000);
    }

    public equals(rightSide: Date): boolean {
        this.__convertNull();
        // @ts-ignore - Core is checked for null in __convertNull
        return this.getMilliseconds() === rightSide.getMilliseconds();
    }

    static now(): Times {
        return new Times(Date.now());
    }

    public add(toAdd: number|Times): Times {
        this.__convertNull();

        // @ts-ignore - Core is checked for null in __convertNull
        let sum = this.__core.getTime();
        if (typeof toAdd === 'number') {
            sum += Math.floor(toAdd);
        } else {
            sum += toAdd.getMilliseconds();
        }
        return new Times(sum);
    }

    public subtract(toSubtract: number|Times): Times {
        this.__convertNull();

        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof toSubtract === 'number') {
            result -= Math.floor(toSubtract);
        } else {
            result -= toSubtract.getMilliseconds();
        }
        return new Times(result);
    }

    public multiply(theMultiplier: number|Times): Times {
        this.__convertNull();

        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof theMultiplier === 'number') {
            result *= Math.floor(theMultiplier);
        } else {
            result *= theMultiplier.getMilliseconds();
        }
        return new Times(result);
    }

    public divide(theDividend: number|Times): Times {
        this.__convertNull();

        // @ts-ignore - Core is checked for null in __convertNull
        let result = this.__core.getTime();
        if (typeof theDividend === 'number') {
            result /= theDividend;
        } else {
            result /= theDividend.getMilliseconds();
        }
        result = Math.floor(result);
        return new Times(result);
    }
}
