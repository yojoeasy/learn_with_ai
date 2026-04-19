/**
 * ==========================================
 * TOPIC 02: EVENTS (Bubbling & Capturing)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Every DOM event follows a 3-Phase lifecycle:
 * 
 * - 1. CAPTURING PHASE: The event starts from the window and 
 *      drills down to the target element (Rarely used, but powerful).
 * - 2. TARGET PHASE: The event reaches the actual element you clicked.
 * - 3. BUBBLING PHASE: The event floats back up from the target 
 *      to the window. (The default behavior).
 * 
 * 2. EVENT DELEGATION (SENIOR PATTERN)
 * ------------------------------------
 * High-performance UI management strategy. Instead of adding listeners 
 * to 1000 list items (expensive memory!), you add ONE listener to 
 * the parent and use the "Target" property to identify which child 
 * was clicked.
 * 
 * 3. INTERNAL WORKING (EVENT OBJECT)
 * -----------------------------------
 * - event.stopPropagation(): Stops the event from moving to the NEXT phase.
 * - event.preventDefault(): Stops the default browser action (e.g., form submit).
 * - event.stopImmediatePropagation(): Stops other listeners on the 
 *   SAME element from firing.
 * 
 * 4. VISUAL MENTAL MODEL: THE COURIER
 * -----------------------------------
 * Imagine a courier (The Event) delivering a package.
 * - Capturing: The courier enters the building and walks down the 
 *   stairs (Window -> Root -> Target).
 * - Target: Handing over the package.
 * - Bubbling: The courier walks back up the stairs and leaves the 
 *   building the same way they came.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Memory Leaks: Not removing event listeners when components are 
 *   destroyed (Unmounted).
 * - Performance: Attaching excessive listeners to the window or scroll 
 *   events without debouncing/throttling.
 */

// --- ONE BAD EXAMPLE: Individual Listeners (Memory Heavy) ---
function badListing() {
    const items = document.querySelectorAll(".li-item");
    items.forEach(item => {
        // 1000 items = 1000 listeners in memory!
        item.addEventListener("click", () => console.log("Clicked!"));
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Delegation) ---
"use strict";

/**
 * 1. Efficient Event Delegation
 */
function setupListDelegation() {
    const parent = document.getElementById("parent-list");

    parent.addEventListener("click", (event) => {
        // Use 'closest' or 'target' to find the specific item
        const item = event.target.closest(".li-item");

        if (item) {
            console.log(`[DELEGATION] Clicked item: ${item.innerText}`);
            // Logic only runs for these items! 
        }
    });
}

/**
 * 2. Capturing vs Bubbling Example
 */
function setupEventFlow() {
    const outer = document.getElementById("outer");
    const inner = document.getElementById("inner");

    // Click on 'inner' will log: Outer (Cap) -> Inner -> Outer (Bub)

    outer.addEventListener("click", () => console.log("Outer (Cap)"), true); // useCapture = true
    outer.addEventListener("click", () => console.log("Outer (Bub)"), false);
    inner.addEventListener("click", () => console.log("Inner"));
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is Event Delegation?
 * A1: It's a technique of using a single event listener on a parent 
 *     element to manage events for all its children, leveraging 
 *     event bubbling.
 * 
 * Q2: Difference between .target and .currentTarget?
 * A2: .target is the EXACT element that triggered the event (the child). 
 *     .currentTarget is the element the listener is attached to (the parent).
 * 
 * Q3: How do you stop an event from Bubbling?
 * A3: Use `event.stopPropagation()`.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If you have a listener on 'body' with useCapture=true, 
 *     and a normal listener on a 'button', which fires first 
 *     when you click the button?
 * (Answer: The 'body' listener, because Capturing happens before the 
 *  Target/Bubbling phases.)
 * 
 * Q2: What happens if you call event.stopPropagation() in the capturing phase?
 * (Answer: The event never reaches the target or bubbles up. It dies 
 *  immediately.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Build a "Universal Click Dispatcher" that logs every 
 *              clicked element's ID without modifying the elements themselves.
 * Challenge 2: Implement a custom "Right Click" context menu for a 
 *              dashboard using event delegation and preventDefault().
 */
