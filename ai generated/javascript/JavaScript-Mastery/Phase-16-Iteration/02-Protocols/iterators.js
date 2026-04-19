/**
 * ==========================================
 * TOPIC 02: ITERATION PROTOCOLS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 16: Iteration & Control Flow
 * 
 * 1. THE DEEP DIVE: WHAT IS AN ITERABLE?
 * --------------------------------------
 * For an object to be "loopable" with `for...of`, it must 
 * implement the **Iterable Protocol**.
 * 
 * - Symbol.iterator: A method that returns an **Iterator**.
 * - Iterator Protocol: An object with a `.next()` method.
 * - .next(): Returns `{ value: any, done: boolean }`.
 * 
 * 2. WHY IT MATTERS
 * -----------------
 * This is how the Spread operator `[...]`, Destructuring `[a, b]`, 
 * and `for...of` work under the hood. By implementing this, 
 * you can turn a linked list, a tree, or any custom data structure 
 * into a first-class JS collection.
 */

"use strict";

/**
 * 1. THE MANUAL ITERATOR (Senior Pattern)
 * Let's make a custom "Range" object that doesn't store 
 * every number in an array (Memory efficient!).
 */
const range = {
    start: 1,
    end: 5,

    // The Iterable Protocol
    [Symbol.iterator]() {
        let current = this.start;
        let last = this.end;

        // The Iterator Protocol (returns the iterator object)
        return {
            next() {
                if (current <= last) {
                    return { value: current++, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
};

console.log("--- CUSTOM ITERATOR (Range) ---");
for (const n of range) {
    console.log("Looping Range:", n);
}

/**
 * 2. MAKING OBJECTS ITERABLE
 * Objects by default are NOT iterable. Let's fix that.
 */
const bookstore = {
    books: ['Deep Work', 'Clean Code', 'V8 Internals'],

    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.books.length) {
                    return { value: this.books[index++].toUpperCase(), done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log("--- ITERABLE OBJECT ---");
for (const book of bookstore) {
    console.log("Processing Book:", book);
}

/**
 * 3. THE SPREAD REVELATION
 * Because bookstore is now an iterable, spread works!
 */
const bookList = [...bookstore];
console.log("Spread worked on custom object:", bookList);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What happens if an iterator never returns `done: true`?
 * A1: You've created an Infinite Iterator. `for...of` will hang 
 *     unless you use a `break`. This is useful for ID generators.
 * 
 * Q2: Can an iterator be used twice?
 * A2: It depends. If you return a fresh iterator from `[Symbol.iterator]` 
 *     each time (like we did), yes. If you return `this`, the 
 *     iterator is "consumed" after the first run.
 * 
 * Q3: What is the difference between an Iterable and an Iterator?
 * A3: An Iterable is the "factory" (has Symbol.iterator). The 
 *     Iterator is the "machine" (has .next()).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I manually call `bookstore[Symbol.iterator]().next()`, 
 *     what do I get?
 * (Answer: `{ value: 'DEEP WORK', done: false }`. Useful for 
 *  debugging your custom iterator logic.)
 * 
 * Q2: Does `for...in` use the iterator protocol?
 * (Answer: NO. `for...in` looks at enumerable property keys. 
 *  Only `for...of` uses the iterator protocol.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a custom iterator for a Linked List.
 * Challenge 2: Write a "Backward Iterator" that loops over an 
 *              array from end to start using the protocol.
 */
