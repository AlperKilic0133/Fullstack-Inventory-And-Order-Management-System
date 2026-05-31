import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(`
      SELECT 
        COALESCE(SUM(total), 0) AS totalRevenue,
        COALESCE(SUM(quantity), 0) AS totalQuantity
      FROM orders
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Admin Stats hatası:", err.sqlMessage || err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
