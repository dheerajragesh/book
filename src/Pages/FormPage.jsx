import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage({ setProducts }) {
  const [formData, setFormData] = useState({ name: "", details: "", price: "", image: null });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const normalizeText = (value) => {
    if (!value) return value;
    let next = value.replace(/^\s+/, "");
    next = next.replace(/\s{2,}/g, " ");
    if (!next) return next;
    return next.charAt(0).toUpperCase() + next.slice(1);
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Book title is required";
    if (!formData.details.trim() || formData.details.length < 5) newErrors.details = "Description is too short";
    if (!formData.price || formData.price <= 0) newErrors.price = "Enter a valid price";
    if (!formData.image) newErrors.image = "Please upload a cover image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) setFormData({ ...formData, image: URL.createObjectURL(file) });
    } else {
      const nextValue = name === "name" || name === "details" ? normalizeText(value) : value;
      setFormData({ ...formData, [name]: nextValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const cleaned = {
        ...formData,
        name: formData.name.trim(),
        details: formData.details.trim(),
      };
      setProducts((prev) => [...prev, { id: Date.now(), ...cleaned }]);
      navigate("/display");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold">Add New Book</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-bold small">Book Title</label>
                  <input name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} value={formData.name} onChange={handleChange} placeholder="e.g. Atomic Habits" />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small">Description</label>
                  <textarea name="details" className={`form-control ${errors.details ? "is-invalid" : ""}`} rows="3" value={formData.details} onChange={handleChange} placeholder="Short summary..." />
                  <div className="invalid-feedback">{errors.details}</div>
                </div>

                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold small">Price (₹)</label>
                    <input name="price" type="number" className={`form-control ${errors.price ? "is-invalid" : ""}`} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.price}</div>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold small">Cover Photo</label>
                    <input name="image" type="file" className={`form-control ${errors.image ? "is-invalid" : ""}`} accept="image/*" onChange={handleChange} />
                    <div className="invalid-feedback">{errors.image}</div>
                  </div>
                </div>

                {formData.image && (
                  <div className="text-center my-3">
                    <img src={formData.image} alt="Preview" className="img-thumbnail" style={{ height: "120px" }} />
                  </div>
                )}

                <button className="btn btn-primary w-100 fw-bold py-2 shadow-sm mt-3">Add to Store</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
