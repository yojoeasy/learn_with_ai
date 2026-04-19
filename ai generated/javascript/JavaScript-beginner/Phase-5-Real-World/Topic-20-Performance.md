# Topic 20: Performance & Memory Leaks

## 1. The Concept in Simple Language
JavaScript is generally fast, but if you write terribly inefficient code, your website will become laggy, slow, and eventually crash the user's browser.
**Performance Optimization** means writing code that requires the least amount of CPU power. 
**Memory Management** means making sure your code cleans up after itself. If you keep hoarding old data in memory without throwing it away, it's called a **Memory Leak**. Eventually, the browser runs out of RAM and crashes the tab.

## 2. How JavaScript Works Internally
JavaScript has a built-in **Garbage Collector (GC)**. 
Every few seconds, the GC scans your computer's RAM. It looks for variables or objects that are no longer being "used" (referenced) by the program. If an object is utterly abandoned, the GC deletes it and frees up the memory.
A Memory Leak occurs when you *accidentally* keep a reference to an object, tricking the GC into thinking you still need it! The GC refuses to delete it, and your RAM usage slowly inflates to 100%.

## 3. Beginner-Friendly Code Examples

**Example 1: The Event Listener Leak (Very common!)**
```javascript
function attachClick() {
    const hugeData = new Array(1000000).fill("A"); // 1 Million items! Heavy!
    
    // If you attach a closure event listener to the "window" object, 
    // the window NEVER DIES. So the listener never dies.
    // Which means hugeData NEVER gets deleted by the GC!
    window.addEventListener("click", () => {
        console.log(hugeData[0]);
    });
}
// If you run attachClick() 100 times, you just leaked 100 Million items permanently.
```
*Fix: Always use `window.removeEventListener()` when you no longer need it!*

**Example 2: Global Variable Pollution**
```javascript
// Global variables NEVER get garbage collected while the page is open.
let temporaryCache = {};

function storeData() {
    // If this function gets called 1,000 times... temporaryCache grows to infinity.
    temporaryCache[Date.now()] = "Some data"; 
}
```

## 4. Real-World Examples

1. **Infinite Scrolling:** When you scroll down Twitter, if it keeps loading 10,000 tweets into the DOM, the browser will crash. Twitter removes the tweets at the very top of the page out of the DOM while you are reading the bottom tweets. This is called DOM Virtualization.
2. **Intervals:** If you set a `setInterval(fetchEmails, 5000)` on a dashboard screen, but the user clicks away to the Settings screen, you MUST run `clearInterval()`! If you don't, the interval keeps fetching emails silently forever in the background!

## 5. Practice Questions
1. What does the Garbage Collector do?
2. Why is attaching countless event listeners to the `window` a dangerous thing?
3. What is DOM Virtualization used for?

## 6. Interview-Style Tricky Question
*Question:* Explain "Debouncing" and "Throttling". If I attach a scroll listener to the window, the browser fires the event 1,000 times per second. How do I use Debouncing to fix the performance nightmare?

## 7. Common Mistakes Beginners Make
* **Too Many DOM Updates:** Editing the DOM is the slowest thing JS can do. If you have an array of 1,000 items, and you run a loop that does `document.body.appendChild()` inside the loop 1,000 times, the browser will freeze! 
  *Fix:* Build a giant string first, and do `appendChild()` exactly ONE time outside the loop.
* **Accidental Globals:** Writing `function() { name = "John" }` without `let/const` creates a permanent global variable that never gets garbage collected.

## 8. Edge Cases
* **Closures holding DOM references:** If you store a DOM element in a variable (`let btn = document.getElementById('myBtn')`), and then your UI deletes that button from the screen... the button is NOT deleted from RAM! Because your JS variable `btn` is still pointing to it! The hidden button stays in memory like a ghost.

---

### 📝 Your Turn!

(Review mentally!)
