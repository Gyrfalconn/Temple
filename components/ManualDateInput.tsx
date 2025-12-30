
import React, { useState, useEffect } from 'react';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { Language } from '../types.ts';
import { getLocalISOString } from '../constants.ts';

interface ManualDateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label: string;
  language: Language;
  allowFuture?: boolean; // New prop to toggle anti-future logic
}

export const ManualDateInput: React.FC<ManualDateInputProps> = ({ value, onChange, label, language, allowFuture = false }) => {
  const isEn = language === 'en';
  const todayStr = getLocalISOString(new Date());
  
  // Convert YYYY-MM-DD to DDMMYYYY for editing
  const toDisplayDigits = (val: string) => {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}${parts[1]}${parts[0]}`;
  };

  const [inputValue, setInputValue] = useState(toDisplayDigits(value));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const digits = toDisplayDigits(value);
    if (digits !== inputValue.replace(/\D/g, '')) {
      setInputValue(digits);
    }
  }, [value]);

  const formatDisplay = (digits: string) => {
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    
    let result = d;
    if (digits.length > 2) result += ' / ' + m;
    if (digits.length > 4) result += ' / ' + y;
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    setInputValue(raw);
    setError(null);

    if (raw.length === 8) {
      const d = raw.slice(0, 2);
      const m = raw.slice(2, 4);
      const y = raw.slice(4, 8);
      
      const day = parseInt(d);
      const month = parseInt(m);
      const year = parseInt(y);

      // Basic validity
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        setError(isEn ? "Invalid date" : "చెల్లని తేదీ");
        return;
      }

      // Check for valid days in specific months (simple check)
      const maxDays = new Date(year, month, 0).getDate();
      if (day > maxDays) {
        setError(isEn ? "Invalid day for month" : "ఈ నెలకు చెల్లని తేదీ");
        return;
      }

      const isoDate = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      
      // Anti-Future Logic: Conditional check
      if (!allowFuture && isoDate > todayStr) {
        setError(isEn ? "Future date not allowed" : "భవిష్యత్తు తేదీ అనుమతించబడదు");
        return;
      }

      onChange(isoDate);
    } else if (raw.length === 0) {
      onChange('');
    }
  };

  return (
    <div className="relative w-full">
      {label && <label className="text-[8px] font-black text-red-900/40 uppercase block mb-1 tracking-widest ml-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder={isEn ? "DD / MM / YYYY" : "తేదీ / నెల / సం॥"}
          className={`w-full h-9 px-2 border rounded-lg text-[13px] bg-orange-50/10 focus:ring-1 outline-none font-bold transition-all pr-8 ${
            error ? 'border-red-500 focus:ring-red-500 text-red-950' : 'border-orange-200 focus:ring-orange-800 text-orange-950'
          }`}
          value={formatDisplay(inputValue)}
          onChange={handleChange}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {error && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          <CalendarIcon className={`w-3.5 h-3.5 text-orange-700 opacity-30 pointer-events-none ${error ? 'hidden' : 'block'}`} />
        </div>
      </div>
      {error ? (
        <span className="text-[7px] text-red-500 font-bold mt-0.5 ml-1 uppercase block leading-none">{error}</span>
      ) : inputValue.length > 0 && inputValue.length < 8 ? (
        <span className="text-[7px] text-orange-400 font-bold mt-0.5 ml-1 uppercase block leading-none">
          {isEn ? "Finish Date" : "పూర్తి తేదీ"}
        </span>
      ) : null}
    </div>
  );
};
