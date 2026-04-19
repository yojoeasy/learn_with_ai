/**
 * ==========================================
 * TOPIC 01: EXECUTION CONTEXT & CALL STACK
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * The Execution Context (EC) is an abstract concept of an environment where 
 * JavaScript code is evaluated and executed. 
 * 
 * Types of Execution Context:
 * 1. Global Execution Context (GEC): Created by default. Only one exists.
 * 2. Function Execution Context (FEC): Created every time a function is CALLED.
 * 3. Eval Execution Context: Created inside an eval function (avoid use).
 * 
 * 2. THE TWO PHASES OF EXECUTION
 * ------------------------------
 * Every EC goes through two phases:
 * 
 * Phase A: Creation Phase (Memory Allocation)
 * - Create the Global Object (window/global).
 * - Create the 'this' binding.
 * - Setup Memory Heap for variables and functions (Hoisting happens here).
 * - Setup the Scope Chain.
 * 
 * Phase B: Execution Phase
 * - The engine executes code line-by-line.
 * - Variables are assigned values.
 * - Functions are executed.
 * 
 * 3. THE CALL STACK (LIFO)
 * ------------------------
 * The Call Stack is a "Last In, First Out" mechanism used by the engine 
 * to keep track of its place in the script.
 * - When a script starts, GEC is pushed onto the stack.
 * - When a function is called, a new FEC is pushed onto the stack.
 * - When the function finishes, its FEC is popped off.
 * 
 * 4. VISUAL MENTAL MODEL: THE STACK OF PLATES
 * -------------------------------------------
 * Think of the Call Stack as a stack of plates. 
 * - The bottom plate is the Global Context.
 * - Every function call adds a plate on top. 
 * - You can only wash (execute) the plate on the very top. 
 * - Once washed, discard it and move to the next one below.
 * 
 * 5. EDGE CASES
 * -------------
 * - Stack Overflow: Recursive functions without a base case will fill the 
 *   Call Stack until the engine throws "Maximum call stack size exceeded".
 * - Memory Leaks in Context: Closures that hold onto large objects in 
 *   an FEC that has finished but is still referenced elsewhere.
 */

// --- ONE BAD EXAMPLE: Recursive Stack Overflow ---
function recursiveChaos(n) {
    console.log("Adding to stack:", n);
    return recursiveChaos(n + 1); // No base case!
}
// recursiveChaos(1); // Un-comment to see the crash

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
/**
 * Using Tail-Call Optimization (TCO) concepts (where supported) 
 * or iterative approaches to keep the Call Stack clean.
 */
function factorial(n, accumulator = 1) {
    if (n <= 1) return accumulator;
    // The engine can theoretically optimize this if it's the last action
    return factorial(n - 1, n * accumulator);
}

function processDataSequentially(items) {
    items.forEach(item => {
        // Each call creates a mini FEC, executes, and pops off 
        // effectively managing stack memory.
        console.log("Processing:", item);
    });
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between Heap and Stack?
 * A1: The Stack is for static memory allocation (Primitives, ECs). 
 *     The Heap is for dynamic memory allocation (Objects, Arrays).
 * 
 * Q2: What happens if the Call Stack is empty?
 * A2: The Event Loop checks the Callback Queue/Microtask Queue for 
 *     pending tasks (this is the key to JS concurrency).
 * 
 * Q3: Does 'let' and 'const' go into the Global Object during GEC?
 * A3: No. In modern engines, they are stored in a 'Declarative Environment Record', 
 *     keeping the Global Object (window) clean.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the sequence of EC creation for this code?
 *     function a() { b(); }
 *     function b() { c(); }
 *     function c() { console.log('done'); }
 *     a();
 * (Answer: GEC -> FEC(a) -> FEC(b) -> FEC(c). Then C pops, B pops, A pops, GEC stays.)
 * 
 * Q2: What happens to the stack here?
 *     function foo() { setTimeout(foo, 0); }
 *     foo();
 * (Answer: It DOES NOT overflow. setTimeout pushes the next 'foo' to the 
 *  Task Queue. The current 'foo' FEC pops off, then the Event Loop 
 *  pushes the next 'foo' back onto an EMPTY stack.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Log the execution time and stack depth of a complex calculation.
 * Challenge 2: Refactor a deep recursive tree traversal into an iterative 
 *              version using a manual Stack [] to avoid GEC limits.
 */
