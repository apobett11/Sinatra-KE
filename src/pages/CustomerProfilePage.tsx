import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Save,
  Store,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PHYSICAL_STORES } from '../data/physicalStores';

export const CustomerProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile, logout, openAuthModal } = useAuth();
  const { isDark } = useTheme();

  // If not logged in, render the Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="w-full pb-20 pt-8 sm:pt-14">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Protected Profile Area
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-6">
            Please sign in to view and edit your contact information, address in or around Egerton, and preferred physical store.
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
                  Bag Outfits Safe
                </h3>
                <p className="text-[11px] text-gray-400">
                  Any items in your bag remain stored in cache.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('profile', 'login')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 active:scale-98"
            >
              <span>Sign In to Edit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsappNumber: user?.whatsappNumber || user?.phone || '',
    residence: user?.residence || '',
    studentId: user?.studentId || '',
    preferredStoreId: user?.preferredStoreId || 'store-1',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full pb-28 sm:pb-24">
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
          <span className="text-[#c85028] font-bold">Profile Details</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Customer Profile</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage your personal details, campus delivery residence, and physical pickup store.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and delivery settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FUNCTIONAL CARD 1: PERSONAL CONTACT DETAILS */}
          <div
            className={`p-5 sm:p-7 rounded-3xl border shadow-xs transition-colors ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Personal Contact Information
                </h3>
                <p className="text-xs text-gray-400">
                  Used for order receipts, courier collection alerts, and dispatch SMS
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Customer Name (Appears on Orders)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number (SMS & Calls)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                        isDark
                          ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                      }`}
                    />
                    <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* FUNCTIONAL CARD 2: CAMPUS DELIVERY & PHYSICAL STORE */}
          <div
            className={`p-5 sm:p-7 rounded-3xl border shadow-xs transition-colors ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Campus Delivery & Collection Store
                </h3>
                <p className="text-xs text-gray-400">
                  Default pickup outlet and hall destination for your orders
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Default Physical Store for In-Person Pickup
                </label>
                <select
                  value={formData.preferredStoreId}
                  onChange={(e) => setFormData({ ...formData, preferredStoreId: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-bold ${
                    isDark
                      ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                  }`}
                >
                  {PHYSICAL_STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roomOrShop})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Default Campus Hall or Residence (for dispatch delivery)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.residence}
                    onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                    placeholder="e.g. Mara Hall, Block C Room 14"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <MapPin className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* FUNCTIONAL CARD 3: STUDENT IDENTITY & VERIFICATION */}
          <div
            className={`p-5 sm:p-7 rounded-3xl border shadow-xs transition-colors ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Student Identity & Campus Verification
                </h3>
                <p className="text-xs text-gray-400">
                  Egerton University academic credentials and student membership
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Student ID / Registration Number
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g. EG/CO/2023/4819"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-medium ${
                  isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                }`}
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Used to verify special student discounts and official campus batch drops.
              </p>
            </div>
          </div>

          {/* FUNCTIONAL CARD 4: SAVE ACTION */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
            }`}
          >
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Save Profile Changes
              </h4>
              <p className="text-[11px] text-gray-400">
                All details will be saved to your session and automatically synced with future orders.
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-transform cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
