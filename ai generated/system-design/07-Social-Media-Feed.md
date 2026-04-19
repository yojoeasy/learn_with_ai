# 📱 System Design #07 — Social Media Feed
> **Like**: Instagram, Twitter/X, Facebook News Feed  
> **Difficulty**: ⭐⭐⭐⭐ | **Teaches**: Fan-out-on-write vs read, Timeline, Ranking

---

## 📋 Requirements

### Functional Requirements
- Create posts (text, image, video)
- Follow / unfollow users
- Home feed (posts from followed users, ranked by relevance)
- Like, comment on posts
- Explore/Discover feed (posts from non-followed users)
- Notifications (new follower, like, comment)
- Stories (24-hour ephemeral content)

### Non-Functional Requirements
- **Users**: 1 billion registered, 200 million DAU
- **Posts**: 100 million new posts/day ≈ 1,160 posts/second
- **Reads**: 10 billion feed reads/day ≈ 115,000 reads/second (extremely read-heavy: 1000:1)
- **Availability**: 99.99%
- **Latency**: Feed load < 200ms
- **Budget**: High
- **Tech**: Node.js, Redis, Cassandra, PostgreSQL, Kafka, Elasticsearch, AWS

---

## 1. 🏛️ High-Level Architecture

```
[User App / Mobile / Web]
         │
         ▼
  [API Gateway + CDN]
         │
    ┌────┴────────────────────────────────────────┐
    │                    Services                 │
    ├──► [Post Service]         Cassandra         │
    ├──► [Feed Service]         Redis Cluster     │
    ├──► [Follow Service]       PostgreSQL        │
    ├──► [User Service]         PostgreSQL        │
    ├──► [Like/Comment Svc]     Cassandra         │
    ├──► [Search Service]       Elasticsearch     │
    └──► [Notification Svc]     Kafka + FCM       │
         │                                        │
         └──── [Kafka Event Bus] ─────────────────┘
                    │
         [Feed Generator Worker]
         (Fan-out service — core of the system)
```

---

## 2. 🗄️ Database Design

### Posts (Cassandra — write-optimized, time-series)
```sql
CREATE TABLE posts (
    user_id         UUID,
    post_id         TIMEUUID,              -- time-sortable for ordering
    content         TEXT,
    media_urls      LIST<TEXT>,
    post_type       TEXT,                  -- 'text'|'image'|'video'|'story'
    like_count      COUNTER,
    comment_count   COUNTER,
    is_deleted      BOOLEAN,
    created_at      TIMESTAMP,
    
    PRIMARY KEY (user_id, post_id)
) WITH CLUSTERING ORDER BY (post_id DESC);

-- "Get all posts by user_123" → fast partition query
```

### Social Graph (PostgreSQL — relational)
```sql
CREATE TABLE follows (
    follower_id     UUID NOT NULL,
    following_id    UUID NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX idx_following ON follows(following_id);
-- "Get all followers of user_X" → used for fan-out
-- "Get all accounts user follows" → used for feed reads

CREATE TABLE users (
    id              UUID PRIMARY KEY,
    username        VARCHAR(50) UNIQUE,
    follower_count  INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_celebrity    BOOLEAN DEFAULT FALSE  -- > 1M followers
);
```

### Feed (Redis — precomputed timelines)
```
Key: "feed:{userId}"
Type: Sorted Set (score = post_timestamp)

ZADD feed:user123 1709500000 "postId:abc"
ZADD feed:user123 1709499000 "postId:xyz"

ZRANGE feed:user123 0 49 REV  → Get 50 most recent posts for user

Max Size: Keep only last 800 posts per feed (infinite scroll needs)
TTL: 7 days (inactive users' feeds get rebuilt on next login)
```

---

## 3. 🔑 The Core Challenge: Feed Generation

### Strategy 1: Fan-out on Write (Push Model)
```
When user A posts:
→ Find all followers of A (e.g., 1,000 followers)
→ Insert post into each follower's Redis feed

READ (fast): Just ZRANGE from Redis → instant feed
WRITE (slow): 1 post × 1,000 followers = 1,000 Redis writes

Problem: Celebrity with 10M followers posts → 10M Redis writes!
Problem: User following 5,000 accounts → their feed write is fine, but receives many
```

