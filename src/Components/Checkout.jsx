    import React, { useEffect, useState } from "react";
    import "./Checkout.css";
    import Swal from "sweetalert2";
    import { useNavigate } from "react-router-dom"; // ensure navigate is available above component


    export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [paymentTab, setPaymentTab] = useState("card");
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [upiId, setUpiId] = useState("");
    const [emiPlan, setEmiPlan] = useState("");
    const [mobile, setMobile] = useState("");

    const navigate = useNavigate();

    // CARD INPUT STATES
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCVV, setCardCVV] = useState("");

    // CARD TYPE DETECTION
    const getCardType = (num) => {
    if (/^4/.test(num)) return "Visa";
    if (/^5[1-5]/.test(num)) return "Mastercard";
    if (/^6/.test(num)) return "RuPay";
    return "Unknown";
    };

    useEffect(() => {
    function handleUserLogin(e) {
    setUserName(e.detail.userName);
    setFullName(e.detail.fullName);
    setUserAddress(e.detail.address);
    setMobile(e.detail.mobile);
    }

    window.addEventListener("userLoggedIn", handleUserLogin);

    return () => window.removeEventListener("userLoggedIn", handleUserLogin);
    }, []);

    useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
    }, []);



    const cardType = getCardType(cardNumber.replace(/\s/g, ""));

    // ONLY change card color if all fields filled
    const isCardComplete =
    cardNumber.length === 19 &&
    cardName.length > 2 &&
    cardExpiry.length === 5 &&
    cardCVV.length === 3;

    const cardBackground = isCardComplete ? "#00507c" : "#ccc";

    useEffect(() => {
    function handleAddress(e) {
    setFullName(e.detail.fullName);
    setUserAddress(e.detail.address);
    setMobile(e.detail.mobile);
    }

    window.addEventListener("address", handleAddress);
    return () => window.removeEventListener("userLoggedIn", handleAddress);
    }, []);

    useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userAddress"));
    if (stored) {
    setFullName(stored.fullName);
    setUserAddress(stored.address);
    setMobile(stored.mobile);
    }
    }, []);

    const addresses = [
    {
    name: fullName,
    address: userAddress,
    mobile: mobile,
    },
    ];

    const savedCards = [
    { brand: "Card Holder Name", last4: "0817", expires: "", type: "", cvv: "" },
    ];

    useEffect(() => {
    try {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
    } catch {
    setCart([]);
    }
    }, []);

    const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    };

    const incrementQty = (id) => {
    const updated = cart.map((i) =>
    i._id === id ? { ...i, quantity: Number(i.quantity) + 1 } : i
    );
    saveCart(updated);
    };

    const decrementQty = (id) => {
    const updated = cart.map((i) =>
    i._id === id
    ? { ...i, quantity: Math.max(1, Number(i.quantity) - 1) }
    : i
    );
    saveCart(updated);
    };

    const removeItem = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    saveCart(updated);
    };

    const getTotal = () =>
    cart.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
    );

    async function placeOrder() {
    try {
    const cartItems = cart.length ? cart : JSON.parse(localStorage.getItem("cart")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const currentUser = window.currentUserName || storedUser.userName || localStorage.getItem("userName") || "";

    const cardNumberInput = document.getElementById("cardNumber");
    const cardNumber = cardNumberInput.value;

    const cardNameInput = document.getElementById("cardName");
    const cardName = cardNameInput.value;

    const cardMonthYearInput = document.getElementById("cardMonthYear");
    const cardMonthYear = cardMonthYearInput.value;

    const cardCvvInput = document.getElementById("cardCvv");
    const cardCvv = cardCvvInput.value;



    if (!currentUser) {
    Swal.fire("Not logged in", "Please login to place an order.", "warning");
    navigate("/login");
    return;
    }

    if (paymentTab === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        Swal.fire("Invalid Card", "Please enter a valid 16-digit card number.", "error");
        cardNumberInput.style.border = "1px solid red";
        return;
      } else {
        cardNumberInput.style.border = "1px solid #dfe9f6";
      }
      

      if (!cardName || cardName.trim().length < 3) {
        Swal.fire("Invalid Name", "Please enter name on the card.", "error");
        cardNameInput.style.border="1px solid red";
        return;
      }
      else {
        cardNameInput.style.border = "1px solid #dfe9f6";
      }

      if (!cardExpiry || cardExpiry.length !== 5 || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        Swal.fire("Invalid Expiry", "Please enter expiry date in MM/YY format.", "error");
        cardMonthYearInput.style.border="1px solid red"
        return;
      }
      else {
        cardMonthYearInput.style.border = "1px solid #dfe9f6";
      }

      if (!cardCVV || cardCVV.length !== 3) {
        Swal.fire("Invalid CVV", "Please enter a valid 3-digit CVV.", "error");
        cardCvvInput.style.border="1px solid red"
        return;
      }
      else {
        cardCvvInput.style.border = "1px solid #dfe9f6";
      }
    }

    if (!fullName || !mobile || !userAddress) {
    Swal.fire("Missing address", "Please provide delivery address details.", "warning");
    return;
    }

    if (cartItems.length === 0) {
    Swal.fire("Cart Empty", "There are no items in your cart.", "error");
    return;
    }
    const getItemImage = (item) => {
    if (item.image && typeof item.image === "string" && item.image.trim()) return item.image;
    if (item.photoUrl && typeof item.photoUrl === "string" && item.photoUrl.trim()) return item.photoUrl;
    try {
    return renderImageSrc(item);
    } catch {
    return ""; 
    }
    };

    const items = cartItems.map((it, idx) => {
    const productId = it._id || it.productId || it.id || "";
    const name = it.title || it.name || it.productName || `Product ${idx + 1}`;
    const price = Number(it.price || it.amount || 0);
    const quantity = Number(it.quantity || it.qty || 1);
    const image = getItemImage(it);

    return { productId, name, price, quantity, image };
    });
    for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.productId || !it.name || !it.price || !it.quantity || !it.image) {
    Swal.fire("Invalid cart item", `Invalid cart item at index ${i}. Required: productId, name, price, quantity, image`, "error");
    return;
    }
    }
    const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const addressObj = typeof userAddress === "string"
    ? { fullName, phoneNo: mobile, houseNo: "", street: userAddress, city: "", state: "", pincode: "" }
    : {
    fullName: userAddress.fullName || fullName,
    phoneNo: userAddress.phoneNo || mobile,
    houseNo: userAddress.houseNo || "",
    street: userAddress.street || "",
    city: userAddress.city || "",
    state: userAddress.state || "",
    pincode: userAddress.pincode || ""
    };

    const payload = {
    userName: currentUser,
    address: addressObj,
    items,
    totalAmount
    };

    console.log("PlaceOrder payload ->", payload);

    const res = await fetch("http://localhost:8080/api/products/placeOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("PlaceOrder response ->", data);

    if (data.success) {

    // SAVE ENTIRE ORDER PAYLOAD FOR ORDERPLACED PAGE
    const clientOrder = {
    userName: currentUser,
    address: addressObj,
    items: items,
    totalAmount: totalAmount,
    placedAt: new Date().toISOString()
    };

    localStorage.setItem("clientPlacedOrder", JSON.stringify(clientOrder));

    Swal.fire("Success", "Order placed successfully!", "success");

    localStorage.removeItem("cart");
    setCart([]);

    navigate("/orderplaced");
    }

    } catch (err) {
    console.error("placeOrder error:", err);
    Swal.fire("Error", "Server error while placing order", "error");
    }
    }




    const renderImageSrc = (item) => {
    try {
    if (item.photo && item.photo.contentType && item.photo.data) {
    const arr = item.photo.data.data || item.photo.data;
    let binary = "";
    const u8 = typeof arr === "string" ? null : new Uint8Array(arr);
    if (u8) {
    for (let i = 0; i < u8.length; i++)
    binary += String.fromCharCode(u8[i]);
    return `data:${item.photo.contentType};base64,${btoa(binary)}`;
    }
    }
    } catch (e) {}

    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' 
    width='360' height='360'>
    <rect width='100%' height='100%' fill='%23eef6ff'/>
    <text x='50%' y='50%' text-anchor='middle' 
    dominant-baseline='middle' fill='%2366a6ff' font-size='18'>
    Product</text></svg>`;
    };

    // RANDOM CARD TYPE IF NONE DETECTED
    const randomType = ["Visa", "Mastercard", "RuPay"][
    Math.floor(Math.random() * 3)
    ];

    const finalCardType = cardType === "Unknown" ? randomType : cardType;


    return (
    <div className="checkout-page fs">
    <div className="checkout-inner wide">
    <div className="checkout-left">
    <h2 className="headline">Checkout</h2>

    <div className="timeline">
    {/* ADDRESS */}
    <div className="timeline-row">
    <div className="timeline-icon green">📍</div>
    <div className="timeline-content card">
    <div className="step-title">Delivery address</div>

    <div className="address-list">
    {addresses.map((a, idx) => (
    <div
    key={idx}
    className={`address-tile ${
    selectedAddressIndex === idx ? "active" : ""
    }`}
    onClick={() => setSelectedAddressIndex(idx)}
    >
    <div className="address-top">
    <div className="addr-name">{a.name}</div>
    <div className="edit">✎ Edit</div>
    </div>
    <div className="addr-line">{a.address}</div>
    <div className="addr-mobile">
    Mobile No : {a.mobile}
    </div>
    </div>
    ))}
    <div className="address-tile add">+ Add Address</div>
    </div>
    </div>
    </div>

    {/* ORDER SUMMARY */}
    <div className="timeline-row">
    <div className="timeline-icon teal">🧾</div>
    <div className="timeline-content card">
    <div className="step-title">Order Summary</div>

    {cart.length === 0 && (
    <p style={{ marginTop: "20px", fontSize: "18px"}}>
    Cart is empty
    </p>
    )}

    {cart.map((item) => (
    <div key={item._id} className="order-item big">
    <img
    src={renderImageSrc(item)}
    alt={item.title}
    className="order-img big"
    />
    <div className="order-meta">
    <div className="order-title">{item.title}</div>

    <div className="price-row">
    <div className="price">
    ₹{Number(item.price).toLocaleString()}
    </div>
    </div>

    {/* QTY */}
    <div className="qty-controls">
    <button
    className="qty-btn"
    onClick={() => decrementQty(item._id)}
    >
    -
    </button>

    <div className="qty-count">{item.quantity}</div>

    <button
    className="qty-btn"
    onClick={() => incrementQty(item._id)}
    >
    +
    </button>

    <button
    className="remove"
    onClick={() => removeItem(item._id)}
    >
    REMOVE
    </button>
    </div>
    </div>
    </div>
    ))}
    </div>
    </div>

    {/* PAYMENT SECTION */}
    <div className="timeline-row">
    <div className="timeline-icon gray">💳</div>
    <div className="timeline-content card">
    <div className="step-title">Payment Method</div>

    <div className="payment-tabs">
    {[
    { key: "card", label: "Credit / Debit card" },
    { key: "cod", label: "Cash on Delivery" },
    { key: "upi", label: "UPI" },
    { key: "emi", label: "EMI" },
    ].map((t) => (
    <button
    key={t.key}
    className={`pay-tab ${
    paymentTab === t.key ? "active" : ""
    }`}
    onClick={() => setPaymentTab(t.key)}
    type="button"
    >
    {t.label}
    </button>
    ))}
    </div>

    <div className="payment-panel">
    {/* CARD */}
    {paymentTab === "card" && (
    <>
    {/* CARD PREVIEW + ADD NEW CARD IN ROW */}
    <div
    style={{
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    alignItems: "center",
    }}
    >

    {/* LIVE CARD PREVIEW */}
    <div
    className="live-card"
    style={{
    width: "350px",
    height: "200px",
    borderRadius: "15px",
    padding: "20px",
    background: cardBackground,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    }}
    >
    <div
    className="card-row"
    style={{ display: "flex", justifyContent: "space-between" }}
    >
    <div className="chip">💳</div>
    <div className="type" style={{ fontWeight: "bold" }}>
    {finalCardType}
    </div>
    </div>

    <div
    className="card-number"
    style={{ fontSize: "20px", letterSpacing: "3px" }}
    >
    {cardNumber || "XXXX XXXX XXXX XXXX"}
    </div>

    <div
    className="bottom-row"
    style={{ display: "flex", justifyContent: "space-between" }}
    >
    <div>
    <div style={{ fontSize: "10px" }}>CARD HOLDER</div>
    <div style={{ marginTop: "3px" }}>
    {cardName || "FULL NAME"}
    </div>
    </div>

    <div>
    <div style={{ fontSize: "10px" }}>EXPIRES</div>
    <div style={{ marginTop: "3px" }}>{cardExpiry || "MM/YY"}</div>
    </div>
    </div>
    </div>

    {/* ADD NEW CARD BOX */}
    <div
    className="card-saved add"
    style={{
    width: "347px",
    height: "200px",
    borderRadius: "15px",
    border: "2px dashed #555",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop:"-18px"
    }}
    >
    + Add New Card
    </div>
    </div>

    {/* ORIGINAL FORM */}
    <div className="card-form dynamic">
    <input
    type="text" id="cardNumber"
    placeholder="Card number"
    maxLength="19"
    value={cardNumber}
    onChange={(e) =>
    setCardNumber(
    e.target.value
    .replace(/[^\d]/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    )
    }
    />

    <input style={{marginLeft:"20px"}}
    type="text" id="cardName"
    placeholder="Name on card"
    value={cardName}
    onChange={(e) => setCardName(e.target.value)}
    />

    <div className="row" style={{ marginLeft: "0px" }}>
    <input
    type="text" id="cardMonthYear"
    placeholder="MM/YY"
    maxLength="5"
    value={cardExpiry}
    onChange={(e) =>
    setCardExpiry(
    e.target.value
    .replace(/[^\d]/g, "")
    .replace(/(\d{2})(\d{1,2})/, "$1/$2")
    )
    }
    />
    <input
    type="password" id="cardCvv"
    placeholder="CVV"
    maxLength="3"
    value={cardCVV}
    onChange={(e) =>
    setCardCVV(e.target.value.replace(/[^\d]/g, ""))
    }
    />
    </div>
    </div>
    </>
    )}


    {/* UPI */}
    {paymentTab === "upi" && (
    <div className="upi-panel dynamic">
    <label className="label">Enter UPI ID</label>
    <input
    type="text"
    placeholder="+91 92xxxxxxxx@ybl"
    value={upiId}
    onChange={(e) => setUpiId(e.target.value)}
    />
    <div className="upi-hint">
    You will receive a UPI collect request for confirmation.
    </div>
    </div>
    )}

    {/* EMI */}
    {paymentTab === "emi" && (
    <div className="emi-panel dynamic">
    <label className="label">Select EMI Plan</label>
    <select
    value={emiPlan}
    onChange={(e) => setEmiPlan(e.target.value)}
    >
    <option value="">Choose plan</option>
    <option value="3">3 months — No cost EMI</option>
    <option value="6">6 months — ₹500 interest</option>
    <option value="9">9 months — ₹1200 interest</option>
    </select>
    <div className="emi-note">
    EMI details and bank offers will be shown.
    </div>
    </div>
    )}

    {/* COD */}
    {paymentTab === "cod" && (
    <div className="cod-panel dynamic">
    <p className="cod-text">
    Pay at your doorstep when the product is delivered.
    </p>
    </div>
    )}
    </div>

    {/* PAY NOW */}
    <div className="pay-actions">
    <button className="pay-now" onClick={placeOrder}>
    Place your order
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>

    {/* RIGHT SIDE TOTAL SECTION */}
    <div className="checkout-right">
    <div className="order-details card sticky">
    <h3>Order Details</h3>

    <div className="detail-row">
    <span>Price</span>
    <span>₹{getTotal().toLocaleString()}</span>
    </div>

    <div className="detail-row">
    <span>Delivery charges</span>
    <span className="muted">Free</span>
    </div>

    <div className="detail-row">
    <span>Discount price</span>
    <span>₹100</span>
    </div>

    <hr />

    <div className="detail-row total">
    <strong>Order Total</strong>
    <strong>₹{(getTotal() - 100).toLocaleString()}</strong>
    </div>

    <div className="savings">
    For your first order, we are giving a discount of{" "}
    <strong>₹100</strong> and free delivery.
    </div>
    </div>
    </div>
    </div>
    </div>
    );
    }
