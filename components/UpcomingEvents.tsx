
import React, { useMemo, useState } from 'react';
import { Devotee, Language, CallRecord } from '../types.ts';
import { CheckCircle2, Printer, FileText, Calendar, Cake, Heart, Baby, Search } from 'lucide-react';
import { CustomDatePicker } from './CustomDatePicker.tsx';
import { TEMPLE_NAME_EN, getLocalISOString } from '../constants.ts';
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
  
  const [searchMode, setSearchMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const getLabel = (en: string, te: string) => isEn ? en : te;

  const formatBilingual = (text?: string) => {
    if (!text) return '';
    if (text.includes(' / ')) {
      const p = text.split(' / ');
      return isEn ? p[0] : isTe ? p[1] : text;
    }
    return text;
  };

  const toEnglishOnly = (text?: string) => {
    if (!text) return '';
    let result = text;
    if (result.includes(' / ')) {
      result = result.split(' / ')[0];
    }
    if (result.includes(' (')) {
      result = result.split(' (')[0];
    }
    return result.trim();
  };

  const getEventLabel = (type: CallRecord['type'], personName?: string) => {
    switch (type) {
      case 'Birthday': return getLabel('Birthday', 'పుట్టినరోజు');
      case 'SpouseBirthday': return getLabel('Spouse Birthday', 'పత్ని పుట్టినరోజు');
      case 'ChildBirthday': return getLabel('Child Birthday', 'పిల్లల పుట్టినరోజు');
      case 'Anniversary': return getLabel('Wedding Anniversary', 'వివాహ వార్షికోత్సవం');
      default: return '';
    }
  };

  const getEventIcon = (type: CallRecord['type']) => {
    switch (type) {
      case 'Birthday': return <Cake className="w-3 h-3 text-blue-600" />;
      case 'SpouseBirthday': return <Heart className="w-3 h-3 text-pink-600" />;
      case 'ChildBirthday': return <Baby className="w-3 h-3 text-blue-400" />;
      case 'Anniversary': return <MangalaSutraIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCelebrantName = (item: { devotee: Devotee; type: CallRecord['type']; personName?: string }, forceEnglish = false) => {
    const formatter = forceEnglish ? toEnglishOnly : formatBilingual;
    if (item.type === 'Anniversary') {
      const p1 = formatter(item.devotee.fullName);
      const p2 = formatter(item.devotee.wifeName || 'Spouse');
      return `${p1} & ${p2}`;
    }
    if (item.type === 'Birthday') {
      return formatter(item.devotee.fullName);
    }
    return formatter(item.personName || item.devotee.fullName);
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
        const check = (dateStr: string | undefined, type: CallRecord['type'], pName?: string) => {
          if (!dateStr) return;
          const d_parts = dateStr.split('-');
          const d_month = parseInt(d_parts[1]);
          const d_day = parseInt(d_parts[2]);

          if (d_day === s_day && d_month === s_month) {
            const isFinished = dev.callHistory.some(h => h.date === singleDate && h.type === type && (pName ? h.relatedPerson === pName : !h.relatedPerson));
            results.push({ 
              devotee: dev, 
              type, 
              personName: pName, 
              isFinished, 
              eventDate: new Date(s_year, s_month - 1, s_day), 
              eventDateStr: singleDate 
            });
          }
        };
        check(dev.dateOfBirth, 'Birthday');
        check(dev.marriageDate, 'Anniversary');
        check(dev.wifeDOB, 'SpouseBirthday', dev.wifeName);
        (dev.children || []).forEach(c => check(c.dob, 'ChildBirthday', c.name));
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
        const check = (dateStr: string | undefined, type: CallRecord['type'], pName?: string) => {
          const occurrences = isDateInRange(dateStr);
          if (occurrences) {
            occurrences.forEach(occ => {
              const isFinished = dev.callHistory.some(h => h.date === occ.str && h.type === type && (pName ? h.relatedPerson === pName : !h.relatedPerson));
              results.push({ devotee: dev, type, personName: pName, isFinished, eventDate: occ.date, eventDateStr: occ.str });
            });
          }
        };
        check(dev.dateOfBirth, 'Birthday');
        check(dev.marriageDate, 'Anniversary');
        check(dev.wifeDOB, 'SpouseBirthday', dev.wifeName);
        (dev.children || []).forEach(c => check(c.dob, 'ChildBirthday', c.name));
      });
    }

    return results.sort((a,b) => a.eventDate.getTime() - b.eventDate.getTime());
  }, [devotees, searchMode, singleDate, startDate, endDate]);

  const categorizedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const categories: Record<string, any[]> = { today: [], tomorrow: [], next7: [], next30: [] };

    devotees.forEach(dev => {
      const check = (dateStr: string | undefined, type: CallRecord['type'], pName?: string) => {
        if (!dateStr) return;
        const d_parts = dateStr.split('-');
        const d_month = parseInt(d_parts[1]);
        const d_day = parseInt(d_parts[2]);
        
        let nextOccur = new Date(today.getFullYear(), d_month - 1, d_day);
        if (nextOccur < today) nextOccur.setFullYear(today.getFullYear() + 1);

        const diff = Math.ceil((nextOccur.getTime() - today.getTime()) / (1000 * 3600 * 24));
        const occurStr = getLocalISOString(nextOccur);
        const isFinished = dev.callHistory.some(h => h.date === occurStr && h.type === type && (pName ? h.relatedPerson === pName : !h.relatedPerson));
        const item = { devotee: dev, type, personName: pName, isFinished, eventDate: nextOccur, eventDateStr: occurStr, diff };

        if (diff === 0) categories.today.push(item);
        else if (diff === 1) categories.tomorrow.push(item);
        else if (diff > 1 && diff <= 7) categories.next7.push(item);
        else if (diff > 7 && diff <= 30) categories.next30.push(item);
      };

      check(dev.dateOfBirth, 'Birthday');
      check(dev.marriageDate, 'Anniversary');
      check(dev.wifeDOB, 'SpouseBirthday', dev.wifeName);
      (dev.children || []).forEach(c => check(c.dob, 'ChildBirthday', c.name));
    });

    Object.keys(categories).forEach(k => categories[k].sort((a,b) => a.eventDate.getTime() - b.eventDate.getTime()));
    return categories;
  }, [devotees]);

  const handlePrint = () => window.print();

  const exportSearchPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFontSize(16);
      doc.text(TEMPLE_NAME_EN, 14, 20);
      doc.setFontSize(9);
      const title = searchMode === 'single' ? `Occasions on ${singleDate}` : `Occasions from ${startDate} to ${endDate}`;
      doc.text(title, 14, 26);

      const tableData = searchResults.map((item, idx) => [
        idx + 1,
        item.eventDateStr,
        getCelebrantName(item, true),
        toEnglishOnly(item.devotee.gothram),
        item.type,
        item.devotee.phoneNumber
      ]);

      autoTable(doc, {
        startY: 32,
        head: [['#', 'Date', 'Celebrant Name(s)', 'Gothram', 'Occasion', 'Phone']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [90, 32, 13] },
        styles: { fontSize: 8 }
      });

      doc.save(`Search_Results.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF.");
    }
  };

  const EventCard: React.FC<{ item: any; showDate?: boolean }> = ({ item, showDate = true }) => (
    <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between shadow-md transition-all ${item.isFinished ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-orange-100 hover:border-orange-400'}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-0.5 bg-orange-50 text-orange-900 rounded-full border border-orange-100 uppercase tracking-widest text-[9px] font-black">
              {getEventIcon(item.type)}
              {getEventLabel(item.type, item.personName)}
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
          <h4 className="font-black text-base text-orange-950 leading-tight">{getCelebrantName(item)}</h4>
        </button>
        <p className="text-[10px] text-orange-800/70 font-bold mb-4 uppercase tracking-tighter italic">
          {formatBilingual(item.devotee.gothram)}
          {item.type !== 'Birthday' && item.type !== 'Anniversary' && (
            <span className="ml-1 opacity-60 lowercase font-telugu">(via {formatBilingual(item.devotee.fullName)})</span>
          )}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-orange-50 pt-4 mt-auto">
        <span className="text-sm font-mono font-black">{item.devotee.phoneNumber}</span>
        <button onClick={() => onToggleCall(item.devotee.id, item.type, item.eventDateStr, item.personName)} className={`px-5 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all shadow-sm ${item.isFinished ? 'bg-white border border-orange-700 text-orange-700' : 'bg-orange-800 text-white hover:bg-black'}`}>
          {item.isFinished ? 'Reset' : 'Done'}
        </button>
      </div>
    </div>
  );

  const Section = ({ title, events }: { title: string, events: any[] }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-1 bg-orange-800 rounded-full"></div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-950">{title} ({events.length})</h3>
      </div>
      {events.length === 0 ? <p className="text-[10px] font-bold text-gray-300 uppercase italic">No events scheduled.</p> : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((ev, i) => <EventCard key={i} item={ev} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      <div id="printable-report" className="hidden print:block font-sans p-10 bg-white">
        <div className="text-center border-b-4 border-[#7c2d12] pb-6 mb-8">
          <h1 className="text-3xl font-bold text-[#7c2d12]">{TEMPLE_NAME_EN}</h1>
          <div className="flex justify-between items-end mt-8">
             <div className="text-left">
                <h2 className="text-xl font-bold uppercase underline">Auspicious Occasions Report</h2>
                <p className="text-xs font-bold mt-1 text-gray-500">Period: {searchMode === 'single' ? `Date: ${singleDate}` : `From: ${startDate} To: ${endDate}`}</p>
             </div>
             <p className="text-xs font-bold">Generated: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-orange-950 text-[11px]">
          <thead>
            <tr className="bg-orange-50">
              <th className="border border-orange-900 p-3 text-left">Date</th>
              <th className="border border-orange-900 p-3 text-left">Celebrant(s)</th>
              <th className="border border-orange-900 p-3 text-left">Occasion</th>
              <th className="border border-orange-900 p-3 text-left">Gothram</th>
              <th className="border border-orange-900 p-3 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-50/20'}>
                <td className="border border-orange-900 p-3 font-bold">{item.eventDateStr}</td>
                <td className="border border-orange-900 p-3">
                   <div className="font-bold">{getCelebrantName(item, true)}</div>
                </td>
                <td className="border border-orange-900 p-3">{item.type}</td>
                <td className="border border-orange-900 p-3">{toEnglishOnly(item.devotee.gothram)}</td>
                <td className="border border-orange-900 p-3 font-mono">{item.devotee.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between italic text-[10px] text-gray-400">
           <span>Total Celebrants: {searchResults.length}</span>
           <span>Lord Narasimha Blessings Be With You</span>
        </div>
      </div>

      <div className="bg-orange-950/5 p-6 rounded-3xl border-2 border-orange-950/10 no-print">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-orange-950 uppercase tracking-widest flex items-center gap-3">
                <Search className="w-5 h-5 text-orange-800" />
                {getLabel("Auspicious Occasion Search", "శుభ కార్యముల అన్వేషణ")}
              </h2>
              <div className="flex bg-white/50 p-1 rounded-xl border border-orange-100 shadow-sm">
                <button 
                  onClick={() => setSearchMode('single')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'single' ? 'bg-orange-800 text-white shadow-md' : 'text-orange-900/40 hover:text-orange-900'}`}
                >
                  Single Day
                </button>
                <button 
                  onClick={() => setSearchMode('range')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'range' ? 'bg-orange-800 text-white shadow-md' : 'text-orange-900/40 hover:text-orange-900'}`}
                >
                  Date Range
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchMode === 'single' ? (
                <div className="sm:col-span-1">
                  <CustomDatePicker label="Select Day" value={singleDate} language={language} onChange={setSingleDate} />
                </div>
              ) : (
                <>
                  <CustomDatePicker label="From Date" value={startDate} language={language} onChange={setStartDate} />
                  <CustomDatePicker label="To Date" value={endDate} language={language} onChange={setEndDate} />
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handlePrint} disabled={searchResults.length === 0} className="px-5 py-3 bg-white border-2 border-orange-900 text-orange-900 font-black rounded-xl text-[10px] uppercase flex items-center gap-2 hover:bg-orange-900 hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-30">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={exportSearchPDF} disabled={searchResults.length === 0} className="px-5 py-3 bg-red-700 text-white font-black rounded-xl text-[10px] uppercase flex items-center gap-2 hover:bg-red-800 transition-all shadow-md active:scale-95 disabled:opacity-30">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => {setSingleDate(''); setStartDate(''); setEndDate('');}} className="px-4 py-3 bg-gray-200 text-gray-600 font-black rounded-xl text-[10px] uppercase hover:bg-gray-300 transition-all">Clear</button>
          </div>
        </div>

        {((searchMode === 'single' && singleDate) || (searchMode === 'range' && startDate && endDate)) && (
          <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-orange-100"></div>
              <h3 className="text-[10px] font-black text-orange-900 uppercase tracking-[0.3em] whitespace-nowrap">
                {searchResults.length} Results Found
              </h3>
              <div className="h-[1px] flex-1 bg-orange-100"></div>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-white/40 rounded-3xl border-2 border-dashed border-orange-100 italic text-gray-400 font-bold uppercase tracking-widest">
                No occasions found for this selection
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((ev, i) => <EventCard key={i} item={ev} showDate={searchMode === 'range'} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-12 no-print">
        <Section title="Today" events={categorizedEvents.today} />
        <Section title="Tomorrow" events={categorizedEvents.tomorrow} />
        <Section title="Next 7 Days" events={categorizedEvents.next7} />
        <Section title="Next 30 Days" events={categorizedEvents.next30} />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-report { display: block !important; position: absolute; left: 0; top: 0; width: 100%; z-index: 1000; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};
