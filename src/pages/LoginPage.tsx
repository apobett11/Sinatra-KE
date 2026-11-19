import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SinatraLogo } from '../components/common/SinatraLogo';

export const LoginPage: React.FC = () => {
  const { login, rememberedAccount, failedAttempts } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Autofill handler triggered whenever user clicks or taps either input
  const handleAutofill = () => {
    if (!email) {
      setEmail(rememberedAccount?.email || 'john.doe@student.egerton.ac.ke');
    }
    if (!password) {
      setPassword('SinatraUser123!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (failedAttempts >= 6) {
      setErrorMessage('Maximum attempts reached (6/6). Please wait before trying again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password, rememberLogin);
      setIsLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    }, 450);
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-5rem)] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Main Solid Card */}
        <div
          className={`w-full rounded-3xl border-2 border-t-4 border-t-[#c85028] p-5 sm:p-7 transition-all ${
            isDark
              ? 'bg-[#0f1726] border-[#1e2e44] shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
              : 'bg-white border-[#e6d8c8] shadow-[0_16px_40px_rgba(200,80,40,0.12)]'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2.5">
              <SinatraLogo />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#c85028] text-white mb-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Campus Account Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Welcome Back</h1>
            <p className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to access your personal dashboard, bag & orders.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email, Student ID, or Phone
                </label>
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="text-[10px] font-bold text-[#c85028] hover:underline cursor-pointer"
                >
                  Autofill demo
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleAutofill}
                  onClick={handleAutofill}
                  placeholder="Tap to autofill demo account"
                  className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium outline-none transition-all ${
                    isDark
                      ? 'bg-[#142030] border-[#22354c] text-white focus:border-[#c85028] focus:ring-2 focus:ring-[#c85028]/25 placeholder:text-gray-500'
                      : 'bg-[#faf6f1] border-[#dbcab5] text-gray-900 focus:border-[#c85028] focus:ring-2 focus:ring-[#c85028]/25 placeholder:text-gray-400'
                  }`}
                />
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <span
                  onClick={() => setPassword('SinatraUser123!')}
                  className="text-[10px] text-[#c85028] font-bold cursor-pointer hover:underline"
                >
                  Demo: SinatraUser123!
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    if (!password) setPassword('SinatraUser123!');
                  }}
                  onClick={() => {
                    if (!password) setPassword('SinatraUser123!');
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium outline-none transition-all ${
                    isDark
                      ? 'bg-[#142030] border-[#22354c] text-white focus:border-[#c85028] focus:ring-2 focus:ring-[#c85028]/25 placeholder:text-gray-500'
                      : 'bg-[#faf6f1] border-[#dbcab5] text-gray-900 focus:border-[#c85028] focus:ring-2 focus:ring-[#c85028]/25 placeholder:text-gray-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberLogin}
                  onChange={(e) => setRememberLogin(e.target.checked)}
                  className="rounded accent-[#c85028] w-3.5 h-3.5 cursor-pointer"
                />
                <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Solid Brand Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-black text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(200,80,40,0.35)] flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-75 mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create account footer */}
          <div className="pt-3.5 mt-3.5 border-t border-gray-200 dark:border-gray-800 text-center text-xs">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Don't have an account yet? </span>
            <Link to="/register" className="font-black text-[#c85028] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
