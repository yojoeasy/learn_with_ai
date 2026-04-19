/**
 * ==========================================
 * TOPIC 01: VARIABLES (var, let, const)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * In modern engines (like V8), variable declaration isn't just "creating a name."
 * It's about how the memory is allocated during the 'Creation Phase' of the Execution Context.
 * 
 * - Memory Allocation (The Lexical Environment):
 *   - 'var': Allocated in the Global or Function scope's environment record and initialized with 'undefined'.
 *   - 'let/const': Also allocated but NOT initialized. This creates the Temporal Dead Zone (TDZ).
 * 
 * - Scope Binding:
 *   - 'var' is functionally or globally scoped.
 *   - 'let' and 'const' are block-scoped (attached to the closest { ... }).
 * 
 * 2. INTERNAL WORKING (V8 ENGINE)
 * --------------------------------
 * When V8 parses code, it builds an AST (Abstract Syntax Tree). 
 * During the execution context setup:
 * - 'var' declarations are hoisted to the top and attached to the Variable Object (VO).
 * - 'let' and 'const' are placed in a 'Declarative Environment Record', and the engine 
 *   throws a ReferenceError if you try to access them before the declaration is executed.
 * 
 * 3. MEMORY BEHAVIOR (STACK/HEAP)
 * ------------------------------
 * - Primitives (declared with var/let/const) usually live on the Stack for performance.
 * - Reference types (Objects/Arrays) live on the Heap, while their pointers (the variable itself) 
 *   stay on the Stack. 
 * - 'const' prevents the Pointer on the stack from being reassigned, but the values inside 
 *   the Heap (for objects/arrays) are still mutable.
 * 
 * 4. COMPARISON TABLE
 * -------------------
 * | Feature             | var              | let               | const            |
 * |---------------------|------------------|-------------------|------------------|
 * | Scope               | Functional/Global| Block { }         | Block { }        |
 * | Hoisting            | Yes (Undefined)  | Yes (Unitialized) | Yes (Uninitialized)|
 * | Re-declaration      | Yes              | No                | No               |
 * | Re-assignment       | Yes              | Yes               | No               |
 * | Global Object (win) | Yes (property)   | No                | No               |
 * | Temporal Dead Zone  | No               | Yes               | Yes              |
 * 
 * 5. EDGE CASES
 * -------------
 * - Shadowing: A block-scoped variable 'let x' inside a function can shadow a 'var x' 
 *   at the function level, but not the other way around (illegal shadowing).
 * - Global Object Pollution: 'var' at the top level attaches to `window` (browser) or `global` (Node), 
 *   potentially leading to memory leaks or namespace collisions.
 */

// --- ONE BAD EXAMPLE ---
function badPractices() {
    console.log(x); // Undefined (Hoisting confusion)
    var x = 10;

    if (true) {
        var x = 20; // Re-declares the SAME function-scoped 'x'
    }
    console.log(x); // 20 - Might be unexpected if you thought this was block-scoped

    for (var i = 0; i < 3; i++) {
        setTimeout(() => console.log('Bad for loop:', i), 100); // Prints 3 three times
    }
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
function seniorApproach() {
    // 1. Prefer const by default to prevent accidental reassignment
    const USER_CONFIG = Object.freeze({
        apiUrl: 'https://api.v1.com',
        timeout: 5000
    });

    // 2. Use let only when reassignment is mandatory (counters, commutators)
    let retryCount = 0;

    // 3. Proper block scoping in loops
    for (let i = 0; i < 3; i++) {
        // Each iteration gets its own unique lexical binding for 'i'
        setTimeout(() => console.log('Good for loop:', i), 100); // 0, 1, 2
    }

    // 4. Using const for immutable logic ensures easier debugging/predictability
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the Temporal Dead Zone (TDZ)?
 * A1: The period between the start of the block scope and the variable declaration where 
 *     accessing a 'let' or 'const' variable throws a ReferenceError. It prevents accessing 
 *     variables before they are logically available.
 * 
 * Q2: Does const make an object immutable?
 * A2: No. It only prevents the BINDING of the variable name to a new memory address (reassignment). 
 *     The contents of the object (on the Heap) can still be modified unless Object.freeze() is used.
 * 
 * Q3: Why did we move from var to let/const?
 * A3: To fix scoping issues (functional vs block), prevent accidental re-declarations, 
 *     improve predictability via TDZ, and make code easier to refactor.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     {
 *       console.log(a); 
 *       var a = 10;
 *       let b = 20;
 *     }
 * (Answer: undefined. var is hoisted outside the block to the nearest function/global scope.)
 * 
 * Q2: What is the output?
 *     const user = { name: "John" };
 *     user.name = "Doe";
 *     console.log(user.name);
 *     user = { name: "Jane" };
 * (Answer: "Doe", followed by a TypeError. Modification is allowed, reassignment is not.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Fix the global namespace pollution in a legacy script by converting var to let/const.
 * Challenge 2: Implement a 'Once' function that uses block-scoping to ensure a critical setting is 
 *              assigned only once.
 */

// Execution
badPractices();
seniorApproach();
