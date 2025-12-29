import React, { useState, useMemo } from 'react';
import { Devotee, Language } from '../types.ts';
import { Search, Trash2, Eye, Edit3, Calendar, SortAsc, FileText, FileSpreadsheet, Users, MapPin, Filter } from 'lucide-react';
import { MONTHS_EN, MONTHS_TE, getLocalISOString } from '../constants.ts';
import { formatForMode } from '../services/transliterationService.ts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DevoteeListProps {
  devotees: Devotee[];
  onDelete: (id: string) => void;
  onEdit: (devotee: Devotee) => void;
  onViewDetails: (id: string) => void;
  language: Language;
}

export const DevoteeList: React.FC<DevoteeListProps> = ({ devotees, onDelete, onEdit, onViewDetails, language }) => {
  const isTe = language === 'te';
  const getLabel = (en: string, te: string) => (!isTe ? en : te);
  const months = !isTe ? MONTHS_EN : MONTHS_TE;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('0');
  const [filterFamily, setFilterFamily] = useState('all');
  const [filterArea, setFilterArea] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');

  const fText = (text: string) => formatForMode(text, language);

  // Extract unique areas/addresses for suggestions
  const areaSuggestions = useMemo(() => {
    const areas = new Set<string>();
    devotees.forEach(d => {
      if (d.address) {
        const area = d.address.split(',')[0].trim();
        if (area) areas.add(area);
      }
    });
    return Array.from(areas).sort();
  }, [devotees]);

  // Search suggestions for the datalist
  const searchSuggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const suggestions = new Set<string>();
    devotees.forEach(d => {
      const name = fText(d.fullName);
      const gothram = fText(d.gothram);
      if (name.toLowerCase().includes(searchTerm.toLowerCase())) suggestions.add(name);
      if (gothram.toLowerCase().includes(searchTerm.toLowerCase())) suggestions.add(gothram);
      if (d.phoneNumber.includes(searchTerm)) suggestions.add(d.phoneNumber);
    });
    return Array.from(suggestions).slice(0, 8);
  }, [devotees, searchTerm, language]);

  const filteredDevotees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const monthInt = parseInt(filterMonth);
    const areaTerm = filterArea.toLowerCase();
    
    let result = devotees.filter(d => {
      // 1. Search Term Check
      const matchesSearch = (d.fullName?.toLowerCase() || '').includes(term) || 
                            (d.phoneNumber || '').includes(term) ||
                            (d.gothram?.toLowerCase() || '').includes(term);
      
      // 2. Month Filter Check
      let matchesMonth = true;
      if (monthInt !== 0) {
        const checkMonth = (dateStr?: string) => dateStr ? parseInt(dateStr.split('-')[1]) === monthInt : false;
        matchesMonth = checkMonth(d.dateOfBirth) || checkMonth(d.marriageDate) || checkMonth(d.wifeDOB) || (d.children || []).some(c => checkMonth(c.dob));
      }

      // 3. Family Filter Check
      let matchesFamily = true;
      if (filterFamily === 'with-children') {
        matchesFamily = (d.children || []).length > 0;
      } else if (filterFamily === 'no-children') {
        matchesFamily = (d.children || []).length === 0;
      }

      // 4. Area Filter Check
      const matchesArea = !areaTerm || (d.address?.toLowerCase() || '').includes(areaTerm);

      return matchesSearch && matchesMonth && matchesFamily && matchesArea;
    });

    result.sort((a, b) => {
      const nameA = fText(a.fullName).toLowerCase();
      const nameB = fText(b.fullName).toLowerCase();
      if (sortOrder === 'name-asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
    
    return result;
  }, [devotees, searchTerm, filterMonth, filterFamily, filterArea, sortOrder, language]);

  const handleExportExcel = () => {
    const data = filteredDevotees.map(d => ({
      [getLabel('Full Name', 'పూర్తి పేరు')]: fText(d.fullName),
      [getLabel('Phone', 'ఫోన్')]: d.phoneNumber,
      [getLabel('Gothram', 'గోత్రం')]: fText(d.gothram),
      [getLabel('Date of Birth', 'పుట్టిన తేదీ')]: d.dateOfBirth,
      [getLabel('Spouse Name', 'భార్య పేరు')]: fText(d.wifeName || '-'),
      [getLabel('Spouse DOB', 'భార్య పుట్టిన తేదీ')]: d.wifeDOB || '-',
      [getLabel('Marriage Date', 'వివాహ తేదీ')]: d.marriageDate || '-',
      [getLabel('Address', 'చిరునామా')]: fText(d.address || '-'),
      [getLabel('Family Members', 'కుటుంబ సభ్యులు')]: (d.children || []).map(c => `${fText(c.name)} (${c.dob})`).join(', ')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Temple_Directory");
    XLSX.writeFile(wb, `Temple_Directory_${getLocalISOString()}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a3'); 
    doc.text(getLabel("Temple Devotee Directory", "భక్తుల జాబితా"), 14, 15);
    const rows = filteredDevotees.map(d => [
      fText(d.fullName), d.phoneNumber, fText(d.gothram), d.dateOfBirth, fText(d.wifeName || '-'), d.wifeDOB || '-', d.marriageDate || '-', fText(d.address || '-')
    ]);
    autoTable(doc, {
      startY: 20,
      head: [[
        getLabel('Name', 'పేరు'), getLabel('Phone', 'ఫోన్'), getLabel('Gothram', 'గోత్రం'), getLabel('DOB', 'పుట్టినతేదీ'), 
        getLabel('Spouse', 'భార్య'), getLabel('Spouse DOB', 'భార్య పుట్టినతేదీ'), getLabel('Marriage', 'వివాహం'), getLabel('Address', 'చిరునామా')
      ]],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [69, 10, 10] },
      styles: { fontSize: 8 }
    });
    doc.save(`Temple_Directory_${getLocalISOString()}.pdf`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-amber-200">
        {/* Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-900/40 w-5 h-5" />
            <input 
              type="text" 
              list="search-suggestions"
              placeholder={getLabel("Search name, phone, or gothram...", "పేరు, ఫోన్ లేదా గోత్రం...")} 
              className="w-full pl-12 pr-4 py-3 border border-orange-100 rounded-2xl text-sm outline-none font-telugu focus:ring-2 focus:ring-red-100 transition-all" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <datalist id="search-suggestions">
              {searchSuggestions.map((s, i) => <option key={i} value={s} />)}
            </datalist>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleExportPDF} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-sm">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button onClick={handleExportExcel} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-sm">
              <FileSpreadsheet className="w-4 h-4" /> EXCEL
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none font-telugu appearance-none cursor-pointer focus:border-red-200" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="0">{getLabel('Filter by Month: All', 'మాసం: అన్నీ')}</option>
              {months.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
            </select>
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none font-telugu appearance-none cursor-pointer focus:border-red-200" value={filterFamily} onChange={e => setFilterFamily(e.target.value)}>
              <option value="all">{getLabel('Family: All', 'కుటుంబం: అన్నీ')}</option>
              <option value="with-children">{getLabel('Has Children', 'పిల్లలు ఉన్నవారు')}</option>
              <option value="no-children">{getLabel('No Children', 'పిల్లలు లేనివారు')}</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <input 
              type="text" 
              list="area-list"
              placeholder={getLabel('Filter by Area...', 'ప్రాంతం ద్వారా...')}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none font-telugu focus:border-red-200" 
              value={filterArea} 
              onChange={e => setFilterArea(e.target.value)} 
            />
            <datalist id="area-list">
              {areaSuggestions.map((a, i) => <option key={i} value={a} />)}
            </datalist>
          </div>

          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 w-3.5 h-3.5" />
            <select className="w-full pl-9 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-[11px] font-black text-orange-950 outline-none appearance-none font-telugu cursor-pointer focus:border-red-200" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="name-asc">{getLabel('Sort: A-Z', 'క్రమము: A-Z')}</option>
              <option value="name-desc">{getLabel('Sort: Z-A', 'క్రమము: Z-A')}</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Label */}
        {(searchTerm || filterMonth !== '0' || filterFamily !== 'all' || filterArea) && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterMonth('0');
                setFilterFamily('all');
                setFilterArea('');
              }}
              className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-800 transition-colors"
            >
              {getLabel('Clear All Filters', 'అన్ని ఫిల్టర్‌లను తొలగించు')}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#450a0a] text-amber-50">
              <tr className="font-telugu">
                <th className="px-6 py-5 uppercase text-[10px] tracking-widest">{getLabel('Devotee Information', 'భక్తుని వివరాలు')}</th>
                <th className="px-6 py-5 uppercase text-[10px] tracking-widest">{getLabel('Contact', 'సంప్రదించండి')}</th>
                <th className="px-6 py-5 uppercase text-[10px] tracking-widest">{getLabel('Family Status', 'కుటుంబ స్థితి')}</th>
                <th className="px-6 py-5 text-right text-[10px] tracking-widest">{getLabel('Actions', 'చర్యలు')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100/30">
              {filteredDevotees.map(d => (
                <tr key={d.id} className="hover:bg-orange-50/40 transition-colors">
                  <td className="px-6 py-5">
                    <button onClick={() => onViewDetails(d.id)} className="text-left font-black text-orange-950 font-telugu hover:text-red-800 transition-colors block">{fText(d.fullName)}</button>
                    <div className="text-[10px] text-orange-800/60 font-black mt-1 uppercase font-telugu flex items-center gap-2">
                      <span className="bg-orange-100 px-2 py-0.5 rounded-full">{fText(d.gothram)}</span>
                      {d.address && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/> {fText(d.address.split(',')[0])}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-sm font-bold text-gray-700">{d.phoneNumber}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                      <Users className="w-3.5 h-3.5 text-orange-800/40" />
                      <span>{d.children?.length || 0} {getLabel('Children', 'పిల్లలు')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <button onClick={() => onViewDetails(d.id)} title={getLabel('View Details', 'వివరాలు చూడండి')} className="p-2.5 text-blue-700 bg-blue-50 rounded-xl transition-colors hover:bg-blue-100"><Eye className="w-5 h-5"/></button>
                    <button onClick={() => onEdit(d)} title={getLabel('Edit Record', 'సవరించు')} className="p-2.5 text-amber-700 bg-amber-50 rounded-xl transition-colors hover:bg-amber-100"><Edit3 className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(d.id)} title={getLabel('Delete Record', 'తొలగించు')} className="p-2.5 text-red-600 bg-red-50 rounded-xl transition-colors hover:bg-red-100"><Trash2 className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
              {filteredDevotees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <Filter className="w-12 h-12 opacity-20" />
                      <div className="font-bold uppercase tracking-[0.2em] italic">
                        {getLabel('No records matching your filters', 'ఎటువంటి వివరాలు దొరకలేదు')}
                      </div>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilterMonth('0');
                          setFilterFamily('all');
                          setFilterArea('');
                        }}
                        className="text-red-700 text-[10px] font-black underline underline-offset-4"
                      >
                        {getLabel('Reset All Filters', 'ఫిల్టర్‌లను రీసెట్ చేయండి')}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};