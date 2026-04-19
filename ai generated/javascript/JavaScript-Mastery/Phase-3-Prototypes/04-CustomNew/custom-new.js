/**
 * ==========================================
 * TOPIC 04: CUSTOM NEW KEYWORD (myNew)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Every senior JS developer should understand the "4 Steps of New". 
 * When you use 'new Constructor()', the language performs a 
 * specific choreography in memory.
 * 
 * Step 1: Create a brand new empty object {}.
 * Step 2: Set the [[Prototype]] (__proto__) of this object to 
 *         the Constructor's 'prototype' property.
 * Step 3: Execute the Constructor function with 'this' bound 
 *         to the new object.
 * Step 4: If the constructor returns an object, return THAT. 
 *         Otherwise, return the new object created in Step 1.
 * 
 * 2. INTERNAL WORKING
 * -------------------
 * Our `myNew` function must replicate this internal logic precisely, 
 * using 'Object.create' for prototype linking and '.apply()' for 
 * context execution.
 */

// --- ONE BAD EXAMPLE: Simple object creation without Prototypes ---
function badNew(Constructor) {
    const obj = {}; // Simple object
    Constructor.call(obj); // Missing prototype link 
    return obj;
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (THE POLYFILL) ---
"use strict";

/**
 * Custom implementation of the 'new' keyword logic.
 */
function myNew(Constructor, ...args) {
    // 1. Create a new object and link its prototype in one step
    const obj = Object.create(Constructor.prototype);

    // 2. Run the constructor with 'obj' as the 'this' context
    const result = Constructor.apply(obj, args);

    // 3. Senior Level Check: Does the constructor purposefully return an object?
    // If so, we must return that instead of 'obj'.
    const isObject = typeof result === 'object' && result !== null;
    const isFunction = typeof result === 'function';

    return (isObject || isFunction) ? result : obj;
}

// TESTING OUR POLYFILL
function Person(name, color) {
    this.name = name;
    this.color = color;
}

Person.prototype.identify = function () {
    console.log(`I am ${this.name}, and my color is ${this.color}`);
};

const ninja = myNew(Person, "Hanzo", "Blue");

ninja.identify(); // Works! 
console.log(ninja instanceof Person); // true (Correctly linked prototype)

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What happens if a constructor returns a Primitive (like string/number)?
 * A1: The primitive is ignored, and the default 'this' object created 
 *     in step 1 is returned instead.
 * 
 * Q2: Why is Object.create(Proto) better than manually setting __proto__?
 * A2: Object.create is a cleaner API and setting `__proto__` manually 
 *     can be slower in some JS engines due to de-optimization of 
 *     hidden classes.
 * 
 * Q3: Can you call a class using your myNew function?
 * A3: No. Classes have the [[IsClassConstructor]] internal property 
 *     set to true, and the engine throws an error if they are 
 *     executed via .apply() or .call() without 'new'.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     function Warrior(n) { this.n = n; return { power: 100 }; }
 *     const w = new Warrior("Kyo");
 *     console.log(w.n);
 * (Answer: undefined. Because the constructor RETURNED an object, 
 *  the 'this' object containing 'n' was discarded.)
 * 
 * Q2: What happens if Constructor.prototype is null?
 * (Answer: The new object will have a null prototype (no inheritance 
 *  from Object.prototype).)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Factory" function that replaces 'new' 
 *              for a simplified object creation API.
 * Challenge 2: Deep dive into the "Prototype-less Object" (Object.create(null)) 
 *              and why it is useful for High-Performance caching.
 */
