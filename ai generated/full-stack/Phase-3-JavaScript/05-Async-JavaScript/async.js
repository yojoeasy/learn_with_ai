// ============================================================
// PHASE 3 — ASYNCHRONOUS JAVASCRIPT
// Callbacks, Promises, Async/Await, Fetch
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. WHY ASYNCHRONOUS PROGRAMMING?
// ─────────────────────────────────────────────────────────

/*
JavaScript is SINGLE-THREADED — it runs one thing at a time.

Synchronous = blocking: code waits for each operation to finish.
Asynchronous = non-blocking: code kicks off a task and moves on.

Without async:
  1. Fetch user from server (3 second wait) ← FROZEN browser!
  2. Process data
  3. Update UI

With async:
  1. Kick off fetch (returns immediately)
  2. Continue running other code
  3. When fetch is done → handle the result
*/

// ─────────────────────────────────────────────────────────
// 2. setTimeout and setInterval
// ─────────────────────────────────────────────────────────

console.log("=== setTimeout & setInterval ===");

// setTimeout — run code ONCE after a delay (milliseconds)
console.log("Before timeout");

const timeoutId = setTimeout(() => {
    console.log("Runs after 2 seconds");
}, 2000);

console.log("After setTimeout (doesn't block!) ");

// clearTimeout — cancel before it fires
// clearTimeout(timeoutId);

// setInterval — run code REPEATEDLY at intervals
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Tick #${count}`);
    if (count >= 3) {
        clearInterval(intervalId); // Stop after 3 ticks
        console.log("Interval stopped");
    }
}, 1000);

// ─────────────────────────────────────────────────────────
// 3. CALLBACKS — The old way
// ─────────────────────────────────────────────────────────

console.log("\n=== Callbacks ===");

// A callback is a function passed as an argument to another function,
// to be executed when an asynchronous operation completes.

function fetchUser(id, callback) {
    // Simulating a network request (2 second delay)
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error("Invalid user ID"), null);
            return;
        }
        const user = { id, name: "Alice", email: "alice@example.com" };
        callback(null, user); // Node.js convention: error first!
    }, 1000);
}

fetchUser(1, (error, user) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    console.log("Got user:", user.name);
});

// CALLBACK HELL — the problem with nested callbacks
function getUser(id, cb) {
    setTimeout(() => cb(null, { id, name: "Alice" }), 500);
}
function getOrders(userId, cb) {
    setTimeout(() => cb(null, [{ id: 101, total: 49.99 }]), 500);
}
function getOrderDetails(orderId, cb) {
    setTimeout(() => cb(null, { id: orderId, product: "Laptop" }), 500);
}

// Callback hell (pyramid of doom!)
getUser(1, (err, user) => {
    if (err) return console.error(err);
    getOrders(user.id, (err, orders) => {
        if (err) return console.error(err);
        getOrderDetails(orders[0].id, (err, details) => {
            if (err) return console.error(err);
            console.log(`${user.name} ordered a ${details.product}`);
            // Imagine 3 more levels... nightmare.
        });
    });
});

// ─────────────────────────────────────────────────────────
// 4. PROMISES — A better way
// ─────────────────────────────────────────────────────────

console.log("\n=== Promises ===");

/*
A Promise is an object that represents the EVENTUAL completion
(or failure) of an asynchronous operation.

States:
- pending  → operation in progress
- fulfilled → operation succeeded (resolved)
- rejected  → operation failed
*/

// Creating a Promise
function fetchUserPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error("Invalid user ID"));
                return;
            }
            resolve({ id, name: "Bob", email: "bob@example.com" });
        }, 500);
    });
}

// Consuming a Promise with .then() / .catch() / .finally()
fetchUserPromise(1)
    .then(user => {
        console.log("User fetched:", user.name);
        return user; // return value becomes next .then()'s argument
    })
    .then(user => {
        console.log("Processing user:", user.email);
    })
    .catch(error => {
        console.error("Error:", error.message); // catches any error in the chain
    })
    .finally(() => {
        console.log("Done (always runs)");
    });

// Promise chaining (vs callback hell):
function getUser2(id) { return new Promise(res => setTimeout(() => res({ id, name: "Alice" }), 200)); }
function getOrders2(userId) { return new Promise(res => setTimeout(() => res([{ id: 101 }]), 200)); }
function getDetails2(orderId) { return new Promise(res => setTimeout(() => res({ product: "Laptop" }), 200)); }

// Clean chain — flat, readable!
getUser2(1)
    .then(user => {
        console.log("User:", user.name);
        return getOrders2(user.id);
    })
    .then(orders => {
        console.log("Orders:", orders.length);
        return getDetails2(orders[0].id);
    })
    .then(details => {
        console.log("Product:", details.product);
    })
    .catch(err => console.error(err));

// Promise.all — run MULTIPLE promises in PARALLEL, wait for ALL
Promise.all([
    getUser2(1),
    getOrders2(1),
    getDetails2(101)
]).then(([user, orders, details]) => {
    console.log("All done:", user.name, orders.length, details.product);
});

