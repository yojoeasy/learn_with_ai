/**
 * ==========================================
 * TOPIC 01: DEBOUNCE & THROTTLE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Both techniques are used to control the rate at which a function 
 * is executed, but they solve different problems.
 * 
 * - Debouncing: "Wait until the storm is over." It delays execution 
 *   until a specified period of inactivity has passed. If the event 
 *   is triggered again during the wait, the timer resets.
 * 
 * - Throttling: "Only allow one per time slot." It ensures a function 
 *   is called at most once in a specified time interval, regardless of 
 *   how many times the event is triggered.
 * 
 * 2. INTERNAL WORKING (CLOSURES & TIMERS)
 * ----------------------------------------
 * Both rely on Closures to maintain a "Private State" (the timer ID or 
 * the last execution timestamp) across multiple event triggers.
 * 
 * 3. MEMORY BEHAVIOR
 * -----------------
 * Since these utilities return a NEW function that holds a closure, 
 * the variable carrying the debounced function must be kept in scope 
 * (usually at the top level or as a class property) to work correctly.
 * 
 * 4. VISUAL MENTAL MODEL: THE ELEVATOR & THE TRAIN
 * ------------------------------------------------
 * - Debounce (The Elevator): The doors won't close until everyone 
 *   stops entering. If someone enters at the last second, the wait 
 *   starts all over again.
 * - Throttle (The Train): The train leaves every 30 minutes. 
 *   It doesn't matter if 1 person or 1000 people arrive at the platform; 
 *   the only way to catch it is to be there when the doors open.
 * 
 * 5. EDGE CASES
 * -------------
 * - Leading vs Trailing: Debounce can be configured to fire at the 
 *   START of the burst (leading) or the END (trailing).
 * - Immediate Throttle: Ensuring the first call fires immediately 
 *   even in a throttled environment.
 */

// --- ONE BAD EXAMPLE: Global counter with no control ---
function badSearch() {
    window.addEventListener("scroll", () => {
        // This fires 60+ times per second during scrolling!
        // Expensive DOM updates here will lag the browser.
        console.log("Expensive Scroll Calculation...");
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

/**
 * Robust Debounce Implementation
 */
function debounce(func, wait, leading = false) {
    let timeout;

    return function (...args) {
        const context = this;
        const callNow = leading && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            if (!leading) func.apply(context, args);
        }, wait);

        if (callNow) func.apply(context, args);
    };
}

/**
 * Robust Throttle Implementation (Timestamp based)
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;

    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// USAGE IN REAL APP
const handleSearch = debounce((query) => {
    console.log(`[API] Searching for: ${query}`);
}, 300);

const handleScroll = throttle(() => {
    console.log(`[UI] Updating Scroll Position...`);
}, 100);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: When would you use Throttle over Debounce?
 * A1: Use Throttle for events that need a continuous but controlled 
 *     update (e.g., resizing, scrolling, shooting in a game). 
 *     Use Debounce for events where you only care about the FINAL state 
 *     (e.g., search input, window resize completion).
 * 
 * Q2: How does a Debounce closure avoid memory leaks?
 * A2: By calling clearTimeout() before creating a new timer, ensuring 
 *     old timer references are discarded by the engine.
 * 
 * Q3: What is "Leading" debounce?
 * A3: It's an option that triggers the function immediately on the 
 *     first call, then silences all subsequent calls until a period of 
 *     silence occurs. Useful for "Double Click" prevention on buttons.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If a debounced function (300ms) is called at 0ms, 100ms, and 200ms, 
 *     when does it actually execute?
 * (Answer: At 500ms (200ms + 300ms wait period).)
 * 
 * Q2: What happens if you call a debounced function inside a loop 
 *     without storing the returned closure?
 * (Answer: It won't work. Each iteration creates a NEW timer that 
 *  knows nothing about the others, so the function executes N times.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Enhance the debounce function to return a 'cancel' method 
 *              that stops any pending execution.
 * Challenge 2: Implement a "Save Progress" feature that throttles database 
 *              writes to once every 5 seconds.
 */
