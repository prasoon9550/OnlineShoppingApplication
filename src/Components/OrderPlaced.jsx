import React from "react";
import "./OrderPlaced.css";

export default function OrderPlaced() {
  const order = JSON.parse(localStorage.getItem("clientPlacedOrder")) || {};

  return (
    <div className="order-placed-container">

      {/* Unified header + confirmation message */}
      <div className="order-header">
        <h1>✔ Thank you, your order has been placed</h1>
        <div className="confirmation-msg">
          Confirmation will be sent to your email.
        </div>
      </div>

      {/* Info box */}
      <div className="order-info-box">
        <strong>Forget anything?</strong><br />
        For the next 24 hours, you have FREE Shipping on all items shipped by us. No order minimum. Why? We just want to thank you for shopping with us. To get this benefit, choose the same delivery address.
      </div>

      {/* Shipping Address */}
      <div className="order-block">
        <h2>Shipping Address</h2>
        <p><strong>{order.address?.fullName}</strong></p>
        <p>{order.address?.street}</p>
        <p>Mobile: {order.address?.phoneNo}</p>
      </div>

      {/* Items Ordered */}
      <div className="order-block">
        <h2>Items Ordered</h2>
        {order.items?.map((item, index) => (
          <div key={index} className="ordered-item">
            <img src={item.image} alt={item.name} className="ordered-img" />
            <div>
              <h3>{item.name}</h3>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="order-total">
        Total Paid: ₹{order.totalAmount}
      </div>

    </div>
  );
}
