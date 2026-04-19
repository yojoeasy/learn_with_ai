// ============================================================
// PHASE 3 — OOP: CLASSES, PROTOTYPES, INHERITANCE
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. INTRODUCTION TO OOP
// ─────────────────────────────────────────────────────────

/*
Object-Oriented Programming (OOP) organizes code into OBJECTS
that bundle related data (properties) and behavior (methods).

4 Pillars of OOP:
1. Encapsulation — bundle data + behavior, hide internal details
2. Inheritance   — child classes extend parent classes
3. Polymorphism  — same method name, different behavior
4. Abstraction   — expose only what's necessary
*/

// ─────────────────────────────────────────────────────────
// 2. PROTOTYPAL INHERITANCE (How JS REALLY works under the hood)
// ─────────────────────────────────────────────────────────

console.log("=== Prototypal Inheritance ===");

// Everything in JS has a prototype chain:
// object → Object.prototype → null

const dog = { name: "Rex", breed: "Labrador" };
// dog doesn't have .toString(), but inherits it from Object.prototype
console.log(dog.toString()); // "[object Object]"

// Prototype chain:
console.log(Object.getPrototypeOf(dog) === Object.prototype); // true

// Setting prototype manually (old way):
const animal = {
    breathe() { return `${this.name} is breathing`; }
};

const cat = Object.create(animal); // cat's prototype IS animal
cat.name = "Whiskers";
cat.meow = function () { return "Meow!"; };

console.log(cat.breathe());   // "Whiskers is breathing" ← inherited from animal
console.log(cat.meow());      // "Meow!"

// ─────────────────────────────────────────────────────────
// 3. CLASSES (ES6+) — Syntactic sugar over prototypes
// ─────────────────────────────────────────────────────────

console.log("\n=== Classes ===");

class Animal {
    // Constructor — called when 'new Animal(...)' is used
    constructor(name, species) {
        this.name = name;    // instance property
        this.species = species;
        this.alive = true;
    }

    // Instance method (on the prototype, shared by all instances)
    breathe() {
        return `${this.name} breathes.`;
    }

    eat(food) {
        return `${this.name} eats ${food}.`;
    }

    toString() {
        return `${this.species}: ${this.name}`;
    }

    // Static method — called on the CLASS, not on instances
    static kingdom() {
        return "Animalia";
    }
}

const lion = new Animal("Simba", "Lion");
console.log(lion.breathe());          // "Simba breathes."
console.log(lion.eat("wildebeest"));  // "Simba eats wildebeest."
console.log(lion.toString());         // "Lion: Simba"
console.log(Animal.kingdom());        // "Animalia"
// lion.kingdom();                    // ❌ TypeError — static = class only

// ─────────────────────────────────────────────────────────
// 4. INHERITANCE with extends
// ─────────────────────────────────────────────────────────

console.log("\n=== Inheritance ===");

class Dog extends Animal {
    constructor(name, breed) {
        super(name, "Dog"); // call parent constructor (MUST be first!)
        this.breed = breed;
    }

    // New method
    bark() {
        return `${this.name} says: Woof!`;
    }

    // Override parent method (Polymorphism)
    toString() {
        return `${super.toString()} (${this.breed})`;
    }
}

class Cat extends Animal {
    constructor(name, indoor = true) {
        super(name, "Cat");
        this.indoor = indoor;
    }

    meow() {
        return `${this.name} says: Meow!`;
    }

    // Override toString differently
    toString() {
        return `${super.toString()} — ${this.indoor ? "Indoor" : "Outdoor"}`;
    }
}

const rex = new Dog("Rex", "German Shepherd");
const whiskers = new Cat("Whiskers");

console.log(rex.breathe());   // "Rex breathes." ← inherited from Animal
console.log(rex.bark());      // "Rex says: Woof!"
console.log(rex.toString());  // "Dog: Rex (German Shepherd)"

