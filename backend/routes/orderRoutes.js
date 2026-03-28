const router  = require("express").Router();
const Order   = require("../models/Order");
const { protect, admin } = require("../middleware/auth");

// POST /api/orders  — place order
router.post("/", protect, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items?.length) return res.status(400).json({ message: "No items" });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const order = await Order.create({ user: req.user._id, items, total, address });
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/orders/mine  — user's own orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/orders  — admin: all orders
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/orders/:id/status  — admin: update status
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
