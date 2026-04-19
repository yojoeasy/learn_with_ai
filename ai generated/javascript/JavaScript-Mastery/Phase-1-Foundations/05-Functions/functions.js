/**
 * ==========================================
 * TOPIC 05: FUNCTIONS & IIFE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Functions in JS are "First-Class Objects". This means they can be:
 * 1. Assigned to variables.
 * 2. Passed as arguments.
 * 3. Returned from other functions.
 * 
 * - Internal Working (The Function Object):
 *   - When you define a function, the engine creates an object with hidden slots:
 *     [[Code]]: The executable code.
 *     [[Environment]]: The scope where the function was created (Lexical Scope).
 *     [[Call]]: Invoked when the function is called.
 *     [[Construct]]: Invoked when used with 'new' (not present in Arrow Functions).
 * 
 * 2. DECLARATIONS VS EXPRESSIONS VS ARROWS
 * ----------------------------------------
 * | Feature             | Declaration      | Expression        | Arrow Function   |
 * |---------------------|------------------|-------------------|------------------|
 * | Hoisting            | Full             | Only var (undef)  | Only var (undef) |
 * | 'this' binding      | Dynamic          | Dynamic           | Lexical (Static) |
 * | 'arguments' object  | Yes              | Yes               | No               |
 * | Constructor (new)   | Yes              | Yes               | No               |
 * 
 * 3. IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION)
 * ------------------------------------------------
 * Historically used for "Module Patterns" and avoiding global namespace pollution. 
 * Since 'let' and 'const' are block-scoped, IIFE is used less now, but still critical 
 * for:
 * 1. Top-level await polyfills.
 * 2. Encapsulating logic inside a script without leaking ANY variables.
 * 
 * 4. VISUAL MENTAL MODEL: THE RECIPE BOX
 * --------------------------------------
 * Think of a function declaration as a "Recipe" in a shared box (hoisted). 
 * Think of a function expression as a recipe you keep in your wallet (variable). 
 * An arrow function is like a recipe that always uses the ingredients (this) 
 * from the kitchen you're standing in currently, not the kitchen where the 
 * recipe was found!
 * 
 * 5. EDGE CASES
 * -------------
 * - Arrow functions cannot be used as methods if they need 'this' from the object.
 * - Recursion: Function expressions need a name to call themselves effectively 
 *   (Named Function Expression).
 */

// --- ONE BAD EXAMPLE: Arrow function as a Method ---
const user = {
    name: "John",
    greet: () => {
        // 'this' is NOT the user object! It's the global object/window.
        console.log(`Hello, my name is ${this.name}`);
    }
};

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

const service = (function () {
    // PRIVATE members
    const apiKey = "SECRET_KEY";

    function logExecution() {
        console.log("Service log entry...");
    }

    // PUBLIC API (Module Pattern using IIFE)
    return {
        fetchData: function () {
            logExecution();
            return `Data from ${apiKey}`;
        },
        // Using concise method syntax (shorthand for function expression)
        processData(data) {
            return data.toUpperCase();
        }
    };
})();

// Arrow functions are perfect for callbacks (maintains 'this')
[1, 2, 3].map(n => n * 2);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a First-Class Citizen?
 * A1: In JS, it means functions are treated like any other variable. They have 
 *     a type (object/function) and can be passed around as data.
 * 
 * Q2: Difference between call() and an IIFE?
 * A2: call() executes an EXISTING function with a specific 'this' context. 
 *     An IIFE is a function that is DEFINED and EXECUTED at the same time.
 * 
 * Q3: Why don't arrow functions have their own 'this'?
 * A3: They were designed to capture the 'this' value of the enclosing lexical context. 
 *     This is highly useful for async callbacks (setTimeout, Promises) where 
 *     'this' would normally point to the global object.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     var x = 10;
 *     const obj = {
 *       x: 20,
 *       fn: function() {
 *         const inner = () => console.log(this.x);
 *         inner();
 *       }
 *     };
 *     obj.fn();
 * (Answer: 20. fn() is called on obj, so its 'this' is obj. inner() captures that 'this'.)
 * 
 * Q2: What is the output?
 *     (function() {
 *       var a = b = 3;
 *     })();
 *     console.log(typeof a);
 *     console.log(typeof b);
 * (Answer: "undefined", "number". b becomes a global variable (undeclared), 
 *  while a is local to the IIFE.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement an IIFE that creates a "Logger" module with private 
 *              counters for Warning/Error/Info logs.
 * Challenge 2: Refactor a nested callback chain into clean functions, 
 *              correctly deciding between arrow and regular functions.
 */
