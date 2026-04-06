import React from "react";
import { Link } from "react-router-dom";

function DisplayPage({ products, setProducts }) {
  const deleteBook = (id) => {
    setProducts(products.filter((book) => book.id !== id));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Our Collection</h2>

      {/* Responsive Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {products.map((book) => (
          <div className="col" key={book.id}>
            <div className="card h-100 shadow-sm border-0 product-card">
              
              {/* Image */}
              <Link to={`/book/${book.id}`}>
                <img
                  src={book.image || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt={book.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
              </Link>

              {/* Content */}
              <div className="card-body">
                <h5 className="card-title fw-bold text-truncate">
                  {book.name}
                </h5>

                <p className="text-success fw-bold fs-5">
                  ₹{book.price}
                </p>

                {/* Buttons */}
                <div className="d-flex gap-2 mt-3">
                  
                  {/* EDIT BUTTON */}
                  <Link
                    to={`/edit/${book.id}`}
                    className="btn btn-primary btn-sm flex-grow-1 edit-btn"
                  >
                    Edit
                  </Link>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="btn btn-danger btn-sm delete-btn"
                  >
                    Delete
                  </button>

                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayPage;