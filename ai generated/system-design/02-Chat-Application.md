# 💬 System Design #02 — Chat Application
> **Like**: WhatsApp, Slack, Telegram, Discord  
> **Difficulty**: ⭐⭐⭐ | **Teaches**: WebSockets, Pub/Sub, Message Queues, Presence

---

## 📋 Requirements

### Functional Requirements
- 1-on-1 real-time messaging
- Group chats (up to 500 members)
- Message delivery status: Sent ✓ / Delivered ✓✓ / Read 👁
- Online presence (last seen)
- Push notifications (offline users)
- Message history (persistent)
- Media sharing (images, files)

### Non-Functional Requirements
- **Users**: 500 million registered, 100 million daily active
- **Peak Traffic**: ~500,000 messages/second
- **Data Size**: 100B messages × 1KB avg ≈ **100 TB** over 5 years
- **Availability**: 99.99% — users expect real-time
- **Latency**: < 100ms message delivery
- **Budget**: High
- **Tech**: Node.js, WebSockets, Redis Pub/Sub, Kafka, Cassandra, AWS

---

## 1. 🏛️ High-Level Architecture

```
[User A's Phone]
     │  WebSocket connection
     ▼
[Load Balancer]  ← Layer 7 (sticky sessions for WebSocket)
     │
     ▼
[Chat Server Cluster]      ← Stateful WebSocket servers
     │           │
     │           └──► [Redis Pub/Sub]   ← Cross-server message fan-out
     │                      │
     │           ┌──────────┘
     │           ▼
[Chat Server 2]  ── WebSocket ──► [User B's Phone]
     │
     ├──► [Message Queue (Kafka)]   ← Persist + async processing
     │         │
     │         ▼
     │    [Message DB (Cassandra)]  ← Write-optimized, append-only
     │
     ├──► [Presence Service]        ← Redis (who is online)
     │
     └──► [Notification Service]    ← Push to offline users (FCM/APNs)
```

### Why WebSocket over HTTP?
```
HTTP Polling:     Client asks "any messages?" every 1 sec → wasteful
Long Polling:     Client waits, server holds, expensive at scale
Server-Sent:      One-way (server → client), not bidirectional
WebSocket (✅):  Full-duplex, persistent, low overhead
```

---

## 2. 🗄️ Database Design

### Why Cassandra? (Not PostgreSQL!)
```
✓ Write-optimized (append log structure = LSM tree)
✓ Designed for high-throughput time-series writes
✓ Natural partitioning by conversation_id
✓ Easy horizontal sharding
✗ No complex joins, no ACID across rows
→ That's fine! Chats are always "get messages for conv X"
```

### Messages Table (Cassandra)
```sql
CREATE TABLE messages (
    conversation_id  UUID,
    message_id       TIMEUUID,          -- time-sortable UUID
    sender_id        UUID,
    content          TEXT,
    media_url        TEXT,              -- S3 link if file
    message_type     TEXT,             -- 'text' | 'image' | 'file'
    status           TEXT,             -- 'sent' | 'delivered' | 'read'
    created_at       TIMESTAMP,

    PRIMARY KEY (conversation_id, message_id)  -- partition + cluster
) WITH CLUSTERING ORDER BY (message_id DESC);  -- newest first
```

### Partition Strategy
```
Partition key = conversation_id
→ All messages for one conversation on same node
→ Efficient range queries: "get last 50 messages"
→ Problem: Large group chats = hot partition
→ Solution: Add time bucket: (conversation_id, YYYYMM)
```

### Conversations Table (PostgreSQL)
```sql
CREATE TABLE conversations (
    id           UUID PRIMARY KEY,
    type         VARCHAR(10),   -- 'direct' | 'group'
    name         TEXT,          -- null for direct msgs
    created_at   TIMESTAMPTZ
);

CREATE TABLE conversation_members (
    conversation_id  UUID REFERENCES conversations(id),
    user_id          UUID,
    joined_at        TIMESTAMPTZ,
    role             VARCHAR(10), -- 'admin' | 'member'
    PRIMARY KEY (conversation_id, user_id)
);
```

---

## 3. 🔌 API Structure

### WebSocket Events (Real-time)
```javascript
// Client → Server
SEND_MESSAGE:    { conversationId, content, messageType, clientMsgId }
TYPING_START:    { conversationId }
TYPING_STOP:     { conversationId }
ACK_RECEIPT:     { messageId, status: 'delivered' | 'read' }

// Server → Client
NEW_MESSAGE:     { messageId, conversationId, senderId, content, timestamp }
DELIVERY_RECEIPT:{ messageId, status, timestamp }
USER_TYPING:     { conversationId, userId }
USER_ONLINE:     { userId, status: 'online' | 'offline', lastSeen }
```

### REST APIs (Non-real-time)
```
POST /api/conversations              → Create new conversation
GET  /api/conversations              → List user's conversations
GET  /api/conversations/:id/messages → Paginated message history
POST /api/media/upload               → Get S3 presigned URL for media
PUT  /api/messages/:id/status        → Update message status
GET  /api/users/:id/presence         → Get online status
```

---

## 4. 📨 Message Flow — Step by Step

### Scenario: User A sends message to User B

