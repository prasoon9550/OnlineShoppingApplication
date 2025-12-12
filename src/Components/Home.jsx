import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const images = [
    "https://img.freepik.com/free-photo/amazed-surprised-girl-sunglasses-pointing-fingers-up_176420-20198.jpg",
    "https://static.vecteezy.com/system/resources/previews/009/258/282/large_2x/fashion-shopping-girl-portrait-on-yellow-background-free-photo.jpg",
    "https://img.freepik.com/premium-photo/cheerful-indian-family-shopping-diwali-festival-wedding-showing-colourful-paper-bags-isolated-white_466689-13124.jpg",
    "https://img.freepik.com/free-photo/front-view-young-male-holding-little-packages-after-shopping-yellow-background_140725-139766.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleImgError = (e) => {
    e.target.src =
      "https://via.placeholder.com/300x300?text=Image+Not+Available";
  };
  const products = [
    { id: 1, category: "iphone", name: "iPhone 15 Pro", price: "₹21999", image: "https://m.media-amazon.com/images/I/81CgtwSII3L._SL1500_.jpg", reviews: "25k+ reviews" },
    { id: 2, category: "samsung", name: "Samsung Galaxy S23", price: "₹23799", image: "https://m.media-amazon.com/images/I/71OXmy3NMCL._SL1500_.jpg", reviews: "19k+ reviews" },


    { id: 3, category: "macbook", name: "MacBook Air M2", price: "₹245699", image: "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg", reviews: "12k+ reviews" },
    { id: 4, category: "hp", name: "HP Pavillion", price: "₹45660", image: "https://m.media-amazon.com/images/I/717beEiCf6L._AC_UY327_FMwebp_QL65_.jpg", reviews: "9k+ reviews" },

    { id: 5, category: "fossil", name: "Fossil Gen 6 Smartwatch", price: "₹62799", image: "https://m.media-amazon.com/images/I/611h3xy1ZxL._AC_UY327_FMwebp_QL65_.jpg", reviews: "6k+ reviews" },
    { id: 6, category: "appwatch", name: "Apple Watch Series 9", price: "₹23399", image: "https://m.media-amazon.com/images/I/71js8OjkSIL._AC_UY327_FMwebp_QL65_.jpg", reviews: "13k+ reviews" },

    { id: 7, category: "nike", name: "Nike Air Max 270", price: "₹1199", image: "https://m.media-amazon.com/images/I/61Xg4CYYRML._AC_UL480_FMwebp_QL65_.jpg", reviews: "22k+ reviews" },
    { id: 8, category: "adidas", name: "Adidas Running Shoes", price: "₹3299", image: "https://m.media-amazon.com/images/I/517-2sQ5LyL._AC_UL480_FMwebp_QL65_.jpg", reviews: "14k+ reviews" },

    { id: 9, category: "sonywh", name: "Sony WH-1000XM5", price: "₹3499", image: "https://m.media-amazon.com/images/I/61oqO1AMbdL._AC_UY327_FMwebp_QL65_.jpg", reviews: "18k+ reviews" },
    { id: 10, category: "boat141", name: "Boat Airdopes 141", price: "₹2599", image: "https://m.media-amazon.com/images/I/71RFdy6y6LL._AC_UY327_FMwebp_QL65_.jpg", reviews: "55k+ reviews" },

    { id: 11, category: "wild", name: "Wildcraft Backpack", price: "₹859", image: "https://m.media-amazon.com/images/I/61TldZrgsSL._AC_UL480_FMwebp_QL65_.jpg", reviews: "9k+ reviews" },
    { id: 12, category: "sky", name: "Skybags Travel Bag", price: "₹639", image: "https://m.media-amazon.com/images/I/61Jo0nluP5L._AC_UL480_FMwebp_QL65_.jpg", reviews: "4k+ reviews" },

    { id: 13, category: "sonytv", name: "Sony 55 inch 4K TV", price: "₹45799", image: "https://m.media-amazon.com/images/I/81dC067BCML._AC_UL480_FMwebp_QL65_.jpg", reviews: "10k+ reviews" },
    { id: 14, category: "smgtv", name: "Samsung 55 inch 4K TV", price: "₹76799", image: "https://m.media-amazon.com/images/I/718uV2Y9xhL._AC_UY327_FMwebp_QL65_.jpg", reviews: "10k+ reviews" },

    { id: 15, category: "oppo", name: "Oppo Smart Phone", price: "₹12499", image: "https://m.media-amazon.com/images/I/71geVdy6-OS._SL1500_.jpg", reviews: "21k+ reviews" },
    { id: 16, category: "vivo", name: "Vivo T4 Lite 5G Titanium", price: "₹23499", image: "https://m.media-amazon.com/images/I/71nhTcpgx2L._AC_UY327_FMwebp_QL65_.jpg", reviews: "21k+ reviews" },
  ];

  return (
    <div>
      <div
        className="Home"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="overlay">
          <h1>Welcome to Nxt Trendz</h1>
          <p>Your one-stop destination for the best deals and quality products.</p>
          <button
  onClick={() =>
    document
      .getElementById("products-section")
      .scrollIntoView({ behavior: "smooth" })
  }
>
  Shop Now
</button>

        </div>
      </div>
      <div className="limited-edition">
        <h2>
          <span className="bold">LIMITED</span> EDITION
        </h2>

        <div className="product-carousel" id="products-section">
          {products.map((p) => (
            <Link style={{textDecoration:"none",color:"black"}}
              to={`/products/${p.category}`}
              key={p.id}
              className="product-card"
            >
              <img src={p.image} alt={p.name} onError={handleImgError} />
              <h3>{p.name}</h3>
              <p className="price">{p.price}</p>
              <p className="reviews">⭐⭐⭐⭐⭐</p>
              <p className="reviews">{p.reviews}</p>
              
              
              
            </Link>
          ))}
        </div>
      </div>
      <div className="img-container">
        <img
          src="https://www.shutterstock.com/image-photo/female-stylist-near-rack-modern-600nw-2135889599.jpg"
          alt=""
          onError={handleImgError}
        />

        <img
          className="ad-img"
          src="https://assets-static.invideo.io/images/origin/Fashion_Ad_c7b51b5395.JPG"
          alt=""
          onError={handleImgError}
        />
      </div>
    </div>
  );
}
