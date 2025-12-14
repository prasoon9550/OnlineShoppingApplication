import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentTab, setPaymentTab] = useState("card");

  // CARD STATES
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // ---------------- FETCH CART ----------------
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ---------------- FETCH USER ADDRESS (MAIN FIX) ----------------
  useEffect(() => {
    const username =
      localStorage.getItem("userName") ||
      (JSON.parse(localStorage.getItem("user")) || {}).userName;

    if (!username) return;

    setUserName(username);
    setLoadingAddress(true);

    fetch(
      `https://onlineshoppingapplicationbackend.onrender.com/getUserDetailsByUserName/${username}`
    )
      .then((res) => res.json())
      .then((result) => {
        const data = result?.data;
        if (!data) return;

        const name = [data.firstName, data.middleName, data.lastName]
          .filter(Boolean)
          .join(" ");

        setFullName(name);
        setMobile(data.phoneNo || "");
        setUserAddress(data.address || "");
      })
      .catch((err) => {
        console.error("Address fetch error:", err);
      })
      .finally(() => setLoadingAddress(false));
  }, []);

  // ---------------- HELPERS ----------------
  const addresses =
    fullName || userAddress || mobile
      ? [
          {
            name: fullName,
            address: userAddress,
            mobile: mobile,
          },
        ]
      : [];

  const getTotal = () =>
    cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

  const renderImageSrc = (item) => {
    if (item.image) return item.image;
    return "https://via.placeholder.com/120";
  };

  // ---------------- PLACE ORDER ----------------
  async function placeOrder() {
    try {
      if (!userName) {
        Swal.fire("Login Required", "Please login first", "warning");
        navigate("/login");
        return;
      }
  
      if (!fullName || !mobile || !userAddress) {
        Swal.fire("Address Missing", "Please add delivery address", "warning");
        return;
      }
  
      if (cart.length === 0) {
        Swal.fire("Cart Empty", "Your cart is empty", "error");
        return;
      }
  
      // ---------- PAYMENT VALIDATION ----------
      let paymentDetails = {};
  
      if (paymentTab === "card") {
        if (cardNumber.replace(/\s/g, "").length !== 16)
          return Swal.fire("Invalid Card", "Enter 16-digit card number", "error");
  
        if (cardName.length < 3)
          return Swal.fire("Invalid Name", "Enter card holder name", "error");
  
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry))
          return Swal.fire("Invalid Expiry", "Use MM/YY format", "error");
  
        if (cardCVV.length !== 3)
          return Swal.fire("Invalid CVV", "Enter 3-digit CVV", "error");
  
        paymentDetails = {
          cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
          cardType: cardNumber.startsWith("4")
            ? "VISA"
            : cardNumber.startsWith("5")
            ? "MASTERCARD"
            : "RUPAY",
        };
      }
  
      if (paymentTab === "upi") {
        if (!upiId || !upiId.includes("@")) {
          return Swal.fire("Invalid UPI", "Enter valid UPI ID", "error");
        }
  
        paymentDetails = { upiId };
      }
  
      if (paymentTab === "emi") {
        if (!emiPlan) {
          return Swal.fire("Select EMI", "Please select EMI plan", "error");
        }
  
        paymentDetails = { emiPlan };
      }
  
      if (paymentTab === "cod") {
        paymentDetails = { cod: true };
      }
  
      // ---------- ITEMS ----------
      const items = cart.map((it) => ({
        productId: it._id,
        name: it.title,
        price: Number(it.price),
        quantity: Number(it.quantity),
        image: it.image || "",
      }));
  
      // ---------- FINAL PAYLOAD ----------
      const payload = {
        userName,
        paymentMethod: paymentTab.toUpperCase(), // CARD | COD | UPI | EMI
        paymentDetails,
        address: {
          fullName,
          phoneNo: mobile,
          street: userAddress,
        },
        items,
        totalAmount: getTotal(),
      };
  
      console.log("ORDER PAYLOAD:", payload);
  
      const res = await fetch(
        "https://onlineshoppingapplicationbackend.onrender.com/api/products/placeOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }
  
      if (data.success) {
        localStorage.setItem(
          "clientPlacedOrder",
          JSON.stringify({
            ...payload,
            placedAt: new Date().toISOString(),
          })
        );
  
        localStorage.removeItem("cart");
        Swal.fire("Success", "Order placed successfully", "success");
        navigate("/orderplaced");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Server error", "error");
    }
  }
  

  // ---------------- UI ----------------
  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h2>Checkout</h2>

        {/* ADDRESS */}
        <div className="card">
          <h3>Delivery Address</h3>

          {loadingAddress && <p>Loading address...</p>}

          {!loadingAddress &&
            addresses.map((a, idx) => (
              <div
                key={idx}
                className={`address-tile ${
                  selectedAddressIndex === idx ? "active" : ""
                }`}
                onClick={() => setSelectedAddressIndex(idx)}
              >
                <b>{a.name}</b>
                <p>{a.address}</p>
                <p>Mobile No : {a.mobile}</p>
              </div>
            ))}

          
        </div>

        {/* ORDER SUMMARY */}
        <div className="card">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item._id} className="order-item">
              <img src={renderImageSrc(item)} alt="" />
              <div>
                <div>{item.title}</div>
                <div>₹{item.price}</div>
                <div>Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="card">
          <h3>Payment Method</h3>

          <div className="payment-tabs">
            {["card", "cod"].map((p) => (
              <button
                key={p}
                className={paymentTab === p ? "active" : ""}
                onClick={() => setPaymentTab(p)}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>

          {paymentTab === "card" && (
            <div className="card-form">
              <input
                placeholder="Card Number"
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
              <input
                placeholder="Name on Card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              <input
                placeholder="MM/YY"
                maxLength="5"
                value={cardExpiry}
                onChange={(e) =>
                  setCardExpiry(
                    e.target.value.replace(/[^\d]/g, "").replace(/(\d{2})(\d)/, "$1/$2")
                  )
                }
              />
              <input
                placeholder="CVV"
                maxLength="3"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          )}
        </div>

        <button className="pay-now" onClick={placeOrder}>
          Place Order
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="checkout-right">
        <div className="card sticky">
          <h3>Order Details</h3>
          <p>Total: ₹{getTotal()}</p>
        </div>
      </div>
    </div>
  );
}
