# Phase 7: Performance & Optimization

## Topic 1: Indexes and Query Optimization (EXPLAIN)

### 1. Simple Explanation
- **Index:** A data structure (usually a B-Tree) that improves the speed of data retrieval operations. Think of it like the index at the back of a book. Without an index, the database must scan every single row (Full Table Scan) to find what you want.
- **EXPLAIN:** A command added before a `SELECT` statement that tells you *how* the database plans to execute your query (which indexes it uses, row estimates, etc.) without actually running the query.

### 2. Syntax Explanation
```sql
-- Creating an Index
CREATE INDEX index_name ON table_name (column_name);
CREATE UNIQUE INDEX index_name ON table_name (column_name);

-- Using EXPLAIN
EXPLAIN SELECT * FROM table_name WHERE indexed_column = 'value';
EXPLAIN ANALYZE SELECT * FROM table_name WHERE indexed_column = 'value'; -- Runs the query and returns actual time stats (PostgreSQL, MySQL 8+)
```

### 3. Real-world Example
Let's say a `users` table has 10 million rows. You run:
`SELECT * FROM users WHERE email = 'bob@bob.com';`
- Without an index on `email`, the database flips through all 10 million rows. `EXPLAIN` will show `Seq Scan`.
- After `CREATE UNIQUE INDEX idx_users_email ON users(email);`, the database searches the B-Tree index and finds it almost instantly. `EXPLAIN` will show `Index Scan`.

### 4. Common Mistakes
- **Over-indexing:** Indexes make `SELECT` faster, but they make `INSERT`, `UPDATE`, and `DELETE` slower because the database has to update the index every time data changes. Do not index every column.
- Indexing low-cardinality columns (like a `gender` or `boolean_status` column with only 2 or 3 distinct values). It takes more work for the database to use the index than to just scan the table.
- Wrapping an indexed column in a function (`WHERE UPPER(email) = 'BOB@BOB.COM'`) completely disables the index unless you use specialized "Functional Indexes."

### 5. Practice Questions
**Q1.** Write a command to create an index on the `last_name` column in the `employees` table.
**Q2.** If you query `WHERE category = 'Electronics'`, how can you check if the database is using an index for `category`?
