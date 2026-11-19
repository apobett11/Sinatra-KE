import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  PhoneCall,
  LogIn,
  Package,
  User,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export type StorefrontNavTab =
  | 'home'
  | 'categories'
  | 'classes'
  | 'cart'
  | 'contact'
  | 'login'
  | 'orders'
  | 'profile'
  | 'dashboard';

export interface MobileBottomNavProps {
  cartCount?: number;
  activeNav?: StorefrontNavTab;
  onSelectNav?: (tab: StorefrontNavTab) => void;
  onOpenCart?: () => void;
  onOpenCategories?: () => void;
  onOpenClasses?: () => void;
  onOpenOrders?: () => void;
  onOpenContact?: () => void;
  onOpenProfile?: () => void;
  onGoHome?: () => void;
  onSelectCategory?: (slug: string) => void;
}

export const MobileBottomNavComponent: React.FC<MobileBottomNavProps> = ({
  cartCount: _propCartCount,
  activeNav: propActiveNav,
  onSelectNav,
  onOpenCategories,
  onOpenOrders,
  onOpenContact,
  onOpenProfile,
  onGoHome,
}) => {
  const { isDark } = useTheme();
  const { isAuthenticated, orders } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab if not passed explicitly
  const getActiveTab = (): StorefrontNavTab => {
    if (propActiveNav) return propActiveNav;
    const path = location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/shop')) return 'categories';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/login') || path.startsWith('/register')) return isAuthenticated ? 'profile' : 'login';
    if (path.startsWith('/account/orders')) return 'orders';
    if (path.startsWith('/account')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleHomeClick = () => {
    onSelectNav?.('home');
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoriesClick = () => {
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      onSelectNav?.('categories');
    }
  };

  const handleOrdersClick = () => {
    if (onOpenOrders) {
      onOpenOrders();
    } else {
      onSelectNav?.('orders');
      navigate('/account/orders');
    }
  };

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      onSelectNav?.('contact');
      navigate('/contact');
    }
  };

  const handleProfileClick = () => {
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      onSelectNav?.('profile');
      navigate('/account/profile');
    }
  };

  // Unauthenticated items: Home, Categories, Contact, Profile (with Auth popup)
  // Authenticated items: Home, Categories, Orders, Contact, Profile (changed from Dashboard to Profile)
  const navItems = !isAuthenticated
    ? [
        {
          id: 'home' as StorefrontNavTab,
          label: 'Home',
          icon: Home,
          onClick: handleHomeClick,
        },
        {
          id: 'categories' as StorefrontNavTab,
          label: 'Categories',
          icon: LayoutGrid,
          onClick: handleCategoriesClick,
        },
        {
          id: 'contact' as StorefrontNavTab,
          label: 'Contact',
          icon: PhoneCall,
          onClick: handleContactClick,
        },
        {
          id: 'login' as StorefrontNavTab,
          label: 'Profile',
          icon: User,
          onClick: handleProfileClick,
        },
      ]
    : [
        {
          id: 'home' as StorefrontNavTab,
          label: 'Home',
          icon: Home,
          onClick: handleHomeClick,
        },
        {
          id: 'categories' as StorefrontNavTab,
          label: 'Categories',
          icon: LayoutGrid,
          onClick: handleCategoriesClick,
        },
        {
          id: 'orders' as StorefrontNavTab,
          label: 'Orders',
          icon: Package,
          badge: orders.length > 0 ? orders.length : undefined,
          onClick: handleOrdersClick,
        },
        {
          id: 'contact' as StorefrontNavTab,
          label: 'Contact',
          icon: PhoneCall,
          onClick: handleContactClick,
        },
        {
          id: 'profile' as StorefrontNavTab,
          label: 'Profile',
          icon: User,
          onClick: handleProfileClick,
        },
      ];

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-60 lg:hidden backdrop-blur-xl border-t shadow-2xl transition-colors ${
        isDark
          ? 'bg-[#0a111b]/95 border-[#1a2332] text-gray-400 shadow-[0_-6px_20px_rgba(0,0,0,0.5)]'
          : 'bg-[#eae0d0]/95 border-[#d8c7b0] text-gray-700 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex items-center justify-between h-15 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'login' && activeTab === 'profile') ||
            (item.id === 'profile' && activeTab === 'dashboard');
          const badgeCount = (item as any).badge;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`relative flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-150 ease-out cursor-pointer active:scale-95 touch-manipulation will-change-transform ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-b from-[#d9532f] to-[#b3441e] text-white shadow-md font-bold'
                    : 'bg-gradient-to-b from-[#c85028] to-[#9c3413] text-white shadow-md font-bold'
                  : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800/40'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-[#dfd0ba]/50'
              }`}
            >
              {/* Active Indicator Bar on top */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-white shadow-sm animate-spring-pop" />
              )}

              <div className="relative">
                <Icon
                  className={`w-4.5 h-4.5 transition-transform duration-200 ${
                    isActive ? 'scale-110 drop-shadow' : ''
                  }`}
                />
                {badgeCount && badgeCount > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[15px] h-[15px] px-1 bg-[#801815] text-white text-[8px] font-black rounded-full leading-none animate-spring-pop shadow-xs">
                    {badgeCount}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] mt-0.5 leading-tight truncate font-bold ${
                  isActive ? 'text-white' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const MobileBottomNav = React.memo(MobileBottomNavComponent);
