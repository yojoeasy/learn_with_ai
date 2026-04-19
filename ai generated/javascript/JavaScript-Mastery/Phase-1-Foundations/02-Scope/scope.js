/**
 * ==========================================
 * TOPIC 02: SCOPE (Global, Function, Block, Lexical)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Scope is the "Range of Visibility" of variables and functions. 
 * JavaScript uses 'Lexical Scoping' (also known as Static Scoping). 
 * This means the scope is determined at PARSE TIME (where the code is WRITTEN),
 * not at runtime (where it is CALLED).
 * 
 * 2. INTERNAL WORKING (SCOPE CHAIN)
 * ---------------------------------
 * Each Execution Context has an associated 'Lexical Environment'. 
 * A Lexical Environment consists of:
 * 1. Environment Record: Where actual variable/function bindings are stored.
 * 2. Reference to Outer Environment: This creates the "Scope Chain".
 * 
 * When a variable is accessed (RHS lookup), the engine:
 * 1. Looks in the current Environment Record.
 * 2. If not found, follows the outer reference to the next record.
 * 3. Stops at the Global Environment record. If still not found, throws ReferenceError.
 * 
 * 3. MEMORY BEHAVIOR
 * -----------------
 * Scopes aren't just abstract concepts. They are objects in memory.
 * - Global Scope: Lives forever (until the process/tab ends). 
 * - Function Scope: Created when the function is called, destroyed (usually) when it returns.
 * - Block Scope: Tiny, ephemeral environment records created for { ... } blocks.
 * 
 * 4. VISUAL MENTAL MODEL: NESTED BUCKETS
 * --------------------------------------
 * Think of scopes as transparent buckets nested inside one another.
 * You can look OUT from inside a bucket to see variables in outer buckets.
 * But you cannot look IN to a nested bucket from the outside.
 * 
 * 5. EDGE CASES
 * -------------
 * - Shadowing: Declaring a variable with the same name in a deeper scope.
 * - Illegal Shadowing: You cannot shadow a 'let/const' with a 'var' in the same block.
 * - Strict Mode: Prevents accidental creation of global variables (leaking globals).
 */

// --- ONE BAD EXAMPLE: Global Leakage & Pollution ---
function leakToGlobal() {
    userName = "Antigravity"; // Oops! No var/let/const - attaches to globalObject

    if (true) {
        var functionScoped = "I am everywhere in this function";
    }
    console.log(functionScoped); // Accessing block-declared var outside block (Confusing!)
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict"; // ALWAYS use strict mode to prevent scope mistakes

const GLOBAL_CONFIG = "V1.0"; // Pure Global Scope

function outerProcess() {
    const processId = 101; // Function Scope

    function innerWorker() {
        const workerId = 202; // Lexical Scope - remembers its parent!

        if (true) {
            const blockSpecificId = 303; // Block Scope (let/const)
            console.log(GLOBAL_CONFIG, processId, workerId, blockSpecificId); // Look OUTS (Scope Chain)
        }

        // console.log(blockSpecificId); // ReferenceError (Correct encapsulation)
    }

    innerWorker();
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is Lexical Scoping?
 * A1: It's a scope model where variable access is determined by where the function 
 *     is defined in the source code. The function "remembers" its parent scope forever.
 * 
 * Q2: What is the difference between Scope and Context?
 * A2: Scope refers to variable accessibility (The "Where"). Context refers to the `this` 
 *     keyword (The "Who" is calling the function).
 * 
 * Q3: What is the Scope Chain?
 * A3: It is the hierarchy of nested Lexical Environments that the engine traverses 
 *     to find a variable binding. It always ends at the Global scope.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     let x = 10;
 *     function foo() {
 *         console.log(x);
 *     }
 *     function bar() {
 *         let x = 20;
 *         foo();
 *     }
 *     bar();
 * (Answer: 10. Lexical Scope! foo() was defined in the outer scope where x=10.)
 * 
 * Q2: What is the output?
 *     for (let i = 0; i < 3; i++) {
 *         setTimeout(() => console.log(i), 1);
 *     }
 * (Answer: 0, 1, 2. Each iteration of the block scope creates a NEW 'i' binding.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Avoid "Variable Shadowing" in a nested API handler where `req` 
 *              might be reused in sub-callbacks.
 * Challenge 2: Use IIFE to create a private scope for a utility library, 
 *              preventing global namespace pollution.
 */
