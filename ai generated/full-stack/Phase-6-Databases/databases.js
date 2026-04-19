// ============================================================
// PHASE 6 — DATABASES
// SQL vs NoSQL, MongoDB, PostgreSQL, ORMs
// ============================================================

// ─────────────────────────────────────────────────────────
// 1. SQL vs NoSQL
// ─────────────────────────────────────────────────────────

/*
┌────────────────────┬─────────────────────┬──────────────────────────┐
│ Feature            │ SQL (Relational)     │ NoSQL (Non-Relational)   │
├────────────────────┼─────────────────────┼──────────────────────────┤
│ Structure          │ Tables, rows, cols   │ Documents, key-value,    │
│                    │                     │ graphs, columns          │
│ Schema             │ Fixed (strict)       │ Flexible (schema-less)   │
│ Relationships      │ Foreign keys, JOINs  │ Embedding or reference   │
│ Query Language     │ SQL (standard)       │ Varies (JS-like in Mongo)│
│ Scaling            │ Vertical (scale up)  │ Horizontal (scale out)   │
│ ACID               │ Full ACID            │ Often eventual consistency│
│ Examples           │ PostgreSQL, MySQL    │ MongoDB, Redis, Cassandra │
│ Best For           │ Complex relations,   │ Flexible schema, large   │
│                    │ financial, ERP       │ scale, real-time         │
└────────────────────┴─────────────────────┴──────────────────────────┘

When to use SQL:
  - Complex relationships between data
  - Financial systems (need strict ACID)
  - Applications with well-defined, stable schemas
  - Analytics and reporting

When to use NoSQL (MongoDB):
  - Flexible/evolving schemas
  - Large volumes of unstructured data
  - Fast iterations / startups
  - User-generated content, catalogs, CMS
*/

// ─────────────────────────────────────────────────────────
// 2. MONGODB with Mongoose
// ─────────────────────────────────────────────────────────

/*
MongoDB: Document-based NoSQL database
- Stores data as JSON-like documents (BSON)
- Documents are grouped into Collections (like tables)
- Flexible schema — documents in same collection can differ

Mongoose: ODM (Object Data Modeling) library for MongoDB in Node.js
- Defines schemas and models
- Provides validation, middleware (hooks), query helpers

Install: npm install mongoose
*/

// Connection (connect.js):
/*
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
*/

// ─── DEFINING A SCHEMA AND MODEL ───────────────────────────
/*
const { Schema, model } = require("mongoose");

// Schema defines the SHAPE of documents
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,   // creates a unique index
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: true,
    select: false   // exclude from queries by default
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user"
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  tags: [String],   // array of strings
  address: {        // nested object
    street: String,
    city: String,
    country: { type: String, default: "IN" }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, {
  timestamps: true  // auto-adds createdAt, updatedAt
});

// Virtual — computed field (not stored in DB)
userSchema.virtual("displayName").get(function() {
  return `${this.name} <${this.email}>`;
});

// Instance method
userSchema.methods.toPublicJSON = function() {
  const { password, __v, ...user } = this.toObject();
  return user;
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Mongoose hooks (pre/post middleware)
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  // hash the password before saving
  const bcrypt = require("bcryptjs");
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Create the Model
const User = model("User", userSchema);
module.exports = User;
*/

// ─── CRUD Operations with Mongoose ─────────────────────────
/*
// CREATE
const newUser = await User.create({
  name: "Alice",
  email: "alice@example.com",
  password: "secret123"
});

// READ
const allUsers  = await User.find({});                         // all documents
const admins    = await User.find({ role: "admin" });          // filter
const activeAdmins = await User.find({ role: "admin", isActive: true });
const userById  = await User.findById(id);                     // by _id
const userByEmail = await User.findByEmail("alice@example.com"); // static method

// Filter, Project, Sort, Paginate
const users = await User
  .find({ role: "user" })           // filter
  .select("name email role")         // project (include only these fields)
  .sort({ createdAt: -1 })           // sort by newest first
  .skip((page - 1) * limit)          // pagination offset
  .limit(limit);                      // page size

// Count documents
const total = await User.countDocuments({ role: "user" });

// UPDATE
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { name: "New Name", isActive: false } },
  { new: true, runValidators: true }  // return updated doc, run validations
);

// MongoDB Update Operators:
// $set      → set field value
// $unset    → remove field
// $inc      → increment number
// $push     → add to array
// $pull     → remove from array
// $addToSet → add to array if not already present

await User.findByIdAndUpdate(id, { $push: { tags: "vip" } });
await User.findByIdAndUpdate(id, { $inc:  { loginCount: 1 } });

// DELETE
await User.findByIdAndDelete(id);
await User.deleteMany({ isActive: false });

// Populate (equivalent of JOIN)
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },  // reference to User
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  total: Number
});

// When querying, populate replaces the ObjectId with the actual document:
const order = await Order
  .findById(orderId)
  .populate("user", "name email")            // populate user, only name+email
  .populate("products", "name price image"); // populate products
*/

