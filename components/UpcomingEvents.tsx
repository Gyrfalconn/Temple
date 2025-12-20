
import React, { useMemo } from 'react';
import { Devotee, Language } from '../types';
import { Phone, Cake, Heart, Calendar } from 'lucide-react';

interface UpcomingEventsProps {
  devotees: Devotee[];
  language: Language;
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

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ devotees, language }) => {
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

  const categorizeEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const categories = {
      today: [] as any[],
      tomorrow: [] as any[],
      thisWeek: [] as any[],
      thisMonth: [] as any[]
    };

    devotees.forEach(d => {
      const checkAndPush = (origDateStr: string, type: 'Birthday' | 'Anniversary') => {
        const origDate = new Date(origDateStr);
        let eventDate = new Date(today.getFullYear(), origDate.getMonth(), origDate.getDate());
        
        // If event date has passed this year, it's next year
        if (eventDate < today) {
          eventDate.setFullYear(today.getFullYear() + 1);
        }

        const timeDiff = eventDate.getTime() - today.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        const item = { devotee: d, type, eventDate, daysDiff };
        if (daysDiff === 0) categories.today.push(item);
        else if (daysDiff === 1) categories.tomorrow.push(item);
        else if (daysDiff > 1 && daysDiff <= 7) categories.thisWeek.push(item);
        else if (daysDiff > 7 && daysDiff <= 30) categories.thisMonth.push(item);
      };

      checkAndPush(d.dateOfBirth, 'Birthday');
      if (d.marriageDate) checkAndPush(d.marriageDate, 'Anniversary');
    });

    const sortByDate = (a: any, b: any) => a.eventDate.getTime() - b.eventDate.getTime();
    categories.today.sort(sortByDate);
    categories.tomorrow.sort(sortByDate);
    categories.thisWeek.sort(sortByDate);
    categories.thisMonth.sort(sortByDate);

    return categories;
  }, [devotees]);

  const EventCard: React.FC<{ item: any }> = ({ item }) => (
    <div className="p-3.5 rounded-xl border-2 bg-white shadow-sm transition-all border-orange-100 hover:border-orange-400 group">
      <div className="flex justify-between items-start mb-2.5">
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${
          item.type === 'Birthday' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-orange-50 text-orange-900 border border-orange-200'
        }`}>
          {item.type === 'Birthday' ? <Cake className="w-2.5 h-2.5" /> : <MangalsutraIcon className="w-2.5 h-2.5" />}
          {item.type === 'Birthday' ? getLabel('Birthday', 'పుట్టినరోజు') : getLabel('Anniversary', 'వివాహం')}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-orange-950 font-black">
            {item.eventDate.toLocaleDateString(isEn ? 'en-IN' : 'te-IN', { day: '2-digit', month: 'short' })}
          </span>
          {item.daysDiff > 1 && <span className="text-[7px] font-black text-orange-400 uppercase tracking-tighter italic">In {item.daysDiff} days</span>}
        </div>
      </div>
      
      <h4 className="font-black text-orange-950 text-sm leading-tight mb-0.5 group-hover:text-orange-700 transition-colors">{formatBilingual(item.devotee.fullName)}</h4>
      <p className="text-[10px] text-orange-800/70 font-bold mb-3 italic">{formatBilingual(item.devotee.gothram)}</p>
      
      <div className="flex items-center justify-between border-t border-orange-50 pt-2.5">
        <span className="text-[11px] font-mono font-black text-gray-800">{item.devotee.phoneNumber}</span>
        <a href={`tel:${item.devotee.phoneNumber}`} className="p-2 bg-green-600 text-white rounded-lg hover:bg-black transition-all shadow-md active:scale-90">
          <Phone className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );

  const Section = ({ title, events }: { title: string, events: any[] }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-[11px] font-black text-orange-950 flex items-center bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest shadow-sm">
          {title}
        </h3>
        <span className="h-[2px] flex-1 bg-orange-100 rounded-full"></span>
        <span className="text-[11px] font-black text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">{events.length}</span>
      </div>
      {events.length === 0 ? (
        <p className="text-[10px] text-orange-900/40 font-black italic px-4 py-3 bg-white/40 border-2 border-dashed border-orange-100 rounded-xl">No upcoming events found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((ev, i) => <EventCard key={i} item={ev} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      <Section title={getLabel('Today', 'నేడు')} events={categorizeEvents.today} />
      <Section title={getLabel('Tomorrow', 'రేపు')} events={categorizeEvents.tomorrow} />
      <Section title={getLabel('Next 7 Days', 'ఈ వారం')} events={categorizeEvents.thisWeek} />
      <Section title={getLabel('Next 30 Days', 'వచ్చే 30 రోజులు')} events={categorizeEvents.thisMonth} />
      
      <div className="text-center pt-6 opacity-20 select-none">
         <p className="text-[10px] font-black text-orange-950 uppercase tracking-[0.6em]">లోకా సమస్తా సుఖినో భవంతు</p>
      </div>
    </div>
  );
};
