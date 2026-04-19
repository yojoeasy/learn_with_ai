/**
 * ==========================================
 * PHASE 5 MINI PROJECT: PERFORMANCE SEARCH
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * For apps like Spotify or Amazon, search input performance 
 * is everything. 
 * This project demonstrates:
 * 1. Debouncing: Avoiding API overload during typing.
 * 2. Memoization: Caching identical search results (e.g., repeating "ipho").
 * 3. Functional Data Processing: Clean, immutable results.
 */

"use strict";

// --- PART 1: UTILITIES (From our deep dives) ---
function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const res = fn.apply(this, args);
        cache.set(key, res);
        return res;
    };
}

// --- PART 2: THE CORE SEARCH ENGINE ---
const RAW_DATABASE = [
    { title: "JavaScript Mastery", price: 50 },
    { title: "React Deep Dive", price: 45 },
    { title: "Node.js Architecture", price: 60 },
    { title: "CSS Grid Wonders", price: 30 }
];

/**
 * Functional Search logic (Pure & Immutable)
 */
const mockApiSearch = (query) => {
    console.log(`[NETWORK] Calling API for: "${query}"`);
    return RAW_DATABASE.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
};

// --- PART 3: THE COMPOSITION (Senior Layer) ---
/**
 * 1. Memoize the search function first (Local Cache)
 * 2. Debounce the wrapper (Input Control)
 */
const memoizedSearch = memoize(mockApiSearch);

const searchHandler = debounce((query) => {
    if (!query) return;

    const results = memoizedSearch(query);
    console.log(`[RESULTS] Found ${results.length} items for "${query}"`);
    console.table(results);
}, 300);

// --- SIMULATION ---
console.log("--- STARTING PERFORMANCE SEARCH SIMULATION ---");

// Case 1: Typing "J...a...v" quickly 
searchHandler("J");     // Throttled (Canceled)
searchHandler("Ja");    // Throttled (Canceled)
searchHandler("Jav");   // Executed after 300ms (Cache Miss)

// Case 2: User clears and re-types "Jav" later
setTimeout(() => {
    console.log("--- RE-TYPING RECENT QUERY ---");
    searchHandler("Ja");  // Throttled
    searchHandler("Jav"); // Executed (Cache Hit - No Network Call!)
}, 2000);

/**
 * SENIOR HIGHLIGHTS:
 * - Resource Safety: The API is only hit once for "Jav" even if 
 *   queried twice across different time periods.
 * - Responsiveness: The UI thread isn't blocked by unnecessary filtering 
 *   during high-speed typing.
 * - Composition: Instead of writing one massive messy function, 
 *   we composed small, testable utilities (debounce, memoize, search).
 */
