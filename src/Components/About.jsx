import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">

            <div className="about-hero">
                <h1>Our Story</h1>
                <p>Discover the journey of Nxt Trendz and our commitment to excellence</p>
            </div>

            <div className="about-section story">
                <h2>How It All Began</h2>
                <p>
                    <b>Nxt Trendz</b> was born out of a simple idea: to make online shopping effortless, affordable,
                    and enjoyable for everyone. Founded in 2023 by a group of passionate entrepreneurs, we started
                    as a small team with a big dream. Today, we are proud to serve millions of customers worldwide,
                    offering a wide range of products and services
                </p>
            </div>

            <div className="about-section statistics">
                <h2>By The Numbers</h2>
                <div className="stats-grid">
                    <div className="stat">
                        <h3>10M+</h3>
                        <p>Happy Customers</p>
                    </div>
                    <div className="stat">
                        <h3>500K+</h3>
                        <p>Products Available</p>
                    </div>
                    <div className="stat">
                        <h3>100+</h3>
                        <p>Countries Served</p>
                    </div>
                    <div className="stat">
                        <h3>24/7</h3>
                        <p>Customer Support</p>
                    </div>
                </div>
            </div>

            <div className="about-section values">
                <h2>Our Core Values</h2>
                <div className="values-grid">
                    <div className="value">
                        <h3>Customer First</h3>
                        <p>We prioritize our customers' needs and strive to exceed their expectations.</p>
                    </div>
                    <div className="value">
                        <h3>Innovation</h3>
                        <p>We embrace new technologies to enhance the shopping experience.</p>
                    </div>
                    <div className="value">
                        <h3>Sustainability</h3>
                        <p>We are committed to eco-friendly practices and reducing our carbon footprint.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;