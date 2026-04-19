# Topic 02: Redis & Distributed Caching Patterns

## 1. The Deep Dive: The Shared State Problem
In a clustered (Phase 14.1) or multi-server environment, `localCounter = 1` in Worker A is invisible to Worker B. To scale, we need an "Out-of-Process" memory store.

- **Redis**: An in-memory, key-value data structure store. It is extremely fast (~100k+ ops/sec) and handles global state.

## 2. Essential Caching Patterns
1. **Cache-Aside (Lazy Loading)**: 
   - Check Redis first. 
   - If "Miss", fetch from DB, save to Redis, then return.
2. **Write-Through**: Save to DB and Redis simultaneously.
3. **Pub/Sub**: Broadcast messages across all server instances (e.g., for Real-time chat).

## 3. Internal Working (The Event Loop of Redis)
Redis is single-threaded for its core logic (similar to JS!). This makes it **Thread-Safe** by default—you don't have to worry about two workers overwriting a key at exactly the same microsecond.

## 4. Visual Mental Model: The Central Bulletin Board
- **Clustering**: Multiple independent researchers working in different rooms.
- **IPC**: Researchers passing sticky notes under doors (Slow for large data).
- **Redis**: A giant, digital bulletin board in the hallway. Every researcher can see and update it instantly. It is the **Single Source of Truth**.

---

## 5. Senior-Level Logic: The "Stale-While-Revalidate" Pattern

```javascript
/**
 * SENIOR PATTERN: Smart Cache Utility
 */
async function getCachedData(key, fetcher, ttl = 300) {
    // 1. Get from Redis
    let data = await redis.get(key);
    
    if (data) {
        // [Optional]: If data is older than 'ttl', re-fetch in Background 
        // while returning the "Stale" data for speed.
        return JSON.parse(data);
    }

    // 2. Fetch from heavy source (DB / API)
    console.log("[CACHE MISS] Fetching from Source...");
    const freshData = await fetcher();

    // 3. Store with TTL (Time To Live)
    // ALWAYS set a TTL so your Redis doesn't grow forever.
    await redis.set(key, JSON.stringify(freshData), 'EX', ttl);

    return freshData;
}
```

---

## 6. Pub/Sub Scale Pattern (Horizontal Sync)
When a user joins a chat room on Server A, Server B needs to know.
- **Server A**: `redis.publish('chat_events', 'User Joined!')`
- **Server B**: `redis.subscribe('chat_events')` -> Responds locally.

## 7. Interview Questions (Q&A)
**Q: Why use Redis instead of a local Map in Node.js?**
**A**: Persistence and Sharing. Local Maps vanish on restart and are isolated to one process. Redis survives restarts and connects all nodes in a cluster.

**Q: What is a "Cache Stampede" and how do you prevent it?**
**A**: It's when a popular key expires and 1000 processes all try to hit the DB at once to re-cache it. Prevent it with **Mutex/Locking** or randomizing TTL offsets.

## 8. Real-world Challenge
1. **Challenge**: Implement a Rate Limiter using Redis `INCR` and `EXPIRE`. (The most common usage for performance guarding).
2. **Challenge**: Use Redis Hashes to store user session data instead of raw JSON strings. Why is this more memory efficient?
