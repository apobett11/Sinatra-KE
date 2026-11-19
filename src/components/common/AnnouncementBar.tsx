import React from 'react';
import { Truck, MessageCircle, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AnnouncementBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full py-2 px-4 text-[12px] font-medium transition-colors border-b ${
        isDark
          ? 'bg-[#0a131e] text-white border-[#1e293b]/60'
          : 'bg-[#f1dcc8] text-[#18181b] border-[#e8ceba]/70'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between">
        {/* Mobile & Desktop Main Promotion */}
        <div className="flex items-center justify-center gap-2 text-center">
          <Truck
            className={`w-4 h-4 flex-shrink-0 ${
              isDark ? 'text-[#ea580c]' : 'text-[#c85428]'
            }`}
          />
          <span className="font-semibold tracking-wide text-[11px] sm:text-xs">
            Free delivery on orders above KSh 2,000
          </span>
        </div>

        {/* Desktop supporting links */}
        <div className="hidden md:flex items-center gap-6 text-[11px]">
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 transition-colors ${
              isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-[#c85428]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp: +254 712 345 678</span>
          </a>

          <div
            className={`flex items-center gap-1.5 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#c85428]" />
            <span>Egerton University Student Centre</span>
          </div>
        </div>
      </div>
    </div>
  );
};
