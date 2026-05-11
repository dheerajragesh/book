import React, { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= PASSWORD VALIDATION =================
  const passwordValidation = {
    minLength: newPassword.length >= 8,
    upperCase: /[A-Z]/.test(newPassword),
    lowerCase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isStrongPassword =
    passwordValidation.minLength &&
    passwordValidation.upperCase &&
    passwordValidation.lowerCase &&
    passwordValidation.number &&
    passwordValidation.specialChar;

  // ================= EMAIL VALIDATION =================
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ================= VERIFY EMAIL =================
  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    // ✅ EMAIL VALIDATION
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/api/auth/forgot-password",
        { email }
      );

      toast.success(
        res.data.message || "Email verified successfully"
      );

      setStep(2);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Email verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // ✅ STRONG PASSWORD VALIDATION
    if (!isStrongPassword) {
      return toast.error(
        "Please create a stronger password"
      );
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/api/auth/reset-password",
        {
          email,
          password: newPassword,
        }
      );

      toast.success(
        res.data.message ||
          "Password reset successful 🎉"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow border-0 rounded-4 p-4">

            <h3 className="fw-bold text-center mb-4">
              🔐 Forgot Password
            </h3>

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <form onSubmit={handleVerifyEmail}>

                <div className="mb-3">

                  <label className="form-label">
                    Enter Your Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                  {/* EMAIL VALIDATION */}
                  {email && !validateEmail(email) && (
                    <small className="text-danger">
                      Invalid email format
                    </small>
                  )}

                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify Email"}
                </button>

              </form>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <form onSubmit={handleResetPassword}>

                <div className="mb-3">

                  <label className="form-label">
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    required
                  />

                </div>

                {/* ================= PASSWORD STRENGTH ================= */}
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

                {/* PASSWORD STRENGTH BADGE */}
                <div className="mb-3">

                  {newPassword.length > 0 && (
                    <span
                      className={`badge ${
                        isStrongPassword
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {isStrongPassword
                        ? "Strong Password 💪"
                        : "Weak Password"}
                    </span>
                  )}

                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading || !isStrongPassword}
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}
                </button>

              </form>
            )}

            {/* BACK LOGIN */}
            <div className="text-center mt-3">
              <Link to="/login">
                Back to Login
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;