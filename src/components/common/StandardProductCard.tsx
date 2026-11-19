import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProductSpecsModal } from './ProductSpecsModal';

interface StandardProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const StandardProductCard: React.FC<StandardProductCardProps> = ({ product }) => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  const isFavorited = isAuthenticated && isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 || product.colors.length > 1) {
      setIsSpecsModalOpen(true);
      return;
    }
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';

    addToCart(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleConfirmSpecs = (prod: Product, size: string, color: string, qty: number) => {
    addToCart(prod, size, color, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('wishlist', 'login');
      return;
    }
    toggleWishlist(product.id);
  };

  // Badge styling matching reference
  const renderBadge = () => {
    if (!product.badge) return null;

    let badgeClass = 'bg-[#0d72ea]'; // Blue for New
    if (product.badge === 'Best Seller') badgeClass = 'bg-[#f59e0b]'; // Amber for Best Seller
    if (product.badge === 'Sale') badgeClass = 'bg-[#dc2626]'; // Red for Sale
    if (product.badge === 'Trending') badgeClass = 'bg-[#ea580c]'; // Orange for Trending

    return (
      <span
        className={`absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white rounded-full shadow-xs tracking-tight ${badgeClass}`}
      >
        {product.badge}
      </span>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border bg-white ${
        isDark
          ? 'border-slate-200/40 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
          : 'border-[#ede4d8] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
      }`}
    >
      {/* Top Image Container: Light studio background matching reference */}
      <div className="relative w-full aspect-[1/0.82] bg-[#f8fafc] overflow-hidden flex items-center justify-center p-2 sm:p-2.5">
        {renderBadge()}

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to wishlist"
          className="absolute top-1.5 right-1.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-gray-900 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Heart
            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            fill={isFavorited ? '#dc2626' : 'none'}
            stroke={isFavorited ? '#dc2626' : 'currentColor'}
            strokeWidth={1.9}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-grow justify-between bg-white text-gray-900">
        <div>
          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1 mb-0.5">
            <div className="flex items-center text-[#f59e0b]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#f59e0b] text-[#f59e0b]"
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold text-gray-600 ml-0.5">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-[11px] sm:text-xs text-gray-900 line-clamp-1 mb-0.5 group-hover:text-[#c85028] transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-center flex-wrap gap-1 mb-1.5">
            <span className="font-black text-xs text-gray-900">
              KSh {product.price.toLocaleString()}
            </span>

            {product.originalPrice && (
              <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}

            {product.discountPercentage && (
              <span className="px-1 py-0.1 text-[8px] sm:text-[9px] font-black text-white bg-[#dc2626] rounded">
                -{product.discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-1 sm:py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : !product.inStock
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-[#c85028] hover:bg-[#b3441e] text-white shadow-xs'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3 h-3 stroke-[2.2]" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3 stroke-[2.2]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Specs Modal */}
      <ProductSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        product={product}
        onConfirm={handleConfirmSpecs}
      />
    </div>
  );
};
