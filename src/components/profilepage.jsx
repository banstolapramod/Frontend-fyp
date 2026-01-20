import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/auth.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================
     LOAD PROFILE
  ========================= */
  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => {
        setUser(res.data);
        setProfileForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  /* =========================
     UPDATE PROFILE
  ========================= */
  const updateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.put("/auth/profile", profileForm);
      setMessage("Profile updated successfully");
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */
  const changePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      await api.put("/auth/profile/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setMessage("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="dashboard-container fade-in">
        <h1>My Profile</h1>

        {message && <p style={{ color: "lightgreen" }}>{message}</p>}
        {error && <p className="error">{error}</p>}

        {/* PROFILE UPDATE */}
        <div className="card slide-up" style={{ marginBottom: "2rem" }}>
          <h3>Update Profile</h3>

          <form onSubmit={updateProfile}>
            <input
              placeholder="Name"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              required
            />

            <input
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
            />

            <button type="submit">Save Changes</button>
          </form>
        </div>

        {/* PASSWORD CHANGE */}
        <div className="card slide-up">
          <h3>Change Password</h3>

          <form onSubmit={changePassword}>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              required
            />

            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
