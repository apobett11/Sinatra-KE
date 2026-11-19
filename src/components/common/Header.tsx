import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  Heart,
  User,
  ChevronDown,
  LogOut,
  Package,
} from 'lucide-react';
import { SinatraLogo } from './SinatraLogo';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const { isDark, toggleTheme } = useTheme();
  const { cartCount, openCart } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  return (
    <header
      className={`relative z-30 w-full transition-colors ${
        isDark
          ? 'bg-[#09121d] border-b-2 border-[#1e2d42]'
          : 'bg-[#eae0d0] border-b border-[#d8c7b0] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <SinatraLogo />

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`hover:text-[#c85028] transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => navigate('/shop')}
                className={`flex items-center gap-1.5 hover:text-[#c85028] transition-colors py-2 cursor-pointer ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    shopDropdownOpen ? 'rotate-180 text-[#c85028]' : ''
                  }`}
                />
              </button>

              {shopDropdownOpen && (
                <div
                  className={`absolute top-full left-0 w-48 py-2 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isDark
                      ? 'bg-[#101b28] border-[#1e2d40] text-gray-200 shadow-black/80'
                      : 'bg-white border-[#ede4d8] text-gray-800 shadow-xl'
                  }`}
                >
                  <Link
                    to="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors text-xs font-semibold"
                  >
                    Shop All
                  </Link>
                  <Link
                    to="/shop/hoodies"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors text-xs"
                  >
                    Hoodies & Jackets
                  </Link>
                  <Link
                    to="/shop/tshirts"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors text-xs"
                  >
                    T-Shirts
                  </Link>
                  <Link
                    to="/shop/sweatshirts"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors text-xs"
                  >
                    Sweatshirts
                  </Link>
                  <Link
                    to="/shop/trousers"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] transition-colors text-xs"
                  >
                    Trousers
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`hover:text-[#c85028] transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`hover:text-[#c85028] transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Theme Toggle Button (Desktop Only) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`hidden lg:flex p-2 rounded-full transition-colors ${
              isDark
                ? 'text-gray-200 hover:bg-[#121c2a]'
                : 'text-gray-800 hover:bg-[#dfd0ba]'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search outfits"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark
                ? 'text-white hover:bg-[#121c2a]'
                : 'text-[#0f172a] hover:bg-[#dfd0ba]'
            }`}
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Wishlist Link (Desktop Only) */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('wishlist', 'login');
              } else {
                navigate('/wishlist');
              }
            }}
            aria-label="View wishlist"
            className={`hidden lg:flex relative p-2 rounded-full transition-colors cursor-pointer ${
              isDark
                ? 'text-gray-200 hover:bg-[#121c2a]'
                : 'text-gray-800 hover:bg-[#dfd0ba]'
            }`}
          >
            <Heart className="w-5 h-5" />
            {isAuthenticated && wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c85028] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Login / Account Trigger (Desktop & Mobile) */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                aria-label="Account"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark
                    ? 'text-gray-200 hover:bg-[#121c2a]'
                    : 'text-gray-800 hover:bg-[#dfd0ba]'
                }`}
              >
                <User className="w-5 h-5 text-[#c85028]" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                aria-label="Sign In"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#162232] text-white hover:bg-[#1e2e42] border border-[#203042]'
                    : 'bg-[#dfd0ba] text-gray-900 hover:bg-[#d4c3ab] border border-[#cdbc9f]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#c85028]" />
                <span>Login</span>
              </button>
            )}

            {accountDropdownOpen && isAuthenticated && (
              <div
                className={`absolute right-0 top-full mt-2 w-52 py-2 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-150 z-50 ${
                  isDark
                    ? 'bg-[#101b28] border-[#1e2d40] text-gray-200 shadow-black/80'
                    : 'bg-white border-[#ede4d8] text-gray-800 shadow-xl'
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-bold truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/account"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] text-xs font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Personal Dashboard</span>
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#c85028]/10 hover:text-[#c85028] text-xs font-medium"
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setAccountDropdownOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-500 text-xs font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger menu (Sidebar trigger) */}
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open mobile menu"
            className={`lg:hidden p-2 rounded-full transition-colors cursor-pointer ${
              isDark
                ? 'text-white hover:bg-[#121c2a]'
                : 'text-[#0f172a] hover:bg-[#dfd0ba]'
            }`}
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
