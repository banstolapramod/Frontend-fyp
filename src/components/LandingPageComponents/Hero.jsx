// import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-sm">New Arrivals 2024</span>
            </div>
            <h2 className="text-white mb-6">
              Step Into Style
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg">
              Discover the latest and most exclusive sneakers from top brands. 
              Authentic, verified, and ready to elevate your collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors">
                View Collection
              </button>
            </div>
          </div>
          <div className="relative">
            {/* <ImageWithFallback
              src="https://images.unsplash.com/photo-1608384177866-0bca0d225435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjQ0OTM0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Featured Sneakers"
              className="w-full h-auto rounded-lg"
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
