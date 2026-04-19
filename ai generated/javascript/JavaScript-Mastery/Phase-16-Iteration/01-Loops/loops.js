/**
 * ==========================================
 * TOPIC 01: STANDARD & MODERN LOOPS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 16: Iteration & Control Flow
 * 
 * 1. THE CLASSIC LOOPS
 * -------------------
 * - for: Best when you know the start, end, and step.
 * - while: Best when you're waiting for a condition (e.g., a signal).
 * - do...while: Rare, but essential when you MUST run the body at least once.
 * 
 * 2. THE MODERN COMPARISON
 * ------------------------
 * - Array.forEach: Functional, but you CANNOT 'break' or 'continue'.
 * - for...in: Iterates over ENUMERABLE properties (Keys). 
 *   Warning: Includes properties from the prototype chain!
 * - for...of: Iterates over ITERABLE values (Elements). 
 *   The winner for Arrays, Strings, and Sets/Maps.
 */

"use strict";

/**
 * 1. THE CLASSIC C-STYLE FOR
 * Performance: The fastest loop in V8 for large arrays.
 */
const arr = ['a', 'b', 'c'];
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'b') continue; // Skip 'b'
    console.log("Classic For:", arr[i]);
}

/**
 * 2. FOR...IN vs FOR...OF (The Interview Trap)
 */
const person = { name: 'Antigravity', role: 'Mentor' };
Object.prototype.globalInjected = "I am everywhere!";

console.log("--- FOR...IN (Object Keys) ---");
for (const key in person) {
    // Pitfall: It finds 'globalInjected' because it's enumerable!
    if (Object.hasOwn(person, key)) { // The safe way
        console.log(`Key: ${key}, Value: ${person[key]}`);
    }
}

console.log("--- FOR...OF (Array Values) ---");
const numbers = [10, 20, 30];
for (const num of numbers) {
    if (num > 25) break;
    console.log("Value:", num);
}

/**
 * 3. THE "WHILE" POWER PATTERN
 * Used for non-linear iteration (e.g., consuming a stack)
 */
const stack = [1, 2, 3, 4, 5];
while (stack.length > 2) {
    const item = stack.pop();
    console.log("Consumed from stack:", item);
}

/**
 * 4. PERFORMANCE COMPARISON
 */
function benchmarkLoops() {
    const big = new Array(1000000).fill(1);

    console.time("For (Classic)");
    let sum1 = 0;
    for (let i = 0; i < big.length; i++) sum1 += big[i];
    console.timeEnd("For (Classic)");

    console.time("For...of");
    let sum2 = 0;
    for (const v of big) sum2 += v;
    console.timeEnd("For...of");

    console.time("forEach");
    let sum3 = 0;
    big.forEach(v => sum3 += v);
    console.timeEnd("forEach");
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Can you use 'await' inside a .forEach() loop?
 * A1: Technically yes, but it won't wait. `forEach` executes all 
 *     calls immediately. Use `for...of` for sequential async tasks.
 * 
 * Q2: What is the benefit of `do...while` over `while`?
 * A2: Guaranteed execution of the first iteration. Use cases include 
 *     prompting a user for input until they give a valid answer.
 * 
 * Q3: Why is `for...in` discouraged for Arrays?
 * A3: It iterates over indices as STRINGS ("0", "1") and might 
 *     include non-numeric properties if someone modified the Array 
 *     prototype. Order is also not guaranteed.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What happens if you use `break` inside a `.map()`?
 * (Answer: SyntaxError. You cannot break/continue inside HOFs. 
 *  This is a huge reason to prefer `for...of` in complex logic.)
 * 
 * Q2: If I have `const arr = [undefined, undefined]`, how many 
 *     times does `for...of` run?
 * (Answer: 2. It iterates over every value, even if it's undefined.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a deep lookup loop that traverses a linked list 
 *              until it finds a node with `data === null`.
 * Challenge 2: Refactor a nested `.forEach()` mess into a clean 
 *              sequential `for...of` structure using `break`.
 */
