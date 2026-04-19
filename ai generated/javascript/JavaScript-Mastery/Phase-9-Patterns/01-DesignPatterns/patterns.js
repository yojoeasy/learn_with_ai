/**
 * ==========================================
 * TOPIC 01: DESIGN PATTERNS IN JAVASCRIPT
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * Design patterns are reusable solutions to common software design 
 * problems. In JavaScript, these patterns leverage closures, 
 * prototypes, and ES6 classes.
 * 
 * - Singleton: Ensures a class has only one instance and provides 
 *   a global point of access to it.
 * - Factory: Creates objects without specifying the exact class 
 *   of the object that will be created.
 * - Observer: Maintains a list of dependents and notifies them 
 *   automatically of any state changes (The basis for Event Handlers).
 * 
 * 2. INTERNAL WORKING (CLOSURES & PROXIES)
 * -----------------------------------------
 * - Singleton can be implemented using a private closure variable 
 *   or by freezing the object instance.
 * - Observer pattern is essentially the logic behind the `EventEmitter` 
 *   we built in Phase 8.
 * 
 * 3. MEMORY BEHAVIOR (REFERENCES)
 * -------------------------------
 * - Singleton: Since the instance is never garbage collected (Global reference), 
 *   be careful what you store inside it to avoid memory bloat.
 * - Observer: If you don't "unsubscribe" observers, they stay 
 *   in memory as long as the "Subject" is alive.
 * 
 * 4. VISUAL MENTAL MODEL: THE CONTROL ROOM
 * -----------------------------------------
 * - Singleton: The "Captain" of the ship. There is only one, and 
 *   everyone knows how to find them.
 * - Factory: A "Vending Machine". You press a button (Type), and 
 *   it gives you the right drink (Object) without you knowing 
 *   how it was made.
 * - Observer: A "News Subscription". When a story breaks (Event), 
 *   all subscribers (Observers) get an email (Callback).
 */

// --- ONE BAD EXAMPLE: Global State Mess (Antipattern) ---
let dbInstance = null;
function getDB() {
    // This isn't thread-safe (though JS is single-threaded) 
    // and lacks encapsulation.
    if (!dbInstance) dbInstance = { name: "MessyDB" };
    return dbInstance;
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (Patterns) ---
"use strict";

/**
 * 1. SINGLETON (Safe & Encapsulated)
 */
const DatabaseManager = (function () {
    let instance;

    function createInstance() {
        return { connectionString: "mongodb://localhost:27017" };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
                Object.freeze(instance); // Prevent modification
            }
            return instance;
        }
    };
})();

/**
 * 2. FACTORY (Abstraction)
 */
class User { constructor(role) { this.role = role; } }
class Admin extends User { constructor() { super("admin"); } }
class Customer extends User { constructor() { super("customer"); } }

class UserFactory {
    static create(type) {
        if (type === "admin") return new Admin();
        if (type === "customer") return new Customer();
        throw new Error("Invalid user type");
    }
}

/**
 * 3. OBSERVER (Reactive logic)
 */
class Subject {
    constructor() { this.observers = []; }
    subscribe(fn) { this.observers.push(fn); }
    unsubscribe(fn) { this.observers = this.observers.filter(f => f !== fn); }
    notify(data) { this.observers.forEach(fn => fn(data)); }
}

// SIMULATION
const db1 = DatabaseManager.getInstance();
const db2 = DatabaseManager.getInstance();
console.log("Singleton Identity Match:", db1 === db2); // true

const newsFeed = new Subject();
const reader = (msg) => console.log(`[READER] New story: ${msg}`);
newsFeed.subscribe(reader);
newsFeed.notify("V8 engine gets a major update!");

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: When should you use a Singleton?
 * A1: For services that handle shared state or hardware resources, 
 *     like Database connections, Loggers, or Configuration managers.
 * 
 * Q2: How does the Observer pattern differ from Pub/Sub?
 * A2: In Observer, the subject knows its observers. In Pub/Sub, they 
 *     are completely decoupled via a "Message Broker".
 * 
 * Q3: Why is a Factory better than using 'new' directly?
 * A3: It decouples the object creation from the implementation, 
 *     making it easier to add new types without changing the 
 *     consumer's code (Open/Closed Principle).
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: If a Singleton is implemented as an Object Literal, 
 *     is it truly a Singleton?
 * (Answer: Yes, objects are passed by reference and exist 
 *  only once in memory.)
 * 
 * Q2: What happens if an Observer throws an error during notify()?
 * (Answer: It will stop the notification chain for all subsequent 
 *  observers unless you wrap the call in a try-catch block.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Build a "Logger Factory" that returns either a 
 *              ConsoleLogger or a FileLogger based on the environment.
 * Challenge 2: Implement a "Debounced Observer" where subscribers 
 *              only get notified if no new updates happen within 100ms.
 */
