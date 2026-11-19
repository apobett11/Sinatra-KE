import React from 'react';
import { Link } from 'react-router-dom';
import { SinatraLogo } from './SinatraLogo';
import { MessageCircle, MapPin, Store } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full pt-6 pb-20 lg:pb-8 border-t transition-colors ${
        isDark
          ? 'bg-[#090e18] border-[#182234] text-gray-400'
          : 'bg-[#f4eae0] border-[#decbb7] text-gray-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* At Top in the Middle: Copyright: Royal Developers */}
        <div className="flex items-center justify-center pb-5 mb-6 border-b border-gray-200/60 dark:border-gray-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c85028]/10 text-[#c85028]">
            <span>Copyright © Royal Developers</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-6">
          {/* Brand & Slogan */}
          <div className="md:col-span-4 space-y-2.5">
            <SinatraLogo />
            <p className="text-xs font-black tracking-wider text-[#c85028]">
              YOUR STYLE. YOUR CAMPUS. YOUR SINATRA.
            </p>
            <p className="text-xs leading-relaxed max-w-sm text-gray-500 dark:text-gray-400">
              Premium collegiate streetwear designed for durability and everyday confidence in and around Egerton.
            </p>
            {/* Quick Links (Necessary Only) */}
            <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium">
              <Link to="/shop" className="hover:text-[#c85028] transition-colors">
                Shop Outfits
              </Link>
              <Link to="/about" className="hover:text-[#c85028] transition-colors">
                About Sinatra
              </Link>
              <Link to="/wishlist" className="hover:text-[#c85028] transition-colors">
                Wishlist
              </Link>
              <Link to="/track-order" className="hover:text-[#c85028] transition-colors">
                Track Order
              </Link>
              <Link to="/contact" className="hover:text-[#c85028] transition-colors">
                Contact & Help
              </Link>
            </div>
          </div>

          {/* Compact Our Stores (Reduced size, 2-line location, image slots, generalized WhatsApp) */}
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#c85028]" />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Our Physical Campus Stores
                </h4>
              </div>
              <a
                href="https://wa.me/254712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-500"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: +254 712 345 678</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Store 1: Student Centre Hub */}
              <div
                className={`p-2.5 rounded-xl border flex gap-3 items-center ${
                  isDark ? 'bg-[#0f1622] border-[#1a2536]' : 'bg-white border-[#ede4d8] shadow-2xs'
                }`}
              >
                {/* Store image preview */}
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0 relative">
                  <img
                    src="/images/hero-model-dark.png"
                    alt="Sinatra Student Centre Hub"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white text-center py-0.5">
                    Hub 1
                  </span>
                </div>
                <div className="text-xs min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    Student Centre Hub (Rm 12)
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                    Egerton Student Centre, Room 12<br />
                    Main Campus, Njoro
                  </p>
                </div>
              </div>

              {/* Store 2: Gate B Pavilion */}
              <div
                className={`p-2.5 rounded-xl border flex gap-3 items-center ${
                  isDark ? 'bg-[#0f1622] border-[#1a2536]' : 'bg-white border-[#ede4d8] shadow-2xs'
                }`}
              >
                {/* Store image preview */}
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0 relative">
                  <img
                    src="/images/hero-model-light.png"
                    alt="Sinatra Gate B Pavilion"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white text-center py-0.5">
                    Hub 2
                  </span>
                </div>
                <div className="text-xs min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    Gate B Pavilion (Shop 4)
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                    Gate B Commercial Centre, Shop 4<br />
                    Egerton Njoro Annex
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} SINATRA Storefront. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:underline">
              Terms
            </Link>
            <Link to="/faq" className="hover:underline">
              Privacy
            </Link>
            <Link to="/track-order" className="hover:underline">
              Tracking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
