import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LandingPageComponents } from "./components/LandingPage";

// Pages (create these components)
import Login from "./components/LoginPage";
import Register from "./components/RegisterPage";
// import TrackOrder from "./components/TrackOrderPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPageComponents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/track-order" element={<TrackOrder />} /> */}

        {/* Protected Routes (can be wrapped later) */}
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
