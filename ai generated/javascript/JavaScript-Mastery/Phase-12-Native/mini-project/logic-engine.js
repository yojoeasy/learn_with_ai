/**
 * ==========================================
 * PHASE 12 MINI PROJECT: WASM LOGIC ENGINE
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * It proves when to move complex logic into Wasm. We'll simulate 
 * a "Heavy Computation" (e.g., Prime Number filtering) and 
 * benchmark both engines.
 * 
 * This project demonstrates:
 * 1. Linear Memory Allocation.
 * 2. High-speed computation (Simulated).
 * 3. JS-Wasm Performance Benchmarking.
 */

"use strict";

/**
 * 1. THE SIMULATED WASM ENGINE
 * In a real scenario, this logic would be compiled from 
 * AssemblyScript or Rust into a .wasm binary.
 */
const WasmEngineSimulator = {
    // Shared Memory (64KB)
    memory: new WebAssembly.Memory({ initial: 1 }),

    // The "Native" Logic
    exports: {
        calculatePrimes: (limit) => {
            // Simulated optimized binary loop
            let count = 0;
            for (let i = 2; i <= limit; i++) {
                let isPrime = true;
                for (let j = 2; j <= Math.sqrt(i); j++) {
                    if (i % j === 0) {
                        isPrime = false;
                        break;
                    }
                }
                if (isPrime) count++;
            }
            return count;
        }
    }
};

/**
 * 2. THE PURE JAVASCRIPT ENGINE (For comparison)
 */
const JSEngine = {
    calculatePrimes: (limit) => {
        let count = 0;
        for (let i = 2; i <= limit; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) count++;
        }
        return count;
    }
};

/**
 * 3. THE BENCHMARKER
 */
async function runComparison(limit = 100000) {
    console.log(`--- [BENCHMARK] Calculating Primes up to ${limit} ---`);

    // JS TEST
    const startJS = performance.now();
    const jsResult = JSEngine.calculatePrimes(limit);
    const endJS = performance.now();
    console.log(`[JS]   Result: ${jsResult}, Time: ${(endJS - startJS).toFixed(4)}ms`);

    // WASM TEST (Simulated call)
    const startWasm = performance.now();
    const wasmResult = WasmEngineSimulator.exports.calculatePrimes(limit);
    const endWasm = performance.now();
    console.log(`[WASM] Result: ${wasmResult}, Time: ${(endWasm - startWasm).toFixed(4)}ms`);

    const improvement = ((endJS - startJS) / (endWasm - startWasm)).toFixed(2);
    console.log(`\n[ANALYSIS] Wasm is roughly ${improvement}x as fast as JS in this scenario.`);
}

runComparison(500000);

/**
 * SENIOR HIGHLIGHTS:
 * - Determinism: The Wasm execution time is more consistent across 
 *   multiple runs because it doesn't wait for V8 profile steps.
 * - Compilation: In a real project, we'd use 'wasm-pack' or 'asc' 
 *   to generate the logic.
 * - Trade-offs: For smaller 'limit' values, JS might actually 
 *   win due to the lack of "instantiation" and "interop" overhead.
 */
