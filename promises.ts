/*
    Class:  Promises
    What:  TODO
    Usage:  A class to enhance native JavaScript Promise.  This format promotes chaining like the other utilities.  One
            of the most useful features is to use Promises as a flag where you can declare it and accept/or reject if
            in the same code without having to add extra code just to access the accept and reject function.
    Author:  Mike Henniger
    Initial version date:  October 2024

    Feedback:  Constructive criticism is always well received and appreciated.

    Future version:  I plan to add to this class as I have ideas and/or find the need.  If you would like to suggest
                     additional features, I would very much like to hear from you.
 */
class Promises implements Named {
    className: string;
    protected __core: any;
    private __state: string;
    protected __acceptIt: any;
    protected __rejectIt: any;
    private __memory: Strings|string|number|object|null;
    private __memoryAccept: any;
    private __memoryReject: any;
    // other member data goes here

    /*
     * Function:  constructor
     *
     * @param  any  Element to be converted to a string.
     */
    constructor(param: any = null, options: object = {}) {
        this.className = "Promises";
        this.__core         = null;
        this.__state        = '';
        this.__acceptIt     = null;
        this.__rejectIt     = null;
        this.__memoryAccept = null;
        this.__memoryReject = null;
        this.__memory       = null; // This provides a container for storing data that may be needed in the accept or reject handler

        // Extract the timeout if it is there
        let theTimeout =
            typeof param?.timeout !== 'undefined' ? Number(param?.timeout) : // TODO: Revisit this, do we need to check param for a timeout value?
                // @ts-ignore - The member timeout may not exist on the object, and we are testing for that here.
                typeof options.timeout !== 'undefined' ? Number(options.timeout) :
                    0;

        // Check to see if the parameter is a native promise
        if (param !== null && typeof param === 'object' && param?.constructor?.name === 'Promise') {
            this.__core = param;

            this.__state = 'pending'; // fulfilled, rejected
            this.__core.then(() => {
                if (this.__memoryAccept) {
                    this.__memoryAccept(this.__memory);
                    this.__memoryAccept = null;
                    this.__memoryReject = null;
                }
                this.__state = 'fulfilled';
            })
            .catch(() => {
                if (this.__memoryReject) {
                    this.__memoryReject(this.__memory);
                    this.__memoryAccept = null;
                    this.__memoryReject = null;
                }
                this.__state = 'rejected';
            });

            // @ts-ignore - The following line is constructed correctly.
            if (typeof options.acceptHandler !== 'undefined') {
                // @ts-ignore - The following line is constructed correctly.
                this.__acceptIt = options.acceptHandler;
            }

            // @ts-ignore - The following line is constructed correctly.
            if (typeof options.rejectHandler !== 'undefined') {
                // @ts-ignore - The following line is constructed correctly.
                this.__rejectIt = options.rejectHandler;
            }

            if (theTimeout > 0) {
                this.setTimeout(theTimeout);
            }

            return this;
        }

        // Check to see if the parameter is another Promises
        else if (typeof param === 'object' && param?.className === 'Promises') {
            this.__core         = param.__core;
            this.__acceptIt     = param.__acceptIt;
            this.__rejectIt     = param.__rejectIt;
            this.__state        = 'pending'; // fulfilled, rejected
            this.__memory       = param.__memory;
            this.__memoryAccept = param.__memoryAccept;
            this.__memoryReject = param.__memoryReject;
            return this;
        }

        // If we are given an array of Promises then assume the all path
        else if (typeof param === 'object' && param?.length) {
            this.__state = 'pending';
            this.__core = Promises.allSettled(param);
            this.__core.then(() => {
                this.__state = 'fulfilled';
            })
            .catch(() => {
                this.__state = 'rejected';
            });

            return this;
        }

        // If here then we are creating a new standard promise
        else {
            this.__core = new Promise((resolve, reject) => {
                this.__acceptIt = resolve;
                this.__rejectIt = reject;
            });

            this.__state = 'pending';
            this.__core.then(() => {
                this.__state = 'fulfilled';
            })
            .catch(() => {
                this.__state = 'rejected';
            });

            if (theTimeout > 0) {
                this.setTimeout(theTimeout);
            }

            return this;
        }
    }

    /*
     * Function:  getCore
     *
     * Description:  An accessor for the wrapped JavaScript Promise.
     *
     * @param  none
     *
     * @return  Promise  The wrapped Promise
     */
    public getCore(): string {
        return this.__core;
    }

    /*
     * Function:  getState
     *
     * Description:  An accessor for the current state of the Promises.
     *
     * @param  none
     *
     * @return  string  The state represented as a string.  The valid values are 'pending', 'fulfilled' and 'rejected'.
     */
    public getState(): string {
        return this.__state;
    }


    /*
     * Function:  isPending
     *
     * Description:  Evaluates the current state and returns a boolean indicating if the promise is in the pending
     *               state.
     *
     * @param  none
     *
     * @return  boolean  Returns true if the Promises is in the pending state and false otherwise.
     */
    public isPending(): boolean {
        return this.__state === 'pending';
    }

