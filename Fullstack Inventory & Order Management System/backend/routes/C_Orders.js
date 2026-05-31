// import express from "express";
// import { connectToDatabase } from "../lib/db.js"; // kendi db bağlantı fonksiyonun

// const router = express.Router();

// // ✅ Sipariş oluşturma (Customer)
// router.post("/", async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;
//     const db = await connectToDatabase();

//     // Ürün kontrolü
//     const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
//       productId,
//     ]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Ürün bulunamadı" });
//     }

//     const product = rows[0];
//     if (quantity > product.stock) {
//       return res
//         .status(400)
//         .json({ message: `En fazla ${product.stock} adet alınabilir` });
//     }

//     const price = product.price;
//     const total = price * quantity;

//     // Siparişi kaydet
//     await db.query(
//       "INSERT INTO orders (user_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)",
//       [userId, productId, quantity, price, total],
//     );

//     // Stok güncelle
//     await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
//       quantity,
//       productId,
//     ]);

//     return res.status(201).json({ message: "Sipariş başarıyla oluşturuldu" });
//   } catch (err) {
//     console.error("Sipariş hatası:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Siparişleri listeleme (Customer → sadece kendi siparişleri)
// router.get("/orders/:userId", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     const userId = req.params.userId;

//     const [rows] = await db.query(
//       `
//       SELECT o.id, p.name, o.quantity, o.price, o.total, o.created_at
//       FROM orders o
//       JOIN products p ON o.product_id = p.id
//       WHERE o.user_id = ?
//       ORDER BY o.created_at DESC
//     `,
//       [userId],
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("Sipariş listeleme hatası:", err);
//     res.status(500).json({ message: "Siparişler alınamadı" });
//   }
// });

// export default router;import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

// ✅ Sipariş oluşturma (userId yok)
router.post("/orders", async (req, res) => {
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

    // 🔑 Burada price ve total tanımlanıyor
    const price = product.price; // ürünün fiyatı
    const total = price * quantity; // toplam tutar

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

// ✅ Siparişleri listeleme (tüm siparişler)
router.get("/orders", async (req, res) => {
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
