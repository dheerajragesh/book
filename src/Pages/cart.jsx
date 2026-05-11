import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCart,
} from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // ✅ PAGE LOADING
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      setPageLoading(true);

      const res = await getCart();

      // ✅ SMALL DELAY FOR SMOOTH UI
      setTimeout(() => {
        setItems(res.data.data || []);
        setPageLoading(false);
      }, 500);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load cart");
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= REMOVE =================
  const handleRemove = async (id) => {
    try {
      setLoadingId(id);

      const toastId = toast.loading("Removing item...");

      await removeFromCart(id);

      toast.update(toastId, {
        render: "Item removed ❌",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      fetchCart();
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (id, qty) => {
    if (qty < 1) return;

    try {
      setLoadingId(id);

      const toastId = toast.loading("Updating...");

      await updateCart(id, qty);

      toast.update(toastId, {
        render: "Updated 🔄",
        type: "success",
        isLoading: false,
        autoClose: 1200,
      });

      fetchCart();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0
  );

  // ================= CHECKOUT =================
  const handleCheckout = () => {
    if (items.length === 0) {
      return toast.error("Cart is empty");
    }

    navigate("/checkout", {
      state: {
        items,
        total,
      },
    });
  };

  // ================= PAGE LOADING UI =================
  if (pageLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-dark mb-3"
            role="status"
          ></div>

          <h5 className="fw-bold">Loading Cart...</h5>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">🛒 My Cart</h2>

      {items.length === 0 ? (
        <div className="text-center text-muted fs-5">
          Your cart is empty 😢
        </div>
      ) : (
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-lg-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="card mb-3 border-0 shadow-sm"
                style={{ borderRadius: "15px" }}
              >
                <div className="row g-0 align-items-center">

                  {/* IMAGE */}
                  <div className="col-4 col-md-3">
                    <img
                      src={`http://${process.env.REACT_APP_API_URL}/${item.book.image}`}
                      alt={item.book.title}
                      className="img-fluid rounded-start"
                      style={{
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="col-8 col-md-9">
                    <div className="card-body">

                      <h5 className="fw-bold">
                        {item.book.title}
                      </h5>

                      <p className="text-success fw-bold">
                        ₹{item.book.price}
                      </p>

                      {/* QUANTITY */}
                      <div className="d-flex align-items-center gap-2 mb-2">

                        <button
                          className="btn btn-sm btn-outline-dark"
                          disabled={loadingId === item.book._id}
                          onClick={() =>
                            handleUpdate(
                              item.book._id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span className="fw-bold">
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-sm btn-outline-dark"
                          disabled={loadingId === item.book._id}
                          onClick={() =>
                            handleUpdate(
                              item.book._id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          handleRemove(item.book._id)
                        }
                        className="btn btn-danger btn-sm"
                        disabled={loadingId === item.book._id}
                      >
                        {loadingId === item.book._id
                          ? "Processing..."
                          : "Remove ❌"}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm p-4 border-0">

              <h4 className="fw-bold mb-3">
                Order Summary
              </h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span className="fw-bold">
                  ₹{total}
                </span>
              </div>

              <hr />

              <button
                onClick={handleCheckout}
                className="btn btn-dark w-100 fw-bold"
              >
                Checkout 🧾
              </button>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;