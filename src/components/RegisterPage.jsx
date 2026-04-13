import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Store } from "lucide-react";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleSelect = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("All required fields must be filled"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role,
      });
      if (form.role === "vendor") {
        alert("Your vendor account has been created! Please wait for admin approval.");
        navigate("/login");
      } else {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join Sneakers Spot today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">I want to register as:</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: 'customer', icon: User,  title: 'Customer', desc: 'Browse and purchase sneakers', active: 'border-gray-900 bg-gray-50' },
                  { role: 'vendor',   icon: Store, title: 'Vendor',   desc: 'Sell your sneakers online',   active: 'border-green-600 bg-green-50' },
                ].map(({ role, icon: Icon, title, desc, active }) => (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                      form.role === role ? active : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      form.role === role
                        ? role === 'vendor' ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <p className="font-bold text-sm text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition" />
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition" />
                <p className="text-xs text-gray-400 mt-1">Min. 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                form.role === 'vendor' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : `Create ${form.role === 'vendor' ? 'Vendor' : 'Customer'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-gray-900 font-semibold hover:underline">Sign in</a>
          </p>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          © {new Date().getFullYear()} Sneakers Spot
        </p>
      </div>
    </div>
  );
}
