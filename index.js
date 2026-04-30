require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 2
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started (http://localhost:3000/)");
});

// Test route
app.get("/", (req, res) => {
  const sql = "SELECT * FROM employee ORDER BY emp_id";

  pool.query(sql, [], (err, result) => {
    let message = "";
    let model = [];

    if (err) {
      message = `Error - ${err.message}`;
    } else {
      message = "success";
      model = result.rows;
    }

    res.render("index", {
      message: message,
      model: model
    });
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { emp_name, emp_email, emp_salary } = req.body;

  const sql = `
    INSERT INTO employee (emp_name, emp_email, emp_salary)
    VALUES ($1, $2, $3)
  `;

  pool.query(sql, [emp_name, emp_email, emp_salary], (err, result) => {
    if (err) {
      return res.send(`Error: ${err.message}`);
    }

    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE emp_id = $1";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      return res.send(`Error: ${err.message}`);
    }

    res.render("edit", {
      model: result.rows[0]
    });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { emp_name, emp_email, emp_salary } = req.body;

  const sql = `
    UPDATE employee
    SET emp_name = $1, emp_email = $2, emp_salary = $3
    WHERE emp_id = $4
  `;

  pool.query(sql, [emp_name, emp_email, emp_salary, id], (err, result) => {
    if (err) {
      return res.send(`Error: ${err.message}`);
    }

    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM employee WHERE emp_id = $1";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      return res.send(`Error: ${err.message}`);
    }

    res.redirect("/");
  });
});