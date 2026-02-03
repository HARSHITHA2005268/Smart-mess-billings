import React, { useState } from "react";
import axios from "axios";

export default function MonthBillReport() {
  const [student_id, setStudentId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [bill, setBill] = useState(null);

  const fetchBill = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/view-bill", {
        params: { student_id, month, year },
      });
      setBill(res.data.bill || null);
    } catch {
      setBill(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>View Monthly Bill</h2>

      <input
        type="text"
        placeholder="Student ID"
        value={student_id}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button onClick={fetchBill}>Get Bill</button>

      {bill && (
        <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 15 }}>
          <h3>Bill Details</h3>
          <p><b>Student ID:</b> {bill.student_id}</p>
          <p><b>Month-Year:</b> {bill.month}/{bill.year}</p>
          <p><b>Total Amount:</b> ₹{bill.total_amount}</p>
        </div>
      )}
    </div>
  );
}
