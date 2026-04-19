# 🏆 Phase 13: Capstone Projects

## Overview

These 3 capstone projects are designed to integrate everything you've learned across all phases. Each uses a progressively more complex tech stack.

---

# Project 1: Full Stack Blog Platform

## Tech Stack
```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:   Next.js API Routes + Server Actions
Database:  PostgreSQL + Drizzle ORM
Auth:      JWT + bcrypt (custom auth OR NextAuth.js)
Storage:   Cloudinary (images)
Deploy:    Vercel + Supabase (PostgreSQL)
```

## Features
- User authentication (register, login, logout)
- Create, edit, delete blog posts
- Rich text editor (Tiptap or Quill)
- Image upload for post covers
- Categories and tags
- Comments on posts
- Search posts by title/content
- Admin dashboard (manage users, posts)
- SEO (Next.js metadata API)
- RSS feed
- Dark mode

## File Structure
```
my-blog/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx         ← nav + footer
│   │   ├── page.tsx           ← homepage (latest posts)
│   │   ├── blog/
│   │   │   ├── page.tsx       ← all posts
│   │   │   └── [slug]/
│   │   │       └── page.tsx   ← single post
│   │   └── dashboard/
│   │       ├── page.tsx       ← dashboard home
│   │       ├── posts/
│   │       │   ├── page.tsx   ← list my posts
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       └── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       └── posts/
│           ├── route.ts
│           └── [id]/route.ts
├── components/
│   ├── ui/                    ← reusable UI
│   ├── posts/                 ← post-specific
│   └── auth/                  ← auth forms
├── lib/
│   ├── db.ts
│   ├── schema.ts
│   ├── auth.ts
│   └── utils.ts
├── actions/
│   ├── posts.ts
│   └── auth.ts
└── middleware.ts              ← protect /dashboard routes
```

## Database Schema
```sql
users
  - id, name, email, password, role, avatar, bio, created_at

posts
  - id, title, slug, content, excerpt, cover_image
  - author_id (FK users), category_id (FK categories)
  - is_published, views, created_at, updated_at

categories
  - id, name, slug, description

tags
  - id, name, slug

post_tags
  - post_id, tag_id   (many-to-many)

comments
  - id, content, author_id, post_id, parent_id, created_at
```

---

# Project 2: E-Commerce Store

## Tech Stack
```
Frontend:  Next.js + TypeScript + Tailwind CSS + Shadcn/ui
Backend:   Node.js + Express (separate API) OR Next.js API routes
Database:  PostgreSQL + Drizzle ORM
Auth:      NextAuth.js (Google + Email/Password)
Payments:  Stripe
Real-time: Socket.io (live order status)
Cache:     Redis (product catalog, sessions)
Storage:   AWS S3 or Cloudinary
Queue:     Bull (background jobs: emails, reports)
Search:    Elasticsearch or Algolia
Deploy:    Vercel (frontend) + Railway/Render (backend)
```

## Features
- Product catalog with search and filtering
- Product variants (size, color)
- Shopping cart (persistent across sessions)
- Wishlist
- Stripe payment processing (with webhooks)
- Order management and status tracking
- Email notifications (order confirmation, shipping)
- Admin panel (product CRUD, order management, analytics)
- Inventory management
- Discount codes and coupons
- Real-time order status updates (Socket.io)

## Architecture Diagram
```
Browser
   ↓
Vercel CDN (Next.js frontend)
   ↓
Next.js API Routes / Express
   ↓
┌─────────────────────────────────────────┐
│  Redis Cache  PostgreSQL  S3 Storage    │
│  Bull Queue   Stripe API  SendGrid      │
└─────────────────────────────────────────┘
```

## Stripe Integration Flow
```
1. User fills cart and clicks "Checkout"
2. Frontend calls POST /api/checkout/session
3. Server creates Stripe PaymentIntent or CheckoutSession
4. Frontend redirects to Stripe Checkout OR uses Stripe.js embedded
5. User enters card → Stripe handles payment securely
6. Stripe redirects to your success URL with session_id
7. Stripe sends webhook to POST /api/webhooks/stripe
8. Webhook handler verifies signature and fulfills order:
   - Create order in DB
   - Send confirmation email
   - Deduct inventory
   - Trigger real-time notification
```

