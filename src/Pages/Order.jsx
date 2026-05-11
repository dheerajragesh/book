import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import DeletePopup from "../Components/DeletePopup";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isSeller = user?.role === "seller";

  // ================= FETCH ORDERS =================
  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const url = isSeller
        ? "/api/orders/all-orders"
        : "/api/orders/my-orders";

      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data?.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token, isSeller]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= CANCEL ORDER =================
  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const toastId = toast.loading("Cancelling order...");

      await api.delete(
        `/api/orders/cancelorder/${selectedOrder._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.update(toastId, {
        render: "Order cancelled ❌",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setShowPopup(false);
      setSelectedOrder(null);
    }
  };

  // ================= SELLER UPDATE STATUS =================
  const updateStatus = async (orderId, status) => {
    try {
      const toastId = toast.loading("Updating status...");

      await api.put(
        `/api/orders/updateorder/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.update(toastId, {
        render: "Order updated ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  // ================= UI =================
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        📦 {isSeller ? "Seller Orders Panel" : "My Orders"}
      </h2>

      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted fs-5">
          No orders found
        </div>
      ) : (
        <div className="row g-4">

          {orders.map((order) => (
            <div key={order._id} className="col-lg-6">
              <div className="card shadow-sm border-0 rounded-4 p-4">

                {/* ORDER ID + STATUS */}
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <small className="text-muted">Order ID</small>
                    <div className="fw-bold text-truncate">
                      {order._id}
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      order.status === "cancelled"
                        ? "bg-danger"
                        : order.status === "delivered"
                        ? "bg-success"
                        : order.status === "shipped"
                        ? "bg-primary"
                        : "bg-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* SELLER USER INFO */}
                {isSeller && (
                  <div className="small text-primary mb-2">
                    👤 {order.user?.firstName} {order.user?.lastName}
                    <br />
                    📧 {order.user?.email}
                  </div>
                )}

                {/* ITEMS */}
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between"
                  >
                    <span>{item.productId?.title}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}

                <hr />

                {/* TOTAL */}
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>

                {/* ADDRESS */}
                <div className="text-muted small mt-2">
                  📍 {order.address}
                </div>

                {/* DATE */}
                <div className="text-muted small mt-1">
                  🕒 {new Date(order.createdAt).toLocaleString()}
                </div>

                {/* USER CANCEL */}
                {!isSeller &&
                  order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <button
                      onClick={() => handleCancelClick(order)}
                      className="btn btn-outline-danger btn-sm mt-3"
                    >
                      Cancel Order
                    </button>
                  )}

                {/* SELLER ACTIONS */}
                {isSeller && order.status !== "cancelled" && (
                  <div className="mt-3 d-flex gap-2 flex-wrap">

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        updateStatus(order._id, "placed")
                      }
                    >
                      Placed
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        updateStatus(order._id, "shipped")
                      }
                    >
                      Shipped
                    </button>

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        updateStatus(order._id, "delivered")
                      }
                    >
                      Delivered
                    </button>

                  </div>
                )}

              </div>
            </div>
          ))}

        </div>
      )}

      {/* CONFIRMATION POPUP */}
      {selectedOrder && (
        <DeletePopup
          show={showPopup}
          handleClose={handleClose}
          handleConfirm={handleConfirmCancel}
          itemName={`Order ${selectedOrder._id}`}
        />
      )}
    </div>
  );
};

export default Order;