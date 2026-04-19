/**
 * ==========================================
 * TOPIC 04: REGEXP SECURITY (ReDoS)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior Extension: Algorithmic Security
 * 
 * 1. THE DEEP DIVE: BACKTRACKING
 * ------------------------------
 * Regular Expression Denial of Service (ReDoS) occurs when a RegEx 
 * engine takes exponential time to process a specific input string. 
 * This is caused by "Catastrophic Backtracking".
 * 
 * - Deterministic Finite Automaton (DFA): Very fast, but limited features.
 * - Nondeterministic Finite Automaton (NFA): Used by JS (V8 Irregexp). 
 *   Supports backreferences but is prone to exponential backtracking.
 * 
 * 2. VULNERABLE PATTERNS
 * ----------------------
 * The "Evil Regex" usually contains:
 * 1. Grouping with repetition: `(a+)+`
 * 2. Overlapping alternatives: `(a|a)+`
 * 3. Repetition inside repetition: `([a-zA-Z]+)*$`
 * 
 * 3. INTERNAL WORKING (V8 IRREGEXP)
 * ----------------------------------
 * V8's RegEx engine (Irregexp) compiles patterns into native machine 
 * code. However, if a pattern is complex, the engine must "try" 
 * every possible path when the match fails at the end. An input string 
 * of just 30 characters can take YEARS to process.
 * 
 * 4. VISUAL MENTAL MODEL: THE MAZE
 * --------------------------------
 * - Normal RegEx: A simple hallway. You walk from A to B.
 * - ReDoS: A maze with 1000 identical doors. When you reach the end 
 *   and find it locked, you have to go back and try every combination 
 *   of every door you passed.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Validation: Never trust user-provided RegEx strings. 
 * - Tools: Use libraries like `safe-regex` to audit your patterns 
 *   on the server.
 * - Non-greedy: Using `.*?` instead of `.*` can sometimes reduce 
 *   the backtracking surface.
 */

// --- ONE BAD EXAMPLE: The Classic ReDoS ---
const evilRegex = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.][a-z]+$/i;
// This looks like a normal email regex, but the nested groups 
// and optional alternatives can cause catastrophic backtracking 
// on long strings like "aaaaaaaaaaaaaaaaaaaaaaaaaaaa!"

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Safe Patterns) ---
"use strict";

/**
 * 1. ATOMIC LOOKAHEAD (Simulated)
 * JS doesn't support Atomic Groups yet, but we can use Lookaheads 
 * to prevent backtracking once a sub-pattern matches.
 */
const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simple, linear, no nested repeats.

/**
 * 2. TIME-LIMITED REGEX (Senior Strategy)
 */
function safeMatch(regex, str, timeoutMs = 100) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            // Since we can't 'stop' a regex once it starts on the 
            // main thread, we usually run these in WORKERS (Phase 11.2).
            reject(new Error("RegEx timeout: Potential ReDoS attack detected."));
        }, timeoutMs);

        const result = regex.test(str);
        clearTimeout(timeout);
        resolve(result);
    });
}

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is "Catastrophic Backtracking"?
 * A1: It's when a RegEx engine tries an exponential number of possible 
 *     paths to match a string, eventually freezing the process.
 * 
 * Q2: How do you detect an "Evil Regex"?
 * A2: Look for nested repetitions (`(+)*`) and overlapping 
 *     character classes inside those repetitions.
 * 
 * Q3: Why is it safer to run RegEx on the Backend inside a Worker?
 * A3: So that even if a ReDoS occurs, it only freezes one Worker 
 *     thread, not the entire server's event loop. You can then 
 *     kill the worker after a timeout.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: Does the input string length or the RegEx complexity matter more?
 * (Answer: Both. But even small strings (30-50 chars) can crash 
 *  a process if the RegEx complexity is high enough.)
 * 
 * Q2: Does `str.match(regex)` behave differently than `regex.test(str)`?
 * (Answer: In terms of performance and backtracking risk, no. 
 *  They use the same internal engine.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Take a "vulnerable" email regex and refactor it to 
 *              be linear (O(n)) while still being accurate.
 * Challenge 2: Use the `performance.now()` API to plot the execution 
 *              time of `/(a+)+$/` against an increasing number of 
 *              "a" characters followed by an "x".
 */
