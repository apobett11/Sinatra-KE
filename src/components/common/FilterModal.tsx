import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { AudienceClass, FilterState, StyleAttribute } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

const AUDIENCE_OPTIONS: AudienceClass[] = ['Men', 'Ladies', 'Unisex'];
const STYLE_OPTIONS: StyleAttribute[] = ['Streetwear', 'Casual', 'Official'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'];
const COLOR_OPTIONS = [
  { name: 'Black', hex: '#111827' },
  { name: 'Cream', hex: '#f7f4ed' },
  { name: 'Terracotta', hex: '#c85028' },
  { name: 'Olive', hex: '#3f4f38' },
  { name: 'Grey', hex: '#6b7280' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalProductsCount,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const toggleAudience = (aud: AudienceClass) => {
    const next = filters.audiences.includes(aud)
      ? filters.audiences.filter((a) => a !== aud)
      : [...filters.audiences, aud];
    onUpdateFilters({ ...filters, audiences: next });
  };

  const toggleStyle = (style: StyleAttribute) => {
    const next = filters.styles.includes(style)
      ? filters.styles.filter((s) => s !== style)
      : [...filters.styles, style];
    onUpdateFilters({ ...filters, styles: next });
  };

  const toggleSize = (sz: string) => {
    const next = filters.sizes.includes(sz)
      ? filters.sizes.filter((s) => s !== sz)
      : [...filters.sizes, sz];
    onUpdateFilters({ ...filters, sizes: next });
  };

  const toggleColor = (col: string) => {
    const next = filters.colors.includes(col)
      ? filters.colors.filter((c) => c !== col)
      : [...filters.colors, col];
    onUpdateFilters({ ...filters, colors: next });
  };

  const handlePriceChange = (min: number, max: number) => {
    onUpdateFilters({ ...filters, priceRange: [min, max] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Content: Bottom sheet on mobile, centered modal on desktop */}
      <div
        className={`relative w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl border overflow-hidden animate-in slide-in-from-bottom duration-200 ${
          isDark
            ? 'bg-[#0f1724] border-[#1e293b] text-white'
            : 'bg-white border-[#ede4d8] text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg">Filter & Sort</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#c85028]/15 text-[#c85028] text-[11px] font-bold">
                {totalProductsCount} items
              </span>
            </div>
            <p className="text-xs text-gray-400">Refine by sorting, audience, size, price, & style</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c85028] px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Sections Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sort Order: Ascending / Descending & Other options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Sort Order
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'newest', label: 'Newest Drops' },
                { id: 'price_asc', label: 'Price: Low to High (Asc)' },
                { id: 'price_desc', label: 'Price: High to Low (Desc)' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'rating', label: 'Highest Rated' },
              ].map((sortOption) => {
                const active = filters.sortBy === sortOption.id;
                return (
                  <button
                    key={sortOption.id}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({
                        ...filters,
                        sortBy: sortOption.id as FilterState['sortBy'],
                      })
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left cursor-pointer ${
                      active
                        ? 'bg-[#c85028] text-white border-[#c85028] shadow-xs'
                        : isDark
                        ? 'bg-[#162030] border-[#1e293b] text-gray-300 hover:border-gray-600'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Audience Class */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Audience Class
            </label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_OPTIONS.map((aud) => {
                const active = filters.audiences.includes(aud);
                return (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => toggleAudience(aud)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? 'bg-[#c85028] text-white border-[#c85028]'
                        : isDark
                        ? 'bg-[#162030] border-[#1e293b] text-gray-300 hover:border-gray-600'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {aud}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Attributes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Style Profile
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((st) => {
                const active = filters.styles.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStyle(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? 'bg-[#c85028] text-white border-[#c85028]'
                        : isDark
                        ? 'bg-[#162030] border-[#1e293b] text-gray-300 hover:border-gray-600'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Price (KSh)
              </label>
              <span className="text-xs font-bold text-[#c85028]">
                Up to KSh {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={5000}
              step={100}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
              className="w-full accent-[#c85028] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>KSh 1,000</span>
              <span>KSh 5,000</span>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((sz) => {
                const active = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all border ${
                      active
                        ? 'bg-[#c85028] text-white border-[#c85028]'
                        : isDark
                        ? 'bg-[#162030] border-[#1e293b] text-gray-300 hover:border-gray-600'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Colour Palette
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map((c) => {
                const active = filters.colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      active
                        ? 'border-[#c85028] bg-[#c85028]/10'
                        : isDark
                        ? 'border-[#1e293b] hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {active && <Check className="w-3 h-3 text-[#c85028]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability & Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-bold">In-Stock Items Only</p>
              <p className="text-[11px] text-gray-400">Hide out of stock pieces</p>
            </div>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onUpdateFilters({ ...filters, inStockOnly: e.target.checked })}
              className="w-4 h-4 accent-[#c85028] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0b121e]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-sm shadow-md transition-colors"
          >
            Show Matching Products ({totalProductsCount})
          </button>
        </div>
      </div>
    </div>
  );
};
