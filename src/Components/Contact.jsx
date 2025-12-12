import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Contact.css'; 

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out to us for any questions or feedback.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Enter your message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
        <div className="contact-info">
          <h2>Our Contact Information</h2>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <p>Kompally near Cineplanet, Hyderabad</p>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <p>+9223094243
              
            </p>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <p>info@nxttrendz.com</p>
          </div>
          <div className="social-links">
            <a >
              <FaFacebook className="social-icon" />
            </a>
            <a>
              <FaTwitter className="social-icon" />
            </a>
            <a >
              <FaInstagram className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;