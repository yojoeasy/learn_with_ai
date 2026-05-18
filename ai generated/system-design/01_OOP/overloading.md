# Overloading

## Standard Definition
Overloading is a feature (commonly found in statically‑typed languages) that allows multiple functions or methods with the **same name** but **different parameter lists** (different number or types of parameters). The appropriate version is selected at compile‑time (or, in dynamic languages, at runtime) based on the arguments supplied.

## Easy‑to‑Understand Explanation
Think of a **Swiss‑army knife** again, but this time consider the same tool (e.g., a screwdriver) that can have different sized heads. You still pull out the “screwdriver”, but you choose the size that fits the screw you have. In code, you call the same method name, and the language decides which implementation matches the arguments you provide.

## JavaScript Example (Simulated Overloading)
JavaScript does **not** have built‑in method overloading, but we can achieve the same effect by inspecting the arguments inside a single function.

```javascript
/**
 * Simulated overloaded function `greet`.
 * - If called with no arguments → generic greeting.
 * - If called with a string → personalized greeting.
 * - If called with a string and a number → greeting with age.
 */
function greet(name, age) {
  if (typeof name === 'undefined') {
    return 'Hello!'; // no arguments
  }
  if (typeof age === 'undefined') {
    return `Hello, ${name}!`; // one argument
  }
  return `Hello, ${name}! You are ${age} years old.`; // two arguments
}

console.log(greet());                 // "Hello!"
console.log(greet('Alice'));          // "Hello, Alice!"
console.log(greet('Bob', 30));        // "Hello, Bob! You are 30 years old."
```

In this example we **simulate** overloading by checking how many (and which) arguments were passed. The function name stays the same, but its behavior changes based on the parameter list, mirroring the idea of true overloads in languages like Java or C++.

---
**Key Takeaway**
- **Overriding** customizes inherited behavior for a specific subclass.
- **Overloading** provides multiple ways to call the same method name, distinguished by parameter signatures. In JavaScript you emulate it with argument inspection.
