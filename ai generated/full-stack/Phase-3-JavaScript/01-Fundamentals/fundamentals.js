// ============================================================
// PHASE 3 — JAVASCRIPT FUNDAMENTALS
// Variables, Data Types, Operators, Conditionals, Loops
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. VARIABLES
// ─────────────────────────────────────────────────────────

// var — OLD, avoid (function-scoped, hoisted, can be re-declared)
var oldVar = "don't use this";

// let — block-scoped, can be reassigned
let age = 25;
age = 26;              // ✅ OK to reassign

// const — block-scoped, CANNOT be reassigned
const name = "Alice";
// name = "Bob";       // ❌ TypeError

// const with objects/arrays: the REFERENCE is constant, not the content
const person = { name: "Alice" };
person.name = "Bob";   // ✅ allowed — changing the object, not the binding
// person = {};       // ❌ not allowed — changing the binding

console.log("--- Variables ---");
console.log(age, name, person.name);

// ─────────────────────────────────────────────────────────
// 2. DATA TYPES
// ─────────────────────────────────────────────────────────

// PRIMITIVE TYPES (immutable, passed by VALUE)
const str = "Hello World";       // String
const num = 42;                  // Number (integers + floats)
const float = 3.14;               // Number (same type!)
const bool = true;               // Boolean
const nothing = null;               // Null (intentional absence of value)
const undef = undefined;          // Undefined (variable declared, not assigned)
const bigInt = 9007199254740991n;  // BigInt (very large numbers)
const sym = Symbol("unique");   // Symbol (unique identifier)

// REFERENCE TYPES (mutable, passed by REFERENCE)
const arr = [1, 2, 3];             // Array
const obj = { key: "value" };      // Object
const fn = function () { };          // Function

console.log("\n--- Data Types ---");
console.log(typeof str);     // "string"
console.log(typeof num);     // "number"
console.log(typeof bool);    // "boolean"
console.log(typeof nothing); // "object" ← known JS quirk (null is an object)
console.log(typeof undef);   // "undefined"
console.log(typeof arr);     // "object"
console.log(typeof fn);      // "function"
console.log(Array.isArray(arr)); // true ← correct way to check for arrays

// ─────────────────────────────────────────────────────────
// 3. TYPE CONVERSION
// ─────────────────────────────────────────────────────────

// Explicit conversions:
console.log("\n--- Type Conversion ---");
console.log(Number("42"));       // 42
console.log(Number(""));         // 0
console.log(Number("abc"));      // NaN (Not a Number)
console.log(Number(true));       // 1
console.log(Number(false));      // 0
console.log(Number(null));       // 0
console.log(Number(undefined));  // NaN

console.log(String(42));         // "42"
console.log(String(true));       // "true"
console.log(String(null));       // "null"

console.log(Boolean(0));           // false
console.log(Boolean(""));          // false
console.log(Boolean(null));        // false
console.log(Boolean(undefined));   // false
console.log(Boolean(NaN));         // false
console.log(Boolean("hello"));     // true
console.log(Boolean(42));          // true
console.log(Boolean({}));          // true (empty object is TRUTHY!)
console.log(Boolean([]));          // true (empty array is TRUTHY!)

// parseInt and parseFloat
console.log(parseInt("42px"));   // 42 (stops at non-numeric)
console.log(parseFloat("3.14cm")); // 3.14

// ─────────────────────────────────────────────────────────
// 4. OPERATORS
// ─────────────────────────────────────────────────────────

console.log("\n--- Operators ---");

// Arithmetic
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333...
console.log(10 % 3);   // 1   (remainder)
console.log(2 ** 8);   // 256 (exponentiation)

// Increment / Decrement
let x = 5;
console.log(x++);  // 5 (post-increment: returns THEN increments)
console.log(x);    // 6
console.log(++x);  // 7 (pre-increment: increments THEN returns)

// Assignment operators
let n = 10;
n += 5;   // n = n + 5 = 15
n -= 3;   // n = n - 3 = 12
n *= 2;   // n = n * 2 = 24
n /= 4;   // n = n / 4 = 6
n **= 2;  // n = n ** 2 = 36
console.log(n); // 36

