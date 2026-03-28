import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { user }               = useAuth();
  const [added, setAdded]      = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = "/login"; return; }
    await addToCart(product._id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="card-img-wrap">
        <img src={product.image || "https://via.placeholder.com/400x300?text=No+Image"}
             alt={product.name} className="card-img" loading="lazy"/>
        <span className="card-category">{product.category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name">{product.name}</h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <button
            className={`card-btn ${added ? "card-btn--added" : ""}`}
            onClick={handleAdd}
            disabled={loading || product.stock === 0}
          >
            {product.stock === 0 ? "Out of stock" : added ? "✓ Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
