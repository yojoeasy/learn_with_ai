/**
 * ==========================================
 * TOPIC 04: ASYNC/AWAIT & ERROR HANDLING
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * 'async' and 'await' were introduced in ES2017. They are NOT a 
 * replacement for Promises. Instead, they are "Syntactic Sugar" 
 * built on top of Generator functions and Promises.
 * 
 * - Internal Working (The Step Function):
 *   - An 'async' function always returns a Promise. 
 *   - The 'await' keyword pauses the execution of the async function 
 *     until the promise settles. 
 *   - Under the hood, the engine converts 'await' into a .then() 
 *     callback that resumes the function (similar to a generator .next()).
 * 
 * 2. ERROR HANDLING PATTERNS
 * --------------------------
 * Since async/await looks synchronous, we use 'try/catch' for error 
 * handling. 
 * Senior Tip: Avoid wrapping every line in a try/catch. Wrap 
 * logic blocks or use a global wrapper / utility.
 * 
 * 3. THE "FLOATING PROMISE" PITFALL
 * ---------------------------------
 * A common bug where an async function is called but not awaited, 
 * leading to errors that are never caught (Uncaught in Promise).
 * 
 * 4. VISUAL MENTAL MODEL: THE REMOTE CONTROL PAUSE
 * ------------------------------------------------
 * Think of watching a movie. 
 * - Synchronous code: The movie plays normally.
 * - await: You hit "Pause" when the actor goes to buy popcorn (The Promise). 
 * - The rest of the world (The Event Loop) keeps moving! 
 * - Once the popcorn is ready (Resolved/Rejected), the movie 
 *   automatically hits "Play" and continues from where it stopped.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - The "Async/Await Sandwich": Awaiting multiple independent promises 
 *   sequentially (Slow!) instead of using Promise.all (Fast!).
 * - Memory: Every 'await' creates a microtask. If you have 
 *   millions of unnecessary awaits in a loop, it adds overhead.
 */

// --- ONE BAD EXAMPLE: Sequential Awaiting (The Waterfall) ---
async function slowLoad() {
    // 100ms
    const user = await fetch("/user");
    // 100ms - Starts only AFTER user finishes
    const posts = await fetch(`/posts/${user.id}`);
    // Total 200ms
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

const apiWorker = {
    async fetchResource(url) {
        if (!url) throw new Error("URL is required");
        // Simulate network
        return new Promise(res => setTimeout(() => res(`Data from ${url}`), 100));
    },

    /**
     * Senior pattern: Parallel Execution + Robust Error Handling
     */
    async loadDashboard() {
        try {
            console.log("Loading dashboard...");

            // Parallel start - efficient execution
            const userPromise = this.fetchResource("/user");
            const settingsPromise = this.fetchResource("/settings");

            // Awaiting both (Total time = max of both, not sum)
            const [user, settings] = await Promise.all([userPromise, settingsPromise]);

            console.log("Success:", user, settings);
            return { user, settings };
        } catch (error) {
            // Centralized Error Handling in the block
            console.error("[Dashboard] Initial Load Failed:", error.message);
            throw error; // Propagate for higher-level handling
        } finally {
            console.log("Hide loading spinner...");
        }
    }
};

apiWorker.loadDashboard();

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What happens if you 'await' a non-promise value?
 * A1: The engine wraps it in a resolved Promise automatically 
 *     (`await 1` becomes `await Promise.resolve(1)`).
 * 
 * Q2: Can you use 'await' at the top level of a script?
 * A2: Yes, in modern environments (ES Modules), but not in 
 *     traditional CommonJS or old browser script tags.
 * 
 * Q3: How do you catch errors in an async function?
 * A3: Use try/catch blocks within the function, or attach a .catch() 
 *     to the function call since it returns a promise.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     async function foo() {
 *       console.log(1);
 *       await Promise.resolve();
 *       console.log(2);
 *     }
 *     foo();
 *     console.log(3);
 * (Answer: 1, 3, 2. The code BEFORE the first await is synchronous.)
 * 
 * Q2: What is the output?
 *     async function bar() {
 *       return 10;
 *     }
 *     console.log(bar()); 
 * (Answer: A Promise object resolved with 10. Async functions ALWAYS return 
 *  a promise, regardless of the explicit return.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement an "Async To" wrapper that returns `[error, data]` 
 *              (Golang style) to avoid try/catch nesting.
 * Challenge 2: Refactor a complex Promise chain into an readable async/await 
 *              flow while maintaining parallel performance.
 */
