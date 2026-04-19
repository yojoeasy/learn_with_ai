# 🔷 Phase 10: Full Stack TypeScript — Next.js

## What is Next.js?

Next.js is a **full-stack React framework** built by Vercel. It extends React with:
- **File-based routing** (no need for react-router)
- **Server-side rendering** (SSR, SSG, ISR)
- **Built-in API routes** (backend in the same project)
- **Image optimization**
- **TypeScript by default**
- **App Router** (the modern approach with React Server Components)

```bash
# Create Next.js app
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
```

---

## App Router — File-Based Routing

In Next.js 13+ (App Router), the `app/` directory defines routes.
**Every folder = a route segment. `page.tsx` = the visible UI.**

```
app/
├── layout.tsx          → / layout (wraps everything, persistent nav)
├── page.tsx            → / (homepage)
├── loading.tsx         → / loading UI
├── error.tsx           → / error boundary
├── not-found.tsx       → 404 page
├── about/
│   └── page.tsx        → /about
├── blog/
│   ├── page.tsx        → /blog
│   └── [slug]/
│       └── page.tsx    → /blog/my-first-post (dynamic segment)
├── dashboard/
│   ├── layout.tsx      → dashboard layout (persistent sidebar)
│   ├── page.tsx        → /dashboard
│   ├── users/
│   │   └── page.tsx    → /dashboard/users
│   └── settings/
│       └── page.tsx    → /dashboard/settings
└── api/
    └── users/
        └── route.ts    → API endpoint: GET/POST /api/users
```

---

## Layouts

```tsx
// app/layout.tsx — Root layout (SERVER COMPONENT)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO
export const metadata: Metadata = {
  title: { default: "My App", template: "%s | My App" },
  description: "A full-stack Next.js application",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myapp.com"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />      {/* always visible */}
        <main>{children}</main>
        <Footer />      {/* always visible */}
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — Nested layout for dashboard section
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />           {/* persists across /dashboard/* routes */}
      <div className="content">{children}</div>
    </div>
  );
}
```

---

## Server Components vs Client Components

The **App Router** introduces React Server Components (RSC).

| Feature                    | Server Component (default) | Client Component (`"use client"`) |
|----------------------------|----------------------------|------------------------------------|
| Data fetching              | ✅ Direct (async/await)     | ✅ With hooks (useEffect, SWR)      |
| Access DB, env vars        | ✅ Yes                      | ❌ No (runs in browser)             |
| State, useEffect           | ❌ No                       | ✅ Yes                              |
| Event handlers (onClick)   | ❌ No                       | ✅ Yes                              |
| Bundle size                | 0 (stays on server)        | Added to client bundle              |
| SEO                        | ✅ Great (HTML on server)   | Requires SSR/hydration              |

**Rule:** Default to Server Components. Add `"use client"` only when you need interactivity.

```tsx
// app/products/page.tsx — Server Component (no 'use client')
async function ProductsPage() {
  // ✅ Direct data fetching — no useEffect needed!
  const products = await db.select().from(productsTable).limit(20);
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        // ProductCard might be a client component if it needs interactivity
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// components/ProductCard.tsx — Client Component (needs onClick)
"use client";
import { useState } from "react";

function ProductCard({ product }) {
  const [inCart, setInCart] = useState(false);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <button onClick={() => setInCart(true)}>
        {inCart ? "In Cart ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
```

---

## Data Fetching in Next.js

### Server-Side Rendering (SSR)
```tsx
// Runs on EVERY request (fresh data each time)
async function UsersPage() {
  const res = await fetch("https://api.example.com/users", {
    cache: "no-store" // never cache — always fresh
  });
  const users = await res.json();
  return <UserList users={users} />;
}
```

### Static Site Generation (SSG)
```tsx
// Runs at BUILD TIME (cached forever or until rebuild)
async function BlogPage() {
  const posts = await fetch("https://api.example.com/posts", {
    cache: "force-cache" // cache forever (SSG behavior)
  });
  // ...
}

// With dynamic segments for SSG, export generateStaticParams
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

### Incremental Static Regeneration (ISR)
```tsx
// Built statically BUT regenerated every N seconds
async function ProductsPage() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 } // rebuild every 60 seconds
  });
  // Most of the time serves cached HTML (fast!)
  // But refreshes every 60 seconds in the background
}
```

---

## API Routes

```tsx
// app/api/users/route.ts — handles GET and POST /api/users
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page  = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    
    const allUsers = await db
      .select()
      .from(users)
      .limit(limit)
      .offset((page - 1) * limit);
    
    return NextResponse.json({ data: allUsers, page, limit });
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();
    
    return NextResponse.json({ data: newUser }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// app/api/users/[id]/route.ts — handles /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(Number(params.id));
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: user });
}
```

---

## Server Actions

Server Actions allow **client components to call server functions directly** — no API route needed!

```tsx
// actions/users.ts
"use server"; // marks this as a server action file

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const name  = formData.get("name") as string;
  const email = formData.get("email") as string;

  // Validate
  if (!name || !email) throw new Error("Name and email required");

  // Save to database (runs on the server, securely)
  await db.insert(users).values({ name, email });
  
  revalidatePath("/users"); // clear the cache for /users page
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/users");
}

// Using Server Action in a form (no API route, no fetch needed!):
// components/CreateUserForm.tsx
"use client";
import { createUser } from "@/actions/users";

function CreateUserForm() {
  return (
    <form action={createUser}>          {/* Server Action here! */}
      <input name="name"  placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Create User</button>
    </form>
  );
}

// Using Server Action with useTransition for loading state:
"use client";
import { useTransition } from "react";
import { deleteUser } from "@/actions/users";

function DeleteButton({ userId }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteUser(userId))}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

---

## Rendering Summary

```
Request comes in...

SSG (Static):
  Build time → HTML generated → CDN caches → User gets instant response
  Use for: landing pages, blogs, docs (content doesn't change often)

SSR (Dynamic):
  Every request → server runs code → generates HTML → sends to user
  Use for: personalized pages (dashboard), real-time data, auth-required pages

ISR (Incremental Static):
  Build time → HTML generated → CDN caches →
  After N seconds → next request triggers background rebuild
  → new HTML replaces old
  Use for: product catalog, news (updated periodically but not every second)

Client-side:
  HTML shell sent → JavaScript loads → fetches data → renders
  Use for: highly interactive UIs, user-specific data after login
```

---

## Deployment on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Environment variables in Vercel:
```
NEXT_PUBLIC_API_URL=...    # accessible in client-side code
DATABASE_URL=...            # server-only (not NEXT_PUBLIC_)
JWT_SECRET=...              # server-only
```

Vercel handles:
- Automatic HTTPS
- Edge network / CDN for static assets
- Serverless functions for API routes and Server Actions
- Preview deployments for every PR
