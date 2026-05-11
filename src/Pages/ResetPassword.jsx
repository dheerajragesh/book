import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ FORM DATA
      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      await api.post(
        "/api/auth/reset-password",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Password reset successful 🎉");

      // ✅ REDIRECT LOGIN
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <div className="col-md-5 mx-auto">

        <div className="card shadow border-0 rounded-4 p-4">

          <h3 className="fw-bold text-center mb-4">
            🔐 Reset Password
          </h3>

          <form onSubmit={handleReset}>

            {/* EMAIL */}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {/* BUTTON */}
            <button
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;