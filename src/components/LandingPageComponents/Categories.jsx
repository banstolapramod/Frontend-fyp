import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Basketball",
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc2hvZXN8ZW58MXx8fHwxNzY0NDc1MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "250+ Styles",
    route: "/men" // Basketball shoes are typically in men's section
  },
  {
    id: 2,
    name: "Running",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzY0NTUwMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "180+ Styles",
    route: "/women" // Running shoes for women's section
  },
  {
    id: 3,
    name: "Lifestyle",
    image: "https://images.unsplash.com/photo-1684918652908-8c5b4a154781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3JkYW4lMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjQ1NTg3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "320+ Styles",
    route: "/new-releases" // Lifestyle/casual shoes in new releases
  },
  {
    id: 4,
    name: "Training",
    image: "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGlkYXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NjQ1MDgxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "140+ Styles",
    route: "/sale" // Training shoes in sale section
  }
];

export function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (route) => {
    navigate(route);
  };
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
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square card animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=' + category.name;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="heading-5 mb-1 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="body-small text-gray-300 opacity-90">
                  {category.count}
                </p>
              </div>

              {/* Hover arrow */}
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
