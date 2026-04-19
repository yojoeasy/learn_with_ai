/**
 * ==========================================
 * TOPIC 01: JIT COMPILATION (Ignition & TurboFan)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * V8 doesn't just "Interpret" JavaScript. It uses a Just-In-Time (JIT) 
 * compilation strategy to achieve near-native performance.
 * 
 * - The Pipeline:
 *   1. Parser: Converts source code to Abstract Syntax Tree (AST).
 *   2. Ignition (Interpreter): Converts AST to Bytecode. This starts 
 *      executing immediately (Fast startup).
 *   3. Profiler: Watches which functions are "Hot" (running often).
 *   4. TurboFan (Optimizing Compiler): Recompiles hot functions from 
 *      Bytecode to highly optimized Machine Code (Assembly).
 * 
 * 2. SPECULATIVE OPTIMIZATION
 * ---------------------------
 * V8 makes GUESSES based on previous executions. 
 * - If you call `add(1, 2)` many times, TurboFan assumes 'a' and 'b' 
 *   will always be integers and optimizes the assembly for integer math.
 * 
 * 3. THE "BAILOUT" (DE-OPTIMIZATION)
 * ----------------------------------
 * If your code suddenly breaks the engine's assumptions (e.g., calling 
 * `add("1", 2)` after 10,000 integer calls), V8 must "Bail out". 
 * It throws away the optimized machine code and falls back to the 
 * slow Bytecode interpreter.
 * 
 * 4. VISUAL MENTAL MODEL: THE TRANSLATOR & THE SPEED-READER
 * ---------------------------------------------------------
 * - Ignition is like a translator reading a book out loud line-by-line. 
 *   He's slow, but he can start reading the first page immediately.
 * - TurboFan is a speed-reader who takes the most popular chapters and 
 *   memorizes them perfectly in your native language. 
 * - If the author suddenly changes the language mid-sentence, the 
 *   speed-reader gets confused and has to ask the translator to start 
 *   over from that page.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Polymorphic Functions: Functions that accept many different types 
 *   of arguments are harder for TurboFan to optimize.
 * - Monomorphic vs Polymorphic: Monomorphic (always same types) 
 *   functions are significantly faster.
 */

// --- ONE BAD EXAMPLE: Changing Argument Types (De-optimization) ---
function add(a, b) {
    return a + b;
}

// 1. V8 optimizes this for Integers
for (let i = 0; i < 10000; i++) add(i, i);

// 2. SUDDEN CHANGE: De-optimization triggered!
add("hello", "world");

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Monomorphic) ---
"use strict";

/**
 * Keeping types consistent allows TurboFan to stay in 
 * the optimized machine code path.
 */
function calculateVelocity(speed, direction) {
    // V8 assumes both are numbers
    return speed * Math.cos(direction);
}

// High-frequency call with consistent types
for (let i = 0; i < 100000; i++) {
    calculateVelocity(120.5, 0.5);
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Is JavaScript an Interpreted or Compiled language?
 * A1: Technically, it's both. V8 interprets to Bytecode first (Ignition) 
 *     and then compiles to machine code (TurboFan) at runtime.
 * 
 * Q2: What is the "Optimizing Compiler" in V8 called?
 * A2: TurboFan.
 * 
 * Q3: Why does V8 use Bytecode instead of compiling straight to machine code?
 * A3: Bytecode is smaller (saves memory) and faster to generate, allowing 
 *     for quicker page startup before heavy optimization begins.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Does code inside a 'try-catch' block get optimized by V8?
 * (Answer: Historically, No. TurboFan used to "bail out" of functions 
 *  containing try-catch. In modern V8, this is mostly fixed, but 
 *  over-using it in hot paths can still impact optimization.)
 * 
 * Q2: What is the impact of using 'arguments' object in a function?
 * (Answer: It often prevents V8 from optimizing the function 
 *  completely. Use rest parameters (...) instead.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a benchmark to compare a Monomorphic function 
 *              vs a Polymorphic function over 1 million iterations.
 * Challenge 2: Use the Node.js flag `--trace-opt` and `--trace-deopt` 
 *              to see when V8 optimizes your code.
 */
