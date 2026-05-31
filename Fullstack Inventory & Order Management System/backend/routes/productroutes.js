import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

// Ürün ekleme (POST)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: "Eksik alanlar var" });
    }

    const db = await connectToDatabase();
    await db.query(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description, price, stock],
    );

    res.status(201).json({ message: "Ürün başarıyla kaydedildi" });
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// Ürünleri listeleme (GET)
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Ürünleri getirme hatası:", err);
    res.status(500).json({ error: err.message });
  }

  // Ürün silme
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await connectToDatabase();
      await db.query("DELETE FROM products WHERE id = ?", [id]);
      res.json({ message: "Ürün silindi" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Ürün güncelleme
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;
      const db = await connectToDatabase();
      await db.query(
        "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
        [name, description, price, stock, id],
      );
      res.json({ message: "Ürün güncellendi" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

export default router;
