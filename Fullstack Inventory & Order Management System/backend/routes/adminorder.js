// GET /api/admin/orders
app.get("/api/admin/orders", async (req, res) => {
  const [rows] = await db.query(`
    SELECT o.id, u.username, p.name, o.quantity, o.price, o.total, o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.created_at DESC
  `);
  res.json(rows);
});
