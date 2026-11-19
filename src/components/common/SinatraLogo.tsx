import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const SinatraLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark } = useTheme();

  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Terracotta Coat Hanger SVG Logo */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 48 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#c85028] transform group-hover:scale-105 transition-transform"
        >
          {/* Top hook */}
          <path
            d="M24 16C24 13.5 25.5 11 28 11C30.5 11 32 12.8 32 15C32 18.5 28 20 24 22"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Hanger shoulders and bottom rail */}
          <path
            d="M24 22L7 32C5.5 32.8 6 35 7.8 35H40.2C42 35 42.5 32.8 41 32L24 22Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* SINATRA wordmark */}
      <span
        className={`font-black text-xl sm:text-2xl tracking-wider font-['Outfit'] transition-colors ${
          isDark ? 'text-white' : 'text-[#1a1a1a]'
        }`}
      >
        SINATRA
      </span>
    </Link>
  );
};
