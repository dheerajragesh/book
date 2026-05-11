import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // 👉 Dummy preview books (replace with API later)
  const previewBooks = [
    {
      _id: 1,
      title: "The Great Gatsby",
      image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    },
    {
      _id: 2,
      title: "Atomic Habits",
      image: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
    },
    {
      _id: 3,
      title: "Rich Dad Poor Dad",
      image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    },
    {
      _id: 4,
      title: "Harry Potter",
      image: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    },
  ];

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* HERO */}
      <section className="hero d-flex align-items-center justify-content-between p-5">
        <div>
          <h1>Discover Your Next Adventure</h1>
          <p>
            Explore thousands of books ranging from timeless classics to modern masterpieces.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
          alt="Library"
          style={{ width: "400px", borderRadius: "10px" }}
        />
      </section>

      {/* 📚 BOOK PREVIEW */}
      <section className="container py-5">
        <h2 className="text-center mb-4">Popular Books</h2>

        <div className="row">
          {previewBooks.map((book) => (
            <div className="col-md-3 mb-4" key={book._id}>
              <div className="card shadow-sm h-100">
                <img
                  src={book.image}
                  alt={book.title}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />

                <div className="card-body text-center">
                  <h6 className="fw-bold">{book.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔗 VIEW MORE BUTTON */}
        <div className="text-center mt-3">
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/display")}
          >
            View More →
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features d-flex justify-content-around p-5">
        <div className="feature-card">
          <h3>Fast Delivery</h3>
          <p>Get your favorite books delivered within 24 hours.</p>
        </div>

        <div className="feature-card">
          <h3>Best Prices</h3>
          <p>We offer the most competitive prices.</p>
        </div>

        <div className="feature-card">
          <h3>Huge Variety</h3>
          <p>50,000+ titles across all genres.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;