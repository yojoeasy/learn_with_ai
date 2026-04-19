/**
 * ==========================================
 * TOPIC 02: PROMISES (Deep Dive)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * A Promise is an object representing the eventual completion 
 * (or failure) of an asynchronous operation and its resulting value. 
 * It is essentially a State Machine.
 * 
 * - Three States:
 *   1. Pending: Initial state, neither fulfilled nor rejected.
 *   2. Fulfilled (Resolved): Operation completed successfully.
 *   3. Rejected: Operation failed.
 * 
 * 2. CHAINING MECHANICS (PROMISE PIPE)
 * ------------------------------------
 * - .then() returns a NEW PROMISE. This is the key to chaining.
 * - If you return a value from .then(), it gets wrapped in a resolved promise.
 * - If you return another promise, .then() will wait for it to resovle.
 * 
 * 3. INTERNAL WORKING (V8 ENGINE)
 * --------------------------------
 * A Promise object has internal slots:
 * - [[PromiseState]]: "pending", "fulfilled", or "rejected".
 * - [[PromiseResult]]: The value or error.
 * - [[PromiseFulfillReactions]]: Callbacks queued for fulfillment (.then).
 * - [[PromiseRejectReactions]]: Callbacks queued for rejection (.catch).
 * 
 * 4. VISUAL MENTAL MODEL: THE FOOD TRUCK
 * --------------------------------------
 * Think of ordering food. 
 * - You pay and get a "Buzzer" (The Promise - Pending).
 * - The food is either cooked (Fulfilled) or out of stock (Rejected).
 * - The buzzer goes off (The state change). 
 * - What you do next (Eating vs Complaining) are the .then() and .catch() 
 *   handlers you registered earlier.
 * 
 * 5. EDGE CASES
 * -------------
 * - Floating Promises: Starting a promise but not catching errors or 
 *   properly chaining it (A major source of memory leaks and silent failures).
 * - Static Methods:
 *   - Promise.all(): Fails if ANY promise fails.
 *   - Promise.allSettled(): Waits for ALL to finish regardless of success/error.
 *   - Promise.race(): Returns the FIRST to settle.
 *   - Promise.any(): Returns the FIRST to fulfill (ignores rejections).
 */

// --- ONE BAD EXAMPLE: Nested Callback Hell (using Promises!) ---
function badChaining() {
    getUser(1).then(user => {
        getPosts(user.id).then(posts => {
            getComments(posts[0].id).then(comments => {
                // This is still callback hell! Don't nest .then()!
                console.log(comments);
            });
        });
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

const fetchUser = (id) => new Promise((res, rej) => {
    setTimeout(() => res({ id, name: "Ali" }), 100);
});

const fetchPosts = (userId) => new Promise((res) => {
    setTimeout(() => res(["Post 1", "Post 2"]), 100);
});

// 1. Clean Chaining (The Promise Pipe)
fetchUser(1)
    .then(user => {
        console.log("Logged User:", user.name);
        return fetchPosts(user.id); // Returning another promise
    })
    .then(posts => {
        console.log("User Posts:", posts);
        return "Success Message"; // Returning a value
    })
    .then(finalValue => {
        console.log("Final Chain Step:", finalValue);
    })
    .catch(err => console.error("Chain Error:", err))
    .finally(() => console.log("Operation Finished.")); // Always runs

// 2. Running multiple tasks in Parallel (Efficiency!)
async function parallelLogic() {
    try {
        const [posts, settings] = await Promise.all([
            fetchPosts(1),
            Promise.resolve({ theme: "dark" })
        ]);
        console.log("Fetched All:", posts, settings);
    } catch (e) {
        console.error("One failed:", e);
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a Promise Polyfill?
 * A1: It's an implementation of the Promise API for older environments 
 *     that don't natively support it (using callbacks and setTimeout).
 * 
 * Q2: Difference between .then(f1, f2) and .then(f1).catch(f2)?
 * A2: .then(f1, f2) - If f1 throws an error, f2 WON'T catch it.
 *     .then(f1).catch(f2) - f2 will catch errors from BOTH the original 
 *     promise and f1.
 * 
 * Q3: What is "Uncaught Promise Rejection"?
 * A3: When a Promise is rejected but no .catch() or second argument to 
 *     .then() is provided. In Node.js, this crashes the process!
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     const p = new Promise(res => {
 *       console.log(1);
 *       res(2);
 *     });
 *     p.then(res => console.log(res));
 *     console.log(3);
 * (Answer: 1, 3, 2. The constructor is SYNCHRONOUS. Just the .then() is async.)
 * 
 * Q2: What is the output?
 *     Promise.resolve(1).then(res => {
 *       console.log(res);
 *       return Promise.resolve(2);
 *     }).then(res => console.log(res));
 * (Answer: 1, then 2.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Promise Retry" function that attempts a 
 *              failing function N times before rejecting.
 * Challenge 2: Build a timeout wrapper for a promise that rejects if 
 *              it takes longer than X milliseconds.
 */
