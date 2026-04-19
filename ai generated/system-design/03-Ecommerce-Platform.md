# 🛒 System Design #03 — E-Commerce Platform
> **Like**: Amazon, Flipkart, Shopify  
> **Difficulty**: ⭐⭐⭐ | **Teaches**: Microservices, Search, Inventory, Cart, Orders

---

## 📋 Requirements

### Functional Requirements
- Browse / search products (catalog)
- Product detail page
- Shopping cart (add, remove, update quantity)
- Place order + inventory deduction
- Track order status
- User reviews & ratings
- Seller dashboard (product listing, stock management)

### Non-Functional Requirements
- **Users**: 100 million registered, 10 million concurrent on peak (sale days)
- **Peak Traffic**: ~100,000 RPS (10x surge on Black Friday / Diwali Sale)
- **Data Size**: 10 million products, 1B orders/year ≈ **500 TB** total
- **Availability**: 99.99% during sales (downtime = lost revenue)
- **Latency**: < 100ms for search, < 200ms for product page
- **Budget**: High (enterprise)
- **Tech**: Node.js microservices, React, PostgreSQL, MongoDB, Elasticsearch, Redis, Kafka, AWS

---

## 1. 🏛️ High-Level Architecture (Microservices)

```
[React App / Mobile App]
        │
        ▼
[API Gateway]  ← Rate limiting, Auth, Routing
        │
   ┌────┴──────────────────────────────────────┐
   │              Microservices                │
   ├──► [User Service]         PostgreSQL      │
   ├──► [Product/Catalog Svc]  MongoDB + ES    │
   ├──► [Search Service]       Elasticsearch   │
   ├──► [Cart Service]         Redis           │
   ├──► [Order Service]        PostgreSQL      │
   ├──► [Inventory Service]    PostgreSQL      │
   ├──► [Payment Service]      PostgreSQL      │
   ├──► [Notification Svc]     Kafka + FCM     │
   └──► [Review Service]       MongoDB         │
   │                                           │
   └──────────────── [Kafka Event Bus] ────────┘
                            │
                   [Analytics Service]
                    (ClickHouse/Spark)
```

### Why Microservices here?
```
✓ Each service scales independently (Search peaks ≠ Order peaks)
✓ Different DB needs per service (Cart→Redis, Products→MongoDB)
✓ Teams can deploy independently
✓ Fault isolation: Cart crash ≠ Order crash
```

---

## 2. 🗄️ Database Design

### Product Catalog (MongoDB — flexible schema)
```javascript
// Products Collection
{
  _id: ObjectId("..."),
  name: "Sony WH-1000XM5 Headphones",
  description: "...",
  brand: "Sony",
  category: ["electronics", "audio", "headphones"],
  price: 24999,
  discount_price: 19999,
  images: ["s3://bucket/img1.jpg", "s3://bucket/img2.jpg"],
  
  // Flexible attributes (varies by category!)
  attributes: {
    color: "Black",
    weight: "250g",
    battery_life: "30 hours",
    connectivity: ["Bluetooth 5.2", "3.5mm Jack"]
  },
  
  seller_id: "seller_123",
  status: "active",    // active | inactive | deleted
  rating: 4.5,
  review_count: 12450,
  
  created_at: ISODate(...),
  updated_at: ISODate(...)
}
```

### Inventory (PostgreSQL — ACID for stock!)
```sql
CREATE TABLE inventory (
    product_id      UUID PRIMARY KEY,
    sku             VARCHAR(50) UNIQUE NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 0,
    reserved        INTEGER NOT NULL DEFAULT 0,   -- in active carts
    warehouse_id    UUID,
    last_updated    TIMESTAMPTZ DEFAULT NOW()
);

-- AVAILABLE = quantity - reserved
-- Critical: Use SELECT FOR UPDATE to prevent oversell
```

