import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import "./Cart.css";

export default function Cart() {
  const { cart, total, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", zip: "", country: "" });

  const handleOrder = async () => {
    if (!address.street || !address.city) return alert("Please fill in your address.");
    setPlacing(true);
    try {
      await api.post("/orders", { items: cart, address });
      await clearCart();
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally { setPlacing(false); }
  };

  if (success) return (
    <div className="container cart-empty" style={{ paddingTop: 80 }}>
      <div className="success-msg" style={{ fontSize: 16, textAlign: "center", padding: "24px 32px" }}>
        ✓ Order placed! Redirecting to your orders…
      </div>
    </div>
  );

  if (!cart.length) return (
    <div className="container cart-empty">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <h2>Your cart is empty</h2>
      <Link to="/" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>Browse products</Link>
    </div>
  );

  return (
    <div className="container cart-page">
      <h1 className="cart-title">Your cart</h1>
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} className="item-img"/>
              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="qty-ctrl">
                <button onClick={() => updateQty(item.productId, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
              </div>
              <p className="item-subtotal">${(item.price * item.qty).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeItem(item.productId)}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>

          <div className="address-form">
            <h3>Shipping address</h3>
            <input placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={{ marginBottom: 8 }}/>
            <input placeholder="City"   value={address.city}   onChange={e => setAddress({...address, city: e.target.value})}   style={{ marginBottom: 8 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input placeholder="ZIP"     value={address.zip}     onChange={e => setAddress({...address, zip: e.target.value})}/>
              <input placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})}/>
            </div>
          </div>

          <button className="btn-primary checkout-btn" onClick={handleOrder} disabled={placing}>
            {placing ? "Placing order…" : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
