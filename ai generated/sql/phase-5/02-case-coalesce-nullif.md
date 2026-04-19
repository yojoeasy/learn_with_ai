# Phase 5: Advanced SQL

## Topic 2: CASE Statements, COALESCE, NULLIF

### 1. Simple Explanation
These tools handle conditional logic in SQL (like `if/else` in programming).
- **CASE:** Let's you write `if/then/else` statements inside your `SELECT` clause to change how data is grouped or displayed.
- **COALESCE:** Returns the first non-NULL value in a list of arguments. Useful for setting default values when data is missing.
- **NULLIF:** Returns NULL if two expressions are equal; otherwise, it returns the first expression. Excellent for preventing division-by-zero errors.

### 2. Syntax Explanation
```sql
-- CASE
SELECT column_name,
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE default_result
END AS alias_name
FROM table_name;

-- COALESCE
SELECT COALESCE(column_name, 'default_string_value') FROM table_name;

-- NULLIF
SELECT NULLIF(column1, column2) FROM table_name;
```

### 3. Real-world Example
- **CASE:** Classify students based on grades:
  `SELECT name, CASE WHEN score > 90 THEN 'A' WHEN score > 80 THEN 'B' ELSE 'F' END AS Grade FROM students;`
- **COALESCE:** If an employee has no `work_phone`, fallback to `home_phone`, and if that's null, fallback to `'No Phone'`:
  `SELECT COALESCE(work_phone, home_phone, 'No Phone') AS contact_number FROM employees;`
- **NULLIF:** Prevent division by zero when calculating a ratio:
  `SELECT total_sales / NULLIF(total_items, 0) AS avg_item_value FROM weekly_stats;`

### 4. Common Mistakes
- Not handling the `ELSE` implicitly in a `CASE`. If none of the `WHEN` conditions are met and there is no `ELSE`, it will return `NULL` automatically, which could ruin later aggregations.
- Using `IS NULL` when `COALESCE` is cleaner. Instead of `CASE WHEN x IS NULL THEN y ELSE x END`, just use `COALESCE(x, y)`.

### 5. Practice Questions
**Q1.** Write a query on the `orders` table that adds a `status_label` column: if `status` is 1, return 'Pending', if 2, return 'Shipped', else 'Canceled'.
**Q2.** Write a query using `users` table to select `custom_avatar`, and if `custom_avatar` is NULL, select `'default.png'`.
