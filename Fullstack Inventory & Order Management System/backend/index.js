import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./lib/db.js";

// Route dosyaları
import authRoutes from "./routes/auth.rotes.js"; // ✅ doğru isim
import productRoutes from "./routes/productroutes.js";
import userRoutes from "./routes/userroutes.js";
import orderRoutes from "./routes/order.js"; // ✅ orders.js olmalı
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

// Varsayılan login route (http://localhost:5000/)
app.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDatabase();

    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı yok" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login hatası:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Route'lar
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/stats", dashboardRoutes);

console.log("Routes yüklendi");

// 404 yakalama
app.use((req, res) => {
  console.log("404 - Route bulunamadı:", req.method, req.originalUrl);
  res.status(404).json({ message: "Route bulunamadı" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
