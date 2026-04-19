# 💳 System Design #04 — Payment System
> **Like**: Stripe, Razorpay, PayPal, UPI  
> **Difficulty**: ⭐⭐⭐⭐ | **Teaches**: ACID, Idempotency, Consistency, Fraud Detection

---

## 📋 Requirements

### Functional Requirements
- Initiate payment (debit sender, credit receiver)
- Payment via card, UPI, net banking, wallet
- Payment status: Pending → Success/Failed/Expired
- Retry logic for transient failures
- Refunds (full and partial)
- Transaction history
- Multi-currency support
- Webhook notifications to merchants

### Non-Functional Requirements
- **Users**: 50 million active, 500K peak concurrent
- **Peak Traffic**: 10,000 Transactions Per Second (TPS) — Black Friday, month-end
- **Data Size**: 1B transactions/year × 1KB ≈ **1 TB/year**
- **Availability**: 99.999% ("five nines") — 26 minutes downtime/year
- **Latency**: < 500ms (user waits at checkout)
- **Consistency**: STRONG — money must not disappear or duplicate
- **Budget**: High
- **Tech**: Node.js, PostgreSQL, Kafka, Redis, AWS

---

## 1. 🏛️ High-Level Architecture

```
[User / Merchant App]
        │
        ▼
[API Gateway]  ← Auth, Rate Limit, TLS termination
        │
        ▼
[Payment Service]          ← Core orchestrator
        │
   ┌────┴────────────────────────────────┐
   ▼                                     ▼
[Ledger Service]              [Payment Processor]
 (double-entry accounting)     (Razorpay/Stripe API)
        │                              │
        ▼                              ▼
[PostgreSQL]               [Bank / Card Networks]
 (ACID transactions)         (Visa, Mastercard, NPCI)
        │
        ▼
[Kafka Event Bus]
   ├──► [Notification Service]  → Email/SMS to user
   ├──► [Fraud Detection]       → ML scoring
   ├──► [Reconciliation Svc]    → End-of-day balancing
   └──► [Merchant Webhook]      → Notify merchant of success/fail
```

---

## 2. 🗄️ Database Design — Double-Entry Ledger

### Why Double-Entry Accounting?
```
Every transaction MUST balance:
  Debit one account = Credit another account
  Sum of all entries = 0 (always!)
  
This is how banks work, and how you prevent money loss/duplication.
```

### Accounts Table
```sql
CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    account_type    VARCHAR(20) NOT NULL,  -- 'wallet' | 'escrow' | 'bank'
    currency        VARCHAR(3) NOT NULL,   -- 'INR' | 'USD'
    balance         BIGINT NOT NULL DEFAULT 0,  -- Store in PAISA/CENTS (not rupees!)
                                                -- Avoid floating point errors
    status          VARCHAR(10) DEFAULT 'active',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
-- balance is in paise: ₹100 = 10000 paise (integer math only)
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(64) UNIQUE NOT NULL,  -- CRITICAL: prevent duplicate charges
    amount          BIGINT NOT NULL,              -- in paise
    currency        VARCHAR(3) NOT NULL,
    status          VARCHAR(20) NOT NULL,  -- pending|success|failed|expired|refunded
    
    -- Who pays, who receives
    payer_account_id    UUID REFERENCES accounts(id),
    payee_account_id    UUID REFERENCES accounts(id),
    
    -- What for
    transaction_type VARCHAR(20),  -- 'payment' | 'refund' | 'topup'
    reference_id     VARCHAR(100), -- order_id, invoice_id, etc.
    description      TEXT,
    
    -- External gateway
    gateway_name     VARCHAR(20),  -- 'razorpay' | 'stripe'
    gateway_txn_id   VARCHAR(100), -- External reference
    gateway_response JSONB,        -- Full raw response for debugging
    
    -- Timing
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at       TIMESTAMPTZ  -- 15 min for unpaid transactions
);
```

### Ledger Entries (Double-Entry)
```sql
CREATE TABLE ledger_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID REFERENCES transactions(id),
    account_id      UUID REFERENCES accounts(id),
    entry_type      VARCHAR(10) NOT NULL,  -- 'DEBIT' | 'CREDIT'
    amount          BIGINT NOT NULL,
    balance_after   BIGINT NOT NULL,       -- snapshot for audit
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Every transaction = 2 ledger entries (one DEBIT, one CREDIT)
-- Example: User A pays ₹500 to User B
-- DEBIT  user_A_account  500 (balance: 2000 → 1500)
-- CREDIT user_B_account  500 (balance: 1000 → 1500)
```

