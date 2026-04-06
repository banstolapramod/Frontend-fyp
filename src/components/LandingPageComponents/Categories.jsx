import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FOOTER_CATEGORIES = ['Formal Shoes', 'Running Shoes', 'Casual Shoes', 'Sneakers'];

// Fallback images keyed by category name (case-insensitive partial match)
const CATEGORY_IMAGES = {
  basketball: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
  running:    "https://images.unsplash.com/photo-1597892657493-6847b9640bac?w=800&q=80",
  sneakers:   "https://images.unsplash.com/photo-1684918652908-8c5b4a154781?w=800&q=80",
  casual:     "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  training:   "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?w=800&q=80",
  boots:      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  sandals:    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
  formal:     "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
  athletic:   "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
  default:    "https://images.unsplash.com/photo-1608384177866-0bca0d225435?w=800&q=80",
};

function getCategoryImage(name) {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CATEGORY_IMAGES.default;
}

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/categories/public")
      .then(r => r.json())
      .then(data => {
        const all = data.categories || [];
        // Only show categories that appear in the footer
        const filtered = FOOTER_CATEGORIES
          .map(name => all.find(c => c.name === name))
          .filter(Boolean);
        setCategories(filtered);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );

  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="heading-2 text-gray-900 mb-4">Shop by Category</h2>
          <p className="body-large text-gray-600 max-w-2xl mx-auto">
            Find the perfect sneakers for every activity
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.category_id}
              onClick={() => navigate(`/category/${category.category_id}`)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square card animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={getCategoryImage(category.name)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="heading-5 mb-1">{category.name}</h3>
                {category.description && (
                  <p className="body-small text-gray-300 opacity-90 line-clamp-1">{category.description}</p>
                )}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
