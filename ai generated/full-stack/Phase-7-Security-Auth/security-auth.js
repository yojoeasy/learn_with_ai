// ============================================================
// PHASE 7 — SECURITY & AUTHENTICATION
// JWT, bcrypt, OAuth 2.0, RBAC, WebSockets, Rate Limiting
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. AUTHENTICATION vs AUTHORIZATION
// ─────────────────────────────────────────────────────────

/*
AUTHENTICATION — "Who are you?"
  Verifying the identity of a user.
  Example: Logging in with email + password.

AUTHORIZATION — "What are you allowed to do?"
  Verifying what an authenticated user is permitted to access.
  Example: Only admins can delete users.

Flow:
  1. User logs in (Authentication) → receives a TOKEN
  2. User makes a request → sends TOKEN in header
  3. Server verifies token (Authentication again)
  4. Server checks if user has permission (Authorization)
  5. Allow or deny the action
*/

// ─────────────────────────────────────────────────────────
// 2. PASSWORD HASHING with bcrypt
// ─────────────────────────────────────────────────────────

/*
NEVER store plain-text passwords. ALWAYS hash them.

How bcrypt works:
1. Generates a random SALT (makes each hash unique even for same password)
2. Combines password + salt and runs it through the Blowfish cipher many times (cost factor)
3. Stores the salt + hash together in one string

Cost factor (rounds): higher = slower to crack, but also slower to compute
- 10 rounds ≈ 65ms (good balance for most apps)
- 12 rounds ≈ 250ms (use for high-security apps)

Install: npm install bcryptjs

const bcrypt = require("bcryptjs");

// Hashing a password:
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
  // OR: bcrypt.hash(password, 10) — generates salt automatically
}

// Verifying a password:
async function verifyPassword(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed); // returns boolean
}

// Usage in user registration:
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already registered" });
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Save to database
  const user = await User.create({ name, email, password: hashedPassword });
  
  res.status(201).json({ id: user._id, name, email });
});

// Usage in login:
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Find user (include password which is normally excluded)
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  
  // Generate token...
  const token = generateJWT(user);
  res.json({ token, user: user.toPublicJSON() });
});
*/

// ─────────────────────────────────────────────────────────
// 3. JWT — JSON Web Tokens
// ─────────────────────────────────────────────────────────

/*
JWT is a compact, self-contained token for securely transmitting information.
It's STATELESS — the server doesn't need to look up session in DB!

JWT Structure: header.payload.signature
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.   ← Header (base64)
  eyJpZCI6IjEyMyIsInJvbGUiOiJ1c2VyIn0.      ← Payload (base64)
  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← HMAC Signature

Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "id": "123", "role": "user", "iat": 1234567890, "exp": 1234657890 }
         ↑ NOT encrypted! Don't put sensitive data here
         Can be decoded by anyone. But can't be TAMPERED without breaking signature.

Signature: HMACSHA256(Base64(header) + "." + Base64(payload), SECRET_KEY)
           → Only validated if you have the SECRET_KEY

Install: npm install jsonwebtoken

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;              // strong random secret
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // 7 days

// Generating a token:
function generateJWT(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },  // payload
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verifying a token:
function verifyJWT(token) {
  return jwt.verify(token, JWT_SECRET); // throws if invalid/expired
}

// Authentication middleware:
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  const token = authHeader.slice(7); // remove "Bearer "
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Protect routes:
app.get("/api/profile", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Refresh Tokens:
// Access token:  short-lived (15 minutes) — used for API requests
// Refresh token: long-lived (30 days) — used ONLY to get a new access token
// Stored:  Access token in memory or localStorage; Refresh in httpOnly cookie
*/

// ─────────────────────────────────────────────────────────
// 4. ROLE-BASED ACCESS CONTROL (RBAC)
// ─────────────────────────────────────────────────────────

/*
RBAC restricts system access based on user ROLES.
Each role has specific PERMISSIONS.

Roles:   user, moderator, admin, superadmin
Permissions: read:posts, write:posts, delete:posts, manage:users

// Authorization middleware:
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
}

// Example routes:
app.get("/api/posts",           authenticate,                    getPosts);   // any authenticated user
app.post("/api/posts",          authenticate,                    createPost); // any authenticated user
app.delete("/api/posts/:id",    authenticate, authorize("admin", "moderator"), deletePost);
app.get("/api/admin/users",     authenticate, authorize("admin"),             getAllUsers);
app.delete("/api/admin/users/:id", authenticate, authorize("admin"),         deleteUser);
*/

