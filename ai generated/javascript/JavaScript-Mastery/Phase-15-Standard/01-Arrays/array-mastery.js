/**
 * ==========================================
 * TOPIC 01: ARRAY PROTOTYPE DEEP DIVE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 15: Standard Library Mastery
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * -------------------------------
 * In V8, Arrays aren't just one thing. Depending on content, 
 * they can be:
 * - Packed (Continuous memory, fast).
 * - Holey (Contains 'holes' like [1, , 3], slow).
 * - Dictionary (Sparse, very slow, acts like an object).
 * 
 * 2. PERFORMANCE COMPLEXITY (Big O)
 * ----------------------------------
 * - push/pop: O(1) - Adding/removing from end is fast.
 * - shift/unshift: O(n) - Adding/removing from start requires 
 *   re-indexing every element. (Avoid in long loops!)
 * - splice: O(n) - Middle operations are expensive.
 * - sort: O(n log n) - Uses Timsort (V8) or Quicksort.
 * 
 * 3. HIGH-ORDER FUNCTIONS (HOFs)
 * ------------------------------
 * Mastering the "Functional Three":
 * - Map: Projection (1:1 mapping).
 * - Filter: Selection (Subset).
 * - Reduce: Compression (State accumulation).
 * 
 * 4. THE IMMUTABLE AGE (ES2023+)
 * ------------------------------
 * Modern JS prefers non-mutating methods to avoid side effects:
 * - toSorted() instead of sort()
 * - toReversed() instead of reverse()
 * - toSpliced() instead of splice()
 */

"use strict";

/**
 * 1. THE POWER OF REDUCE (Senior Implementation)
 * Reduce is the "Swiss Army Knife". 
 * You can implement Map and Filter using only Reduce.
 */
const items = [
    { name: 'Laptop', price: 1000, category: 'Tech' },
    { name: 'Mouse', price: 50, category: 'Tech' },
    { name: 'Apple', price: 2, category: 'Fruit' }
];

// Grouping by Category (Modern approach)
const grouped = items.reduce((acc, obj) => {
    const key = obj.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
}, {});

/**
 * 2. SEARCHING & PREDICATES
 */
const hasExpensiveTech = items.some(i => i.price > 500 && i.category === 'Tech'); // true
const allAreCheap = items.every(i => i.price < 5000); // true
const findMouse = items.find(i => i.name === 'Mouse'); // { name: 'Mouse', ... }

/**
 * 3. PERFORMANCE TRAP: SHIFT vs POP
 */
function benchmarkQueue() {
    const arr = new Array(100000).fill(0);

    console.time('POP (Efficient)');
    while (arr.length) arr.pop();
    console.timeEnd('POP (Efficient)');

    const arr2 = new Array(100000).fill(0);
    console.time('SHIFT (Inefficient)');
    while (arr2.length) arr2.shift();
    console.timeEnd('SHIFT (Inefficient)');
}

/**
 * 4. MODERN ARRAY API (ES2022/2023)
 */
const chaotic = [3, 1, 4, 1, 5, 9];

// .at() - Negative indexing!
console.log("Last item:", chaotic.at(-1)); // 9

// .toSorted() - Doesn't mutate original
const sorted = chaotic.toSorted((a, b) => a - b);
console.log("Original remains:", chaotic); // [3, 1, 4, 1, 5, 9]

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a "sparse array" and why are they bad for performance?
 * A1: A sparse array has holes (e.g., `let a = []; a[1000] = 1`). 
 *     V8 cannot optimize these in memory as a simple array; it 
 *     must treat them as heavy Objects/Dictionaries.
 * 
 * Q2: Difference between `.forEach()` and `.map()`?
 * A2: .forEach just executes a function (side effect). .map returns 
 *     a NEW array with the results.
 * 
 * Q3: How does `Array.prototype.sort()` work by default?
 * A3: It converts elements to strings and sorts them lexicographically. 
 *     Example: `[1, 10, 2].sort()` -> `[1, 10, 2]` because "10" 
 *     comes before "2". Always provide a compare function.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What does `[1, 2, 3] + [4, 5, 6]` return?
 * (Answer: "1,2,34,5,6" - Arrays are coerced to strings and 
 *  concatenated. Use `.concat()` or spread `[...]` instead.)
 * 
 * Q2: Is `typeof []` an array?
 * (Answer: No, it's 'object'. Use `Array.isArray([])` for detection.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a function `chunk(arr, size)` that splits 
 *              an array into sub-arrays of a specific length.
 * Challenge 2: Deep Flatten an array manually vs using `.flat(Infinity)`.
 */
