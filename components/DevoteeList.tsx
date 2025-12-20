
import React, { useState, useMemo } from 'react';
import { Devotee, Language } from '../types';
import { Search, Trash2, Phone, FileSpreadsheet, Eye, Edit3, FileText, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TEMPLE_NAME_EN, GOTHRAMS } from '../constants';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGothram, setFilterGothram] = useState(GOTHRAMS[0]);

  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return devotees.filter(d => {
      const matchesSearch = d.fullName.toLowerCase().includes(term) || 
                            d.phoneNumber.includes(term) ||
                            d.gothram.toLowerCase().includes(term);
      const matchesGothram = filterGothram === GOTHRAMS[0] || d.gothram === filterGothram;
      return matchesSearch && matchesGothram;
    });
  }, [devotees, searchTerm, filterGothram]);

  const exportExcel = () => {
    const data = filteredDevotees.map(d => ({ 
      'Name': d.fullName, 
      'Phone': d.phoneNumber, 
      'Gothram': d.gothram,
      'DOB': d.dateOfBirth
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devotees");
    XLSX.writeFile(wb, "Temple_Devotees.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(TEMPLE_NAME_EN, 14, 15);
    doc.setFontSize(10);
    doc.text(`Devotee Directory - ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredDevotees.map(d => [
      d.fullName,
      d.phoneNumber,
      d.gothram,
      d.dateOfBirth
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [['Name', 'Phone', 'Gothram', 'DOB']],
      body: tableData,
    });

    doc.save("Temple_Directory.pdf");
  };

  return (
    <div className="space-y-3 max-w-5xl mx-auto">
      <div className="bg-white p-2 rounded shadow-sm border border-amber-200 flex flex-col md:flex-row gap-2 items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-950/40 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder={getLabel("Search...", "వెతకండి...")}
            className="w-full pl-8 pr-3 py-1.5 border border-orange-100 rounded text-xs outline-none bg-orange-50/10 focus:ring-1 focus:ring-orange-800"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-950/40 w-3.5 h-3.5" />
          <select 
            className="w-full pl-8 pr-3 py-1.5 border border-orange-100 rounded text-xs outline-none bg-orange-50/10 appearance-none font-bold text-orange-900"
            value={filterGothram}
            onChange={e => setFilterGothram(e.target.value)}
          >
            {GOTHRAMS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button onClick={exportExcel} className="flex-1 md:flex-none flex items-center justify-center px-3 py-1.5 bg-green-700 text-white rounded text-[8px] font-black uppercase tracking-wider shadow">
            <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
          </button>
          <button onClick={exportPDF} className="flex-1 md:flex-none flex items-center justify-center px-3 py-1.5 bg-red-700 text-white rounded text-[8px] font-black uppercase tracking-wider shadow">
            <FileText className="w-3 h-3 mr-1" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] border-collapse">
            <thead className="bg-orange-950 text-amber-100">
              <tr>
                <th className="px-3 py-3 font-black uppercase tracking-widest">{getLabel('Devotee', 'భక్తుడు')}</th>
                <th className="px-3 py-3 font-black uppercase tracking-widest">{getLabel('Contact', 'ఫోన్')}</th>
                <th className="px-3 py-3 font-black uppercase tracking-widest text-right">{getLabel('Tools', 'పనిముట్లు')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {filteredDevotees.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">No matches found.</td></tr>
              ) : (
                filteredDevotees.map(d => (
                  <tr key={d.id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="px-3 py-3">
                      <button 
                        onClick={() => onViewDetails(d.id)}
                        className="text-left group-hover:text-orange-700 transition-colors focus:outline-none"
                      >
                        <div className="font-black text-orange-950 text-sm">{formatBilingual(d.fullName)}</div>
                        <div className="text-[9px] text-orange-800/60 font-bold">{formatBilingual(d.gothram)}</div>
                      </button>
                    </td>
                    <td className="px-3 py-3 font-mono font-black text-orange-900">{d.phoneNumber}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => onViewDetails(d.id)} className="p-1.5 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="View"><Eye className="w-3.5 h-3.5"/></button>
                        <button onClick={() => onEdit(d)} className="p-1.5 text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5"/></button>
                        <button onClick={() => onDelete(d.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
