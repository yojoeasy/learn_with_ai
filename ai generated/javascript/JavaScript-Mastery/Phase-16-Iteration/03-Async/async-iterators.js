/**
 * ==========================================
 * TOPIC 03: ASYNC ITERATION & GENERATORS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Phase 16: Iteration & Control Flow
 * 
 * 1. THE DEEP DIVE: GENERATORS (function*)
 * ---------------------------------------
 * Generators are special functions that can be "paused" 
 * and "resumed". 
 * - yield: Pauses the function and returns a value.
 * - .next(): Resumes the function from where it left off.
 * - Why use them? LAZY EVALUATION. You can represent an 
 *   infinite sequence without crashing your RAM.
 * 
 * 2. ASYNC ITERATORS (Symbol.asyncIterator)
 * -----------------------------------------
 * When the "next" value involves a Promise (e.g., streaming 
 * from a database), we use Async Iterators.
 * - for await...of: The syntax for sequential async looping.
 */

"use strict";

/**
 * 1. THE GENERATOR PATTERN (Lazy Sequences)
 */
function* fibonacciGenerator() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

console.log("--- GENERATOR (Fibonacci) ---");
const fib = fibonacciGenerator();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5

/**
 * 2. ASYNC ITERATION (The Stream Pattern)
 * Let's simulate a paginated API that we want to loop 
 * over as if it were a local array.
 */
const mockDatabase = {
    async* getRecords() {
        let page = 1;
        while (page <= 3) {
            console.log(`[NETWORK] Fetching page ${page}...`);
            await new Promise(r => setTimeout(r, 500)); // Simulate delay
            yield [`Record ${page}-A`, `Record ${page}-B`];
            page++;
        }
    }
};

async function processStream() {
    console.log("--- ASYNC ITERATION (for await...of) ---");
    for await (const batch of mockDatabase.getRecords()) {
        console.log("Processing Batch:", batch);
    }
    console.log("Stream Complete.");
}

processStream();

/**
 * 3. ADVANCED COMMUNICATION (Two-way Generators)
 * You can pass values BACK into the generator via .next(val)
 */
function* conversation() {
    const name = yield "What is your name?";
    const mood = yield `Hello ${name}, how are you?`;
    yield `I'm also ${mood}!`;
}

const chat = conversation();
console.log(chat.next().value);       // "What is your name?"
console.log(chat.next("Antigravity").value); // "Hello Antigravity..."
console.log(chat.next("Excited").value);     // "I'm also Excited!"

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why are Generators useful for Redux-Saga or Koa?
 * A1: They allow async flow to look synchronous while handled 
 *     externally. They give the middleware control over *when* 
 *     to resume the logic.
 * 
 * Q2: Difference between `async function` and `async generator`?
 * A2: An async function returns ONE promise. An async generator 
 *     returns an iterator where EVERY `.next()` call returns 
 *     a Promise. It's a stream of promises.
 * 
 * Q3: Can you use `yield*` (yield-star)?
 * A3: Yes. It delegates to another generator or iterable. 
 *     Useful for flattening deep structures.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the return type of a Generator function call?
 * (Answer: An Object (Iterator). The function body doesn't run 
 *  until the first `.next()` call.)
 * 
 * Q2: If you use `return` inside a generator, what happens?
 * (Answer: It sets `done: true` and the returned value is the 
 *  last `value`. Standard loops like `for...of` ignore 
 *  the 'value' of the final 'done: true' iteration.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Write an async generator that reads a large file 
 *              line by line using Node.js readable streams.
 * Challenge 2: Implement a "Retry" wrapper for an async iterator.
 */
