import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Store } from "lucide-react";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer", // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All required fields must be filled");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("🚀 Registering user with role:", form.role);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      console.log("✅ Registration success:", res.data);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Redirect based on role
      if (form.role === "vendor") {
        // Vendor needs approval, show message and redirect to login
        alert("Your vendor account has been created! Please wait for admin approval before you can access the vendor dashboard.");
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("❌ Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <h3 className="text-center mb-3 fw-bold">Create Account</h3>
              <p className="text-center text-muted mb-4">
                Join Sneakers Spot today
              </p>

              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">I want to register as:</label>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div
                        onClick={() => handleRoleSelect("customer")}
                        className={`card h-100 cursor-pointer transition-all ${
                          form.role === "customer"
                            ? "border-primary border-3 bg-primary bg-opacity-10"
                            : "border-2"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${
                              form.role === "customer"
                                ? "bg-primary text-white"
                                : "bg-light text-dark"
                            }`}
                            style={{ width: "60px", height: "60px" }}
                          >
                            <User size={30} />
                          </div>
                          <h5 className="fw-bold mb-2">Customer</h5>
                          <p className="text-muted small mb-0">
                            Browse and purchase sneakers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        onClick={() => handleRoleSelect("vendor")}
                        className={`card h-100 cursor-pointer transition-all ${
                          form.role === "vendor"
                            ? "border-success border-3 bg-success bg-opacity-10"
                            : "border-2"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${
                              form.role === "vendor"
                                ? "bg-success text-white"
                                : "bg-light text-dark"
                            }`}
                            style={{ width: "60px", height: "60px" }}
                          >
                            <Store size={30} />
                          </div>
                          <h5 className="fw-bold mb-2">Vendor</h5>
                          <p className="text-muted small mb-0">
                            Sell your sneakers online
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 123-4567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">Min. 6 characters</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn w-100 py-2 text-white ${
                    form.role === "vendor" ? "btn-success" : "btn-dark"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </>
                  ) : (
                    `Create ${form.role === "vendor" ? "Vendor" : "Customer"} Account`
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted">Already have an account?</span>{" "}
                <a href="/login" className="fw-semibold text-decoration-none">
                  Sign in
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-muted mt-3 small">
            © {new Date().getFullYear()} Sneakers Spot
          </p>
        </div>
      </div>
    </div>
  );
}
