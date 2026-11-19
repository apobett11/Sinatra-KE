import React from 'react';
import { SidebarContent } from './SidebarContent';
import { useTheme } from '../../context/ThemeContext';

export const DesktopSidebar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <aside
      className={`hidden lg:flex w-72 xl:w-80 shrink-0 sticky top-14 sm:top-20 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar flex-col justify-between p-4 sm:p-5 shadow-sm transition-colors z-20 ${
        isDark
          ? 'bg-[#0b1624] text-white border-r border-[#1a2536]'
          : 'bg-[#faf6f0] text-gray-900 border-r border-[#e8ded0]'
      }`}
    >
      <SidebarContent isDesktop={true} />
    </aside>
  );
};
