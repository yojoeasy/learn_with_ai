/* 
    SENIOR ENGINEER PATTERN: Centralized State Management
    1. Define the state (count)
    2. Define the UI Update function (updateUI)
    3. Add listeners that only touch the state and call updateUI
*/

let count = 0;
const counterDisplay = document.getElementById('counter');
const incBtn = document.getElementById('increment-btn');
const decBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

/**
 * Syncs the state (variable) to the UI (DOM)
 * This is the single source of truth for the visual state.
 */
function updateUI() {
    // 1. Sync the state to the display text
    counterDisplay.textContent = count;

    // 2. Business Logic: Disable buttons at boundaries (0 and 10)
    decBtn.disabled = (count <= 0);
    incBtn.disabled = (count >= 10);

    // 3. Conditional Styling: Change color if limit reached
    counterDisplay.style.color = (count === 0 || count === 10) ? "#ef4444" : "#3b82f6";
}

// Increment Listener
incBtn.addEventListener('click', () => {
    if (count < 10) {
        count++;
        updateUI();
    }
});

// Decrement Listener
decBtn.addEventListener('click', () => {
    if (count > 0) {
        count--;
        updateUI();
    }
});

// Reset Listener
resetBtn.addEventListener('click', () => {
    count = 0;
    updateUI();
});

// INITIALIZE THE UI ON LOAD
// This ensures buttons are correctly disabled (e.g. decrement at 0) when the page first opens.
updateUI();