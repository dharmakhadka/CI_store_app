const router  = require("express").Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// Simple in-memory cart store (keyed by userId)
// In production, use Redis or a Cart collection
const carts = {};

const getCart = (userId) => carts[userId] || [];
const setCart = (userId, cart) => { carts[userId] = cart; };

// GET /api/cart
router.get("/", protect, (req, res) => {
  res.json(getCart(String(req.user._id)));
});

// POST /api/cart/add
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const userId = String(req.user._id);
    const cart   = getCart(userId);
    const idx    = cart.findIndex((i) => i.productId === productId);

    if (idx > -1) {
      cart[idx].qty += Number(qty);
    } else {
      cart.push({ productId, name: product.name, price: product.price, image: product.image, qty: Number(qty) });
    }
    setCart(userId, cart);
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/cart/:productId
router.put("/:productId", protect, (req, res) => {
  const userId = String(req.user._id);
  const cart   = getCart(userId);
  const item   = cart.find((i) => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ message: "Not in cart" });
  item.qty = Number(req.body.qty);
  if (item.qty <= 0) {
    setCart(userId, cart.filter((i) => i.productId !== req.params.productId));
  } else {
    setCart(userId, cart);
  }
  res.json(getCart(userId));
});

// DELETE /api/cart/:productId
router.delete("/:productId", protect, (req, res) => {
  const userId = String(req.user._id);
  setCart(userId, getCart(userId).filter((i) => i.productId !== req.params.productId));
  res.json(getCart(userId));
});

// DELETE /api/cart  — clear cart
router.delete("/", protect, (req, res) => {
  setCart(String(req.user._id), []);
  res.json([]);
});

module.exports = router;
