import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ShoppingCart } from 'lucide-react';
import { MobileBottomNav, StorefrontNavTab } from './components/common/MobileBottomNav';
import { CategoriesBottomModal } from './components/common/CategoriesBottomModal';
import { OrdersBottomModal } from './components/common/OrdersBottomModal';
import { ContactBottomModal } from './components/common/ContactBottomModal';
import { ProfileBottomModal } from './components/common/ProfileBottomModal';
import { MobileDrawer } from './components/common/MobileDrawer';
import { DesktopSidebar } from './components/common/DesktopSidebar';
import { CartDrawer } from './components/common/CartDrawer';
import { CheckoutModal } from './components/common/CheckoutModal';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountDashboardPage } from './pages/AccountDashboardPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function StorefrontLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [categoriesModalTab, setCategoriesModalTab] = useState<'categories' | 'classes'>('categories');
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {
    isCartOpen,
    cartPresentation,
    openCart,
    closeCart,
    cartCount,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const activeNav = useMemo<StorefrontNavTab>(() => {
    if (isCategoriesModalOpen) return categoriesModalTab === 'classes' ? 'classes' : 'categories';
    if (isOrdersModalOpen) return 'orders';
    if (isContactModalOpen) return 'contact';
    if (isProfileModalOpen) return 'profile';
    if (isCartOpen) return 'cart';
    const path = location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/shop')) return 'categories';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/account/orders')) return 'orders';
    if (path.startsWith('/account')) return 'profile';
    return 'home';
  }, [
    isCategoriesModalOpen,
    categoriesModalTab,
    isOrdersModalOpen,
    isContactModalOpen,
    isProfileModalOpen,
    isCartOpen,
    location.pathname,
  ]);

  const closeAllNavDrawers = () => {
    setIsCategoriesModalOpen(false);
    setIsOrdersModalOpen(false);
    setIsContactModalOpen(false);
    setIsProfileModalOpen(false);
    closeCart();
  };

  const handleGoHome = () => {
    closeAllNavDrawers();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategories = () => {
    const shouldOpen = !isCategoriesModalOpen;
    closeAllNavDrawers();
    if (shouldOpen) {
      setCategoriesModalTab('categories');
      setIsCategoriesModalOpen(true);
    }
  };

  const handleOpenClasses = () => {
    const shouldOpen = !isCategoriesModalOpen;
    closeAllNavDrawers();
    if (shouldOpen) {
      setCategoriesModalTab('classes');
      setIsCategoriesModalOpen(true);
    }
  };

  const handleOpenOrders = () => {
    const shouldOpen = !isOrdersModalOpen;
    closeAllNavDrawers();
    if (shouldOpen) {
      setIsOrdersModalOpen(true);
    }
  };

  const handleOpenContact = () => {
    const shouldOpen = !isContactModalOpen;
    closeAllNavDrawers();
    if (shouldOpen) {
      setIsContactModalOpen(true);
    }
  };

  const handleOpenProfile = () => {
    const shouldOpen = !isProfileModalOpen;
    closeAllNavDrawers();
    if (shouldOpen) {
      setIsProfileModalOpen(true);
    }
  };

  const handleOpenCart = () => {
    closeAllNavDrawers();
    openCart('bottom-popup');
  };

  const handleSelectCategory = (slug: string) => {
    closeAllNavDrawers();
    if (slug === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${slug}`);
    }
  };

  const handleSelectClass = (type: string, value: string) => {
    closeAllNavDrawers();
    navigate(`/shop?${type}=${encodeURIComponent(value)}`);
  };

  const handleOpenContactPage = () => {
    closeAllNavDrawers();
    navigate('/contact');
  };

  const isProductPage = location.pathname.startsWith('/product/');
  const isLoginPage = location.pathname === '/login';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const cartTop = Math.max(isMobile ? 12 : 16, (isMobile ? 64 : 92) - scrollY);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-[#c85028] selection:text-white ${
        isLoginPage ? 'h-screen max-h-screen overflow-hidden' : ''
      }`}
    >
      <ScrollToTop />

      {/* Global 4.2 Header */}
      <div className={isProductPage ? 'hidden lg:block' : ''}>
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
      </div>

      {/* Constant Floating Cart: Scrolls with top navigation bar, then sticks at top of page */}
      <button
        onClick={() => openCart('drawer')}
        aria-label="View shopping cart"
        style={{ top: `${cartTop}px` }}
        className="fixed right-3 sm:right-6 z-40 group flex items-center gap-2 bg-[#c85028] hover:bg-[#b3441e] text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-[0_6px_22px_rgba(200,80,40,0.45)] hover:shadow-[0_8px_28px_rgba(200,80,40,0.6)] transition-all duration-100 active:scale-95 cursor-pointer will-change-[top,transform]"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-white text-[#c85028] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-wide pr-0.5">
          Cart {cartCount > 0 ? `(${cartCount})` : ''}
        </span>
      </button>

      {/* Layout Body with PC Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar: PC View, not collapsible */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/account" element={<AccountDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account/orders" element={<CustomerOrdersPage />} />
              <Route path="/account/profile" element={<CustomerProfilePage />} />
            </Routes>
          </main>

          {/* Global 4.3 Footer: omitted on login to ensure no vertical scrolling */}
          {location.pathname !== '/login' && <Footer />}
        </div>
      </div>

      {/* Global Overlays, Drawers & Popups */}
      {!isProductPage && !isLoginPage && (
        <MobileBottomNav
          cartCount={cartCount}
          activeNav={activeNav}
          onOpenCart={handleOpenCart}
          onOpenCategories={handleOpenCategories}
          onOpenClasses={handleOpenClasses}
          onOpenOrders={handleOpenOrders}
          onOpenContact={handleOpenContact}
          onOpenProfile={handleOpenProfile}
          onGoHome={handleGoHome}
          onSelectCategory={handleSelectCategory}
        />
      )}
      <CategoriesBottomModal
        isOpen={isCategoriesModalOpen}
        initialTab={categoriesModalTab}
        onClose={() => setIsCategoriesModalOpen(false)}
        onSelectCategory={handleSelectCategory}
        onSelectClass={handleSelectClass}
        onTabChange={(tab) => setCategoriesModalTab(tab)}
      />
      <OrdersBottomModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />
      <ContactBottomModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onOpenContactPage={handleOpenContactPage}
      />
      <ProfileBottomModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer
        isOpen={isCartOpen}
        presentationMode={cartPresentation}
        onClose={closeCart}
        onProceedToCheckout={openCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <StorefrontLayout />
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
