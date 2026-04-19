# 🔗 System Design #01 — URL Shortener
> **Like**: bit.ly, tinyurl.com, t.co  
> **Difficulty**: ⭐⭐ | **Best starting point** — teaches fundamentals cleanly

---

## 📋 Requirements

### Functional Requirements
- Given a long URL → generate a short unique URL (e.g., `short.ly/abc123`)
- Redirect short URL → original long URL
- Optional: Custom aliases, expiry/TTL, analytics (click count)

### Non-Functional Requirements
- **Users**: 100 million users
- **Peak Traffic**: ~10,000 RPS reads, ~1,000 RPS writes (read-heavy: 10:1)
- **Data Size**: 100M URLs × 500 bytes ≈ **50 GB** over 5 years
- **Availability**: 99.99% (4 nines) — downtime < 1 hour/year
- **Latency**: < 10ms redirect
- **Budget**: Medium
- **Tech**: Node.js, Redis, PostgreSQL, AWS

---

## 1. 🏛️ High-Level Architecture

```
User
 │
 ▼
[CDN / Edge Cache]          ← Cache hot short URLs at edge
 │
 ▼
[Load Balancer]             ← Nginx / AWS ALB
 │
 ├──► [API Service]         ← Node.js Stateless Servers (auto-scale)
 │         │
 │         ├──► [Redis Cache]       ← shortCode → longURL (TTL: 1 hour)
 │         │
 │         └──► [PostgreSQL DB]     ← Source of truth
 │
 └──► [Analytics Service]   ← Click events → Kafka → ClickHouse
```

### Component Roles

| Component | Role |
|-----------|------|
| **CDN** | Cache redirects at edge nodes worldwide |
| **Load Balancer** | Distribute traffic, health checks |
| **API Service** | Stateless, horizontally scalable |
| **Redis** | Sub-millisecond URL lookups |
| **PostgreSQL** | Durable storage of URL mappings |
| **Kafka** | Async analytics event streaming |

---

## 2. 🗄️ Database Design

### URL Table (PostgreSQL)

```sql
CREATE TABLE urls (
    id            BIGSERIAL PRIMARY KEY,
    short_code    VARCHAR(8)   NOT NULL UNIQUE,  -- 'abc123'
    long_url      TEXT         NOT NULL,
    user_id       BIGINT,                         -- nullable (anonymous)
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    expires_at    TIMESTAMPTZ,                    -- NULL = no expiry
    click_count   BIGINT       DEFAULT 0,
    is_custom     BOOLEAN      DEFAULT FALSE
);

-- Index for fast lookup by short_code (most frequent query)
CREATE UNIQUE INDEX idx_short_code ON urls(short_code);

-- Index for user's URLs
CREATE INDEX idx_user_id ON urls(user_id);
```

### Analytics Table (ClickHouse or TimescaleDB)

```sql
CREATE TABLE clicks (
    click_id    UUID,
    short_code  VARCHAR(8),
    country     VARCHAR(3),
    device      VARCHAR(20),    -- mobile / desktop
    referrer    TEXT,
    clicked_at  TIMESTAMPTZ
);
-- Partition by month for efficient querying
```

---

## 3. 🔌 API Structure

### POST /api/shorten
```
Request:
{
  "long_url": "https://www.example.com/very/long/path?query=value",
  "custom_alias": "mylink",   // optional
  "ttl_days": 30              // optional
}

Response 201:
{
  "short_url": "https://short.ly/abc123",
  "short_code": "abc123",
  "expires_at": "2026-04-04T00:00:00Z"
}
```

### GET /:shortCode → Redirect
```
GET /abc123

Response 301 (permanent) or 302 (temporary):
  Location: https://www.example.com/very/long/path?query=value

Use 302 for analytics tracking (prevents browser caching the redirect)
Use 301 for maximum performance (browser caches, fewer server hits)
```

### GET /api/stats/:shortCode
```
Response 200:
{
  "short_code": "abc123",
  "total_clicks": 15023,
  "clicks_by_country": { "IN": 8000, "US": 4000 },
  "clicks_by_device": { "mobile": 10000, "desktop": 5023 }
}
```

---

## 4. 🔑 Short Code Generation — The Core Algorithm

### Option A: Base62 Encoding (Recommended ✅)
```
Characters: a-z + A-Z + 0-9 = 62 characters
6 chars     → 62^6  = ~56 billion unique URLs  ✓
7 chars     → 62^7  = ~3.5 trillion unique URLs ✓✓

Steps:
1. Insert long URL → DB returns auto-increment ID (e.g., 12345678)
2. Convert ID to Base62: 12345678 → "XBejHT"
3. Store & return short code
```

