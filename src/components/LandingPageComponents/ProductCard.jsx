import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";

export function ProductCard({
  name,
  brand,
  price,
  originalPrice,
  image,
  condition,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        /> */}

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
            {condition}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-500 text-sm mb-1">{brand}</p>
        <h3 className="text-gray-900 mb-2 line-clamp-1">{name}</h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-black">${price}</span>

            {originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>

        <button className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
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
