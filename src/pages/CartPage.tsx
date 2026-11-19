import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronRight,
  Edit3,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeMultipleItems, subtotal, deliveryFee, total } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Set<string>>(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleToggleSelect = (id: string) => {
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

  const handleSelectAll = () => {
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
    setIsConfirmModalOpen(false);
    setIsEditMode(false);
  };

  return (
    <div className="w-full pb-24 sm:pb-20">
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
          <span className="text-[#c85028] font-bold">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Shopping Cart</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Review your items before proceeding to campus delivery checkout.
            </p>
          </div>

          {/* Edit Cart Button */}
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                  setSelectedToDelete(new Set());
                } else {
                  setIsEditMode(true);
                  setSelectedToDelete(new Set());
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer ${
                isEditMode
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'bg-[#c85028]/15 text-[#c85028] hover:bg-[#c85028] hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Done Editing' : 'Edit Cart'}</span>
            </button>
          )}
        </div>

        {/* Edit Mode Selection Toolbar */}
        {isEditMode && cartItems.length > 0 && (
          <div
            className={`p-3.5 mb-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in ${
              isDark ? 'bg-[#15202e] border-[#223348]' : 'bg-[#f4ede3] border-[#dfcebc]'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-bold text-[#c85028] hover:underline cursor-pointer"
              >
                {selectedToDelete.size === cartItems.length ? 'Deselect All' : 'Select All Items'}
              </button>
              <span className="text-xs text-gray-400">
                ({selectedToDelete.size} of {cartItems.length} selected for deletion)
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={selectedToDelete.size === 0}
                onClick={() => setIsConfirmModalOpen(true)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedToDelete.size > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedToDelete.size})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedToDelete(new Set());
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  isDark ? 'border-[#223348] text-gray-300' : 'border-[#d8c5b0] text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const isSelected = selectedToDelete.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isEditMode) {
                        handleToggleSelect(item.id);
                      }
                    }}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center justify-between transition-all ${
                      isEditMode ? 'cursor-pointer hover:border-red-400/50' : ''
                    } ${
                      isSelected
                        ? isDark
                          ? 'bg-red-950/20 border-red-500/50'
                          : 'bg-red-50/70 border-red-300'
                        : isDark
                        ? 'bg-[#121926] border-[#1e293b]'
                        : 'bg-white border-[#ede4d8] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Checkbox visible in Edit Mode */}
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(item.id);
                          }}
                          className="p-1 text-red-500 cursor-pointer shrink-0"
                          aria-label={isSelected ? 'Deselect item' : 'Select item to delete'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-red-500" />
                          ) : (
                            <Square
                              className={`w-5 h-5 ${
                                isDark ? 'text-gray-600' : 'text-gray-300'
                              } hover:text-red-400`}
                            />
                          )}
                        </button>
                      )}

                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-contain bg-gray-100 dark:bg-[#1a2334] p-1.5 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Size:{' '}
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {item.selectedSize}
                          </span>{' '}
                          • Colour:{' '}
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {item.selectedColor}
                          </span>
                        </p>
                        <p className="text-xs text-[#c85028] font-bold mt-1 sm:hidden">
                          KSh {(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                      {/* Quantity controls: Minus is disabled at 1 (cannot reduce to 0) */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden h-10">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className={`px-3 h-full transition-colors ${
                            item.quantity <= 1
                              ? 'opacity-30 cursor-not-allowed text-gray-400 bg-gray-50 dark:bg-gray-800/40'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer'
                          }`}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="px-3 text-xs font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          className="px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="hidden sm:block text-right min-w-[90px]">
                        <p className="font-black text-sm text-[#c85028]">
                          KSh {(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          @ KSh {item.unitPrice.toLocaleString()}
                        </p>
                      </div>

                      {/* NO single delete button on items as requested */}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4">
              <div
                className={`p-6 rounded-2xl border space-y-4 sticky top-24 ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
                }`}
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Order Summary</h3>

                <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      KSh {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-500 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE (Campus Promo)' : 'KSh 150'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline font-black">
                  <span className="text-sm">Total</span>
                  <span className="text-xl text-[#c85028]">KSh {total.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="space-y-2 pt-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#c85028]" />
                    <span>Free campus delivery on orders over KSh 2,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#c85028]" />
                    <span>Pay on delivery or collection at Egerton hub</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-12 text-center rounded-2xl border ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <ShoppingBag className="w-14 h-14 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">Your cart is empty</h3>
            <p className="text-xs text-gray-400 mb-6">
              Looks like you haven't added any Sinai pieces to your shopping cart yet.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* CONFIRM DELETION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsConfirmModalOpen(false)}
          />

          <div
            className={`relative w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-2xl border text-center space-y-4 z-10 animate-spring-pop ${
              isDark
                ? 'bg-[#0e1624] border-[#1f293d] text-white'
                : 'bg-white border-[#ede4d8] text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold">Confirm Deletion</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Confirm deletion of {selectedToDelete.size} item{selectedToDelete.size === 1 ? '' : 's'}. This cannot be reversed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-[#1f293d] hover:bg-[#182334] text-gray-300'
                    : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
