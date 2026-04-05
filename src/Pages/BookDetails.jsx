import React from "react";
import { useParams, Link } from "react-router-dom";

function BookDetails({ products }) {
  const { id } = useParams();
  const book = products.find((b) => b.id === parseInt(id));

  if (!book) return <div className="container mt-5">Book not found!</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-5 mb-4">
          <img src={book.image} alt={book.name} className="img-fluid rounded shadow-lg" />
        </div>
        <div className="col-12 col-md-6">
          <span className="badge bg-primary mb-2">New Arrival</span>
          <h1 className="display-5 fw-bold">{book.name}</h1>
          <p className="text-muted fs-5 my-4">{book.details}</p>
          <h2 className="text-success mb-4">₹{book.price}</h2>
          
          <div className="d-grid d-md-block">
            <button className="btn btn-dark btn-lg px-5 me-md-3 mb-3">Buy Now</button>
            <Link to="/display" className="btn btn-outline-secondary btn-lg px-4 mb-3">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;