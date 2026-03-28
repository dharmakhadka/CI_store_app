import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart,    setCart]    = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return setCart([]);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch { setCart([]); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post("/cart/add", { productId, qty });
      setCart(data);
    } finally { setLoading(false); }
  };

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { qty });
      setCart(data);
    } catch {}
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
    } catch {}
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart([]);
    } catch {}
  };

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, loading, total, itemCount, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
