  import React, { useEffect, useState } from "react";
  import "./Header.css";
  import { Link, useNavigate } from "react-router-dom";

  export default function Header() {
  const [fullName, setFullName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  function handleLogin(e) {
  setFullName(e.detail.fullName);
  }

  function handleLogout() {
  setFullName("");  // remove name when logging out
  }

  // Add listeners
  window.addEventListener("userLoggedIn", handleLogin);
  window.addEventListener("userLoggedOut", handleLogout);

  // Cart count calculation
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  setCartCount(count);

  const handleCartUpdate = () => {
  const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCount = updatedCart.reduce(
  (sum, item) => sum + item.quantity,
  0
  );
  setCartCount(updatedCount);
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
  window.removeEventListener("userLoggedIn", handleLogin);
  window.removeEventListener("userLoggedOut", handleLogout);
  window.removeEventListener("cartUpdated", handleCartUpdate);
  };
  }, []);



  useEffect(() => {
  function handleUserLogin(e) {
  const { loginStatus } = e.detail;
  window.currentLoginStatus = loginStatus;   // <-- Store globally (NOT localStorage)
  }

  window.addEventListener("userLoggedIn", handleUserLogin);

  return () => {
  window.removeEventListener("userLoggedIn", handleUserLogin);
  };
  }, []);

  async function logoutHandler() {

  const userName = window.currentUserName; 

  const res = await fetch("http://localhost:8080/api/products/logout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userName })
  });

  const data = await res.json();

  if (data.success) {
  // Mark user as logged out (memory only)
  window.currentLoginStatus = 0;
  window.currentUserName = null;

  window.dispatchEvent(new CustomEvent("userLoggedOut"));

  // Show message
  Swal.fire({
  title: "Logged Out!",
  text: "You have been logged out successfully.",
  icon: "success"
  });

  // localStorage.removeItem("fullName");
  // setFullName("");
  navigate("/");
  }
  }



  return (
  <>
  <div className="fix-header">
  <div>
  <img
  className="blog-img"
  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
  alt=""
  />
  </div>

  <ul className="nav-bar">
  <li>
  <Link to="/" className="header-list">
  <img
  className="home-img"
  src="https://cdn-icons-png.flaticon.com/128/18194/18194584.png"
  />
  Home
  </Link>
  </li>

  <li>
  <Link to="/cart" className="header-list">
  <img
  className="cart-img"
  src="https://cdn-icons-png.flaticon.com/128/8448/8448226.png"
  />
  Cart({cartCount})
  </Link>
  </li>

  <li>
  <Link to="/checkout" className="header-list">
  <img
  className="check-img"
  src="https://cdn-icons-png.flaticon.com/128/6467/6467105.png"
  />
  Checkout
  </Link>
  </li>

  {fullName ? (
  <>
  <li
  className="header-list"
  style={{ marginTop: "0px", fontSize: "18px" }}
  >
  <img
  className="login-img"
  src="https://cdn-icons-png.flaticon.com/128/3870/3870822.png"
  />
  <span style={{ marginLeft: "8px" }}>Hello {fullName}</span>
  </li>

  <li>
  <Link to="/myaccount" className="header-list">
  <img
  className="login-img"
  src="https://cdn-icons-png.flaticon.com/128/3870/3870822.png"
  />
  My Profile
  </Link>
  </li>

  <li onClick={logoutHandler}>
  <Link to="/" className="header-list">
  <img
  className="login-img"
  src="https://cdn-icons-png.flaticon.com/128/3870/3870822.png"
  />
  Logout
  </Link>
  </li>
  </>
  ) : (
  <>
  <li>
  <Link to="/login" className="header-list">
  <img
  className="login-img"
  src="https://cdn-icons-png.flaticon.com/128/3870/3870822.png"
  />
  Login
  </Link>
  </li>

  <li>
  <Link to="/register" className="header-list">
  <img
  className="sign-img"
  src="https://cdn-icons-png.flaticon.com/128/16470/16470225.png"
  />
  Register
  </Link>
  </li>
  </>
  )}
  </ul>
  </div>
  </>
  );
  }
