import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentOrder.css";

export default function StudentOrder() {
  const [studentId, setStudentId] = useState("");
  const [validStudent, setValidStudent] = useState(false);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState({}); // { item_id: quantity }

  const BASE_URL = "http://localhost:5000";

  // Validate student ID
  const handleStudentCheck = async () => {
    if (!studentId) return alert("Enter student ID");
    try {
      const res = await axios.post(`${BASE_URL}/api/student-validate`, { studentId });
      if (res.data.success) {
        setValidStudent(true);
        fetchMenu();
      } else {
        alert("Invalid student ID");
      }
    } catch (err) {
      console.error(err);
      alert("Error validating student");
    }
  };

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/menu`);
      setMenu(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to fetch menu");
    }
  };

  // Handle quantity change
  const handleQuantity = (itemId, qty) => {
    setOrders((prev) => ({ ...prev, [itemId]: qty }));
  };

  // Submit order
  const handlePlaceOrder = async () => {
    const orderItems = Object.entries(orders)
      .filter(([item_id, qty]) => qty > 0)
      .map(([item_id, qty]) => ({ item_id: Number(item_id), quantity: Number(qty) }));

    if (!orderItems.length) return alert("Select at least one item");

    try {
      const res = await axios.post(`${BASE_URL}/api/student-order`, {
        studentId,
        items: orderItems,
      });
      if (res.data.success) {
        alert("Order placed successfully!");
        setOrders({});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  if (!validStudent) {
    return (
      <div className="student-order-container">
        <h2>Enter your Student ID</h2>
        <input
          placeholder="Student ID (e.g., S101)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button onClick={handleStudentCheck}>Verify</button>
      </div>
    );
  }

  return (
    <div className="student-order-container">
      <h2>Place Your Order</h2>
      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <table className="student-menu-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available In</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.category}</td>
                <td>{item.cost}</td>
                <td>{item.available_in}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={orders[item.item_id] || 0}
                    onChange={(e) => handleQuantity(item.item_id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}
