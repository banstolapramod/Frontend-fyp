import { Mail, Gift, Zap, Shield } from "lucide-react";

export function Newsletter() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-8 animate-scale-in">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          {/* Heading */}
          <h2 className="heading-2 text-white mb-4 animate-slide-up">
            Join the Sneaker Elite
          </h2>
          <p className="body-large text-gray-300 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
            Get exclusive access to limited drops, early sales, and insider sneaker news. 
            <span className="text-white font-medium"> Join 50,000+ sneaker enthusiasts</span> who never miss a drop.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Exclusive Drops</div>
                <div className="text-sm text-gray-400">First access to limited releases</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Flash Sales</div>
                <div className="text-sm text-gray-400">Up to 70% off premium sneakers</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Insider News</div>
                <div className="text-sm text-gray-400">Latest trends and releases</div>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <div className="max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
                <span className="flex items-center gap-2">
                  Subscribe Now
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No spam, ever
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unsubscribe anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
