import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id }             = useParams();
  const navigate           = useNavigate();
  const { user }           = useAuth();
  const { addToCart }      = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = async () => {
    if (!user) { navigate("/login"); return; }
    await addToCart(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="spinner"/>;
  if (!product) return null;

  return (
    <div className="container detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="detail-grid">
        <div className="detail-img-wrap">
          <img src={product.image || "https://via.placeholder.com/600x450"} alt={product.name}/>
          <span className="card-category" style={{ position: "absolute", top: 16, left: 16 }}>{product.category}</span>
        </div>
        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {product.stock > 0
              ? <span className="in-stock">✓ In stock ({product.stock} available)</span>
              : <span className="out-stock">✗ Out of stock</span>}
          </div>

          {product.stock > 0 && (
            <div className="qty-row">
              <label>Quantity</label>
              <div className="qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <button
            className={`btn-primary add-btn ${added ? "add-btn--added" : ""}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{ marginTop: 24, width: "100%", padding: "14px" }}
          >
            {added ? "✓ Added to cart!" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
