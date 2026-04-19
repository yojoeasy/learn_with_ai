/**
 * ==========================================
 * TOPIC 01: CRITICAL RENDERING PATH (CRP)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * The Critical Rendering Path is the sequence of steps the browser 
 * goes through to convert HTML, CSS, and JS into pixels on the screen.
 * 
 * - The Steps:
 *   1. DOM (Document Object Model): Parsing HTML into a tree of nodes.
 *   2. CSSOM (CSS Object Model): Parsing CSS into a tree of styles.
 *   3. Render Tree: Combining DOM and CSSOM (Ignoring display: none).
 *   4. Layout (Reflow): Calculating the geometry (position/size) of each node.
 *   5. Paint (Repaint): Filling in pixels (colors, borders, shadows).
 *   6. Composite: Layering the painted parts (GPU acceleration).
 * 
 * 2. REFLOW VS REPAINT
 * --------------------
 * - Reflow (Layout): Triggered by changes to geometry (width, height, 
 *   top, left, fontSize). It is VERY expensive as it may recalculate 
 *   the entire frame.
 * - Repaint: Triggered by visual changes that don't affect geometry 
 *   (color, visibility, background-color). Expensive, but less than Reflow.
 * 
 * 3. COMPOSITING & LAYERS
 * -----------------------
 * Modern browsers use the GPU to handle 'transform' and 'opacity' changes. 
 * These properties trigger NEITHER Reflow nor Repaint; they only trigger 
 * Composite, making them the most performant for animations.
 * 
 * 4. VISUAL MENTAL MODEL: THE STAGE PLAY
 * --------------------------------------
 * - DOM: The Script (WHO is on stage).
 * - CSSOM: The Costume Design (WHAT they look like).
 * - Render Tree: The Casting Call (Only those appearing on stage).
 * - Layout: The Blocking (WHERE everyone stands).
 * - Paint: The Makeup (Applying the actual colors).
 * - Composite: The Lighting/Layers (Final scene assembly).
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Layout Thrashing: Reading a layout property (like offsetHeight) 
 *   immediately after writing one, forcing the browser to perform 
 *   a synchronous Reflow.
 * - Render Blocking: <script> and <link rel="stylesheet"> tags in the 
 *   <head> block the CRP until they finish loading/parsing.
 */

// --- ONE BAD EXAMPLE: Layout Thrashing ---
function badAnimate() {
    const box = document.getElementById("box");
    for (let i = 0; i < 1000; i++) {
        // 1. Write (Invalidates layout)
        box.style.width = (box.offsetWidth + 1) + "px";
        // 2. Read (Forces synchronous Reflow to get accurate offsetWidth)
        // This loop will be extremely slow!
    }
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Batching) ---
"use strict";

/**
 * Optimizing CRP by batching reads and writes.
 */
function fastAnimate() {
    const box = document.getElementById("box");

    // 1. Batch Read
    const currentWidth = box.offsetWidth;

    // 2. Schedule Write (using requestAnimationFrame)
    // rAF runs right before the next "Paint" cycle.
    requestAnimationFrame(() => {
        box.style.width = (currentWidth + 100) + "px";
        console.log("Layout update batched for next frame.");
    });
}

/**
 * USING THE "WILL-CHANGE" HINT
 * Tells the browser to put this element on its own GPU layer.
 * Use sparingly!
 */
const gpuBox = {
    optimize() {
        // css: .box { will-change: transform; }
        // Setting this allows V8/Browser to skip Layout/Paint 
        // for transform animations.
    }
};

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the difference between Reflow and Repaint?
 * A1: Reflow calculates geometry (positions/sizes) and is more expensive. 
 *     Repaint fills in colors/pixels without changing geometry.
 * 
 * Q2: How does a <script> tag affect the Critical Rendering Path?
 * A2: By default, it's render-blocking. The browser stops parsing HTML, 
 *     downloads the script, and executes it before continuing. 
 *     'async' and 'defer' help mitigate this.
 * 
 * Q3: What is Layout Thrashing?
 * A3: It's when a script performs successive writes and reads of layout-sensitive 
 *     DOM properties, forcing the browser to recalculate the layout repeatedly 
 *     within a single frame.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Does 'display: none' appear in the Render Tree?
 * (Answer: No. But 'visibility: hidden' DOES.)
 * 
 * Q2: Which CSS properties are cheapest to animate?
 * (Answer: transform and opacity, because they only trigger the 
 *  Compositing stage.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Log the time it takes for a "Heavy DOM injection" using 
 *              performance.mark() and performance.measure().
 * Challenge 2: Identify a Layout Thrashing issue in a provided code 
 *              snippet and fix it using requestAnimationFrame.
 */
