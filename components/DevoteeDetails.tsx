
import React from 'react';
import { Devotee, Language } from '../types.ts';
import { ArrowLeft, Phone, Cake, MapPin, Edit3, Trash2, FileText, FileSpreadsheet } from 'lucide-react';
import { formatForMode } from '../services/transliterationService.ts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DevoteeDetailsProps {
  devotee: Devotee;
  language: Language;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const DevoteeDetails: React.FC<DevoteeDetailsProps> = ({ devotee, language, onBack, onEdit, onDelete }) => {
  const isTe = language === 'te';
  const getLabel = (en: string, te: string) => (!isTe ? en : te);
  const fText = (text: string) => formatForMode(text, language);

  const handleExportExcel = () => {
    const data = [
      { [getLabel('Field', 'విభాగం')]: getLabel('Full Name', 'పూర్తి పేరు'), [getLabel('Value', 'వివరాలు')]: fText(devotee.fullName) },
      { [getLabel('Field', 'విభాగం')]: getLabel('Phone Number', 'ఫోన్ నంబర్'), [getLabel('Value', 'వివరాలు')]: devotee.phoneNumber },
      { [getLabel('Field', 'విభాగం')]: getLabel('Gothram', 'గోత్రం'), [getLabel('Value', 'వివరాలు')]: fText(devotee.gothram) },
      { [getLabel('Field', 'విభాగం')]: getLabel('Date of Birth', 'పుట్టిన తేదీ'), [getLabel('Value', 'వివరాలు')]: devotee.dateOfBirth },
      { [getLabel('Field', 'విభాగం')]: getLabel('Spouse Name', 'భార్య పేరు'), [getLabel('Value', 'వివరాలు')]: fText(devotee.wifeName || '-') },
      { [getLabel('Field', 'విభాగం')]: getLabel('Spouse DOB', 'భార్య పుట్టిన తేదీ'), [getLabel('Value', 'వివరాలు')]: devotee.wifeDOB || '-' },
      { [getLabel('Field', 'విభాగం')]: getLabel('Marriage Date', 'వివాహ తేదీ'), [getLabel('Value', 'వివరాలు')]: devotee.marriageDate || '-' },
      { [getLabel('Field', 'విభాగం')]: getLabel('Address', 'చిరునామా'), [getLabel('Value', 'వివరాలు')]: fText(devotee.address || '-') },
      { [getLabel('Field', 'విభాగం')]: getLabel('Family Members', 'కుటుంబ సభ్యులు'), [getLabel('Value', 'వివరాలు')]: (devotee.children || []).map(c => `${fText(c.name)} (${c.dob})`).join(', ') }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profile");
    XLSX.writeFile(wb, `${fText(devotee.fullName).replace(/\s/g, '_')}_Profile.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(getLabel("Devotee Individual Profile", "భక్తుని వ్యక్తిగత వివరాలు"), 14, 15);
    const body = [
      [getLabel('Full Name', 'పూర్తి పేరు'), fText(devotee.fullName)],
      [getLabel('Phone Number', 'ఫోన్ నంబర్'), devotee.phoneNumber],
      [getLabel('Gothram', 'గోత్రం'), fText(devotee.gothram)],
      [getLabel('Date of Birth', 'పుట్టిన తేదీ'), devotee.dateOfBirth],
      [getLabel('Spouse Name', 'భార్య పేరు'), fText(devotee.wifeName || '-')],
      [getLabel('Spouse DOB', 'భార్య పుట్టిన తేదీ'), devotee.wifeDOB || '-'],
      [getLabel('Marriage Date', 'వివాహ తేదీ'), devotee.marriageDate || '-'],
      [getLabel('Address', 'చిరునామా'), fText(devotee.address || '-')],
      [getLabel('Family Members', 'కుటుంబ సభ్యులు'), (devotee.children || []).map(c => `${fText(c.name)} (${c.dob})`).join('\n') || '-']
    ];
    autoTable(doc, {
      startY: 25,
      head: [[getLabel('Field', 'విభాగం'), getLabel('Information', 'సమాచారం')]],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [124, 45, 18] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });
    doc.save(`${fText(devotee.fullName).replace(/\s/g, '_')}_Profile.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl shadow-lg border border-amber-200">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-2.5 text-orange-900 font-black text-xs uppercase font-telugu">
          <ArrowLeft className="w-5 h-5" /> {getLabel('Back', 'వెనుకకు')}
        </button>
        <div className="flex flex-wrap items-center justify-center gap-2 no-print">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 bg-red-700 text-white font-black text-[10px] uppercase rounded-xl hover:bg-black transition-all">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white font-black text-[10px] uppercase rounded-xl hover:bg-black transition-all">
            <FileSpreadsheet className="w-4 h-4" /> EXCEL
          </button>
          <div className="w-px h-8 bg-gray-100 mx-1 hidden md:block"></div>
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-950 font-black text-[10px] uppercase rounded-xl hover:bg-orange-200 transition-all font-telugu">
            <Edit3 className="w-4 h-4" /> {getLabel('Edit', 'సవరించు')}
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 font-black text-[10px] uppercase rounded-xl hover:bg-red-200 transition-all font-telugu">
            <Trash2 className="w-4 h-4" /> {getLabel('Delete', 'తొలగించు')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-amber-200">
        <div className="bg-gradient-to-r from-orange-950 to-orange-900 h-40" />
        <div className="px-10 pb-10 -mt-10">
          <div className="w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl text-3xl font-black mb-6">{fText(devotee.fullName)[0]}</div>
          <h2 className="text-4xl font-black text-orange-950 font-telugu">{fText(devotee.fullName)}</h2>
          <p className="text-xl text-orange-800 font-bold opacity-70 font-telugu">{fText(devotee.gothram)}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 border-t border-orange-50 font-telugu">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl"><Cake className="w-6 h-6 text-orange-700" /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">DOB</p><p className="text-xl font-bold">{devotee.dateOfBirth}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl"><Phone className="w-6 h-6 text-green-700" /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Phone</p><p className="text-xl font-mono">{devotee.phoneNumber}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl"><MapPin className="w-6 h-6 text-amber-700" /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Area</p><p className="text-xl font-bold">{fText(devotee.address || '-')}</p></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-pink-50/50 rounded-3xl border border-pink-100">
              <p className="text-[10px] font-black text-pink-900 uppercase mb-4">Spouse & Marriage</p>
              <p className="text-lg font-bold">{fText(devotee.wifeName || '-')}</p>
              <p className="text-sm text-pink-800/60 mt-1">{devotee.marriageDate || '-'}</p>
            </div>
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <p className="text-[10px] font-black text-blue-900 uppercase mb-4">{getLabel('Family Members', 'కుటుంబ సభ్యులు')} ({devotee.children?.length || 0})</p>
              <ul className="space-y-2">
                {devotee.children?.map((c, i) => <li key={i} className="text-sm font-bold">• {fText(c.name)} ({c.dob})</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
