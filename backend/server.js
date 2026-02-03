
const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Serve PDF files from /bills folder
app.use("/bills", express.static(path.join(__dirname, "bills")));

// ---------------- DATABASE CONNECTION ----------------
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

// ---------------- STUDENT LOGIN API ----------------
app.post("/api/student-login", (req, res) => {
  const { studentId, password } = req.body;
  const query = "SELECT * FROM student WHERE roll_no = ? AND password = ?";

  db.query(query, [studentId, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) {
      res.json({ success: true, message: "Login successful", student: results[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ---------------- ADMIN LOGIN API ----------------
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

// ---------------- MENU ROUTES ----------------
app.get("/api/menu", (req, res) => {
  const query = "SELECT * FROM food_item ORDER BY item_id DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    res.json(results);
  });
});

app.post("/api/menu", (req, res) => {
  const { name, category, price, available_in } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ success: false, message: "Name, category and price are required" });
  }

  const query =
    "INSERT INTO food_item (item_name, category, cost, available_in) VALUES (?, ?, ?, ?)";
  db.query(query, [name, category, price, available_in || "All"], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    res.json({
      item_id: result.insertId,
      item_name: name,
      category,
      cost: price,
      available_in: available_in || "All",
    });
  });
});

app.delete("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM food_item WHERE item_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "Item deleted" });
  });
});
// ---------------- ADD STUDENT API ----------------
app.post("/api/students", (req, res) => {
  const { name, roll_no, room_no, password } = req.body;

  if (!name || !roll_no || !password) {
    return res.status(400).json({ success: false, message: "Name, Roll No, and Password are required" });
  }

  const query = "INSERT INTO student (name, roll_no, room_no, password) VALUES (?, ?, ?, ?)";
  db.query(query, [name, roll_no, room_no || "", password], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    res.json({
      success: true,
      student_id: result.insertId,
      name,
      roll_no,
      room_no: room_no || "",
    });
  });
});
// ---------------- GET ALL STUDENTS ----------------
app.get("/api/students", (req, res) => {
  const query = "SELECT * FROM student ORDER BY student_id ASC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    res.json(results);
  });
});

// ---------------- UPDATE STUDENT ----------------
app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, roll_no, room_no } = req.body;

  if (!name || !roll_no) return res.status(400).json({ success: false, message: "Name and Roll No are required" });

  const query = "UPDATE student SET name = ?, roll_no = ?, room_no = ? WHERE student_id = ?";
  db.query(query, [name, roll_no, room_no || "", id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    res.json({ success: true, message: "Student updated successfully" });
  });
});

// ---------------- DELETE STUDENT ----------------
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM student WHERE student_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, message: "Student deleted successfully" });
  });
});

// Validate student ID
app.post("/api/student-validate", (req, res) => {
  const { studentId } = req.body;
  const query = "SELECT * FROM student WHERE roll_no = ?";
  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length > 0) res.json({ success: true });
    else res.json({ success: false });
  });
});

