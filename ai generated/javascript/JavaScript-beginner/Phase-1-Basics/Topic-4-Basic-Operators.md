# Topic 4: Basic Operators

## 1. The Concept in Simple Language
Operators are just special symbols (`+`, `-`, `=`, etc.) that tell JavaScript to perform a specific action, usually math or comparisons.

Think of it like a recipe instruction: 
"Take the sugar **AND** the flour, **ADD** them together, and see **IF** they weigh **MORE THAN** 100g."
In code, verbs like *AND*, *ADD*, and *MORE THAN* are replaced with symbols called **Operators**.

There are 3 main types of basic operators:
1. **Arithmetic Operators:** For math (`+`, `-`, `*`, `/`).
2. **Assignment Operators:** For putting values into variables (`=`).
3. **Comparison Operators:** For comparing two things (like `<` or `>`).

## 2. How JavaScript Works Internally
JavaScript evaluates expressions from left to right, following the standard mathematical order of operations (PEMDAS/BODMAS). 

An important internal mechanic is **Type Coercion**. If you try to use operators on two things that don't match (like a number and a string), JavaScript's engine will try to "guess" what you mean by quietly converting one of the types into the other behind the scenes. This can lead to bugs if you aren't careful!

## 3. Beginner-Friendly Code Examples

**Example 1: Arithmetic Operators (Math)**
```javascript
let coins = 10;
let level = 5;

console.log(coins + level); // Addition: 15
console.log(coins * level); // Multiplication: 50
console.log(coins - 2);     // Subtraction: 8
console.log(coins / 2);     // Division: 5
```

**Example 2: The Modulo / Remainder Operator (%)**
```javascript
// % gives you the REMAINDER of a division
console.log(10 % 3); // Output: 1 (because 10 divided by 3 is 9, remainder 1)
console.log(10 % 2); // Output: 0 (perfectly even division)
```

**Example 3: Comparison Operators (Returns true or false)**
```javascript
let score = 100;

console.log(score > 50);  // true (greater than)
console.log(score === 100); // true (strictly equals)
console.log(score !== 50);  // true (not strictly equals)
```

## 4. Real-World Examples

1. **Even/Odd Calculations:** The modulo operator (`%`) is incredibly common in UI development. For example, zebra-striping a table (every alternating row has a gray background) is usually done by checking if the row number is even: `rowNumber % 2 === 0`.
2. **Shopping Cart Increment:** When a user clicks "+1" on a shopping cart item quantity, you use the assignment operator shortcut: `quantity++;` (which is shorthand for `quantity = quantity + 1`).

## 5. Practice Questions
1. What does the expression `let x = 50 * 2` output? 
2. What operator is used to check if two values are exactly equal?
3. What does `15 % 4` equal?

## 6. Interview-Style Tricky Question
*Question:* What is the difference between `==` and `===` in JavaScript? Why do senior developers always say to use `===`?

## 7. Common Mistakes Beginners Make
* **Confusing `=` with `===`:**
  `=` is the Assignment Operator. It PUTS a value into a variable (`let x = 5;`).
  `===` is the Comparison Operator. It CHECKS if two values are equal (`x === 5;`).
* **String Math Mistakes:**
  Because `+` is used for both adding numbers AND gluing words together, doing `10 + "5"` gives `"105"`. But surprisingly, `"10" - 5` gives `5`, because JavaScript realizes you can't subtract text, so it converts the string to a number! (This is that "Type Coercion" we mentioned).

## 8. Edge Cases
* **Floating point math:** If you try to do `0.1 + 0.2` in JavaScript, the result will be `0.30000000000000004` instead of `0.3`. This is because computers struggle to represent precise decimals in binary code. To fix this, developers often multiply decimals by 100 to make them whole numbers before doing math.

---

### 📝 Your Turn!

Please answer these questions so I know we are on the same page:
1. **Explain the difference between `=` and `===`?**
2. **What does `console.log("5" + 5)` output? What about `console.log("5" - 5)`?**
