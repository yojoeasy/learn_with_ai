/**
 * ==========================================
 * TOPIC 02: CURRYING & INFINITE CURRYING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Currying is a functional programming technique where a function with 
 * multiple arguments is transformed into a series of functions that 
 * each take a single argument.
 * 
 * - Mathematical Root: It comes from Lambda Calculus and is named after 
 *   Haskell Curry.
 * - Key Principle: `f(a, b, c)` becomes `f(a)(b)(c)`.
 * 
 * 2. INTERNAL WORKING (CLOSURES & RECURSION)
 * -------------------------------------------
 * Currying works by returning a NEW function that captures the previous 
 * arguments in its closure. 
 * - Partial Application: Fixing some arguments and returning a function 
 *   that takes the rest.
 * - Auto-Currying: A utility that detects the number of arguments (arity) 
 *   of a function and curries it automatically.
 * 
 * 3. VISUAL MENTAL MODEL: THE ASSEMBLY LINE
 * ------------------------------------------
 * Think of an assembly line building a car.
 * - Standard Function: You give the factory all the parts at once, 
 *   and it spits out a car.
 * - Curried Function: You give the first station the Engine. It hands 
 *   you a "Partial Car" and moves to the next station. You give the 
 *   next station the Wheels, and so on. Only at the very last station 
 *   do you get the finished product.
 * 
 * 4. EDGE CASES
 * -------------
 * - Function Arity: `func.length` returns the number of expected 
 *   arguments (excluding rest parameters). Auto-currying relies on this.
 * - Context (this): Curried functions often lose their original `this` 
 *   binding unless explicitly handled.
 */

// --- ONE BAD EXAMPLE: Deeply nested callbacks (Manual Currying) ---
function badCurry(a) {
    return function (b) {
        return function (c) {
            return a + b + c; // Hard to read and maintain!
        };
    };
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

/**
 * 1. Generic Auto-Curry Utility
 * A common senior interview question.
 */
function curry(func) {
    return function curried(...args) {
        // If we have enough arguments, execute the function
        if (args.length >= func.length) {
            return func.apply(this, args);
        } else {
            // Otherwise, return a new function that expects more arguments
            return function (...nextArgs) {
                return curried.apply(this, [...args, ...nextArgs]);
            };
        }
    };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6

/**
 * 2. THE INFINITE CURRYING CHALLENGE
 * Implement: add(1)(2)(3)...(n)()
 */
function infiniteAdd(a) {
    return function (b) {
        if (b !== undefined) {
            return infiniteAdd(a + b);
        }
        return a;
    };
}

console.log("Infinite Sum:", infiniteAdd(1)(2)(3)(4)()); // 10

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between Currying and Partial Application?
 * A1: Currying transforms a function into a chain of single-argument functions. 
 *     Partial Application fixes a specific number of arguments (not necessarily one) 
 *     and returns a function for the rest.
 * 
 * Q2: Why is Currying useful in real applications?
 * A2: It allows for "Configuration" of functions. You can create specialized 
 *     versions of a general function (e.g., a logger with a pre-bound prefix).
 * 
 * Q3: How do you handle a function with dynamic arguments (Rest parameters)?
 * A3: Traditional currying depends on `func.length`. Functions using `...args` 
 *     have a length of 0, so they require a different approach (like 
 *     passing the expected count manually).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output of `add(1)(2)(3)` if `add` is implemented 
 *     using the infinite pattern but without the final `()`?
 * (Answer: It returns a FUNCTION, not a number, because the engine 
 *  doesn't know when to stop.)
 * 
 * Q2: What is the value of `curry((a, b = 10) => a + b).length`?
 * (Answer: 1. Default parameters and rest parameters are NOT counted 
 *  in the function length.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Create a specialized 'fetchWithToken' using currying 
 *              that takes a token first and then a URL.
 * Challenge 2: Implement a 'curry' utility that preserves the 'this' 
 *              context of the original function.
 */
