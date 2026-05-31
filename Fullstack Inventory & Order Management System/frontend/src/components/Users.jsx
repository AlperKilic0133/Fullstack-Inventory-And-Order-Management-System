import React, { useState, useEffect } from "react";

function Users() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [users, setUsers] = useState([]); // mevcut kullanıcılar

  // Kullanıcıları çek
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Gelen kullanıcılar:", data);
        setUsers(data);
      })
      .catch((err) => console.error("Listeleme hatası:", err));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        alert("Kullanıcı başarıyla eklendi!");
        setUsername("");
        setPassword("");
        setRole("Customer");

        // Yeni eklenen kullanıcıyı listeye eklemek için tekrar GET at
        const updated = await fetch("http://localhost:5000/api/users");
        const data = await updated.json();
        setUsers(data);
      } else {
        alert("Kullanıcı eklenemedi!");
      }
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-between px-10 py-6 bg-black text-white">
      {/* Sol tarafta form */}
      <div className="bg-gray-900 shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add User</h2>
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          {/* Username */}
          <div className="mb-6">
            <label className="block mb-2">Username</label>
            <input
              className="bg-gray-800 text-white border border-gray-600 rounded w-full py-2 px-4"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <input
              className="bg-gray-800 text-white border border-gray-600 rounded w-full py-2 px-4"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded w-full py-2 px-4"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded w-full"
            type="button"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </form>
      </div>

      <table className="ml-2.5 w-full border-collapse border border-gray-600 text-left  text-white">
        <thead>
          <tr>
            <th className="border border-gray-600 px-4 py-2">Username</th>
            <th className="border border-gray-600 px-4 py-2">Password</th>
            <th className="border border-gray-600 px-4 py-2">Role</th>
            <th className="border border-gray-600 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                Hiç kullanıcı yok
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-600 px-4 py-2">
                  {u.username}
                </td>
                <td className="border border-gray-600 px-4 py-2">
                  {u.password}
                </td>
                <td className="border border-gray-600 px-4 py-2">{u.role}</td>
                <td className="border border-gray-600 px-4 py-2">
                  <button
                    className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const response = await fetch(
                        `http://localhost:5000/api/users/${u.id}`,
                        { method: "DELETE" },
                      );
                      if (response.ok) {
                        setUsers(users.filter((user) => user.id !== u.id));
                      } else {
                        alert("Silme başarısız!");
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
