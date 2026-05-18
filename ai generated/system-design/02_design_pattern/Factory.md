# Factory Pattern

**Definition**: Provides an interface for creating objects, but lets subclasses decide which class to instantiate.

**Easy Explanation**: Imagine a bakery where you order a cake. You tell the baker *what kind* of cake you want, and the baker (factory) creates the specific cake for you without you needing to know the exact recipe.

**JavaScript Example**:
```javascript
class ShapeFactory {
  static createShape(type) {
    switch (type) {
      case "circle":
        return new Circle();
      case "square":
        return new Square();
      default:
        throw new Error("Unknown shape type");
    }
  }
}

class Circle { draw() { console.log("Drawing a circle"); } }
class Square { draw() { console.log("Drawing a square"); } }

const shape1 = ShapeFactory.createShape("circle");
shape1.draw(); // Drawing a circle
```
