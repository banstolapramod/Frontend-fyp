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
import ProductDetailPage from "./components/ProductDetailPage";
import CartPage from "./components/CartPage";
import FavouritesPage from "./components/FavouritesPage";
import CheckoutPage from "./components/CheckoutPage";
import OrdersPage from "./components/OrdersPage";
import VendorProfilePage from "./components/VendorProfilePage";
import CategoryPage from "./components/CategoryPage";
// import CartPage from "./components/CartPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPageComponents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-releases" element={<NewReleasesPage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/vendor/:vendorId" element={<VendorProfilePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        
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
              <CustomerDashboard initialTab="dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard initialTab="profile" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard initialTab="favorites" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard initialTab="settings" />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
