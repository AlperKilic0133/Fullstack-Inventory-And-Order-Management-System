import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

// Yeni kullanıcı ekle
router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body; // role de body'den gelsin

    const db = await connectToDatabase();
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
    );

    res.json({ message: "Kullanıcı eklendi" });
  } catch (err) {
    console.error("Kullanıcı ekleme hatası:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT id, username, password, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Kullanıcıları getirme hatası:", err);
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
