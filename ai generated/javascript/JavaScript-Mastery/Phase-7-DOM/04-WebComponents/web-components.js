/**
 * ==========================================
 * TOPIC 04: SHADOW DOM & WEB COMPONENTS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Web Components is a suite of different technologies allowing you 
 * to create reusable custom elements with their functionality 
 * encapsulated away from the rest of your code.
 * 
 * - Three Main Pillars:
 *   1. Custom Elements: Defining new HTML tags with JS classes.
 *   2. Shadow DOM: Providing encapsulation for CSS and markup.
 *   3. HTML Templates: Defining reusable markup fragments using <template> 
 *      and <slot>.
 * 
 * 2. SHADOW DOM (OPEN VS CLOSED)
 * ------------------------------
 * - Open: You can access the shadow root from outside via 
 *   `element.shadowRoot`.
 * - Closed: You CANNOT access the shadow root from outside. 
 *   (Highly recommended for true encapsulation).
 * 
 * 3. VISUAL MENTAL MODEL: THE SUBMARINE
 * -------------------------------------
 * Think of your web page as the Ocean.
 * - Standard DOM: Any ship can see and potentially crash into another. 
 *   Global CSS styles are like sea currents that affect everything.
 * - Shadow DOM: A submarine (The Web Component). It has its own 
 *   internal air pressure, lights, and rules. The ocean currents (CSS) 
 *   cannot get inside it, and outsiders cannot see its internal wiring 
 *   unless they have a special periscope (Open mode).
 * 
 * 4. PERFORMANCE HINT: ENCAPSULATION
 * ----------------------------------
 * Because Shadow DOM styles are scoped to the component, the browser 
 * doesn't have to re-evaluate the entire CSSOM of the main page 
 * when a component's internal style changes.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Style Inheritance: While Shadow DOM blocks CSS from entering, 
 *   inheritable properties (like 'color' and 'font-family') still 
 *   filter down from the parent document.
 * - Event Retargeting: Events inside the Shadow DOM are retargeted 
 *   as if they came from the component itself when they bubble 
 *   out to the light DOM.
 */

// --- ONE BAD EXAMPLE: Global Style Contamination ---
function badComponent() {
    const el = document.createElement("div");
    el.innerHTML = `
        <style> .btn { background: red; } </style>
        <button class="btn">Click me</button>
    `;
    // This style tag might affect other ".btn" elements on the main page!
    document.body.appendChild(el);
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Web Component) ---
"use strict";

/**
 * A reusable, encapsulated Profile Card component.
 */
class UserProfileCard extends HTMLElement {
    constructor() {
        super();

        // 1. Create a Shadow Root (Closed for maximum encapsulation)
        this.attachShadow({ mode: "open" });

        // 2. Define the Template logic
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-family: inherit;
                }
                .title { color: royalblue; margin: 0; }
                ::slotted(p) { color: #555; } /* Access Slot styling */
            </style>
            <div>
                <h3 class="title">${this.getAttribute("name") || "Guest"}</h3>
                <slot name="bio"><p>No bio provided.</p></slot>
            </div>
        `;
    }

    /**
     * Life cycle callback: When component is added to document
     */
    connectedCallback() {
        console.log("[WEB_COMPONENT] Rendered on page.");
    }
}

// 3. Register the Custom Element
customElements.define("user-profile-card", UserProfileCard);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the main benefit of the Shadow DOM?
 * A1: Encapsulation. It ensures that styles and scripts inside a 
 *     component don't bleed out and affect the rest of the page, 
 *     and vice versa.
 * 
 * Q2: What is a 'slot' in Web Components?
 * A2: It's a placeholder inside a component's shadow DOM that 
 *     you can fill with your own markup from the outside (Light DOM).
 * 
 * Q3: How do you pass data into a Web Component?
 * A3: Via Attributes (monitored by observedAttributes) or by 
 *     setting Properties directly on the JavaScript object instance.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Can a global CSS rule like `div { background: blue; }` 
 *     change the background of a div inside a Shadow Root?
 * (Answer: No. Shadow DOM provides a style boundary.)
 * 
 * Q2: What is the ':host' selector used for?
 * (Answer: To style the custom element itself from WITHIN its 
 *  Shadow DOM.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Create a "Dark Mode Toggle" component that encapsulates its 
 *              own styles and dispatches a custom event when the state changes.
 * Challenge 2: Implement a custom "Progress Bar" using attributes to 
 *              update the internal progress state smoothly.
 */
