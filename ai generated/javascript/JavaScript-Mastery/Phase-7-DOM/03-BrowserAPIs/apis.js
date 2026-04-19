/**
 * ==========================================
 * TOPIC 03: BROWSER APIs (Observer Patterns)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Traditional scroll listeners fire 60+ times per second on the main 
 * thread, causing "Jank" (Dropped frames). Modern Browser APIs solve 
 * this by offloading the "Observation" logic to the browser engine.
 * 
 * - Intersection Observer: Watches when an element enters or 
 *   leaves the viewport (Safe for Scroll-triggered logic).
 * - Resize Observer: Watches when an element's dimensions change.
 * - Mutation Observer: Watches for changes in the DOM tree.
 * 
 * 2. INTERNAL WORKING (ASYNC BATCHING)
 * ------------------------------------
 * Observers are asynchronous. They batch multiple changes together and 
 * trigger a single callback, reducing the impact on the rendering path.
 * 
 * 3. VISUAL MENTAL MODEL: THE OVERSEER
 * ------------------------------------
 * Think of your scroll logic as a "Camera".
 * - Old Way: You manually check every millisecond "Are we at the 
 *   finish line yet?".
 * - Intersection Observer: You set a "Sensor" at the finish line. 
 *   The sensor automatically pings you ONLY when someone crosses it.
 * 
 * 4. PERFORMANCE HINT: PASSIVE LISTENERS
 * --------------------------------------
 * When using traditional listeners for scroll/touch, use 
 * `{ passive: true }`. This tells the browser you won't call 
 * `preventDefault()`, allowing it to scroll smoothly without 
 * waiting for JS execution.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Thresholds: Setting too many thresholds in Intersection Observer 
 *   can increase CPU overhead. 
 * - Memory: Always called `.disconnect()` when the logic is no 
 *   longer needed to stop the browser from watching.
 */

// --- ONE BAD EXAMPLE: Heavy Scroll Listener ---
function badScrollWatch() {
    window.addEventListener("scroll", () => {
        // 1. This fires 60 times a second
        const items = document.querySelectorAll(".item");
        items.forEach(el => {
            // 2. getBoundingClientRect() forces Reflow!
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add("visible");
            }
        });
    });
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Observer) ---
"use strict";

/**
 * 1. HIGH PERFORMANCE VIEWPORT WATCHER
 */
function setupLazyLoading() {
    const options = {
        root: null, // use the viewport
        threshold: 0.1, // 10% visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // 1. Lazy load logic...
                console.log(`[OBSERVER] Element entered view:`, target.id);
                target.classList.add("fade-in");

                // 2. Stop watching once it's loaded (Efficiency!)
                self.unobserve(target);
            }
        });
    }, options);

    // Watch multiple elements
    document.querySelectorAll(".lazy-load").forEach(el => observer.observe(el));
}

/**
 * 2. RESIZE OBSERVER (Component-specific layout)
 */
function watchComponentSize(element) {
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            console.log(`[RESIZE] New Width: ${entry.contentRect.width}px`);
        }
    });

    resizeObserver.observe(element);
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Why is Intersection Observer better than a scroll listener?
 * A1: It doesn't run on the main thread's high-frequency scroll loop. 
 *     It pings you ONLY when the intersection state changes, saving CPU power.
 * 
 * Q2: What is the 'rootMargin' property?
 * A2: It's like a CSS margin. It allows you to grow or shrink the area 
 *     around the root element used for intersection (Useful for 
 *     starting a lazy load slightly before the user sees it).
 * 
 * Q3: When should you use a Mutation Observer?
 * A3: When you need to detect changes to the DOM made by other scripts, 
 *     extensions, or when building an "Autosave" feature for rich-text editors.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Is the callback of Intersection Observer synchronous?
 * (Answer: No. It's debounced and executed asynchronously by the 
 *  browser internally.)
 * 
 * Q2: Does the Resize Observer fire on the initial load?
 * (Answer: Yes, because the element transitions from 0 width/height 
 *  to its actual content size.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement an "Infinite Scroll" that adds more items 
 *              when the user reaches a "Footer Sensor" element.
 * Challenge 2: Build a Responsive Component that changes its internal 
 *              layout (not via Media Queries) based on its own width.
 */
