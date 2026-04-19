/**
 * ==========================================
 * TOPIC 02: STRING PROTOTYPE & INTERNALS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 15: Standard Library Mastery
 * 
 * 1. THE DEEP DIVE: IMMUTABILITY
 * ------------------------------
 * Strings in JS are immutable. This means every time you 
 * "change" a string (`str += "!"`), V8 actually creates 
 * a WHOLE NEW string in memory and throws the old one away.
 * 
 * - Performance Trap: concatenation in a heavy loop can 
 *   cause massive Garbage Collection pressure.
 * 
 * 2. UNICODE & UTF-16
 * -------------------
 * JS uses UTF-16. This means standard characters take 2 bytes, 
 * but complex emojis (like 🏳️‍🌈) take "Surrogate Pairs".
 * - `.length` might not be what you think!
 * - `.at()` and `Array.from(str)` are safer for Unicode.
 * 
 * 3. TAGGED TEMPLATES
 * -------------------
 * A senior-level feature used by libraries like styled-components. 
 * Allows you to parse a template literal with a custom function.
 */

"use strict";

/**
 * 1. UNICODE AWARENESS
 */
const fire = "🔥";
console.log("Fire Length:", fire.length); // 2! (Surrogate Pair)
console.log("Safe Length:", [...fire].length); // 1 (Spread is Unicode-aware)

// Modern indexing
console.log("Modern Indexing:", fire.at(0)); // "🔥"
console.log("Legacy Indexing:", fire[0]); // "\ud83d" (Broken)

/**
 * 2. PERFORMANCE: CONCAT vs JOIN
 */
function benchmarkStrings() {
    let result = "";
    console.time("Concatenation (+)");
    for (let i = 0; i < 50000; i++) result += "a";
    console.timeEnd("Concatenation (+)");

    let buf = [];
    console.time("Array.join");
    for (let i = 0; i < 50000; i++) buf.push("a");
    const final = buf.join("");
    console.timeEnd("Array.join");
}

/**
 * 3. TAGGED TEMPLATE LITERALS (Architect Pattern)
 * Used to create DSLs (Domain Specific Languages)
 */
function bold(strings, ...values) {
    return strings.reduce((acc, str, i) => {
        return acc + str + (values[i] ? `**${values[i]}**` : "");
    }, "");
}

const name = "Antigravity";
const status = "Mastered";
console.log(bold`User ${name} has ${status} Strings.`);

/**
 * 4. SEARCH & REPLACE (Modern)
 */
const text = "JS is great. JS is everywhere.";
// replaceAll avoids the need for global regex /g
console.log(text.replaceAll("JS", "TypeScript"));

// matchAll - Returns an iterator with full group info
const regex = /is (\w+)/g;
for (const match of text.matchAll(regex)) {
    console.log(`Found adjective: ${match[1]}`);
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: If strings are immutable, how does `str[0] = "X"` behave?
 * A1: In non-strict mode, it fails silently. In strict mode, 
 *     it throws a TypeError. Strings cannot be partially modified.
 * 
 * Q2: What is the difference between `.slice()`, `.substring()`, 
 *     and `.substr()`?
 * A2: .slice is standard (handles negative indices). .substring 
 *     swaps parameters if start > end. .substr is DEPRECATED.
 * 
 * Q3: How do you handle multi-line strings in ES6?
 * A3: Using Backticks (`) - Template Literals.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is `typeof (new String("foo"))`?
 * (Answer: 'object'. Never use the String constructor as it creates 
 *  a wrapper object instead of a primitive literal.)
 * 
 * Q2: How do you compare strings with different Unicode normalizations?
 * (Answer: Use `.normalize()`. "e + accent" vs "é" are different 
 *  strings until normalized to NFC or NFD.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Sanitize" tagged template that escapes 
 *              HTML tags in values to prevent XSS.
 * Challenge 2: Write a function that checks if a string is a 
 *              palindrome, correctly handling Emojis.
 */
