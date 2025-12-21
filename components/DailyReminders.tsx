
import React, { useMemo } from 'react';
import { Devotee, Language, CallRecord } from '../types.ts';
import { CheckCircle2, Heart, Baby, Cake, Printer, FileText } from 'lucide-react';
import { TEMPLE_NAME_EN, getLocalISOString } from '../constants.ts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Custom Mangala Sutra Icon
const MangalaSutraIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 Q50 70 80 30" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
    <circle cx="35" cy="48" r="4" fill="#fbbf24" />
    <circle cx="65" cy="48" r="4" fill="#fbbf24" />
    <circle cx="44" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
    <circle cx="56" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
    <path d="M44 56 L44 60" stroke="#1a1a1a" strokeWidth="2" />
    <path d="M56 56 L56 60" stroke="#1a1a1a" strokeWidth="2" />
  </svg>
);

interface DailyRemindersProps {
  devotees: Devotee[];
  language: Language;
  onViewAllUpcoming: () => void;
  onToggleCall: (devoteeId: string, type: CallRecord['type'], date: string, relatedPerson?: string) => void;
  onViewDetails: (id: string) => void;
}

export const DailyReminders: React.FC<DailyRemindersProps> = ({ devotees, language, onToggleCall, onViewDetails }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';
  
  const today = new Date();
  const todayStr = getLocalISOString(today);
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

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

  const specials = useMemo(() => {
    const list: { 
      devotee: Devotee; 
      type: CallRecord['type']; 
      isFinished: boolean;
      personName?: string;
    }[] = [];

    devotees.forEach(d => {
      const check = (dateStr: string | undefined, type: CallRecord['type'], pName?: string) => {
        if (!dateStr) return;
        const parts = dateStr.split('-');
        const m = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        if (m === currentMonth && day === currentDay) {
          list.push({ 
            devotee: d, 
            type, 
            personName: pName,
            isFinished: d.callHistory.some(h => h.date === todayStr && h.type === type && (pName ? h.relatedPerson === pName : !h.relatedPerson)) 
          });
        }
      };

      check(d.dateOfBirth, 'Birthday');
      check(d.marriageDate, 'Anniversary');
      check(d.wifeDOB, 'SpouseBirthday', d.wifeName);
      (d.children || []).forEach(c => check(c.dob, 'ChildBirthday', c.name));
    });

    return list;
  }, [devotees, currentMonth, currentDay, todayStr]);

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
      case 'Birthday': return <Cake className="w-5 h-5 text-blue-600" />;
      case 'SpouseBirthday': return <Heart className="w-5 h-5 text-pink-600" />;
      case 'ChildBirthday': return <Baby className="w-5 h-5 text-blue-400" />;
      case 'Anniversary': return <MangalaSutraIcon className="w-6 h-6" />;
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

  const handlePrint = () => window.print();

  const exportPDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(16);
      doc.setTextColor(90, 32, 13);
      doc.text(TEMPLE_NAME_EN, 14, 20);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Daily Blessings Report - ${today.toLocaleDateString()}`, 14, 26);

      const tableData = specials.map((item, idx) => [
        idx + 1,
        getCelebrantName(item, true),
        toEnglishOnly(item.devotee.gothram),
        item.type, 
        item.devotee.phoneNumber
      ]);

      autoTable(doc, {
        startY: 32,
        head: [['#', 'Celebrant Name(s)', 'Gothram', 'Occasion', 'Phone']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [90, 32, 13] },
        styles: { fontSize: 8 }
      });

      doc.save(`Today_Blessings_${todayStr}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF Error. Try Print instead.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div id="printable-blessings" className="hidden print:block font-serif w-full p-8 bg-white">
        <div className="text-center border-b-2 border-orange-900 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-orange-950 uppercase mb-4">{TEMPLE_NAME_EN}</h1>
          <div className="flex justify-between items-end mt-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-orange-900">Daily Blessings Report</h2>
            <span className="text-sm font-bold">{today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-xs uppercase">Sl</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs uppercase">Celebrant Name(s)</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs uppercase">Gothram</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs uppercase">Occasion</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs uppercase">Phone</th>
            </tr>
          </thead>
          <tbody>
            {specials.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-2 text-sm">{idx + 1}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm font-bold">{getCelebrantName(item, true)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{toEnglishOnly(item.devotee.gothram)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{item.type}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm font-mono">{item.devotee.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-5 md:p-10 border-t-8 border-[#7c2d12] no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl md:text-3xl font-black text-orange-950 flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🔆</span> {getLabel("Today's Blessings", "నేటి శుభ ఆశీర్వచనాలు")}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} disabled={specials.length === 0} className="flex items-center gap-2 px-3 py-2 bg-white border border-orange-200 text-orange-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-orange-900 transition-all disabled:opacity-30">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={exportPDF} disabled={specials.length === 0} className="flex items-center gap-2 px-3 py-2 bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-800 transition-all disabled:opacity-30">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <span className="text-xs md:text-sm font-black text-orange-900 bg-orange-100 px-5 py-2 rounded-xl border border-orange-200 uppercase tracking-widest">
              {today.toLocaleDateString(isEn ? 'en-IN' : 'te-IN', { day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {specials.length === 0 ? (
          <div className="text-center py-20 text-base text-gray-300 font-black italic border-2 border-dashed border-orange-50 rounded-3xl bg-orange-50/10 uppercase">
            No occasions today.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {specials.map((item, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all shadow-lg ${item.isFinished ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-orange-50/30 border-orange-100 hover:border-orange-300'}`}>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-2">
                    {getEventIcon(item.type)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-900/60">{getEventLabel(item.type, item.personName)}</span>
                  </div>
                  {item.isFinished && <CheckCircle2 className="w-8 h-8 text-green-600" />}
                </div>
                <button onClick={() => onViewDetails(item.devotee.id)} className="text-left block mb-2 group">
                  <h3 className="font-black text-2xl text-orange-950 group-hover:text-orange-600 transition-colors leading-tight">
                    {getCelebrantName(item)}
                  </h3>
                </button>
                <p className="text-[10px] text-orange-800/70 font-black uppercase tracking-widest mb-6">
                  {formatBilingual(item.devotee.gothram)}
                  {item.type !== 'Birthday' && item.type !== 'Anniversary' && (
                    <span className="ml-2 lowercase italic text-gray-400 font-bold">(via {formatBilingual(item.devotee.fullName)})</span>
                  )}
                </p>
                <div className="flex items-center justify-between border-t border-orange-100/30 pt-6 mt-auto">
                  <span className="text-lg font-mono font-black text-orange-950">{item.devotee.phoneNumber}</span>
                  <div className="flex gap-2">
                    <button onClick={() => onToggleCall(item.devotee.id, item.type, todayStr, item.personName)} className={`px-6 py-2 text-[10px] font-black uppercase rounded-2xl shadow-md transition-all ${item.isFinished ? 'bg-white border-2 border-orange-700 text-orange-700' : 'bg-orange-800 text-white hover:bg-black'}`}>
                      {item.isFinished ? 'Reset' : 'Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-blessings { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};
