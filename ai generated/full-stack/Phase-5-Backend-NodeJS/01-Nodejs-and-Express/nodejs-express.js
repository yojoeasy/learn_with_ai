// ============================================================
// PHASE 5 — BACKEND ENGINEERING: Node.js & Express
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. NODE.JS ARCHITECTURE
// ─────────────────────────────────────────────────────────

/*
Node.js is a JavaScript RUNTIME (not a framework!) built on Chrome's V8 engine.
It allows you to run JavaScript on the SERVER.

Key characteristics:
- Single-threaded (one main thread)
- Non-blocking I/O (Event loop)
- Event-driven (callbacks, promises, async/await)

HOW Node.js handles many clients without many threads:

Traditional server (PHP, Java):
  Client 1 → Thread 1 (waiting for DB... blocked)
  Client 2 → Thread 2 (waiting for file... blocked)
  Client 3 → Thread 3 (waiting for API... blocked)
  → Needs many threads → expensive memory

Node.js:
  Client 1 → Event Loop → kicks off DB request → continues
  Client 2 → Event Loop → kicks off file read  → continues
  Client 3 → Event Loop → kicks off API call   → continues
  → ONE thread handles all → DB result arrives → callback fires! ✅
*/

// ─────────────────────────────────────────────────────────
// 2. EVENT LOOP: Microtasks vs Macrotasks
// ─────────────────────────────────────────────────────────

/*
The Event Loop processes tasks in this ORDER each iteration (tick):

1. Call Stack        (synchronous code runs IMMEDIATELY)
2. Microtask Queue   (Promises, queueMicrotask) ← HIGH PRIORITY
3. Macrotask Queue   (setTimeout, setInterval, I/O) ← LOWER PRIORITY

ORDER: Call Stack → Microtasks → 1 Macrotask → Microtasks → 1 Macrotask...
*/

console.log("=== Event Loop Order ===");

console.log("1. Sync: Start");                   // 1st

setTimeout(() => console.log("4. Macrotask: setTimeout"), 0);  // 4th (macrotask)

Promise.resolve().then(() => {
    console.log("3. Microtask: Promise 1");         // 3rd (microtask)
    Promise.resolve().then(() => {
        console.log("3b. Microtask: nested Promise"); // still before macrotask!
    });
});

queueMicrotask(() => console.log("3a. Microtask: queueMicrotask")); // microtask

console.log("2. Sync: End");                     // 2nd

/*
Output order:
1. Sync: Start
2. Sync: End
3. Microtask: Promise 1
3a. Microtask: queueMicrotask
3b. Microtask: nested Promise
4. Macrotask: setTimeout
*/

// ─────────────────────────────────────────────────────────
// 3. HTTP MODULE — Your First Node.js Server
// ─────────────────────────────────────────────────────────

/*
Save this as server.js and run with: node server.js

const http = require("http");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  // Set response headers
  res.setHeader("Content-Type", "application/json");

  if (url === "/" && method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Welcome to the API!" }));

  } else if (url === "/users" && method === "GET") {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ];
    res.writeHead(200);
    res.end(JSON.stringify(users));

  } else if (url === "/users" && method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      const newUser = JSON.parse(body);
      console.log("New user:", newUser);
      res.writeHead(201);
      res.end(JSON.stringify({ id: Date.now(), ...newUser }));
    });

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
*/

// ─────────────────────────────────────────────────────────
// 4. EXPRESS.JS — Building a Proper API
// ─────────────────────────────────────────────────────────

/*
Express is a minimal, fast Node.js web framework.
Install: npm install express

Key concepts:
- app.get/post/put/patch/delete → route handlers
- req → request object (headers, body, params, query)
- res → response object (send, json, status, redirect)
- middleware → functions that run BETWEEN request and response
*/

// Basic Express app (server.js):
/*
const express = require("express");
const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────
app.use(express.json());              // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cors());                      // enable CORS (npm install cors)

// Custom middleware (logging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // MUST call next() to pass control to the next handler
});

// ─── ROUTES ────────────────────────────────────────────────

// GET all users
app.get("/api/users", async (req, res) => {
  // Query parameters: /api/users?page=1&limit=10&role=admin
  const { page = 1, limit = 10, role } = req.query;
  
  // ... fetch from DB ...
  const users = [{ id: 1, name: "Alice", role: "admin" }];
  res.json({ users, page, limit });
});

// GET single user
app.get("/api/users/:id", async (req, res) => {
  // URL parameters: /api/users/123 → req.params.id = "123"
  const { id } = req.params;
  
  // ... fetch user from DB ...
  const user = { id, name: "Alice" };
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// POST create user
app.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  
  // ... save to DB ...
  const newUser = { id: Date.now(), name, email, createdAt: new Date() };
  res.status(201).json(newUser);
});

// PUT update user (full replacement)
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  // ... update in DB ...
  res.json({ id, ...data, updatedAt: new Date() });
});

// PATCH partial update
app.patch("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // ... partial update in DB ...
  res.json({ id, ...updates });
});

// DELETE user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  // ... delete from DB ...
  res.status(204).send(); // 204 No Content
});

// Start server
app.listen(3000, () => console.log("API running on http://localhost:3000"));
*/

