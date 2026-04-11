import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FormPage({ setProducts }) {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f8f9fa";
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
    if (!formData.details.trim() || formData.details.length < 5)
      newErrors.details = "Description is too short";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Enter valid price";
    if (!formData.image) newErrors.image = "Please upload image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({
          ...formData,
          image: URL.createObjectURL(file),
        });
      }
    } else {
      const nextValue =
        name === "name" || name === "details"
          ? normalizeText(value)
          : value;

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

      setProducts((prev) => [
        ...prev,
        { id: Date.now(), ...cleaned },
      ]);

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #141e30, #243b55)"
          : "linear-gradient(135deg, #667eea, #764ba2)",
        transition: "all 0.3s ease",
      }}
    >
      {/* 🌙 Toggle */}
      <div className="position-absolute top-0 end-0 p-3">
        <button onClick={toggleTheme} className="btn btn-sm btn-light shadow">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* 🎉 SUCCESS ANIMATION OVERLAY */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="checkmark">✔</div>
            <h4>Successfully Added!</h4>
          </div>
        </div>
      )}

      <div className="col-11 col-sm-8 col-md-6 col-lg-4">
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            background: darkMode
              ? "rgba(30,30,30,0.9)"
              : "rgba(255,255,255,0.9)",
            color: darkMode ? "#fff" : "#000",
            transition: "all 0.3s ease",
          }}
        >
          <div className="text-center mb-3">
            <h3 className="fw-bold">📚 Add New Book</h3>
            <p className="small text-muted">Fill in book details</p>
          </div>

          {/* 📸 IMAGE (ONLY WHEN EXISTS) */}
          {formData.image && (
            <img
              src={formData.image}
              alt="preview"
              className="img-fluid shadow preview-top mb-3"
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="mb-3">
              <input
                name="name"
                className={`form-control modern-input ${
                  darkMode ? "dark-input" : ""
                } ${errors.name ? "is-invalid" : ""}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Book Title"
              />
              <div className="invalid-feedback">{errors.name}</div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <textarea
                name="details"
                rows="3"
                className={`form-control modern-input ${
                  darkMode ? "dark-input" : ""
                } ${errors.details ? "is-invalid" : ""}`}
                value={formData.details}
                onChange={handleChange}
                placeholder="Description"
              />
              <div className="invalid-feedback">{errors.details}</div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-light">₹</span>
                <input
                  type="number"
                  name="price"
                  className={`form-control modern-input ${
                    darkMode ? "dark-input" : ""
                  } ${errors.price ? "is-invalid" : ""}`}
                  onChange={handleChange}
                  placeholder="Price"
                />
              </div>
              <div className="text-danger small">{errors.price}</div>
            </div>

            {/* Image */}
            <div className="mb-3">
              <input
                type="file"
                name="image"
                className={`form-control ${
                  errors.image ? "is-invalid" : ""
                }`}
                accept="image/*"
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.image}</div>
            </div>

            {/* Button */}
            <button className="btn btn-gradient w-100 fw-bold py-2">
              ➕ Add Book
            </button>
          </form>
        </div>
      </div>

      {/* 🎨 STYLES */}
      <style>{`
        .modern-input {
          border-radius: 12px;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .modern-input:focus {
          box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
          border-color: #667eea;
        }

        .dark-input {
          background-color: #2b2b2b;
          color: #fff;
          border: 1px solid #444;
        }

        .dark-input::placeholder {
          color: #aaa;
        }

        .btn-gradient {
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          transition: all 0.3s ease;
        }

        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .preview-top {
          max-height: 180px;
          width: 100%;
          object-fit: cover;
          border-radius: 15px;
          transition: transform 0.3s ease;
        }

        .preview-top:hover {
          transform: scale(1.03);
        }

        /* 🎉 SUCCESS ANIMATION */
        .success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        .success-box {
          background: #fff;
          padding: 30px 40px;
          border-radius: 20px;
          text-align: center;
          animation: popIn 0.4s ease;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .checkmark {
          font-size: 55px;
          color: #28a745;
          margin-bottom: 10px;
          animation: bounce 0.6s ease;
        }

        .success-box h4 {
          margin: 0;
          font-weight: 700;
          color: #333;
        }

        @keyframes popIn {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default FormPage;