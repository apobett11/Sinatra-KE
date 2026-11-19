import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Order } from '../types';

const TIMELINE_STEPS = [
  'Received',
  'Confirmed',
  'Processing',
  'Ready for Collection',
  'Dispatched',
  'Delivered',
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const { findOrder, orders, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const [orderQuery, setOrderQuery] = useState(initialRef);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    return initialRef ? findOrder(initialRef) || null : null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialRef));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    const found = findOrder(orderQuery.trim());
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepStatus = (step: string, currentStatus: string) => {
    const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
    const stepIndex = TIMELINE_STEPS.indexOf(step);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb */}
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
          <span className="text-[#c85028] font-bold">Track Order</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Track Campus Order</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Enter your order reference code (e.g. SN-94281 or SN-88120) to check real-time progress.
          </p>
        </div>

        {/* Quick select pills for logged in user */}
        {isAuthenticated && orders.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400 font-semibold mr-1">Your Orders:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setOrderQuery(ord.orderNumber);
                  setSearchedOrder(ord);
                  setHasSearched(true);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                  orderQuery === ord.orderNumber
                    ? 'bg-[#c85028] text-white border-[#c85028]'
                    : isDark
                    ? 'bg-[#121926] text-gray-300 border-[#1e293b] hover:border-gray-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
              >
                {ord.orderNumber} ({ord.status})
              </button>
            ))}
          </div>
        )}

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="mb-10">
          <div
            className={`flex items-center p-2 rounded-2xl border shadow-md transition-colors ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="p-2 text-[#c85028]">
              <Package className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. SN-94281"
              className={`flex-1 bg-transparent px-3 text-sm font-semibold outline-none ${
                isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-xs shadow transition-colors"
            >
              Track Status
            </button>
          </div>
        </form>

        {/* Results Timeline */}
        {hasSearched && searchedOrder ? (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800 gap-3">
              <div>
                <p className="text-xs text-gray-400">Order Reference</p>
                <h3 className="text-xl font-black text-[#c85028]">{searchedOrder.orderNumber}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Placed on {searchedOrder.createdAt}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400">Customer</p>
                <p className="text-sm font-bold">{searchedOrder.customerName}</p>
                <p className="text-[11px] text-gray-500">{searchedOrder.phone}</p>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="py-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                Fulfillment Timeline
              </h4>
              <div className="space-y-6">
                {TIMELINE_STEPS.map((step, idx) => {
                  const status = getStepStatus(step, searchedOrder.status);
                  const isLast = idx === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step} className="relative flex items-start gap-4">
                      {/* Vertical line connecting nodes */}
                      {!isLast && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-6 ${
                            status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-gray-200 dark:bg-gray-800'
                          }`}
                        />
                      )}

                      {/* Node Icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold transition-colors ${
                          status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : status === 'current'
                            ? 'bg-[#c85028] text-white ring-4 ring-[#c85028]/20'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <p
                          className={`font-bold text-xs sm:text-sm ${
                            status === 'current'
                              ? 'text-[#c85028]'
                              : status === 'completed'
                              ? 'text-white dark:text-gray-200'
                              : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {status === 'completed'
                            ? 'Stage verified and completed'
                            : status === 'current'
                            ? 'Currently in progress by Egerton store team'
                            : 'Pending previous steps'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Info */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#182334] text-xs space-y-1">
              <p className="font-bold text-white dark:text-gray-200">
                {searchedOrder.deliveryType === 'campus_pickup'
                  ? 'Collection Location:'
                  : 'Delivery Address:'}
              </p>
              <p className="text-gray-400">
                {searchedOrder.deliveryType === 'campus_pickup'
                  ? searchedOrder.pickupLocation
                  : searchedOrder.deliveryAddress}
              </p>
            </div>
          </div>
        ) : hasSearched ? (
          <div
            className={`p-10 text-center rounded-2xl border ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">Order Not Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              We could not locate an order matching reference "{orderQuery}". Please verify the code or check your recent confirmation SMS/email.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