// ─────────────────────────────────────────────────────────
// 5. RESTful API DESIGN PRINCIPLES
// ─────────────────────────────────────────────────────────

/*
REST (Representational State Transfer) API Design Rules:

1. Use NOUNS for resources (not verbs):
   ✅ GET /users
   ❌ GET /getUsers

2. Use HTTP methods correctly:
   GET    → Read   (idempotent, safe)
   POST   → Create
   PUT    → Replace entire resource (idempotent)
   PATCH  → Partially update (non-idempotent)
   DELETE → Delete (idempotent)

3. Use hierarchical URLs for nested resources:
   GET  /users/:id/orders        → all orders for a user
   GET  /users/:id/orders/:oid   → specific order
   POST /users/:id/orders        → create order for user

4. Use query params for filtering/sorting/pagination:
   GET /products?category=electronics&sort=price&page=2&limit=20

5. Return appropriate status codes:
   200 OK              → success (GET, PUT, PATCH)
   201 Created         → POST success
   204 No Content      → DELETE success
   400 Bad Request     → invalid input
   401 Unauthorized    → not authenticated
   403 Forbidden       → authenticated but no permission
   404 Not Found       → resource doesn't exist
   409 Conflict        → resource already exists
   422 Unprocessable   → validation failed
   500 Internal Error  → server bug

6. Return consistent JSON structure:
*/

// Standard API Response format:
const successResponse = (data, message = "Success", meta = {}) => ({
    status: "success",
    message,
    data,
    meta,
    timestamp: new Date().toISOString()
});

const errorResponse = (message, code = 400, details = null) => ({
    status: "error",
    message,
    code,
    details,
    timestamp: new Date().toISOString()
});

// Usage:
console.log(successResponse([{ id: 1, name: "Alice" }], "Users fetched", { total: 1 }));
console.log(errorResponse("Email is required", 400, { field: "email" }));

// ─────────────────────────────────────────────────────────
// 6. FILE SYSTEM (fs module)
// ─────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

// Synchronous (BLOCKS everything — avoid in production):
try {
    const data = fs.readFileSync("./example.txt", "utf8");
    console.log("Sync read:", data);
} catch (err) {
    console.log("File not found (expected in this example)");
}

// Asynchronous with callbacks (old way):
fs.readFile("./example.txt", "utf8", (err, data) => {
    if (err) { return; /* file not found, skip */ }
    console.log("Callback read:", data);
});

// Asynchronous with promises (modern way):
async function readFile() {
    try {
        const data = await fsPromises.readFile("./example.txt", "utf8");
        console.log("Async read:", data);
    } catch (err) {
        console.log("File read error:", err.code);
    }
}

// Writing files:
async function writeExample() {
    // Write (creates or overwrites):
    await fsPromises.writeFile("./output.txt", "Hello from Node.js!\n");

    // Append:
    await fsPromises.appendFile("./output.txt", "Appended line\n");

    // Create directory (mkdir -p equivalent):
    await fsPromises.mkdir("./uploads/images", { recursive: true });

    // Delete a file:
    // await fsPromises.unlink("./output.txt");

    console.log("File operations complete");
}

readFile();
// writeExample(); // commented out to avoid creating files during demo

// Path utilities:
const filePath = path.join(__dirname, "uploads", "photo.jpg");
console.log("Full path:", filePath);
console.log("Dir:", path.dirname(filePath));
console.log("Base:", path.basename(filePath));
console.log("Ext:", path.extname(filePath));

// ─────────────────────────────────────────────────────────
// 7. WORKING WITH REQUEST AND RESPONSE OBJECTS
// ─────────────────────────────────────────────────────────

/*
In Express, every route handler receives (req, res, next):

REQUEST OBJECT (req):
  req.params       → URL parameters   (/users/:id → req.params.id)
  req.query        → Query string     (?page=1 → req.query.page)
  req.body         → Request body     (JSON payload, form data)
  req.headers      → HTTP headers     (Authorization, Content-Type)
  req.method       → HTTP method      ("GET", "POST", "PUT", etc.)
  req.url          → Request URL
  req.ip           → Client IP address
  req.cookies      → Parsed cookies   (with cookie-parser middleware)

RESPONSE OBJECT (res):
  res.json(data)             → Send JSON response (auto Content-Type)
  res.send(data)             → Send data (string, buffer, etc.)
  res.status(code)           → Set status code (chain with .json())
  res.status(201).json(data) → Status + JSON
  res.redirect("/new-url")   → Redirect client
  res.set("Header", "value") → Set a response header
  res.cookie("name", "value")→ Set a cookie
  res.sendFile(path)         → Send a file
  res.download(path)         → Trigger file download

MIDDLEWARE:
  A middleware is a function with (req, res, next) signature.
  It can:
  - Execute code
  - Modify req and res
  - End the request-response cycle
  - Call next() to pass to the next middleware/route

  Types:
  - Application-level: app.use()
  - Router-level: router.use()
  - Error-handling: (err, req, res, next) — 4 arguments!
  - Built-in: express.json(), express.static()
  - Third-party: cors, morgan, helmet, multer
*/

// Error handling middleware (must be LAST, and must have 4 params):
/*
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
});
*/
