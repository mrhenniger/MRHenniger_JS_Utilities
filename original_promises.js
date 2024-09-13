let Promises = function (param=null, options = {}) {
    // Get the timeout
    let theTimeout =
        Number(param?.timeout) ? Number(param?.timeout) :
        Number(options?.timeout) ? Number(options?.timeout) :
        0;
    this.__acceptIt = null;
    this.__rejectIt = null;
    this.__memoryAccept = null;
    this.__memoryReject = null;

    // Check to see if the parameter is a native promise
    if (param !== null && typeof param === 'object' && param?.constructor?.name === 'Promise') {
        this.__thePromise = param;

        this.__state = 'pending'; // fulfilled, rejected
        this.__thePromise.then(() => {
//debugger;
            this.__state = 'fulfilled';
        })
        .catch(() => {
//debugger;
            this.__state = 'rejected';
        });

        if (options.acceptHandler) {
            this.__acceptIt = options.acceptHandler;
        }

        if (options.rejectHandler) {
            this.__acceptIt = options.rejectHandler;
        }

        if (theTimeout > 0) {
            this.setTimeout(theTimeout);
        }
        return this;
    }

    // Check to see if the parameter is another Promises
    else if (param !== null && typeof param === 'object' && param?.__name === 'Promises') {
        this.__thePromise = param.__thePromise;
        this.__acceptIt   = param.__acceptIt;
        this.__rejectIt   = param.__rejectIt;
        this.__name       = 'Promises';
        this.__state      = 'pending'; // fulfilled, rejected
        this.__memory     = param.__memory;
        return this;
    }

    // If we are given an array of promises that follow the all path
    if (typeof param === 'object' && param?.length) {
        this.allSettled(param);
        return this;
    }

    // If here then we have a standard promise
    this.__thePromise = new Promise(function(resolve, reject) {
        this.__acceptIt = resolve;
        this.__rejectIt = reject;
    }.bind(this));
    this.__name = "Promises";
    this.__memory = null; // This provides a container for storing data that may be needed in the accept or reject handler

    this.__state = 'pending'; // fulfilled, rejected
    this.__thePromise.then(() => {
//debugger;
        this.__state = 'fulfilled';
    })
    .catch(() => {
//debugger;
        this.__state = 'rejected';
    });

    if (theTimeout > 0) {
//debugger;
        this.setTimeout(theTimeout);
    }

    return this;
};

Promises.prototype.getState = function() {
    return this.__state;
}

Promises.prototype.isPending = function() {
    return this.__state === 'pending';
}

Promises.prototype.setMemory = function(dataToStore, params = {}) {
    this.__memory = dataToStore;

    if (params.memoryAccept) {
        this.__memoryAccept = params.memoryAccept;
    }

    if (params.memoryReject) {
        this.__memoryReject = params.memoryReject;
    }
}

Promises.prototype.getMemory = function() {
    return this.__memory;
}

Promises.prototype.accept = function(payload) {
    if (this.__acceptIt && this.isPending()) {
        this.__acceptIt(payload);
    }
}

Promises.prototype.reject = function(payload) {
    if (this.__rejectIt && this.isPending()) {
        this.__rejectIt(payload);
    }
}

Promises.prototype.then = function(func) {
    return this.__thePromise.then(func);
}

Promises.prototype.allSettled = function(promiseArr) {
    let basePromises = [];
    promiseArr.forEach(aPromises => {
        basePromises.push(aPromises.__thePromise);
    });
    this.__thePromise = Promise.allSettled(basePromises);
    let ret = new Promises(this.__thePromise);
    return ret;
}

Promises.prototype.all = function(promiseArr) {
    return this.allSettled(promiseArr);
}

Promises.prototype.any = function(promiseArr) {
    let basePromises = [];
    promiseArr.forEach(aPromises => {
        basePromises.push(aPromises.__thePromise);
    });
    this.__thePromise = Promise.any(basePromises);
    return new Promises(this.__thePromise);
}

Promises.prototype.setTimeout = function(timeLimitMilliSeconds) {
    if (this.__state !== 'pending') {
        return;
    }

    timeLimitMilliSeconds = Number(timeLimitMilliSeconds);
    setTimeout(() => {
//debugger;
        if (this.__state === 'pending') {
            this.reject(`timed out after ${timeLimitMilliSeconds} milliseconds`);

            if (this.__memoryReject) {
                this.__memoryReject(this.__memory);
            }
        }
    }, timeLimitMilliSeconds);
}