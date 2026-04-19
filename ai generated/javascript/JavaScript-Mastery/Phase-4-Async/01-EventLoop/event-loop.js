/**
 * ==========================================
 * TOPIC 01: THE EVENT LOOP (Micro vs Macro)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * JavaScript is SINGLE-THREADED. It can only do one thing at a time. 
 * The "Magic" of non-blocking I/O comes from the Event Loop, which 
 * resides in the hosting environment (Browser or Node.js).
 * 
 * - Components:
 *   1. Call Stack: Where synchronous code executes.
 *   2. Web APIs / Node APIs: Where async tasks (timers, fetch) wait.
 *   3. Callback Queue (Macrotasks): timer callbacks, I/O, UI rendering.
 *   4. Microtask Queue: Promises (.then/catch/finally), MutationObserver, queueMicrotask().
 * 
 * 2. THE THREE-STEP CYCLE
 * -----------------------
 * Step 1: Execute all synchronous code in the Call Stack until empty.
 * Step 2: Execute ALL tasks in the Microtask Queue until empty.
 *         (If a microtask adds another microtask, it's executed in the SAME cycle).
 * Step 3: Take ONE task from the Macrotask Queue and push it to the Call Stack.
 * Step 4: Repeat.
 * 
 * 3. INTERNAL WORKING (V8 & LIBUV)
 * --------------------------------
 * In Node.js, the 'libuv' library manages the event loop phases 
 * (timers, pending callbacks, idle, poll, check, close). 
 * In the browser, the loop is simpler but the Microtask vs Macrotask 
 * priority remains identical.
 * 
 * 4. VISUAL MENTAL MODEL: THE CHECKOUT LINE
 * -----------------------------------------
 * Imagine a single Cashier (The Call Stack).
 * - Synchronous code are the people already at the counter.
 * - Microtasks are "VIP Members" who get served immediately AFTER the 
 *   current person finished, even if a long line (Macrotasks) is waiting.
 * - Macrotasks are the "Regular Line". Only one person from this line 
 *   gets called to the counter after ALL VIPs are gone.
 * 
 * 5. EDGE CASES
 * -------------
 * - Microtask Starvation: If you recursively queue microtasks, the 
 *   Macrotask queue (and UI rendering) will NEVER run, freezing the app.
 * - SetTimeout(fn, 0): Does not run in 0ms. It runs in the NEXT macro-cycle 
 *   after the current stack and all microtasks are done.
 */

// --- ONE BAD EXAMPLE: Blocking the Event Loop ---
function blockEverything() {
    console.log("Start blocking...");
    // Synchronous loop - nothing else (timers, clicks) can happen!
    const start = Date.now();
    while (Date.now() - start < 2000) { }
    console.log("Done blocking.");
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

console.log("1. Global Script Start");

// Macrotask
setTimeout(() => {
    console.log("5. Macrotask (setTimeout)");
}, 0);

// Microtask
Promise.resolve().then(() => {
    console.log("3. Microtask (Promise)");
    // Nesting a microtask - runs in this same cycle!
    queueMicrotask(() => console.log("4. Nested Microtask"));
});

console.log("2. Global Script End");

/**
 * Expected Output Sequence:
 * 1. Global Script Start
 * 2. Global Script End
 * 3. Microtask (Promise)
 * 4. Nested Microtask
 * 5. Macrotask (setTimeout)
 */

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What gets priority: Promises or SetTimeout?
 * A1: Promises (Microtasks) always execute before the next SetTimeout (Macrotask) 
 *     once the call stack is clear.
 * 
 * Q2: What happens if a Microtask takes 5 seconds to run?
 * A2: It blocks the Call Stack. No Macrotasks (like UI clicks or other timers) 
 *     can execute until that Microtask finishes.
 * 
 * Q3: Why is queueMicrotask() useful?
 * A3: It allows you to run logic asynchronously but BEFORE the browser 
 *     is allowed to re-render or execute macrotasks.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     setTimeout(() => console.log("A"), 0);
 *     Promise.resolve().then(() => console.log("B"));
 *     console.log("C");
 * (Answer: C, B, A.)
 * 
 * Q2: What is the output?
 *     setTimeout(() => console.log("Timeout"), 0);
 *     Promise.resolve().then(() => {
 *         console.log("Promise");
 *         while(true) {} // Infinite loop in microtask
 *     });
 * (Answer: "Promise" will log, then the thread will hang. "Timeout" NEVER logs.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Debounce" that uses microtasks instead of timers.
 * Challenge 2: Visualize the event loop by logging timestamps for nested 
 *              timeouts and promises.
 */
