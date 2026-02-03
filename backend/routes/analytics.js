import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Most consumed food items in a given month
router.get("/most-consumed", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year)
    return res.status(400).json({ message: "month & year required" });

  const query = `
    SELECT I.item_name, SUM(MU.quantity) AS total_qty
    FROM Mess_Usage MU
    JOIN Items I ON MU.item_id = I.item_id
    WHERE MONTH(MU.date)=? AND YEAR(MU.date)=?
    GROUP BY MU.item_id
    ORDER BY total_qty DESC;
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Meal-wise consumption
router.get("/meal-wise", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year)
    return res.status(400).json({ message: "month & year required" });

  const query = `
    SELECT MT.meal_name, SUM(MU.quantity) AS total_qty
    FROM Mess_Usage MU
    JOIN Meal_Timing MT ON MU.meal_id = MT.meal_id
    WHERE MONTH(MU.date)=? AND YEAR(MU.date)=?
    GROUP BY MU.meal_id;
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

export default router;
