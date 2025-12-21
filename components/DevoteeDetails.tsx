
import React from 'react';
import { Devotee, Language } from '../types.ts';
import { ArrowLeft, Phone, Cake, MapPin, Edit3, Trash2, Heart, Users, Baby, Printer, FileText } from 'lucide-react';
import { TEMPLE_SLOGAN_TE, TEMPLE_NAME_EN } from '../constants.ts';
import { jsPDF } from 'jspdf';

// Custom Mangala Sutra Icon
const MangalaSutraIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 Q50 70 80 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="35" cy="48" r="4" fill="#fbbf24" />
    <circle cx="65" cy="48" r="4" fill="#fbbf24" />
    <circle cx="44" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
    <circle cx="56" cy="65" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
  </svg>
);

interface DevoteeDetailsProps {
  devotee: Devotee;
  language: Language;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const DevoteeDetails: React.FC<DevoteeDetailsProps> = ({ devotee, language, onBack, onEdit, onDelete }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';

  const getLabel = (en: string, te: string) => {
    return isEn ? en : te;
  };

  const spouseLabel = getLabel('Wife', 'ధర్మపత్ని');

  const formatBilingual = (text?: string) => {
    if (!text) return '-';
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

  const children = devotee.children || [];

  const handlePrint = () => {
    window.print();
  };

  const exportProfilePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(22);
    doc.setTextColor(90, 32, 13);
    doc.text(TEMPLE_NAME_EN, 20, 30);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Devotee Profile Card", 20, 45);
    doc.line(20, 47, 190, 47);

    doc.setFontSize(12);
    let y = 60;
    const addField = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value || "-", 65, y);
      y += 10;
    };

    addField("Full Name", toEnglishOnly(devotee.fullName));
    addField("Gothram", toEnglishOnly(devotee.gothram));
    addField("Phone", devotee.phoneNumber);
    addField("DOB", devotee.dateOfBirth);
    addField("Marriage Date", devotee.marriageDate || "-");
    addField("Spouse Name", toEnglishOnly(devotee.wifeName || "-"));
    addField("Spouse DOB", devotee.wifeDOB || "-");
    
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Children:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    if (children.length === 0) {
      doc.text("None", 25, y);
      y += 10;
    } else {
      children.forEach(c => {
        doc.text(`- ${toEnglishOnly(c.name)} (DOB: ${c.dob})`, 25, y);
        y += 8;
      });
    }

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Address:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(devotee.address || "-", 25, y);