### Orders (PostgreSQL — ACID transactions!)
```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    status          VARCHAR(20) NOT NULL,  -- pending|confirmed|shipped|delivered
    total_amount    DECIMAL(12,2) NOT NULL,
    payment_status  VARCHAR(20),           -- pending|paid|refunded
    address_id      UUID,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID REFERENCES orders(id),
    product_id      UUID NOT NULL,
    seller_id       UUID NOT NULL,
    quantity        INTEGER NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL
);
```

### Cart (Redis — ephemeral, fast)
```
Key: "cart:{userId}"
Type: Redis Hash

HSET cart:user123
  "product_A" '{"quantity": 2, "price": 19999, "name": "Sony XM5"}'
  "product_B" '{"quantity": 1, "price": 5000, "name": "USB-C Cable"}'

TTL: 30 days (auto-expire abandoned carts)
```

---

## 3. 🔌 API Structure

### Product APIs
```
GET  /api/products                  → List products (paginated)
GET  /api/products/:id              → Product detail
GET  /api/products/search?q=sony    → Full-text search
GET  /api/products/:id/reviews      → Reviews (paginated)
POST /api/products/:id/reviews      → Submit review (auth required)
```

### Cart APIs
```
GET    /api/cart                    → Get current cart
POST   /api/cart/items              → Add item to cart
PUT    /api/cart/items/:productId   → Update quantity
DELETE /api/cart/items/:productId   → Remove item
DELETE /api/cart                    → Clear cart
```

### Order APIs
```
POST /api/orders                    → Place order (checkout)
GET  /api/orders                    → User's order history
GET  /api/orders/:id                → Order detail + tracking
PUT  /api/orders/:id/cancel         → Cancel order
```

---

## 4. 🔍 Search — The Heart of E-Commerce

### Elasticsearch Setup
```javascript
// Product Index Mapping
{
  "mappings": {
    "properties": {
      "name":        { "type": "text", "analyzer": "english" },
      "description": { "type": "text", "analyzer": "english" },
      "brand":       { "type": "keyword" },
      "category":    { "type": "keyword" },
      "price":       { "type": "double" },
      "rating":      { "type": "float" },
      "attributes":  { "type": "object" },
      "status":      { "type": "keyword" }
    }
  }
}

// Search Query with filters + boost
{
  "query": {
    "bool": {
      "must": [
        { "multi_match": { "query": "sony headphones", "fields": ["name^3", "description", "brand"] }}
      ],
      "filter": [
        { "range": { "price": { "gte": 1000, "lte": 30000 }}},
        { "term":  { "status": "active" }},
        { "term":  { "category": "electronics" }}
      ]
    }
  },
  "sort": [{ "rating": "desc" }, { "_score": "desc" }]
}
```

### Data Sync: MongoDB → Elasticsearch
```
Method: Kafka Connect (CDC — Change Data Capture)

MongoDB → [MongoDB Kafka Connector] → Kafka → [ES Sink Connector] → Elasticsearch

Or: Application-level dual-write:
  1. Write to MongoDB (primary)
  2. Publish event to Kafka ("product.updated")
  3. Kafka Consumer updates Elasticsearch

Sync is eventually consistent — acceptable for search
```

---

## 5. 🛡️ Inventory Management — Preventing Oversell

This is the **trickiest part** of e-commerce design!

### Naive Approach (WRONG ❌)
```
1. Check inventory: qty = 10
2. User A orders 10 → reduce to 0
3. User B (concurrent) also sees qty = 10 → race condition!
→ Both could succeed, resulting in -10 inventory
```

### Correct Approach: Pessimistic Locking (PostgreSQL)
```sql
BEGIN;

-- Lock the row for update (blocks concurrent updates)
SELECT quantity, reserved
FROM inventory
WHERE product_id = $1
FOR UPDATE;

-- Check if enough stock
IF (quantity - reserved) >= requested_qty THEN
    -- Reserve the items (soft lock during checkout)
    UPDATE inventory
    SET reserved = reserved + requested_qty
    WHERE product_id = $1;
    COMMIT;
ELSE
    ROLLBACK;
    -- Return "Out of Stock" error
END IF;
```

