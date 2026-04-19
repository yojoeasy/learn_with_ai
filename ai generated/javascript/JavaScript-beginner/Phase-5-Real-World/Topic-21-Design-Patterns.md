# Topic 21: Design Patterns

## 1. The Concept in Simple Language
When building a house, you don't randomly start nailing wood together. You use established architectural patterns (like placing the bathroom near the bedroom).
In programming, **Design Patterns** are proven, reusable solutions to common software design problems. It's the difference between "code that technically works" and "code that a team of 50 enterprise engineers can read entirely without getting a headache."

Using patterns makes your code modular, testable, and massively scalable.

## 2. How JavaScript Works Internally
Because JS is extremely flexible—supporting both Object-Oriented Programming (Classes) and Functional Programming (Closures/Functions)—you can implement dozens of different patterns.
Historically, JS relied heavily on the **Module Pattern** (using closures for privacy before native ESM existed). Today, React popularized the **Observer Pattern** (State & Hooks) and the **Factory Pattern**.

## 3. Beginner-Friendly Code Examples

**Example 1: The Singleton Pattern**
Ensures that a class only ever has ONE instance. Useful for global Configs or Audio Players.
```javascript
class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            // If someone already created it, return the existing one!
            return DatabaseConnection.instance;
        }
        this.connectionString = "Connected!";
        DatabaseConnection.instance = this; // Save it forever
    }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // TRUE! They are the exact same object in memory!
```

**Example 2: The Factory Pattern**
A central function that pumps out custom objects without using `class/new`. 
```javascript
function createEnemy(type) {
    if (type === "Goblin") return { hp: 10, dmg: 2 };
    if (type === "Dragon") return { hp: 1000, dmg: 50 };
}

const weakling = createEnemy("Goblin");
const boss = createEnemy("Dragon");
```

**Example 3: The Observer Pattern (Pub/Sub)**
When one object changes state, all its "subscribers" are automatically notified!
```javascript
class YouTubeChannel {
    constructor() {
        this.subscribers = [];
    }
    subscribe(fn) {
        this.subscribers.push(fn);
    }
    uploadVideo(title) {
        // Loop through everyone who subscribed and trigger them!
        this.subscribers.forEach(sub => sub(title));
    }
}

const mrBeast = new YouTubeChannel();
// John hits Subscribe
mrBeast.subscribe((title) => console.log(`John's Phone: Notification! ${title}`));

mrBeast.uploadVideo("I Bought A Private Island!");
// Output: John's Phone: Notification! I Bought A Private Island!
```

**Example 4: The Module Pattern**
Protects internal data by encapsulating it in a closure. This is how we achieved "private" variables before the `#` class field syntax or ES Modules existed.
```javascript
const BankAccount = (function() {
    let balance = 0; // Private! Cannot be accessed out here.

    return {
        deposit: function(amount) {
            balance += amount;
            console.log(`Deposited. Balance is ${balance}`);
        },
        getBalance: function() {
            return balance;
        }
    };
})(); // The IIFE (Immediately Invoked Function Expression) creates the closure bubble

BankAccount.deposit(100);
console.log(BankAccount.balance); // undefined! Completely safe!
```

**Example 5: The Strategy Pattern**
Allows you to cleanly swap out different algorithms/strategies dynamically without writing massive `if/else` or `switch` statements.
```javascript
class ShippingClient {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    calculate(packageData) {
        return this.strategy.calculate(packageData);
    }
}

// Three different strategies!
const FedEx = { calculate: packageData => packageData.weight * 2.5 };
const UPS = { calculate: packageData => packageData.weight * 1.5 };
const USPS = { calculate: packageData => packageData.weight * 1 };

const checkout = new ShippingClient();
checkout.setStrategy(FedEx);
console.log("FedEx Cost:", checkout.calculate({ weight: 10 })); // 25

checkout.setStrategy(USPS);
console.log("USPS Cost:", checkout.calculate({ weight: 10 })); // 10
```

## 4. Real-World Examples

1. **Redux / React State:** Redux is fundamentally the **Observer Pattern**. It holds a central "Store" of data. Components "Subscribe" to exactly the slices of data they care about. When the data updates, Redux pushes out a notification, and only those subscribed components re-render!
2. **Axios/HTTP Clients:** The **Facade Pattern**. Axios creates a beautiful, simple `axios.get()` facade over the horrifyingly ugly native XMLHttpRequests of legacy browsers.

## 5. Practice Questions
1. Why are Design Patterns useful on large engineering teams?
2. Describe the Singleton pattern. What is an example of when you would use it?
3. How does the Observer Pattern resemble subscribing to a newsletter?

## 6. Interview-Style Tricky Question
*Question:* A common anti-pattern is the "God Object". What is it, and why does the "Single Responsibility Principle" strictly forbid it?

## 7. Common Mistakes Beginners Make
* **Pattern Overuse:** Trying to implement an intricate Observer Pattern for a simple to-do list app. Over-engineering simple software makes the code far worse. Use patterns only when the sheer complexity of the project demands them!
* **Global Scope as a Singleton:** Just declaring a global variable `window.db = {}` is technically a "singleton", but it violates all safety. Real Singletons encapsulate the data to prevent accidental tampering.

## 8. Edge Cases
* **Memory Leaks in Observers:** If you subscribe 1,000 components to a Redux store, but those components are deleted from the screen, remember they are STILL inside the `this.subscribers` array! You must have an `unsubscribe()` method, or you just created a massive memory leak (See Topic 20).

---

### 🎉 CONGRATULATIONS! 🎉

You have reached the end of the **JavaScript Mastery Roadmap**. 
You started from absolute zero (Variables and `for` loops) and progressed all the way through V8 Engine memory management, Event Loops, Asynchronous Promises, and Enterprise Design Patterns.

### Next Steps:
You are now fully prepared to learn a frontend framework like **React** or **Vue**, or build scalable backend servers using **Node.js**. Happy coding! 🚀
