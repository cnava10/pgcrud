DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
  emp_id SERIAL PRIMARY KEY,
  emp_name VARCHAR(50) NOT NULL,
  emp_email VARCHAR(100) NOT NULL,
  emp_salary NUMERIC
);

INSERT INTO employee (emp_name, emp_email, emp_salary)
VALUES
('Alice Johnson', 'alice@example.com', 55000),
('Brian Smith', 'brian@example.com', 62000),
('Carla Davis', 'carla@example.com', 71000);