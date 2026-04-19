/**
 * ==========================================
 * TOPIC 03: GARBAGE COLLECTION (Mark & Sweep)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * JavaScript is a garbage-collected language. The Engine (V8) 
 * automatically reclaims memory that is no longer reachable.
 * 
 * - The Orinoco Collector: V8's modern, parallel, and concurrent 
 *   garbage collector.
 * - The Generational Hypothesis: Most objects "die young". 
 *   V8 splits the Heap into two generations:
 *   1. New Space (Small, fast): For young objects. 
 *   2. Old Space (Large, slow): For long-lived objects.
 * 
 * 2. MARK-SWEEP-COMPACT (THE ALGORITHM)
 * --------------------------------------
 * - 1. Marking: The GC traverses the graph from "Roots" (Global, Stack) 
 *      and marks all reachable objects as "Alive".
 * - 2. Sweeping: The GC scans the heap and adds all non-marked 
 *      objects to a "Free List".
 * - 3. Compacting: Moves alive objects together to prevent 
 *      Memory Fragmentation.
 * 
 * 3. INTERNAL WORKING: YOUNG TO OLD
 * ----------------------------------
 * Objects start in New Space (Scavenge cycle). If they survive 
 * two scavenges, they are "Promoted" to the Old Space.
 * 
 * 4. VISUAL MENTAL MODEL: THE APARTMENT CLEANER
 * ---------------------------------------------
 * Think of your apartment (the heap). 
 * - Marking: The cleaner enters and puts a "Vase Sticker" 
 *   on everything you still use. 
 * - Sweeping: Everything without a sticker gets thrown into 
 *   the dumpster. 
 * - Compacting: The cleaner moves all remaining furniture to 
 *   one corner, so you have a big clear area to walk.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Stop-The-World (STW): Historically, GC paused execution entirely. 
 *   V8 now does much of this in the background (Concurrent), but 
 *   short STW pauses still happen.
 * - Reachability: Even if an object is useless to you, if it's 
 *   reachable from Global, it's ALIVE to V8.
 */

// --- ONE BAD EXAMPLE: Keeping global references ---
var data = []; // Global!
function badLoad() {
    // This will stay in memory FOREVER because 'data' is a Root.
    data.push(new Array(10000).fill("Data"));
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Local Scoping) ---
"use strict";

/**
 * Using local scoping or WeakMaps ensures that 
 * objects become unreachable once the logic finishes.
 */
function processLargeData() {
    const localData = new Array(10000).fill("Processing...");
    // 1. Do something...
    console.log(localData.length);
    // 2. End of function -> localData is now eligible for GC.
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is "Mark & Sweep"?
 * A1: It's the primary algorithm used by V8 to identify (Mark) and 
 *     reclaim (Sweep) memory occupied by unreachable objects.
 * 
 * Q2: What is the benefit of splitting the heap into generations?
 * A2: It allows V8 to frequently clean small areas (New Space) 
 *     where most objects die, without freezing the entire heap.
 * 
 * Q3: What is a "GC Root"?
 * A3: It's a starting point for the reachability graph, such as the 
 *     Global object, the current Call Stack, or DOM nodes currently 
 *     attached to the document.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Does setting an object to 'null' immediately free its memory?
 * (Answer: No. It makes it ELIGIBLE for garbage collection. Internal 
 *  V8 heuristics decide WHEN the next GC cycle actually runs.)
 * 
 * Q2: What happens if you create millions of tiny objects?
 * (Answer: It triggers frequent "Scavenge" cycles in the New Space, 
 *  which can impact CPU performance even if memory usage stays low.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Log memory usage in Node.js using `process.memoryUsage()` 
 *              during a loop.
 * Challenge 2: Use a WeakMap to link metadata to an object, and verify 
 *              that the metadata is ready for GC when the object itself 
 *              is dereferenced.
 */
