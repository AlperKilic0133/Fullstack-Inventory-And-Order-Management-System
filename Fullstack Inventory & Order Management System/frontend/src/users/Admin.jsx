import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // / yoluna yönlendir
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-800 border-r border-zinc-700 fixed left-0 top-0 h-screen">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-zinc-700">
            <h1 className="text-2xl font-bold text-red-500">
              Inventory Management
            </h1>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/Admin/Dashboard"
                  className="block px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              
              <li>
                <Link
                  to="/Admin/Products"
                  className="block px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Products
                </Link>
              </li>
            
              <li>
                <Link
                  to="/Admin/Orders"
                  className="block px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/Admin/Users"
                  className="block px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Users
                </Link>
              </li>
             

              {/* Logout */}
              <div className="mt-125 p-4 border-t border-gray-700 ">
                <button
                  onClick={handleLogout}
                  className=" w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Right Content */}
      <main className="flex-1 ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