```javascript
// Base62 encoding implementation
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(num) {
    let result = '';
    while (num > 0) {
        result = CHARS[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result.padStart(6, '0');
}

// ID 1 → "000001", ID 12345678 → "XBejHT"
```

### Option B: MD5/SHA256 Hash (Not Recommended ❌)
```
- Hash long URL → take first 6 chars
- Problem: COLLISIONS are common (birthday paradox)
- Need retry logic → complexity without benefit
```

### Option C: Pre-Generate Short Codes (Scale Option)
```
- Dedicated Key Generation Service (KGS)
- Pre-generates millions of codes, stores in "unused" DB table
- API servers claim batches (e.g., 1000 codes at a time)
- Eliminates real-time generation bottleneck
- Used by systems at extreme scale
```

---

## 5. ⚡ Caching Strategy

```
Layer 1: CDN Edge Cache
  - Cache static redirects (popular URLs) at edge
  - Cache-Control: max-age=3600
  - Huge for global users (reduces origin hits by 80%+)

Layer 2: Redis (In-Memory)
  - Key: shortCode  →  Value: longURL
  - TTL: 1 hour (or match URL expiry)
  - Eviction Policy: LRU (Least Recently Used)
  - Expected hit rate: ~90% (Pareto principle: 20% URLs = 80% traffic)
  - Redis Cluster for horizontal scaling

Cache-Aside Pattern:
  1. Check Redis first
  2. If miss → query PostgreSQL
  3. Write result back to Redis
  4. Return longURL to client
```

---

## 6. 📈 Scaling Strategy

### Write Path (URL Creation)
```
- 1,000 RPS writes → single PostgreSQL handles this easily
- Use connection pooling (PgBouncer)
- Add Read Replicas when needed (offload analytics queries)
```

### Read Path (URL Redirect)
```
- 10,000 RPS reads → Redis handles 100K+ ops/sec easily
- Redis Cluster if needed (horizontal sharding)
- Add more API server instances behind LB
- CDN for geographically distributed caching
```

### Sharding Strategy (when DB grows huge)
```
- Shard by short_code hash
- Consistent hashing to distribute across DB shards
- Each shard handles ~10-20 million URLs
```

---

## 7. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Spam / Phishing URLs** | URL scanning (Google Safe Browsing API) |
| **Rate Limiting** | 100 shortens/hour per IP, 1000/day per user |
| **Brute Force enumeration** | Monitor for sequential code scanning patterns |
| **DDoS** | CDN + Rate limiting at edge |
| **Auth** | JWT tokens for user-specific features |
| **CORS** | Whitelist trusted origins only |

```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 100,                    // 100 requests per hour
    keyGenerator: (req) => req.ip,
    message: 'Too many requests, try again later'
});
```

---

## 8. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Single DB** | Write bottleneck at scale | Read replicas + sharding |
| **Cache Stampede** | Redis miss → DB flood | Mutex locks / probabilistic refresh |
| **301 vs 302** | 301 = cached = no analytics | Use 302 for tracking |
| **Hot URLs** | 1 URL = millions of requests | CDN edge caching |
| **ID overflow** | BIGSERIAL gives 9 quintillion IDs | Never a real problem |
| **Custom aliases** | Collision with generated codes | Reserve namespace, check before insert |
| **Expiry cleanup** | Expired rows waste space | Background job (cron) to delete expired |

---

## 9. 🎯 Interview Tips — URL Shortener

> **Expect these questions:**
> 1. *"How do you generate unique short codes?"* → Base62 on auto-increment ID
> 2. *"What if two users shorten the same URL?"* → Both get different codes (simpler), or dedup with hash lookup
> 3. *"How do you handle 301 vs 302?"* → 301 is faster (browser caches), 302 lets you track analytics
> 4. *"What if Redis goes down?"* → Fallback to DB, Redis is enhancement not dependency
> 5. *"How do you scale to 1B users?"* → Redis Cluster + CDN + DB sharding

---

## 📝 Summary Box

```
┌─────────────────────────────────────────┐
│  URL SHORTENER — KEY DECISIONS          │
│                                         │
│  Short code:  Base62(auto_increment_id) │
│  Redirect:    302 (analytics) / 301     │
│  Cache:       Redis LRU + CDN           │
│  DB:          PostgreSQL (ACID)         │
│  Scale read:  Redis Cluster + CDN       │
│  Scale write: PgBouncer + Replicas      │
│  Security:    Rate limit + URL scan     │
└─────────────────────────────────────────┘
```

**Next**: [Chat Application →](./02-Chat-Application.md)