// Place student order
app.post("/api/student-order", (req, res) => {
  const { studentId, items } = req.body;
  if (!studentId || !items || !items.length) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  db.query("SELECT student_id FROM student WHERE roll_no = ?", [studentId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (!result.length) return res.status(400).json({ success: false, message: "Invalid student" });

    const student_id = result[0].student_id;
    const orderQueries = items.map(
      (item) =>
        new Promise((resolve, reject) => {
          const q = "INSERT INTO student_orders (student_id, item_id, quantity) VALUES (?, ?, ?)";
          db.query(q, [student_id, item.item_id, item.quantity || 1], (err2) => {
            if (err2) reject(err2);
            else resolve();
          });
        })
    );

    Promise.all(orderQueries)
      .then(() => res.json({ success: true }))
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "Database error" });
      });
  });
});
// ---------------- GET ALL STUDENT ORDERS FOR ADMIN ----------------
app.get("/api/orders", (req, res) => {
  const query = `
    SELECT 
      so.id, 
      s.name AS student_name, 
      s.roll_no, 
      fo.item_name, 
      so.quantity, 
      fo.cost, 
      (so.quantity * fo.cost) AS total_price, 
      so.order_date
    FROM student_orders so
    JOIN student s ON so.student_id = s.student_id
    JOIN food_item fo ON so.item_id = fo.item_id
    ORDER BY so.order_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    res.json(results);
  });
});

// ---------------- STUDENT ANALYSIS API (Meal-wise & Total Consumption) ----------------
app.post("/api/student-analysis", (req, res) => {
    const { month, year } = req.body;

    const query = `
        SELECT 
            fo.item_name,
            SUM(CASE WHEN so.meal_type='breakfast' THEN so.quantity ELSE 0 END) as breakfast,
            SUM(CASE WHEN so.meal_type='lunch' THEN so.quantity ELSE 0 END) as lunch,
            SUM(CASE WHEN so.meal_type='dinner' THEN so.quantity ELSE 0 END) as dinner,
            SUM(so.quantity) as total
        FROM student_orders so
        JOIN food_item fo ON so.item_id = fo.item_id
        WHERE MONTH(so.order_date) = ? AND YEAR(so.order_date) = ?
        GROUP BY fo.item_name
        ORDER BY total DESC
    `;

    db.query(query, [month, year], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.json({ month, year, items: results });
    });
});

// ================== GENERATE BILL WITH PDF ==================
app.post("/api/generate-bill", (req, res) => {
  const { student_id, month, year } = req.body;

  // Step 1: Get numeric student_id and student name
  db.query("SELECT student_id, name FROM student WHERE roll_no = ?", [student_id], (err, student) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    if (!student.length) return res.json({ success: false, message: "Student not found" });

    const numericId = student[0].student_id;
    const studentName = student[0].name;

    // Step 2: Get all orders for that student for the given month
    const query = `
      SELECT 
        fo.item_name,
        fo.cost,
        so.quantity,
        DATE(so.order_date) AS order_date,
        (fo.cost * so.quantity) AS total_price
      FROM student_orders so
      JOIN food_item fo ON so.item_id = fo.item_id
      WHERE so.student_id = ?
        AND MONTH(so.order_date) = ?
        AND YEAR(so.order_date) = ?
      ORDER BY so.order_date ASC;
    `;

    db.query(query, [numericId, month, year], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "SQL error" });
      if (results.length === 0) return res.json({ success: false, message: "No orders found for selected month." });

      // Step 3: PDF generation
      const fileName = `bill_${student_id}_${year}_${month}.pdf`;
      const billsFolder = path.join(__dirname, "bills");
      const filePath = path.join(billsFolder, fileName);

      if (!fs.existsSync(billsFolder)) fs.mkdirSync(billsFolder);

      const doc = new PDFDocument({ margin: 30, size: "A4" });
      doc.pipe(fs.createWriteStream(filePath));

      // Header
      doc.fontSize(20).text("Mess Monthly Bill", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Student ID: ${student_id}`);
      doc.text(`Student Name: ${studentName}`);
      doc.text(`Month: ${month}   Year: ${year}`);
      doc.moveDown();

      // Table Header
     // Table Header
doc.fontSize(12);
const tableTop = doc.y;

const dateX = 50,
      itemX = 150,
      priceX = 300,
      qtyX = 350,
      totalX = 420;

// Header Row
doc.text("Date", dateX, tableTop);
doc.text("Item Name", itemX, tableTop);
doc.text("Price", priceX, tableTop, { width: 40, align: "right" });
doc.text("Qty", qtyX, tableTop, { width: 40, align: "right" });
doc.text("Total", totalX, tableTop, { width: 50, align: "right" });

doc.moveDown();

let grandTotal = 0;

// -------------------------
// PERFECT ROW ALIGNMENT
// -------------------------
let rowY = doc.y;      
let rowHeight = 18;     // uniform row spacing

results.forEach((row) => {
  const formattedDate = new Date(row.order_date)
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  // Each row printed at *fixed Y*
  doc.text(formattedDate, dateX, rowY, { width: 100 });
  doc.text(row.item_name, itemX, rowY, { width: 140 });
  doc.text(row.cost.toString(), priceX, rowY, { width: 40, align: "right" });
  doc.text(row.quantity.toString(), qtyX, rowY, { width: 40, align: "right" });
  doc.text(row.total_price.toString(), totalX, rowY, { width: 50, align: "right" });

  grandTotal += row.total_price;

  // Move to next row
  rowY += rowHeight;
});




      // Footer Total
      doc.moveDown(2);
      doc.fontSize(14).text(`Grand Total: ₹${grandTotal}`, { align: "right" });

      doc.end();

      // Step 4: Send response
      res.json({ success: true, message: "Bill generated successfully", fileName, totalAmount: grandTotal });
    });
  });
});

// ---------------- START SERVER ----------------
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
