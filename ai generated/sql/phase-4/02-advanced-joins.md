# Phase 4: Joins

## Topic 2: SELF JOIN and CROSS JOIN

### 1. Simple Explanation
These are massive relationship tools for specific use cases:
- **SELF JOIN:** A regular join, but the table is joined with itself. It is mostly used to evaluate hierarchical data (like a manager-employee relationship) in the same table.
- **CROSS JOIN:** Returns the Cartesian product of rows from tables in the join. Basically, every row in Table 1 combined with every row in Table 2.

### 2. Syntax Explanation
```sql
-- SELF JOIN requires aliasing the same table with two different names
SELECT A.column_name, B.column_name
FROM table_name A, table_name B
WHERE A.common_field = B.common_field;
-- OR 
SELECT A.column_name, B.column_name
FROM table_name A INNER JOIN table_name B ON A.common_field = B.common_field;

-- CROSS JOIN
SELECT column_name(s)
FROM table1
CROSS JOIN table2;
```

### 3. Real-world Example
- **SELF JOIN:** An `employees` table `(id, name, manager_id)` where `manager_id` points to the `id` of another employee in the *same* table.
  `SELECT E.name AS Employee, M.name AS Manager FROM employees E JOIN employees M ON E.manager_id = M.id;`
- **CROSS JOIN:** You have a `colors` table and a `sizes` table. You want to generate a list of all possible T-shirt combinations.
  `SELECT colors.color_name, sizes.size_name FROM colors CROSS JOIN sizes;`

### 4. Common Mistakes
- Accidentally running a CROSS JOIN when you meant an INNER JOIN (usually by forgetting the `ON` clause in older database queries). A cross join of a 10,000 row table and a 5,000 row table yields 50,000,000 rows and crashes database clients.
- Forging aliases in a SELF JOIN. Since both tables are the same table, you *must* use `AS T1` and `AS T2` aliases so the database knows which version of the table you mean.

### 5. Practice Questions
**Q1.** You have an `employee` table. Write a SELF JOIN to find pairs of employees who work in the same `department_id`.
**Q2.** Given a `menu_items` table (id, name, type='Food'|'Drink'), write a CROSS JOIN to get all combinations of 1 Food and 1 Drink item (Hint: filter the left/right tables first).
