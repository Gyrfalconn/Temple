
import { Devotee } from '../types';
import { STORAGE_KEY, MOCK_DEVOTEES } from '../constants';

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

export const getDevotees = (): Devotee[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Fix: Mock data doesn't have callHistory property, so initialize it to an empty array
    const initializedMock = MOCK_DEVOTEES.map(d => ({ ...d, callHistory: [] })) as Devotee[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initializedMock));
    return initializedMock;
  }
  const parsed: any[] = JSON.parse(data);
  // Ensure callHistory exists for older data
  return parsed.map(d => ({
    ...d,
    callHistory: d.callHistory || []
  })) as Devotee[];
};

export const deleteDevotee = (id: string): void => {
  const existing = getDevotees();
  const updated = existing.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};