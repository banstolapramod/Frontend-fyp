import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/products/public?limit=8")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h2 className="heading-2 text-gray-900 mb-2">Featured Sneakers</h2>
            <p className="body-large text-gray-600">Handpicked exclusives for you</p>
          </div>
          <button
            onClick={() => navigate("/new-releases")}
            className="btn btn-secondary bg-black text-sm group"
          >
            View All
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.product_id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product.product_id}
                  name={product.name}
                  brand={product.brand}
                  price={parseFloat(product.price)}
                  image={
                    product.image_url
                      ? product.image_url.startsWith("http")
                        ? product.image_url
                        : `http://localhost:5001${product.image_url}`
                      : null
                  }
                  condition="New"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
