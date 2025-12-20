
import React, { useMemo } from 'react';
import { Devotee, Language } from '../types';
import { Phone, Cake, CheckCircle2 } from 'lucide-react';

interface DailyRemindersProps {
  devotees: Devotee[];
  language: Language;
  onViewAllUpcoming: () => void;
  onToggleCall: (devoteeId: string, type: 'Birthday' | 'Anniversary', date: string) => void;
}

const MangalsutraIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 8 Q12 16 20 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.8" />
    <circle cx="16" cy="11" r="0.8" />
    <circle cx="11" cy="14" r="1.5" />
    <circle cx="13" cy="14" r="1.5" />
    <rect x="11.8" y="12" width="0.4" height="2" rx="0.2" />
  </svg>
);

export const DailyReminders: React.FC<DailyRemindersProps> = ({ devotees, language, onViewAllUpcoming, onToggleCall }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const getLabel = (en: string, te: string) => {
    if (isEn) return en;
    if (isTe) return te;
    return `${en} / ${te}`;
  };

  const formatBilingual = (text: string) => {
    if (!text) return '';
    let parts: string[] = [];
    if (text.includes(' / ')) {
      parts = text.split(' / ');
    } else if (text.includes(' (')) {
      parts = [text.split(' (')[0], text.split(' (')[1].replace(')', '')];
    } else {
      return text;
    }
    const en = parts[0].trim();
    const te = parts[1].trim();
    if (isEn) return en;
    if (isTe) return te;
    return `${en} / ${te}`;
  };

  const specials = useMemo(() => {
    const list: { devotee: Devotee; type: 'Birthday' | 'Anniversary'; isFinished: boolean }[] = [];
    devotees.forEach(d => {
      const dob = new Date(d.dateOfBirth);
      if (dob.getMonth() + 1 === currentMonth && dob.getDate() === currentDay) {
        list.push({ devotee: d, type: 'Birthday', isFinished: d.callHistory.some(h => h.date === todayStr && h.type === 'Birthday') });
      }
      if (d.marriageDate) {
        const anniv = new Date(d.marriageDate);
        if (anniv.getMonth() + 1 === currentMonth && anniv.getDate() === currentDay) {
          list.push({ devotee: d, type: 'Anniversary', isFinished: d.callHistory.some(h => h.date === todayStr && h.type === 'Anniversary') });
        }
      }
    });
    return list;
  }, [devotees, currentMonth, currentDay, todayStr]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 border-t-4 border-orange-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-black text-orange-950 flex items-center">
            <span className="mr-2 text-xl">🔆</span> {getLabel("Today's Events", "నేటి శుభ విశేషాలు")}
          </h2>
          <span className="text-[10px] font-black text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
            {today.toLocaleDateString(isEn ? 'en-IN' : 'te-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {specials.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400 font-bold italic border border-dashed rounded-lg">
            {getLabel('No events for today.', 'నేడు ఎటువంటి విశేషాలు లేవు.')}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {specials.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${item.isFinished ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-orange-50/20 border-orange-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'Birthday' ? <Cake className="w-3.5 h-3.5 text-blue-600" /> : <MangalsutraIcon className="w-3.5 h-3.5 text-orange-600" />}
                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-900/60">{getLabel(item.type, item.type === 'Birthday' ? 'పుట్టినరోజు' : 'వివాహం')}</span>
                  </div>
                  {item.isFinished && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                </div>
                <h3 className="font-black text-sm text-orange-950 leading-tight mb-0.5">{formatBilingual(item.devotee.fullName)}</h3>
                <p className="text-[9px] text-orange-800 font-bold mb-3">{formatBilingual(item.devotee.gothram)}</p>
                <div className="flex items-center justify-between border-t border-orange-100/50 pt-2 mt-auto">
                  <span className="text-xs font-mono font-black text-gray-700">{item.devotee.phoneNumber}</span>
                  <div className="flex gap-2">
                    <a href={`tel:${item.devotee.phoneNumber}`} className="p-1.5 bg-green-600 text-white rounded-md shadow-sm active:scale-90 transition-transform"><Phone className="w-3 h-3" /></a>
                    <button onClick={() => onToggleCall(item.devotee.id, item.type, todayStr)} className={`px-2 py-1 text-[8px] font-black uppercase rounded-md transition-colors ${item.isFinished ? 'bg-white border text-orange-700' : 'bg-orange-800 text-white hover:bg-black'}`}>
                      {item.isFinished ? getLabel('Reset', 'రీసెట్') : getLabel('Done', 'పూర్తి')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-center py-2 space-y-0.5">
        <p className="text-[10px] font-black text-orange-900/40 uppercase tracking-[0.3em]">LOKA SAMASTA SUKHINO BHAVANTU</p>
        <p className="text-[11px] font-black text-orange-900/50">లోకా సమస్తా సుఖినో భవంతు</p>
      </div>
    </div>
  );
};
