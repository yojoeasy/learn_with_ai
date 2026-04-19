# Phase 3: Aggregation

## Topic 2: GROUP BY & HAVING

### 1. Simple Explanation
`GROUP BY` allows us to apply aggregate functions (like SUM, COUNT, AVG) to *groups* of data rather than the entire table at once. Instead of "Total Revenue of the company", you can ask for "Total Revenue *group by* each department".
`HAVING` is exactly like `WHERE`, but it is used to filter records **after** the aggregation has taken place. `WHERE` filters rows *before* grouping, `HAVING` filters *after* grouping.

### 2. Syntax Explanation
```sql
-- GROUP BY syntax
SELECT column1, SUM(column2) 
FROM table_name 
GROUP BY column1;

-- HAVING syntax (often paired with GROUP BY)
SELECT column1, SUM(column2) 
FROM table_name 
GROUP BY column1
HAVING condition_on_aggregate;
```

### 3. Real-world Example
We have an `employees` table (id, name, department, salary).
- How many employees are in each department?
  `SELECT department, COUNT(*) AS num_employees FROM employees GROUP BY department;`
- What is the total payroll for each department?
  `SELECT department, SUM(salary) AS total_payroll FROM employees GROUP BY department;`
- Show ONLY the departments where the total payroll is over $500,000.
  `SELECT department, SUM(salary) AS total_payroll FROM employees GROUP BY department HAVING SUM(salary) > 500000;`

### 4. Common Mistakes
- Selecting un-aggregated columns that are NOT in the `GROUP BY`. `SELECT department, name, SUM(salary) FROM employees GROUP BY department` will fail in most modern databases because it doesn't know which 'name' to show for the department group.
- Using aggregate functions in a `WHERE` clause: `WHERE SUM(salary) > 500000` is illegal. You must use `HAVING SUM(salary) > 500000`.

### 5. Practice Questions
**Q1.** From the `sales` table, write a query to find the total sales (`total_amount`) made by each `salesperson_id`.
**Q2.** Based on Q1, filter the result to only show salespeople whose total sales are greater than `1000`.
**Q3.** What is the execution order difference between `WHERE` and `HAVING`?
