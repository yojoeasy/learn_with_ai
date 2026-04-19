# Phase 8: Real World Queries

## Topic 1: Sales Reports & User Analytics

### 1. Simple Explanation
These queries combine everything you've learned to answer business questions. 
- You will need `JOIN`s to gather data from multiple tables.
- You will need `GROUP BY` and Aggregation to summarize data.
- You will need Window Functions to calculate growth, totals, or rankings.
- You will need Date filtering (using `WHERE` and `BETWEEN`).

### 2. Syntax Explanation
We combine multiple clauses efficiently.

### 3. Real-world Example
**Business Question:** "Get a monthly sales report showing total revenue, total orders, and the average order value per month for the year 2023."

```sql
SELECT 
    DATE_TRUNC('month', order_date) AS month, -- Varies slightly by SQL dialect (MySQL uses DATE_FORMAT, PostgreSQL uses DATE_TRUNC)
    COUNT(order_id) AS total_orders,
    SUM(total_price) AS total_revenue,
    AVG(total_price) AS avg_order_value
FROM orders
WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY 1 -- Groups by the FIRST column selected (the month)
ORDER BY month ASC;
```

### 4. Common Mistakes
- Querying unindexed date columns on massive tables. Date filtering `order_date BETWEEN...` requires `order_date` to be indexed!
- Not accounting for cancelled or refunded orders in "Total Revenue". Always remember business logic (e.g., `WHERE status = 'Completed'`).

### 5. Practice Questions
**Q1.** You have a table `users(id, registered_at, source)`. Write a query to find out how many users registered from each `source` in January 2024.
