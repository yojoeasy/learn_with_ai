/**
 * ==========================================
 * TOPIC 03: ES6 CLASSES & PRIVATE FIELDS
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * ES6 Classes are "Syntactic Sugar" over the prototypal foundation. 
 * They don't change how JavaScript works internally; they just make 
 * the syntax look more like Java/C#/C++.
 * 
 * - Internal Working:
 *   - The `class` keyword is a function declaration. 
 *   - Methods in the class body are added to the `.prototype`.
 *   - Static methods are added directly to the function object itself.
 * 
 * 2. SUPER() AND INHERITANCE
 * --------------------------
 * When a class extends another:
 * - `super()` MUST be called in the constructor before `this` is accessed. 
 * - `super` points to the Parent's prototype.
 * 
 * 3. MODERN FEATURES (ES2022+)
 * ----------------------------
 * - Private Fields (#): Truly private at the engine level. Cannot be 
 *   accessed from outside or even from inheriting classes.
 * - Static Blocks: For complex static initialization.
 * - Public/Private Static Fields.
 * 
 * 4. VISUAL MENTAL MODEL: THE FACTORY BLUEPRINT
 * ---------------------------------------------
 * Think of ES5 Prototypes as a "Hand-drawn Sketch" of a car. 
 * Think of ES6 Classes as a "Professional CAD Blueprint". 
 * The car (the object) built from either one is essentially the same, 
 * but the blueprint is easier to read, share, and manage at scale.
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Memory: Methods defined inside the constructor (using this.fn = ...) 
 *   are recreated for EVERY instance. Methods in the class body are 
 *   shared via the prototype (Efficiency!). 
 * - Class Hoisting: Classes are NOT fully hoisted; they are in the TDZ 
 *   until declared.
 */

// --- ONE BAD EXAMPLE: Methods in Constructor (Inefficient) ---
class BadMemoryManager {
    constructor(data) {
        this.data = data;
        this.save = function () {
            // This is unique to EVERY object - Waste of memory!
            console.log("Saving data...");
        };
    }
}

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE ---
"use strict";

class BaseEntity {
    // 1. Static field - shared across the entire class hierarchy
    static version = "v1.0.4";

    constructor(id) {
        this.id = id;
    }

    // 2. Prototype method - shared across all instances
    logId() {
        console.log(`[Entity] ID: ${this.id}`);
    }
}

class User extends BaseEntity {
    // 3. TRUE PRIVATE FIELD (Engine-level encapsulation)
    #password;

    constructor(id, name, password) {
        super(id); // Initialize base class
        this.name = name;
        this.#password = password;
    }

    // 4. Method Overriding
    logId() {
        // 5. Accessing parent functionality via super
        super.logId();
        console.log(`[User] Name: ${this.name}`);
    }

    // 6. Getter/Setter (Computed properties)
    get secureId() {
        return `U-${this.id}-${this.#password.length}`;
    }
}

const admin = new User(55, "Antigravity", "S3cr3t!");
admin.logId();
console.log(admin.secureId); // Accessing getter
// console.log(admin.#password); // SyntaxError: Private field must be accessed inside class.

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: Are classes in JS just syntactic sugar?
 * A1: Mostly, yes. However, they introduce specific behaviors like 
 *     enforced 'strict mode' and the requirement of 'new' to be called. 
 *     You cannot call a class like a normal function.
 * 
 * Q2: What is the difference between a static method and a prototype method?
 * A2: Static methods are called on the class itself (Utility logic). 
 *     Prototype methods are called on instances (Object state logic).
 * 
 * Q3: Why do we need super() in the child constructor?
 * A3: Because the child object's 'this' is not initialized until the 
 *     parent constructor is executed.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     class A {}
 *     console.log(typeof A);
 * (Answer: "function". Under the hood, classes are functions.)
 * 
 * Q2: What happens if you define a method as an Arrow Function in a class?
 * (Answer: It is assigned in the CONSTRUCTOR (this.fn = ...), not on 
 *  the prototype. Beneficial for autobinding, but higher memory cost.)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Implement a "Singleton" pattern using a private static field.
 * Challenge 2: Build a basic "Validation" mixin that can be applied to any class.
 */
