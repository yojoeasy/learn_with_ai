/**
 * ==========================================
 * TOPIC 04: FUNCTIONAL PROGRAMMING & ARRAY POLYFILLS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Functional Programming (FP) is a declarative paradigm where 
 * programs are built by applying and composing functions. 
 * - Pure Functions: Given the same input, always return the same output. 
 *   No side effects (no DOM manipulation, no updating global variables).
 * - Immutability: Data is never changed; it is copied and transformed.
 * 
 * 2. ARRAY METHOD POLYFILLS
 * -------------------------
 * Senior developers must know HOW these methods work internally. 
 * They are higher-order functions that take a callback and 
 * execute it on each element of the array.
 * 
 * 3. MEMORY BEHAVIOR (HEAP ALLOCATION)
 * ------------------------------------
 * - .map() and .filter() create a NEW array in the heap. 
 * - Large arrays processed multiple times with chained methods 
 *   (.map().filter().reduce()) will generate many intermediate 
 *   objects, potentially triggering the Garbage Collector.
 * 
 * 4. VISUAL MENTAL MODEL: THE COLOR SORTER
 * -----------------------------------------
 * Think of a bag of colored marbles.
 * - filter: A sieve that only lets Red marbles through.
 * - map: A machine that paints every passing marble Green.
 * - reduce: A machine that crushes all marbles into a single block 
 *   of recycled glass.
 * 
 * 5. EDGE CASES
 * -------------
 * - Sparse Arrays: Built-in methods like .map() skip "empty slots" 
 *   (indices that were never assigned).
 * - Empty Arrays: .reduce() throws an error if called on an empty 
 *   array without an initial value.
 */

// --- ONE BAD EXAMPLE: Mutating high-level state ---
const users = [{ name: "A", pts: 10 }, { name: "B", pts: 20 }];
function badIncreasePts() {
    // This mutates the original array! (Side effect)
    users.forEach(u => u.pts += 5);
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (POLYFILLS) ---
"use strict";

/**
 * Custom Map Polyfill
 */
Array.prototype.myMap = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        // Handle sparse arrays (ignore empty slots)
        if (i in this) {
            result[i] = callback(this[i], i, this);
        }
    }
    return result;
};

/**
 * Custom Filter Polyfill
 */
Array.prototype.myFilter = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this && callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};

/**
 * Custom Reduce Polyfill (THE CORE OF FP)
 */
Array.prototype.myReduce = function (callback, initialValue) {
    let accumulator = initialValue;
    let startIndex = 0;

    // Handle case where no initial value is provided
    if (arguments.length < 2) {
        if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
        accumulator = this[0];
        startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            accumulator = callback(accumulator, this[i], i, this);
        }
    }
    return accumulator;
};

// TESTING OUR POLYFILLS
const nums = [1, 2, 3, 4, 5];
const totalOfEvensSquared = nums
    .myFilter(n => n % 2 === 0) // [2, 4]
    .myMap(n => n * n)         // [4, 16]
    .myReduce((acc, val) => acc + val, 0); // 20

console.log("Result:", totalOfEvensSquared);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a "Higher Order Function"?
 * A1: It's a function that takes one or more functions as arguments 
 *     or returns a function as its result.
 * 
 * Q2: Why is .reduce() considered the most powerful array method?
 * A2: Because you can implement .map(), .filter(), and .find() 
 *     using only .reduce(). It is the universal transformation tool.
 * 
 * Q3: What is "Point-free style" in FP?
 * A3: It's a way of writing code where functions are composed 
 *     without explicitly mentioning the arguments (e.g., `names.map(toUpper)` 
 *     instead of `names.map(n => toUpper(n))`).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     const arr = [1, 2, , 4]; // Sparse array
 *     console.log(arr.length);
 *     arr.map(x => x * 10);
 * (Answer: length is 4. .map() results in [10, 20, <empty>, 40].)
 * 
 * Q2: What is the output of [1, 2, 3].reduce((acc, val) => acc + val)?
 * (Answer: 6. Here the accumulator starts at 1 and loop starts at index 1.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "compose" utility that pipes the results of 
 *              multiple functions together using .reduce().
 * Challenge 2: Deep freeze an object to ensure true immutability.
 */
