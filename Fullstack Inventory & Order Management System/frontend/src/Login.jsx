import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        values,
      );
      const { token, user } = response.data;

      if (!user) {
        setError("Kullanıcı bilgisi alınamadı");
        return;
      }

      // 🔑 login sonrası gerekli bilgiler kaydediliyor
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);

      if (user.role === "Admin") {
        navigate("/Admin");
      } else {
        navigate("/Customer");
      }
    } catch (err) {
      console.error(err);
      alert("Kullanıcı Adı Veya Şifre Yanlış");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-87.5"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı adı"
            required
            onChange={handleChanges}
            className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Şifre</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            onChange={handleChanges}
            className="w-full border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="ml-27 cursor-pointer text-white bg-red-600 border border-red-700 hover:bg-red-700 hover:border-red-800 focus:ring-4 focus:ring-red-300 shadow-md font-semibold rounded-xl text-sm px-5 py-3 transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none"
        >
          Giriş
        </button>
      </form>
    </div>
  );
}

export default Login;
