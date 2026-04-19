# 🔔 System Design #05 — Notification System
> **Like**: Swiggy alerts, YouTube notifications, WhatsApp push, Email campaigns  
> **Difficulty**: ⭐⭐⭐ | **Teaches**: Fan-out, Priority Queues, Retry Logic, Multi-channel

---

## 📋 Requirements

### Functional Requirements
- Send notifications via: **Email, SMS, Push (FCM/APNs), In-App, WhatsApp**
- Trigger types: User-initiated (message), System (order update), Marketing (promotions)
- User notification preferences (opt-in/out per channel)
- Scheduled notifications (send at 9 AM in user's timezone)
- Notification history (last 30 days)
- Read/unread tracking (in-app)

### Non-Functional Requirements
- **Users**: 100 million users
- **Volume**: 1 billion notifications/day ≈ **11,574 notifications/second**
- **Priority**: Critical (OTP, payment) < 1s | Normal (likes, comments) < 30s | Bulk (promo) < 6h
- **Availability**: 99.9% (some delay acceptable, not loss)
- **Reliability**: At-least-once delivery with idempotency
- **Budget**: Medium
- **Tech**: Node.js, Kafka, Redis, PostgreSQL, AWS SES/SNS, Firebase

---

## 1. 🏛️ High-Level Architecture

```
[Event Producers]          → Various services trigger events
  ├─ Order Service         "order.shipped"
  ├─ Payment Service       "payment.success"
  ├─ Social Service        "post.liked"
  └─ Marketing System      "campaign.scheduled"
          │
          ▼
    [Kafka Topics]         ← Decouple producers from consumers
    ├─ critical-events     (OTP, payment alerts) — Priority 1
    ├─ transactional       (order, delivery) — Priority 2
    └─ marketing           (promo, newsletters) — Priority 3
          │
          ▼
  [Notification Service]   ← Core orchestrator
     ├─ Event Router       ← Determine who to notify + which channel
     ├─ Preference Checker ← Does user want this notification?
     ├─ Template Engine    ← Personalize message with user data
     └─ Dispatcher         ← Send to channel-specific workers
          │
     ┌────┴─────────────────────────────────────┐
     ▼         ▼           ▼           ▼        ▼
[Email]    [SMS]     [Push]     [In-App]  [WhatsApp]
[SES]    [Twilio]  [FCM/APNs]  [Websocket] [360dialog]
```

---

## 2. 🗄️ Database Design

### Notifications Table (PostgreSQL)
```sql
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    type            VARCHAR(50) NOT NULL,    -- 'order_shipped' | 'payment_success'
    category        VARCHAR(20) NOT NULL,    -- 'transactional' | 'marketing'
    priority        SMALLINT DEFAULT 2,      -- 1=critical, 2=normal, 3=low
    
    title           TEXT,
    body            TEXT NOT NULL,
    data            JSONB,                   -- extra payload (deep link, image URL)
    
    channels        TEXT[] NOT NULL,         -- ['email', 'push', 'sms']
    
    -- Status per channel
    email_status    VARCHAR(20),             -- 'pending'|'sent'|'failed'|'bounced'
    sms_status      VARCHAR(20),
    push_status     VARCHAR(20),
    inapp_status    VARCHAR(20),
    
    -- Read tracking (in-app)
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    
    -- Scheduling
    scheduled_at    TIMESTAMPTZ,             -- NULL = send immediately
    sent_at         TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_notifications ON notifications(user_id, created_at DESC);
CREATE INDEX idx_scheduled ON notifications(scheduled_at) WHERE sent_at IS NULL;
```

### User Preferences Table
```sql
CREATE TABLE user_notification_preferences (
    user_id         UUID PRIMARY KEY,
    
    -- Channel opt-in/out
    email_enabled   BOOLEAN DEFAULT TRUE,
    sms_enabled     BOOLEAN DEFAULT TRUE,
    push_enabled    BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    
    -- Category opt-in/out
    marketing_email BOOLEAN DEFAULT TRUE,
    marketing_push  BOOLEAN DEFAULT FALSE,
    marketing_sms   BOOLEAN DEFAULT FALSE,
    
    -- Quiet hours (don't disturb)
    quiet_start     TIME,           -- e.g., '22:00'
    quiet_end       TIME,           -- e.g., '08:00'
    timezone        VARCHAR(50) DEFAULT 'Asia/Kolkata',
    
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Delivery Logs (for retry & audit)
```sql
CREATE TABLE delivery_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES notifications(id),
    channel         VARCHAR(20) NOT NULL,
    attempt_number  SMALLINT NOT NULL DEFAULT 1,
    status          VARCHAR(20) NOT NULL,    -- 'success'|'failed'|'bounced'
    provider_id     VARCHAR(100),           -- SES message ID, FCM message ID
    error_message   TEXT,
    attempted_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. 🔌 API Structure

### Internal APIs (called by other services)
```
POST /internal/notifications/send
{
  "event_type": "order.shipped",
  "user_id": "user_123",
  "data": {
    "order_id": "ord_456",
    "tracking_url": "https://track.example.com/xyz",
    "estimated_delivery": "2026-03-06"
  }
}

POST /internal/notifications/schedule
{
  "event_type": "marketing.promo",
  "user_ids": ["user_1", "user_2", ...],   // or segment_id
  "send_at": "2026-03-05T09:00:00Z",
  "template_id": "tmpl_summer_sale"
}
```

### User-facing APIs
```
GET  /api/notifications              → In-app notification list (paginated)
PUT  /api/notifications/:id/read     → Mark as read
PUT  /api/notifications/read-all     → Mark all as read
GET  /api/notifications/preferences  → Get user preferences
PUT  /api/notifications/preferences  → Update preferences
GET  /api/notifications/count        → Unread count (for badge)
```

---

## 4. 📨 Notification Flow — Step by Step

### Order Shipped Example
```
1. Order Service places order → "order.shipped" event to Kafka

2. Notification Service consumes event:
   a. Load user preferences from cache/DB
   b. Check: Is user opted in?
   c. Apply quiet hours: Is it 11 PM? Delay SMS/push, still send email
   d. Render templates: "Your order #456 has shipped! Track: ..."
   e. Determine channels: [email, push, sms]
   f. Create notification record in DB (status: pending)
   g. Push jobs to channel-specific queues:
      ENQUEUE: email-queue     → { notifId, userId, template, data }
      ENQUEUE: push-queue      → { notifId, deviceToken, payload }
      ENQUEUE: sms-queue       → { notifId, phone, message }

3. Channel Workers (separate services):
   Email Worker  → SES.sendEmail() → mark status 'sent' / 'failed'
   Push Worker   → FCM.send()      → mark status 'sent' / 'failed'
   SMS Worker    → Twilio.create() → mark status 'sent' / 'failed'

4. On failure → Retry with exponential backoff
5. After 3 retries → Dead Letter Queue (manual investigation)
```

---

## 5. 🔁 Retry & Reliability Strategy

```
Exponential Backoff:
  Attempt 1: immediately
  Attempt 2: after 1 minute
  Attempt 3: after 5 minutes
  Attempt 4: after 30 minutes
  After 3 retries → Dead Letter Queue

Priority Queues (Kafka topics):
  critical-queue:     OTP, payment, security alerts
                      → Workers: 50 (process immediately)
  transactional-queue: Order updates, delivery alerts
                      → Workers: 20 (within 30 sec)
  marketing-queue:    Promos, newsletters
                      → Workers: 5 (best effort)

At-least-once delivery:
  - Kafka offset committed AFTER successful delivery
  - Idempotency on provider's message ID prevents duplicates
  - FCM/APNs have built-in dedup on message ID
```

---

## 6. 📅 Scheduled Notifications ("Send at 9 AM")

```
Challenge: 100M users × 1 notification = 100M sends, all at 9 AM!

Solution: Staggered scheduling + sharding

Architecture:
1. Cron Job (every 5 min): "Find all notifications due in next 5 min"
   SELECT * FROM notifications
   WHERE scheduled_at BETWEEN NOW() and NOW() + INTERVAL '5 min'
   AND sent_at IS NULL;

2. Push found notifications to Kafka marketing-queue
3. Workers process and send

User Timezone Handling:
  - Store user timezone in preferences
  - "9 AM in user's timezone" = convert to UTC per user
  - Already handled during scheduling: scheduled_at stored in UTC

Bulk Campaign:
  - Don't SELECT 100M rows at once!
  - Use cursor/pagination: process 1000 users at a time
  - Rate limiter: Max 1000 emails/second (SES limit)
```

---

## 7. ⚡ Caching Strategy

| Data | Cache | TTL | Pattern |
|------|-------|-----|---------|
| User preferences | Redis | 15 min | Cache-aside |
| User device tokens | Redis | 24 hours | Updated on app open |
| Unread count | Redis | 1 hour | Increment/decrement |
| Notification templates | Redis | 1 hour | Rarely changes |
| User email/phone | Redis | 5 min | Avoid DB on every send |

```javascript
// Optimized unread count (avoid COUNT query every time)
async function markAsRead(userId, notifId) {
    await db.update(notifications, { is_read: true }, { id: notifId });
    await redis.decr(`unread_count:${userId}`);
}

async function getUnreadCount(userId) {
    const key = `unread_count:${userId}`;
    const cached = await redis.get(key);
    if (cached !== null) return parseInt(cached);
    
    // Cache miss - count from DB
    const count = await db.count(notifications, { user_id: userId, is_read: false });
    await redis.setex(key, 3600, count);
    return count;
}
```

---

## 8. 📈 Scaling Strategy

### High Volume Handling (1B/day)
```
Kafka Throughput:
- 11,574 events/sec → Kafka handles 1M+ events/sec easily
- Partition by user_id % 100 → 100 partitions
- Each partition processed by 1 consumer (ordered delivery)

Worker Pool Scaling:
- Email workers: Auto-scale based on queue depth
- Push workers: FCM supports 500,000 msgs/sec per project
- SMS workers: Rate limited by Twilio (~$0.05/SMS, throttled)

Multi-Provider Fallback:
- Email: Primarily SES, fallback to SendGrid
- SMS: Primarily Twilio, fallback to Plivo
- Push: FCM (Android), APNs (iOS) — no fallback needed

Database:
- Partition notifications table by created_at (monthly)
- Archive old notifications to cold storage after 90 days
- Delete raw records after 1 year (compliance)
```

---

## 9. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Notification spam** | Rate limit per user per channel per hour |
| **Phishing via push** | Only send links to whitelisted domains |
| **SMS pumping fraud** | Phone verification + rate limit SMS per IP |
| **Unsubscribe compliance** | One-click unsubscribe in every marketing email (CAN-SPAM) |
| **GDPR** | Deleted user's notifications purged within 30 days |
| **Data leakage** | Never include sensitive data (card numbers) in notifications |
| **Token security** | Device tokens stored encrypted, rotated on revocation |

---

## 10. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **SES rate limit** | 14 msgs/sec on free tier | Production: 50K/day → request increase |
| **Fan-out to 1M users** | Promo campaign → DB reads for all users | Batch processing + stream users |
| **Device token staleness** | FCM returns "invalid token" = uninstalled | Delete token, update DB |
| **Template rendering** | 1M personalized emails = 1M renders | Pre-render with batch job |
| **Timezone errors** | User gets promo at 3 AM | Strict UTC + timezone conversion |
| **Duplicate sends** | Retry after crash → double notification | Idempotency check before send |
| **Push delivery rates** | 60-70% push deliver rate (typical) | Multiple channel fallback |

---

## 📝 Summary Box

```
┌──────────────────────────────────────────────────┐
│  NOTIFICATION SYSTEM — KEY DECISIONS             │
│                                                  │
│  Decoupling:   Kafka (producers don't know svc)  │
│  Priority:     3 queues (critical/normal/bulk)   │
│  Reliability:  At-least-once + retry + DLQ       │
│  Channels:     Email|SMS|Push|In-app|WhatsApp    │
│  Preferences:  Per-user, per-category opt-in     │
│  Scheduling:   Cron → Kafka → Workers            │
│  Scale:        Auto-scaling workers per queue    │
│  Compliance:   CAN-SPAM, GDPR, unsubscribe link  │
└──────────────────────────────────────────────────┘
```

**← Previous**: [Payment System](./04-Payment-System.md) | **Next**: [File Storage System →](./06-File-Storage-System.md)
