import React from 'react';
import { Scissors, Sparkles, Calendar, ShieldCheck, UserCheck, Clock } from 'lucide-react';

interface HeaderProps {
  activeView: 'booking' | 'dashboard';
  setActiveView: (view: 'booking' | 'dashboard') => void;
  onOpenAiConsultant: () => void;
  appointmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAiConsultant,
  appointmentCount
}) => {
  return (
    <header className="bg-[#004684] text-white sticky top-0 z-30 shadow-md border-b border-[#00315C]">
      {/* Top Aggie Pride Bar */}
      <div className="bg-[#00315C] text-[#FDB927] py-1 px-4 text-[11px] font-bold tracking-wider text-center flex items-center justify-center gap-2">
        <span className="uppercase">N.C. A&T Aggie Homecoming 2026</span>
        <span>•</span>
        <span className="text-white font-mono uppercase">"Aggies DO" Glam Salon</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDB927] text-[#004684] shadow-md flex items-center justify-center font-bold text-lg shrink-0">
              <Scissors className="w-5 h-5 text-[#004684] transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-serif uppercase">
                  Aura Glam <span className="text-[#004684] font-sans text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FDB927] rounded-md ml-1">N.C. A&T</span>
                </h1>
              </div>
              <p className="text-xs text-blue-100 flex items-center gap-2 mt-0.5">
                <span>1.5-Hour Hair Slots</span>
                <span className="text-blue-300">•</span>
                <span>Mani & Pedi Add-ons</span>
              </p>
            </div>
          </div>

          {/* Quick Features & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* AI Style Helper Button */}
            <button
              onClick={onOpenAiConsultant}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FDB927] text-[#004684] hover:bg-amber-300 transition-all duration-200 cursor-pointer shadow-sm uppercase tracking-wider"
              id="ai-style-helper-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#004684]" />
              <span>Match Dress with AI</span>
            </button>

            {/* View Switcher: Client Booking vs Stylist Dashboard */}
            <div className="bg-[#00315C] p-1 rounded-xl border border-blue-800 flex items-center">
              <button
                onClick={() => setActiveView('booking')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                  activeView === 'booking'
                    ? 'bg-[#FDB927] text-[#004684] shadow-xs'
                    : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
                }`}
                id="view-client-booking-btn"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Hair</span>
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                  activeView === 'dashboard'
                    ? 'bg-[#FDB927] text-[#004684] shadow-xs'
                    : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
                }`}
                id="view-stylist-dashboard-btn"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Stylist Portal</span>
                {appointmentCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-white text-[#004684] rounded-full font-extrabold">
                    {appointmentCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
