import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';

export default function BrandsPage() {
  const navigate = useNavigate();
  
  const brands = [
    {
      id: 1,
      name: 'Nike',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Just Do It - Performance and style combined',
      productCount: 245,
      color: 'from-gray-900 to-gray-700'
    },
    {
      id: 2,
      name: 'Adidas',
      logo: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Impossible is Nothing - Innovation in every step',
      productCount: 198,
      color: 'from-blue-900 to-blue-700'
    },
    {
      id: 3,
      name: 'New Balance',
      logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Fearlessly Independent - Classic comfort',
      productCount: 156,
      color: 'from-red-900 to-red-700'
    },
    {
      id: 4,
      name: 'Puma',
      logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Forever Faster - Speed meets style',
      productCount: 134,
      color: 'from-yellow-900 to-yellow-700'
    },
    {
      id: 5,
      name: 'Converse',
      logo: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'All Star - Timeless classics',
      productCount: 89,
      color: 'from-purple-900 to-purple-700'
    },
    {
      id: 6,
      name: 'Vans',
      logo: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Off The Wall - Skateboard culture',
      productCount: 112,
      color: 'from-orange-900 to-orange-700'
    },
    {
      id: 7,
      name: 'Reebok',
      logo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Be More Human - Fitness focused',
      productCount: 98,
      color: 'from-green-900 to-green-700'
    },
    {
      id: 8,
      name: 'Jordan',
      logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&q=80&auto=format',
      description: 'Flight - Basketball heritage',
      productCount: 167,
      color: 'from-red-900 to-black'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Brand</h1>
          <p className="text-gray-300 text-lg">
            Explore premium sneakers from the world's top brands
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/brand/${brand.name.toLowerCase()}`)}
            >
              <div className={`relative overflow-hidden bg-gradient-to-br ${brand.color}`} style={{ height: '192px' }}>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600/1f2937/ffffff?text=' + brand.name;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute inset-0 p-6 text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">{brand.name}</h2>
                  <p className="text-white text-sm opacity-90">{brand.productCount} Products</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{brand.description}</p>
                <button className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium group-hover:bg-gray-900">
                  Shop {brand.name}
                  <ChevronRight className="w-4 h-4 inline-block ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Brands Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Shop by Brand?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 text-center">
                <span className="text-white text-2xl leading-[64px]">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">100% genuine products from authorized retailers</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 text-center">
                <span className="text-white text-2xl leading-[64px]">★</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Top-tier craftsmanship and materials</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 text-center">
                <span className="text-white text-2xl leading-[64px]">♥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Brands</h3>
              <p className="text-gray-600">Decades of heritage and innovation</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
