import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const CATEGORIES = ["All", "Electronics", "Sports", "Kitchen", "Accessories", "Home"];

export default function Home() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [q,         setQ]         = useState("");
  const [category,  setCategory]  = useState("All");
  const [page,      setPage]      = useState(1);
  const [pages,     setPages]     = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (q)                params.q = q;
      if (category !== "All") params.category = category;
      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setPages(data.pages);
    } catch { setProducts([]); }
    finally  { setLoading(false); }
  }, [q, category, page]);

  useEffect(() => { setPage(1); }, [q, category]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <p className="hero-eyebrow">Curated collection</p>
          <h1 className="hero-title">Discover premium<br/>everyday essentials</h1>
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ background: "transparent", border: "none", flex: 1 }}
            />
          </div>
        </div>
      </div>

      <div className="container shop-body">
        {/* Category filter */}
        <div className="category-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? "cat-btn--active" : ""}`}
              onClick={() => setCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner"/>
        ) : products.length === 0 ? (
          <p className="empty">No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn ${page === n ? "page-btn--active" : ""}`}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