// Promise.allSettled — like Promise.all but waits for ALL even if some fail
Promise.allSettled([
    Promise.resolve("success"),
    Promise.reject(new Error("oops")),
    Promise.resolve("another success")
]).then(results => {
    results.forEach(r => {
        if (r.status === "fulfilled") console.log("✅", r.value);
        else console.log("❌", r.reason.message);
    });
});

// Promise.race — resolves/rejects with FIRST to settle
Promise.race([
    new Promise(res => setTimeout(() => res("slow"), 1000)),
    new Promise(res => setTimeout(() => res("fast"), 100)),
]).then(console.log); // "fast"

// Promise.any — resolves with FIRST to FULFILL (ignores rejections)
Promise.any([
    Promise.reject(new Error("fail 1")),
    new Promise(res => setTimeout(() => res("first success"), 100)),
    Promise.resolve("instant success")
]).then(console.log); // "instant success"

// ─────────────────────────────────────────────────────────
// 5. ASYNC / AWAIT — The modern way (syntactic sugar over Promises)
// ─────────────────────────────────────────────────────────

console.log("\n=== Async / Await ===");

/*
async/await makes asynchronous code LOOK and READ like synchronous code.
Under the hood, it still uses Promises.

- async function always returns a Promise
- await pauses execution until the Promise resolves
- Must be inside an async function
*/

// Basic async/await
async function loadUserData(id) {
    try {
        const user = await getUser2(id);
        console.log("async/await user:", user.name);

        const orders = await getOrders2(user.id);
        console.log("async/await orders:", orders.length);

        const details = await getDetails2(orders[0].id);
        console.log("async/await product:", details.product);

        return details;
    } catch (error) {
        console.error("Error in loadUserData:", error.message);
        throw error; // re-throw if needed
    } finally {
        console.log("loadUserData complete");
    }
}

loadUserData(1).then(console.log);

// Parallel execution with async/await (using Promise.all)
async function loadAllUserData(id) {
    try {
        const user = await getUser2(id);

        // Run these IN PARALLEL (don't await one by one!)
        const [orders, profile] = await Promise.all([
            getOrders2(user.id),
            getDetails2(101)
        ]);

        return { user, orders, profile };
    } catch (error) {
        console.error(error);
    }
}

// ─────────────────────────────────────────────────────────
// 6. FETCH API — Making HTTP Requests from the Browser
// ─────────────────────────────────────────────────────────

console.log("\n=== Fetch API ===");

/*
The Fetch API is a browser API for making HTTP requests.
It returns a Promise.

NOTE: This example uses a public API — run in browser or with node-fetch.
*/

async function getPublicData() {
    try {
        // GET request
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON body
        const data = await response.json();
        console.log("Post title:", data.title);

    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
}

// POST request with Fetch
async function createPost(data) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer mytoken123"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    return result;
}

// Call our async functions (node.js can run these if node-fetch is installed)
// getPublicData();
// createPost({ title: "My Post", body: "Hello World", userId: 1 });

// ─────────────────────────────────────────────────────────
// 7. CROSS-ORIGIN REQUESTS (CORS)
// ─────────────────────────────────────────────────────────

/*
CORS (Cross-Origin Resource Sharing) is a browser security mechanism.

- A webpage at http://localhost:3000 tries to fetch from http://api.example.com
- Browser BLOCKS this by default (different origin)
- Server must send CORS headers to allow it:
  
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization

In Express (Node.js):
  const cors = require("cors");
  app.use(cors({ origin: "http://localhost:3000" }));

Same Origin = same protocol + same domain + same port:
  http://example.com:3000 and http://example.com:4000 → DIFFERENT origins
  https://example.com and http://example.com → DIFFERENT origins (protocol)
*/

// ─────────────────────────────────────────────────────────
// 8. ERROR HANDLING
// ─────────────────────────────────────────────────────────

console.log("\n=== Error Handling ===");

// try-catch-finally
function divide(a, b) {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
}

try {
    console.log(divide(10, 2)); // 5
    console.log(divide(10, 0)); // throws!
} catch (error) {
    console.error("Caught:", error.message);
} finally {
    console.log("Always runs");
}

// Custom Error classes
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
        this.status = 400;
    }
}

class NotFoundError extends Error {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`);
        this.name = "NotFoundError";
        this.status = 404;
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        throw new ValidationError("Invalid email format", "email");
    }
    return true;
}

try {
    validateEmail("not-an-email");
} catch (error) {
    if (error instanceof ValidationError) {
        console.error(`Validation failed on '${error.field}': ${error.message}`);
    } else {
        throw error; // re-throw unknown errors
    }
}

// In async code:
async function getUser3(id) {
    await new Promise(res => setTimeout(res, 100)); // simulate delay
    if (id <= 0) throw new NotFoundError("User", id);
    return { id, name: "Alice" };
}

getUser3(-1)
    .then(user => console.log(user))
    .catch(error => {
        if (error instanceof NotFoundError) {
            console.error(`${error.status}: ${error.message}`);
        }
    });
