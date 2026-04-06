import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPage({ products, setProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  const normalizeText = (value) => {
    if (!value) return value;
    let next = value.replace(/^\s+/, "");
    next = next.replace(/\s{2,}/g, " ");
    if (!next) return next;
    return next.charAt(0).toUpperCase() + next.slice(1);
  };

  useEffect(() => {
    const bookToEdit = products.find((b) => b.id === parseInt(id));
    if (bookToEdit) setFormData(bookToEdit);
  }, [id, products]);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Title cannot be empty";
    if (!formData.price || formData.price <= 0) newErrors.price = "Enter a valid price";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (validate()) {
      const cleaned = {
        ...formData,
        name: formData.name.trim(),
        details: (formData.details || "").trim(),
      };
      setProducts(products.map((b) => (b.id === parseInt(id) ? cleaned : b)));
      navigate("/display");
    }
  };

  if (!formData) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-success">Edit Book Info</h3>
              <form onSubmit={handleUpdate} noValidate>
                
                <div className="mb-3 text-center">
                  <img src={formData.image} alt="Current" className="rounded mb-2 shadow-sm" style={{ height: "150px", objectFit: "cover" }} />
                  <input type="file" className="form-control form-control-sm" accept="image/*" 
                    onChange={(e) => setFormData({...formData, image: URL.createObjectURL(e.target.files[0])})} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Book Title</label>
                  <input className={`form-control ${errors.name ? "is-invalid" : ""}`} value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: normalizeText(e.target.value)})} />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.details || ""}
                    onChange={(e) => setFormData({...formData, details: normalizeText(e.target.value)})}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small">Price (₹)</label>
                  <input type="number" className={`form-control ${errors.price ? "is-invalid" : ""}`} value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  <div className="invalid-feedback">{errors.price}</div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success flex-grow-1 fw-bold">Update Book</button>
                  <button type="button" className="btn btn-light" onClick={() => navigate("/display")}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
