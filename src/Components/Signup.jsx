import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  // ================= VALIDATIONS =================
  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordValidation = {
    minLength: form.password.length >= 8,
    upperCase: /[A-Z]/.test(form.password),
    lowerCase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    specialChar:
      /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  };

  const strongPassword =
    passwordValidation.minLength &&
    passwordValidation.upperCase &&
    passwordValidation.lowerCase &&
    passwordValidation.number &&
    passwordValidation.specialChar;

  const nameValid = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIRST NAME
    if (!nameValid(form.firstName)) {
      return toast.error(
        "First name should contain only letters"
      );
    }

    // LAST NAME
    if (!nameValid(form.lastName)) {
      return toast.error(
        "Last name should contain only letters"
      );
    }

    // EMAIL
    if (!emailValid) {
      return toast.error("Please enter a valid email");
    }

    // PASSWORD
    if (!strongPassword) {
      return toast.error(
        "Please create a stronger password"
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);

      const res = await api.post(
        "/api/auth/signup",
        formData
      );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.data)
      );

      toast.success("Signup successful 🎉");

      navigate("/display");

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Signup failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow border-0 rounded-4 p-4"
        style={{ width: "100%", maxWidth: "450px" }}
      >

        {/* TITLE */}
        <div className="text-center mb-4">

          <h2 className="fw-bold">
            Create Account
          </h2>

          <p className="text-muted small mb-0">
            Signup to continue
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* FIRST NAME */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              className="form-control"
              required
              value={form.firstName}
              onChange={handleChange}
            />

            {form.firstName &&
              !nameValid(form.firstName) && (
                <small className="text-danger">
                  Only letters allowed
                </small>
              )}

          </div>

          {/* LAST NAME */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              className="form-control"
              required
              value={form.lastName}
              onChange={handleChange}
            />

            {form.lastName &&
              !nameValid(form.lastName) && (
                <small className="text-danger">
                  Only letters allowed
                </small>
              )}

          </div>

          {/* EMAIL */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-control"
              required
              value={form.email}
              onChange={handleChange}
            />

            {form.email && !emailValid && (
              <small className="text-danger">
                Invalid email format
              </small>
            )}

          </div>

          {/* PASSWORD */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="form-control"
              required
              value={form.password}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD VALIDATION */}
          <div className="mb-3">

            <small
              className={
                passwordValidation.minLength
                  ? "text-success"
                  : "text-danger"
              }
            >
              ✔ Minimum 8 characters
            </small>

            <br />

            <small
              className={
                passwordValidation.upperCase
                  ? "text-success"
                  : "text-danger"
              }
            >
              ✔ One uppercase letter
            </small>

            <br />

            <small
              className={
                passwordValidation.lowerCase
                  ? "text-success"
                  : "text-danger"
              }
            >
              ✔ One lowercase letter
            </small>

            <br />

            <small
              className={
                passwordValidation.number
                  ? "text-success"
                  : "text-danger"
              }
            >
              ✔ One number
            </small>

            <br />

            <small
              className={
                passwordValidation.specialChar
                  ? "text-success"
                  : "text-danger"
              }
            >
              ✔ One special character
            </small>

          </div>

          {/* PASSWORD STRENGTH */}
          {form.password.length > 0 && (
            <div className="mb-3">

              <span
                className={`badge ${
                  strongPassword
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {strongPassword
                  ? "Strong Password 💪"
                  : "Weak Password"}
              </span>

            </div>
          )}

          {/* ROLE */}
          <div className="mb-4">

            <label className="form-label fw-semibold d-block mb-2">
              Select Role
            </label>

            <div className="d-flex align-items-center gap-4">

              {/* USER */}
              <div className="form-check d-flex align-items-center gap-2">

                <input
                  className="form-check-input m-0"
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={handleChange}
                  id="userRole"
                />

                <label
                  className="form-check-label"
                  htmlFor="userRole"
                >
                  User
                </label>

              </div>

              {/* SELLER */}
              <div className="form-check d-flex align-items-center gap-2">

                <input
                  className="form-check-input m-0"
                  type="radio"
                  name="role"
                  value="seller"
                  checked={form.role === "seller"}
                  onChange={handleChange}
                  id="sellerRole"
                />

                <label
                  className="form-check-label"
                  htmlFor="sellerRole"
                >
                  Seller
                </label>

              </div>

            </div>

          </div>

          {/* BUTTON */}
          <button
            className="btn btn-dark w-100 py-2 fw-semibold"
            disabled={loading || !strongPassword}
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="mt-4 text-center small mb-0">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-decoration-none fw-semibold"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
}

export default Signup;