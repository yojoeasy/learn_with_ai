// ============================================================
// PHASE 3 — JAVASCRIPT OBJECTS, ARRAYS & ES6+ FEATURES
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. OBJECTS
// ─────────────────────────────────────────────────────────

console.log("=== OBJECTS ===");

// Creating objects
const user = {
    name: "Alice",
    age: 28,
    email: "alice@example.com",
    isActive: true,

    // Method (function inside object)
    greet() {
        return `Hi, I'm ${this.name}`;
    }
};

// Accessing properties
console.log(user.name);         // dot notation
console.log(user["email"]);     // bracket notation (useful for dynamic keys)

// Dynamic key access
const key = "age";
console.log(user[key]);         // 28

// Adding & modifying properties
user.role = "admin";
user.age = 29;

// Deleting a property
delete user.isActive;

console.log(user);

// ─────────────────────────────────────────────────────────
// 2. OBJECT REFERENCES AND COPYING
// ─────────────────────────────────────────────────────────

console.log("\n=== Object References ===");

// Objects are stored by REFERENCE, not value
const a = { score: 10 };
const b = a;  // b points to the SAME object as a

b.score = 99;
console.log(a.score); // 99 ← a was also changed because a and b share the same reference

// Shallow copy — creates a NEW object (but nested objects still shared)
const original = { name: "Alice", address: { city: "Mumbai" } };

const shallowCopy1 = Object.assign({}, original);
const shallowCopy2 = { ...original }; // spread (most common)

shallowCopy2.name = "Bob";           // changes only the copy
shallowCopy2.address.city = "Delhi"; // ← changes BOTH (nested object still shared!)

console.log(original.name);          // "Alice" ✅
console.log(original.address.city);  // "Delhi" ← mutated too!

// Deep copy — completely independent clone
const deepCopy = JSON.parse(JSON.stringify(original)); // simple but has limitations
// Better: use structuredClone (modern JS)
const deepCopy2 = structuredClone(original);
deepCopy2.address.city = "Chennai";
console.log(original.address.city); // "Delhi" — NOT affected ✅

// ─────────────────────────────────────────────────────────
// 3. OBJECT METHODS
// ─────────────────────────────────────────────────────────

console.log("\n=== Object Methods ===");

const product = { id: 1, name: "Laptop", price: 999, category: "Electronics" };

// Object.keys() — array of keys
console.log(Object.keys(product));    // ["id", "name", "price", "category"]

// Object.values() — array of values
console.log(Object.values(product));  // [1, "Laptop", 999, "Electronics"]

// Object.entries() — array of [key, value] pairs
console.log(Object.entries(product));
// [["id",1], ["name","Laptop"], ["price",999], ["category","Electronics"]]

// Iterating over an object:
for (const [key, value] of Object.entries(product)) {
    console.log(`${key}: ${value}`);
}

// Object.freeze() — makes object immutable
const config = Object.freeze({ port: 3000, host: "localhost" });
config.port = 4000; // silently fails (no error in non-strict mode)
console.log(config.port); // 3000

// Object.fromEntries() — converts [key, value] pairs to an object
const entries = [["name", "Alice"], ["age", 28]];
const newObj = Object.fromEntries(entries);
console.log(newObj); // { name: "Alice", age: 28 }

// ─────────────────────────────────────────────────────────
// 4. DESTRUCTURING
// ─────────────────────────────────────────────────────────

console.log("\n=== Destructuring ===");

// Object destructuring
const { name, age, email = "N/A" } = user; // with default value
console.log(name, age, email);

// Rename while destructuring
const { name: userName, role: userRole = "user" } = user;
console.log(userName, userRole); // "Alice", "admin"

// Nested destructuring
const order = {
    id: 101,
    customer: { name: "Bob", city: "Delhi" },
    items: [{ product: "Laptop", qty: 1 }]
};
const { id, customer: { name: customerName, city } } = order;
console.log(id, customerName, city); // 101, "Bob", "Delhi"

// Array destructuring
const colors = ["red", "green", "blue", "yellow"];
const [first, second, , fourth] = colors;  // skip third with ,,
console.log(first, second, fourth); // "red", "green", "yellow"

