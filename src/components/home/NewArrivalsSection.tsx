import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { StandardProductCard } from '../common/StandardProductCard';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Maximum of 7 products matching user prompt
  const displayProducts = products.slice(0, 7);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-2.5 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ONE SINGLE CARD: Header and Products all inline */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-colors ${
            isDark
              ? 'bg-[#0e1825] border-[#18273a] shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
              : 'bg-white border-[#ede4d8] shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-3 sm:gap-5">
            {/* Inline Header Card Column (Desktop Left / Mobile Top) */}
            <div className="lg:w-48 xl:w-56 flex-shrink-0 flex flex-row lg:flex-col justify-between items-center lg:items-start lg:border-r border-gray-200/60 dark:border-gray-800 lg:pr-4 py-1">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c85028]/15 text-[#c85028] mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Fresh Drops</span>
                </div>
                <h2
                  className={`text-base sm:text-xl font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-[#0f172a]'
                  }`}
                >
                  New Arrivals
                </h2>
                <p className="hidden lg:block text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Engineered collegiate outfits designed for Egerton campus lifestyle.
                </p>
              </div>

              {/* Desktop CTA & Navigation arrows */}
              <div className="flex items-center lg:flex-col lg:items-start gap-2 lg:gap-3 w-auto lg:w-full mt-0 lg:mt-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>See All</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.2]" />
                </Link>

                <div className="hidden lg:flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#c85028] hover:text-white hover:border-[#c85028] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#c85028] hover:text-white hover:border-[#c85028] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Scrollable Products Carousel to the Right */}
            <div
              ref={scrollContainerRef}
              className="flex-1 flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
            >
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[145px] sm:w-[170px] flex-shrink-0 flex flex-col"
                >
                  <StandardProductCard product={product} />
                </div>
              ))}

              {/* Inline "See All" Card at end of carousel */}
              <div
                onClick={() => navigate('/shop')}
                className={`w-[125px] sm:w-[145px] flex-shrink-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all active:scale-95 ${
                  isDark
                    ? 'border-[#223348] hover:border-[#c85028] bg-[#09121d]/50 hover:bg-[#c85028]/10'
                    : 'border-[#dfd0be] hover:border-[#c85028] bg-[#faf6f0] hover:bg-[#f5ece1]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#c85028] text-white flex items-center justify-center mb-2 shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-black tracking-tight text-gray-900 dark:text-white">
                  See All Drops
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Browse {products.length}+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
