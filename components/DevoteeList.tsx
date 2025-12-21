
import React, { useState, useMemo } from 'react';
import { Devotee, Language } from '../types.ts';
import { Search, Trash2, FileSpreadsheet, Eye, Edit3, FileText, Filter, Calendar, MapPin, SortAsc, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TEMPLE_NAME_EN, GOTHRAMS, MONTHS_EN, MONTHS_TE } from '../constants.ts';

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

interface DevoteeListProps {
  devotees: Devotee[];
  onDelete: (id: string) => void;
  onEdit: (devotee: Devotee) => void;
  onViewDetails: (id: string) => void;
  language: Language;
}

export const DevoteeList: React.FC<DevoteeListProps> = ({ devotees, onDelete, onEdit, onViewDetails, language }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';

  const getLabel = (en: string, te: string) => isEn ? en : te;
  const months = isEn ? MONTHS_EN : MONTHS_TE;

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

  const formatChildren = (children: any[]) => {
    return children.map(c => `${toEnglishOnly(c.name)} (${c.dob})`).join(', ');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGothram, setFilterGothram] = useState(GOTHRAMS[0]);
  const [filterMonth, setFilterMonth] = useState('0');
  const [sortOrder, setSortOrder] = useState('name-asc');

  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const monthInt = parseInt(filterMonth);

    let result = devotees.filter(d => {
      const matchesSearch = (d.fullName?.toLowerCase() || '').includes(term) || 
                            (d.phoneNumber || '').includes(term) ||
                            (d.gothram?.toLowerCase() || '').includes(term);
      const matchesGothram = filterGothram === GOTHRAMS[0] || d.gothram === filterGothram;
      let matchesMonth = true;
      if (monthInt !== 0) {
        const checkMonth = (dateStr?: string) => {
          if (!dateStr) return false;
          return new Date(dateStr).getMonth() + 1 === monthInt;
        };
        matchesMonth = checkMonth(d.dateOfBirth) || checkMonth(d.marriageDate) || checkMonth(d.wifeDOB) || (d.children || []).some(c => checkMonth(c.dob));
      }
      return matchesSearch && matchesGothram && matchesMonth;
    });

    result.sort((a, b) => {
      if (sortOrder === 'name-asc') return a.fullName.localeCompare(b.fullName);
      if (sortOrder === 'name-desc') return b.fullName.localeCompare(a.fullName);
      if (sortOrder === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    });
    return result;
  }, [devotees, searchTerm, filterGothram, filterMonth, sortOrder]);

  const handlePrint = () => {
    window.print();
  };

  const exportExcel = () => {
    const data = filteredDevotees.map(d => ({ 
      'Full Name': toEnglishOnly(d.fullName),
      'Phone': d.phoneNumber, 
      'Gothram': toEnglishOnly(d.gothram),
      'DOB': d.dateOfBirth,
      'Marriage Date': d.marriageDate || '-',
      'Spouse Name': toEnglishOnly(d.wifeName || '-'),
      'Spouse DOB': d.wifeDOB || '-',
      'Children': formatChildren(d.children || []),
      'Area': d.address || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Full_Directory");
    XLSX.writeFile(wb, "Temple_Full_Directory.xlsx");
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a3'); // Using A3 Landscape for more columns
      doc.setFontSize(18);
      doc.text(TEMPLE_NAME_EN, 14, 20);
      doc.setFontSize(10);
      doc.text(`Full Directory Report - Records: ${filteredDevotees.length}`, 14, 28);

      const tableData = filteredDevotees.map((d, i) => [
        i + 1,
        toEnglishOnly(d.fullName),
        d.phoneNumber,
        toEnglishOnly(d.gothram),
        d.dateOfBirth,
        d.marriageDate || '-',
        toEnglishOnly(d.wifeName || '-'),
        d.wifeDOB || '-',
        formatChildren(d.children || []),
        d.address || '-'
      ]);

      autoTable(doc, {
        startY: 35,
        head: [['Sl', 'Name', 'Phone', 'Gothram', 'DOB', 'Marriage', 'Spouse', 'Spouse DOB', 'Children', 'Area']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [90, 32, 13], fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      doc.save(`Temple_Full_Directory_Export.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF.");
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Full Print View (English Only) */}
      <div id="printable-directory" className="hidden print:block font-sans bg-white p-6">
        <div className="text-center border-b-4 border-orange-950 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-orange-950">{TEMPLE_NAME_EN}</h1>
          <div className="flex justify-between items-end mt-6">
            <h2 className="text-lg font-bold underline uppercase">Complete Devotee Directory</h2>
            <span className="text-[10px] font-bold">Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-400 text-[9px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left">Sl</th>
              <th className="border border-gray-400 p-2 text-left">Name</th>
              <th className="border border-gray-400 p-2 text-left">Phone</th>
              <th className="border border-gray-400 p-2 text-left">Gothram</th>
              <th className="border border-gray-400 p-2 text-left">DOB</th>
              <th className="border border-gray-400 p-2 text-left">Marriage</th>
              <th className="border border-gray-400 p-2 text-left">Spouse</th>
              <th className="border border-gray-400 p-2 text-left">Children</th>
              <th className="border border-gray-400 p-2 text-left">Area</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevotees.map((d, i) => (
              <tr key={d.id}>
                <td className="border border-gray-400 p-2">{i + 1}</td>
                <td className="border border-gray-400 p-2 font-bold">{toEnglishOnly(d.fullName)}</td>
                <td className="border border-gray-400 p-2 font-mono">{d.phoneNumber}</td>
                <td className="border border-gray-400 p-2">{toEnglishOnly(d.gothram)}</td>
                <td className="border border-gray-400 p-2">{d.dateOfBirth}</td>
                <td className="border border-gray-400 p-2">{d.marriageDate || '-'}</td>
                <td className="border border-gray-400 p-2">{toEnglishOnly(d.wifeName || '-')}</td>
                <td className="border border-gray-400 p-2 text-[8px]">{formatChildren(d.children || [])}</td>
                <td className="border border-gray-400 p-2">{d.address || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-xl border border-amber-200 no-print">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-900/40 w-5 h-5" />
            <input
              type="text"
              placeholder={getLabel("Search name, phone, or gothram...", "పేరు, ఫోన్ లేదా గోత్రం ద్వారా వెతకండి...")}
              className="w-full pl-12 pr-4 py-3 border border-orange-100 rounded-2xl text-sm outline-none bg-orange-50/10 focus:border-orange-500 font-bold text-orange-950 font-telugu"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0 ml-auto">
            <button onClick={handlePrint} className="flex items-center px-4 py-3 bg-white border-2 border-orange-900 text-orange-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-900 hover:text-white transition-all shadow-md active:scale-95">
              <Printer className="w-4 h-4 mr-2" /> Print
            </button>
            <button onClick={exportPDF} title="Export all fields to PDF" className="flex items-center px-4 py-3 bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-800 transition-all shadow-md active:scale-95">
              <FileText className="w-4 h-4 mr-2" /> PDF Full
            </button>
            <button onClick={exportExcel} title="Export all fields to Excel" className="flex items-center px-4 py-3 bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-md active:scale-95">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel Full
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-3 border-t border-orange-50 mt-4">
          <div className="flex-1 min-w-[180px] relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none font-telugu" value={filterGothram} onChange={e => setFilterGothram(e.target.value)}>
              {GOTHRAMS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px] relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none font-telugu" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="0">{getLabel('Month: All', 'మాసం: అన్నీ')}</option>
              {months.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px] relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="name-asc">{getLabel('Sort: A-Z', 'క్రమము: A-Z')}</option>
              <option value="name-desc">{getLabel('Sort: Z-A', 'క్రమము: Z-A')}</option>
              <option value="newest">{getLabel('Sort: Newest', 'క్రమము: కొత్తవి')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100 no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#5a200d] text-amber-50">
              <tr>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Devotee & Family</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Contact</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100/30">
              {filteredDevotees.length === 0 ? (
                <tr><td colSpan={3} className="py-20 text-center text-gray-400 font-bold italic uppercase">No devotees match your filter.</td></tr>
              ) : (
                filteredDevotees.map(d => (
                  <tr key={d.id} className="hover:bg-orange-50/40 transition-all">
                    <td className="px-6 py-5">
                      <button onClick={() => onViewDetails(d.id)} className="text-left block w-full">
                        <div className="font-black text-orange-950 text-base font-telugu">{formatBilingual(d.fullName)}</div>
                        <div className="text-[10px] text-orange-800/60 font-black mt-2 uppercase flex gap-3">
                           <span className="bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 font-telugu">{formatBilingual(d.gothram)}</span>
                           {d.wifeName && <span className="text-orange-950 flex items-center gap-1 font-telugu"><MangalaSutraIcon className="w-4 h-4" /> {d.wifeName}</span>}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono font-black text-orange-900">{d.phoneNumber}</div>
                      <div className="text-[10px] font-black text-gray-400 mt-1 flex items-center gap-2 font-telugu"><MapPin className="w-3 h-3 opacity-40" /> {d.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onViewDetails(d.id)} className="p-3 text-blue-700 hover:bg-blue-50 rounded-2xl transition-all shadow-sm"><Eye className="w-5 h-5"/></button>
                        <button onClick={() => onEdit(d)} className="p-3 text-amber-700 hover:bg-amber-50 rounded-2xl transition-all shadow-sm"><Edit3 className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(d.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-directory { display: block !important; position: absolute; left: 0; top: 0; width: 100%; z-index: 1000; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};
