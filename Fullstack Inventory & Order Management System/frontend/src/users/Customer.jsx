import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

function Customer() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // / yoluna yönlendir
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Customer Screen
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/Customer/Products"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Products
          </Link>
          <Link
            to="/Customer/Orders"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Orders
          </Link>
         
         
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Sağ içerik alanı */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Burada child route’lar render edilecek */}
        <Outlet />
      </main>
    </div>
  );
}

export default Customer;
