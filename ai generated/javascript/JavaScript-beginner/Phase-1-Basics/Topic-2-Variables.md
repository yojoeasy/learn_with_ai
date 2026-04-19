# Topic 2: Variables (var, let, const)

## 1. The Concept in Simple Language
Imagine you are packing for a trip. You have a box labeled **"Shoes"** and inside it, you put your sneakers. Later, you can just ask for the "Shoes" box, and you know you'll get your sneakers. 

In JavaScript, **variables** are just named boxes that store data (like text, numbers, or true/false values). You give the box a name, put something inside it, and later, you can use that name to look at what's inside or change it.

In modern JavaScript, there are three ways to create a box (variable):
1. **`let`**: A box whose contents can be changed later. 
2. **`const`**: A special locked box. Once you put something in, you **cannot** change it.
3. **`var`**: The old, messy way of creating boxes. We mostly avoid it today.

## 2. How JavaScript Works Internally
When you declare a variable (e.g., `let age = 25`), JavaScript does two things under the hood:
1. **Memory Allocation:** It goes to your computer's RAM (Memory) and reserves a tiny physical space.
2. **Binding:** It connects your variable's name (`age`) to the memory address of that space. So whenever you type `age`, the JS engine instantly knows where to look in memory to grab the value `25`.

## 3. Beginner-Friendly Code Examples

**Example 1: Using let (Values that change)**
```javascript
let score = 0; // We create a variable named score and set it to 0
score = 10;    // We changed the value inside the box to 10. (Notice we don't write 'let' again)
console.log(score); // Output: 10
```

**Example 2: Using const (Values that NEVER change)**
```javascript
const birthYear = 1995;
// birthYear = 2000; // 🛑 ERROR! You cannot reassign a const variable.
console.log(birthYear); // Output: 1995
```

**Example 3: Storing text (Strings)**
```javascript
let playerName = "Mario";
const gameName = "Super Mario Bros";
console.log(playerName + " plays " + gameName); 
// Output: Mario plays Super Mario Bros
```

## 4. Real-World Examples

1. **Shopping Cart Total:** When you add items to a shopping cart on Amazon, a variable like `let totalPrice = 0` is updated every time you click "Add to cart". Because the price changes, we use `let`.
2. **API Keys / Configuration:** If you are connecting your code to a database, the URL or secret password to the database will never change while the program is running. You would store it as `const dbPassword = "secret123"`.

## 5. Practice Questions
1. When should you use `let` instead of `const`?
2. What happens if you try to change the value of a `const` variable?
3. Write a line of code to create a variable called `city` that cannot be changed, and give it the value "New York".

## 6. Interview-Style Tricky Question
*Question:* What will be the output of the following code and why?
```javascript
let characterName;
console.log(characterName);
```

## 7. Common Mistakes Beginners Make
* **Forgetting to declare the variable:** 
  ```javascript
  // WRONG
  speed = 100; 
  
  // CORRECT
  let speed = 100;
  ```
* **Using `var` instead of `let` or `const`:** Many old tutorials use `var`. Avoid it! It has confusing scoping rules that cause bugs (which we will learn about later). Stick to `const` by default, and `let` if the value needs to change.

## 8. Edge Cases
* **Changing the inside of a const object/array:** While `const` prevents you from reassigning the variable completely, if the variable holds an Array or an Object, you *can* modify the contents inside them. This is a classic edge case we will cover deeply when we reach Objects/Arrays! For simple numbers and text, `const` is perfectly locked.

---

### 📝 Your Turn!

Please answer these questions so I know we are on the same page:
1. **Explain the difference between `let` and `const` in one sentence.**
2. **Why do we recommend avoiding `var`?**

Let me know your answers, and we'll write our first bit of code!
