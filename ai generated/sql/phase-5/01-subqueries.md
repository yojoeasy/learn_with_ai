# Phase 5: Advanced SQL

## Topic 1: Subqueries & Correlated Subqueries

### 1. Simple Explanation
A subquery is simply a query nested inside another query (like inception!).
- **Standard Subquery:** Evaluates once and passes the result to the outer query.
- **Correlated Subquery:** The subquery references columns from the outer query. It runs once for *every single row* returned by the outer query (making it very slow on large tables).

### 2. Syntax Explanation
```sql
-- Standard Subquery in WHERE clause
SELECT column_name FROM t1 WHERE column_name = (SELECT max(column_name) FROM t2);

-- Standard Subquery in FROM clause (Derived Table)
SELECT a.id FROM (SELECT id FROM t1 WHERE condition) a;

-- Correlated Subquery
SELECT employee_name, salary, department_id
FROM employees e1
WHERE salary > (
    SELECT AVG(salary) FROM employees e2 WHERE e1.department_id = e2.department_id
);
```

### 3. Real-world Example
- Get the name of the user who made the largest order:
  `SELECT name FROM users WHERE id = (SELECT user_id FROM orders ORDER BY amount DESC LIMIT 1);`
- Find employees who earn more than the average salary of their specific department (Correlated):
  *(See the Correlated Subquery syntax example above. Notice how the inner query `e2` refers to `e1.department_id` which acts like a `for` loop across the outer query).*

### 4. Common Mistakes
- Subqueries that return multiple rows when checking for equality `=`. If a subquery returns multiple rows, you can't use `=`, you must use `IN`, `ANY`, or `ALL`.
- Massive performance hits due to Correlated Subqueries. Often, a correlated subquery can be rewritten much more efficiently as a `JOIN` or using Window Functions.

### 5. Practice Questions
**Q1.** Write a subquery to find all `product_names` from `products` where the `price` is greater than the average price of all products.
**Q2.** Write a correlated subquery to find all `orders` whose `amount` is larger than the average amount of orders made by that specific user.
