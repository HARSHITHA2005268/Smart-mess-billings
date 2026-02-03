import { Link, Outlet, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="complaint">Complaint</Link></li>
          <li><Link to="payment">Payment</Link></li>
          <li><Link to="bill-report">Bill Report</Link></li>
        </ul>
      </div>

      <div className="content-area">
        {/* 🔹 Transparent header, Home on right */}
        <div className="top-header">
          <button className="home-btn" onClick={() => navigate("/")}>🏠 Home</button>
        </div>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
