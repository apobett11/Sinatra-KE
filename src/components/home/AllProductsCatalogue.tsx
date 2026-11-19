import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ChevronDown,
  Check,
  Search as SearchIcon,
} from 'lucide-react';
import { StandardProductCard } from '../common/StandardProductCard';
import { SearchCapsule } from '../common/SearchCapsule';
import { FilterModal } from '../common/FilterModal';
import { AudienceClass, FilterState, Product, ProductCategory, StyleAttribute } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AllProductsCatalogueProps {
  products: Product[];
  initialCategory?: ProductCategory | 'all';
  title?: string;
  subtitle?: string;
  hideHeaderBanner?: boolean;
}

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'tshirts', label: 'T-Shirts' },
  { id: 'sweatshirts', label: 'Sweatshirts' },
  { id: 'trousers', label: 'Trousers' },
];

export const AllProductsCatalogue: React.FC<AllProductsCatalogueProps> = ({
  products,
  initialCategory = 'all',
  title = 'All Products',
  subtitle = 'Explore the full Sinatra campus collection',
  hideHeaderBanner = false,
}) => {
  const { isDark } = useTheme();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    audiences: [],
    styles: [],
    sizes: [],
    colors: [],
    priceRange: [0, 5000],
    inStockOnly: false,
    minRating: 0,
    searchQuery: '',
    sortBy: 'newest',
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  // Keep category in sync with initialCategory prop
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  // Sync search parameters (e.g. ?audience=Men or ?style=Streetwear)
  useEffect(() => {
    const aud = searchParams.get('audience') as AudienceClass | null;
    const sty = searchParams.get('style') as StyleAttribute | null;
    const q = searchParams.get('q') || searchParams.get('search');
    if (aud || sty || q) {
      setFilters((prev) => ({
        ...prev,
        audiences: aud ? [aud] : prev.audiences,
        styles: sty ? [sty] : prev.styles,
        searchQuery: q || prev.searchQuery,
      }));
    }
  }, [searchParams]);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCategoryLabel =
    CATEGORIES.find((cat) => cat.id === filters.category)?.label || 'All Products';

  // Active filter count (excluding category and sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.audiences.length > 0) count += filters.audiences.length;
    if (filters.styles.length > 0) count += filters.styles.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.priceRange[1] < 5000) count += 1;
    if (filters.inStockOnly) count += 1;
    if (filters.minRating > 0) count += 1;
    return count;
  }, [filters]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category (independent from audience class)
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // 2. Audience Class (Men, Ladies, Unisex)
      if (filters.audiences.length > 0 && !filters.audiences.includes(product.audience)) {
        return false;
      }

      // 3. Style (Streetwear, Casual, Official)
      if (filters.styles.length > 0 && !filters.styles.includes(product.style)) {
        return false;
      }

      // 4. Sizes
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((sz) => product.sizes.includes(sz));
        if (!hasSize) return false;
      }

      // 5. Colors
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c) =>
          product.colors.some((pc) => pc.name.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      // 6. Price
      if (product.price > filters.priceRange[1]) {
        return false;
      }

      // 7. Stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 8. Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.categoryLabel.toLowerCase().includes(q) ||
          product.audience.toLowerCase().includes(q) ||
          product.style.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'popular') return b.reviewCount - a.reviewCount;
      // Default: newest
      return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
    });
  }, [products, filters]);

  const displayedProducts = filteredProducts;

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      audiences: [],
      styles: [],
      sizes: [],
      colors: [],
      priceRange: [0, 5000],
      inStockOnly: false,
      minRating: 0,
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  return (
    <section className="w-full py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {!hideHeaderBanner && (
          <div className="mb-4 sm:mb-5">
            <h2
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        )}

        {/* ONE UNIFIED ALL-PRODUCTS CARD: Categories bar and all products contained within */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-colors ${
            isDark
              ? 'bg-[#0e1825] border-[#18273a] shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
              : 'bg-white border-[#ede4d8] shadow-sm'
          }`}
        >
          {/* TOOLBAR: Inline categories and filter controls strictly on ONE line */}
          <div
            className={`p-1.5 sm:p-2 rounded-xl border mb-3 sm:mb-4 flex items-center justify-between gap-1.5 sm:gap-2 flex-nowrap transition-colors ${
              isDark ? 'bg-[#121c2a] border-[#1e2d40]' : 'bg-[#faf6f0] border-[#ede4d8]'
            }`}
          >
            {/* 1. Categories Dropdown */}
            <div className="relative flex-shrink-0" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isCategoryDropdownOpen}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-all duration-150 cursor-pointer ${
                  filters.category !== 'all'
                    ? 'border-[#c85028] text-[#c85028] bg-[#c85028]/10'
                    : isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-gray-200 hover:border-gray-500'
                    : 'bg-white border-[#ede4d8] text-gray-800 hover:border-gray-300 shadow-2xs'
                }`}
              >
                <span className="truncate max-w-[85px] sm:max-w-none">{currentCategoryLabel}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-[#c85028]' : 'text-gray-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div
                  className={`absolute left-0 mt-2 w-48 rounded-xl p-1.5 z-40 border shadow-2xl backdrop-blur-md transition-all animate-in fade-in-50 zoom-in-95 ${
                    isDark
                      ? 'bg-[#121926] border-[#1e293b] text-white shadow-black/70'
                      : 'bg-white border-[#ede4d8] text-gray-800 shadow-xl'
                  }`}
                  role="listbox"
                >
                  {CATEGORIES.map((cat) => {
                    const isSelected = filters.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, category: cat.id }));
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                          isSelected
                            ? isDark
                              ? 'bg-[#c85028]/20 text-[#fe8547]'
                              : 'bg-[#c85028]/10 text-[#c85028]'
                            : isDark
                            ? 'hover:bg-[#1a2334] text-gray-300 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#c85028] stroke-[2.5]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Search Capsule (flex-1 inline) */}
            <div className="flex-1 min-w-0">
              <SearchCapsule
                value={filters.searchQuery}
                onChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
                placeholder="Search..."
              />
            </div>

            {/* 3. Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex-shrink-0 relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer ${
                activeFilterCount > 0
                  ? 'border-[#c85028] text-[#c85028] bg-[#c85028]/10'
                  : isDark
                  ? 'bg-[#1a2334] border-[#1e293b] text-gray-300 hover:border-gray-500'
                  : 'bg-white border-[#ede4d8] text-gray-800 hover:border-gray-300 shadow-2xs'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c85028]" />
              <span className="text-[11px] sm:text-xs">Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c85028] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        {/* ACTIVE FILTERS CHIPS */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs text-gray-400">Active filters:</span>
            {filters.audiences.map((aud) => (
              <span
                key={aud}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#c85028]/15 text-[#c85028] flex items-center gap-1"
              >
                {aud}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      audiences: prev.audiences.filter((a) => a !== aud),
                    }))
                  }
                  className="hover:text-red-500 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.styles.map((st) => (
              <span
                key={st}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#c85028]/15 text-[#c85028] flex items-center gap-1"
              >
                {st}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      styles: prev.styles.filter((s) => s !== st),
                    }))
                  }
                  className="hover:text-red-500 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs text-gray-400 hover:text-[#c85028] underline ml-2 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        {/* MAIN PRODUCT GRID (EXACT SAME COMPACT STANDARD PRODUCT CARD) */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {displayedProducts.map((product) => (
              <StandardProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className={`p-10 text-center rounded-2xl border ${
              isDark ? 'bg-[#121c2a] border-[#1e2d40]' : 'bg-[#faf6f0] border-[#ede4d8]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#c85028]/10 text-[#c85028] flex items-center justify-center mx-auto mb-3">
              <SearchIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">No products match your criteria</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              Try adjusting your search query, clearing filters, or switching categories.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#c85028] text-white text-xs font-bold hover:bg-[#b3441e] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Filter Modal / Bottom Sheet */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        onResetFilters={handleResetFilters}
        totalProductsCount={filteredProducts.length}
      />
    </section>
  );
};
