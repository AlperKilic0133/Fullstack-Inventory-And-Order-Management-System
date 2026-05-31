import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: "", totalQuantity: "" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data); // { totalRevenue, totalQuantity }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    fetchStats();
  }, []);

  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Toplam Satış Geliri */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">TOTAL SALES</h2>
          <p className="text-3xl mt-2">{stats.totalRevenue} ₺</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">COUNT OF THE SALES PRODUCTS</h2>
          <p className="text-3xl mt-2">{stats.totalQuantity}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
