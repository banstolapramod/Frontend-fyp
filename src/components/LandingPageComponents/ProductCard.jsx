import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getUserData } from "../../utils/auth";
import { formatPrice } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export function ProductCard({ id, name, brand, price, originalPrice, image, condition }) {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();
  const [addingToCart, setAddingToCart] = useState(false);

  const favourite = isFavourite(id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    setAddingToCart(true);
    const result = await addToCartContext(id, 1);
    setAddingToCart(false);
    if (result.success) alert('✅ Added to cart!');
    else alert(`❌ ${result.error}`);
  };

  const handleToggleFavourite = async (e) => {
    e.stopPropagation();
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    await toggleWishlist(id);
  };

  return (
    <div className="card group cursor-pointer animate-fade-in" onClick={() => navigate(`/product/${id}`)}>
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <svg class="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  <p class="caption font-medium">No Image</p>
                </div>
              </div>
            `;
          }}
        />

        <button
          onClick={(e) => { e.stopPropagation(); handleToggleFavourite(e); }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group/heart"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 group-hover/heart:scale-110 ${
              favourite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        <div className="absolute top-3 left-3 z-10">
          <span className="badge badge-primary">
            {condition}
          </span>
        </div>

        {/* Hover overlay — pointer-events-none so it never blocks buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="card-body">
        <p className="caption text-gray-500 mb-1">{brand}</p>
        <h3 className="heading-6 text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="heading-6 text-gray-900">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="body-small text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {originalPrice && (
            <span className="badge badge-accent">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
          className="btn btn-primary w-full group/cart"
        >
          <ShoppingCart className="w-4 h-4 group-hover/cart:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}


ProductCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  brand: PropTypes.string,
  price: PropTypes.number,
  originalPrice: PropTypes.number,
  image: PropTypes.string,
  condition: PropTypes.string,
};
