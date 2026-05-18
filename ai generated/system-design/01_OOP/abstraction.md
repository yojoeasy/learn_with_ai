# Abstraction

## Standard Definition
Abstraction is the concept of hiding complex implementation details and showing only the essential features of an object. It allows developers to work with high‑level ideas without needing to understand the underlying intricacies.

## Easy‑to‑Understand Explanation
Think of a **TV remote**. You press a button to change the channel, but you don’t need to know how the remote sends signals to the TV. The remote provides a simple interface while the complex electronics remain hidden.

## JavaScript Example
```javascript
// Define an abstract class using a regular class with methods meant to be overridden
class Shape {
  // Abstract method (no implementation)
  area() {
    throw new Error('Method "area()" must be implemented');
  }
}

// Concrete subclass that provides the implementation
class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  // Implement the abstract method
  area() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(5, 3);
console.log(rect.area()); // 15
```

In this example, `Shape` defines the *what* (an area method) without the *how*. `Rectangle` abstracts the specific details of calculating the area for a rectangle, adhering to the contract defined by `Shape`.
