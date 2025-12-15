  import React, { useEffect, useState } from "react";
  import { useParams, Link } from "react-router-dom";
  import './Products.css'

  export default function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [cartUI, setCartUI] = useState({});
  const [sideCart, setSideCart] = useState([]); 
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);



  // LOAD PRODUCTS
  useEffect(() => {
    setLoading(true);
    setProducts([]); 
  
    fetch(`https://onlineshoppingapplicationbackend.onrender.com/products/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);
  
  

  // LOAD RIGHT PANEL CART
  const loadCartPanel = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  setSideCart(cart);

  let total = 0;
  cart.forEach((c) => (total += c.price * c.quantity));
  setSubtotal(total);
  };


  const addToGlobalCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exist = cart.find((c) => c._id === product._id);

  if (exist) {
  exist.quantity++;
  } else {
  cart.push({
  _id: product._id,
  title: product.title,
  price: product.price,
  photo: product.photo,
  quantity: 1,
  });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  loadCartPanel();
  };

  const ShimmerLoader = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <div
          className="shimmer"
          style={{
            width: "208px",
            height: "210px",
            borderRadius: "8px",
          }}
        />
  
        <div style={{ flex: 1 }}>
          <div className="shimmer" style={{ width: "60%", height: "20px", marginBottom: "10px" }} />
          <div className="shimmer" style={{ width: "40%", height: "26px", marginBottom: "10px" }} />
          <div className="shimmer" style={{ width: "30%", height: "14px", marginBottom: "10px" }} />
          <div className="shimmer" style={{ width: "90%", height: "14px" }} />
        </div>
      </div>
    ));
  };

  const CartShimmer = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "15px",
         
          
        }}
      >
        <div
          className="shimmer"
          style={{
            width: "100%",
            height: "15px",
            marginBottom: "10px",
            
            
            
          }}
        />
  
        <div
          className="shimmer"
          style={{
            width: "60%",
            height: "10px",
            margin: "0 auto 10px",
            
          }}
        />
  
        <div
          className="shimmer"
          style={{
            width: "30%",
            height: "20px",
            margin: "0 auto",
            borderRadius: "30px",
           
          }}
        />
      </div>
    ));
  };
  
  

  // UPDATE CART QTY
  const updateGlobalCartQty = (id, change) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart
  .map((c) => (c._id === id ? { ...c, quantity: c.quantity + change } : c))
  .filter((c) => c.quantity > 0);

  setCartLoading(true);

localStorage.setItem("cart", JSON.stringify(cart));
window.dispatchEvent(new Event("cartUpdated"));

setTimeout(() => {
  loadCartPanel();
  setCartLoading(false);
}, 1000); // shimmer duration
  }

  // IMAGE CONVERTER
  const convertImg = (photo) => {
  if (!photo?.data?.data) return "";
  const bytes = new Uint8Array(photo.data.data);
  const base64 = btoa(bytes.reduce((d, b) => d + String.fromCharCode(b), ""));
  return `data:${photo.contentType};base64,${base64}`;
  };

  const handleAddToCart = (product) => {
  setCartUI((prev) => ({ ...prev, [product._id]: 1 }));
  addToGlobalCart(product);
  };

  const increaseQty = (product) => {
  setCartUI((prev) => ({ ...prev, [product._id]: prev[product._id] + 1 }));
  updateGlobalCartQty(product._id, +1);
  };

  const decreaseQty = (product) => {
  const current = cartUI[product._id];

  if (current === 1) {
  const updated = { ...cartUI };
  delete updated[product._id];
  setCartUI(updated);
  updateGlobalCartQty(product._id, -1);
  return;
  }

  setCartUI((prev) => ({ ...prev, [product._id]: prev[product._id] - 1 }));
  updateGlobalCartQty(product._id, -1);
  };

  useEffect(() => {
  loadCartPanel();
  }, []);

  return (
  <div style={{ padding: "20px", display: "flex" }}>

  {/* LEFT PRODUCTS LIST */}
  <div style={{ width: "88%" }}>
  <h2 style={{ marginBottom: "20px" }}>{category.toUpperCase()}</h2>

  <h2
  style={{
  fontFamily: "sans-serif",
  fontSize: "22px",
  fontWeight: "bold",
  marginTop: "70px",
  marginBottom:"0px"
  }}
  >
  Results
  </h2>
  <p style={{
  fontFamily: "sans-serif",
  fontSize: "14px",
  fontWeight: "bold",
  marginTop: "0px",
  color:"#878787"
  }}>Check each product page for other buying options.</p>

  {loading ? <ShimmerLoader /> : products.map((p) => {
  const qty = cartUI[p._id] || 0;

  return (
  <div
  key={p._id}
  style={{
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  marginTop: "20px",
  }}
  >
  <Link to={`/product/${p._id}`} style={{ textDecoration: "none" }}>
  <img
  src={convertImg(p.photo)}
  alt={p.title}
  style={{
  width: "208px",
  height: "210px",
  objectFit: "contain",
  cursor: "pointer",
  }}
  />
  </Link>

  <div style={{ flex: 1 }}>
  <Link
  to={`/product/${p._id}`}
  style={{ textDecoration: "none", color: "black" }}
  >
  <h3
  style={{
  fontFamily: "sans-serif",
  fontSize: "18px",
  marginBottom: "6px",
  marginTop: "18px",
  }}
  >
  {p.title}
  </h3>
  </Link>

  <p
  style={{
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "6px",
  color:"green",
  fontFamily:"sans-serif"
  }}
  >
  ₹ {p.price.toLocaleString("en-IN")}
  </p>

  <p
  style={{
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
  fontFamily:"sans-serif",
  color:"#333"
  }}
  >
  {p.rating} ⭐
  </p>

  <p
  style={{
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "0px",
  fontFamily:"sans-serif",
  color:"#878787"
  }}
  >
  {p.description}
  </p>

  {qty === 0 ? (
  <button
  style={{
  marginTop: "10px",
  padding: "10px 14px",
  background: "#ffd814",
  border: "1px solid #f2c200",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  }}
  onClick={() => handleAddToCart(p)}
  >
  Add to cart
  </button>
  ) : (
  <div
  style={{
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginTop: "10px",
  border: "2px solid #f3c200",
  width:"114px",
  padding:"0px 5px",
  borderRadius:"30px"
  }}
  >
  <button
  style={{
  padding: "5px 12px",
  borderRadius: "50%",
  border: "none",
  fontSize: "18px",
  background:"none"
  }}
  onClick={() => decreaseQty(p)}
  >
  –
  </button>

  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
  {qty}
  </span>

  <button
  style={{
  padding: "5px 12px",
  borderRadius: "50%",
  border: "none",
  fontSize: "18px",
  background:"none"
  }}
  onClick={() => increaseQty(p)}
  >
  +
  </button>
  </div>

  )}

  </div>

  </div>

  );
  })}
  </div>

  {/* RIGHT SIDE CART PANEL (UPDATED VERTICAL LAYOUT) */}
  {sideCart.length > 0 && (
  <div
  style={{
  width: "12%",
  position: "fixed",
  right: 0,
  top: 80,
  height: "89vh",
  background: "#fff",
  borderLeft: "1px solid #ddd",
  padding: "15px",
  overflowY: "auto",
  }}
  >
  <h3 style={{ fontWeight: "500",fontFamily:"sans-serif",fontSize:"14px",textAlign:"center",marginBottom:"0px" }}>Subtotal</h3>

  <p style={{ color: "#cc0c39", fontSize: "14px", fontFamily:"sans-serif",fontWeight: "bold",textAlign:"center",marginBottom:"0px"}}>
  ₹{subtotal.toLocaleString("en-IN")}
  </p>

  <p style={{fontFamily:"sans-serif",fontSize:"14px",color:"green",textAlign:"center"}}>Your order qualifies for FREE delivery</p>

  <Link to = "/Cart">
  <button
  style={{
  background: "none",
  padding: "1px",
  border: "1px solid black",
  width: "100%",
  borderRadius: "50px",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign:"center",

  }}
  >
  Go to Cart
  </button>
  </Link>
  
  {cartLoading ? 
  <CartShimmer /> : sideCart.map((item) => (
  <div
  key={item._id}
  style={{
  display: "block",
  marginBottom: "20px",
  borderBottom: "1px solid #ccc",
  paddingBottom: "15px",
  }}
  >
  <img
  src={convertImg(item.photo)}
  alt=""
  style={{
  width: "100%",
  height: "120px",
  objectFit: "contain",
  marginBottom: "10px",
  }}
  />

  <p style={{ fontWeight: "bold", marginBottom: "10px",textAlign:"center",fontFamily:"sans-serif",fontSize:"14px"}}>
  ₹{item.price.toLocaleString(("en-IN"))}
  </p>

  <div
  style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  borderRadius:"50px",
  padding:"1px",
  border:"2px solid #f2c200",
  marginLeft:"10px"
  }}
  >
  <button
  onClick={() => updateGlobalCartQty(item._id, -1)}
  style={{
  padding: "4px 10px",
  borderRadius: "30px",
  fontSize: "16px",
  border:"none",
  background:"none"
  }}
  >
  –
  </button>

  <span style={{ fontWeight: "bold",color:"black" }}>{item.quantity}</span>

  <button
  onClick={() => updateGlobalCartQty(item._id, +1)}
  style={{
  padding: "4px 10px",
  borderRadius: "30px",
  fontSize: "16px",
  border:"none",
  background:"none"

  }}
  >
  +
  </button>
  </div>
  </div>
  ))}
  </div>
  )}
  </div>
  );
  }
