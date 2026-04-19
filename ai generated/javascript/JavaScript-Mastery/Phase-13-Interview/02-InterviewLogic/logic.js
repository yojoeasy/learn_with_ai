/**
 * ==========================================
 * TOPIC 02: INTERVIEW LOGIC (Flatten, LRU)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Logic Mastery
 * 
 * 1. THE DEEP DIVE: RECURSION VS ITERATION
 * -----------------------------------------
 * Problems like "Flattening" test your ability to walk through 
 * nested data structures. 
 * - Recursion: Elegant, but risks Stack Overflow for deep nesting.
 * - Iteration (Stack/Queue): More performant for huge data, but 
 *   harder to read.
 * 
 * 2. THE LRU CACHE (Least Recently Used)
 * ---------------------------------------
 * An LRU Cache stores items with a limit. When the limit is reached, 
 * it deletes the "least recently used" item. 
 * - The Key Trick: In JS, `Map` remembers insertion order. 
 *   Re-inserting a key moves it to the end (Most Recent).
 */

"use strict";

/**
 * 1. FLATTEN ARRAY (Recursive)
 * Level: Mid-Senior
 */
function flattenArray(arr, depth = 1) {
    let result = [];
    arr.forEach(item => {
        if (Array.isArray(item) && depth > 0) {
            result.push(...flattenArray(item, depth - 1));
        } else {
            result.push(item);
        }
    });
    return result;
}

/**
 * 2. DEEP FLATTEN OBJECT (Interview Favorite)
 * Converts { a: { b: 1 } } -> { "a.b": 1 }
 */
function flattenObject(obj, prefix = "") {
    let result = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            Object.assign(result, flattenObject(obj[key], fullKey));
        } else {
            result[fullKey] = obj[key];
        }
    }
    return result;
}

/**
 * 3. LRU CACHE IMPLEMENTATION
 * Logic: O(1) Get, O(1) Set.
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Remembers order!
    }

    get(key) {
        if (!this.cache.has(key)) return -1;

        // Refresh: Delete and re-insert to move to "Most Recent"
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        // Remove existing key to refresh position
        if (this.cache.has(key)) this.cache.delete(key);

        this.cache.set(key, value);

        // Evict if over capacity
        if (this.cache.size > this.capacity) {
            // map.keys().next().value returns the FIRST (oldest) key
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }
}

// --- SIMULATION ---
console.log("--- FLATTEN DEMO ---");
const nested = [1, [2, [3, [4]]], 5];
console.log("Flattened (depth 2):", flattenArray(nested, 2));

console.log("\n--- LRU CACHE DEMO ---");
const lru = new LRUCache(2);
lru.put(1, "A");
lru.put(2, "B");
lru.get(1);     // Access 1, making 2 the oldest
lru.put(3, "C"); // Evicts 2
console.log("Value 1:", lru.get(1)); // "A"
console.log("Value 2:", lru.get(2)); // -1 (Evicted)

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why use a Map for LRU Cache instead of a plain Object?
 * A1: Map maintains insertion order and allows non-string keys. 
 *     With an Object, you'd need a separate Doubly Linked List 
 *     to track order manually.
 * 
 * Q2: How do you handle deep nesting in Flatten without Stack Overflow?
 * A2: Use an iterative approach with a Stack (Array) and a while loop.
 * 
 * Q3: Complexity of `Map.prototype.keys().next()`?
 * A3: O(1) in V8. It's a pointer to the head of the linked list 
 *     backing the Map.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What happens if I move a key in the Map by deleting and re-setting it? 
 * (Answer: It becomes the most recently inserted item, appearing 
 *  last in the iteration order.)
 * 
 * Q2: If `flattenObject` encounters an Array, how should it behave?
 * (Answer: Interviews differ. Some want indices as keys (`a.0`), 
 *  some want it treated as a primitive. Always clarify.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement the iterative version of `flattenArray`.
 * Challenge 2: Extend the LRU Cache to accept a TTL (Time to Live) 
 *              so items expire even if the capacity isn't full.
 */
