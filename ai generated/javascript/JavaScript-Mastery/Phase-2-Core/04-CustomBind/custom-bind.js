/**
 * ==========================================
 * TOPIC 04: CUSTOM BIND POLYFILL (myBind)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * This is a classic "Senior Engineer" interview question. 
 * Re-implementing 'Function.prototype.bind' requires understanding:
 * 1. Prototypes (attaching to Function.prototype).
 * 2. Closures (remembering 'thisArg' and initial arguments).
 * 3. Scope / Arguments (merging pre-filled vs. call-time arguments).
 * 
 * 2. INTERNAL WORKING
 * -------------------
 * Our custom bind must:
 * 1. Return a NEW function.
 * 2. Maintain the 'this' context provided.
 * 3. Support 'Partial Application' (pre-filling arguments).
 * 4. Handle the call-time arguments correctly.
 * 
 * 3. MEMORY BEHAVIOR
 * ------------------
 * Every call to 'bind' (or our 'myBind') creates a NEW function object 
 * in the Heap, which keeps a closure over the original function and 
 * the 'this' context.
 */

// --- ONE BAD EXAMPLE: Simple bind without spread/partial application ---
Function.prototype.simpleBind = function (thisArg) {
    const fn = this;
    return function () {
        return fn.call(thisArg); // BUG: Misses arguments passed later!
    };
};

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (THE POLYFILL) ---
"use strict";

/**
 * Standard-compliant Polyfill for Bind.
 */
Function.prototype.myBind = function (thisArg, ...preargs) {
    // 1. Validating the caller is actually a function
    if (typeof this !== 'function') {
        throw new TypeError("Function.prototype.myBind - what is trying to be bound is not callable");
    }

    const originalFunction = this; // 'this' refers to the function being bound

    return function (...callArgs) {
        // 2. We use 'apply' internally to pass the merged arguments
        // 3. We merge pre-filled arguments (preargs) and dynamic arguments (callArgs)
        return originalFunction.apply(thisArg, [...preargs, ...callArgs]);
    };
};

// TESTING OUR POLYFILL
const stats = {
    wins: 10,
    losses: 2
};

function logResult(p1, p2) {
    console.log(`[Stats - ${this.wins}/${this.losses}] Args: ${p1}, ${p2}`);
}

const myBoundLog = logResult.myBind(stats, "Initial_Arg");
myBoundLog("Dynamic_Arg");
// Output: [Stats - 10/2] Args: Initial_Arg, Dynamic_Arg

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why do we need to check (typeof this !== 'function')?
 * A1: Because someone could potentially try to call .myBind() on something else 
 *     if they attach it to the Object prototype, and bind is designed 
 *     exclusively for callable objects.
 * 
 * Q2: How do you handle 'partial application' in your custom bind?
 * A2: By capturing the initial arguments using the Rest operator (...) in 
 *     the myBind definition, and then merging them with the arguments 
 *     captured in the returned function.
 * 
 * Q3: Can you use your myBind with the 'new' keyword?
 * A3: Our basic version doesn't handle 'new' context (which is rare). 
 *     A production-level polyfill would need to check if 'this' is an 
 *     instance of the returned function and adjust the binding accordingly.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is 'this' inside myBind at the moment it is CALLED?
 * (Answer: The function that we are trying to bind. e.g. 'logResult'.)
 * 
 * Q2: What happens if you bind 'thisArg' to null?
 * (Answer: In non-strict mode, it defaults to Global. In strict mode, it's null.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Extend myBind to handle the 'new' binding (constructor) use case.
 * Challenge 2: Implement a 'myCall' and 'myApply' polyfill using only 
 *              property assignment logic (obj.fn = this; obj.fn();).
 */
