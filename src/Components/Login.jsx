import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [showForgot, setShowForgot] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ❌ Hide forgot password initially
      setShowForgot(false);

      const res = await api.post("/api/auth/login", form);

      // ✅ Save token
      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      // ✅ Save user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.data)
      );

      toast.success("Login successful 🎉");

      navigate("/");

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Login failed"
      );

      // ✅ SHOW FORGOT PASSWORD ONLY IF PASSWORD WRONG
      if (
        err.response?.data?.message ===
        "Invalid email or password"
      ) {
        setShowForgot(true);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow border-0 rounded-4 p-4">

            <h2 className="text-center fw-bold mb-4">
               Login
            </h2>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ✅ ONLY SHOW AFTER WRONG PASSWORD */}
              {showForgot && (
                <div className="text-end mb-3">
                  <Link
                    to="/forgot-password"
                    className="text-danger text-decoration-none small"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* SIGNUP */}
            <div className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/signup">
                Signup
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;