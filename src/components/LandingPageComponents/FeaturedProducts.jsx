import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 329,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1684918652908-8c5b4a154781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3JkYW4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjQ1NTg3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    price: 189,
    image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXMlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDUxMTA3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  },
  {
    id: 3,
    name: "Adidas Yeezy Boost 350 V2",
    brand: "Adidas",
    price: 279,
    originalPrice: 320,
    image: "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGlkYXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjQ1MDgxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "Like New"
  },
  {
    id: 4,
    name: "New Balance 550 White Navy",
    brand: "New Balance",
    price: 149,
    image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjQ0OTM0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  },
  {
    id: 5,
    name: "Nike Air Max 97",
    brand: "Nike",
    price: 219,
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzY0NTUwMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  },
  {
    id: 6,
    name: "Jordan 4 Military Black",
    brand: "Nike",
    price: 389,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc2hvZXN8ZW58MXx8fHwxNzY0NDc1MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "Like New"
  },
  {
    id: 7,
    name: "Converse Chuck 70 High",
    brand: "Converse",
    price: 95,
    image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjQ0OTM0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  },
  {
    id: 8,
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    price: 119,
    image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hvZXMlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDUxMTA3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    condition: "New"
  }
];

export function FeaturedProducts() {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/new-releases');
  };
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h2 className="heading-2 text-gray-900 mb-2">Featured Sneakers</h2>
            <p className="body-large text-gray-600">Handpicked exclusives for you</p>
          </div>
          <button 
            onClick={handleViewAll}
            className="btn btn-secondary group"
          >
            View All
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
