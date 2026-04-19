/**
 * ==========================================
 * TOPIC 02: STATE MANAGEMENT & BATCHING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Reactivity is the ability of the system to automatically update 
 * dependent values or the UI when the underlying state changes.
 * 
 * - Signals / Observables: Transparently tracking which piece of 
 *   code depends on which piece of data.
 * - Batching: If you update 100 variables in a loop, you don't 
 *   want 100 re-renders. You want ONE re-render after the loop 
 *   finishes.
 * 
 * 2. INTERNAL WORKING (MICROTASK BATCHING)
 * -----------------------------------------
 * Using `queueMicrotask` or `Promise.resolve().then()`, we can 
 * schedule the UI update to run AFTER the current synchronous 
 * execution block finishes. This ensures all state changes are 
 * "batched" together.
 * 
 * 3. MEMORY BEHAVIOR (DEPENDENCY REGISTER)
 * ----------------------------------------
 * Reactive systems maintain a Map or Set of "Effects" that need 
 * to run when a specific signal changes. If you don't clean up 
 * these effects (e.g., when a component is destroyed), you leak 
 * memory.
 * 
 * 4. VISUAL MENTAL MODEL: THE EXCEL SHEET
 * ----------------------------------------
 * - State: The values in the cells. 
 * - Effect: A formula like =A1+B1. 
 * - Reactivity: When you change A1, the formula cell updates 
 *   automatically. 
 * - Batching: Writing "1", "2", "3" into cells A1, A2, A3 
 *   smoothly, but only calculating the "Sum" at the very end 
 *   when you stop typing.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Infinite Loops: If Setting State A triggers Effect B, and 
 *   Effect B sets State A again, you crash the browser. 
 * - Over-reactivity: Tracking every single mouse move in a 
 *   signal can lead to high GC pressure.
 */

// --- ONE BAD EXAMPLE: No Batching (Sync Thrashing) ---
function badStateUpdate() {
    let count = 0;
    const updateUI = () => console.log("UI Rendered with:", count);

    // Changing state 3 times synchronously
    count = 1; updateUI();
    count = 2; updateUI();
    count = 3; updateUI();
    // 3 logs/renders instead of 1. Wasteful!
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Signals + Batching) ---
"use strict";

/**
 * Global Batching Manager
 */
const scheduler = {
    pending: false,
    queue: new Set(),

    add(fn) {
        this.queue.add(fn);
        if (!this.pending) {
            this.pending = true;
            // 1. Queue as Microtask to run after current stack
            queueMicrotask(() => this.flush());
        }
    },

    flush() {
        this.queue.forEach(fn => fn());
        this.queue.clear();
        this.pending = false;
    }
};

/**
 * 2. THE SIGNAL PATTERN
 */
let activeEffect = null;

function createSignal(value) {
    const subscribers = new Set();

    return {
        get() {
            // Track dependency automatically
            if (activeEffect) subscribers.add(activeEffect);
            return value;
        },
        set(newValue) {
            if (value === newValue) return;
            value = newValue;
            // Notify subscribers via the Batching Scheduler
            subscribers.forEach(effect => scheduler.add(effect));
        }
    };
}

function createEffect(fn) {
    activeEffect = fn;
    fn(); // Run once to record dependencies
    activeEffect = null;
}

// --- DEMO ---
const count = createSignal(0);
const double = createSignal(0);

// Define an effect that depends on 'count'
createEffect(() => {
    console.log(`[EFFECT] Value updated: ${count.get()}`);
});

console.log("--- START SYNC BLOCK ---");
count.set(1);
count.set(2);
count.set(3);
console.log("--- END SYNC BLOCK ---");

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why use Microtasks for batching instead of Macrotasks (setTimeout)?
 * A1: Microtasks execute immediately after the current stack but 
 *     BEFORE the paint, ensuring the user never sees intermediate 
 *     "flickery" states.
 * 
 * Q2: What is the "Zombie Child" problem in reactivity?
 * A2: When a parent renders and removes a child, but the child's 
 *     internal effect still fires once before being destroyed, 
 *     accessing now-deleted parent data.
 * 
 * Q3: How do Signals differ from React State?
 * A3: React relies on "Top-Down" reconciliation (diffing). Signals 
 *     enable "Fine-Grained" updates where only the specific DOM node 
 *     bound to the signal changes.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I update 5 signals in one function, how many times 
 *     will the scheduler flush?
 * (Answer: Once, due to the `pending` flag guarding the microtask.)
 * 
 * Q2: What happens if an Effect sets the same signal it reads?
 * (Answer: Infinite loop/Stack overflow unless guarded by identity checks.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a `computed` value that intelligently 
 *              caches its result until its dependencies change.
 * Challenge 2: Implement a clean-up function for `createEffect` 
 *              to prevent memory leaks on component unmount.
 */