---

# Project 3: AI-Powered SaaS Tool (The Most Advanced)

## Concept: AI Code Review Tool

An app where users paste code, get AI-powered review with:
- Bug detection
- Security vulnerability analysis
- Performance suggestions
- Best practice recommendations
- Auto-refactoring suggestions

## Tech Stack
```
Frontend:  Next.js 14 + TypeScript + Tailwind CSS
AI:        OpenAI GPT-4o + Vercel AI SDK (streaming)
Database:  PostgreSQL + Drizzle ORM + pgvector (embeddings)
Vector DB: Pinecone (for storing code embeddings)
Auth:      NextAuth.js (GitHub OAuth → access user's repos)
Payments:  Stripe (subscription: free/pro/enterprise)
Deploy:    Vercel
Monitoring: Axiom + Sentry
```

## Features
- GitHub OAuth (users can import repos directly)
- Paste code or connect GitHub repo
- Select which AI models to use (GPT-4o, Claude)
- Real-time streaming AI analysis
- Save and organize reviews
- Share reviews with team (collaboration)
- Subscription plans:
  - Free: 10 reviews/month
  - Pro ($9/mo): 200 reviews/month + GitHub integration
  - Enterprise ($49/mo): unlimited + team features
- RAG: Uses previous reviews as context for better suggestions
- API for CI/CD integration

## Key Implementation Challenges & Solutions
```
Challenge: Stream long AI responses without timeout
Solution:  Vercel AI SDK with edge runtime

Challenge: Rate limit per user (not per IP)
Solution:  Check in middleware, use Redis for distributed counting

Challenge: Store code without leaking user secrets
Solution:  Auto-detect and redact env vars, API keys before sending to OpenAI

Challenge: Allow team access to same reviews
Solution:  Organization concept + role-based access (owner, editor, viewer)

Challenge: Cost management (OpenAI is expensive at scale)
Solution:  Use cheaper model (gpt-3.5-turbo) for initial analysis,
           gpt-4o only for detailed review (opt-in per user)
```

---

# How to Start: Step-by-Step for Project 1

```bash
# 1. Create Next.js app
npx create-next-app@latest fullstack-blog --typescript --tailwind --app
cd fullstack-blog

# 2. Install dependencies
npm install drizzle-orm @auth/core jsonwebtoken bcryptjs
npm install -D drizzle-kit @types/bcryptjs @types/jsonwebtoken

# 3. Set up environment variables
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/blog"
JWT_SECRET="your-super-secret-key-min-32-chars"
CLOUDINARY_URL="cloudinary://..."
NEXTAUTH_SECRET="another-secret"
NEXTAUTH_URL="http://localhost:3000"
EOF

# 4. Start PostgreSQL with Docker
docker run -d \
  --name blog-db \
  -e POSTGRES_DB=blog \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16-alpine

# 5. Create your schema and push to DB
npm run db:push

# 6. Start developing!
npm run dev
```

## Learning Order for Capstone

1. ✅ Finish all Phase 1-12 notes
2. ✅ Complete mini-exercises in each phase
3. 🚀 Start Project 1 (Blog) — solidify fundamentals
4. 🚀 Start Project 2 (E-Commerce) — add complexity
5. 🚀 Start Project 3 (AI SaaS) — cutting edge

---

# Checklist Before Capstone

- [ ] Comfortable with HTML, CSS, Flexbox, Grid
- [ ] Understand JS: closures, async/await, classes
- [ ] TypeScript: types, interfaces, generics
- [ ] React: hooks, context, custom hooks, React Router
- [ ] Node.js + Express: REST API, middleware, auth
- [ ] Database: MongoDB OR PostgreSQL + an ORM
- [ ] Authentication: JWT + bcrypt implemented at least once
- [ ] Git workflow: branches, PRs, commit messages
- [ ] Docker: can containerize an app
- [ ] Deployment: deployed at least one app
