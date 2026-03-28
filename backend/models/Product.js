const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true },
  image:       { type: String, default: "" },
  stock:       { type: Number, default: 0, min: 0 },
  ratings:     [{ user: mongoose.Schema.Types.ObjectId, value: Number }],
}, { timestamps: true });

productSchema.virtual("avgRating").get(function () {
  if (!this.ratings.length) return 0;
  return this.ratings.reduce((a, r) => a + r.value, 0) / this.ratings.length;
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
