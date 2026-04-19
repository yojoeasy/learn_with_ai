/**
 * ==========================================
 * TOPIC 03: CUSTOM PROMISE (MyPromise)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * A true Promise must follow the "Promises/A+" specification. 
 * Our version will be simplified for educational purposes but 
 * will cover the 3 CORE REQUIREMENTS:
 * 1. State Management (pending, fulfilled, rejected).
 * 2. Subscriber Management (storing .then/catch callbacks).
 * 3. Chaining (returning a NEW MyPromise instance).
 * 
 * 2. INTERNAL WORKING
 * -------------------
 * - Callback Storage: Promises can have multiple subscribers. 
 *   Callbacks are stored in arrays.
 * - Resolving: Once resolved, the state becomes "locked".
 * - Async Execution: Our custom version must use `queueMicrotask` 
 *   or `setTimeout` to ensure handlers run asynchronously.
 */

// --- ONE BAD EXAMPLE: Sync Promise (Violates Spec) ---
function badPromise(executor) {
    this.value = null;
    executor((val) => { this.value = val; }); // Executes sync!
}
// badPromise.then(...) would fail because it hasn't happened "later".

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (THE POLYFILL) ---
"use strict";

const STATES = {
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected"
};

class MyPromise {
    #state = STATES.PENDING;
    #value = null;
    #successHandlers = [];
    #errorHandlers = [];

    constructor(executor) {
        try {
            // Executing the user's logic immediately
            executor(this.#resolve.bind(this), this.#reject.bind(this));
        } catch (e) {
            this.#reject(e);
        }
    }

    #resolve(value) {
        if (this.#state !== STATES.PENDING) return;

        this.#state = STATES.FULFILLED;
        this.#value = value;
        // Process subscribers asynchronously (Engine requirement)
        queueMicrotask(() => {
            this.#successHandlers.forEach(handler => handler(this.#value));
        });
    }

    #reject(error) {
        if (this.#state !== STATES.PENDING) return;

        this.#state = STATES.REJECTED;
        this.#value = error;
        queueMicrotask(() => {
            this.#errorHandlers.forEach(handler => handler(this.#value));
        });
    }

    then(onSuccess, onError) {
        // returning a NEW promise for chaining
        return new MyPromise((resolve, reject) => {
            const successWrapper = (val) => {
                if (!onSuccess) return resolve(val);
                try {
                    const result = onSuccess(val);
                    // Handle if the return is ANOTHER promise
                    result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (e) { reject(e); }
            };

            const errorWrapper = (err) => {
                if (!onError) return reject(err);
                try {
                    const result = onError(err);
                    result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (e) { reject(e); }
            };

            if (this.#state === STATES.PENDING) {
                this.#successHandlers.push(successWrapper);
                this.#errorHandlers.push(errorWrapper);
            } else if (this.#state === STATES.FULFILLED) {
                queueMicrotask(() => successWrapper(this.#value));
            } else {
                queueMicrotask(() => errorWrapper(this.#value));
            }
        });
    }

    catch(onError) {
        return this.then(null, onError);
    }
}

// TESTING OUR POLYFILL
const myP = new MyPromise((res, rej) => {
    console.log("Constructor running...");
    setTimeout(() => res("API_SUCCESS_DATA"), 500);
});

myP.then(data => {
    console.log("Step 1:", data);
    return "Transformed Data";
}).then(final => {
    console.log("Step 2:", final);
});

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why do we use queueMicrotask inside resolve/reject?
 * A1: To guarantee that .then() handlers are called asynchronously even 
 *     if the promise resolves immediately (Spec requirement).
 * 
 * Q2: How do you handle Promise nesting in your .then()?
 * A2: By checking if the return value of a handler is an instance of 
 *     MyPromise, and if so, calling .then() on it to recursively resolve.
 * 
 * Q3: What is the benefit of using private fields (#) here?
 * A3: It ensures that the state and value of a promise cannot be 
 *     manually manipulated from the outside once initialized.
 */
