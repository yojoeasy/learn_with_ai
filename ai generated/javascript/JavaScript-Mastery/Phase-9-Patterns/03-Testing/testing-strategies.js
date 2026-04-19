/**
 * ==========================================
 * TOPIC 03: TESTING STRATEGIES (Pyramid)
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * A robust testing strategy follows the "Testing Pyramid":
 * - Unit Tests (Base): Small, fast tests for individual functions. 
 *   These should have zero external dependencies.
 * - Integration Tests (Middle): Testing how multiple modules work 
 *   together with real (or containerized) databases/APIs.
 * - E2E Tests (Top): High-level tests that simulate real user 
 *   behavior in a browser (Playwright/Cypress).
 * 
 * 2. MOCKS VS STUBS VS SPIES
 * --------------------------
 * - Stub: Provides hardcoded data to a dependency (Input control).
 * - Mock: Verifies that a dependency was called with specific 
 *   arguments (Output verification).
 * - Spy: Wraps a real function to record how many times it was 
 *   called without changing its behavior.
 * 
 * 3. INTERNAL WORKING (DEPENDENCY INJECTION)
 * -------------------------------------------
 * To make code "testable", you must avoid hardcoding dependencies. 
 * Use Dependency Injection (DI) to pass mock/real objects into 
 * your classes at runtime.
 * 
 * 4. VISUAL MENTAL MODEL: THE ENGINE INSPECTION
 * ---------------------------------------------
 * - Unit Test: Checking individual spark plugs outside the car.
 * - Integration Test: Starting the engine and checking if the 
 *   battery is charging the alternator.
 * - E2E Test: Driving the car on the highway to see if it reaches 
 *   60mph smoothly.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Brittle Tests: Tests that fail when you refactor the code 
 *   without changing the behavior. Avoid testing private implementation 
 *   details.
 * - Flaky Tests: E2E tests that pass/fail randomly due to network 
 *   latency or race conditions.
 */

// --- ONE BAD EXAMPLE: Untestable Code (Hardcoded dependency) ---
async function badNotifyUser(userId) {
    // 1. Hardcoded Fetch! (Impossible to unit test without network)
    const user = await fetch(`https://api.com/users/${userId}`);
    console.log("Notifying...");
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Testable logic) ---
"use strict";

/**
 * High-testability pattern: Dependency Injection
 */
class UserService {
    constructor(apiClient) {
        // Inject the dependency via constructor
        this.apiClient = apiClient;
    }

    async getAndNotify(userId) {
        const user = await this.apiClient.get(`/users/${userId}`);
        return `Notified: ${user.name}`;
    }
}

// --- TEST SIMULATION (Jest-style) ---

// 1. Create a STUB for the API Client
const mockApi = {
    get: async (url) => ({ name: "Test User" })
};

// 2. Unit Test
async function testUserService() {
    const service = new UserService(mockApi);
    const result = await service.getAndNotify(123);

    if (result === "Notified: Test User") {
        console.log("[PASS]: Unit test successful.");
    } else {
        console.error("[FAIL]: Expected different notification.");
    }
}

testUserService();

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is 'TDD' (Test Driven Development)?
 * A1: A workflow where you write the test FIRST, watch it fail, then 
 *     write the minimum code to make it pass, and finally refactor.
 * 
 * Q2: Why are Integration tests often slower than Unit tests?
 * A2: Because they involve real I/O, such as starting a database 
 *     container, clearing tables, or making network requests.
 * 
 * Q3: What is "Code Coverage"?
 * A3: A metric showing what percentage of your source code is 
 *     executed by your test suite. (Warning: 100% coverage != 0 bugs).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If a test passes on your local machine but fails on the CI server, 
 *     what are the likely causes?
 * (Answer: Environment variables, race conditions, time-zone 
 *  differences, or missing native dependencies.)
 * 
 * Q2: Shared state between tests (e.g., a global variable) is bad. Why?
 * (Answer: It causes "Order Dependency", where Test B only passes if 
 *  Test A ran before it. Tests should be isolated.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a simple "Mock Fetch" function that returns 
 *              different responses based on the URL provided.
 * Challenge 2: Write a test for a "Shopping Cart" class that uses 
 *              a spy to verify how many times the 'calculateTax' function 
 *              was called.
 */
