# 📈 High Throughput Systems — Redis, Kafka, Logging & Monitoring

## Phase 8: Scaling Backend Systems

---

# 🔴 Redis

## What is Redis?
**Redis (Remote Dictionary Server)** is an in-memory data structure store used as:
- **Cache** (most common use case — incredibly fast)
- **Message broker** (Pub/Sub, Streams)
- **Session store**
- **Leaderboard** (sorted sets)
- **Rate limiter** (distributed, across multiple servers)

Redis stores everything in **RAM** — operations are sub-millisecond fast.

## When to Use Redis
- Store session tokens (instead of DB lookup on every request)
- Cache expensive DB query results
- Rate limiting across multiple server instances
- Real-time leaderboards (online gaming, scores)
- Job queues

## Redis Data Types
```
String  → Simple key-value
List    → Ordered collection (FIFO queues)
Set     → Unique unordered values
Sorted Set → Set with scores (leaderboards)
Hash    → Object fields (like a map)
Stream  → Append-only log of events
```

## Redis Commands (essential)
```bash
# String
SET name "Alice"
GET name                   # "Alice"
SET counter 0
INCR counter               # 1
INCR counter               # 2
EXPIRE name 3600           # expires in 1 hour
TTL name                   # seconds remaining
DEL name                   # delete

# Hash (like an object)
HSET user:1 name "Alice" email "alice@example.com" age 28
HGET user:1 name           # "Alice"
HGETALL user:1             # all fields
HDEL user:1 age

# List (queue)
LPUSH tasks "task1"        # push to left
RPUSH tasks "task3"        # push to right
LRANGE tasks 0 -1          # get all
LPOP tasks                 # pop from left

# Set
SADD tags "nodejs" "express" "redis"
SMEMBERS tags
SISMEMBER tags "redis"     # 1 (exists)
SUNION tags1 tags2         # union of sets

# Sorted Set (leaderboard)
ZADD leaderboard 100 "Alice"
ZADD leaderboard 250 "Bob"
ZADD leaderboard 175 "Charlie"
ZREVRANGE leaderboard 0 -1 WITHSCORES  # top to bottom with scores
ZRANK leaderboard "Alice"              # rank (0-indexed)
```

## Redis in Node.js
```javascript
// npm install ioredis
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

// Simple caching
async function getCachedUsers() {
  const cacheKey = "users:all";
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log("Cache HIT");
    return JSON.parse(cached);
  }
  
  console.log("Cache MISS — fetching from DB");
  const users = await db.select().from(usersTable);
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(users));
  
  return users;
}

// Invalidate cache when data changes
async function updateUser(id, data) {
  await db.update(users).set(data).where(eq(users.id, id));
  await redis.del("users:all"); // clear the cache
}

// Distributed rate limiting
async function checkRateLimit(userId) {
  const key = `rate:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60); // 1 minute window
  return count <= 100; // 100 requests per minute per user
}
```

## Redis Streams
```javascript
// Append events to stream
await redis.xadd("orders:stream", "*",
  "userId", "user_123",
  "product", "Laptop",
  "amount", "999"
);

// Read from stream
const messages = await redis.xread("COUNT", 10, "STREAMS", "orders:stream", "0");
```

---

# 🟡 Apache Kafka

## What is Kafka?
**Apache Kafka** is a distributed, **append-only log** system designed for high-throughput, fault-tolerant event streaming.

```
Producers → [Kafka Topic (Log)] → Consumers
```

Think of Kafka as a **distributed newspaper printing press**:
- Producers write articles (events)
- The newspaper is the Topic (messages are retained)
- Many readers (consumers) can read independently at their own pace
- Yesterday's papers are still available (message retention)

## Why Kafka?
- **Decoupling** — producers don't know about consumers (loose coupling)
- **Durability** — messages are persisted to disk (not just memory)
- **Scalability** — horizontal scaling via partitions
- **Replay** — re-process old events (unlike queues that delete on consume)
- **Multi-consumer** — same event consumed by multiple independent services

## Key Concepts
| Term          | Meaning                                                      |
|---------------|--------------------------------------------------------------|
| Topic         | Named category/channel for messages                          |
| Partition     | Unit of parallelism — topic is split into N partitions       |
| Offset        | Position of a message in a partition                         |
| Producer      | Service that publishes messages to a topic                   |
| Consumer      | Service that reads messages from a topic                     |
| Consumer Group| Group of consumers that share the work on a topic            |
| Broker        | A single Kafka server node                                   |
| Zookeeper     | Coordinates Kafka brokers (being replaced by KRaft)          |

## Kafka Consumer Groups
```
Topic: "user.events" — 4 partitions
Consumer Group: "email-service"

