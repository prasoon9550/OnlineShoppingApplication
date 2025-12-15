  import React, { useEffect, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import './Cart.css'


  export default function Cart() {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]); // SAVE FOR LATER LIST
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [qtyLoading, setQtyLoading] = useState({});



  useEffect(() => {
  setTimeout(() => {
  loadCart();
  setLoading(false);
  }, 800); // shimmer visible for 0.8s
  }, []);


  const loadCart = () => {
  const stored = JSON.parse(localStorage.getItem("cart")) || [];
  const storedSaved = JSON.parse(localStorage.getItem("saved")) || [];
  setCart(stored);
  setSaved(storedSaved);
  };

  const updateCart = (newCart) => {
  localStorage.setItem("cart", JSON.stringify(newCart));
  setCart(newCart);
  window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateSaved = (newSaved) => {
  localStorage.setItem("saved", JSON.stringify(newSaved));
  setSaved(newSaved);
  };

  const handleIncrease = (id) => {
  setQtyLoading((prev) => ({ ...prev, [id]: true }));

  setTimeout(() => {
  const newCart = cart.map((item) =>
  item._id === id ? { ...item, quantity: item.quantity + 1 } : item
  );
  updateCart(newCart);

  setQtyLoading((prev) => ({ ...prev, [id]: false }));
  }, 300);
  };


  const handleDecrease = (id) => {
  setQtyLoading((prev) => ({ ...prev, [id]: true }));

  setTimeout(() => {
  const existing = cart.find((c) => c._id === id);
  if (existing.quantity === 1) {
  handleDelete(id);
  setQtyLoading((prev) => ({ ...prev, [id]: false }));
  return;
  }

  const newCart = cart.map((item) =>
  item._id === id ? { ...item, quantity: item.quantity - 1 } : item
  );
  updateCart(newCart);

  setQtyLoading((prev) => ({ ...prev, [id]: false }));
  }, 300);
  };


  const handleDelete = (id) => {
  const newCart = cart.filter((item) => item._id !== id);
  updateCart(newCart);
  };

  const handleSaveForLater = (item) => {
  const newCart = cart.filter((c) => c._id !== item._id);
  const newSaved = [...saved, { ...item, savedId: Date.now() }];
  updateCart(newCart);
  updateSaved(newSaved);
  };

  const handleMoveToCart = (item) => {
  const newSaved = saved.filter((s) => s.savedId !== item.savedId);
  const newCart = [...cart, { ...item }];
  updateSaved(newSaved);
  updateCart(newCart);
  };

  const handleDeleteSaved = (savedId) => {
  const newSaved = saved.filter((item) => item.savedId !== savedId);
  updateSaved(newSaved);
  };


  const convertImg = (photo) => {
  try {
  const bytes = new Uint8Array(photo.data.data);
  const base64 = btoa(bytes.reduce((d, b) => d + String.fromCharCode(b), ""));
  return `data:${photo.contentType};base64,${base64}`;
  } catch {
  return "";
  }
  };

  const getSubtotal = () => {
  return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleProceed = () => {
  const loginStatus = window.currentLoginStatus;
  console.log("loginStatus ",loginStatus)

  if (loginStatus == 1) {
  localStorage.setItem("redirectAfterLogin", "/cart");
  navigate("/checkout");
  return;
  }

  navigate("/login");
  };

  const CartShimmer = () => {
  return (
  <>
  {[1, 2].map((i) => (
  <div key={i} className="cart-shimmer">
  <div className="shimmer shimmer-img"></div>

  <div className="shimmer-lines">
  <div className="shimmer shimmer-line" style={{ width: "70%" }}></div>
  <div className="shimmer shimmer-line" style={{ width: "40%" }}></div>
  <div className="shimmer shimmer-line" style={{ width: "60%" }}></div>
  </div>
  </div>
  ))}
  </>
  );
  };




  return (
  <div style={{ padding: "30px" }}>
  <h1 style={{ marginTop: "70px", fontFamily: "sans-serif",fontWeight:"bold",fontSize:"30px" }}>
  Shopping Cart
  </h1>

  {/* EMPTY CART SECTION - FIXED */}
  {loading ? 
  <CartShimmer /> :cart.length === 0 ? (
  <div style={{ textAlign: "center", marginTop: "70px" }}>
  <h1 style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
  Your Nxt Trendz Cart is Empty
  </h1>
  <p style={{ fontFamily: "sans-serif" }}>
  Browse products and add them to your cart
  <Link
  to="/"
  style={{ textDecoration: "none", fontFamily: "sans-serif" }}
  >
  {" "}
  continue shopping
  </Link>
  </p>
  </div>
  ) : (
  <div style={{ display: "flex", gap: "25px" }}>
  {/* LEFT SIDE CART */}
  <div style={{ flex: 3 }}>
  {cart.map((item) => (
  <div
  key={item._id}
  style={{
  display: "flex",
  padding: "20px 0",
  borderBottom: "1px solid #ddd",
  }}
  >
  <img
  src={convertImg(item.photo)}
  alt={item.title}
  style={{
  width: "180px",
  height: "200px",
  objectFit: "contain",
  }}
  />

  <div style={{ marginLeft: "20px", flex: 1 }}>
  <h3
  style={{
  marginBottom: "5px",
  fontSize: "22px",
  fontFamily: "sans-serif",
  }}
  >
  {item.title}
  </h3>

  <p
  style={{
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "10px",
  fontFamily: "sans-serif",
  }}
  >
  ₹{item.price.toLocaleString("en-IN")}
  </p>

  <div
  style={{
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "15px",
  }}
  >
  <button
  onClick={() => handleDelete(item._id)}
  style={{
  padding: "6px 10px",
  borderRadius: "50%",
  border: "1px solid #aaa",
  cursor: "pointer",
  fontSize: "18px",
  }}
  >
  🗑
  </button>

  <div
  style={{
  display: "flex",
  alignItems: "center",
  border: "2px solid #f3c200",
  borderRadius: "30px",
  padding: "0px 12px",
  gap: "12px",
  }}
  >
  <button
  disabled={qtyLoading[item._id]}
  onClick={() => handleDecrease(item._id)}
  style={{
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
  padding: "4px 10px",
  }}
  >
  –
  </button>

  <span style={{ minWidth: "18px", display: "flex", justifyContent: "center" }}>
  {qtyLoading[item._id] ? (
  <div className="qty-loader"></div>
  ) : (
  <span style={{ fontSize: "17px", fontWeight: "bold" }}>
  {item.quantity}
  </span>
  )}
  </span>


  <button
  disabled={qtyLoading[item._id]}
  onClick={() => handleIncrease(item._id)}
  style={{
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
  }}
  >
  +
  </button>
  </div>

  <span
  onClick={() => handleDelete(item._id)}
  style={{
  cursor: "pointer",
  color: "#0066C0",
  fontFamily: "sans-serif",
  fontSize: "14px",
  }}
  >
  Delete
  </span>
  <span style={{ color: "#ccc" }}>|</span>

  <span
  onClick={() => handleSaveForLater(item)}
  style={{
  cursor: "pointer",
  color: "#0066C0",
  fontFamily: "sans-serif",
  fontSize: "14px",
  }}
  >
  Save for later
  </span>
  <span style={{ color: "#ccc" }}>|</span>

  <Link
  to="/"
  style={{
  cursor: "pointer",
  color: "#0066C0",
  fontFamily: "sans-serif",
  fontSize: "14px",
  textDecoration: "none",
  }}
  >
  Back
  </Link>



  </div>
  </div>
  </div>
  ))}
  </div>

  {/* RIGHT SIDE SUMMARY */}
  <div
  style={{
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  height: "fit-content",
  fontFamily: "sans-serif",
  }}
  >
  <h3>
  Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items):{" "}
  <span style={{ fontWeight: "bold" }}>
  ₹{getSubtotal().toLocaleString("en-IN")}
  </span>
  </h3>

  <button
  onClick={handleProceed}
  style={{
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  background: "#ffd814",
  border: "1px solid #f2c200",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  }}
  >
  Proceed to Buy
  </button>
  </div>
  </div>
  )}

  {/* ----------------------------------------------------
  SAVED FOR LATER (ALWAYS SHOWN IF EXISTS)
  ---------------------------------------------------- */}
  {loading ? 
  <CartShimmer /> :saved.length > 0 && (
  <>
  <p
  style={{
  fontFamily: "sans-serif",
  fontSize: "28px",
  fontWeight: "bold",
  padding: "2px",
  marginTop: "40px",
  }}
  >
  Your Items
  </p>

  <div style={{ padding: "0px 30px" }}>
  <h2
  style={{
  fontFamily: "sans-serif",
  fontSize: "18px",
  fontWeight: "bold",
  color: "#0066C0",
  }}
  >
  Saved for later ({saved.length} items)
  </h2>

  <div
  style={{
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  marginTop: "20px",
  }}
  >
  {saved.map((item) => (
  <div
  key={item.savedId}
  style={{
  width: "250px",
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  }}
  >
  <img
  src={convertImg(item.photo)}
  alt={item.title}
  style={{
  width: "160px",
  height: "170px",
  objectFit: "contain",
  }}
  />

  <div style={{ width: "100%", textAlign: "left" }}>
  <h3
  style={{
  marginTop: "10px",
  fontSize: "16px",
  fontFamily: "sans-serif",
  }}
  >
  {item.title}
  </h3>

  <h3
  style={{
  fontSize: "18px",
  fontWeight: "bold",
  marginTop: "5px",
  fontFamily: "sans-serif",
  }}
  >
  ₹{item.price.toLocaleString("en-IN")}
  </h3>
  </div>

  <div style={{ width: "100%", marginTop: "10px" }}>
  <p
  onClick={() => handleMoveToCart(item)}
  style={{
  cursor: "pointer",
  color: "black",
  fontSize: "14px",
  border: "1px solid #333",
  padding: "5px",
  textAlign: "center",
  borderRadius: "50px",
  fontFamily: "sans-serif",
  }}
  >
  Move to cart
  </p>

  <span
  onClick={() => handleDeleteSaved(item.savedId)}
  style={{
  cursor: "pointer",
  color: "#0066C0",
  fontSize: "14px",
  fontFamily: "sans-serif",
  }}
  >
  Delete
  </span>
  </div>
  </div>
  ))}
  </div>
  </div>
  </>
  )}
  </div>
  );
  }
