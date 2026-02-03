import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch("http://localhost:5000/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/admin-dashboard");
        } else {
          alert("Invalid admin credentials");
        }
      })
      .catch(() => alert("Server error"));
  };

  return (
    <div className="login-container">
      <Link to="/" className="home-btn">Home</Link>

      <div className="login-box">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input type="text" name="username" placeholder="Enter username" required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter Password" required />

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
