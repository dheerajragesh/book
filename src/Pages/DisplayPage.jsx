import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeletePopup from "../Components/DeletePopup";
import api from "../api/api";
import { toast } from "react-toastify";

function DisplayPage() {
  const [products, setProducts] = useState([]);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [actionType, setActionType] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ================= FETCH BOOKS =================
  const fetchBooks = async (page = 1) => {
    try {
      const res = await api.get(
        `/api/books?page=${page}&limit=4`
      );

      console.log(res.data);

      setProducts(res.data.data || []);

      // ✅ BACKEND RETURNS pages
      setTotalPages(res.data.pagination?.pages || 1);

      setCurrentPage(page);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load books");
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  // ================= IMAGE =================
  const getImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/150";

    if (image.startsWith("http")) return image;

    return `http://${process.env.REACT_APP_API_URL}/${image}`;
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async (book) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoadingId(book._id);

      if (cartItems.includes(book._id)) {
        setSelectedBook(book);
        setActionType("removeCart");
        setShowPopup(true);
        return;
      }

      await api.post(
        "/api/cart/add",
        {
          product: book._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([...cartItems, book._id]);

      toast.success("Added to cart 🛒");
    } catch (err) {
      console.log(err);
      toast.error("Cart failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= WISHLIST =================
  const handleWishlist = async (book) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoadingId(book._id);

      if (wishlistItems.includes(book._id)) {
        setSelectedBook(book);
        setActionType("removeWishlist");
        setShowPopup(true);
        return;
      }

      await api.post(
        `/api/wishlist/addwishlist/${book._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistItems([...wishlistItems, book._id]);

      toast.success("Added to wishlist ❤️");
    } catch (err) {
      console.log(err);
      toast.error("Wishlist failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= DELETE =================
  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setActionType("delete");
    setShowPopup(true);
  };

  // ================= CONFIRM ACTION =================
  const handleConfirm = async () => {
    if (!selectedBook) return;

    try {
      // DELETE BOOK
      if (actionType === "delete") {
        await api.delete(`/api/books/${selectedBook._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Deleted successfully");

        fetchBooks(currentPage);
      }

      // REMOVE CART
      if (actionType === "removeCart") {
        await api.delete(
          `/api/cart/remove/${selectedBook._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCartItems(
          cartItems.filter((id) => id !== selectedBook._id)
        );

        toast.success("Removed from cart");
      }

      // REMOVE WISHLIST
      if (actionType === "removeWishlist") {
        await api.delete(
          `/api/wishlist/removewishlist/${selectedBook._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlistItems(
          wishlistItems.filter((id) => id !== selectedBook._id)
        );

        toast.success("Removed from wishlist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Action failed");
    }

    setShowPopup(false);
    setSelectedBook(null);
  };

  // ================= PAGE CHANGE =================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchBooks(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        📚 Our Collection
      </h2>

      {/* BOOK GRID */}
      <div className="row g-4">
        {products.map((book) => {
          const inCart = cartItems.includes(book._id);
          const inWishlist = wishlistItems.includes(book._id);
          const isLoading = loadingId === book._id;

          return (
            <div className="col-md-6 col-lg-3" key={book._id}>
              <div
                className="card border-0 h-100 shadow-sm"
                style={{
                  borderRadius: "18px",
                  transition: "0.3s",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <Link to={`/book/${book._id}`}>
                  <img
                    src={getImageSrc(book.image)}
                    className="card-img-top"
                    alt={book.title}
                    style={{
                      height: "240px",
                      objectFit: "cover",
                    }}
                  />
                </Link>

                <div className="card-body text-center">
                  <h6 className="fw-bold text-truncate">
                    {book.title}
                  </h6>

                  <p className="text-success fw-bold fs-5">
                    ₹{book.price}
                  </p>

                  {/* BUTTONS */}
                  <div className="d-flex flex-wrap gap-2 justify-content-center">

                    {/* SELLER */}
                    {user?.role === "seller" && (
                      <>
                        <Link
                          to={`/edit/${book._id}`}
                          className="btn btn-primary btn-sm px-3"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDeleteClick(book)
                          }
                          className="btn btn-danger btn-sm px-3"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {/* USER */}
                    {user?.role === "user" && (
                      <>
                        <button
                          onClick={() =>
                            handleAddToCart(book)
                          }
                          className="btn btn-dark btn-sm px-3"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "..."
                            : inCart
                            ? "🛒 Remove"
                            : "🛒 Add"}
                        </button>

                        <button
                          onClick={() =>
                            handleWishlist(book)
                          }
                          className="btn btn-outline-danger btn-sm px-3"
                          disabled={isLoading}
                        >
                          {inWishlist
                            ? "❤️ Remove"
                            : "🤍 Wishlist"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODERN PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-5 flex-wrap gap-2">

          {/* PREVIOUS */}
          <button
            className="btn btn-light border rounded-pill px-4 shadow-sm"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            style={{
              fontWeight: "600",
            }}
          >
            ← Previous
          </button>

          {/* PAGE NUMBERS */}
          <div className="d-flex gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={`btn rounded-circle ${
                    currentPage === page
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  }`}
                  style={{
                    width: "42px",
                    height: "42px",
                    fontWeight: "600",
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* NEXT */}
          <button
            className="btn btn-dark rounded-pill px-4 shadow-sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            style={{
              fontWeight: "600",
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* POPUP */}
      {selectedBook && (
        <DeletePopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          handleConfirm={handleConfirm}
          itemName={selectedBook.title}
        />
      )}
    </div>
  );
}

export default DisplayPage;