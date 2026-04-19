// Practice file for Design Patterns

// The Factory Pattern Example
function createUser(role) {
    if (role === "admin") return { accessLevel: 100, permissions: ["read", "write", "delete"] };
    if (role === "guest") return { accessLevel: 1, permissions: ["read"] };

    // Default
    return { accessLevel: 10, permissions: ["read", "write"] };
}

const adminPanel = createUser("admin");
console.log("Admin Panel:", adminPanel);

// The Observer Pattern Example
class PubSub {
    constructor() {
        this.events = {};
    }
    on(eventName, callback) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(callback);
    }
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }
}

const Store = new PubSub();

// I want to listen for an item added into a shopping cart
Store.on("cartUpdated", (item) => {
    console.log(`UI Update: A ${item} was added to your cart!`);
});

// Someone clicked a button
console.log("Simulating click...");
Store.emit("cartUpdated", "Magic Keyboard"); // Triggers the print statement above!

// The Module Pattern Example
const BankAccount = (function () {
    let balance = 0; // Private! Cannot be accessed out here.

    return {
        deposit: function (amount) {
            balance += amount;
            console.log(`Module Pattern: Deposited $${amount}. Secret Balance is ${balance}`);
        },
        getBalance: function () {
            return balance;
        }
    };
})();

BankAccount.deposit(100);
console.log("Module Pattern: Direct access to balance:", BankAccount.balance); // undefined! Completely safe!

// The Strategy Pattern Example
class ShippingClient {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    calculate(packageData) {
        return this.strategy.calculate(packageData);
    }
}

const FedEx = { calculate: packageData => packageData.weight * 2.5 };
const USPS = { calculate: packageData => packageData.weight * 1 };

const checkout = new ShippingClient();
checkout.setStrategy(FedEx);
console.log("Strategy Pattern: FedEx Cost:", checkout.calculate({ weight: 10 })); // 25

checkout.setStrategy(USPS);
console.log("Strategy Pattern: USPS Cost:", checkout.calculate({ weight: 10 })); // 10