### Cart Reserve → Order Confirm Flow
```
1. Add to Cart       → Reserve stock (inventory.reserved += qty)
2. Cart expires/cleared → Release reservation (reserved -= qty)
3. Order placed      → Convert reservation to confirmed deduction
4. Order cancelled   → Release stock back
```

---

## 6. ⚡ Caching Strategy

| What | Where | TTL | Strategy |
|------|-------|-----|---------|
| Product pages | CDN | 5 min | Invalidate on product update |
| Search results | Redis | 1 min | Popular queries cached |
| Shopping cart | Redis | 30 days | Primary store |
| Category list | Redis | 1 hour | Rarely changes |
| Product prices | Redis | 1 min | Important: Sales change prices |
| User sessions | Redis | 24 hours | JWT + Redis blacklist |

```
CDN Strategy (CloudFront):
- Product images: Cache forever (immutable, URL-versioned)
- Product pages: Cache 5 min, purge on update
- Homepage: Cache 1 min
- Cart/Orders: NEVER cache (dynamic, user-specific)
```

---

## 7. 📈 Scaling Strategy

### Handle Black Friday (10x Traffic)
```
Preparation:
1. Load test 2 weeks before (Locust / k6)
2. Pre-scale infrastructure (provision extra EC2 auto-scaling groups)
3. Pre-warm CDN caches (crawl popular pages)
4. Pre-warm Redis (load top 10K products)
5. Database read replicas ready

During Peak:
1. Auto-scaling: API server count 5 → 50 automatically
2. Rate limiting: Throttle bots, crawlers
3. Circuit breakers: If inventory service slow, degrade gracefully
4. Queue orders: Don't fail, queue and process (order queuing)
```

### Database Strategy
```
Product Service (MongoDB):
- Replica set: 1 Primary + 2 Secondaries
- Read from secondaries for product pages

Order Service (PostgreSQL):
- Primary for writes
- Read replicas for order history
- Partitioning by created_at (monthly partitions)

Inventory (PostgreSQL):
- Vertical scaling (biggest instance)
- Connection pooling (PgBouncer)
- Keep it small and fast — critical path
```

---

## 8. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Price manipulation** | Server-side price calculation (never trust client) |
| **Inventory fraud** | Server validates stock before every order |
| **SQL Injection** | Parameterized queries, ORM |
| **Account takeover** | 2FA, device fingerprinting, email alerts |
| **Card fraud** | PCI-DSS compliant payment (Stripe/Razorpay) |
| **Scraping** | Rate limiting, CAPTCHA, IP reputation |
| **DDoS on sale day** | AWS Shield + CloudFront + WAF |

---

## 9. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Flash sale (10,000 orders in 1s)** | DB overwhelmed | Queue orders in Redis/Kafka, process async |
| **Inventory accuracy vs speed** | Locking slows writes | Optimistic locking or event sourcing |
| **Search out of sync** | ES index lag | Eventual consistency (acceptable for search) |
| **Cart TTL** | User loses cart | Persist to DB after 30 min inactivity |
| **Large catalog** | 10M products = slow queries | Elasticsearch + pagination + lazy loading |
| **Image storage** | Millions of product images | S3 + CloudFront CDN + WebP compression |
| **Reviews spam** | Fake reviews | Verified purchase filter, ML spam detection |

---

## 📝 Summary Box

```
┌────────────────────────────────────────────────┐
│  E-COMMERCE — KEY DECISIONS                    │
│                                                │
│  Pattern:     Microservices + API Gateway      │
│  Products:    MongoDB (flexible attributes)    │
│  Orders:      PostgreSQL (ACID)               │
│  Cart:        Redis Hash (ephemeral)           │
│  Search:      Elasticsearch (full-text)        │
│  Inventory:   PostgreSQL + SELECT FOR UPDATE   │
│  Events:      Kafka (order.placed, etc.)       │
│  CDN:         CloudFront for images/assets     │
│  Scale:       Auto-scaling + pre-warm on sales │
└────────────────────────────────────────────────┘
```

**← Previous**: [Chat Application](./02-Chat-Application.md) | **Next**: [Payment System →](./04-Payment-System.md)
