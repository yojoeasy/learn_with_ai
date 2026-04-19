/**
 * ==========================================
 * TOPIC 01: VIRTUAL DOM & DIFFING ALGORITHM
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * The real DOM is slow because every update triggers the browser's 
 * Critical Rendering Path (Layout/Paint). The Virtual DOM (VDOM) 
 * is a lightweight JavaScript OBJECT representation of the real DOM.
 * 
 * - Reconciliation: The process of syncing the VDOM with the Real DOM.
 * - Diffing Algorithm: A heuristic O(n) algorithm that compares 
 *   two VDOM trees and produces a list of "patches" to apply.
 * 
 * 2. INTERNAL WORKING (RECURSIVE COMPARISON)
 * -------------------------------------------
 * 1. Compare Tag Types: If <div> changed to <span>, destroy the whole branch.
 * 2. Compare Props: Update only the changed attributes (e.g., class, style).
 * 3. Compare Children: Recursively diff child nodes.
 * 4. Keys: Unique IDs that help the algorithm identify which items 
 *    in a list were moved or deleted instead of re-rendering all.
 * 
 * 3. MEMORY BEHAVIOR (HEAP ALLOCATION)
 * -------------------------------------
 * VDOM nodes are just plain objects ({ tag, props, children }). 
 * Producing a new tree generates many short-lived objects on the 
 * V8 Heap. Modern engines handle this GC pressure efficiently, 
 * which is still faster than the browser's expensive layout calculations.
 * 
 * 4. VISUAL MENTAL MODEL: THE ARCHITECT'S BLUEPRINT
 * -------------------------------------------------
 * - Real DOM: The actual physical building. 
 * - Virtual DOM: A digital blueprint. 
 * - Diffing: Comparing the old blueprint with the new one. 
 * - Result: Instead of tearing down the whole building to move a 
 *   window, you only send a contractor to move that specific window.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Deep Nesting: Diffing extremely deep trees can block the main 
 *   thread. (React Fiber solves this by making diffing interruptible).
 * - Component Re-rendering: If you don't use 'keys' in lists, VDOM 
 *   might delete and recreate nodes unnecessarily, losing local state.
 */

// --- ONE BAD EXAMPLE: Direct DOM Thrashing ---
function badUpdate(data) {
    const list = document.getElementById("list");
    // Clear and redraw EVERYTHING on every change. Extreme Reflow cost!
    list.innerHTML = data.map(i => `<li>${i}</li>`).join("");
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Mini VDOM) ---
"use strict";

/**
 * 1. VDOM node creator
 */
const h = (tag, props, children) => ({ tag, props, children });

/**
 * 2. Convert VDOM to REAL DOM (Initial mount)
 */
function createElement(node) {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }
    const el = document.createElement(node.tag);
    // Apply props
    for (const [key, value] of Object.entries(node.props || {})) {
        el.setAttribute(key, value);
    }
    // Append children
    (node.children || []).map(createElement).forEach(el.appendChild.bind(el));
    return el;
}

/**
 * 3. THE DIFFING ENGINE (Simplified)
 */
function updateElement(parent, newNode, oldNode, index = 0) {
    // 1. If old node doesn't exist, append new
    if (!oldNode) {
        parent.appendChild(createElement(newNode));
    }
    // 2. If new node doesn't exist, remove old
    else if (!newNode) {
        parent.removeChild(parent.childNodes[index]);
    }
    // 3. If node type changed, replace entirely
    else if (newNode.tag !== oldNode.tag) {
        parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    // 4. Recurse children (If tag is the same)
    else if (newNode.tag) {
        const currentEl = parent.childNodes[index];
        // Diff props (Simplified)
        updateProps(currentEl, newNode.props, oldNode.props);

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < Math.max(newLength, oldLength); i++) {
            updateElement(currentEl, newNode.children[i], oldNode.children[i], i);
        }
    }
}

function updateProps(el, nextProps, prevProps) {
    // Implement prop diffing logic here
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Is the Virtual DOM faster than the Real DOM?
 * A1: Technically, no. All changes must eventually hit the real DOM. 
 *     However, the VDOM is faster at *calculating* what needs to 
 *     change, ensuring the real DOM is touched as little as possible.
 * 
 * Q2: Why are 'keys' important in lists?
 * A2: Keys provide a stable identity to VDOM nodes across renders, 
 *     allowing the algorithm to move nodes instead of re-creating 
 *     them.
 * 
 * Q3: What is "Hydration"?
 * A3: It's the process of attaching event listeners to a pre-rendered 
 *     HTML string (from the server) to make it an interactive 
 *     SPA in the browser.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If a component's VDOM 'tag' is identical but its children 
 *     order changed without keys, what is the diffing cost?
 * (Answer: O(n). It will likely patch every child node as it 
 *  compares them one-by-one at the same index.)
 * 
 * Q2: Does changing a 'style' prop in VDOM trigger a Reflow?
 * (Answer: Only if the property changed affects layout (e.g., width). 
 *  If it's just 'color', it only triggers a Repaint.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Extend the `updateProps` function to handle event 
 *              listeners (e.g., onClick) using the Delegation pattern.
 * Challenge 2: Implement a "Fragment" VDOM node that doesn't 
 *              render an actual HTML container.
 */