console.log(whiskers.meow()); // "Whiskers says: Meow!"
console.log(whiskers.toString()); // "Cat: Whiskers — Indoor"

// instanceof
console.log(rex instanceof Dog);     // true
console.log(rex instanceof Animal);  // true ← inheritance chain
console.log(rex instanceof Cat);     // false

// ─────────────────────────────────────────────────────────
// 5. POLYMORPHISM — same interface, different behavior
// ─────────────────────────────────────────────────────────

console.log("\n=== Polymorphism ===");

// Because different classes implement the SAME method (speak)
class Shape {
    area() {
        throw new Error("area() must be implemented by subclass");
    }
    describe() {
        return `I am a ${this.constructor.name} with area ${this.area().toFixed(2)}`;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }
    area() {
        return 0.5 * this.base * this.height;
    }
}

// Polymorphic behavior — same describe() method, different area()
const shapes = [
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 8)
];

shapes.forEach(shape => console.log(shape.describe()));
// "I am a Circle with area 78.54"
// "I am a Rectangle with area 24.00"
// "I am a Triangle with area 12.00"

// ─────────────────────────────────────────────────────────
// 6. ENCAPSULATION — Private Fields (ES2022+)
// ─────────────────────────────────────────────────────────

console.log("\n=== Encapsulation — Private Fields ===");

class BankAccount {
    #balance;      // # prefix = PRIVATE field (truly inaccessible outside)
    #owner;

    constructor(owner, initialBalance = 0) {
        this.#owner = owner;
        this.#balance = initialBalance;
    }

    // Getters (read-only access to private data)
    get owner() { return this.#owner; }
    get balance() { return this.#balance; }

    // Public methods — controlled access to private state
    deposit(amount) {
        if (amount <= 0) throw new Error("Amount must be positive");
        this.#balance += amount;
        return this; // allows method chaining!
    }

    withdraw(amount) {
        if (amount > this.#balance) throw new Error("Insufficient funds");
        this.#balance -= amount;
        return this;
    }

    toString() {
        return `Account[${this.#owner}]: ₹${this.#balance}`;
    }
}

const account = new BankAccount("Alice", 1000);
account.deposit(500).deposit(200).withdraw(100); // method chaining
console.log(account.toString()); // "Account[Alice]: ₹1600"
console.log(account.balance);    // 1600 (via getter)
// console.log(account.#balance); // ❌ SyntaxError: private field outside class

// ─────────────────────────────────────────────────────────
// 7. GETTERS AND SETTERS
// ─────────────────────────────────────────────────────────

console.log("\n=== Getters and Setters ===");

class Temperature {
    #celsius;

    constructor(celsius) {
        this.#celsius = celsius;
    }

    // Getter
    get fahrenheit() {
        return (this.#celsius * 9 / 5) + 32;
    }

    get celsius() {
        return this.#celsius;
    }

    // Setter with validation
    set celsius(value) {
        if (value < -273.15) throw new Error("Below absolute zero!");
        this.#celsius = value;
    }
}

const temp = new Temperature(100);
console.log(temp.celsius);     // 100
console.log(temp.fahrenheit);  // 212

temp.celsius = 0;
console.log(temp.fahrenheit);  // 32

// ─────────────────────────────────────────────────────────
// 8. SYMBOLS — Unique Identifiers
// ─────────────────────────────────────────────────────────

console.log("\n=== Symbols ===");

// Symbols are ALWAYS unique — even with the same description
const sym1 = Symbol("id");
const sym2 = Symbol("id");
console.log(sym1 === sym2); // false ← always unique!

// Use case: creating unique object keys that won't conflict
const ID = Symbol("id");
const user1 = {
    [ID]: 1,          // Symbol as key — won't be iterated
    name: "Alice",
};

console.log(user1[ID]);  // 1
// Symbol keys don't show up in for...in or Object.keys()
console.log(Object.keys(user1));    // ["name"]
