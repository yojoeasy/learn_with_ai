/**
 * ==========================================
 * TOPIC 01: OBJECTS MEMORY & COPYING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * In JavaScript, objects are Reference Types. 
 * While primitives live on the Stack (LIFO), objects live on the Heap (Dynamic).
 * 
 * - Memory Reference: When you assign an object to a variable, you aren't 
 *   storing the object data. You are storing a MEMORY ADDRESS (Pointer).
 * - Garbage Collection: V8 uses a "Mark-and-Sweep" algorithm. If an object 
 *   in the Heap is no longer reachable from any root (like the Global object 
 *    or the current Call Stack), it is marked for collection.
 * 
 * 2. SHALLOW VS DEEP COPY
 * -----------------------
 * - Shallow Copy: Copies the top-level properties. Nested objects still 
 *   point to the SAME memory address in the Heap.
 * - Deep Copy: Recursively copies every level of the object, creating 
 *   entirely new memory allocations for everything.
 * 
 * 3. INTERNAL WORKING (V8 HIDDEN CLASSES)
 * ----------------------------------------
 * JavaScript objects are dynamic, but V8 optimizes them using 'Hidden Classes' (Shapes). 
 * If two objects have the same properties in the same order, they share a Hidden Class, 
 * making property access as fast as a C++ struct. 
 * Senior Tip: Always initialize object properties in the same order!
 * 
 * 4. VISUAL MENTAL MODEL: THE LOCKER ROOM
 * ---------------------------------------
 * Imagine a locker room (The Heap). 
 * - A primitive is a small item you hold in your hand (The Stack). 
 * - An object is a locked locker. The variable is just the KEY (The Reference). 
 * - Giving a variable to someone else is like giving them a COPY of the key. 
 *   If they change what's inside the locker, YOU see the change too!
 * 
 * 5. EDGE CASES
 * -------------
 * - Circular References: Deep cloning an object that points back to itself 
 *   will cause infinite recursion unless handled with a Map/WeakMap.
 * - Non-serializable types: `JSON.parse(JSON.stringify(obj))` fails for 
 *   Functions, Dates, undefined, Symbols, and Maps/Sets.
 */

// --- ONE BAD EXAMPLE: Shallow Copy Pitfall ---
const originalUser = {
    id: 1,
    profile: {
        name: "Dev",
        hobbies: ["coding"]
    }
};

const shallowCopy = { ...originalUser };
shallowCopy.profile.name = "Hacker";

// console.log(originalUser.profile.name); // "Hacker" - OOPS! Original was mutated.

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

/**
 * A robust Deep Clone utility (Senior Approach)
 * Handles nested objects, arrays, and prevents circular refs.
 */
function deepClone(obj, hash = new WeakMap()) {
    // 1. Handle primitives and null
    if (obj === null || typeof obj !== 'object') return obj;

    // 2. Handle circular references
    if (hash.has(obj)) return hash.get(obj);

    // 3. Handle Date and RegExp
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);

    // 4. Create new instance based on prototype
    const result = new obj.constructor();
    hash.set(obj, result);

    // 5. Recursively clone properties
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = deepClone(obj[key], hash);
        }
    }

    return result;
}

// Modern Native Alternative (ES2022+): structuredClone()
const deep = structuredClone(originalUser);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between a Pointer and a Reference in JS?
 * A1: Technically, JS has References. A Reference points to the object's 
 *     location in memory. Unlike C++, you cannot perform pointer arithmetic 
 *     or access the actual memory address directly.
 * 
 * Q2: Why is JSON.stringify() a bad way to deep clone?
 * A2: It loses data: ignores functions, symbols, and undefined. It 
 *     converts Dates to strings and fails on circular references.
 * 
 * Q3: How does V8 optimize property access?
 * A3: Via Hidden Classes (Shapes) and Inline Caching. If the "shape" of 
 *     objects is identical, V8 avoids expensive hash map lookups.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     const a = { x: 1 };
 *     const b = a;
 *     a.x = 2;
 *     console.log(b.x);
 * (Answer: 2. Both variables point to the same memory address.)
 * 
 * Q2: What is the output?
 *     const a = { x: 1 };
 *     const b = { x: 1 };
 *     console.log(a === b);
 * (Answer: false. Even if contents are identical, they point to 
 *  two DIFFERENT memory addresses in the Heap.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "State Manager" that saves a deep copy of the 
 *              application state to ensure "Time Travel Debugging" works.
 * Challenge 2: Use Object.seal() and Object.freeze() to protect a critical 
 *              config object and explain the difference between the two.
 */
