import "./App.css";
import "./styles/design-system.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LandingPageComponents } from "./components/LandingPage";
// Pages
import Login from "./components/LoginPage";
import Register from "./components/RegisterPage";
import MainPage from "./components/MainPage";
import NewReleasesPage from "./components/NewReleasesPage";
import MenPage from "./components/MenPage";
import WomenPage from "./components/WomenPage";
import BrandsPage from "./components/BrandsPage";
import SalePage from "./components/SalePage";
import AdminPanel from "./components/AdminPanel";
import VendorDashboard from "./components/vendor/VendorDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import VendorManagement from "./components/AdminComponents/VendorManagement";
import UserManagement from "./components/AdminComponents/UserManagement";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No AuthRedirect wrapper */}
        <Route path="/" element={<LandingPageComponents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-releases" element={<NewReleasesPage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/sale" element={<SalePage />} />
        
        {/* Protected Routes */}
        
        {/* Customer Main Page */}
        <Route 
          path="/main" 
          element={
            <ProtectedRoute requiredRole="customer">
              <MainPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin-panel" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendor-management" 
          element={
            <ProtectedRoute requiredRole="admin">
              <VendorManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Vendor Routes */}
        <Route 
          path="/vendor-dashboard" 
          element={
            <ProtectedRoute requiredRole="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Customer Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
