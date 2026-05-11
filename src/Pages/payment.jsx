import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Payment() {
  const navigate = useNavigate();

  // ✅ GET CART FROM LOCAL STORAGE
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ✅ CALCULATE TOTAL
  const baseTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ✅ PAYMENT METHOD
  const [method, setMethod] = useState("upi");

  // ✅ LOADING STATE
  const [loading, setLoading] = useState(false);

  // ✅ COD EXTRA CHARGE
  const codCharge =
    method === "cod" && baseTotal < 1000 ? 25 : 0;

  // ✅ FINAL TOTAL
  const totalAmount = baseTotal + codCharge;

  // ================= PAYMENT FUNCTION =================
  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // ✅ PAYMENT TOAST
      if (method === "upi") {
        toast.info("Processing UPI payment...");
      } else {
        toast.info("Placing COD order...");
      }

      // ✅ CREATE ORDER PAYLOAD
      const payload = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),

        totalAmount,

        paymentMethod: method,
      };

      // ✅ API CALL
      await api.post("/api/order/place", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ SUCCESS MESSAGE
      toast.success("Order placed successfully 🎉");

      // ✅ CLEAR CART
      localStorage.removeItem("cart");

      // ✅ REDIRECT TO ORDERS PAGE
      setTimeout(() => {
        navigate("/order");
      }, 1500);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4 rounded-4">

            {/* TITLE */}
            <h3 className="fw-bold mb-4">
              💳 Payment
            </h3>

            {/* ================= PAYMENT METHOD ================= */}
            <div className="mb-4">

              <label className="form-label fw-bold">
                Select Payment Method
              </label>

              {/* UPI */}
              <div className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={method === "upi"}
                  onChange={() => setMethod("upi")}
                />

                <label className="form-check-label">
                  UPI / Online Payment
                </label>
              </div>

              {/* COD */}
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                />

                <label className="form-check-label">
                  Cash on Delivery (COD)
                </label>
              </div>

            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="mb-4">

              <h5 className="fw-bold mb-3">
                📦 Order Summary
              </h5>

              {/* PRODUCTS */}
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between mb-2"
                >
                  <div>
                    <div>{item.title}</div>

                    <small className="text-muted">
                      Qty: {item.quantity}
                    </small>
                  </div>

                  <div>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}

              <hr />

              {/* SUBTOTAL */}
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{baseTotal}</span>
              </div>

              {/* COD CHARGE */}
              {codCharge > 0 && (
                <div className="d-flex justify-content-between text-danger">
                  <span>COD Charge</span>
                  <span>+ ₹25</span>
                </div>
              )}

              <hr />

              {/* TOTAL */}
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

            </div>

            {/* ================= BUTTON ================= */}
            <button
              className="btn btn-success w-100"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Place Order"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Payment;