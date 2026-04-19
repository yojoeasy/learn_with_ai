/**
 * ==========================================
 * TOPIC 02: PROTOTYPE CHAIN & ES5 INHERITANCE
 * ==========================================
 * MASTERING JAVASCRIPT Series
 * Senior-level Deep Dive
 * 
 * 1. THE DEEP DIVE: UNDER THE HOOD
 * --------------------------------
 * In JavaScript, inheritance is Prototypal, not Class-based. 
 * Every object has a hidden property called [[Prototype]] (accessed via 
 * `__proto__`) that points to its "Parent" object.
 * 
 * - Prototype Chain: When you access a property, the engine:
 *   1. Looks at the object itself.
 *   2. If not found, looks at its `__proto__`.
 *   3. If not found, repeats until it reaches `Object.prototype` (the 
 *      "Root" of all objects) which has a `null` prototype.
 * 
 * 2. PROTOTYPE VS __PROTO__
 * -------------------------
 * - `prototype`: ONLY exists on functions. It is the "Blueprint" for 
 *   objects created WITH that function (using 'new').
 * - `__proto__`: Exists on ALL objects. It is the "Active Reference" to 
 *   the parent object in the chain.
 * 
 * 3. INTERNAL WORKING (CONSTRUCTOR FUNCTIONS)
 * -------------------------------------------
 * When you call `new User()`, the engine:
 * 1. Creates a new empty object `{}`.
 * 2. Sets that object's `__proto__` to `User.prototype`.
 * 3. Executes the `User` function with `this` pointing to the new object.
 * 4. Returns the object.
 * 
 * 4. VISUAL MENTAL MODEL: THE FAMILY TREE
 * ---------------------------------------
 * Think of it like a family tree, but reversed. 
 * - If you want to use a "Tool" (a method), you check your own toolbox. 
 * - If you don't have it, you check your Father's toolbox (`__proto__`). 
 * - If he doesn't have it, you check your Grandfather's toolbox. 
 * - You can keep climbing up the "Ancestry" until you reach the "Common 
 *   Ancestor" (Object.prototype).
 * 
 * 5. PITFALLS & PERFORMANCE
 * -------------------------
 * - Performance: Climbing a long prototype chain for a property that 
 *   doesn't exist is expensive.
 * - Prototype Pollution: Modifying `Object.prototype` affects EVERY 
 *   object in the application (A major security/stability risk!).
 */

// --- ONE BAD EXAMPLE: Modifying native Prototypes ---
// DO NOT DO THIS in production!
Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0);
};
// [1, 2].sum(); // Works, but might break other libraries or future JS features.

// --- OPTIMIZED / SENIOR-LEVEL EXAMPLE (ES5 Style) ---
"use strict";

// 1. Parent Constructor
function Animal(name) {
    this.name = name;
}

// 2. Methods should stay on the prototype (Memory Efficiency!)
Animal.prototype.eat = function () {
    console.log(`${this.name} is eating...`);
};

// 3. Child Constructor
function Dog(name, breed) {
    // 4. Call Parent Constructor (Method Borrowing)
    Animal.call(this, name);
    this.breed = breed;
}

// 5. Link the Prototypes (Core Inheritance Logic)
Dog.prototype = Object.create(Animal.prototype);

// 6. Fix the Constructor Pointer (Very important for reflection)
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
    console.log("Woof!");
};

const myDog = new Dog("Buddy", "Goldie");
myDog.eat(); // Inherited from Animal.prototype
myDog.bark(); // Own method from Dog.prototype

/**
 * 6. INTERVIEW QUESTIONS (Q&A)
 * ----------------------------
 * Q1: What is 'prototype'?
 * A1: It's an object property on functions that specifies the `__proto__` 
 *     of objects created by that function. It is the "source" of inherited 
 *     members.
 * 
 * Q2: Where do built-in methods like .map() live?
 * A2: On `Array.prototype`. Every array instance's `__proto__` points 
 *     to `Array.prototype`.
 * 
 * Q3: How do you check if a property is "own" or "inherited"?
 * A3: Use `Object.hasOwn(obj, "prop")` or `obj.hasOwnProperty("prop")`.
 * 
 * 7. TRICKY OUTPUT-BASED QUESTIONS
 * --------------------------------
 * Q1: What is the output?
 *     function F() {}
 *     F.prototype.a = 1;
 *     const f = new F();
 *     F.prototype = { b: 2 };
 *     console.log(f.a, f.b);
 * (Answer: 1, undefined. 'f' points to the old prototype object. 
 *  Existing instances don't update if you REASSIGN the prototype.)
 * 
 * Q2: What is the output?
 *     console.log({}.__proto__ === Object.prototype);
 * (Answer: true. {} is a literal shortcut for new Object().)
 * 
 * 8. REAL-WORLD MINI CHALLENGES
 * -----------------------------
 * Challenge 1: Log the entire prototype chain of a given object until you reach null.
 * Challenge 2: Efficiently "borrow" a string method and use it on an array.
 */
