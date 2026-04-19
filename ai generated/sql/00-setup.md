# Quick Setup Guide: Practice Makes Perfect

Reading about SQL isn't enough; you must **write** it to truly learn it! 
To help you practice all the queries in this roadmap, I've entirely built a practice database for you.

## Step 1: Find a SQL Compiler
You don't need to install any heavy software to start learning. We will use a free, browser-based SQL environment.
1. Open your browser and go to [DB Fiddle (db-fiddle.com)](https://www.db-fiddle.com/) or [SQL Fiddle (sqlfiddle.com)](http://sqlfiddle.com/).
2. Select **PostgreSQL** or **MySQL** as your database engine (PostgreSQL is highly recommended for this course).

## Step 2: Load the Practice Database
I have created a file named `practice-database.sql` in this `sql` directory (`C:\learning\sql\practice-database.sql`).
1. Open that file and copy EVERYTHING inside it.
2. Paste it into the **Schema Panel** (the left side) of DB Fiddle.
3. This will instantly create your `users`, `products`, `orders`, and `employees` tables and fill them with realistic data.

## Step 3: Start Querying!
1. When you go through the lessons (starting from `phase-1/01-introduction.md`), take the given Practice Questions and write your `SELECT ...` statements in the **Query Panel** (the right side) of DB Fiddle.
2. Click **Run** to see the results of your queries instantly!

---
**Why this matters:**
In real software development and tech interviews, you aren't just asked trivia questions; you are given a schema and asked to write a query that works. By using DB Fiddle alongside these lessons, you will build actual muscle memory. 

*(Note: If you already have DBeaver, PGAdmin, or MySQL Workbench installed on your computer, you can run the `practice-database.sql` script there instead!)*
