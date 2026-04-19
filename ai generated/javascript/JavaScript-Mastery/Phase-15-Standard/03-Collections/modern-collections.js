/**
 * ==========================================
 * TOPIC 03: MODERN COLLECTIONS (Map/Set)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 15: Standard Library Mastery
 * 
 * 1. THE DEEP DIVE: MAP vs OBJECT
 * -------------------------------
 * While `{}` is the classic store, `Map` is better for data:
 * - Key Types: Objects only allow Strings/Symbols. Map allows 
 *   Functions, Objects, and primitives as keys.
 * - Iteration: Map remembers insertion order and is directly 
 *   iterable.
 * - Performance: Map performs significantly better in scenarios 
 *   involving frequent additions and removals of key-value pairs.
 * 
 * 2. SET vs ARRAY
 * ---------------
 * - Uniqueness: Set automatically handles de-duplication.
 * - Search Speed: `set.has(val)` is O(1). `arr.includes(val)` is O(n). 
 *   For large lists, Set is 100x faster for checks.
 * 
 * 3. THE "WEAK" COLLECTIONS (Memory Management)
 * ---------------------------------------------
 * `WeakMap` and `WeakSet` do NOT prevent garbage collection of 
 * their keys.
 * - Use Case: Storing "External" metadata about an object (e.g., 
 *   private data for a class instance or DOM node metadata) 
 *   without causing memory leaks.
 */

"use strict";

/**
 * 1. MAP: Non-string Keys
 */
const registry = new Map();
const user1 = { id: 1, name: 'Alice' };

registry.set(user1, { lastLogin: Date.now(), accessLevel: 'admin' });

// We can look up data USING THE OBJECT ITSELF as a key
console.log("User 1 Metadata:", registry.get(user1));

/**
 * 2. SET: High-speed Membership Testing
 */
const bigArray = Array.from({ length: 100000 }, (_, i) => i);
const bigSet = new Set(bigArray);

console.time("Array.includes (O(n))");
bigArray.includes(99999);
console.timeEnd("Array.includes (O(n))");

console.time("Set.has (O(1))");
bigSet.has(99999);
console.timeEnd("Set.has (O(1))");

/**
 * 3. WEAKMAP: Private Data Pattern (Architect)
 */
const privateData = new WeakMap();

class SecureContainer {
    constructor(data) {
        // Store data in a WeakMap keyed by the instance
        privateData.set(this, { secret: data });
    }

    getSecret() {
        return privateData.get(this).secret;
    }
}

let box = new SecureContainer("Top Secret");
console.log("Secret:", box.getSecret());

// TRIGGERING GC:
// Once 'box' is nullified, the WeakMap entry will eventually 
// be cleared from memory automatically.
box = null;

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Can you iterate over a WeakMap?
 * A1: NO. Because elements could be garbage collected at any time, 
 *     making the list non-deterministic.
 * 
 * Q2: How do you get the size of a Map vs an Object?
 * A2: Map has the `.size` property (O(1)). Objects require 
 *     `Object.keys(obj).length` (O(n)).
 * 
 * Q3: Why is `new Set([1, 1, 2, 3])` useful?
 * A3: It's the fastest way to unique-ify an array: `[...new Set(arr)]`.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I use `map.set({}, "val")` twice, what is the size?
 * (Answer: 2. Each `{}` is a unique reference in memory.)
 * 
 * Q2: Can a string be a key in a WeakMap?
 * (Answer: NO. Keys in WeakMap must be regular Objects or Symbols. 
 *  Primitives cannot be tracked by garbage collection.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement an "Intersection" function for two Sets 
 *              (elements present in both).
 * Challenge 2: Use a WeakMap to build a "Memoization" utility 
 *              that works for functions accepting objects as arguments.
 */
