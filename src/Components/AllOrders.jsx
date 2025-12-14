import React, { useEffect, useState } from "react";
import "./AllOrders.css";
import axios from "axios";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const userName = localStorage.getItem("userName"); // logged in user

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(
          `https://onlineshoppingapplicationbackend.onrender.com/api/getOrderDetailsByUserName/${userName}`
        );

        if (res.data.success) {
          setOrders(res.data.data); // API returns array of orders
        }
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    }

    fetchOrders();
  }, [userName]);

  return (
    <>
      <div className="order-txt">
        <p className="your-order">Your Orders</p>
      </div>

      {orders.map((order) => (
        <div className="amz-order-box" key={order._id}>
          
          {/* TOP SECTION */}
          <div className="amz-order-top">
            <p>
              <strong>ORDER PLACED</strong>
              <br />
              {new Date(order.createdAt).toDateString()}
            </p>

            <p>
              <strong>TOTAL</strong>
              <br />₹{order.totalAmount}
            </p>

            <p>
              <strong>SHIP TO</strong>
              <br />
              {order.address.fullName}
            </p>

            <div className="amz-links">
              <a href="#">Order # {order.orderId}</a>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="amz-order-bottom">
            <img
              src={order.items[0].image}
              alt="product"
              className="amz-img"
            />

            <div className="amz-middle">
              <p className="amz-arriving">
               
              </p>

              <p className="amz-title">{order.items[0].name}</p>

              <button className="amz-buy-again">Buy it again</button>
            </div>

            <div className="amz-actions">
              <button className="yellow-btn">Track package</button>
              <button className="white-btn red-text">Cancel items</button>
              <button className="black-btn blk-text">Return or replace items</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