```
1. User A types, presses send
2. App sends via WebSocket to Chat Server 1
3. Chat Server 1:
   a. Assigns message_id (TIMEUUID)
   b. Publishes to Redis Pub/Sub channel: "conversation:{id}"
   c. Acks back to User A: { status: 'sent', messageId }
   d. Sends to Kafka topic: "messages"

4. Redis Pub/Sub:
   - If User B connected to Chat Server 1 → direct delivery
   - If User B connected to Chat Server 2 → pub/sub broadcasts to server 2
   - Chat Server 2 → WebSocket → User B

5. Kafka Consumer (Message Persister):
   - Writes message to Cassandra (durable)
   - Batch writes for efficiency (bulk inserts)

6. User B receives → sends ACK: "delivered"
7. Server stores delivery receipt, notifies User A

8. If User B is OFFLINE:
   - Notification Service reads from Kafka
   - Sends push notification via FCM (Android) / APNs (iOS)
```

---

## 5. 🟢 Presence System (Who is Online?)

```
Implementation with Redis:

1. On WebSocket CONNECT:
   redis.set("user:{id}:status", "online", EX=30)
   redis.zadd("online_users", timestamp, userId)

2. Heartbeat (every 10 sec from client):
   redis.expire("user:{id}:status", 30)

3. On WebSocket DISCONNECT or timeout:
   redis.set("user:{id}:status", "offline")
   redis.set("user:{id}:last_seen", timestamp)

4. Check if user is online:
   redis.get("user:{id}:status") === "online"

5. Broadcast presence to friends:
   Publish to Redis channel "user:{id}:presence"
   Friends subscribed to this channel get notified
```

---

## 6. ⚡ Caching Strategy

| Cache Target | Tool | TTL | Reason |
|---|---|---|---|
| User session / auth | Redis | 24h | Fast auth check |
| Recent messages | Redis | 1h | Avoid DB for latest 50 msgs |
| Online presence | Redis | 30s | Heartbeat-based |
| User profile | Redis | 5m | Read-heavy, rarely changes |
| Conversation metadata | Redis | 5m | Members list, group info |

```javascript
// Caching recent messages (cache-aside)
async function getMessages(conversationId, limit = 50) {
    const cacheKey = `msgs:${conversationId}:recent`;
    
    // Try Redis first
    const cached = await redis.lrange(cacheKey, 0, limit - 1);
    if (cached.length === limit) return cached.map(JSON.parse);
    
    // Cache miss → Cassandra
    const msgs = await cassandra.execute(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY message_id DESC LIMIT ?',
        [conversationId, limit]
    );
    
    // Cache for 1 hour
    await redis.lpush(cacheKey, ...msgs.map(JSON.stringify));
    await redis.expire(cacheKey, 3600);
    return msgs;
}
```

---

## 7. 📈 Scaling Strategy

### Chat Server Scaling
```
Problem: WebSocket = persistent connection = stateful server
Solution 1: Sticky Sessions (IP Hash LB) — user always hits same server
Solution 2: Redis Pub/Sub — messages fan out across all servers (✅)

Scale:
- 1 Chat server handles ~50,000 WebSocket connections
- 100M users / 50,000 = 2,000 Chat Servers needed at peak
- Auto-scaling based on connection count metric
```

### Database Scaling
```
Cassandra:
- Designed to scale horizontally
- Add nodes → data rebalances automatically
- Replication factor = 3 (survives 2 node failures)
- 500K writes/sec → easily handled with 20-node cluster

Kafka:
- Partition by conversation_id or userId
- Multiple consumer groups for parallel processing
- Retention: 7 days (replay if consumer falls behind)
```

---

## 8. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Message interception** | End-to-end encryption (E2EE) with Signal Protocol |
| **Man-in-the-middle** | TLS/HTTPS + WSS (WebSocket Secure) |
| **Unauthorized access** | JWT tokens on WebSocket handshake |
| **Spam/Flooding** | Rate limit: 100 msgs/minute per user |
| **Message tampering** | Message hash/signature verification |
| **Data at rest** | AES-256 encryption in Cassandra |
| **GDPR** | Message deletion API, data export |

```javascript
// WebSocket auth on handshake
wss.on('connection', (ws, req) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const user = verifyJWT(token);
    if (!user) {
        ws.close(4001, 'Unauthorized');
        return;
    }
    ws.userId = user.id;
    // proceed...
});
```

---

## 9. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Hot partitions** | Large groups (500 members) = hotspot | Bucket by time + fan-out limit |
| **Message ordering** | Clock skew between servers | TIMEUUID (Cassandra) for monotonic IDs |
| **Connection loss** | WebSocket drops silently | Heartbeat + reconnect with lastMsgId |
| **Offline message delivery** | User offline for days | FCM/APNs + message inbox in DB |
| **Group fan-out** | 500 members × 1 msg = 500 writes | Async Kafka + batch notification |
| **E2EE vs search** | Can't search encrypted content | Trade-off: Offer only local search |
| **Media storage** | 1M images/day = 1TB/day | S3 + CDN + image compression |

---

## 📝 Summary Box

```
┌─────────────────────────────────────────────┐
│  CHAT APP — KEY DECISIONS                   │
│                                             │
│  Transport:   WebSocket (full-duplex)       │
│  Fan-out:     Redis Pub/Sub (cross-server)  │
│  Persistence: Kafka → Cassandra             │
│  Presence:    Redis with 30s TTL heartbeat  │
│  Offline:     FCM / APNs push              │
│  Media:       S3 + CloudFront CDN          │
│  Security:    E2EE + JWT + TLS/WSS         │
│  Scaling:     Redis Pub/Sub + 2000 servers  │
└─────────────────────────────────────────────┘
```

**← Previous**: [URL Shortener](./01-URL-Shortener.md) | **Next**: [E-Commerce Platform →](./03-Ecommerce-Platform.md)
