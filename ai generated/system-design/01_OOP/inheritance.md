# Inheritance

## Standard Definition
Inheritance is a mechanism in object‑oriented programming that allows a new class (subclass or derived class) to acquire the properties and behaviors (methods) of an existing class (superclass or base class). The subclass can reuse, extend, or modify the inherited functionality.

## Easy‑to‑Understand Explanation
Think of a **child** inheriting traits from its **parents** – the child gets the eye colour, hair colour, etc., but can also have its own unique characteristics. In code, a child class gets all the methods and fields of its parent class and can add or change some of them.

## JavaScript Example
```javascript
// Base class
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

// Derived class – inherits from Animal
class Dog extends Animal {
  // Override the speak method
  speak() {
    console.log(`${this.name} barks`);
  }
}

const generic = new Animal('Generic');
generic.speak(); // Generic makes a sound

const dog = new Dog('Rex');
dog.speak(); // Rex barks
```

`Dog` inherits the `name` property and the `speak` method from `Animal`. It overrides `speak` to provide a more specific behavior, demonstrating how inheritance promotes code reuse and specialization.
