const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

bcrypt.hash("admin123", 10, (err, hash) => {
  if (err) throw err;

  db.query(
    "INSERT INTO admins (username, password) VALUES (?, ?)",
    ["admin", hash],
    (err) => {
      if (err) throw err;
      console.log("Admin created successfully!");
      db.end();
    }
  );
});