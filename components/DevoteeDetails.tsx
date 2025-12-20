
import React from 'react';
import { Devotee, Language } from '../types';
import { ArrowLeft, Phone, Cake, Heart, MapPin, Edit3, Trash2, History, StickyNote } from 'lucide-react';

interface DevoteeDetailsProps {
  devotee: Devotee;
  language: Language;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MangalsutraIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 8 Q12 16 20 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="1" />
    <circle cx="16" cy="11" r="1" />
    <circle cx="11" cy="14" r="2" />
    <circle cx="13" cy="14" r="2" />
    <rect x="11.5" y="12" width="1" height="3" rx="0.5" />
  </svg>
);

export const DevoteeDetails: React.FC<DevoteeDetailsProps> = ({ devotee, language, onBack, onEdit, onDelete }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';

  const getLabel = (en: string, te: string) => {
    if (isEn) return en;
    if (isTe) return te;
    return `${en} / ${te}`;
  };

  const formatBilingual = (text: string) => {
    if (!text) return '';
    if (text.includes(' / ')) {
      const p = text.split(' / ');
      return isEn ? p[0] : isTe ? p[1] : text;
    }
    return text;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-amber-200">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-3 py-1.5 text-orange-900 font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {getLabel('Back', 'వెనుకకు')}
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onEdit} 
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-950 font-black text-[10px] uppercase tracking-widest hover:bg-orange-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" /> {getLabel('Edit', 'సవరించు')}
          </button>
          <button 
            onClick={onDelete} 
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> {getLabel('Delete', 'తొలగించు')}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-200">
        <div className="bg-orange-950 h-24 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl text-orange-950 font-black text-2xl">
              {devotee.fullName.charAt(0)}
            </div>
          </div>
        </div>
        <div className="pt-12 pb-6 px-8">
          <h2 className="text-2xl font-black text-orange-950">{formatBilingual(devotee.fullName)}</h2>
          <p className="text-sm text-orange-800 font-bold opacity-70">{formatBilingual(devotee.gothram)}</p>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Detailed Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 space-y-6">
            <h3 className="text-xs font-black text-orange-950 uppercase tracking-[0.2em] border-b pb-2 mb-4">
              {getLabel('Devotee Information', 'భక్తుని వివరాలు')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><Phone className="w-5 h-5 text-green-700" /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">{getLabel('Phone Number', 'ఫోన్ నంబర్')}</p>
                  <p className="font-mono font-black text-orange-950 text-base">{devotee.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Cake className="w-5 h-5 text-blue-700" /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">{getLabel('Date of Birth', 'పుట్టిన తేదీ')}</p>
                  <p className="font-black text-orange-950">{devotee.dateOfBirth}</p>
                </div>
              </div>

              {devotee.marriageDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-50 rounded-lg"><MangalsutraIcon className="w-5 h-5 text-pink-700" /></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">{getLabel('Marriage Anniversary', 'వివాహ వార్షికోత్సవం')}</p>
                    <p className="font-black text-orange-950">{devotee.marriageDate}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded-lg"><MapPin className="w-5 h-5 text-amber-700" /></div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">{getLabel('Residential Address', 'చిరునామా')}</p>
                  <p className="font-bold text-orange-950 leading-tight">{devotee.address || '-'}</p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-4 h-4 text-orange-800" />
                <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest">{getLabel('Priest Notes', 'అర్చకుల సూచనలు')}</h4>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-sm text-orange-950 min-h-[80px] italic">
                {devotee.notes || getLabel('No notes provided.', 'సూచనలు ఏవీ లేవు.')}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: History */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <History className="w-4 h-4 text-orange-800" />
              <h3 className="text-[10px] font-black text-orange-950 uppercase tracking-widest">
                {getLabel('Blessing History', 'ఆశీర్వచన చరిత్ర')}
              </h3>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {devotee.callHistory.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic text-center py-4">No past blessings recorded.</p>
              ) : (
                devotee.callHistory.sort((a,b) => b.timestamp.localeCompare(a.timestamp)).map((log, i) => (
                  <div key={i} className="flex gap-3 items-center p-2 rounded-lg bg-orange-50/30 border border-orange-50">
                    <div className={`p-1.5 rounded-full ${log.type === 'Birthday' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {log.type === 'Birthday' ? <Cake className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-orange-950">{log.type} Blessing</p>
                      <p className="text-[8px] font-bold text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-orange-900 rounded-2xl p-5 text-center shadow-lg border-b-4 border-amber-500">
            <p className="text-[10px] text-amber-200 font-black italic">
              "Blessing His devotees is the truest service to the Lord."
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black text-orange-900/30 uppercase tracking-[0.5em] pt-8">
        లోకా సమస్తా సుఖినో భవంతు
      </p>
    </div>
  );
};
