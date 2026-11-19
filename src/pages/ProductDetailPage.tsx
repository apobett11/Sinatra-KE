import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Share2,
  X,
  Copy,
  Ruler,
  Sparkles,
  Shirt,
  Tag,
  Users,
  Palette,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  Clock,
  CreditCard,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { StandardProductCard } from '../components/common/StandardProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { ProductCategory } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  // Fallback if product not found
  if (!product) {
    return (
      <div
        className={`min-h-[60vh] flex items-center justify-center px-4 py-20 ${
          isDark ? 'bg-[#0b141f] text-white' : 'bg-[#faf4ee] text-[#0f172a]'
        }`}
      >
        <div className="max-w-md w-full text-center p-8 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#c85028]/10 text-[#c85028] flex items-center justify-center">
            <Shirt className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight mb-2">Outfit Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            The requested Sinatra outfit does not exist or may have been retired from the campus collection.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Component state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Modals & Lightbox
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mobile swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Track if scrolled past primary CTA on desktop for sticky bar
  const [showDesktopStickyBar, setShowDesktopStickyBar] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement | null>(null);

  const isFavorited = isInWishlist(product.id);

  // Sync selected color and image when product slug changes
  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setQuantity(1);
    setJustAdded(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [product.slug]);

  // Desktop scroll listener for sticky dock
  useEffect(() => {
    const handleScroll = () => {
      if (mainCtaRef.current) {
        const rect = mainCtaRef.current.getBoundingClientRect();
        setShowDesktopStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (!isImageViewerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImageViewerOpen(false);
      if (e.key === 'ArrowRight') {
        setViewerIndex((prev) => (prev + 1) % product.images.length);
      }
      if (e.key === 'ArrowLeft') {
        setViewerIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen, product.images.length]);

  // Handle color selection: update color and sync gallery if variant image exists
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const colorObj = product.colors.find((c) => c.name === colorName);
    if (colorObj?.image) {
      const imgIdx = product.images.indexOf(colorObj.image);
      if (imgIdx !== -1) {
        setSelectedImage(imgIdx);
      }
    }
  };

  // Add to cart with responsive visual feedback and anti-spam guard
  const handleAddToCart = () => {
    if (!product.inStock || isAddingToCart) return;
    setIsAddingToCart(true);

    setTimeout(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      setIsAddingToCart(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2400);
    }, 280);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
    if (isRightSwipe && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Canonical share handler
  const handleCopyShareLink = async () => {
    const canonicalUrl = `${window.location.origin}/product/${product.slug}`;
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleNativeShare = async () => {
    const canonicalUrl = `${window.location.origin}/product/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SINATRA — ${product.name}`,
          text: `Check out ${product.name} at SINATRA (Egerton University campus wear)!`,
          url: canonicalUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyShareLink();
    }
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  // Complementary Products Logic: FINISH THE STYLE (Section 16)
  const complementaryProducts = useMemo(() => {
    let targetCategories: ProductCategory[] = [];
    if (product.category === 'hoodies') {
      targetCategories = ['trousers', 'tshirts', 'sweatshirts'];
    } else if (product.category === 'tshirts') {
      targetCategories = ['trousers', 'sweatshirts', 'hoodies'];
    } else if (product.category === 'sweatshirts') {
      targetCategories = ['trousers', 'tshirts', 'hoodies'];
    } else if (product.category === 'trousers') {
      targetCategories = ['hoodies', 'tshirts', 'sweatshirts'];
    }

    const matches = INITIAL_PRODUCTS.filter(
      (p) => p.id !== product.id && targetCategories.includes(p.category)
    );

    if (matches.length < 4) {
      const fillers = INITIAL_PRODUCTS.filter(
        (p) => p.id !== product.id && !matches.some((m) => m.id === p.id)
      );
      return [...matches, ...fillers].slice(0, 4);
    }
    return matches.slice(0, 4);
  }, [product]);

  // Product specification tiles data (Section 13)
  const specifications = useMemo(() => {
    const specs: { label: string; value: string; icon: React.FC<{ className?: string }> }[] = [];

    // 1. Material & Fabric
    const fabricDetail = product.details.find(
      (d) =>
        d.toLowerCase().includes('gsm') ||
        d.toLowerCase().includes('cotton') ||
        d.toLowerCase().includes('wool') ||
        d.toLowerCase().includes('fleece') ||
        d.toLowerCase().includes('fabric') ||
        d.toLowerCase().includes('ripstop')
    );
    specs.push({
      label: 'Material & Fabric',
      value: fabricDetail || 'Premium heavyweight cotton blend',
      icon: Sparkles,
    });

    // 2. Fit
    specs.push({
      label: 'Fit & Cut',
      value: `${product.style} • Standard Campus Cut`,
      icon: Shirt,
    });

    // 3. Style Category
    specs.push({
      label: 'Collection Style',
      value: `${product.style} Streetwear`,
      icon: Tag,
    });

    // 4. Target Audience
    specs.push({
      label: 'Audience Class',
      value: `${product.audience} Apparel`,
      icon: Users,
    });

    // 5. Sizes
    specs.push({
      label: 'Available Sizes',
      value: product.sizes.join(', '),
      icon: Ruler,
    });

    // 6. Colours
    specs.push({
      label: 'Available Colours',
      value: product.colors.map((c) => c.name).join(', '),
      icon: Palette,
    });

    // 7. Care Instructions
    const careDetail = product.details.find(
      (d) =>
        d.toLowerCase().includes('wash') ||
        d.toLowerCase().includes('shrink') ||
        d.toLowerCase().includes('durability')
    );
    specs.push({
      label: 'Care Instructions',
      value:
        careDetail || 'Machine wash cold (30°C). Air dry recommended. Do not iron over prints.',
      icon: RotateCcw,
    });

    // 8. Campus Origin
    specs.push({
      label: 'Campus Heritage',
      value: 'Egerton University Sinatra Hub (Njoro)',
      icon: ShieldCheck,
    });

    return specs;
  }, [product]);

  // Badge styling matching reference
  const renderBadge = (badgeText?: string) => {
    if (!badgeText) return null;
    let badgeClass = 'bg-[#0d72ea]'; // Blue for New
    if (badgeText === 'Best Seller') badgeClass = 'bg-[#f59e0b]'; // Amber for Best Seller
    if (badgeText === 'Sale') badgeClass = 'bg-[#dc2626]'; // Red for Sale
    if (badgeText === 'Trending') badgeClass = 'bg-[#ea580c]'; // Orange for Trending
    if (badgeText === 'Limited Stock') badgeClass = 'bg-[#ea580c]';

    return (
      <span
        className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white rounded-full shadow-xs uppercase tracking-tight ${badgeClass}`}
      >
        {badgeText}
      </span>
    );
  };

  const isLimitedStock = product.inStock && product.stockCount <= 10;
  const currentBadge = product.badge || (isLimitedStock ? 'Limited Stock' : undefined);

  return (
    <div
      className={`w-full min-h-screen pb-24 lg:pb-12 transition-colors ${
        isDark ? 'bg-[#0b141f] text-white' : 'bg-[#faf4ee] text-[#0f172a]'
      }`}
    >
      {/* =========================================================================
          DESKTOP BREADCRUMB HEADER (Section 3)
         ========================================================================= */}
      <div
        className={`hidden lg:block w-full py-3.5 px-4 sm:px-6 lg:px-8 border-b ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f8f2eb] border-[#ede4d8]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/shop" className="hover:text-[#c85028] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link
            to={`/shop/${product.category}`}
            className="hover:text-[#c85028] transition-colors capitalize"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#c85028] font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* =========================================================================
          MAIN PRODUCT SECTION
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-0 lg:px-8 pt-0 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
          
          {/* =====================================================================
              PRODUCT IMAGE GALLERY (Section 4 & 5)
             ===================================================================== */}
          <div className="lg:col-span-7 relative">
            
            {/* MOBILE ONLY: Floating Top Controls (Section 5) */}
            <div className="lg:hidden absolute top-0 inset-x-0 z-30 p-4 pt-[max(1rem,env(safe-area-inset-top))] flex items-center justify-between pointer-events-none">
              {/* Back Button */}
              <button
                onClick={handleBackNavigation}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-transform active:scale-90 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Share & Wishlist Capsule */}
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg pointer-events-auto">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  aria-label="Share product"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-transform active:scale-90"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <span className="w-px h-4 bg-white/25" />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 text-white"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFavorited ? 'fill-[#c85028] text-[#c85028]' : 'text-white'
                    }`}
                    strokeWidth={isFavorited ? 0 : 2}
                  />
                </button>
              </div>
            </div>

            {/* MAIN IMAGE CONTAINER */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative w-full overflow-hidden flex items-center justify-center select-none ${
                'h-[52vh] min-h-[380px] max-h-[520px] lg:h-auto lg:aspect-[4/3.5] lg:rounded-3xl lg:border bg-[#f8fafc]'
              } ${isDark ? 'lg:border-slate-800' : 'lg:border-[#ede4d8]'}`}
            >
              {/* Subtle top vignette on mobile for floating controls contrast */}
              <div className="lg:hidden absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none z-10" />

              {/* Desktop Product Badge */}
              {currentBadge && (
                <div className="hidden lg:block absolute top-4 left-4 z-10">
                  {renderBadge(currentBadge)}
                </div>
              )}

              {/* Desktop Wishlist & Share controls */}
              <div className="hidden lg:flex items-center gap-2 absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  aria-label="Share product"
                  className="w-9 h-9 rounded-full bg-white/85 dark:bg-[#101b28]/85 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-[#c85028] dark:hover:text-[#c85028] transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to Wishlist"
                  className="w-9 h-9 rounded-full bg-white/85 dark:bg-[#101b28]/85 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#c85028] text-[#c85028]' : 'text-gray-700 dark:text-gray-200'
                    }`}
                    strokeWidth={isFavorited ? 0 : 2}
                  />
                </button>
              </div>

              {/* Primary Product Image with Click-to-Zoom */}
              <div
                onClick={() => {
                  setViewerIndex(selectedImage);
                  setIsImageViewerOpen(true);
                }}
                className="w-full h-full p-4 sm:p-8 flex items-center justify-center cursor-zoom-in"
              >
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              {/* Desktop Prev/Next Controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
                    }}
                    aria-label="Previous image"
                    className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 dark:bg-[#101b28]/85 backdrop-blur-md shadow-md border border-black/5 dark:border-white/10 items-center justify-center text-gray-800 dark:text-gray-200 hover:text-[#c85028] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev + 1) % product.images.length);
                    }}
                    aria-label="Next image"
                    className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 dark:bg-[#101b28]/85 backdrop-blur-md shadow-md border border-black/5 dark:border-white/10 items-center justify-center text-gray-800 dark:text-gray-200 hover:text-[#c85028] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Desktop Fullscreen expand trigger */}
              <button
                onClick={() => {
                  setViewerIndex(selectedImage);
                  setIsImageViewerOpen(true);
                }}
                aria-label="Open image viewer"
                className="hidden lg:flex absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* MOBILE ONLY: Carousel Dots Indicators & Image Counter (Section 4) */}
              {product.images.length > 1 && (
                <div className="lg:hidden absolute bottom-8 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
                  {product.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`transition-all duration-300 ${
                        selectedImage === idx
                          ? 'w-6 h-1.5 rounded-full bg-[#c85028]'
                          : 'w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Mobile image counter badge at bottom right */}
              <div className="lg:hidden absolute bottom-8 right-4 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/50 backdrop-blur-sm text-white/95">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Desktop Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 p-1.5 bg-[#f8fafc] transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? 'border-[#c85028] scale-105 shadow-md'
                        : isDark
                        ? 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                        : 'border-[#ede4d8] opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =====================================================================
              ELEVATED PRODUCT INFORMATION PANEL (Section 6, 7, 8, 9, 10, 11, 12)
             ===================================================================== */}
          <div
            className={`lg:col-span-5 relative z-20 ${
              '-mt-7 rounded-t-[32px] border-t px-4 pt-6 pb-6 lg:mt-0 lg:rounded-3xl lg:border lg:p-7 lg:pb-7'
            } ${
              isDark
                ? 'bg-[#0b141f] border-[#19273a] lg:bg-[#101b28] shadow-[0_-12px_32px_rgba(0,0,0,0.55)] lg:shadow-md'
                : 'bg-[#faf4ee] border-[#ede4d8] lg:bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] lg:shadow-md'
            }`}
          >
            {/* Badge & Stock Status Bar */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                {currentBadge && (
                  <div className="lg:hidden">
                    {renderBadge(currentBadge)}
                  </div>
                )}
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {product.inStock ? 'In Stock (Campus Ready)' : 'Out of Stock'}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-gray-400">
                Egerton Verified
              </span>
            </div>

            {/* Product Classification (Section 7) */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              <span className="text-[#c85028]">{product.categoryLabel}</span>
              <span>•</span>
              <span>{product.audience}</span>
              <span>•</span>
              <span>{product.style} Style</span>
            </div>

            {/* Product Title (Section 7) */}
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Star Rating & Review Count (Section 7) */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#f59e0b]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" strokeWidth={0} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {product.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount} Egerton reviews)
              </span>
            </div>

            {/* Price and Discount Row (Section 8) */}
            <div className="flex items-baseline flex-wrap gap-2.5 sm:gap-3 py-3 border-y border-gray-200/60 dark:border-gray-800/80 mb-5">
              <span className="text-2xl sm:text-3xl font-black text-[#c85028] font-heading tracking-tight">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discountPercentage && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#dc2626] rounded-md tracking-tight">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Product Description with Read More / Show Less (Section 9) */}
            <div className="mb-6">
              <p
                className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed ${
                  isDescriptionExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {product.description}
              </p>
              {product.description.length > 110 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-1 text-xs font-bold text-[#c85028] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isDescriptionExpanded ? 'Show Less' : 'Read More'}</span>
                  {isDescriptionExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Colour Selection (Section 10) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Colour: <span className="text-gray-900 dark:text-white font-extrabold">{selectedColor}</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {product.colors.length} choices
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleSelectColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#c85028] bg-[#c85028]/10 text-[#c85028] font-bold shadow-xs'
                          : isDark
                          ? 'border-gray-800 bg-[#0e1825] text-gray-300 hover:border-gray-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection & Size Guide Trigger (Section 11) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Select Size: <span className="text-gray-900 dark:text-white font-extrabold">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c85028] hover:underline cursor-pointer"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-11 h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c85028] text-white border-[#c85028] shadow-md scale-105'
                          : isDark
                          ? 'bg-[#0e1825] border-gray-800 text-gray-300 hover:border-gray-700'
                          : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector Row (Section 12) */}
            <div className="flex items-center justify-between py-3 mb-5 border-y border-gray-200/60 dark:border-gray-800/80">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quantity
                </label>
                <span className="text-[11px] text-gray-400">
                  Max: {product.stockCount} units available
                </span>
              </div>
              <div
                className={`flex items-center border rounded-xl overflow-hidden h-10 ${
                  isDark ? 'border-gray-800 bg-[#0e1825]' : 'border-gray-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3 h-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold min-w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  disabled={quantity >= product.stockCount}
                  aria-label="Increase quantity"
                  className="px-3 h-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* DESKTOP-ONLY INLINE CTAs (Section 17 Desktop) */}
            <div ref={mainCtaRef} className="hidden lg:block space-y-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : !product.inStock
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#c85028] hover:bg-[#b3441e] text-white shadow-[#c85028]/25'
                }`}
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      Add to Cart • KSh {(product.price * quantity).toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/254712345678?text=Hi%20Sinatra,%20I%20would%20like%20to%20order:%20${encodeURIComponent(
                  product.name
                )}%20(Size:%20${selectedSize},%20Colour:%20${selectedColor},%20Qty:%20${quantity})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>

            {/* Delivery & Collection Information (Section 14) */}
            <div
              className={`p-4 rounded-2xl border space-y-2.5 text-xs mb-5 ${
                isDark ? 'bg-[#0e1825] border-[#18273a]' : 'bg-[#f7f2ea] border-[#ede4d8]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#c85028] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Free delivery across Egerton halls on orders above KSh 2,000
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#c85028] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Free pickup available at both physical stores: Student Centre Hub (Rm 12) & Gate B Pavilion (Shop 4)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#c85028] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Hassle-free size exchanges available within 48 hours
                </span>
              </div>
            </div>

            {/* Trust and Customer Confidence Panel (Section 15) */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400 ${
                isDark ? 'border-gray-800/80 bg-black/20' : 'border-gray-200 bg-white/60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c85028]" />
                <span>Njoro Rapid Hand-off</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#c85028]" />
                <span>M-Pesa Verified</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c85028]" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            CUSTOMER REVIEWS SECTION (Section 7 & 22)
           ===================================================================== */}
        <div className="mt-10 sm:mt-14 px-4 lg:px-0">
          <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6 sm:pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight">
                  Customer Reviews ({product.reviews?.length || 0})
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verified customer feedback from Egerton shoppers
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#c85028]/10 text-[#c85028] px-2.5 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#c85028]" strokeWidth={0} />
                <span>{product.rating} / 5.0</span>
              </div>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-4 rounded-2xl border text-xs flex flex-col justify-between ${
                      isDark ? 'bg-[#101b28] border-[#18273a]' : 'bg-white border-[#ede4d8] shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-500 font-bold rounded">
                              Verified Customer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex text-[#f59e0b] mb-2">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" strokeWidth={0} />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-gray-400 border rounded-2xl border-dashed border-gray-300 dark:border-gray-800">
                <Shirt className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-50" />
                <p className="font-semibold text-gray-600 dark:text-gray-300">
                  No reviews yet for this newly released outfit.
                </p>
                <p className="mt-1">Be the first customer to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            FINISH THE STYLE — RELATED PRODUCTS (Section 16)
           ===================================================================== */}
        {complementaryProducts.length > 0 && (
          <div className="mt-12 sm:mt-20 px-4 lg:px-0">
            <div className="border-t border-gray-200 dark:border-gray-800/80 pt-8 sm:pt-12">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                    FINISH THE STYLE
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Complementary campus outfits designed to work together
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#c85028] hover:text-[#b3441e] transition-colors"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </Link>
              </div>

              {/* Desktop: 4-column Grid */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                {complementaryProducts.map((p) => (
                  <StandardProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Mobile Horizontal Carousel */}
              <div className="lg:hidden flex gap-2.5 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-4 px-4">
                {complementaryProducts.map((p) => (
                  <div key={p.id} className="w-[150px] sm:w-[170px] flex-shrink-0">
                    <StandardProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          FIXED PURCHASE ACTION BAR (Section 17)
         ========================================================================= */}
      
      {/* MOBILE FIXED BOTTOM DOCK (Section 17 Mobile) */}
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl border-t px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-colors ${
          isDark
            ? 'bg-[#0a111b]/95 border-[#1a2332] text-white shadow-[0_-8px_25px_rgba(0,0,0,0.6)]'
            : 'bg-[#faf6f1]/95 border-[#ede4d8] text-gray-900 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Price & Variant Snapshot */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Total
            </span>
            <span className="text-lg font-black text-[#c85028] font-heading leading-tight">
              KSh {(product.price * quantity).toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">
              {selectedSize} • {selectedColor}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/254712345678?text=Hi%20Sinatra,%20I%20would%20like%20to%20order:%20${encodeURIComponent(
                product.name
              )}%20(Size:%20${selectedSize},%20Colour:%20${selectedColor},%20Qty:%20${quantity})`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="w-11 h-11 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`h-11 px-5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : !product.inStock
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-[#c85028] hover:bg-[#b3441e] text-white shadow-[#c85028]/25'
              }`}
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP STICKY PURCHASE BAR (Section 17 Desktop) */}
      {showDesktopStickyBar && (
        <div
          className={`hidden lg:block fixed bottom-6 right-8 z-40 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            isDark
              ? 'bg-[#0a111b]/95 border-[#1a2332] text-white'
              : 'bg-white/95 border-[#ede4d8] text-gray-900'
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt=""
              className="w-12 h-12 rounded-xl object-contain bg-[#f8fafc] border border-gray-200 dark:border-gray-800 p-1"
            />
            <div>
              <div className="text-xs font-bold line-clamp-1 max-w-[180px]">{product.name}</div>
              <div className="text-xs text-[#c85028] font-black">
                KSh {(product.price * quantity).toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c85028] hover:bg-[#b3441e] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SHARE PRODUCT MODAL (Section 18)
         ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#101b28] border-[#18273a] text-white' : 'bg-white border-[#ede4d8] text-gray-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#c85028]/10 text-[#c85028] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-black tracking-tight text-sm uppercase">
                  Share Product
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Preview */}
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 mb-5 ${
                isDark ? 'bg-[#09121d] border-gray-800' : 'bg-[#f7f2ea] border-[#ede4d8]'
              }`}
            >
              <img
                src={product.images[0]}
                alt=""
                className="w-14 h-14 rounded-xl object-contain bg-white p-1 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#c85028] uppercase tracking-wider block">
                  {product.categoryLabel}
                </span>
                <h4 className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h4>
                <div className="text-xs font-black text-[#c85028] mt-0.5">
                  KSh {product.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out the ${product.name} at SINATRA (Egerton University campus wear): ${window.location.origin}/product/${product.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={handleCopyShareLink}
                className={`w-full h-11 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                    : isDark
                    ? 'border-gray-800 bg-[#0e1825] text-gray-200 hover:border-gray-700'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Product Link</span>
                  </>
                )}
              </button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full h-10 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  More Options...
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SIZE GUIDE MODAL (Section 11)
         ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#101b28] border-[#18273a] text-white' : 'bg-white border-[#ede4d8] text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#c85028]/10 text-[#c85028] flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-black tracking-tight text-sm uppercase">
                  Campus Sizing Chart
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Standard collegiate streetwear fit. For an intentional relaxed drop-shoulder look, select your true size.
            </p>

            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 mb-4 text-xs">
              <table className="w-full text-left">
                <thead className={isDark ? 'bg-[#0a111b] text-gray-300' : 'bg-[#f7f2ea] text-gray-700'}>
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Size</th>
                    <th className="py-2.5 px-3 font-bold">Chest (in)</th>
                    <th className="py-2.5 px-3 font-bold">Length (in)</th>
                    <th className="py-2.5 px-3 font-bold">Height Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-500 dark:text-gray-400">
                  <tr>
                    <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">S</td>
                    <td className="py-2 px-3">36 - 38</td>
                    <td className="py-2 px-3">27</td>
                    <td className="py-2 px-3">5'4" - 5'7"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">M</td>
                    <td className="py-2 px-3">39 - 41</td>
                    <td className="py-2 px-3">28</td>
                    <td className="py-2 px-3">5'7" - 5'10"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">L</td>
                    <td className="py-2 px-3">42 - 44</td>
                    <td className="py-2 px-3">29</td>
                    <td className="py-2 px-3">5'10" - 6'1"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">XL</td>
                    <td className="py-2 px-3">45 - 47</td>
                    <td className="py-2 px-3">30</td>
                    <td className="py-2 px-3">6'1" - 6'4"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">XXL</td>
                    <td className="py-2 px-3">48 - 50</td>
                    <td className="py-2 px-3">31</td>
                    <td className="py-2 px-3">6'3"+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT IMAGE VIEWER / LIGHTBOX (Section 19)
         ========================================================================= */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-150">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="text-xs font-bold tracking-wider uppercase text-gray-400">
              {product.name} • {viewerIndex + 1} of {product.images.length}
            </div>
            <button
              onClick={() => setIsImageViewerOpen(false)}
              aria-label="Close image viewer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Fullscreen Image with Prev/Next Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {product.images.length > 1 && (
              <button
                onClick={() =>
                  setViewerIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
                }
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="w-full flex-1 flex items-center justify-center p-4">
              <img
                src={product.images[viewerIndex] || product.images[0]}
                alt={product.name}
                className="w-auto h-auto max-h-[75vh] max-w-[85vw] sm:min-w-[420px] object-contain select-none rounded-xl"
              />
            </div>

            {product.images.length > 1 && (
              <button
                onClick={() =>
                  setViewerIndex((prev) => (prev + 1) % product.images.length)
                }
                aria-label="Next image"
                className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 z-10">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setViewerIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 p-1 bg-white/5 transition-all cursor-pointer ${
                    viewerIndex === i ? 'border-[#c85028] scale-105' : 'border-white/20 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
