import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { StandardProductCard } from '../components/common/StandardProductCard';
import { useTheme } from '../context/ThemeContext';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { isDark } = useTheme();

  // If unauthenticated, gate personal wishlist
  if (!isAuthenticated) {
    return (
      <div className="w-full pb-20 pt-8 sm:pt-14">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Personal Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-6">
            Please sign in to access your saved Sinatra outfits and personal favorites across devices.
          </p>

          <div
            className={`p-6 rounded-3xl border text-left shadow-lg ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-[#c85028]" />
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c85028]">
                  Guest Bag Persists
                </h3>
                <p className="text-[11px] text-gray-400">
                  You can still add up to 3 outfits directly to your cart without signing in.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('wishlist', 'login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 active:scale-98"
            >
              <span>Sign In to Access Wishlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      {/* Breadcrumb Header */}
      <div
        className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f4ebe1] border-[#d8c7b0]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">Saved Wishlist</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Saved Wishlist</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {wishlistProducts.length} saved item{wishlistProducts.length === 1 ? '' : 's'} ready for your next campus haul
            </p>
          </div>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {wishlistProducts.map((product) => (
              <StandardProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className={`p-12 text-center rounded-2xl border max-w-lg mx-auto ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#c85028]/10 text-[#c85028] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-1">Your wishlist is currently empty</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
              Found something you love? Tap the heart icon on any outfit to save it here.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs hover:bg-[#b3441e] transition-colors shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Outfits</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
