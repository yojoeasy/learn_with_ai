/**
 * ==========================================
 * TOPIC 02: MULTI-THREADING (Workers)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Parallel Execution
 * 
 * 1. THE DEEP DIVE: ISOLATION
 * ---------------------------
 * JavaScript is normally single-threaded. Workers allow you to run 
 * script in the background on a separate CPU thread.
 * 
 * - Memory Isolation: Each worker has its own V8 Heap and Event Loop. 
 *   You cannot share variables directly (except via SharedArrayBuffer).
 * - Communication: Data is cloned via the "Structured Clone Algorithm" 
 *   when sent via `postMessage`.
 * 
 * 2. WEB WORKERS (BROWSER) VS WORKER THREADS (NODE)
 * -------------------------------------------------
 * - Web Workers: Ideal for heavy UI calculations (image processing, 
 *   crypto) to prevent freezing the main thread.
 * - Worker Threads: Ideal for CPU-intensive backend tasks (video 
 *   encoding, heavy JSON parsing) without blocking the I/O event loop.
 * 
 * 3. INTERNAL WORKING (SERIALIZATION)
 * ------------------------------------
 * When you send an object `{ a: 1 }` to a worker:
 * 1. The main thread Serializes (Clones) the data.
 * 2. It sends the bits across the boundary.
 * 3. The worker Deserializes the data on its own thread.
 * *Note: If the data is huge, this transfer can be SLOWER than 
 * running the task synchronously.*
 * 
 * 4. VISUAL MENTAL MODEL: THE DIFFERENT OFFICES
 * ---------------------------------------------
 * - Main Thread: The Front Office. Handles customers (UI) and 
 *   phone calls (Events). 
 * - Workers: Back Office specialists. They don't talk to customers. 
 * - Communication: Everything must be sent via a physical mail 
 *   (postMessage). No one can just walk into the other's office.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - DOM Access: Workers CANNOT access the DOM, 'window', or 'document'.
 * - Overhead: Creating a worker takes ~10-40ms and ~5MB of RAM. 
 *   Don't create a worker for a 1ms task. Use a "Worker Pool".
 */

// --- ONE BAD EXAMPLE: Infinite Worker Creation ---
function badWorkerSpawn() {
    // Creating a new worker for every single calculation!
    // This will quickly exhaust system threads and RAM.
    for (let i = 0; i < 1000; i++) {
        const w = new Worker("worker.js");
        w.postMessage(i);
    }
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Node.js Worker) ---
"use strict";

const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

/**
 * 1. THE ARCHITECTURE
 * This single file acts as both the logic and the worker.
 */
if (isMainThread) {
    // MAIN THREAD LOGIC
    async function runHeavyTask(data) {
        return new Promise((resolve, reject) => {
            console.log("[MAIN] Dispatching task to Worker...");

            const worker = new Worker(__filename, {
                workerData: data // Pass data to the worker
            });

            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
            });
        });
    }

    // SIMULATION
    runHeavyTask(100_000_000).then(res => {
        console.log("[MAIN] Result received:", res);
    });

} else {
    // WORKER THREAD LOGIC (Isolated)
    const count = workerData;
    let sum = 0;

    console.log(`[WORKER] Starting heavy calculation until ${count}...`);
    for (let i = 0; i < count; i++) {
        sum += i;
    }

    // Send the result back
    parentPort.postMessage(sum);
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Can a Worker access the DOM?
 * A1: No. A Worker is an isolated execution context. It only has 
 *     access to things like Timer APIs, Fetch, and WebSockets.
 * 
 * Q2: What is the "Structured Clone Algorithm"?
 * A2: It's the internal mechanism JS uses to copy complex objects 
 *     when passing them between threads. It handles circular 
 *     references, which JSON.stringify cannot.
 * 
 * Q3: When should you NOT use a Worker?
 * A3: For I/O bound tasks (database calls, file reading) or very 
 *     short tasks. Node.js handles I/O perfectly on the main thread 
 *     using its internal C++ thread pool.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I send a Function inside an object to a Worker, what happens?
 * (Answer: It throws a DataCloneError. Functions cannot be cloned 
 *  across thread boundaries.)
 * 
 * Q2: Does `console.log` in a worker print to the same console 
 *     as the main thread?
 * (Answer: In modern browsers/Node environment, yes. The stdout 
 *  is usually multiplexed by the environment.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Worker Pool" that reuses 4 workers to 
 *              process a queue of 20 image-processing tasks.
 * Challenge 2: Measure the transfer time of a 10MB Buffer across 
 *              the main-thread boundary. (Hint: Use performance.now).
 */