Partition 0 → Consumer A
Partition 1 → Consumer B
Partition 2 → Consumer A (if only 2 consumers)
Partition 3 → Consumer B

→ Work is distributed! Add more consumers to scale up.
→ If Consumer A dies, Consumer B takes over its partitions.
```

## Pub/Sub Pattern with Kafka
```javascript
// npm install kafkajs
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

// Producer
const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: "user.created",
  messages: [
    {
      key: userId,  // ensures same user events go to same partition
      value: JSON.stringify({ id: userId, name, email, timestamp: Date.now() })
    }
  ]
});

// Consumer
const consumer = kafka.consumer({ groupId: "email-service" });
await consumer.connect();
await consumer.subscribe({ topic: "user.created", fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const user = JSON.parse(message.value.toString());
    console.log(`Processing: User ${user.name} created`);
    await sendWelcomeEmail(user.email);
  }
});
```

---

# 📋 Logging & Monitoring

## Why Logging?
- Debug issues in production (you can't attach a debugger to a live server)
- Track user behavior / audit trail
- Monitor health and performance
- Alert on errors

## Logging Levels
```
ERROR  → Something failed that needs immediate attention (DB down, crash)
WARN   → Something unexpected but recoverable (invalid input, deprecation)
INFO   → Normal operations (server started, user logged in)
HTTP   → HTTP request logs
DEBUG  → Detailed info for debugging (variable values, function calls)
VERBOSE→ Even more detailed (usually disabled in production)
SILLY  → Maximum verbosity
```

**Rule:** Production should log `warn` and `error`. Dev can log `debug` and below.

## Structured Logging with Winston
```javascript
// npm install winston
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),  // include stack traces
    winston.format.json()                     // structured JSON logs
  ),
  transports: [
    // Console (human-readable in dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) =>
          `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`
        )
      )
    }),
    // File: separate error logs
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // File: all logs
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});

// Usage:
logger.info("Server started", { port: 3000, environment: "production" });
logger.warn("Deprecated API used", { endpoint: "/old-route", userId: "123" });
logger.error("Database query failed", { error: err.message, stack: err.stack });
logger.debug("User object", { user: { id: 1, name: "Alice" } });
```

## HTTP Request Logging with Morgan
```javascript
// npm install morgan
const morgan = require("morgan");

// Predefined formats: combined, common, dev, short, tiny
app.use(morgan("combined")); // Apache Combined Log Format

// Custom format:
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// Stream to Winston:
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));
```

## Storing Logs
```
Development: Console output + local log files
Production:  External log services (aggregation, search, alerting)

External services:
- Axiom      → modern, fast, S3-backed long retention
- Datadog    → comprehensive monitoring + logging
- Logtail    → simple, affordable
- ELK Stack  → Elasticsearch + Logstash + Kibana (self-hosted)
- CloudWatch → AWS native logging
```

## PM2 — Process Management
```bash
# install globally
npm install -g pm2

# Start app with PM2
pm2 start app.js --name "my-api"

# Start with environment
pm2 start app.js --name "my-api" --env production

# Ecosystem file (pm2.config.js) — recommended
module.exports = {
  apps: [{
    name: "api",
    script: "./dist/server.js",
    instances: "max",     // use all CPU cores (cluster mode)
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    },
    max_memory_restart: "500M",  // restart if memory > 500MB
    error_file: "./logs/pm2-error.log",
    out_file: "./logs/pm2-out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};

pm2 start pm2.config.js --env production

# Monitoring:
pm2 status          # list all processes
pm2 logs            # real-time logs
pm2 monit           # dashboard
pm2 reload all      # zero-downtime reload

# Auto-start on system boot:
pm2 startup
pm2 save
```

## OpenTelemetry (OTEL) — Observability
```javascript
// OpenTelemetry = standard for distributed tracing, metrics, and logs

// npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node

// tracing.js (required BEFORE app starts: node -r ./tracing.js server.js)
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTLP_ENDPOINT,  // e.g., Axiom or SigNoz endpoint
    headers: { Authorization: `Bearer ${process.env.AXIOM_TOKEN}` }
  }),
  instrumentations: [getNodeAutoInstrumentations()]  // auto-instrument express, pg, redis, etc.
});

sdk.start();
process.on("SIGTERM", () => sdk.shutdown());

// SigNoz — self-hosted OpenTelemetry-compatible observability platform
// Axiom    — cloud-hosted log and trace storage
```

### The 3 Pillars of Observability:
```
Logs    → Text records of what happened (Winston, Morgan)
Metrics → Numeric measurements over time (CPU%, req/s, error rate)
Traces  → Full request journey across services (OpenTelemetry)
```
