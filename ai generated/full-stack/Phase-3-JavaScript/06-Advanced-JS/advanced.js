// ============================================================
// PHASE 3 — ADVANCED JAVASCRIPT
// this keyword, call/apply/bind, Closures & Lexical Scoping
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. THE 'this' KEYWORD
// ─────────────────────────────────────────────────────────

/*
'this' refers to the EXECUTION CONTEXT — the object that a function
belongs to at the time it's called. Its value changes based on HOW
the function is called, not where it's defined.

4 rules for determining 'this':
1. Global context     → 'this' is 'window' (browser) or 'global' (Node.js)
2. Object method      → 'this' is the object before the dot
3. Explicit binding   → call()/apply()/bind() explicitly set 'this'
4. Arrow function     → 'this' is inherited from the surrounding scope (lexical)
*/

console.log("=== 'this' Keyword ===");

// Rule 1: Global context
function showGlobal() {
    // In non-strict mode: this = global object
    // In strict mode: this = undefined
    console.log(this);
}

// Rule 2: Object method
const user = {
    name: "Alice",
    greet() {
        console.log(`Hello, I'm ${this.name}`); // 'this' = user object
    },
    // Arrow function does NOT bind its own 'this'
    greetArrow: () => {
        // 'this' here is the surrounding scope (global/module) NOT user
        console.log(`Arrow 'this'.name: ${this?.name}`); // undefined!
    }
};

user.greet();        // "Hello, I'm Alice" ✅
user.greetArrow();   // "Arrow 'this'.name: undefined" ← arrow functions are wrong here!

// 'this' is determined by HOW you call, not where defined:
const detached = user.greet; // copy reference
// detached();               // 'this' is undefined/global — NO user context!

// ─────────────────────────────────────────────────────────
// 2. call(), apply(), bind() — EXPLICIT BINDING
// ─────────────────────────────────────────────────────────

console.log("\n=== call, apply, bind ===");

function introduce(greeting, punctuation) {
    return `${greeting}, I'm ${this.name} (${this.role})${punctuation}`;
}

const alice = { name: "Alice", role: "Developer" };
const bob = { name: "Bob", role: "Designer" };

// call — invoke immediately, pass 'this' + args individually
console.log(introduce.call(alice, "Hello", "!"));  // "Hello, I'm Alice (Developer)!"
console.log(introduce.call(bob, "Hi", ".")); // "Hi, I'm Bob (Designer)."

// apply — invoke immediately, pass args as an ARRAY
console.log(introduce.apply(alice, ["Hey", "?"])); // "Hey, I'm Alice (Developer)?"

// bind — returns a NEW function with 'this' permanently bound (doesn't invoke)
const aliceIntro = introduce.bind(alice, "Welcome", "!");
console.log(aliceIntro()); // "Welcome, I'm Alice (Developer)!"
// Can be called anywhere, always has alice as 'this'

// Practical use case for bind: fixing 'this' in callbacks
class Timer {
    constructor(name) {
        this.name = name;
        this.seconds = 0;
    }

    start() {
        // ❌ Without bind: 'this' in setInterval callback would be 'window'/undefined
        // setInterval(function() { this.seconds++; }); // 'this' is wrong!

        // ✅ With arrow function (inherits 'this' from start()):
        this.intervalId = setInterval(() => {
            this.seconds++;
            if (this.seconds <= 3) {
                console.log(`${this.name}: ${this.seconds}s`);
            } else {
                clearInterval(this.intervalId);
            }
        }, 200);
    }
}

const timer = new Timer("Countdown");
timer.start();

// ─────────────────────────────────────────────────────────
// 3. 'this' in Classes
// ─────────────────────────────────────────────────────────

console.log("\n=== 'this' in Classes ===");

class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return this;
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
        return this;
    }
}

class UserService extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }

    createUser(data) {
        const user = { id: Date.now(), ...data, createdAt: new Date() };
        this.users.push(user);
        this.emit("user:created", user); // 'this' correctly refers to UserService instance
        return user;
    }
}

const service = new UserService();
service.on("user:created", (user) => {
    console.log(`Event: New user created — ${user.name}`);
});

service.createUser({ name: "Charlie", email: "charlie@example.com" });

// ─────────────────────────────────────────────────────────
// 4. CLOSURES — Advanced Pattern & Memory
// ─────────────────────────────────────────────────────────

console.log("\n=== Advanced Closures ===");

// MEMOIZATION — cache expensive function results using closures
function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`  Cache hit for ${key}`);
            return cache.get(key);
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        console.log(`  Computed for ${key}`);
        return result;
    };
}

function slowSquare(n) {
    // Simulate expensive computation
    return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(5));  // Computed → 25
console.log(fastSquare(5));  // Cache hit → 25
console.log(fastSquare(6));  // Computed → 36

// ONCE — a function that can only be called once
function once(fn) {
    let called = false;
    let result;

    return function (...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

const initializeApp = once(() => {
    console.log("App initialized!");
    return { version: "1.0.0" };
});

console.log(initializeApp()); // "App initialized!" → { version: "1.0.0" }
console.log(initializeApp()); // (nothing printed) → { version: "1.0.0" }
console.log(initializeApp()); // (nothing printed) → { version: "1.0.0" }

// PARTIAL APPLICATION — pre-fill some arguments
function partial(fn, ...presetArgs) {
    return function (...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

function sendRequest(method, baseUrl, endpoint) {
    return `${method} ${baseUrl}${endpoint}`;
}

const apiRequest = partial(sendRequest, "GET", "https://api.example.com");
console.log(apiRequest("/users"));    // "GET https://api.example.com/users"
console.log(apiRequest("/products")); // "GET https://api.example.com/products"

// ─────────────────────────────────────────────────────────
// 5. LEXICAL SCOPING vs DYNAMIC SCOPING
// ─────────────────────────────────────────────────────────

console.log("\n=== Lexical Scoping ===");

/*
JavaScript uses LEXICAL (static) scoping:
- A function's scope is determined WHERE IT IS DEFINED in the code,
  NOT where it is called.

This is the foundation of closures.
*/

const x = "global";

function outer() {
    const x = "outer";

    function inner() {
        // 'x' here = "outer" (where inner is DEFINED, not called)
        console.log(x); // "outer"
    }

    return inner;
}

const fn = outer(); // outer() called, returns inner
fn();               // inner() called — but still uses "outer" scope!
// ← lexical scoping: scope set at definition time

// ─────────────────────────────────────────────────────────
// 6. call() USED FOR PROTOTYPE METHOD BORROWING
// ─────────────────────────────────────────────────────────

console.log("\n=== Method Borrowing ===");

// Borrow methods from other objects/prototypes
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

// arrayLike is not a real Array, so .join() doesn't exist on it
// But we can BORROW Array.prototype.join using call!
const joined = Array.prototype.join.call(arrayLike, " - ");
console.log(joined); // "a - b - c"

const actualArray = Array.prototype.slice.call(arrayLike);
console.log(actualArray); // ["a", "b", "c"] — converted to real array

// Modern way: use Array.from
const modern = Array.from(arrayLike);
console.log(modern); // ["a", "b", "c"]
