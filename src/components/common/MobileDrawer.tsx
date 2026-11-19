import React from 'react';
import { SidebarContent } from './SidebarContent';
import { useTheme } from '../../context/ThemeContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content: Designed to fit screen with no vertical scroll */}
      <div
        className={`relative w-4/5 max-w-sm h-full flex flex-col justify-between overflow-hidden p-4 sm:p-5 shadow-2xl transition-transform ${
          isDark
            ? 'bg-[#0b1624] text-white border-r border-[#1a2536]'
            : 'bg-[#faf6f0] text-gray-900 border-r border-[#e8ded0]'
        }`}
      >
        <SidebarContent onClose={onClose} isDesktop={false} />
      </div>
    </div>
  );
};
