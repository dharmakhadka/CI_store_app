import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount }    = useCart();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">✦</span> ShopApp
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Shop</Link>
          {user?.role === "admin" && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/cart" className="nav-cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {itemCount > 0 && <span className="badge">{itemCount}</span>}
              </Link>
              <div className="nav-user" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                {menuOpen && (
                  <div className="dropdown">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <hr className="dropdown-divider"/>
                    <button onClick={handleLogout} className="dropdown-item">Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost" style={{ padding: "8px 18px" }}>Sign in</Link>
              <Link to="/register" className="btn-primary" style={{ padding: "8px 18px" }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
