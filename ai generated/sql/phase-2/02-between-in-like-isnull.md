# Phase 2: Filtering & Data Operations

## Topic 2: BETWEEN, IN, LIKE, IS NULL

### 1. Simple Explanation
These are advanced `WHERE` clause operators that make filtering more powerful and concise:
- `BETWEEN`: Selects values within a given range (inclusive).
- `IN`: Allows you to specify multiple exact values in a `WHERE` clause (shorthand for multiple `OR`s).
- `LIKE`: Used for pattern matching with wildcards (`%` for zero or more characters, `_` for exactly one character).
- `IS NULL` / `IS NOT NULL`: Used to check if a value is absent (NULL). You cannot use `= NULL`.

### 2. Syntax Explanation
```sql
-- BETWEEN (Numbers, Dates, Texts)
SELECT * FROM table_name WHERE column_name BETWEEN value1 AND value2;

-- IN
SELECT * FROM table_name WHERE column_name IN (value1, value2, ...);

-- LIKE (% represents multiple letters, _ represents one)
SELECT * FROM table_name WHERE column_name LIKE pattern;

-- IS NULL
SELECT * FROM table_name WHERE column_name IS NULL;
```

### 3. Real-world Example
- **BETWEEN:** Find products priced between $50 and $100.
  `SELECT * FROM products WHERE price BETWEEN 50 AND 100;`
- **IN:** Find users from specific cities.
  `SELECT * FROM users WHERE city IN ('London', 'Paris', 'Tokyo');`
- **LIKE:** Find users whose email ends with '@gmail.com'.
  `SELECT * FROM users WHERE email LIKE '%@gmail.com';`
- **IS NULL:** Find orders that have not been shipped yet (shipping string is missing/null).
  `SELECT * FROM orders WHERE shipped_date IS NULL;`

### 4. Common Mistakes
- Using `= NULL` instead of `IS NULL`. In SQL, NULL equals nothing, not even itself. So `age = NULL` will never evaluate to true.
- Doing `LIKE '%word%'` on huge tables. Leading wildcards (the first `%`) prevent the database from using indexes efficiently, turning a fast query into a slow full-table scan.
- Forgetting that `BETWEEN` is usually inclusive (includes both start and end numbers).

### 5. Practice Questions
**Q1.** Write a query to find employees with a memory base `salary` that is exactly 60000, 70000, or 80000 using the `IN` operator.
**Q2.** Write a query to find all users whose `first_name` starts with the letter 'J'.
**Q3.** Write a query to find all `events` that happen between '2023-01-01' and '2023-12-31'.
