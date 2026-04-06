import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  const handleNewArrivals = () => {
    navigate('/new-releases');
  };

  const handleShopNow = () => {
    navigate('/new-releases');
  };

  const handleViewCollection = () => {
    navigate('/brands');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-20 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="container relative z-10 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
          <div className="animate-slide-up space-y-8">
            {/* Premium Badge */}
            <div 
              onClick={handleNewArrivals}
              className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full cursor-pointer hover:bg-white/20 transition-all duration-300 group border border-white/10"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium tracking-wide group-hover:text-white transition-colors">
                ✨ New Arrivals 2024 Collection
              </span>
              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="block text-white">Step Into Premium Style</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
            </div>
            
            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Discover the world's most exclusive sneaker collection. 
              <span className="text-white font-medium"> Authentic, verified, and curated</span> for the modern sneaker enthusiast.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Happy Customers</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Premium Brands</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleShopNow}
                className="group relative px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Shop Premium Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button 
                onClick={handleViewCollection}
                className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center gap-3">
                  Explore Brands
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          
          {/* Enhanced Image Section */}
          <div className="relative animate-fade-in lg:justify-self-end">
            {/* Glow Effects */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-3xl blur-3xl opacity-60"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur-xl"></div>
            
            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop&q=80&auto=format"
                alt="Premium Sneakers Collection"
                className="w-full h-auto rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105"
                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop&q=80&auto=format';
                }}
              />
              
              {/* Floating Price Tag */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-sm font-medium">Starting from</div>
                <div className="text-xl font-bold">$149</div>
              </div>
              
              {/* Quality Badge */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Verified Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