    /*
     * Function:  setMemory
     *
     * Description:  A memory feature is included in Promises to provide unique identifier to this specific Promises.
     *               This provides the facility to allow the promise to be connected to an individual item in a
     *               collection of items returned from a service (for example).
     *               When the Promise is resolved or rejected the __memoryAccept and __memoryReject functions will be
     *               called respectively with the __memory value provided as a parameter.
     *
     * @param  dataToStore  This could be a string, number or Strings.
     * @param  params  An object which may contain the functions to execute when the promise is self/natively resolved
     *                 or rejected.
     *
     * @return  Promises  Returns self to allow for chaining of commands.
     */
    public setMemory(dataToStore: Strings|string|number|object, params: object = {}): Promises {
        let dataToStoreType = typeof dataToStore;
        if (!(dataToStoreType === 'string' || dataToStoreType === 'number'|| dataToStoreType === 'object')) {
            // @ts-ignore - If here then we know dataToStore is a Strings.
            dataToStore = dataToStore.str();
        }
        this.__memory = dataToStore;

        // @ts-ignore - The following line is constructed correctly.
        if (typeof params.memoryAccept !== 'undefined') {
            // @ts-ignore - The following line is constructed correctly.
            this.__memoryAccept = params.memoryAccept;
        }

        // @ts-ignore - The following line is constructed correctly.
        if (typeof params.memoryReject !== 'undefined') {
            // @ts-ignore - The following line is constructed correctly.
            this.__memoryReject = params.memoryReject;
        }

        return this;
    }

    /*
     * Function:  getMemory
     *
     * Description:  An accessor for __memory.
     *
     * @param  none
     *
     * @return  string  The state represented as a string.  The valid values are 'pending', 'fulfilled' and 'rejected'.
     */
    public getMemory(): Strings|string|number|object|null {
        return this.__memory;
    }

    /*
     * Function:  accept
     *
     * Description:  Provides the ability to force/trigger the Promise to be resolved with a specified value.
     *
     * @param  payload  The value to which the Promise is to resolve.
     *
     * @return  Promises  Returns self to allow for chaining of commands.
     */
    public accept(payload: any): Promises {
        if (this.__acceptIt && this.isPending()) {
            this.__acceptIt(payload);
        }
        this.__state = 'fulfilled';
        return this;
    }

    /*
     * Function:  reject
     *
     * Description:  Provides the ability to force/trigger the Promise to be rejected with a specified value.
     *
     * @param  payload  The value to which the Promise is to be rejected.
     *
     * @return  Promises  Returns self to allow for chaining of commands.
     */
    public reject(payload: any): Promises {
        if (this.__rejectIt && this.isPending()) {
            this.__rejectIt(payload);
        }
        this.__state = 'rejected';
        return this;
    }

    /*
     * Function:  then
     *
     * Description:  The accessor for the native promise function 'then'.
     *
     * @param  func  The function which may be called.
     *
     * @return  Promises  Returns a new Promises constructed from the value returned from the native promise then
     *                    function.
     */
    public then(func: any): Promises {
        return new Promises(this.__core.then(func));
    }

    /*
     * Function:  catch
     *
     * Description:  The accessor for the native promise function 'catch'.
     *
     * @param  func  The function which may be called.
     *
     * @return  Promises  Returns a new Promises constructed from the value returned from the native promise catch
     *                    function.
     */
    public catch(func: any): Promises {
        return new Promises(this.__core.catch(func));
    }

    /*
     * Function:  allSettled
     *
     * Description:  A static function which takes an array of Promises and doesn't resolve until, all the Promises
     *               in the array resolve.
     *
     * @param  promiseArr  The array of Promises.
     *
     * @return  Promises  Returns a new Promises constructed from the value returned from the call to the native Promise
     *                    function allSettled.
     */
    static allSettled(promiseArr: Promises[]): Promises {
        let basePromises: Promise<any>[] = [];
        for(let index=0; index<promiseArr.length; index++) {
            basePromises.push(promiseArr[index].__core);
        }
        // @ts-ignore - allSettled is a static function on Promise and should be called this well.
        return new Promises(Promise.allSettled(basePromises));
    }

    /*
     * Function:  all
     *
     * Description:  A static function alias for the allSettled function.
     *
     * @param  promiseArr  The array of Promises.
     *
     * @return  Promises  Returns a new Promises constructed from the value returned from the call to the native Promise
     *                    function allSettled.
     */
    static all(promiseArr: Promises[]): Promises {
        return Promises.allSettled(promiseArr);
    }

    /*
     * Function:  any
     *
     * Description:  A static function which takes an array of Promises and when the first Promises in the array
     *               resolves.
     *
     * @param  promiseArr  The array of Promises.
     *
     * @return  Promises  Returns a new Promises constructed from the value returned from the call to the native Promise
     *                    function any.
     */
    static any(promiseArr: Promises[]): Promises {
        let basePromises: Promise<any>[] = [];
        for(let index=0; index<promiseArr.length; index++) {
            basePromises.push(promiseArr[index].__core);
        }
        // @ts-ignore - allSettled is a static function on Promise and should be called this well.
        return new Promises(Promise.any(basePromises));
    }

    /*
     * Function:  setTimeout
     *
     * Description:  This function allows a time limit to be place on its resolution.  If the time expires at the
     *               limit then the Promises is rejected.
     *
     * @param  timeLimitMilliSeconds  The time limit value specified in milliseconds.
     *
     * @return  Promises  Returns self to allow for chaining of commands.
     */
    public setTimeout(timeLimitMilliSeconds: number): Promises {
        if (this.__state !== 'pending') {
            return this;
        }

        setTimeout(() => {
            if (this.__state === 'pending') {
                this.reject(`timed out after ${timeLimitMilliSeconds} milliseconds`);

                if (this.__memoryReject) {
                    this.__memoryReject(this.__memory);
                }
            }
        }, timeLimitMilliSeconds);

        return this;
    }
}
