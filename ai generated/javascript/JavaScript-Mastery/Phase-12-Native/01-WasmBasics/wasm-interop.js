/**
 * ==========================================
 * TOPIC 01: WEBASSEMBLY (Wasm) & JS BRIDGE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Native Performance
 * 
 * 1. THE DEEP DIVE: WHAT IS WASM?
 * -------------------------------
 * WebAssembly is NOT a replacement for JavaScript. It is a binary 
 * instruction format that runs in the same browser sandbox as JS, 
 * but at near-native speed.
 * 
 * - Compilation: Code from C++, Rust, or AssemblyScript is compiled 
 *   to `.wasm` binary modules.
 * - Deterministic: It provides predictable performance without the 
 *   heuristics/bailouts of the V8 TurboFan compiler.
 * 
 * 2. THE BRIDGE (JS INTEROP)
 * --------------------------
 * JS and Wasm share an execution environment but have different 
 * memory models.
 * - Wasm Memory: A single, resizable "Linear Memory" (TypedArray).
 * - Imports/Exports: Wasm can export functions to JS, and JS can 
 *   pass functions (Imports) to Wasm.
 * 
 * 3. INTERNAL WORKING (V8 IGNITION/LIFTOFF)
 * ------------------------------------------
 * When a `.wasm` file is loaded:
 * 1. Decoding: V8 decodes the binary format.
 * 2. Compilation (Liftoff): A fast baseline compiler produces 
 *    machine code immediately.
 * 3. Optimization (TurboFan): High-quality machine code is produced 
 *    for hot functions.
 * 
 * 4. VISUAL MENTAL MODEL: THE ENGINE & THE TRANSLATOR
 * ----------------------------------------------------
 * - JavaScript: A high-level language with a smart translator (V8) 
 *   that tries to optimize as you speak.
 * - WebAssembly: A pre-compiled instruction manual for the engine. 
 *   No translation needed; the engine just executes the commands.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Boundary Crossing Cost: Calling from JS to Wasm (or vice versa) 
 *   has a small overhead. Don't call a Wasm function inside a 
 *   tight loop that increments a single number.
 * - Memory Transfer: Significant data (e.g., large arrays) must be 
 *   written into the Wasm Linear Memory manually.
 */

"use strict";

/**
 * 1. LOADING A WASM MODULE (Modern Pattern)
 */
async function loadWasm(url, imports = {}) {
    // WebAssembly.instantiateStreaming is the most efficient way 
    // to load and compile on the fly.
    const reponse = await fetch(url);
    const { instance } = await WebAssembly.instantiateStreaming(reponse, imports);
    return instance.exports;
}

/**
 * 2. LINEAR MEMORY (The Shared Buffer)
 */
const memory = new WebAssembly.Memory({ initial: 1 }); // 1 Page = 64KB
const view = new Uint8Array(memory.buffer);

/**
 * 3. JS-WASM INTEROP DEMO (Conceptual)
 */
const jsWasmDemo = {
    // Wasm logic (Pretend this is compiled from C++)
    add: (a, b) => a + b,

    // Using shared memory
    processData: () => {
        // Wasm would read from 'view' TypedArray directly
        console.log("[WASM] Reading from shared memory...");
        return view[0] * 2;
    }
};

// SIMULATION
console.log("--- WASM INTEROP SIMULATION ---");
view[0] = 42; // JS writes to memory
console.log("Wasm Processed:", jsWasmDemo.processData());

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Is Wasm faster than JS?
 * A1: For heavy computation (image processing, physics), yes. For 
 *     DOM manipulation, no. JS is better at high-level orchestration; 
 *     Wasm is better at "Number Crunching".
 * 
 * Q2: Can Wasm access the DOM?
 * A2: Currently, NO. Wasm must call a JS "Import" function to 
 *     manipulate the DOM. (JSPI/Interface Types are evolving this).
 * 
 * Q3: Why is Wasm more "predictable" than JS?
 * A3: Because Wasm is already compiled to low-level instructions. 
 *     It doesn't rely on V8's JIT profiling or "dynamic type" 
 *     checks during execution.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What happens if a Wasm function accesses memory outside its 
 *     declared 'initial' pages?
 * (Answer: It throws a Runtime Error / Trap. You must call 
 *  memory.grow() to increase capacity.)
 * 
 * Q2: Can a Wasm module be shared between multiple Web Workers?
 * (Answer: Yes. You can send the compiled module (not the instance) 
 *  to workers via postMessage, where it can be instantiated.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a JS function that "encodes" a string into 
 *              Wasm Linear Memory using UTF-8.
 * Challenge 2: Use `WebAssembly.Table` to implement an array of 
 *              function pointers (Used for dynamic dispatch).
 */
