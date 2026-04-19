// Practice file for Event Loop

console.log("A. Synchronous code started");

// Macrotask
setTimeout(() => {
    console.log("D. setTimeout Finished (Macrotask/Slowest)");
}, 0);

// Microtask
Promise.resolve().then(() => {
    console.log("C. Promise Resolved (Microtask/Fast VIP Queue)");
});

console.log("B. Synchronous code ended");

// What is the order?
// A -> B -> C -> D
