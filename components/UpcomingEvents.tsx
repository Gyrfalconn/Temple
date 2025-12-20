
import React, { useMemo } from 'react';
import { Devotee, Language } from '../types';
import { Phone, Cake, Clock, MapPin } from 'lucide-react';

interface UpcomingEventsProps {
  devotees: Devotee[];
  language: Language;
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
      const dob = new Date(d.dateOfBirth);
      const anniv = d.marriageDate ? new Date(d.marriageDate) : null;

      const checkAndPush = (date: Date, type: 'Birthday' | 'Anniversary') => {
        const eventDateThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
        const timeDiff = eventDateThisYear.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const item = { devotee: d, type, eventDate: eventDateThisYear };
        if (daysDiff === 0) categories.today.push(item);
        else if (daysDiff === 1) categories.tomorrow.push(item);
        else if (daysDiff > 1 && daysDiff <= 7) categories.thisWeek.push(item);
        else if (daysDiff > 7 && daysDiff <= 30) categories.thisMonth.push(item);
      };

      checkAndPush(dob, 'Birthday');
      if (anniv) checkAndPush(anniv, 'Anniversary');
    });

    return categories;
  }, [devotees]);

  const EventCard: React.FC<{ item: any }> = ({ item }) => (
    <div className="p-3 rounded-lg border bg-white shadow-sm transition-all border-orange-50 hover:border-orange-200">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
          item.type === 'Birthday' ? 'bg-blue-50 text-blue-800' : 'bg-orange-50 text-orange-800'
        }`}>
          {item.type === 'Birthday' ? getLabel('Birthday', 'పుట్టినరోజు') : getLabel('Marriage', 'వివాహం')}
        </span>
        <span className="text-[8px] text-orange-950 font-black">
          {item.eventDate.toLocaleDateString(isEn ? 'en-IN' : 'te-IN', { day: '2-digit', month: 'short' })}
        </span>
      </div>
      
      <h4 className="font-black text-orange-950 text-xs leading-tight mb-1">{formatBilingual(item.devotee.fullName)}</h4>
      <p className="text-[8px] text-orange-800/60 font-bold mb-3">{formatBilingual(item.devotee.gothram)}</p>
      
      <div className="flex items-center justify-between border-t border-orange-50 pt-2">
        <span className="text-[10px] font-mono font-black">{item.devotee.phoneNumber}</span>
        <a href={`tel:${item.devotee.phoneNumber}`} className="p-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-600 hover:text-white transition-all">
          <Phone className="w-3 h-3" />
        </a>
      </div>
    </div>
  );

  const Section = ({ title, events }: { title: string, events: any[] }) => (
    <div className="space-y-3">
      <h3 className="text-xs font-black text-orange-950 flex items-center bg-white w-fit px-3 py-1 rounded-full border border-orange-100 shadow-sm italic">
        {title} <span className="ml-2 text-[9px] text-orange-600">({events.length})</span>
      </h3>
      {events.length === 0 ? (
        <p className="text-[9px] text-gray-400 italic px-4 py-2">None.</p>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {events.map((ev, i) => <EventCard key={i} item={ev} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2">
      <Section title={getLabel('Today', 'నేడు')} events={categorizeEvents.today} />
      <Section title={getLabel('Tomorrow', 'రేపు')} events={categorizeEvents.tomorrow} />
      <Section title={getLabel('This Week', 'ఈ వారం')} events={categorizeEvents.thisWeek} />
      <Section title={getLabel('Next 30 Days', 'వచ్చే 30 రోజులు')} events={categorizeEvents.thisMonth} />
    </div>
  );
};
