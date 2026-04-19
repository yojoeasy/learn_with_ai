/**
 * ==========================================
 * TOPIC 01: PROTOTYPE POLLUTION & HARDENING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Security
 * 
 * 1. THE DEEP DIVE: PROTOTYPE POLLUTION
 * -------------------------------------
 * Prototype pollution is a vulnerability where an attacker manipulates 
 * the `Object.prototype` (the root object). Since almost all objects 
 * in JS inherit from this prototype, polluting it affects the entire 
 * application.
 * 
 * - The Mechanism: Injecting a property via `__proto__` or `constructor.prototype`.
 * - The Risk: Denial of Service (DoS), unauthorized access, or bypass 
 *   of internal logic.
 * 
 * 2. SECURE OBJECT MERGING
 * -------------------------
 * Merging objects (e.g., config overrides) is the most common entry 
 * point for pollution. A "shallow" copy like `Object.assign` is safe, 
 * but a "recursive/deep merge" often fails to block the `__proto__` key.
 * 
 * 3. INTERNAL WORKING (INHERITANCE)
 * ----------------------------------
 * When you change `Object.prototype.isAdmin = true`, every single 
 * object literal `{}` in your app now has `isAdmin === true`.
 * 
 * 4. VISUAL MENTAL MODEL: THE SHARED WELL
 * ----------------------------------------
 * - Normal Objects: Individual houses with their own water tanks.
 * - Prototype: The shared community well (Object.prototype).
 * - Pollution: An intruder pours dye into the shared well. 
 * - Result: Every house in the community now has colored water, 
 *   even if they didn't touch the well themselves.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Object.create(null): Creating objects that don't inherit from 
 *   Object.prototype is the ultimate defense for 'Map-like' objects.
 * - Map vs Object: `new Map()` is immune to prototype pollution as it 
 *   doesn't use prototype-based string keys for storage.
 */

// --- ONE BAD EXAMPLE: Vulnerable Deep Merge ---
function badMerge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            badMerge(target[key], source[key]); // Recursion!
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// ATTACK:
// const attackerJSON = '{"__proto__": {"polluted": true}}';
// badMerge({}, JSON.parse(attackerJSON));
// console.log({}.polluted); // true! (Oops, global pollution)

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Hardened Logic) ---
"use strict";

/**
 * 1. SECURE DEEP MERGE
 * Always block sensitive prototype keys.
 */
function secureMerge(target, source) {
    for (let key in source) {
        // DEFENSE: Block the dangerous keys!
        if (key === "__proto__" || key === "constructor") continue;

        if (typeof source[key] === "object" && source[key] !== null) {
            if (!target[key]) target[key] = {};
            secureMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * 2. THE ULTIMATE DEFENSE: Object.create(null)
 * This creates a "Dictionary" object with NO prototype.
 */
const secureStorage = Object.create(null);
// secureStorage.__proto__ does NOT exist.
// Even if Object.prototype is polluted, this object remains pure.

/**
 * 3. PREVENTING XSS (innerHTML)
 * Never use innerHTML with user-provided strings.
 */
const sanitizeAndRender = (el, text) => {
    // SECURITY: textContent encodes all HTML entities
    el.textContent = text;
};

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is Prototype Pollution?
 * A1: It's the ability to inject properties into built-in 
 *     prototypes like Object.prototype, affecting all objects 
 *     in the application.
 * 
 * Q2: Why is 'use strict' important for security?
 * A2: It prevents accidental globals and makes the 'this' 
 *     context undefined in global functions, preventing 
 *     access to the global object.
 * 
 * Q3: Why is using 'Map' safer than an Object for user-driven keys?
 * A3: Maps do not inherit from Object.prototype for their keys. 
 *     A key named "__proto__" in a Map is just a string, not 
 *     a link to the inheritance chain.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the value of '{} instanceof Object' if I set 
 *     'Object.prototype = null'?
 * (Answer: It will likely throw an error or behave unexpectedly 
 *  as the identity of the root constructor is damaged.)
 * 
 * Q2: Can a frozen object (`Object.freeze`) be polluted via 
 *     prototype pollution?
 * (Answer: If the OBJECT is frozen, you cannot add properties to it. 
 *  HOWEVER, you can still access polluted properties inherited 
 *  from its prototype if the prototype itself wasn't frozen.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a utility to 'Freeze' the built-in 
 *              prototypes on app startup to prevent any pollution.
 * Challenge 2: Audit a legacy "Config Loader" and identify 
 *              potential pollution vectors during JSON parsing.
 */
