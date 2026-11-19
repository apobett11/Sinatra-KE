import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
  Info,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ContactBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContactPage?: () => void;
  theme?: 'dark' | 'light';
}

export const ContactBottomModal: React.FC<ContactBottomModalProps> = ({
  isOpen,
  onClose,
  onOpenContactPage,
  theme: propTheme,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propTheme ? propTheme === 'dark' : contextIsDark;
  const [showInAppAlert, setShowInAppAlert] = useState(false);

  if (!isOpen) return null;

  const phone = '+254712345678';
  const cleanPhone = '254712345678';
  const email = 'egerton.store@sinatra.co.ke';

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${cleanPhone}?text=Hi%2C%20I%20am%20inquiring%20about%20Sinatra%20KE%20store`,
      '_blank'
    );
  };

  const handleCallDesk = () => {
    window.location.href = `tel:+${cleanPhone}`;
  };

  const handleEmailDesk = () => {
    window.location.href = `mailto:${email}?subject=Sinatra%20KE%20Store%20Inquiry`;
  };

  const handleInAppHelp = () => {
    setShowInAppAlert(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop: Clicking outside closes */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto animate-bottom-backdrop cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Popup Dialog: Flush with top edge of bottom navigation bar */}
      <div
        className={`relative bottom-15 inset-x-0 pointer-events-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl border transition-all duration-300 z-10 animate-bottom-sheet max-h-[78vh] flex flex-col mx-auto ${
          isDark
            ? 'bg-[#0e1624] border-[#1f293d] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-[#1a1a1a] shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="w-12 h-1.5 rounded-full bg-slate-400/30 mx-auto mb-3.5" />

        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3.5 border-b mb-4 ${
            isDark ? 'border-[#1f293d]' : 'border-[#ede4d8]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-xl font-black text-white shadow-sm ${
                isDark
                  ? 'bg-gradient-to-tr from-[#d9532f] to-[#b3441e]'
                  : 'bg-gradient-to-tr from-[#c85028] to-[#9c3413]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
                Instant Contact Channels
              </h3>
              <p className="text-[11px] text-gray-400">
                Direct helplines & instant concierges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#162030] text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Close contact modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* IN-APP HELP COMING SOON POPUP/ALERT */}
        {showInAppAlert && (
          <div
            className={`mb-3.5 p-3 rounded-xl border animate-spring-pop flex items-start justify-between gap-2.5 ${
              isDark
                ? 'bg-[#d9532f]/15 border-[#d9532f]/40 text-orange-200'
                : 'bg-[#c85028]/10 border-[#c85028]/30 text-[#c85028]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold mb-0.5">
                  In-App Messaging
                </strong>
                <p className="text-[11px] opacity-90">
                  We are working on the in app messaging. Coming soon.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInAppAlert(false)}
              className="p-1 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* THE FOUR ACTION BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 transition-all touch-spring text-center cursor-pointer shadow-xs active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-black ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              WhatsApp
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              Instant reply
            </span>
          </button>

          {/* 2. Call Desk Button */}
          <button
            type="button"
            onClick={handleCallDesk}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border border-sky-500/25 transition-all touch-spring text-center cursor-pointer shadow-xs active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-500">
              <Phone className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-black ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Call Desk
            </span>
            <span className="text-[10px] text-sky-400 font-medium">
              Dial direct
            </span>
          </button>

          {/* 3. Email Desk Button */}
          <button
            type="button"
            onClick={handleEmailDesk}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/25 transition-all touch-spring text-center cursor-pointer shadow-xs active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Mail className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-black ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Email Desk
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              Official orders
            </span>
          </button>

          {/* 4. In-App Help Button */}
          <button
            type="button"
            onClick={handleInAppHelp}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all touch-spring text-center cursor-pointer shadow-xs active:scale-95 ${
              isDark
                ? 'bg-[#d9532f]/10 hover:bg-[#d9532f]/20 text-[#d9532f] border-[#d9532f]/30'
                : 'bg-[#c85028]/10 hover:bg-[#c85028]/20 text-[#c85028] border-[#c85028]/30'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark
                  ? 'bg-[#d9532f]/20 text-[#d9532f]'
                  : 'bg-[#c85028]/15 text-[#c85028]'
              }`}
            >
              <Send className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-black ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              In-App Help
            </span>
            <span
              className={`text-[10px] font-medium ${
                isDark ? 'text-orange-400' : 'text-[#c85028]'
              }`}
            >
              Live concierge
            </span>
          </button>
        </div>

        {/* Footer info: Campus Hub & link to Contact page */}
        <div
          className={`mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
            isDark ? 'border-[#1f293d] text-gray-400' : 'border-[#ede4d8] text-gray-500'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c85028]" />
            <span>Egerton Campus Hub, Student Centre Rm 12</span>
          </div>

          {onOpenContactPage && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenContactPage();
              }}
              className={`font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#d9532f] hover:text-[#ff6b4a]'
                  : 'text-[#c85028] hover:text-[#a83d1c]'
              }`}
            >
              <span>Full Contact Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
