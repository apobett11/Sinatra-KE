import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { User, Order } from '../../types';

interface DashboardGreetingSectionProps {
  user: User | null;
  orders: Order[];
}

export const DashboardGreetingSection: React.FC<DashboardGreetingSectionProps> = ({ user, orders }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const ordersTotal = orders?.length || 0;
  const totalOrderAmount = orders?.reduce((sum, ord) => sum + (ord.total || 0), 0) || 0;

  return (
    <section className="relative w-full overflow-hidden pt-3 pb-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Personal Card */}
        <div
          className={`relative overflow-hidden rounded-3xl border-2 border-t-4 border-t-[#c85028] p-4 sm:p-7 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#0c1422] via-[#0f1929] to-[#09101a] border-[#1e2e44] shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
              : 'bg-gradient-to-br from-[#ffffff] via-[#fdfbf8] to-[#f6efe6] border-[#e5d6c5] shadow-[0_16px_40px_rgba(200,80,40,0.1)]'
          }`}
        >
          {/* Ambient Brand Sheen Background Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 bg-[#c85028]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4.5 sm:gap-6">
            {/* Left: Premium Monogram & Personal Greetings */}
            <div className="flex items-center gap-3 sm:gap-4.5">
              {/* Luxury Avatar Emblem */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#b3441e] via-[#c85028] to-[#ea580c] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-[0_6px_20px_rgba(200,80,40,0.4)] ring-2 ring-white/15">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f1929] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                </div>
              </div>

              {/* Personal Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25">
                    <Sparkles className="w-2.5 h-2.5 text-[#c85028]" />
                    <span>Sinatra Member</span>
                  </span>
                  <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Verified
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight truncate">
                  Hello, <span className="text-[#c85028]">{user?.name || 'Customer'}</span>
                </h1>

                {/* Subtitle: HIDDEN ON MOBILE as requested */}
                <p className={`hidden sm:block text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome to your personal Sinatra dashboard. Track your campus pickups and manage orders.
                </p>

                {user?.studentId && (
                  <span className="inline-block text-[10px] sm:text-[11px] font-mono text-gray-400 mt-0.5">
                    Campus ID: {user.studentId}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Quick Stats Card & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Quick Stats Card */}
              <div
                className={`grid grid-cols-2 gap-2.5 p-2.5 sm:p-3.5 rounded-2xl border transition-colors ${
                  isDark
                    ? 'bg-[#09121d]/90 border-[#1c2a3e] shadow-xs'
                    : 'bg-[#faf6f0] border-[#ede4d8] shadow-xs'
                }`}
              >
                {/* Stat 1: Orders Total */}
                <div className="px-2 sm:px-3 py-1 border-r border-gray-200 dark:border-gray-800">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                    Orders Total
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Package className="w-4 h-4 text-[#c85028] shrink-0" />
                    <span className="text-base sm:text-lg font-black">{ordersTotal}</span>
                  </div>
                </div>

                {/* Stat 2: Total Order Amount */}
                <div className="px-2 sm:px-3 py-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                    Total Amount
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-base sm:text-lg font-black text-emerald-500 whitespace-nowrap">
                      KSh {totalOrderAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 Buttons: SIDE BY SIDE on mobile & tablet, with names fitted 100% cleanly */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full sm:w-auto sm:flex sm:flex-row lg:flex-col shrink-0">
                {/* Button 1: Check Orders */}
                <button
                  type="button"
                  onClick={() => navigate('/account/orders')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2 xs:px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 text-white font-black uppercase tracking-normal text-[11px] sm:text-xs shadow-md transition-all active:scale-98 cursor-pointer whitespace-nowrap min-h-[44px]"
                >
                  <Package className="w-3.5 h-3.5 shrink-0" />
                  <span>Check Orders</span>
                </button>

                {/* Button 2: Browse Collection */}
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2 xs:px-3 sm:px-4 py-2.5 rounded-xl font-black uppercase tracking-normal text-[11px] sm:text-xs border-2 transition-all active:scale-98 cursor-pointer whitespace-nowrap min-h-[44px] ${
                    isDark
                      ? 'border-[#22354c] bg-[#142030] text-white hover:bg-[#1a283c] hover:border-[#c85028]'
                      : 'border-[#d8c8b4] bg-white text-gray-900 hover:bg-[#faf4ed] hover:border-[#c85028] shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c85028] shrink-0" />
                  <span>Browse Collection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
