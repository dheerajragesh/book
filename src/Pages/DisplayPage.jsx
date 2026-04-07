import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeletePopup from '../Components/DeletePopup';
function DisplayPage({ products, setProducts }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowPopup(true); // show the popup
  };

  const handleConfirmDelete = () => {
    setProducts(products.filter((book) => book.id !== selectedBook.id));
    setShowPopup(false);
    setSelectedBook(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedBook(null);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Our Collection</h2>

      {products.length === 0 ? (
        <div className="text-center text-muted fs-5">
          No books available
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map((book) => (
            <div className="col" key={book.id}>
              <div className="card h-100 shadow-sm border-0 product-card">
                <Link to={`/book/${book.id}`}>
                  <div style={{ height: "250px", overflow: "hidden" }}>
                    <img
                      src={book.image || "https://via.placeholder.com/150"}
                      alt={book.name}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                </Link>

                <div className="card-body">
                  <h5 className="card-title fw-bold text-truncate">
                    {book.name}
                  </h5>

                  <p className="text-success fw-bold fs-5">₹{book.price}</p>

                  <div className="d-flex gap-2 mt-3">
                    <Link
                      to={`/edit/${book.id}`}
                      className="btn btn-primary btn-sm flex-grow-1"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(book)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {selectedBook && (
        <DeletePopup
          show={showPopup}
          handleClose={handleClosePopup}
          handleConfirm={handleConfirmDelete}
          itemName={selectedBook.name}
        />
      )}
    </div>
  );
}

export default DisplayPage;