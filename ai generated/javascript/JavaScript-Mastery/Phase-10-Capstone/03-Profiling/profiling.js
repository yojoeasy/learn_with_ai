/**
 * ==========================================
 * TOPIC 03: PERFORMANCE TRACKING & PROFILING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * High-performance code is not just "fast"; it's consistent. 
 * We must measure execution time and memory usage scientifically.
 * 
 * - Performance API: Provides high-resolution timestamps (sub-millisecond) 
 *   independent of the system clock.
 * - 16ms Rule: To maintain 60fps, every frame's work (JS + Layout + Paint) 
 *   must complete in under 16.6ms.
 * - Long Tasks: Any task blocking the main thread for >50ms.
 * 
 * 2. INTERNAL WORKING (SAMPLING PROFILER)
 * ----------------------------------------
 * Browser profilers (and Node.js --inspect) use "Sampling". They 
 * take a snapshot of the call stack every millisecond to estimate 
 * which functions are consuming the most CPU time.
 * 
 * 3. MEMORY BEHAVIOR (HEAP SNAPSHOTS)
 * ----------------------------------
 * - Shallow Size: The memory held by the object itself. 
 * - Retained Size: The total memory that would be freed if this 
 *   object was garbage collected (including all linked objects).
 * 
 * 4. VISUAL MENTAL MODEL: THE STOPWATCH
 * --------------------------------------
 * - Date.now(): A wall clock. It can drift or be changed by the user. 
 * - performance.now(): A laboratory stopwatch. It measures active 
 *   process time with extreme precision.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Measuring the Measure: The profiling tools themselves add overhead. 
 *   Heavy console.logging during performance tests will skew your results.
 * - Cold vs Hot: V8 optimizes code over time (TurboFan). Your 1st 
 *   execution will always be slower than the 10,000th. Always 
 *   "Warm up" your functions before benchmarking.
 */

// --- ONE BAD EXAMPLE: Date.now() for Benchmarking ---
function badBenchmark() {
    const start = Date.now();
    // Do work...
    const end = Date.now();
    console.log(`Execution took: ${end - start}ms`);
    // This lacks precision and can be skewed by system clock sync!
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Performance API) ---
"use strict";

/**
 * 1. High-Resolution Benchmarking
 */
function profileFunction(fn, iterations = 1000) {
    // 1. Warm-up (Allow V8 to JIT optimize)
    for (let i = 0; i < 100; i++) fn();

    // 2. Clear previous marks
    performance.clearMarks();
    performance.clearMeasures();

    performance.mark("start-work");

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    performance.mark("end-work");

    // 3. Measure the distance between marks
    performance.measure("Total Execution", "start-work", "end-work");

    const entries = performance.getEntriesByName("Total Execution");
    const avg = entries[0].duration / iterations;

    console.log(`[PERF] Avg Time: ${avg.toFixed(4)}ms`);
}

/**
 * 2. Memory Observation
 */
function checkMemory() {
    if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
        console.log(`[MEMORY] Used: ${(usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.log("Memory API not available (Chrome only). Use Chrome DevTools.");
    }
}

// SIMULATION
profileFunction(() => {
    const arr = Array.from({ length: 1000 }, (_, i) => i * i);
    arr.reverse();
}, 500);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a "Long Task"?
 * A1: A script that executes for more than 50ms, causing the 
 *     browser to drop frames and making the UI feel laggy.
 * 
 * Q2: Difference between 'Task' and 'Microtask' in profiling?
 * A2: Tasks (e.g., setTimeout) appear as distinct blocks in the 
 *     profiler. Microtasks are swallowed into the current Task block.
 * 
 * Q3: How do you detect Memory Leaks?
 * A3: Take two Heap Snapshots: one at the start and one after 
 *     some operations. Check for "Detached" objects that aren't 
 *     expected to be there.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Why does `performance.now()` return 0.0000000 occasionally?
 * (Answer: For security reasons (Anti-fingerprinting/Spectre), 
 *  browsers often round or add "jitter" to these values.)
 * 
 * Q2: If a function's execution time drops dramatically after 
 *     1000 calls, what happened internally?
 * (Answer: The V8 TurboFan compiler has likely promoted it from 
 *  Interpreted Bytecode to Optimized Machine Code.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write a script that uses `PerformanceObserver` to 
 *              automatically log whenever a "Long Task" occurs.
 * Challenge 2: Audit our `Virtual Scroller` from Phase 7 using 
 *              performance marks and see how much time the 'update' 
 *              cycle takes.
 */
