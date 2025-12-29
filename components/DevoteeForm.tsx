
import React, { useState, useEffect } from 'react';
import { Devotee, Language, Child } from '../types.ts';
import { X, UserPlus, Users, AlertTriangle, Plus, Trash2, Home, UserCircle } from 'lucide-react';
import { generateId } from '../services/storageService.ts';
import { ManualDateInput } from './ManualDateInput.tsx';
import { transliterateLastWord } from '../services/transliterationService.ts';

interface DevoteeFormProps {
  onSave: (devotee: Devotee) => void;
  language: Language;
  editingDevotee?: Devotee | null;
  devotees: Devotee[];
  onCancel?: () => void;
}

const TransliteratedInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  language: Language;
  multiline?: boolean;
}> = ({ value, onChange, placeholder, className, language, multiline }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (language === 'te' && e.key === ' ') {
      const converted = transliterateLastWord(internalValue);
      if (converted !== internalValue) {
        setInternalValue(converted);
        onChange(converted);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInternalValue(newVal);
    onChange(newVal);
  };

  const handleBlur = () => {
    if (language === 'te') {
      const final = transliterateLastWord(internalValue);
      setInternalValue(final);
      onChange(final);
    }
  };

  if (multiline) {
    return (
      <textarea
        className={className}
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={2}
      />
    );
  }

  return (
    <input
      type="text"
      className={className}
      value={internalValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
};

export const DevoteeForm: React.FC<DevoteeFormProps> = ({ onSave, language, editingDevotee, devotees, onCancel }) => {
  const isTe = language === 'te';
  const getLabel = (en: string, te: string) => (!isTe ? en : te);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    marriageDate: '',
    wifeName: '',
    wifeDOB: '',
    gothram: '',
    phoneNumber: '',
    address: ''
  });
  
  const [children, setChildren] = useState<Child[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDevotee) {
      setFormData({
        fullName: editingDevotee.fullName,
        dateOfBirth: editingDevotee.dateOfBirth,
        marriageDate: editingDevotee.marriageDate || '',
        wifeName: editingDevotee.wifeName || '',
        wifeDOB: editingDevotee.wifeDOB || '',
        gothram: editingDevotee.gothram,
        phoneNumber: editingDevotee.phoneNumber,
        address: editingDevotee.address || ''
      });
      setChildren(editingDevotee.children || []);
    }
  }, [editingDevotee]);

  const updateField = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (error) setError('');
  };

  const addChild = () => {
    setChildren(prev => [...prev, { name: '', dob: '' }]);
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    setChildren(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeChild = (index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber || !formData.gothram) {
      setError(getLabel('Required fields (*) are missing.', 'తప్పనిసరి వివరాలు (*) నింపబడలేదు.'));
      return;
    }

    const isDuplicate = devotees.some(d => {
      if (editingDevotee && d.id === editingDevotee.id) return false;
      return (d.phoneNumber === formData.phoneNumber && d.fullName.toLowerCase().trim() === formData.fullName.toLowerCase().trim());
    });

    if (isDuplicate) {
      setError(getLabel('Record already exists.', 'ఈ వివరాలతో భక్తుడు ఇప్పటికే నమోదు చేయబడ్డారు.'));
      return;
    }

    onSave({
      id: editingDevotee ? editingDevotee.id : generateId(),
      ...formData,
      children,
      createdAt: editingDevotee ? editingDevotee.createdAt : new Date().toISOString(),
      callHistory: editingDevotee ? editingDevotee.callHistory : []
    });
  };

  const inputStyles = "w-full h-9 px-3 border border-red-100 rounded-lg text-sm font-bold text-red-950 bg-[#fffaf5] focus:ring-1 focus:ring-red-800 outline-none transition-all font-telugu";
  const textareaStyles = "w-full px-3 py-2 border border-red-100 rounded-lg text-sm font-bold text-red-950 bg-[#fffaf5] focus:ring-1 focus:ring-red-800 outline-none transition-all font-telugu min-h-[60px]";

  const SectionTitle = ({ icon: Icon, title, teTitle }: { icon: any, title: string, teTitle: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-4 first:mt-0">
      <div className="p-1 bg-red-100 text-red-900 rounded"><Icon className="w-3 h-3" /></div>
      <h3 className="text-[10px] font-black uppercase tracking-wider text-red-900 font-telugu">{getLabel(title, teTitle)}</h3>
      <div className="flex-1 h-px bg-red-50 ml-1"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] shadow-xl p-4 md:p-6 border-t-4 border-[#450a0a] max-w-5xl mx-auto mb-10">
      <div className="flex justify-between items-start mb-4 pb-2 border-b border-red-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg text-red-900"><UserPlus className="w-5 h-5" /></div>
          <div>
            <h2 className={`text-xl font-black text-red-950 ${isTe ? 'font-telugu' : ''}`}>
              {editingDevotee ? getLabel('Update Profile', 'ప్రొఫైల్ సవరణ') : getLabel('Enroll Devotee', 'భక్తుని నమోదు')}
            </h2>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-300 hover:text-red-500" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-[10px] font-black border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Section 1: Personal Details - 3 Column Grid */}
        <SectionTitle icon={UserCircle} title="Basic Information" teTitle="ప్రాథమిక వివరాలు" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-red-900/40 uppercase tracking-widest block ml-1">{getLabel('Full Name', 'పూర్తి పేరు')} *</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.fullName} onChange={val => updateField('fullName', val)} />
          </div>
          <div className="space-y-1">
            <ManualDateInput label={getLabel('Date of Birth', 'పుట్టిన తేదీ') + ' *'} value={formData.dateOfBirth} language={language} onChange={d => updateField('dateOfBirth', d)} />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-red-900/40 uppercase tracking-widest block ml-1">{getLabel('Gothram', 'గోత్రం')} *</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.gothram} onChange={val => updateField('gothram', val)} />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-red-900/40 uppercase tracking-widest block ml-1">{getLabel('Phone Number', 'ఫోన్ నంబర్')} *</label>
            <input type="tel" className={inputStyles} value={formData.phoneNumber} onChange={e => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>
        </div>

        {/* Section 2: Spouse Details - 3 Column Grid */}
        <SectionTitle icon={Users} title="Spouse Details" teTitle="భార్య/భర్త వివరాలు" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-red-900/40 uppercase tracking-widest block ml-1">{getLabel('Spouse Name', 'భార్య పేరు')}</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.wifeName} onChange={val => updateField('wifeName', val)} />
          </div>
          <div className="space-y-1">
            <ManualDateInput label={getLabel('Spouse DOB', 'భార్య పుట్టిన తేదీ')} value={formData.wifeDOB} language={language} onChange={d => updateField('wifeDOB', d)} />
          </div>
          <div className="space-y-1">
            <ManualDateInput label={getLabel('Marriage Date', 'వివాహ తేదీ')} value={formData.marriageDate} language={language} onChange={d => updateField('marriageDate', d)} />
          </div>
        </div>

        {/* Section 3: Family Members - Horizontal and Compact */}
        <div className="flex items-center justify-between mt-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-red-100 text-red-900 rounded"><Users className="w-3 h-3" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-red-900 font-telugu">{getLabel('Family Members', 'కుటుంబ సభ్యులు')}</h3>
          </div>
          <button type="button" onClick={addChild} className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-black transition-all">
            <Plus className="w-3 h-3" /> {getLabel('Add', 'చేర్చు')}
          </button>
        </div>
        
        <div className="space-y-2">
          {children.map((child, idx) => (
            <div key={idx} className="flex items-end gap-3 p-2 bg-red-50/20 rounded-lg border border-red-50">
              <div className="flex-[2] space-y-1">
                <label className="text-[7px] font-black text-red-900/30 uppercase ml-1">{getLabel('Name', 'పేరు')}</label>
                <TransliteratedInput language={language} className={inputStyles} value={child.name} onChange={val => updateChild(idx, 'name', val)} />
              </div>
              <div className="flex-[1.5]">
                <ManualDateInput label={getLabel('DOB', 'పుట్టిన తేదీ')} value={child.dob} language={language} onChange={val => updateChild(idx, 'dob', val)} />
              </div>
              <button type="button" onClick={() => removeChild(idx)} className="p-2 text-red-400 hover:text-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {children.length === 0 && (
            <div className="py-2 text-center border border-dashed border-gray-100 rounded-lg">
               <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">Optional: No children added</p>
            </div>
          )}
        </div>

        {/* Section 4: Residence - Final and Compact */}
        <SectionTitle icon={Home} title="Residence" teTitle="నివాసము" />
        <div className="space-y-1">
          <label className="text-[8px] font-black text-red-900/40 uppercase tracking-widest block ml-1">{getLabel('Full Address', 'చిరునామా')}</label>
          <TransliteratedInput multiline language={language} className={textareaStyles} value={formData.address} onChange={val => updateField('address', val)} placeholder={getLabel("House No, Area, City...", "చిరునామా...")} />
        </div>

        <div className="pt-4 flex gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 py-3 border border-red-100 text-red-900 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all font-telugu">
              {getLabel('Cancel', 'రద్దు')}
            </button>
          )}
          <button type="submit" className="flex-[2] py-3 bg-red-600 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98] font-telugu">
            {editingDevotee ? getLabel('Update Now', 'సవరించు') : getLabel('Enroll Devotee', 'నమోదు చేయి')}
          </button>
        </div>
      </form>
    </div>
  );
};
