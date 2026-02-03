import React, { useState } from "react";
import axios from "axios";

export default function GenerateBills() {
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");  // ⬅️ Added for PDF file

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/generate-bill", {
        student_id: studentId,
        month,
        year,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setAmount(res.data.total_amount);
        setFileName(res.data.fileName); // ⬅️ Save the fileName from backend
      } else {
        setMessage(res.data.message);
        setAmount(null);
        setFileName(""); // Hide button if failed
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again.");
      setFileName("");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Generate Student Monthly Bill</h2>

      <form onSubmit={handleGenerateBill} style={styles.form}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Year</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate Bill"}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      {amount !== null && (
        <p style={styles.amount}>Total Bill Amount: ₹{amount}</p>
      )}

      {/* ⬇️ Show Download Button if fileName exists */}
      {fileName && (
        <a
          href={`http://localhost:5000/bills/${fileName}`}
          download
          style={styles.downloadButton}
        >
          ⬇️ Download PDF Bill
        </a>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    fontSize: "15px",
  },
  amount: {
    marginTop: "10px",
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: "20px",
  },
  downloadButton: {
    display: "block",
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

