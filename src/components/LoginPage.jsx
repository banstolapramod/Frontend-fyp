import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  // Check for existing authentication when component loads
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log('🔑 User already authenticated, redirecting...');
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Get redirect path from location state or default to role-based redirect
  const from = location.state?.from?.pathname || null;

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin-panel';
      case 'vendor':
        return '/vendor-dashboard';
      case 'customer':
      default:
        return '/main';
    }
  };

  // Show loading while auth context is initializing
  if (authLoading) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // Use AuthContext login method
      const result = await login(email, password);

      if (result.success) {
        console.log('🔑 Login successful:', {
          role: result.user.role,
          email: result.user.email,
          name: result.user.name
        });

        // Redirect based on role or to the page they came from
        if (from) {
          navigate(from, { replace: true });
        } else {
          const redirectPath = getRedirectPath(result.user.role);
          navigate(redirectPath, { replace: true });
        }
      } else {
        setError(result.error || 'Login failed');
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <h3 className="text-center mb-3 fw-bold">
                Welcome Back
              </h3>
              <p className="text-center text-muted mb-4">
                Sign in to continue to Sneakers Spot
              </p>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>

                  <a
                    href="/forgot-password"
                    className="text-decoration-none small"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted">
                  Don't have an account?
                </span>{" "}
                <a
                  href="/register"
                  className="fw-semibold text-decoration-none"
                >
                  Create one
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