const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Harshitha@123",
  database: "MessManagement"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ MySQL connected successfully!");
});

// ⬇️ ⬇️ ADD THIS STUDENT LOGIN API HERE ⬇️

app.post("/api/student-login", (req, res) => {
  const { studentId, password } = req.body;

const query = "SELECT * FROM student WHERE roll_no = ? AND password = ?";


  db.query(query, [studentId, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
  // ⬇️ ADMIN LOGIN API ⬇️
app.post("/api/admin-login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      res.json({ success: true, message: "Admin login successful" });
    } else {
      res.json({ success: false, message: "Invalid admin credentials" });
    }
  });
});

});

// ⬆️ ⬆️ END OF LOGIN API CODE ⬆️

// Default home route
app.get("/", (req, res) => {
  res.send("Smart Mess Billing Backend is running 🚀");
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
