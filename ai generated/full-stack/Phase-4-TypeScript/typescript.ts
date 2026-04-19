// ============================================================
// PHASE 4 — TYPESCRIPT ESSENTIALS
// Types, Interfaces, Generics, Tooling
// ============================================================

// NOTE: This file uses TypeScript syntax. Run with:
//   npx ts-node typescript.ts
// Or compile first:
//   npx tsc typescript.ts && node typescript.js

// ─────────────────────────────────────────────────────────
// 1. WHAT IS TYPESCRIPT?
// ─────────────────────────────────────────────────────────

/*
TypeScript is a SUPERSET of JavaScript that adds:
- Static type checking (catch errors at COMPILE time, not runtime)
- Better editor autocomplete and IntelliSense
- Self-documenting code (types are documentation)
- Works in both browser and Node.js

JavaScript:    Runs directly in browser/Node.js
TypeScript:    TypeScript → (tsc compiler) → JavaScript → Runs

Why TypeScript?
Without it:  function add(a, b) { return a + b; }
             add("5", 3) → "53" (no error! wrong behavior)

With it:     function add(a: number, b: number): number { return a + b; }
             add("5", 3) → ❌ Compile Error: string not assignable to number
*/

// ─────────────────────────────────────────────────────────
// 2. BASIC TYPES
// ─────────────────────────────────────────────────────────

// Primitive types with annotations
let username: string = "Alice";
let age: number = 28;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let fruits: string[] = ["apple", "banana", "cherry"];
let scores: number[] = [85, 92, 78];
let flags: Array<boolean> = [true, false, true]; // generic syntax

// Tuples — fixed-length array with specific types at each index
let pair: [string, number] = ["Alice", 28];
let rgb: [number, number, number] = [255, 128, 0];

// any — AVOID — turns off type checking (escape hatch, not a solution)
let dangerous: any = "could be anything";
dangerous = 42;
dangerous = true;

// unknown — SAFER than any — must check type before using
let userInput: unknown = "hello";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase()); // safe after type guard
}

// never — represents a value that NEVER occurs (exhaustive checks, infinite loops)
function throwError(message: string): never {
    throw new Error(message);
}

// void — function that returns nothing (implicitly undefined)
function logMessage(msg: string): void {
    console.log(msg);
}

// ─────────────────────────────────────────────────────────
// 3. TYPE ALIASES
// ─────────────────────────────────────────────────────────

// Type alias — name a type (works for primitives, unions, objects, functions)
type UserID = string;
type Score = number;
type Status = "pending" | "active" | "inactive"; // string literal union

const userId: UserID = "user_123";
const userStatus: Status = "active";
// const wrong: Status = "deleted"; // ❌ Error: not assignable

// Object type alias
type Point = {
    x: number;
    y: number;
};

type User = {
    id: UserID;
    name: string;
    email: string;
    age?: number; // ? = optional property
    readonly createdAt: Date; // readonly = cannot be reassigned
};

const point: Point = { x: 10, y: 20 };
const user: User = {
    id: "user_1",
    name: "Alice",
    email: "alice@example.com",
    createdAt: new Date()
};
// user.createdAt = new Date(); // ❌ Error: readonly property

// ─────────────────────────────────────────────────────────
// 4. INTERFACES
// ─────────────────────────────────────────────────────────

// Interface — similar to type alias, but specifically for objects
// Interfaces can be EXTENDED and MERGED; type aliases cannot

interface Animal {
    name: string;
    species: string;
    breathe(): string;
}

// Extending interfaces
interface Dog extends Animal {
    breed: string;
    bark(): string;
}

const rex: Dog = {
    name: "Rex",
    species: "Canis lupus familiaris",
    breed: "German Shepherd",
    breathe() { return `${this.name} breathes.`; },
    bark() { return "Woof!"; }
};

// Interface for functions
interface Formatter {
    (value: number, currency: string): string;
}

const formatCurrency: Formatter = (value, currency) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
};

console.log(formatCurrency(1999.99, "USD")); // "$1,999.99"

// Interface declaration merging (unique to interface)
interface Config {
    port: number;
}
interface Config {
    host: string; // merges into the same Config interface
}
const config: Config = { port: 3000, host: "localhost" }; // requires BOTH

// ─────────────────────────────────────────────────────────
// 5. TYPE ALIAS vs INTERFACE
// ─────────────────────────────────────────────────────────

/*
┌──────────────────────────────────┬────────────┬───────────┐
│ Feature                          │ type alias │ interface │
├──────────────────────────────────┼────────────┼───────────┤
│ Objects                          │     ✅     │    ✅     │
│ Primitives (type ID = string)    │     ✅     │    ❌     │
│ Unions (A | B)                   │     ✅     │    ❌     │
│ Intersections (A & B)            │     ✅     │    ✅ extends│
│ Declaration merging              │     ❌     │    ✅     │
│ Classes can implement            │     ✅     │    ✅     │
└──────────────────────────────────┴────────────┴───────────┘

Recommendation:
- Use interface for objects you want to extend (API shapes, class contracts)
- Use type for everything else (unions, primitives, intersections)
*/

// ─────────────────────────────────────────────────────────
// 6. UNION AND INTERSECTION TYPES
// ─────────────────────────────────────────────────────────

// Union (|) — value can be ONE OF these types
type StringOrNumber = string | number;
type ID = string | number;

