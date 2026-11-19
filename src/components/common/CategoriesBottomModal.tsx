import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  LayoutGrid,
  Layers,
  Shirt,
  Sparkles,
  Footprints,
  ChevronRight,
  User,
  Users,
  Zap,
  Coffee,
  Briefcase,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_PRODUCTS } from '../../data/products';

export interface CategoryModalItem {
  slug: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  count: number;
  imageUrl: string;
}

export interface ClassModalItem {
  id: string;
  name: string;
  subtitle: string;
  type: 'audience' | 'style';
  value: string;
  icon: React.ElementType;
  count: number;
  imageUrl: string;
}

interface CategoriesBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (slug: string) => void;
  onSelectClass?: (type: string, value: string) => void;
  initialTab?: 'categories' | 'classes';
  onTabChange?: (tab: 'categories' | 'classes') => void;
  theme?: 'dark' | 'light';
}

export const CategoriesBottomModal: React.FC<CategoriesBottomModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectClass,
  initialTab = 'categories',
  onTabChange,
  theme: propTheme,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propTheme ? propTheme === 'dark' : contextIsDark;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'categories' | 'classes'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const handleSwitchTab = (tab: 'categories' | 'classes') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Category counts
  const categories: CategoryModalItem[] = useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return [
      {
        slug: 'hoodies',
        name: 'Hoodies & Fleeces',
        subtitle: 'Heavyweight warmth',
        icon: Shirt,
        count: counts['hoodies'] || 0,
        imageUrl: '/images/sinatra-classic-hoodie.png',
      },
      {
        slug: 'tshirts',
        name: 'T-Shirts & Tops',
        subtitle: 'Oversized & graphic',
        icon: Shirt,
        count: counts['tshirts'] || 0,
        imageUrl: '/images/sinatra-oversized-tshirt.png',
      },
      {
        slug: 'sweatshirts',
        name: 'Campus Sweatshirts',
        subtitle: 'Embroidered crewnecks',
        icon: Sparkles,
        count: counts['sweatshirts'] || 0,
        imageUrl: '/images/sinatra-signature-sweatshirt.png',
      },
      {
        slug: 'trousers',
        name: 'Trousers & Utility Cargos',
        subtitle: 'Ripstop street cargo',
        icon: Footprints,
        count: counts['trousers'] || 0,
        imageUrl: '/images/sinatra-cargo-trousers.png',
      },
    ];
  }, []);

  // Class counts & items (Audience and Style)
  const classes: ClassModalItem[] = useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_PRODUCTS.forEach((p) => {
      counts[p.audience] = (counts[p.audience] || 0) + 1;
      counts[p.style] = (counts[p.style] || 0) + 1;
    });

    return [
      {
        id: 'men',
        name: 'Men',
        subtitle: 'Campus men line',
        type: 'audience',
        value: 'Men',
        icon: User,
        count: counts['Men'] || 0,
        imageUrl: '/images/sinatra-classic-hoodie.png',
      },
      {
        id: 'ladies',
        name: 'Ladies',
        subtitle: 'Sinatra ladies line',
        type: 'audience',
        value: 'Ladies',
        icon: Sparkles,
        count: counts['Ladies'] || 0,
        imageUrl: '/images/sinatra-oversized-tshirt.png',
      },
      {
        id: 'unisex',
        name: 'Unisex',
        subtitle: 'Universal student looks',
        type: 'audience',
        value: 'Unisex',
        icon: Users,
        count: counts['Unisex'] || 0,
        imageUrl: '/images/sinatra-signature-sweatshirt.png',
      },
      {
        id: 'streetwear',
        name: 'Streetwear',
        subtitle: 'Raw campus drip',
        type: 'style',
        value: 'Streetwear',
        icon: Zap,
        count: counts['Streetwear'] || 0,
        imageUrl: '/images/sinatra-cargo-trousers.png',
      },
      {
        id: 'casual',
        name: 'Casual',
        subtitle: 'Everyday lecture fits',
        type: 'style',
        value: 'Casual',
        icon: Coffee,
        count: counts['Casual'] || 0,
        imageUrl: '/images/sinatra-oversized-tshirt.png',
      },
      {
        id: 'official',
        name: 'Official',
        subtitle: 'Presentation & formal',
        type: 'style',
        value: 'Official',
        icon: Briefcase,
        count: counts['Official'] || 0,
        imageUrl: '/images/sinatra-signature-sweatshirt.png',
      },
    ];
  }, []);

  const handleClassClick = (item: ClassModalItem) => {
    onClose();
    if (onSelectClass) {
      onSelectClass(item.type, item.value);
    } else {
      navigate(`/shop?${item.type}=${encodeURIComponent(item.value)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop: Clicking outside closes */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto animate-bottom-backdrop cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Popup Dialog */}
      <div
        className={`relative bottom-15 inset-x-0 pointer-events-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl border transition-all duration-300 z-10 animate-bottom-sheet max-h-[78vh] flex flex-col mx-auto ${
          isDark
            ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-[#1a1a1a] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="w-12 h-1.5 rounded-full bg-slate-400/30 mx-auto mb-3" />

        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-3 ${
            isDark ? 'border-[#1f293d]' : 'border-[#ede4d8]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold ${
                isDark
                  ? 'bg-[#d9532f]/20 text-[#d9532f] border border-[#d9532f]/30'
                  : 'bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25'
              }`}
            >
              {activeTab === 'categories' ? (
                <LayoutGrid className="w-4 h-4" />
              ) : (
                <Layers className="w-4 h-4" />
              )}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
                {activeTab === 'categories' ? 'Store Categories' : 'Shopping Classes'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {activeTab === 'categories'
                  ? 'Tap any category to browse official gear'
                  : 'Filter by audience and student style classes'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#162030] text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side-by-Side Tab Switch: Categories and Class */}
        <div
          className={`flex p-1 rounded-xl mb-3 border transition-colors ${
            isDark ? 'bg-[#0a1019] border-[#1f293d]' : 'bg-[#f4eee6] border-[#ede4d8]'
          }`}
        >
          <button
            type="button"
            onClick={() => handleSwitchTab('categories')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? isDark
                  ? 'bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white shadow-md'
                  : 'bg-[#c85028] text-white shadow-sm'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('classes')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'classes'
                ? isDark
                  ? 'bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white shadow-md'
                  : 'bg-[#c85028] text-white shadow-sm'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Class</span>
          </button>
        </div>

        {/* Content View: Categories or Classes */}
        <div className="flex-grow overflow-y-auto pr-0.5 space-y-2">
          {activeTab === 'categories' ? (
            /* CATEGORIES GRID */
            <>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectCategory(category.slug);
                      }}
                      className={`group relative overflow-hidden rounded-xl border p-3 transition-all duration-200 touch-spring text-left cursor-pointer flex flex-col justify-between min-h-[105px] active:scale-[0.98] ${
                        isDark
                          ? 'bg-[#131b28] hover:bg-[#182334] border-[#1f293d] hover:border-[#d9532f]/60'
                          : 'bg-[#faf6f1] hover:bg-[#f3ece3] border-[#ede4d8] hover:border-[#c85028]/60 shadow-xs'
                      }`}
                    >
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center"
                        style={{ backgroundImage: `url(${category.imageUrl})` }}
                      />

                      <div className="relative z-10 flex items-start justify-between mb-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                            isDark
                              ? 'bg-[#d9532f]/20 text-[#d9532f] border border-[#d9532f]/30'
                              : 'bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {category.count > 0 && (
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              isDark
                                ? 'bg-[#0a0e17]/85 text-gray-200 border border-[#1f293d]'
                                : 'bg-white text-gray-800 border border-[#d6c3ad] shadow-xs'
                            }`}
                          >
                            {category.count} items
                          </span>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h4
                          className={`text-[13px] font-black leading-snug transition-colors ${
                            isDark
                              ? 'text-white group-hover:text-[#d9532f]'
                              : 'text-gray-900 group-hover:text-[#c85028]'
                          }`}
                        >
                          {category.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5 leading-tight">
                          {category.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* All Outfits CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCategory('all');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all touch-spring cursor-pointer mt-1 ${
                  isDark
                    ? 'bg-[#121926] hover:bg-[#182334] border-[#1f293d] text-white hover:border-[#d9532f]'
                    : 'bg-[#faf6f1] hover:bg-[#f3ece3] border-[#ede4d8] text-gray-900 hover:border-[#c85028]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isDark
                        ? 'bg-[#d9532f]/20 text-[#d9532f]'
                        : 'bg-[#c85028]/15 text-[#c85028]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </span>
                  <span>View Complete Sinai Catalog ({INITIAL_PRODUCTS.length} items)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </>
          ) : (
            /* CLASSES GRID */
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {classes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleClassClick(item)}
                      className={`group relative overflow-hidden rounded-xl border p-3 transition-all duration-200 touch-spring text-left cursor-pointer flex flex-col justify-between min-h-[105px] active:scale-[0.98] ${
                        isDark
                          ? 'bg-[#131b28] hover:bg-[#182334] border-[#1f293d] hover:border-[#d9532f]/60'
                          : 'bg-[#faf6f1] hover:bg-[#f3ece3] border-[#ede4d8] hover:border-[#c85028]/60 shadow-xs'
                      }`}
                    >
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />

                      <div className="relative z-10 flex items-start justify-between mb-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                            isDark
                              ? 'bg-[#d9532f]/20 text-[#d9532f] border border-[#d9532f]/30'
                              : 'bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {item.count > 0 && (
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              isDark
                                ? 'bg-[#0a0e17]/85 text-gray-200 border border-[#1f293d]'
                                : 'bg-white text-gray-800 border border-[#d6c3ad] shadow-xs'
                            }`}
                          >
                            {item.count} items
                          </span>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h4
                          className={`text-[13px] font-black leading-snug transition-colors ${
                            isDark
                              ? 'text-white group-hover:text-[#d9532f]'
                              : 'text-gray-900 group-hover:text-[#c85028]'
                          }`}
                        >
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5 leading-tight">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* All Classes CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCategory('all');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all touch-spring cursor-pointer mt-1 ${
                  isDark
                    ? 'bg-[#121926] hover:bg-[#182334] border-[#1f293d] text-white hover:border-[#d9532f]'
                    : 'bg-[#faf6f1] hover:bg-[#f3ece3] border-[#ede4d8] text-gray-900 hover:border-[#c85028]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isDark
                        ? 'bg-[#d9532f]/20 text-[#d9532f]'
                        : 'bg-[#c85028]/15 text-[#c85028]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span>Explore All Classes & Styles</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
