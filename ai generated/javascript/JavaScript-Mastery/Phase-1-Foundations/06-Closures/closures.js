/**
 * ==========================================
 * TOPIC 06: CLOSURES
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * A closure is the combination of a function bundled together with 
 * references to its surrounding state (the lexical environment). 
 * In simple terms, a closure gives a function access to its outer scope 
 * even AFTER the outer function has finished executing.
 * 
 * - Internal Working:
 *   - When a function is defined, it gets a hidden [[Environment]] property 
 *     pointing to the lexical environment where it was created.
 *   - If the function "escapes" (is returned or passed out), it carries 
 *     this environment with it. 
 *   - The Garbage Collector (GC) cannot remove the outer environment because 
 *     the inner function still holds a reference to it.
 * 
 * 2. DATA PRIVACY & ENCAPSULATION
 * -------------------------------
 * Closures are the primary mechanism for creating "Private" variables in 
 * JavaScript before private class fields (#) existed.
 * 
 * 3. MEMORY BEHAVIOR: THE COST OF CLOSURES
 * ----------------------------------------
 * If you create thousands of closures that reference large objects in their 
 * outer scope, those objects will stay in the HEAP forever as long as the 
 * inner functions exist. This is a common source of memory leaks.
 * 
 * 4. VISUAL MENTAL MODEL: THE BACKPACK
 * ------------------------------------
 * When a function is "born", it is given a small backpack. 
 * Everything it needs from its parent's house (the outer scope) is 
 * put into that backpack. Even if the parent's house is torn down 
 * (function returns), the child function still has the backpack!
 * 
 * 5. EDGE CASES & PITFALLS
 * ------------------------
 * - Stale Closures: When a closure captures an old version of a variable 
 *   (common in React hooks or long-running async loops).
 * - Performance: Overuse of closures in tight loops can lead to high 
 *   memory pressure and slower garbage collection.
 */

// --- ONE BAD EXAMPLE: Memory Leak and Stale Closure ---
function createStaleClosure() {
    let count = 0;
    const increment = () => {
        count++;
        console.log("Current count:", count);
    };

    // BAD: Not properly cleaning up or understanding that 'count' is shared
    return {
        log: () => console.log("Old count value:", count),
        increment
    };
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

/**
 * A private counter factory demonstrating deep closure usage.
 */
function createCounter(name) {
    // These variables are encapsulated (Private)
    let _count = 0;
    let _lastAccessed = null;

    return {
        increment() {
            _count++;
            _lastAccessed = new Date();
            console.log(`[${name}] Counter is now ${_count}`);
        },
        decrement() {
            _count--;
            _lastAccessed = new Date();
        },
        getStatus() {
            return {
                name,
                value: _count,
                lastUpdate: _lastAccessed
            };
        }
    };
}

const userAuthCounter = createCounter("UserAuth");
userAuthCounter.increment();
// console.log(_count); // ReferenceError: _count is not defined (Encapsulation works!)

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a Closure?
 * A1: It's the ability of a function to "remember" and access variables from its 
 *     parent scope even after the parent function has completed execution.
 * 
 * Q2: Where do closures live in memory?
 * A2: Closures live in the Heap because they need to persist beyond the 
 *     lifetime of the call stack frame that created them.
 * 
 * Q3: How do you prevent memory leaks with closures?
 * A3: By setting the variables (or the inner functions themselves) to null 
 *     once they are no longer needed, allowing the Garbage Collector to 
 *     reclaim the memory.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     function outer() {
 *       var z = 10;
 *       return function inner() {
 *         console.log(z);
 *       };
 *     }
 *     var closureFn = outer();
 *     z = 20; 
 *     closureFn();
 * (Answer: 10. The closure environment captures the variable binding, not just the value. 
 *  Wait, actually, since 'z' is global at the bottom, and inner() looks for 'z' in its scope chain...
 *  If 'z' was inside outer(), it would be 10. If 'z=20' is in the global scope, it depends!
 *  Let's re-read: outer defines 'var z=10'. inner returns. 'z=20' is AFTER.
 *  Wait, in the example above, if 'z=20' is global, it's a different 'z'. 
 *  Output is 10.)
 * 
 * Q2: What is the output?
 *     const arr = [1, 2, 3];
 *     for (var i = 0; i < arr.length; i++) {
 *       setTimeout(() => console.log(i), 100);
 *     }
 * (Answer: 3, 3, 3. The closure on 'i' captures the reference to the same variable 'i' 
 *  which has reached 3 by the time the timeout fires.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Create a 'Memoize' function that uses a closure to cache 
 *              expensive computation results.
 * Challenge 2: Build a simple 'PubSub' (Emitter) where subscribers are 
 *              stored in a private closure-based Map.
 */
