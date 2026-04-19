# Phase 1: SQL Fundamentals

## Topic 4: ORDER BY & LIMIT

### 1. Simple Explanation
When you fetch data, it doesn't automatically come back in a specific order. 
- `ORDER BY` sorts the result-set in ascending (ASC) or descending (DESC) order based on one or more columns.
- `LIMIT` restricts the number of rows returned by the query.

### 2. Syntax Explanation
```sql
-- Ordering data (ASC is default)
SELECT * FROM table_name ORDER BY column_name ASC;
SELECT * FROM table_name ORDER BY column_name DESC;

-- Multiple columns
SELECT * FROM table_name ORDER BY column1 ASC, column2 DESC;

-- Limiting results
SELECT * FROM table_name LIMIT number_of_rows;

-- Combining Both
SELECT * FROM table_name ORDER BY column_name DESC LIMIT number_of_rows;
```

### 3. Real-world Example
Continuing with our `employees` table:
- Find the top 5 highest-paid employees:
  `SELECT * FROM employees ORDER BY salary DESC LIMIT 5;`
- Sort employees alphabetically by their first name:
  `SELECT * FROM employees ORDER BY first_name ASC;`

### 4. Common Mistakes
- Forgetting that `ORDER BY` goes *after* the `WHERE` clause, and `LIMIT` goes at the very end. The correct order is `SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...`.
- Relying on default database sorting. Never assume rows will be ordered by ID or insertion time unless you explicitly use `ORDER BY ID`.

### 5. Practice Questions
**Q1.** Write a query to fetch the newest 10 users from the `users` table (assuming there is a `created_at` date column).
**Q2.** Write a query to list all `products` sorted by `price` ascending, and then by `name` descending.
**Q3.** Can you use `LIMIT` without `ORDER BY`? What happens if you do?
