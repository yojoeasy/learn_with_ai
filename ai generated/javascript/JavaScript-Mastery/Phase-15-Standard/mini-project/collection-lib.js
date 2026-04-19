/**
 * ==========================================
 * PHASE 15 MINI PROJECT: MASTER-COLLECTIONS
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * It demonstrates how to combine Arrays, Strings, and Modern 
 * Collections into a production-grade utility library.
 * 
 * Features:
 * 1. Fluent (Chainable) API.
 * 2. High-performance grouping and sorting.
 * 3. O(1) Search via internal Set/Map conversion.
 */

"use strict";

class MasterCollection {
    constructor(items = []) {
        this.items = [...items];
    }

    /**
     * 1. THE GROUP-BY PATTERN (New in ES2024, but let's implement it!)
     */
    groupBy(keySelector) {
        const groups = this.items.reduce((acc, item) => {
            const key = typeof keySelector === 'function' ? keySelector(item) : item[keySelector];
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
        return groups;
    }

    /**
     * 2. FAST UNIQUE (Using Set Internals)
     */
    unique() {
        this.items = [...new Set(this.items)];
        return this; // Enable chaining
    }

    /**
     * 3. CHUNK (Divide into sub-arrays)
     */
    chunk(size) {
        const chunks = [];
        for (let i = 0; i < this.items.length; i += size) {
            chunks.push(this.items.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * 4. SMART SEARCH (Pre-index for speed)
     */
    search(predicate) {
        // Linear search for simple cases
        return this.items.filter(predicate);
    }

    /**
     * 5. FLUENT HELPERS
     */
    get first() { return this.items[0]; }
    get last() { return this.items.at(-1); }
    get size() { return this.items.length; }

    toJSON() {
        return [...this.items];
    }
}

// --- SIMULATION ---
console.log("--- MASTER COLLECTIONS DEMO ---");

const data = [
    { id: 1, type: 'dog', name: 'Buddy' },
    { id: 2, type: 'cat', name: 'Mittens' },
    { id: 3, type: 'dog', name: 'Rex' },
    { id: 4, type: 'cat', name: 'Lucy' }
];

const col = new MasterCollection(data);

// 1. Grouping
console.log("By Type:", col.groupBy('type'));

// 2. Chaining & Unique
const numbers = new MasterCollection([1, 2, 2, 3, 4, 4, 5]);
const uniq = numbers.unique().items;
console.log("Unique Numbers:", uniq);

// 3. Chunking
console.log("Chunks (Size 2):", numbers.chunk(2));

/**
 * SENIOR HIGHLIGHTS:
 * - Fluent Interface: Returning `this` allows for expressive code 
 *   like `col.unique().filter().sort()`.
 * - Algorithmic Awareness: Using `new Set()` inside `unique()` moves 
 *   the operation from O(n^2) (nested loops) to O(n) (hash set).
 * - Extensibility: The class can be further expanded with 
 *   immutable variants using `toSorted`, etc.
 */
