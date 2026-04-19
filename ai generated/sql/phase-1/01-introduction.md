# Phase 1: SQL Fundamentals

## Topic 1: What is SQL & Databases, Tables, Rows, Columns

### 1. Simple Explanation
Imagine a database as a digital filing cabinet. Inside it, we have folders called **Tables**. 
Each table holds organized data in a grid (like an Excel spreadsheet).
- **Columns** are the categories (e.g., Name, Age, Email).
- **Rows** are the individual records (e.g., John, 25, john@email.com).
- **SQL (Structured Query Language)** is the language we use to "talk" to this database to add, find, update, or delete information.

### 2. Syntax Explanation
While the concepts of tables and columns are structural, SQL uses English-like commands to interact with them. Here are the core ideas:
- A database contains tables.
- A table is defined by its columns (which represent attributes and data types like text, numbers).
- Data is inserted as rows.

*(We will see actual commands for querying in the next lesson. For now, focus on the structure!)*

### 3. Real-world Example
Think of an E-commerce store like Amazon.
- **Database:** `ecommerce_db`
- **Tables:** `Users`, `Products`, `Orders`
- In the `Users` table:
  - **Columns:** `user_id`, `first_name`, `email`, `join_date`
  - **Row Data:** `(1, 'Alice', 'alice@email.com', '2023-10-01')`

### 4. Common Mistakes
- Confusing **Columns** with **Rows**: Remember that columns define *what* the data is (the header), while rows are the actual *entries* (the data itself).
- Thinking SQL is a database: SQL is the *language*, while MySQL, PostgreSQL, and Oracle are the actual database *systems* (RDBMS) that understand SQL.

### 5. Practice Questions
*Please answer these in the chat before we move on!*

**Q1.** If you are designing a database for a library, what would be a good name for a Table, and what are 3 Columns you would include in it?
**ANS** Table name: 
**Q2.** True or False: A Row represents a single, complete record in a table (like one specific student in a 'Students' table).
**Q3.** What is the difference between a Database and SQL?

---
*Write your answers in the chat. Once you're ready, we will move on to the `SELECT` statement!*
