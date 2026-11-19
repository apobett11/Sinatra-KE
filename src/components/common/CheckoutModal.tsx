import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Truck,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const {
    cartItems,
    checkedItemIds,
    checkedSubtotal,
    discountAmount,
    deliveryFee,
    checkedTotal,
    removeMultipleItems,
  } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [useProfileInfo, setUseProfileInfo] = useState(true);
  const [customerName, setCustomerName] = useState(user?.name || 'John Doe');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+254 712 345 678');
  const [customerEmail, setCustomerEmail] = useState(
    user?.email || 'john.doe@student.egerton.ac.ke'
  );

  const [deliveryType, setDeliveryType] = useState<'campus_pickup' | 'delivery'>('campus_pickup');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(user?.preferredStoreId || 'store-1');
  const [residence, setResidence] = useState(user?.residence || 'Mara Hall, Egerton University');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Reset step on new open
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setCompletedOrder(null);
      setCheckoutError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const checkedItems = cartItems.filter((item) => checkedItemIds.has(item.id));

  const formatPrice = (val: number) => `KSh ${val.toLocaleString()}`;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!customerName.trim() || !phoneNumber.trim()) {
      setCheckoutError('Please provide your full name and phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !residence.trim()) {
      setCheckoutError('Please specify your Egerton hall, room number, or hostel location.');
      return;
    }

    if (checkedItems.length === 0) {
      setCheckoutError('No items checked for checkout.');
      return;
    }

    setIsSubmitting(true);

    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SN-${randomCode}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName,
      phone: phoneNumber,
      email: customerEmail,
      deliveryType,
      pickupLocation:
        deliveryType === 'campus_pickup'
          ? selectedStoreId === 'store-2'
            ? 'Sinatra Pavilion Store (Egerton Gate B Annex, Shop 4)'
            : 'Sinatra Flagship Store (Egerton Student Centre, Rm 12)'
          : undefined,
      deliveryAddress: deliveryType === 'delivery' ? residence : undefined,
      notes,
      items: checkedItems.map((ci) => ({
        productId: ci.productId,
        productName: ci.product.name,
        selectedSize: ci.selectedSize,
        selectedColor: ci.selectedColor,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        image: ci.product.images[0],
      })),
      subtotal: checkedSubtotal,
      deliveryFee,
      total: checkedTotal,
      status: 'Received',
      trackingStep: 1,
    };

    setTimeout(() => {
      // Save order
      addOrder(newOrder);
      // Remove only the checked (ordered) items from the cart
      removeMultipleItems(checkedItems.map((i) => i.id));
      setCompletedOrder(newOrder);
      setStep('confirmation');
      setIsSubmitting(false);
    }, 600);
  };

  const handleWhatsAppReceipt = () => {
    if (!completedOrder) return;
    const msg = encodeURIComponent(
      `Hi Sinatra KE! I have placed order ${completedOrder.orderNumber} for ${formatPrice(
        completedOrder.total
      )}. Please confirm my campus order details.`
    );
    window.open(`https://wa.me/254712345678?text=${msg}`, '_blank');
  };

  const handleTrackOrder = () => {
    onClose();
    navigate('/account/orders');
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-bottom-backdrop"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className={`relative z-10 w-full max-w-xl transform rounded-2xl text-left shadow-2xl transition-all overflow-hidden border animate-spring-pop ${
            isDark
              ? 'bg-[#0e1624] border-[#1f293d] text-white'
              : 'bg-white border-[#ede4d8] text-[#1a1a1a]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isDark
                ? 'bg-[#0b1320] border-[#1f293d]'
                : 'bg-[#faf6f1] border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  isDark
                    ? 'bg-[#d9532f]/20 text-[#d9532f]'
                    : 'bg-[#c85028]/15 text-[#c85028]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  {step === 'details'
                    ? 'Secure Store Checkout'
                    : 'Order Successfully Placed!'}
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {step === 'details'
                    ? `${checkedItems.length} checked items • Egerton campus order`
                    : `Order reference ${completedOrder?.orderNumber} generated`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-[#182334]'
                  : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Close checkout modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Checkout Error */}
          {checkoutError && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* ================= STEP 1: DETAILS ================= */}
          {step === 'details' && (
            <form onSubmit={handleSubmitOrder} className="p-4 sm:p-5 space-y-4 text-xs">
              {/* Payment & Profile Checkboxes */}
              <div className="space-y-2">
                {/* Pay on Delivery (Standard Active) */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark
                      ? 'bg-[#121926] border-[#1f293d]'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck
                      className={`w-4 h-4 ${
                        isDark ? 'text-[#d9532f]' : 'text-[#c85028]'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold block">
                        Pay on Delivery / Campus Collection
                      </span>
                      <p className="text-[10px] text-gray-400">
                        Pay via M-Pesa upon parcel collection at Egerton hub.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                    Standard • Active
                  </span>
                </div>

                {/* Use Profile Info */}
                <div
                  className={`p-3 rounded-xl border ${
                    isDark
                      ? 'bg-[#121926] border-[#1f293d]'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useProfileInfo}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseProfileInfo(checked);
                        if (checked && user) {
                          setCustomerName(user.name);
                          setPhoneNumber(user.phone);
                          setCustomerEmail(user.email);
                        }
                      }}
                      className="w-4 h-4 rounded text-[#c85028] border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-grow">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-500" />
                        Use profile information
                      </span>
                      <p className="text-[10px] text-gray-400">
                        {useProfileInfo
                          ? 'Prefilled from your student profile. Uncheck to customize contact info.'
                          : 'Custom details active. Enter student contact info below.'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    disabled={useProfileInfo}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full h-9 px-3 rounded-xl border text-xs ${
                      isDark
                        ? 'bg-[#0a0e17] border-[#1f293d] text-white disabled:opacity-75'
                        : 'bg-white border-gray-200 text-gray-900 disabled:bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">
                    Phone Number (M-Pesa) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    disabled={useProfileInfo}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full h-9 px-3 rounded-xl border text-xs ${
                      isDark
                        ? 'bg-[#0a0e17] border-[#1f293d] text-white disabled:opacity-75'
                        : 'bg-white border-gray-200 text-gray-900 disabled:bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Delivery Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5">
                  Collection / Delivery Location *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('campus_pickup')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryType === 'campus_pickup'
                        ? isDark
                          ? 'border-[#d9532f] bg-[#d9532f]/10'
                          : 'border-[#c85028] bg-[#c85028]/10'
                        : isDark
                        ? 'border-[#1f293d] bg-[#121926]'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isDark ? 'text-[#d9532f]' : 'text-[#c85028]'
                        }`}
                      />
                      <span>Physical Store Pickup</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Free pickup at Student Centre or Gate B
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryType === 'delivery'
                        ? isDark
                          ? 'border-[#d9532f] bg-[#d9532f]/10'
                          : 'border-[#c85028] bg-[#c85028]/10'
                        : isDark
                        ? 'border-[#1f293d] bg-[#121926]'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Truck
                        className={`w-3.5 h-3.5 ${
                          isDark ? 'text-[#d9532f]' : 'text-[#c85028]'
                        }`}
                      />
                      <span>Hostel / Hall Delivery</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Direct delivery to your campus residence
                    </p>
                  </button>
                </div>

                {deliveryType === 'campus_pickup' && (
                  <div className="mt-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">
                      Choose Physical Store:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStoreId('store-1')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedStoreId === 'store-1'
                            ? 'border-[#c85028] bg-[#c85028]/15 font-bold'
                            : 'border-gray-700/60 bg-gray-800/40 text-gray-400'
                        }`}
                      >
                        <span className="text-xs block text-white">Store 1: Student Centre</span>
                        <span className="text-[10px] text-gray-400">Room 12 (Ground Floor)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStoreId('store-2')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedStoreId === 'store-2'
                            ? 'border-[#c85028] bg-[#c85028]/15 font-bold'
                            : 'border-gray-700/60 bg-gray-800/40 text-gray-400'
                        }`}
                      >
                        <span className="text-xs block text-white">Store 2: Gate B Annex</span>
                        <span className="text-[10px] text-gray-400">Shop 04 (Commercial Plaza)</span>
                      </button>
                    </div>
                  </div>
                )}

                {deliveryType === 'delivery' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      placeholder="e.g. Mara Hall Rm 42 or Ruwenzori Hostel"
                      className={`w-full h-9 px-3 rounded-xl border text-xs ${
                        isDark
                          ? 'bg-[#0a0e17] border-[#1f293d] text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">
                  Order Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. please pack in gift bag or call before dispatch"
                  className={`w-full h-9 px-3 rounded-xl border text-xs ${
                    isDark
                      ? 'bg-[#0a0e17] border-[#1f293d] text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              {/* Order Items Preview */}
              <div
                className={`p-3 rounded-xl border space-y-2 max-h-36 overflow-y-auto ${
                  isDark
                    ? 'bg-[#0a0e17] border-[#1f293d]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                  <span>Selected Products ({checkedItems.length})</span>
                  <span>Amount</span>
                </div>
                {checkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-7 h-7 rounded object-cover shrink-0"
                      />
                      <span className="truncate">
                        {item.product.name} ({item.selectedSize}) × {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold shrink-0 ml-2">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Calculations */}
              <div
                className={`space-y-1 text-xs pt-2 border-t ${
                  isDark ? 'border-[#1f293d] text-gray-400' : 'border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(checkedSubtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Discount</span>
                    <span className="font-bold">- {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-500">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div
                  className={`flex justify-between pt-1 text-sm font-black ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span>Total Due</span>
                  <span
                    className={isDark ? 'text-[#d9532f]' : 'text-[#c85028]'}
                  >
                    {formatPrice(checkedTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#182334] text-gray-300 hover:bg-[#1f293d]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || checkedItems.length === 0}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110'
                      : 'bg-gradient-to-r from-[#c85028] to-[#9c3413] hover:brightness-110'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2: CONFIRMATION ================= */}
          {step === 'confirmation' && completedOrder && (
            <div className="p-5 sm:p-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto animate-spring-pop">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-black uppercase tracking-wide">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Thank you, <strong className="text-white">{completedOrder.customerName}</strong>. Your campus order has been received.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border text-left text-xs space-y-2 ${
                  isDark
                    ? 'bg-[#0a0e17] border-[#1f293d]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between pb-2 border-b border-gray-700/30">
                  <span className="text-gray-400">Order Reference:</span>
                  <span className="font-mono font-black text-[#c85028]">
                    {completedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Collection / Delivery:</span>
                  <span className="font-bold text-right truncate ml-2">
                    {completedOrder.deliveryType === 'campus_pickup'
                      ? 'Egerton Student Centre Hub (Rm 12)'
                      : completedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Due:</span>
                  <span className="font-black text-sm">
                    {formatPrice(completedOrder.total)}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">Payment:</span>
                  <span className="font-bold text-emerald-500">
                    Pay upon collection/delivery
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppReceipt}
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Receipt to WhatsApp Concierge</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleTrackOrder}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isDark
                        ? 'border-[#1f293d] hover:bg-[#182334] text-gray-300'
                        : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Track Order
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className={`py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-[#d9532f] hover:bg-[#b3441e]'
                        : 'bg-[#c85028] hover:bg-[#9c3413]'
                    }`}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
