# Topic 23: JSON & Web Storage (localStorage)

## 1. The Concept in Simple Language
The internet sends data back and forth as pure text. It doesn't send "JavaScript Objects". That means if you want to send your giant Player object to a database, you must aggressively format it into plain text first. 
**JSON (JavaScript Object Notation)** is the universal language of the web. It's simply a way of turning an Object or Array into a giant string of text that looks *exactly* like JavaScript. 

**LocalStorage** is a mini-database built directly into your user's web browser. It allows you to save Strings permanently on their computer. If they close the browser tab and come back tomorrow, the data is still there!

## 2. How JavaScript Works Internally
JS has a built-in `JSON` object. It has two huge powers:
1. `JSON.stringify(object)`: Takes an object from RAM and "freezes" it into a plain text String.
2. `JSON.parse(string)`: Takes a JSON plain text String, melts it down, and resurrects it back into a living JavaScript Object in RAM.

The browser window API gives you `localStorage.setItem('key', 'string')`. This physically writes a small text file onto the user's hard drive linked to your website.

## 3. Beginner-Friendly Code Examples

**Example 1: Turning Objects into Text (JSON)**
```javascript
let player = { name: "Link", hp: 100 };

// 1. Freeze it!
let jsonString = JSON.stringify(player);
console.log(jsonString); // '{"name":"Link","hp":100}' (Notice it's just a string now!)

// 2. Resurrect it!
let resurrectedPlayer = JSON.parse(jsonString);
console.log(resurrectedPlayer.name); // "Link" (Back to a living JS object!)
```

**Example 2: Saving to the Browser**
*(Must be run in a browser, not Node.js)*
```javascript
// Saving simple Strings
localStorage.setItem('themeColor', 'dark');

// Fetching it back later!
let savedTheme = localStorage.getItem('themeColor');
console.log(savedTheme); // 'dark'

// Deleting it 
localStorage.removeItem('themeColor');
```

**Example 3: Saving Objects (The Real Secret!)**
Because LocalStorage ONLY accepts Strings... you must `JSON.stringify()` your data BEFORE saving it!
```javascript
let inventory = ["Sword", "Shield", "Potion"];

// 1. Stringify the array, THEN save it!
localStorage.setItem("myItems", JSON.stringify(inventory));

// 2. Get the string back tomorrow when they load the webpage
let memoryString = localStorage.getItem("myItems");

// 3. Parse it back into a real JS Array!
let restoredArray = JSON.parse(memoryString);
console.log("Restored:", restoredArray[0]); // "Sword"
```

## 4. Real-World Examples

1. **Dark/Light Mode Saving:** When a user clicks the moon icon, UI turns dark, and JS does `localStorage.setItem('theme', 'dark')`. When they refresh the page the next morning, JS checks `localStorage.getItem('theme')` on line 1, sees "dark", and immediately loads the dark UI so their eyes don't burn.
2. **Shopping Carts:** If an anonymous user (not logged in) adds shoes to their cart, you stringify the cart Array and save it to LocalStorage. If they close the tab by accident, they don't lose their cart!

## 5. Practice Questions
1. Why must you use `JSON.stringify()` before saving an Array into LocalStorage?
2. What method melts a JSON string back into a living Object?
3. How long does data stay in `localStorage`?

## 6. Interview-Style Tricky Question
*Question:* Explain the difference between `localStorage` and `sessionStorage`. What happens to `sessionStorage` when the user closes the browser tab?

## 7. Common Mistakes Beginners Make
* **Saving objects directly:** Beginners often type `localStorage.setItem("user", myObject)`. JS panics because it's not a string, so it forces a string conversion. The result? It saves `"[object Object]"` into the database, utterly ruining the data forever. Always `stringify` first!
* **JSON Syntax:** Writing raw JSON strings by hand is painfully strict. In real JS, object keys don't need quotes (`{ name: 'John' }`). But in pure JSON format, ALL keys MUST have double-quotes (`{"name": "John"}`).

## 8. Edge Cases
* **Storage Limits:** `localStorage` is completely synchronous and blocks the Main Thread (Cashier) while it writes to the hard drive! It also has a maximum storage limit of typically 5MB per website. If you try to stringify and store a massive 50MB array of HD images, the browser will throw a QuotaExceededError and crash!

---

### 📝 Your Turn!

(Review mentally!)
