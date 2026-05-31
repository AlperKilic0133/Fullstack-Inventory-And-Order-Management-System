import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

// ✅ Sipariş oluşturma
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const db = await connectToDatabase();

    // Ürün kontrolü
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const product = rows[0];
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: `En fazla ${product.stock} adet alınabilir` });
    }

    // 🔑 fiyat ve toplam tutar
    const price = product.price;
    const total = price * quantity;

    // Siparişi kaydet
    await db.query(
      "INSERT INTO orders (product_id, quantity, price, total) VALUES (?, ?, ?, ?)",
      [productId, quantity, price, total],
    );

    // Stok güncelle
    await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
      quantity,
      productId,
    ]);

    res.status(201).json({ message: "Sipariş başarıyla oluşturuldu" });
  } catch (err) {
    console.error("Sipariş hatası:", err); // 🔴 burada gerçek hatayı göreceksin
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Siparişleri listeleme
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const [rows] = await db.query(`
      SELECT o.id, p.name, o.quantity, o.price, o.total, o.created_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Sipariş listeleme hatası:", err);
    res.status(500).json({ message: "Siparişler alınamadı" });
  }
});

export default router;
