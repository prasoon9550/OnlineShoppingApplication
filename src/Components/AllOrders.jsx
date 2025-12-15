import React, { useEffect, useState } from "react";
import "./AllOrders.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(
          `https://onlineshoppingapplicationbackend.onrender.com/getOrderDetailsByUserName/${userName}`
        );

        if (res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.log("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userName]);

  return (
    <>
      <div className="order-txt">
        <p className="your-order">Your Orders</p>
      </div>

      {/* ⭐ SHIMMER WHILE LOADING */}
      {loading &&
        Array.from({ length: 3 }).map((_, i) => (
          <div className="amz-order-box shimmer-box" key={i}>
            <div className="amz-order-top">
              <div className="shimmer shimmer-line"></div>
              <div className="shimmer shimmer-line"></div>
              <div className="shimmer shimmer-line"></div>
            </div>

            <div className="amz-order-bottom">
              <div className="shimmer shimmer-img"></div>

              <div className="amz-middle">
                <div className="shimmer shimmer-line"></div>
                <div className="shimmer shimmer-line short"></div>
                <div className="shimmer shimmer-btn"></div>
              </div>
            </div>
          </div>
        ))}

      {/* ⭐ NO ORDERS STATE */}
      {!loading && orders.length === 0 && (
        <div className="no-orders-box">
          <h2>No orders yet 😕</h2>
          <p>You haven’t placed any orders. Start shopping now!</p>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Shop Now
          </button>
        </div>
      )}

      {/* ⭐ REAL DATA */}
      {!loading &&
        orders.length > 0 &&
        orders.map((order) => (
          <div className="amz-order-box" key={order._id}>
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

            <div className="amz-order-bottom">
              <img
                src={order.items[0].image}
                alt="product"
                className="amz-img"
              />

              <div className="amz-middle">
                <p className="amz-title">{order.items[0].name}</p>
                <button className="amz-buy-again">Buy it again</button>
              </div>

              <div className="amz-actions">
                <button className="yellow-btn">Track package</button>
                <button className="white-btn red-text">Cancel items</button>
                <button className="black-btn blk-text">
                  Return or replace items
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
