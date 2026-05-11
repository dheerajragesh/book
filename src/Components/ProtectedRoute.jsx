import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, sellerOnly = false }) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Seller only route
  if (sellerOnly && user?.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;