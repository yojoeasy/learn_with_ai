// ============================================================
// PHASE 3 — FUNCTIONS, SCOPE, CLOSURES & HOISTING
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. TYPES OF FUNCTIONS
// ─────────────────────────────────────────────────────────

// --- 1.1 Function Declaration ---
// Hoisted — can be called BEFORE its declaration in the code
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet("Alice")); // "Hello, Alice!"

// --- 1.2 Function Expression ---
// NOT hoisted — assigned to a variable, treated like a value
const greetExpr = function (name) {
    return `Hi, ${name}!`;
};
console.log(greetExpr("Bob")); // "Hi, Bob!"

// --- 1.3 Arrow Function ---
// Shorter syntax, and does NOT have its own `this`
const greetArrow = (name) => `Hey, ${name}!`;
console.log(greetArrow("Charlie")); // "Hey, Charlie!"

// Arrow shorthand rules:
const double = x => x * 2;            // one param: no ()
const add = (a, b) => a + b;       // multiple params: needs ()
const getObj = (name) => ({ name });   // returning object: wrap in ()

console.log(double(5));      // 10
console.log(add(3, 4));      // 7
console.log(getObj("Alice")); // { name: "Alice" }

// ─────────────────────────────────────────────────────────
// 2. PARAMETERS AND ARGUMENTS
// ─────────────────────────────────────────────────────────

// Default parameters
function createUser(name, role = "user", active = true) {
    return { name, role, active };
}
console.log(createUser("Alice"));               // { name: "Alice", role: "user", active: true }
console.log(createUser("Bob", "admin"));         // { name: "Bob", role: "admin", active: true }
console.log(createUser("Dev", "user", false));   // { name: "Dev", role: "user", active: false }

// Rest parameters (...args) — collects remaining args into an array
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3));           // 6
console.log(sum(10, 20, 30, 40));    // 100

// Spread in function calls
function multiply(a, b, c) {
    return a * b * c;
}
const nums = [2, 3, 4];
console.log(multiply(...nums)); // 24 (spread array as individual args)

// ─────────────────────────────────────────────────────────
// 3. HOISTING
// ─────────────────────────────────────────────────────────

console.log("\n--- Hoisting ---");

// Function declarations are hoisted FULLY (work before definition):
console.log(sayHi("Dave")); // "Hi, Dave!" ← Works!
function sayHi(name) {
    return `Hi, ${name}!`;
}

// var is hoisted but NOT initialized:
console.log(hoistedVar);   // undefined (NOT an error, but not the value)
var hoistedVar = "hello";
console.log(hoistedVar);   // "hello"

// let and const are in the "Temporal Dead Zone" (TDZ) before their line:
// console.log(blockVar);  // ❌ ReferenceError: Cannot access before initialization
let blockVar = "world";

// ─────────────────────────────────────────────────────────
// 4. SCOPE
// ─────────────────────────────────────────────────────────

console.log("\n--- Scope ---");

// Global scope: accessible anywhere
const globalVar = "I am global";

function outerFunction() {
    // Function / local scope: only inside this function
    const outerVar = "I am outer";

    function innerFunction() {
        // Block scope: only inside this block
        const innerVar = "I am inner";

        // This inner function can access ALL outer scopes (scope chain)
        console.log(globalVar);  // ✅ accessible
        console.log(outerVar);   // ✅ accessible
        console.log(innerVar);   // ✅ accessible
    }

    innerFunction();
    // console.log(innerVar); // ❌ ReferenceError — not accessible here
}

outerFunction();

// Block scope with let/const:
{
    let blockScoped = "only here";
    console.log(blockScoped); // ✅
}
// console.log(blockScoped); // ❌ ReferenceError

// var ignores block scope (another reason to avoid var):
{
    var functionScoped = "escapes the block!";
}
console.log(functionScoped); // ✅ accessible (BAD behavior)

// ─────────────────────────────────────────────────────────
// 5. CLOSURES
// ─────────────────────────────────────────────────────────

console.log("\n--- Closures ---");

/*
A CLOSURE is a function that "remembers" the variables from its
outer (enclosing) scope even after that outer function has finished executing.

The inner function maintains a reference to its outer scope.
*/

// Basic closure:
function makeCounter() {
    let count = 0;  // This variable is "closed over" by the returned function

    return function () {
        count++;
        return count;
    };
}

const counter1 = makeCounter();
const counter2 = makeCounter(); // Independent counter

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3
console.log(counter2()); // 1  ← separate closure, separate count

// Practical closure: private data (like a class, but with functions)
function createBankAccount(initialBalance) {
    let balance = initialBalance; // PRIVATE — cannot be accessed directly

    return {
        deposit(amount) {
            balance += amount;
            console.log(`Deposited ₹${amount}. Balance: ₹${balance}`);
        },
        withdraw(amount) {
            if (amount > balance) {
                console.log("Insufficient funds!");
                return;
            }
            balance -= amount;
            console.log(`Withdrew ₹${amount}. Balance: ₹${balance}`);
        },
        getBalance() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);
account.deposit(500);       // Deposited ₹500. Balance: ₹1500
account.withdraw(200);      // Withdrew ₹200. Balance: ₹1300
console.log(account.getBalance()); // 1300
// account.balance            // undefined — balance is PRIVATE (closure!)

// Closure with event-like pattern (factory function):
function makeMultiplier(factor) {
    return (number) => number * factor; // factor is closed over
}
const double2 = makeMultiplier(2);
const triple = makeMultiplier(3);
const tenTimes = makeMultiplier(10);

console.log(double2(5));   // 10
console.log(triple(5));   // 15
console.log(tenTimes(5)); // 50

// ─────────────────────────────────────────────────────────
// 6. FUNCTIONAL PROGRAMMING PARADIGM
// ─────────────────────────────────────────────────────────

console.log("\n--- Functional Programming ---");

/*
Functional programming (FP) is a paradigm where:
1. Functions are PURE — same input always gives same output, no side effects
2. Data is IMMUTABLE — don't mutate, create new versions
3. Functions are FIRST-CLASS — can be passed around as values
4. Composition — build complex logic from small functions
*/

// 1. Pure function
function pureAdd(a, b) {
    return a + b; // No side effects, predictable output
}

// 2. First-class functions — pass as argument, return as value
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map — transform each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter — keep elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Reduce — accumulate to a single value
const total = numbers.reduce((acc, n) => acc + n, 0);
console.log(total); // 55

// 3. Chaining (composition)
const result = numbers
    .filter(n => n % 2 === 0)   // keep evens: [2, 4, 6, 8, 10]
    .map(n => n * n)             // square them: [4, 16, 36, 64, 100]
    .reduce((acc, n) => acc + n, 0); // sum: 220
console.log(result); // 220

// 4. Immutability — don't mutate, return new data
const original = [1, 2, 3];

// ❌ Mutating (bad):
// original.push(4); // mutates original

// ✅ Immutable (create new):
const withFour = [...original, 4];   // [1, 2, 3, 4]
const withoutFirst = original.slice(1); // [2, 3]
console.log(original);    // [1, 2, 3] — unchanged!
console.log(withFour);    // [1, 2, 3, 4]
console.log(withoutFirst);// [2, 3]
