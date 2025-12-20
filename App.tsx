
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DailyReminders } from './components/DailyReminders';
import { UpcomingEvents } from './components/UpcomingEvents';
import { DevoteeForm } from './components/DevoteeForm';
import { DevoteeList } from './components/DevoteeList';
import { DevoteeDetails } from './components/DevoteeDetails';
import { Devotee, ViewState, Language } from './types';
import { getDevotees, saveDevotee, deleteDevotee, updateDevotee } from './services/storageService';
import { TEMPLE_NAME_EN, TEMPLE_NAME_TE } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('reminders');
  const [language, setLanguage] = useState<Language>('both');
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [editingDevotee, setEditingDevotee] = useState<Devotee | null>(null);
  const [selectedDevoteeId, setSelectedDevoteeId] = useState<string | null>(null);

  const isEn = language === 'en';

  useEffect(() => {
    setDevotees(getDevotees());
    const savedLang = localStorage.getItem('temple_app_lang');
    if (savedLang === 'en' || savedLang === 'te' || savedLang === 'both') {
      setLanguage(savedLang as Language);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('temple_app_lang', lang);
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
    if(confirm(isEn ? "Delete record?" : "రికార్డును తొలగించాలా?")) {
      deleteDevotee(id);
      setDevotees(prev => prev.filter(d => d.id !== id));
      if (selectedDevoteeId === id) setView('directory');
    }
  }, [isEn, selectedDevoteeId]);

  const handleEdit = useCallback((devotee: Devotee) => {
    setEditingDevotee(devotee);
    setView('add');
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    setSelectedDevoteeId(id);
    setView('details');
  }, []);

  const handleToggleCall = useCallback((devoteeId: string, type: 'Birthday' | 'Anniversary', date: string) => {
    setDevotees(prev => {
      const updated = prev.map(d => {
        if (d.id === devoteeId) {
          const isCalled = d.callHistory.some(h => h.date === date && h.type === type);
          const newHistory = isCalled 
            ? d.callHistory.filter(h => !(h.date === date && h.type === type))
            : [...d.callHistory, { date, type, timestamp: new Date().toISOString() }];
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
    <div className="min-h-screen bg-amber-50/50 flex flex-col selection:bg-orange-500 selection:text-white">
      <Header currentView={view} setView={setView} language={language} setLanguage={handleLanguageChange} />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 md:py-6">
        {view === 'reminders' && (
          <DailyReminders 
            devotees={devotees} 
            language={language} 
            onViewAllUpcoming={() => setView('upcoming')} 
            onToggleCall={handleToggleCall}
          />
        )}

        {view === 'upcoming' && (
          <UpcomingEvents 
            devotees={devotees} 
            language={language} 
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
        
        {view === 'add' && (
          <DevoteeForm 
            onSave={handleSave} 
            language={language} 
            editingDevotee={editingDevotee} 
            onCancel={editingDevotee ? () => { setEditingDevotee(null); setView('directory'); } : undefined}
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
      </main>

      <footer className="py-8 bg-orange-950 text-white border-t-2 border-amber-600/50 text-center space-y-2">
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-200">
          {language === 'en' ? TEMPLE_NAME_EN : TEMPLE_NAME_TE}
        </p>
        <p className="text-xs md:text-sm text-amber-400 font-black italic">
          లోకా సమస్తా సుఖినో భవంతు
        </p>
        <div className="pt-4 pb-2">
          <a 
            href="https://vantixio.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-col items-center gap-1"
          >
            <span className="text-[8px] font-black text-amber-100/20 uppercase tracking-[0.5em] group-hover:text-amber-100/40 transition-colors">
              Powered by
            </span>
            <span className="text-[10px] font-black text-amber-100/40 uppercase tracking-widest group-hover:text-amber-400 transition-all">
              Vantixio
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
