/**
 * ==========================================
 * TOPIC 04: MEMORY LEAKS & PROFILING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * A memory leak is a situation where the Garbage Collector fails 
 * to reclaim memory that is no longer needed because it is 
 * still reachable from a "Root".
 * 
 * - Root Causes:
 *   1. Global Variables: Never collected. 
 *   2. Forgotten Timers: A timer that keeps a closure alive. 
 *   3. Detached DOM: Elements removed from UI but kept in memory via a variable. 
 *   4. Closures: Uncontrolled closures that keep large objects alive.
 * 
 * 2. PROFILING TOOLS (CHROME DEVTOOLS)
 * -------------------------------------
 * - Memory Tab -> Heap Snapshot: Shows the current state of memory. 
 * - Memory Tab -> Allocation Timeline: Helps identify leaks over time. 
 * - Node.js flags: `--inspect` and `--heap-prof`.
 * 
 * 3. INTERNAL WORKING (V8 REACHABILITY)
 * --------------------------------------
 * Even if an object is "Dead" to you, if there's a reference 
 * chain from Global or the Call Stack, V8's Mark algorithm 
 * marks it as "Alive" and the Sweeper skips it.
 * 
 * 4. VISUAL MENTAL MODEL: THE UNRELEASED BALLOON
 * ----------------------------------------------
 * Imagine holding a balloon (the object). 
 * - You let go of the balloon; it flies away (Garbage Collected). 
 * - You let go of the balloon, but it's tied to your wrist with a thin string (The Reference). 
 * - The balloon is still there, taking up space, and you can't get 
 *   rid of it because you're still "Holding" that string.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Memory Bloat: Not just leaks, but keeping large objects in 
 *   memory longer than necessary (High Memory Pressure). 
 * - Shallow vs Retained Size: Shallow is the size of the object itself; 
 *   Retained is the size it keeps from being collected.
 */

// --- ONE BAD EXAMPLE: A Persistent Memory Leak ---
function startLeak() {
    const hugeData = new Array(10000).fill("Data");

    // 1. Forgotten Timer (Leak!)
    setInterval(() => {
        // hugeData is captured in this closure!
        // It stays in memory as long as the interval is running.
        console.log("Still here...");
    }, 1000);
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Prevention) ---
"use strict";

class ResourceExplorer {
    #timerId;

    constructor() {
        this.data = new Array(10000).fill("Data");

        // 1. Correct timer management
        this.#timerId = setInterval(() => {
            console.log("Processing...");
        }, 1000);
    }

    /**
     * Senior pattern: Manual Cleanup
     */
    cleanup() {
        clearInterval(this.#timerId);
        this.data = null; // Help GC identify it's ready
        console.log("Resources released.");
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a detached DOM node?
 * A1: It's an element removed from the DOM tree (e.g., via removeChild) 
 *     but still referred to by a variable in JavaScript. The GC 
 *     cannot reclaim its memory.
 * 
 * Q2: How do you identify a memory leak?
 * A2: Use the Chrome DevTools Memory tab. Take two heap snapshots 
 *     at different times and use the "Comparison" view to find 
 *     leaking objects.
 * 
 * Q3: Why are WeakMaps better at preventing leaks?
 * A3: Because WeakMaps don't prevent the objects they use as keys 
 *     from being garbage collected. Once the key is gone, the 
 *     entry is automatically removed.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the Retention Path in a heap snapshot?
 * (Answer: It's the path of references from a "Root" that 
 *  keeps an object from being collected.)
 * 
 * Q2: Does an empty 'setTimeout' closure create a leak?
 * (Answer: No. Once the timer executes, the engine clears the 
 *  reference to the callback, and it's collected.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a script that intentionaly leaks memory using 
 *              unclosed event listeners on a fake DOM element.
 * Challenge 2: Use `node --heap-prof` to generate a profile of 
 *              a script and view it in Chrome DevTools.
 */
