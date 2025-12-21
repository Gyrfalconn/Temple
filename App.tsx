
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { DailyReminders } from './components/DailyReminders.tsx';
import { UpcomingEvents } from './components/UpcomingEvents.tsx';
import { DevoteeForm } from './components/DevoteeForm.tsx';
import { DevoteeList } from './components/DevoteeList.tsx';
import { DevoteeDetails } from './components/DevoteeDetails.tsx';
import { Devotee, ViewState, Language, CallRecord } from './types.ts';
import { getDevotees, saveDevotee, deleteDevotee, updateDevotee } from './services/storageService.ts';
import { TEMPLE_NAME_EN, TEMPLE_NAME_TE, TEMPLE_SLOGAN_TE } from './constants.ts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('reminders');
  const [language, setLanguage] = useState<Language>('en');
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [editingDevotee, setEditingDevotee] = useState<Devotee | null>(null);
  const [selectedDevoteeId, setSelectedDevoteeId] = useState<string | null>(null);

  const isEn = language === 'en';

  useEffect(() => {
    setDevotees(getDevotees());
    const savedLang = localStorage.getItem('temple_app_lang');
    if (savedLang === 'en' || savedLang === 'te') {
      setLanguage(savedLang as Language);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('temple_app_lang', lang);
  };

  const handleSetView = (newView: ViewState) => {
    if (newView === 'add') {
      setEditingDevotee(null);
    }
    if (newView !== 'details') {
      setSelectedDevoteeId(null);
    }
    setView(newView);
  };

  const handleSave = useCallback((devotee: Devotee) => {
    if (editingDevotee) {
      updateDevotee(devotee);
      setDevotees(prev => prev.map(d => d.id === devotee.id ? devotee : d));
      setEditingDevotee(null);
    } else {
      saveDevotee(devotee);
      setDevotees(prev => [...prev, devotee]);
    }
    setView('directory');
  }, [editingDevotee]);

  const handleDelete = useCallback((id: string) => {
    const msg = language === 'en' ? "Are you sure you want to delete this devotee record?" : "ఈ భక్తుని రికార్డును తొలగించాలనుకుంటున్నారా?";
    if(window.confirm(msg)) {
      deleteDevotee(id);
      setDevotees(prev => prev.filter(d => d.id !== id));
      if (selectedDevoteeId === id) {
        setSelectedDevoteeId(null);
        setView('directory');
      }
    }
  }, [language, selectedDevoteeId]);

  const handleEdit = useCallback((devotee: Devotee) => {
    setEditingDevotee(devotee);
    setView('add');
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    setSelectedDevoteeId(id);
    setView('details');
  }, []);

  const handleToggleCall = useCallback((devoteeId: string, type: CallRecord['type'], date: string, relatedPerson?: string) => {
    setDevotees(prev => {
      const updated = prev.map(d => {
        if (d.id === devoteeId) {
          const isCalled = d.callHistory.some(h => 
            h.date === date && 
            h.type === type && 
            (relatedPerson ? h.relatedPerson === relatedPerson : !h.relatedPerson)
          );
          
          const newHistory = isCalled 
            ? d.callHistory.filter(h => !(h.date === date && h.type === type && (relatedPerson ? h.relatedPerson === relatedPerson : !h.relatedPerson)))
            : [...d.callHistory, { date, type, timestamp: new Date().toISOString(), relatedPerson }];
            
          const updatedDevotee = { ...d, callHistory: newHistory };
          updateDevotee(updatedDevotee);
          return updatedDevotee;
        }
        return d;
      });
      return updated;
    });
  }, []);

  const currentDevotee = devotees.find(d => d.id === selectedDevoteeId);

  return (
    <div className="min-h-screen bg-amber-50/20 flex flex-col selection:bg-orange-500 selection:text-white">
      <div className="no-print">
        <Header currentView={view} setView={handleSetView} language={language} setLanguage={handleLanguageChange} />
      </div>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 md:py-6">
        <div className={view !== 'reminders' && view !== 'upcoming' && view !== 'directory' ? "" : ""}>
          {view === 'reminders' && (
            <DailyReminders 
              devotees={devotees} 
              language={language} 
              onViewAllUpcoming={() => setView('upcoming')} 
              onToggleCall={handleToggleCall}
              onViewDetails={handleViewDetails}
            />
          )}

          {view === 'upcoming' && (
            <UpcomingEvents 
              devotees={devotees} 
              language={language} 
              onToggleCall={handleToggleCall}
              onViewDetails={handleViewDetails}
            />
          )}
          
          {view === 'directory' && (
            <DevoteeList 
              devotees={devotees} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
              onViewDetails={handleViewDetails}
              language={language} 
            />
          )}
        </div>
        
        <div className="no-print">
          {view === 'add' && (
            <DevoteeForm 
              onSave={handleSave} 
              language={language} 
              editingDevotee={editingDevotee} 
              onCancel={() => { setEditingDevotee(null); setView('directory'); }}
            />
          )}

          {view === 'details' && currentDevotee && (
            <DevoteeDetails 
              devotee={currentDevotee} 
              language={language} 
              onBack={() => setView('directory')}
              onEdit={() => handleEdit(currentDevotee)}
              onDelete={() => handleDelete(currentDevotee.id)}
            />
          )}
        </div>
      </main>

      <footer className="no-print py-6 bg-[#7c2d12] text-white border-t border-amber-400/20 text-center space-y-2 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.1)]">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#fbbf24] leading-none">
          {isEn ? TEMPLE_NAME_EN : TEMPLE_NAME_TE}
        </p>
        <p className="text-[10px] md:text-[11px] text-amber-50/80 font-medium italic max-w-2xl mx-auto leading-tight">
          {TEMPLE_SLOGAN_TE}
        </p>
        <div className="pt-3 border-t border-white/10 inline-block mx-auto px-6">
          <a 
            href="https://vantixio.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity group"
          >
            <span className="text-[8px] font-bold text-amber-100 uppercase tracking-[0.2em]">
              Powered by
            </span>
            <span className="text-[10px] font-black text-[#fbbf24] uppercase tracking-widest group-hover:text-white transition-colors">
              Vantixio
            </span>
          </a>
        </div>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
