/**
 * ==========================================
 * TOPIC 02: THE 'this' KEYWORD
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * In JavaScript, 'this' is NOT a static reference to the current object. 
 * 'this' refers to the EXECUTION CONTEXT of a function call (The "WHO").
 * 
 * The value of 'this' is determined by HOW the function is called, not 
 * where it is defined (EXCEPT for arrow functions).
 * 
 * 2. THE FOUR RULES OF 'this' BINDING
 * -----------------------------------
 * Rule 1: Default Binding (Global/Undefined)
 * - In a standalone function call, 'this' is 'window' (Browser) or 'global' (Node).
 * - In 'strict mode', 'this' is 'undefined'.
 * 
 * Rule 2: Implicit Binding (Object Methods)
 * - When a function is called as a property of an object, 'this' is the object.
 * 
 * Rule 3: Explicit Binding (call, apply, bind)
 * - We can explicitly tell the engine what 'this' should be.
 * 
 * Rule 4: New Binding (Constructor Functions)
 * - When used with 'new', 'this' is the newly created object.
 * 
 * Rule 5: Arrow Functions (Lexical 'this')
 * - Arrows DON'T have their own 'this'. They inherit it from the parent scope.
 * 
 * 3. INTERNAL WORKING (V8 ENGINE)
 * --------------------------------
 * When an EC is created (Creation Phase), the engine sets the [[ThisValue]] 
 * for that context. 
 * - For Method calls: The engine looks at the object to the left of the DOT. 
 * - For Standalone calls: The engine sets the [[ThisValue]] to 'undefined' or global.
 * 
 * 4. VISUAL MENTAL MODEL: THE STAGE
 * ---------------------------------
 * Think of a function as an "Actor" and 'this' as the "Stage". 
 * - If the actor performs on the 'User' stage, 'this' is the User. 
 * - If the actor performs on the 'Global' street, 'this' is Global. 
 * - Arrow functions are like "Shadows" - they don't have their own stage, 
 *   they just stay on whatever stage their owner is on!
 */

// --- ONE BAD EXAMPLE: Losing 'this' context ---
const person = {
    name: "Alice",
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
};

const greetFn = person.greet;
// greetFn(); // Error! 'this' is lost (it's undefined/global now)

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

class DatabaseService {
    constructor(dbName) {
        this.dbName = dbName;
        // SOLUTION A: Manual Bind in constructor (Old class pattern)
        this.saveData = this.saveData.bind(this);
    }

    // SOLUTION B: Arrow function as a Class Property (Modern pattern)
    // This solves the 'this' problem automatically!
    logStatus = () => {
        console.log(`[${this.dbName}] Status: Connected`);
    }

    saveData(data) {
        console.log(`[${this.dbName}] Saving:`, data);
    }
}

const db = new DatabaseService("Production_DB");
const save = db.saveData;
save("Sensitive Info"); // Works safely because of .bind()

const log = db.logStatus;
log(); // Works safely because of Arrow function

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the binding order (precedence) for 'this'?
 * A1: new > Explicit (call/apply/bind) > Implicit (method) > Default (global/undefined).
 * 
 * Q2: Why don't Arrow Functions have their own 'this'?
 * A2: They were designed to avoid the 'var self = this' hack common in callbacks. 
 *     They resolve 'this' lexically - looking up the scope chain at creation.
 * 
 * Q3: What is 'this' in a browser DOM event listener?
 * A3: In a non-arrow function, 'this' is the element that received the event.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     var length = 10;
 *     function fn() { console.log(this.length); }
 *     var obj = {
 *       length: 5,
 *       method: function(fn) {
 *         fn(); 
 *         arguments[0](); 
 *       }
 *     };
 *     obj.method(fn, 1);
 * (Answer: 10, then 2. 
 *  1. fn() is a standalone call, 'this' is global/window (length=10).
 *  2. arguments[0]() is a method call on the 'arguments' object. 
 *     'this' is the arguments object, and its length is 2.)
 * 
 * Q2: What is the output?
 *     const user = {
 *       name: "Bob",
 *       get: () => console.log(this.name)
 *     };
 *     user.get();
 * (Answer: undefined (or empty string in Browser). Arrow function 
 *  inherits 'this' from the global scope where 'user' was defined.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Correctly set 'this' for a 'setTimeout' callback inside an object 
 *              using three different methods (bind, arrow, local variable).
 * Challenge 2: Implement a custom 'forEach' that accepts an optional 
 *              'thisArg' to execute the callback in a specific context.
 */
