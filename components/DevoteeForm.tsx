
import React, { useState, useEffect } from 'react';
import { GOTHRAMS } from '../constants.ts';
import { Devotee, Language, Child } from '../types.ts';
import { Save, AlertCircle, X, UserPlus, Baby } from 'lucide-react';
import { generateId } from '../services/storageService.ts';
import { CustomDatePicker } from './CustomDatePicker.tsx';

interface DevoteeFormProps {
  onSave: (devotee: Devotee) => void;
  language: Language;
  editingDevotee?: Devotee | null;
  onCancel?: () => void;
}

export const DevoteeForm: React.FC<DevoteeFormProps> = ({ onSave, language, editingDevotee, onCancel }) => {
  const isEn = language === 'en';
  const isTe = language === 'te';
  
  const getLabel = (en: string, te: string) => {
    return isEn ? en : te;
  };

  const spouseLabel = getLabel('Wife', 'ధర్మపత్ని');

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    marriageDate: '',
    wifeName: '',
    wifeDOB: '',
    gothram: GOTHRAMS[0],
    phoneNumber: '',
    address: '',
    notes: ''
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
        address: editingDevotee.address || '',
        notes: editingDevotee.notes || ''
      });
      setChildren(editingDevotee.children || []);
    }
  }, [editingDevotee]);

  const addChild = () => setChildren(prev => [...prev, { name: '', dob: '' }]);
  const removeChild = (index: number) => setChildren(prev => prev.filter((_, i) => i !== index));
  const updateChild = (index: number, field: keyof Child, value: string) => {
    setChildren(prev => prev.map((child, i) => i === index ? { ...child, [field]: value } : child));
  };

  const validatePhone = (phone: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.dateOfBirth || !formData.phoneNumber || formData.gothram === GOTHRAMS[0]) {
      setError(getLabel('Required fields (*) are missing.', 'తప్పనిసరి వివరాలు (*) నింపబడలేదు.'));
      return;
    }

    if (!validatePhone(formData.phoneNumber)) {
      setError(getLabel('Invalid phone number. Must be 10 digits starting with 6-9.', 'చెల్లని ఫోన్ నంబర్. తప్పనిసరిగా 10 అంకెలు ఉండాలి మరియు 6-9 తో ప్రారంభం కావాలి.'));
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

  const SectionHeader = ({ title, colorClass = "orange" }: { title: string, colorClass?: string }) => (
    <div className="flex flex-col items-start gap-1.5 mb-5">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] bg-${colorClass}-50 text-${colorClass}-900 px-3 py-1 rounded-full border border-${colorClass}-100`}>
        {title}
      </h3>
      <span className={`w-12 h-0.5 bg-${colorClass}-700/40 rounded-full`}></span>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] shadow-xl p-5 md:p-8 border-t-[10px] border-orange-950 max-w-5xl w-full animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden mx-auto">
      {/* Reduced Header Area */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8 pb-5 border-b border-orange-50">
        <div className="p-3 bg-orange-100 rounded-2xl text-orange-900 shadow-inner">
          <UserPlus className="w-7 h-7" />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black text-orange-950 tracking-tight">
            {editingDevotee ? getLabel('Update Record', 'వివరాల సవరణ') : getLabel('New Enrollment', 'కొత్త భక్తుని నమోదు')}
          </h2>
          <p className="text-[10px] font-bold text-orange-800/40 mt-0.5 uppercase tracking-widest">
            {getLabel('Complete family details for blessings', 'దీవెనల కోసం పూర్తి కుటుంబ వివరాలను నింపండి')}
          </p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="absolute top-4 right-4 p-1.5 hover:bg-orange-50 rounded-full transition-colors group" aria-label="Cancel">
            <X className="w-6 h-6 text-gray-300 group-hover:text-orange-600" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-800 rounded-xl text-[11px] font-bold flex items-center gap-3 border border-red-100 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Row 1: Split Devotee & Spouse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <SectionHeader title={getLabel('Primary Devotee', 'భక్తుని వివరాలు')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{getLabel('Full Name', 'పూర్తి పేరు')} *</label>
                <input 
                  type="text" 
                  className="w-full h-11 px-4 border border-orange-200 rounded-xl text-sm font-bold text-orange-950 bg-orange-50/5 focus:ring-2 focus:ring-orange-800 outline-none transition-all shadow-sm" 
                  value={formData.fullName} 
                  onChange={e => setFormData(p => ({...p, fullName: e.target.value}))} 
                  required
                />
              </div>
              <CustomDatePicker 
                label={getLabel('Date of Birth', 'పుట్టిన తేదీ') + ' *'}
                value={formData.dateOfBirth}
                language={language}
                onChange={date => setFormData(p => ({...p, dateOfBirth: date}))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeader title={getLabel('Spouse Details', 'ధర్మపత్ని వివరాలు')} colorClass="pink" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{getLabel(`${spouseLabel} Name`, `${spouseLabel} పేరు`)}</label>
                <input 
                  type="text" 
                  className="w-full h-11 px-4 border border-orange-200 rounded-xl text-sm font-bold text-orange-950 bg-orange-50/5 focus:ring-2 focus:ring-orange-800 outline-none transition-all shadow-sm" 
                  value={formData.wifeName} 
                  onChange={e => setFormData(p => ({...p, wifeName: e.target.value}))} 
                />
              </div>
              <CustomDatePicker 
                label={getLabel(`${spouseLabel} DOB`, `${spouseLabel} పుట్టిన తేదీ`)}
                value={formData.wifeDOB}
                language={language}
                onChange={date => setFormData(p => ({...p, wifeDOB: date}))}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Marriage & Children */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-orange-50 pt-8">
          
          <div className="lg:col-span-4 space-y-4">
            <SectionHeader title={getLabel('Anniversary', 'వివాహం')} colorClass="amber" />
            <CustomDatePicker 
              label={getLabel('Marriage Date', 'వివాహ తేదీ')}
              value={formData.marriageDate}
              language={language}
              onChange={date => setFormData(p => ({...p, marriageDate: date}))}
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <SectionHeader title={getLabel('Children', 'పిల్లలు')} colorClass="blue" />
              <button 
                type="button" 
                onClick={addChild}
                className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all flex items-center gap-2 shadow-md active:scale-95"
              >
                <Baby className="w-3.5 h-3.5" /> {getLabel('Add Child', 'పిల్లలను చేర్చండి')}
              </button>
            </div>
            
            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-blue-50/20 rounded-2xl border border-blue-50 group">
                  <div className="sm:col-span-6">
                    <input 
                      type="text" 
                      placeholder="Child Name"
                      className="w-full h-10 px-4 border border-blue-100 rounded-lg text-xs font-bold text-orange-950 focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm" 
                      value={child.name} 
                      onChange={e => updateChild(index, 'name', e.target.value)} 
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <CustomDatePicker 
                      label=""
                      value={child.dob}
                      language={language}
                      onChange={date => updateChild(index, 'dob', date)}
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeChild(index)}
                      className="p-1.5 text-red-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {children.length === 0 && (
                <div className="text-center py-6 text-[9px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                  No children added
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Spiritual & Contact */}
        <div className="border-t border-orange-50 pt-8">
          <SectionHeader title={getLabel('Contact & Spiritual', 'సంప్రదింపు వివరాలు')} colorClass="amber" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{getLabel('Gothram', 'గోత్రము')} *</label>
              <select 
                className="w-full h-11 px-4 border border-orange-200 rounded-xl text-sm font-bold text-orange-950 bg-orange-50/5 focus:ring-2 focus:ring-orange-800 outline-none appearance-none cursor-pointer shadow-sm" 
                value={formData.gothram} 
                onChange={e => setFormData(p => ({...p, gothram: e.target.value}))}
                required
              >
                 {GOTHRAMS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{getLabel('Phone Number', 'ఫోన్ నంబర్')} *</label>
              <input 
                type="tel" 
                className="w-full h-11 px-4 border border-orange-200 rounded-xl text-sm font-mono font-bold text-orange-950 bg-orange-50/5 focus:ring-2 focus:ring-orange-800 outline-none shadow-sm" 
                value={formData.phoneNumber} 
                onChange={e => setFormData(p => ({...p, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)}))} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">{getLabel('Address/Area', 'నివాస ప్రాంతం')}</label>
              <input 
                type="text" 
                className="w-full h-11 px-4 border border-orange-200 rounded-xl text-sm font-bold text-orange-950 bg-orange-50/5 focus:ring-2 focus:ring-orange-800 outline-none shadow-sm" 
                value={formData.address} 
                onChange={e => setFormData(p => ({...p, address: e.target.value}))} 
              />
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="pt-6 flex justify-center md:justify-start">
          <button type="submit" className="w-full md:w-auto px-12 py-4 bg-orange-950 text-amber-400 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black hover:scale-[1.02] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group">
            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
            {editingDevotee ? getLabel('Update Record', 'నవీకరించు') : getLabel('Enroll Family', 'నమోదు చేయండి')}
          </button>
        </div>
      </form>
    </div>
  );
};
