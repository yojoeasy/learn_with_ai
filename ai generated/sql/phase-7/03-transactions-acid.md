# Phase 7: Performance & Optimization

## Topic 3: Transactions & ACID Properties

### 1. Simple Explanation
A Transaction is a single logical unit of work that contains one or more SQL statements (usually DML like INSERT, UPDATE, DELETE). A transaction must either completely succeed, or completely fail (rollback) — nothing in between.

This is governed by **ACID Properties**:
- **A (Atomicity):** "All or nothing." If part fails, the whole transaction fails.
- **C (Consistency):** Data moves from one valid state to another valid state (obeying constraints).
- **I (Isolation):** Concurrent transactions don't interfere with each other.
- **D (Durability):** Once committed, changes are permanent, even if the server crashes seconds later.

### 2. Syntax Explanation
```sql
-- Starting a transaction
START TRANSACTION; (or BEGIN;)

-- Performing operations
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Saving the changes permanently
COMMIT;

-- Reversing the changes (undoing)
ROLLBACK;
```

### 3. Real-world Example
Bank Transfers.
If Alice transfers $100 to Bob:
1. Bob's account gets +$100.
2. The server crashes.
3. Alice's account never got deducted!

By wrapping both `UPDATE` statements inside a `BEGIN` and `COMMIT` block, Atomicity ensures that if step 3 fails, the change made in step 1 is un-done (`ROLLBACK`).

### 4. Common Mistakes
- Opening a transaction in an interactive database client and forgetting to type `COMMIT` or `ROLLBACK`. This will hold locks on the affected rows, preventing other users or applications from modifying them until the connection times out.
- Not using transactions when executing multiple dependent DML queries in application code.

### 5. Practice Questions
**Q1.** Write a transaction block (`BEGIN`, two `UPDATE`s, and `COMMIT`) to transfer 5 units of `stock` from product A to product B in an `inventory` table.
**Q2.** Which ACID property guarantees that a committed transaction will survive a sudden power loss?
