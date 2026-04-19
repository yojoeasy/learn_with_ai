# 📊 System Design #10 — Distributed Logging System
> **Like**: Datadog, Splunk, ELK Stack (Elasticsearch + Logstash + Kibana), AWS CloudWatch  
> **Difficulty**: ⭐⭐⭐⭐⭐ | **Teaches**: Log Aggregation, Distributed Systems, Indexing, Alerting

---

## 📋 Requirements

### Functional Requirements
- Collect logs from thousands of microservices and servers
- Store logs reliably (no loss)
- Full-text search over logs
- Filter: by time, service name, log level (ERROR/WARN/INFO), trace ID
- Real-time log streaming (tail -f equivalent)
- Alerting: Alert on specific patterns (e.g., "error rate > 1%")
- Dashboards: Visualize log volume, error rates, latency
- Log retention: 30 days hot, 1 year cold archive

### Non-Functional Requirements
- **Sources**: 10,000+ services across 500+ servers
- **Volume**: 100 billion log lines/day ≈ **1.1 million logs/second**
- **Data Size**: 1 log avg 1 KB → 100 TB/day
- **Availability**: 99.9% — logs are monitoring infrastructure
- **Query Latency**: < 5 seconds for search over 30-day window
- **Budget**: Medium (logs shouldn't cost more than the systems they monitor!)
- **Tech**: Node.js, Kafka, Elasticsearch, Flink, S3, Grafana, Prometheus

---

## 1. 🏛️ High-Level Architecture

```
[Services / Applications / Servers]
        │
   Log Agents (Filebeat/Fluentd — sidecar per server)
        │
        ▼
[Kafka: log-ingestion topics]     ← High-throughput buffer
        │
   ┌────┴──────────────────────────────────┐
   │                                       │
   ▼                                       ▼
[Stream Processor (Flink)]         [Archive Worker]
 - Parse & enrich logs              - Compress logs (gzip)
 - Filter out noise                 - Write to S3 (cold storage)
 - Anomaly detection
 - Alert on error patterns
        │
        ▼
[Elasticsearch Cluster]           ← Hot storage (30 days indexed)
        │
        ▼
[Kibana / Grafana]                ← Visualization / Dashboards
        │
[Alert Manager]                   ← PagerDuty / Slack alerts
```

---

## 2. 🧩 Log Agents — Collecting Logs at Source

### Why log agents? (Not directly to Kafka!)
```
Problem: If service crashes, in-process logging loses buffered logs.
Solution: Agent runs as sidecar (separate process), survives service crash.

Agent responsibilities:
  1. Tail log files (follow /var/log/app/*.log)
  2. Parse log format (JSON, plain text, nginx format)
  3. Add metadata: { hostname, service_name, container_id }
  4. Buffer locally (disk-backed, 100 MB buffer)
  5. Send to Kafka (retry on failure)
  6. Track offset (don't re-send already-sent logs)

Popular agents:
  Filebeat     → Lightweight, configurable, Go-based
  Fluentd      → More features, plugins for various sources
  Fluent Bit   → Ultra-lightweight for containers/k8s
  Vector       → Modern, high-performance, Rust-based
```

### Log Format (Structured JSON — always use this!)
```json
{
  "timestamp": "2026-03-04T19:34:24.123Z",
  "level": "ERROR",
  "service": "payment-service",
  "version": "v2.3.1",
  "host": "ip-10-0-1-23",
  "trace_id": "abc123def456",    // OpenTelemetry trace ID
  "span_id": "789xyz",
  "user_id": "user_456",
  "message": "Payment gateway timeout after 5000ms",
  "error": {
    "type": "TimeoutError",
    "stack": "...",
    "code": "GATEWAY_TIMEOUT"
  },
  "request_id": "req_789",
  "duration_ms": 5002,
  "http_method": "POST",
  "http_path": "/api/payments/initiate",
  "http_status": 504
}
```

> **Rule**: **Always use structured JSON logs.** Plain text logs require expensive regex parsing later.

---

## 3. 🚌 Kafka — The Ingestion Buffer

### Why Kafka between agents and Elasticsearch?
```
Elasticsearch ingestion rate: ~500K writes/sec (per cluster)
Our log rate: 1.1 million/sec

Without Kafka:
  Elasticsearch overwhelmed → logs dropped → monitoring blind spot

With Kafka:
  Agents → Kafka (handles 20M+ messages/sec)
  Kafka → Elasticsearch (at Elasticsearch's own pace)
  Kafka buffers 7 days of logs as safety net
  If ES cluster goes down → Kafka holds logs → resume when back

Kafka Topic Design:
  "logs-error"    → Only ERROR level (smaller, high priority)
  "logs-warn"     → WARN level
  "logs-info"     → INFO, DEBUG (bulk)
  "logs-raw"      → Everything (for S3 archive path)
  
  Partitioning: By service_name
  → All logs for "payment-service" go to same partition
  → Query can be targeted to specific partition (faster)
```

---

## 4. 🔄 Stream Processing (Apache Flink)

```
Flink consumes from Kafka and does:

1. PARSING (normalize different log formats)
   - Some services log plain text → parse to JSON
   - Validate required fields (timestamp, level, service)

2. ENRICHMENT
   - service_name → add team name (from config store)
   - IP address → add data center and region
   - Add processing timestamp

3. SAMPLING (reduce noise)
   - Keep 100% of ERROR logs
   - Keep 10% of INFO logs
   - Drop DEBUG in production
   
   Savings: 90% reduction in storage!

4. ALERT DETECTION (real-time, not query-time)
   - Sliding window: ERROR count in payment-service > 100/min?
   - Pattern: 3 consecutive 5xx from same service?
   - Send to Alert Manager

5. ROUTING
   - ERROR logs → Elasticsearch (high priority index)
   - INFO/DEBUG → Elasticsearch (separate index, shorter retention)
   - ALL logs → S3 archive via Archive Worker

6. METRICS EXTRACTION
   - From logs extract: http_status, duration_ms
   - Aggregate → Prometheus metrics
   - "99th percentile latency per service" from logs
```

---

## 5. 🗄️ Storage Architecture

### Hot Storage: Elasticsearch (Last 30 Days)
```
Index Strategy:
  - One index per day per log level: logs-error-2026-03-04
  - Index Lifecycle Management (ILM):
    Hot phase (0-7 days):   Fast SSDs, all shards active
    Warm phase (7-30 days): HDDs, read-only, compressed
    Delete phase (>30 days): Auto-delete old indices

Cluster Sizing (for 1.1M logs/sec, 30 days):
  Storage per day: 100 TB × 10% (sampled) = 10 TB/day
  30 days: 300 TB total in Elasticsearch
  
  Sharding: 10 shards per daily index
  Each shard: ~30 GB (Elasticsearch sweet spot)
  
  Cluster: 20 data nodes × 15 TB SSD each

Index Mapping:
{
  "mappings": {
    "properties": {
      "timestamp":   { "type": "date" },
      "level":       { "type": "keyword" },       // exact match, not analyzed
      "service":     { "type": "keyword" },       // exact match
      "message":     { "type": "text", "analyzer": "standard" },  // full-text
      "trace_id":    { "type": "keyword" },
      "duration_ms": { "type": "long" },
      "http_status": { "type": "integer" }
    }
  }
}
```

### Cold Storage: S3 (1 Year)
```
After 30 days:
  1. Export Elasticsearch index to S3 as compressed Parquet files
  2. Delete Elasticsearch index
  3. Users can still search cold logs via Athena (SQL on S3)

S3 structure:
  s3://log-archive/
    year=2025/
      month=12/
        day=15/
          service=payment-service/
            logs-2025-12-15.parquet.gz

Athena query (for cold logs):
  SELECT * FROM logs
  WHERE service = 'payment-service'
    AND level = 'ERROR'
    AND date = '2025-12-15'
  LIMIT 100;
  
  Note: Athena is slow (30s+) but acceptable for month-old forensics
```

---

## 6. 🔌 API Structure

### Log Search API
```
GET /api/logs/search
Query Parameters:
  q         → "payment gateway timeout"  (full-text search)
  service   → payment-service            (filter)
  level     → ERROR                      (filter)
  from      → 2026-03-04T00:00:00Z      (time range start)
  to        → 2026-03-04T23:59:59Z      (time range end)
  trace_id  → abc123def456              (distributed trace lookup)
  limit     → 100
  cursor    → <scroll_id>               (pagination)

Response:
{
  "total": 1523,
  "logs": [
    {
      "timestamp": "2026-03-04T19:34:24Z",
      "level": "ERROR",
      "service": "payment-service",
      "message": "Payment gateway timeout after 5000ms",
      "trace_id": "abc123def456"
    }
  ],
  "next_cursor": "DnF1ZXJ5VGhlbkZldGNoBQ..."
}
```

### Real-time Log Streaming
```
WebSocket: GET /api/logs/stream
Query:
  service=payment-service&level=ERROR

Server:
  - Subscribe to Kafka topic "logs-error" (consumer group)
  - Filter by service name
  - Push matching logs via WebSocket within ~1 second of occurrence

This is the "tail -f" equivalent in distributed systems
```

### Alerts API
```
POST /api/alerts                  → Create alert rule
GET  /api/alerts                  → List alert rules
PUT  /api/alerts/:id             → Update alert rule
DELETE /api/alerts/:id           → Delete alert
GET  /api/alerts/history         → Alert firing history

Alert rule example:
{
  "name": "Payment Error Spike",
  "query": "service:payment-service AND level:ERROR",
  "condition": "count > 50 IN LAST 5m",
  "channel": "slack",
  "channel_config": { "webhook": "https://hooks.slack.com/..." }
}
```

---

## 7. ⚡ Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| Frequent search queries | Redis | 30 sec | "Last 5 min errors" dashboard |
| Service list | Redis | 5 min | Dropdown filter options |
| Alert rules | Redis | 5 min | Avoid DB on every log |
| Aggregated metrics | Redis | 1 min | Dashboard stats |
| ES scroll IDs | Elasticsearch | 2 min | Pagination state |

> ⚠️ **Don't cache raw logs.** Cache only aggregations and metadata.  
> Logs are time-series — same query 10 seconds later = different results.

---

## 8. 🔢 Log Sampling Strategy

```
At 1.1M logs/sec → 100 TB/day → storing everything is expensive

Sampling Rules:
  ERROR  → 100% (never sample errors, you need every one)
  WARN   → 50%  (keep more warning context)
  INFO   → 10%  (general flow, mostly noise)
  DEBUG  → 0%   (never in production — only in dev)
  
  ALSO: Head-based trace sampling
    If trace has an ERROR → keep ALL log levels for that trace
    If trace is normal → apply sampling rules

Result:
  Raw: 100 TB/day
  After sampling: ~15 TB/day
  Savings: 85% cost reduction!
```

---

## 9. 📈 Scaling Strategy

### Kafka Scaling
```
1.1M logs/sec = 1.1 GB/sec (1KB avg log)
Kafka cluster: 30 brokers × 1 GB/sec = 30 GB/sec capacity
Each topic: 100 partitions (1 partition ≈ 1 consumer thread)

Producer (Filebeat): batch.size=65KB, linger.ms=5
  → Batch 65KB before sending (reduces network overhead)
  → 5ms max wait (low latency with batching)
```

### Elasticsearch Scaling
```
After sampling: 15 TB/day = ~174 MB/sec write throughput
Elasticsearch: 20 data nodes × 1 GB/sec = 20 GB/sec capacity
More than sufficient

Scale with:
  More shards per index (parallel writes)
  More data nodes (horizontal)
  Index into hot nodes → move to warm nodes automatically (ILM)

Query optimization:
  Always filter by time range first (shard pruning)
  Always filter by service name (reduces scan to 1/100 of data)
  Use keyword fields for service/level (avoid analyzing them)
```

---

## 10. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Log injection** | Sanitize log message content before indexing |
| **Sensitive data in logs** | Scrub PII: credit cards, passwords, SSNs using regex at Flink stage |
| **Unauthorized log access** | RBAC: Engineers only see their own service's logs |
| **Log deletion** | Immutable audit logs for security events (S3 Object Lock) |
| **Retention compliance** | Auto-delete per jurisdiction (GDPR: delete EU user data) |
| **Agent compromise** | Logs signed with HMAC at source → verify at ingestion |
| **Kafka security** | TLS + SASL authentication between agents and Kafka |

### PII Scrubbing (critical!)
```javascript
// Flink transformation step
function scrubPII(log) {
    // Mask credit card numbers
    log.message = log.message.replace(
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, 
        '****-****-****-XXXX'
    );
    // Mask email addresses
    log.message = log.message.replace(
        /[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+/g,
        '[REDACTED_EMAIL]'
    );
    // Remove password fields
    delete log.password;
    delete log.token;
    return log;
}
```

---

## 11. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **Log volume explosion** | Service bug → millions of error logs | Circuit breaker: cap logs/sec per service |
| **Elasticsearch disk full** | 100TB/day | Aggressive sampling + ILM auto-deletion |
| **Slow search** | Full-scan query on 30 days | Enforce time filter (min 1h window) |
| **Log loss on crash** | Agent crashes = logs lost | Disk-backed buffer + at-least-once delivery |
| **Clock skew** | Server clocks differ → logs out of order | Use NTP, store ingestion time alongside log time |
| **Noisy alerts** | Too many false positive alerts | Alert dedup + minimum 5-minute sustained threshold |
| **Cost at scale** | 100 TB hot storage is expensive | Sample aggressively, move to cold storage quickly |

---

## 11. 📏 Industry Numbers (Real Reference)

```
Netflix:     2 PB/day of logs → uses Elasticsearch + Druid + S3
Uber:        1 PB/day → Kafka + Flink + ClickHouse
Cloudflare:  30M events/sec → ClickHouse (OLAP for log analytics)
Datadog:     Processes 10s of trillions of events per day — managed service

Key Insight: At Uber/Netflix scale, log infrastructure IS the product.
             Your monitoring cost can be 20% of total infrastructure cost.
```

---

## 📝 Summary Box

```
┌───────────────────────────────────────────────────────┐
│  DISTRIBUTED LOGGING — KEY DECISIONS                  │
│                                                       │
│  Collection:   Filebeat/Fluent Bit sidecar agents     │
│  Transport:    Kafka (1.1M logs/sec buffer)           │
│  Processing:   Flink (parse, enrich, sample, alert)   │
│  Hot Storage:  Elasticsearch (30 days, full-text)     │
│  Cold Storage: S3 Parquet + Athena queries            │
│  Format:       Structured JSON (always!)              │
│  Sampling:     100% ERROR, 10% INFO, 0% DEBUG         │
│  Real-time:    WebSocket tail via Kafka consumer      │
│  Security:     PII scrubbing + RBAC + HMAC signing    │
│  Cost:         Sampling + ILM + S3 tiering            │
└───────────────────────────────────────────────────────┘
```

**← Previous**: [Video Streaming](./09-Video-Streaming-Platform.md) | **← Back to Roadmap**: [README](./README.md)

---

## 🏁 Roadmap Complete! What Next?

Now that you've covered all 10 systems, here's your next steps:

```
1. Mock Interviews
   - Practice on Excalidraw (draw architecture live)
   - Time yourself: 45 minutes per system

2. Deep Dives
   - Read system design blogs from Netflix, Uber, Airbnb engineering blogs
   - "Designing Data-Intensive Applications" by Martin Kleppmann (the BIBLE)

3. Build Mini Projects
   - Implement a simple URL shortener (Node.js + Redis + PostgreSQL)
   - Build a basic notification service (Kafka + email worker)

4. System Design Interview Platforms
   - System Design Primer (GitHub) — free
   - Grokking the System Design Interview (paid)
   - ByteByteGo (Newsletter + YouTube) — highly recommended
```
