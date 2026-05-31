// routes/authRoutes.js
import express from "express";
import { connectToDatabase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDatabase();

    // Kullanıcıyı bul
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı yok" });
    }

    const user = rows[0];

    // Plain-text şifre kontrolü
    if (password !== user.password) {
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    // Token üret
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

export default router;
