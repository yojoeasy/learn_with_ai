# 🏗️ System Design Mastery Roadmap
> **Role**: Senior System Architect | 20 Years Experience | Interview-Ready Notes

---

## 📚 Learning Path Overview

Study these systems **in order** — each one builds on concepts from the previous:

| # | System | Core Concepts Learned | Difficulty |
|---|--------|----------------------|-----------|
| 01 | [URL Shortener](./01-URL-Shortener.md) | Hashing, Redirects, Base62, TTL | ⭐⭐ |
| 02 | [Chat Application](./02-Chat-Application.md) | WebSockets, Pub/Sub, Message Queues | ⭐⭐⭐ |
| 03 | [E-Commerce Platform](./03-Ecommerce-Platform.md) | Microservices, Search, Cart, Inventory | ⭐⭐⭐ |
| 04 | [Payment System](./04-Payment-System.md) | ACID, Idempotency, Fraud Detection | ⭐⭐⭐⭐ |
| 05 | [Notification System](./05-Notification-System.md) | Fan-out, Priority Queues, Retry Logic | ⭐⭐⭐ |
| 06 | [File Storage System](./06-File-Storage-System.md) | Chunking, CDN, Deduplication | ⭐⭐⭐ |
| 07 | [Social Media Feed](./07-Social-Media-Feed.md) | Fan-out-on-write vs read, Timeline | ⭐⭐⭐⭐ |
| 08 | [Ride Sharing App](./08-Ride-Sharing-App.md) | Geospatial, Real-time Matching, Surge | ⭐⭐⭐⭐ |
| 09 | [Video Streaming Platform](./09-Video-Streaming-Platform.md) | Transcoding, HLS/DASH, CDN, Adaptive | ⭐⭐⭐⭐⭐ |
| 10 | [Distributed Logging System](./10-Distributed-Logging-System.md) | Log Aggregation, Sharding, Indexing | ⭐⭐⭐⭐⭐ |

---

## 🔑 Universal System Design Framework

For **every** system interview, answer these 7 blocks:

```
1. High-Level Architecture     → Draw the big picture (components, data flow)
2. Database Design             → SQL vs NoSQL, schema, indexing
3. API Structure               → REST/gRPC endpoints, request/response
4. Scaling Strategy            → Horizontal vs vertical, load balancing
5. Caching Strategy            → What to cache, where, eviction policy
6. Security Considerations     → Auth, encryption, rate limiting, auditing  
7. Bottlenecks & Tradeoffs     → Identify weak points, justify decisions
```

---

## 🧠 Key Concepts Cheat Sheet

### CAP Theorem
```
CP  → Consistency + Partition Tolerance  (Banks, Payments)
AP  → Availability + Partition Tolerance (Social Media, DNS)
CA  → Consistency + Availability         (Single-node, not distributed)
```

### SQL vs NoSQL Decision
```
Use SQL when:           Use NoSQL when:
✓ ACID transactions     ✓ Massive scale (millions of writes/sec)
✓ Complex joins         ✓ Flexible/dynamic schema
✓ Structured data       ✓ Key-value or document access patterns
✓ Financial records     ✓ Time-series or graph data
```

### Load Balancing Algorithms
```
Round Robin     → Equal distribution, simple
Least Conn      → Best for long-lived connections (WebSockets)
IP Hash         → Session persistence (sticky sessions)
Weighted RR     → When servers have different capacities
```

### Caching Patterns
```
Cache-Aside     → App checks cache, loads from DB if miss (most common)
Write-Through   → Write to cache + DB simultaneously
Write-Back      → Write to cache only, async to DB (risk of loss)
Read-Through    → Cache sits in front, auto-loads from DB
```

### Message Queue Systems
```
Kafka           → High throughput, ordered, replay (logs, events)  
RabbitMQ        → Complex routing, low latency (tasks)
SQS (AWS)       → Fully managed, at-least-once delivery
Redis Streams   → Lightweight, in-memory pub/sub
```

---

## 📐 Interview Formula (Copy This!)

**Step 1 — Clarify Requirements (2 min)**
- Functional: What features are must-have?
- Non-functional: Scale, latency, availability, consistency?

**Step 2 — Estimate Scale (2 min)**
- Users, RPS, storage per day/year, bandwidth

**Step 3 — High-Level Design (5 min)**
- Client → LB → API Gateway → Services → DB/Cache

**Step 4 — Deep Dive (10 min)**
- Pick 2-3 hardest components and dig in

**Step 5 — Bottlenecks & Scaling (3 min)**
- What breaks first? How do you fix it?

---

## 🔢 Back-of-Envelope Estimation

```
1 million users    → ~12 req/sec (at one req/day each)
1 billion users    → ~12,000 req/sec
1 char = 1 byte
1 image = ~1 MB
1 video (1 min HD) = ~100 MB
1 TB = 1,000 GB = 1,000,000 MB

Read-heavy: read:write = 10:1 or 100:1
Write-heavy: consider LSM trees, Cassandra, Kafka
```

---

*Follow the folder order. Each file covers all 7 design pillars.*
