import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  MessageCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Order } from '../types';
import { useTheme } from '../context/ThemeContext';

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">No Recent Order</h2>
        <p className="text-gray-400 mb-6 text-xs">Track your active order by reference number.</p>
        <Link
          to="/track-order"
          className="px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs"
        >
          Go to Track Order
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 pt-8 sm:pt-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success Header Badge */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Order Successfully Placed!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Thank you, <span className="font-bold text-white dark:text-gray-200">{order.customerName}</span>.
            We have received your request.
          </p>
        </div>

        {/* Order Reference Card */}
        <div
          className={`p-6 rounded-3xl border mb-6 space-y-6 ${
            isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-lg'
          }`}
        >
          {/* Reference & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400">Order Reference</p>
              <p className="text-xl font-black text-[#c85028] tracking-wide">{order.orderNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/15 text-amber-500">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Delivery & Collection Instructions */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-sm">Collection / Delivery Details:</h4>
            {order.deliveryType === 'campus_pickup' ? (
              <div className="flex items-start gap-2.5 text-gray-300">
                <MapPin className="w-4 h-4 text-[#c85028] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white dark:text-gray-200">Egerton Student Centre Sinatra Hub</p>
                  <p className="text-gray-400 mt-0.5">
                    Your outfits are being prepped. Show order ref <span className="text-[#c85028] font-bold">{order.orderNumber}</span> when collecting.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-gray-300">
                <Truck className="w-4 h-4 text-[#c85028] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white dark:text-gray-200">Hall Delivery Destination:</p>
                  <p className="text-gray-400 mt-0.5">{order.deliveryAddress}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ordered Products List */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              Items in Order
            </h4>
            <div className="space-y-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image}
                      alt={it.productName}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 p-1 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold">{it.productName}</p>
                      <p className="text-[11px] text-gray-400">
                        {it.selectedSize} • {it.selectedColor} • Qty {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">
                    KSh {(it.unitPrice * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Payment Clarification */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline font-black">
            <div>
              <p className="text-xs text-gray-400">Amount Due Upon Handover</p>
              <p className="text-[11px] text-gray-500 font-normal">Pay via M-Pesa or Cash</p>
            </div>
            <span className="text-2xl text-[#c85028]">KSh {order.total.toLocaleString()}</span>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <a
            href={`https://wa.me/254712345678?text=Hello%20Sinatra%20Egerton!%20I%20have%20placed%20order%20${order.orderNumber}%20(${order.customerName}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Sinatra Hub via WhatsApp</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/account/orders')}
            className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-colors ${
              isDark
                ? 'border-[#1e293b] text-gray-300 hover:bg-[#151f2e]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Track Order Live
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 py-3 rounded-xl bg-[#c85028] text-white text-xs font-bold hover:bg-[#b3441e] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