### Strategy 2: Fan-out on Read (Pull Model)
```
When user loads feed:
→ Get list of all followed accounts (e.g., 500 accounts)
→ Query each account's posts (500 queries!)
→ Merge and sort all posts

READ (slow): 500 DB queries → 2-3 seconds (unacceptable!)
WRITE (fast): 0 work on post creation

Problem: Read latency is terrible at scale
```

### Strategy 3: HYBRID (Used by Instagram/Twitter ✅)
```
Classify users:
  "Regular" users  → < 10,000 followers: Fan-out on WRITE
  "Celebrity" users → > 10,000 followers: Fan-out on READ

On post creation by regular user:
  Fan-out to all follower feeds in Redis (fast, small count)

On feed read for any user:
  1. Load pre-computed feed from Redis (fast)
  2. Find celebrities they follow: get their recent posts
  3. MERGE regular + celebrity posts
  4. Apply ranking algorithm
  5. Return top 50

Best of both worlds!
```

---

## 4. 🔌 API Structure

```
# Posts
POST /api/posts                        → Create post
GET  /api/posts/:id                    → Get single post
DELETE /api/posts/:id                  → Delete post
POST /api/posts/:id/like               → Like/unlike
POST /api/posts/:id/comments           → Comment
GET  /api/posts/:id/comments           → Get comments (paginated)

# Feed
GET  /api/feed/home?cursor=abc123      → Home feed (cursor pagination)
GET  /api/feed/explore                 → Discover (trending/explore)

# Users/Follow
POST /api/users/:id/follow             → Follow user
DELETE /api/users/:id/follow           → Unfollow
GET  /api/users/:id/followers          → Follower list
GET  /api/users/:id/following          → Following list
GET  /api/users/:id                    → User profile
GET  /api/users/:id/posts              → User's posts

# Stories
POST /api/stories                      → Create story
GET  /api/stories/feed                 → Stories from following
DELETE /api/stories/:id               → Delete story
```

### Cursor Pagination (vs Offset)
```javascript
// WRONG: Offset pagination (slow and inconsistent)
GET /api/feed?page=2&limit=20
// New posts inserted = items shift = user sees duplicates!

// RIGHT: Cursor-based pagination
GET /api/feed?cursor=postId_xyz&limit=20
// Server: "Give me 20 posts older than postId_xyz"
// Stable even when new posts are added!
```

---

## 5. 🏆 Feed Ranking Algorithm

```
Chronological (simplest): Just show newest first
  → Good for: Twitter/X default, tight communities

ML Ranking (complex): Score each post, show highest
  → Good for: Instagram, Facebook

Ranking Signals:
  Engagement: likes, comments, shares, saves
  Freshness: Recent posts score higher
  Relationship: Posts from close friends rank higher
  Content: Post type user typically engages with
  Velocity: Trending post climbing in engagement fast

Score = w1 × engagement + w2 × freshness + w3 × relationship_strength

Implementation:
- Offline: Train ML model daily (TensorFlow/PyTorch)
- Online: Score each candidate post in real-time using model
- A/B Test continuously: 5% users on experimental algorithm
```

---

## 6. ⚡ Caching Strategy

| Data | Cache | TTL | Strategy |
|------|-------|-----|---------|
| User's home feed | Redis Sorted Set | 7 days | Fan-out on write |
| User profile | Redis | 5 min | Cache-aside |
| Post data | Redis | 2 hours | Read-through |
| Like count | Redis | 1 min | Counter cache |
| Follow list | Redis | 30 min | Small list |
| Story ring | Redis | 24 hours | Match story TTL |

