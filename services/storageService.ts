
import { Devotee } from '../types';
import { STORAGE_KEY, MOCK_DEVOTEES } from '../constants';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const getDevotees = (): Devotee[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data || JSON.parse(data).length === 0) {
    // If empty, seed with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DEVOTEES));
    return MOCK_DEVOTEES as unknown as Devotee[];
  }
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

export { generateId };
