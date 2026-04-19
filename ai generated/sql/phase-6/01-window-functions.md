# Phase 6: Window Functions

## Topic 1: OVER() and PARTITION BY

### 1. Simple Explanation
Window functions are like Aggregate functions (`SUM`, `AVG`), but with a superpower: they **do not group multiple rows into a single row**. They calculate an aggregate value in the background (like creating a "window" of rows) but keep every single original row in your result!
- **OVER():** Tells the database we are using a window function. An empty `OVER()` means the window is the entire result set.
- **PARTITION BY:** Divides the window into smaller groups (like `GROUP BY` but without collapsing the rows).

### 2. Syntax Explanation
```sql
-- Standard Window Function
SELECT column1, 
       SUM(column2) OVER() AS grand_total
FROM table_name;

-- Window Function with PARTITION BY
SELECT column1, group_column,
       SUM(column2) OVER(PARTITION BY group_column) AS group_total
FROM table_name;
```

### 3. Real-world Example
- **OVER():** Show the `salary` of each employee, and next to it, the total salary of the entire company:
  `SELECT name, salary, SUM(salary) OVER() AS company_total FROM employees;`
  *(Every row stays! Every row now has the `company_total` printed next to their `salary`)*
- **PARTITION BY:** Show the `salary` of each employee, and next to it, the total salary of *their specific department*:
  `SELECT name, department, salary, SUM(salary) OVER(PARTITION BY department) AS dept_total FROM employees;`

### 4. Common Mistakes
- Trying to use a Window Function in a `WHERE` clause. You cannot! Window functions are evaluated *after* the `WHERE` clause filters the rows. (If you must filter by a window function result, use a subquery or a CTE).

### 5. Practice Questions
**Q1.** Write a query on `products(id, name, category, price)` to list all products, their price, and the average price of all products.
**Q2.** Write a query on `products` to list all products, their price, and the average price of products *in their specific category*.
