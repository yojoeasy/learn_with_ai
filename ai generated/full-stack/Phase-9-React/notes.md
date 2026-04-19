# ⚛️ Phase 9: React — Modern Frontend Development

## What is React?

React is a JavaScript **library** (not a framework) for building **user interfaces**. Created by Facebook (Meta) in 2013.

**Core idea:** Build UIs as a tree of **reusable components**.
Each component manages its own state and renders based on that state.

### Role in Web Development
```
HTML  → Structure
CSS   → Styling
JS    → Behavior
React → Organizes UI into components, manages state, updates DOM efficiently
```

### Virtual DOM
React uses a **Virtual DOM** — a lightweight JavaScript representation of the real DOM.

When state changes:
1. React creates a new Virtual DOM tree.
2. **Diffing algorithm** compares it with the previous tree.
3. React calculates the **minimum** number of real DOM operations needed.
4. Only those specific changes are applied to the real DOM.

```
Real DOM operations are SLOW (reflow, repaint).
Virtual DOM operations are FAST (in-memory JavaScript objects).
React batches real DOM updates → 🚀 performance!
```

---

## Setting Up React with Vite

```bash
# Create a new React project with Vite (Vite is much faster than CRA)
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Project structure:
```
my-app/
├── index.html           ← entry point
├── vite.config.js       ← Vite config
├── package.json
└── src/
    ├── main.jsx         ← React entry (mounts <App /> to #root)
    ├── App.jsx          ← Root component
    ├── App.css
    ├── index.css        ← global styles
    └── components/      ← your components here
```

---

## JSX — JavaScript XML

JSX is a syntax extension that lets you write HTML-like code inside JavaScript.
It's compiled to `React.createElement()` calls by Babel.

```jsx
// JSX
const element = <h1 className="title">Hello, {name}!</h1>;

// Compiles to:
const element = React.createElement("h1", { className: "title" }, `Hello, ${name}!`);
```

### JSX Rules:
```jsx
// 1. Return ONE root element (or use Fragment)
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// Or Fragment (doesn't add extra DOM node):
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. Use className (not class) for CSS classes
<div className="container">

// 3. Self-close all empty tags
<img src="logo.png" alt="Logo" />
<br />

// 4. JavaScript expressions in { curly braces }
<h1>Hello, {user.name.toUpperCase()}!</h1>
<p>The answer is {2 + 2}</p>

// 5. Conditional rendering
{isLoggedIn ? <Dashboard /> : <Login />}
{errorMessage && <p className="error">{errorMessage}</p>}

// 6. Lists must have a key prop
{items.map(item => (
  <li key={item.id}>{item.name}</li>  // key must be unique and stable
))}
```

---

## Components

### Functional Component (the modern way):
```jsx
// components/UserCard.jsx
function UserCard({ name, email, role, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={`${name}'s avatar`} />
      <div className="user-info">
        <h2>{name}</h2>
        <p>{email}</p>
        <span className={`badge badge-${role}`}>{role}</span>
      </div>
    </div>
  );
}

export default UserCard;

// Usage:
<UserCard
  name="Alice Smith"
  email="alice@example.com"
  role="admin"
  avatar="/images/alice.jpg"
/>
```

### Props — Passing Data
```jsx
// Parent passes data DOWN via props
function App() {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob",   email: "bob@example.com" }
  ];

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} {...user} /> // spread object as props
      ))}
    </div>
  );
}

// Default props
function Button({ children, variant = "primary", onClick, disabled = false }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Children prop
function Card({ children, title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage with children:
<Card title="Profile">
  <p>Name: Alice</p>
  <p>Age: 28</p>
</Card>
```

---

## State with `useState`

```jsx
import { useState } from "react";

function Counter() {
  // [currentValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// State with objects
function ProfileForm() {
  const [form, setForm] = useState({ name: "", email: "", bio: "" });

  // Correct way to update object state — spread and override:
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value })); // spread prev state!
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name"  value={form.name}  onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <textarea name="bio" value={form.bio}  onChange={handleChange} />
      <button type="submit">Save Profile</button>
    </form>
  );
}
```

### State re-rendering:
```
state changes → React re-renders the component → UI updates

IMPORTANT:
- Never mutate state directly: state.count++ ← WRONG!
- Always use the setter: setCount(count + 1) ← RIGHT

