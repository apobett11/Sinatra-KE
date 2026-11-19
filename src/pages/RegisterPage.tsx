import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Phone, User, Eye, EyeOff, CheckCircle2, Store, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PHYSICAL_STORES } from '../data/physicalStores';
import { SinatraLogo } from '../components/common/SinatraLogo';

const ALLOWED_SPECIAL_REGEX = /[#$@&(),.!%^&*_\-]/;
const ILLEGAL_CHARS_REGEX = /[^a-zA-Z0-9#$@&(),.!%^&*_\-]/;

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    studentId: '',
    residence: '',
    preferredStoreId: 'store-1',
    password: '',
    confirmPassword: '',
  });

  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = {
    length: formData.password.length >= 6 && formData.password.length <= 16,
    letter: /[a-zA-Z]/.test(formData.password),
    digit: /[0-9]/.test(formData.password),
    special: ALLOWED_SPECIAL_REGEX.test(formData.password) && !ILLEGAL_CHARS_REGEX.test(formData.password),
  };
  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.letter &&
    passwordChecks.digit &&
    passwordChecks.special;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must satisfy all 4 complexity requirements.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsappNumber: sameAsPhone ? formData.phone : formData.whatsappNumber,
        studentId: formData.studentId,
        residence: formData.residence,
        preferredStoreId: formData.preferredStoreId,
        password: formData.password,
        rememberMe: true,
      });
      setIsLoading(false);
      if (res.success) {
        navigate('/account');
      } else {
        setError(res.error || 'Registration failed.');
      }
    }, 500);
  };

  return (
    <div className="w-full pb-20 pt-8 sm:pt-14">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SinatraLogo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Create Customer Account</h1>
          <p className="text-xs text-gray-400">
            Join the community in and around Egerton and enjoy fast order fulfillment.
          </p>
        </div>

        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
          }`}
        >
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-400">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-400">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0712 345 678"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-400">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="EG/CO/2023/..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <input
                type="checkbox"
                id="samePhoneReg"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="rounded accent-[#c85028]"
              />
              <label htmlFor="samePhoneReg" className="cursor-pointer select-none">
                WhatsApp contact is the same as phone
              </label>
            </div>

            {!sameAsPhone && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-400">WhatsApp Desk</label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+254 700 000 000"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                  }`}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-400">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@student.egerton.ac.ke"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                }`}
              />
            </div>

            {/* Preferred Physical Store Selector */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-400">
                Default Campus Pickup Store
              </label>
              <select
                value={formData.preferredStoreId}
                onChange={(e) => setFormData({ ...formData, preferredStoreId: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors font-bold ${
                  isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
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
              <label className="block text-xs font-semibold mb-1 text-gray-400">
                Create Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="e.g. Sinatra#2026"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <CheckCircle2 className="w-3 h-3" /> Letters
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    passwordChecks.digit ? 'text-emerald-500 font-bold' : 'text-gray-500'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> Digits (0-9)
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

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-400">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Cart cache reassurance */}
          <div className="mt-5 p-3 rounded-xl bg-[#c85028]/10 border border-[#c85028]/25 text-[11px] text-gray-300 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#c85028] shrink-0" />
            <span>Existing bag items will remain completely preserved in cache.</span>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-[#c85028] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
