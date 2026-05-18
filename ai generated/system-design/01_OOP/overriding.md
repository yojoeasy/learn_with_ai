# Overriding

## Standard Definition
Overriding is a feature of inheritance where a subclass provides its own implementation of a method that is already defined in its superclass. The subclass method **replaces** the superclass method when called on an instance of the subclass. This allows specialized behavior while preserving the same method signature.

## Easy‑to‑Understand Explanation
Think of a **recipe** that a chef inherited from a family cookbook. The chef can follow the original recipe (the superclass method) or write a new version that adds a personal twist (the subclass method). When the chef cooks, the new version is used – the original is overridden.

## JavaScript Example
```javascript
// Superclass
class Animal {
  speak() {
    console.log('The animal makes a sound');
  }
}

// Subclass that overrides the speak method
class Dog extends Animal {
  // Override the inherited method
  speak() {
    console.log('The dog barks');
  }
}

const generic = new Animal();
generic.speak(); // Output: The animal makes a sound

const dog = new Dog();
dog.speak(); // Output: The dog barks (overridden method)
```

In this example, `Dog` provides its own `speak` method, which **overrides** the one from `Animal`. When `speak` is called on a `Dog` instance, the overridden version runs.
