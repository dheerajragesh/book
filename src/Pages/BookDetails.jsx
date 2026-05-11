import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import DeletePopup from "../Components/DeletePopup";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [liked, setLiked] = useState(false);

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isSeller = role === "seller";

  // ================= FETCH =================
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        setBook(res.data.data);
      } catch {
        toast.error("Failed to load book");
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark"></div>
        <p className="mt-2">Loading book...</p>
      </div>
    );
  }

  // ================= CART =================
  const handleAddToCart = async () => {
    if (!token) return toast.error("Please login first");

    try {
      setCartLoading(true);

      const toastId = toast.loading("Adding to cart...");

      await api.post(
        "/api/cart/add",
        { product: book._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.update(toastId, {
        render: "Added to cart 🛒",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  // ================= WISHLIST =================
  const handleWishlist = async () => {
    if (!token) return toast.error("Please login first");

    try {
      setWishlistLoading(true);

      if (liked) {
        // 👉 open modal instead of confirm
        setShowPopup(true);
      } else {
        const toastId = toast.loading("Adding to wishlist...");

        await api.post(
          `/api/wishlist/addwishlist/${book._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.update(toastId, {
          render: "Added to wishlist ❤️",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setLiked(true);
      }
    } catch {
      toast.error("Wishlist failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ================= CONFIRM REMOVE =================
  const handleConfirmRemove = async () => {
    try {
      const toastId = toast.loading("Removing...");

      await api.delete(`/api/wishlist/removewishlist/${book._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.update(toastId, {
        render: "Removed from wishlist ❤️",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setLiked(false);
    } catch {
      toast.error("Failed to remove");
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-center">

        {/* ================= IMAGE ================= */}
        <div className="col-md-5 text-center">
          <div
            className="p-3 bg-white rounded-4 shadow-sm"
            style={{ transition: "0.3s" }}
          >
            <img
              src={`http://${process.env.REACT_APP_API_URL}/${book.image}`}
              alt={book.title}
              className="img-fluid rounded-3"
              style={{ maxHeight: "420px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="col-md-7">

          {/* TITLE */}
          <h2 className="fw-bold mb-2">{book.title}</h2>

          {/* PRICE */}
          <h3 className="text-success fw-bold mb-3">
            ₹{book.price}
          </h3>

          {/* BADGES */}
          <div className="mb-3">
            {book.page_count && (
              <span className="badge bg-light text-dark me-2">
                📄 {book.page_count} Pages
              </span>
            )}

            <span className="badge bg-success">
              In Stock
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <h6 className="fw-bold">Description</h6>
            <p className="text-muted">{book.description}</p>
          </div>

          {/* EXCERPT */}
          {book.excerpt && (
            <div className="mb-4">
              <h6 className="fw-bold">Excerpt</h6>
              <blockquote className="blockquote text-muted fst-italic border-start ps-3">
                {book.excerpt}
              </blockquote>
            </div>
          )}

          <hr />

          {/* ================= ACTIONS ================= */}
          {isSeller ? (
            <>
              <Link
                to={`/edit-product/${book._id}`}
                className="btn btn-warning me-2 px-4"
              >
                ✏️ Edit
              </Link>

              <p className="text-info mt-2 small">
                You are the owner of this book
              </p>
            </>
          ) : (
            <div className="d-flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="btn btn-dark px-4"
                disabled={cartLoading}
              >
                {cartLoading ? "Processing..." : "🛒 Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                className={`btn px-4 ${
                  liked ? "btn-danger" : "btn-outline-danger"
                }`}
                disabled={wishlistLoading}
              >
                {wishlistLoading
                  ? "Processing..."
                  : liked
                  ? "❤️ Remove"
                  : "🤍 Wishlist"}
              </button>
            </div>
          )}

          <br />

          <Link to="/display" className="btn btn-link text-decoration-none">
            ← Back to collection
          </Link>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      <DeletePopup
        show={showPopup}
        handleClose={() => setShowPopup(false)}
        handleConfirm={handleConfirmRemove}
        itemName={book.title}
      />
    </div>
  );
}

export default BookDetails;