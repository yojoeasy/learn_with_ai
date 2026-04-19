# Phase 2: Filtering & Data Operations

## Topic 1: INSERT, UPDATE, DELETE

### 1. Simple Explanation
These commands perform Data Manipulation Language (DML) operations—changing the actual data in your tables:
- `INSERT`: Adds new rows.
- `UPDATE`: Modifies existing rows.
- `DELETE`: Removes rows entirely.

### 2. Syntax Explanation
```sql
-- INSERT
INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);

-- UPDATE
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- DELETE
DELETE FROM table_name WHERE condition;
```

### 3. Real-world Example
Let's manage an `inventory` table:
- **Add a new product:**
  `INSERT INTO inventory (product_name, stock, price) VALUES ('Laptop', 50, 999.00);`
- **Update stock after a sale:**
  `UPDATE inventory SET stock = 49 WHERE product_name = 'Laptop';`
- **Remove a discontinued product:**
  `DELETE FROM inventory WHERE product_name = 'Old Gadget';`

### 4. Common Mistakes
- **THE DEADLY `UPDATE`/`DELETE` WITHOUT `WHERE`:** If you run `UPDATE inventory SET stock = 0;` or `DELETE FROM inventory;` without a `WHERE` clause, you will change or delete **EVERY SINGLE ROW** in the table. Always double-check your `WHERE` condition!
- Mismatching column names and values in an `INSERT` statement. The values must follow the exact order of the columns specified in the parentheses.

### 5. Practice Questions
**Q1.** Write a command to insert a new user: name 'David', email 'david@test.com' into the `users` table.
**Q2.** An employee with `id = 5` got a performance raise to a salary of `80000`. Write the `UPDATE` query.
**Q3.** Write a command to delete all users from the `users` table who have an `account_status` of 'banned'.
