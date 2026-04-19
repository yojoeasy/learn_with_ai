# Topic 5: Control Flow (if/else, switch)

## 1. The Concept in Simple Language
Control flow is how your program makes decisions. Think of it like a fork in the road: 
"**IF** it is raining, take the umbrella. **ELSE**, wear sunglasses."

A computer program usually runs from top to bottom, one line at a time. Control flow allows the program to skip chunks of code or run different chunks of code based on conditions (like checking if a player's health is 0 so the game can show the "Game Over" screen).

## 2. How JavaScript Works Internally
When JavaScript hits an `if` statement, it checks the expression inside the parentheses `()`. 
It evaluates that expression into a strictly Boolean value (`true` or `false`).
If it's `true`, the engine jumps into the curly braces `{}` and executes the code. If it's `false`, the engine jumps *over* the block of code and continues down the file.

JavaScript also uses "Truthy" and "Falsy" evaluation. Even if you put a non-boolean inside an `if()` (like a number `if(10)`), the JS engine will force it into a boolean behind the scenes.

## 3. Beginner-Friendly Code Examples

**Example 1: The Basic If/Else**
```javascript
let passwordLength = 5;

if (passwordLength >= 8) {
  console.log("Password is strong enough.");
} else {
  console.log("Error: Password is too short!"); // This will run
}
```

**Example 2: The Else If (Multiple choices)**
```javascript
let time = 14; // 2 PM on a 24-hour clock

if (time < 12) {
  console.log("Good Morning!");
} else if (time < 18) {
  console.log("Good Afternoon!"); // This will run
} else {
  console.log("Good Evening!");
}
```

**Example 3: Switch Statement (Great for checking one variable against many exact values)**
```javascript
let characterClass = "Mage";

switch(characterClass) {
  case "Warrior":
    console.log("You get a Sword.");
    break;
  case "Mage":
    console.log("You get a Staff."); // This will run
    break;
  default:
    console.log("You get your bare fists.");
}
```

## 4. Real-World Examples

1. **Authentication routing:** `if (user.isLoggedIn) { showDashboard(); } else { showLoginPage(); }`
2. **Access Control (Roles):** A switch statement is often used on the backend to figure out what permissions a user has based on `user.role` (e.g., 'admin', 'editor', 'viewer').

## 5. Practice Questions
1. What keyword do you use to test a second condition if the first `if` condition fails?
2. Why is the `break` keyword important inside a `switch` statement?
3. Write an `if` statement that checks if a variable `age` is greater than or equal to 18.

## 6. Interview-Style Tricky Question
*Question:* What are all the "falsy" values in JavaScript? (Values that evaluate to `false` when placed inside an `if` statement).

## 7. Common Mistakes Beginners Make
* **Forgetting curly braces:** Writing `if (x = 10) console.log(x)` as one line without curly braces. While this is valid syntax in JS, it often leads to bugs when you need to add a second line of code to the `if` block. Always use `{ }`.
* **Using `=` instead of `===` inside the 'if':**
  ```javascript
  // WRONG
  if (health = 0) { console.log('You died') } 
  // This physically changes the health variable to 0, which is bad!
  ```
* **Forgetting 'break' in Switch:** If you forget `break;` at the end of a `case`, JavaScript will "fall through" and immediately execute the next case below it, regardless of if it matches!

## 8. Edge Cases
* **Falsy values:** If you do `let username = ""; if(username) { ... }`, the code will NOT run. Empty strings `""`, the number `0`, `null`, `undefined`, and `NaN` are all considered `false` by the JS engine.

---

### 📝 Your Turn!

Please answer these questions so I know we are on the same page:
1. **In an `if / else if / else` chain, can more than one chunk of code run at the same time?**
2. **If `let health = 0;`, what will the code inside `if (health) { console.log('Alive'); }` do, and why?**
