import React from 'react';
import { FaShippingFast, FaHeadset, FaMoneyBillWave, FaHandHoldingUsd } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Discover the exceptional services we offer to make your shopping experience seamless and enjoyable.</p>
      </div>

      <div className="services-grid">
        <div className="service-card">
          <div className="service-icon">
            <FaShippingFast />
          </div>
          <h3>Fast Shipping</h3>
          <p>Get your products delivered quickly with our reliable and efficient shipping services.</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <FaHeadset />
          </div>
          <h3>24/7 Support</h3>
          <p>Our dedicated support team is available around the clock to assist you with any queries.</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <FaMoneyBillWave />
          </div>
          <h3>Easy Returns</h3>
          <p>Not satisfied? No problem! Enjoy hassle-free returns and refunds.</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <FaHandHoldingUsd />
          </div>
          <h3>Cash on Delivery</h3>
          <p>Pay for your orders in cash when they are delivered to your doorstep.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;