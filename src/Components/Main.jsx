import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "../api/api";

import Home from "../Pages/Home";
import DisplayPage from "../Pages/DisplayPage";
import FormPage from "../Pages/FormPage";
import BookDetails from "../Pages/BookDetails";
import EditPage from "../Pages/EditPage";
import Cart from "../Pages/cart";
import Wishlist from "../Pages/wishlist";
import Order from "../Pages/Order";
import Checkout from "../Pages/Checkout";
import Payment from "../Pages/payment";

// ✅ AUTH COMPONENTS
import Login from "./Login";
import Signup from "./Signup";

// ✅ RESET PASSWORD
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";

// ✅ PROTECTED ROUTE
import ProtectedRoute from "./ProtectedRoute";

function Main() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      try {
        const res = await api.get("/api/books");

        if (!ignore) {
          setProducts(res.data?.data || []);
        }
      } catch (err) {
        console.log("Fetch books error:", err);
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="main py-4 min-vh-100">
      <div className="container">
        <Routes>

          {/* 🏠 HOME */}
          <Route path="/" element={<Home />} />

          {/* 📚 DISPLAY BOOKS */}
          <Route
            path="/display"
            element={
              <DisplayPage
                products={products}
                setProducts={setProducts}
              />
            }
          />

          {/* 📖 BOOK DETAILS */}
          <Route
            path="/book/:id"
            element={<BookDetails />}
          />

          {/* 🔐 AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔄 RESET PASSWORD */}
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* 🛒 CART */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* ❤️ WISHLIST */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* 🧾 CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* 💳 PAYMENT */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* 📦 ORDER */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />

          {/* ➕ ADD BOOK (SELLER ONLY) */}
          <Route
            path="/add"
            element={
              <ProtectedRoute sellerOnly={true}>
                <FormPage setProducts={setProducts} />
              </ProtectedRoute>
            }
          />

          {/* ✏️ EDIT BOOK (SELLER ONLY) */}
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute sellerOnly={true}>
                <EditPage
                  products={products}
                  setProducts={setProducts}
                />
              </ProtectedRoute>
            }
          />

          {/* ❌ 404 */}
          <Route
            path="*"
            element={<h2>Page Not Found</h2>}
          />

        </Routes>
      </div>
    </main>
  );
}

export default Main;