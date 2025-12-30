
import React from 'react';
import { ViewState, Language, TempleSettings } from '../types.ts';
import { Settings, Globe, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: TempleSettings;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage, settings }) => {
  const isEn = language === 'en';
  const getLabel = (en: string, te: string) => (isEn ? en : te);

  return (
    <header className="bg-[#450a0a] text-white sticky top-0 z-50 shadow-xl border-b border-amber-500/10">
      {/* Top Branding Bar */}
      <div className="py-3 md:py-4 px-4">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center">
          
          <div className="flex items-center justify-center gap-4 md:gap-10 w-full">
            {/* Logo 1 */}
            <div className="shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-white flex items-center justify-center p-1 shadow-md border-2 border-amber-400 overflow-hidden">
                {settings.logo1 ? (
                  <img src={settings.logo1} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-red-900 font-black text-lg md:text-xl">ॐ</span>
                )}
              </div>
            </div>

            {/* Central Branding Text Stack */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-[14px] sm:text-base md:text-xl lg:text-2xl font-black tracking-tight text-amber-400 leading-tight font-telugu drop-shadow-sm">
                {settings.name}
              </h1>
              <p className="text-white/80 font-medium text-[8px] md:text-[10px] leading-tight font-telugu mt-0.5">
                {settings.subName}
              </p>
              
              <div className="mt-1">
                <p className="text-amber-400 font-black text-[12px] md:text-[18px] font-telugu tracking-wider drop-shadow-sm uppercase">
                  {settings.tagline}
                </p>
              </div>
            </div>

            {/* Logo 2 */}
            <div className="shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-white flex items-center justify-center p-1 shadow-md border-2 border-amber-400 overflow-hidden">
                {settings.logo2 ? (
                  <img src={settings.logo2} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-red-900 font-black text-lg md:text-xl">🚩</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-[#1a0f00] py-1.5 px-4 no-print border-t border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          <nav className="flex items-center gap-1">
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
                  className={`px-3 md:px-6 py-1.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-amber-400 text-red-950 shadow-inner' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {getLabel(item.en, item.te)}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setView('add')}
              className={`px-3 md:px-6 py-1.5 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all bg-red-600 text-white hover:bg-red-700 shadow-md flex items-center gap-2`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{getLabel('REGISTER', 'నమోదు')}</span>
            </button>

            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[7px] md:text-[9px] font-black transition-all ${language === 'en' ? 'bg-amber-400 text-red-950' : 'text-white/30'}`}
              >EN</button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded text-[7px] md:text-[9px] font-black transition-all ${language === 'te' ? 'bg-amber-400 text-red-950' : 'text-white/30'}`}
              >TE</button>
            </div>

            <button
              onClick={() => setView('settings')}
              className={`p-2 rounded-lg transition-all ${currentView === 'settings' ? 'bg-amber-400 text-red-950 shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              title={getLabel('Settings', 'సెట్టింగ్స్')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
