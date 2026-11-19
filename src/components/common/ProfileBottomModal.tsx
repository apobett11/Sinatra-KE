import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  CheckCircle2,
  Save,
  LogOut,
  LogIn,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Edit3,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PHYSICAL_STORES } from '../../data/physicalStores';

interface ProfileBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ProfileBottomModal: React.FC<ProfileBottomModalProps> = ({
  isOpen,
  onClose,
  theme: propTheme,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propTheme ? propTheme === 'dark' : contextIsDark;
  const { user, isAuthenticated, updateProfile, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Track which slim card is expanded for editing: 'personal' | 'order' | 'student' | null
  const [expandedCard, setExpandedCard] = useState<'personal' | 'order' | 'student' | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    residence: '',
    studentId: '',
    preferredStoreId: 'store-1',
  });

  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Sync formData whenever user or modal open state changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        whatsappNumber: user.whatsappNumber || user.phone || '',
        email: user.email || '',
        residence: user.residence || '',
        studentId: user.studentId || '',
        preferredStoreId: user.preferredStoreId || 'store-1',
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (card: 'personal' | 'order' | 'student') => {
    setExpandedCard((prev) => (prev === card ? null : card));
  };

  const handleSaveSection = (sectionName: string) => {
    updateProfile(formData);
    setSavedSuccessMessage(`${sectionName} updated successfully!`);
    setExpandedCard(null);
    setTimeout(() => setSavedSuccessMessage(null), 2500);
  };

  const handleOpenFullProfile = () => {
    onClose();
    navigate('/account/profile');
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    onClose();
    openAuthModal(mode, mode);
  };

  const preferredStore =
    PHYSICAL_STORES.find((s) => s.id === formData.preferredStoreId) || PHYSICAL_STORES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto animate-bottom-backdrop cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Popup Dialog: Flush with top edge of bottom navigation bar */}
      <div
        className={`relative bottom-15 inset-x-0 pointer-events-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl border transition-all duration-300 z-10 animate-bottom-sheet max-h-[82vh] flex flex-col mx-auto ${
          isDark
            ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/80'
            : 'bg-[#faf6f0] border-[#ede4d8] text-[#1a1a1a] shadow-xl'
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
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold ${
                isDark
                  ? 'bg-[#d9532f]/20 text-[#d9532f] border border-[#d9532f]/30'
                  : 'bg-[#c85028]/15 text-[#c85028] border border-[#c85028]/25'
              }`}
            >
              <User className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900 dark:text-white">
                {isAuthenticated ? (user?.name || 'Customer Profile') : 'Sinatra Account'}
              </h3>
              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                {isAuthenticated
                  ? 'Tap the pencil to edit your details inline'
                  : 'Sign in to access your profile settings'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#162030] text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccessMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedSuccessMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-grow overflow-y-auto pr-0.5 space-y-2.5">
          {isAuthenticated ? (
            <>
              {/* SLIM CARD 1: PERSONAL INFORMATION */}
              <div
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-xs'
                }`}
              >
                {/* Slim Header Row with Pencil */}
                <div
                  onClick={() => toggleExpand('personal')}
                  className="p-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#c85028]/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#c85028] transition-colors">
                        Personal Information
                      </h4>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-[210px] sm:max-w-xs">
                        {formData.name || 'Set Name'} • {formData.phone || 'Set Phone'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Edit personal information"
                      className="p-1.5 rounded-lg bg-[#c85028]/10 text-[#c85028] hover:bg-[#c85028] hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedCard === 'personal' ? 'rotate-180 text-[#c85028]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Inline Edit Form */}
                {expandedCard === 'personal' && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Full Name (Appears on orders)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                          isDark
                            ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                            : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number (Calls & SMS)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                            isDark
                              ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                              : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          WhatsApp Contact
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, whatsappNumber: e.target.value })
                          }
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                            isDark
                              ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                              : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                          isDark
                            ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                            : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSection('Personal Information')}
                      className="w-full py-2 px-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Personal Info</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SLIM CARD 2: ORDER & DELIVERY INFORMATION */}
              <div
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-xs'
                }`}
              >
                {/* Slim Header Row with Pencil */}
                <div
                  onClick={() => toggleExpand('order')}
                  className="p-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#c85028]/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#c85028] transition-colors">
                        Order & Delivery Information
                      </h4>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-[210px] sm:max-w-xs">
                        {preferredStore.name} • {formData.residence || 'Campus Hall'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Edit order and delivery information"
                      className="p-1.5 rounded-lg bg-[#c85028]/10 text-[#c85028] hover:bg-[#c85028] hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedCard === 'order' ? 'rotate-180 text-[#c85028]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Inline Edit Form */}
                {expandedCard === 'order' && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Default Campus Hall / Residence
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mara Hall, Room 14"
                        value={formData.residence}
                        onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                          isDark
                            ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                            : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Physical Store for Collection
                      </label>
                      <select
                        value={formData.preferredStoreId}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredStoreId: e.target.value })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none transition-colors ${
                          isDark
                            ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                            : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                        }`}
                      >
                        {PHYSICAL_STORES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.roomOrShop})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSection('Order & Delivery Details')}
                      className="w-full py-2 px-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Order Details</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SLIM CARD 3: STUDENT & ACCOUNT IDENTIFICATION */}
              <div
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-xs'
                }`}
              >
                {/* Slim Header Row with Pencil */}
                <div
                  onClick={() => toggleExpand('student')}
                  className="p-3.5 flex items-center justify-between cursor-pointer group hover:bg-[#c85028]/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#c85028] transition-colors">
                        Student Identity & Verification
                      </h4>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-[210px] sm:max-w-xs">
                        {formData.studentId || 'Set Student ID'} • Egerton Verified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Edit student identity"
                      className="p-1.5 rounded-lg bg-[#c85028]/10 text-[#c85028] hover:bg-[#c85028] hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedCard === 'student' ? 'rotate-180 text-[#c85028]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Inline Edit Form */}
                {expandedCard === 'student' && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Student ID / Registration Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EG/CO/2023/4819"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                          isDark
                            ? 'bg-[#15202e] border-[#223348] text-white focus:border-[#c85028]'
                            : 'bg-[#faf6f0] border-[#d8c5b0] text-gray-900 focus:border-[#c85028]'
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSection('Student Identity')}
                      className="w-full py-2 px-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Student ID</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Footer Actions: Check full profile page & Sign Out */}
              <div className="pt-2 border-t border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenFullProfile}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDark
                      ? 'border-[#223348] hover:bg-[#162234] text-gray-200'
                      : 'border-[#d8c5b0] hover:bg-[#ede3d5] text-gray-800'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#c85028]" />
                  <span>Check Full Profile Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-3.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Unauthenticated Account Choices */
            <div className="space-y-2.5 py-2">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] text-white text-left transition-all duration-150 flex items-center justify-between shadow-md hover:brightness-110 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <LogIn className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Sign In to Account
                    </h4>
                    <p className="text-[11px] font-medium text-white/90">
                      Edit your profile, view orders & saved preferences
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                  isDark
                    ? 'bg-[#121926] hover:bg-[#162234] border-[#1e293b]'
                    : 'bg-white hover:bg-[#faf4ee] border-[#d8c5b0] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#c85028]/15 text-[#c85028] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Create New Student Account
                    </h4>
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                      Quick registration with your phone number
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/account/orders');
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                  isDark
                    ? 'bg-[#121926] hover:bg-[#162234] border-[#1e293b]'
                    : 'bg-white hover:bg-[#faf4ee] border-[#d8c5b0] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Track Order Status as Guest
                    </h4>
                    <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                      Lookup order reference without signing in
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
