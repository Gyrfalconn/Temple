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
        rows={3}
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

  const inputStyles = "w-full h-11 px-4 border border-red-100 rounded-xl text-sm font-bold text-red-950 bg-[#fffaf5] focus:ring-1 focus:ring-red-800 outline-none transition-all font-telugu";
  const textareaStyles = "w-full px-4 py-3 border border-red-100 rounded-xl text-sm font-bold text-red-950 bg-[#fffaf5] focus:ring-1 focus:ring-red-800 outline-none transition-all font-telugu min-h-[100px]";

  const SectionTitle = ({ icon: Icon, title, teTitle }: { icon: any, title: string, teTitle: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0">
      <div className="p-1.5 bg-red-100 text-red-900 rounded-lg"><Icon className="w-4 h-4" /></div>
      <h3 className="text-xs font-black uppercase tracking-widest text-red-900 font-telugu">{getLabel(title, teTitle)}</h3>
      <div className="flex-1 h-px bg-red-50 ml-2"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-[24px] shadow-xl p-5 md:p-10 border-t-8 border-[#450a0a] max-w-5xl mx-auto mb-20">
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-red-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-2xl text-red-900"><UserPlus className="w-6 h-6" /></div>
          <div>
            <h2 className={`text-2xl font-black text-red-950 ${isTe ? 'font-telugu' : ''}`}>
              {editingDevotee ? getLabel('Update Record', 'వివరాల సవరణ') : getLabel('Register Devotee', 'భక్తుని నమోదు')}
            </h2>
            <p className="text-[10px] font-bold text-red-900/40 uppercase tracking-widest mt-0.5">Hindu Temple Database Management</p>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-red-50 rounded-xl transition-colors group">
            <X className="w-6 h-6 text-gray-300 group-hover:text-red-500" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-2xl text-[11px] font-black border border-red-200 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Personal Details */}
        <SectionTitle icon={UserCircle} title="Personal Details" teTitle="వ్యక్తిగత వివరాలు" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-red-900/30 uppercase tracking-widest block ml-1">{getLabel('Full Name', 'పూర్తి పేరు')} *</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.fullName} onChange={val => updateField('fullName', val)} />
          </div>
          <ManualDateInput label={getLabel('Date of Birth', 'పుట్టిన తేదీ') + ' *'} value={formData.dateOfBirth} language={language} onChange={d => updateField('dateOfBirth', d)} />
          <div className="space-y-1">
            <label className="text-[9px] font-black text-red-900/30 uppercase tracking-widest block ml-1">{getLabel('Gothram', 'గోత్రం')} *</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.gothram} onChange={val => updateField('gothram', val)} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-red-900/30 uppercase tracking-widest block ml-1">{getLabel('Phone Number', 'ఫోన్ నంబర్')} *</label>
            <input type="tel" className={inputStyles} value={formData.phoneNumber} onChange={e => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>
        </div>

        {/* Section 2: Spouse Details */}
        <SectionTitle icon={Users} title="Spouse Details" teTitle="భార్య/భర్త వివరాలు" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-red-900/30 uppercase tracking-widest block ml-1">{getLabel('Spouse Name', 'భార్య పేరు')}</label>
            <TransliteratedInput language={language} className={inputStyles} value={formData.wifeName} onChange={val => updateField('wifeName', val)} />
          </div>
          <ManualDateInput label={getLabel('Spouse DOB', 'భార్య పుట్టిన తేదీ')} value={formData.wifeDOB} language={language} onChange={d => updateField('wifeDOB', d)} />
          <ManualDateInput label={getLabel('Marriage Date', 'వివాహ తేదీ')} value={formData.marriageDate} language={language} onChange={d => updateField('marriageDate', d)} />
        </div>

        {/* Section 3: Family Members (Children) */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 text-red-900 rounded-lg"><Users className="w-4 h-4" /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-red-900 font-telugu">{getLabel('Family Members / Children', 'కుటుంబ సభ్యులు / పిల్లలు')}</h3>
          </div>
          <button type="button" onClick={addChild} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" /> {getLabel('Add Member', 'సభ్యుడిని చేర్చు')}
          </button>
        </div>
        
        {children.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-red-50 rounded-3xl text-center">
            <p className="text-[10px] font-bold text-red-900/20 uppercase tracking-[0.2em] italic">No family members added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 bg-red-50/30 rounded-2xl border border-red-100 items-end">
                <div className="flex-1 space-y-1 w-full">
                  <label className="text-[8px] font-black text-red-900/30 uppercase tracking-widest ml-1">{getLabel('Name', 'పేరు')}</label>
                  <TransliteratedInput 
                    language={language} 
                    className={inputStyles} 
                    value={child.name} 
                    onChange={val => updateChild(idx, 'name', val)} 
                  />
                </div>
                <div className="flex-1 w-full">
                  <ManualDateInput 
                    label={getLabel('Date of Birth', 'పుట్టిన తేదీ')} 
                    value={child.dob} 
                    language={language} 
                    onChange={val => updateChild(idx, 'dob', val)} 
                  />
                </div>
                <button type="button" onClick={() => removeChild(idx)} className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Section 4: Residence (Moved to Last) */}
        <SectionTitle icon={Home} title="Residence" teTitle="నివాసము" />
        <div className="space-y-1">
          <label className="text-[9px] font-black text-red-900/30 uppercase tracking-widest block ml-1">{getLabel('Full Address', 'చిరునామా')}</label>
          <TransliteratedInput multiline language={language} className={textareaStyles} value={formData.address} onChange={val => updateField('address', val)} placeholder={getLabel("Enter complete address...", "పూర్తి చిరునామాను నమోదు చేయండి...")} />
        </div>

        <div className="pt-10 flex gap-4">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 py-4 border-2 border-red-100 text-red-900 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 transition-all font-telugu">
              {getLabel('Cancel', 'రద్దు చేయి')}
            </button>
          )}
          <button type="submit" className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-[0.98] font-telugu">
            {editingDevotee ? getLabel('Update Record', 'సవరించు') : getLabel('Save Register Details', 'నమోదు చేయి')}
          </button>
        </div>
      </form>
    </div>
  );
};