Why? React compares references. If you mutate, the reference doesn't change,
React doesn't know it needs to re-render.
```

---

## Conditional Rendering

```jsx
function UserGreeting({ user, isLoading, error }) {
  // Early return pattern
  if (isLoading) return <LoadingSpinner />;
  if (error)     return <ErrorMessage message={error} />;
  if (!user)     return <p>Please log in.</p>;

  return (
    <div>
      <h1>Welcome back, {user.name}!</h1>
      {user.isAdmin && <AdminPanel />}         {/* show if admin */}
      {user.notifications.length > 0 && (
        <NotificationBadge count={user.notifications.length} />
      )}
    </div>
  );
}
```

---

## `useEffect` — Side Effects

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // useEffect runs AFTER the component renders
    // Dependencies array controls WHEN it runs

    let cancelled = false; // cleanup flag to prevent state update on unmount

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();

    // Cleanup function — runs before next effect or on unmount
    return () => { cancelled = true; };

  }, [userId]); // re-run whenever userId changes

  // useEffect(() => { ... }, []);    ← runs once (on mount only)
  // useEffect(() => { ... });         ← runs on every render (rare)
  // useEffect(() => { ... }, [id]);  ← runs when 'id' changes

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!user)   return null;

  return <div><h1>{user.name}</h1></div>;
}
```

---

## React Hooks — Complete Guide

### `useContext` — Global State without Prop Drilling

```jsx
// 1. Create Context
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// 2. Create Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const { user, token } = await response.json();
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}

// 4. Use anywhere in the tree
function Header() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <span>Welcome, {user?.name}</span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

// 5. Wrap App with provider
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes />
      </Router>
    </AuthProvider>
  );
}
```

### `useReducer` — Complex State

```jsx
import { useReducer } from "react";

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const exists = state.items.find(i => i.id === action.item.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: state.total + action.item.price
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: 1 }],
        total: state.total + action.item.price
      };

    case "REMOVE_ITEM":
      const item = state.items.find(i => i.id === action.id);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id),
        total: state.total - (item.price * item.quantity)
      };

    case "CLEAR_CART":
      return initialState;

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", item: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <div>
      <p>Items: {state.items.length} | Total: ${state.total.toFixed(2)}</p>
      {state.items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### `useMemo` and `useCallback` — Performance

```jsx
import { useMemo, useCallback, useState } from "react";

function ProductList({ products, search }) {
  // useMemo — memoize expensive computation
  const filteredProducts = useMemo(() => {
    console.log("Filtering products..."); // only logs when products or search changes
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]); // re-compute ONLY when these change

  // Without useMemo: re-filters on EVERY render (even unrelated state changes)

  // useCallback — memoize a function reference
  const handleDelete = useCallback(async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    // ... update state
  }, []); // stable reference — doesn't change every render

  // Without useCallback: new function every render → causes child re-renders!

  return (
    <div>
      {filteredProducts.map(p => (
        <ProductCard key={p.id} product={p} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

### `useRef` — Persistent Mutable Reference

```jsx
import { useRef, useEffect } from "react";

function TextEditor() {
  // useRef does NOT cause re-renders — perfect for:
  // 1. Referencing DOM elements
  const inputRef = useRef(null);

  // 2. Storing values between renders without triggering re-render
  const renderCount = useRef(0);
  renderCount.current++;

  // 3. Storing previous values
  const prevValue = useRef(null);

  useEffect(() => {
    // Focus the input on mount
    inputRef.current.focus();
  }, []);

  const handleClick = () => {
    inputRef.current.select(); // access real DOM element!
  };

  return (
    <div>
      <p>Render count: {renderCount.current}</p>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Select All</button>
    </div>
  );
}
```

---

## Custom Hooks

Extract reusable logic into custom hooks (functions starting with `use`):

```jsx
// hooks/useFetch.js
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — clean and reusable!
function Users() {
  const { data: users, loading, error } = useFetch("/api/users");
  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

function Products() {
  const { data: products, loading } = useFetch("/api/products");
  // Same hook, different data!
}
```

---

## React Router — Client-Side Routing

```jsx
// npm install react-router-dom
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/"        className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/about"   className={({isActive}) => isActive ? "active" : ""}>About</NavLink>
        <NavLink to="/products">Products</NavLink>
      </nav>

      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/products"       element={<ProductsPage />} />
        <Route path="/products/:id"   element={<ProductDetailPage />} />
        <Route path="*"               element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// URL params
function ProductDetailPage() {
  const { id } = useParams(); // from /products/:id
  const { data: product } = useFetch(`/api/products/${id}`);
  return <div>{product?.name}</div>;
}

// Navigation programmatically
function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginUser();
    navigate("/dashboard"); // redirect after login
    // navigate(-1); // go back
  };

  return <button onClick={handleLogin}>Login</button>;
}
```
