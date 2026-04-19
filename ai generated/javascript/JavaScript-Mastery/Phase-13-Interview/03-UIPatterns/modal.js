/**
 * ==========================================
 * TOPIC 03: UI PATTERNS (Vanilla JS Modal)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Professional UI
 * 
 * 1. THE DEEP DIVE: ACCESSIBILITY (A11y)
 * -------------------------------------
 * A modal isn't just a box that appears. Professional modals:
 * - Trap Focus: The user shouldn't be able to Tab outside the modal.
 * - Restore Focus: Focus should return to the button that opened it.
 * - Close on Escape: Standard keyboard expectation.
 * - ARIA Roles: `role="dialog"`, `aria-modal="true"`.
 * 
 * 2. PERFORMANCE & DOM
 * --------------------
 * - Create vs Toggle: Adding/Removing from DOM vs toggling 'hidden' 
 *   class. Toggling is usually faster for simple modals.
 * - Body Scroll Lock: Prevent background scrolling while modal is open.
 */

"use strict";

/**
 * PRODUCTION-LEVEL MODAL COMPONENT
 */
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.lastFocusedElement = null;

        // Find focusable elements (Standard list)
        this.focusableItems = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        this.init();
    }

    init() {
        this.closeBtn = this.modal.querySelector(".close-btn");

        // Event Listeners
        this.closeBtn.addEventListener("click", () => this.close());
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) this.close(); // Backdrop click
        });

        // Keyboard handler
        document.addEventListener("keydown", (e) => {
            if (!this.isOpen()) return;
            if (e.key === "Escape") this.close();
            if (e.key === "Tab") this.handleFocusTrap(e);
        });
    }

    open() {
        this.lastFocusedElement = document.activeElement;
        this.modal.classList.add("active");
        this.modal.setAttribute("aria-hidden", "false");

        // 1. Focus first element
        const first = this.modal.querySelector(this.focusableItems);
        if (first) first.focus();

        // 2. Lock body scroll
        document.body.style.overflow = "hidden";
    }

    close() {
        this.modal.classList.remove("active");
        this.modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // 3. Restore focus
        if (this.lastFocusedElement) this.lastFocusedElement.focus();
    }

    isOpen() {
        return this.modal.classList.contains("active");
    }

    /**
     * SENIOR PATTERN: THE FOCUS TRAP
     */
    handleFocusTrap(e) {
        const focusables = Array.from(this.modal.querySelectorAll(this.focusableItems));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) { // Backwards tab
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else { // Forwards tab
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is a "Focus Trap"?
 * A1: A mechanism that ensures the user's focus stays inside 
 *     a specific element (like a modal), which is vital for 
 *     keyboard and screen reader accessibility.
 * 
 * Q2: How do you prevent the "Scroll Leak" when a modal is open?
 * A2: Set `document.body.style.overflow = 'hidden'`. Remember to 
 *     restore it when the modal closes.
 * 
 * Q3: Why is 'role="dialog"' important?
 * A3: It tells Screen Readers that this new area is a dialog box, 
 *     helping visually impaired users understand the UI shift.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If I use 'document.querySelector' inside a modal, what is 
 *     a potential performance issue?
 * (Answer: If the modal is large, traversing the whole document 
 *  is expensive. Scoping it to `this.modal.querySelector` is better.)
 * 
 * Q2: What happens if I unmount the modal without removing the 
 *     'Escape' key listener from the `document`?
 * (Answer: A Memory Leak. The closure in the listener will keep 
 *  the Modal instance in memory forever.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement an "Animation Finish" promise so the modal 
 *              actually closes only after the CSS transition ends.
 * Challenge 2: Create a `ModalManager` that handles stacking 
 *              multiple modals (Last In, First Out).
 */
