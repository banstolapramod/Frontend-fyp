import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../utils/auth';
import { Header } from "./LandingPageComponents/Header";
import { Hero } from "./LandingPageComponents/Hero";
import { Categories } from "./LandingPageComponents/Categories";
import { FeaturedProducts } from "./LandingPageComponents/FeaturedProducts";
import { Newsletter } from "./LandingPageComponents/Newsletter";
import { Footer } from "./LandingPageComponents/Footer";

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = getUserData();
    
    if (!userData || !userData.token) {
      // If not logged in, redirect to login
      navigate('/login');
      return;
    }

    // If user is not a customer, redirect to appropriate dashboard
    if (userData.role === 'admin') {
      navigate('/admin-panel');
      return;
    } else if (userData.role === 'vendor') {
      navigate('/vendor-dashboard');
      return;
    }

    console.log('✅ Customer authenticated, showing main page');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </div>
  );
}