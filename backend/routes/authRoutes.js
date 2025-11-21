const express = require("express");
const router = express.Router();
const db = require("../db"); // Import DB connection

// STUDENT LOGIN API
router.post("/student-login", (req, res) => {
  const { studentId, password } = req.body;

  const query = "SELECT * FROM student WHERE student_id = ? AND password = ?";
  db.query(query, [studentId, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      res.json({ success: true, message: "Login successful", student: result[0] });
    } else {
      res.json({ success: false, message: "Invalid ID or Password" });
    }
  });
});

// ADMIN LOGIN API
router.post("/admin-login", (req, res) => {
  const { staffId, password } = req.body;

  const query = "SELECT * FROM staff WHERE staff_id = ? AND password = ?";
  db.query(query, [staffId, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      res.json({ success: true, message: "Login successful", admin: result[0] });
    } else {
      res.json({ success: false, message: "Invalid ID or Password" });
    }
  });
});

module.exports = router;
