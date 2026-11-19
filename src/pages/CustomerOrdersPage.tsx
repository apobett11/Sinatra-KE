import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ArrowRight,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Store,
  User,
  ShoppingBag,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Order } from '../types';

export const CustomerOrdersPage: React.FC = () => {
  const { orders, isAuthenticated, openAuthModal } = useAuth();
  const { isDark } = useTheme();

  // State to hold order opened in large popup
  const [selectedOrderForPopup, setSelectedOrderForPopup] = useState<Order | null>(null);

  // If not logged in, render the protected Auth Gate screen
  if (!isAuthenticated) {
    return (
      <div className="w-full pb-20 pt-8 sm:pt-14">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Protected Order History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-6">
            Please sign in to view your verified orders, campus collection receipts, and real-time pickup status.
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
                  Any items you previously added are preserved in your browser cache.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('orders', 'login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 active:scale-98"
            >
              <span>Sign In to Access Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStepColor = (step: number, currentStep: number) => {
    if (step < currentStep) return 'bg-[#10b981] text-white';
    if (step === currentStep) return 'bg-[#c85028] text-white ring-4 ring-[#c85028]/20 animate-pulse';
    return isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500';
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
          <Link to="/account/profile" className="hover:text-[#c85028] transition-colors">
            Profile
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">My Orders</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">My Order History</h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-8">
          All your campus orders, deliveries, and physical store collection statuses. Click any order to open its complete details.
        </p>

        {orders.length > 0 ? (
          /* Default orders list: Individual clean summary cards without detailed item breakdown */
          <div className="space-y-4">
            {orders.map((ord) => {
              const totalItems = ord.items.reduce((sum, it) => sum + it.quantity, 0);

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderForPopup(ord)}
                  className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer group hover:shadow-md ${
                    isDark
                      ? 'bg-[#121926] hover:bg-[#162132] border-[#1e293b] hover:border-[#d9532f]/50'
                      : 'bg-white hover:bg-[#fffdfa] border-[#ede4d8] hover:border-[#c85028]/50 shadow-xs'
                  }`}
                >
                  {/* Top Bar: Order Ref, Placed Date & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800 gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center shrink-0">
                        <Package className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#c85028]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">Placed on {ord.createdAt}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-gray-400 block">Total Due:</span>
                      <span className="font-black text-base text-[#c85028]">
                        KSh {ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Summary Details Row: Item thumbnails + Pickup location + View Details Button */}
                  <div className="pt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Stacked Preview Images */}
                      <div className="flex -space-x-2 overflow-hidden py-0.5">
                        {ord.items.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt=""
                            className="inline-block w-9 h-9 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 p-0.5 border border-white dark:border-gray-900 shadow-2xs"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {totalItems} item{totalItems === 1 ? '' : 's'}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 truncate max-w-xs sm:max-w-md">
                          <Store className="w-3 h-3 text-[#c85028] shrink-0" />
                          <span className="truncate">
                            {ord.pickupLocation || ord.deliveryAddress}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderForPopup(ord);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`p-12 text-center rounded-2xl border ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <Package className="w-14 h-14 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">No Orders Found</h3>
            <p className="text-xs text-gray-400 mb-6">
              When you place orders for pickup or hall delivery, they will appear here.
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

      {/* LARGE ORDER DETAILS POPUP MODAL */}
      {selectedOrderForPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in">
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setSelectedOrderForPopup(null)}
          />

          {/* Modal Container */}
          <div
            className={`relative w-full max-w-2xl max-h-[88vh] rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all duration-200 z-10 flex flex-col ${
              isDark
                ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/90'
                : 'bg-white border-[#ede4d8] text-gray-900 shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center shrink-0 font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black font-mono text-[#c85028]">
                      #{selectedOrderForPopup.orderNumber}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                      {selectedOrderForPopup.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on {selectedOrderForPopup.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForPopup(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-900 dark:hover:text-white" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-5">
              {/* 4-Step Progress Track */}
              {(() => {
                const step =
                  selectedOrderForPopup.trackingStep ||
                  (selectedOrderForPopup.status === 'Delivered'
                    ? 4
                    : selectedOrderForPopup.status === 'Ready for Collection'
                    ? 3
                    : 2);

                return (
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                    }`}
                  >
                    <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                      <span>Dispatch & Collection Progression</span>
                      <span className="text-[#c85028] font-bold">Step {step} of 4</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { num: 1, label: 'Order Received' },
                        { num: 2, label: 'Workshop Prep' },
                        { num: 3, label: 'Ready at Store' },
                        { num: 4, label: 'Collected / Done' },
                      ].map((s) => (
                        <div key={s.num} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${getStepColor(
                              s.num,
                              step
                            )}`}
                          >
                            {s.num < step ? (
                              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                            ) : (
                              s.num
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-1.5 line-clamp-1 ${
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

              {/* Collection Point / Delivery Address */}
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                }`}
              >
                <Store className="w-5 h-5 text-[#c85028] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Campus Collection Point:
                  </span>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                    {selectedOrderForPopup.pickupLocation || selectedOrderForPopup.deliveryAddress}
                  </p>
                  {selectedOrderForPopup.notes && (
                    <p className="text-[11px] text-gray-400 italic mt-0.5">
                      Note: "{selectedOrderForPopup.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Products Detailed Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Ordered Products Breakdown ({selectedOrderForPopup.items.length})
                </h4>
                <div className="space-y-2.5">
                  {selectedOrderForPopup.items.map((it, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                        isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-gray-800 p-1 shrink-0 border border-gray-100 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                            {it.productName}
                          </p>
                          <p className="text-gray-400 text-[11px] mt-0.5">
                            Size: <span className="font-semibold text-gray-700 dark:text-gray-300">{it.selectedSize}</span> • Colour:{' '}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{it.selectedColor}</span> • Qty:{' '}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{it.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-gray-900 dark:text-gray-100">
                        KSh {(it.unitPrice * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div
                className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-[#faf6f1] border-[#ede4d8]'
                }`}
              >
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>KSh {selectedOrderForPopup.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery / Pickup Handling Fee</span>
                  <span>
                    {selectedOrderForPopup.deliveryFee === 0
                      ? 'FREE'
                      : `KSh ${selectedOrderForPopup.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span>Total Amount Due</span>
                  <span className="text-[#c85028]">
                    KSh {selectedOrderForPopup.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
              <Link
                to={`/track-order?ref=${selectedOrderForPopup.orderNumber}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Real-Time Status</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOrderForPopup(null)}
                className={`py-2.5 px-5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'border-[#1e293b] hover:bg-[#162030] text-gray-300'
                    : 'border-[#ede4d8] hover:bg-gray-100 text-gray-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
