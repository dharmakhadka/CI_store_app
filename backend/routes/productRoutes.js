const router  = require("express").Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

// GET /api/products  — list with search & category filter
router.get("/", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q)        filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const total    = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products  — admin only
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/products/:id  — admin only
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/products/:id  — admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