function formatId(id: ID): string {
    if (typeof id === "string") return id.toUpperCase();
    return `ID-${id}`;
}

console.log(formatId("abc123")); // "ABC123"
console.log(formatId(42));       // "ID-42"

// Discriminated Union — best practice for handling different shapes
type SuccessResponse = {
    status: "success";
    data: unknown;
    message: string;
};

type ErrorResponse = {
    status: "error";
    code: number;
    message: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
    if (response.status === "success") {
        // TypeScript NARROWS the type here → knows it's SuccessResponse
        console.log("Data:", response.data);
    } else {
        // TypeScript knows it's ErrorResponse
        console.error(`Error ${response.code}:`, response.message);
    }
}

// Intersection (&) — value must satisfy ALL these types
type Timestamped = {
    createdAt: Date;
    updatedAt: Date;
};

type Named = {
    name: string;
};

type Product = Named & Timestamped & {
    price: number;
    category: string;
};

const product: Product = {
    name: "Laptop",
    price: 999,
    category: "Electronics",
    createdAt: new Date(),
    updatedAt: new Date()
};

// ─────────────────────────────────────────────────────────
// 7. GENERICS
// ─────────────────────────────────────────────────────────

// Generic FUNCTION — works with any type while keeping type safety
function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("hello"));  // type: string
console.log(identity<number>(42));       // type: number
// TypeScript can infer: identity("hello") — T = string automatically

// Generic Array functions
function firstItem<T>(arr: T[]): T | undefined {
    return arr[0];
}
function lastItem<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

console.log(firstItem([1, 2, 3]));       // 1 (type: number)
console.log(firstItem(["a", "b"]));      // "a" (type: string)

// Generic with default type parameter
function createArray<T = string>(length: number, fill: T): T[] {
    return Array(length).fill(fill);
}
console.log(createArray(3, "hello")); // ["hello", "hello", "hello"]
console.log(createArray(3, 0));       // [0, 0, 0]

// Generic INTERFACE
interface ApiResult<T> {
    data: T;
    status: "success" | "error";
    message: string;
    timestamp: Date;
}

interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
}

type UserApiResult = ApiResult<User>;
type ProductList = PaginatedResult<Product>;

// Generic CONSTRAINTS — restrict what types T can be
interface HasLength {
    length: number;
}

function getLength<T extends HasLength>(arg: T): number {
    return arg.length; // safe because T must have .length
}

console.log(getLength("hello"));        // 5 (string has .length)
console.log(getLength([1, 2, 3]));      // 3 (array has .length)
// console.log(getLength(42));          // ❌ Error: number has no .length

// keyof — type of keys of an object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const myUser = { name: "Alice", age: 28, email: "alice@example.com" };
console.log(getProperty(myUser, "name"));  // "Alice" (type: string)
console.log(getProperty(myUser, "age"));   // 28 (type: number)
// console.log(getProperty(myUser, "phone")); // ❌ Error: 'phone' not in User

// ─────────────────────────────────────────────────────────
// 8. UTILITY TYPES (Built-in TypeScript helpers)
// ─────────────────────────────────────────────────────────

type FullUser = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    createdAt: Date;
};

// Partial<T> — all properties optional
type UpdateUserDto = Partial<FullUser>;
const update: UpdateUserDto = { name: "New Name" }; // only name, rest optional

// Required<T> — all properties required
type StrictUser = Required<UpdateUserDto>;

// Pick<T, K> — pick specific properties
type PublicUser = Pick<FullUser, "id" | "name" | "email" | "role">;
// removes password — safe to send to client!

// Omit<T, K> — omit specific properties
type UserWithoutPassword = Omit<FullUser, "password">;
type CreateUserDto = Omit<FullUser, "id" | "createdAt">;

// Readonly<T> — all properties readonly
type ImmutableUser = Readonly<FullUser>;

// Record<K, V> — object with keys of type K and values of type V
type UsersByRole = Record<"admin" | "user" | "moderator", FullUser[]>;
type HttpStatusMap = Record<number, string>;

const statusMap: HttpStatusMap = {
    200: "OK",
    404: "Not Found",
    500: "Internal Server Error"
};

// ReturnType<T> — get the return type of a function
function createSession(userId: number) {
    return { token: "jwt...", userId, expiresAt: new Date() };
}
type Session = ReturnType<typeof createSession>;
// Session = { token: string; userId: number; expiresAt: Date; }

// ─────────────────────────────────────────────────────────
// 9. tsconfig.json — Explained
// ─────────────────────────────────────────────────────────

/*
A tsconfig.json file configures the TypeScript compiler.

{
  "compilerOptions": {
    "target": "ES2022",          // Output JS version
    "module": "CommonJS",         // Module system (CommonJS for Node, ESNext for browser)
    "lib": ["ES2022", "DOM"],     // Type definitions to include
    "outDir": "./dist",           // Where to put compiled JS files
    "rootDir": "./src",           // Where your TS files are
    "strict": true,               // Enable ALL strict type checks ← ALWAYS USE THIS
    "esModuleInterop": true,      // Better import compatibility
    "skipLibCheck": true,         // Skip type-checking in .d.ts files (faster)
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,    // Allow importing .json files
    "baseUrl": "./src",           // Base directory for non-relative imports
    "paths": {                    // Path aliases
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  },
  "include": ["src/**/* "],       // Files to compile
"exclude": ["node_modules", "dist"]
}
*/
