# Phase 1: SQL Fundamentals

## Topic 3: WHERE clause, AND, OR, NOT

### 1. Simple Explanation
The `WHERE` clause is used to filter records. It extracts only those rows that fulfill a specified condition. 
To combine multiple conditions, we use logical operators:
- `AND` requires both conditions to be true.
- `OR` requires at least one condition to be true.
- `NOT` reverses the condition (it must not be true).

### 2. Syntax Explanation
```sql
-- Basic WHERE
SELECT column1, column2 FROM table_name WHERE condition;

-- Using AND
SELECT * FROM table_name WHERE condition1 AND condition2;

-- Using OR
SELECT * FROM table_name WHERE condition1 OR condition2;

-- Using NOT
SELECT * FROM table_name WHERE NOT condition;
```

### 3. Real-world Example
Using an `employees` table:
- Find employees in IT: 
  `SELECT * FROM employees WHERE department = 'IT';`
- Find employees in IT earning more than 60,000:
  `SELECT * FROM employees WHERE department = 'IT' AND salary > 60000;`
- Find employees who are NOT in HR:
  `SELECT * FROM employees WHERE NOT department = 'HR';`
  *(Note: You can also write `department != 'HR'`)*

### 4. Common Mistakes
- Using `AND` when you mean `OR`. If you want employees from IT and HR, you must use `department = 'IT' OR department = 'HR'`, NOT `AND` (a single row cannot be both at the same time).
- Forgetting parentheses when mixing `AND` and `OR`. `WHERE A AND B OR C` might behave differently than `WHERE A AND (B OR C)`. Use parentheses to enforce order of operations!

### 5. Practice Questions
**Q1.** Write a query to find all users in the `users` table who are older than 18.
**Q2.** Write a query to find all products from the `products` table where the `category` is 'Electronics' AND the `price` is less than 500.
**Q3.** Write a query to select all customers who live in 'New York' OR 'Los Angeles'.
