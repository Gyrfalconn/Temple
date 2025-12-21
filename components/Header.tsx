
import React from 'react';
import { TEMPLE_NAME_EN, TEMPLE_NAME_TE, TEMPLE_SLOGAN_TE } from '../constants.ts';
import { ViewState, Language } from '../types.ts';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';

  const getLabel = (en: string, te: string) => {
    return isEn ? en : te;
  };

  return (
    <header className="bg-[#7c2d12] text-white border-b border-white/10 sticky top-0 z-50 shadow-xl py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left: Logo & Branding */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="flex items-center justify-center w-10 h-11 bg-white/10 rounded-lg border border-white/20 p-1.5 shadow-xl">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                <path d="M20 20 L30 85 Q50 95 70 85 L80 20" fill="white" />
                <path d="M47 35 L50 85 Q50 88 53 85 L56 35" fill="#ef4444" />
                <path d="M30 85 Q50 95 70 85" fill="none" stroke="#fbbf24" strokeWidth="4" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[11px] md:text-sm font-black tracking-[0.05em] text-[#fbbf24] uppercase leading-none">
              {TEMPLE_NAME_EN}
            </h1>
            <p className="text-white font-medium text-[8px] md:text-[9px] mt-1.5 leading-tight opacity-90 hidden sm:block">
              {TEMPLE_SLOGAN_TE}
            </p>
          </div>
        </div>

        {/* Right: Navigation & Action Area */}
        <div className="flex items-center gap-2">
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 mr-2">
            {[
              { id: 'reminders', en: "Today", te: "నేటి" },
              { id: 'upcoming', en: "Upcoming", te: "రాబోవు" },
              { id: 'directory', en: "Directory", te: "జాబితా" }
            ].map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as ViewState)}
                  className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-[#5a200d] text-white border border-white/20 shadow-inner' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {getLabel(item.en, item.te)}
                </button>
              );
            })}
          </nav>

          {/* Register CTA */}
          <button
            onClick={() => setView('add')}
            className={`px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
              currentView === 'add' 
                ? 'bg-[#fbbf24] text-[#7c2d12] shadow-lg scale-105' 
                : 'bg-[#fbbf24] text-[#7c2d12] hover:bg-amber-300 shadow-sm'
            }`}
          >
            {getLabel('Register', 'నమోదు')}
          </button>

          {/* Language Picker */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 ml-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-[8px] font-black transition-all ${isEn ? 'bg-[#fbbf24] text-[#7c2d12] shadow-md' : 'text-white/30 hover:text-white'}`}
            >EN</button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-1 rounded-lg text-[8px] font-black transition-all ${isTe ? 'bg-[#fbbf24] text-[#7c2d12] shadow-md' : 'text-white/30 hover:text-white'}`}
            >TE</button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Bar */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 mt-3">
        <nav className="flex justify-between gap-1 border border-white/10 rounded-xl p-1 bg-black/10">
          {[
            { id: 'reminders', en: "Today", te: "నేటి" },
            { id: 'upcoming', en: "Upcoming", te: "రాబోవు" },
            { id: 'directory', en: "Directory", te: "జాబితా" }
          ].map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`flex-1 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-tighter transition-all ${
                  isActive 
                    ? 'bg-[#5a200d] text-white border border-white/10 shadow-md' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {getLabel(item.en, item.te)}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
