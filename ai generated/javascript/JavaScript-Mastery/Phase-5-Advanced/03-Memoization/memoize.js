/**
 * ==========================================
 * TOPIC 03: MEMOIZATION (Performance)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Memoization is an optimization technique used primarily to speed 
 * up computer programs by storing the results of expensive function 
 * calls and returning the cached result when the same inputs 
 * occur again.
 * 
 * - Pure Functions Only: Memoization should ONLY be used on pure 
 *   functions. If a function's output depends on external state 
 *   (like time or a random number), caching is dangerous.
 * 
 * 2. INTERNAL WORKING (CLOSURES & HASH TABLES)
 * --------------------------------------------
 * A memoized function maintains a "Cache" object (usually a Map or 
 * a plain Object) inside its closure. 
 * - Key Generation: Arguments are serialized (via JSON.stringify or 
 *   a custom hash function) to serve as keys.
 * 
 * 3. MEMORY BEHAVIOR (HEAP COST)
 * ------------------------------
 * Memoization trades MEMORY for SPEED. 
 * - Heap Cost: Each unique set of arguments adds a new entry to the 
 *   cache object. This can lead to memory leaks if the input space 
 *   is infinite and the cache is never cleared.
 * 
 * 4. VISUAL MENTAL MODEL: THE LIBRARY CATALOG
 * -------------------------------------------
 * Imagine a librarian (the function) who has to look up a book's location.
 * - Standard: Every time someone asks for "Harry Potter", the librarian 
 *   walks to the shelves, finds it, and tells you.
 * - Memoized: The first time someone asks, the librarian writes the 
 *   location on a "Sticky Note" (The Cache). The next time anyone asks 
 *   for the SAME book, they just look at the note.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Serialization Cost: If the stringification of arguments is more 
 *   expensive than the actual computation, memoization will SLOW DOWN 
 *   your app.
 * - Cache Invalidation: Knowing when to clear the cache (e.g., using 
 *   a LRU - Least Recently Used - eviction strategy).
 */

// --- ONE BAD EXAMPLE: Memoizing an Impure Function ---
let multiplier = 2;
const badMemo = (n) => {
    // If we memoize this, it will ALWAYS return the FIRST 
    // calculated value even if multiplier changes later!
    return n * multiplier;
};

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

/**
 * Robust Memoization Utility
 */
function memoize(func) {
    const cache = new Map(); // Map is faster for lookups than plain objects

    return function (...args) {
        // 1. Generate a unique key for the arguments
        const key = JSON.stringify(args);

        // 2. Check if the value is in the cache
        if (cache.has(key)) {
            console.log(`[Cache Hit] returning cached value for: ${key}`);
            return cache.get(key);
        }

        // 3. Otherwise, compute and cache it
        console.log(`[Cache Miss] calculating value for: ${key}`);
        const result = func.apply(this, args);
        cache.set(key, result);

        return result;
    };
}

// EXAMPLE: Expensive Fibonnaci with Memoization
const slowFib = (n) => {
    if (n < 2) return n;
    return slowFib(n - 1) + slowFib(n - 2);
};

const fastFib = memoize(slowFib);

console.time("First Call");
console.log(fastFib(30)); // Calculated
console.timeEnd("First Call");

console.time("Second Call (Cached)");
console.log(fastFib(30)); // Immediate from cache
console.timeEnd("Second Call (Cached)");

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why use a Map over an Object for caching?
 * A1: Maps can take any type of key (not just strings), perform faster 
 *     in high-frequency read/write scenarios, and preserve the insertion order.
 * 
 * Q2: How do you handle non-serializable arguments (like Symbols or Functions)?
 * A2: JSON.stringify ignores them. A custom key generator should be used 
 *     in these cases.
 * 
 * Q3: What is "Memoization Bloom"?
 * A3: It's an informal term for when a cache grows so large it causes a 
 *     memory overflow. Caching infinite input spaces should always 
 *     be restricted by a size limit or Time-To-Live (TTL).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Given `const m = memoize(id => id)`, what is the output of 
 *     `m({a: 1}) === m({a: 1})`?
 * (Answer: true. Both objects stringify to `{"a":1}`, so they hit the 
 *  same cache key.)
 * 
 * Q2: What happens if the function returns `undefined`?
 * (Answer: The `else` block should still handle it correctly by using 
 *  `Map.has()` to check existence, not just `Map.get() != null`.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a `memoizeWithTTL` that clears a cache entry 
 *              after X milliseconds.
 * Challenge 2: Build a memoization wrapper for a function that takes 
 *              heavy configuration objects.
 */
