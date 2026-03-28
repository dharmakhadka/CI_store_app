require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");
const connectDB = require("./db");

const products = [
  { name: "Wireless Headphones", description: "Premium noise-cancelling over-ear headphones", price: 149.99, category: "Electronics", stock: 25, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
  { name: "Running Shoes", description: "Lightweight breathable shoes for everyday running", price: 89.99, category: "Sports", stock: 40, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { name: "Coffee Maker", description: "12-cup programmable drip coffee maker", price: 59.99, category: "Kitchen", stock: 15, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
  { name: "Leather Wallet", description: "Slim genuine leather bifold wallet", price: 34.99, category: "Accessories", stock: 60, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400" },
  { name: "Yoga Mat", description: "Non-slip eco-friendly 6mm yoga mat", price: 44.99, category: "Sports", stock: 30, image: "https://images.unsplash.com/photo-1601925228078-9f48dea4e9dd?w=400" },
  { name: "Desk Lamp", description: "LED adjustable desk lamp with USB charging port", price: 39.99, category: "Home", stock: 20, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" },
  { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 24h battery", price: 79.99, category: "Electronics", stock: 18, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
  { name: "Sunglasses", description: "Polarized UV400 protection aviator sunglasses", price: 29.99, category: "Accessories", stock: 50, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400" },
];

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Seeded", products.length, "products");
  process.exit(0);
})();
