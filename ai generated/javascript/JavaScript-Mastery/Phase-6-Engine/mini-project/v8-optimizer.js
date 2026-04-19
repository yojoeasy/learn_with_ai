/**
 * ==========================================
 * PHASE 6 MINI PROJECT: V8-OPTIMIZER
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * For high-performance libraries (like D3.js or three.js), engine-level 
 * optimization is the difference between 60fps and 10fps. 
 * This project demonstrates:
 * 1. Hidden Class Optimization: Maintaining monomorphic objects.
 * 2. Avoiding De-optimization: Consistent property initialization.
 * 3. Garbage Collection Friendliness: Local scoping and pooling.
 */

"use strict";

/**
 * 1. THE NON-OPTIMIZED DATA STRUCTURE (Bad)
 * Uses dynamic property addition and varying shapes.
 */
function createPointBad(x, y) {
    const p = {};
    if (x) p.x = x;
    if (y) p.y = y;
    // Varying shapes: {x}, {y}, or {x, y} -> Polymorphic!
    return p;
}

/**
 * 2. THE V8-OPTIMIZED DATA STRUCTURE (Senior)
 * Uses a constructor to guarantee a consistent Hidden Class (Monomorphic).
 */
class PointOptimized {
    constructor(x = 0, y = 0) {
        // Guaranteed shape: {x, y} always in the same order.
        this.x = x;
        this.y = y;
    }
}

// --- PART 3: THE BENCHMARK (The Proof) ---
function runBenchmark() {
    const ITERATIONS = 1_000_000;

    // A. Testing Polymorphic (Slow) Path
    console.time("Polymorphic Path (Bad)");
    const pointsBad = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // V8 struggles to optimize this because the objects have different shapes
        pointsBad.push(createPointBad(i % 2 === 0 ? i : null, i));
    }
    console.timeEnd("Polymorphic Path (Bad)");

    // B. Testing Monomorphic (Fast) Path
    console.time("Monomorphic Path (Optimized)");
    const pointsGood = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // V8 can use Inline Caching here because every object has the same shape.
        pointsGood.push(new PointOptimized(i, i));
    }
    console.timeEnd("Monomorphic Path (Optimized)");

    // PART 4: GC FRIENDLY DATA POOLING
    /**
     * Senior pattern: Reusing objects to reduce GC pressure (Scavenge cycles).
     */
    const pool = new PointOptimized();
    function processCoordinate(x, y) {
        pool.x = x;
        pool.y = y;
        // Logic with pool... (Safe only if usage is synchronous)
    }

    console.log("--- BATCH COMPLETE ---");
}

runBenchmark();

/**
 * SENIOR HIGHLIGHTS:
 * - Hidden Classes: The monomorphic path is significantly faster 
 *   because TurboFan can generate optimized assembly with hardcoded 
 *   memory offsets for .x and .y.
 * - Inline Caching: Every call to the constructor hits the same IC slot.
 * - Performance: In large-scale systems, this optimization pattern 
 *   saves megabytes of heap and reduces CPU overhead.
 */
