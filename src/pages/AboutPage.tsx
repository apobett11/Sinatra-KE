import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  MapPin,
  MessageCircle,
  ArrowRight,
  Flame,
  ShieldCheck,
  Truck,
  Shirt,
  Store,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AboutPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb Header */}
      <div
        className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f4ebe1] border-[#d8c7b0]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">About Sinatra</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-12">
        {/* =====================================================================
            1. HERO: BOLD, PUNCHY & VISUAL (NO ESSAYS!)
           ===================================================================== */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden text-center transition-colors ${
            isDark ? 'bg-[#0e1826] border-[#1e2e42]' : 'bg-white border-[#ede4d8] shadow-md'
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c85028]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Pill Badges */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#c85028]/15 text-[#c85028] mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Collegiate Streetwear • In & Around Egerton</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight mb-3">
            Not Your Average <span className="text-[#c85028]">Campus Threads.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 max-w-xl mx-auto font-medium mb-6">
            Sinatra is the definitive streetwear movement engineered for everyone in and around Egerton.
            Unmatched fabric thickness, custom cuts, and zero retail markups.
          </p>

          {/* Slogan Banner */}
          <div className="inline-block p-3 sm:px-6 rounded-2xl bg-gradient-to-r from-[#c85028] to-[#b3441e] text-white shadow-md">
            <p className="text-xs sm:text-sm font-black uppercase tracking-widest">
              "Your Style. Your Campus. Your Sinatra."
            </p>
          </div>
        </div>

        {/* =====================================================================
            2. FUN 4-CARD TEMPLATE GRID: WHAT MAKES SINATRA HIT DIFFERENT
           ===================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight">
              Why We Hit Different
            </h2>
            <span className="text-xs font-bold text-[#c85028]">Sinatra Standards</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1 */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-1">380 GSM Fleece</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Built to crush cold Njoro mornings without shivering.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center mb-3">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-1">240 GSM Cotton</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Combed organic cotton oversized tees that hold their shape.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-1">Fast Delivery</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Rapid doorstep hand-off across all residences around Egerton.
              </p>
            </div>

            {/* Card 4 */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-1">48H Easy Swaps</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Wrong size? Walk into any of our fitting hubs for a swap.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. OUR STORES & LOCATIONS (VISUAL CARDS)
           ===================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight flex items-center gap-2">
                <Store className="w-5 h-5 text-[#c85028]" />
                <span>Our Physical Stores</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Try on outfits, test fits, and pick up orders in person
              </p>
            </div>
            <a
              href="https://wa.me/254712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-500"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Stores</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store 1 */}
            <div
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src="/images/hero-model-dark.png"
                  alt="Student Centre Store"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#c85028] text-white shadow-xs">
                  FLAGSHIP HUB
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                  Student Centre Hub (Room 12)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  Egerton University Student Centre, Main Campus<br />
                  Njoro, Nakuru County
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Mon - Sat: 8am - 7pm</span>
                  <a
                    href="https://wa.me/254712345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                  >
                    <span>Contact Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Store 2 */}
            <div
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? 'bg-[#101b28] border-[#1e2d40]' : 'bg-white border-[#ede4d8] shadow-xs'
              }`}
            >
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src="/images/hero-model-light.png"
                  alt="Gate B Pavilion Store"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#0d72ea] text-white shadow-xs">
                  GATE B ANNEX
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                  Gate B Pavilion (Shop 4)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  Gate B Commercial Centre, Shop 4<br />
                  Egerton Njoro Annex
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Mon - Sun: 9am - 8pm</span>
                  <a
                    href="https://wa.me/254712345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                  >
                    <span>Contact Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            4. THE CEO / FOUNDER TEMPLATE CARD
           ===================================================================== */}
        <div
          className={`p-5 sm:p-8 rounded-3xl border transition-all ${
            isDark ? 'bg-[#0f1724] border-[#1e2e42]' : 'bg-white border-[#ede4d8] shadow-sm'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#c85028] shadow-md flex-shrink-0 relative">
              <img
                src="/images/hero-model-dark-cut.png"
                alt="John Doe - Sinatra CEO"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c85028]">
                Founder & Creative Director
              </span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                John Doe (Sinatra)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300 italic leading-relaxed">
                "We built Sinatra because everyone in and around Egerton deserves world-class streetwear
                without paying crazy imported boutique markups. Every thread is cut for your everyday confidence."
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================================
            5. QUICK ACTION CTA
           ===================================================================== */}
        <div className="text-center pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#c85028] hover:bg-[#b3441e] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Latest Streetwear Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