---

## 3. 🔌 API Structure

### Initiate Payment
```
POST /api/payments/initiate

Headers:
  Idempotency-Key: unique-client-uuid-for-this-payment

Request:
{
  "amount": 50000,           // in paise = ₹500
  "currency": "INR",
  "payer_account": "acc_123",
  "payee_account": "acc_456",
  "payment_method": "upi",   // card | upi | netbanking | wallet
  "reference_id": "order_789",
  "description": "Payment for Order #789",
  "callback_url": "https://merchant.com/webhook"
}

Response 201:
{
  "transaction_id": "txn_abc",
  "status": "pending",
  "payment_url": "https://pay.example.com/txn_abc",  // redirect user here
  "expires_at": "2026-03-04T20:00:00Z"
}
```

### Check Payment Status
```
GET /api/payments/:transactionId

Response:
{
  "transaction_id": "txn_abc",
  "status": "success",
  "amount": 50000,
  "gateway_txn_id": "pay_RZ123456",
  "completed_at": "2026-03-04T19:45:00Z"
}
```

### Refund
```
POST /api/payments/:transactionId/refund

Request:
{
  "amount": 50000,   // full refund or partial
  "reason": "Customer request"
}
```

---

## 4. 🔄 Idempotency — The Most Critical Concept

```
Problem: Network fails AFTER bank deducts but BEFORE we confirm.
         User retries → money deducted TWICE!

Solution: Idempotency Keys

Every payment request has a unique Idempotency-Key (client generates it, UUID).
Server stores key, and for ANY duplicate request with same key:
→ Return THE SAME RESPONSE as the original (don't process again)

Implementation:
```

```sql
-- First request:
INSERT INTO idempotency_store (key, response, created_at)
VALUES ('uuid-123', NULL, NOW())
ON CONFLICT DO NOTHING
RETURNING *;

-- If new row inserted → process payment
-- If existing row → return stored response

-- After processing:
UPDATE idempotency_store
SET response = '{"status": "success", "txn_id": "txn_abc"}'
WHERE key = 'uuid-123';
```

```
Idempotency Key Lifecycle:
- Store for 24 hours (sufficient retry window)
- Clean up with background job
- Must use UNIQUE constraint in DB for atomicity
```

---

## 5. 💰 Payment Flow — Step by Step

### Successful Payment (UPI)
```
1. User clicks "Pay Now" on merchant site
2. Merchant app → POST /api/payments/initiate (with idempotency key)
3. Payment Service:
   a. Validates: amount > 0, accounts exist, sufficient balance
   b. Creates transaction record (status: "pending")
   c. Publishes "payment.initiated" to Kafka
4. Returns payment_url to redirect user
5. User on UPI app → enters PIN → bank authorizes
6. Bank → NPCI → Razorpay → Webhook → POST /api/payments/webhook
7. Payment Service receives webhook:
   a. Verifies webhook signature (HMAC-SHA256)
   b. BEGIN TRANSACTION:
      - UPDATE transaction status → 'success'
      - DEBIT payer account (balance -= amount)
      - CREDIT payee account (balance += amount)
      - INSERT 2 ledger entries
      COMMIT;
   c. Publish "payment.success" to Kafka
8. Kafka consumers:
   - Notification Service → Email/SMS to both parties
   - Merchant Webhook → POST to callback_url (with retry)
   - Analytics → Record in ClickHouse
```

---

## 6. 🕵️ Fraud Detection System

```
Two types:
1. Real-time (< 100ms) — Block obviously fraudulent transactions
2. Async (post-transaction) — ML model, more sophisticated

Real-time Rules Engine:
  ✗ Transaction amount > ₹1,00,000 from new account (< 7 days old)
  ✗ > 5 failed transactions in last 1 hour  
  ✗ Transaction from blacklisted country/IP
  ✗ Same card used on > 10 different accounts
  ✗ Velocity: ₹50,000+ in less than 60 seconds

Fraud Score (async ML):
  - Device fingerprint
  - Transaction graph analysis (unusual patterns)
  - Historical user behavior baseline
  - If score > threshold → freeze transaction, notify user
```

---

