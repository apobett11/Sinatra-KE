import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SearchCapsuleProps {
  value: string;
  onChange: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoExpand?: boolean;
}

export const SearchCapsule: React.FC<SearchCapsuleProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search products, style...',
  autoExpand = false,
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(autoExpand || Boolean(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen && !value) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center">
      {/* Search Capsule Container */}
      <div
        className={`flex items-center rounded-full transition-all duration-300 border ${
          isOpen
            ? 'w-36 sm:w-64 px-2.5 sm:px-3 py-1 sm:py-1.5 ' +
              (isDark
                ? 'bg-[#121926] border-[#c85028] shadow-[0_0_12px_rgba(200,80,40,0.15)]'
                : 'bg-white border-[#c85028] shadow-[0_2px_8px_rgba(200,80,40,0.12)]')
            : 'w-8 h-8 sm:w-9 sm:h-9 justify-center cursor-pointer ' +
              (isDark
                ? 'bg-[#121926] border-[#1e293b] hover:border-[#334155]'
                : 'bg-white border-[#ede4d8] hover:border-gray-300')
        }`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Search"
          className="text-gray-400 hover:text-[#c85028] transition-colors flex-shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>

        {isOpen && (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-transparent px-2 text-xs sm:text-sm outline-none transition-colors ${
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
        )}

        {isOpen && value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
