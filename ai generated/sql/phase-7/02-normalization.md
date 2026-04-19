# Phase 7: Performance & Optimization

## Topic 2: Normalization

### 1. Simple Explanation
Normalization is the process of organizing data in a database. This includes creating tables and establishing relationships between them according to rules designed to protect data and make the database more flexible by eliminating redundancy and inconsistent dependency.
- **1NF (First Normal Form):** Every column must contain atomic (indivisible) values. No lists separated by commas in a single column!
- **2NF (Second Normal Form):** Must be in 1NF, and all non-key attributes must be fully dependent on the primary key.
- **3NF (Third Normal Form):** Must be in 2NF, and there should be no transitive dependencies (columns shouldn't depend on other non-key columns).
- **Denormalization:** The intentional strategy of breaking normalization rules (e.g., adding redundant data) to speed up READ-heavy queries.

### 2. Syntax Explanation
There is no syntax for normalization; it is a **database design principle**. You apply it when designing your DDL (`CREATE TABLE`).

### 3. Real-world Example
- **Unnormalized Data:**
  An `orders` table storing `(order_id, date, user_id, user_name, user_address)`.
  If a user makes 50 orders, their `user_name` and `user_address` are duplicated 50 times!
- **Normalized Data (3NF):**
  Split it into two tables:
  `users (user_id, name, address)`
  `orders (order_id, date, user_id)` *(user_id is a Foreign Key)*

### 4. Common Mistakes
- Storing calculated or derived values. For example, storing a person's `age` when you already store their `birthdate`. (Age changes every year, birthdate does not!)
- Normalizing *too* much. If you split data into 15 different tables, you will need 14 `JOIN` operations to read the data back. Sometimes Denormalization is required for performance.

### 5. Practice Questions
**Q1.** You have a `student(id, name, subjects)` table. The `subjects` column stores data like *"Math, Science, History"*. Which Normal Form does this violate?
**Q2.** How would you normalize the table from Q1?
