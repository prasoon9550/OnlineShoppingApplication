import React, { useEffect, useState} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  // IMAGE STATES
  const [selectedImg, setSelectedImg] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [lensStyle, setLensStyle] = useState({ display: "none" });

  // RIGHT PANEL CART
  const [sideCart, setSideCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // LOAD PRODUCT
  useEffect(() => {
    fetch(`https://onlineshoppingapplicationbackend.onrender.com/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const img = convertImg(data.data.photo);
          setProduct(data.data);
          setSelectedImg(img);
        }
      });
  }, [id]);

  // IMAGE CONVERTER
  const convertImg = (photo) => {
    if (!photo?.data?.data) return "/noimg.png";
    const bytes = new Uint8Array(photo.data.data);
    const base64 = btoa(bytes.reduce((d, b) => d + String.fromCharCode(b), ""));
    return `data:${photo.contentType};base64,${base64}`;
  };

  // RIGHT CART PANEL LOADER
  const loadCartPanel = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setSideCart(cart);

    let total = 0;
    cart.forEach((c) => (total += c.price * c.quantity));
    setSubtotal(total);
  };

  useEffect(() => {
    loadCartPanel();
    window.addEventListener("cartUpdated", loadCartPanel);

    return () => window.removeEventListener("cartUpdated", loadCartPanel);
  }, []);

  // ADD TO CART
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let exists = cart.find((item) => item._id === product._id);

    if (exists) exists.quantity++;
    else {
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

    Swal.fire({
      title: "Added to Cart!",
      text: `${product.title} added successfully.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // UPDATE QTY
  const updateQty = (id, change) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart
      .map((c) => (c._id === id ? { ...c, quantity: c.quantity + change } : c))
      .filter((c) => c.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // IMAGE ZOOM HANDLERS
  const handleMouseMove = (e) => {
    const container = e.target.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;

    setLensStyle({
      display: "block",
      position: "absolute",
      top: `${(e.clientY - container.top) - 60}px`,
      left: `${(e.clientX - container.left) - 60}px`,
      width: "120px",
      height: "120px",
      border: "1px solid #ccc",
      background: "rgba(255,255,255,0.3)",
      pointerEvents: "none",
      borderRadius: "4px",
    });

    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setLensStyle({ display: "none" });
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

  if (!product) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div style={{ display: "flex", padding: "30px", gap: "30px", marginTop: "110px" }}>
      {/* LEFT SIDE THUMBNAILS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
        {[1, 2, 3, 4].map((n) => (
          <img
            key={n}
            src={selectedImg}
            onClick={() => setSelectedImg(selectedImg)}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              border: "1px solid #ddd",
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* MAIN IMAGE WITH ZOOM */}
      <div
        style={{ width: "40%", position: "relative" }}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImg}
          style={{
            width: "100%",
            height: "420px",
            objectFit: "contain",
            border: "1px solid #ddd",
            padding: "10px",
            cursor: "zoom-in",
            background: "#fff",
          }}
        />
        <div style={lensStyle}></div>

        {showZoom && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "105%",
              width: "420px",
              height: "420px",
              border: "1px solid #ddd",
              backgroundImage: `url(${selectedImg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "250%",
              ...zoomStyle,
              borderRadius: "10px",
            }}
          />
        )}
      </div>

      {/* PRODUCT INFO */}
      <div style={{ width: "40%" }}>
        <h2 style={{ fontFamily: "sans-serif", fontSize: "22px" }}>{product.title}</h2>

        <p style={{ fontSize: "18px", marginTop: "10px" }}>
          ⭐⭐⭐⭐⭐ <span style={{ color: "gray" }}>(100+ ratings)</span>
        </p>

        <h1 style={{ color: "#B12704", marginTop: "20px",fontFamily: "sans-serif" }}>
          ₹{product.price.toLocaleString("en-IN")}
        </h1>

        <p style={{ marginTop: "15px", fontSize: "22px",fontFamily: "sans-serif" }}>Inclusive of all taxes</p>

        <h3 style={{ marginTop: "20px", fontSize: "20px",fontFamily: "sans-serif" }}>About this item</h3>
        <ul>
          <li style={{fontFamily: "sans-serif"}}>High performance product</li>
          <li style={{fontFamily: "sans-serif"}}>Premium quality design</li>
          <li style={{fontFamily: "sans-serif"}}>1 year manufacturer warranty</li>
        </ul>
      </div>

      {/* ADD TO CART / BUY BOX (UNCHANGED) */}
      <div
        style={{
          width: "22%",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          height: "fit-content",
          marginRight:"180px"
        }}
      >
        <h2 style={{ color: "#B12704", fontFamily: "sans-serif", fontSize: "24px" }}>
          ₹{product.price.toLocaleString("en-IN")}
        </h2>

        <button
          onClick={handleAddToCart}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            background: "#ffd814",
            border: "1px solid #f2c200",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontFamily:"sans-serif"
          }}
        >
          Add to Cart
        </button>

        <button onClick={handleProceed}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            background: "#ffa41c",
            border: "1px solid #f08804",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontFamily:"sans-serif"
          }}
        >
          Buy Now
        </button>
      </div>

      {/* RIGHT SIDE CART PANEL */}
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
          <h3 style={{fontWeight: "500",fontFamily:"sans-serif",fontSize:"14px",textAlign:"center",marginBottom:"0px" }}>Subtotal</h3>

          <p style={{ color: "#cc0c39", fontSize: "14px", fontFamily:"sans-serif",fontWeight: "bold",textAlign:"center",marginBottom:"0px"}}>
            ₹{subtotal.toLocaleString("en-IN")}
          </p>

          <p style={{fontFamily:"sans-serif",fontSize:"14px",color:"green",textAlign:"center"}}>
            Your order qualifies for FREE delivery
          </p>

          <Link to="/Cart">
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

          {sideCart.map((item) => (
            <div
              key={item._id}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
              }}
            >
              <img
                src={convertImg(item.photo)}
                style={{ width: "100%", height: "120px", objectFit: "contain",marginBottom: "10px", }}
              />

              <p style={{fontWeight: "bold", textAlign:"center",fontFamily:"sans-serif",fontSize:"14px"}}>
                ₹{item.price.toLocaleString("en-IN")}
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
                  onClick={() => updateQty(item._id, -1)}
                  style={{ padding: "4px 10px",
                  borderRadius: "30px",
                  fontSize: "16px",
                  border:"none",
                  background:"none" }}
                >
                  –
                </button>

                <span style={{ fontWeight: "bold" }}>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, +1)}
                  style={{padding: "4px 10px",
                  borderRadius: "30px",
                  fontSize: "16px",
                  border:"none",
                  background:"none"}}
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
