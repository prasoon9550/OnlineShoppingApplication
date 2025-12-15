import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // ⭐ loader state
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    address: "",
    userName: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // ⭐ show loader

    try {
      const res = await fetch(
        "https://onlineshoppingapplicationbackend.onrender.com/api/products/userRegister",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      setLoading(false); // ⭐ hide loader

      if (data.success) {
        Swal.fire({
          title: "🎉 Registration Successful!",
          text: "Your account has been created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate("/login"));

        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          phoneNo: "",
          email: "",
          address: "",
          userName: "",
          password: "",
        });
      } else {
        Swal.fire("⚠ Registration Failed", data.message || data.error, "error");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", "Something went wrong. Try again!", "error");
    }
  }

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="multi-spinner"></div>
          <p>Creating your account...</p>
        </div>
      )}

      <div className="reg-container">
        <div className="reg-card">
          <div className="reg-left">
            <h2>Create Account ✨</h2>
            <p className="subtitle">Start your journey with us!</p>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <input
                autoComplete="off"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                autoComplete="off"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <input
                autoComplete="off"
                  type="number"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={form.phoneNo}
                  onChange={handleChange}
                  required
                />
                <input
                autoComplete="off"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <input
                  type="text"
                  autoComplete="off"
                  name="userName"
                  placeholder="Username"
                  value={form.userName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  autoComplete="off"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
              autoComplete="off"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
              />

              <button className="reg-btn" disabled={loading}>
                Register
              </button>
            </form>

            <p className="login-link">
              Already have an account?{" "}
              <span style={{ color: "blue", cursor: "pointer",fontFamily:"sans-serif" }}onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>

          <div className="reg-right">
            <h3>Welcome to Nxt Trendz</h3>
            <p>Shop smarter, faster and better!</p>
          </div>
        </div>
      </div>
    </>
  );
}
