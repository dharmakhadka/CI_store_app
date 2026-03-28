import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import { Login, Register } from "./pages/Auth";
import "./index.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace/>;
}

function AppRoutes() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/"              element={<Home/>}/>
        <Route path="/products/:id"  element={<ProductDetail/>}/>
        <Route path="/login"         element={<Login/>}/>
        <Route path="/register"      element={<Register/>}/>
        <Route path="/cart"          element={<PrivateRoute><Cart/></PrivateRoute>}/>
        <Route path="/orders"        element={<PrivateRoute><Orders/></PrivateRoute>}/>
        <Route path="*"              element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes/>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
