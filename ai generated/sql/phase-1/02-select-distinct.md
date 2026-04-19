# Phase 1: SQL Fundamentals

## Topic 2: SELECT Statement & DISTINCT

### 1. Simple Explanation
The `SELECT` statement is the most used command in SQL. It is used to fetch data from a database. You can think of it as asking a database to "show me the data from these columns." The `DISTINCT` keyword is used to return only unique (different) values, removing duplicates from the result.

### 2. Syntax Explanation
```sql
-- Selecting specific columns
SELECT column1, column2 FROM table_name;

-- Selecting all columns using the asterisk (*)
SELECT * FROM table_name;

-- Selecting unique values
SELECT DISTINCT column_name FROM table_name;
```

### 3. Real-world Example
Imagine an `employees` table:
`id | first_name | department | salary`
`1  | Alice      | HR         | 50000 `
`2  | Bob        | IT         | 70000 `
`3  | Charlie    | HR         | 55000 `

- Get just the names and departments:
  `SELECT first_name, department FROM employees;`
- See all unique departments:
  `SELECT DISTINCT department FROM employees;` (Returns HR, IT)

### 4. Common Mistakes
- Overusing `SELECT *`. Using `*` fetches everything, which can be very slow on huge tables. Always specify only the columns you need.
- Using `DISTINCT` on multiple columns when you only want uniqueness for one. `SELECT DISTINCT first_name, department` will return rows where the combination of name and department is unique.

### 5. Practice Questions
**Q1.** Write a query to fetch `user_id` and `email` from a table named `customers`.
**Q2.** Write a query to fetch all unique `country` names from a `users` table.
**Q3.** Why is it considered a bad practice to use `SELECT *` in production code?
