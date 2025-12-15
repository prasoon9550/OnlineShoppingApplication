import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.userName.trim()) {
      return Swal.fire("Username Required!", "Please enter your username.", "warning");
    }

    if (!form.password.trim()) {
      return Swal.fire("Password Required!", "Please enter your password.", "warning");
    }

    try {
      setLoading(true); // ⭐ show overlay spinner

      const res = await fetch(
        "https://onlineshoppingapplicationbackend.onrender.com/api/products/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userName", data.user.userName);

        window.currentLoginStatus = data.user.loginStatus;
        window.currentUserName = data.user.userName;

        window.dispatchEvent(
          new CustomEvent("userLoggedIn", {
            detail: {
              userName: data.user.userName,
              fullName: data.user.fullName,
              address: data.user.address,
              mobile: data.user.phoneNo,
              loginStatus: data.user.loginStatus,
            },
          })
        );

        Swal.fire("🎉 Login Successful!", "Welcome back!", "success").then(() =>
          navigate(localStorage.getItem("redirectAfterLogin") || "/cart")
        );
        return;
      }

      Swal.fire("⚠ Login Failed!", data.message || "Invalid credentials", "error");
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="login-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="login-card">
        <div className="login-left">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue shopping</p>

          <form onSubmit={handleSubmit}>
            <input
            autoComplete="off"
              type="text"
              name="userName"
              placeholder="Enter Username / Email"
              value={form.userName}
              onChange={handleChange}
            />

            <input
            autoComplete="off"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
            />

            <button className="login-btn" disabled={loading}>
              Login
            </button>
          </form>

          <p className="register-link">
            New User?{" "}
            <span style={{ color: "blue", cursor: "pointer",fontFamily:"sans-serif" }}onClick={() => navigate("/register")}>Register Now</span>
          </p>
        </div>

        <div className="login-right">
          <h3>Hello Again!</h3>
          <p>We’re happy to see you back 🤗</p>
        </div>
      </div>
    </div>
  );
}
