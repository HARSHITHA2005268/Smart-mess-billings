import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="navbar">
      <div className="logo">Smart Mess Billing</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