### Like Count — The Redis Counter Problem
```
Naive approach: UPDATE posts SET like_count = like_count + 1 → DB bottleneck!
  (1,000 concurrent likes on viral post = 1,000 DB writes/sec)

Better: Redis counter + async flush
  INCR like_count:post_abc      ← in Redis (atomic, fast)
  Every few minutes: UPDATE posts SET like_count = <redis value>

Or: Kafka event per like → batch update like counts
```

---

## 7. 📸 Stories System (24h Ephemeral Content)

```
Storage:
- Story media → S3 (CDN-served)
- Story metadata → Redis (with 24h TTL!) + Cassandra

Story Feed:
- "Ring" display: users with unviewed stories appear first
- Track views: SET "story:{id}:views" {user_id, ...}
- Auto-delete after 24 hours: Redis TTL + S3 lifecycle rule

Redis Structure:
  Key: "stories:{userId}"  
  Type: Sorted Set (score = created_at unix timestamp)
  TTL: 24 hours per story
  
  ZADD stories:user123 1709500000 "storyId:abc"
  ZREMRANGEBYSCORE stories:user123 0 (NOW-86400)  ← cleanup
```

---

## 8. 📈 Scaling Strategy

### Read Scaling (115,000 requests/sec)
```
Redis Cluster:
- Shard feeds by user_id % 100
- Each shard = 1 Redis node
- 100 nodes × 100K ops/sec = 10M ops/sec capacity
- More than enough headroom

CDN:
- Post images/videos: CDN-served (99%+ cache hit)
- Profile pictures: CDN with 1-day TTL

Database:
- Cassandra read replicas per data center
- Consistency: ONE (fastest, eventual) for feeds
- Consistency: QUORUM for likes/follows
```

### Write Scaling (1,160 posts/sec)
```
Fan-out Service:
- Consumes from Kafka "post.created" topic
- For each post: lookup followers, push to their feeds
- Horizontal scaling: 10 fan-out workers for 1,160/sec

For celebrities (skip fan-out):
- Just write to their own post list
- Followers pull at read time (small overhead per read query)
```

---

## 9. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Spam / bot posts** | Rate limit: 100 posts/hour per account |
| **Scraping** | Rate limit API, CAPTCHA on suspicious patterns |
| **Hate speech / NSFW** | ML content moderation + user reporting |
| **Fake followers** | Follow rate limit (60 follows/hour), bot detection |
| **Private account** | Check follow relationship before serving posts |
| **Copyright** | DMCA takedown endpoint, fingerprinting (YouTube's approach) |
| **Data privacy** | User can delete all data (GDPR right to erasure) |

---

## 10. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Celebrity fan-out** | 10M followers × 1 post = 10M writes | Hybrid: pull for celebrities |
| **Feed staleness** | Pre-built feed is stale | Refresh on load + push new posts via WebSocket |
| **Storage for feeds** | 1B users × 800 posts = massive Redis | Active users only; rebuild on demand |
| **Algorithmic bias** | ML echo chamber | Balance: 80% interests, 20% explore |
| **Video cost** | 100M videos/day = petabytes | Adaptive bitrate, CDN, compression |
| **Like count accuracy** | Eventual consistency | Show "1.2K" not exact number — users don't care |
| **Comment ordering** | Chronological vs ranked | Ranked replies + show top comments first |

---

## 📝 Summary Box

```
┌────────────────────────────────────────────────┐
│  SOCIAL MEDIA FEED — KEY DECISIONS             │
│                                                │
│  Feed Storage:  Redis Sorted Set (prebuilt)    │
│  Fan-out:       Hybrid (write for regular,     │
│                 read for celebrities)           │
│  Posts:         Cassandra (time-series)        │
│  Graph:         PostgreSQL (follow relations)  │
│  Ranking:       ML model (engagement signals)  │
│  Pagination:    Cursor-based (not offset!)     │
│  Stories:       Redis TTL + S3                 │
│  Likes:         Redis counter → async flush    │
│  Scale reads:   Redis Cluster (sharded)        │
└────────────────────────────────────────────────┘
```

**← Previous**: [File Storage](./06-File-Storage-System.md) | **Next**: [Ride Sharing App →](./08-Ride-Sharing-App.md)
