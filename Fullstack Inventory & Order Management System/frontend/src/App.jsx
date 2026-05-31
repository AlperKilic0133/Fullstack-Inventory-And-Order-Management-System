import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./Login.jsx";
import Customer from "./users/Customer.jsx";
import Admin from "./users/Admin.jsx";

 import Products from "./components/Products.jsx";
 import Orders from "./components/Orders.jsx";
import Users from "./components/Users.jsx";
 import Dashboard from "./components/Dashboard.jsx";

// Customer componentleri
import C_Products from "./components/customer_components/C_Products.jsx";
import C_Orders from "./components/customer_components/C_Orders.jsx";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Customer Layout */}
      <Route path="/Customer" element={<Customer />}>
        <Route index element={<C_Products />} />

        <Route path="Products" element={<C_Products />} />
        <Route path="Orders" element={<C_Orders />} />
        <Route path="Profile" element={<h1>Profile Page</h1>} />
        <Route path="Reports" element={<h1>Reports Page</h1>} />
      </Route>

      {/* Admin Layout */}
      <Route path="/Admin" element={<Admin />}>
        {/* Default olarak Dashboard componenti */}
        <Route index element={<Dashboard />} />

         <Route path="Dashboard" element={<Dashboard />} />
        <Route path="Products" element={<Products />} />
         <Route path="Orders" element={<Orders />} />
        <Route path="Users" element={<Users />} />
       </Route>
    </Routes>
  );
}

export default App;
