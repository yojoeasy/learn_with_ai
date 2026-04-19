# Topic 15: Prototypes and Inheritance

## 1. The Concept in Simple Language
Imagine building a robot car. You give it 4 wheels and an engine. Now you want to build 1,000 more robot cars. Should you manually build the wheels and engine 1,000 times? No! You use a blueprint. In JS, blueprints are called **Prototypes**. 
When you create a generic `Array`, JavaScript automatically attaches an invisible "Prototype" object to it. That invisible blueprint holds thousands of methods like `.push()` and `.pop()`.
This means every single array you create has access to those methods without wasting 100 megabytes storing them over and over again!

**Inheritance** is when a smaller blueprint inherits traits from a bigger blueprint. A `Dog Blueprint` inherits eyes and lungs from the `Animal Blueprint`. So the Dog gets to bark, but it also inherits breathing for free!

## 2. How JavaScript Works Internally
JavaScript doesn't use massive, stiff "Classes" like Java or C#. 
It uses **Prototypal Inheritance**. Every object in JS has an invisible hidden link called `[[Prototype]]` (or `__proto__`). 
When you type `myArray.push()`, JS looks inside your empty little array for a `.push()` function. It doesn't find it! So it follows the invisible `__proto__` chain upwards to the master `Array Prototype`. It finds `.push()` there, borrows it, and uses it! 
If it climbs the chain all the way to `Object` and still can't find it, it returns `undefined`.

## 3. Beginner-Friendly Code Examples

**Example 1: The Modern ES6 Blueprint (Classes)**
```javascript
// Step 1: Create a Blueprint (Class)
class Character {
    constructor(name) {
        this.name = name; // Every created char gets their own name
    }
    // Method attached to the hidden Prototype blueprint!
    sayName() {
        console.log(`I am ${this.name}!`);
    }
}

// Step 2: Spawn an object using 'new'
const hero = new Character("Cloud Strife");
hero.sayName(); // I am Cloud Strife!
```

**Example 2: Inheritance (Classes building on Classes)**
```javascript
// Inherit everything Character has, but add Magic!
class Mage extends Character {
    constructor(name, mana) {
        super(name); // Super 'calls' the parent blueprint to do the heavy lifting
        this.mana = mana;
    }
    castSpell() {
        console.log(`${this.name} casts Fireball using ${this.mana} MP!`);
    }
}

const gandalf = new Mage("Gandalf", 500);
gandalf.sayName();   // Inherited easily!
gandalf.castSpell(); // Spells are for mages only!
```

## 4. Real-World Examples

1. **Custom Error Objects:** Whenever you throw an error to crash an app, developers inherit from JS's built-in `Error` object: `class DatabaseError extends Error { ... }`. Now it has a stack trace automatically attached!
2. **React Components:** Up until a few years ago, ALL React components were built via inheritance: `class CustomButton extends React.Component`.

## 5. Practice Questions
1. When you type `arr.push()`, does every array hold a physical copy of the `push()` code inside itself?
2. What does the `extends` keyword do when building a Class?
3. What is the invisible link linking objects to their parent blueprint called?

## 6. Interview-Style Tricky Question
*Question:* Explain the "Prototype Chain". What happens when you call a method that does not exist on the object itself?

## 7. Common Mistakes Beginners Make
* **Forgetting 'super()':** When writing `extends`, if you write a `constructor()` but forget to call `super()`, JavaScript instantly throws a fatal error and crashes your app. `this` doesn't magically exist until `super()` finishes preparing it!
* **Over-Engineering Classes:** Creating inheritance chains 8 levels deep (`Animal -> Mammal -> Dog -> Poodle -> TinyPoodle`) ends up making spaghetti code that is impossible to read. Modern JS prefers mixing small functional pieces together instead of massive Class chains.

## 8. Edge Cases
* **Modifying built-in prototypes:** You literally *can* type `Array.prototype.explodeTheApp = function() { ... }`. Now EVERY array ever existing inside your page can suddenly use `.explodeTheApp()`. This is highly forbidden, because if someone else's library tries to do the same thing, they clash and destroy the website. 

---

### 📝 Your Turn!

(Review mentally!)
