
import React from 'react';
import { TEMPLE_NAME_TE, TEMPLE_SUB_NAME_TE, TEMPLE_ADDRESS_TE, TEMPLE_TAGLINE_TE } from '../constants.ts';
import { ViewState, Language } from '../types.ts';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage }) => {
  const isEn = language === 'en';

  const getLabel = (en: string, te: string) => {
    return isEn ? en : te;
  };

  return (
    <header className="bg-[#5a200d] text-white sticky top-0 z-50 shadow-2xl">
      {/* Top Branding Bar */}
      <div className="py-4 md:py-6 px-4">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center">
          
          <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
            {/* Logo 1 - Just before text */}
            <div className="shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center p-1 md:p-1.5 shadow-xl border-2 border-[#fbbf24] overflow-hidden">
                <img 
                  src="logo1.png" 
                  alt="Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-amber-600 font-black text-lg md:text-xl">ॐ</span>';
                    }
                  }}
                />
              </div>
            </div>

            {/* Central Branding Text Stack */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-[12px] sm:text-base md:text-xl lg:text-2xl font-black tracking-tight text-[#fbbf24] leading-tight font-telugu drop-shadow-md">
                {TEMPLE_NAME_TE} {TEMPLE_SUB_NAME_TE}
              </h1>
              <p className="text-white/80 font-medium text-[8px] md:text-[11px] leading-tight font-telugu mt-1 opacity-90">
                {TEMPLE_ADDRESS_TE}
              </p>
              
              {/* Tagline */}
              <div className="mt-1">
                <p className="text-[#fbbf24] font-black text-[11px] md:text-[18px] font-telugu tracking-[0.05em] drop-shadow-sm">
                  {TEMPLE_TAGLINE_TE}
                </p>
              </div>
            </div>

            {/* Logo 2 - Just after text */}
            <div className="shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center p-1 md:p-1.5 shadow-xl border-2 border-[#fbbf24] overflow-hidden">
                <img 
                  src="logo2.png" 
                  alt="Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-amber-600 font-black text-lg md:text-xl">🚩</span>';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar - Designed as pills */}
      <div className="bg-[#411609] border-t border-white/5 py-2 px-4 no-print">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center relative">
          
          <div className="flex items-center gap-1 md:gap-4">
            <nav className="flex items-center gap-1 md:gap-2 bg-black/30 p-1 rounded-full">
              {[
                { id: 'reminders', en: "TODAY", te: "నేటి" },
                { id: 'upcoming', en: "UPCOMING", te: "రాబోవు" },
                { id: 'directory', en: "DIRECTORY", te: "జాబితా" }
              ].map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as ViewState)}
                    className={`px-4 md:px-8 py-2 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all ${
                      isActive 
                        ? 'bg-[#fbbf24] text-[#5a200d] shadow-lg' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {getLabel(item.en, item.te)}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="absolute right-0 flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setView('add')}
              className={`px-4 md:px-6 py-2 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all bg-[#059669] text-white hover:bg-[#047857] shadow-lg active:scale-95`}
            >
              {getLabel('ENROLL', 'నమోదు')}
            </button>

            <div className="hidden sm:flex items-center bg-black/30 rounded-full p-1 border border-white/10">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-black transition-all ${language === 'en' ? 'bg-[#fbbf24] text-[#5a200d]' : 'text-white/40'}`}
              >EN</button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-black transition-all ${language === 'te' ? 'bg-[#fbbf24] text-[#5a200d]' : 'text-white/40'}`}
              >TE</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
