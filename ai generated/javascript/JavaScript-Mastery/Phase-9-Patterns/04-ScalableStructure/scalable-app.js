/**
 * ==========================================
 * TOPIC 04: SCALABLE PROJECT STRUCTURE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * As a project grows, a "flat" structure leads to spaghetti code. 
 * Scalable architecture separates code based on "Responsibility" 
 * rather than "Technical Type".
 * 
 * - Clean Architecture (Hexagonal):
 *   - Domain (Center): Core business logic/rules. No dependencies.
 *   - Application (Use Cases): Orchestration logic (e.g., "Checkout").
 *   - Infrastructure (Outer): Databases, APIs, UI, Express.js.
 * 
 * - Folder Structure (Feature-based):
 *   /src
 *     /shared -> Common utilities, constants.
 *     /modules
 *       /users
 *         /services
 *         /repositories
 *         /controllers
 *         user.entity.js
 * 
 * 2. THE DEPENDENCY RULE
 * -----------------------
 * Dependencies should only point INWARDS. The Domain shouldn't know 
 * about the Database. If you change a database from MongoDB to Postgres, 
 * the Domain logic stays identical.
 * 
 * 3. INTERNAL WORKING (ABSTRACTION LAYERS)
 * -----------------------------------------
 * We use interfaces or "Abstract Classes" to define what an external 
 * service should do, without caring HOW it does it.
 * 
 * 4. VISUAL MENTAL MODEL: THE ONION
 * ---------------------------------
 * - Heart (Domain): The secret recipe of a restaurant. 
 * - Kitchen (Application): Where the chef follows the recipe to make a dish. 
 * - Dining Room (Infrastructure): Where the customer (User) interacts 
 *   with the waiter (API) to get the dish. 
 * - If you change the Dining Room furniture, the Secret Recipe remains 
 *   the same.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Over-engineering: Don't use Clean Architecture for a 5-page 
 *   portfolio site. It adds significant boilerplate overhead.
 * - Circular Imports: Feature-based structures can lead to modules 
 *   constantly importing each other. Use a 'shared' or 'core' module 
 *   to break these cycles.
 */

// --- ONE BAD EXAMPLE: Monolithic Controller (God Object) ---
async function badCreateUser(req, res) {
    // 1. Validation logic here
    // 2. Encryption logic here
    // 3. Database direct call (Mongoose) here
    // 4. Email sending logic here
    // 5. Response logic here
    // (Impossible to maintain as features grow)
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Layered) ---
"use strict";

/**
 * 1. DOMAIN LAYER (Entities)
 */
class Order {
    constructor(id, items) {
        this.id = id;
        this.items = items;
        this.status = "pending";
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}

/**
 * 2. INFRASTRUCTURE LAYER (Adapters)
 * This could be a Postgres implementation later, 
 * but the service won't care.
 */
class MemoryOrderRepository {
    async save(order) {
        console.log(`[DB] Saved order ${order.id} to memory.`);
    }
}

/**
 * 3. APPLICATION LAYER (Service/Use Case)
 */
class CheckoutService {
    constructor(orderRepo) {
        this.orderRepo = orderRepo; // DI
    }

    async placeOrder(userId, items) {
        // 1. Domain logic invocation
        const order = new Order(Date.now(), items);
        const total = order.calculateTotal();

        // 2. Infrastructure interaction
        await this.orderRepo.save(order);

        console.log(`[SERVICE] Checkout complete for $${total}`);
        return order;
    }
}

// SIMULATION
const repo = new MemoryOrderRepository();
const checkout = new CheckoutService(repo);
checkout.placeOrder(1, [{ price: 100 }, { price: 50 }]);

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is the "Dependency Inversion Principle" (DIP)?
 * A1: High-level modules should not depend on low-level modules. 
 *     Both should depend on abstractions. (Think of DI).
 * 
 * Q2: Difference between a Controller and a Service?
 * A2: A Controller handles HTTP/Request logic (parsing, headers). 
 *     A Service handles Business logic (calculating, data flow).
 * 
 * Q3: Why is "Flat Structure" (e.g., /controllers, /models) 
 *     bad for large apps?
 * A3: It's harder to find code related to a specific feature. 
 *     Grouping by feature (e.g., /users, /orders) is more scalable.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: In Clean Architecture, can a Service import an Express.js 'Request' object?
 * (Answer: NO. The Application layer should be framework-agnostic. 
 *  Accept raw data and return raw objects.)
 * 
 * Q2: Where should "Validation" live?
 * (Answer: Domain validation (e.g., minimum balance) belongs in 
 *  the Entity. Request validation (e.g., required email field) 
 *  belongs in the Controller/Middleware.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Refactor a single messy file into 3 layers: 
 *              Entity (Logic), Repository (Storage), and Service (Flow).
 * Challenge 2: Draw a dependency graph for a simple "Blog" app 
 *              using Feature-based folder structure.
 */
