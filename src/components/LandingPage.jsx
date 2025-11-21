import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">

      {/* Header */}
      <header className="header">
        <h1>Smart Mess Billing System</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* Center Content */}
      <div className="center-content">
        <h2>Welcome to Smart Mess</h2>
        <p>Manage bills, food orders, complaints and more easily.</p>
        
        <div className="login-buttons">
          <Link to="/student-login" className="btn">Student Login</Link>
          <Link to="/admin-login" className="btn">Admin Login</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Smart Mess Billing System | All Rights Reserved</p>
      </footer>

    </div>
  );
}
