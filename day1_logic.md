# 📘 Day 1: Logic & Foundations

## 🧪 Problem 1: Manual String Reversal
**Goal**: Reverse a string like `"HELLO"` without using the `.reverse()` method.

### 🧠 Logic:
1.  Initialize an empty string `reversed = ""`.
2.  Start a loop from the last character index (`string.length - 1`).
3.  Go backwards until index `0`.
4.  In each iteration, append the character at the current index to the `reversed` string.
5.  Return the `reversed` string.

### 💻 Code Solution:
```javascript
const input = "HELLO";
let reversed = "";

for (let i = input.length - 1; i >= 0; i--) {
  reversed += input[i];
}

console.log(reversed); // "OLLEH"
```

---

## 🚀 Problem 2: Second Largest Number (Optimized)
**Goal**: Find the second largest number in an array `[10, 5, 20, 8, 20, 15]` in a single pass ($O(n)$ time) without sorting.

### 🧠 Logic:
1.  Initialize `firstLargest = -Infinity` and `secondLargest = -Infinity`.
2.  Loop through every `number` in the array once.
3.  **Case 1**: If the current `number` is larger than `firstLargest`:
    -   The old `firstLargest` becomes the `secondLargest`.
    -   The current `number` becomes the new `firstLargest`.
4.  **Case 2**: If the current `number` is smaller than `firstLargest` BUT larger than `secondLargest`:
    -   The current `number` becomes the new `secondLargest`.
5.  Ignore numbers that are exactly equal to the `firstLargest` (unless you want to handle duplicates as distinct largests).

### 💻 Code Solution:
```javascript
const nums = [10, 5, 20, 8, 20, 15];
let first = -Infinity;
let second = -Infinity;

for (let num of nums) {
    if (num > first) {
        second = first;
        first = num;
    } else if (num > second && num !== first) {
        second = num;
    }
}

console.log("Second Largest:", second); // 15
```

---

## 🏛️ Concept: Hoisting & Scope
**Goal**: Understand why `var` and `let` behave differently in memory.

### 🧠 Explanation:
1.  **Hoisting**: In the "Creation Phase" of the Execution Context, JavaScript scans for variable and function declarations.
2.  **`var`**: It is hoisted and assigned the initial value of `undefined`. You can access it before it's "declared" (but it will be `undefined`).
3.  **`let` / `const`**: They are hoisted but entering the **Temporal Dead Zone (TDZ)**. They are "uninitialized" in memory. Accessing them before their declaration results in a `ReferenceError`.
4.  **Scope**:
    -   `var` is **Function-scoped**. It doesn't care about `{ }` blocks (like `if` or `for`).
    -   `let` / `const` are **Block-scoped**. They only live inside the `{ }` where they are defined.

### 💻 Examples:
```javascript
// Hoisting
console.log(a); // undefined
var a = 10;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;

// Scope
if (true) {
    var x = "Globalish";
    let y = "Hidden";
}
console.log(x); // "Globalish" - It escaped the block!
// console.log(y); // ReferenceError: y is not defined
```

---

## 🎯 NEXT STEPS
1.  Review this file until you can explain the **Second Largest** logic without looking.
2.  Answer the **Reflection Question** in the chat.
3.  Start the **Bounded Counter** in `c:\learning\projects\day1_counter/`.
