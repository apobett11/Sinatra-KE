import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  ChevronRight,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Store,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { PHYSICAL_STORES } from '../data/physicalStores';
import { INITIAL_PRODUCTS } from '../data/products';

export const AccountDashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, orders, openAuthModal, updateProfile } = useAuth();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'stores' | 'wishlist' | 'profile'>('orders');
  const [storeStatusNotice, setStoreStatusNotice] = useState<string | null>(null);

  // If unauthenticated, render the full Sinatra Auth Gate view
  if (!isAuthenticated) {
    return (
      <div className="w-full pb-20 pt-8 sm:pt-14">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <User className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Customer Account Sign In
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-6">
            Please sign in to view your orders, live store collection progress, saved outfits, and physical store preferences.
          </p>

          <div
            className={`p-6 rounded-3xl border text-left shadow-lg mb-6 ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-[#c85028]" />
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c85028]">
                  Bag Items Kept in Cache
                </h3>
                <p className="text-[11px] text-gray-400">
                  Any outfits you added while browsing are preserved and will sync immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('orders', 'login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 active:scale-98"
            >
              <span>Sign In to Your Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAuthModal('profile', 'register')}
              className={`w-full mt-2.5 py-2.5 rounded-xl border text-xs font-bold text-center transition-colors cursor-pointer ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              New Customer? Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const preferredStore =
    PHYSICAL_STORES.find((s) => s.id === user?.preferredStoreId) || PHYSICAL_STORES[0];

  const wishlistProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const ordersTotal = orders?.length || 0;
  const totalOrderAmount = orders?.reduce((sum, ord) => sum + (ord.total || 0), 0) || 0;

  const handleSelectPreferredStore = (storeId: string) => {
    updateProfile({ preferredStoreId: storeId });
    setStoreStatusNotice('Preferred store updated for your campus pickups!');
    setTimeout(() => setStoreStatusNotice(null), 3000);
  };

  const getStepColor = (step: number, currentStep: number) => {
    if (step < currentStep) return 'bg-[#10b981] text-white';
    if (step === currentStep) return 'bg-[#c85028] text-white ring-4 ring-[#c85028]/20 animate-pulse';
    return isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500';
  };

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb Header */}
      <div
        className={`w-full py-4 px-4 sm:px-6 lg:px-8 border-b ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f8f2eb] border-[#ede4d8]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">Personal Dashboard</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Profile Card Header - Ultra Premium */}
        <div
          className={`relative overflow-hidden rounded-3xl border-2 border-t-4 border-t-[#c85028] p-5 sm:p-7 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#0c1422] via-[#0f1929] to-[#09101a] border-[#1e2e44] shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
              : 'bg-gradient-to-br from-[#ffffff] via-[#fdfbf8] to-[#f6efe6] border-[#e5d6c5] shadow-[0_16px_40px_rgba(200,80,40,0.1)]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#b3441e] via-[#c85028] to-[#ea580c] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-[0_6px_20px_rgba(200,80,40,0.4)] ring-2 ring-white/15 shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user?.name}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {user?.email} • {user?.phone}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#c85028]/15 text-[#c85028] flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  <span>{preferredStore.name}</span>
                </span>
                {user?.studentId && (
                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {user.studentId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Link
              to="/account/profile"
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-xs font-bold text-center transition-colors cursor-pointer ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Edit Profile
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Navigation Card */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs ${
            isDark ? 'bg-[#0f1726] border-[#1e2e44]' : 'bg-white border-[#ebdccf]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`grid grid-cols-2 gap-3 p-3 rounded-2xl border ${
                isDark ? 'bg-[#09121d] border-[#1a283c]' : 'bg-[#faf6f0] border-[#ede4d8]'
              }`}
            >
              <div className="px-3 py-1 border-r border-gray-200 dark:border-gray-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  Orders Total
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Package className="w-4 h-4 text-[#c85028]" />
                  <span className="text-base sm:text-lg font-black">{ordersTotal}</span>
                </div>
              </div>
              <div className="px-3 py-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  Total Order Amount
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-base sm:text-lg font-black text-emerald-500">
                    KSh {totalOrderAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full sm:w-auto sm:flex sm:flex-row shrink-0">
            <Link
              to="/account/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2 xs:px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 text-white font-black uppercase tracking-normal text-[11px] sm:text-xs shadow-md transition-all active:scale-98 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span>Check Orders</span>
            </Link>
            <Link
              to="/shop"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-2 xs:px-3 sm:px-4 py-2.5 rounded-xl font-black uppercase tracking-normal text-[11px] sm:text-xs border-2 transition-all active:scale-98 cursor-pointer whitespace-nowrap min-h-[44px] ${
                isDark
                  ? 'border-[#22354c] bg-[#142030] text-white hover:bg-[#1a283c] hover:border-[#c85028]'
                  : 'border-[#d8c8b4] bg-white text-gray-900 hover:bg-[#faf4ed] hover:border-[#c85028]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#c85028] shrink-0" />
              <span>Browse Collection</span>
            </Link>
          </div>
        </div>

        {/* Notice alert */}
        {storeStatusNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{storeStatusNotice}</span>
          </div>
        )}

        {/* Dashboard Tab Navigation Bar */}
        <div
          className={`flex border-b mb-6 overflow-x-auto no-scrollbar gap-2 sm:gap-6 text-xs font-bold ${
            isDark ? 'border-gray-800' : 'border-[#ede4d8]'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#c85028] text-[#c85028]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Live Progression ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stores')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stores'
                ? 'border-[#c85028] text-[#c85028]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>2 Physical Campus Stores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-[#c85028] text-[#c85028]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistIds.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders with Live 4-Step Progression */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
                }`}
              >
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-base mb-1">No Orders Recorded Yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Browse our streetwear hoodies, oversized tees, and denim trousers. Place an order for same-day physical store collection!
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs hover:bg-[#b3441e] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              orders.map((ord) => {
                const step = ord.trackingStep || (ord.status === 'Delivered' ? 4 : ord.status === 'Ready for Collection' ? 3 : 2);
                return (
                  <div
                    key={ord.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200/50 dark:border-gray-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#c85028]">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-gray-400">• Placed: {ord.createdAt}</span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#c85028]" />
                          <span>{ord.pickupLocation || ord.deliveryAddress}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-emerald-400">
                          KSh {ord.total.toLocaleString()}
                        </span>
                        <Link
                          to={`/track-order?ref=${ord.orderNumber}`}
                          className="text-xs font-bold text-[#c85028] hover:underline flex items-center gap-1"
                        >
                          <span>Full Live Pass</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* 4-Step Progress Track */}
                    <div className="py-5">
                      <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                        <span>Fulfillment & Collection Progression</span>
                        <span className="text-[#c85028] font-bold">Step {step} of 4</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { num: 1, label: 'Order Received' },
                          { num: 2, label: 'Workshop Prep' },
                          { num: 3, label: 'Ready at Store' },
                          { num: 4, label: 'Collected / Done' },
                        ].map((s) => (
                          <div key={s.num} className="flex flex-col items-center text-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${getStepColor(
                                s.num,
                                step
                              )}`}
                            >
                              {s.num < step ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : s.num}
                            </div>
                            <span
                              className={`text-[10px] font-bold mt-1.5 line-clamp-1 ${
                                s.num === step
                                  ? 'text-[#c85028]'
                                  : s.num < step
                                  ? isDark
                                    ? 'text-gray-200'
                                    : 'text-gray-800'
                                  : 'text-gray-400'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pickup ETA Box */}
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        isDark ? 'bg-[#09121d] border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-[#c85028]" />
                        <span className="font-semibold">Store Collection ETA:</span>
                      </div>
                      <span className="font-bold text-emerald-400">
                        {step === 1 && 'Workshop Stitching & Quality Inspection'}
                        {step === 2 && 'In Transit to Physical Store • Ready in ~2 Hours'}
                        {step === 3 && 'Arrived at Store Counter • Ready for Pickup Today!'}
                        {step === 4 && 'Parcel Collected & Handover Complete ✓'}
                      </span>
                    </div>

                    {/* Items row */}
                    <div className="pt-3 mt-3 border-t border-gray-200/50 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                      <span>{ord.items.length} item(s) ordered</span>
                      <span className="font-medium text-gray-300">
                        Status: <strong className="text-white">{ord.status}</strong>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: 2 Physical Stores Guidance */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PHYSICAL_STORES.map((st) => {
                const isSelected = user?.preferredStoreId === st.id;
                return (
                  <div
                    key={st.id}
                    className={`p-6 rounded-3xl border relative transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-[#142335] border-[#c85028] shadow-lg ring-1 ring-[#c85028]'
                          : 'bg-orange-50/50 border-[#c85028] shadow-md ring-1 ring-[#c85028]'
                        : isDark
                        ? 'bg-[#121926] border-[#1e293b]'
                        : 'bg-white border-[#ede4d8]'
                    }`}
                  >
                    {st.isFlagship && (
                      <span className="absolute top-5 right-5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#c85028] text-white">
                        Flagship Hub
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm sm:text-base">{st.name}</h3>
                        <p className="text-[11px] text-gray-400">{st.tagline}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-400 mb-5">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#c85028] shrink-0" />
                        <span>
                          {st.building}, {st.roomOrShop}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{st.operatingHours}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{st.phone} (Supervisor: {st.manager})</span>
                      </p>
                    </div>

                    <div className="mb-5 pt-3 border-t border-gray-200/50 dark:border-gray-800">
                      <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">
                        Available On-Site Services:
                      </span>
                      <ul className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {st.services.map((srv, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-gray-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPreferredStore(st.id)}
                      className={`w-full py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#c85028] hover:bg-[#b3441e] text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? '✓ Your Default Pickup Store' : 'Set as My Preferred Store'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Helpline Concierge Card */}
            <div
              className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm">Need Fitting Room or Stock Support?</h4>
                  <p className="text-xs text-gray-400">
                    Reach out to our campus store supervisors directly via WhatsApp or Phone.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href="tel:+254712345678"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call Store</span>
                </a>
                <a
                  href="https://wa.me/254712345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {wishlistProducts.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
                }`}
              >
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-base mb-1">Your Wishlist is Empty</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Save street outfits you like while browsing and review them here anytime.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs hover:bg-[#b3441e] transition-colors"
                >
                  Discover Outfits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-3xl border flex flex-col justify-between ${
                      isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
                    }`}
                  >
                    <div>
                      <div className="w-full h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 p-2 overflow-hidden mb-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#c85028]">
                        {p.categoryLabel}
                      </span>
                      <h4 className="font-bold text-sm truncate">{p.name}</h4>
                      <p className="font-black text-sm text-emerald-400 mt-1">
                        KSh {p.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-200/50 dark:border-gray-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard');
                          removeFromWishlist(p.id);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(p.id)}
                        className="px-3 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
