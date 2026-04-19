# Topic 18: Error Handling (try/catch)

## 1. The Concept in Simple Language
Programs are fragile. If an external API server crashes, or a user types `-1` into an Age field, your JavaScript code will hit a fatal error.
By default, if JS hits a fatal error, the **entire application completely crashes and stops running**, presenting a blank white screen to your users.

**Error Handling** is like installing airbags in a car. By wrapping risky code inside a `try/catch` block, you say to JavaScript: *"Try to run this code. If it explodes, DO NOT CRASH! Instead, catch the explosion safely and run this backup plan."*

## 2. How JavaScript Works Internally
When JavaScript executes code, it maintains the **Call Stack** (the list of currently running functions). 
If an Error is "thrown" (e.g. `throw new Error()`), JS instantly stops the current function, destroys it, and travels backward up the Call Stack searching for a `catch` block. If it finds one, it hands the Error object to the `catch` block and resumes normally. If it reaches the very top of the stack and still finds no `catch` block, the JavaScript engine terminates the entire thread (Uncaught Exception).

## 3. Beginner-Friendly Code Examples

**Example 1: The basic try / catch**
```javascript
try {
    // 1. We TRY to run risky code
    console.log("Starting risk...");
    let result = undefinedVariable * 10; // 🛑 CRASH! Variable doesn't exist.
    
    console.log("This line NEVER runs!"); // Skipped
} catch (error) {
    // 2. We smoothly CATCH the crash without stopping the app!
    console.log("Oops! We safely caught an error:", error.message);
}

console.log("The application continues running normally!");
```

**Example 2: The 'finally' block**
```javascript
try {
    console.log("Connecting to Database...");
    // throw new Error("Database offline"); 
} catch (error) {
    console.log("Using backup database instead.");
} finally {
    // 3. FINALLY ALWAYS runs, whether it crashed or succeeded.
    // Great for cleaning up, closing loading spinners, etc.
    console.log("Closing connection...");
}
```

**Example 3: Throwing Custom Errors**
```javascript
function checkAge(age) {
    if (age < 0) {
        // You can manually trigger collisions!
        throw new Error("Age cannot be negative!");
    }
    return "Valid age.";
}

try {
    checkAge(-5);
} catch (err) {
    console.log(err.message); // Outputs: "Age cannot be negative!"
}
```

## 4. Real-World Examples

1. **User Authentication:** When a user logs in, `try { await login() } catch { showError('Wrong Password') }`. Without the catch block, typing a typing password would permanently freeze the submit button.
2. **Form Validation:** Validating inputs before sending them to the server so hackers can't crash your backend with malformed data.

## 5. Practice Questions
1. What happens to the application if an error is thrown but there is no `catch` block?
2. Does the code inside `try` continue executing after an error occurs on line 1?
3. What is the purpose of the `finally` block?

## 6. Interview-Style Tricky Question
*Question:* Can a `try/catch` block catch syntax errors (like forgetting a closing bracket `}`) during compilation?

## 7. Common Mistakes Beginners Make
* **Console.logging the whole error to the user:** Beginners sometimes do `alert(error)` or display the raw error object to the user interface. It looks terrifying! Always map system errors to friendly custom text like `"Something went wrong, please try again later"`.
* **Swallowing Errors:** Writing a `catch (err) { }` with completely empty brackets. It hides the error from both the user AND the developer, making bugs impossible to track down. Always at least `console.error` them or log them to an external service like Sentry!

## 8. Edge Cases
* **Catching Async Errors:** A massive trap! A `try/catch` block CANNOT catch an error inside a `setTimeout()` callback! The timeout callback goes into the Macrotask queue and runs much later, long after the `try` block has totally finished executing. To catch errors in async callbacks, the `try/catch` must be *inside* the callback itself!

---

### 📝 Your Turn!

(Review mentally!)