// Swap variables using destructuring
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q); // 2, 1

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Function parameter destructuring (very common in React!)
function displayUser({ name, age, role = "user" }) {
    console.log(`${name} (${age}) — ${role}`);
}
displayUser({ name: "Charlie", age: 30 }); // "Charlie (30) — user"

// ─────────────────────────────────────────────────────────
// 5. SPREAD OPERATOR
// ─────────────────────────────────────────────────────────

console.log("\n=== Spread Operator ===");

// Spread arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];       // [1, 2, 3, 4, 5, 6]
const withExtra = [0, ...arr1, 4];         // [0, 1, 2, 3, 4]
console.log(combined);
console.log(withExtra);

// Spread objects (merge / override)
const defaults = { color: "blue", size: "M", stock: true };
const overrides = { size: "L", price: 29.99 };
const final = { ...defaults, ...overrides };
console.log(final); // { color: "blue", size: "L", stock: true, price: 29.99 }

// Clone an array / object
const arrCopy = [...arr1];
const objCopy = { ...product };

// ─────────────────────────────────────────────────────────
// 6. TEMPLATE LITERALS
// ─────────────────────────────────────────────────────────

const firstName = "Alice";
const lastName = "Smith";
const age2 = 28;

// Old way (concatenation — messy):
const oldWay = "Hi, " + firstName + " " + lastName + "! You are " + age2 + " years old.";

// Template literal (clean & readable):
const newWay = `Hi, ${firstName} ${lastName}! You are ${age2} years old.`;
console.log(newWay);

// Expression inside template literal
const total2 = 5;
const price2 = 29.99;
console.log(`Total: $${(total2 * price2).toFixed(2)}`); // Total: $149.95

// Multi-line strings
const html = `
  <div class="card">
    <h2>${firstName}'s Profile</h2>
    <p>Age: ${age2}</p>
  </div>
`.trim();
console.log(html);

// ─────────────────────────────────────────────────────────
// 7. ARRAYS — DATA STRUCTURE & METHODS
// ─────────────────────────────────────────────────────────

console.log("\n=== Arrays ===");

const fruits = ["apple", "banana", "cherry", "date", "elderberry"];

// Access
console.log(fruits[0]);            // "apple"
console.log(fruits.at(-1));        // "elderberry" (modern: access from end)
console.log(fruits.length);        // 5

// Add / Remove
const arr = [1, 2, 3];
arr.push(4);        // add to END:   [1, 2, 3, 4]
arr.pop();          // remove END:   [1, 2, 3]
arr.unshift(0);     // add to START: [0, 1, 2, 3]
arr.shift();        // remove START: [1, 2, 3]

// splice(startIndex, deleteCount, ...itemsToInsert)
const items = ["a", "b", "c", "d", "e"];
items.splice(2, 1);          // remove 1 item at index 2: ["a","b","d","e"]
items.splice(2, 0, "x", "y"); // insert at index 2: ["a","b","x","y","d","e"]
console.log(items);

// Find
console.log(fruits.indexOf("cherry"));    // 2
console.log(fruits.includes("mango"));    // false
console.log(fruits.find(f => f.length > 5));      // "banana"
console.log(fruits.findIndex(f => f === "date")); // 3

// Search & Filter
const products = [
    { id: 1, name: "Laptop", price: 999, category: "Electronics" },
    { id: 2, name: "T-Shirt", price: 29, category: "Clothing" },
    { id: 3, name: "Phone", price: 699, category: "Electronics" },
    { id: 4, name: "Shoes", price: 89, category: "Clothing" },
];

const electronics = products.filter(p => p.category === "Electronics");
const expensive = products.filter(p => p.price > 100);
console.log(electronics.map(p => p.name)); // ["Laptop", "Phone"]
console.log(expensive.map(p => p.name));   // ["Laptop", "Phone"]

// Sort — careful: default sort is ALPHABETICAL (strings)
const nums = [10, 1, 21, 3];
nums.sort();                              // [1, 10, 21, 3] ← WRONG (string sort!)
nums.sort((a, b) => a - b);              // [1, 3, 10, 21] ← correct ascending
nums.sort((a, b) => b - a);              // [21, 10, 3, 1] ← descending

