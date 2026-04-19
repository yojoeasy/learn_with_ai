# Phase 3: Aggregation

## Topic 1: COUNT, SUM, AVG, MIN, MAX

### 1. Simple Explanation
Aggregate functions perform a calculation on a set of values and return a single summarizing value. They are used to calculate statistics like total count of rows, summing up a column, or finding the average/min/max.

### 2. Syntax Explanation
```sql
-- Count total rows (or non-NULL given column)
SELECT COUNT(*) FROM table_name;
SELECT COUNT(column_name) FROM table_name;

-- Sum of all values in a numeric column
SELECT SUM(column_name) FROM table_name;

-- Average value in a numeric column
SELECT AVG(column_name) FROM table_name;

-- Minimum and Maximum value
SELECT MIN(column_name), MAX(column_name) FROM table_name;
```

### 3. Real-world Example
Using an `orders` table:
- Find how many orders we have:
  `SELECT COUNT(*) FROM orders;`
- Find the total revenue from all orders:
  `SELECT SUM(total_price) FROM orders;`
- Find the average order value:
  `SELECT AVG(total_price) FROM orders;`
- Find the cheapest and most expensive orders:
  `SELECT MIN(total_price), MAX(total_price) FROM orders;`

### 4. Common Mistakes
- **NULL interference:** `COUNT(column_name)` ignores `NULL` values, whereas `COUNT(*)` counts all rows including `NULL`s. Similarly, `SUM` and `AVG` ignore `NULL`s. This can completely throw off calculations if you aren't expecting it!
- Creating an aggregate result without an Alias using `AS`. Returning columns named `SUM(price)` is ugly; always `SELECT SUM(price) AS total_revenue`.

### 5. Practice Questions
**Q1.** Write a query using `product` table to find the total sum of `stock`.
**Q2.** Write a query using `employees` to find how many employees work in the 'IT' department.
**Q3.** Write a query to find the highest `salary` from the `employees` table and name the column `top_salary`.
