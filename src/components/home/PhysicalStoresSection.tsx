import React, { useState } from 'react';
import { Store, MapPin, Clock, Phone, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { PHYSICAL_STORES } from '../../data/physicalStores';
import { useTheme } from '../../context/ThemeContext';

export const PhysicalStoresSection: React.FC = () => {
  const { isDark } = useTheme();
  const [activeCheckMsg, setActiveCheckMsg] = useState<string | null>(null);

  const handleCheckStoreStatus = (storeName: string) => {
    setActiveCheckMsg(`Active & Ready: ${storeName} team is on counter with fitting rooms open.`);
    setTimeout(() => setActiveCheckMsg(null), 5000);
  };

  return (
    <section className="w-full py-8 sm:py-12 border-b border-gray-200/50 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  2 Physical Campus Stores
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  Open Today
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Visit our fitting rooms, try your sizing, or collect your online orders same-day at Egerton.
              </p>
            </div>
          </div>

          {activeCheckMsg && (
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeCheckMsg}</span>
            </div>
          )}
        </div>

        {/* 2 Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHYSICAL_STORES.map((st) => (
            <div
              key={st.id}
              className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#c85028] block mb-1">
                    {st.isFlagship ? '★ Flagship Campus Store' : '★ Express Commercial Annex'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">{st.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{st.tagline}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {st.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c85028] shrink-0" />
                  <span>
                    {st.building}, {st.roomOrShop}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{st.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {st.phone} • Supervisor: <strong className="text-gray-300">{st.manager}</strong>
                  </span>
                </div>
              </div>

              {/* Services badges */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/80 mb-5">
                <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">
                  In-Store Services:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {st.services.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCheckStoreStatus(st.name)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isDark
                      ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Check Fitting Room
                </button>
                <a
                  href={`https://wa.me/${st.whatsappDesk.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Store WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
