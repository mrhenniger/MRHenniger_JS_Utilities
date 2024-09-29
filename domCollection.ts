/*
    Class:  DomCollection
    What:  A class which provides utilities for dealing with collections of Dom elements.  The some functions
           in the Dom class return arrays would return and array of Dom elements, but instead return an instance of this
           class to simplify interactions with those collections.
    Usage:  Free to use in your projects, just maintain this comment block with full credit to the author.
    Author:  Mike Henniger
    Initial version date:  September 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class DomCollection {
    className: string;
    private __core: Dom[];

    // other member data goes here

    /*
     * Function:  constructor
     *
     * @param  Dom[]  An array of Dom elements to be wrapped by the instance.
     */
    constructor(ref: Dom[] = []) {
        this.className = "DomCollection";
        this.__core = ref;
    }

    /*
     * Function:  getCore
     *
     * Description:  An accessor for the wrapped array of Dom elements.
     *
     * @param  none
     *
     * @return  string  The wrapped array of Dom elements.
     */
    public getCore(): Dom[] {
        return this.__core;
    }

    /*
     * Function:  first
     *
     * Description:  An accessor function to return the first Dom item in the collection.
     *
     * @param  none
     *
     * @return  Dom  A null if returned when the array is empty, otherwise the first Dom element is returned.
     */
    public first(): null|Dom {
        if (this.__core.length === 0) {
            return null;
        }
        return this.__core[0];
    }

    /*
     * Function:  last
     *
     * Description:  An accessor function to return the last Dom item in the collection.
     *
     * @param  none
     *
     * @return  Dom  A null if returned when the array is empty, otherwise the last Dom element is returned.
     */
    public last(): null|Dom {
        if (this.__core.length === 0) {
            return null;
        }
        return this.__core[this.__core.length - 1];
    }

    /*
     * Function:  nth
     *
     * Description:  An accessor function to return the nTH Dom item in the collection.
     *
     * @param  index  A one-based number indicating which element in the collection to be returned.
     *
     * @return  Dom  A null if returned when the array is empty or the index value is out of range (less than 0 or
     *               beyond the size of the array), otherwise the nTH Dom element is returned.
     */
    public nth(index: number): null|Dom {
        if (this.__core.length === 0) {
            return null;
        }
        return this.__core[index - 1];
    }

    /*
     * Function:  getSize
     *
     * Description:  Returns the number of elements in the collection.
     *
     * @param  none
     *
     * @return  number  The size of the collection.
     */
    public getSize(): number {
        return this.__core.length;
    }

    /*
     * Function:  expect
     *
     * Description:  A function that checks the size of the collection and if it doesn't match the parameter an error
     *               is thrown.
     *
     * @param  qty  The specified number of elements.
     *
     * @return  DomCollection  Returns self to allow for chaining of commands.
     */
    public expect(qty: number): DomCollection {
        if (qty < 0) {
            throw('DomCollection::expect - negative qty: ' + String(qty));
        }
        if (this.__core.length === qty) {
            return this;
        }
        throw(`DomCollection::expect - Invalid qty, expected ${qty} but found ${this.__core.length}`);
    }
}
