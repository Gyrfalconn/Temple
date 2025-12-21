
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { MONTHS_EN, MONTHS_TE, getLocalISOString } from '../constants.ts';
import { Language } from '../types.ts';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  language: Language;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isEn = language === 'en';
  const isTe = language === 'te';
  const months = isEn ? MONTHS_EN : MONTHS_TE;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = getLocalISOString(d); 
    onChange(dateStr);
    setIsOpen(false);
  };

  const clearDate = () => {
    onChange('');
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const changeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`pad-${i}`} className="h-8"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = getLocalISOString(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    const isSelected = value === dateStr;
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDateSelect(d)}
        className={`h-8 w-full flex items-center justify-center rounded-lg font-bold text-xs transition-all
          ${isSelected ? 'bg-orange-800 text-white shadow-sm scale-105 z-10' : 'hover:bg-orange-50 text-orange-950'}
        `}
      >
        {d}
      </button>
    );
  }

  const weekDays = isEn 
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['ఆ', 'సో', 'మం', 'బు', 'గు', 'శు', 'శ'];

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-[10px] font-black text-gray-500 uppercase block mb-1 tracking-widest ml-1">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${label ? 'h-11' : 'h-10'} px-3 border border-orange-200 rounded-xl text-xs bg-orange-50/10 focus:ring-1 focus:ring-orange-800 outline-none font-bold text-orange-950 cursor-pointer flex items-center justify-between transition-all shadow-sm`}
      >
        <span className="truncate">{value || (isEn ? "Select Date" : "తేదీ ఎంచుకోండి")}</span>
        <CalendarIcon className="w-4 h-4 text-orange-700 opacity-40 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-[100] bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 w-[280px] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-orange-50 rounded-full text-orange-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              <span className="font-bold text-orange-950 text-[11px]">{months[viewDate.getMonth()]}</span>
              <select 
                value={viewDate.getFullYear()} 
                onChange={changeYear}
                className="font-bold text-orange-800 text-[11px] bg-transparent outline-none cursor-pointer"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-orange-50 rounded-full text-orange-900 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map(wd => (
              <div key={wd} className="h-6 flex items-center justify-center text-[9px] font-black text-orange-900/40 uppercase tracking-widest">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          <div className="mt-3 pt-3 border-t border-orange-50 flex justify-between">
            <button 
              type="button" 
              onClick={clearDate}
              className="px-2 py-1 text-[9px] font-black uppercase text-red-400 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-2.5 h-2.5" /> {isEn ? "Clear" : "రీసెట్"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-2 py-1 text-[9px] font-black uppercase text-gray-400 hover:text-orange-950 transition-colors"
            >
              {isEn ? "Close" : "ముగించు"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
