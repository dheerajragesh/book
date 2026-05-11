import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../logo32.jpeg";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token;
  const isSeller = user?.role === "seller";

  // ================= FETCH COUNTS =================
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // USER ONLY FEATURES
        if (!isSeller) {
          const cartRes = await api.get("/api/cart/get", config);
          setCartCount(cartRes.data?.data?.length || 0);

          const wishRes = await api.get("/api/wishlist/getwishlist", config);
          setWishlistCount(wishRes.data?.data?.length || 0);
        }

        // ORDERS (BOTH USER & SELLER)
        const orderRes = await api.get(
          isSeller ? "/api/orders/all-orders" : "/api/orders/my-orders",
          config
        );

        setOrderCount(orderRes.data?.data?.length || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCounts();
  }, [token, isSeller]);

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container-fluid">

        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="logo" height="30" />
          <span className="ms-2 fw-bold">BookStore</span>
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV */}
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">

            {/* HOME */}
            {location.pathname !== "/" && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            )}

            {/* SELLER */}
            {isLoggedIn && isSeller && (
              <li className="nav-item">
                <Link className="nav-link" to="/add">
                  ➕ Add Book
                </Link>
              </li>
            )}

            {/* USER FEATURES */}
            {isLoggedIn && !isSeller && (
              <>
                {/* CART */}
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    🛒 Cart{" "}
                    {cartCount > 0 && (
                      <span className="badge bg-primary">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* WISHLIST */}
                <li className="nav-item">
                  <Link className="nav-link" to="/wishlist">
                    ❤️ Wishlist{" "}
                    {wishlistCount > 0 && (
                      <span className="badge bg-danger">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* ORDERS (BOTH) */}
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/order">
                  📦 Orders{" "}
                  {orderCount > 0 && (
                    <span className="badge bg-success">
                      {orderCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* THEME TOGGLE */}
            <li className="nav-item">
              <button
                onClick={toggleTheme}
                className="btn btn-sm btn-outline-secondary ms-2"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </li>

            {/* AUTH */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="btn btn-sm btn-danger ms-2"
                >
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;