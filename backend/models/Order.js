const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     String,
  price:    Number,
  qty:      { type: Number, required: true, min: 1 },
  image:    String,
});

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:   [orderItemSchema],
  total:   { type: Number, required: true },
  status:  { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  address: {
    street: String,
    city:   String,
    zip:    String,
    country: String,
  },
  paid:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
