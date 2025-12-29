
import React, { useMemo } from 'react';
import { Devotee, Language, CallRecord } from '../types.ts';
import { CheckCircle2, Cake, Heart, FileText, FileSpreadsheet } from 'lucide-react';
import { getLocalISOString } from '../constants.ts';
import { formatForMode } from '../services/transliterationService.ts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DailyRemindersProps {
  devotees: Devotee[];
  language: Language;
  onViewAllUpcoming: () => void;
  onToggleCall: (devoteeId: string, type: CallRecord['type'], date: string, relatedPerson?: string) => void;
  onViewDetails: (id: string) => void;
}

export const DailyReminders: React.FC<DailyRemindersProps> = ({ devotees, language, onToggleCall, onViewDetails }) => {
  const isTe = language === 'te';
  const getLabel = (en: string, te: string) => (!isTe ? en : te);
  const fText = (text: string) => formatForMode(text, language);
  
  const today = new Date();
  const todayStr = getLocalISOString(today);
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const { birthdayList, anniversaryList } = useMemo(() => {
    const birthdays: { devotee: Devotee; type: CallRecord['type']; isFinished: boolean; }[] = [];
    const anniversaries: { devotee: Devotee; type: CallRecord['type']; isFinished: boolean; }[] = [];

    devotees.forEach(d => {
      if (d.dateOfBirth) {
        const parts = d.dateOfBirth.split('-');
        if (parseInt(parts[1]) === currentMonth && parseInt(parts[2]) === currentDay) {
          birthdays.push({ 
            devotee: d, type: 'Birthday', 
            isFinished: d.callHistory.some(h => h.date === todayStr && h.type === 'Birthday' && !h.relatedPerson) 
          });
        }
      }

      if (d.marriageDate) {
        const parts = d.marriageDate.split('-');
        if (parseInt(parts[1]) === currentMonth && parseInt(parts[2]) === currentDay) {
          anniversaries.push({ 
            devotee: d, type: 'Anniversary', 
            isFinished: d.callHistory.some(h => h.date === todayStr && h.type === 'Anniversary') 
          });
        }
      }
    });

    return { birthdayList: birthdays, anniversaryList: anniversaries };
  }, [devotees, currentMonth, currentDay, todayStr]);

  const handleExportExcel = () => {
    const data = [
      ...birthdayList.map(item => ({
        [getLabel('Occasion', 'శుభకార్యం')]: getLabel('Birthday', 'పుట్టినరోజు'),
        [getLabel('Names', 'పేర్లు')]: fText(item.devotee.fullName),
        [getLabel('Gothram', 'గోత్రం')]: fText(item.devotee.gothram),
        [getLabel('Phone', 'ఫోన్')]: item.devotee.phoneNumber
      })),
      ...anniversaryList.map(item => ({
        [getLabel('Occasion', 'శుభకార్యం')]: getLabel('Anniversary', 'వివాహ వార్షికోత్సవం'),
        [getLabel('Names', 'పేర్లు')]: `${fText(item.devotee.fullName)} & ${fText(item.devotee.wifeName || (isTe ? 'భార్య' : 'Spouse'))}`,
        [getLabel('Gothram', 'గోత్రం')]: fText(item.devotee.gothram),
        [getLabel('Phone', 'ఫోన్')]: item.devotee.phoneNumber
      }))
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Today_Blessings");
    XLSX.writeFile(wb, `Today_Blessings_${todayStr}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(getLabel("Today's Blessings Report", "నేటి శుభ ఆశీర్వచనాల నివేదిక"), 14, 15);
    
    const rows = [
      ...birthdayList.map(item => [
        getLabel('Birthday', 'పుట్టినరోజు'),
        fText(item.devotee.fullName),
        fText(item.devotee.gothram),
        item.devotee.phoneNumber
      ]),
      ...anniversaryList.map(item => [
        getLabel('Anniversary', 'వార్షికోత్సవం'),
        `${fText(item.devotee.fullName)} & ${fText(item.devotee.wifeName || 'Spouse')}`,
        fText(item.devotee.gothram),
        item.devotee.phoneNumber
      ])
    ];

    autoTable(doc, {
      startY: 20,
      head: [[getLabel('Occasion', 'శుభకార్యం'), getLabel('Names', 'పేర్లు'), getLabel('Gothram', 'గోత్రం'), getLabel('Phone', 'ఫోన్')]],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [124, 45, 18] },
      styles: { fontSize: 9 }
    });

    doc.save(`Today_Blessings_${todayStr}.pdf`);
  };

  const EventCard: React.FC<{ item: any }> = ({ item }) => {
    const isAnniversary = item.type === 'Anniversary';
    const displayName = isAnniversary 
      ? `${fText(item.devotee.fullName)} & ${fText(item.devotee.wifeName || (isTe ? 'భార్య' : 'Spouse'))}`
      : fText(item.devotee.fullName);

    return (
      <div className={`p-5 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md ${item.isFinished ? 'opacity-50 grayscale' : ''}`}>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-[#1a0f00] font-telugu leading-tight">
            {displayName}
          </h3>
          {item.isFinished && <CheckCircle2 className="w-5 h-5 text-green-600" />}
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-telugu mb-4">
          {fText(item.devotee.gothram)}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-mono font-bold text-gray-700">{item.devotee.phoneNumber}</span>
          <button 
            onClick={() => onToggleCall(item.devotee.id, item.type, todayStr)} 
            className={`px-6 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
              item.isFinished 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-[#7c2d12] text-white hover:bg-black shadow-sm'
            }`}
          >
            {item.isFinished ? getLabel('RESET', 'రీసెట్') : getLabel('DONE', 'ముగిసింది')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-10 border-t-8 border-[#7c2d12]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 border-b border-gray-50 pb-6">
          <h2 className={`text-xl md:text-3xl font-black text-[#5a200d] flex items-center gap-3 ${isTe ? 'font-telugu' : ''}`}>
            🔆 {getLabel("Today's Blessings", "నేటి శుభ ఆశీర్వచనాలు")}
          </h2>
          <div className="flex gap-2 no-print">
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-5 py-2.5 bg-[#b91c1c] text-white rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all">
              <FileSpreadsheet className="w-4 h-4" /> EXCEL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-orange-50">
              <Cake className="w-5 h-5 text-[#7c2d12]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#5a200d] font-telugu">
                {getLabel('BIRTHDAYS', 'పుట్టినరోజులు')} ({birthdayList.length})
              </h3>
            </div>
            {birthdayList.length === 0 ? (
              <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic font-telugu">
                {getLabel('No birthdays today', 'ఈరోజు పుట్టినరోజులు ఏవీ లేవు')}
              </div>
            ) : (
              <div className="grid gap-4">
                {birthdayList.map((item, idx) => <EventCard key={`bday-${idx}`} item={item} />)}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-orange-50">
              <Heart className="w-5 h-5 text-[#7c2d12]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#5a200d] font-telugu">
                {getLabel('WEDDING ANNIVERSARIES', 'వివాహ వార్షికోత్సవాలు')} ({anniversaryList.length})
              </h3>
            </div>
            {anniversaryList.length === 0 ? (
              <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic font-telugu">
                {getLabel('No anniversaries today', 'ఈరోజు వివాహ వార్షికోత్సవాలు ఏవీ లేవు')}
              </div>
            ) : (
              <div className="grid gap-4">
                {anniversaryList.map((item, idx) => <EventCard key={`anniv-${idx}`} item={item} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