## 7. ⚡ Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| Account balance | Redis | 1 min | Read balance quickly |
| Payment status | Redis | 5 min | Avoid DB polling |
| Fraud rules | Redis | 5 min | Fast real-time rules check |
| Idempotency keys | Redis | 24 hours | Fast duplicate detection |
| Exchange rates | Redis | 1 hour | Currency conversion |

> ⚠️ **Never cache transaction data that needs ACID guarantees**.  
> Cache is for reads only. Writes ALWAYS go to PostgreSQL first.

---

## 8. 📈 Scaling Strategy

### Horizontal Scaling
```
Payment Service:
- Stateless → scale horizontally
- 10,000 TPS → ~50 instances of Payment Service

Database:
- Vertical scale first (biggest PostgreSQL instance)
- Then: pgBouncer for connection pooling
- Read replicas for transaction history queries
- Sharding: By account_id (consistent hashing)

Kafka:
- 10,000 events/sec → easily handled by Kafka
- Partitions by transaction_id for ordering
- Consumer groups per downstream service
```

### High Availability (99.999%)
```
Multi-AZ (Availability Zone) deployment:
- Primary DB in AZ-1, Synchronous replica in AZ-2
- Failover < 30 seconds (RDS Multi-AZ)

Active-Active regions:
- Payments routed to nearest region
- Each region has its own DB
- Cross-region replication (async)
- Global consistency via distributed transaction protocol

Circuit Breakers:
- If Razorpay API fails → route to backup gateway (Stripe)
- Bulkhead: Separate thread pools for different payment methods
```

---

## 9. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Double spend** | Idempotency keys + DB transactions |
| **Man-in-the-middle** | TLS 1.3 on all connections |
| **Webhook spoofing** | HMAC-SHA256 signature verification |
| **SQL injection** | Parameterized queries, never raw SQL |
| **Insider threat** | Audit logs, role separation (4-eyes approval for batch) |
| **Data breach** | Encrypt PII at rest (AES-256), no raw card numbers (PCI-DSS) |
| **Account takeover** | 2FA for high-value transactions |
| **Replay attacks** | Timestamp + nonce in webhook verification |

```javascript
// Webhook signature verification
const expectedSig = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)  // raw body as string
    .digest('hex');

if (req.headers['x-signature'] !== expectedSig) {
    throw new Error('Invalid webhook signature');
}
```

---

## 10. ♻️ Reconciliation System

```
Problem: External gateway (bank/Razorpay) and our DB can get out of sync.
         Network timeout: We charged user but didn't record it.

Reconciliation (runs daily at midnight):

1. Download settlement file from Razorpay (CSV of all transactions)
2. Compare with our transactions table
3. For each discrepancy:
   - Gateway success but our DB says "failed" → Update to success
   - Our DB says "success" but gateway failed → Flag for investigation
4. Generate report for finance team
5. Alert on discrepancies > threshold

This is how REAL payment systems maintain data integrity.
```

---

## 11. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **DB write bottleneck** | 10K TPS = 10K writes/sec | PgBouncer + connection pooling |
| **Bank API latency** | Bank timeout (3-5 sec) | Async + webhook pattern |
| **Distributed locking** | Two servers update same account | DB-level row locking |
| **Idempotency at scale** | 10M keys × 24h = huge | Redis with TTL + periodic cleanup |
| **Refund complexity** | Partial refund + gateway sync | Separate refund transaction + reconciliation |
| **Currency rounding** | Float arithmetic errors | ALWAYS use integers (paise/cents) |
| **Chargebacks** | User disputes transaction | Dedicated dispute workflow, evidence storage |

---

## 📝 Summary Box

```
┌──────────────────────────────────────────────────┐
│  PAYMENT SYSTEM — KEY DECISIONS                  │
│                                                  │
│  Consistency:  STRONG (CP in CAP theorem)        │
│  DB:           PostgreSQL with ACID              │
│  Amounts:      Integers only (paise/cents)       │
│  Idempotency:  Client-generated keys + DB unique │
│  Ledger:       Double-entry accounting           │
│  Fraud:        Real-time rules + async ML        │
│  Async:        Kafka for notifications/webhooks  │
│  Security:     HMAC webhooks, PCI-DSS, 2FA       │
│  HA:           Multi-AZ + circuit breakers       │
│  Reconcile:    Daily batch vs gateway report     │
└──────────────────────────────────────────────────┘
```

**← Previous**: [E-Commerce Platform](./03-Ecommerce-Platform.md) | **Next**: [Notification System →](./05-Notification-System.md)
