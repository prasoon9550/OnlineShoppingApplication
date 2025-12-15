import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
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

  /* ---------------- FIELD BY FIELD VALIDATION ---------------- */
  function validateForm() {
    if (!form.firstName.trim()) {
      Swal.fire("First Name Required", "Please enter your first name", "warning");
      return false;
    }

    if (!form.lastName.trim()) {
      Swal.fire("Last Name Required", "Please enter your last name", "warning");
      return false;
    }

    if (!form.phoneNo.trim()) {
      Swal.fire("Phone Required", "Please enter phone number", "warning");
      return false;
    }

    if (!/^\d{10}$/.test(form.phoneNo)) {
      Swal.fire(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits",
        "warning"
      );
      return false;
    }

    if (!form.email.trim()) {
      Swal.fire("Email Required", "Please enter your email", "warning");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email", "warning");
      return false;
    }

    if (!form.userName.trim()) {
      Swal.fire("Username Required", "Please enter username", "warning");
      return false;
    }

    if (form.userName.length < 4) {
      Swal.fire(
        "Invalid Username",
        "Username must be at least 4 characters",
        "warning"
      );
      return false;
    }

    if (!form.password.trim()) {
      Swal.fire("Password Required", "Please enter password", "warning");
      return false;
    }

    if (form.password.length < 6) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 6 characters",
        "warning"
      );
      return false;
    }

    if (!form.address.trim()) {
      Swal.fire("Address Required", "Please enter address", "warning");
      return false;
    }

    return true; // ✅ all validations passed
  }

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

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
      setLoading(false);

      if (data.success) {
        Swal.fire({
          title: "🎉 Registration Successful",
          text: "Your account has been created",
          icon: "success",
          confirmButtonText: "Login",
        }).then(() => navigate("/login"));

        setForm({
          firstName: "",
          lastName: "",
          phoneNo: "",
          email: "",
          address: "",
          userName: "",
          password: "",
        });
      } else {
        Swal.fire("Registration Failed", data.message || "Error", "error");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", "Server error. Please try again.", "error");
    }
  }

  return (
    <>
      {/* LOADER */}
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

            <form onSubmit={handleSubmit}>
              <div className="row">
                <input
                  autoComplete="off"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <input
                  autoComplete="off"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <input
                  autoComplete="off"
                  type="text"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={form.phoneNo}
                  onChange={handleChange}
                />
                <input
                  autoComplete="off"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <input
                  autoComplete="off"
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={form.userName}
                  onChange={handleChange}
                />
                <input
                  autoComplete="off"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <textarea
                autoComplete="off"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />

              <button className="reg-btn" disabled={loading}>
                Register
              </button>
            </form>

            <p className="login-link">
              Already have an account?{" "}
              <span
                style={{ color: "blue", cursor: "pointer", fontFamily: "sans-serif" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
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
