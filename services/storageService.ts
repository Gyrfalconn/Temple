
import { Devotee, TempleSettings } from '../types';
import { STORAGE_KEY, TEMPLE_NAME_TE, TEMPLE_SUB_NAME_TE, TEMPLE_ADDRESS_TE, TEMPLE_TAGLINE_TE } from '../constants';

const SETTINGS_KEY = 'temple_settings_data';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const getDevotees = (): Devotee[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed: any[] = JSON.parse(data);
    return parsed.map(d => ({
      ...d,
      children: d.children || [],
      callHistory: d.callHistory || []
    })) as Devotee[];
  } catch (e) {
    console.error("Failed to parse devotees:", e);
    return [];
  }
};

export const saveDevotee = (devotee: Devotee): void => {
  const existing = getDevotees();
  const updated = [...existing, devotee];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateDevotee = (updatedDevotee: Devotee): void => {
  const existing = getDevotees();
  const updated = existing.map(d => d.id === updatedDevotee.id ? updatedDevotee : d);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteDevotee = (id: string): void => {
  const existing = getDevotees();
  const updated = existing.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getTempleSettings = (): TempleSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    return {
      name: TEMPLE_NAME_TE,
      subName: TEMPLE_SUB_NAME_TE,
      address: TEMPLE_ADDRESS_TE,
      tagline: TEMPLE_TAGLINE_TE
    };
  }
  return JSON.parse(data);
};

export const saveTempleSettings = (settings: TempleSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export { generateId };
