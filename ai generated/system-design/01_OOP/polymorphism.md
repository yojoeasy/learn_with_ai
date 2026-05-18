# Polymorphism

## Standard Definition
Polymorphism is the ability of different objects to be accessed through the same interface, allowing functions to operate on objects of different types while behaving appropriately for each specific type. In practice, this often means that a method can have many forms (i.e., multiple implementations) depending on the object that invokes it.

## Easy‑to‑Understand Explanation
Think of a **Swiss‑army knife**. It has many different tools (blade, scissors, screwdriver) but you interact with it through the same handle. Depending on which tool you unfold, the knife performs a different action while the overall interface remains the same.

## JavaScript Example
```javascript
// Base class with a method that will be overridden
class Vehicle {
  move() {
    console.log('The vehicle moves');
  }
}

class Car extends Vehicle {
  // Override move for a car
  move() {
    console.log('The car drives on the road');
  }
}

class Boat extends Vehicle {
  // Override move for a boat
  move() {
    console.log('The boat sails on water');
  }
}

// Function that works with any Vehicle (polymorphic)
function startJourney(v) {
  v.move(); // Calls the appropriate implementation based on actual object type
}

const myCar = new Car();
const myBoat = new Boat();

startJourney(myCar);  // Output: The car drives on the road
startJourney(myBoat); // Output: The boat sails on water
```

Here, `startJourney` treats both `Car` and `Boat` as generic `Vehicle`s. The actual `move` method that runs depends on the concrete class, demonstrating polymorphism.
