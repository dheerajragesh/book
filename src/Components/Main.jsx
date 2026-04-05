import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import DisplayPage from "../Pages/DisplayPage";
import FormPage from "../Pages/FormPage";
import BookDetails from "../Pages/BookDetails";
import EditPage from "../Pages/EditPage";

function Main() {
  const [products, setProducts] = useState([]);

  // Everything must be INSIDE the Main function
  return (
    <main className="main py-4 min-vh-100">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/display"
            element={<DisplayPage products={products} setProducts={setProducts} />}
          />
          <Route path="/add" element={<FormPage setProducts={setProducts} />} />

          {/* Dynamic path for individual book details */}
          <Route path="/book/:id" element={<BookDetails products={products} />} />

          {/* Dynamic path for editing */}
          <Route
            path="/edit/:id"
            element={<EditPage products={products} setProducts={setProducts} />}
          />
        </Routes>
      </div>
    </main>
  );
}

export default Main;
