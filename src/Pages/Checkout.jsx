import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  // ================= ADDRESS FORM =================
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const token = localStorage.getItem("token");

  // ================= FETCH CART =================
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/cart/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItems(res.data?.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const {
      fullName,
      phone,
      house,
      area,
      city,
      state,
      pincode,
    } = addressData;

    if (
      !fullName ||
      !phone ||
      !house ||
      !area ||
      !city ||
      !state ||
      !pincode
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Enter valid 10 digit phone number");
      return false;
    }

    const pinRegex = /^\d{6}$/;

    if (!pinRegex.test(pincode)) {
      toast.error("Enter valid 6 digit pincode");
      return false;
    }

    return true;
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0
  );

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setPlacing(true);

      const toastId = toast.loading("Placing order...");

      const orderItems = items.map((item) => ({
        productId: item.book._id,
        quantity: item.quantity,
      }));

      const finalAddress = `
${addressData.fullName}
${addressData.house},
${addressData.area},
${addressData.city},
${addressData.state} - ${addressData.pincode}
Phone: ${addressData.phone}
Landmark: ${addressData.landmark}
`;

      await api.post(
        "/api/orders/place",
        {
          items: orderItems,
          totalAmount: total,
          address: finalAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.update(toastId, {
        render: "Order placed successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/payment");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Order failed ❌"
      );
    } finally {
      setPlacing(false);
    }
  };

  // ================= UI =================
  return (
    <div
      className="container py-5"
      style={{ minHeight: "100vh" }}
    >
      {/* TITLE */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-6">
          🧾 Secure Checkout
        </h1>

        <p className="text-muted">
          Complete your delivery details
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-dark"
            role="status"
          ></div>

          <p className="mt-3">Loading checkout...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center">
          <div className="card border-0 shadow-sm p-5 rounded-4">
            <h4 className="fw-bold mb-3">
              Your cart is empty 😢
            </h4>

            <button
              className="btn btn-dark"
              onClick={() => navigate("/display")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* DELIVERY CARD */}
            <div className="card border-0 shadow-lg rounded-4 mb-4">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  📍 Delivery Address
                </h4>

                <div className="row g-3">

                  {/* FULL NAME */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter full name"
                      name="fullName"
                      value={addressData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* PHONE */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="10 digit mobile number"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* HOUSE */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      House No / Building Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Flat, House no, Building"
                      name="house"
                      value={addressData.house}
                      onChange={handleChange}
                    />
                  </div>

                  {/* AREA */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Area / Street
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Street, Area, Colony"
                      name="area"
                      value={addressData.area}
                      onChange={handleChange}
                    />
                  </div>

                  {/* CITY */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      City
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="City"
                      name="city"
                      value={addressData.city}
                      onChange={handleChange}
                    />
                  </div>

                  {/* STATE */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      State
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="State"
                      name="state"
                      value={addressData.state}
                      onChange={handleChange}
                    />
                  </div>

                  {/* PINCODE */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Pincode
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="6 digit pincode"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* LANDMARK */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Landmark (Optional)
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Nearby landmark"
                      name="landmark"
                      value={addressData.landmark}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  📦 Order Items
                </h4>

                {items.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex align-items-center gap-3">

                      <img
                        src={`http://${process.env.REACT_APP_API_URL}/${item.book.image}`}
                        alt={item.book.title}
                        className="rounded-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />

                      <div>
                        <h6 className="fw-bold mb-1">
                          {item.book.title}
                        </h6>

                        <small className="text-muted">
                          Quantity: {item.quantity}
                        </small>

                        <div className="text-success fw-semibold mt-1">
                          ₹{item.book.price}
                        </div>
                      </div>
                    </div>

                    <div className="fw-bold fs-5">
                      ₹
                      {item.book.price *
                        item.quantity}
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">

            <div
              className="card border-0 shadow-lg rounded-4 sticky-top"
              style={{ top: "20px" }}
            >
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  💳 Price Details
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Total Items</span>

                  <span className="fw-semibold">
                    {items.length}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery</span>

                  <span className="text-success fw-bold">
                    FREE
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">
                    Total Amount
                  </h5>

                  <h5 className="fw-bold text-success">
                    ₹{total}
                  </h5>
                </div>

                <button
                  className="btn btn-dark btn-lg w-100 fw-bold rounded-3"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Placing Order...
                    </>
                  ) : (
                    "Proceed to Payment →"
                  )}
                </button>

                <div className="text-center mt-3 small text-muted">
                  🔒 Safe & Secure Checkout
                </div>

              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Checkout;