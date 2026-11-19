import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CompleteLookBanner: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <section className="w-full py-3 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onClick={() => navigate('/shop')}
          className={`relative w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 overflow-hidden cursor-pointer transition-transform hover:scale-[1.005] active:scale-[0.99] shadow-sm flex items-center justify-between ${
            isDark
              ? 'border-[1.5px] border-[#f97316] text-white shadow-black/40'
              : 'border border-[#e5cdb9] text-[#0f172a]'
          }`}
          style={{
            background: isDark
              ? 'linear-gradient(90deg, #09121d 0%, #15202e 50%, #09121d 100%)'
              : 'linear-gradient(90deg, #f5dfcd 0%, #eed2ba 100%)',
          }}
        >
          {/* Left: Hanger Icon & Heading */}
          <div className="flex items-center gap-3 sm:gap-4 z-10 min-w-0">
            {/* Orange Coat Hanger Icon */}
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0 ${
                isDark ? 'text-[#f97316]' : 'text-[#c85428]'
              }`}
            >
              <svg viewBox="0 0 48 40" fill="none" className="w-8 h-8 sm:w-10 sm:h-10">
                <path
                  d="M24 16C24 13.5 25.5 11 28 11C30.5 11 32 12.8 32 15C32 18.5 28 20 24 22"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M24 22L7 32C5.5 32.8 6 35 7.8 35H40.2C42 35 42.5 32.8 41 32L24 22Z"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-black tracking-tight leading-snug">
                Complete Your Look
              </h3>
              <p
                className={`text-[11px] sm:text-xs truncate ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Trendy outfits. Better together.
              </p>

              {/* In light theme, show the Shop Now pill button matching reference */}
              {!isDark && (
                <div className="mt-1.5">
                  <button
                    type="button"
                    className="px-3.5 py-1 rounded-full bg-[#090e17] hover:bg-black text-white text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Cap Photo */}
          <div className="flex items-center gap-3 z-10 flex-shrink-0">
            <div className="w-20 h-14 sm:w-28 sm:h-20 flex items-center justify-center">
              <img
                src="/images/sinatra-crown-cap.png"
                alt="Sinatra Crown Cap"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
