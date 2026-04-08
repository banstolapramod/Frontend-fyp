import { X, Search, TrendingUp, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { formatPrice } from "../../utils/currency";

const TRENDING = ["Sneakers", "Running Shoes", "Casual Shoes", "Formal Shoes", "ASICS", "Nike", "Adidas"];

export function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Load popular products on open
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    fetch("http://localhost:5001/api/products/public?limit=6")
      .then(r => r.json())
      .then(d => setPopular(d.products || []))
      .catch(() => {});
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`http://localhost:5001/api/products/public?search=${encodeURIComponent(query)}&limit=10`)
        .then(r => r.json())
        .then(d => setResults(d.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.product_id}`);
    onClose();
    setQuery("");
  };

  const imgSrc = (p) => {
    if (!p.image_url) return null;
    return p.image_url.startsWith("http") ? p.image_url : `http://localhost:5001${p.image_url}`;
  };

  const ProductRow = ({ product }) => (
    <button
      onClick={() => handleProductClick(product)}
      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left w-full border border-gray-100 hover:border-gray-200"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {imgSrc(product)
          ? <img src={imgSrc(product)} alt={product.name} className="w-full h-full object-cover" />
          : <Package className="w-6 h-6 text-gray-300" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-semibold text-sm truncate">{product.name}</p>
        <p className="text-gray-500 text-xs">{product.brand} · {product.category}</p>
      </div>
      <p className="text-gray-900 font-bold text-sm flex-shrink-0">{formatPrice(product.price)}</p>
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white max-w-2xl mx-auto mt-16 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search sneakers, brands, categories..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base"
          />
          {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin flex-shrink-0" />}
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[500px] overflow-y-auto">
          {!query.trim() ? (
            <>
              {/* Trending */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-semibold text-gray-700">Trending</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map(t => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular */}
              {popular.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Popular Products</p>
                  <div className="space-y-2">
                    {popular.map(p => <ProductRow key={p.product_id} product={p} />)}
                  </div>
                </div>
              )}
            </>
          ) : results.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-semibold text-gray-900">{results.length}</span> results for "{query}"
              </p>
              <div className="space-y-2">
                {results.map(p => <ProductRow key={p.product_id} product={p} />)}
              </div>
            </div>
          ) : !loading ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold mb-1">No results found</p>
              <p className="text-gray-400 text-sm">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
