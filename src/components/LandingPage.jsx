import { Header } from "./LandingPageComponents/Header";
import { Hero } from "./LandingPageComponents/Hero";
import { Categories } from "./LandingPageComponents/Categories";
import { FeaturedProducts } from "./LandingPageComponents/FeaturedProducts";
import { Newsletter } from "./LandingPageComponents/Newsletter";
import { Footer } from "./LandingPageComponents/Footer";

export function LandingPageComponents() {
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