// ─────────────────────────────────────────────────────────
// 3. PostgreSQL with Node.js
// ─────────────────────────────────────────────────────────

/*
PostgreSQL is a powerful, open-source relational database.
Install driver: npm install pg

Key concepts:
- Tables (like spreadsheets with defined columns and types)
- Rows (records) and Columns (typed fields)
- Primary Keys and Foreign Keys
- JOINs (combine data from multiple tables)
- Transactions (all-or-nothing operations)
- Indexes (speed up queries)
*/

// Connection Pool (db.js):
/*
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
  max: 20,                  // max pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(-1);
});

module.exports = pool;
*/

// ─── SQL Queries ────────────────────────────────────────────
/*
const db = require("./db");

// CREATE TABLE (schema setup):
await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    role       VARCHAR(20) DEFAULT 'user',
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
`);

// INSERT (always use parameterized queries to prevent SQL injection!)
// NEVER: `INSERT INTO users VALUES ('${name}', '${email}')` ← SQL injection!
const { rows: [created] } = await db.query(
  `INSERT INTO users (name, email, password, role)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
  [name, email, hashedPassword, role]  // $1, $2... are positional params
);

// SELECT (basic)
const { rows: users } = await db.query(
  `SELECT id, name, email, role FROM users WHERE is_active = TRUE ORDER BY created_at DESC`
);

// SELECT with filter
const { rows: [user] } = await db.query(
  `SELECT * FROM users WHERE email = $1`,
  [email]
);

// UPDATE
await db.query(
  `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2`,
  [newName, userId]
);

// DELETE
await db.query(`DELETE FROM users WHERE id = $1`, [userId]);

// JOIN — combine data from multiple tables
const { rows: orders } = await db.query(`
  SELECT
    o.id,
    o.total,
    o.created_at,
    u.name AS user_name,
    u.email AS user_email
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id
  WHERE o.user_id = $1
  ORDER BY o.created_at DESC
  LIMIT $2 OFFSET $3
`, [userId, limit, offset]);

// TRANSACTION — ensure all-or-nothing:
const client = await db.connect();
try {
  await client.query("BEGIN");

  // Deduct from sender
  await client.query(
    `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
    [amount, senderId]
  );

  // Add to receiver
  await client.query(
    `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
    [amount, receiverId]
  );

  // Record the transfer
  await client.query(
    `INSERT INTO transfers (sender_id, receiver_id, amount) VALUES ($1, $2, $3)`,
    [senderId, receiverId, amount]
  );

  await client.query("COMMIT");
  console.log("Transfer successful!");

} catch (err) {
  await client.query("ROLLBACK"); // undo everything on error
  throw err;
} finally {
  client.release(); // return connection to pool
}
*/

// ─────────────────────────────────────────────────────────
// 4. ORMs — Drizzle ORM
// ─────────────────────────────────────────────────────────

/*
ORM (Object-Relational Mapper) maps database tables to JavaScript objects.
Drizzle ORM is a modern, type-safe ORM for TypeScript.

Why Drizzle?
- Fully type-safe (TypeScript native)
- SQL-like queries (you still feel "close" to SQL)
- Very performant (minimal overhead)
- Works with PostgreSQL, MySQL, SQLite

Install: npm install drizzle-orm drizzle-kit @drizzle-team/pg-core pg

// schema.ts — define your database schema in TypeScript
import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  name:      varchar("name", { length: 100 }).notNull(),
  email:     varchar("email", { length: 255 }).notNull().unique(),
  password:  text("password").notNull(),
  role:      varchar("role", { length: 20 }).default("user"),
  isActive:  boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const posts = pgTable("posts", {
  id:       serial("id").primaryKey(),
  title:    varchar("title", { length: 255 }).notNull(),
  content:  text("content"),
  userId:   integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});

// db.ts — create the database connection
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// queries.ts — type-safe queries
import { eq, and, like, gt, desc, count } from "drizzle-orm";
import { db } from "./db";
import { users, posts } from "./schema";

// SELECT all users
const allUsers = await db.select().from(users);

// SELECT with filter
const alice = await db.select().from(users).where(eq(users.email, "alice@example.com"));

// SELECT specific columns
const userNames = await db.select({ id: users.id, name: users.name }).from(users);

// INSERT
const [newUser] = await db.insert(users).values({
  name: "Alice",
  email: "alice@example.com",
  password: hashedPassword
}).returning();  // returns the inserted row

// UPDATE
await db.update(users)
  .set({ name: "New Name", updatedAt: new Date() })
  .where(eq(users.id, 1));

// DELETE
await db.delete(users).where(eq(users.id, 1));

// JOIN — type-safe!
const usersWithPosts = await db.select({
  userId: users.id,
  userName: users.name,
  postTitle: posts.title
})
.from(users)
.leftJoin(posts, eq(posts.userId, users.id))
.where(eq(users.isActive, true))
.orderBy(desc(users.createdAt))
.limit(10);
*/

console.log("Databases module loaded. See comments above for implementation.");
