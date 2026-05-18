# Encapsulation

## Standard Definition
Encapsulation is the bundling of data (attributes) and methods (functions) that operate on that data within a single unit, typically a class, and restricting direct access to some of the object's components. This is achieved by using access modifiers (e.g., `private`, `protected`, `public`) to hide internal state and expose only a controlled interface.

## Easy‑to‑Understand Explanation
Think of a **capsule** that holds medicine. You can only take the medicine by opening the capsule in the way the manufacturer designed. Similarly, a class keeps its data safe inside and lets other parts of the program interact with it only through the methods you expose.

## JavaScript Example
```javascript
class BankAccount {
  // Private field (available in modern JavaScript)
  #balance = 0;

  // Public method to deposit money
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  // Public method to check the balance
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
// Direct access to #balance is prohibited:
// console.log(account.#balance); // SyntaxError
```

In this example, the **balance** is hidden inside the class (`#balance`). The only way to change or view it is through the `deposit` and `getBalance` methods, demonstrating encapsulation.
