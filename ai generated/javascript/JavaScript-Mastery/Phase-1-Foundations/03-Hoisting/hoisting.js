/**
 * ==========================================
 * TOPIC 03: HOISTING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Hoisting is NOT physical code movement. It is a side effect of the 
 * 'Creation Phase' (Memory Allocation Phase) of an Execution Context.
 * 
 * - Memory Setup (Phase 1):
 *   - The engine scans code for declarations.
 *   - Function Declarations: Copied COMPLETELY to memory (Lexical Environment).
 *   - 'var' Variables: Allocated and initialized with 'undefined'.
 *   - 'let/const': Allocated but NOT initialized (Temporal Dead Zone).
 * 
 * - Execution (Phase 2):
 *   - Code is executed line by line. Assignments happen here.
 * 
 * 2. INTERNAL WORKING (V8 ENGINE)
 * --------------------------------
 * During compilation, the parser identifies all 'Declarative Bindings'. 
 * - Function declarations (at the top-level of their scope) are prioritized. 
 * - If multiple variables share a name with a function, the function "wins" 
 *   during the creation phase initially, but gets overwritten during execution 
 *   when the variable assignment occurs.
 * 
 * 3. MEMORY BEHAVIOR
 * -----------------
 * Hoisting ensures that the engine knows where everything is BEFORE 
 * it executes a single line. This allows mutually recursive functions 
 * (Function A calling B and vice-versa) to work regardless of order.
 * 
 * 4. VISUAL MENTAL MODEL: THE ELEVATOR
 * ------------------------------------
 * Think of your code as a building. During the creation phase, 
 * the 'Declarations Elevator' brings 'var' and 'functions' to the roof.
 * But 'let/const' are stuck in the elevator on the top floor and 
 * won't open their doors (TDZ) until the elevator operator (the engine) 
 * reaches their exact floor (line of declaration).
 * 
 * 5. EDGE CASES
 * -------------
 * - Class Hoisting: Classes are hoisted but behave like 'let/const' - accessing 
 *   them before declaration results in a ReferenceError.
 * - Arrow Functions: Since they are usually assigned to a variable (const/let/var), 
 *   they follow variable hoisting rules.
 */

// --- ONE BAD EXAMPLE: Mixing Hoisting logic ---
console.log(myVar); // undefined (Hoisted var)
// console.log(myLet); // ReferenceError (TDZ)

var myVar = "I am a var";
let myLet = "I am a let";

// console.log(sum(5, 5)); // TypeError: sum is not a function (it's undefined!)
var sum = (a, b) => a + b;

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
/**
 * 1. Organize code for readability, NOT just relying on hoisting.
 * 2. Declare helper functions at the bottom (optional style) or 
 *    use function declarations for core logic since they hoist safely.
 * 3. Never use var. Always use let/const to avoid 'undefined' bugs.
 */

try {
    mainProcess(); // Works because function declarations hoist completely
} catch (e) {
    console.error("Execution error:", e.message);
}

function mainProcess() {
    console.log("Process started...");
    const result = calculateValue(10); // Standard readable flow
    console.log("Result:", result);
}

function calculateValue(n) {
    return n * 2;
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is hoisted? Functions or Variables?
 * A1: Both. Function declarations are fully hoisted (body included). 
 *     Variables (var) are hoisted but initialized to undefined. 
 *     let/const are hoisted but remain in the TDZ.
 * 
 * Q2: Why does JavaScript hoist?
 * A2: To allow function declarations to be called before they are defined 
 *     (mutual recursion) and to facilitate the single-pass compilation process.
 * 
 * Q3: What happens if a function and var share the same name?
 * A3: During the creation phase, the function takes precedence. 
 *     However, if the variable is assigned later during execution, it overwrites the function.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     console.log(typeof foo);
 *     var foo = 10;
 *     function foo() { return "hello"; }
 * (Answer: "function". During creation phase, function foo is hoisted. 
 *  Then execution starts, console.log(typeof foo) sees the function.)
 * 
 * Q2: What is the output?
 *     var a = 1;
 *     function b() {
 *         a = 10;
 *         return;
 *         function a() {}
 *     }
 *     b();
 *     console.log(a);
 * (Answer: 1. Inside b(), 'function a() {}' is hoisted locally to the function scope, 
 *  creating a local variable 'a'. 'a=10' modifies the LOCAL 'a', not the global one.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Identify all potential TDZ ReferenceErrors in a messy legacy file.
 * Challenge 2: Refactor a callback-heavy script into a structured declaration-based flow.
 */
