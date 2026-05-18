# Singleton Pattern

**Definition**: Ensures a class has only one instance and provides a global point of access to it.

**Easy Explanation**: Think of a single TV remote that controls the whole house — there’s only one remote, and everyone uses the same one.

**JavaScript Example**:
```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    // initialize the instance
    this.timestamp = Date.now();
    Singleton.instance = this;
  }
}

const a = new Singleton();
const b = new Singleton();
console.log(a === b); // true
```

The class checks if an instance already exists; if it does, it returns the same one.
