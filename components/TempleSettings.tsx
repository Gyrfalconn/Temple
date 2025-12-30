
import React, { useState, useRef } from 'react';
import { TempleSettings as ITempleSettings, Language } from '../types.ts';
import { Camera, Save, Upload, Trash2, Building2, MapPin, Tag } from 'lucide-react';

interface TempleSettingsProps {
  settings: ITempleSettings;
  onSave: (settings: ITempleSettings) => void;
  language: Language;
}

export const TempleSettings: React.FC<TempleSettingsProps> = ({ settings, onSave, language }) => {
  const isTe = language === 'te';
  const getLabel = (en: string, te: string) => (!isTe ? en : te);
  
  const [formData, setFormData] = useState<ITempleSettings>(settings);
  const [msg, setMsg] = useState('');
  
  const logo1Ref = useRef<HTMLInputElement>(null);
  const logo2Ref = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo1' | 'logo2') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File too large (Max 1MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    setMsg(getLabel('Settings saved successfully!', 'వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి!'));
    setTimeout(() => setMsg(''), 3000);
  };

  const inputStyles = "w-full h-11 px-4 border border-orange-100 rounded-xl text-sm font-bold text-orange-950 bg-white focus:ring-2 focus:ring-orange-200 outline-none transition-all font-telugu";

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-amber-100">
        <div className="bg-[#450a0a] p-8 text-white">
          <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3 font-telugu">
            <Building2 className="w-6 h-6 text-amber-400" />
            {getLabel('Temple Branding', 'దేవాలయ బ్రాండింగ్')}
          </h2>
          <p className="text-white/60 text-xs mt-2 uppercase tracking-widest font-bold">
            {getLabel('Configure logos and display text', 'లోగోలు మరియు దేవాలయ వివరాలను ఇక్కడ మార్చండి')}
          </p>
        </div>

        <div className="p-8 space-y-10">
          {/* Logo Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-orange-900/50 uppercase tracking-widest block ml-1">
                {getLabel('Left Logo (Logo 1)', 'ఎడమ వైపు లోగో')}
              </label>
              <div className="flex items-center gap-6 p-6 bg-orange-50/30 rounded-3xl border-2 border-dashed border-orange-100">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logo1 ? (
                    <img src={formData.logo1} className="w-full h-full object-contain" />
                  ) : (
                    <Camera className="w-8 h-8 text-orange-200" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => logo1Ref.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-orange-800 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all">
                    <Upload className="w-3.5 h-3.5" /> {getLabel('Upload', 'అప్‌లోడ్')}
                  </button>
                  {formData.logo1 && (
                    <button onClick={() => setFormData(p => ({...p, logo1: ''}))} className="text-[10px] font-black text-red-600 uppercase hover:underline">
                      {getLabel('Remove', 'తొలగించు')}
                    </button>
                  )}
                </div>
                <input type="file" ref={logo1Ref} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logo1')} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-orange-900/50 uppercase tracking-widest block ml-1">
                {getLabel('Right Logo (Logo 2)', 'కుడి వైపు లోగో')}
              </label>
              <div className="flex items-center gap-6 p-6 bg-orange-50/30 rounded-3xl border-2 border-dashed border-orange-100">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logo2 ? (
                    <img src={formData.logo2} className="w-full h-full object-contain" />
                  ) : (
                    <Camera className="w-8 h-8 text-orange-200" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => logo2Ref.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-orange-800 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all">
                    <Upload className="w-3.5 h-3.5" /> {getLabel('Upload', 'అప్‌లోడ్')}
                  </button>
                  {formData.logo2 && (
                    <button onClick={() => setFormData(p => ({...p, logo2: ''}))} className="text-[10px] font-black text-red-600 uppercase hover:underline">
                      {getLabel('Remove', 'తొలగించు')}
                    </button>
                  )}
                </div>
                <input type="file" ref={logo2Ref} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'logo2')} />
              </div>
            </div>
          </div>

          {/* Text Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-orange-900/50 uppercase tracking-widest block ml-1 flex items-center gap-1.5">
                <Building2 className="w-3 h-3"/> {getLabel('Temple Name', 'దేవాలయ పేరు')}
              </label>
              <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-orange-900/50 uppercase tracking-widest block ml-1">
                {getLabel('Sub-name/Lineage', 'ఉప-శీర్షిక')}
              </label>
              <input value={formData.subName} onChange={e => setFormData(p => ({...p, subName: e.target.value}))} className={inputStyles} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-orange-900/50 uppercase tracking-widest block ml-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3"/> {getLabel('Address', 'చిరునామా')}
              </label>
              <input value={formData.address} onChange={e => setFormData(p => ({...p, address: e.target.value}))} className={inputStyles} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-orange-900/50 uppercase tracking-widest block ml-1 flex items-center gap-1.5">
                <Tag className="w-3 h-3"/> {getLabel('Tagline', 'ట్యాగ్‌లైన్')}
              </label>
              <input value={formData.tagline} onChange={e => setFormData(p => ({...p, tagline: e.target.value}))} className={inputStyles} />
            </div>
          </div>

          <div className="pt-6 flex flex-col items-center gap-4">
            <button onClick={handleSave} className="w-full md:w-auto px-12 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <Save className="w-5 h-5" /> {getLabel('Save Branding', 'వివరాలను భద్రపరుచు')}
            </button>
            {msg && <span className="text-green-600 font-bold text-sm animate-bounce">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
