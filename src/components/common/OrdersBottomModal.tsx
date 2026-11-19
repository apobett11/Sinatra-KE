import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Package,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Store,
  MapPin,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Order } from '../../types';

interface OrdersBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (order: Order) => void;
  theme?: 'dark' | 'light';
}

export const OrdersBottomModal: React.FC<OrdersBottomModalProps> = ({
  isOpen,
  onClose,
  theme: propTheme,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propTheme ? propTheme === 'dark' : contextIsDark;
  const { orders, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const getStepColor = (step: number, currentStep: number) => {
    if (step < currentStep) return 'bg-[#10b981] text-white';
    if (step === currentStep) return 'bg-[#c85028] text-white ring-4 ring-[#c85028]/20 animate-pulse';
    return isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500';
  };

  const handleSignIn = () => {
    onClose();
    openAuthModal('orders', 'login');
  };

  const handleGoToOrderHistory = () => {
    onClose();
    navigate('/account/orders');
  };

  const handleTrackOrder = (orderNumber: string) => {
    onClose();
    navigate(`/track-order?ref=${orderNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto animate-bottom-backdrop cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Popup Dialog: Sits flush with top edge of bottom navigation bar */}
      <div
        className={`relative bottom-15 inset-x-0 pointer-events-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl border transition-all duration-300 z-10 animate-bottom-sheet max-h-[78vh] flex flex-col mx-auto ${
          isDark
            ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-[#1a1a1a] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="w-12 h-1.5 rounded-full bg-slate-400/30 mx-auto mb-3" />

        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-3 ${
            isDark ? 'border-[#1f293d]' : 'border-[#ede4d8]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {selectedOrder ? (
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer mr-1 ${
                  isDark ? 'hover:bg-[#162030] text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Back to orders list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold ${
                  isDark
                    ? 'bg-[#d9532f]/20 text-[#d9532f] border border-[#d9532f]/30'
                    : 'bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25'
                }`}
              >
                <Package className="w-4 h-4" />
              </span>
            )}
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
                {selectedOrder ? `Order #${selectedOrder.orderNumber}` : 'My Order History'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {selectedOrder
                  ? `Placed on ${selectedOrder.createdAt}`
                  : `${orders.length} campus order${orders.length === 1 ? '' : 's'} recorded`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#162030] text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto pr-0.5 space-y-3">
          {!isAuthenticated ? (
            /* Protected Orders Gate */
            <div className="py-6 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-3">
                <Package className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold mb-1">Sign In to View Orders</h4>
              <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
                Sign in with your student phone number or email to view past orders and track campus collection.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In / Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : selectedOrder ? (
            /* ORDER DETAILS VIEW */
            <div className="space-y-4">
              {/* Status Header */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                }`}
              >
                <div>
                  <span className="text-[11px] text-gray-400 block">Status:</span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-wide">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 block">Total Due:</span>
                  <span className="text-sm font-black text-[#c85028]">
                    KSh {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 4-Step Progress Track */}
              <div
                className={`p-3 rounded-xl border ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                }`}
              >
                {(() => {
                  const step =
                    selectedOrder.trackingStep ||
                    (selectedOrder.status === 'Delivered'
                      ? 4
                      : selectedOrder.status === 'Ready for Collection'
                      ? 3
                      : 2);
                  return (
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                        <span>Collection Progression</span>
                        <span className="text-[#c85028] font-bold">Step {step} of 4</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        {[
                          { num: 1, label: 'Received' },
                          { num: 2, label: 'Prep' },
                          { num: 3, label: 'Ready' },
                          { num: 4, label: 'Done' },
                        ].map((s) => (
                          <div key={s.num} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${getStepColor(
                                s.num,
                                step
                              )}`}
                            >
                              {s.num < step ? (
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                s.num
                              )}
                            </div>
                            <span
                              className={`text-[9px] font-bold mt-1 line-clamp-1 ${
                                s.num === step
                                  ? 'text-[#c85028]'
                                  : s.num < step
                                  ? isDark
                                    ? 'text-gray-200'
                                    : 'text-gray-800'
                                  : 'text-gray-400'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Pickup / Delivery Address */}
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                }`}
              >
                <Store className="w-4 h-4 text-[#c85028] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">
                    Pickup Location:
                  </span>
                  <p className="font-semibold truncate">
                    {selectedOrder.pickupLocation || selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Ordered Items ({selectedOrder.items.length})
                </h5>
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={it.image}
                        alt=""
                        className="w-11 h-11 rounded-lg object-contain bg-white dark:bg-gray-800 p-1 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-xs truncate max-w-[170px]">{it.productName}</p>
                        <p className="text-[10px] text-gray-400">
                          {it.selectedSize} • {it.selectedColor} • Qty {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs">
                      KSh {(it.unitPrice * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTrackOrder(selectedOrder.orderNumber)}
                  className="flex-1 py-2.5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Track Real-Time</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToOrderHistory}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isDark
                      ? 'border-[#1e293b] hover:bg-[#162030] text-gray-300'
                      : 'border-[#ede4d8] hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Page</span>
                </button>
              </div>
            </div>
          ) : orders.length > 0 ? (
            /* ORDERS LIST VIEW */
            <div className="space-y-2.5">
              {orders.map((ord) => {
                const totalItems = ord.items.reduce((sum, it) => sum + it.quantity, 0);
                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all duration-150 touch-spring cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
                      isDark
                        ? 'bg-[#121926] hover:bg-[#162234] border-[#1e293b] hover:border-[#d9532f]/50'
                        : 'bg-[#faf6f1] hover:bg-[#f3ece3] border-[#ede4d8] hover:border-[#c85028]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 p-1 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                        {ord.items[0]?.image ? (
                          <img
                            src={ord.items[0].image}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-[#c85028]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#c85028]">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {totalItems} item{totalItems === 1 ? '' : 's'} • {ord.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs">KSh {ord.total.toLocaleString()}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#c85028] transition-colors" />
                    </div>
                  </button>
                );
              })}

              {/* View All on CustomerOrdersPage */}
              <button
                type="button"
                onClick={handleGoToOrderHistory}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-colors cursor-pointer mt-2 block ${
                  isDark
                    ? 'border-[#1e293d] hover:bg-[#162030] text-gray-300'
                    : 'border-[#ede4d8] hover:bg-gray-100 text-gray-700'
                }`}
              >
                Open Full Orders & Tracking Page →
              </button>
            </div>
          ) : (
            /* Empty State */
            <div className="py-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold mb-1">No Orders Placed Yet</h4>
              <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                Your campus collection and delivery orders will appear here once you checkout.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="py-2.5 px-5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Browse Outfits
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
