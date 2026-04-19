/**
 * ==========================================
 * PHASE 16 MINI PROJECT: STREAM ORCHESTRATOR
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In modern web apps, you often receive massive data streams 
 * (e.g., millions of logs) that you can't load into memory at once.
 * 
 * This project demonstrates:
 * 1. Custom Iterable Protocol (making an object loopable).
 * 2. Async Generator (yielding data as it arrives).
 * 3. Functional Pipelining (Transforming during iteration).
 */

"use strict";

class StreamOrchestrator {
    constructor(dataSource) {
        this.dataSource = dataSource; // An array or a function
        this.transformers = [];
    }

    /**
     * 1. THE PIPELINE PATTERN
     */
    pipe(transformFn) {
        this.transformers.push(transformFn);
        return this; // Fluent interface
    }

    /**
     * 2. THE ASYNC GENERATOR (The Core Engine)
     * This turns our orchestration into a first-class stream.
     */
    async*[Symbol.asyncIterator]() {
        for (const rawItem of this.dataSource) {
            let processed = rawItem;

            // Apply all transformations sequentially
            for (const transform of this.transformers) {
                processed = await transform(processed);
                if (processed === null) break; // Drop item if transformer returns null
            }

            if (processed !== null) {
                yield processed;
            }
        }
    }
}

/**
 * --- SIMULATION ---
 */
async function runSystem() {
    console.log("--- 🔄 INITIATING STREAM ORCHESTRATOR 🔄 ---");

    const rawLogs = [
        { id: 1, text: "System Booting", level: "info" },
        { id: 2, text: "Auth Failure", level: "warn" },
        { id: 3, text: "Database Error", level: "error" },
        { id: 4, text: "User Login", level: "info" }
    ];

    const orchestrator = new StreamOrchestrator(rawLogs);

    // Build the logic pipeline
    orchestrator
        .pipe(async (log) => {
            // Simulation: Call a remote API to enrich data
            await new Promise(r => setTimeout(r, 300));
            return { ...log, processedAt: new Date().toLocaleTimeString() };
        })
        .pipe((log) => {
            // Filter: Only errors/warnings
            return log.level === "info" ? null : log;
        })
        .pipe((log) => {
            // Transform: Bold the text
            return { ...log, text: `[${log.level.toUpperCase()}] ${log.text}` };
        });

    // 3. THE CONSUMPTION LOOP (Unified Syntax)
    for await (const result of orchestrator) {
        console.log(`>>> PROCESSED LIVE: ${result.text} (Time: ${result.processedAt})`);
    }

    console.log("--- STREAM EXHAUSTED ---");
}

runSystem();

/**
 * SENIOR HIGHLIGHTS:
 * - Protocol Abstraction: The user doesn't need to know how the 
 *   orchestrator works. They just use 'for await...of' on it.
 * - Memory Efficiency: Items are processed ONE BY ONE. Even if 
 *   the source has 10 million items, we only ever hold one at 
 *   a time in this pipeline.
 * - Composition: The `.pipe()` pattern allows for building complex 
 *   logic without nested loop nightmares.
 */
