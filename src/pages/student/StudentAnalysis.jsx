import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export default function StudentAnalysis() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    try {
      const res = await axios.post("/api/student-analysis", { month, year });
      setData(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD0", "#FF6384"];

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Food Consumption Analysis</h2>

      {/* Month & Year Filters */}
      <div style={{ marginBottom: 20 }}>
        <label>Month: </label>
        <input type="number" value={month} min="1" max="12" onChange={e => setMonth(e.target.value)} />
        <label style={{ marginLeft: 10 }}>Year: </label>
        <input type="number" value={year} onChange={e => setYear(e.target.value)} />
        <button onClick={fetchData} style={{ marginLeft: 10 }}>Filter</button>
      </div>

      {/* Bar Chart – Meal-wise Consumption */}
      <h3>Meal-wise Consumption (Breakfast / Lunch / Dinner)</h3>
      <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="item_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="breakfast" fill="#8884d8" />
        <Bar dataKey="lunch" fill="#82ca9d" />
        <Bar dataKey="dinner" fill="#ffc658" />
      </BarChart>

      {/* Pie Chart – Total Quantity */}
      <h3>Total Quantity Consumed per Item</h3>
      <PieChart width={400} height={400}>
        <Pie data={data} dataKey="total" nameKey="item_name" cx="50%" cy="50%" outerRadius={120} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