    doc.save(`Profile_${toEnglishOnly(devotee.fullName).replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Individual Print Card (English Only) */}
      <div id="printable-profile" className="hidden print:block font-sans p-12 bg-white border-[10px] border-orange-900 rounded-[50px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-orange-950">{TEMPLE_NAME_EN}</h1>
          <p className="text-sm font-bold uppercase tracking-widest mt-2 text-orange-800">Devotee Identity & Blessing Card</p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 text-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Full Name</p>
            <p className="text-xl font-black text-orange-950">{toEnglishOnly(devotee.fullName)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Gothram</p>
            <p className="text-xl font-black text-orange-950">{toEnglishOnly(devotee.gothram)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
            <p className="text-xl font-mono font-bold text-orange-950">{devotee.phoneNumber}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">DOB</p>
            <p className="text-xl font-bold text-orange-950">{devotee.dateOfBirth}</p>
          </div>
          <div className="col-span-2 border-t border-orange-50 pt-6">
             <h4 className="text-[10px] uppercase font-black text-orange-900 mb-4 tracking-[0.2em]">Family Details</h4>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[9px] uppercase font-bold text-gray-400">Spouse Name</p>
                   <p className="text-base font-bold">{toEnglishOnly(devotee.wifeName || '-')}</p>
                </div>
                <div>
                   <p className="text-[9px] uppercase font-bold text-gray-400">Anniversary</p>
                   <p className="text-base font-bold">{devotee.marriageDate || '-'}</p>
                </div>
             </div>
             <div className="mt-6">
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-2">Children</p>
                {children.length === 0 ? <p className="text-xs font-bold text-gray-300">None</p> : (
                  <div className="space-y-1">
                    {children.map((c, i) => (
                      <p key={i} className="text-sm font-bold">• {toEnglishOnly(c.name)} ({c.dob})</p>
                    ))}
                  </div>
                )}
             </div>
          </div>
          <div className="col-span-2 border-t border-orange-50 pt-6">
            <p className="text-[9px] uppercase font-bold text-gray-400">Address</p>
            <p className="text-base italic">{devotee.address || '-'}</p>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t-2 border-orange-100 text-center italic text-xs text-orange-900/40">
           May the blessings of Lord Narasimha be always with you and your family.
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-lg border border-amber-200 no-print">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-2.5 text-orange-900 font-black text-xs uppercase tracking-widest hover:bg-orange-50 rounded-2xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {getLabel('Back', 'వెనుకకు')}
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-200 text-orange-900 font-black text-[10px] uppercase tracking-widest hover:border-orange-900 rounded-2xl transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={exportProfilePDF} 
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 rounded-2xl transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={onEdit} 
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-950 font-black text-[10px] uppercase tracking-widest hover:bg-orange-200 rounded-2xl transition-colors shadow-sm"
          >
            <Edit3 className="w-4 h-4" /> {getLabel('Edit', 'సవరించు')}
          </button>
          <button 
            onClick={onDelete} 
            className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 font-black text-[10px] uppercase tracking-widest hover:bg-red-200 rounded-2xl transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> {getLabel('Delete', 'తొలగించు')}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-amber-200 no-print">
        <div className="bg-gradient-to-r from-orange-950 to-orange-900 h-40 relative">
          <div className="absolute -bottom-14 left-10">
            <div className="w-28 h-28 bg-amber-400 rounded-3xl flex items-center justify-center border-[6px] border-white shadow-2xl text-orange-950 font-black text-4xl transform rotate-3">
              {devotee.fullName.charAt(0)}
            </div>
          </div>
        </div>
        <div className="pt-20 pb-10 px-10">
          <h2 className="text-4xl font-black text-orange-950 tracking-tight">{formatBilingual(devotee.fullName)}</h2>
          <p className="text-xl text-orange-800 font-bold opacity-70 mt-2 uppercase tracking-widest">{formatBilingual(devotee.gothram)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
        <div className="md:col-span-2 space-y-8">
          {/* Family Section */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-amber-100">
            <div className="flex items-center gap-4 mb-10 border-b-2 border-orange-50 pb-5">
              <div className="p-3 bg-orange-50 rounded-2xl"><Users className="w-6 h-6 text-orange-800" /></div>
              <h3 className="text-lg font-black text-orange-950 uppercase tracking-[0.25em]">
                {getLabel('Family Information', 'కుటుంబ వివరాలు')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-10">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-orange-50 rounded-2xl shadow-inner border border-orange-100"><Cake className="w-7 h-7 text-orange-700" /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Date of Birth</p>
                  <p className="font-black text-orange-950 text-2xl">{devotee.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="p-4 bg-pink-50 rounded-2xl shadow-inner border border-pink-100"><MangalaSutraIcon className="w-8 h-8 text-orange-950" /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Anniversary</p>
                  <p className="font-black text-orange-950 text-2xl">{devotee.marriageDate || '-'}</p>
                </div>
              </div>

              <div className="sm:col-span-2 p-8 bg-gradient-to-br from-pink-50/50 to-orange-50/50 rounded-3xl border-2 border-pink-100/50 shadow-inner">
                <p className="text-[11px] font-black text-pink-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                   <div className="w-10 h-0.5 bg-pink-300"></div> {spouseLabel} Details
                </p>
                <div className="flex flex-col sm:flex-row justify-between gap-8">
                  <div>
                    <p className="text-[10px] text-pink-900/40 font-black uppercase tracking-widest mb-2">{getLabel('Name', 'పేరు')}</p>
                    <p className="text-2xl font-black text-orange-950">{devotee.wifeName || '-'}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] text-pink-900/40 font-black uppercase tracking-widest mb-2">{getLabel('Date of Birth', 'పుట్టిన తేదీ')}</p>
                    <p className="text-2xl font-black text-orange-950">{devotee.wifeDOB || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] font-black text-blue-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                   <div className="w-10 h-0.5 bg-blue-300"></div> Children ({children.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {children.map((child, i) => (
                    <div key={i} className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 flex items-center gap-5 hover:bg-white transition-colors">
                      <div className="p-3 bg-white rounded-2xl shadow-sm"><Baby className="w-6 h-6 text-blue-600" /></div>
                      <div>
                        <p className="text-lg font-black text-orange-950 leading-tight">{child.name}</p>
                        <p className="text-[10px] font-black text-blue-700/50 uppercase tracking-widest mt-1">{child.dob}</p>
                      </div>
                    </div>
                  ))}
                  {children.length === 0 && (
                    <p className="text-sm font-black text-gray-300 italic uppercase tracking-widest py-4">No children recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Address */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-amber-100">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-orange-50 pb-5">
              <div className="p-3 bg-green-50 rounded-2xl"><MapPin className="w-6 h-6 text-green-700" /></div>
              <h3 className="text-lg font-black text-orange-950 uppercase tracking-[0.25em]">
                {getLabel('Contact & Address', 'చిరునామా')}
              </h3>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-green-50 rounded-2xl shadow-inner border border-green-100"><Phone className="w-7 h-7 text-green-700" /></div>
                <p className="font-mono font-black text-orange-950 text-3xl">{devotee.phoneNumber}</p>
              </div>
              <div className="p-8 bg-amber-50/30 rounded-[32px] border-2 border-amber-50 shadow-inner">
                <p className="text-xl font-bold text-orange-950 leading-relaxed italic">{devotee.address || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-8 bg-gradient-to-br from-orange-950 to-orange-900 rounded-[32px] text-center text-white border-b-[12px] border-amber-400 shadow-2xl">
            <p className="text-base md:text-lg font-black italic leading-relaxed text-amber-200">
              {TEMPLE_SLOGAN_TE}
            </p>
          </div>
          
          <div className="p-8 bg-white rounded-[32px] shadow-xl border border-amber-100 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-orange-800" />
             </div>
             <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1">Status</p>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Active Devotee</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-profile { display: block !important; position: absolute; left: 0; top: 0; width: 100%; z-index: 1000; height: 100vh; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};
