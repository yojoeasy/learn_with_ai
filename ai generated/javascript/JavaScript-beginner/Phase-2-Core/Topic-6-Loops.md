# Topic 6: Loops (for, while, do-while)

## 1. The Concept in Simple Language
A loop is a way to tell the computer to repeat a task over and over again without you having to write the code multiple times.

Imagine writing "I will not talk in class" 100 times on a chalkboard. 
Instead of writing 100 lines of `console.log("I will not talk in class")`, you can use a loop to say: 
*"Run this one line of code 100 times."*

There are 3 main types of basic loops:
1. **The 'for' loop:** Used when you know *exactly* how many times you want to loop. (e.g., Loop 10 times).
2. **The 'while' loop:** Used when you want to loop until a condition becomes false, though you don't know how many times it will take. (e.g., Keep healing the player until health is 100, might take 1 potion, might take 5).
3. **The 'do-while' loop:** Basically a while loop, but it guarantees the code runs at least *one time* before it starts checking the condition.

## 2. How JavaScript Works Internally
When the JavaScript engine enters a loop, it locks into a cycle. It evaluates a condition (e.g., `i < 10`). If it's true, it runs the block of code inside the loop. Then, it runs an increment statement (e.g., `i++`). Then it jumps *back up* to evaluate the condition again. 
It will continuously spin in this cycle until the condition evaluates to `false`. Once false, it breaks the cycle and continues reading the rest of the file.

If the condition *never* becomes false, the engine will spin forever, locking up the CPU. This is called an **Infinite Loop**, and it will crash the browser tab!

## 3. Beginner-Friendly Code Examples

**Example 1: The 'For' Loop**
A `for` loop has 3 parts in the parentheses: (Initialization; Condition; Step)
```javascript
// Output numbers 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Counting: " + i);
}
```

**Example 2: The 'While' Loop**
```javascript
let playerHealth = 30;

// Keep running AS LONG AS health is less than 50
while (playerHealth < 50) {
  console.log("Using a health potion...");
  playerHealth += 10; // Adds 10 health each loop
}
console.log("Fully healed! Health is now: " + playerHealth);
```

**Example 3: the 'Do-While' Loop**
```javascript
let count = 100;

do {
  // It prints 100 even though 100 is NOT less than 5, because the check happens AFTER!
  console.log("This prints at least once. Count: " + count);
  count++;
} while (count < 5);
```

## 4. Real-World Examples

1. **Retries:** When attempting to connect to a failing API or database, you might wrap the attempt in a `while` loop: `while(!connected && retries < 3) { tryConnecting(); }`.
2. **Iterating Data:** Loops are foundational for making Arrays (lists) work. You use loops to look at every single tweet in a list of 50 tweets and draw them to the screen (though we will learn modern Array loop methods later).

## 5. Practice Questions
1. Which loop is best when you know exactly how many iterations you need?
2. What are the three distinct parts inside the parentheses of a `for` loop?
3. How is a `while` loop different from a `do-while` loop?

## 6. Interview-Style Tricky Question
*Question:* How can you manually escape a `for` or `while` loop immediately without waiting for the condition to become `false`?

## 7. Common Mistakes Beginners Make
* **Infinite Loops:** Forgetting to increment the counter inside a while loop.
  ```javascript
  let i = 0;
  while(i < 5) {
      console.log("I am trapped forever!");
      // i++; << FORGOT THIS LINE, i is always 0. CPU crashes.
  }
  ```
* **Off-by-one errors:** Looping `(i = 1; i < 5)` means it runs for rows 1, 2, 3, AND 4, but it immediately stops AT 5. So it only runs 4 times. If you wanted 5 times, it needs to be `<= 5`. Or usually in JS, we start at 0: `(i = 0; i < 5)` runs exactly 5 times (0, 1, 2, 3, 4).

## 8. Edge Cases
* **Variables leaking (var vs let):** In older JS using `for (var i = 0)`, `i` actually leaks out of the loop and stays in memory forever. With modern `for (let i = 0)`, `i` is destroyed the moment the loop finishes, freeing up memory.

---

### 📝 Your Turn!

Please answer these questions so I know we are on the same page:
1. **Write the structure of a `for` loop that runs exactly 3 times.**
2. **What causes an "Infinite Loop"?**
