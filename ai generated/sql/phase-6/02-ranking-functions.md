# Phase 6: Window Functions

## Topic 2: ROW_NUMBER(), RANK(), DENSE_RANK()

### 1. Simple Explanation
These are ranking functions used almost exclusively as Window Functions. They assign an integer value (a rank or a row number) to each row based on an `ORDER BY` clause inside the `OVER()` window.
- **ROW_NUMBER():** Assigns a unique consecutive sequential integer starting from 1. (e.g., 1, 2, 3, 4).
- **RANK():** Handles ties by giving them the same rank, but *skips* the next numbers. (e.g., 1, 2, 2, 4).
- **DENSE_RANK():** Handles ties just like `RANK()`, but *does not skip* numbers. (e.g., 1, 2, 2, 3).

### 2. Syntax Explanation
```sql
SELECT column1, group_column, sort_column,
       ROW_NUMBER() OVER(PARTITION BY group_column ORDER BY sort_column DESC) as row_num,
       RANK() OVER(PARTITION BY group_column ORDER BY sort_column DESC) as rank_val,
       DENSE_RANK() OVER(PARTITION BY group_column ORDER BY sort_column DESC) as dense_rank_val
FROM table_name;
```

### 3. Real-world Example
You have a `race_results` table `(racer_id, lap_time_seconds)`.
Three racers finish laps in times: 50, 50, 52.
- `ROW_NUMBER() OVER(ORDER BY lap_time)` output: 1, 2, 3.
- `RANK() OVER(ORDER BY lap_time)` output: 1, 1, 3.
- `DENSE_RANK() OVER(ORDER BY lap_time)` output: 1, 1, 2.

### 4. Common Mistakes
- **Missing `ORDER BY` in the `OVER` clause.** Ranking functions are meaningless without an `ORDER BY` telling them *how* to rank! `ROW_NUMBER() OVER()` is not deterministic and could change every time you run the query.
- Choosing `RANK()` when you need `DENSE_RANK()` for pagination.

### 5. Practice Questions
**Q1.** You have an `employee(name, salary)` table. Write a query to find the employee with the 2nd highest salary using `DENSE_RANK()`. (Hint: You have to wrap the window function in a subquery or CTE to filter by it using WHERE!).
