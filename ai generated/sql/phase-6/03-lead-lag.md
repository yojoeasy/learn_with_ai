# Phase 6: Window Functions

## Topic 3: LEAD() and LAG()

### 1. Simple Explanation
These are positional Window Functions. They allow you to access data from previous (`LAG`) or following (`LEAD`) rows in the same result set without doing complicated `SELF JOIN`s. They are essential for comparing current values to previous/future values (like finding Month-over-Month growth).

### 2. Syntax Explanation
```sql
-- LAG (previous row)
SELECT column1,
       LAG(column1, 1) OVER(ORDER BY sort_column) AS preview_row_value
FROM table_name;

-- LEAD (next row)
SELECT column1,
       LEAD(column1, 1) OVER(ORDER BY sort_column) AS next_row_value
FROM table_name;
```
*(The `1` inside the function represents the offset—how many rows back or forward to look. 1 is the default).*

### 3. Real-world Example
Let's analyze daily revenue in `daily_sales(date, revenue)`:
- We want to see today's revenue, yesterday's revenue, and calculating the difference:
  ```sql
  SELECT 
      date, 
      revenue AS today_rev,
      LAG(revenue, 1) OVER(ORDER BY date) AS yesterday_rev,
      revenue - LAG(revenue, 1) OVER(ORDER BY date) AS daily_difference
  FROM daily_sales;
  ```
  *(The first row will have `NULL` for `yesterday_rev` because there is no previous row!)*

### 4. Common Mistakes
- Not handling `NULL` values. The very first row handled by `LAG` will be `NULL`. The very last row handled by `LEAD` will be `NULL`. You can provide a default value as a 3rd argument: `LAG(column, offset, default_value)`.
- Forgetting the `ORDER BY` inside `OVER()`. Without ordering, "previous" and "next" refer to random rows!

### 5. Practice Questions
**Q1.** Write a query on `weather(date, temperature)` to fetch the current day's temperature and the temperature from *two* days ago.
