import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function AuthForm({ mode }) {
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      if (mode === "login") await login(form.email, form.password);
      else                  await register(form.name, form.email, form.password);
      navigate("/");
    } catch {}
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">✦ ShopApp</div>
        <h1 className="auth-title">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="auth-sub">{mode === "login" ? "Sign in to your account" : "Start shopping today"}</p>

        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <div className="field">
              <label>Full name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Jane Doe" required/>
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required/>
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••" minLength={6} required/>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "13px", marginTop: 8 }} disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? <>Don't have an account? <Link to="/register">Register</Link></>
            : <>Already have an account? <Link to="/login">Sign in</Link></>}
        </p>
      </div>
    </div>
  );
}

export function Login()    { return <AuthForm mode="login"/>; }
export function Register() { return <AuthForm mode="register"/>; }