// Comparison operators
console.log(5 == "5");   // true  (loose equality — converts types)
console.log(5 === "5");  // false (strict equality — no conversion) ← ALWAYS USE THIS
console.log(5 != "6");   // true  (loose)
console.log(5 !== "5");  // true  (strict)
console.log(5 > 3);      // true
console.log(5 >= 5);     // true
console.log(3 < 5);      // true

// Logical operators
console.log(true && false);  // false (AND)
console.log(true || false);  // true  (OR)
console.log(!true);          // false (NOT)

// Short-circuit evaluation
const user = null;
const displayName = user || "Guest";  // "Guest" if user is falsy
console.log(displayName);             // "Guest"

const loggedIn = true;
const greeting = loggedIn && "Welcome back!";  // string if loggedIn is truthy
console.log(greeting);                          // "Welcome back!"

// Nullish coalescing (??) — only checks null/undefined (NOT 0 or "")
const score = 0;
console.log(score || "No score");   // "No score" (0 is falsy!) ← might be wrong
console.log(score ?? "No score");   // 0 (0 is NOT null/undefined) ← correct!

// Optional chaining (?.)
const user2 = { profile: { name: "Alice" } };
const nullUser = null;
console.log(user2?.profile?.name);    // "Alice"
console.log(nullUser?.profile?.name); // undefined (no error!)
// Without ?.: nullUser.profile.name → TypeError: Cannot read property of null

// ─────────────────────────────────────────────────────────
// 5. CONDITIONALS
// ─────────────────────────────────────────────────────────

console.log("\n--- Conditionals ---");

const score2 = 75;

// if-else if-else
if (score2 >= 90) {
    console.log("A grade");
} else if (score2 >= 75) {
    console.log("B grade");
} else if (score2 >= 60) {
    console.log("C grade");
} else {
    console.log("F grade");
}
// Output: B grade

// Ternary operator (condition ? ifTrue : ifFalse)
const isAdult = age >= 18 ? "Adult" : "Minor";
console.log(isAdult); // "Adult"

// Nested ternary (use sparingly — hurts readability)
const grade = score2 >= 90 ? "A" : score2 >= 75 ? "B" : score2 >= 60 ? "C" : "F";
console.log(grade); // "B"

// Switch statement (best for many exact value comparisons)
const day = "Monday";
switch (day) {
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    case "Monday":
        console.log("Start of the week.");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    default:
        console.log("Weekday");
}
// Output: Start of the week.

// ─────────────────────────────────────────────────────────
// 6. LOOPS
// ─────────────────────────────────────────────────────────

console.log("\n--- Loops ---");

// while loop (check condition BEFORE each iteration)
let i = 0;
while (i < 5) {
    process.stdout.write(i + " "); // 0 1 2 3 4
    i++;
}
console.log();

// do-while (check condition AFTER — runs at least once)
let j = 10;
do {
    console.log("Runs once even though 10 >= 5:", j);
    j++;
} while (j < 5);

// for loop (best when you know the number of iterations)
for (let k = 0; k < 5; k++) {
    process.stdout.write(k + " "); // 0 1 2 3 4
}
console.log();

// for...of (iterate over iterables: arrays, strings, sets)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
    process.stdout.write(fruit + " ");
}
console.log();

// for...in (iterate over object KEYS — not recommended for arrays)
const car = { make: "Toyota", model: "Camry", year: 2024 };
for (const key in car) {
    console.log(`${key}: ${car[key]}`);
}

// Loop control
for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // skip 3
    if (i === 7) break;    // stop at 7
    process.stdout.write(i + " "); // 0 1 2 4 5 6
}
console.log();

// ─────────────────────────────────────────────────────────
// 7. TRUTHY AND FALSY VALUES — MUST KNOW
// ─────────────────────────────────────────────────────────

console.log("\n--- Truthy & Falsy ---");

// FALSY values (only 6!):
// false, 0, "" (empty string), null, undefined, NaN

// TRUTHY: everything else, including:
// "0" (non-empty string), [] (empty array), {} (empty object), -1

const falsyValues = [false, 0, "", null, undefined, NaN];
falsyValues.forEach(v => {
    console.log(`${String(v)} is ${Boolean(v) ? "truthy" : "falsy"}`);
});

// Practical usage
function greet(name) {
    if (!name) {  // if name is empty, null, undefined etc.
        return "Hello, Guest!";
    }
    return `Hello, ${name}!`;
}
console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet(""));      // "Hello, Guest!"
console.log(greet());        // "Hello, Guest!"
