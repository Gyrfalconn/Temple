
import React, { useState, useEffect } from 'react';
import { GOTHRAMS } from '../constants';
import { Devotee, Language } from '../types';
import { Save, AlertCircle, X, Search, UserPlus } from 'lucide-react';

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
    if (isEn) return en;
    if (isTe) return te;
    return `${en} / ${te}`;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gothram: GOTHRAMS[0],
    address: '',
    dateOfBirth: '',
    marriageDate: '',
    notes: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDevotee) {
      setFormData({
        fullName: editingDevotee.fullName,
        phoneNumber: editingDevotee.phoneNumber,
        gothram: editingDevotee.gothram,
        address: editingDevotee.address || '',
        dateOfBirth: editingDevotee.dateOfBirth,
        marriageDate: editingDevotee.marriageDate || '',
        notes: editingDevotee.notes || ''
      });
    } else {
        setFormData(prev => ({...prev, gothram: GOTHRAMS[0]}));
    }
  }, [editingDevotee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.dateOfBirth || formData.gothram === GOTHRAMS[0]) {
      setError(getLabel('Required fields (*) are missing.', 'తప్పనిసరి వివరాలు (*) నింపబడలేదు.'));
      return;
    }

    onSave({
      id: editingDevotee ? editingDevotee.id : crypto.randomUUID(),
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      gothram: formData.gothram,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      marriageDate: formData.marriageDate || undefined,
      notes: formData.notes || undefined,
      createdAt: editingDevotee ? editingDevotee.createdAt : new Date().toISOString(),
      callHistory: editingDevotee ? editingDevotee.callHistory : []
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-orange-950 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-5 pb-2 border-b">
        <h2 className="text-base font-black text-orange-950 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-orange-700" />
          {editingDevotee ? getLabel('Update', 'సవరణ') : getLabel('Enrollment', 'భక్తుని నమోదు')}
        </h2>
        {onCancel && <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-[10px] font-black flex items-center gap-2 border border-red-200 animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Full Name', 'పేరు')} *</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/10 focus:ring-1 focus:ring-orange-800 outline-none font-bold text-orange-950" 
                value={formData.fullName} 
                onChange={e => setFormData(p => ({...p, fullName: e.target.value}))} 
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Phone Number', 'ఫోన్')} *</label>
              <input 
                type="tel" 
                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono font-black bg-orange-50/10 focus:ring-1 focus:ring-orange-800 outline-none text-orange-900" 
                value={formData.phoneNumber} 
                onChange={e => setFormData(p => ({...p, phoneNumber: e.target.value.replace(/\D/g, '')}))} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Gothram', 'గోత్రము')} *</label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-xs appearance-none bg-orange-50/10 focus:ring-1 focus:ring-orange-800 outline-none font-bold text-orange-950" 
                  value={formData.gothram} 
                  onChange={e => setFormData(p => ({...p, gothram: e.target.value}))}
                >
                   {GOTHRAMS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-300"><Search className="w-3.5 h-3.5" /></div>
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Address', 'నివాస ప్రాంతం')}</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-orange-50/10 focus:ring-1 focus:ring-orange-800 outline-none" 
                value={formData.address} 
                onChange={e => setFormData(p => ({...p, address: e.target.value}))} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Date of Birth', 'పుట్టిన తేదీ')} *</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-bold text-orange-950 bg-orange-50/10" 
                value={formData.dateOfBirth} 
                onChange={e => setFormData(p => ({...p, dateOfBirth: e.target.value}))} 
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-orange-900/40 uppercase block mb-1 tracking-widest">{getLabel('Marriage Date', 'వివాహ తేదీ')}</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-bold text-orange-950 bg-orange-50/10" 
                value={formData.marriageDate} 
                onChange={e => setFormData(p => ({...p, marriageDate: e.target.value}))} 
              />
            </div>
          </div>
        </div>
        
        <button type="submit" className="w-full py-3 bg-orange-900 text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2">
          <Save className="w-4 h-4" /> {editingDevotee ? getLabel('Update', 'నవీకరించు') : getLabel('Enroll', 'నమోదు చేయండి')}
        </button>
      </form>
    </div>
  );
};
