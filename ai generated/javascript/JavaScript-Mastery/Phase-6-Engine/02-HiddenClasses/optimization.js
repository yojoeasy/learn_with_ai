/**
 * ==========================================
 * TOPIC 02: HIDDEN CLASSES & INLINE CACHING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * JavaScript objects are dynamic, but accessing properties via 
 * hash table lookups is slow. V8 solves this by creating 
 * "Hidden Classes" (or "Shapes") behind the scenes.
 * 
 * - Hidden Classes: 
 *   When you create `{ x: 1, y: 2 }`, V8 creates two hidden classes: 
 *   C0: Empty -> C1: {x} -> C2: {x, y}.
 * 
 * - Rule of Property Order: 
 *   If you swap the order `{ y: 2, x: 1 }`, V8 creates DIFFERENT 
 *   hidden classes. Two objects with different hidden classes are 
 *   "Polymorphic" and slower to process.
 * 
 * 2. INLINE CACHING (IC)
 * ----------------------
 * If a function repeatedly accesses a property (e.g., `obj.x`), 
 * V8 records the offset of `x` in the hidden class. 
 * The next time, it skips the lookup and goes straight to that memory offset.
 * 
 * 3. INTERNAL WORKING (V8 ENGINE)
 * --------------------------------
 * V8 stores property values in "Properties" or "Elements" (for arrays). 
 * "In-object properties" are stored directly on the object for 
 * ultra-fast access, while "Dictionary properties" (for large, 
 * dynamic objects) are stored in a slow hash map.
 * 
 * 4. VISUAL MENTAL MODEL: THE LIBRARY AISLES
 * ------------------------------------------
 * Think of an object as a "Library Aisle".
 * - Standard JS: The books (properties) are randomly scattered. 
 *   You have to search every shelf to find a book.
 * - Hidden Classes: V8 creates a "Map" that says "Book X is always 
 *   the 3rd book from the left". 
 * - Inline Caching: You've memorized that layout, so you don't even 
 *   look at the Map anymore; you just reach out and grab the 3rd book.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - De-optimization: Adding properties to an object after it's been 
 *   initialized breaks the hidden class chain.
 * - `delete` Operator: Using `delete obj.prop` turns the object into 
 *   "Dictionary Mode", making it significantly slower.
 */

// --- ONE BAD EXAMPLE: Changing property order ---
function Point(x, y) {
    this.x = x;
    this.y = y;
}

const p1 = new Point(1, 2);
const p2 = {};
p2.y = 2; // Different hidden class chain!
p2.x = 1;

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Consistent Shapes) ---
"use strict";

/**
 * Senior rule: Always initialize properties in the exact 
 * same order inside the constructor.
 */
class UserProfile {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        // 1. Keep shapes identical
    }
}

const u1 = new UserProfile("Ali", 25);
const u2 = new UserProfile("Bari", 30);

// 2. AVOID dynamic additions later
// u1.gender = "M"; // This creates a new hidden class fork!

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a Hidden Class in V8?
 * A1: It's an internal object that V8 uses to store the "shape" of an 
 *     object (its property names and their memory offsets) to speed 
 *     up property lookups.
 * 
 * Q2: Why is the 'delete' keyword considered bad for performance?
 * A2: It removes the object's hidden class and puts the object into 
 *     "Slow/Dictionary Mode", where lookups are done via hash tables.
 * 
 * Q3: How does Inline Caching (IC) work?
 * A3: It's an optimization that remembers the results of property 
 *     lookups at a specific call site, assuming future objects will 
 *     have the same shape.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Given `obj1 = {a: 1, b: 2}` and `obj2 = {b: 2, a: 1}`, do they 
 *     share the same hidden class?
 * (Answer: No. Property addition order matters for the hidden class chain.)
 * 
 * Q2: What happens if you add 100 properties to an object?
 * (Answer: V8 might transition the object from "Fast Mode" to 
 *  "Dictionary/Hash Map Mode" to save memory if the hidden class 
 *  tree becomes too complex.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Optimize a data processing script that creates millions 
 *              of objects with varying properties.
 * Challenge 2: Research "Mono-morphism vs Poly-morphism" in V8's Inline 
 *              Caching and write a function that stays Mono-morphic.
 */
