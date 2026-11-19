import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Package,
  Heart,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PHYSICAL_STORES } from '../../data/physicalStores';
import { SinatraLogo } from './SinatraLogo';

const ALLOWED_SPECIAL_REGEX = /[#$@&(),.!%^&*_\-]/;
const ILLEGAL_CHARS_REGEX = /[^a-zA-Z0-9#$@&(),.!%^&*_\-]/;

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    authModalReason,
    closeAuthModal,
    login,
    register,
    oneTapLogin,
    rememberedAccount,
    failedAttempts,
  } = useAuth();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [regResidence, setRegResidence] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regPreferredStore, setRegPreferredStore] = useState('store-1');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalMode || 'login');
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  useEffect(() => {
    if (sameAsPhone) {
      setRegWhatsapp(regPhone);
    }
  }, [sameAsPhone, regPhone]);

  if (!isAuthModalOpen) return null;

  // Password 4-check verification
  const passwordChecks = {
    length: regPassword.length >= 6 && regPassword.length <= 16,
    letter: /[a-zA-Z]/.test(regPassword),
    digit: /[0-9]/.test(regPassword),
    special: ALLOWED_SPECIAL_REGEX.test(regPassword) && !ILLEGAL_CHARS_REGEX.test(regPassword),
  };
  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.letter &&
    passwordChecks.digit &&
    passwordChecks.special;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (failedAttempts >= 6) {
      setErrorMessage('Maximum attempts reached (6/6). Please wait before trying again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(loginIdentifier, loginPassword, rememberLogin);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Welcome back! Your bag has been synchronized.');
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isPasswordValid) {
      setErrorMessage('Please satisfy all 4 password complexity criteria.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        whatsappNumber: sameAsPhone ? regPhone : regWhatsapp,
        residence: regResidence || 'Egerton Main Campus',
        studentId: regStudentId || 'EG/2026/STU',
        preferredStoreId: regPreferredStore,
        password: regPassword,
        rememberMe: true,
      });
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Account registered successfully! Bag unlocked.');
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    }, 450);
  };

  const handleOneTap = () => {
    setIsLoading(true);
    setTimeout(() => {
      const res = oneTapLogin();
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(`Welcome back, ${rememberedAccount?.name}!`);
      } else {
        setErrorMessage('Could not sign in with remembered account.');
      }
    }, 300);
  };

  const getReasonBanner = () => {
    if (authModalReason === 'cart_limit') {
      return {
        icon: ShoppingBag,
        badge: 'Guest Bag Limit Reached (3 Outfits)',
        title: 'Unlock Unlimited Bag Capacity',
        description:
          'Guest bags can hold up to 3 items. Sign in or register to add this outfit and unlock unlimited shopping. Your 3 items are safely preserved in cache!',
      };
    }
    if (authModalReason === 'orders') {
      return {
        icon: Package,
        badge: 'Verified Order Access',
        title: 'Private Orders Protected',
        description:
          'Sign in to access your verified order receipts, tracking steps, and physical store collection pass.',
      };
    }
    if (authModalReason === 'profile') {
      return {
        icon: UserIcon,
        badge: 'Profile Settings',
        title: 'Manage Your Account',
        description:
          'Sign in to update your contact details, address around Egerton, and preferred physical store.',
      };
    }
    if (authModalReason === 'wishlist') {
      return {
        icon: Heart,
        badge: 'Saved Wishlist',
        title: 'Save Outfits to Your Wishlist',
        description:
          'Sign in to bookmark your favorite streetwear looks and build your personal campus lookbook.',
      };
    }
    return null;
  };

  const reasonInfo = getReasonBanner();

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg my-auto rounded-3xl shadow-2xl border transition-all z-10 overflow-hidden ${
          isDark
            ? 'bg-[#0f1926] border-[#1e2e42] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-gray-900 shadow-xl'
        }`}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c85028] via-[#e26938] to-[#9c3413]" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-gray-200/40 dark:border-gray-800/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <SinatraLogo />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c85028] block">
                Egerton Campus Stores
              </span>
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                {activeTab === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h2>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reason Banner if triggered by logic gate */}
        {reasonInfo && (
          <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-[#c85028]/10 border border-[#c85028]/30 flex items-start gap-3">
            <reasonInfo.icon className="w-5 h-5 text-[#c85028] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-black text-[#c85028] block uppercase text-[10px] tracking-wide">
                {reasonInfo.badge}
              </span>
              <p className="font-bold text-xs">{reasonInfo.title}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {reasonInfo.description}
              </p>
            </div>
          </div>
        )}

        {/* 1-Tap Quick Login if remembered account exists and in login mode */}
        {activeTab === 'login' && rememberedAccount && (
          <div className="mx-5 mt-4 p-3 rounded-2xl border border-dashed border-[#c85028]/40 bg-gradient-to-r from-[#c85028]/5 to-transparent flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#c85028] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                {rememberedAccount.name.charAt(0)}
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-emerald-500 block">
                  Saved Account on this Device
                </span>
                <p className="font-bold text-xs truncate">@{rememberedAccount.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{rememberedAccount.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOneTap}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-black text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              1-Tap Sign In
            </button>
          </div>
        )}

        {/* Error / Success Notices */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-5 pt-3">
          <div
            className={`grid grid-cols-2 p-1 rounded-2xl border ${
              isDark ? 'bg-[#09121d] border-[#182334]' : 'bg-[#f7efe6] border-[#ede4d8]'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#c85028] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#c85028] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 max-h-[62vh] overflow-y-auto space-y-4">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-400 mb-1">
                  Email, Student ID, or Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. john.doe@student.egerton.ac.ke or EG/CO/2023/..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-400">Password</label>
                  <span className="text-[11px] text-[#c85028] font-semibold">
                    Demo: SinatraUser123!
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Login Checkbox */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={(e) => setRememberLogin(e.target.checked)}
                    className="rounded accent-[#c85028]"
                  />
                  <span>Remember me for 1-tap login</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In to Bag & Orders'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-400 mb-1">Full Student Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <UserIcon className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@egerton.ac.ke"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>
              </div>

              {/* Same as phone toggle */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <input
                  type="checkbox"
                  id="sameAsPhoneCheck"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="rounded accent-[#c85028]"
                />
                <label htmlFor="sameAsPhoneCheck" className="cursor-pointer select-none">
                  WhatsApp contact is the same as phone number
                </label>
              </div>

              {!sameAsPhone && (
                <div>
                  <label className="block font-bold text-gray-400 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="+254 700 000 000"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>
              )}

              {/* Preferred Physical Store Selector */}
              <div>
                <label className="block font-bold text-gray-400 mb-1">
                  Preferred Physical Store (Campus Pickup)
                </label>
                <select
                  value={regPreferredStore}
                  onChange={(e) => setRegPreferredStore(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-[#142030] border-[#1f2d42] text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {PHYSICAL_STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.roomOrShop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password with live 4-checks */}
              <div>
                <label className="block font-bold text-gray-400 mb-1">Create Password</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="e.g. Sinatra#2026"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition-colors ${
                      isDark
                        ? 'bg-[#142030] border-[#1f2d42] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 4-check indicators */}
                <div className="grid grid-cols-2 gap-1.5 mt-2 pt-1 border-t border-gray-200/40 dark:border-gray-800 text-[10px]">
                  <span
                    className={`flex items-center gap-1 ${
                      passwordChecks.length ? 'text-emerald-500 font-bold' : 'text-gray-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> 6–16 Characters
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordChecks.letter ? 'text-emerald-500 font-bold' : 'text-gray-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Contains Letters
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordChecks.digit ? 'text-emerald-500 font-bold' : 'text-gray-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Contains Digits (0-9)
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordChecks.special ? 'text-emerald-500 font-bold' : 'text-gray-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Special (#$@&_...)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer reassurance */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between text-[11px] transition-colors ${
            isDark
              ? 'bg-[#09121d] border-[#182334] text-gray-400'
              : 'bg-[#faf6f1] border-[#ede4d8] text-gray-500'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#c85028]" />
            <span>Encrypted Customer Security</span>
          </div>
          <span className="font-semibold text-emerald-500">Cart Cache Persisted ✓</span>
        </div>
      </div>
    </div>
  );
};
