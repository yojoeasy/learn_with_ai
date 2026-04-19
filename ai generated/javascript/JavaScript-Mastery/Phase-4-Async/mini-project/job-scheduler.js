/**
 * ==========================================
 * PHASE 4 MINI PROJECT: ASYNC JOB SCHEDULER
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * Real-world applications (like a web crawler, bulk image processor, 
 * or a request rate-limiter) cannot start thousands of async tasks 
 * at once without crashing the system or hitting rate limits. 
 * A Job Scheduler with CONCURRENCY CONTROL is essential. 
 * 
 * This project demonstrates:
 * 1. Event Loop management (not overwhelming the thread).
 * 2. Promises for task results.
 * 3. Async/Await for clean flow control.
 * 4. Microtask/Macrotask awareness.
 */

"use strict";

/**
 * A robust Job Scheduler that processes tasks with a 
 * fixed concurrency limit.
 */
class AsyncJobScheduler {
    #queue = [];
    #executingCount = 0;
    #maxConcurrency;

    constructor(maxConcurrency = 2) {
        this.#maxConcurrency = maxConcurrency;
    }

    /**
     * Adds a task to the queue and returns a promise for its result.
     * @param {Function} taskFn - An async function.
     * @param {string} label - For tracking.
     */
    add(taskFn, label = "GenericTask") {
        return new Promise((resolve, reject) => {
            // We wrap the task so we can trigger it LATER
            const job = async () => {
                try {
                    console.log(`[EXEC] Starting: ${label}`);
                    const result = await taskFn();
                    resolve({ status: "Success", result, label });
                } catch (error) {
                    reject({ status: "Failed", error: error.message, label });
                } finally {
                    this.#executingCount--;
                    this.#next(); // Trigger the next person in line
                }
            };

            this.#queue.push(job);
            this.#next(); // Try to execute immediately if stack is clear
        });
    }

    /**
     * Internal processor: Checks if more tasks can be run.
     */
    #next() {
        if (this.#executingCount >= this.#maxConcurrency || this.#queue.length === 0) {
            return;
        }

        this.#executingCount++;
        const nextJob = this.#queue.shift();

        // Push task execution to the NEXT microtask or macrotask 
        // cycle to ensure non-blocking behavior.
        queueMicrotask(nextJob);
    }
}

// --- SIMULATION DATA ---
const scheduler = new AsyncJobScheduler(2); // Only 2 tasks at a time!

// A generic "Fetch" simulation
const simulateTask = (id, duration) => new Promise(res => {
    setTimeout(() => {
        console.log(`[DONE] Task ${id} finished in ${duration}ms`);
        res(`Payload_${id}`);
    }, duration);
});

// --- EXECUTION START ---
console.log("--- SCHEDULER BOOT ---");

const results = [
    scheduler.add(() => simulateTask("A", 1000), "Download_A"), // Starts
    scheduler.add(() => simulateTask("B", 500), "Download_B"),  // Starts
    scheduler.add(() => simulateTask("C", 300), "Download_C"),   // Waits for B
    scheduler.add(() => simulateTask("D", 800), "Download_D")    // Waits for A
];

// Wait for the entire batch to finish using the native Promise.all
Promise.allSettled(results).then(response => {
    console.log("--- BATCH FINISHED ---");
    console.table(response.map(r => r.value || r.reason));
});

/**
 * SENIOR HIGHLIGHTS:
 * - State Control: Private fields protect the internal count and queue.
 * - Concurrency: Prevents starting all 4 tasks at once, ensuring resource safety.
 * - Non-Blocking: Uses queueMicrotask to defer task execution, keeping the 
 *   main event loop responsive during job switching.
 * - Promise Chaining: The wrapper promise resolves only when the inner task 
 *   completes, even if that task was queued for long.
 */
