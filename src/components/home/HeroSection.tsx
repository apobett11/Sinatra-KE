import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const HeroSection: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className={`relative w-full transition-colors ${
          isDark ? 'bg-[#0b141f] text-white' : 'bg-[#faf4ee] text-[#0f172a]'
        }`}
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #09121d 0%, #0b141f 45%, #0d1826 100%)'
            : 'linear-gradient(180deg, #faf5f0 0%, #faf4ee 50%, #f7efe6 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[250px] sm:min-h-[350px] lg:min-h-[390px] flex items-center justify-between overflow-hidden">
            {/* Left Content Column */}
            <div className="relative z-10 max-w-[215px] sm:max-w-lg lg:max-w-xl text-left py-3 sm:py-5 lg:py-6">
              {/* Bold 3-Tier Headline matching reference exactly */}
              <h1 className="text-[22px] sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-1.5 sm:mb-3">
                <span className="block">Your Style.</span>
                <span className="block">Your Campus.</span>
                <span
                  className={`block ${
                    isDark ? 'text-[#cb5529]' : 'text-[#c85428]'
                  }`}
                >
                  Your Sinatra.
                </span>
              </h1>

              {/* Description */}
              <p
                className={`text-[11px] sm:text-sm lg:text-base mb-3 sm:mb-5 leading-relaxed font-medium ${
                  isDark ? 'text-[#94a3b8]' : 'text-[#475569]'
                }`}
              >
                Premium & trendy outfits for everyone in and around Egerton.
              </p>

              {/* CTA Buttons Row */}
              <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-[#c85428] hover:bg-[#b3441e] text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(200,84,40,0.3)] transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </button>

                <button
                  onClick={() => navigate('/about')}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm border transition-all active:scale-[0.98] cursor-pointer ${
                    isDark
                      ? 'border-[#223348] bg-[#121c2a]/85 text-white hover:bg-[#182638] hover:border-[#c85028]'
                      : 'border-[#d6c5af] bg-white text-gray-900 hover:bg-[#faf6f0] hover:border-[#c85028] shadow-xs'
                  }`}
                >
                  {/* Sinatra Coat Hanger SVG Logo */}
                  <svg
                    viewBox="0 0 48 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#c85028] flex-shrink-0"
                  >
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
                  <span>About Sinatra</span>
                </button>
              </div>
            </div>

            {/* Right Model Photo positioned side-by-side matching reference */}
            <div className="absolute right-0 top-0 bottom-0 w-[56%] sm:w-[50%] lg:w-[46%] flex items-end justify-end pointer-events-none">
              <img
                src={
                  isDark
                    ? '/images/hero-model-dark-cut.png'
                    : '/images/hero-model-light-cut.png'
                }
                alt="Sinatra Student Model"
                className="h-full w-auto max-w-none object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
