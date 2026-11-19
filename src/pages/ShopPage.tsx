import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AllProductsCatalogue } from '../components/home/AllProductsCatalogue';
import { INITIAL_PRODUCTS } from '../data/products';
import { ProductCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

export const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { isDark } = useTheme();

  const validCategory = (
    category && ['hoodies', 'tshirts', 'sweatshirts', 'trousers'].includes(category)
      ? category
      : 'all'
  ) as ProductCategory | 'all';

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    all: {
      title: 'Shop All Outfits',
      subtitle: 'Browse the complete Sinai collegiate fashion collection',
    },
    hoodies: {
      title: 'Hoodies & Fleeces',
      subtitle: 'Heavyweight warmth engineered for Egerton weather',
    },
    tshirts: {
      title: 'Oversized & Graphic T-Shirts',
      subtitle: 'Combed cotton street staples designed for daily wear',
    },
    sweatshirts: {
      title: 'Campus Sweatshirts',
      subtitle: 'Athletic crewnecks with signature embroidered crests',
    },
    trousers: {
      title: 'Trousers & Utility Cargos',
      subtitle: 'Ripstop street cargo pants and tailored student trousers',
    },
  };

  const currentInfo = categoryTitles[validCategory] || categoryTitles.all;

  return (
    <div className="w-full pb-12">
      {/* Compact Breadcrumbs Header: Minimized space wastage at top */}
      <div
        className={`w-full py-2 sm:py-2.5 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f4ebe1] border-[#d8c7b0]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" className="hover:text-[#c85028] transition-colors font-medium">
            Shop
          </Link>
          {validCategory !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#c85028] font-bold lowercase">{validCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Catalogue Card: Category banner removed, focuses immediately on products */}
      <AllProductsCatalogue
        products={INITIAL_PRODUCTS}
        initialCategory={validCategory}
        hideHeaderBanner={true}
      />
    </div>
  );
};
