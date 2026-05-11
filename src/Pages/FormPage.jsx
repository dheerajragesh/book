import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function FormPage({ setProducts }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    excerpt: "",
    price: "",
    page_count: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    let err = {};

    if (!formData.title.trim()) err.title = "Title is required";
    if (!formData.description.trim()) err.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0) err.price = "Valid price required";
    if (!formData.page_count || Number(formData.page_count) <= 0)
      err.page_count = "Valid page count required";
    if (!formData.image) err.image = "Image required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix errors");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Login required");
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const toastId = toast.loading("Publishing book...");

      const res = await api.post("/api/books", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const created = res?.data?.data;

      if (created && setProducts) {
        setProducts((prev) => [created, ...(prev || [])]);
      }

      toast.update(toastId, {
        render: "Book published successfully 📚",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/display");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-10">

          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">

            {/* HEADER */}
            <div className="bg-dark text-white p-4">
              <h3 className="fw-bold mb-1">📚 Create New Book Listing</h3>
              <small className="opacity-75">
                Fill in details to publish your book
              </small>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                <div className="row g-4">

                  {/* LEFT SIDE - FORM */}
                  <div className="col-md-7">

                    {/* TITLE */}
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      name="title"
                      className={`form-control mb-2 ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="text-danger small">{errors.title}</div>
                    )}

                    {/* DESCRIPTION */}
                    <label className="form-label fw-semibold mt-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      className={`form-control mb-2 ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <div className="text-danger small">
                        {errors.description}
                      </div>
                    )}

                    {/* EXCERPT */}
                    <label className="form-label fw-semibold mt-2">
                      Excerpt (Optional)
                    </label>
                    <textarea
                      name="excerpt"
                      rows="2"
                      className="form-control mb-2"
                      onChange={handleChange}
                    />

                    {/* PRICE + PAGE COUNT */}
                    <div className="row">
                      <div className="col">
                        <label className="form-label fw-semibold">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          className={`form-control ${
                            errors.price ? "is-invalid" : ""
                          }`}
                          onChange={handleChange}
                        />
                        {errors.price && (
                          <div className="text-danger small">
                            {errors.price}
                          </div>
                        )}
                      </div>

                      <div className="col">
                        <label className="form-label fw-semibold">
                          Pages
                        </label>
                        <input
                          type="number"
                          name="page_count"
                          className={`form-control ${
                            errors.page_count ? "is-invalid" : ""
                          }`}
                          onChange={handleChange}
                        />
                        {errors.page_count && (
                          <div className="text-danger small">
                            {errors.page_count}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* IMAGE */}
                    <label className="form-label fw-semibold mt-3">
                      Cover Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className={`form-control ${
                        errors.image ? "is-invalid" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {errors.image && (
                      <div className="text-danger small">
                        {errors.image}
                      </div>
                    )}

                    {/* BUTTON */}
                    <button
                      type="submit"
                      className="btn btn-dark w-100 mt-4 py-2"
                      disabled={loading}
                    >
                      {loading ? "Publishing..." : "Publish Book"}
                    </button>
                  </div>

                  {/* RIGHT SIDE - PREVIEW */}
                  <div className="col-md-5">

                    <div className="border rounded-3 p-3 text-center h-100">

                      <h6 className="fw-bold mb-3">Live Preview</h6>

                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "250px" }}
                        />
                      ) : (
                        <div className="text-muted">
                          No image selected
                        </div>
                      )}

                      <hr />

                      <h5 className="fw-bold">
                        {formData.title || "Book Title"}
                      </h5>

                      <p className="text-muted small">
                        {formData.description || "Description preview..."}
                      </p>

                      <h6 className="text-success fw-bold">
                        ₹{formData.price || "0"}
                      </h6>

                    </div>
                  </div>

                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FormPage;