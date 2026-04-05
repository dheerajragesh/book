import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore thousands of books ranging from timeless classics to modern masterpieces.</p>
        </div>
        <div className="hero-image">
          {/* You can use a high-quality placeholder or a real image link */}
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80" 
            alt="Library" 
          />
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3> Fast Delivery</h3>
          <p>Get your favorite books delivered to your doorstep within 24 hours.</p>
        </div>
        <div className="feature-card">
          <h3> Best Prices</h3>
          <p>We offer the most competitive prices in the market, guaranteed.</p>
        </div>
        <div className="feature-card">
          <h3>Huge Variety</h3>
          <p>Over 50,000+ titles across all genres including Fiction, Tech, and History.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;