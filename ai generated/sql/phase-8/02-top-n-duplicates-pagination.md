# Phase 8: Real World Queries

## Topic 2: Top N, Duplicates, and Pagination

### 1. Simple Explanation
- **Top N per group:** "Find the highest paid employee in *each* department."
- **Duplicates:** "Find the users who registered with the same email address."
- **Pagination:** "Show me page 2 of products, 20 items per page."

### 2. Syntax Explanation & Real-world Examples

**Top-N Per Group (Using Window Functions):**
Find the highest-paid employee per department:
```sql
WITH RankedEmployees AS (
    SELECT id, name, department_id, salary,
           ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) as rn
    FROM employees
)
SELECT * FROM RankedEmployees WHERE rn = 1;
```

**Finding Duplicates (Using GROUP BY & HAVING):**
Find email addresses used more than once:
```sql
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

**Pagination (Using LIMIT/OFFSET or Keyset Pagination for huge tables):**
Standard Pagination (Page 3, 10 items per page => Skip 20, Take 10):
```sql
SELECT * FROM products 
ORDER BY id ASC 
LIMIT 10 OFFSET 20;
```
*(Warning: OFFSET gets very slow as the offset number gets larger on enormous tables because the database must process and discard all the skipped rows).*

### 4. Common Mistakes
- Doing `SELECT COUNT(DISTINCT email) FROM users;` to find duplicates. Nope! Use `GROUP BY ... HAVING COUNT(*) > 1`.
- Forgetting `ORDER BY` when using `OFFSET` / `LIMIT` for pagination. Your pages will have random rows mixed up every time you load a page!

### 5. Practice Questions
**Q1.** Write a query using `OFFSET` and `LIMIT` to fetch "Page 5" of a `users` table, where a page contains 50 users. Assume we sort by `id`.
