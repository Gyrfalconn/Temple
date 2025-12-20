
import React from 'react';
import { TEMPLE_NAME_EN, TEMPLE_NAME_TE } from '../constants';
import { ViewState, Language } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';
  const isBoth = language === 'both';

  const getLabel = (en: string, te: string) => {
    if (isEn) return en;
    if (isTe) return te;
    return `${en} / ${te}`;
  };

  return (
    <header className="bg-gradient-to-b from-orange-950 to-orange-900 text-white border-b-2 border-amber-500 sticky top-0 z-50 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center justify-center w-14 h-16 md:w-16 md:h-20 bg-white/10 rounded-lg border border-white/20 p-1 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                <path d="M20 20 L30 85 Q50 95 70 85 L80 20" fill="white" />
                <path d="M47 35 L50 85 Q50 88 53 85 L56 35" fill="#ef4444" />
                <path d="M30 85 Q50 95 70 85" fill="none" stroke="#fbbf24" strokeWidth="3" />
              </svg>
            </div>
            <div className="text-left flex-1 min-w-0">
              <h1 className="text-xs md:text-lg font-black tracking-tight text-amber-400 leading-tight">
                {isEn ? TEMPLE_NAME_EN : TEMPLE_NAME_TE}
              </h1>
              {isBoth && <p className="text-[8px] md:text-[9px] text-amber-200/40 font-bold uppercase tracking-tighter">{TEMPLE_NAME_EN}</p>}
              <p className="text-amber-500/80 font-black text-[9px] md:text-[10px] italic mt-0.5">
                లోకా సమస్తా సుఖినో భవంతు
              </p>
            </div>
          </div>
          
          <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/10 scale-90 md:scale-100">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-[8px] font-black transition-all ${isEn ? 'bg-amber-400 text-orange-950 shadow-sm' : 'text-amber-100/50 hover:text-amber-100'}`}
            >EN</button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-3 py-1 rounded-full text-[8px] font-black transition-all ${isTe ? 'bg-amber-400 text-orange-950 shadow-sm' : 'text-amber-100/50 hover:text-amber-100'}`}
            >తెలుగు</button>
            <button
              onClick={() => setLanguage('both')}
              className={`px-3 py-1 rounded-full text-[8px] font-black transition-all ${isBoth ? 'bg-amber-400 text-orange-950 shadow-sm' : 'text-amber-100/50 hover:text-amber-100'}`}
            >BOTH</button>
          </div>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-1 mt-2">
          {[
            { id: 'reminders', en: "Today", te: "నేటి" },
            { id: 'upcoming', en: "Upcoming", te: "రాబోవు" },
            { id: 'directory', en: "Directory", te: "జాబితా" },
            { id: 'add', en: "Register", te: "నమోదు" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`px-3 py-1.5 rounded-md font-black transition-all duration-200 text-[8px] md:text-[9px] uppercase tracking-[0.15em] border ${
                currentView === item.id 
                  ? 'bg-amber-400 text-orange-950 border-amber-500 shadow-md' 
                  : 'bg-white/5 text-amber-100/60 border-white/10 hover:bg-white/10'
              }`}
            >
              {getLabel(item.en, item.te)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
