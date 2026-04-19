/**
 * ==========================================
 * PHASE 1 MINI PROJECT: MODULE REGISTRY
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In the real world, complex applications (like React or Node.js backends) 
 * rely on module isolation. This pattern prevents "Global Namespace Pollution," 
 * where multiple scripts overwrite each other's variables. 
 * Understanding this allows you to build robust, scalable architectures 
 * even without modern build tools (like Webpack/Vite).
 */

"use strict";

/**
 * The 'AppRegistry' IIFE creates a private sandbox for managing modules.
 * This utilizes:
 * 1. IIFE: To immediately create a private scope.
 * 2. Closure: The inner functions 'register' and 'get' remember the 'modules' Map.
 * 3. Scope: The 'modules' Map is inaccessible from the outside.
 */
const AppRegistry = (function () {
    // Private State - Inaccessible from outer scopes (Encapsulation)
    const modules = new Map();

    /**
     * Registers a new module.
     * @param {string} name - Unique name for the module.
     * @param {function} definition - A function that returns the module's API.
     */
    function register(name, definition) {
        if (modules.has(name)) {
            console.error(`Module '${name}' is already registered.`);
            return;
        }

        // Execute the definition function and store the returned API (Closure!)
        const api = definition();
        modules.set(name, api);
        console.log(`[Registry] Module '${name}' registered successfully.`);
    }

    /**
     * Retrieves a registered module's API.
     * @param {string} name 
     */
    function get(name) {
        return modules.get(name);
    }

    // Public API - Exposed to the world
    return {
        register,
        get
    };
})();

// --- DATA SERVICE MODULE ---
AppRegistry.register("DataService", function () {
    // Local scope - private to this module
    let _data = [];

    return {
        add(item) {
            _data.push(item);
        },
        getAll() {
            // Returning a shallow copy to prevent external mutation of private array
            return [..._data];
        }
    };
});

// --- UI CONTROLLER MODULE ---
AppRegistry.register("UIController", function () {
    // Demonstrating Scope Chain - accessing AppRegistry from outer scope
    const dataService = AppRegistry.get("DataService");

    function render() {
        const items = dataService.getAll();
        console.log(`[UI] Rendering ${items.length} items:`, items);
    }

    return {
        init(initialItems) {
            initialItems.forEach(item => dataService.add(item));
            render();
        }
    };
});

// --- APPLICATION START ---
const ui = AppRegistry.get("UIController");
ui.init(["Dashboard", "User Settings", "Analytics"]);

// Try to access private data - SHOULD FAIL
// console.log(_data); // ReferenceError
// console.log(AppRegistry.modules); // undefined (Properly encapsulated)

/**
 * KEY LEARNING HIGHLIGHTS:
 * - Variables: Used 'const' for the registry and 'let' for the data array.
 * - Scope: Modules cannot see each other's private variables.
 * - Closures: 'add' and 'getAll' remember the '_data' array scope.
 * - IIFE: Protected the entire registry from global leakage.
 */
