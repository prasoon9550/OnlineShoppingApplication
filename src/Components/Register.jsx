import React, { useState } from "react";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
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

    const res = await fetch("https://onlineshoppingapplicationbackend.onrender.com/api/products/userRegister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
        Swal.fire({
            title: "🎉 Registration Successful!",
            text: "Your account has been created successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/login");
          });
          

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
      Swal.fire({
        title: "⚠ Registration Failed!",
        text: data.message || data.error,
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  }

  return (
    <div className="reg-container">
      <div className="reg-card">
        
        <div className="reg-left">
          <h2>Create Account ✨</h2>
          <p className="subtitle">Start your journey with us!</p>

          <form onSubmit={handleSubmit}>

            <div className="row">
              <input
                type="text"
                name="firstName" autoComplete="off"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
               
              />

              <input
                type="text"
                name="lastName" autoComplete="off"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                
              />
            </div>

            <div className="row">
              <input
                type="number"
                name="phoneNo" autoComplete="off"
                placeholder="Phone Number"
                value={form.phoneNo}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address" autoComplete="off"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            

            <div className="row">
              <input
                type="text"
                name="userName"
                placeholder="Username" autoComplete="off"
                value={form.userName}
                onChange={handleChange}
              />

              <input
                type="password"
                name="password" autoComplete="off"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="address"
              placeholder="Address" autoComplete="off"
              value={form.address}
              onChange={handleChange}
            ></textarea>

            <button className="reg-btn">Register</button>
          </form>

          <p className="login-link">
            Already have an account? <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}>
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
  );
}
