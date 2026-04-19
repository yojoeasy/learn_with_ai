/**
 * ==========================================
 * TOPIC 02: EVENT EMITTER & OBSERVER PATTERN
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Node.js is "Event-Driven". Most of its core modules (fs, http, streams) 
 * inherit from the `EventEmitter` class.
 * 
 * - The Observer Pattern: A central registry where "Subscribers" 
 *   listen for state changes and "Publishers" broadcast events.
 * - Synchronous by Default: Event listeners are executed 
 *   synchronously in the order they were registered.
 * 
 * 2. INTERNAL WORKING (REGISTRY)
 * -------------------------------
 * Behind the scenes, an EventEmitter is just a plain object 
 * where keys are event names and values are arrays of functions.
 * { "start": [fn1, fn2], "end": [fn3] }
 * 
 * 3. MEMORY BEHAVIOR (LISTENERS)
 * ------------------------------
 * Each listener is a closure. If you add listeners inside a loop 
 * or don't remove them when an object is destroyed, you WILL 
 * leak memory.
 * - MAX LISTENERS: By default, Node.js warns if you add more than 
 *   10 listeners to a single event (to detect potential leaks).
 * 
 * 4. VISUAL MENTAL MODEL: THE RADIO STATION
 * -----------------------------------------
 * Think of the EventEmitter as a "Radio Station".
 * - emit: The station broadcasting on a specific frequency (Event).
 * - on: Your radio tuned into that frequency. 
 * - once: A special radio that turns itself off after hearing 
 *   the first song.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Order: Since listeners run synchronously, if Listener #1 
 *   blocks the thread, Listener #2 will be delayed.
 * - Error Handling: If an 'error' event is emitted and no one 
 *   is listening, the Node.js process will CRASH.
 */

// --- ONE BAD EXAMPLE: Potential Memory Leak ---
function badEmitter(emitter) {
    // Adding a listener every time this function is called!
    emitter.on("data", () => {
        console.log("Processing...");
        // If this function is called 100 times, we'll have 
        // 100 identical listeners in memory.
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Custom Polyfill) ---
"use strict";

/**
 * Understanding the core of EventEmitter.
 */
class MyEventEmitter {
    constructor() {
        this._events = {};
    }

    on(name, listener) {
        if (!this._events[name]) this._events[name] = [];
        this._events[name].push(listener);
        return this;
    }

    emit(name, ...args) {
        if (!this._events[name]) return false;
        // 1. Iterate through listeners and call them
        this._events[name].forEach(fn => fn.apply(this, args));
        return true;
    }

    removeListener(name, listener) {
        if (!this._events[name]) return this;
        // 2. Filter out specifically this function
        this._events[name] = this._events[name].filter(fn => fn !== listener);
        return this;
    }

    once(name, listener) {
        const wrapper = (...args) => {
            this.removeListener(name, wrapper);
            listener.apply(this, args);
        };
        return this.on(name, wrapper);
    }
}

// TESTING
const myEE = new MyEventEmitter();
const handleLog = (msg) => console.log(`[EVENT]: ${msg}`);

myEE.on("log", handleLog);
myEE.emit("log", "System started."); // [EVENT]: System started.
myEE.removeListener("log", handleLog);
myEE.emit("log", "This won't fire.");

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Are EventEmitter listeners synchronous or asynchronous?
 * A1: Synchronous. They execute in the order they were registered 
 *     within the current turn of the event loop.
 * 
 * Q2: What happens if an 'error' event is emitted but not handled?
 * A2: The Node.js process prints a stack trace and exits (Crashes).
 * 
 * Q3: How do you add a listener that only fires once?
 * A3: Use the `.once()` method, which automatically unregisters 
 *     itself after execution.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I have two listeners on 'start', and Listener #1 
 *     throws an error, does Listener #2 execute?
 * (Answer: No. Since they run synchronously, an unhandled exception 
 *  in the first listener will halt the execution of the others.)
 * 
 * Q2: In an EventEmitter, what does `this` point to inside a 
 *     listener function (non-arrow)?
 * (Answer: The EventEmitter instance itself.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Build a "Logger Middleware" using EventEmitter that 
 *              tracks execution time between events.
 * Challenge 2: Implement a "Debounced EventEmitter" that only emits 
 *              if 500ms has passed since the last call.
 */
