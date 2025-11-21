const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Harshitha@123",
  database: "MessManagement",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("📦 MySQL connected successfully!");
});

module.exports = db;
