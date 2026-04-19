# Phase 4: Joins

## Topic 1: INNER, LEFT, RIGHT, and FULL Joins

### 1. Simple Explanation
Relational databases store data in different tables spread out. Joins are how we connect tables back together based on related columns (usually foreign keys).
- **INNER JOIN:** Returns only the intersection. Records that have matching values in both tables.
- **LEFT JOIN:** Returns all records from the left table, and the matched records from the right table. If no match, right side is `NULL`.
- **RIGHT JOIN:** Reverse of LEFT JOIN. Returns all records from the right table.
- **FULL JOIN:** Returns all records when there is a match in either left or right table. Uses `NULL` for missing sides.

### 2. Syntax Explanation
```sql
SELECT columns
FROM table1
[INNER | LEFT | RIGHT | FULL] JOIN table2
ON table1.column_name = table2.column_name;
```

### 3. Real-world Example
We have `users(id, name)` and `orders(id, user_id, amount)`.
- Find all orders and their user names (Only users who made orders):
  `SELECT users.name, orders.amount FROM users INNER JOIN orders ON users.id = orders.user_id;`
- Get a list of ALL users, regardless of whether they ordered anything (showing `amount` as `NULL` if they didn't order):
  `SELECT users.name, orders.amount FROM users LEFT JOIN orders ON users.id = orders.user_id;`

### 4. Common Mistakes
- **Fan-out/Cartesian Explosion:** Joining on columns that are not unique or missing the `ON` condition entirely, causing 5 rows in one table joining 5 rows in another yielding 25 rows instead of 5, ruining aggregate calculations (SUM, COUNT).
- Confusing LEFT and RIGHT. Usually, sticking to LEFT JOINs and putting your primary table first is a safe convention that makes queries easier to read.

### 5. Practice Questions
**Q1.** Write an INNER JOIN between `students(id, name)` and `enrollments(student_id, course_name)`.
**Q2.** We want a list of all products in `products(id, name)` and any reviews they might have in `reviews(product_id, rating)`. Write a query to ensure physical products without reviews are still shown.
**Q3.** How do you find rows in Table A that DO NOT exist in Table B? (Hint: Use a LEFT JOIN and a `WHERE` clause).
