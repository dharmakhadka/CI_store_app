import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./Orders.css";

const STATUS_COLOR = {
  pending:    "#e8c87a",
  processing: "#4a9eff",
  shipped:    "#9b7ef8",
  delivered:  "#4caf7d",
  cancelled:  "#e05c5c",
};

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine")
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"/>;

  return (
    <div className="container orders-page">
      <h1>Your orders</h1>
      {!orders.length ? (
        <p className="empty">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="order-status" style={{ color: STATUS_COLOR[order.status] || "#fff" }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image || "https://via.placeholder.com/48"} alt={item.name}/>
                    <span>{item.name} × {item.qty}</span>
                    <span className="ml-auto">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: <strong>${order.total.toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
