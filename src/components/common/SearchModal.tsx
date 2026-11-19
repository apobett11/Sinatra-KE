import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.audience.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(matches);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#0f1724] border-[#1e293b] text-white' : 'bg-white border-[#ede4d8] text-gray-900'
        }`}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-800">
          <Search className="w-5 h-5 text-[#c85028] flex-shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, oversized tees, cargo trousers..."
            className={`w-full bg-transparent text-sm sm:text-base outline-none ${
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-200 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Esc
          </button>
        </form>

        {/* Quick Suggestions or Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Popular Campus Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Classic Hoodie', 'Oversized T-Shirt', 'Cargo Trousers', 'Varsity Jacket', 'Crown Cap'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800/80 hover:bg-[#c85028]/15 hover:text-[#c85028] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 mb-2">Products ({results.length})</p>
              {results.slice(0, 5).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod.slug)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 p-1"
                    />
                    <div>
                      <h4 className="text-sm font-semibold">{prod.name}</h4>
                      <p className="text-xs text-gray-500">
                        {prod.categoryLabel} • {prod.audience}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#c85028]">
                      KSh {prod.price.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full mt-3 py-2 text-center text-xs font-bold text-[#c85028] hover:underline"
              >
                View all results for "{query}" →
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm">No products found for "{query}".</p>
              <p className="text-xs mt-1">Try searching for "hoodie", "oversized", or "cargo".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
