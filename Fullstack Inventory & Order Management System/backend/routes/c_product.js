import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// ✅ MySQL bağlantısı (pool)
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "senin_sifren",
  database: "senin_db_adi",
});

// ✅ Ürünleri listeleme
router.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Ürünler alınamadı:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Yeni ürün ekleme (Admin için)
router.post("/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    await db.query(
      "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
      [name, price, stock],
    );
    res.status(201).json({ message: "Ürün başarıyla eklendi" });
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
