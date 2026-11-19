import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useAuth } from './AuthContext';

export type CartPresentationMode = 'drawer' | 'bottom-popup';

export const GUEST_CART_LIMIT = 3;

interface CartContextType {
  cartItems: CartItem[];
  checkedItemIds: Set<string>;
  toggleCheckItem: (cartItemId: string) => void;
  selectAllItems: () => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  removeMultipleItems: (cartItemIds: string[]) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  checkedSubtotal: number;
  discountCode: string;
  appliedDiscount: number;
  discountAmount: number;
  applyDiscountCode: (code: string) => boolean;
  deliveryFee: number;
  total: number;
  checkedTotal: number;
  isCartOpen: boolean;
  cartPresentation: CartPresentationMode;
  setCartPresentation: (mode: CartPresentationMode) => void;
  openCart: (mode?: CartPresentationMode | unknown) => void;
  closeCart: () => void;
  toggleCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  isGuestCartCapped: boolean;
  guestCartLimit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_INITIAL_CART: CartItem[] = [
  {
    id: 'prod-1-M-Onyx Black',
    productId: 'prod-1',
    product: INITIAL_PRODUCTS[0],
    selectedSize: 'M',
    selectedColor: 'Onyx Black',
    quantity: 1,
    unitPrice: 2500,
  },
  {
    id: 'prod-2-L-Warm Cream',
    productId: 'prod-2',
    product: INITIAL_PRODUCTS[1],
    selectedSize: 'L',
    selectedColor: 'Warm Cream',
    quantity: 1,
    unitPrice: 1500,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sinatra_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_INITIAL_CART;
      }
    }
    return DEFAULT_INITIAL_CART;
  });

  const [checkedItemIds, setCheckedItemIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('sinatra_cart_checked');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      } catch (_) {}
    }
    return new Set(DEFAULT_INITIAL_CART.map((it) => it.id));
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPresentation, setCartPresentation] = useState<CartPresentationMode>('drawer');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.1 for 10%

  // Stored pending addition when unauthenticated user hits the 3-item limit
  const [pendingAddition, setPendingAddition] = useState<{
    product: Product;
    size: string;
    color: string;
    quantity: number;
  } | null>(null);

  // Save cart items to localStorage (guarantees persistence across unlogged & logged-in states)
  useEffect(() => {
    localStorage.setItem('sinatra_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save checked item ids
  useEffect(() => {
    localStorage.setItem(
      'sinatra_cart_checked',
      JSON.stringify(Array.from(checkedItemIds))
    );
  }, [checkedItemIds]);

  // Clean up checked ids when items are removed
  useEffect(() => {
    const itemIds = new Set(cartItems.map((i) => i.id));
    setCheckedItemIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (itemIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [cartItems]);

  const commitItemToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      const cartItemId = `${product.id}-${size}-${color}`;
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === cartItemId);
        if (existing) {
          return prev.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount) }
              : item
          );
        }
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            unitPrice: product.price,
          },
        ];
      });

      setCheckedItemIds((prev) => new Set([...prev, cartItemId]));
      setCartPresentation('drawer');
      setIsCartOpen(true);
    },
    []
  );

  // Auto-commit pending item once user registers or signs in
  useEffect(() => {
    if (isAuthenticated && pendingAddition) {
      commitItemToCart(
        pendingAddition.product,
        pendingAddition.size,
        pendingAddition.color,
        pendingAddition.quantity
      );
      setPendingAddition(null);
    }
  }, [isAuthenticated, pendingAddition, commitItemToCart]);

  const toggleCheckItem = useCallback((id: string) => {
    setCheckedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAllItems = useCallback(() => {
    if (checkedItemIds.size === cartItems.length) {
      setCheckedItemIds(new Set());
    } else {
      setCheckedItemIds(new Set(cartItems.map((it) => it.id)));
    }
  }, [checkedItemIds.size, cartItems]);

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      const cartItemId = `${product.id}-${size}-${color}`;
      const isAlreadyInCart = cartItems.some((item) => item.id === cartItemId);

      // LOGIC GATE: Unauthenticated users can only add up to 3 items from cache
      if (!isAuthenticated && !isAlreadyInCart && cartItems.length >= GUEST_CART_LIMIT) {
        setPendingAddition({ product, size, color, quantity });
        openAuthModal('cart_limit', 'login');
        return;
      }

      commitItemToCart(product, size, color, quantity);
    },
    [isAuthenticated, cartItems, commitItemToCart, openAuthModal]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const removeMultipleItems = useCallback((cartItemIds: string[]) => {
    const toRemove = new Set(cartItemIds);
    setCartItems((prev) => prev.filter((item) => !toRemove.has(item.id)));
  }, []);

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            return {
              ...item,
              quantity: Math.min(quantity, item.product.stockCount),
            };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCheckedItemIds(new Set());
  }, []);

  const applyDiscountCode = useCallback((code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SINATRA10' || clean === 'EGERSCORE10' || clean === 'CAMPUS10') {
      setDiscountCode(clean);
      setAppliedDiscount(0.1);
      return true;
    }
    if (clean === 'SINATRA20' || clean === 'VIP20') {
      setDiscountCode(clean);
      setAppliedDiscount(0.2);
      return true;
    }
    return false;
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const checkedItems = useMemo(
    () => cartItems.filter((i) => checkedItemIds.has(i.id)),
    [cartItems, checkedItemIds]
  );

  const checkedSubtotal = useMemo(
    () => checkedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [checkedItems]
  );

  const discountAmount = Math.round(checkedSubtotal * appliedDiscount);

  // Free delivery above 2,000 KSh
  const deliveryFee = checkedSubtotal >= 2000 || checkedSubtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - Math.round(subtotal * appliedDiscount) + (subtotal >= 2000 || subtotal === 0 ? 0 : 150));
  const checkedTotal = Math.max(0, checkedSubtotal - discountAmount + deliveryFee);

  const openCart = (mode?: CartPresentationMode | unknown) => {
    if (mode === 'bottom-popup' || mode === 'drawer') {
      setCartPresentation(mode);
    } else {
      setCartPresentation('drawer');
    }
    setIsCartOpen(true);
  };

  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  const isGuestCartCapped = !isAuthenticated && cartItems.length >= GUEST_CART_LIMIT;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        checkedItemIds,
        toggleCheckItem,
        selectAllItems,
        addToCart,
        removeFromCart,
        removeMultipleItems,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        checkedSubtotal,
        discountCode,
        appliedDiscount,
        discountAmount,
        applyDiscountCode,
        deliveryFee,
        total,
        checkedTotal,
        isCartOpen,
        cartPresentation,
        setCartPresentation,
        openCart,
        closeCart,
        toggleCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        isGuestCartCapped,
        guestCartLimit: GUEST_CART_LIMIT,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
