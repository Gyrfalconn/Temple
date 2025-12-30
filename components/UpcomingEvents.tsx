
import React, { useMemo, useState } from 'react';
import { Devotee, Language, CallRecord } from '../types.ts';
import { CheckCircle2, Calendar, Cake, Search, FileText, FileSpreadsheet } from 'lucide-react';
import { ManualDateInput } from './ManualDateInput.tsx';
import { getLocalISOString } from '../constants.ts';
import { formatForMode } from '../services/transliterationService.ts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Custom Mangala Sutra Icon
const MangalaSutraIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 Q50 70 80 30" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />
    <circle cx="35" cy="48" r="4" fill="#fbbf24" />
    <circle cx="65" cy="48" r="4" fill="#fbbf24" />
    <circle cx="44" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
    <circle cx="56" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
  </svg>
);

interface UpcomingEventsProps {
  devotees: Devotee[];
  language: Language;
  onToggleCall: (devoteeId: string, type: CallRecord['type'], date: string, relatedPerson?: string) => void;
  onViewDetails: (id: string) => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ devotees, language, onToggleCall, onViewDetails }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';
  const fText = (text: string) => formatForMode(text, language);
  
  const [searchMode, setSearchMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const getLabel = (en: string, te: string) => isEn ? en : te;

  const getEventLabel = (type: CallRecord['type']) => {
    switch (type) {
      case 'Birthday': return getLabel('Birthday', 'పుట్టినరోజు');
      case 'Anniversary': return getLabel('Wedding Anniversary', 'వివాహ వార్షికోత్సవం');
      default: return '';
    }
  };

  const getEventIcon = (type: CallRecord['type']) => {
    switch (type) {
      case 'Birthday': return <Cake className="w-3 h-3 text-blue-600" />;
      case 'Anniversary': return <MangalaSutraIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCelebrantName = (item: { devotee: Devotee; type: CallRecord['type']; personName?: string }) => {
    if (item.type === 'Anniversary') {
      const p1 = fText(item.devotee.fullName);
      const p2 = item.devotee.wifeName ? fText(item.devotee.wifeName) : (isEn ? 'Spouse' : 'భార్య');
      return `${p1} & ${p2}`;
    }
    return fText(item.devotee.fullName);
  };

  const searchResults = useMemo(() => {
    const results: any[] = [];
    if (searchMode === 'single') {
      if (!singleDate) return [];
      const parts = singleDate.split('-');
      const s_year = parseInt(parts[0]);
      const s_month = parseInt(parts[1]);
      const s_day = parseInt(parts[2]);

      devotees.forEach(dev => {
        const check = (dateStr: string | undefined, type: 'Birthday' | 'Anniversary') => {
          if (!dateStr) return;
          const d_parts = dateStr.split('-');
          if (parseInt(d_parts[1]) === s_month && parseInt(d_parts[2]) === s_day) {
            const isFinished = dev.callHistory.some(h => h.date === singleDate && h.type === type);
            results.push({ 
              devotee: dev, type, isFinished, eventDate: new Date(s_year, s_month - 1, s_day), eventDateStr: singleDate 
            });
          }
        };
        check(dev.dateOfBirth, 'Birthday');
        check(dev.marriageDate, 'Anniversary');
      });
    } else {
      if (!startDate || !endDate) return [];
      const startStr = startDate;
      const endStr = endDate;

      const isDateInRange = (dateStr: string | undefined) => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        const monthDayStr = parts[1] + '-' + parts[2];
        const startYear = parseInt(startDate.split('-')[0]);
        const endYear = parseInt(endDate.split('-')[0]);
        const matches = [];

        for (let year = startYear; year <= endYear; year++) {
          const occurStr = `${year}-${monthDayStr}`;
          if (occurStr >= startStr && occurStr <= endStr) {
            matches.push({
              str: occurStr,
              date: new Date(year, parseInt(parts[1]) - 1, parseInt(parts[2]))
            });
          }
        }
        return matches.length > 0 ? matches : null;
      };

      devotees.forEach(dev => {
        const check = (dateStr: string | undefined, type: 'Birthday' | 'Anniversary') => {
          const occurrences = isDateInRange(dateStr);
          if (occurrences) {
            occurrences.forEach(occ => {
              const isFinished = dev.callHistory.some(h => h.date === occ.str && h.type === type);
              results.push({ devotee: dev, type, isFinished, eventDate: occ.date, eventDateStr: occ.str });
            });
          }
        };
        check(dev.dateOfBirth, 'Birthday');
        check(dev.marriageDate, 'Anniversary');
      });
    }

    return results.sort((a,b) => a.eventDate.getTime() - b.eventDate.getTime());
  }, [devotees, searchMode, singleDate, startDate, endDate]);

  const handleExportExcel = () => {
    const data = searchResults.map(item => ({
      [getLabel('Date', 'తేదీ')]: item.eventDateStr,
      [getLabel('Occasion', 'శుభకార్యం')]: getEventLabel(item.type),
      [getLabel('Names', 'పేర్లు')]: getCelebrantName(item),
      [getLabel('Gothram', 'గోత్రం')]: fText(item.devotee.gothram),
      [getLabel('Phone', 'ఫోన్')]: item.devotee.phoneNumber
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Upcoming_Events");
    XLSX.writeFile(wb, `Upcoming_Events_${getLocalISOString()}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(getLabel("Upcoming Events Report", "రాబోవు శుభకార్యాల నివేదిక"), 14, 15);
    const rows = searchResults.map(item => [
      item.eventDateStr,
      getEventLabel(item.type),
      getCelebrantName(item),
      fText(item.devotee.gothram),
      item.devotee.phoneNumber
    ]);
    autoTable(doc, {
      startY: 20,
      head: [[getLabel('Date', 'తేదీ'), getLabel('Occasion', 'శుభకార్యం'), getLabel('Names', 'పేర్లు'), getLabel('Gothram', 'గోత్రం'), getLabel('Phone', 'ఫోన్')]],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [124, 45, 18] },
      styles: { fontSize: 8 }
    });
    doc.save(`Upcoming_Events_${getLocalISOString()}.pdf`);
  };

  const categorizedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const categories: Record<string, any[]> = { today: [], tomorrow: [], next7: [], next30: [] };

    devotees.forEach(dev => {
      const check = (dateStr: string | undefined, type: 'Birthday' | 'Anniversary') => {
        if (!dateStr) return;
        const d_parts = dateStr.split('-');
        const d_month = parseInt(d_parts[1]);
        const d_day = parseInt(d_parts[2]);
        
        let nextOccur = new Date(today.getFullYear(), d_month - 1, d_day);
        if (nextOccur < today) nextOccur.setFullYear(today.getFullYear() + 1);

        const diff = Math.ceil((nextOccur.getTime() - today.getTime()) / (1000 * 3600 * 24));
        const occurStr = getLocalISOString(nextOccur);
        const isFinished = dev.callHistory.some(h => h.date === occurStr && h.type === type);
        const item = { devotee: dev, type, isFinished, eventDate: nextOccur, eventDateStr: occurStr, diff };

        if (diff === 0) categories.today.push(item);
        else if (diff === 1) categories.tomorrow.push(item);
        else if (diff > 1 && diff <= 7) categories.next7.push(item);
        else if (diff > 7 && diff <= 30) categories.next30.push(item);
      };

      check(dev.dateOfBirth, 'Birthday');
      check(dev.marriageDate, 'Anniversary');
    });

    Object.keys(categories).forEach(k => categories[k].sort((a,b) => a.eventDate.getTime() - b.eventDate.getTime()));
    return categories;
  }, [devotees]);

  const EventCard: React.FC<{ item: any; showDate?: boolean }> = ({ item, showDate = true }) => (
    <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between shadow-md transition-all ${item.isFinished ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-orange-100 hover:border-orange-400'}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className={`flex items-center gap-2 px-3 py-0.5 bg-orange-50 text-orange-900 rounded-full border border-orange-100 uppercase tracking-widest text-[9px] font-black ${isTe ? 'font-telugu' : ''}`}>
              {getEventIcon(item.type)}
              {getEventLabel(item.type)}
            </div>
            {showDate && (
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3 h-3 text-orange-600" />
                <span className="text-[10px] font-black text-orange-700">{item.eventDateStr}</span>
              </div>
            )}
          </div>
          {item.isFinished && <CheckCircle2 className="w-5 h-5 text-green-600" />}
        </div>
        <button onClick={() => onViewDetails(item.devotee.id)} className="text-left w-full block mb-1">
          <h4 className={`font-black text-base text-orange-950 leading-tight font-telugu`}>{getCelebrantName(item)}</h4>
        </button>
        <p className={`text-[10px] text-orange-800/70 font-bold mb-4 uppercase tracking-tighter italic font-telugu`}>
          {fText(item.devotee.gothram)}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-orange-50 pt-4 mt-auto">
        <span className="text-sm font-mono font-black">{item.devotee.phoneNumber}</span>
        <button onClick={() => onToggleCall(item.devotee.id, item.type, item.eventDateStr)} className={`px-5 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all shadow-sm font-telugu ${item.isFinished ? 'bg-white border border-orange-700 text-orange-700' : 'bg-orange-800 text-white hover:bg-black'}`}>
          {item.isFinished ? getLabel('Reset', 'రీసెట్') : getLabel('Done', 'ముగిసింది')}
        </button>
      </div>
    </div>
  );

  const Section = ({ title, events, teTitle }: { title: string, events: any[], teTitle: string }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-1 bg-orange-800 rounded-full"></div>
        <h3 className={`text-xs font-black uppercase tracking-[0.2em] text-orange-950 font-telugu`}>
          {getLabel(title, teTitle)} ({events.length})
        </h3>
      </div>
      {events.length === 0 ? <p className="text-[10px] font-bold text-gray-300 uppercase italic font-telugu">No events scheduled.</p> : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((ev, i) => <EventCard key={i} item={ev} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      <div className="bg-orange-950/5 p-6 rounded-3xl border-2 border-orange-950/10 no-print">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-black text-orange-950 uppercase tracking-widest flex items-center gap-3 font-telugu`}>
                <Search className="w-5 h-5 text-orange-800" />
                {getLabel("Occasion Search", "శుభ కార్యముల అన్వేషణ")}
              </h2>
              <div className="flex bg-white/50 p-1 rounded-xl border border-orange-100 shadow-sm">
                <button onClick={() => setSearchMode('single')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'single' ? 'bg-orange-800 text-white shadow-md' : 'text-orange-900/40 hover:text-orange-900'}`}>Single Day</button>
                <button onClick={() => setSearchMode('range')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'range' ? 'bg-orange-800 text-white shadow-md' : 'text-orange-900/40 hover:text-orange-900'}`}>Date Range</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchMode === 'single' ? (
                <div className="sm:col-span-1">
                  <ManualDateInput 
                    label={getLabel('Select Day', 'తేదీని ఎంచుకోండి')} 
                    value={singleDate} 
                    language={language} 
                    onChange={setSingleDate} 
                    allowFuture={true} // Allow searching for future events
                  />
                </div>
              ) : (
                <>
                  <ManualDateInput 
                    label={getLabel('From Date', 'ప్రారంభ తేదీ')} 
                    value={startDate} 
                    language={language} 
                    onChange={setStartDate} 
                    allowFuture={true} // Allow future dates for range search
                  />
                  <ManualDateInput 
                    label={getLabel('To Date', 'ముగింపు తేదీ')} 
                    value={endDate} 
                    language={language} 
                    onChange={setEndDate} 
                    allowFuture={true} // Allow future dates for range search
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => {setSingleDate(''); setStartDate(''); setEndDate('');}} className="px-6 py-3 bg-gray-200 text-gray-600 font-black rounded-xl text-[10px] uppercase hover:bg-gray-300 transition-all font-telugu">{getLabel('Clear', 'రీసెట్')}</button>
          </div>
        </div>

        {((searchMode === 'single' && singleDate) || (searchMode === 'range' && startDate && endDate)) && (
          <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-[1px] flex-1 bg-orange-100"></div>
                <h3 className="text-[10px] font-black text-orange-900 uppercase tracking-[0.3em] whitespace-nowrap font-telugu">
                  {searchResults.length} {getLabel('Results Found', 'ఫలితాలు దొరికాయి')}
                </h3>
                <div className="h-[1px] flex-1 bg-orange-100"></div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all">
                  <FileText className="w-3 h-3" /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all">
                  <FileSpreadsheet className="w-3 h-3" /> EXCEL
                </button>
              </div>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-white/40 rounded-3xl border-2 border-dashed border-orange-100 italic text-gray-400 font-bold uppercase tracking-widest font-telugu">{getLabel('No occasions found', 'ఎటువంటి శుభకార్యాలు లేవు')}</div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">{searchResults.map((ev, i) => <EventCard key={`search-${i}`} item={ev} showDate={searchMode === 'range'} />)}</div>
            )}
          </div>
        )}
      </div>

      <Section title="Today" teTitle="ఈరోజు" events={categorizedEvents.today} />
      <Section title="Tomorrow" teTitle="రేపు" events={categorizedEvents.tomorrow} />
      <Section title="Next 7 Days" teTitle="వచ్చే 7 రోజులు" events={categorizedEvents.next7} />
      <Section title="Next 30 Days" teTitle="వచ్చే 30 రోజులు" events={categorizedEvents.next30} />
    </div>
  );
};
