
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { DailyReminders } from './components/DailyReminders.tsx';
import { UpcomingEvents } from './components/UpcomingEvents.tsx';
import { DevoteeForm } from './components/DevoteeForm.tsx';
import { DevoteeList } from './components/DevoteeList.tsx';
import { DevoteeDetails } from './components/DevoteeDetails.tsx';
import { TempleSettings as ITempleSettings } from './components/TempleSettings.tsx';
import { Devotee, ViewState, Language, CallRecord, TempleSettings } from './types.ts';
import { getDevotees, saveDevotee, deleteDevotee, updateDevotee, getTempleSettings, saveTempleSettings } from './services/storageService.ts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('reminders');
  const [language, setLanguage] = useState<Language>('en');
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [settings, setSettings] = useState<TempleSettings>(getTempleSettings());
  const [editingDevotee, setEditingDevotee] = useState<Devotee | null>(null);
  const [selectedDevoteeId, setSelectedDevoteeId] = useState<string | null>(null);

  useEffect(() => {
    setDevotees(getDevotees());
    setSettings(getTempleSettings());
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

  const handleSaveDevotee = useCallback((devotee: Devotee) => {
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

  const handleSaveSettings = (newSettings: TempleSettings) => {
    saveTempleSettings(newSettings);
    setSettings(newSettings);
  };

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
    const msg = language === 'en' 
      ? "Are you sure you want to edit this devotee record?" 
      : "మీరు ఈ భక్తుని రికార్డును సవరించాలనుకుంటున్నారా?";
    
    if (window.confirm(msg)) {
      setEditingDevotee(devotee);
      setView('add');
    }
  }, [language]);

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
    <div className="min-h-screen bg-[#fffaf5] flex flex-col selection:bg-red-600 selection:text-white">
      <div className="no-print">
        <Header 
          currentView={view} 
          setView={handleSetView} 
          language={language} 
          setLanguage={handleLanguageChange} 
          settings={settings}
        />
      </div>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
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
        
        {view === 'settings' && (
          <ITempleSettings 
            settings={settings} 
            onSave={handleSaveSettings} 
            language={language} 
          />
        )}
        
        <div className="no-print">
          {view === 'add' && (
            <DevoteeForm 
              onSave={handleSaveDevotee} 
              language={language} 
              editingDevotee={editingDevotee} 
              devotees={devotees}
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

      <footer className="no-print bg-[#450a0a] text-white border-t border-amber-400/20 px-4" style={{ height: '1.5cm' }}>
        <div className="max-w-[1600px] mx-auto h-full flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-1 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
            <span className="text-[10px] md:text-[11px] font-black text-amber-400 font-telugu uppercase tracking-tight leading-none">{settings.name}</span>
            <span className="hidden md:block w-[1px] h-3 bg-white/20"></span>
            <span className="text-[7px] md:text-[9px] font-medium font-telugu opacity-60 leading-none">{settings.address}</span>
          </div>
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest leading-none">Developed by</span>
            <a href="https://vantixio.com" target="_blank" rel="noopener noreferrer" className="text-[12px] md:text-[15px] font-black text-amber-400 hover:text-white transition-colors tracking-widest leading-none">VANTIXIO</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
