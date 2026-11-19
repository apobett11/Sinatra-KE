import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Search as SearchIcon } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { StandardProductCard } from '../components/common/StandardProductCard';
import { SearchCapsule } from '../components/common/SearchCapsule';
import { useTheme } from '../context/ThemeContext';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { isDark } = useTheme();

  const handleQueryChange = (newQuery: string) => {
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return INITIAL_PRODUCTS;
    const q = query.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.audience.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="w-full pb-16">
      {/* Header */}
      <div
        className={`w-full py-4 px-4 sm:px-6 lg:px-8 border-b ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f8f2eb] border-[#ede4d8]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">Search Results</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search header & input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {query ? `Search: "${query}"` : 'All Outfits Catalogue'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Found {results.length} matching item{results.length === 1 ? '' : 's'}
            </p>
          </div>

          <SearchCapsule
            value={query}
            onChange={handleQueryChange}
            placeholder="Search hoodies, sizes, style..."
            autoExpand={true}
          />
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {results.map((product) => (
              <StandardProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className={`p-12 text-center rounded-2xl border ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-[#c85028]/10 text-[#c85028] flex items-center justify-center mx-auto mb-3">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-1">No products found for "{query}"</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              We couldn't find matches for your query. Try searching for "hoodie", "oversized", or "cargo".
            </p>
            <button
              onClick={() => handleQueryChange('')}
              className="px-4 py-2 rounded-xl bg-[#c85028] text-white text-xs font-bold hover:bg-[#b3441e] transition-colors"
            >
              Clear Search Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
