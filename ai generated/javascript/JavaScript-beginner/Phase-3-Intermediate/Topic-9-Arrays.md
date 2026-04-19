# Topic 9: Arrays and Array Methods

## 1. The Concept in Simple Language
Imagine you have 10 favorite movies. Instead of creating 10 different variables (`let movie1`, `let movie2`), you can put them all inside one single list. 
In JavaScript, an **Array** is a list of items stored in a specific order. You access the items by their position number, called an **index**. (Important: Computers start counting at 0, not 1!)

We also have special built-in tools called **Array Methods** that let us easily add things to the list, remove things, or search through the list without writing complex loops.

## 2. How JavaScript Works Internally
As we learned in data types, Arrays are **Objects** stored in the Heap memory. 
Internally, an Array is just a special object where the "keys" are numbers (0, 1, 2) instead of words, and it automatically updates a special property called `.length` to track how many items are inside it.
When you use a built-in Array Method (like `.push()` or `.filter()`), the JavaScript engine runs highly optimized C++ code under the hood to manipulate the list incredibly fast.

## 3. Beginner-Friendly Code Examples

**Example 1: Creating and Accessing an Array**
```javascript
// A list of strings
let fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[0]); // Apple (Index 0 is the first item)
console.log(fruits[2]); // Cherry
console.log(fruits.length); // 3 (because there are 3 total items)
```

**Example 2: Adding and Removing using Methods**
```javascript
let inventory = ["Sword", "Shield"];

// .push() adds to the END
inventory.push("Potion"); 
// inventory is now ["Sword", "Shield", "Potion"]

// .pop() removes from the END and returns it
let removedItem = inventory.pop(); 
// inventory is back to ["Sword", "Shield"]. removedItem is "Potion".
```

**Example 3: Modern Iteration (No more for-loops!)**
Instead of using `for(let i=0; i < arr.length; i++)`, we use `.forEach()` and `.map()`.
```javascript
let prices = [10, 20, 30];

// .forEach runs a function on every single item
prices.forEach((price) => {
    console.log("Price is: $" + price);
});

// .map() creates a BRAND NEW array based on the old one
let doubledPrices = prices.map((price) => {
    return price * 2;
});
console.log(doubledPrices); // [20, 40, 60]
```

## 4. Real-World Examples

1. **Filtering a store:** If a user clicks "Show only items under $50", developers use the `.filter()` method: `let cheapItems = allItems.filter(item => item.price < 50);`
2. **Shopping Cart Total:** To add up the prices of all items in a cart, developers use the `.reduce()` method to squash an array down into a single number.

## 5. Practice Questions
1. If `let arr = ["A", "B", "C"]`, what does `arr[1]` output?
2. What is the difference between `.push()` and `.pop()`?
3. Which Array method would you use if you want to loop over an array and create a brand new modified list?

## 6. Interview-Style Tricky Question
*Question:* What happens if you try to `console.log(fruits[100])` on an array that only has 3 items? Does the program crash?

## 7. Common Mistakes Beginners Make
* **Off-by-one errors:** Forgetting that arrays are zero-indexed. Trying to get the last item by doing `arr[arr.length]` gives `undefined`. The last item is ALWAYS `arr[arr.length - 1]`.
* **Mutating vs Non-Mutating:** Some methods like `.push()` physically change the original array. Other methods like `.map()` or `.filter()` leave the original array completely untouched and *return* a new one. Beginners often write `arr.map(...)` and wonder why `arr` didn't change!

## 8. Edge Cases
* **Sparse Arrays:** You can do weird things in JS like `let arr = [1]; arr[5] = 10;`. Now the array is `[1, empty x 4, 10]`. It has a length of 6, but indexes 1 through 4 are literally empty (not even undefined, just a hole in memory).

---

### 📝 Your Turn!

(Since you are reviewing later, read the files and check your understanding mentally!)
