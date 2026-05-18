# Strategy Pattern

**Definition**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

**Easy Explanation**: Think of a navigation app that can switch between driving, walking, or cycling routes. The app (client) picks the route‑finding strategy it needs.

**JavaScript Example**:
```javascript
class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  execute(a, b) {
    return this.strategy(a, b);
  }
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

const ctx = new Context(add);
console.log(ctx.execute(2, 3)); // 5
ctx.setStrategy(multiply);
console.log(ctx.execute(2, 3)); // 6
```
