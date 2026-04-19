/**
 * ==========================================
 * TOPIC 01: COMMONJS (CJS) vs ES MODULES (ESM)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 *
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Node.js supports two module systems. Understanding their
 * fundamental differences in loading and execution is CRITICAL.
 *
 * - CommonJS (CJS):
 *   - Syntax: `require()` and `module.exports`.
 *   - Loading: Synchronous. It blocks the main thread while loading.
 *   - Evaluation: Executes the module code the moment it is required.
 *   - Caching: Modules are cached after the first load.
 *
 * - ES Modules (ESM):
 *   - Syntax: `import` and `export`.
 *   - Loading: Asynchronous. Parsing happens first, then execution.
 *   - Evaluation: Static analysis allows for "Tree Shaking" (removing unused code).
 *   - Features: Supports Top-level Await.
 *
 * 2. INTERNAL WORKING (WRAPPING)
 * -------------------------------
 * - CJS: Node.js wraps CJS code in a function before execution:
 *   (function(exports, require, module, __filename, __dirname) { ... });
 * - ESM: Does NOT use a wrapper. It used a different loader path
 *   within the V8 engine.
 *
 * 3. MEMORY BEHAVIOR (VALUES VS BINDINGS)
 * ---------------------------------------
 * - CJS: Exports are COPIED. If a module changes its exported
 *   variable, the importer still has the old copy.
 * - ESM: Exports are LIVE BINDINGS. If the module updates a value,
 *   the importer sees the new value instantly.
 *
 * 4. VISUAL MENTAL MODEL: THE SHOPPING LIST
 * ------------------------------------------
 * - CommonJS: You call a friend and ask for a list. They write a COPY
 *   of the list and mail it to you. If they add an item later, your
 *   copy is outdated.
 * - ES Modules: You share a live Google Doc. If someone types a
 *   new item, you see the cursor moving and the item appearing
 *   in real-time.
 *
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Cyclic Dependencies: CJS handles them by returning partially
 *   evaluated objects. ESM handles them via live bindings (cleaner
 *   but can still cause 'TDZ' errors).
 * - Performance: Dynamic `require()` in CJS is flexible but
 *   blocks I/O. `import()` in ESM is asynchronous and returns a Promise.
 */

// --- ONE BAD EXAMPLE: CJS Copying Pitfall ---
// // counter.js (CJS)
// let count = 0;
// module.exports = { count, inc: () => count++ };

// // app.js (CJS)
// const { count, inc } = require('./counter');
// inc();
// console.log(count); // Still 0! (Value was copied)

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (ESM Live Bindings) ---

/**
 * ES Modules (using .mjs extension or "type": "module" in package.json)
 */

// // tracker.mjs
// export let sessionCount = 0;
// export const startSession = () => sessionCount++;

// // main.mjs
// import { sessionCount, startSession } from './tracker.mjs';
// startSession();
// console.log(sessionCount); // 1! (Live binding reflects the change)

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Can you use 'require' inside an ES Module?
 * A1: By default, No. You must use the 'createRequire' utility 
 *     from the 'module' package if you truly need it.
 * 
 * Q2: What is the "Dual Package Hazard"?
 * A2: It's when a project loads both the CJS and ESM versions of 
 *     the same library, leading to two instances of the same 
 *     singleton state in memory.
 * 
 * Q3: Why does 'top-level await' only work in ESM?
 * A3: Because ESM loading is asynchronous by design. CJS is synchronous, 
 *     so awaiting at the top level would block the entire module 
 *     loading system.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: In CJS, what is the value of 'exports === module.exports'?
 * (Answer: Initially true. But if you reassign 'module.exports = {}', 
 *  'exports' still points to the old object.)
 * 
 * Q2: Does an ESM module execute multiple times if imported by 3 files?
 * (Answer: No. It executes ONCE and the resulting module namespace 
 *  is cached.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Convert a legacy CJS utility to ESM and handle 
 *              the missing `__dirname` using `import.meta.url`.
 * Challenge 2: Demonstrate a cyclic dependency in both CJS and ESM 
 *              and analyze the different behaviors.
 */
