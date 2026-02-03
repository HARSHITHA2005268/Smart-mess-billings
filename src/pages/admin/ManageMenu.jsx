import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageAdmin.css";

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: "Food",
    price: "",
    available_in: "All",
  });

  const BASE_URL = "http://localhost:5000"; // backend URL

  // Fetch menu items
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${BASE_URL}/api/menu`)
      .then((res) => {
        if (mounted) setItems(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  // Add new menu item
const handleAdd = async (e) => {
  e.preventDefault();
  const priceNumber = Number(form.price);
  if (!form.name || isNaN(priceNumber) || priceNumber <= 0) {
    return alert("Name and valid Price are required");
  }

  try {
    // Add item to backend
    await axios.post(`${BASE_URL}/api/menu`, {
      name: form.name,
      category: form.category,
      price: priceNumber,
      available_in: form.available_in,
    });

    // Fetch all items again from backend
    const res = await axios.get(`${BASE_URL}/api/menu`);
    setItems(res.data || []);

    // Reset form
    setForm({ name: "", category: "Food", price: "", available_in: "All" });
  } catch (err) {
    console.error(err);
    alert("Failed to add item");
  }
};


  // Delete menu item
 const handleDelete = async (id) => {
  if (!window.confirm("Delete this item?")) return;

  try {
    await axios.delete(`${BASE_URL}/api/menu/${id}`);
    
    // Fetch all items again from backend
    const res = await axios.get(`${BASE_URL}/api/menu`);
    setItems(res.data || []);
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};


  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Manage Menu</h2>
      </div>

      <div className="admin-body">
        <div className="admin-panel">
          <form className="form-row" onSubmit={handleAdd}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Dessert">Dessert</option>
            </select>
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <select
              value={form.available_in}
              onChange={(e) =>
                setForm({ ...form, available_in: e.target.value })
              }
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="All">All</option>
            </select>
            <button type="submit" className="btn primary">
              Add
            </button>
          </form>

          {loading ? (
            <div className="loader">Loading…</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available In</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
  {items.map((it) => (
    <tr key={it.item_id}>
      <td>{it.item_name}</td>
      <td>{it.category}</td>
      <td>{it.cost}</td>
      <td>{it.available_in}</td>
      <td>
        <button className="danger" onClick={() => handleDelete(it.item_id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
}
