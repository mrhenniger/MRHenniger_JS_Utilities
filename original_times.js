// This file is intended as a wrapper for the JavaScript Date object.

let Times = (function(ref = null) {
    let name = 'Times';

    let __core = null;
    let refType = typeof ref;
    if (ref === null || ref === '') {
        __core = new Date();
    } else if (refType === 'object') {
        if (typeof ref?.name === 'Times') {
            __core = ref.__core;
        } else {
            __core = ref;
        }
    } else {
        window.console.error('Times::constructor - Unrecognized ref', ref);
    }

    function str() {
        return __core.toString();
    }

    function isEmpty() {
        return __core === null;
    }

    function equals(rightSide) {
        return __core.getTime() === rightSide.getTime();
    }

    function nowMilli() {
        let now = new Date();
        return now.getTime();
    }

    function nowEpoch() {
        return Math.floor(nowMilli()/1000);
    }



    return {
        __core: __core,
        name: name,
        str: str,
        isEmpty: isEmpty,
        equals: equals,
        nowMilli: nowMilli,
        nowEpoch: nowEpoch,

        ONE_SECOND_EPOCH: 1,
        ONE_MINUTE_EPOCH: 60,
        ONE_HOUR_EPOCH:   60*60,
        ONE_DAY_EPOCH:    24*60*60,
        ONE_WEEK_EPOCH:   7*24*60*60,
    };
});
