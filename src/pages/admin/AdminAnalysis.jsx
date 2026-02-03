 import React, { useEffect, useState } from "react";
import api from "../../api/api"; // <- Place it here, at the top
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";


export default function AdminAnalysis() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#e91e63"];

  const fetchData = async () => {
    if (!month || !year) return alert("Enter month & year");

    try {
      const items = await api.get(`/student-analysis/most-consumed?month=${month}&year=${year}`);
      const meals = await api.get(`/student-analysis/meal-wise?month=${month}&year=${year}`);
      setItemsData(items.data);
      setMealData(meals.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch analysis data");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Food Consumption Analysis</h1>
      {/* ... rest of your JSX ... */}
    </div>
  );
}