// Sort objects:
products.sort((a, b) => a.price - b.price); // sort by price ascending

// flat and flatMap
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]] — 1 level
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6] — 2 levels

const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // ["hello", "world", "foo", "bar"]

// every / some
const allExpensive = products.every(p => p.price > 50); // false
const someExpensive = products.some(p => p.price > 500); // true

// ─────────────────────────────────────────────────────────
// 8. MAPS AND SETS
// ─────────────────────────────────────────────────────────

console.log("\n=== Maps and Sets ===");

// MAP — like an object but keys can be ANY type and it's ordered
const map = new Map();
map.set("name", "Alice");
map.set(42, "the answer");
map.set(true, "boolean key");

console.log(map.get("name")); // "Alice"
console.log(map.get(42));     // "the answer"
console.log(map.size);        // 3
console.log(map.has("name")); // true
map.delete(true);

// Iterating a Map
for (const [key, value] of map) {
    console.log(key, "→", value);
}

// SET — collection of UNIQUE values (no duplicates)
const set = new Set([1, 2, 3, 2, 1, 3, 4]);
console.log(set);         // Set { 1, 2, 3, 4 } — duplicates removed!
console.log(set.size);    // 4

set.add(5);
set.delete(1);
console.log(set.has(2)); // true

// Practical: remove duplicates from array
const withDups = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(withDups)];
console.log(unique); // [1, 2, 3, 4]

// WeakMap and WeakSet (brief)
// - Use OBJECT keys only (not primitives)
// - Keys are held WEAKLY (garbage collected when no other references)
// - No iteration — not enumerable
// - Use case: storing metadata about objects without preventing GC
const weakMap = new WeakMap();
let objRef = { id: 1 };
weakMap.set(objRef, { lastSeen: new Date() });
console.log(weakMap.has(objRef)); // true
// objRef = null; → the WeakMap entry is automatically garbage collected

// ─────────────────────────────────────────────────────────
// 9. ES6 MODULES (import/export)
// ─────────────────────────────────────────────────────────

/*
In a real project with ES Modules:

// math.js — named exports
export const PI = 3.14159;
export function add(a, b)      { return a + b; }
export function subtract(a, b) { return a - b; }

// utils.js — default export (one per file)
export default function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

// main.js — importing
import formatCurrency from "./utils.js";            // default import
import { PI, add, subtract } from "./math.js";      // named imports
import { add as mathAdd } from "./math.js";          // aliased import
import * as MathUtils from "./math.js";              // namespace import

console.log(PI);                        // 3.14159
console.log(add(3, 4));                 // 7
console.log(MathUtils.subtract(10, 4)); // 6
console.log(formatCurrency(1999.99));   // "$1,999.99"
*/

console.log("\nES6 Modules — see notes above (works in real project files)");

// ─────────────────────────────────────────────────────────
// 10. DATES — Working with Dates and Times
// ─────────────────────────────────────────────────────────

console.log("\n=== Dates ===");

// Create dates
const now = new Date();               // current date & time
const specific = new Date("2026-01-15");   // from string
const custom = new Date(2026, 0, 15, 10, 30, 0); // year, monthIndex, day, hr, min, sec
// NOTE: month is 0-indexed! (0 = January, 11 = December)

console.log(now.toISOString());             // "2026-03-03T05:35:00.000Z"
console.log(now.toLocaleDateString("en-IN")); // "3/3/2026" (India format)
console.log(now.toLocaleString("en-IN"));

// Getters
console.log(now.getFullYear());  // 2026
console.log(now.getMonth());     // 2 (March — 0-indexed!)
console.log(now.getDate());      // 3 (day of month)
console.log(now.getDay());       // 0=Sun, 1=Mon, ..., 6=Sat
console.log(now.getHours());
console.log(now.getMinutes());

// Timestamps (milliseconds since Jan 1, 1970)
const timestamp = Date.now();
const fromDate = now.getTime();
console.log(timestamp);

// Date arithmetic
const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
console.log(oneWeekFromNow.toDateString());

// Format with Intl.DateTimeFormat (most powerful)
const formatter = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
});
console.log(formatter.format(now)); // "Tuesday, March 3, 2026"
