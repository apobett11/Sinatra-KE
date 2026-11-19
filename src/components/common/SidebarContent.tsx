import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Heart,
  User,
  MessageCircle,
  ChevronDown,
  LayoutGrid,
  Info,
  Package,
  LogOut,
  LogIn,
} from 'lucide-react';
import { SinatraLogo } from './SinatraLogo';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarContentProps {
  onClose?: () => void;
  isDesktop?: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, isDesktop = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const { wishlistIds } = useWishlist();
  const { user, isAuthenticated, logout, openAuthModal, orders } = useAuth();
  const navigate = useNavigate();

  // Mutually exclusive accordion states
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLoginClick = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  const handleWishlistClick = () => {
    if (onClose) onClose();
    if (!isAuthenticated) {
      openAuthModal('wishlist', 'login');
    } else {
      navigate('/wishlist');
    }
  };

  const handleLogoutClick = () => {
    logout();
    if (onClose) onClose();
    navigate('/');
  };

  const handleToggleCategories = () => {
    const nextState = !categoriesOpen;
    setCategoriesOpen(nextState);
    if (nextState) {
      setAboutOpen(false);
    }
  };

  const handleToggleAbout = () => {
    const nextState = !aboutOpen;
    setAboutOpen(nextState);
    if (nextState) {
      setCategoriesOpen(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-between h-full overflow-hidden">
      <div className="flex flex-col flex-1 justify-start overflow-hidden">
        {/* Top Bar: Sinatra Logo (and Close button if on mobile) */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div onClick={handleLinkClick} className="cursor-pointer">
            <Link to="/" onClick={handleLinkClick}>
              <SinatraLogo />
            </Link>
          </div>
          {/* Only mobile drawer gets close button; PC sidebar is not collapsible */}
          {!isDesktop && onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Theme switch pill */}
        <div className="my-2.5 flex items-center justify-between p-2 rounded-xl bg-[#c85028]/10 text-xs font-semibold shrink-0">
          <span className="flex items-center gap-2">
            {isDark ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-[#c85028]" />}
            <span className="text-[11px]">{isDark ? 'Dark Theme' : 'Light Theme'}</span>
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-2 py-0.5 bg-[#c85028] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#b3441e] transition-colors"
          >
            Switch
          </button>
        </div>

        {/* Navigation Items: compact and strictly fitting */}
        <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar py-1">
          {/* 1. Login / Account Profile */}
          {isAuthenticated ? (
            <div
              className={`p-2.5 rounded-xl border shrink-0 ${
                isDark ? 'bg-[#121c2a] border-[#1e2d40]' : 'bg-white border-[#ebdccf] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c85028]" />
                  <span className="font-bold text-xs truncate max-w-[140px]">{user?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="text-[10px] text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/account/profile"
                  onClick={handleLinkClick}
                  className="flex-1 py-1 px-2 rounded-lg bg-[#c85028]/15 text-[#c85028] text-[11px] font-bold text-center hover:bg-[#c85028] hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/account/orders"
                  onClick={handleLinkClick}
                  className="flex-1 py-1 px-2 rounded-lg border border-gray-300 dark:border-gray-700 text-[11px] font-bold text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Orders
                </Link>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Create Account</span>
            </button>
          )}

          {/* 2. Categories Dropdown (Accordion) */}
          <div
            className={`rounded-xl border transition-colors overflow-hidden shrink-0 ${
              isDark ? 'bg-[#101b28]/70 border-[#1e2d40]' : 'bg-white border-[#ebdccf] shadow-xs'
            }`}
          >
            <button
              type="button"
              onClick={handleToggleCategories}
              className="w-full flex items-center justify-between p-2.5 text-xs font-black uppercase tracking-wider text-[#c85028] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Product Categories</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoriesOpen ? 'rotate-180 text-[#c85028]' : 'text-gray-400'
                }`}
              />
            </button>

            {categoriesOpen && (
              <div className="px-3 pb-2 pt-0.5 space-y-0.5 border-t border-gray-100 dark:border-gray-800/80 animate-in fade-in-50">
                <Link
                  to="/shop"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-semibold text-[#c85028] hover:bg-[#c85028]/10 transition-colors"
                >
                  Shop All Outfits
                </Link>
                <Link
                  to="/shop/hoodies"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Hoodies & Fleeces
                </Link>
                <Link
                  to="/shop/tshirts"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  T-Shirts & Tops
                </Link>
                <Link
                  to="/shop/sweatshirts"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Campus Sweatshirts
                </Link>
                <Link
                  to="/shop/trousers"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Trousers & Utility Cargos
                </Link>
              </div>
            )}
          </div>

          {/* 3. Consolidated Card: Wishlist, Orders, and About Sinatra & FAQ */}
          <div
            className={`rounded-xl border transition-colors overflow-hidden shrink-0 ${
              isDark ? 'bg-[#101b28]/70 border-[#1e2d40]' : 'bg-white border-[#ebdccf] shadow-xs'
            }`}
          >
            {/* Row 1: Saved Wishlist */}
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold border-b transition-colors cursor-pointer ${
                isDark
                  ? 'border-[#1e2d40] text-gray-200 hover:bg-[#1a2538]'
                  : 'border-[#ede4d8] text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#c85028]" />
                <span>Saved Wishlist</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] bg-[#801815] text-white rounded-full font-bold shadow-xs">
                {wishlistIds.length}
              </span>
            </button>

            {/* Row 2: My Orders & Tracking */}
            <Link
              to={isAuthenticated ? '/account/orders' : '/login'}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold border-b transition-colors ${
                isDark
                  ? 'border-[#1e2d40] text-gray-200 hover:bg-[#1a2538]'
                  : 'border-[#ede4d8] text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#c85028]" />
                <span>My Orders & Tracking</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] bg-[#801815] text-white rounded-full font-bold shadow-xs">
                {orders.length}
              </span>
            </Link>

            {/* Row 3: About Sinatra & FAQ (Accordion Trigger) */}
            <button
              type="button"
              onClick={handleToggleAbout}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#c85028]" />
                <span>About Sinatra & FAQ</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  aboutOpen ? 'rotate-180 text-[#c85028]' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Accordion dropdown for About Sinatra */}
            {aboutOpen && (
              <div className="px-3 pb-2 pt-0.5 space-y-0.5 border-t border-gray-100 dark:border-gray-800/80 animate-in fade-in-50">
                <Link
                  to="/about"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  About Sinatra Story
                </Link>
                <Link
                  to="/faq"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Frequently Asked Questions
                </Link>
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Store Locations & Contact
                </Link>
                <Link
                  to="/track-order"
                  onClick={handleLinkClick}
                  className="block px-2 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors"
                >
                  Track Order Status
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer info at bottom of sidebar: Royal Dev and WhatsApp Icon */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-800/80 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 dark:text-gray-400 text-[10px] tracking-wider uppercase">
            Royal Dev
          </span>
          <a
            href="https://wa.me/254704095513"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Royal Dev"
            className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3 h-3" />
          </a>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">+254 704 095 513</span>
      </div>
    </div>
  );
};