// ─────────────────────────────────────────────────────────
// 5. OAUTH 2.0 and OPENID CONNECT (OIDC)
// ─────────────────────────────────────────────────────────

/*
OAuth 2.0 — AUTHORIZATION framework (gives your app access to user's resources)
OIDC — Authentication layer built ON TOP of OAuth 2.0

OAuth 2.0 Authorization Code flow (most common, for web apps):

Step 1: User clicks "Login with Google"
Step 2: Your app redirects to Google's auth server:
  https://accounts.google.com/o/oauth2/auth?
    client_id=YOUR_CLIENT_ID&
    redirect_uri=https://yourapp.com/callback&
    response_type=code&
    scope=openid email profile

Step 3: User logs into Google, grants permission
Step 4: Google redirects back with an AUTHORIZATION CODE:
  https://yourapp.com/callback?code=4/abc123...

Step 5: Your SERVER exchanges code for tokens (server-to-server, secret stays safe):
  POST https://oauth2.googleapis.com/token
  { code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }

Step 6: Google returns access_token, id_token (OIDC), refresh_token

Step 7: Use id_token (JWT) to get user info (email, name, picture)

Step 8: Create/find user in your DB, generate your own JWT

Key Actors:
- Resource Owner: the user
- Client: your application
- Authorization Server: Google, GitHub, etc.
- Resource Server: Google's API, GitHub's API

Google Zanzibar Authorization Model (Brief):
- Google's internal auth system that powers Docs, Drive sharing
- Based on RELATIONSHIP TUPLES: (object, relation, user)
  E.g., (document:123, viewer, user:alice)
- Enables recursive permission checks (groups within groups)
- Implemented by: Authzed, Ory Keto, SpiceDB (open source alternatives)
*/

// ─────────────────────────────────────────────────────────
// 6. REAL-TIME with WebSockets (socket.io)
// ─────────────────────────────────────────────────────────

/*
Install: npm install socket.io

Server-side (server.js):
const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");

const app    = express();
const server = http.createServer(app); // create HTTP server
const io     = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

// Namespace + events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  // Join a room (e.g., chat room)
  socket.on("join:room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user:joined", { id: socket.id }); // notify others
  });
  
  // Receive a message from client
  socket.on("message:send", (data) => {
    const { roomId, message, userId } = data;
    
    // Broadcast to ALL in the room (including sender):
    io.to(roomId).emit("message:received", {
      id: Date.now(),
      message,
      userId,
      timestamp: new Date()
    });
  });
  
  // Typing indicator
  socket.on("user:typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("user:typing", { userId }); // send to others in room
  });
  
  // Disconnection
  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, reason);
  });
});

server.listen(3000);

// Client-side (browser):
const socket = io("http://localhost:3000");

socket.on("connect", () => console.log("Connected:", socket.id));

// Join a room
socket.emit("join:room", "room123");

// Send a message
socket.emit("message:send", {
  roomId: "room123",
  message: "Hello everyone!",
  userId: "user_456"
});

// Listen for messages
socket.on("message:received", (data) => {
  console.log(`${data.userId}: ${data.message}`);
});

Polling vs SSE vs WebSocket:

Polling:   Client requests every N seconds (wasteful)
SSE:       Server pushes to client (one-way only)
WebSocket: Full duplex, persistent, low latency (use for chat, games, live dashboards)
*/

// ─────────────────────────────────────────────────────────
// 7. API RATE LIMITING
// ─────────────────────────────────────────────────────────

/*
Rate limiting protects your API from:
- DDoS attacks
- Brute force attacks (too many login attempts)
- Abuse by over-consuming clients

Install: npm install express-rate-limit

const rateLimit = require("express-rate-limit");

// Global limiter — applies to all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again after 15 minutes"
  }
});
app.use(globalLimiter);

// Strict limiter for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // only 5 login attempts per 15 min
  skipSuccessfulRequests: true, // don't count successful logins
  message: { status: "error", message: "Too many login attempts" }
});
app.post("/api/auth/login",    authLimiter, login);
app.post("/api/auth/register", authLimiter, register);

// Custom rate limit per user (not just IP) — use Redis for distributed systems:
const RedisStore = require("rate-limit-redis");
const { createClient } = require("redis");

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,              // 30 requests per minute
  keyGenerator: (req) => req.user?.id || req.ip, // per user, not per IP
  store: new RedisStore({ client: redisClient })  // works across multiple servers!
});
*/

console.log("Security & Auth module loaded. See comments above for implementation details.");
