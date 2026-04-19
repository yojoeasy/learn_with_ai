-- -------------------------------------------------------------
-- SQL Practice Database Schema
-- You can copy and paste this into an online compiler like 
-- SQL Fiddle, DB Fiddle, or a local PostgreSQL / MySQL database.
-- -------------------------------------------------------------

-- 1. Create Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    country VARCHAR(50),
    created_at TIMESTAMP
);

-- 2. Create Products Table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT
);

-- 3. Create Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 4. Create Employees Table (For HR / Join Examples)
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    manager_id INT
);

-- -------------------------------------------------------------
-- Insert Practice Data
-- -------------------------------------------------------------

-- Insert Users
INSERT INTO users VALUES (1, 'Alice', 'Smith', 'alice@test.com', 'USA', '2023-01-15');
INSERT INTO users VALUES (2, 'Bob', 'Johnson', 'bob@test.com', 'UK', '2023-02-20');
INSERT INTO users VALUES (3, 'Charlie', 'Brown', 'charlie@test.com', 'Canada', '2023-03-10');
INSERT INTO users VALUES (4, 'David', 'Davis', 'david@test.com', 'USA', '2023-04-05');
INSERT INTO users VALUES (5, 'Eve', 'Evans', 'eve@test.com', 'Australia', '2023-05-12');

-- Insert Products
INSERT INTO products VALUES (101, 'Laptop', 'Electronics', 999.99, 50);
INSERT INTO products VALUES (102, 'Smartphone', 'Electronics', 699.00, 100);
INSERT INTO products VALUES (103, 'Coffee Maker', 'Home', 49.99, 20);
INSERT INTO products VALUES (104, 'Desk Chair', 'Furniture', 149.50, 15);
INSERT INTO products VALUES (105, 'Headphones', 'Electronics', 199.99, 80);

-- Insert Orders
INSERT INTO orders VALUES (1001, 1, '2023-06-01', 999.99, 'Shipped');
INSERT INTO orders VALUES (1002, 1, '2023-06-15', 199.99, 'Shipped');
INSERT INTO orders VALUES (1003, 3, '2023-07-20', 49.99, 'Pending');
INSERT INTO orders VALUES (1004, 4, '2023-08-05', 848.50, 'Shipped');
INSERT INTO orders VALUES (1005, 2, '2023-09-10', 699.00, 'Canceled');

-- Insert Employees
INSERT INTO employees VALUES (1, 'Sarah', 'Executive', 150000, NULL);
INSERT INTO employees VALUES (2, 'Mike', 'Engineering', 120000, 1);
INSERT INTO employees VALUES (3, 'Anna', 'Engineering', 115000, 2);
INSERT INTO employees VALUES (4, 'John', 'HR', 85000, 1);
INSERT INTO employees VALUES (5, 'Lisa', 'Marketing', 90000, 1);
