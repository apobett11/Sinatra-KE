import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useCart, CartPresentationMode } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  presentationMode?: CartPresentationMode;
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  presentationMode: propPresentationMode,
  onProceedToCheckout: propOnProceedToCheckout,
}) => {
  const { isDark } = useTheme();
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    cartItems,
    checkedItemIds,
    toggleCheckItem,
    selectAllItems,
    updateQuantity,
    removeFromCart,
    removeMultipleItems,
    isCartOpen: contextIsOpen,
    closeCart: contextCloseCart,
    cartPresentation: contextPresentationMode,
    checkedSubtotal,
    discountCode,
    appliedDiscount,
    discountAmount,
    applyDiscountCode,
    deliveryFee,
    checkedTotal,
    openCheckout: contextOpenCheckout,
    isGuestCartCapped,
    guestCartLimit,
  } = useCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onClose = propOnClose || contextCloseCart;
  const presentationMode = propPresentationMode || contextPresentationMode;
  const onProceedToCheckout = propOnProceedToCheckout || contextOpenCheckout;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Set<string>>(new Set());
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Reset edit state when drawer closes or cart empties
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) {
      setIsEditMode(false);
      setSelectedToDelete(new Set());
      setIsConfirmingDelete(false);
    }
  }, [isOpen, cartItems.length]);

  if (!isOpen) return null;

  const isBottomPopup = presentationMode === 'bottom-popup';
  const checkedItems = cartItems.filter((item) => checkedItemIds.has(item.id));
  const allChecked = cartItems.length > 0 && checkedItems.length === cartItems.length;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const ok = applyDiscountCode(promoInput);
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon. Try "SINATRA10" for 10% off');
    }
  };

  const handleToggleSelectToDelete = (id: string) => {
    setSelectedToDelete((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllDelete = () => {
    if (selectedToDelete.size === cartItems.length) {
      setSelectedToDelete(new Set());
    } else {
      setSelectedToDelete(new Set(cartItems.map((it) => it.id)));
    }
  };

  const handleConfirmDelete = () => {
    const ids = Array.from(selectedToDelete);
    removeMultipleItems(ids);
    setSelectedToDelete(new Set());
    setIsConfirmingDelete(false);
    setIsEditMode(false);
  };

  const formatPrice = (val: number) => `KSh ${val.toLocaleString()}`;

  const cartContent = (
    <div
      className={`${
        isBottomPopup
          ? `relative w-full max-w-lg rounded-2xl max-h-[78vh] shadow-2xl flex flex-col animate-bottom-sheet overflow-hidden border z-10 ${
              isDark
                ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/80'
                : 'bg-white border-[#ede4d8] text-[#1a1a1a] shadow-xl'
            }`
          : `relative w-screen max-w-md h-full shadow-2xl border-l flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 ${
              isDark
                ? 'bg-[#0f1724] border-[#1e293b] text-white'
                : 'bg-white border-[#ede4d8] text-[#1a1a1a]'
            }`
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Mobile Drag Pill (Only in bottom popup mode) */}
      {isBottomPopup && (
        <div className="w-12 h-1.5 rounded-full bg-slate-400/30 mx-auto mt-2.5 -mb-1" />
      )}

      {/* Header */}
      <div
        className={`p-3.5 sm:p-4 border-b flex items-center justify-between shrink-0 ${
          isDark
            ? 'bg-[#0b1320] border-[#1f293d]'
            : 'bg-[#faf6f1] border-[#ede4d8]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`p-1.5 rounded-lg flex items-center justify-center font-bold ${
              isDark
                ? 'bg-[#d9532f]/20 text-[#d9532f]'
                : 'bg-[#c85028]/15 text-[#c85028]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {isEditMode ? 'Edit Cart' : 'Shopping Cart'}
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold">
              {isEditMode
                ? `${selectedToDelete.size} of ${cartItems.length} selected to delete`
                : `${checkedItems.length} of ${cartItems.length} items checked`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && !isEditMode && (
            <button
              type="button"
              onClick={selectAllItems}
              className={`text-[10px] font-bold transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#d9532f] hover:text-[#ff6b4a]'
                  : 'text-[#c85028] hover:text-[#9c3413]'
              }`}
            >
              {allChecked ? 'Deselect All' : 'Select All'}
            </button>
          )}

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                  setSelectedToDelete(new Set());
                  setIsConfirmingDelete(false);
                } else {
                  setIsEditMode(true);
                  setSelectedToDelete(new Set());
                }
              }}
              className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isEditMode
                  ? isDark
                    ? 'bg-[#182334] text-white'
                    : 'bg-gray-200 text-gray-800'
                  : isDark
                  ? 'text-gray-300 hover:text-white bg-[#131b28] hover:bg-[#182334]'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isEditMode ? 'Done' : 'Edit'}
            </button>
          )}

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-[#182334]'
                : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
            }`}
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Mode Subheader */}
      {isEditMode && cartItems.length > 0 && (
        <div
          className={`px-3.5 sm:px-4 py-2 border-b flex items-center justify-between text-xs shrink-0 ${
            isDark ? 'bg-[#0a0e17] border-[#1f293d]' : 'bg-[#f4eee6] border-[#ede4d8]'
          }`}
        >
          <span className="text-gray-400 font-medium">
            Select items to remove from cart
          </span>
          <button
            type="button"
            onClick={handleSelectAllDelete}
            className="text-[11px] font-bold text-red-500 hover:text-red-600 cursor-pointer"
          >
            {selectedToDelete.size === cartItems.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      {/* Guest Bag Limit Banner (from storefront logic gate) */}
      {!isAuthenticated && cartItems.length > 0 && (
        <div
          className={`mx-3.5 sm:mx-4 my-2 p-2.5 rounded-xl border flex items-center justify-between text-[11px] shrink-0 ${
            isGuestCartCapped
              ? 'bg-[#c85028]/15 border-[#c85028]/40 text-[#c85028]'
              : isDark
              ? 'bg-[#121c2a] border-[#1e2d40] text-gray-300'
              : 'bg-orange-50/70 border-orange-200 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#c85028] shrink-0" />
            <span className="font-medium">
              {isGuestCartCapped
                ? 'Guest bag full (3/3 items preserved in cache)'
                : `Guest bag: ${cartItems.length}/${guestCartLimit} items`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('cart_limit', 'login')}
            className="text-[10px] font-black uppercase text-[#c85028] hover:underline cursor-pointer shrink-0"
          >
            Sign In to Unlock
          </button>
        </div>
      )}

      {/* Cart Items List */}
      <div
        className={`flex-grow overflow-y-auto p-3 sm:p-4 divide-y ${
          isDark ? 'divide-[#1f293d]' : 'divide-gray-100'
        }`}
      >
        {cartItems.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                isDark ? 'bg-[#121926] text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3
              className={`text-xs font-black uppercase ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}
            >
              Your cart is empty
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 mb-4 max-w-xs">
              Explore campus fleeces, oversized tees, and utility cargos.
            </p>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#d9532f] hover:bg-[#b3441e]'
                  : 'bg-[#c85028] hover:bg-[#9c3413]'
              }`}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          cartItems.map((item) => {
            const isChecked = checkedItemIds.has(item.id);
            const isSelectedForDelete = selectedToDelete.has(item.id);

            return (
              <div
                key={item.id}
                onClick={
                  isEditMode ? () => handleToggleSelectToDelete(item.id) : undefined
                }
                className={`py-3 flex gap-2.5 items-center transition-colors ${
                  isEditMode
                    ? `cursor-pointer px-2 rounded-xl ${
                        isSelectedForDelete
                          ? isDark
                            ? 'bg-red-500/10 border border-red-500/30'
                            : 'bg-red-50 border border-red-200'
                          : isDark
                          ? 'hover:bg-[#121926]'
                          : 'hover:bg-gray-50'
                      }`
                    : ''
                }`}
              >
                {/* Left Checkbox */}
                {isEditMode ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelectToDelete(item.id);
                    }}
                    className="p-1 -ml-1 text-red-500 cursor-pointer shrink-0"
                    aria-label={
                      isSelectedForDelete ? 'Deselect item' : 'Select item to delete'
                    }
                  >
                    {isSelectedForDelete ? (
                      <CheckSquare className="w-5 h-5 text-red-500" />
                    ) : (
                      <Square
                        className={`w-5 h-5 ${
                          isDark ? 'text-gray-600' : 'text-gray-300'
                        } hover:text-red-400`}
                      />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCheckItem(item.id)}
                    className="p-1 -ml-1 cursor-pointer shrink-0"
                    aria-label={isChecked ? 'Deselect product' : 'Select product'}
                  >
                    {isChecked ? (
                      <CheckSquare
                        className={`w-5 h-5 ${
                          isDark ? 'text-[#d9532f]' : 'text-[#c85028]'
                        }`}
                      />
                    ) : (
                      <Square
                        className={`w-5 h-5 ${
                          isDark
                            ? 'text-gray-600 hover:text-gray-400'
                            : 'text-gray-300 hover:text-gray-500'
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className={`w-14 h-14 rounded-lg object-cover shrink-0 border ${
                    isDark
                      ? 'bg-[#121926] border-[#1f293d]'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                />

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h4
                    className={`text-xs font-bold truncate leading-tight ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5 font-medium">
                    <span>Size: {item.selectedSize}</span>
                    <span>•</span>
                    <span>Color: {item.selectedColor}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className={`text-xs font-black ${
                        isEditMode
                          ? isSelectedForDelete
                            ? 'text-red-500'
                            : 'text-gray-400'
                          : isChecked
                          ? isDark
                            ? 'text-white'
                            : 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>

                    {/* Stepper Controls */}
                    {!isEditMode && (
                      <div
                        className={`flex items-center border rounded-lg h-6 px-1 ${
                          isDark
                            ? 'bg-[#121926] border-[#1f293d]'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className={`p-0.5 transition-colors ${
                            item.quantity <= 1
                              ? 'opacity-30 cursor-not-allowed text-gray-500'
                              : 'text-gray-400 hover:text-white cursor-pointer'
                          }`}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span
                          className={`w-5 text-center text-[10px] font-black ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 text-gray-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {isConfirmingDelete && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-xs rounded-2xl p-5 shadow-2xl border text-center space-y-4 animate-spring-pop ${
              isDark
                ? 'bg-[#0e1624] border-[#1f293d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Confirm deletion of {selectedToDelete.size} item{selectedToDelete.size === 1 ? '' : 's'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Confirm deletion of {selectedToDelete.size} item{selectedToDelete.size === 1 ? '' : 's'}. This cannot be reversed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#182334] text-gray-300 hover:bg-[#1f293d]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Footer Action */}
      {isEditMode && cartItems.length > 0 && (
        <div
          className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
            isDark
              ? 'bg-[#0b1320] border-[#1f293d]'
              : 'bg-[#faf6f1] border-[#ede4d8]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setIsEditMode(false);
              setSelectedToDelete(new Set());
              setIsConfirmingDelete(false);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedToDelete.size === 0}
            onClick={() => setIsConfirmingDelete(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              selectedToDelete.size > 0
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-95 cursor-pointer'
                : isDark
                ? 'bg-[#182334] text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected ({selectedToDelete.size})</span>
          </button>
        </div>
      )}

      {/* Normal Mode Footer / Price Summary & Checkout Action */}
      {!isEditMode && cartItems.length > 0 && (
        <div
          className={`p-3.5 sm:p-4 border-t space-y-3 shrink-0 ${
            isDark
              ? 'bg-[#0b1320] border-[#1f293d]'
              : 'bg-[#faf6f1] border-[#ede4d8]'
          }`}
        >
          {/* Coupon form */}
          <form onSubmit={handleApplyPromo} className="flex gap-1.5">
            <div className="relative flex-grow">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Coupon (e.g. SINATRA10)"
                className={`w-full h-8 pl-7 pr-2 text-xs rounded-lg focus:outline-hidden uppercase border ${
                  isDark
                    ? 'bg-[#121926] border-[#1f293d] text-white focus:border-[#d9532f]'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-[#c85028]'
                }`}
              />
              <Tag className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              className={`px-3 h-8 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#182334] hover:bg-[#202e44]'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              Apply
            </button>
          </form>

          {appliedDiscount > 0 && (
            <div className="flex items-center justify-between text-[11px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Coupon ({discountCode}) Applied</span>
              </span>
              <span>- {Math.round(appliedDiscount * 100)}%</span>
            </div>
          )}

          {promoError && (
            <p className="text-[10px] text-red-500 font-medium">{promoError}</p>
          )}

          {/* Pricing breakdown for checked items */}
          <div
            className={`space-y-1 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <div className="flex justify-between">
              <span>Subtotal ({checkedItems.length} selected)</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatPrice(checkedSubtotal)}
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Discount</span>
                <span className="font-bold">- {formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-500">FREE (Above KSh 2K)</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>

            <div
              className={`flex justify-between pt-1.5 border-t text-sm font-black ${
                isDark ? 'border-[#1f293d]' : 'border-gray-200'
              }`}
            >
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                Total Due
              </span>
              <span
                className={`text-base font-black ${
                  isDark ? 'text-[#d9532f]' : 'text-[#c85028]'
                }`}
              >
                {formatPrice(checkedTotal)}
              </span>
            </div>
          </div>

          {checkedItems.length === 0 && (
            <div className="text-[11px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md font-semibold text-center flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Select at least 1 item using the checkbox to checkout</span>
            </div>
          )}

          {/* Checkout Button */}
          <button
            type="button"
            disabled={checkedItems.length === 0}
            onClick={() => {
              onClose();
              onProceedToCheckout();
            }}
            className={`w-full h-11 rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all ${
              checkedItems.length > 0
                ? isDark
                  ? 'bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 active:scale-98 cursor-pointer'
                  : 'bg-gradient-to-r from-[#c85028] to-[#9c3413] hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Checkout ({checkedItems.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted M-Pesa & Campus Hub Checkout</span>
          </div>
        </div>
      )}
    </div>
  );

  // Bottom Popup Presentation: stemmed from the bottom, consistent in size with Categories and Contact
  if (isBottomPopup) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center px-3 pb-15 sm:p-4 sm:pb-6 bg-black/75 backdrop-blur-sm animate-bottom-backdrop"
        onClick={onClose}
      >
        {cartContent}
      </div>
    );
  }

  // Full-Height Side Drawer Presentation: covers navigation bar at z-[100]
  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {cartContent}
      </div>
    </div>
  );
};
