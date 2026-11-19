import React from 'react';
import { Truck, ShieldCheck, Headphones, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const BenefitsStrip: React.FC = () => {
  const { isDark } = useTheme();

  const BENEFITS = [
    {
      icon: <Truck className="w-5 h-5 text-[#c85028]" />,
      title: 'Fast Delivery',
      desc: 'Across Kenya & Campus',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#c85028]" />,
      title: 'Secure Shopping',
      desc: 'Shop with Confidence',
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#c85028]" />,
      title: '24/7 Support',
      desc: "We're here to help",
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#c85028]" />,
      title: 'Local Store',
      desc: 'Egerton University',
    },
  ];

  return (
    <section className="w-full py-6 sm:py-8 border-y border-gray-200/40 dark:border-gray-800/60 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {BENEFITS.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl flex items-center gap-3.5 border transition-colors ${
                isDark
                  ? 'bg-[#121926] border-[#1e293b]'
                  : 'bg-white border-[#ede4d8] shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#c85028]/10 flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <h4
                  className={`font-bold text-xs sm:text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {b.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
