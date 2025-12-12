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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.userName.trim()) {
      return Swal.fire({
        title: "Username Required!",
        text: "Please enter your username.",
        icon: "warning",
      });
    }

    if (!form.password.trim()) {
      return Swal.fire({
        title: "Password Required!",
        text: "Please enter your password.",
        icon: "warning",
      });
    }

    // ==== LOGIN API ====
    const res = await fetch("https://onlineshoppingapplicationbackend.onrender.com/api/products/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    // if (data.success) {
      
    //   window.dispatchEvent(
    //     new CustomEvent("address", {
    //       detail: {
    //         fullName: data.user.fullName,
    //         address: data.user.address,
    //         mobile:data.user.phoneNo,
    //         loginStatus: data.user.loginStatus
    //       },
    //     })
    //   );

    //   window.dispatchEvent(
    //     new CustomEvent("userLoggedIn", { detail: data.user },{detail:data.address})
    //   );

    //   localStorage.setItem("isLoggedIn", "true");

    //   localStorage.setItem(
    //     "userAddress",
    //     JSON.stringify({
    //       fullName: data.user.fullName,
    //       address: data.user.address,
    //       mobile: data.user.phoneNo
    //     })
    //   );
      
      

    //   Swal.fire({
    //     title: "🎉 Login Successful!",
    //     text: "Welcome back!",
    //     icon: "success",
    //     confirmButtonText: "Continue",
    //   }).then(() => navigate(localStorage.getItem("redirectAfterLogin") || "/"));

      
    //   setForm({ userName: "", password: "" });

    //   return;
    // }

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
            loginStatus: data.user.loginStatus
          }
        })
      );
    
      Swal.fire({
        title: "🎉 Login Successful!",
        text: "Welcome back!",
        icon: "success",
        confirmButtonText: "Continue",
      }).then(() => navigate(localStorage.getItem("redirectAfterLogin") || "/cart"));
    
      return;
    }
    
    

    // LOGIN FAILED
    Swal.fire({
      title: "⚠ Login Failed!",
      text: data.message || "Invalid username or password",
      icon: "error",
      confirmButtonText: "Retry",
    });
  }

  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue shopping</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="userName"
              autoComplete="off"
              placeholder="Enter Username / Email"
              value={form.userName}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              autoComplete="off"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
            />

            <button className="login-btn">Login</button>
          </form>

          <p className="register-link">
            New User?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register Now
            </span>
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
