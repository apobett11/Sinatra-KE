import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState<'campus_pickup' | 'delivery'>('campus_pickup');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    residence: user?.residence || 'Mara Hall, Egerton University',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">No Items in Checkout</h2>
        <p className="text-gray-400 mb-6 text-xs">Your shopping cart is empty.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-[#c85028] text-white font-bold text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your full name and Kenyan phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !formData.residence.trim()) {
      setErrorMessage('Please specify your Egerton hall, room number, or hostel location.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique order number (e.g. SN-84912)
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SN-${randomCode}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      deliveryType,
      pickupLocation:
        deliveryType === 'campus_pickup'
          ? 'Sinatra Collection Hub (Egerton Student Centre)'
          : undefined,
      deliveryAddress: deliveryType === 'delivery' ? formData.residence : undefined,
      notes: formData.notes,
      items: cartItems.map((ci) => ({
        productId: ci.productId,
        productName: ci.product.name,
        selectedSize: ci.selectedSize,
        selectedColor: ci.selectedColor,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        image: ci.product.images[0],
      })),
      subtotal,
      deliveryFee,
      total,
      status: 'Received',
    };

    setTimeout(() => {
      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      navigate('/order-confirmation', { state: { order: newOrder } });
    }, 800);
  };

  return (
    <div className="w-full pb-16">
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
          <Link to="/cart" className="hover:text-[#c85028] transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Order Checkout</h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-8">
          Complete your contact & delivery details. Payment is arranged upon delivery or campus pickup.
        </p>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery or Collection Choice */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm sm:text-base mb-3">1. Delivery or Collection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('campus_pickup')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      deliveryType === 'campus_pickup'
                        ? 'border-[#c85028] bg-[#c85028]/10'
                        : isDark
                        ? 'border-[#1e293b] hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <MapPin className="w-4 h-4 text-[#c85028]" />
                        <span>Campus Pickup</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                        FREE
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Collect at Sinatra Hub, Egerton University Student Centre.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-[#c85028] bg-[#c85028]/10'
                        : isDark
                        ? 'border-[#1e293b] hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <Truck className="w-4 h-4 text-[#c85028]" />
                        <span>Direct Delivery</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        {deliveryFee === 0 ? 'FREE' : 'KSh 150'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Delivered right to your Egerton hostel, hall room, or gate.
                    </p>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm sm:text-base">2. Contact Information</h3>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Brian Kipkorir"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-400">
                      Phone Number (WhatsApp Active) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0712 345 678"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                        isDark
                          ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-400">
                      Student / Personal Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. brian@egerton.ac.ke"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                        isDark
                          ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                      }`}
                    />
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-400">
                      Delivery Location / Hostel / Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.residence}
                      onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                      placeholder="e.g. Mara Hall Block B Room 12 / Njoro Town"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                        isDark
                          ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Please deliver after 3:00 PM lecture."
                    className={`w-full px-4 py-2 rounded-xl border text-xs outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>
              </div>

              {/* Payment Notice Policy (Strict Business Requirement: No online payment gateway) */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Campus Payment Arrangement:</p>
                  <p className="mt-0.5 leading-relaxed">
                    No advance online card or gateway required. You will pay via M-Pesa or cash upon
                    inspecting and receiving your outfits at the Student Centre Hub or at your hall.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div
                className={`p-6 rounded-2xl border space-y-4 sticky top-24 ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
                }`}
              >
                <h3 className="font-bold text-base">Order Review ({cartItems.length} items)</h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 p-1 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-bold line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {item.selectedSize} • {item.selectedColor} • Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold">
                        KSh {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-white dark:text-gray-200">
                      KSh {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Method</span>
                    <span className="font-bold capitalize text-white dark:text-gray-200">
                      {deliveryType === 'campus_pickup' ? 'Student Centre Hub' : 'Hall Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-500 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline font-black">
                  <span className="text-sm">Total Payable</span>
                  <span className="text-xl text-[#c85028]">KSh {total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Submitting Order to Hub...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
