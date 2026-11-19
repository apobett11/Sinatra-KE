import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this ${product.name} (KSh ${product.price.toLocaleString()}) from Sinatra KE! Available at Egerton Student Centre & Gate B stores:\n${currentUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(
      `Loving this ${product.name} from Sinatra KE! Campus streetwear delivered.\n${currentUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm my-auto rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all z-10 ${
          isDark
            ? 'bg-[#0f1926] border-[#1e2e42] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-gray-900 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200/40 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#c85028]" />
            <h3 className="font-black text-sm">Share Street Outfit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share to WhatsApp Status & Chats</span>
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Share on X / Twitter</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              copied
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : isDark
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                : 'border-gray-200 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Outfit Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
