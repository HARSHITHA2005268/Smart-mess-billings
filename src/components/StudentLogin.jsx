import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  function handleSubmit(e) {
  e.preventDefault();

  const studentId = e.target.studentId.value;
  const password = e.target.password.value;

 fetch("http://localhost:5000/api/student-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ studentId, password })
})

  .then(res => res.json())
  .then(data => {
    if (data.success) {
      navigate("/user-dashboard");
    } else {
      alert("Invalid ID or Password");
    }
  })
  .catch(() => alert("Server error"));
}


  return (
    <div className="login-container">

      {/* Home Button */}
      <Link to="/" className="home-btn">Home</Link>

      <div className="login-box">
        <h2>Student Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Student ID</label>
          <input type="text" name="studentId"  placeholder="Enter Student ID" required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter Password" required />

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
