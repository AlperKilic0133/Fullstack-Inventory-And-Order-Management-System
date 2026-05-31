import React, { useEffect, useState } from "react";
import axios from "axios";

function C_Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Siparişler yüklenemedi");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">PRODUCTS</th>
            <th className="border px-4 py-2">COUNT</th>
            <th className="border px-4 py-2">PRICE OF COUNT</th>
            <th className="border px-4 py-2">TOTAL PRICE</th>
            <th className="border px-4 py-2">DATE</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border px-4 py-2">{o.id}</td>
              <td className="border px-4 py-2">{o.name}</td>
              <td className="border px-4 py-2">{o.quantity}</td>
              <td className="border px-4 py-2">{o.price} TL</td>
              <td className="border px-4 py-2">{o.total} TL</td>
              <td className="border px-4 py-2">
                {new Date(o.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default C_Orders;
