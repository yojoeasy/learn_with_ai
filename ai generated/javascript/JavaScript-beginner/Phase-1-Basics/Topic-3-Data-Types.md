# Topic 3: Data Types (Primitives vs Objects)

## 1. The Concept in Simple Language
In the real world, you deal with different types of data every day. You have numbers (your age: 25), texts (your name: "Alice"), and true/false facts (are you subscribed? yes/true). 

JavaScript also needs to know what *kind* of data it is holding in a variable so it knows how to behave. For example, if you add two numbers `10 + 5`, it equals `15`. But if you add two texts `"10" + "5"`, it just glues them together to make `"105"`.

JavaScript has two main categories of Data Types:
1. **Primitives (Simple Types):** Like atoms, they are the smallest, simplest building blocks. (e.g., Numbers, Strings, Booleans).
2. **Objects (Complex Types):** Like a molecule, they group multiple primitives together. (e.g., Arrays, Objects).

## 2. How JavaScript Works Internally
Memory in JavaScript is divided into two areas: the **Stack** and the **Heap**.
*   **Primitives** are stored in the **Stack**, which is very fast memory. When you assign a primitive variable to another (`let a = 10; let b = a;`), JS literally *copies* the value so they are completely independent.
*   **Objects** are stored in the **Heap**, which is a larger, slower memory area. When you assign an object to another variable, JS copies the *reference* (the address), meaning both variables point to the exact same object in memory!

## 3. Beginner-Friendly Code Examples

**Example 1: The 3 Most Common Primitives**
```javascript
// 1. String (Text, wrapped in quotes)
let playerName = "Luigi";

// 2. Number (Decimals work exactly the same)
let score = 99;
let health = 10.5;

// 3. Boolean (True or False ONLY)
let isGameOver = false;
let hasExtraLife = true;
```

**Example 2: Two "Empty" Primitives**
```javascript
// Null (Intentionally empty, you setting the box to be empty)
let currentWeapon = null; 

// Undefined (The box exists, but you forgot to put anything in it yet)
let playerRank;
console.log(playerRank); // Output: undefined
```

**Example 3: Checking the Type**
```javascript
let secret = 42;
console.log(typeof secret); // Output: "number"

secret = "Forty Two";
console.log(typeof secret); // Output: "string"
```

## 4. Real-World Examples

1. **User Database:** When a user registers:
   - `username: "charlie99"` (String)
   - `age: 28` (Number)
   - `isEmailVerified: true` (Boolean)
2. **Loading States:** In a React application, when you are fetching data from the server, you might set `let userData = null;`. Once the data arrives, you replace the `null` with the actual user object.

## 5. Practice Questions
1. What is the difference between `null` and `undefined`?
2. Write a variable for your favorite movie title. What Data Type is it?
3. What is the output of `typeof true`?

## 6. Interview-Style Tricky Question
*Question:* Explain the difference in what happens in memory when you copy a Primitive vs when you copy an Object.

## 7. Common Mistakes Beginners Make
* **Putting numbers in quotes:** 
  `let age = "25";`
  This makes `age` a String (text), not a Number. If you do `age + 1`, JS will do `"25" + 1`, which outputs `"251"` instead of `26`!
* **Capitalizing booleans:**
  Writing `True` or `False`. In JavaScript, they must be strictly lowercase: `true` and `false`.

## 8. Edge Cases
* **NaN (Not a Number):** If you try to do math with text, like `"Apple" * 5`, JavaScript will give you a special value called `NaN`. The crazy part? The `typeof NaN` is actually `"number"`. This is a famous JavaScript quirk!

---

### 📝 Your Turn!

Please answer these questions so I know we are on the same page:
1. **What data type should you use to store whether a light switch is on or off?**
2. **If I type `let x = "100"`, is `x` a number or a string?**
