/**
 * ==========================================
 * TOPIC 03: SHARED MEMORY (Atomics)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Low-Latency Concurrent JS
 * 
 * 1. THE DEEP DIVE: SHARED MEMORY
 * -------------------------------
 * While `postMessage` copies data, `SharedArrayBuffer` (SAB) allows 
 * multiple threads to point to the SAME chunk of raw binary memory. 
 * This is extremely fast but extremely dangerous.
 * 
 * - Race Condition: When two threads try to write to the same memory 
 *   simultaneously, the result is unpredictable.
 * - Atomics API: Provides static methods to perform atomic operations 
 *   (guaranteed to finish without interruption) on TypedArray views 
 *   of a SAB.
 * 
 * 2. ATOMICS METHODS
 * -------------------
 * - Atomics.add/sub: Thread-safe math.
 * - Atomics.wait/notify: High-performance sleep/wake mechanism 
 *   between threads (The "Mutex" of JS).
 * - Atomics.load/store: Ensuring memory visibility (bypassing CPU cache).
 * 
 * 3. INTERNAL WORKING (SEQUENTIAL CONSISTENCY)
 * ---------------------------------------------
 * JavaScript's memory model ensures that Atomics operations follow 
 * "Sequential Consistency". This means all threads see the operations 
 * in the same order, preventing weird "Out-of-Order" execution bugs.
 * 
 * 4. VISUAL MENTAL MODEL: THE SHARED NOTEBOOK
 * -------------------------------------------
 * - postMessage: You write a note from your notebook to a friend. 
 *   They get a copy.
 * - SharedArrayBuffer: You and your friend are both looking at 
 *   the SAME notebook on the table.
 * - Atomics: A "Pen" that only one person can grab at a time. 
 *   It ensures that if you are writing "10", your friend doesn't 
 *   accidentally write "20" over it mid-stroke.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Security: SAB was disabled for a long time due to 'Spectre'. 
 *   In modern browsers, it requires "Cross-Origin Isolation" headers.
 * - Complexity: Debugging race conditions is 10x harder than normal 
 *   async bugs. Use SAB only as a last resort for performance.
 */

// --- ONE BAD EXAMPLE: Race Condition (Non-Atomic) ---
// // Shared Buffer: [0]
// Thread 1: val = heap[0]; val++; heap[0] = val;
// Thread 2: val = heap[0]; val++; heap[0] = val;
// Result might be 1 instead of 2!

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Atomics) ---
"use strict";

const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
    // 1. Create 4 bytes of shared memory
    const sab = new SharedArrayBuffer(4);
    const int32 = new Int32Array(sab);

    console.log("[MAIN] Initial shared value:", int32[0]);

    const worker = new Worker(__filename, { workerData: sab });

    worker.on("message", (msg) => {
        if (msg === "done") {
            // 4. Load safely after worker finishes
            console.log("[MAIN] Final value after Atomic increments:", Atomics.load(int32, 0));
        }
    });

} else {
    // WORKER THREAD
    const sab = workerData;
    const int32 = new Int32Array(sab);

    console.log("[WORKER] Shared memory connected.");

    // 2. Perform Atomic Add (Thread-safe)
    for (let i = 0; i < 1000; i++) {
        Atomics.add(int32, 0, 1);
    }

    // 3. Notify completion
    parentPort.postMessage("done");
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the main difference between postMessage and SAB?
 * A1: postMessage copies data (high latency, safe). SharedArrayBuffer 
 *     links data (zero latency, high risk of race conditions).
 * 
 * Q2: What does Atomics.wait do?
 * A2: It puts a thread to sleep until a specific memory location 
 *     changes and another thread calls Atomics.notify.
 * 
 * Q3: Why do we need Atomics.load instead of just int32[0]?
 * A3: Atomics.load ensures the value is read from main RAM, not 
 *     a stale version stored in the CPU's local cache.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Can you use SharedArrayBuffer on the main thread of a browser?
 * (Answer: Yes, but you cannot call Atomics.wait() on the main 
 *  thread as it would block the UI indefinitely. It only works 
 *  in Workers.)
 * 
 * Q2: If I have a SharedArrayBuffer of 8 bytes, what is its 
 *     byteLength property?
 * (Answer: 8. The size is fixed and cannot be changed (Unlike ArrayBuffer).)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Spin Lock" using Atomics.compareExchange 
 *              to manage access to a shared resource.
 * Challenge 2: Build a producer-consumer queue using Atomics.wait 
 *              and Atomics.notify.
 */
