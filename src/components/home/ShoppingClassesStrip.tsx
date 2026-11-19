import React from 'react';
import { Briefcase, Footprints, Watch } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface ShoppingClassItem {
  id: string;
  label: string;
  type: 'audience' | 'style' | 'special';
  value: string;
  icon: React.ReactNode;
}

export const ShoppingClassesStrip: React.FC<{
  onSelectClass?: (type: string, value: string) => void;
}> = ({ onSelectClass }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Custom SVGs matching the reference image icons exactly
  const MenShirtIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path d="M6 3L2 7L5 10L5 21H19L19 10L22 7L18 3H15C15 5 13.5 6 12 6C10.5 6 9 5 9 3H6Z" />
    </svg>
  );

  const LadiesDressIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path d="M10 2L14 2L16 7L13 7L17 21L7 21L11 7L8 7L10 2Z" />
    </svg>
  );

  const UnisexIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <circle cx="8" cy="7" r="3" />
      <path d="M3 18C3 15 5.5 13 8 13C10.5 13 13 15 13 18" />
      <circle cx="16" cy="7" r="3" />
      <path d="M11 18C11 15 13.5 13 16 13C18.5 13 21 15 21 18" />
    </svg>
  );

  const SneakerIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path d="M3 16V17C3 18.5 4.5 19 6 19H18C19.5 19 21 18.5 21 17V14L17 11L13 13L8 9L3 13V16Z" />
      <path d="M8 9V6L12 7" />
    </svg>
  );

  const CasualCapIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path d="M5 14C5 8.5 8 5 12 5C16 5 19 8.5 19 14" />
      <path d="M3 15C5 15 8 16 12 16C16 16 19 15 21 15" />
      <path d="M12 5V3.5" />
    </svg>
  );

  // The 5 core categories shown on mobile in reference
  const MOBILE_ITEMS: ShoppingClassItem[] = [
    {
      id: 'men',
      label: 'Men',
      type: 'audience',
      value: 'Men',
      icon: <MenShirtIcon />,
    },
    {
      id: 'ladies',
      label: 'Ladies',
      type: 'audience',
      value: 'Ladies',
      icon: <LadiesDressIcon />,
    },
    {
      id: 'unisex',
      label: 'Unisex',
      type: 'audience',
      value: 'Unisex',
      icon: <UnisexIcon />,
    },
    {
      id: 'streetwear',
      label: 'Streetwear',
      type: 'style',
      value: 'Streetwear',
      icon: <SneakerIcon />,
    },
    {
      id: 'casual',
      label: 'Casual',
      type: 'style',
      value: 'Casual',
      icon: <CasualCapIcon />,
    },
  ];

  // Extended desktop items
  const DESKTOP_EXTRA_ITEMS: ShoppingClassItem[] = [
    {
      id: 'official',
      label: 'Official',
      type: 'style',
      value: 'Official',
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'shoes',
      label: 'Shoes',
      type: 'special',
      value: 'Shoes',
      icon: <Footprints className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'accessories',
      label: 'Accessories',
      type: 'special',
      value: 'Accessories',
      icon: <Watch className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  const ALL_ITEMS = [...MOBILE_ITEMS, ...DESKTOP_EXTRA_ITEMS];

  const handleClick = (item: ShoppingClassItem) => {
    if (onSelectClass) {
      onSelectClass(item.type, item.value);
    } else {
      navigate(`/shop?${item.type}=${encodeURIComponent(item.value)}`);
    }
  };

  return (
    <section className="w-full py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Small Header */}
        <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
          <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase text-gray-500 dark:text-gray-400">
            What do you want to wear?
          </span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Mobile: 5 equal cards matching reference exactly */}
        <div className="grid grid-cols-5 gap-2 md:hidden">
          {MOBILE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center h-[72px] rounded-2xl border transition-all duration-150 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#121c2a] border-[#1e2d40] text-white hover:border-[#fe8547]'
                  : 'bg-[#f3eae0] border-[#e8dccf] text-[#18181b] hover:border-[#c85028]'
              }`}
            >
              <div
                className={`mb-1 transition-transform ${
                  isDark ? 'text-[#fe8547]' : 'text-[#18181b]'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop: Horizontal layout with all categories */}
        <div className="hidden md:flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 pt-1">
          {ALL_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center min-w-[88px] h-[86px] px-3 rounded-2xl border transition-all duration-150 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#121c2a] border-[#1e2d40] text-white hover:border-[#fe8547]'
                  : 'bg-[#f3eae0] border-[#e8dccf] text-[#18181b] hover:border-[#c85028]'
              }`}
            >
              <div
                className={`mb-1.5 transition-transform ${
                  isDark ? 'text-[#fe8547]' : 'text-[#18181b]'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
